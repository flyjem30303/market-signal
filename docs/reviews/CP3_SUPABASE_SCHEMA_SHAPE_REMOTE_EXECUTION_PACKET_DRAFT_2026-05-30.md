# CP3 Supabase Schema-Shape Remote Execution Packet Draft

Date: 2026-05-30

Status: `CP3 Supabase schema-shape remote execution packet draft recorded`

Decision: `DRAFT_FOR_REVIEW_ONLY_NOT_EXECUTION_APPROVAL`

## Scope

This packet is prepared for CEO and chairman review of a future schema-shape read-only execution. It does not approve remote execution, does not connect to Supabase, does not inspect remote field names, does not read remote rows, does not set the confirmation variable, does not run `scripts/validate-supabase-schema-shape-readonly.mjs`, does not run SQL, does not write Supabase, does not modify `.env.local`, does not fetch or ingest market data, does not commit row payloads, does not set `scoreSource=real`, does not promote CP3 readiness, and does not approve public claims.

## Exact Command Under Review

```text
COMMAND-001 exact command under review: direct-node schema-shape read-only validator
COMMAND-002 command target is scripts\validate-supabase-schema-shape-readonly.mjs
COMMAND-003 confirmation variable is SUPABASE_SCHEMA_SHAPE_READONLY_CONFIRMATION
COMMAND-004 required confirmation value is CP3_SUPABASE_SCHEMA_SHAPE_READONLY_REMOTE_VALIDATE
COMMAND-005 command must be run at most once in a later execution slice
COMMAND-006 command must be process-scoped and must not modify .env.local
COMMAND-007 command must not be run by scripts/check-review-gates.mjs
COMMAND-008 command must not be run in this packet draft slice
```

Proposed later command shape for review:

```powershell
$keys=@('NEXT_PUBLIC_SUPABASE_URL','NEXT_PUBLIC_SUPABASE_ANON_KEY','SUPABASE_SERVICE_ROLE_KEY');
Get-Content .env.local | ForEach-Object {
  if ($_ -match '^\s*([^#][^=]+?)=(.*)\s*$') {
    $name=$matches[1].Trim();
    $value=$matches[2].Trim();
    if ($keys -contains $name) {
      Set-Item -Path "Env:$name" -Value $value
    }
  }
};
$env:SUPABASE_SCHEMA_SHAPE_READONLY_CONFIRMATION='CP3_SUPABASE_SCHEMA_SHAPE_READONLY_REMOTE_VALIDATE';
& 'C:\Program Files\nodejs\node.exe' scripts\validate-supabase-schema-shape-readonly.mjs
```

The command shape above is not executed in this slice.

## Current Skeleton Safety Evidence

```text
EVIDENCE-001 scripts/validate-supabase-schema-shape-readonly.mjs exists
EVIDENCE-002 scripts/check-cp3-supabase-schema-shape-readonly-validator-skeleton.mjs passes
EVIDENCE-003 scripts/check-cp3-supabase-schema-shape-readonly-validator-skeleton-role-review.mjs passes
EVIDENCE-004 scripts/check-review-gates.mjs checks only the skeleton safety checker
EVIDENCE-005 scripts/check-review-gates.mjs does not execute scripts/validate-supabase-schema-shape-readonly.mjs
EVIDENCE-006 validator has no @supabase/supabase-js import
EVIDENCE-007 validator has no createClient call
EVIDENCE-008 validator has no from, select, insert, update, upsert, delete, rpc, storage, SQL, fetch, or file-write path
EVIDENCE-009 validator exits blocked by default
EVIDENCE-010 validator reports connection not_run by default
EVIDENCE-011 validator reports rowLimit 0
EVIDENCE-012 validator reports guard flags false
```

## Required Human Confirmation Language

```text
HUMAN-CONFIRM-001 CEO must state: I authorize one bounded Supabase schema-shape read-only validation run.
HUMAN-CONFIRM-002 CEO must state: The exact command target is scripts\validate-supabase-schema-shape-readonly.mjs.
HUMAN-CONFIRM-003 CEO must state: The confirmation variable is SUPABASE_SCHEMA_SHAPE_READONLY_CONFIRMATION.
HUMAN-CONFIRM-004 CEO must state: The confirmation value is CP3_SUPABASE_SCHEMA_SHAPE_READONLY_REMOTE_VALIDATE.
HUMAN-CONFIRM-005 CEO must state: No SQL, writes, seed SQL, market-data fetch, row payloads, or scoreSource=real is authorized.
HUMAN-CONFIRM-006 CEO must state: Secrets, key prefixes, key suffixes, key lengths, and row values must not be printed.
HUMAN-CONFIRM-007 CEO must state: Schema-shape evidence does not prove data quality, freshness, historical depth, model credibility, public claims, or CP3 readiness.
HUMAN-CONFIRM-008 CEO must state: CP3 remains not_ready after the run until post-run role review.
HUMAN-CONFIRM-009 Chairman review may be oral and delegated to CEO execution after CEO summary.
HUMAN-CONFIRM-010 If any confirmation sentence is absent, remote execution remains blocked.
```

