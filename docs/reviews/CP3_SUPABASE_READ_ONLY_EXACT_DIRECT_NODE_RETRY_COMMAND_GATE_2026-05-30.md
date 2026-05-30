# CP3 Supabase Read-Only Exact Direct-Node Retry Command Gate

Checkpoint: CP3 Model Credibility
Date: 2026-05-30
Trigger: narrow remote-retry readiness gate role review recorded

Status: CP3 Supabase read-only exact direct-node retry command gate recorded

## Gate Decision

```text
DRAFT_EXACT_DIRECT_NODE_RETRY_COMMAND_GATE
```

This gate records the exact proposed command shape for one possible future
Supabase read-only retry. It does not approve execution, does not execute the
validator, does not set the confirmation variable in this slice, does not
connect to Supabase, does not run SQL, and does not approve any write path.

## Proposed Exact Command Shape

```text
COMMAND-SHAPE-001 use direct node invocation
COMMAND-SHAPE-002 executable is C:\Program Files\nodejs\node.exe
COMMAND-SHAPE-003 script is scripts\validate-supabase-readonly.mjs
COMMAND-SHAPE-004 load only NEXT_PUBLIC_SUPABASE_URL from .env.local
COMMAND-SHAPE-005 load only NEXT_PUBLIC_SUPABASE_ANON_KEY from .env.local
COMMAND-SHAPE-006 load only SUPABASE_SERVICE_ROLE_KEY from .env.local
COMMAND-SHAPE-007 set SUPABASE_READONLY_VALIDATE_CONFIRMATION only inside the same PowerShell process
COMMAND-SHAPE-008 required confirmation value is CP3_SUPABASE_READONLY_REMOTE_VALIDATE
COMMAND-SHAPE-009 do not call npm run db:readonly-validate
COMMAND-SHAPE-010 do not call scripts/check-review-gates.mjs
COMMAND-SHAPE-011 do not persist env values
COMMAND-SHAPE-012 do not modify .env.local
COMMAND-SHAPE-013 stop after exactly one validator invocation
```

## Proposed Command Template

```text
$keys=@('NEXT_PUBLIC_SUPABASE_URL','NEXT_PUBLIC_SUPABASE_ANON_KEY','SUPABASE_SERVICE_ROLE_KEY');
Get-Content .env.local | ForEach-Object {
  if ($_ -match '^\s*([^#][^=]+)=(.*)$') {
    $name=$matches[1].Trim();
    if ($keys -contains $name) {
      $value=$matches[2].Trim();
      if (($value.StartsWith('"') -and $value.EndsWith('"')) -or ($value.StartsWith("'") -and $value.EndsWith("'"))) {
        $value=$value.Substring(1,$value.Length-2)
      };
      Set-Item -Path "Env:$name" -Value $value
    }
  }
};
$env:SUPABASE_READONLY_VALIDATE_CONFIRMATION='CP3_SUPABASE_READONLY_REMOTE_VALIDATE';
& 'C:\Program Files\nodejs\node.exe' scripts\validate-supabase-readonly.mjs
```

## Execution Status In This Slice

```text
EXECUTION-STATUS-001 command is documented only
EXECUTION-STATUS-002 command is not executed in this slice
EXECUTION-STATUS-003 confirmation variable is not set in this slice
EXECUTION-STATUS-004 Supabase is not contacted in this slice
EXECUTION-STATUS-005 no remote output is produced in this slice
EXECUTION-STATUS-006 no Supabase readiness evidence is accepted in this slice
```

## Required Before Future Execution

```text
PRE-EXEC-001 this exact command gate must pass
PRE-EXEC-002 role review of this exact command gate must pass
PRE-EXEC-003 validator safety checker must pass immediately before execution
PRE-EXEC-004 full review gate must pass immediately before execution
PRE-EXEC-005 TypeScript noEmit must pass immediately before execution
PRE-EXEC-006 git status must be reviewed immediately before execution
PRE-EXEC-007 post-run review must be the immediate next slice after execution
PRE-EXEC-008 CEO must explicitly record one-attempt execution decision
```

