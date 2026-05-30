# CP3 Supabase Read-Only One-Attempt Direct-Node Execution Decision Gate

Date: 2026-05-30

Status: `CP3 Supabase read-only one-attempt direct-node execution decision gate recorded`

Decision: `AUTHORIZE_ONE_ATTEMPT_DIRECT_NODE_READ_ONLY_RETRY_AFTER_PRECHECKS`

## Scope

This decision gate authorizes only the next slice to perform one process-scoped direct-node read-only retry after immediate pre-execution checks pass. This document does not execute the retry, does not connect to Supabase, does not run SQL, does not modify `.env.local`, does not write Supabase, does not ingest market data, and does not promote readiness.

## Authorization Basis

- Chairman delegated oral review authority to the CEO.
- CEO is using that delegated authority only for the narrow read-only validation retry path.
- Prior exact direct-node command gate role review accepted the command shape for execution-decision use.
- Prior diagnostics did not produce accepted remote readiness evidence and did not justify broad execution.
- The next action remains bounded to one read-only object-reachability attempt.

## Authorized Next-Slice Action

The next slice may execute exactly one process-scoped direct-node read-only retry if and only if immediate pre-execution checks pass in the same slice.

Allowed command shape:

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
$env:SUPABASE_READONLY_VALIDATE_CONFIRMATION='CP3_SUPABASE_READONLY_REMOTE_VALIDATE';
& 'C:\Program Files\nodejs\node.exe' scripts\validate-supabase-readonly.mjs
```

## Required Pre-Execution Checks

Immediately before any future execution, the operator must run:

- `scripts/check-cp3-supabase-read-only-exact-direct-node-retry-command-gate.mjs`
- `scripts/check-cp3-supabase-read-only-exact-direct-node-retry-command-gate-role-review.mjs`
- `scripts/check-cp3-supabase-read-only-one-attempt-direct-node-execution-decision-gate.mjs`
- `scripts/check-cp3-supabase-read-only-validator-skeleton.mjs`
- TypeScript check

If any pre-execution check fails, the retry remains blocked.

## Success Handling

If the one retry exits successfully and returns acceptable JSON evidence, do not promote CP3 readiness immediately. Create a post-run review document first, redact any sensitive output, and decide status only after role review.

## Failure Handling

If the retry fails, is blocked, returns malformed output, returns access denied, times out, or exposes unexpected output, stop. Create a post-run review document and keep CP3 as `not_ready` until reviewed.

## Still Blocked

- More than one retry is blocked.
- Background retry loop is blocked.
- Aggregate review gate remote execution is blocked.
- SQL execution is blocked.
- Migration execution is blocked.
- Insert, update, upsert, delete, RPC, and storage writes are blocked.
- Supabase writes are blocked.
- Market-data fetch, parse, ingestion, and raw market-data commit are blocked.
- `.env.local` modification is blocked.
- Dependency install is blocked.
- Public data source remains mock.
- `scoreSource=real` remains blocked.
- Source-depth production gate remains blocked.
- Public market-data claims remain blocked.

## CEO Decision

CEO authorizes the next slice to attempt exactly one direct-node read-only validation run, only after the required local pre-execution checks pass. This decision is narrow, reversible, and does not authorize SQL, writes, ingestion, public claims, or readiness promotion.

## PM Execution Notes

- Execute no retry inside this decision-gate slice.
- In the next execution slice, run the pre-execution checks first.
- Execute at most one retry.
- Capture only sanitized outcome status in the follow-up review.
- Do not commit secrets, row payloads, raw market data, or unreviewed validator output.

## Verification Expectations

- This decision gate checker passes.
- Exact command gate checker passes.
- Exact command gate role review checker passes.
- Validator skeleton checker passes.
- Review gates pass.
- TypeScript check passes.
- Remote retry is authorized only for the next execution slice, not this slice.
- SQL and writes remain blocked.
- Public data source remains mock.
- `scoreSource=real` remains blocked.
- CP3 remains `not_ready` before post-run review.
