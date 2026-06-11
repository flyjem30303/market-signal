# A1 Explicit Execution Packet Preparation Contract Review

Status: a1_explicit_execution_packet_preparation_contract_review_ready

## Review Scope

A1 reviews the upcoming TWII explicit execution packet preparation gate as a contract-only support lane for PM integration. This is an explicit execution packet contract review for local preparation only; it does not authorize execution, does not validate real values, and does not promote runtime data sources.

The bounded target scope is TWII only, `daily_prices` only, and 60 rows maximum by shape. This document does not confirm that 60 rows exist, does not accept candidate rows, and does not score row coverage.

The operator authorization packet handoff remains a future, external, PM-owned handoff. A1 records only the local contract expectations and blocked reasons for that handoff; A1 does not receive, request, store, or infer any real operator authorization value.

## Required Execution Packet Fields

The PM mainline gate should require the explicit execution packet to define these required execution packet fields by shape only:

- packet id
- lane id
- symbol
- scope
- target table
- bounded target scope
- maximum bounded rows: 60 rows
- authorization decision placeholder
- execute switch placeholder
- confirmation phrase placeholder
- server-only credential presence placeholder
- rollback dry-run proof placeholder
- aggregate readback proof placeholder
- post-run review proof placeholder
- duplicate rejection proof placeholder
- blocked reasons
- next route
- promotion locks

Each field must be checked for presence and allowed shape only. The gate must not read, print, store, infer, or fill real authorization values, credential values, confirmation phrase values, decision values, row bodies, source payloads, stock-id payloads, or market-data payloads.

## Presence-Only Authorization Semantics

Authorization semantics must remain presence-only:

- authorization value presence can be represented only as a placeholder state
- the real authorization value must stay outside the repo
- the real decision value must not be read or filled by PM, A1, A2, scripts, reports, or review gates
- absence of any required external value must keep the packet blocked
- presence-only shape passing must not imply execution readiness

## Server-Only Credential Presence

Server-only credential checks must stay outside repository-visible values:

- credential presence may be represented only as a boolean placeholder or blocked reason
- env, secret, token, service key, authorization header, and credential body values must not be read or printed
- credential presence alone must not permit SQL, Supabase connection, data write, candidate acceptance, or promotion to real data

## Execute Switch And Confirmation Phrase Presence

The explicit packet must distinguish shape readiness from execution permission:

- execute switch presence must remain a placeholder
- confirmation phrase presence must remain a placeholder
- no script may compare or print the real confirmation phrase
- no script may treat placeholder presence as final execution permission
- final execution must remain blocked until a later explicitly authorized execution run

## Placeholder Contracts

The packet preparation gate should include placeholders for:

- rollback dry-run proof placeholder
- aggregate readback proof placeholder
- post-run review proof placeholder
- duplicate rejection proof placeholder for missing-only candidate behavior

All placeholder checks must default to not passed. They can prepare the future checklist, but they cannot execute rollback, read Supabase rows, write Supabase rows, accept candidate rows, or mutate `daily_prices`.

## Blocked Reasons

The gate should remain blocked when any of these are true:

- external authorization value is not provided in the approved future channel
- execute switch is missing or only represented by a placeholder
- confirmation phrase is missing or only represented by a placeholder
- server-only credential presence is not confirmed by an approved future server-only check
- rollback dry-run proof is missing
- aggregate readback proof is missing
- post-run review proof is missing
- duplicate proof is missing
- any execution stop line is violated
- `publicDataSource` is not `mock`
- `scoreSource` is not `mock`

## Next Review-Only Route

Recommended next route:

`explicit_execution_packet_shape_review_then_operator_authorized_server_only_execution_attempt`

This route is review-only. It prepares the later handoff path but does not execute SQL, connect to Supabase, write rows, mutate `daily_prices`, accept candidate rows, or promote runtime data sources.

## fail-closed rules

The packet must fail closed if any script, report, or reviewer detects:

- SQL execution
- Supabase connection attempt
- Supabase client import
- env, secret, authorization, or confirmation phrase read
- real decision value read or fill
- market-data fetch
- raw payload, row payload, or stock-id payload handling
- `daily_prices` mutation
- candidate rows accepted
- `publicDataSource=supabase`
- `scoreSource=real`

The only acceptable output is a preparation-ready but execution-blocked state.

## PM integration notes

PM can integrate this A1 review by checking that the explicit execution packet preparation gate:

- references this document as the A1 contract review
- validates required execution packet fields by shape only
- keeps all real values outside the repo and outside report output
- keeps all proof checks as placeholders until a later approved execution stage
- reports blocked reasons clearly for CEO/PM decision-making
- keeps `publicDataSource=mock` and `scoreSource=mock`
- preserves the no-SQL, no-Supabase, no-market-fetch, no-`daily_prices`-mutation, no-candidate-acceptance boundary
