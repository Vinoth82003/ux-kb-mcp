# Migration Guide: v1 → v2

## What changed

- All responses now use the envelope `{ kbVersion, sessionId, tokens, policy, data }`. Read content from `data`.
- `start_session` defaults to `mode: "full"` for v1 clients (no `mode` param) and gains `screen`, `tokenBudget`, `idempotencyKey`.
- `get_stage_pack` gains `depth`, `maxTokens`, `page`. v1 clients (no `depth`) get the default depth with a deprecation notice; pass `depth: "rules"` for lean payloads.
- `get_doc` gains `sections`, `includeSources`, `ifNoneMatch`. `SOURCES`/`RELATED` are omitted by default.
- `get_checklist` gains `depth: "checks" | "checks+verify"` and stable item IDs (`<DOC>.c<n>`).
- `verify_citations` is deprecated; use `start_gate` + `report_check` + `gate_status`. It remains an alias for one minor cycle.
- New tools: `start_gate`, `report_check`, `gate_status`, `get_docs`, `report_false_positive`, `top_failures`, `diff_since`.

## Recommended migration

1. Pass `mode` to `start_session` (`quick` for small changes, `audit` for reviews, `full` for new features).
2. Call `start_gate` before implementing a screen; resolve every item via `report_check` with evidence.
3. Treat `gate_status.done === true` as the only "screen done" signal.
4. Fetch docs with `get_doc(sections=["MUST","CHECK"])` and `ifNoneMatch` on re-reads.
5. Use `get_docs` for batch fetches with a shared token budget.

## Deprecation notices

- `verify_citations` → `gate_status` (removal in v3).
- Implicit full-workflow default (v1 clients keep it via compat mode).
- `depth: "full"` stage packs (use `depth: "rules"`).
