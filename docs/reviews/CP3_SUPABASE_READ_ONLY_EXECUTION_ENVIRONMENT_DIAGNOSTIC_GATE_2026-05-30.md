# CP3 Supabase Read-Only Execution Environment Diagnostic Gate

Checkpoint: CP3 Model Credibility
Date: 2026-05-30
Trigger: one-run Supabase read-only checkpoint blocked with Access is denied

Status: CP3 Supabase read-only execution-environment diagnostic gate recorded

## Gate Decision

```text
APPROVE_LOCAL_ONLY_EXECUTION_ENVIRONMENT_DIAGNOSTICS
```

This gate approves local-only diagnostics to isolate why the attempted
Supabase read-only validator run returned `Access is denied`. It does not
approve another Supabase remote validation run, does not connect to Supabase,
does not run SQL, and does not approve any write path.

## Diagnostic Scope

```text
SCOPE-001 inspect PowerShell command composition without printing secret values
SCOPE-002 inspect npm and node command availability
SCOPE-003 inspect validator default fail-closed execution without confirmation
SCOPE-004 inspect .env.local key names only, not values
SCOPE-005 inspect environment-variable loading mechanics with present or missing states only
SCOPE-006 inspect whether Access is denied is caused before validator JSON can be produced
SCOPE-007 inspect command quoting and PowerShell environment assignment behavior
SCOPE-008 inspect local file permissions for project scripts without changing them
SCOPE-009 document findings before any new remote-capable attempt
```

## Explicitly Out Of Scope

```text
OUT-OF-SCOPE-001 no Supabase remote validation retry
OUT-OF-SCOPE-002 no confirmation-enabled validator run
OUT-OF-SCOPE-003 no Supabase connection
OUT-OF-SCOPE-004 no SQL execution
OUT-OF-SCOPE-005 no SQL migration
OUT-OF-SCOPE-006 no Supabase writes
OUT-OF-SCOPE-007 no insert update upsert delete
OUT-OF-SCOPE-008 no RPC calls
OUT-OF-SCOPE-009 no storage calls
OUT-OF-SCOPE-010 no market-data fetch
OUT-OF-SCOPE-011 no market-row parsing
OUT-OF-SCOPE-012 no raw market rows committed
OUT-OF-SCOPE-013 no .env.local modification
OUT-OF-SCOPE-014 no dependency install
OUT-OF-SCOPE-015 no scoreSource=real
OUT-OF-SCOPE-016 no CP3 source-depth readiness promotion
OUT-OF-SCOPE-017 no public claims
```

## Redaction Rules

```text
REDACTION-001 do not print NEXT_PUBLIC_SUPABASE_URL value
REDACTION-002 do not print NEXT_PUBLIC_SUPABASE_ANON_KEY value
REDACTION-003 do not print SUPABASE_SERVICE_ROLE_KEY value
REDACTION-004 do not print key prefixes
REDACTION-005 do not print key suffixes
REDACTION-006 do not print key lengths
REDACTION-007 do not print row payloads
REDACTION-008 report only present or missing for required environment names
REDACTION-009 report only command availability and exit status for local tooling
```

## Allowed Diagnostic Commands

```text
ALLOW-001 run node scripts/validate-supabase-readonly.mjs without confirmation
ALLOW-002 run npm --version
ALLOW-003 run node --version
ALLOW-004 list .env.local key names only
ALLOW-005 test environment-variable loading into the current process using present or missing output only
ALLOW-006 inspect package.json script name for db:readonly-validate
ALLOW-007 inspect validator source for forbidden write, SQL, RPC, storage, fetch, and secret-output paths
ALLOW-008 inspect file metadata for scripts/validate-supabase-readonly.mjs
ALLOW-009 run local static checkers and TypeScript
ALLOW-010 run scripts/check-review-gates.mjs
```

## Stop Conditions

```text
STOP-001 stop if a diagnostic would print secret values
STOP-002 stop if a diagnostic would print key prefix suffix or length
STOP-003 stop if a diagnostic would print row payloads
STOP-004 stop if a diagnostic would connect to Supabase
STOP-005 stop if a diagnostic would set SUPABASE_READONLY_VALIDATE_CONFIRMATION
STOP-006 stop if a diagnostic would run npm run db:readonly-validate with confirmation
STOP-007 stop if a diagnostic would execute SQL or mutate data
STOP-008 stop if local static gates fail
```

## Required Diagnostic Report

```text
REPORT-001 record whether validator fail-closed JSON is produced locally
REPORT-002 record whether npm and node are available
REPORT-003 record whether required env names can be parsed as present without values
REPORT-004 record whether Access is denied is reproduced by a no-remote command
REPORT-005 record whether the issue appears to be command composition, shell policy, npm wrapper, node import, or validator runtime
REPORT-006 record whether a future remote retry is safe, blocked, or needs more local diagnostics
REPORT-007 record that no Supabase evidence is produced by this diagnostic gate
```

## Role Review

```text
CEO-FINDING-001 this gate keeps acceleration focused without repeating a remote attempt
CEO-FINDING-002 runtime readiness must not be promoted from diagnostics
PM-FINDING-001 the diagnostic slice is bounded and reviewable
PM-FINDING-002 next retry decision depends on a written diagnostic report
ENGINEERING-FINDING-001 diagnostic commands isolate shell, npm, node, env loading, and validator default behavior
ENGINEERING-FINDING-002 the validator remains guarded against remote execution
QA-FINDING-001 stop conditions are explicit
DATA-FINDING-001 no object reachability or table quality evidence is produced
SECURITY-FINDING-001 redaction rules are strict enough for local diagnostics
LEGAL-FINDING-001 no public claim is created by this gate
```

## CEO Synthesis

```text
The next safe acceleration is local-only execution-environment diagnostics. The
goal is to explain Access is denied without using Supabase as the test surface.
Only after the diagnostic report passes should CEO decide whether another
read-only remote checkpoint is justified.
```

## Next Slice Recommendation

```text
NEXT-SLICE-001 run the approved local-only diagnostic checklist
NEXT-SLICE-002 record a diagnostic report
NEXT-SLICE-003 do not run confirmation-enabled validator during diagnostics
NEXT-SLICE-004 do not retry Supabase remote validation in this slice
NEXT-SLICE-005 keep public data source mock
NEXT-SLICE-006 keep scoreSource=real blocked
NEXT-SLICE-007 keep CP3 source-depth production gate not_ready
```

## Verification Expectations

```text
scripts/check-cp3-supabase-read-only-execution-environment-diagnostic-gate.mjs passes
scripts/check-cp3-supabase-read-only-one-run-post-run-review.mjs passes
scripts/check-cp3-supabase-read-only-validator-skeleton.mjs passes
scripts/check-review-gates.mjs passes
TypeScript noEmit passes
Supabase remote validation retry remains blocked
SQL execution remains blocked
Supabase writes remain blocked
public data source remains mock
scoreSource=real remains blocked
CP3 source-depth production gate remains not_ready
public claims remain blocked
```
