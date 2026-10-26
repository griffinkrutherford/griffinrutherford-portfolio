# Live AI token counter

The ticking number under the headline on `index.html`.

## How it works

1. **`export_tokens.py`** (runs on Griffin's Mac) totals the AI tokens spent building:
   - **Claude Code on this Mac, live:** read from the session logs in `~/.claude/projects`, with days from before the logs on disk taken from `~/.claude/stats-cache.json`. Per-day totals are saved in `~/Library/Application Support/ai-token-counter/state.json`, so the count doesn't drop when Claude Code deletes logs after about 30 days.
   - **Other accounts, fixed:** the second Claude account and ChatGPT/Codex come from `extra_sources.json` and are updated by hand.
   - **Dashboard counting:** tokens are counted the way `/stats` counts them, so all sources are on the same basis: every logged usage line, with input, output, cache-read and cache-write tokens. Claude Code logs one response as several lines, so this overstates unique usage by about 1.8×. The state file also keeps a de-duplicated count per day for reference.
2. **Publishing:** with `--publish`, it appends a commit updating `token-stats.json` on the `token-stats` branch of this repo (normal pushes, never forced; the history grows on that branch only), which holds only the total, `asOf`, `ratePerSec`, `firstSession` and per-source totals. No prompts, project names or paths are published.
3. **`js/ai-token-counter.js`** fetches that file from `raw.githubusercontent.com`. It counts up at the recent average rate, and stops extrapolating 6 hours after the last update. It shows nothing if the data can't be loaded, and shows a static number when reduced motion is on.
4. **`install.sh`** installs a launchd job that publishes every hour. The log is at `~/Library/Logs/ai-token-counter.log`.

## Counted

All accounts, using dashboard totals that include cached context. Live: Claude Code on this Mac. Fixed, set in `extra_sources.json`: the second Claude account and ChatGPT/Codex. Codex will switch to live once its logs are wired in.

## Commands

```bash
python3 tools/ai-token-counter/export_tokens.py            # update and print
python3 tools/ai-token-counter/export_tokens.py --publish  # update and publish
tools/ai-token-counter/install.sh                          # schedule hourly
```
