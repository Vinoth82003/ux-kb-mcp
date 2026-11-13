# Feature Routing

Apply after base pack, case-insensitive. Deduplicate additions.

```yaml
- match: [pricing, plans, subscription, billing, cancellation]
  add: [SAAS-006, SAAS-007, CW-004]
- match: [dashboard, analytics, chart, report, metrics]
  add: [SAAS-001, SAAS-002, SAAS-003, CMP-009, EVAL-008]
- match: [login, signup, sign-up, auth, password, mfa, recovery]
  add: [SAAS-005, CW-005, INT-006, A11Y-003, A11Y-004]
- match: [onboarding, first-run, activation, setup]
  add: [SAAS-004, SAAS-008, CW-004, UX-002]
- match: [form, input, validation, checkout]
  add: [CMP-002, CW-003, CW-005, A11Y-005, INT-006]
- match: [table, grid, sort, filter, bulk action]
  add: [CMP-009, VIS-005, A11Y-004, RSP-001]
- match: [navigation, menu, sidebar, tabs]
  add: [CMP-006, CMP-007, RSP-006, A11Y-003]
- match: [modal, dialog, confirmation, delete]
  add: [CMP-005, CMP-001, INT-007, A11Y-003]
- match: [mobile, responsive, touch]
  add: [RSP-001, RSP-002, RSP-003, RSP-005, RSP-006]
- match: [accessibility, wcag, screen reader, keyboard]
  add: [A11Y-001, A11Y-002, A11Y-003, A11Y-004, A11Y-005, A11Y-006]
```

Routes must reference published IDs. Test positive and negative feature descriptions. Routing is suggestion, not mandatory irrelevant retrieval.
