# CP3 Source-Depth Evidence Checker Plan

Date: 2026-05-29
Owner: E / CEO
Checkpoint: CP3 Model Credibility

Status: CP3 source-depth evidence checker plan recorded

## CEO Decision

```text
REVISE
```

This checker plan is a local-only planning artifact. It does not approve
historical ingestion, remote validation, Supabase reads, SQL execution, runtime
repository work, public UI wiring, production `scoreSource=real`,
source-depth approval, or public claims.

```text
local-only planning artifact
does not approve historical ingestion, remote validation, Supabase reads, SQL execution, runtime repository work, public UI wiring, production
source-depth approval, or public claims
```

## Inputs

```text
docs/CP3_SOURCE_DEPTH_EVIDENCE_MATRIX_2026-05-29.md
docs/reviews/CP3_SOURCE_DEPTH_EVIDENCE_MATRIX_ROLE_REVIEW_2026-05-29.md
scripts/check-cp3-source-depth-evidence-matrix.mjs
scripts/check-cp3-tw-stock-source-depth.mjs remains not_ready as expected
```

## Objective

```text
define a future local-only checker that validates source-depth evidence artifact shapes
define approval status rules before source_depth_state can leave not_ready
define failure messages for missing evidence categories
prevent accidental approval from latest-row seeds, sample packets, dry-run reports, or raw market rows
keep public data source mock
keep scoreSource mock
```

## Evidence Artifact Shape

Each future evidence artifact must document these fields without embedding raw
market rows:

```text
evidence_category
owner
market
asset_type
symbol_scope
date_range_start
date_range_end
trading_date_count_summary
field_availability_summary
missing_date_policy
corporate_action_policy
inactive_symbol_policy
endpoint_stability_summary
field_semantics_summary
market_calendar_summary
sample_size_summary
reproducibility_steps
approval_status
review_owner
review_date
limitations
```

## Approval Status Rules

```text
allowed statuses: not_ready, internal_review, partial, stale, approved
default status must be not_ready
source_depth_state must remain not_ready when any evidence category is not_ready
source_depth_state must remain not_ready when price history depth is not_ready
source_depth_state must remain not_ready when fundamental history depth is not_ready
source_depth_state must remain not_ready when reproducibility is not_ready
approved requires every required evidence category to be present
approved requires role review evidence
approved requires CEO synthesis
approved does not imply public claim approval
approved does not imply source-rights approval
approved does not imply backtest approval
```

## Required Evidence Categories

```text
price history depth
fundamental history depth
preferred start date
continuous symbol coverage
missing-date handling
corporate-action handling
inactive and delisted symbol handling
endpoint stability
field semantics
market-calendar alignment
sample-size thresholds
reproducibility
```

## Failure Message Contract

The future checker should return stable, decision-quality failure messages:

```text
missing evidence category: price history depth
missing evidence category: fundamental history depth
missing evidence category: preferred start date
missing evidence category: continuous symbol coverage
missing evidence category: missing-date handling
missing evidence category: corporate-action handling
missing evidence category: inactive and delisted symbol handling
missing evidence category: endpoint stability
missing evidence category: field semantics
missing evidence category: market-calendar alignment
missing evidence category: sample-size thresholds
missing evidence category: reproducibility
invalid approval status
source_depth_state cannot be approved while required evidence is not_ready
latest-row seed is not historical evidence
controlled dry-run report is not backtest evidence
sample packet validation is not source-depth evidence
source-depth evidence is not source-rights evidence
source-depth evidence is not public claim approval
```

## Explicit Non-Inputs

```text
no raw market rows
no JSON sample artifacts
no JSON market data
no CSV market data
no latest-row seed as source-depth evidence
no sample packet as source-depth evidence
no controlled dry-run report as source-depth evidence
no Supabase reads
no SQL execution
no remote validator execution
```

## Future Candidate Checker

Future candidate file name only:

```text
scripts/check-cp3-source-depth-evidence-artifacts.mjs
```

This future checker must not be created as a data parser in this slice. If
created later, it must only inspect local documentation artifacts unless CEO
separately approves remote validation.

## Static Guard Expectations

```text
scripts/check-cp3-source-depth-evidence-checker-plan.mjs must pass
scripts/check-cp3-source-depth-evidence-matrix-role-review.mjs must pass
scripts/check-cp3-tw-stock-source-depth.mjs must remain not_ready as expected
scripts/check-review-gates.mjs must include this checker plan
TypeScript noEmit must pass
```

## Non-Negotiable Guardrails

```text
checker plan only
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

## CEO Synthesis

```text
The checker plan converts the matrix into a future fail-closed validation
contract. It still does not clear source_depth_state. The next safe slice is a
role review for this checker plan before creating any future evidence artifact
checker.
```

## Next Implementation Slice

```text
record CP3 source-depth evidence checker plan role review
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
