# CP3 Source-Depth Evidence Artifact Checklist Plan

Date: 2026-05-29
Owner: E / CEO
Checkpoint: CP3 Model Credibility

Status: CP3 source-depth evidence artifact checklist plan recorded

## CEO Decision

```text
REVISE
```

This artifact checklist plan is a local-only governance artifact. It does not
approve creating the future evidence checker, creating evidence artifacts with
market data, historical ingestion, remote validation, Supabase reads, SQL
execution, runtime repository work, public UI wiring, production
`scoreSource=real`, source-depth approval, or public claims.

```text
local-only governance artifact
does not approve creating the future evidence checker, creating evidence artifacts with market data, historical ingestion, remote validation, Supabase reads, SQL
source-depth approval, or public claims
```

## Inputs

```text
docs/CP3_SOURCE_DEPTH_EVIDENCE_CHECKER_PLAN_2026-05-29.md
docs/reviews/CP3_SOURCE_DEPTH_EVIDENCE_CHECKER_PLAN_ROLE_REVIEW_2026-05-29.md
docs/CP3_SOURCE_DEPTH_EVIDENCE_MATRIX_2026-05-29.md
scripts/check-cp3-tw-stock-source-depth.mjs remains not_ready as expected
```

## Objective

```text
define documentation templates for future source-depth evidence artifacts
define review owners for each source-depth evidence category
define readiness rules before any artifact can be treated as reviewable
define non-input boundaries so raw market data cannot enter documentation
keep public data source mock
keep scoreSource mock
```

## Artifact Template Sections

Every future source-depth evidence artifact should use these sections:

```text
Evidence Category
Market And Asset Scope
Symbol Scope
Date Range Summary
Trading Date Count Summary
Field Availability Summary
Missing-Date Policy
Corporate-Action Policy
Inactive And Delisted Symbol Policy
Endpoint Stability Summary
Field Semantics Summary
Market Calendar Summary
Sample Size Summary
Reproducibility Steps
Limitations
Review Owner
Approval Status
CEO Synthesis
Non-Negotiable Guardrails
```

## Owner Checklist

```text
price history depth owner: A / PM+Dev
fundamental history depth owner: C / Investment
preferred start date owner: C / Investment
continuous symbol coverage owner: C / Investment
missing-date handling owner: A / PM+Dev
corporate-action handling owner: C / Investment
inactive and delisted symbol handling owner: C / Investment
endpoint stability owner: A / PM+Dev
field semantics owner: C / Investment plus D / Legal
market-calendar alignment owner: A / PM+Dev
sample-size thresholds owner: C / Investment
reproducibility owner: A / PM+Dev
public claim boundary owner: B / Marketing plus D / Legal
display-state boundary owner: F / Design
final synthesis owner: E / CEO
```

## Readiness Rules

```text
artifact status starts as not_ready
artifact cannot be reviewable without evidence category
artifact cannot be reviewable without market and asset scope
artifact cannot be reviewable without symbol scope
artifact cannot be reviewable without date range summary
artifact cannot be reviewable without limitations
artifact cannot be reviewable without review owner
artifact cannot be approved without CEO synthesis
artifact cannot be approved by the same role that authored it
artifact cannot be approved when it contains raw market rows
artifact cannot be approved when it cites latest-row seed as historical evidence
artifact cannot be approved when it cites sample packet validation as source-depth evidence
artifact cannot be approved when it cites controlled dry-run report as backtest evidence
artifact cannot clear source-depth not_ready by itself
artifact approval does not imply source-rights approval
artifact approval does not imply backtest approval
artifact approval does not imply public claim approval
```

## Future File Naming Plan

Future documentation artifacts may use this naming pattern only after a separate
CEO approval:

```text
docs/evidence/CP3_SOURCE_DEPTH_<CATEGORY>_EVIDENCE_YYYY-MM-DD.md
```

This slice must not create the `docs/evidence` folder and must not create any
future evidence artifact files.

```text
must not create any future evidence artifact files
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
no public UI state wiring
```

## Static Guard Expectations

```text
scripts/check-cp3-source-depth-evidence-artifact-checklist-plan.mjs must pass
scripts/check-cp3-source-depth-evidence-checker-plan-role-review.mjs must pass
scripts/check-cp3-tw-stock-source-depth.mjs must remain not_ready as expected
scripts/check-review-gates.mjs must include this artifact checklist plan
TypeScript noEmit must pass
```

## Non-Negotiable Guardrails

```text
artifact checklist plan only
do not create docs/evidence folder
do not create future evidence artifact files
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
The artifact checklist plan defines how future source-depth evidence documents
should be shaped and reviewed, but it still does not authorize evidence file
creation or data validation. The next safe slice is a role review for this
artifact checklist plan before deciding whether to create docs/evidence
templates.
```

```text
does not authorize evidence file creation or data validation
```

## Next Implementation Slice

```text
record CP3 source-depth evidence artifact checklist plan role review
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
