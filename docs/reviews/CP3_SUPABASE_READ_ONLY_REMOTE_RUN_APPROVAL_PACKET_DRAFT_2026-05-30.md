# CP3 Supabase Read-Only Remote-Run Approval Packet Draft

Checkpoint: CP3 Model Credibility
Date: 2026-05-30
Trigger: Supabase read-only validator skeleton role review accepted

Status: CP3 Supabase read-only remote-run approval packet draft recorded

## Packet Decision State

```text
DRAFT_FOR_REVIEW_ONLY
```

This packet is prepared for CEO and chairman review. It does not approve a
remote run, does not connect to Supabase, does not read remote rows, and does
not run `npm run db:readonly-validate`.

## Exact Command Under Review

```text
COMMAND-001 exact command under review: npm run db:readonly-validate
COMMAND-002 command currently resolves to node --env-file=.env.local scripts/validate-supabase-readonly.mjs
COMMAND-003 current command output is fail-closed blocked by default
COMMAND-004 current command does not instantiate a Supabase client
COMMAND-005 current command does not query Supabase
COMMAND-006 current command does not write files
COMMAND-007 current command does not print environment values
COMMAND-008 current command does not print row payloads
```

## Current Skeleton Safety Evidence

```text
EVIDENCE-001 package.json contains db:readonly-validate script
EVIDENCE-002 scripts/validate-supabase-readonly.mjs exists
EVIDENCE-003 scripts/check-cp3-supabase-read-only-validator-skeleton.mjs passes
EVIDENCE-004 scripts/check-cp3-supabase-read-only-validator-skeleton-role-review.mjs passes
EVIDENCE-005 scripts/check-cp3-supabase-read-only-validation-pre-execution-gate.mjs passes
EVIDENCE-006 scripts/check-review-gates.mjs does not execute scripts/validate-supabase-readonly.mjs
EVIDENCE-007 validator has no @supabase/supabase-js import
EVIDENCE-008 validator has no createClient call
EVIDENCE-009 validator has no from, select, insert, update, upsert, delete, rpc, storage, SQL, or fetch path
EVIDENCE-010 validator exits blocked by default
```

## Required Human Confirmation Language

```text
HUMAN-CONFIRM-001 CEO must state: I authorize one bounded Supabase read-only validation run.
HUMAN-CONFIRM-002 CEO must state: The exact command is npm run db:readonly-validate.
HUMAN-CONFIRM-003 CEO must state: No SQL, writes, seed SQL, market-data fetch, or scoreSource=real is authorized.
HUMAN-CONFIRM-004 CEO must state: Secrets and row payloads must not be printed.
HUMAN-CONFIRM-005 CEO must state: CP3 source-depth production gate remains not_ready after the run.
HUMAN-CONFIRM-006 Chairman review may be oral and delegated to CEO execution after CEO summary.
HUMAN-CONFIRM-007 If any confirmation sentence is absent, remote execution remains blocked.
```

## Expected Redacted Output

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

## Stop Conditions

```text
STOP-001 stop if any environment value would be printed
STOP-002 stop if key prefix, key suffix, or key length would be printed
STOP-003 stop if any row payload would be printed
STOP-004 stop if rowLimit is greater than 5
STOP-005 stop if any insert, update, upsert, delete, rpc, storage, SQL, migration, or seed path is required
STOP-006 stop if any file containing remote data would be written
STOP-007 stop if .env.local would be modified
STOP-008 stop if market-data fetch or market-row parsing is required
STOP-009 stop if scoreSource=real would be set
STOP-010 stop if CP3 source-depth production gate would become ready
STOP-011 stop if public claims or production-ready wording would be implied
STOP-012 stop if the command differs from npm run db:readonly-validate
```

## Explicitly Not Approved By This Draft

```text
NOT-APPROVED-001 no Supabase connection
NOT-APPROVED-002 no remote read-only query
NOT-APPROVED-003 no remote row reads
NOT-APPROVED-004 no SQL execution
NOT-APPROVED-005 no SQL migration
NOT-APPROVED-006 no Supabase writes
NOT-APPROVED-007 no staging rows
NOT-APPROVED-008 no daily_prices writes
NOT-APPROVED-009 no seed SQL
NOT-APPROVED-010 no market-data fetch
NOT-APPROVED-011 no market-row parsing
NOT-APPROVED-012 no raw market rows committed
NOT-APPROVED-013 no environment values printed
NOT-APPROVED-014 no .env.local modification
NOT-APPROVED-015 no scoreSource=real
NOT-APPROVED-016 no source-depth readiness promotion
NOT-APPROVED-017 no public claims
```

## CEO Synthesis

```text
This packet moves the project from local skeleton readiness toward a controlled
Supabase read-only runtime decision. It is still a draft. The next decision is
whether CEO records a formal remote-run approval gate using the human
confirmation language above.
```

## Next Slice Recommendation

```text
NEXT-SLICE-001 perform role review of this remote-run approval packet draft
NEXT-SLICE-002 verify the packet does not itself approve remote execution
NEXT-SLICE-003 verify the packet names the exact command
NEXT-SLICE-004 verify the packet includes human confirmation language
NEXT-SLICE-005 verify the packet includes expected redacted output and stop conditions
NEXT-SLICE-006 keep public data source mock
NEXT-SLICE-007 keep scoreSource=real blocked
NEXT-SLICE-008 keep Supabase connection blocked until a later approval gate
```

## Verification Expectations

```text
scripts/check-cp3-supabase-read-only-remote-run-approval-packet-draft.mjs passes
scripts/check-cp3-supabase-read-only-validator-skeleton-role-review.mjs passes
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
