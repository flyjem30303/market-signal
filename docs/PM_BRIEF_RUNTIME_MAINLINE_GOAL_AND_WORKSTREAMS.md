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
- current PM assignment: keep extending source / coverage evidence toward the full public Beta data universe, but return only sanitized, no-secret, no-fetch artifacts that PM can accept through local checks.

A1 is responsible for:

- legal/free/automatable source candidate matrix,
- coverage categories for daily close, volume, date, symbol, ETF, index, and stock lanes,
- no-fetch terms review packets,
- source-lane questions for PM/CEO decisions.
- next background task: continue source/coverage evidence toward `OFFICIAL` and TWSE OpenAPI readiness without fetching market rows; return only sanitized, no-secret, aggregate or terms/field-contract artifacts for PM acceptance.

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
- current PM assignment: review stock detail and home-to-briefing language for 30-second comprehension, 3-minute action judgment, mock/real boundary clarity, and non-advice wording; propose copy patches only when they improve comprehension or safety.

A2 is responsible for:

- first-screen wording that supports 30-second market atmosphere,
- 3-minute action judgment copy,
- mock/real boundary readability,
- non-investment-advice wording,
- blocking internal execution strings on public surfaces.
- next background task: scan remaining public surfaces for user-facing comprehension gaps, especially stock detail and home-to-briefing transitions; propose copy patches only when they improve 30-second market mood, 3-minute action judgment, source trust, or legal clarity.

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

`wire_mock_runtime_source_coverage_labels_then_route_health`

Meaning:

PM should keep improving the public Beta usable loop while A1 continues source/coverage work and A2 continues copy safety. The next mainline slice should use A1's no-fetch source/coverage handoff to prepare mock-only runtime labels for source lane, coverage layer, and promotion blocker state, then verify route health. Real-data promotion remains blocked until a separately accepted source-rights, coverage, quality, rollback, and runtime gate is recorded.
