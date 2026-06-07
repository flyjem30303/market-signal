# TWII Vendor Internal Or ETF Fallback Selection

Status: `twii_vendor_internal_or_etf_fallback_selection_ready_no_execution`

Date: 2026-06-07

Owner: PM mainline

Support lanes: A1 Data / Supabase / Market Evidence, A2 Frontend / UX Readability / Public Copy QA, I Launch / Ops

## CEO Decision

CEO decision: `split_data_blocker_into_vendor_internal_fallback_and_launch_runtime_mainline`.

The previous TWII acceptance-or-blocked record confirms that source rights, field contract, and asset mapping remain unresolved. PM should not keep the whole project waiting on the official TWII source lane. The next best route is a two-track fallback posture:

1. A1 continues the data-unblock lane through `licensed-market-data-vendor` and `internal-approved-feed` evidence, with ETF source-rights support kept as the backup data lane.
2. PM mainline continues launch/runtime engineering that does not require TWII or ETF rights.

Current route: `twii_vendor_or_internal_feed_fallback_selection_or_etf_source_rights_fallback_decision_support`.

Current outcome: `fallback_selection_ready_data_execution_still_blocked`.

This selection does not approve source rights, select an executable data source, generate candidates, implement a parser, run a probe, connect to Supabase, run SQL, write Supabase, create staging rows, mutate `daily_prices`, award row coverage points, promote public source, or set real scoring.

## Evidence Inputs

This selection is grounded in:

- `docs/TWII_SOURCE_RIGHTS_FIELD_CONTRACT_ACCEPTANCE_OR_BLOCKED_RECORD.md`
- `docs/A1_TWII_SOURCE_RIGHTS_EVIDENCE_INTAKE_OR_VENDOR_FALLBACK_DECISION_SUPPORT.md`
- `docs/A1_TWII_OFFICIAL_SOURCE_INTAKE_FIELDS_OR_VENDOR_TERMS_REVIEW_PACKET.md`
- `docs/ETF_SOURCE_RIGHTS_OUTCOME_DECISION_GATE.md`
- `docs/DATA_GATE_READINESS_AFTER_LOCAL_ROUTE_HEALTH_REFRESH.md`
- `docs/LAUNCH_ENGINEERING_WORKSTREAM_BOARD.md`

Accepted baseline:

- Level 1 MVP coverage remains `182/360`.
- TWII remains `0/60`, missing `60` rows.
- ETF remains `2/120`, missing `118` rows.
- TW equity first closed loop remains accepted at `180/180`.
- TWII official lane remains `blocked_external_evidence_pending`.
- TWII field contract remains `blocked_field_contract_pending`.
- TWII asset mapping remains `blocked_asset_mapping_pending`.
- ETF remains blocked by `legal_and_redistribution_terms_unapproved`.
- Public runtime remains `publicDataSource=mock`.
- Score source remains `scoreSource=mock`.

## Fallback Selection

PM selects a parallel fallback route, not a data execution route.

| Route | Current decision | Why |
| --- | --- | --- |
| `licensed-market-data-vendor` | `selected_for_A1_terms_evidence_intake` | Contractual clarity may unblock storage, derived analysis, public display, redistribution, audit, Taiwan/global use, and SLA faster than ambiguous official-source terms. |
| `internal-approved-feed` | `selected_for_A1_owner_evidence_intake` | Internal lineage and owner approval may unblock operational coverage if rights basis, refresh SLA, access control, retention, rollback, and audit are accepted. |
| `ETF source-rights fallback` | `kept_as_parallel_backup_data_lane` | ETF can close `118` missing rows if source rights are accepted, but it remains blocked until legal and redistribution terms are accepted. |
| `official-exchange-index` | `kept_open_but_not_mainline_wait_state` | Still preferred for authority if evidence is filled, but no engineering execution should wait on it. |
| `launch/runtime mainline` | `continue_without_real_data_promotion` | PM can continue Beta/executable packet readiness while data rights are unresolved. |

## A1 / A2 / PM Assignments

A1 assignment:

- Prepare `twii_vendor_terms_or_internal_feed_owner_evidence_packet`.
- Include safe non-secret fields for vendor scope, storage rights, derived use, public display, SLA, cost owner, termination handling, internal lineage, feed owner, access control, retention, rollback, and audit.
- Keep ETF fallback support available through source-rights evidence only.
- Do not generate TWII or ETF candidates until a later acceptance gate explicitly permits it.

A2 assignment:

- Maintain public copy guardrails for mock runtime, partial coverage, source-rights pending, missing/delayed data, model limits, and non-investment-advice wording.
- Do not imply vendor/internal feed has been accepted.

PM mainline assignment:

- Continue `executable_packet_candidate_after_platform_project_and_beta_url` or runtime proof refresh if platform values become available.
- Keep `publicDataSource=mock` and `scoreSource=mock`.
- Reopen data execution only after A1 delivers accepted rights, field contract, asset mapping, candidate gate, rollback, and post-run review readiness.

## Acceptance Rules For Future Data Progress

Future vendor/internal-feed acceptance must name:

1. exact source lane;
2. safe source authority or owner;
3. storage and retention rights;
4. derived-analysis rights;
5. public display and redistribution limits;
6. Taiwan/global and paid-product constraints;
7. SLA, outage, retry, and termination posture;
8. attribution and delay wording;
9. field contract and asset mapping;
10. aggregate-only review and rollback posture.

Until these are accepted, all data execution remains blocked.

## Next Route

Next A1 route:

`twii_vendor_terms_or_internal_feed_owner_evidence_packet`

Next PM mainline route:

`executable_packet_candidate_after_platform_project_and_beta_url`

Fallback data route:

`etf_source_rights_fallback_decision_support`

## Hard Stops

This selection does not authorize:

- SQL execution;
- Supabase connection;
- Supabase write;
- staging row creation;
- `daily_prices` mutation;
- TWII probe execution;
- ETF fetch or ingestion;
- source-derived TWII or ETF candidate generation;
- parser implementation;
- raw market-data fetch, ingest, storage, or commit;
- raw payload, row payload, stock id payload, or secret output;
- row coverage points;
- `publicDataSource=supabase`;
- `scoreSource=real`;
- public launch completion claim.

## Verification

Focused verification:

- `node scripts/check-twii-vendor-internal-or-etf-fallback-selection.mjs`
- `cmd.exe /c npm run check:twii-vendor-internal-or-etf-fallback-selection`
- `cmd.exe /c npm run check:twii-source-rights-field-contract-acceptance-or-blocked-record`
- `cmd.exe /c npm run check:a1-twii-source-rights-evidence-intake-or-vendor-fallback-decision-support`
- `cmd.exe /c npm run check:etf-source-rights-outcome-decision-gate`

Milestone integration:

- `cmd.exe /c npm run check:review-gates`
