# CP3 Supabase Read-Only Exact Direct-Node Retry Command Gate Role Review

Date: 2026-05-30

Status: `CP3 Supabase read-only exact direct-node retry command gate role review recorded`

Decision: `ACCEPT_EXACT_DIRECT_NODE_RETRY_COMMAND_GATE_FOR_EXECUTION_DECISION`

## Scope

This role review accepts the exact direct-node retry command gate only as an execution-decision artifact. It does not approve execution, does not execute the validator, does not set confirmation, does not connect to Supabase, does not run SQL, and does not approve writes.

## Reviewed Artifacts

- `docs/reviews/CP3_SUPABASE_READ_ONLY_EXACT_DIRECT_NODE_RETRY_COMMAND_GATE_2026-05-30.md`
- `docs/reviews/CP3_SUPABASE_READ_ONLY_NARROW_REMOTE_RETRY_READINESS_GATE_ROLE_REVIEW_2026-05-30.md`
- `scripts/check-cp3-supabase-read-only-exact-direct-node-retry-command-gate.mjs`
- `scripts/check-cp3-supabase-read-only-validator-skeleton.mjs`
- `scripts/validate-supabase-readonly.mjs`
- `scripts/check-review-gates.mjs`

## Role Findings

### CEO

The command gate is acceptable for one execution decision. The exact direct-node command removes npm-wrapper ambiguity and makes the future retry auditable. Execution remains a separate decision, readiness is not promoted, and only one future attempt may be considered.

### PM

The handoff is clear enough for the next execution decision. The future retry, if approved later, must be followed by immediate post-run review. No background retry loop or unattended remote validation is approved here.

### Engineering

The direct-node path is accepted as a command shape. It must load only the three required environment variables, use process-scoped confirmation, avoid the npm wrapper, avoid aggregate review gates during the remote attempt, and make no validator behavior changes.

### QA

Pre-execution gates must run immediately before any future execution. Success, failure, malformed output, blocked output, and access-denied output all require post-run review before any status change.

### Data

The future retry can only test object reachability. It cannot promote data quality, ingestion readiness, source depth, or market coverage.

### Security

No environment values, key prefixes, key suffixes, key lengths, row payloads, or raw sensitive output may be committed. Confirmation must remain process-scoped and must not modify `.env.local`.

### Legal

No public data claim, source-depth production claim, or score-source promotion is approved. Public data source remains mock and `scoreSource=real` remains blocked.

## Accepted Boundary

- Proceed to a one-attempt execution decision gate.
- Use the direct-node command shape only if the CEO later approves execution.
- Use process-scoped confirmation only.
- Limit any future approved retry to one execution.
- Require immediate post-run review after any future attempt.
- Keep aggregate review gates local-only.
- Keep public data source mock.
- Keep `scoreSource=real` blocked.
- Keep CP3 readiness as `not_ready`.

## Still Blocked

- Remote retry is not approved in this role review.
- Confirmation-enabled validator run is not approved in this role review.
- Supabase connection is not approved in this role review.
- SQL, migration, insert, update, upsert, delete, RPC, storage, and write actions remain blocked.
- Market-data fetch, parse, ingestion, and raw market-data commit remain blocked.
- `.env.local` modification remains blocked.
- Dependency install remains blocked.
- `scoreSource=real` remains blocked.
- Source-depth production gate remains blocked.
- Public market-data claims remain blocked.

## CEO Synthesis

The exact direct-node command gate is accepted for execution-decision use. The next safe slice is an execution decision gate that either authorizes one process-scoped direct-node retry or explicitly defers it. This role review is not execution.

## Next Slice

- Draft the one-attempt direct-node execution decision gate.
- Do not execute the retry in that decision-gate draft slice.
- If the decision gate later approves execution, run pre-execution checks immediately before execution and post-run review immediately after execution.
- Keep mock, readiness, score-source, SQL, write, and public-claim boundaries unchanged.

## Verification Expectations

- Role review checker passes.
- Exact command gate checker passes.
- Validator skeleton checker passes.
- Review gates pass.
- TypeScript check passes.
- Remote retry remains blocked.
- SQL and writes remain blocked.
- Public data source remains mock.
- `scoreSource=real` remains blocked.
- CP3 remains `not_ready`.
- Public claims remain blocked.
