# CP3 Source-Depth Template-Copy Approval Packet Usage Runbook Role Review

Checkpoint: CP3 Model Credibility
Date: 2026-05-29
Trigger: CP3 source-depth template-copy approval packet usage runbook recorded

Status: CP3 source-depth template-copy approval packet usage runbook role review recorded

## CEO Decision

```text
REVISE
```

The usage runbook is accepted as a local-only review workflow reference. It does
not approve template copy, does not create a real request packet, does not
create real evidence artifact files, does not fill template values, does not
create the future evidence checker, does not fetch market data, does not parse
market rows, does not connect to Supabase, does not run SQL, does not write
Supabase, does not write staging rows, does not write daily_prices, does not
create seed SQL, does not set scoreSource=real, does not clear source-depth
not_ready, and does not make public claims.

```text
accepted as a local-only review workflow reference
does not approve template copy
does not create a real request packet
does not create real evidence artifact files
does not fill template values
does not create the future evidence checker
does not clear source-depth not_ready
```

## Evidence

```text
docs/CP3_SOURCE_DEPTH_TEMPLATE_COPY_APPROVAL_PACKET_USAGE_RUNBOOK_2026-05-29.md
scripts/check-cp3-source-depth-template-copy-approval-packet-usage-runbook.mjs
docs/templates/CP3_SOURCE_DEPTH_TEMPLATE_COPY_APPROVAL_PACKET_TEMPLATE.md
scripts/check-cp3-tw-stock-source-depth.mjs remains not_ready as expected
```

## Verification

```text
scripts/check-cp3-source-depth-template-copy-approval-packet-usage-runbook.mjs passes
scripts/check-cp3-source-depth-template-copy-approval-packet-template.mjs passes
scripts/check-cp3-source-depth-template-copy-approval-packet-template-role-review.mjs passes
scripts/check-cp3-runtime-policy-draft.mjs passes
scripts/check-cp3-ui-copy-tokens-draft.mjs passes
TypeScript noEmit passes via node node_modules/typescript/bin/tsc --noEmit
review gates pass
```

## Role Review

A / PM+Dev:

```text
Engineering accepts the usage runbook because it defines preconditions,
preparation steps, role responsibilities, CEO decision rules, and required local
checks without adding runtime repository wiring.
```

```text
Usage Preconditions
Preparation Steps
Role Review Responsibilities
CEO Decision Rules
Required Local Checks
runtime repository wiring is not requested
```

B / Marketing:

```text
Marketing accepts the usage runbook because Public-Claim Boundary remains no
public claims approved, public data source remains mock, no public backtest
claims are requested, and no public UI wiring is requested.
```

```text
Public-Claim Boundary as `no public claims approved`
public data source remains mock
no public backtest claims requested
no public UI wiring requested
```

C / Investment:

```text
Investment accepts the usage runbook because it forbids raw market rows, CSV
market data, JSON market data, parsed rows, fetching data, parsing data, and
source-depth not_ready clearing.
```

```text
the packet contains no raw market rows
the packet contains no CSV market data
the packet contains no JSON market data
no parsed rows included
fetching data
parsing data
source-depth not_ready clearing
```

D / Legal:

```text
Legal accepts the usage runbook because Source-Rights Posture remains pending
Legal review, no source-rights approval is requested, no Supabase output is
included, and no SQL output is included.
```

```text
Source-Rights Posture as `pending Legal review`
no source-rights approval requested
the packet contains no Supabase output
the packet contains no SQL output
```

E / CEO:

```text
Proceed with a local-only CP3 source-depth template-copy approval packet
role-review gate for this usage runbook. The next slice may add a checker for
this role review, but it must not approve template copy, create a real request
packet, create real evidence artifact files, fill template values, create the
future evidence checker, fetch market data, parse market rows, connect to
Supabase, run SQL, write Supabase, write staging rows, write daily_prices,
create seed SQL, set scoreSource=real, or clear source-depth not_ready.
```

```text
local-only CP3 source-depth template-copy approval packet role-review gate
must not approve template copy
create a real request packet
create real evidence artifact files
fill template values
create the future evidence checker
fetch market data
parse market rows
connect to Supabase
run SQL
write Supabase
write staging rows
write daily_prices
create seed SQL
set scoreSource=real
clear source-depth not_ready
```

F / Design:

```text
Design accepts the usage runbook because Display-State Boundary remains
non-runtime state labels only and the document requests no UI component wiring,
no public page copy, no public badge copy, and no user-facing claim language.
```

```text
Display-State Boundary as `non-runtime state labels only`
no UI component wiring
no public page copy
no public badge copy
no user-facing claim language
```

## Conflicts

```text
PM wants a repeatable copy workflow before any real packet exists
Marketing wants no public claim approval implied by review workflow language
Investment wants no market-like examples or data rows in the runbook
Legal wants no rights approval and no remote-output references
Design wants all display-state wording to stay non-runtime
CEO selects local-only source-depth template-copy approval packet role-review gate
```

## CEO Synthesis

```text
The usage runbook is accepted as local-only process guidance. It is still not a
template-copy approval, not a real request packet, not an evidence artifact, not
a source-depth approval, and not a production release approval. The next safe
slice is a checker-backed role-review gate for this runbook.
```

```text
not a template-copy approval
not a real request packet
not an evidence artifact
not a source-depth approval
not a production release approval
checker-backed role-review gate
```

## Non-Negotiable Guardrails

```text
role review only
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
draft CP3 source-depth template-copy approval packet role-review gate checker
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
