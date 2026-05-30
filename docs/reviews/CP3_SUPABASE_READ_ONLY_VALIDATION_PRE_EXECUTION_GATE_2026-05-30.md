# CP3 Supabase Read-Only Validation Pre-Execution Gate

Checkpoint: CP3 Model Credibility
Date: 2026-05-30
Trigger: CP3 Supabase read-only validation design recorded

Status: CP3 Supabase read-only validation pre-execution gate recorded

## CEO Decision

```text
PREPARE_REMOTE_READ_ONLY_VALIDATION_ONLY
```

CEO approves the project to prepare a bounded remote read-only validation
execution path, but this gate does not run the command and does not authorize
Codex to connect to Supabase in this slice.

## Exact Future Command

```text
COMMAND-001 future command: npm run db:readonly-validate
COMMAND-002 command must be implemented as a read-only validator before any remote run
COMMAND-003 command must fail closed unless explicit remote execution approval is recorded
COMMAND-004 command must not run automatically from the aggregate review gate
COMMAND-005 command must not run during build, test, lint, or local page rendering
COMMAND-006 command must not be called by scripts/check-review-gates.mjs
COMMAND-007 command must produce redacted JSON output only
COMMAND-008 command must exit non-zero when required environment names are missing
```

## Expected Output Fields

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

## Approved Preparation Scope

```text
PREP-SCOPE-001 may add a local validator skeleton
PREP-SCOPE-002 may add package.json script name for the future command
PREP-SCOPE-003 may add local static safety checker for the validator
PREP-SCOPE-004 may check source code for blocked write-capable Supabase methods
PREP-SCOPE-005 may document expected redacted output
PREP-SCOPE-006 may document operator steps for a later remote run
PREP-SCOPE-007 may keep aggregate review gate local-only
PREP-SCOPE-008 may keep public data source mock
```

## Blocked In This Slice

```text
BLOCKED-NOW-001 do not run npm run db:readonly-validate
BLOCKED-NOW-002 do not connect to Supabase
BLOCKED-NOW-003 do not read remote rows
BLOCKED-NOW-004 do not run SQL
BLOCKED-NOW-005 do not run SQL migration
BLOCKED-NOW-006 do not write Supabase
BLOCKED-NOW-007 do not write staging rows
BLOCKED-NOW-008 do not write daily_prices
BLOCKED-NOW-009 do not create seed SQL
BLOCKED-NOW-010 do not fetch market data
BLOCKED-NOW-011 do not parse market rows
BLOCKED-NOW-012 do not print environment values
BLOCKED-NOW-013 do not print key prefixes
BLOCKED-NOW-014 do not print key suffixes
BLOCKED-NOW-015 do not print key length
BLOCKED-NOW-016 do not write .env.local
BLOCKED-NOW-017 do not commit any environment file
BLOCKED-NOW-018 do not set scoreSource=real
BLOCKED-NOW-019 do not clear source-depth not_ready
BLOCKED-NOW-020 do not make public claims
```

## Remote Run Approval Requirements

```text
REMOTE-RUN-001 a later gate must explicitly authorize running npm run db:readonly-validate
REMOTE-RUN-002 the later gate must restate the exact command
REMOTE-RUN-003 the later gate must confirm environment values are already provided locally
REMOTE-RUN-004 the later gate must confirm no environment values will be printed
REMOTE-RUN-005 the later gate must confirm the validator has no insert, update, delete, upsert, rpc, storage, or SQL path
REMOTE-RUN-006 the later gate must confirm row limit 5 or lower
REMOTE-RUN-007 the later gate must confirm output retention is allowed
REMOTE-RUN-008 the later gate must confirm no raw market rows will be committed
REMOTE-RUN-009 the later gate must confirm scoreSource=real remains blocked
REMOTE-RUN-010 the later gate must confirm CP3 source-depth production gate remains not_ready
REMOTE-RUN-011 the later gate must confirm public claims remain blocked
```

## CEO Synthesis

```text
The project should now move from documentation-only design into a bounded
local validator preparation slice. This is the right acceleration point:
fast enough to approach Supabase runtime, still controlled enough to avoid
remote reads, SQL, writes, public claims, or scoreSource=real before the
validator is statically reviewable.
```

## Next Implementation Slice

```text
NEXT-SLICE-001 implement local validator skeleton for npm run db:readonly-validate
NEXT-SLICE-002 validator default mode must be dry-run blocked without remote execution approval
NEXT-SLICE-003 validator must only report environment presence and planned object names locally
NEXT-SLICE-004 validator must not import or instantiate Supabase client in default local-only mode
NEXT-SLICE-005 add static checker proving blocked write methods and secret printing are absent
NEXT-SLICE-006 keep scripts/check-review-gates.mjs local-only
NEXT-SLICE-007 keep scoreSource=real blocked
NEXT-SLICE-008 keep public data source mock
```

## Verification Expectations

```text
scripts/check-cp3-supabase-read-only-validation-pre-execution-gate.mjs passes
scripts/check-cp3-supabase-read-only-validation-design.mjs passes
scripts/check-cp3-supabase-read-only-validation-authorization-gate.mjs passes
scripts/check-review-gates.mjs passes
TypeScript noEmit passes
public data source remains mock
scoreSource=real remains blocked
CP3 source-depth production gate remains not_ready
Supabase connection remains blocked in this slice
SQL execution remains blocked
public claims remain blocked
```
