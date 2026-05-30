# CP3 Supabase Read-Only Validation Design

Checkpoint: CP3 Model Credibility
Date: 2026-05-30
Trigger: CP3 Supabase read-only validation authorization gate recorded

Status: CP3 Supabase read-only validation design recorded

## Design Scope

```text
design only
does not connect to Supabase
does not run SQL
does not read remote rows
does not write Supabase
does not write staging rows
does not write daily_prices
does not create seed SQL
does not fetch market data
does not parse market rows
does not set scoreSource=real
does not clear source-depth not_ready
does not make public claims
```

## Future Command Boundary

```text
FUTURE-COMMAND-001 future command name candidate: npm run db:readonly-validate
FUTURE-COMMAND-002 future command must be a read-only validator
FUTURE-COMMAND-003 future command must require separate remote read-only execution approval before it is run
FUTURE-COMMAND-004 future command must fail closed when required environment names are missing
FUTURE-COMMAND-005 future command must print only redacted status, counts, object names, and pass/fail state
FUTURE-COMMAND-006 future command must not print environment values
FUTURE-COMMAND-007 future command must not print row payloads
FUTURE-COMMAND-008 future command must not print market prices
FUTURE-COMMAND-009 future command must not write files containing remote data
FUTURE-COMMAND-010 future command must not mutate Supabase
```

## Environment Presence Checks

```text
ENV-CHECK-001 check presence of NEXT_PUBLIC_SUPABASE_URL without printing value
ENV-CHECK-002 check presence of NEXT_PUBLIC_SUPABASE_ANON_KEY without printing value
ENV-CHECK-003 check presence of SUPABASE_SERVICE_ROLE_KEY without printing value
ENV-CHECK-004 report present or missing only
ENV-CHECK-005 report server-only classification for SUPABASE_SERVICE_ROLE_KEY
ENV-CHECK-006 do not print key prefixes
ENV-CHECK-007 do not print key suffixes
ENV-CHECK-008 do not print key length
ENV-CHECK-009 do not write .env.local
ENV-CHECK-010 do not commit any environment file
```

## Candidate Read-Only Objects

```text
OBJECT-001 daily_prices row limit 5 count only later
OBJECT-002 twse_stock_day_staging row limit 5 count only later
OBJECT-003 market_assets row limit 5 count only later
OBJECT-004 model_runs row limit 5 count only later
OBJECT-005 data_freshness row limit 5 count only later
```

Candidate objects are not queried by this design.

## Allowed Future Output Shape

```text
OUTPUT-001 status: ok | blocked
OUTPUT-002 env: present | missing without values
OUTPUT-003 connection: not_run | ok | blocked
OUTPUT-004 objects: object name and count status only
OUTPUT-005 rowLimit: numeric limit only
OUTPUT-006 mutations: must always report false
OUTPUT-007 secretsPrinted: must always report false
OUTPUT-008 scoreSourceRealChanged: must always report false
```

## Future Pass Criteria

```text
PASS-CRITERIA-001 all required environment names are present without printing values
PASS-CRITERIA-002 remote connection check succeeds only after separate execution approval
PASS-CRITERIA-003 selected objects are reachable read-only only after separate execution approval
PASS-CRITERIA-004 every object check uses row limit 5 or lower
PASS-CRITERIA-005 output contains no row payloads
PASS-CRITERIA-006 output contains no secrets
PASS-CRITERIA-007 output confirms no insert, update, delete, upsert, rpc, or storage operation
PASS-CRITERIA-008 output confirms scoreSource=real remains unchanged
```

## Stop Conditions

```text
STOP-001 stop if any secret value would be printed
STOP-002 stop if .env.local would be modified
STOP-003 stop if a write-capable operation appears in command scope
STOP-004 stop if SQL execution is required
STOP-005 stop if an RPC call is required
STOP-006 stop if row payloads would be printed
STOP-007 stop if row limit is greater than 5
STOP-008 stop if scoreSource=real would change
STOP-009 stop if source-depth not_ready would be cleared
STOP-010 stop if public claims would be implied
```

## Next Approval Gate

```text
NEXT-GATE-001 create remote read-only execution approval gate
NEXT-GATE-002 the next gate must name exact command before remote action
NEXT-GATE-003 the next gate must list exact expected output fields
NEXT-GATE-004 the next gate must restate no writes
NEXT-GATE-005 the next gate must restate no SQL migration
NEXT-GATE-006 the next gate must restate no scoreSource=real
NEXT-GATE-007 the next gate must restate no source-depth readiness promotion
NEXT-GATE-008 the next gate must restate no public claims
```

## Verification Expectations

```text
scripts/check-cp3-supabase-read-only-validation-design.mjs passes
scripts/check-cp3-supabase-read-only-validation-authorization-gate.mjs passes
scripts/check-review-gates.mjs passes
TypeScript noEmit passes
public data source remains mock
scoreSource=real remains blocked
CP3 source-depth production gate remains not_ready
Supabase connection remains blocked in this design slice
SQL execution remains blocked
public claims remain blocked
```
