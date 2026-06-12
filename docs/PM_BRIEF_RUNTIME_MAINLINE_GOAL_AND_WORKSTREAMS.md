# PM BRIEF Runtime Mainline Goal And Workstreams

Updated: 2026-06-12

Status: `pm_brief_runtime_mainline_goal_ready`

Owner: PM mainline

## 1. CEO Goal

Move the project toward a public Beta index status dashboard usable loop.

The product target remains:

- users understand market atmosphere within 30 seconds,
- users know whether to follow, increase observation, or reduce risk within 3 minutes,
- public pages show why a signal appears, what the update time is, what the impact level is, and what to observe next,
- the site stays neutral, educational, and non-investment-advice.

## 2. PM Mainline

PM owns the product/runtime engineering line.

Current PM priority:

1. Keep `/`, `/briefing`, and stock runtime pages readable as product surfaces, not internal execution consoles.
2. Preserve the three-layer home view: market atmosphere, core indicator panel, and alert list.
3. Keep `publicDataSource=mock` and `scoreSource=mock` visible enough that users do not mistake the site for live trading data.
4. Turn data-line outputs into user-facing readiness states only after local checks pass.
5. Defer visual polish that does not improve comprehension, source trust, or runtime safety.

PM should not wait for A1/A2 unless a mainline change directly depends on their artifact. PM absorbs their outputs at coherent integration points.

Latest PM integration:

- The shared `Source & Coverage` runtime-label panel now includes field-contract status copy: `欄位對照仍在檢查`, `大盤欄位對照`, and `上市個股欄位對照`. PM converted the accepted A1 no-fetch field-contract packet into public-readable mock labels without claiming real parser readiness, complete coverage, or source promotion.
- The `Source & Coverage` runtime-label panel now includes a 3-minute reading action strip: check data state, check coverage gaps, and choose the next observation direction. This makes the source/coverage surface actionable for public Beta users while preserving mock-only and non-advice boundaries.
- Home, briefing, and stock detail now share a `Source & Coverage` runtime-label panel. The panel turns A1's no-fetch source/coverage handoff into reader-facing states: index baseline checking, core ETF blocked, and first listed-equity batch usable only as mock demonstration. PM accepted `docs/A1_TWSE_OPENAPI_TERMS_FIELD_COVERAGE_MATRIX_NO_FETCH.md` for mock runtime label planning and accepted `docs/A2_SOURCE_COVERAGE_RUNTIME_LABELS_PUBLIC_COPY_REVIEW.md` after applying bounded copy repair. This keeps source trust and coverage gaps visible without claiming real data, complete coverage, or real score readiness.
- Home, briefing, and stock detail now share a visible `Public Beta Reading Path` panel. The route consistency surface tells users how to move from 30-second market overview to 3-minute briefing judgment to stock detail confirmation, while translating A1 data-line status into reader-facing candidate-source confirmation and preserving `publicDataSource=mock` / `scoreSource=mock` / non-advice boundaries.
- Stock detail runtime pages now include a BRIEF-aligned public decision brief: `30 秒看懂標的狀態`, `3 分鐘內請看`, cause, update time, impact level, next step, and a visible `publicDataSource=mock` / `scoreSource=mock` / non-investment-advice boundary. The stock-focused gates were refreshed to guard these user-facing requirements instead of stale internal process copy.
- `/briefing` has been moved closer to the BRIEF product target by converting visible navigation, decision boundary, reading bridge, watchlists, action cards, next-reading links, executive links, and runtime-plan copy into reader-facing public Beta language.
- The relevant gates now protect readable public Beta phrases, 30-second/3-minute decision flow, mock boundary, no-advice posture, and absence of internal blocker/process terms.
- Next PM mainline should continue with data-line mock runtime label readiness and only add public UI when it clarifies source trust, coverage state, or runtime safety; broad visual polish remains lower priority.
- Previous route anchor retained for checker continuity: `integrate_runtime_readability_and_source_trust_states_before_real_data_promotion`.

## 3. A1 Data / Source / Coverage Lane

A1 owns source and coverage preparation that does not fetch market rows.

Active A1 artifact:

