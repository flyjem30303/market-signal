# Runtime Data Promotion Handoff Checklist

Status: `runtime_data_promotion_handoff_checklist_ready_mock_boundary_preserved`

Date: 2026-06-07

Owner: PM mainline

Support lanes: A1 Data / Supabase / Market Evidence, A2 Frontend / UX Readability / Public Copy QA, I Launch / Ops

## CEO Decision

CEO decision: `align_runtime_promotion_gate_with_data_coverage_route_without_real_promotion`.

Operator values are now compressed into a short gap list, so PM should continue local launch runtime/data work. The next highest-value local action is to make the handoff between data coverage closure and runtime promotion explicit, so completed data work can flow into the Runtime real promotion gate without accidentally promoting the public site.

This checklist does not run SQL, does not connect to Supabase, does not write Supabase, does not create staging rows, does not modify `daily_prices`, does not fetch or ingest market data, does not award row coverage points, does not set `publicDataSource=supabase`, and does not set `scoreSource=real`.

Current route: `runtime_data_handoff_then_runtime_summary_alignment_or_coverage_gate`.

Current outcome: `runtime_data_handoff_ready_runtime_summary_alignment_pending`.

## Source Inputs

This checklist is grounded in:

- `docs/DATA_REALIFICATION_FIRST_CLOSED_LOOP_ROLLUP.md`
- `docs/RUNTIME_PROMOTION_POLICY_FROM_FIRST_CLOSED_LOOP.md`
- `docs/A1_MVP_COVERAGE_CLOSURE_ROUTE_SUPPORT.md`
- `docs/TW_EQUITY_ROW_COVERAGE_SCORING_GATE.md`
- `docs/LOCAL_LAUNCH_PROOF_BUNDLE_SNAPSHOT.md`
- `docs/BETA_DEPLOYMENT_OPERATOR_VALUES_GAP_LIST.md`
- `docs/LAUNCH_ENGINEERING_WORKSTREAM_BOARD.md`
- `src/lib/runtime-promotion-readiness-summary.ts`
- `src/lib/post-readonly-runtime-state.ts`

Accepted data baseline:

- First closed-loop status is `data_realification_first_closed_loop_tw_equity_subscope_complete_runtime_promotion_blocked`.
- TW equity sub-scope is accepted at `180/180`.
- Full Level 1 MVP coverage is `182/360`.
- Missing rows are `178`.
- Remaining TWII lane is `TWII` at `0/60`.
- Remaining ETF lane is `0050` and `006208` at `2/120`.
- Runtime remains `publicDataSource=mock`.
- Score remains `scoreSource=mock`.

## Runtime Handoff Contract

| Data signal | Current value | Runtime use now | Promotion use later |
| --- | --- | --- | --- |
| First closed-loop evidence | `accepted_first_closed_loop_complete` | Public Beta context only | Input to later promotion gate |
| TW equity row coverage | `180/180` | Internal evidence and safe partial-coverage copy | Accepted promoted scope only after route/source copy gate |
| Full MVP row coverage | `182/360` | Block public real-data claim | Can promote only after full or accepted partial policy |
| Missing rows | `178` | Must stay visible in readiness language | Must be closed or explicitly scoped out |
| TWII lane | `0/60` | Data blocker | Needs rights, field contract, candidate, execution, readback, scoring |
| ETF lane | `2/120` | Data blocker | Needs rights, field contract, candidate, execution, readback, scoring |
| Runtime source | `publicDataSource=mock` | Required public boundary | Separate gate required for `publicDataSource=supabase` |
| Score source | `scoreSource=mock` | Required score boundary | Separate gate required for `scoreSource=real` |

## Required Data Evidence Before Runtime Promotion

Runtime promotion cannot proceed until a later gate can prove:

1. accepted source rights for every promoted lane;
2. accepted field contract for every promoted lane;
3. bounded candidate artifact for every promoted lane;
4. bounded write/readback/post-run review evidence for every promoted lane;
5. aggregate row coverage scoring acceptance;
6. public source disclosure aligned to the promoted scope;
7. legal/trust copy aligned to missing, delayed, partial, and unavailable data;
8. rollback and incident path available for promoted public Beta;
9. route health passes without Internal Server Error;
10. separate approval for `publicDataSource=supabase`;
11. separate approval for `scoreSource=real`.

## Runtime Summary Alignment Item

PM recorded one runtime alignment item:

- `src/lib/post-readonly-runtime-state.ts` previously represented the earlier bounded readonly aggregate state as `5/360`.
- Latest accepted rollup and workstream board represent current Level 1 evidence as `182/360`.
- PM completed the alignment in `docs/RUNTIME_SUMMARY_ALIGNMENT_FROM_FIRST_CLOSED_LOOP.md`, so product-visible promotion readiness now uses accepted first closed-loop evidence while still preserving `publicDataSource=mock`, `scoreSource=mock`, and `not_ready_for_real_data_promotion`.

This checklist remains the handoff record. The code alignment is guarded separately by `scripts/check-runtime-summary-alignment-from-first-closed-loop.mjs`.

## A1 / A2 Coordination

A1 remains assigned to `source_rights_evidence_intake_for_tWII_and_etf`.

A1 next data output should preserve the `182/360` to `360/360` closure map and should not claim row coverage points until source-rights, field-contract, candidate artifact, bounded execution, post-run review, readback, and scoring gates pass.

A2 remains assigned to public trust and disclosure support.

A2 next copy output should preserve mock-only runtime, partial coverage, missing/delayed data, model limitation, risk disclosure, and non-investment-advice wording. Visual polish remains lower priority than runtime/data truthfulness.

## Acceptance

PM may mark this checklist `accepted` when:

1. the focused checker passes;
2. it records the current data baseline as `182/360`;
3. it records TW equity as `180/180`;
4. it records TWII as `0/60`;
5. it records ETF as `2/120`;
6. it preserves `publicDataSource=mock`;
7. it preserves `scoreSource=mock`;
8. it identifies the runtime summary alignment item;
9. it keeps runtime promotion and score promotion behind separate gates;
10. it does not authorize SQL, Supabase writes, data mutation, raw market-data work, public source promotion, or real score promotion.

## Hard Stops

This checklist does not authorize:

- SQL execution;
- Supabase connection;
- Supabase write;
- staging row creation;
- `daily_prices` mutation;
- raw market-data fetch;
- raw market-data ingest;
- raw market-data storage;
- raw market-data commit;
- raw payload output;
- row payload output;
- stock id payload output;
- secret output;
- additional row coverage points;
- full MVP coverage claim;
- public source promotion;
- `publicDataSource=supabase`;
- real score promotion;
- `scoreSource=real`;
- investment advice claim;
- public launch completion claim.

## Next Route

The next route is `runtime_summary_alignment_from_first_closed_loop_evidence_or_coverage_gate`, not real promotion.

CEO/PM should choose one of two local next slices:

1. PM runtime slice: align `post-readonly-runtime-state` / promotion summary with accepted `182/360` evidence while preserving mock boundary.
2. A1 data slice: continue source-rights and field-contract unblock work for `TWII`, `0050`, and `006208`.

## Verification

Focused verification:

- `node scripts/check-runtime-data-promotion-handoff-checklist.mjs`
- `cmd.exe /c npm run check:runtime-data-promotion-handoff-checklist`
- `node scripts/check-review-gates.mjs`
