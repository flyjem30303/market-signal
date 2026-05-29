# CP3 Source-Depth Next Governance Priority Map

Checkpoint: CP3 Model Credibility
Date: 2026-05-29
Trigger: CP3 source-depth template-copy approval packet governance checkpoint summary role review recorded

Status: CP3 source-depth next governance priority map recorded

## CEO Decision

```text
REVISE
```

This priority map translates the completed local-only governance handoff into
next-step sequencing. It does not approve template copy, does not create a real
request packet, does not create real evidence artifact files, does not fill
template values, does not create the future evidence checker, does not fetch
market data, does not parse market rows, does not connect to Supabase, does not
run SQL, does not write Supabase, does not write staging rows, does not write
daily_prices, does not create seed SQL, does not set scoreSource=real, does not
clear source-depth not_ready, and does not make public claims.

```text
next-step sequencing only
does not approve template copy
does not create a real request packet
does not create real evidence artifact files
does not fill template values
does not create the future evidence checker
does not clear source-depth not_ready
```

## Tier 1: Local-Only Work CEO Can Continue

```text
role-review summaries
handoff maps
owner decision matrices
launch blocker maps
public-claim boundary maps
runtime-state wording maps
documentation manifest maintenance
static checker maintenance
review-gate maintenance
```

Tier 1 work may continue without contacting external services when every item
stays local-only, does not use market data, and keeps public data source mock.

```text
no Supabase connection required
no SQL execution required
no market data required
no raw rows required
no public claim required
CP3 source-depth production gate remains not_ready
```

## Tier 2: CEO Or Chairman Decision Required

```text
approve template-copy request creation
approve filling a real request packet
approve creating real evidence artifact files
approve future evidence checker creation
approve remote read-only validation execution
approve staging migration execution
approve public UI wiring
approve source-depth production gate transition
approve scoreSource=real transition
approve public backtest claims
```

Tier 2 work must have an explicit approval packet before implementation. A
summary, role review, or checker passing is not sufficient approval.

```text
checker passing is not approval
role review passing is not approval
handoff summary passing is not approval
explicit approval packet required
```

## Tier 3: External Preconditions Required

```text
data-source rights review completed
Supabase schema readiness confirmed
remote read-only validation approved
remote read-only validation executed
staging migration approved
staging migration executed
post-migration validation reviewed
data quality downgrade policy accepted
public claim approval checklist accepted
production rollback path accepted
```

Tier 3 work is blocked until external state changes or explicit user/CEO
authorization is provided in-session.

```text
do not infer authorization from prior local-only checks
do not infer authorization from green review gates
do not infer authorization from installed dependencies
do not infer authorization from existing .env.local
do not infer authorization from local SQL files
```

## Current Recommended Next Slice

```text
draft CP3 source-depth next governance priority map role review
```

Rationale:

```text
the priority map needs role review before it becomes planning guidance
role review can stay local-only
role review can keep all gates closed
role review can clarify CEO autonomy boundary
```

## CEO Operating Rules

```text
When user says continue, prefer Tier 1 local-only work.
When work would move into Tier 2, stop and create an approval packet draft only.
When work would move into Tier 3, stop unless explicit authorization is present.
When Supabase, SQL, market data, or scoreSource=real are involved, do not execute under local-only delegation.
When a checker passes, treat it as evidence quality, not implementation approval.
```

## Required Local Checks

```text
scripts/check-cp3-source-depth-next-governance-priority-map.mjs passes
scripts/check-cp3-source-depth-template-copy-approval-packet-governance-checkpoint-summary-role-review.mjs passes
scripts/check-cp3-source-depth-template-copy-approval-packet-governance-checkpoint-summary.mjs passes
scripts/check-cp3-tw-stock-source-depth.mjs remains not_ready as expected
scripts/check-review-gates.mjs passes
TypeScript noEmit passes
```

## CEO Synthesis

```text
The next governance priority map is accepted as local-only planning guidance
only after role review. It preserves CEO autonomy for local documentation,
static checkers, and review gates, while reserving template-copy approval, real
evidence creation, Supabase work, SQL execution, source-depth production
approval, scoreSource=real, and public claims for explicit approval.
```

```text
local-only planning guidance
preserves CEO autonomy for local documentation
preserves CEO autonomy for static checkers
preserves CEO autonomy for review gates
reserving template-copy approval
reserving real evidence creation
reserving Supabase work
reserving SQL execution
reserving source-depth production approval
reserving scoreSource=real
reserving public claims
```

## Non-Negotiable Guardrails

```text
priority map only
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
record CP3 source-depth next governance priority map role review
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
