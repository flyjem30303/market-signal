# CP3 Source-Depth Evidence Checker Plan Role Review

Checkpoint: CP3 Model Credibility
Date: 2026-05-29
Trigger: CP3 source-depth evidence checker plan recorded

Status: CP3 source-depth evidence checker plan role review recorded

## CEO Decision

```text
REVISE
```

The source-depth evidence checker plan is accepted as a local-only governance
artifact. It does not approve creating the future evidence checker, historical
ingestion, remote validation, Supabase reads, SQL execution, runtime repository
work, public UI wiring, production `scoreSource=real`, source-depth approval,
or public claims.

```text
accepted as a local-only governance artifact
does not approve creating the future evidence checker, historical ingestion, remote validation, Supabase reads, SQL execution
source-depth approval, or public claims
```

## Evidence

```text
docs/CP3_SOURCE_DEPTH_EVIDENCE_CHECKER_PLAN_2026-05-29.md
scripts/check-cp3-source-depth-evidence-checker-plan.mjs
docs/reviews/CP3_SOURCE_DEPTH_EVIDENCE_MATRIX_ROLE_REVIEW_2026-05-29.md
scripts/check-cp3-tw-stock-source-depth.mjs remains not_ready as expected
```

## Verification

```text
scripts/check-cp3-source-depth-evidence-checker-plan.mjs passes
scripts/check-cp3-source-depth-evidence-matrix-role-review.mjs passes
scripts/check-cp3-runtime-policy-draft.mjs passes
scripts/check-cp3-ui-copy-tokens-draft.mjs passes
TypeScript noEmit passes via node node_modules/typescript/bin/tsc --noEmit
review gates pass
```

## Role Review

A / PM+Dev:

```text
The checker plan is implementable because it defines artifact shape,
approval-status rules, failure messages, and explicit non-inputs. Engineering
accepts that the next implementation slice should be a role-reviewed plan, not
the future data parser or remote validator.
```

```text
artifact shape, approval-status rules, failure messages, and explicit non-inputs
not the future data parser or remote validator
```

B / Marketing:

```text
Marketing accepts the fail-closed plan because approved source-depth evidence
still does not imply public claim approval, SEO copy claims, model quality
claims, or scoreSource real claims.
```

```text
does not imply public claim approval, SEO copy claims, model quality claims, or scoreSource real claims
```

C / Investment:

```text
Investment accepts the required evidence categories and failure messages. The
future checker must keep price history depth, fundamental history depth,
preferred start date, continuous symbol coverage, missing-date handling,
corporate-action handling, inactive and delisted symbol handling, endpoint
stability, field semantics, market-calendar alignment, sample-size thresholds,
and reproducibility separate.
```

```text
endpoint stability, field semantics, market-calendar alignment, sample-size thresholds
```

D / Legal:

```text
Legal accepts the plan because source-depth evidence remains separate from
source-rights approval, remote validation approval, backtest approval, public
claim approval, and personalized investment advice boundaries.
```

```text
source-rights approval, remote validation approval, backtest approval, public claim approval, and personalized investment advice boundaries
```

E / CEO:

```text
Proceed with a local-only CP3 source-depth evidence artifact checklist plan.
The next plan may define documentation templates and review ownership, but it
must not create JSON samples, parse market rows, fetch market data, connect to
Supabase, run SQL, or clear source-depth not_ready.
```

F / Design:

```text
Design accepts that display states remain conceptual only. unavailable,
internal_review, partial, stale, and approved must not be wired into public
components until runtime state source, copy token, and UI wiring gates are
separately approved.
```

```text
unavailable, internal_review, partial, stale, and approved
must not be wired into public components
```

## Conflicts

```text
PM wants implementation-ready checker structure
Marketing wants claim language blocked after source-depth approval
Investment wants evidence categories kept separate
Legal wants source rights, remote validation, backtest, and public claims separated
Design wants state labels preserved without UI wiring
CEO selects local-only source-depth evidence artifact checklist plan
```

## CEO Synthesis

```text
The checker plan is accepted as a fail-closed specification, but it is still not
permission to create the future evidence checker. The next safe slice is a
local-only source-depth evidence artifact checklist plan that defines document
templates, review owners, and readiness rules without market data or remote
validation.
```

```text
not permission to create the future evidence checker
document templates, review owners, and readiness rules
without market data or remote validation
```

## Non-Negotiable Guardrails

```text
role review only
do not create future evidence checker
do not create JSON sample artifacts
do not create JSON market data
do not create CSV market data
do not fetch market data
do not parse market rows
do not run source-depth validator against Supabase
do not import copy tokens into public pages
do not import copy tokens into public components
do not import policy into public pages
do not import policy into public components
do not wire policy into data fetching
do not implement runtime repository
do not read remote data
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
do not clear source-depth not_ready
CP3 source-depth production gate remains not_ready
Keep public data source mock
```

## Next Implementation Slice

```text
draft CP3 source-depth evidence artifact checklist plan
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
