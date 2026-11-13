# Decisions and Risks

| Decision | Reason |
|---|---|
| Markdown + small YAML front matter | Editable, diffable, low token cost |
| MCP as delivery | Reusable interface; not the source of specialization |
| Core + packs + on-demand | Avoid loading all docs |
| Seven initial tools | Keep tool surface small |
| No fine-tuning initially | Fix content/retrieval first |
| Keyword/tag search initially | Start simple for ~90 short docs; consider pgvector near 300 docs or when search quality drops |
| Published-only retrieval | Keep drafts out of live agent |
| Hard approval gate | No implementation plan before user approval |

Risks: repeated rules (repetition scan + human review); stale sources (scheduled review); self-critic inflation (independent critic/calibration); citation laundering (semantic support review); token overflow (pack accounting); prompt injection (source trust controls); rubric gaming (user tests and guardrails); accessibility false confidence (manual keyboard/AT checks).

Open before deployment: tokenizer/model budget; host/database; session retention; named reviewer/publisher; supported browsers and assistive technologies.
