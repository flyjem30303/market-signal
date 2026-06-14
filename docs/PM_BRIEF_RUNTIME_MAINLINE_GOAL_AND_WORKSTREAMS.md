# PM BRIEF Runtime Mainline Goal And Workstreams

Updated: 2026-06-14

Status: `pm_brief_runtime_mainline_goal_ready`

## Chairman BRIEF Phase 1 / Phase 2 Acceleration Decision

Phase 1 comes first.

Phase 2 comes later.

PM owns the product/runtime engineering line and must keep the public/free index-lighting site moving toward public Beta. Membership work should stay as a roadmap and planning lane until the public experience is stable.

Updated CEO direction: Phase 2 is not cancelled. It becomes a small parallel planning lane so membership strategy is not lost, but Phase 2 runtime implementation remains blocked until Phase 1 is stable and publicly usable.

## Mainline Objective

The mainline objective is `phase_1_public_free_index_dashboard_usable_loop`.

PM should improve the product in larger coherent slices:

- market mood in 30 seconds
- action judgment in 3 minutes
- full-market overview
- core indicator panel
- alert list
- data update time
- data boundary
- non-investment-advice disclosure
- stable public route health

Avoid over-governance. Governance exists only to keep the project safe and continuous; it must not replace product/runtime progress.

Current GOAL execution rule:

- Push toward `public_beta_index_signal_dashboard_usable_loop`.
- Treat Phase 1 as the active product/runtime deliverable.
- Treat Phase 2 membership MVP as planning/specification until Phase 1 is stable.
- Prefer larger coherent slices that visibly improve user understanding, route health, launch readiness, or safety copy.
- Do not create narrow governance packets unless they remove a real launch blocker.

Current CEO acceleration rule:

- The active GOAL is `phase_1_pre_launch_usable_loop_before_ui_ux_polish`.
- Phase 1 must move toward launch-before-UI-polish readiness: public routes, reading contract, data/update boundary, non-advice disclosure, route health, and operator-safe launch evidence come before visual refinement.
- UI/UX design polish is intentionally deferred to the final Phase 1 pre-launch pass. Do not spend PM capacity on cosmetic layout, palette, spacing, animation, or component beautification unless the issue blocks comprehension, trust, accessibility, or route health.
- When Phase 1 enters UI/UX work, apply the chairman-approved skill split: `ui-ux-pro-max` owns information architecture, user flow, component layout, CTA design, and form flow; `frontend-design` owns visual style, color, card treatment, icons, typography, and animation.
- PM should run `ui-ux-pro-max` before `frontend-design` when a slice changes the user's reading order, journey, action path, or input flow. PM should run `frontend-design` after the UX structure is accepted or when the slice is purely visual.
- A1 data/source/coverage may continue in parallel, but it must not block the Phase 1 mock public Beta loop unless it exposes a launch-blocking source, rights, or boundary issue.
- A2/A3/A4 should be assigned only when they remove a concrete Phase 1 blocker; otherwise PM keeps the mainline moving.

## A1 Data / Source / Coverage Lane

A1 prepares legal/free automated source and coverage evidence.

Current A1 focus:

- legal free source confirmation
- coverage universe roadmap
- field-contract readiness
- ingestion/backfill readiness
- synthetic or aggregate-only artifacts when needed
- prepare_index_baseline_synthetic_parser_fixture_no_fetch
- twse_openapi_index_baseline_synthetic_parser_fixture_ready_no_fetch
- prepare_etf_market_price_synthetic_fixture_no_fetch
- etf_market_price_synthetic_fixture_ready_no_fetch
- etf_market_price_mock_runtime_handoff_ready_no_fetch
- etf_market_price_mock_runtime_handoff_review_then_public_label_integration
- docs/A1_BATCH1_LISTED_EQUITY_SYMBOL_POLICY_NO_ROW_LIST.md
- prepare_batch1_listed_equity_mock_runtime_policy_labels

A1 boundaries:

- no SQL execution
- no Supabase writes
- no `daily_prices` mutation
- no raw market-data fetch/store/commit
- no secret output

PM assignment rule: A1 should stay on legal/free automated data source, coverage universe, field contracts, and ingestion/backfill preparation. A1 outputs should be aggregate-only or synthetic-only until PM explicitly opens a bounded execution gate.

