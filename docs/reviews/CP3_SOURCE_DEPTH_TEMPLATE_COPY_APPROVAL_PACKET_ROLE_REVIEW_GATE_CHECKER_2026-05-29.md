# CP3 Source-Depth Template-Copy Approval Packet Role-Review Gate Checker

Checkpoint: CP3 Model Credibility
Date: 2026-05-29
Trigger: CP3 source-depth template-copy approval packet usage runbook role review recorded

Status: CP3 source-depth template-copy approval packet role-review gate checker recorded

## CEO Decision

```text
REVISE
```

This gate checker verifies that the local-only template-copy approval packet
review chain has a checker-backed role review. It does not approve template
copy, does not create a real request packet, does not create real evidence
artifact files, does not fill template values, does not create the future
evidence checker, does not fetch market data, does not parse market rows, does
not connect to Supabase, does not run SQL, does not write Supabase, does not
write staging rows, does not write daily_prices, does not create seed SQL, does
not set scoreSource=real, does not clear source-depth not_ready, and does not
make public claims.

```text
checker-backed role review
does not approve template copy
does not create a real request packet
does not create real evidence artifact files
does not fill template values
does not create the future evidence checker
does not clear source-depth not_ready
```

## Gate Inputs

```text
docs/CP3_SOURCE_DEPTH_TEMPLATE_COPY_APPROVAL_PACKET_USAGE_RUNBOOK_2026-05-29.md
docs/reviews/CP3_SOURCE_DEPTH_TEMPLATE_COPY_APPROVAL_PACKET_USAGE_RUNBOOK_ROLE_REVIEW_2026-05-29.md
scripts/check-cp3-source-depth-template-copy-approval-packet-usage-runbook.mjs
scripts/check-cp3-source-depth-template-copy-approval-packet-usage-runbook-role-review.mjs
scripts/check-cp3-tw-stock-source-depth.mjs remains not_ready as expected
```

## Checker Contract

The role-review gate checker must require these conditions:

```text
usage runbook status is local-only usage runbook recorded
usage runbook role review status is recorded
role review CEO Decision remains REVISE
role review includes all six roles A B C D E F
role review states public data source remains mock
role review states CP3 source-depth production gate remains not_ready
role review states not a template-copy approval
role review states not a real request packet
role review states not an evidence artifact
role review states not a source-depth approval
role review states not a production release approval
```

The role-review gate checker must forbid these conditions:

```text
Status: approved
CEO Decision: APPROVE
Approval Status: approved
template copy approved
source_depth_state is reviewable
scoreSource=real approved
source-rights are approved
public claims are approved
Supabase read output:
SQL execution output:
raw OHLCV
daily_prices sample
```

## Verification

```text
scripts/check-cp3-source-depth-template-copy-approval-packet-usage-runbook.mjs passes
scripts/check-cp3-source-depth-template-copy-approval-packet-usage-runbook-role-review.mjs passes
scripts/check-cp3-source-depth-template-copy-approval-packet-role-review-gate-checker.mjs passes
scripts/check-review-gates.mjs passes
TypeScript noEmit passes
```

## CEO Synthesis

```text
The gate checker can be added because it only verifies the local-only role
review chain. It still does not approve template copy, does not create a real
request packet, does not create evidence, does not create the future evidence
checker, and does not make source_depth_state reviewable. The next safe slice is
a role review for this gate checker.
```

```text
only verifies the local-only role review chain
does not approve template copy
does not create a real request packet
does not create evidence
does not create the future evidence checker
does not make source_depth_state reviewable
role review for this gate checker
```

## Non-Negotiable Guardrails

```text
gate checker only
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
record CP3 source-depth template-copy approval packet role-review gate checker role review
do not approve template copy
do not create a real request packet
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
