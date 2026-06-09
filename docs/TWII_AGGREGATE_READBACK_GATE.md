# TWII Aggregate Readback Gate

Updated: 2026-06-09

Status: `twii_aggregate_readback_gate_ready_local_only`

## Purpose

This gate converts the TWII report-only local runner post-run review into an aggregate-only readback summary for PM/CEO.

It does not read Supabase, run SQL, fetch market data, write staging rows, mutate `daily_prices`, create candidate artifacts, award row coverage points, promote public source, or set `scoreSource=real`.

## Commands

```powershell
cmd.exe /c npm run report:twii-aggregate-readback-gate
cmd.exe /c npm run check:twii-aggregate-readback-gate
```

## Result Meaning

If the local runner post-run review is blocked, this gate returns:

```text
twii_aggregate_readback_gate_blocked_local_runner_not_complete
```

If the local runner post-run review completed, this gate returns:

```text
twii_aggregate_readback_gate_ready_for_candidate_acceptance_review
```

Ready only means PM/CEO may review aggregate counts for a later candidate acceptance decision. It does not accept data rows or score coverage.

## Stop Line

No remote TWII probe, market-data retrieval, market-data ingestion, Supabase connection/read/write, SQL, staging row creation, production `daily_prices` mutation, source payload output, secret output, row coverage point award, public source promotion, or `scoreSource=real` occurred.
