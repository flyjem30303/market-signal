# Runtime Promotion Policy From First Closed Loop

Status: `runtime_promotion_policy_from_first_closed_loop_ready_mock_boundary_preserved`

Date: 2026-06-07

Owner: PM mainline

Support lanes: A1 Data / Supabase / Market Evidence, A2 Frontend / UX Readability / Public Copy QA, I Launch / Ops

## CEO Decision

CEO decision: `use_first_closed_loop_as_beta_evidence_not_runtime_promotion`.

The accepted first realification closed loop for TW equity (`2330`, `2382`, `2308`) may now be used as internal Beta-readiness evidence and public-copy context, but it does not authorize public runtime promotion.

Current runtime posture remains:

- `publicDataSource=mock`;
- `scoreSource=mock`;
- public real-data claim: `blocked`;
- real score claim: `blocked`;
- full MVP row coverage readiness: `blocked`.

## Source Evidence

This policy is grounded in:

- `docs/DATA_REALIFICATION_FIRST_CLOSED_LOOP_ROLLUP.md`
- `docs/TW_EQUITY_ROW_COVERAGE_SCORING_GATE.md`
- `docs/reviews/TW_EQUITY_POST_MERGE_ROW_COVERAGE_READBACK_POST_RUN_REVIEW_2026-06-07.md`
- `docs/reviews/TW_EQUITY_DAILY_PRICES_INSERT_MISSING_MERGE_POST_RUN_REVIEW_2026-06-07.md`
- `docs/PUBLIC_BETA_READINESS_GATE.md`
- `src/lib/runtime-promotion-readiness-summary.ts`

Accepted evidence:

- first closed loop status: `data_realification_first_closed_loop_tw_equity_subscope_complete_runtime_promotion_blocked`;
- TW equity sub-scope status: `accepted_first_closed_loop_complete`;
- TW equity symbols: `2330`, `2382`, `2308`;
- TW equity sub-scope rows: `180/180`;
- full MVP rows: `182/360`;
- missing rows: `178`;
- blocked symbols: `TWII` `0/60`, `0050` `1/60`, `006208` `1/60`.

## Runtime Policy

| Runtime surface | Current policy | Allowed now | Blocked until |
| --- | --- | --- | --- |
| Public data source label | `publicDataSource=mock` | say public site remains mock-boundary Beta | separate promotion gate accepts `publicDataSource=supabase` |
| Score source label | `scoreSource=mock` | say scores remain model/mock-boundary only | separate score gate accepts `scoreSource=real` |
| Data evidence copy | `first_closed_loop_evidence_allowed` | mention TW equity sub-scope has completed internal closed-loop evidence | do not claim full MVP real-data readiness |
| Stock pages | `mock_runtime_with_evidence_context` | keep mock UI while showing safe partial-coverage context if implemented later | route-specific real-data read path and copy gate |
| Briefing / weekly | `mock_runtime_with_partial_coverage_context` | explain partial coverage and remaining blocked universe | full coverage or accepted partial-coverage Beta policy |
| Public legal / trust copy | `must_disclose_mock_and_partial_coverage` | disclose mock boundary, partial coverage, missing/delayed data, non-investment advice, and risk | no exceptions |
| Deployment readiness | `beta_can_prepare_without_real_promotion` | continue Beta deployment packet work with mock runtime | production deployment packet and operator values |

## Promotion Decision Rules

PM may prepare runtime promotion work only if all of these become true in a later gate:

1. full MVP row coverage is complete, or CEO accepts a partial-coverage public Beta policy with explicit route-level labels;
2. `TWII`, `0050`, and `006208` source-rights and field contracts are accepted;
3. every promoted symbol has bounded write/readback/post-run review evidence;
4. public source disclosure and legal copy are aligned with the promoted scope;
5. route health and public copy checks pass with no Internal Server Error;
6. `publicDataSource=supabase` is approved by a separate runtime promotion gate;
7. `scoreSource=real` is approved by a separate score promotion gate;
8. rollback, incident, and deployment operator values are filled for public Beta deployment.

Until then, PM must keep runtime source as `publicDataSource=mock` and score source as `scoreSource=mock`.

## Allowed Work From This Policy

Allowed now:

- update local documentation and status surfaces to reference first closed-loop evidence;
- prepare route-level copy for partial-coverage Beta;
- prepare runtime policy/checkers that preserve mock boundary;
- assign A1 to blocked universe source/candidate readiness;
- assign A2 to partial-coverage public-copy alignment;
- continue Beta deployment packet preparation with mock runtime.

Not allowed from this policy:

- SQL execution;
- Supabase write;
- `daily_prices` mutation;
- raw market-data fetch;
- raw market-data ingest;
- raw market-data storage;
- public source promotion;
- `publicDataSource=supabase`;
- real score promotion;
- `scoreSource=real`;
- investment advice claim;
- public launch completion claim.

## A1 / A2 / PM Assignments

A1 next assignment: `twii_etf_blocked_universe_candidate_and_rights_path`.

A1 should continue with `TWII`, `0050`, and `006208` source-rights, field-contract, candidate artifact, and bounded execution readiness. A1 must not fetch, ingest, store, print, or commit raw market data without a later exact gate.

A2 next assignment: `partial_coverage_public_beta_copy_alignment`.

A2 should prepare copy rules for pages that mention first closed-loop evidence while preserving mock-only runtime, partial coverage, missing/delayed data, score/model limitations, risk disclosure, and non-investment-advice language.

PM next assignment: `runtime_policy_to_public_surface_mapping`.

PM should map this policy into route-level implementation only after the policy checker is accepted. Any UI implementation must preserve `publicDataSource=mock` and `scoreSource=mock`.

## Hard Stops

This policy does not authorize:

- SQL execution;
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

The next route is `runtime_policy_to_public_surface_mapping_or_blocked_universe_candidate_path`.

CEO/PM should choose between:

- PM mainline: map this policy into public surfaces without changing runtime source;
- A1 support: progress the blocked universe candidate path for `TWII`, `0050`, and `006208`;
- A2 support: create partial-coverage Beta copy criteria before visual polish.

## Verification

Focused verification:

- `node scripts/check-runtime-promotion-policy-from-first-closed-loop.mjs`
- `cmd.exe /c npm run check:runtime-promotion-policy-from-first-closed-loop`
- `cmd.exe /c npm run check:data-realification-first-closed-loop-rollup`
- `node scripts/check-review-gates.mjs`

Milestone verification should also run JSON validation, TypeScript, route health, localhost full health, and `git diff --check`.
