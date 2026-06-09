# TWII Write Gate Runner Boundary

Updated: 2026-06-10

Status: `twii_write_gate_runner_boundary_ready_local_only`

## Purpose

This boundary defines what a future TWII write runner must prove before it can be considered for real execution.

It is local-only. It does not create the runner, execute SQL, connect to Supabase, write Supabase, fetch market data, mutate `daily_prices`, accept candidate rows, score row coverage, promote public source, or set `scoreSource=real`.

## Required Runner Boundary

A future runner must fail closed unless all of these are true:

- a validated `twii_supabase_write_gate_packet` is provided;
- `execute=true` is present;
- a separate confirmation phrase exactly matches the future authorization packet;
- service-role credential is server-only and never printed;
- public Supabase URL is treated as configuration and never logged with secrets;
- rollback dry-run is available before mutation;
- post-write aggregate readback path is named;
- post-write review command is named;
- target is `daily_prices`;
- target lane is `TWII`;
- target scope is `twii_index_daily_prices_missing_rows`;
- maximum rows is exactly 60;
- duplicate policy is `reject_duplicates`;
- promotion and row coverage scoring are blocked in the same run.

## Credential Handling

The future runner may check credential presence only as boolean flags. It must not output credential values, token fragments, project URLs with secret parameters, service-role material, raw payloads, row payloads, or stock-id payloads.

Credential requirements for a future real write runner:

- browser-readable variables must never include service-role material;
- service-role material must be server-only;
- credential values must be redacted before any JSON report, log, error, review, or artifact output;
- failure output must include safe problem codes only.

## Rollback / Readback / Review Boundary

Before any mutation, a future runner must prove rollback dry-run scope and target aggregate readback shape. After any future write, a separate post-write review must inspect only aggregate counts:

- attempted rows;
- inserted rows;
- rejected rows;
- duplicate rows;
- target scope;
- target table;
- post-write max trade date;
- source-rights reference;
- field-contract reference;
- asset-mapping reference.

## Current Stop Line

Current status is only `runner_boundary_ready_local_only`. The write runner is not executable now. A later explicit chairman/CEO/PM authorization, credential handling check, runner implementation review, rollback dry-run, post-write readback gate, and post-write review gate remain required.