## Output Contract For Future Execution

```text
OUTPUT-001 validator JSON is acceptable only if produced by scripts\validate-supabase-readonly.mjs
OUTPUT-002 shell error is acceptable only as redacted status
OUTPUT-003 output must not include row payloads
OUTPUT-004 output must not include secrets
OUTPUT-005 output must not include key prefixes
OUTPUT-006 output must not include key suffixes
OUTPUT-007 output must not include key lengths
OUTPUT-008 output must not be committed before post-run review
OUTPUT-009 successful object reachability must not promote data readiness by itself
OUTPUT-010 blocked output must not be treated as progress
```

## Explicitly Not Approved

```text
NOT-APPROVED-001 execution is not approved by this gate
NOT-APPROVED-002 confirmation-enabled validator run is not approved by this gate
NOT-APPROVED-003 Supabase connection is not approved in this slice
NOT-APPROVED-004 SQL execution is not approved
NOT-APPROVED-005 SQL migration is not approved
NOT-APPROVED-006 Supabase writes are not approved
NOT-APPROVED-007 insert update upsert delete is not approved
NOT-APPROVED-008 RPC calls are not approved
NOT-APPROVED-009 storage calls are not approved
NOT-APPROVED-010 market-data fetch is not approved
NOT-APPROVED-011 market-row parsing is not approved
NOT-APPROVED-012 .env.local modification is not approved
NOT-APPROVED-013 dependency install is not approved
NOT-APPROVED-014 scoreSource=real is not approved
NOT-APPROVED-015 CP3 source-depth readiness promotion is not approved
NOT-APPROVED-016 public claims are not approved
```

## Stop Conditions

```text
STOP-001 stop if any command edit would print env values
STOP-002 stop if command would persist confirmation beyond the process
STOP-003 stop if command would invoke npm wrapper
STOP-004 stop if command would run aggregate review gates
STOP-005 stop if command would run SQL or mutate data
STOP-006 stop if validator safety checker fails
STOP-007 stop if full review gate fails
STOP-008 stop if TypeScript noEmit fails
STOP-009 stop if git status has unsafe dirty changes
STOP-010 stop if output redaction cannot be guaranteed
```

## Role Findings

```text
CEO-FINDING-001 exact command shape is now concrete enough for role review
CEO-FINDING-002 execution still requires a separate role-reviewed execution decision
PM-FINDING-001 post-run review remains the immediate next work item after any future execution
ENGINEERING-FINDING-001 direct node invocation removes npm-wrapper ambiguity
ENGINEERING-FINDING-002 env loading is limited to three required Supabase keys
ENGINEERING-FINDING-003 confirmation remains process-scoped in the proposed shape
QA-FINDING-001 one-attempt limit is explicit
DATA-FINDING-001 future output can only inform object reachability
SECURITY-FINDING-001 redaction controls remain mandatory
LEGAL-FINDING-001 no public claim is created by command drafting
```

## CEO Synthesis

```text
The exact direct-node retry command shape is drafted but not approved for
execution. The next safe slice is a role review of this command gate. If that
passes, CEO may decide whether to authorize a single execution checkpoint.
```

## Next Slice Recommendation

```text
NEXT-SLICE-001 perform role review of this exact direct-node retry command gate
NEXT-SLICE-002 do not execute the retry during role review
NEXT-SLICE-003 if role review passes, CEO decides whether to authorize one execution checkpoint
NEXT-SLICE-004 keep public data source mock
NEXT-SLICE-005 keep scoreSource=real blocked
NEXT-SLICE-006 keep CP3 source-depth production gate not_ready
NEXT-SLICE-007 keep SQL and writes blocked
```

## Verification Expectations

```text
scripts/check-cp3-supabase-read-only-exact-direct-node-retry-command-gate.mjs passes
scripts/check-cp3-supabase-read-only-narrow-remote-retry-readiness-gate-role-review.mjs passes
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
