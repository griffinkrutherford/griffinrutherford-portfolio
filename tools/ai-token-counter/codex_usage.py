"""Counts-only Codex telemetry, anchored at a manual historical baseline.

No prompt/message contents are parsed, retained or published. Cached input and
reasoning output are breakdowns of input/output, never additional tokens.
"""
import datetime
import hashlib
import json
import os
from pathlib import Path
import re
import tempfile

BASELINE = 10_500_000_000
KEYS = ("input_tokens", "cached_input_tokens", "cache_write_input_tokens",
        "output_tokens", "reasoning_output_tokens", "total_tokens")
TOKEN_EVENT = re.compile(rb'"type"\s*:\s*"token_count"')


def instant(value):
    try:
        stamp = datetime.datetime.fromisoformat(value.replace("Z", "+00:00"))
        return stamp.astimezone(datetime.timezone.utc) if stamp.tzinfo else None
    except (ValueError, AttributeError, TypeError):
        return None


def usage(value):
    if not isinstance(value, dict) or not all(k in value for k in ("input_tokens", "output_tokens", "total_tokens")):
        return None
    result = {k: value.get(k, 0) for k in KEYS}
    if any(type(v) is not int or v < 0 for v in result.values()):
        return None
    if result["total_tokens"] != result["input_tokens"] + result["output_tokens"]:
        return None
    if result["cached_input_tokens"] > result["input_tokens"] or result["cache_write_input_tokens"] > result["input_tokens"]:
        return None
    if result["reasoning_output_tokens"] > result["output_tokens"]:
        return None
    return result


def records(path, offset=0):
    """Yield only numeric telemetry and complete-line byte cursors."""
    with open(path, "rb") as stream:
        stream.seek(offset)
        while True:
            start = stream.tell()
            raw = stream.readline()
            if not raw or not raw.endswith(b"\n"):
                return
            end = stream.tell()
            event = None
            if TOKEN_EVENT.search(raw):
                try:
                    row = json.loads(raw)
                    payload = row.get("payload") or {}
                    info = payload.get("info") or {}
                    total = usage(info.get("total_token_usage"))
                    timestamp = row.get("timestamp")
                    stamp = instant(timestamp)
                    if row.get("type") == "event_msg" and payload.get("type") == "token_count" and total and stamp:
                        event = {"at": stamp.isoformat(), "usage": total,
                                 "last": usage(info.get("last_token_usage"))}
                except (ValueError, TypeError, AttributeError):
                    pass
            yield event, start, end


def session_files(root):
    return sorted(Path(root).rglob("*.jsonl")) if Path(root).exists() else []


def entry_for(path):
    stat = path.stat()
    return {"offset": 0, "inode": [stat.st_dev, stat.st_ino],
            "anchor": None, "lastAt": None}


def bootstrap(root, cutover=None, baseline=BASELINE):
    """Anchor history, leaving all post-cutover records for update()."""
    cutover = cutover or datetime.datetime.now(datetime.timezone.utc).isoformat()
    boundary = instant(cutover)
    if not boundary or baseline != BASELINE:
        raise ValueError("A valid cutover and the preserved 10.5B baseline are required")
    state = {"version": 1, "baselineTotal": baseline, "cutoverAt": boundary.isoformat(),
             "totals": {k: 0 for k in KEYS}, "files": {}, "seenEvents": [],
             "lastObservedAt": None, "newSessionAnchors": 0, "counterResets": 0}
    for path in session_files(root):
        entry = entry_for(path)
        for event, start, end in records(path):
            if event and instant(event["at"]) > boundary:
                entry["offset"] = start
                break
            entry["offset"] = end
            if event and (not entry["lastAt"] or instant(event["at"]) >= instant(entry["lastAt"])):
                entry["anchor"], entry["lastAt"] = event["usage"], event["at"]
        state["files"][str(path)] = entry
    return state


