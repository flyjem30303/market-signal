# CP3 Supabase Read-Only Remote-Run Approval Gate Draft

Checkpoint: CP3 Model Credibility
Date: 2026-05-30
Trigger: Supabase read-only remote-run approval packet draft role review accepted

Status: CP3 Supabase read-only remote-run approval gate draft recorded

## CEO Gate Decision

```text
CONDITIONALLY_APPROVE_REMOTE_RUN_PATH_ONLY
```

CEO records conditional approval for the project to prepare a bounded Supabase
read-only remote validation path. This gate does not execute the command, does
not connect to Supabase, and does not change the current fail-closed validator
code.

## Required CEO Confirmation Text

```text
CEO-CONFIRM-001 I authorize preparation of one bounded Supabase read-only validation run path.
CEO-CONFIRM-002 The exact command under review is npm run db:readonly-validate.
CEO-CONFIRM-003 This gate alone does not authorize command execution.
CEO-CONFIRM-004 This gate alone does not authorize adding a Supabase client.
CEO-CONFIRM-005 No SQL, writes, seed SQL, market-data fetch, or scoreSource=real is authorized.
CEO-CONFIRM-006 Secrets and row payloads must not be printed.
CEO-CONFIRM-007 CP3 source-depth production gate remains not_ready.
CEO-CONFIRM-008 Public claims and production-ready wording remain blocked.
CEO-CONFIRM-009 A later remote-capable implementation gate is required before any Supabase client is added.
CEO-CONFIRM-010 A later execution gate is required before npm run db:readonly-validate may connect to Supabase.
```

## Exact Command

```text
COMMAND-001 exact command: npm run db:readonly-validate
COMMAND-002 current implementation: node --env-file=.env.local scripts/validate-supabase-readonly.mjs
COMMAND-003 current implementation remains fail-closed
COMMAND-004 current implementation remains connection not_run
COMMAND-005 current implementation remains status blocked
COMMAND-006 current implementation remains no Supabase client
COMMAND-007 current implementation remains no remote query
COMMAND-008 current implementation remains no file writes
```

## Approval Scope

```text
SCOPE-001 may prepare a later remote-capable implementation gate
SCOPE-002 may define the future Supabase client usage boundary
SCOPE-003 may define future rowLimit 5 read-only checks
SCOPE-004 may define future redacted output retention rules
SCOPE-005 may define future operator checklist for one bounded run
SCOPE-006 may define future rollback and stop conditions
SCOPE-007 may keep current skeleton in package.json
SCOPE-008 may keep scripts/check-review-gates.mjs local-only
```

## Not Approved By This Gate

```text
NOT-APPROVED-001 do not run npm run db:readonly-validate against Supabase
NOT-APPROVED-002 do not connect to Supabase
NOT-APPROVED-003 do not add Supabase client to the validator yet
NOT-APPROVED-004 do not read remote rows
NOT-APPROVED-005 do not run SQL
NOT-APPROVED-006 do not run SQL migration
NOT-APPROVED-007 do not write Supabase
NOT-APPROVED-008 do not write staging rows
NOT-APPROVED-009 do not write daily_prices
NOT-APPROVED-010 do not create seed SQL
NOT-APPROVED-011 do not fetch market data
NOT-APPROVED-012 do not parse market rows
NOT-APPROVED-013 do not commit raw market rows
NOT-APPROVED-014 do not print environment values
NOT-APPROVED-015 do not print key prefixes, suffixes, or lengths
NOT-APPROVED-016 do not modify .env.local
NOT-APPROVED-017 do not set scoreSource=real
NOT-APPROVED-018 do not clear source-depth not_ready
NOT-APPROVED-019 do not make public claims
```

## Future Remote-Capable Implementation Gate Requirements

```text
FUTURE-IMPL-GATE-001 must name npm run db:readonly-validate
FUTURE-IMPL-GATE-002 must inspect exact code diff before Supabase client is added
FUTURE-IMPL-GATE-003 must require read-only select/count only
FUTURE-IMPL-GATE-004 must prohibit insert, update, upsert, delete, rpc, storage, SQL, migration, and seed paths
FUTURE-IMPL-GATE-005 must keep rowLimit 5
FUTURE-IMPL-GATE-006 must keep secretsPrinted false
FUTURE-IMPL-GATE-007 must keep rowPayloadsPrinted false
FUTURE-IMPL-GATE-008 must keep filesWritten false unless a separate redacted report file is approved
FUTURE-IMPL-GATE-009 must keep scoreSourceRealChanged false
FUTURE-IMPL-GATE-010 must keep sourceDepthReadyChanged false
FUTURE-IMPL-GATE-011 must keep publicClaimsChanged false
FUTURE-IMPL-GATE-012 must add a static safety checker before any remote execution
```

## Future Execution Gate Requirements

```text
FUTURE-EXEC-GATE-001 must occur after remote-capable implementation review passes
FUTURE-EXEC-GATE-002 must restate exact command npm run db:readonly-validate
FUTURE-EXEC-GATE-003 must confirm local environment values are present without printing them
FUTURE-EXEC-GATE-004 must confirm network/Supabase access is intentionally allowed for one run
FUTURE-EXEC-GATE-005 must confirm output contains redacted status only
FUTURE-EXEC-GATE-006 must confirm no raw row payloads will be printed or committed
FUTURE-EXEC-GATE-007 must confirm no SQL or write-capable operation is allowed
FUTURE-EXEC-GATE-008 must confirm public data source remains mock
FUTURE-EXEC-GATE-009 must confirm scoreSource=real remains blocked
FUTURE-EXEC-GATE-010 must confirm CP3 source-depth production gate remains not_ready
```

## CEO Synthesis

```text
This gate is the acceleration point from governance-only preparation into
implementation readiness. It intentionally approves only the path, not the
remote run. The next safe slice is a remote-capable validator implementation
gate draft that describes the exact code changes required before any Supabase
client is added.
```

## Next Slice Recommendation

```text
NEXT-SLICE-001 draft remote-capable validator implementation gate
NEXT-SLICE-002 describe exact code changes required before Supabase client is added
NEXT-SLICE-003 describe static safety checker requirements
NEXT-SLICE-004 describe redacted output only
NEXT-SLICE-005 keep current validator fail-closed
NEXT-SLICE-006 keep scripts/check-review-gates.mjs from executing the validator
NEXT-SLICE-007 keep public data source mock
NEXT-SLICE-008 keep scoreSource=real blocked
```

## Verification Expectations

```text
scripts/check-cp3-supabase-read-only-remote-run-approval-gate-draft.mjs passes
scripts/check-cp3-supabase-read-only-remote-run-approval-packet-draft-role-review.mjs passes
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
