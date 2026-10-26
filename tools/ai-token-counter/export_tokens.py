#!/usr/bin/env python3
"""Live AI token counter: exporter.

Totals the AI tokens Griffin has spent building and publishes a few numbers
(total, asOf, ratePerSec, per-source totals) for the portfolio's live counter.
Nothing else leaves the machine: no prompts, project names or file paths.

Sources
  * Claude Code on this Mac: live, from the session logs
    (~/.claude/projects/**/*.jsonl), with older days from
    ~/.claude/stats-cache.json.
  * Fixed sources (other accounts, Codex for now): totals in
    extra_sources.json next to this script, updated by hand.

How tokens are counted ("dashboard" mode, the default)
  * Counted the way Claude Code's /stats counts: every logged usage line, and
    any input, output, cache-read or cache-write token. That keeps this Mac's
    number on the same basis as the other accounts' dashboard totals.
  * One API response is often logged as several lines (thinking, text, each
    tool call), each repeating the response's usage, so dashboard totals
    overstate unique usage by about 1.8x. The state file also keeps a
    de-duplicated count per day, keyed on (message.id, requestId), for reference.
  * Claude Code deletes logs after about 30 days, so per-day totals are saved
    in the state file and never shrink.

Usage
  export_tokens.py            # update state, print the JSON
  export_tokens.py --publish  # update state, then publish to the data branch
"""

import datetime
import glob
import json
import os
import subprocess
import sys
import time

HOME = os.path.expanduser("~")
PROJECTS = os.path.join(HOME, ".claude", "projects")
STATS_CACHE = os.path.join(HOME, ".claude", "stats-cache.json")
APP_DIR = os.path.join(HOME, "Library", "Application Support", "ai-token-counter")
STATE_PATH = os.path.join(APP_DIR, "state.json")
PUBLISH_DIR = os.path.join(APP_DIR, "publish-clone")  # standalone clone: launchd jobs can't read ~/Documents
PUBLISH_FILE = "token-stats.json"
PUBLISH_BRANCH = "token-stats"
REPO_URL = "https://github.com/griffinkrutherford/griffinrutherford-portfolio.git"

USAGE_KEYS = ("input_tokens", "output_tokens", "cache_read_input_tokens", "cache_creation_input_tokens")
STATS_KEYS = ("inputTokens", "outputTokens", "cacheReadInputTokens", "cacheCreationInputTokens")
RATE_DAYS = 3  # complete UTC days averaged for the live tick rate
EXTRA_SOURCES = os.path.join(os.path.dirname(os.path.abspath(__file__)), "extra_sources.json")


def usage_lines(path, offset=0):
    """Yield (day, key, tokens, end_offset) for assistant usage lines after offset.

    Stops at the last complete line so a log still being written is resumed
    from a clean boundary on the next run.
    """
    with open(path, "rb") as f:
        f.seek(offset)
        pos = offset
        for raw in f:
            if not raw.endswith(b"\n"):
                break
            pos += len(raw)
            if b'"usage"' not in raw:
                yield None, None, 0, pos
                continue
            try:
                d = json.loads(raw)
            except ValueError:
                yield None, None, 0, pos
                continue
            m = d.get("message") or {}
            u = m.get("usage")
            ts = d.get("timestamp")
            if d.get("type") != "assistant" or not isinstance(u, dict) or not ts:
                yield None, None, 0, pos
                continue
            tokens = sum(int(u.get(k) or 0) for k in USAGE_KEYS)
            yield ts[:10], [m.get("id"), d.get("requestId")], tokens, pos


def log_files():
    return glob.glob(os.path.join(PROJECTS, "**", "*.jsonl"), recursive=True)


def bootstrap():
    """First run: exact totals from the logs on disk, plus an estimate for older days."""
    raw, dedup = {}, {}
    files = {}
    for path in log_files():
        last, end = None, 0
        for day, key, tokens, end in usage_lines(path):
            if day is None:
                continue
            raw[day] = raw.get(day, 0) + tokens
            if key != last:
                dedup[day] = dedup.get(day, 0) + tokens
            last = key
        files[path] = {"offset": end, "lastKey": last}

    stats = json.load(open(STATS_CACHE))
    daily = {r["date"]: sum(r["tokensByModel"].values()) for r in stats.get("dailyModelTokens", [])}
    stats_total = sum(int(u.get(k) or 0) for u in stats.get("modelUsage", {}).values() for k in STATS_KEYS)

    # Days whose log total matches stats-cache are fully covered by the logs.
    covered = sorted(d for d in daily if d in raw and abs(raw[d] - daily[d]) <= 0.01 * max(1, daily[d]))
    if covered:
        start = covered[0]
        ratio = sum(dedup[d] for d in covered) / sum(raw[d] for d in covered)
        older_raw = stats_total - sum(v for d, v in daily.items() if d >= start)
    else:  # no overlap to calibrate against: count only what the logs show
        start, ratio, older_raw = min(dedup) if dedup else today(), 1.0, 0

    return {
        "version": 2,
        "coverageStart": start,
        "dedupRatio": ratio,
        "rawBefore": int(max(0, older_raw)),               # exact: stats-cache counts the same way
        "estimatedBefore": int(max(0, older_raw) * ratio),  # de-duplicated estimate, for reference
        "firstSession": (stats.get("firstSessionDate") or "")[:10],
        "days": {d: v for d, v in raw.items() if d >= start},
        "dedupDays": {d: v for d, v in dedup.items() if d >= start},
        "files": files,
    }