## A2 Public Copy / Product Safety Lane

A2 prepares public copy and safety guardrails.

Current A2 focus:

- data-source wording
- delayed/non-real-time wording
- non-investment-advice wording
- no-official-endorsement wording
- free/member boundary wording
- visible-language regression checks

PM assignment rule: A2 should remove user-facing ambiguity. A2 should not write internal governance copy for users; every output should help a normal investor understand source status, delay, risk, and non-advice boundaries.

## A3 Launch / Production Engineering Lane

A3 canonical lane label: `A3 launch/production engineering`.

A3 prepares launch engineering.

Canonical handoff: `docs/A3_LAUNCH_ENGINEERING_HANDOFF.md`.

Current A3 focus:

- Vercel health
- metadata / sitemap / robots
- monitoring
- rollback
- environment readiness
- post-deploy smoke checks

A3 boundaries:

- no production env mutation without PM/CEO approval
- no DNS change without PM/CEO approval
- no credential, OTP, payment, or account-verification action on behalf of the chairman

PM assignment rule: A3 should prepare launch checks, monitoring, rollback, metadata, sitemap, robots, and public route smoke evidence. A3 should not hold Phase 1 hostage to perfect production automation.

## A4 Membership MVP Planning Lane

A4 canonical lane label: `A4 membership MVP planning`.

A4 Membership MVP Planning Lane is a small planning-only parallel lane until Phase 1 is stable.

A4 may plan:

- market three-layer interpretation
- 自選追蹤 / watchlist
- custom alert conditions
- post-market review report
- member content boundary
- conversion metrics

A4 must not implement:

- login
- payment
- persisted watchlist
- personalized alert execution
- member-only content gating

PM rule: A4 may receive 5% planning capacity for Phase 2 scope, but PM must pause A4 whenever Phase 1 public readability, route health, launch checks, data-boundary wording, or user-facing cleanup need the capacity.

A4 planning acceptance: A4 is useful only if it clarifies the future MVP for market three-layer interpretation, watchlist/custom alert, post-market review, member boundary, and conversion metrics. A4 must not create login, payment, persisted watchlist, personalized alert execution, or member-only content gating during Phase 1.

## Runtime Stop Lines

The public runtime remains:

- `publicDataSource=mock`
- `scoreSource=mock`

Hard stop lines:

- no SQL execution
- no Supabase writes
- no `daily_prices` mutation
- no raw market-data fetch/store/commit
- no investment advice
- no buy/sell recommendation
- no official endorsement claim
- no guaranteed-return claim

## Next PM Rule

At each coherent slice, PM should:

1. Choose the highest-value Phase 1 product/runtime issue.
2. Execute the slice without waiting for unnecessary governance.
3. Keep A1/A2/A3/A4 assigned only where they reduce risk or unblock future work.
4. Run focused local checks.
5. Record status and Git backup after passing checks.

Current Phase 1 operator route anchor:

- `phase_1_public_beta_operator_decision_or_manual_platform_action_readiness_refresh`
- `phase_1_public_beta_chairman_operator_decision_readiness_packet_or_repair_ready`
- `phase_1_public_beta_chairman_operator_decision_2026_06_13_recorded`

## Dynamic Workstream Balance

Default allocation:

- PM mainline: 55%
- A1 data/source/coverage: 20%
- A2 public copy/product safety: 10%
- A3 launch engineering: 10%
- A4 membership MVP planning: 5%

PM may rebalance at any slice:

- If public pages are unclear, PM increases PM/A2 capacity.
- If data source or coverage gates block real-data readiness, PM increases A1 capacity.
- If Vercel, route health, metadata, monitoring, or rollback blocks launch, PM increases A3 capacity.
- If membership direction becomes vague but Phase 1 is healthy, PM lets A4 prepare the next spec.
- If any support lane slows Phase 1 without removing a real blocker, PM pauses it.

GOAL continuation guidance:

- Keep moving until a hard blocker requires external platform action, legal/source-rights decision, credential/secret input, or chairman-facing business decision.
- Record each completed slice in `PROJECT_STATUS.md`.
- Run focused local checks first; run broader checks only when the slice is integration-heavy.
- Git backup after passing checks when the environment allows it.
