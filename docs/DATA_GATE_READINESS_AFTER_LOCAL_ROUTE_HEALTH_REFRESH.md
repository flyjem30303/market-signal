# Data Gate Readiness After Local Route Health Refresh

Status: `data_gate_readiness_after_local_route_health_refresh_ready_source_execution_blocked`

Date: 2026-06-07

Owner: PM mainline

Support lanes: A1 Data / Supabase / Market Evidence, A2 Frontend / UX Readability / Public Copy QA, I Launch / Ops

## CEO Decision

CEO decision: `move_from_runtime_local_route_health_refresh_to_data_gate_readiness`.

The local route-health proof chain is now ready, so PM can return to the data-realification path without reopening broad launch governance. The next high-value data slice is to prepare the data gate that will decide whether the remaining Level 1 MVP coverage work can enter a bounded source-specific candidate path.

This gate is a readiness bridge. It does not run a TWII probe, does not fetch ETF data, does not create candidate artifacts, does not connect to Supabase, does not run SQL, does not write Supabase, does not create staging rows, does not mutate `daily_prices`, does not award row coverage points, and does not promote real runtime state.

Current route: `data_gate_readiness_after_local_route_health_refresh`.

Current outcome: `twii_first_data_gate_ready_execution_blocked_external_rights_pending`.

## Source Inputs

This readiness bridge is grounded in:

- `docs/RUNTIME_LOCAL_ROUTE_HEALTH_REFRESH_BEFORE_EXECUTABLE_PACKET.md`
- `docs/MVP_REMAINING_COVERAGE_EXECUTION_BRIDGE.md`
- `docs/DATA_REALIFICATION_FIRST_CLOSED_LOOP_ROLLUP.md`
- `docs/COVERAGE_UNIVERSE_ROADMAP.md`
- `docs/A1_TWII_OFFICIAL_SOURCE_INTAKE_FIELDS_OR_VENDOR_TERMS_REVIEW_PACKET.md`
- `docs/A1_TWII_INDEX_FIELD_CONTRACT_DECISION_SUPPORT.md`
- `docs/TWII_SOURCE_RIGHTS_OUTCOME_GATE.md`
- `docs/ETF_SOURCE_RIGHTS_OUTCOME_DECISION_GATE.md`
- `docs/LAUNCH_ENGINEERING_WORKSTREAM_BOARD.md`

Accepted baseline:

- Runtime route-health refresh is `runtime_local_route_health_refresh_ready_mock_boundary_preserved`.
- Level 1 MVP coverage remains `182/360`.
- TW equity first closed loop remains accepted at `180/180`.
- Remaining gap remains `178` rows.
- TWII remains `0/60`, missing `60` rows.
- ETF remains `2/120`, missing `118` rows.
- Public runtime remains `publicDataSource=mock`.
- Score source remains `scoreSource=mock`.

## Data Gate Priority

PM selects TWII as the first readiness lane after route-health refresh:

| Lane | Current state | Gate reason | Decision |
| --- | --- | --- | --- |
| TWII | `0/60`, source rights and field contract unresolved | Smallest bounded missing block; can move MVP from `182/360` to `242/360` if accepted later | first readiness lane |
| ETF | `2/120`, source rights blocked | Larger missing block; legal / redistribution terms still unresolved | keep as fallback lane |
| TW equity | `180/180`, first closed loop accepted | Already proves write/readback/post-run pattern for common-stock subset | use as precedent, not as new work |

CEO accepts this priority because it advances the GOAL toward `360/360` while preserving the safer route-health baseline and avoiding premature ETF or public-source promotion.

## TWII Readiness Requirements

Before PM may authorize any TWII remote attempt, candidate artifact generation, staging write, or `daily_prices` merge, the next data packet must prove:

