# TW Equity Write Runner Implementation Gate

Updated: 2026-06-06

Status: `tw_equity_write_runner_implementation_gate_ready_fail_closed_skeleton_created`.

## Purpose

This gate defines the implementation boundary for the future `scripts/run-tw-equity-staging-write-once.mjs` runner. It inherits `docs/TW_EQUITY_ACTUAL_BOUNDED_STAGING_WRITE_AUTHORIZATION_PACKET.md` and `docs/TW_EQUITY_WRITE_RUNNER_FAIL_CLOSED_DESIGN.md`.

This gate now permits a fail-closed runner skeleton at `scripts/run-tw-equity-staging-write-once.mjs`. The skeleton is not a write execution implementation. It prints sanitized JSON only and refuses execution because no Supabase write implementation exists yet.

## Allowed Future Skeleton Scope

The accepted implementation may create `scripts/run-tw-equity-staging-write-once.mjs` only as a fail-closed runner skeleton.

The skeleton must:

- default to no Supabase connection;
- default to no SQL;
- default to no file write;
- default to no market-data fetch;
- default to no market-data ingestion;
- default to no secret output;
- default to no service-role key output;
- default to no source payload output;
- keep public data-source posture mock-equivalent;
- keep `scoreSource` as `mock`;
- refuse execution unless the exact authorization id matches;
- refuse execution unless the exact command arguments match;
- refuse retry unless a new authorization exists;
- refuse public redistribution;
- refuse public promotion;
- refuse row coverage points;
- refuse score-source promotion.

## Required Skeleton Safety Checker

If the future runner skeleton is created, a dedicated checker must prove:

- exact runner path exists;
- no Supabase client import appears;
- no environment secret is printed;
- no network fetch appears unless a later execution gate explicitly authorizes it;
- no SQL string execution appears unless a later execution gate explicitly authorizes it;
- no filesystem write appears unless a later execution gate explicitly authorizes it;
- no source payload output appears;
- no service-role key output appears;
- default public data-source posture remains mock-equivalent;
- default `scoreSource` remains `mock`;
- no staging row write can occur without the exact authorization id;
- no production `daily_prices` mutation can occur.

## Current Implementation Decision

CEO decision: create the fail-closed runner skeleton in this GOAL, but do not create a runnable write execution implementation.

Reason: the actual bounded staging write authorization packet is reconciled to the canonical local staging objects, but execution is still blocked because the runner intentionally has no write implementation. The skeleton preserves the exact command contract while preventing accidental writes.

## Next Executable Stage

The next executable stage is a separate "one actual bounded staging write implementation and execution" GOAL. It must explicitly authorize execution and must include immediate post-run review.
