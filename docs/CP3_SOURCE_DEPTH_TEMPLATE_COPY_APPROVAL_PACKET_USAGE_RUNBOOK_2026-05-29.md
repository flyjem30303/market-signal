# CP3 Source-Depth Template-Copy Approval Packet Usage Runbook

Status: local-only usage runbook recorded

Trigger: CP3 source-depth template-copy approval packet template role review recorded

CEO Decision: REVISE

This runbook defines how a future reviewer may prepare a local-only request to
copy the blank template at
`docs/templates/CP3_SOURCE_DEPTH_TEMPLATE_COPY_APPROVAL_PACKET_TEMPLATE.md`.

This runbook is not a template-copy approval, not a real request packet, not an
evidence artifact, not a source-depth approval, and not a production release
approval.

Machine-readable attestation:

```text
not an evidence artifact
not a production release approval
creating evidence artifact files remains unapproved
```

## Scope

Allowed scope:

```text
local-only usage runbook
blank template copy process only
review workflow instructions only
non-runtime state labels only
public data source remains mock
CP3 source-depth production gate remains not_ready
```

Out of scope:

```text
template copy approval
real request packet creation
real evidence artifact creation
future evidence checker creation
market data fetching
market row parsing
Supabase connection
SQL execution
staging writes
daily_prices writes
seed SQL creation
scoreSource=real
public UI wiring
public backtest claims
source-depth not_ready clearing
```

## Usage Preconditions

A future packet copy request may be prepared only when all preconditions remain
true:

```text
the blank template remains unchanged
the requested evidence category is named but not filled with data
the proposed artifact path is a future path only
the packet contains no raw market rows
the packet contains no CSV market data
the packet contains no JSON market data
the packet contains no Supabase output
the packet contains no SQL output
the packet asks only for APPROVE_TEMPLATE_COPY_ONLY
the packet keeps Approval Status: not_ready until CEO review
```

If any precondition fails, the owner must stop and mark the packet:

```text
REVISE_PACKET
```

## Preparation Steps

1. Copy the blank template only for a future review packet.
2. Give the copied file a date-stamped name under a review-only location.
3. Fill only request metadata that does not include raw market data.
4. Keep unresolved policy fields as `TODO` until the owner review can justify
   them without attaching data.
5. Keep Source-Rights Posture as `pending Legal review`.
6. Keep Public-Claim Boundary as `no public claims approved`.
7. Keep Display-State Boundary as `non-runtime state labels only`.
8. Keep every failure-condition attestation true.
9. Submit the packet to role review before any evidence artifact is created.
10. Do not add a checker for the future evidence artifact in this step.

## Role Review Responsibilities

Role A / PM+Dev verifies:

```text
the packet is copied from the approved blank template
the packet asks only for APPROVE_TEMPLATE_COPY_ONLY
the proposed path is review-only
runtime repository wiring is not requested
```

Role B / Marketing verifies:

```text
no public backtest claims requested
no public claim approval requested
no public UI wiring requested
public data source remains mock
```

Role C / Investment verifies:

```text
no raw market rows included
no CSV market data included
no JSON market data included
no parsed rows included
source-depth not_ready clearing is not requested
```

Role D / Legal verifies:

```text
Source-Rights Posture remains pending Legal review
no source-rights approval requested
no Supabase read output included
no SQL execution output included
```

Role E / CEO verifies:

```text
the request is limited to template-copy approval review
the request does not approve evidence collection
the request does not approve production readiness
the request does not approve scoreSource=real
the request does not clear CP3 source-depth production gate
```

Role F / Design verifies:

```text
Display-State Boundary remains non-runtime state labels only
no public UI wiring requested
no public badge copy requested
no user-facing claim language requested
```

## CEO Decision Rules

The CEO may select only one outcome:

```text
APPROVE_TEMPLATE_COPY_ONLY
REVISE_PACKET
BLOCKED
```

`APPROVE_TEMPLATE_COPY_ONLY` means only that the blank packet may be copied for
review. It does not approve filling real values, creating evidence artifact
files, creating a future evidence checker, fetching data, parsing data,
connecting to Supabase, running SQL, writing staging rows, writing
`daily_prices`, setting `scoreSource=real`, making public claims, or clearing
`source-depth not_ready`.

## Required Local Checks

Before the runbook is considered usable, these local-only checks must pass:

```text
scripts/check-cp3-source-depth-template-copy-approval-packet-template.mjs passes
scripts/check-cp3-source-depth-template-copy-approval-packet-template-role-review.mjs passes
scripts/check-cp3-source-depth-template-copy-approval-packet-usage-runbook.mjs passes
scripts/check-review-gates.mjs passes
TypeScript noEmit passes
```

## Next Implementation Slice

```text
record CP3 source-depth template-copy approval packet usage runbook role review
```

## Non-Negotiable Guardrails

```text
do not approve template copy
do not create a real request packet
do not create real evidence artifact files
do not fill template values
do not create future evidence checker
do not add example market data
do not add sample rows
do not add sample JSON
do not add sample CSV
do not add Supabase output
do not add SQL output
do not fetch market data
do not parse market rows
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