1. `official-exchange-index` or an approved fallback source has accepted storage / derived-analysis rights for the intended coverage window.
2. `daily_prices` field contract is accepted for index OHLC mapping.
3. Nullable policy for `volume` and `turnover` is accepted for index rows.
4. TWII has a stable internal asset mapping for the target relation.
5. Sanitized candidate artifact shape is defined for exactly `60` expected sessions or a documented calendar exception.
6. Candidate validator rejects duplicate trade dates, missing OHLC, invalid numeric values, unexpected source id, missing asset mapping, and unauthorized source-rights state.
7. Execution path states whether it is report-only, staging-first write, or direct merge, with direct merge disfavored unless separately justified.
8. Rollback / cleanup posture is defined before mutation.
9. Post-run review path and aggregate readback proof are defined before any row coverage credit.
10. Runtime promotion remains blocked after the data action unless a separate promotion gate accepts it.

## ETF Fallback Requirements

If TWII remains externally blocked, PM may switch to ETF readiness only after recording the TWII block reason.

ETF cannot proceed until:

1. ETF source-rights outcome closes `legal_and_redistribution_terms_unapproved`.
2. ETF field contract distinguishes market-price OHLCV from NAV, premium/discount, holdings, and issuer metadata.
3. Candidate source lane is accepted for internal storage and derived validation.
4. Sanitized candidate artifact shape covers the `118` missing rows or explains the exact calendar / duplicate exception.
5. ETF candidate validation and post-run review path are defined.

## PM / A1 / A2 Routing

PM route:

- Keep this bridge as the next gate after local route-health refresh.
- Choose `twii_source_rights_and_field_contract_acceptance_or_blocked_record` as the next data decision route.
- Do not move to execution until rights, field contract, candidate artifact, rollback, and post-run review are accepted.

A1 route:

- Prepare the TWII source-rights and field-contract acceptance / blocked record.
- If TWII stays blocked, prepare the ETF source-rights fallback decision support.
- Keep all evidence sanitized and aggregate-only.

A2 route:

- Preserve public copy that says coverage is partial and runtime is mock until data / promotion gates pass.
- Do not rewrite public copy to imply TWII or ETF real coverage is available.

I route:

- No deployment or platform action is required for this data gate.
- Keep post-run rollback and incident-owner language ready for a future executable data action.

## Acceptance

PM may classify this readiness bridge as `accepted` when:

1. the focused checker passes;
2. the route-health refresh is accepted as the prerequisite;
3. TWII is selected as the first data readiness lane;
4. ETF is kept as fallback while source rights remain blocked;
5. TW equity first closed loop is referenced only as precedent;
6. `publicDataSource=mock` remains unchanged;
7. `scoreSource=mock` remains unchanged;
8. next route is `twii_source_rights_and_field_contract_acceptance_or_blocked_record`;
9. no SQL, Supabase write, market-data fetch, candidate artifact generation, `daily_prices` mutation, row coverage credit, public source promotion, or real score promotion is authorized.

## Hard Stops

This bridge does not authorize:

- SQL execution;
- Supabase connection;
- Supabase write;
- staging row creation;
- `daily_prices` mutation;
- TWII probe execution;
- ETF fetch or ingestion;
- candidate artifact generation;
- raw market-data fetch, ingest, storage, or commit;
- raw payload, row payload, stock id payload, or secret output;
- row coverage points;
- `publicDataSource=supabase`;
- `scoreSource=real`;
- public launch completion claim.

## Next Route

The next route is `twii_source_rights_and_field_contract_acceptance_or_blocked_record`.

If that route is accepted later, PM can prepare `twii_sanitized_candidate_artifact_gate`.

If that route is blocked, PM should either:

1. switch to `etf_source_rights_fallback_decision_support`; or
2. keep A1 on external source-rights evidence intake while PM continues runtime / Beta preflight work.

## Verification

Focused verification:

- `node scripts/check-data-gate-readiness-after-local-route-health-refresh.mjs`
- `cmd.exe /c npm run check:data-gate-readiness-after-local-route-health-refresh`
- `cmd.exe /c npm run check:mvp-remaining-coverage-execution-bridge`
- `cmd.exe /c npm run check:runtime-local-route-health-refresh-before-executable-packet`
- `git diff --check`

Milestone integration:

- `cmd.exe /c npm run check:review-gates`
