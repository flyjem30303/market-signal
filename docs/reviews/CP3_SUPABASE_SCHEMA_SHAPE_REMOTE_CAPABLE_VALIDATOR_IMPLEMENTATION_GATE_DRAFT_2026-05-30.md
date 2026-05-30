# CP3 Supabase Schema-Shape Remote-Capable Validator Implementation Gate Draft

Date: 2026-05-30

Status: `CP3 Supabase schema-shape remote-capable validator implementation gate draft recorded`

Decision: `PREPARE_SCHEMA_SHAPE_REMOTE_CAPABLE_VALIDATOR_IMPLEMENTATION_ONLY`

## Scope

CEO authorizes preparation of a future implementation plan for making `scripts/validate-supabase-schema-shape-readonly.mjs` remote-capable under strict confirmation. This gate does not modify the validator, does not add a Supabase client, does not connect to Supabase, does not inspect remote field names, does not read remote rows, does not set the confirmation variable, does not execute the command, does not run SQL, does not write Supabase, does not modify `.env.local`, does not fetch or ingest market data, does not commit row payloads, does not set `scoreSource=real`, does not approve public claims, and does not promote CP3 readiness.

## Current Implementation Baseline

```text
BASELINE-001 current file remains scripts/validate-supabase-schema-shape-readonly.mjs
BASELINE-002 current validator remains fail-closed
BASELINE-003 current validator remains status blocked
BASELINE-004 current validator remains connection not_run
BASELINE-005 current validator remains mode schema_shape_readonly_skeleton
BASELINE-006 current validator remains rowLimit 0
BASELINE-007 current validator remains no Supabase client
BASELINE-008 current validator remains no remote query
BASELINE-009 current validator remains no file writes
BASELINE-010 current validator remains no SQL
BASELINE-011 current validator remains no scoreSource=real
BASELINE-012 scripts/check-review-gates.mjs does not execute the validator
```

## Future Allowed Code Changes

```text
ALLOW-CHANGE-001 may import createClient from @supabase/supabase-js only after implementation approval
ALLOW-CHANGE-002 may instantiate Supabase client with persistSession false only after implementation approval
ALLOW-CHANGE-003 may read NEXT_PUBLIC_SUPABASE_URL without printing value
ALLOW-CHANGE-004 may read SUPABASE_SERVICE_ROLE_KEY without printing value
ALLOW-CHANGE-005 may check NEXT_PUBLIC_SUPABASE_ANON_KEY presence without using it for privileged reads
ALLOW-CHANGE-006 may project sanitized field names only after implementation approval
ALLOW-CHANGE-007 may target daily_prices with rowLimit 0
ALLOW-CHANGE-008 may target twse_stock_day_staging with rowLimit 0
ALLOW-CHANGE-009 may target market_assets with rowLimit 0
ALLOW-CHANGE-010 may target model_runs with rowLimit 0
ALLOW-CHANGE-011 may target data_freshness with rowLimit 0
ALLOW-CHANGE-012 may return redacted JSON status only
ALLOW-CHANGE-013 may classify objectKind as table, view, alias, remote_only, unknown, or blocked
ALLOW-CHANGE-014 may classify shapeStatus as ok, blocked, needs-reconciliation, or not_run
ALLOW-CHANGE-015 may report sanitized missingExpectedFields without row payloads
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
FORBID-CODE-017 no sample row output
FORBID-CODE-018 no raw market data output
FORBID-CODE-019 no scoreSource=real
FORBID-CODE-020 no source-depth readiness promotion
FORBID-CODE-021 no CP3 readiness promotion
FORBID-CODE-022 no public claims
```

## Required Static Safety Checker

```text
STATIC-CHECK-001 must verify scripts/check-review-gates.mjs does not execute scripts/validate-supabase-schema-shape-readonly.mjs
STATIC-CHECK-002 must verify only approved Supabase client import appears
STATIC-CHECK-003 must verify persistSession false appears if createClient appears
STATIC-CHECK-004 must verify allowed object names only
STATIC-CHECK-005 must verify rowLimit 0
STATIC-CHECK-006 must reject insert, update, upsert, delete, rpc, storage, SQL mutation strings, fetch, writeFileSync, and appendFileSync
STATIC-CHECK-007 must reject console output of environment values
STATIC-CHECK-008 must reject output of key prefixes, suffixes, or lengths
STATIC-CHECK-009 must reject output of row payloads
STATIC-CHECK-010 must reject output of raw market data
STATIC-CHECK-011 must verify filesWritten false
STATIC-CHECK-012 must verify mutations false
STATIC-CHECK-013 must verify sqlExecuted false
STATIC-CHECK-014 must verify rpcCalled false
STATIC-CHECK-015 must verify secretsPrinted false
STATIC-CHECK-016 must verify rowPayloadsPrinted false
STATIC-CHECK-017 must verify rawMarketDataPrinted false
STATIC-CHECK-018 must verify scoreSourceRealChanged false
STATIC-CHECK-019 must verify sourceDepthReadyChanged false
STATIC-CHECK-020 must verify publicClaimsChanged false
```

## Future Output Contract

