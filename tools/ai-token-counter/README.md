# Live AI token counter

The number under the headline on `index.html`, published hourly from this Mac.

## Update Log

- 2026-10-26: Switched the widget to the canonical raw `refs/heads/token-stats` URL after the shorthand URL continued serving an older cached fixed-source snapshot; accounting and display rate are unchanged.
- 2026-10-26: Connected local Codex usage through a preserved 10.5 billion baseline and an explicit numeric-cursor cutover. Added fork/replay/restart protection, private state and a single-writer lock. Claude totals and its existing display-rate calculation are unchanged.

## Sources and accounting

- **Claude Code on this Mac:** the existing dashboard-counting exporter reads `~/.claude/projects` and older `~/.claude/stats-cache.json` data. It retains its original per-day totals and counting semantics. Claude logs can repeat response usage across several lines, so this existing dashboard metric is not a count of unique model responses. The separate de-duplicated figures remain reference data.
- **Claude second account:** the existing fixed 11 billion total in `extra_sources.json`.
- **ChatGPT / Codex:** the historical **10,500,000,000** baseline remains unchanged. Only measured local Codex cumulative deltas after the cutover are added. No historical session total or goal aggregate is added to that baseline.

The connection cutover on this Mac is **2026-10-27 04:31:31.499945 UTC** (2026-10-26 22:31:31 MDT). The private `codex-state.json` stores this boundary and the existing log cursors/anchors. Reinstalling the reporter preserves that state; it never selects a new boundary silently.

Codex's canonical metric is `total_tokens = input_tokens + output_tokens`. `cached_input_tokens` and `cache_write_input_tokens` describe input; `reasoning_output_tokens` describes output. They are reported separately and **not added again**. The local telemetry was checked against this equation before connecting. [Official Codex telemetry documentation](https://learn.chatgpt.com/docs/config-file/config-advanced#turn-and-tool-activity) describes the per-turn token categories; [OpenAI usage documentation](https://developers.openai.com/api/docs/guides/agents-api/observability#understand-token-usage) explains the input/cache and output/reasoning relationship. Local events, rather than an assumed account-wide API total, are the counter's evidence.

This is **local telemetry coverage**, not an assertion that all ChatGPT or hosted-agent usage is accessible. A new/restored file's first snapshot becomes an anchor without credit because it can contain inherited history. Subsequent verified deltas count. Replays and copied fork events cannot be credited twice; ambiguous counter resets anchor without adding a guessed amount. Missing/deleted logs never reduce already observed usage. First-snapshot/reset counts and coverage are included in the public source metadata.

## Data and privacy

`export_tokens.py --publish` appends a normal fast-forward commit updating only `token-stats.json` on the established **`token-stats` data branch**. Code changes go to `main`; the data branch is not a feature/task branch. The payload includes totals, timestamps, per-source numeric breakdowns and coverage. No prompts, message bodies, project names, session IDs, local file paths or credentials are published.

Private files live in `~/Library/Application Support/ai-token-counter/`:

- `state.json`: unchanged Claude state.
- `codex-state.json`: the preserved Codex baseline, cutover, numeric cumulative anchors, complete-line byte cursors and credited-event fingerprints.
- `reporter.lock`: prevents overlapping hourly/manual writers.
- `publish-clone/`: the existing isolated data-branch publisher.

Only count-bearing `event_msg` / `token_count` telemetry is decoded. Other message contents are discarded without parsing or retaining them. Cached/reasoning components never increase the total a second time. State saves are atomic; a restart or publish retry resumes from the persisted cursors.

## Frontend and refresh

`js/ai-token-counter.js` fetches the established raw GitHub data URL when the page loads. Its existing ticking display uses **only Claude's prior three-day average rate**, capped at six hours of extrapolation. Codex contributes measured published snapshots only: no Codex throughput or extrapolated Codex tokens are invented. Reduced motion remains static. The payload's `rateSource` records that distinction.

The installed launchd job publishes hourly. No OpenAI model calls, evaluation batches, production database writes or new API keys are needed.

## Install and verify

```bash
# Meaningful numeric fixtures only; no real sessions or publication in tests.
python3 -m unittest discover -s tools/ai-token-counter -p 'test_*.py' -v

# First connection only. Fails rather than overwriting an existing cutover.
python3 tools/ai-token-counter/codex_usage.py --initialize

# Preview measured Codex growth against the existing Claude snapshot.
python3 tools/ai-token-counter/export_tokens.py --codex-only

# Publish the same snapshot (connection verification, Claude state unchanged).
python3 tools/ai-token-counter/export_tokens.py --codex-only --publish

# Install/reinstall the existing hourly job. Preserves both private state files.
tools/ai-token-counter/install.sh

# Normal hourly/manual update: existing Claude behavior plus measured Codex deltas.
python3 tools/ai-token-counter/export_tokens.py --publish
```

Run heavy checks through the machine's three-slot limiter when collaborating with other sessions. Installation copies the exporter, Codex helper and fixed-source configuration into Application Support because launchd cannot read `~/Documents`. It stops the old scheduled job before replacement and starts the same hourly label again. Logs remain at `~/Library/Logs/ai-token-counter.log`. Never delete/reset `codex-state.json` to recover an error: that would discard the published cutover/offset evidence. Fix the error while preserving state.
