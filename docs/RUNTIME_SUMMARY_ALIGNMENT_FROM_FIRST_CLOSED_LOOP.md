# Runtime Summary Alignment From First Closed Loop

Status: `runtime_summary_alignment_from_first_closed_loop_applied_mock_boundary_preserved`

Date: 2026-06-07

Owner: PM mainline

Support lanes: A1 Data / Supabase / Market Evidence, A2 Frontend / UX Readability / Public Copy QA, I Launch / Ops

## CEO Decision

CEO decision: `align_runtime_summary_to_accepted_first_closed_loop_without_real_promotion`.

PM aligned the product-visible runtime readiness baseline with the accepted first closed-loop data evidence. Runtime summaries now use the current accepted Level 1 coverage state of `182/360` observed rows and `178` missing rows instead of the earlier bounded readonly aggregate baseline of `5/360`.

This alignment does not run SQL, does not connect to Supabase, does not write Supabase, does not create staging rows, does not modify `daily_prices`, does not fetch or ingest market data, does not award additional row coverage points, does not set `publicDataSource=supabase`, and does not set `scoreSource=real`.

Current route: `runtime_summary_aligned_then_coverage_gate_or_operator_values`.

Current outcome: `runtime_summary_aligned_real_promotion_blocked`.

## Source Inputs

This alignment is grounded in:

- `docs/RUNTIME_DATA_PROMOTION_HANDOFF_CHECKLIST.md`
- `docs/DATA_REALIFICATION_FIRST_CLOSED_LOOP_ROLLUP.md`
- `docs/RUNTIME_PROMOTION_POLICY_FROM_FIRST_CLOSED_LOOP.md`
- `docs/A1_MVP_COVERAGE_CLOSURE_ROUTE_SUPPORT.md`
- `docs/TW_EQUITY_ROW_COVERAGE_SCORING_GATE.md`
- `src/lib/post-readonly-runtime-state.ts`
- `src/lib/runtime-promotion-readiness-summary.ts`

Accepted baseline after alignment:

- First closed-loop status is `data_realification_first_closed_loop_tw_equity_subscope_complete_runtime_promotion_blocked`.
- TW equity sub-scope is accepted at `180/180`.
- Full Level 1 MVP coverage is `182/360`.
- Missing rows are `178`.
- Runtime remains `publicDataSource=mock`.
- Score remains `scoreSource=mock`.
- Overall runtime promotion status remains `not_ready_for_real_data_promotion`.

## Code Alignment

| File | Alignment |
| --- | --- |
| `src/lib/post-readonly-runtime-state.ts` | `observedRows: 182`, `missingRows: 178`, `expectedRows: 360`, and mock-only summary copy |
| `src/lib/runtime-promotion-readiness-summary.ts` | `observedRows: 182`, `missingRows: 178`, `expectedRows: 360`, and `not_ready_for_real_data_promotion` |

The old `5/360` value remains valid only in historical readonly-attempt records and legacy design packets. It is no longer the product-visible runtime readiness baseline.

## Product Meaning

Users may see that the project has accepted first closed-loop evidence for part of the Level 1 universe, but the public product must still present this as incomplete Beta evidence.

Required public interpretation:

- `182/360` is accepted partial evidence, not full MVP readiness.
- `178` missing rows remain a promotion blocker.
- `TWII`, `0050`, and `006208` remain blocked lanes.
- Runtime source stays `publicDataSource=mock`.
- Score source stays `scoreSource=mock`.
- Real-data and real-score claims remain blocked.

## A1 / A2 Coordination

A1 remains assigned to `source_rights_evidence_intake_for_tWII_and_etf`.

A1 should use `182/360` as the current closure baseline and preserve the route to `360/360` through TWII and ETF source-rights, field-contract, candidate artifact, bounded execution, post-run review, readback, and scoring gates.

A2 remains assigned to public trust and disclosure support.

A2 should preserve mock-only runtime, partial coverage, missing/delayed data, model limitation, risk disclosure, and non-investment-advice wording when public copy references first closed-loop evidence.

## Acceptance

PM may mark this alignment `accepted` when:

1. `src/lib/post-readonly-runtime-state.ts` uses `observedRows: 182`;
2. `src/lib/post-readonly-runtime-state.ts` uses `missingRows: 178`;
3. `src/lib/runtime-promotion-readiness-summary.ts` uses `observedRows: 182`;
4. `src/lib/runtime-promotion-readiness-summary.ts` uses `missingRows: 178`;
5. `publicDataSource=mock` remains unchanged;
6. `scoreSource=mock` remains unchanged;
7. runtime status remains `not_ready_for_real_data_promotion`;
8. focused checker and TypeScript pass;
9. no SQL, Supabase write, data mutation, row coverage point, public source promotion, or real score promotion occurred.

## Hard Stops

This alignment does not authorize:

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

The next route is `coverage_gate_or_operator_values_after_runtime_summary_alignment`, not real promotion.

CEO/PM should choose between:

1. A1 data route: continue source-rights and field-contract unblock work for `TWII`, `0050`, and `006208`.
2. PM launch route: fill safe operator values and prepare a separate executable packet candidate.
3. PM runtime route: refine visible readiness copy only if route-level checks reveal confusing wording.

## Verification

Focused verification:

- `node scripts/check-runtime-summary-alignment-from-first-closed-loop.mjs`
- `cmd.exe /c npm run check:runtime-summary-alignment-from-first-closed-loop`
- `cmd.exe /c npm run check:runtime-promotion-readiness-summary`
- `cmd.exe /c npm run check:runtime-data-promotion-handoff-checklist`
- `node scripts/check-review-gates.mjs`
