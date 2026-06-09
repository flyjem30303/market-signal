# TWII Candidate Acceptance Decision Gate

Updated: 2026-06-09

Status: `twii_candidate_acceptance_decision_gate_ready_local_only`

## Purpose

This gate gives PM/CEO a local-only decision surface after aggregate readback is ready.

It can decide whether the aggregate-only TWII candidate shape is ready for a later bounded data acceptance route. It does not write or accept production data.

## Commands

```powershell
cmd.exe /c npm run report:twii-candidate-acceptance-decision-gate
cmd.exe /c npm run check:twii-candidate-acceptance-decision-gate
```

## Decision Output

Blocked state:

```text
twii_candidate_acceptance_decision_gate_blocked_aggregate_readback_not_ready
```

Ready state:

```text
twii_candidate_acceptance_decision_gate_ready_for_later_bounded_data_acceptance_route
```

Ready does not mean row coverage is scored, `daily_prices` is mutated, or runtime source is promoted.

## Acceptance Preconditions

Before any future data acceptance route, PM/CEO still needs:

- separate source-rights acceptance;
- bounded execution authorization;
- no-secret post-run review;
- aggregate-only readback;
- explicit no-row-coverage-scoring boundary until scoring gate;
- explicit no-public-promotion boundary until runtime promotion gate.

## Stop Line

No remote TWII probe, market-data retrieval, market-data ingestion, Supabase connection/read/write, SQL, staging row creation, production `daily_prices` mutation, source payload output, secret output, row coverage point award, public source promotion, or `scoreSource=real` occurred.