def update(state, root):
    if state.get("version") != 1 or state.get("baselineTotal") != BASELINE:
        raise ValueError("Unsupported Codex state; refusing to reset a published baseline")
    boundary = instant(state["cutoverAt"])
    if not boundary or usage(state.get("totals")) is None:
        raise ValueError("Invalid persisted Codex counts; refusing to publish a reset")
    seen = set(state["seenEvents"])
    for path in session_files(root):
        key = str(path)
        stat = path.stat()
        identity = [stat.st_dev, stat.st_ino]
        entry = state["files"].get(key) or entry_for(path)
        if entry["inode"] != identity or entry["offset"] > stat.st_size:
            entry["offset"] = 0  # Keep anchors and fingerprints when a log is replayed.
        entry["inode"] = identity
        for event, _start, end in records(path, entry["offset"]):
            entry["offset"] = end
            if not event:
                continue
            stamp = instant(event["at"])
            previous_stamp = instant(entry["lastAt"])
            if previous_stamp and stamp < previous_stamp:
                continue
            current, previous = event["usage"], entry["anchor"]
            if stamp <= boundary:
                entry["anchor"], entry["lastAt"] = current, event["at"]
                continue
            fingerprint = hashlib.sha256(json.dumps(event, sort_keys=True, separators=(",", ":")).encode()).hexdigest()
            delta = None
            if previous is None:
                # An imported/forked file may start with inherited usage. Its
                # first snapshot is a conservative anchor, never a backfill.
                state["newSessionAnchors"] += 1
            else:
                difference = {k: current[k] - previous[k] for k in KEYS}
                if any(v < 0 for v in difference.values()):
                    state["counterResets"] += 1  # Anchor an ambiguous reset without inventing usage.
                elif current["total_tokens"] > previous["total_tokens"]:
                    delta = usage(difference)
            if delta and fingerprint not in seen:
                for metric in KEYS:
                    state["totals"][metric] += delta[metric]
                seen.add(fingerprint)
            entry["anchor"], entry["lastAt"] = current, event["at"]
            if not state["lastObservedAt"] or stamp > instant(state["lastObservedAt"]):
                state["lastObservedAt"] = event["at"]
        state["files"][key] = entry
    state["seenEvents"] = sorted(seen)
    return state


def save(state, destination, create_only=False):
    destination = Path(destination)
    destination.parent.mkdir(parents=True, exist_ok=True)
    descriptor, temporary = tempfile.mkstemp(prefix=".codex-counts-", dir=str(destination.parent))
    try:
        with os.fdopen(descriptor, "w") as stream:
            json.dump(state, stream, separators=(",", ":"))
            stream.flush()
            os.fsync(stream.fileno())
        if create_only:
            os.link(temporary, destination)  # Fail instead of replacing an existing anchor.
        else:
            os.replace(temporary, destination)
    finally:
        if os.path.exists(temporary):
            os.unlink(temporary)


def source(state):
    total = usage(state.get("totals"))
    if total is None or state.get("baselineTotal") != BASELINE:
        raise ValueError("Invalid Codex source totals; baseline must not shrink")
    return {"name": "ChatGPT / Codex", "total": BASELINE + total["total_tokens"], "live": True,
            "baselineTotal": BASELINE, "observedSince": state["cutoverAt"],
            "observedTokens": total["total_tokens"], "inputTokens": total["input_tokens"],
            "outputTokens": total["output_tokens"], "cachedInputTokens": total["cached_input_tokens"],
            "cacheWriteInputTokens": total["cache_write_input_tokens"],
            "reasoningOutputTokens": total["reasoning_output_tokens"],
            "lastObservedAt": state["lastObservedAt"],
            "newSessionAnchors": state["newSessionAnchors"],
            "counterResets": state["counterResets"],
            "coverage": "Local Codex cumulative deltas only; first snapshots of new/restored sessions anchor without backfill"}


if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser()
    parser.add_argument("--initialize", action="store_true")
    parser.add_argument("--sessions", default=str(Path.home() / ".codex/sessions"))
    parser.add_argument("--state", default=str(Path.home() / "Library/Application Support/ai-token-counter/codex-state.json"))
    options = parser.parse_args()
    if not options.initialize:
        parser.error("Only explicit --initialize is supported; the exporter owns ongoing updates")
    initialized = bootstrap(options.sessions)
    save(initialized, options.state, create_only=True)
    print(json.dumps({"cutoverAt": initialized["cutoverAt"], "baselineTotal": BASELINE,
                      "anchoredFiles": len(initialized["files"]), "observedTokens": 0}))
