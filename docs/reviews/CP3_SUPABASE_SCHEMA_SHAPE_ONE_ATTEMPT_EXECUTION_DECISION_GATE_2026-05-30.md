# CP3 Supabase Schema-Shape One-Attempt Execution Decision Gate

Date: 2026-05-30

Status: `CP3 Supabase schema-shape one-attempt execution decision gate recorded`

Decision: `AUTHORIZE_SCHEMA_SHAPE_ONE_ATTEMPT_PATH_AFTER_REMOTE_CAPABLE_IMPLEMENTATION_GATE`

## Scope

This decision gate authorizes only the preparation of a future one-attempt schema-shape read-only validation path after a separately approved remote-capable implementation gate. It does not execute the validator, does not connect to Supabase, does not inspect remote field names, does not read remote rows, does not set the confirmation variable, does not run `scripts/validate-supabase-schema-shape-readonly.mjs`, does not run SQL, does not modify `.env.local`, does not write Supabase, does not ingest market data, does not commit row payloads, does not set `scoreSource=real`, does not approve public claims, and does not promote CP3 readiness.

## Authorization Basis

- Chairman delegated oral review authority to the CEO.
- CEO uses that delegated authority only for the narrow schema-shape read-only validation path.
- The schema-shape remote execution packet draft role review accepted the packet as input for a formal decision gate.
- The current validator remains a fail-closed skeleton and has no Supabase client.
- The current aggregate review gate checks safety artifacts only and does not execute the validator.
- Object reachability evidence was previously accepted only as a narrow prerequisite, not as schema correctness.
- Local schema contract alignment still records `twse_stock_day_staging` as `needs-reconciliation`.
- `market_assets`, `model_runs`, and `data_freshness` remain `remote-only-pending-contract`.

## Authorized Future Path

The project may prepare a later remote-capable implementation gate for exactly one schema-shape read-only validation attempt if and only if that gate preserves these conditions:

- one attempt maximum
- process-scoped environment only
- no `.env.local` modification
- no aggregate review gate execution of the remote validator
- no row payload output
- no raw market data output
- no SQL execution
- no Supabase writes
- no market-data fetch or ingestion
- no `scoreSource=real`
- no CP3 readiness promotion before post-run role review

This decision gate does not authorize the actual remote validation run.

## Exact Command Target Under Future Review

Allowed command target for a later reviewed execution path:

```text
scripts\validate-supabase-schema-shape-readonly.mjs
```

Required future confirmation variable:

```text
SUPABASE_SCHEMA_SHAPE_READONLY_CONFIRMATION
```

Required future confirmation value:

```text
CP3_SUPABASE_SCHEMA_SHAPE_READONLY_REMOTE_VALIDATE
```

The command shape from the prior packet remains under review only and is not executed in this slice.

## Required Before Any Future Execution

Before any future execution slice may run the validator, the project must complete:

- this decision gate checker
- schema-shape remote execution packet draft checker
- schema-shape remote execution packet draft role review checker
- schema-shape validator skeleton checker
- schema-shape validator skeleton role review checker
- a separate remote-capable implementation gate checker
- a separate remote-capable implementation role review checker
- immediate pre-execution check in the same execution slice
- TypeScript check
- full review gate

If any required check fails, the future execution remains blocked.

## Success Handling For A Later Reviewed Run

If a later reviewed one-attempt run succeeds and returns acceptable sanitized JSON, do not promote CP3 readiness immediately. Create a post-run review document first, redact sensitive output, summarize only safe status fields, and decide any follow-up only after role review.

## Failure Handling For A Later Reviewed Run

If a later reviewed run is blocked, fails, returns malformed output, returns access denied, times out, exposes unexpected output, prints secrets, prints row payloads, requires SQL, requires writes, or requires market data, stop. Create a post-run review document and keep CP3 as `not_ready`.

## Still Blocked

- Immediate execution is blocked.
- Supabase connection is blocked.
- Remote schema-shape validation is blocked.
- Remote field-name inspection is blocked.
- Remote row reads are blocked.
- More than one attempt is blocked.
- Background retry loops are blocked.
- Aggregate review gate remote execution is blocked.
- SQL execution is blocked.
- Migration execution is blocked.
- Insert, update, upsert, delete, RPC, and storage writes are blocked.
- Supabase writes are blocked.
- Staging writes are blocked.
- `daily_prices` writes are blocked.
- Seed SQL is blocked.
- Market-data fetch, parse, ingestion, and raw market-data commit are blocked.
- `.env.local` modification is blocked.
- Dependency install is blocked.
- Environment values, key prefixes, key suffixes, key lengths, and row payloads are blocked from output.
- Public data source remains mock.
- `scoreSource=real` remains blocked.
- Source-depth production gate remains blocked.
- CP3 remains `not_ready`.
- Public market-data claims remain blocked.

## CEO Decision

CEO authorizes the PM and Engineering roles to prepare the next remote-capable implementation gate for a future one-attempt schema-shape read-only validation path. CEO does not authorize execution in this slice. CEO does not authorize adding Supabase writes, SQL, ingestion, public claims, or readiness promotion. Any future run must remain one-attempt, read-only, sanitized, post-reviewed, and reversible.

## PM Execution Notes

- Execute no remote validation inside this decision-gate slice.
- Do not add a Supabase client in this decision-gate slice.
- Do not set `SUPABASE_SCHEMA_SHAPE_READONLY_CONFIRMATION` in this decision-gate slice.
- Draft the remote-capable implementation gate next.
- Require the implementation gate to prove write methods, SQL, file writes, raw market data, and secret output remain blocked.
- Keep `scripts/check-review-gates.mjs` from executing the validator.
- Capture only sanitized status in any later post-run review.
- Do not commit secrets, row payloads, raw market data, or unreviewed validator output.

## Verification Expectations

- `scripts/check-cp3-supabase-schema-shape-one-attempt-execution-decision-gate.mjs` passes.
- `scripts/check-cp3-supabase-schema-shape-remote-execution-packet-draft-role-review.mjs` passes.
- `scripts/check-cp3-supabase-schema-shape-remote-execution-packet-draft.mjs` passes.
- `scripts/check-cp3-supabase-schema-shape-readonly-validator-skeleton.mjs` passes.
- Review gates pass.
- TypeScript check passes.
- No Supabase connection is made.
- No remote validation is executed.
- No SQL is executed.
- No Supabase write occurs.
- Public data source remains mock.
- `scoreSource=real` remains blocked.
- CP3 remains `not_ready` before post-run review.
