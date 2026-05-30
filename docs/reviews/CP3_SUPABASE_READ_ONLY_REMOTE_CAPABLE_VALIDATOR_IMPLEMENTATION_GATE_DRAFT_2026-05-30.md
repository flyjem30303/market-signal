# CP3 Supabase Read-Only Remote-Capable Validator Implementation Gate Draft

Checkpoint: CP3 Model Credibility
Date: 2026-05-30
Trigger: Supabase read-only remote-run approval gate draft recorded

Status: CP3 Supabase read-only remote-capable validator implementation gate draft recorded

## CEO Gate Decision

```text
PREPARE_REMOTE_CAPABLE_VALIDATOR_IMPLEMENTATION_ONLY
```

CEO authorizes preparation of a future implementation plan for making
`npm run db:readonly-validate` remote-capable. This gate does not modify the
validator, does not add a Supabase client, does not connect to Supabase, and
does not execute the command.

## Current Implementation Baseline

```text
BASELINE-001 package script remains npm run db:readonly-validate
BASELINE-002 current file remains scripts/validate-supabase-readonly.mjs
BASELINE-003 current validator remains fail-closed
BASELINE-004 current validator remains status blocked
BASELINE-005 current validator remains connection not_run
BASELINE-006 current validator remains no Supabase client
BASELINE-007 current validator remains no remote query
BASELINE-008 current validator remains no file writes
BASELINE-009 current validator remains no SQL
BASELINE-010 current validator remains no scoreSource=real
```

## Future Allowed Code Changes

```text
ALLOW-CHANGE-001 may import createClient from @supabase/supabase-js only after implementation approval
ALLOW-CHANGE-002 may instantiate Supabase client with persistSession false only after implementation approval
ALLOW-CHANGE-003 may read NEXT_PUBLIC_SUPABASE_URL without printing value
ALLOW-CHANGE-004 may read SUPABASE_SERVICE_ROLE_KEY without printing value
ALLOW-CHANGE-005 may check NEXT_PUBLIC_SUPABASE_ANON_KEY presence without using it for privileged reads
ALLOW-CHANGE-006 may perform head true count exact select checks only after implementation approval
ALLOW-CHANGE-007 may target daily_prices with rowLimit 5 or lower
ALLOW-CHANGE-008 may target twse_stock_day_staging with rowLimit 5 or lower
ALLOW-CHANGE-009 may target market_assets with rowLimit 5 or lower
ALLOW-CHANGE-010 may target model_runs with rowLimit 5 or lower
ALLOW-CHANGE-011 may target data_freshness with rowLimit 5 or lower
ALLOW-CHANGE-012 may return redacted JSON status only
```

## Future Forbidden Code Paths

```text
FORBID-CODE-001 no insert
FORBID-CODE-002 no update
FORBID-CODE-003 no upsert
FORBID-CODE-004 no delete
FORBID-CODE-005 no rpc
FORBID-CODE-006 no storage
FORBID-CODE-007 no SQL strings for insert, update, delete, truncate, drop, alter, create, migration, or seed
FORBID-CODE-008 no fetch market data
FORBID-CODE-009 no parse market rows
FORBID-CODE-010 no writeFileSync
FORBID-CODE-011 no appendFileSync
FORBID-CODE-012 no console output of process.env values
FORBID-CODE-013 no key prefixes
FORBID-CODE-014 no key suffixes
FORBID-CODE-015 no key lengths
FORBID-CODE-016 no row payload output
FORBID-CODE-017 no scoreSource=real
FORBID-CODE-018 no source-depth readiness promotion
FORBID-CODE-019 no public claims
```

## Required Static Safety Checker

```text
STATIC-CHECK-001 must verify package script still points to scripts/validate-supabase-readonly.mjs
STATIC-CHECK-002 must verify scripts/check-review-gates.mjs does not execute the validator
STATIC-CHECK-003 must verify only approved Supabase client import appears
STATIC-CHECK-004 must verify persistSession false appears if createClient appears
STATIC-CHECK-005 must verify allowed object names only
STATIC-CHECK-006 must verify rowLimit 5 or lower
STATIC-CHECK-007 must reject insert, update, upsert, delete, rpc, storage, SQL mutation strings, fetch, writeFileSync, and appendFileSync
STATIC-CHECK-008 must reject console output of environment values
STATIC-CHECK-009 must reject output of key prefixes, suffixes, or lengths
STATIC-CHECK-010 must reject output of row payloads
STATIC-CHECK-011 must verify mutations false
STATIC-CHECK-012 must verify sqlExecuted false
STATIC-CHECK-013 must verify rpcCalled false
STATIC-CHECK-014 must verify secretsPrinted false
STATIC-CHECK-015 must verify rowPayloadsPrinted false
STATIC-CHECK-016 must verify scoreSourceRealChanged false
STATIC-CHECK-017 must verify sourceDepthReadyChanged false
STATIC-CHECK-018 must verify publicClaimsChanged false
```

