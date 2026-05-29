# CP3 Source-Depth Template-Copy Approval Packet Design

Checkpoint: CP3 Model Credibility
Date: 2026-05-29
Owner: E / CEO
Status: local-only template-copy approval packet design recorded

## CEO Decision

```text
REVISE
```

This local-only template-copy approval packet design defines the fields a future
reviewer must complete before asking CEO for `APPROVE_TEMPLATE_COPY_ONLY`. It
does not approve template copy, does not approve creating real evidence artifact
files, filling template values, creating the future evidence checker, creating
JSON sample artifacts, creating JSON or CSV market data, historical ingestion,
remote validation, Supabase reads, SQL execution, runtime repository work,
public UI wiring, production `scoreSource=real`, source-depth approval, or
public claims.

```text
local-only template-copy approval packet design
before asking CEO for APPROVE_TEMPLATE_COPY_ONLY
does not approve template copy
does not approve creating real evidence artifact files, filling template values, creating the future evidence checker
source-depth approval, or public claims
```

## Evidence

```text
docs/CP3_SOURCE_DEPTH_EVIDENCE_ARTIFACT_APPROVAL_GATE_PLAN_2026-05-29.md
docs/reviews/CP3_SOURCE_DEPTH_EVIDENCE_ARTIFACT_APPROVAL_GATE_PLAN_ROLE_REVIEW_2026-05-29.md
docs/evidence/CP3_SOURCE_DEPTH_CATEGORY_EVIDENCE_TEMPLATE.md
scripts/check-cp3-tw-stock-source-depth.mjs remains not_ready as expected
```

## Packet Purpose

The packet is a future request format only. It lets reviewers ask whether a
blank template may be copied into a category-specific file, while keeping the
copy separate from evidence approval, value filling, checker creation, public
claims, and runtime wiring.

```text
future request format only
blank template may be copied into a category-specific file
copy separate from evidence approval
copy separate from value filling
copy separate from checker creation
copy separate from public claims
copy separate from runtime wiring
```

## Required Packet Fields

```text
Packet ID
Request Date
Requested Gate Outcome
Requested Evidence Category
SAFE_CATEGORY File Token
Proposed Artifact Path
Market And Asset Scope
Symbol Scope Policy
Date Range Policy
Field Availability Policy
Missing-Date Policy
Corporate-Action Policy
Inactive And Delisted Symbol Policy
Source-Rights Posture
Public-Claim Boundary
Display-State Boundary
Reviewer Owner Map
Failure-Condition Attestation
CEO Decision Slot
```

`Requested Gate Outcome` must be exactly:

```text
APPROVE_TEMPLATE_COPY_ONLY
```

The packet must not request approval to fill values, create the future evidence
checker, validate against Supabase, or clear source-depth not_ready.

```text
must not request approval to fill values
must not request approval to create the future evidence checker
must not request approval to validate against Supabase
must not request approval to clear source-depth not_ready
```

## Field Rules

```text
SAFE_CATEGORY File Token uses uppercase letters, numbers, and underscores only
Proposed Artifact Path uses docs/evidence/CP3_SOURCE_DEPTH_<SAFE_CATEGORY>_EVIDENCE_YYYY-MM-DD.md
Market And Asset Scope is descriptive only
Symbol Scope Policy is descriptive only
Date Range Policy is descriptive only
Field Availability Policy is descriptive only
Missing-Date Policy is descriptive only
Corporate-Action Policy is descriptive only
Inactive And Delisted Symbol Policy is descriptive only
Source-Rights Posture must say pending Legal review
Public-Claim Boundary must say no public claims approved
Display-State Boundary must say non-runtime state labels only
CEO Decision Slot must start as pending
```

Descriptive-only fields must not include raw rows, CSV market data, JSON market
data, Supabase query results, SQL output, or screenshots of private database
records.

```text
descriptive-only fields must not include raw rows
descriptive-only fields must not include CSV market data
descriptive-only fields must not include JSON market data
descriptive-only fields must not include Supabase query results
descriptive-only fields must not include SQL output
```

## Required Reviewer Owner Map

```text
A / PM+Dev owns proposed path, SAFE_CATEGORY, and checker scope
B / Marketing owns Public-Claim Boundary
C / Investment owns market, symbol, date-range, and field policy review
D / Legal owns Source-Rights Posture and data-handling boundary
E / CEO owns final gate outcome
F / Design owns Display-State Boundary
```

Each owner may mark only:

```text
ready_for_ceo_review
revise_packet
blocked
```

No owner may mark source-depth approved, evidence approved, public claims
approved, source-rights approved, or scoreSource=real approved.

## Failure-Condition Attestation

The packet must explicitly attest:

```text
no raw market rows included
no CSV market data included
no JSON market data included
no Supabase read output included
no SQL execution output included
no scoreSource=real approval requested
no public backtest claims requested
no source-rights approval requested
no public claim approval requested
no runtime repository wiring requested
no public UI wiring requested
no source-depth not_ready clearing requested
```

If any attestation is false, the packet outcome must be:

```text
REVISE_PACKET
```

## CEO Synthesis

```text
This packet design is accepted as a planning artifact only. It defines the
future request fields for asking CEO to approve template copy only, but it still
does not approve template copy, does not create evidence, does not fill template
values, does not create the future evidence checker, and does not make
source_depth_state reviewable.
```

```text
planning artifact only
future request fields for asking CEO to approve template copy only
does not approve template copy
does not create evidence
does not fill template values
does not create the future evidence checker
does not make source_depth_state reviewable
```

The next safe slice is a role review for this template-copy approval packet
design.

```text
role review for this template-copy approval packet design
```

## Non-Negotiable Guardrails

```text
packet design only
do not approve template copy
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
record CP3 source-depth template-copy approval packet design role review
do not approve template copy
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