```text
OUTPUT-001 status: ok | blocked
OUTPUT-002 mode: schema_shape_readonly_remote_validation
OUTPUT-003 confirmation: present | missing_or_invalid
OUTPUT-004 env.NEXT_PUBLIC_SUPABASE_URL: present | missing
OUTPUT-005 env.NEXT_PUBLIC_SUPABASE_ANON_KEY: present | missing
OUTPUT-006 env.SUPABASE_SERVICE_ROLE_KEY: present | missing
OUTPUT-007 connection: not_run | ok | blocked
OUTPUT-008 rowLimit: 0
OUTPUT-009 objects[].name: daily_prices | twse_stock_day_staging | market_assets | model_runs | data_freshness
OUTPUT-010 objects[].contractStatus: local-baselined | needs-reconciliation | remote-only-pending-contract
OUTPUT-011 objects[].reachable: not_run | ok | blocked
OUTPUT-012 objects[].shapeStatus: not_run | ok | blocked | needs-reconciliation
OUTPUT-013 objects[].objectKind: not_run | table | view | alias | remote_only | unknown | blocked
OUTPUT-014 objects[].fieldNamesPresent: not_run | sanitized_list | blocked
OUTPUT-015 objects[].missingExpectedFields: not_run | sanitized_list | none | blocked
OUTPUT-016 objects[].unexpectedRuntimeBlockers: sanitized_list
OUTPUT-017 objects[].relationshipToLocalBaseline: sanitized_string
OUTPUT-018 filesWritten: false
OUTPUT-019 mutations: false
OUTPUT-020 sqlExecuted: false
OUTPUT-021 rpcCalled: false
OUTPUT-022 secretsPrinted: false
OUTPUT-023 rowPayloadsPrinted: false
OUTPUT-024 rawMarketDataPrinted: false
OUTPUT-025 scoreSourceRealChanged: false
OUTPUT-026 sourceDepthReadyChanged: false
OUTPUT-027 publicClaimsChanged: false
```

## Not Approved By This Gate

```text
NOT-APPROVED-001 do not change scripts/validate-supabase-schema-shape-readonly.mjs in this slice
NOT-APPROVED-002 do not add Supabase client in this slice
NOT-APPROVED-003 do not run scripts/validate-supabase-schema-shape-readonly.mjs against Supabase
NOT-APPROVED-004 do not connect to Supabase
NOT-APPROVED-005 do not inspect remote field names
NOT-APPROVED-006 do not read remote rows
NOT-APPROVED-007 do not run SQL
NOT-APPROVED-008 do not run SQL migration
NOT-APPROVED-009 do not write Supabase
NOT-APPROVED-010 do not write staging rows
NOT-APPROVED-011 do not write daily_prices
NOT-APPROVED-012 do not create seed SQL
NOT-APPROVED-013 do not fetch market data
NOT-APPROVED-014 do not parse market rows
NOT-APPROVED-015 do not commit raw market rows
NOT-APPROVED-016 do not print environment values
NOT-APPROVED-017 do not print key prefixes, key suffixes, or key lengths
NOT-APPROVED-018 do not print row payloads
NOT-APPROVED-019 do not modify .env.local
NOT-APPROVED-020 do not set scoreSource=real
NOT-APPROVED-021 do not clear source-depth not_ready
NOT-APPROVED-022 do not clear CP3 not_ready
NOT-APPROVED-023 do not make public claims
```

## Future Implementation Approval Requirements

```text
FUTURE-APPROVAL-001 role review must accept this implementation gate draft
FUTURE-APPROVAL-002 implementation slice must modify validator and static checker together
FUTURE-APPROVAL-003 implementation slice must run static safety checker before any remote execution
FUTURE-APPROVAL-004 implementation slice must keep aggregate review gate local-only
FUTURE-APPROVAL-005 implementation slice must keep command execution blocked unless the exact confirmation is present
FUTURE-APPROVAL-006 implementation slice must not write report files unless a separate redacted retention gate is approved
FUTURE-APPROVAL-007 execution gate must be recorded after implementation review
FUTURE-APPROVAL-008 execution gate must be the only gate that can allow one remote run
FUTURE-APPROVAL-009 post-run review must precede any readiness change
```

## CEO Synthesis

This gate draft is the bridge from schema-shape governance into implementation design. It keeps the current validator untouched while making the next code slice precise: add only the minimum confirmation-guarded read-only Supabase shape path, prove it with static checks, keep rowLimit at 0, and still require a separate execution gate before any remote run.

## Next Slice Recommendation

```text
NEXT-SLICE-001 perform role review of this schema-shape remote-capable validator implementation gate draft
NEXT-SLICE-002 verify code-change boundaries are narrow enough
NEXT-SLICE-003 verify static checker requirements are complete
NEXT-SLICE-004 verify current validator remains unchanged
NEXT-SLICE-005 keep scripts/check-review-gates.mjs from executing the validator
NEXT-SLICE-006 keep public data source mock
NEXT-SLICE-007 keep scoreSource=real blocked
NEXT-SLICE-008 keep CP3 not_ready
NEXT-SLICE-009 keep Supabase connection blocked until execution gate
```

## Verification Expectations

```text
scripts/check-cp3-supabase-schema-shape-remote-capable-validator-implementation-gate-draft.mjs passes
scripts/check-cp3-supabase-schema-shape-one-attempt-execution-decision-gate.mjs passes
scripts/check-cp3-supabase-schema-shape-readonly-validator-skeleton.mjs passes
scripts/check-review-gates.mjs passes
TypeScript noEmit passes
public data source remains mock
scoreSource=real remains blocked
CP3 remains not_ready
Supabase connection remains blocked
SQL execution remains blocked
public claims remain blocked
```
