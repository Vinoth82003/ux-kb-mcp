# Repository Map and Naming

Topic folders: `ux/`, `vis/`, `cmp/`, `int/`, `rsp/`, `a11y/`, `cw/`, `saas/`, `ds/`, `eval/`. Packs in `content/packs/`; routing in `content/routing/`; scenarios in `evals/features/`; templates in `templates/`.

| Prefix | Domain | Range |
|---|---|---|
| UX | Fundamentals | 001–005 |
| VIS | Visual design | 001–010 |
| CMP | Components | 001–010 |
| INT | Interaction | 001–007 |
| RSP | Responsive | 001–006 |
| A11Y | Accessibility | 001–008 |
| CW | UX writing | 001–005 |
| SAAS | SaaS | 001–008 |
| DS | Design systems | 001–006 |
| EVAL | Evaluation | 001–008 |

IDs are immutable. File name `ID-kebab-slug.md`; rules `ID.M1`, `.S1`, `.A1`; tags lowercase kebab-case; stage names snake_case; release semver; document revision integer. PATCH = wording/typo; MINOR = additive doc/rules; MAJOR = behavior-changing rule removal/change.
