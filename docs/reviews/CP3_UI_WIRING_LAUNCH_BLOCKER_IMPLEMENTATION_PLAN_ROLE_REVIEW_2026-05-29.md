# CP3 UI Wiring Launch-Blocker Implementation Plan Role Review

Checkpoint: CP3 Model Credibility
Date: 2026-05-29
Trigger: CP3 UI wiring launch-blocker implementation plan recorded

Status: CP3 UI wiring launch-blocker implementation plan role review recorded

## CEO Decision

```text
REVISE
```

The implementation plan is accepted as a local-only governance artifact. It is
not approved for public UI wiring, production score-source switching, Supabase
validation, SQL execution, or public claim changes.

```text
not approved for public UI wiring, production score-source switching, Supabase validation, SQL execution, or public claim changes
```

## Evidence

```text
docs/CP3_UI_WIRING_LAUNCH_BLOCKER_IMPLEMENTATION_PLAN_2026-05-29.md
scripts/check-cp3-ui-wiring-launch-blocker-implementation-plan.mjs
docs/reviews/CP3_UI_WIRING_LAUNCH_BLOCKER_CHECKLIST_GATE_2026-05-29.md
```

## Verification

```text
scripts/check-cp3-ui-wiring-launch-blocker-implementation-plan.mjs passes
scripts/check-cp3-runtime-policy-draft.mjs passes
scripts/check-cp3-ui-copy-tokens-draft.mjs passes
TypeScript noEmit passes via node node_modules/typescript/bin/tsc --noEmit
review gates pass
```

## Role Review

A / PM+Dev:

```text
The implementation order is practical. The next engineering artifact should be
a non-runtime gate matrix that maps each blocker to owner, evidence, checker,
and exit condition before any public component work starts.
```

B / Marketing:

```text
Marketing needs the public claim release gate before page copy changes. The
current plan correctly prevents score language from moving ahead of evidence.
```

C / Investment:

```text
The source-depth evidence gate is the critical blocker. Runtime display should
remain blocked until missing-date handling, adjusted price assumptions, and
coverage thresholds are reviewed.
```

D / Legal:

```text
The legal disclosure gate must include no personalized investment advice,
market-specific delay wording, and model limitation wording before public UI
wiring.
```

E / CEO:

```text
Accept the plan as a governance artifact. Continue with a blocker-to-owner gate
matrix so work can proceed without confusing planning readiness with launch
readiness.
```

```text
planning readiness with launch readiness
```

F / Design:

```text
Design can prepare responsive placement criteria, but visual implementation
should wait until the blocker matrix assigns approved copy and disclosure
requirements.
```

## Conflicts

```text
PM wants implementation clarity soon
Investment and Legal require evidence and disclosure gates first
Design wants placement criteria before components
CEO keeps runtime wiring blocked
```

## CEO Synthesis

```text
The plan is useful but still too high-level for execution. The next safe slice
is a local-only CP3 UI wiring blocker-to-owner gate matrix with explicit owners,
evidence, checker, exit condition, and blocked runtime action for each blocker.
```

## Non-Negotiable Guardrails

```text
role review only
do not import copy tokens into public pages
do not import copy tokens into public components
do not import policy into public pages
do not import policy into public components
do not wire policy into data fetching
do not run validator
do not connect to Supabase
do not run SQL
do not write Supabase
do not write staging rows
do not write daily_prices
do not create seed SQL
do not store raw market rows
do not commit CSV / JSON market data files
do not set scoreSource=real
do not make public backtest claims
CP3 source-depth production gate remains not_ready
Keep public data source mock
```

## Next Implementation Slice

```text
draft CP3 UI wiring blocker-to-owner gate matrix
do not import copy tokens into public pages
do not import copy tokens into public components
do not import policy into public pages
do not import policy into public components
do not run validator
do not connect to Supabase
do not run SQL
do not write Supabase
do not create seed SQL
do not commit raw market data
keep public data source mock
```
