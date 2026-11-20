# Screen done = gate passed
Before calling any screen done:
1. start_session(mode="quick", screen="<name>")
2. start_gate(...components, screenType)
3. Implement. For each item: report_check(pass|fail|na + evidence).
   - pass needs evidence (test, file:line, screenshot). No bare "checked".
   - na needs a reason. Blockers cannot be waived.
4. Call gate_status. Done only when done=true.
5. If context is lost: call gate_status(view="open") and continue.
Core items: loading, empty, error, keyboard, did-the-click-register.
