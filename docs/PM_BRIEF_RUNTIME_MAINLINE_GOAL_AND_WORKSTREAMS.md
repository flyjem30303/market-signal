# PM BRIEF Runtime Mainline Goal And Workstreams

Updated: 2026-06-14

Status: `pm_brief_runtime_mainline_goal_ready`

Owner: PM mainline

## Current CEO Decision

### Chairman BRIEF Phase 1 / Phase 2 Acceleration Decision

Accept the chairman's latest `指數燈號網站 BRIEF` as the current product direction.

Phase 1 comes first:

- public free index-lighting site,
- all visitors can use it without login,
- market state, signal reason, risk reminder, update time, source/data boundary, and next observation are visible,
- Home, briefing, weekly, stock, methodology, disclaimer, terms, and privacy routes must be readable to general investors,
- public pages must not expose internal workflow, local commands, hard blockers, raw payload terms, operator packets, or development residue.

Phase 2 comes later:

- membership MVP,
- member-only daily three-layer interpretation,
- watchlist/custom alerts,
- post-market review,
- conversion and retention metrics.

Phase 2 membership strategy is important, but login, payment, watchlist persistence, alert persistence, and member-only reports must not slow Phase 1 public Beta readiness.

## Active GOAL Interpretation

The current GOAL should push toward a public Beta usable loop, not a governance console.

Completion direction:

- user can understand market mood within 30 seconds;
- user can decide within 3 minutes whether to observe, review risk, or wait;
- every core signal has state, reason, update time, and next observation;
- public pages state that data is demonstrative until source, coverage, quality, and runtime gates pass;
- non-investment-advice language stays visible;
- membership remains preview/roadmap until Phase 1 is stable.

## Workstreams

PM owns the product/runtime engineering line:

- public free product usability,
- runtime readability,
- route health,
- public page cleanup,
- public route integration,
- launch-readiness consolidation.

A1 Data / Source / Coverage Lane:

- legal free automated source candidates,
- coverage universe,
- field contracts,
- ingestion/backfill readiness,
- aggregate-only handoff.

A2 Public Copy / Product Safety Lane:

- trust copy,
- risk disclosure,
- source/update-time wording,
- non-investment-advice,
- free/member boundary.

A3 Launch / Production Engineering Lane:

- Vercel and environment inventory,
- route smoke,
- monitoring,
- rollback,
- SEO and analytics readiness,
- post-deploy evidence.

A4 Membership MVP Planning Lane:

- planning-only until Phase 1 is stable,
- membership information architecture,
- watchlist/custom alert shape,
- post-market review template,
- conversion metric design.

## Default Work Ratio

Until Phase 1 is stable enough for public Beta:

- PM: 55%
- A1: 20%
- A2: 10%
- A3: 15%
- A4: planning only when it removes Phase 2 ambiguity

CEO may adjust this ratio when route health, data readiness, public trust, or launch engineering becomes the bottleneck.

## Acceleration Rule

Avoid over-governance.

Use larger coherent slices when the work is mostly cleanup, copy alignment, route health, checker repair, or launch-readiness consolidation.

Do not create more operator packets unless they unlock:

- public route readiness,
- source/data trust,
- launch action,
- rollback or repair decision,
- membership boundary clarity,
- checker removal of stale internal/development residue.

## Hard Boundaries

The current PM mainline does not authorize:

- SQL execution,
- Supabase writes,
- `daily_prices` mutation,
- raw market-data fetch/store/commit,
- secret output,
- `publicDataSource=supabase`,
- `scoreSource=real`,
- real-time data claims,
- official endorsement claims,
- investment advice,
- Phase 2 membership implementation as a Phase 1 blocker.

The current allowed public posture remains:

- `publicDataSource=mock`
- `scoreSource=mock`
- no SQL execution
- no Supabase writes
- no `daily_prices` mutation
- no raw market-data fetch/store/commit
- no investment advice

## Current Route

`phase_1_public_free_index_dashboard_usable_loop`

## Next PM Slice

Continue public route cleanup and product-first runtime readability.

Priority order:

1. remove any remaining public-facing internal/development residue;
2. keep stock, home, briefing, weekly, methodology, disclaimer, terms, and privacy user-readable;
3. preserve Phase 2 membership as preview only;
4. rerun local route checks, TypeScript, build, and review gate;
5. hand green evidence to A3 for post-deploy monitoring when needed.

## Canonical Supporting Files

- `docs/PUBLIC_BETA_INDEX_DASHBOARD_BRIEF.md`
- `docs/PHASE_1_PHASE_2_EXECUTION_SPLIT_AND_WORKFLOW_ASSIGNMENT.md`
- `docs/A1_OFFICIAL_OPEN_FREE_SOURCE_TERMS_AND_COVERAGE_MATRIX_NO_FETCH.md`
- `docs/A2_HOME_FIRST_SCREEN_PUBLIC_COPY_HANDOFF.md`
- `docs/A3_PHASE_1_PUBLIC_BETA_RELEASE_OPS_INDEX.md`
- `docs/A4_MEMBERSHIP_MVP_PLANNING_HANDOFF.md`

## Support Lane Integration Anchors

These anchors keep A1/A2/A3 support-lane work integrated with the PM mainline without moving those tasks into Phase 1 public UI implementation.

A1 index baseline:

- `prepare_index_baseline_synthetic_parser_fixture_no_fetch`
- `twse_openapi_index_baseline_synthetic_parser_fixture_ready_no_fetch`
- `twse_openapi_index_baseline_synthetic_parser_fixture_review_then_mock_runtime_handoff`

A1 ETF market-price lane:

- `prepare_etf_market_price_synthetic_fixture_no_fetch`
- `etf_market_price_synthetic_fixture_ready_no_fetch`
- `etf_market_price_synthetic_fixture_review_then_mock_runtime_handoff`
- `etf_market_price_mock_runtime_handoff_ready_no_fetch`
- `etf_market_price_mock_runtime_handoff_review_then_public_label_integration`

A1 listed-equity batch policy:

- `docs/A1_BATCH1_LISTED_EQUITY_SYMBOL_POLICY_NO_ROW_LIST.md`
- `prepare_batch1_listed_equity_mock_runtime_policy_labels`

Support-lane boundaries:

- no-fetch
- no SQL execution
- no Supabase writes
- no staging rows
- no `daily_prices` mutation
- no raw market-row payload output
- no source promotion
- no `publicDataSource=supabase`
- no `scoreSource=real`
