# Agent Workflow and Stage Contracts

Order: `need_check → research → audit → proposal → critique → approval_wait → implement`. Approval is a hard state boundary. A high critic score never authorizes implementation.

| Stage | Required output | Exit condition |
|---|---|---|
| need_check | Problem, user, evidence, constraints, build/modify/defer/don't-build verdict | Need supported or uncertainty explicit |
| research | Questions, sources, patterns, journey and edge cases | Evidence gaps visible |
| audit | Heuristics, WCAG criteria, responsive and system findings | Critical risks identified |
| proposal | Flows, screens, tokens, copy, states, rationale | Complete enough to critique |
| critique | Independent score, deductions, blockers | >=85, no critical defect, max 3 revisions |
| approval_wait | Proposal, score, risks and approval request | Explicit user approval |
| implement | Sequenced plan, components/files, data/state, a11y, tests | Only after approval |

Fetch each stage pack and topic doc before using its rules. A fetched citation must support the claim. Research sources need title and URL. Label assumptions. Approval applies to the current proposal version; requested changes are not approval.
