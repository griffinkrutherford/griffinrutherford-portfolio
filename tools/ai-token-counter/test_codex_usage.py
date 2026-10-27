import contextlib
import copy
import io
import json
from pathlib import Path
import tempfile
import unittest
from unittest import mock

import codex_usage as codex
import export_tokens as exporter

CUTOVER = "2026-10-27T04:31:31+00:00"


def counts(i=100, o=20, cached=70, reasoning=10, writes=0):
    return {"input_tokens": i, "cached_input_tokens": cached,
            "cache_write_input_tokens": writes, "output_tokens": o,
            "reasoning_output_tokens": reasoning, "total_tokens": i + o}


def event(second, total, last=None):
    return {"timestamp": "2026-10-27T04:31:%02dZ" % second,
            "type": "event_msg", "payload": {"type": "token_count", "info": {
                "total_token_usage": total, "last_token_usage": last or total}}}


def append(path, row, complete=True):
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("ab") as stream:
        stream.write(json.dumps(row).encode() + (b"\n" if complete else b""))


class CodexUsageTests(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.addCleanup(self.tmp.cleanup)
        self.root = Path(self.tmp.name) / "sessions"
        self.root.mkdir()
        self.file = self.root / "existing.jsonl"
        append(self.file, event(30, counts()))
        self.state = codex.bootstrap(self.root, CUTOVER)

    def test_bootstrap_preserves_manual_baseline_without_history(self):
        self.assertEqual(codex.source(self.state)["total"], 10_500_000_000)
        self.assertEqual(self.state["totals"]["total_tokens"], 0)
        self.assertEqual(self.state["files"][str(self.file)]["anchor"], counts())

    def test_bootstrap_ignores_stale_pre_cutover_replay(self):
        append(self.file, event(29, counts(10, 2, 5, 1)))
        state = codex.bootstrap(self.root, CUTOVER)
        append(self.file, event(32, counts(150, 30, 90, 15)))
        codex.update(state, self.root)
        self.assertEqual(state["totals"]["total_tokens"], 60)

    def test_counts_input_output_once_and_keeps_breakdowns(self):
        append(self.file, event(32, counts(180, 50, 120, 25, 30)))
        codex.update(self.state, self.root)
        result = codex.source(self.state)
        self.assertEqual(result["observedTokens"], 110)
        self.assertEqual(result["inputTokens"], 80)
        self.assertEqual(result["outputTokens"], 30)
        self.assertEqual(result["cachedInputTokens"], 50)
        self.assertEqual(result["cacheWriteInputTokens"], 30)
        self.assertEqual(result["reasoningOutputTokens"], 15)
        self.assertEqual(result["total"], codex.BASELINE + 110)

    def test_restart_and_repeated_snapshot_cannot_increment_twice(self):
        append(self.file, event(32, counts(150, 30, 90, 15)))
        codex.update(self.state, self.root)
        saved = json.loads(json.dumps(self.state))
        append(self.file, event(33, counts(150, 30, 90, 15)))
        codex.update(saved, self.root)
        codex.update(saved, self.root)
        self.assertEqual(saved["totals"]["total_tokens"], 60)

    def test_partial_tail_waits_for_newline(self):
        append(self.file, event(32, counts(150, 30, 90, 15)), complete=False)
        before = self.state["files"][str(self.file)]["offset"]
        codex.update(self.state, self.root)
        self.assertEqual(self.state["files"][str(self.file)]["offset"], before)
        with self.file.open("ab") as stream:
            stream.write(b"\n")
        codex.update(self.state, self.root)
        self.assertEqual(self.state["totals"]["total_tokens"], 60)

    def test_rewritten_log_and_replayed_records_do_not_recount(self):
        a = event(32, counts(150, 30, 90, 15))
        append(self.file, a)
        codex.update(self.state, self.root)
        self.file.unlink()
        append(self.file, event(30, counts()))
        append(self.file, a)
        append(self.file, event(34, counts(160, 35, 95, 17)))
        codex.update(self.state, self.root)
        self.assertEqual(self.state["totals"]["total_tokens"], 75)

    def test_copied_fork_replay_counts_each_event_once_in_both_orders(self):
        for parent_first in [True, False]:
            with self.subTest(parent_first=parent_first), tempfile.TemporaryDirectory() as temp:
                root = Path(temp)
                parent = root / ("a.jsonl" if parent_first else "z.jsonl")
                fork = root / ("z.jsonl" if parent_first else "a.jsonl")
                append(parent, event(30, counts()))
                state = codex.bootstrap(root, CUTOVER)
                a = event(32, counts(150, 30, 90, 15), counts(50, 10, 20, 5))
                b = event(33, counts(170, 40, 100, 20), counts(20, 10, 10, 5))
                for row in [a, b]:
                    append(parent, row)
                    append(fork, row)
                codex.update(state, root)
                self.assertEqual(state["totals"]["total_tokens"], 90)
                codex.update(state, root)
                self.assertEqual(state["totals"]["total_tokens"], 90)

    def test_new_or_restored_session_anchors_first_inherited_snapshot(self):
        new = self.root / "new.jsonl"
        append(new, event(32, counts(100_000, 10_000, 80_000, 5_000)))
        codex.update(self.state, self.root)
        self.assertEqual(self.state["totals"]["total_tokens"], 0)
        append(new, event(33, counts(100_020, 10_010, 80_010, 5_005)))
        codex.update(self.state, self.root)
        self.assertEqual(self.state["totals"]["total_tokens"], 30)
        self.assertEqual(self.state["newSessionAnchors"], 1)

    def test_new_file_historical_prefix_is_anchored_before_new_delta(self):
        new = self.root / "imported.jsonl"
        append(new, event(29, counts(500, 50, 300, 20)))
        append(new, event(32, counts(520, 60, 310, 25)))
        codex.update(self.state, self.root)
        self.assertEqual(self.state["totals"]["total_tokens"], 30)

    def test_counter_reset_is_never_negative_or_a_backfill(self):
        append(self.file, event(32, counts(10, 2, 5, 1)))
        codex.update(self.state, self.root)
        self.assertEqual(self.state["totals"]["total_tokens"], 0)
        append(self.file, event(33, counts(30, 12, 15, 6)))
        codex.update(self.state, self.root)
        self.assertEqual(self.state["totals"]["total_tokens"], 30)
        self.assertEqual(self.state["counterResets"], 1)

    def test_stale_out_of_order_snapshot_does_not_move_anchor_back(self):
        append(self.file, event(33, counts(150, 30, 90, 15)))
        append(self.file, event(32, counts(10, 2, 5, 1)))
        append(self.file, event(34, counts(160, 35, 95, 17)))
        codex.update(self.state, self.root)
        self.assertEqual(self.state["totals"]["total_tokens"], 75)
        self.assertEqual(self.state["counterResets"], 0)

    def test_equal_timestamp_with_new_counter_is_not_lost(self):
        append(self.file, event(32, counts(150, 30, 90, 15)))
        append(self.file, event(32, counts(160, 35, 95, 17)))
        codex.update(self.state, self.root)
        self.assertEqual(self.state["totals"]["total_tokens"], 75)

    def test_deleted_logs_do_not_shrink_persisted_counts(self):
        append(self.file, event(32, counts(150, 30, 90, 15)))
        codex.update(self.state, self.root)
        self.file.unlink()
        codex.update(self.state, self.root)
        self.assertEqual(self.state["totals"]["total_tokens"], 60)

    def test_invalid_or_nontelemetry_content_never_becomes_public(self):
        secret = "PRIVATE_PROMPT_SENTINEL_AND_PROJECT_NAME"
        append(self.file, {"type": "response_item", "payload": {"text": secret}})
        invalid = counts()
        invalid["input_tokens"] = -10
        append(self.file, event(32, invalid))
        codex.update(self.state, self.root)
        self.assertEqual(self.state["totals"]["total_tokens"], 0)
        public = json.dumps(codex.source(self.state))
        self.assertNotIn(secret, json.dumps(self.state))
        self.assertNotIn(str(self.root), public)
        self.assertNotIn("files", public)

    def test_metric_validation_rejects_bool_or_double_counted_total(self):
        for field, value in [("input_tokens", True), ("total_tokens", 999), ("reasoning_output_tokens", 99)]:
            sample = counts()
            sample[field] = value
            self.assertIsNone(codex.usage(sample))

    def test_initial_save_cannot_replace_existing_anchor(self):
        destination = Path(self.tmp.name) / "codex-state.json"
        codex.save(self.state, destination, create_only=True)
        before = destination.read_bytes()
        with self.assertRaises(FileExistsError):
            codex.save({}, destination, create_only=True)
        self.assertEqual(destination.read_bytes(), before)

    def test_bad_state_cannot_reset_baseline(self):
        for changes in [{"version": 9}, {"baselineTotal": 0}]:
            state = copy.deepcopy(self.state)
            state.update(changes)
            with self.assertRaises(ValueError):
                codex.update(state, self.root)

    def test_corrupt_persisted_counts_cannot_publish_below_baseline(self):
        self.state["totals"]["input_tokens"] = -1
        with self.assertRaises(ValueError):
            codex.update(self.state, self.root)
        with self.assertRaises(ValueError):
            codex.source(self.state)

    def test_bootstrap_leaves_already_appended_postcutover_record_for_update(self):
        append(self.file, event(32, counts(150, 30, 90, 15)))
        state = codex.bootstrap(self.root, CUTOVER)
        self.assertEqual(state["totals"]["total_tokens"], 0)
        codex.update(state, self.root)
        self.assertEqual(state["totals"]["total_tokens"], 60)

    def test_summary_preserves_claude_second_account_and_existing_rate(self):
        extra = Path(self.tmp.name) / "extra.json"
        extra.write_text(json.dumps({"sources": [
            {"name": "Claude (second account)", "total": 11_000_000_000},
            {"name": "ChatGPT / Codex", "total": codex.BASELINE, "mode": "codex-local-since-cutover"}]}))
        claude = {"rawBefore": 1234, "days": {"2026-10-25": 100}, "firstSession": "2026-07-25"}
        with mock.patch.object(exporter, "EXTRA_SOURCES", str(extra)):
            before = exporter.summary(claude)
            append(self.file, event(32, counts(150, 30, 90, 15)))
            codex.update(self.state, self.root)
            after = exporter.summary(claude, codex.source(self.state))
        self.assertEqual(before["sources"][:2], after["sources"][:2])
        self.assertEqual(before["ratePerSec"], after["ratePerSec"])
        self.assertEqual(after["total"] - before["total"], 60)
        self.assertEqual(after["sources"][2]["baselineTotal"], codex.BASELINE)

    def test_duplicate_codex_identity_is_rejected_before_state_changes(self):
        extra = Path(self.tmp.name) / "extra.json"
        extra.write_text(json.dumps({"sources": [
            {"name": "ChatGPT / Codex", "total": codex.BASELINE, "mode": "codex-local-since-cutover"},
            {"name": "ChatGPT / Codex", "total": codex.BASELINE}]}))
        with mock.patch.object(exporter, "EXTRA_SOURCES", str(extra)):
            with self.assertRaises(ValueError):
                exporter.update_codex()

    def test_public_payload_rejects_private_state_or_session_fields(self):
        payload = {"total": codex.BASELINE, "sources": [{"name": "ChatGPT / Codex", "total": codex.BASELINE, "live": True}]}
        exporter.validate_public_payload(payload)
        for bad in [dict(payload, files={"private": "cursor"}),
                    {"total": codex.BASELINE, "sources": [dict(payload["sources"][0], sessionPath="private")]}]:
            with self.assertRaises(ValueError):
                exporter.validate_public_payload(bad)

    def test_publisher_refuses_wrong_branch_before_writing_or_pushing(self):
        from types import SimpleNamespace
        destination = Path(self.tmp.name) / "publisher"
        destination.mkdir()
        payload = {"total": 1, "sources": [{"name": "fixture", "total": 1, "live": False}]}
        with mock.patch.object(exporter, "PUBLISH_DIR", str(destination)), mock.patch.object(exporter, "git", return_value=SimpleNamespace(stdout="main\n")) as git:
            with self.assertRaises(ValueError):
                exporter.publish(payload)
        self.assertFalse((destination / "token-stats.json").exists())
        self.assertFalse(any(call.args[0] in ["pull", "push", "commit"] for call in git.call_args_list))

    def test_public_payload_total_cannot_disagree_with_sources(self):
        with self.assertRaises(ValueError):
            exporter.validate_public_payload({"total": 99, "sources": [{"name": "fixture", "total": 1, "live": False}]})

    def test_codex_only_publisher_does_not_touch_claude_state(self):
        app = Path(self.tmp.name) / "app"
        app.mkdir()
        claude_path, codex_path = app / "state.json", app / "codex-state.json"
        claude_path.write_text(json.dumps({"version": 2, "rawBefore": 1234, "days": {}, "firstSession": "2026-07-25"}))
        before = claude_path.read_bytes()
        codex.save(self.state, codex_path)
        append(self.file, event(32, counts(150, 30, 90, 15)))
        extra = app / "extra.json"
        extra.write_text(json.dumps({"sources": [{"name": "ChatGPT / Codex", "total": codex.BASELINE, "mode": "codex-local-since-cutover"}]}))
        with mock.patch.multiple(exporter, APP_DIR=str(app), STATE_PATH=str(claude_path), CODEX_STATE_PATH=str(codex_path), CODEX_SESSIONS=str(self.root), LOCK_PATH=str(app / "lock"), EXTRA_SOURCES=str(extra)), mock.patch("sys.argv", ["export_tokens.py", "--codex-only", "--publish"]), mock.patch.object(exporter, "publish", return_value="published") as publish, contextlib.redirect_stdout(io.StringIO()), contextlib.redirect_stderr(io.StringIO()):
            exporter.main()
        self.assertEqual(before, claude_path.read_bytes())
        self.assertEqual(publish.call_args[0][0]["sources"][1]["observedTokens"], 60)
        self.assertEqual(publish.call_args[0][0]["sources"][0]["total"], 1234)


if __name__ == "__main__":
    unittest.main()