## Expected Sanitized Output

```text
OUTPUT-001 status: ok | blocked
OUTPUT-002 mode: schema_shape_readonly_skeleton | schema_shape_readonly_remote_validation
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

## Stop Conditions

```text
STOP-001 stop if any environment value would be printed
STOP-002 stop if any key prefix, key suffix, or key length would be printed
STOP-003 stop if any row payload or sample row would be printed
STOP-004 stop if rowLimit is greater than 0
STOP-005 stop if any insert, update, upsert, delete, rpc, storage, SQL, migration, or seed path is required
STOP-006 stop if any file containing remote data would be written
STOP-007 stop if .env.local would be modified
STOP-008 stop if market-data fetch, parse, ingestion, or raw market-data commit is required
STOP-009 stop if scoreSource=real would be set
STOP-010 stop if source-depth production readiness would be promoted
STOP-011 stop if CP3 readiness would be promoted
STOP-012 stop if public claims or production-ready wording would be implied
STOP-013 stop if the command target differs from scripts\validate-supabase-schema-shape-readonly.mjs
STOP-014 stop if more than one attempt is required
STOP-015 stop if aggregate review gates would execute the remote validator
```

## Explicitly Not Approved By This Draft

```text
NOT-APPROVED-001 no Supabase connection
NOT-APPROVED-002 no remote schema-shape validation
NOT-APPROVED-003 no remote field-name inspection
NOT-APPROVED-004 no remote row reads
NOT-APPROVED-005 no SQL execution
NOT-APPROVED-006 no SQL migration
NOT-APPROVED-007 no Supabase writes
NOT-APPROVED-008 no insert, update, upsert, delete, RPC, or storage writes
NOT-APPROVED-009 no staging rows
NOT-APPROVED-010 no daily_prices writes
NOT-APPROVED-011 no seed SQL
NOT-APPROVED-012 no market-data fetch
NOT-APPROVED-013 no market-row parsing
NOT-APPROVED-014 no raw market rows committed
NOT-APPROVED-015 no environment values printed
NOT-APPROVED-016 no key prefixes, key suffixes, or key lengths printed
NOT-APPROVED-017 no row payloads printed
NOT-APPROVED-018 no .env.local modification
NOT-APPROVED-019 no scoreSource=real
NOT-APPROVED-020 no source-depth readiness promotion
NOT-APPROVED-021 no CP3 readiness promotion
NOT-APPROVED-022 no public claims
```

## CEO Synthesis

This packet moves the project from a guarded local skeleton toward a reviewable schema-shape execution decision. It is still a draft and does not authorize a run. The next useful slice is role review of this packet draft, with special attention to whether the command target, one-attempt rule, sanitized output categories, and stop conditions are precise enough for a later execution gate.

## Next Slice Recommendation

```text
NEXT-SLICE-001 perform role review of this schema-shape remote execution packet draft
NEXT-SLICE-002 verify the packet does not itself approve remote execution
NEXT-SLICE-003 verify the packet names the exact command target and confirmation variable
NEXT-SLICE-004 verify the packet includes required human confirmation language
NEXT-SLICE-005 verify the packet includes expected sanitized output categories
NEXT-SLICE-006 verify the packet includes stop conditions for secrets, row payloads, SQL, writes, market data, and scoreSource=real
NEXT-SLICE-007 keep public data source mock
NEXT-SLICE-008 keep scoreSource=real blocked
NEXT-SLICE-009 keep CP3 not_ready
NEXT-SLICE-010 keep Supabase connection blocked until a later execution decision gate
```

## Verification Expectations

```text
scripts/check-cp3-supabase-schema-shape-remote-execution-packet-draft.mjs passes
scripts/check-cp3-supabase-schema-shape-readonly-validator-skeleton-role-review.mjs passes
scripts/check-cp3-supabase-schema-shape-readonly-validator-skeleton.mjs passes
scripts/check-review-gates.mjs passes
TypeScript noEmit passes
No Supabase connection is made
No remote validation is executed
No SQL is executed
No Supabase write occurs
No market data is fetched or ingested
public data source remains mock
scoreSource=real remains blocked
CP3 remains not_ready
public claims remain blocked
```
