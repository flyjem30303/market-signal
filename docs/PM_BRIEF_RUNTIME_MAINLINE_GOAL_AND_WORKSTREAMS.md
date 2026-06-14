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

## A1 Data / Source / Coverage Lane

A1 prepares legal/free automated source and coverage evidence.

Current A1 focus:

- legal free source confirmation
- coverage universe roadmap
- field-contract readiness
- ingestion/backfill readiness
- synthetic or aggregate-only artifacts when needed

A1 boundaries:

- no SQL execution
- no Supabase writes
- no `daily_prices` mutation
- no raw market-data fetch/store/commit
- no secret output

## A2 Public Copy / Product Safety Lane

A2 prepares public copy and safety guardrails.

Current A2 focus:

- data-source wording
- delayed/non-real-time wording
- non-investment-advice wording
- no-official-endorsement wording
- free/member boundary wording
- visible-language regression checks

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
