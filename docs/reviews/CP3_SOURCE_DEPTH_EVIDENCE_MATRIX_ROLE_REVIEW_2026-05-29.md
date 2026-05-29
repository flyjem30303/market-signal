# CP3 Source-Depth Evidence Matrix Role Review

Checkpoint: CP3 Model Credibility
Date: 2026-05-29
Trigger: CP3 source-depth evidence matrix recorded

Status: CP3 source-depth evidence matrix role review recorded

## CEO Decision

```text
REVISE
```

The source-depth evidence matrix is accepted as a local-only governance
artifact. It does not approve historical ingestion, remote validation, Supabase
reads, SQL execution, runtime repository work, public UI wiring, production
`scoreSource=real`, source-depth approval, or public claims.

```text
accepted as a local-only governance artifact
does not approve historical ingestion, remote validation, Supabase reads, SQL execution, runtime repository work, public UI wiring, production
source-depth approval, or public claims
```

## Evidence

```text
docs/CP3_SOURCE_DEPTH_EVIDENCE_MATRIX_2026-05-29.md
scripts/check-cp3-source-depth-evidence-matrix.mjs
docs/reviews/CP3_SOURCE_DEPTH_EVIDENCE_GATE_ROLE_REVIEW_2026-05-29.md
scripts/check-cp3-tw-stock-source-depth.mjs remains not_ready as expected
```

## Verification

```text
scripts/check-cp3-source-depth-evidence-matrix.mjs passes
scripts/check-cp3-source-depth-evidence-gate-role-review.mjs passes
scripts/check-cp3-runtime-policy-draft.mjs passes
scripts/check-cp3-ui-copy-tokens-draft.mjs passes
TypeScript noEmit passes via node node_modules/typescript/bin/tsc --noEmit
review gates pass
```

## Role Review

A / PM+Dev:

```text
The matrix is implementable because every source-depth evidence category has an
owner, required artifact, checker direction, current status, blocked runtime
action, and future display implication. The next slice should define a
local-only evidence checker plan that validates matrix completeness without
fetching or parsing market data.
```

```text
owner, required artifact, checker direction, current status, blocked runtime action, and future display implication
without fetching or parsing market data
```

B / Marketing:

```text
Marketing accepts the matrix because it blocks public quality claims while
price history depth, fundamental history depth, reproducibility, and public
claim approval remain not_ready.
```

C / Investment:

```text
Investment accepts the separation of price history depth, fundamental history
depth, preferred start date, continuous symbol coverage, missing-date handling,
corporate-action handling, inactive and delisted symbol handling, endpoint
stability, field semantics, market-calendar alignment, sample-size thresholds,
and reproducibility.
```

```text
price history depth, fundamental history depth, preferred start date, continuous symbol coverage
missing-date handling, corporate-action handling, inactive and delisted symbol handling
endpoint stability, field semantics, market-calendar alignment, sample-size thresholds, and reproducibility
```

D / Legal:

```text
Legal accepts the matrix because it keeps source-depth evidence separate from
source-rights evidence, backtest approval, source-depth production approval,
and public claim approval.
```

```text
source-rights evidence, backtest approval, source-depth production approval, and public claim approval
```

E / CEO:

```text
Proceed with a local-only CP3 source-depth evidence checker plan. The plan must
validate completeness of evidence artifacts and approval status, but it must
not fetch market data, parse market rows, run validators against Supabase, or
clear source-depth not_ready.
```

```text
must not fetch market data
```

F / Design:

```text
Design accepts the future display implications because unavailable,
internal_review, partial, and stale are useful state names, but they must remain
non-runtime until the runtime state source gate and UI wiring blockers are
closed.
```

```text
unavailable, internal_review, partial, and stale
non-runtime until the runtime state source gate and UI wiring blockers are closed
```

## Conflicts

```text
PM wants an evidence checker plan next
Marketing wants public claims blocked until claim approval advances
Investment wants every evidence category kept separate
Legal wants source-depth separated from rights, production approval, and public claims
Design wants display-state names preserved without UI wiring
CEO selects local-only source-depth evidence checker plan
```

## CEO Synthesis

```text
The matrix is accepted, but it cannot move source_depth_state out of not_ready.
The next safe slice is a local-only source-depth evidence checker plan that
defines required evidence artifact shapes, approval status rules, and failure
messages without reading remote data or market rows.
```

```text
required evidence artifact shapes, approval status rules, and failure messages
without reading remote data or market rows
```

## Non-Negotiable Guardrails

```text
role review only
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
draft CP3 source-depth evidence checker plan
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
