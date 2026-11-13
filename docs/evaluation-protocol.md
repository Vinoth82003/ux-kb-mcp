# Baseline vs UX-KB Evaluation Protocol

Question: does retrieval improve proposals over a strong generic senior-designer prompt?

Baseline has generic instructions and no KB. Treatment uses same instructions plus core, packs and on-demand docs. Hold model/version, temperature, tools, task inputs and time budget constant. Randomize order; run each of ten scenarios in both conditions, preferably three replicates. Blind critic where practical.

Measures: 100-point rubric; critical defects; citation quality; accessibility omissions; state coverage; anti-slop violations; user/task fit; token use and latency.

Pilot decision threshold: treatment mean +5 points with no critical regression and improvement in at least one objective measure. This is an internal threshold, not a universal statistical rule. Report sample size, variance, model, date, per-scenario scores and limitations. If inconclusive, do not claim superiority.