def update(state):
    """Add whatever the logs gained since the last run."""
    start = state["coverageStart"]
    files, days, dedup = state["files"], state["days"], state["dedupDays"]
    for path in log_files():
        entry = files.get(path, {"offset": 0, "lastKey": None})
        offset = entry["offset"]
        if os.path.getsize(path) < offset:  # rewritten: start over, dedup still holds
            offset, entry["lastKey"] = 0, None
        last, end = entry["lastKey"], offset
        for day, key, tokens, end in usage_lines(path, offset):
            if day is None:
                continue
            if day >= start:
                days[day] = days.get(day, 0) + tokens
                if key != last:
                    dedup[day] = dedup.get(day, 0) + tokens
            last = key
        files[path] = {"offset": end, "lastKey": last}
    # Forget files Claude Code has deleted; their days are already saved.
    for path in [p for p in files if not os.path.exists(p)]:
        del files[path]
    return state


def today():
    return datetime.datetime.now(datetime.timezone.utc).strftime("%Y-%m-%d")


def summary(state):
    local = state["rawBefore"] + sum(state["days"].values())
    now = datetime.datetime.now(datetime.timezone.utc)
    recent = [(now - datetime.timedelta(days=i)).strftime("%Y-%m-%d") for i in range(1, RATE_DAYS + 1)]
    rate = sum(state["days"].get(d, 0) for d in recent) / (RATE_DAYS * 86400)
    sources = [{"name": "Claude Code (this Mac)", "total": int(local), "live": True}]
    if os.path.exists(EXTRA_SOURCES):
        for entry in json.load(open(EXTRA_SOURCES)).get("sources", []):
            sources.append({"name": entry["name"], "total": int(entry["total"]), "live": False})
    return {
        "total": sum(s["total"] for s in sources),
        "asOf": now.replace(microsecond=0).isoformat().replace("+00:00", "Z"),
        "ratePerSec": round(rate, 1),
        "firstSession": state.get("firstSession"),
        "counting": "dashboard totals, incl. cached context",
        "sources": sources,
    }


def save_state(state):
    os.makedirs(APP_DIR, exist_ok=True)
    tmp = STATE_PATH + ".tmp"
    with open(tmp, "w") as f:
        json.dump(state, f)
    os.replace(tmp, STATE_PATH)


def git(*args, cwd=PUBLISH_DIR, check=True):
    return subprocess.run(["git", *args], cwd=cwd, check=check, capture_output=True, text=True)


def publish(payload):
    """Append a commit with the new numbers to the data branch (fast-forward only, never forced)."""
    if not os.path.isdir(PUBLISH_DIR):
        git("clone", "-q", "--single-branch", "--branch", PUBLISH_BRANCH, "--depth", "1", REPO_URL, PUBLISH_DIR, cwd=APP_DIR)
    git("pull", "-q", "--ff-only", "origin", PUBLISH_BRANCH)
    with open(os.path.join(PUBLISH_DIR, PUBLISH_FILE), "w") as f:
        json.dump(payload, f, indent=2)
        f.write("\n")
    git("add", PUBLISH_FILE)
    has_commit = git("rev-parse", "--verify", "HEAD", check=False).returncode == 0
    if has_commit and git("diff", "--cached", "--quiet", check=False).returncode == 0:
        return "unchanged"
    git("commit", "-q", "-m", "Update AI token stats")
    git("push", "-q", "origin", f"HEAD:refs/heads/{PUBLISH_BRANCH}")
    return "published"


def main():
    state = json.load(open(STATE_PATH)) if os.path.exists(STATE_PATH) else None
    if state and state.get("version") == 2:
        state = update(state)
    else:
        state = bootstrap()
    save_state(state)
    payload = summary(state)
    print(json.dumps(payload))
    if "--publish" in sys.argv:
        print(publish(payload), file=sys.stderr)


if __name__ == "__main__":
    t0 = time.time()
    main()
    print(f"done in {time.time() - t0:.1f}s", file=sys.stderr)
