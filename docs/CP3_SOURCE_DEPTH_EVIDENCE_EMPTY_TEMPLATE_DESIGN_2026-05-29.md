# CP3 Source-Depth Evidence Empty Template Design

Date: 2026-05-29
Owner: E / CEO
Checkpoint: CP3 Model Credibility

Status: CP3 source-depth evidence empty template design recorded

## CEO Decision

```text
REVISE
```

This empty template design is a local-only governance artifact. It does not
approve creating `docs/evidence`, creating future evidence artifact files,
creating the future evidence checker, creating JSON or CSV market data,
historical ingestion, remote validation, Supabase reads, SQL execution, runtime
repository work, public UI wiring, production `scoreSource=real`,
source-depth approval, or public claims.

```text
local-only governance artifact
does not approve creating `docs/evidence`, creating future evidence artifact files, creating the future evidence checker
source-depth approval, or public claims
```

## Inputs

```text
docs/CP3_SOURCE_DEPTH_EVIDENCE_ARTIFACT_CHECKLIST_PLAN_2026-05-29.md
docs/reviews/CP3_SOURCE_DEPTH_EVIDENCE_ARTIFACT_CHECKLIST_PLAN_ROLE_REVIEW_2026-05-29.md
scripts/check-cp3-source-depth-evidence-artifact-checklist-plan.mjs
scripts/check-cp3-tw-stock-source-depth.mjs remains not_ready as expected
```

## Objective

```text
design a future blank Markdown template for source-depth evidence artifacts
define placeholder rules without creating template files
define static checker requirements without creating the future checker
preserve public-claim boundary
preserve source-rights boundary
preserve display-state boundary
keep public data source mock
keep scoreSource mock
```

## Future Template Path Design

Future candidate path only:

```text
docs/evidence/CP3_SOURCE_DEPTH_<CATEGORY>_EVIDENCE_TEMPLATE.md
```

This slice must not create this file, must not create `docs/evidence`, and must
not create any future evidence artifact files.

```text
must not create this file
must not create `docs/evidence`
must not create any future evidence artifact files
```

## Future Template Sections

The future blank Markdown template should include these section headings:

```text
# CP3 Source-Depth Evidence: <CATEGORY>
Status: not_ready
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
Public-Claim Boundary
Source-Rights Boundary
Display-State Boundary
Limitations
Review Owner
Approval Status
CEO Synthesis
Non-Negotiable Guardrails
```

## Placeholder Rules

```text
placeholder values must use TODO only
placeholder status must remain not_ready
placeholder category must use <CATEGORY>
placeholder market must not imply Taiwan-only approval
placeholder asset type must not imply stock-only approval
placeholder date range must not include fabricated dates
placeholder trading date count must not include fabricated counts
placeholder field availability must not include fabricated field coverage
placeholder public-claim boundary must say no public claims approved
placeholder source-rights boundary must say no source-rights approval granted
placeholder display-state boundary must say non-runtime state labels only
```

## Static Checker Requirements

The future checker design should require:

```text
template status is not_ready
template contains every required heading
template contains Public-Claim Boundary
template contains Source-Rights Boundary
template contains Display-State Boundary
template rejects raw market rows
template rejects CSV market data
template rejects JSON market data
template rejects Supabase reads
template rejects SQL execution
template rejects scoreSource=real
template rejects approved status
template rejects public claim approval language
template rejects source-rights approval language
template rejects backtest approval language
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
scripts/check-cp3-source-depth-evidence-empty-template-design.mjs must pass
scripts/check-cp3-source-depth-evidence-artifact-checklist-plan-role-review.mjs must pass
scripts/check-cp3-tw-stock-source-depth.mjs must remain not_ready as expected
scripts/check-review-gates.mjs must include this empty template design
TypeScript noEmit must pass
```

## Non-Negotiable Guardrails

```text
empty template design only
do not create docs/evidence folder
do not create future evidence template file
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
The empty template design defines a future blank template and checker
expectations, but it still does not authorize creating docs/evidence, template
files, evidence files, or evidence checkers. The next safe slice is a role
review for this empty template design.
```

```text
does not authorize creating docs/evidence, template files, evidence files, or evidence checkers
```

## Next Implementation Slice

```text
record CP3 source-depth evidence empty template design role review
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
