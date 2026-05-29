# CP3 Source-Depth Evidence Artifact Approval Gate Plan

Checkpoint: CP3 Model Credibility
Date: 2026-05-29
Owner: E / CEO
Status: local-only approval gate plan recorded

## CEO Decision

```text
REVISE
```

This local-only approval gate plan defines the conditions required before any
future real source-depth evidence artifact may be created from the blank
template. It does not approve creating real evidence artifact files, filling
template values, creating the future evidence checker, creating JSON sample
artifacts, creating JSON or CSV market data, historical ingestion, remote
validation, Supabase reads, SQL execution, runtime repository work, public UI
wiring, production `scoreSource=real`, source-depth approval, or public claims.

```text
local-only approval gate plan
before any future real source-depth evidence artifact may be created
does not approve creating real evidence artifact files, filling template values, creating the future evidence checker
source-depth approval, or public claims
```

## Evidence

```text
docs/CP3_SOURCE_DEPTH_EVIDENCE_TEMPLATE_USAGE_GUIDE_2026-05-29.md
docs/reviews/CP3_SOURCE_DEPTH_EVIDENCE_TEMPLATE_USAGE_GUIDE_ROLE_REVIEW_2026-05-29.md
docs/evidence/CP3_SOURCE_DEPTH_CATEGORY_EVIDENCE_TEMPLATE.md
scripts/check-cp3-tw-stock-source-depth.mjs remains not_ready as expected
```

## Gate Purpose

The gate prevents a blank template copy from being mistaken for approved
evidence. A future artifact may only be created after CEO confirms that the
category, source-rights posture, review owners, and non-runtime boundary are
ready.

```text
prevents a blank template copy from being mistaken for approved evidence
future artifact may only be created after CEO confirms
category
source-rights posture
review owners
non-runtime boundary
```

## Required Approval Inputs

Before any real evidence artifact file may be created, the approval packet must
contain:

```text
evidence category name
SAFE_CATEGORY file token
market and asset scope
symbol scope policy
date range policy
field availability policy
missing-date policy
corporate-action policy
inactive and delisted symbol policy
source-rights owner
public-claim owner
investment review owner
design display-state owner
CEO synthesis owner
```

The packet must remain local-only and must not include raw rows, CSV market
data, JSON market data, Supabase query results, SQL output, or screenshots of
private database records.

```text
must not include raw rows, CSV market data, JSON market data, Supabase query results
```

## Allowed Gate Outcomes

```text
APPROVE_TEMPLATE_COPY_ONLY
REVISE_PACKET
DEFER_EVIDENCE_CATEGORY
STOP_EVIDENCE_CATEGORY
```

`APPROVE_TEMPLATE_COPY_ONLY` means a future slice may duplicate the blank
template into a category-specific file. It does not approve filling values,
creating a future evidence checker, validating against Supabase, or clearing
source-depth not_ready.

```text
APPROVE_TEMPLATE_COPY_ONLY does not approve filling values
APPROVE_TEMPLATE_COPY_ONLY does not approve creating a future evidence checker
APPROVE_TEMPLATE_COPY_ONLY does not approve validating against Supabase
APPROVE_TEMPLATE_COPY_ONLY does not approve clearing source-depth not_ready
```

## Minimum Role Sign-Off

```text
A / PM+Dev must confirm file path, naming, and checker scope
B / Marketing must confirm no public-claim copy is approved
C / Investment must confirm evidence category and assumptions are reviewable
D / Legal must confirm source-rights posture and data-handling boundaries
E / CEO must select the gate outcome
F / Design must confirm Display-State Boundary remains non-runtime
```

All sign-offs must be recorded before any category-specific file is created.

## Artifact Creation Boundary

If a later gate approves template copy only, the first created artifact must:

```text
start from docs/evidence/CP3_SOURCE_DEPTH_CATEGORY_EVIDENCE_TEMPLATE.md
use docs/evidence/CP3_SOURCE_DEPTH_<SAFE_CATEGORY>_EVIDENCE_YYYY-MM-DD.md
keep Status: not_ready
keep Approval Status not_ready
keep Public-Claim Boundary
keep Source-Rights Boundary
keep Display-State Boundary
keep TODO placeholders until a separate fill approval
never include raw rows
never include CSV market data
never include JSON market data
never include Supabase reads
never include SQL execution
```

The artifact must not become source-depth evidence until a later role review and
future evidence checker both pass.

## Failure Conditions

The gate must be rejected if any approval packet includes:

```text
raw market rows
CSV market data
JSON market data
Supabase read output
SQL execution output
scoreSource=real approval
public backtest claims
source-rights approval without Legal review
public claim approval without CEO synthesis
runtime repository wiring
public UI wiring
clearing source-depth not_ready
```

## CEO Synthesis

```text
This approval gate plan is accepted as a planning artifact only. It defines the
conditions for a later template-copy approval gate, but it still does not create
real evidence artifact files, does not fill template values, does not create the
future evidence checker, and does not make source_depth_state reviewable.
```

```text
planning artifact only
conditions for a later template-copy approval gate
does not create real evidence artifact files
does not fill template values
does not create the future evidence checker
does not make source_depth_state reviewable
```

The next safe slice is a role review for this approval gate plan.

## Non-Negotiable Guardrails

```text
approval gate plan only
do not create real evidence artifact files
do not fill template values
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
record CP3 source-depth evidence artifact approval gate plan role review
do not create real evidence artifact files
do not fill template values
do not create future evidence checker
do not run validator
do not connect to Supabase
do not run SQL
do not write Supabase
do not create seed SQL
do not commit raw market data
keep public data source mock
```