- `docs/A1_OFFICIAL_OPEN_FREE_SOURCE_TERMS_AND_COVERAGE_MATRIX_NO_FETCH.md`
- `docs/A1_PUBLIC_BETA_SOURCE_COVERAGE_RUNTIME_NO_FETCH_HANDOFF.md`
- `docs/A1_TWSE_OPENAPI_TERMS_FIELD_COVERAGE_MATRIX_NO_FETCH.md`
- `docs/A1_TWSE_OPENAPI_INDEX_BASELINE_FIELD_CONTRACT_CONFIRMATION_NO_FETCH.md`
- current PM assignment: prepare index-baseline synthetic contract cases and a Batch 1 listed-equity symbol policy without stock-id row-list output; return only sanitized, no-secret, no-fetch artifacts that PM can accept through local checks.

A1 is responsible for:

- legal/free/automatable source candidate matrix,
- coverage categories for daily close, volume, date, symbol, ETF, index, and stock lanes,
- no-fetch terms review packets,
- source-lane questions for PM/CEO decisions.
- next background task: `prepare_index_baseline_synthetic_contract_cases_no_fetch` and `prepare_batch1_listed_equity_symbol_policy_no_row_list`; keep the output local-only, no-fetch, no-secret, and PM-readable.

A1 is not authorized by this goal to:

- fetch market rows,
- run SQL,
- connect to or write Supabase,
- create staging rows,
- modify `daily_prices`,
- store or commit raw market payloads,
- promote public data or score sources.

## 4. A2 Public Copy / Product Safety Lane

A2 owns public-copy safety and user comprehension.

Active A2 artifact:

- `docs/A2_HOME_FIRST_SCREEN_PUBLIC_COPY_HANDOFF.md`
- `docs/A2_PUBLIC_COPY_UX_SAFETY_QA_HANDOFF_2026_06_12.md`
- `docs/A2_SOURCE_COVERAGE_RUNTIME_LABELS_PUBLIC_COPY_REVIEW.md`
- current PM assignment: review stock detail and home-to-briefing language for 30-second comprehension, 3-minute action judgment, mock/real boundary clarity, and non-advice wording; propose copy patches only when they improve comprehension or safety.

A2 is responsible for:

- first-screen wording that supports 30-second market atmosphere,
- 3-minute action judgment copy,
- mock/real boundary readability,
- non-investment-advice wording,
- blocking internal execution strings on public surfaces.
- next background task: `prepare_field_contract_public_copy_guard`; keep field-contract wording public-readable as `欄位對照仍在檢查`, avoid parser internals, and preserve mock/non-advice boundary clarity.

A2 is not authorized by this goal to:

- edit data evidence,
- approve runtime promotion,
- run SQL,
- connect to or write Supabase,
- fetch or ingest market data,
- set `publicDataSource=supabase`,
- set `scoreSource=real`.

## 5. Integration Rules

PM can integrate A1/A2 results when all are true:

1. The artifact is local-only and no-secret.
2. The artifact has a checker.
3. The checker is wired into `package.json` and the review gate.
4. The result can improve product comprehension, runtime safety, or source-trust clarity.
5. The integration does not perform external data access or data writes.

If a result is useful but not ready for runtime, PM should record it as a readiness state, not as a public real-data claim.

## 6. Hard Boundaries

This goal does not authorize:

- SQL execution,
- Supabase writes,
- Supabase schema changes,
- staging-row creation,
- `daily_prices` mutation,
- raw market-data fetch, ingest, storage, logging, or commit,
- secret output,
- `publicDataSource=supabase`,
- `scoreSource=real`,
- buy/sell recommendations,
- guaranteed return claims,
- real-time market-data claims.

## 7. Completion Definition

This goal slice is complete when:

1. PM, A1, and A2 ownership is recorded in this file.
2. A1 and A2 current artifacts are referenced by path.
3. `/` and `/briefing` continue to satisfy public BRIEF copy checks.
4. The checker for this file passes.
5. The full review gate still passes after integration.

## 8. Next CEO Decision

Recommended next mainline action:

`prepare_index_baseline_synthetic_contract_cases_no_fetch_then_pm_route_health`

Meaning:

PM should keep the field-contract labels route-healthy while A1 prepares synthetic-only field-contract cases and a Batch 1 symbol policy without row-list output. A2 should guard public wording so field-contract status stays understandable and does not leak parser internals. Real-data promotion remains blocked until a separately accepted source-rights, coverage, quality, rollback, and runtime gate is recorded.
