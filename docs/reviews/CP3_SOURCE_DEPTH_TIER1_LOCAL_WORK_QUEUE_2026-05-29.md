# CP3 Source-Depth Tier 1 Local Work Queue

Checkpoint: CP3 Model Credibility
Date: 2026-05-29
Trigger: CP3 source-depth next governance priority map role review recorded

Status: CP3 source-depth Tier 1 local work queue recorded

## CEO Decision

```text
REVISE
```

This Tier 1 local work queue sequences the next autonomous local-only work. It
does not approve template copy, does not create a real request packet, does not
create real evidence artifact files, does not fill template values, does not
create the future evidence checker, does not fetch market data, does not parse
market rows, does not connect to Supabase, does not run SQL, does not write
Supabase, does not write staging rows, does not write daily_prices, does not
create seed SQL, does not set scoreSource=real, does not clear source-depth
not_ready, and does not make public claims.

```text
autonomous local-only work queue
does not approve template copy
does not create a real request packet
does not create real evidence artifact files
does not fill template values
does not create the future evidence checker
does not clear source-depth not_ready
```

## Queue Rules

```text
Queue item must be local-only
Queue item must be document-only or checker-only
Queue item must preserve CP3 source-depth production gate remains not_ready
Queue item must keep public data source mock
Queue item must not require Supabase
Queue item must not require SQL
Queue item must not require market data
Queue item must not require raw rows
Queue item must not create public claims
Queue item must not set scoreSource=real
```

## Queue Order

1. CP3 source-depth Tier 1 local work queue role review.
2. CP3 source-depth approval-packet boundary map.
3. CP3 source-depth external-precondition readiness map.
4. CP3 source-depth local-checker ownership map.
5. CP3 source-depth handoff index for CEO review.
6. CP3 source-depth decision-log consolidation.

## Queue Item Definitions

```text
Tier 1 queue role review: role review for this queue only
approval-packet boundary map: maps what an approval packet may later request
external-precondition readiness map: maps blocked Tier 3 preconditions only
local-checker ownership map: assigns owners for local static checks only
handoff index for CEO review: indexes existing local governance artifacts only
decision-log consolidation: consolidates local decisions without new approvals
```

## Explicitly Excluded From Queue

```text
template-copy approval
real request packet creation
real evidence artifact creation
future evidence checker creation
remote read-only validation execution
staging migration execution
Supabase schema validation
SQL execution
market data fetching
market row parsing
runtime repository wiring
public UI wiring
source-depth production transition
scoreSource=real transition
public backtest claims
```

## Stop Conditions

```text
If work requires Supabase, stop.
If work requires SQL, stop.
If work requires market data, stop.
If work requires raw rows, stop.
If work requires .env.local secrets, stop.
If work requires scoreSource=real, stop.
If work requires public UI wiring, stop.
If work implies public claims, stop.
If work clears source-depth not_ready, stop.
If work changes from local-only evidence quality to implementation approval, stop.
```

## Required Local Checks

```text
scripts/check-cp3-source-depth-tier1-local-work-queue.mjs passes
scripts/check-cp3-source-depth-next-governance-priority-map-role-review.mjs passes
scripts/check-cp3-source-depth-next-governance-priority-map.mjs passes
scripts/check-cp3-tw-stock-source-depth.mjs remains not_ready as expected
scripts/check-review-gates.mjs passes
TypeScript noEmit passes
```

## CEO Synthesis

```text
The Tier 1 local work queue is accepted as sequencing guidance only after role
review. It lets CEO continue local-only governance work when the user says
continue, while stopping before template-copy approval, real request packets,
real evidence files, future evidence checker creation, Supabase work, SQL
execution, market data, runtime wiring, source-depth production transition,
scoreSource=real, or public claims.
```

```text
sequencing guidance only
continue local-only governance work
stopping before template-copy approval
stopping before real request packets
stopping before real evidence files
stopping before future evidence checker creation
stopping before Supabase work
stopping before SQL execution
stopping before market data
stopping before runtime wiring
stopping before source-depth production transition
stopping before scoreSource=real
stopping before public claims
```

## Non-Negotiable Guardrails

```text
Tier 1 queue only
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
record CP3 source-depth Tier 1 local work queue role review
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