## Future Output Contract

```text
OUTPUT-001 status: ok | blocked
OUTPUT-002 mode: read_only_remote_validation
OUTPUT-003 env.NEXT_PUBLIC_SUPABASE_URL: present | missing
OUTPUT-004 env.NEXT_PUBLIC_SUPABASE_ANON_KEY: present | missing
OUTPUT-005 env.SUPABASE_SERVICE_ROLE_KEY: present | missing
OUTPUT-006 connection: not_run | ok | blocked
OUTPUT-007 objects[].name: daily_prices | twse_stock_day_staging | market_assets | model_runs | data_freshness
OUTPUT-008 objects[].reachable: not_run | ok | blocked
OUTPUT-009 objects[].countStatus: not_run | ok | blocked
OUTPUT-010 rowLimit: 5
OUTPUT-011 mutations: false
OUTPUT-012 sqlExecuted: false
OUTPUT-013 rpcCalled: false
OUTPUT-014 secretsPrinted: false
OUTPUT-015 rowPayloadsPrinted: false
OUTPUT-016 filesWritten: false
OUTPUT-017 scoreSourceRealChanged: false
OUTPUT-018 sourceDepthReadyChanged: false
OUTPUT-019 publicClaimsChanged: false
```

## Not Approved By This Gate

```text
NOT-APPROVED-001 do not change scripts/validate-supabase-readonly.mjs in this slice
NOT-APPROVED-002 do not add Supabase client in this slice
NOT-APPROVED-003 do not run npm run db:readonly-validate against Supabase
NOT-APPROVED-004 do not connect to Supabase
NOT-APPROVED-005 do not read remote rows
NOT-APPROVED-006 do not run SQL
NOT-APPROVED-007 do not run SQL migration
NOT-APPROVED-008 do not write Supabase
NOT-APPROVED-009 do not write staging rows
NOT-APPROVED-010 do not write daily_prices
NOT-APPROVED-011 do not create seed SQL
NOT-APPROVED-012 do not fetch market data
NOT-APPROVED-013 do not parse market rows
NOT-APPROVED-014 do not commit raw market rows
NOT-APPROVED-015 do not print environment values
NOT-APPROVED-016 do not modify .env.local
NOT-APPROVED-017 do not set scoreSource=real
NOT-APPROVED-018 do not clear source-depth not_ready
NOT-APPROVED-019 do not make public claims
```

## Future Implementation Approval Requirements

```text
FUTURE-APPROVAL-001 role review must accept this implementation gate draft
FUTURE-APPROVAL-002 implementation slice must modify validator and static checker together
FUTURE-APPROVAL-003 implementation slice must run static safety checker before any remote execution
FUTURE-APPROVAL-004 implementation slice must keep aggregate review gate local-only
FUTURE-APPROVAL-005 implementation slice must keep command execution blocked unless a separate execution confirmation is present
FUTURE-APPROVAL-006 implementation slice must not write report files unless a separate redacted retention gate is approved
FUTURE-APPROVAL-007 execution gate must be recorded after implementation review
FUTURE-APPROVAL-008 execution gate must be the only gate that can allow one remote run
```

## CEO Synthesis

```text
This gate draft is the bridge from approval governance into implementation
design. It keeps the current runtime untouched while making the next code slice
precise: add only the minimum read-only Supabase path, prove it with static
checks, and still require a separate execution gate before any remote run.
```

## Next Slice Recommendation

```text
NEXT-SLICE-001 perform role review of this remote-capable validator implementation gate draft
NEXT-SLICE-002 verify code-change boundaries are narrow enough
NEXT-SLICE-003 verify static checker requirements are complete
NEXT-SLICE-004 verify current validator remains unchanged
NEXT-SLICE-005 keep scripts/check-review-gates.mjs from executing the validator
NEXT-SLICE-006 keep public data source mock
NEXT-SLICE-007 keep scoreSource=real blocked
NEXT-SLICE-008 keep Supabase connection blocked until execution gate
```

## Verification Expectations

```text
scripts/check-cp3-supabase-read-only-remote-capable-validator-implementation-gate-draft.mjs passes
scripts/check-cp3-supabase-read-only-remote-run-approval-gate-draft.mjs passes
scripts/check-cp3-supabase-read-only-validator-skeleton.mjs passes
scripts/check-review-gates.mjs passes
TypeScript noEmit passes
public data source remains mock
scoreSource=real remains blocked
CP3 source-depth production gate remains not_ready
Supabase connection remains blocked
SQL execution remains blocked
public claims remain blocked
```
