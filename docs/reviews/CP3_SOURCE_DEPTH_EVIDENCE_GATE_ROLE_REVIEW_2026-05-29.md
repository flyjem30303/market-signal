# CP3 Source-Depth Evidence Gate Role Review

Checkpoint: CP3 Model Credibility
Date: 2026-05-29
Trigger: CP3 source-depth evidence gate draft recorded

Status: CP3 source-depth evidence gate role review recorded

## CEO Decision

```text
REVISE
```

The source-depth evidence gate draft is accepted as a local-only planning
artifact. It does not approve historical ingestion, remote validation, Supabase
reads, SQL execution, runtime repository work, public UI wiring, production
`scoreSource=real`, source-depth approval, or public claims.

```text
accepted as a local-only planning artifact
does not approve historical ingestion, remote validation, Supabase reads, SQL execution, runtime repository work, public UI wiring, production
```

## Evidence

```text
docs/reviews/CP3_SOURCE_DEPTH_EVIDENCE_GATE_DRAFT_2026-05-29.md
scripts/check-cp3-source-depth-evidence-gate-draft.mjs
docs/CP3_TW_STOCK_SOURCE_DEPTH_VALIDATION.md
scripts/check-cp3-tw-stock-source-depth.mjs
```

## Verification

```text
scripts/check-cp3-source-depth-evidence-gate-draft.mjs passes
scripts/check-cp3-tw-stock-source-depth.mjs remains not_ready as expected
scripts/check-cp3-runtime-policy-draft.mjs passes
scripts/check-cp3-ui-copy-tokens-draft.mjs passes
TypeScript noEmit passes via node node_modules/typescript/bin/tsc --noEmit
review gates pass
```

## Role Review

A / PM+Dev:

```text
The evidence gate is implementable as planning work. The next local slice
should be a source-depth evidence matrix that maps each evidence category to
owner, required artifact, checker, current status, and blocked runtime action.
```

B / Marketing:

```text
Marketing accepts that no public claim can reference real score quality until
source-depth evidence and claim approval are both no longer not_ready.
```

C / Investment:

```text
Investment accepts the evidence categories. The next matrix must keep price
history, fundamental history, missing-date handling, corporate-action handling,
inactive-symbol handling, endpoint stability, field semantics, market-calendar
alignment, sample-size thresholds, and reproducibility separate.
```

```text
price history, fundamental history, missing-date handling, corporate-action handling
```

D / Legal:

```text
Legal accepts the gate because it prevents source-depth evidence from being
confused with source-rights evidence, backtest approval, or public claim
approval. Public claims remain blocked.
```

```text
source-rights evidence, backtest approval, or public claim approval
```

E / CEO:

```text
Proceed with a local-only CP3 source-depth evidence matrix. Do not fetch market
data, do not run validators against Supabase, do not write SQL, and do not clear
source-depth not_ready.
```

F / Design:

```text
Design accepts that UI state implementation must wait. The matrix should state
which missing evidence would map to unavailable, internal_review, partial, or
stale future display states.
```

```text
unavailable, internal_review, partial, or stale future display states
```

## Conflicts

```text
PM wants evidence categories mapped to owners
Investment wants each evidence type kept separate
Marketing wants public claims blocked until claim approval also advances
Legal wants source-depth separated from rights and claims
Design wants future display implications documented without UI implementation
CEO selects source-depth evidence matrix
```

## CEO Synthesis

```text
The source-depth evidence gate is accepted, but it needs a matrix before future
work can be delegated safely. The next safe slice is a local-only evidence
matrix with owner, required artifact, checker, current status, blocked runtime
action, and future display implication for each source-depth evidence category.
```

```text
owner, required artifact, checker, current status, blocked runtime action, and future display implication
```

## Non-Negotiable Guardrails

```text
role review only
do not create JSON sample artifacts
do not create JSON market data
do not create CSV market data
do not fetch market data
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
draft CP3 source-depth evidence matrix
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
