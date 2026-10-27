# Codex counter connection verification

## Update Log

- 2026-10-26: Verified the installed hourly reporter, main source deployment and public live data against a preserved 10.5B Codex baseline. Numeric snapshot below is an observation, not a continuously refreshed total.

Verified at **2026-10-26 22:49:51 MDT** (2026-10-27 04:49:51 UTC).

- Source implementation: `a41b5671957bca125354f920441706ad45a07603` on main.
- Frontend canonical-feed fix: `f904bfe6293f66be38880ac5aa348844b9e82a3c` on main. The live [widget script](https://griffinrutherford.com/js/ai-token-counter.js) returned HTTP200 and matched that source exactly.
- [Public data feed](https://raw.githubusercontent.com/griffinkrutherford/griffinrutherford-portfolio/refs/heads/token-stats/token-stats.json) returned HTTP200 with CORS enabled. The shorthand raw URL was still serving an older cached snapshot, which is why the widget now uses the canonical explicit branch path.
- First measured data commit: `a8512ac44d44753d6b7549d7b64bd5855d99d3e3`. The following normal hourly/startup publication: `061f4181e9cc5869a4e76d1cda734c09375a1ad1`. Both are on the pre-existing token-stats DATA branch; no task branch was published.

## Observed numeric snapshot

| Codex metric | Tokens |
|---|---:|
| Preserved manual historical baseline |10,500,000,000 |
| Measured local tokens after cutover |64,800,935 |
| Published Codex source total |10,564,800,935 |
| Input after cutover |64,611,238 |
| Output after cutover |189,697 |
| Cached input (included in input) |63,922,560 |
| Cache-write input (included in input) |0 |
| Reasoning output (included in output) |107,250 |

The cutover is **2026-10-27 04:31:31.499945 UTC** (Oct 26 22:31:31 MDT). Existing cumulative snapshots were anchored; historical logs and the paused goal aggregate were not added. No new-session or counter-reset ambiguities occurred before this observation. This covers available local Codex telemetry, not inaccessible account-wide or hosted usage.

The first connection-only publication added 61,720,981 measured Codex tokens while leaving Claude's 89,627,038,204 local total, the second account's 11 billion and the existing 63,160.9 display rate exactly unchanged. The next real telemetry update added 3,079,954 more Codex tokens. The normal reporter also resumed its original Claude update policy; it does not freeze Claude activity. No Codex throughput or extrapolation was added to the existing Claude-derived frontend rate.

## Installed schedule and validation

- Existing hourly label retained; `StartInterval=3600`, `RunAtLoad=true`. Installation/startup completed naturally with exit 0; one run observed.
- Installed exporter, helper and source configuration matched pushed main. Private cutover/cursors persisted across the installation. No prompts, message bodies, session identifiers, project names, file paths or credentials were included in public payloads.
- 25/25 tests passed: replay/rotation, both copied-fork traversal orders, restarts, complete-line cursors, stale events, reset anchors, corrupt-state refusal, input/output breakdown accounting, unchanged Claude snapshot/rate, source identity and data-branch/privacy guards. `git diff --check` passed.
- Original dirty portfolio checkout remained untouched. Code was committed/pushed from a tiny independent shared-object sparse clone on main; the existing data publisher remained on its established data branch. No large clone, model API calls, production database writes or new credentials were used.

The numeric snapshot will grow only when actual local telemetry is reported. It is not a claim that the historical manual baseline was independently reconstructed.
