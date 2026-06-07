# TWII Source Rights Field Contract Acceptance Or Blocked Record

Status: `twii_source_rights_field_contract_acceptance_or_blocked_record_blocked_external_evidence_pending`

Date: 2026-06-07

Owner: PM mainline

Support lanes: A1 Data / Supabase / Market Evidence, A2 Frontend / UX Readability / Public Copy QA

## CEO Decision

CEO decision: `record_twii_source_rights_field_contract_block_and_route_parallel_work`.

PM closes the current TWII readiness question as a decision record instead of leaving it ambiguous. TWII remains the preferred narrow data-coverage lane because it can move Level 1 MVP coverage from `182/360` to `242/360` after acceptance, but current evidence does not accept source rights, field contract, or asset mapping.

Current route: `twii_source_rights_and_field_contract_acceptance_or_blocked_record`.

Current outcome: `blocked_external_rights_field_contract_and_asset_mapping_pending`.

This record does not approve TWII source rights, field contract, candidate artifact generation, parser work, remote probing, SQL, Supabase connection, Supabase write, staging row creation, `daily_prices` mutation, row coverage points, public source promotion, or real scoring.

## Evidence Inputs

This record is grounded in:

- `docs/DATA_GATE_READINESS_AFTER_LOCAL_ROUTE_HEALTH_REFRESH.md`
- `docs/A1_TWII_OFFICIAL_SOURCE_INTAKE_FIELDS_OR_VENDOR_TERMS_REVIEW_PACKET.md`
- `docs/A1_TWII_INDEX_FIELD_CONTRACT_DECISION_SUPPORT.md`
- `docs/TWII_SOURCE_RIGHTS_OUTCOME_GATE.md`
- `docs/A1_TWII_SOURCE_RIGHTS_EVIDENCE_INTAKE_OR_VENDOR_FALLBACK_DECISION_SUPPORT.md`
- `docs/ETF_SOURCE_RIGHTS_OUTCOME_DECISION_GATE.md`
- `docs/LAUNCH_ENGINEERING_WORKSTREAM_BOARD.md`

Accepted baseline:

- Level 1 MVP coverage remains `182/360`.
- TW equity first closed loop remains accepted at `180/180`.
- TWII remains `0/60`, missing `60` rows.
- ETF remains `2/120`, missing `118` rows.
- TWII first candidate remains `official-exchange-index`.
- TWII fallback candidates remain `licensed-market-data-vendor` and `internal-approved-feed`.
- TWII route remains `not_approved_for_probe_or_ingestion`.
- Public runtime remains `publicDataSource=mock`.
- Score source remains `scoreSource=mock`.

## PM Acceptance / Blocked Decision

PM classifies the current TWII source-rights and field-contract state as `blocked`, not `accepted`.

| Decision item | Required for acceptance | Current PM classification |
| --- | --- | --- |
| Source authority | Official or licensed authority for TWII historical index values is safely recorded. | `blocked_external_evidence_pending` |
| Automated access | Exact future access method is permitted. | `blocked_external_evidence_pending` |
| Internal storage | Internal storage of source-derived TWII values is permitted. | `blocked_external_evidence_pending` |
| Redistribution/display | Public display, export, screenshots, API reuse, and downstream-copy limits are accepted. | `blocked_external_evidence_pending` |
| Derived analysis | QA summaries, derived metrics, decision support, and row coverage scoring are allowed or explicitly blocked. | `blocked_external_evidence_pending` |
| Field contract | `trade_date`, `index_close`, optional OHLC/turnover, timezone, precision, rounding, revision, and missing-session rules are accepted. | `blocked_field_contract_pending` |
| Asset mapping | TWII is mapped to a safe internal index asset id without stock id payload exposure. | `blocked_asset_mapping_pending` |
| Aggregate-only review | Future output excludes raw payload, row payload, stock id payload, source response body, and secrets. | `accepted_as_future_requirement_only` |

Because one or more required items are blocked, PM rejects the route for execution now.

## A1 / A2 Work Allocation

A1 assignment:

- Continue `twii_official_source_intake_fields_or_vendor_terms_review_packet` until safe non-secret evidence is filled, or prepare `twii_vendor_or_internal_feed_fallback_selection` if the official lane stays unresolved.
- Keep ETF fallback available through `etf_source_rights_fallback_decision_support`.
- Do not prepare `twii_sanitized_candidate_artifact_gate` until source rights, field contract, and asset mapping are accepted.

A2 assignment:

- Keep public pages honest about partial coverage, missing TWII/ETF data, and mock runtime state.
- Do not add copy implying TWII real coverage, source rights, or real score readiness.

PM mainline:

- Continue launch/runtime work that does not depend on TWII rights.
- Reopen TWII execution only after A1 provides accepted safe evidence and PM records a later acceptance gate.

## Next Route

If TWII evidence becomes accepted later, the next route is:

`twii_sanitized_candidate_artifact_gate_after_rights_field_contract_and_asset_mapping_acceptance`

If TWII remains blocked, the next route is:

`twii_vendor_or_internal_feed_fallback_selection_or_etf_source_rights_fallback_decision_support`

If both data lanes remain blocked, PM should continue:

`executable_packet_candidate_after_platform_project_and_beta_url`

## Hard Stops

This record does not authorize:

- SQL execution;
- Supabase connection;
- Supabase write;
- staging row creation;
- `daily_prices` mutation;
- TWII probe execution;
- source-derived TWII candidate artifact generation;
- parser implementation;
- ETF fetch or ingestion;
- raw market-data fetch, ingest, storage, or commit;
- raw payload, row payload, stock id payload, or secret output;
- row coverage points;
- `publicDataSource=supabase`;
- `scoreSource=real`;
- public launch completion claim.

## Verification

Focused verification:

- `node scripts/check-twii-source-rights-field-contract-acceptance-or-blocked-record.mjs`
- `cmd.exe /c npm run check:twii-source-rights-field-contract-acceptance-or-blocked-record`
- `cmd.exe /c npm run check:data-gate-readiness-after-local-route-health-refresh`
- `cmd.exe /c npm run check:a1-twii-official-source-intake-fields-or-vendor-terms-review-packet`
- `cmd.exe /c npm run check:a1-twii-index-field-contract-decision-support`
- `cmd.exe /c npm run check:twii-source-rights-outcome-gate`

Milestone integration:

- `cmd.exe /c npm run check:review-gates`
