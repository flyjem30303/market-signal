# Data Realification Post First Closed Loop Next Lane Selector

Status: `data_realification_post_first_closed_loop_next_lane_selector_ready`

Date: 2026-06-07

Owner: PM mainline

Support lanes: A1 Data / Supabase / Market Evidence, A2 Frontend / UX Readability / Public Copy QA, I Launch / Ops

## CEO Decision

CEO decision: `route_after_tw_equity_first_closed_loop_without_reopening_completed_work`.

The TW equity sub-scope (`2330`, `2382`, `2308`) has completed the first realification closed loop at `180/180`. PM should not reopen that lane unless a regression appears. The remaining data-realification work is the blocked universe: `TWII`, `0050`, and `006208`.

Current route: `post_first_closed_loop_next_data_lane_selector`.

Current outcome: `twii_first_if_rights_change_otherwise_beta_runtime_mainline`.

Runtime wiring handoff readiness target: `prepare_twse_openapi_runtime_mock_consumer_wiring_readiness`.

This selector does not execute SQL, connect to Supabase, write Supabase, create staging rows, mutate `daily_prices`, fetch or ingest market data, generate source-derived candidates, award row coverage points, promote public source, or set real scoring.

## Current Evidence Baseline

Accepted data foundation:

- First closed-loop rollup: `data_realification_first_closed_loop_tw_equity_subscope_complete_runtime_promotion_blocked`.
- TW equity sub-scope: `2330`, `2382`, `2308`.
- TW equity final coverage: `180/180`.
- Full MVP coverage: `182/360`.
- Missing rows: `178`.
- Runtime remains `publicDataSource=mock`.
- Score remains `scoreSource=mock`.

Remaining blocked universe:

| Lane | Current rows | Missing rows | Current state | Next opening condition |
| --- | ---: | ---: | --- | --- |
| `TWII` | `0/60` | `60` | `blocked_external_rights_field_contract_and_asset_mapping_pending` | accepted source rights, field contract, and asset mapping |
| `0050` | `1/60` | `59` | `legal_and_redistribution_terms_unapproved` | accepted ETF source-rights lane |
| `006208` | `1/60` | `59` | `legal_and_redistribution_terms_unapproved` | accepted ETF source-rights lane |

## Selector Rule

PM should use this order:

1. If TWII source rights, field contract, and asset mapping become accepted, open `twii_sanitized_candidate_artifact_gate_after_rights_field_contract_and_asset_mapping_acceptance`.
2. If ETF source rights become accepted first, open `etf_sanitized_candidate_artifact_gate_after_source_rights_acceptance`.
3. If both TWII and ETF remain blocked, do not create source-derived candidates. Continue `beta_deployment_executable_packet_after_platform_values` or runtime promotion readiness with mock boundary preserved.
4. If runtime or route health regresses, repair runtime before any data execution packet.

CEO preference: TWII remains first because it is the smaller bounded gap (`60` rows) and would move MVP coverage from `182/360` to `242/360`. ETF remains parallel fallback because it can close `118` rows after rights acceptance.

## A1 / A2 / PM Assignments

A1 assignment:

- Keep `A1_TWII_ETF_SOURCE_RIGHTS_EVIDENCE_INTAKE_PACKET` as the shared intake surface.
- For TWII, fill only safe no-secret evidence for official, vendor, or internal-feed lanes.
- For ETF, fill only safe no-secret evidence for source owner, internal storage, redistribution, attribution, delayed/missing wording, and derived validation.
- Do not fetch, store, ingest, print, or commit source bodies, row dumps, stock id lists, or secrets.

A2 assignment:

- Preserve partial-coverage public Beta copy.
- Keep TWII and ETF as missing/blocked where mentioned.
- Do not imply full MVP coverage, real score readiness, ETF source acceptance, or TWII source acceptance.

PM assignment:

- Treat TW equity as accepted precedent, not active work.
- Reopen data execution only when A1 evidence changes a lane from blocked to accepted.
- Continue public Beta packet/runtime work while source-rights evidence is unchanged.
- Keep `publicDataSource=mock` and `scoreSource=mock` until separate promotion gates pass.

## Accepted / Rejected Recording

PM must record any future lane decision as one of:

- `accepted_for_candidate_gate`;
- `rejected_for_execution`;
- `needs_bounded_repair`;
- `blocked_external_evidence_pending`.

Only `accepted_for_candidate_gate` may open a sanitized candidate artifact gate. It still does not authorize remote fetch, Supabase write, `daily_prices` mutation, row coverage points, public source promotion, or real score promotion.

## Hard Stops

This selector does not authorize:

- SQL execution;
- Supabase connection;
- Supabase write;
- staging row creation;
- `daily_prices` mutation;
- TWII probe execution;
- ETF fetch or ingestion;
- source-derived candidate generation;
- parser implementation;
- market-data fetch, market-data ingest, market-data storage, or market-data commit;
- source body output;
- row payload output;
- stock id payload output;
- secret output;
- additional row coverage points;
- full MVP coverage claim;
- `publicDataSource=supabase`;
- `scoreSource=real`;
- investment advice claim;
- public launch completion claim.

## Next Route

Next PM route now:

`beta_deployment_executable_packet_after_platform_values_or_runtime_promotion_readiness_with_mock_boundary`

Next A1 route now:

`fill_twii_or_etf_source_rights_evidence_before_candidate_gate`

If external source-rights evidence changes, PM switches to:

`twii_or_etf_sanitized_candidate_artifact_gate_after_acceptance`

## Verification

Focused verification:

- `node scripts/check-data-realification-post-first-closed-loop-next-lane-selector.mjs`
- `cmd.exe /c npm run check:data-realification-post-first-closed-loop-next-lane-selector`

Milestone integration:

- `cmd.exe /c npm run check:review-gates`
