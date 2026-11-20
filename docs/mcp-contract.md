# MCP Contract

Tool surface (v2):
| Tool | Input | Output | Side effect |
|---|---|---|---|
| `start_session` | `feature`, `mode?`, `screen?`, `tokenBudget?`, `idempotencyKey?` | `sessionId`, mode, routing, next steps | creates/resumes session |
| `start_gate` | `sessionId`, `screen`, `components?`, `screenType?`, `extraStates?` | gate items + counts | creates gate |
| `report_check` | `sessionId`, `gateId`, `results[]` | accepted, rejected, weak, remaining | records results |
| `gate_status` | `sessionId`, `gateId`, `view?` | done, counts, open items | none |
| `search_kb` | `query`, `domain?`, `limit?` | IDs, titles, summaries | none |
| `get_stage_pack` | `sessionId`, `stage`, `depth?`, `maxTokens?`, `page?` | stage docs + routed docs | records fetched IDs |
| `get_doc` | `sessionId`, `id`, `sections?`, `includeSources?`, `ifNoneMatch?`, `maxTokens?` | one published doc | records fetched ID |
| `get_docs` | `sessionId`, `ids[]`, `sections?`, `includeSources?`, `maxTokens?` | batch docs | records fetched IDs |
| `get_checklist` | `ids[]`, `depth?` | CHECK items (+verify) | none |
| `verify_citations` | `sessionId`, `citedIds[]` | unfetched, unknown, deprecated | stores result (deprecated alias) |
| `report_gap` | `topic`, `context`, `sessionId?` | ticket id, similar reports | upserts gap |
| `report_false_positive` | `itemId`, `reason`, `context?`, `sessionId?` | ticket, noise score | records report |
| `top_failures` | `domain?`, `limit?`, `window?` | failing items + rates | none |
| `diff_since` | `sessionId`, `sinceVersion`, `ids[]` | changed docs + checks | none |

Call `start_session` first. Resolve one immutable release per session. Reject unknown, draft and deprecated docs. Search returns metadata; retrieve the full doc before relying on a rule. Checklist retrieval does not mean checks were performed. Citation verification proves fetch history, not semantic support.

Every response uses the envelope `{ kbVersion, sessionId, tokens, policy, data }`. `policy` is advisory server workflow metadata; `data` carries content only. `policy`/`data` split implements instruction/data separation (§13).

**Phase 3 status:** all tools, the three resources and `start_session` are implemented in `packages/mcp` (the server factory) and `apps/stdio` (the local transport). Sessions record fetched IDs; `verify_citations` persists a compliance row; `report_gap` upserts by topic. HTTP requests must pass revocation, scope, suspension, and version-pin checks, then a per-key fixed-window rate limit and a daily quota. Usage rows are written for every tool call (stdio uses an internal `stdio-local` key).

Resources: `kb://doc/{id}`, `kb://pack/{stage}`, `kb://core`. Pipeline: auth → revocation → pin check → rate limit → release resolution → validation → core service → usage log. Return explicit errors; never silently return an empty pack.

Modes: `quick` (3k, gate + checklist, no stage packs), `audit` (8k, audit/critique packs), `full` (30k, all packs, approval gate flag on). Approval gate is a policy flag, on only in `full` mode.
