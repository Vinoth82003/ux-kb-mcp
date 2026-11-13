# MCP Contract

Initial tool surface (seven):
| Tool | Input | Output | Side effect |
|---|---|---|---|
| `start_session` | `feature` | sessionId, kbVersion, suggested IDs | creates session |
| `get_stage_pack` | sessionId, stage | stage docs + routed docs | records fetched IDs |
| `get_doc` | sessionId, id | one published doc | records fetched ID |
| `search_kb` | query, domain? | IDs, titles, summaries | none |
| `get_checklist` | ids[] | CHECK items only | none |
| `verify_citations` | sessionId, citedIds[] | unfetched, unknown, deprecated | stores result |
| `report_gap` | topic, context | acknowledgement | upserts gap |

Call `start_session` first. Resolve one immutable release per session. Reject unknown, draft and deprecated docs. Search returns metadata; retrieve the full doc before relying on a rule. Checklist retrieval does not mean checks were performed. Citation verification proves fetch history, not semantic support.

**Phase 3 status:** all seven tools, the three resources and `start_session` are implemented in `packages/mcp` (the server factory) and `apps/stdio` (the local transport). Sessions record fetched IDs; `verify_citations` persists a compliance row; `report_gap` upserts by topic. HTTP requests must pass revocation, scope, suspension, and version-pin checks, then a per-key fixed-window rate limit and a daily quota. Usage rows are written for every tool call (stdio uses an internal `stdio-local` key).

Resources: `kb://doc/{id}`, `kb://pack/{stage}`, `kb://core`. Pipeline: auth → revocation → pin check → rate limit → release resolution → validation → core service → usage log. Return explicit errors; never silently return an empty pack.
