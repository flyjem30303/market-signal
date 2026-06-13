# PM BRIEF Runtime Mainline Goal And Workstreams

Updated: 2026-06-14

Status: `pm_brief_runtime_mainline_goal_ready`

Owner: PM mainline

## Latest Mainline Decision - 2026-06-14

### A3 Core Route Reading Contract Rollup Pass

CEO decision:

- Mainline should now connect product readability to A3 launch readiness.
- Home, Briefing, and Stock already share the public 30-second / 3-minute reading contract; A3 needs this as a formal launch evidence item.
- The slice remains Phase 1 only: no membership implementation, no real-data promotion, and no platform mutation.

PM completed the A3 rollup slice:

- Added `docs/A3_PHASE_1_CORE_ROUTE_READING_CONTRACT_ROLLUP.md`.
- Added and registered `check:a3-phase-1-core-route-reading-contract-rollup`.
- Linked the rollup into the A3 release-candidate report, go/no-go packet, and release ops index.

Latest checks passed:

- `check:a3-phase-1-core-route-reading-contract-rollup`
- `check:a3-phase-1-release-candidate-public-smoke-report`
- `check:a3-phase-1-public-beta-release-go-no-go-packet`
- `check:public-beta-decision-loop-bridge`
- `check:public-beta-production-brief-alignment`
- `check:public-beta-decision-journey-panel`
- `check:public-beta-data-readiness-status`
- `check:phase-1-public-beta-candidate-final-public-readiness-scan`
- `check:a2-brief-public-runtime-surface-audit`
- `check:public-beta-value-loop-refinement`
- `check:public-beta-user-value-source-coverage-bridge`
- `check:phase-1-public-beta-public-status-surface-alignment`
- `check:public-visible-language-quality`
- `check:phase-1-public-beta-public-visible-residue-cleanup`
- `check:review-gates`
- `npx tsc --noEmit`
- Browser smoke confirmed `/`, `/briefing`, and `/stocks/2330` expose public status, data readiness, source coverage, 3-minute decision order, no-advice copy, and no internal residue.

Current route:

- `phase_1_public_free_index_dashboard_launch_readiness`

Next PM slice:

- Continue the highest-value Phase 1 launch-readiness item without opening Phase 2 membership implementation. A3 core route reading contract and public route gates are currently green.

### Stock Fast Reading Loop Pass

CEO decision:

- Stock/detail pages are part of the Phase 1 public free experience.
- They should reuse the same reading contract as Home and Briefing: quick status, risk review, data timestamp, and next observation.
- Phase 2 membership remains roadmap-only; this slice only improves public stock-page understanding.

PM completed the stock fast-reading slice:

- Added a `標的快速判讀` section to stock/detail routes.
- Added public cards for `30 秒看懂標的狀態`, `3 分鐘複核風險`, `資料時間`, and `下一步觀察`.
- Updated the production BRIEF alignment gate and decision-loop bridge to protect the stock reading contract.

Latest checks passed:

- `check:public-beta-decision-loop-bridge`
- `check:public-beta-production-brief-alignment`
- `check:public-visible-language-quality`
- `check:phase-1-public-beta-public-visible-residue-cleanup`
- `check:pm-brief-runtime-mainline-goal-and-workstreams`
- `npx tsc --noEmit`
- Browser smoke confirmed `/stocks/2330` renders the stock fast-reading loop with no internal runtime tokens, mojibake, or console errors.

Current route:

- `phase_1_public_free_index_dashboard_usable_loop`

Next PM slice:

- Continue Phase 1 launch-readiness integration now that Home, Briefing, and Stock routes share the same public reading contract.

### Briefing Fast Reading Loop Pass

CEO decision:

- Mainline continues Phase 1 public usability before Phase 2 member implementation.
- Briefing should match the Home reading contract: quick market atmosphere, risk/context review, data timestamp, and next observation.
- The copy must remain public-facing and avoid real-data, member-only, or advice claims.

PM completed the briefing fast-reading slice:

- Added a `晨報快速判讀` section to `/briefing`.
- Added public cards for `30 秒看懂今日市場氣氛`, `3 分鐘行動判斷`, `資料更新時間`, and `下一步觀察`.
- Updated the production BRIEF alignment gate so the briefing fast-reading loop stays protected.

Latest checks passed:

- `check:a2-briefing-copy-patch`
- `check:public-beta-production-brief-alignment`
- `check:public-visible-language-quality`
- `check:phase-1-public-beta-public-visible-residue-cleanup`
- `check:pm-brief-runtime-mainline-goal-and-workstreams`
- `npx tsc --noEmit`
- Browser smoke confirmed `/briefing` renders the fast-reading loop with no internal runtime tokens, mojibake, or console errors.

Current route:

- `phase_1_public_free_index_dashboard_usable_loop`

Next PM slice:

- Continue stock-page decision-flow clarity so Home, Briefing, and individual asset pages share the same public reading contract.

### Home Fast Reading Loop Pass

CEO decision:

- Mainline stays on Phase 1 public usability.
- The home page should make the BRIEF promise concrete: 30 seconds to understand market atmosphere and 3 minutes to decide whether to observe, review risk, or reduce exposure.
- Phase 2 membership remains roadmap-only until Phase 1 public route quality is stable.

PM completed the home fast-reading slice:

- Added a `首頁快速判讀` section to Home.
- Added public cards for `30 秒看懂`, `3 分鐘複核`, `資料時間`, and `下一步`.
- Updated the production BRIEF alignment gate so this reading loop stays protected.

Latest checks passed:

- `check:public-beta-production-brief-alignment`
- `check:public-visible-language-quality`
- `check:phase-1-public-beta-public-visible-residue-cleanup`
- `check:pm-brief-runtime-mainline-goal-and-workstreams`
- `npx tsc --noEmit`
- Browser smoke confirmed `/` renders the new fast-reading loop with no internal runtime tokens, mojibake, or console errors.

Current route:

- `phase_1_public_free_index_dashboard_usable_loop`

Next PM slice:

- Continue route-by-route user-facing clarity, with the next PM slice focused on briefing or stock-page decision flow.

### Membership Roadmap Boundary Pass

CEO decision:

- `/membership` is a Phase 2 roadmap-only public page.
- It should help users understand the future value of member features without suggesting that login, payment, watchlist storage, custom alerts, or member-only content are available now.
- Phase 1 remains the priority: the public free index-lighting dashboard must become usable before member implementation expands.

PM completed the membership boundary slice:

- Added a `會員預覽目前狀態` section to `/membership`.
- Made the page state `這頁是會員路線圖，不是會員入口`.
- Added explicit not-yet-active wording for account creation, payment, watchlist storage, personalized alert sending, and member-only content.
- Updated `check:public-beta-membership-mvp-roadmap` to validate the rendered membership boundary language.

Latest checks passed:

- `check:public-beta-membership-mvp-roadmap`

Current route:

- `phase_1_public_free_index_dashboard_usable_loop`

Next PM slice:

- Run full public gates, TypeScript, and browser smoke for `/membership`; then return to Phase 1 public route clarity and trust/readability work.

### Weekly Public Data Trust And Reading Path Pass

CEO decision:

- Weekly stays in Phase 1 as a public free market-reading route.
- Weekly may disclose data-coverage limitations, but should not expose Supabase, operator, SQL, raw-data, or internal runtime labels to users.
- Phase 2 membership remains a future path; weekly can mention future post-market review / watchlist value but must not implement membership now.

PM completed the weekly public trust slice:

- `/weekly` now includes `WeeklyRowCoverageStatus`.
- The row-coverage panel now uses public wording and avoids row-count internals.
- Weekly public copy now states `公開 Beta 週報`, `示範資料與示範分數`, `正式市場資料尚未啟用`, `下週觀察重點`, and `重要聲明`.
- Weekly gates now validate current public Chinese language instead of retired internal English wording.

Latest checks passed:

- `check:a2-weekly-readable-copy`
- `check:weekly-market-action-summary`
- `check:weekly-row-coverage-status`
- `check:public-visible-language-quality`
- `check:phase-1-public-beta-public-visible-residue-cleanup`
- `check:public-beta-production-brief-alignment`
- `npx tsc --noEmit`
- Browser smoke confirmed `/weekly` shows the new public data coverage and disclaimer language, with no internal runtime tokens or console errors.

Current route:

- `phase_1_public_free_index_dashboard_usable_loop`

Next PM slice:

- Review `/membership` as Phase 2 roadmap-only: it should explain future membership value while avoiding active-account, active-payment, or available-member-only feature claims.

### Public Gate Language Modernization Pass

CEO decision:

- Public-route gates should enforce the BRIEF and user-facing safety language.
- They should not require old governance widgets or raw internal runtime variable labels to be visible to general users.
- Internal source-boundary terms may remain in docs/checkers where needed, but public routes should speak in normal investor language.

PM completed the gate modernization slice:

- `check:public-beta-alert-list-actionability` now follows Home's current `警示提醒`, `相對偏強`, and `風險較高` wording.
- `check:public-beta-decision-loop-bridge` now follows the current 30-second / 3-minute reading path.
- `check:a2-briefing-copy-patch` now validates current Briefing source structure and public copy, without asking public pages to expose `publicDataSource` / `scoreSource` labels.

Latest checks passed:

- `check:public-beta-alert-list-actionability`
- `check:public-beta-decision-loop-bridge`
- `check:a2-briefing-copy-patch`
- `check:public-visible-language-quality`
- `check:phase-1-public-beta-public-visible-residue-cleanup`
- `npx tsc --noEmit`

Current route:

- `phase_1_public_free_index_dashboard_usable_loop`

Next PM slice:

- Continue tightening public reading continuity and trust/status language before moving into Phase 2 membership implementation.

### Phase 1 Public Indicator Roadmap And Route Consistency Pass

CEO confirms the revised BRIEF is now the controlling product direction, but execution must stay phase-split:

- Phase 1: public free index-lighting site for every visitor.
- Phase 2: membership MVP after the public site is stable.

PM completed the next Phase 1 mainline slice:

- Home now exposes `首頁未來專業指標路線`.
- The section states that professional indicators remain in preparation and are not yet real market data, real scores, rankings, performance evidence, or investment advice.
- The public indicator roadmap now gives user-readable future value for market temperature, stock health, risk signal, and next-step observation.
- Route consistency and Home / Briefing reading-bridge checks now match the current BRIEF wording instead of old internal/governance wording.

Latest checks passed:

- `check:home-investor-indicator-roadmap-panel`
- `check:public-beta-route-consistency`
- `check:home-briefing-investor-reading-bridge`
- `check:public-visible-language-quality`
- `check:phase-1-public-beta-public-visible-residue-cleanup`
- `check:public-beta-production-brief-alignment`
- `check:public-beta-core-route-quick-proof`
- `check:phase-1-phase-2-execution-split-and-workflow-assignment`
- `check:pm-brief-runtime-mainline-goal-and-workstreams`
- `check:public-beta-phase-1-launch-gap-rollup`
- `npx tsc --noEmit`
- Browser smoke confirmed `/` shows `首頁未來專業指標路線`, `未來專業指標仍在準備階段`, and `警示提醒`; `/briefing` shows `市場晨報`, `市場行動摘要`, and `公開使用狀態`; no internal runtime tokens or console errors appeared.

Current route:

- `phase_1_public_free_index_dashboard_usable_loop`

Workflow split:

- PM mainline: public user journey, runtime readability, route consistency, public residue cleanup.
- A1: data source, coverage, ingestion/backfill readiness, no raw fetch unless explicitly opened.
- A2: trust copy, non-advice boundary, public claim wording.
- A3: launch engineering, production environment, monitoring, rollback.
- A4: Phase 2 membership MVP planning only.

Next PM slice:

- Tighten Home -> Briefing -> Stock reading continuity and trust/status language so Phase 1 feels like a coherent index-lighting dashboard before any Phase 2 membership implementation.

### Public BRIEF Gate Alignment And Alert Surface Pass

CEO confirms the revised BRIEF should be executed in two phases:

- Phase 1: public free index-lighting site for every visitor.
- Phase 2: membership MVP after Phase 1 is stable.

PM completed a focused Phase 1 alignment slice:

- Home now exposes a visible `警示提醒` section before the relative-strength and higher-risk lists.
- `/briefing` now uses `市場晨報` instead of the old English `Market Briefing` eyebrow.
- `check:public-beta-production-brief-alignment` now validates local public routes by default and can still target production through `PUBLIC_BETA_PRODUCTION_URL`.
- The production BRIEF gate now checks user-facing copy, mojibake, and internal residue, instead of requiring public pages to display internal runtime tokens.
- `check:briefing-product-first-information-hierarchy` now matches the current public route structure after old internal governance widgets were removed.

Latest checks passed:

- `check:public-beta-production-brief-alignment`
- `check:briefing-product-first-information-hierarchy`
- `check:public-visible-language-quality`
- `check:phase-1-public-beta-public-visible-residue-cleanup`
- `check:public-beta-core-route-quick-proof`
- `check:public-surface-user-facing-audit`
- `check:pm-brief-runtime-mainline-goal-and-workstreams`
- `check:phase-1-phase-2-execution-split-and-workflow-assignment`
- `npx tsc --noEmit`
- Browser smoke confirmed `/` shows `警示提醒`; `/briefing` shows `市場晨報`, not `Market Briefing`; no internal runtime tokens or console errors appeared.

Current route:

- `phase_1_public_free_index_dashboard_usable_loop`

Lane reminder:

- PM owns the public free user journey.
- A1 continues data/source/coverage.
- A2 guards trust copy and non-advice boundaries.
- A3 guards launch engineering.
- A4 remains Phase 2 membership planning-only.

### Public Mainline Action Bridge Pass

CEO confirms Phase 1 must feel like a decision-support dashboard, not a static score display.

PM completed a focused action-bridge slice:

- Home core indicator readout now explicitly says `30 秒可讀` and `3 分鐘可行動`.
- Home action labels now include `可先關注`, `加強觀察`, `降低風險`, and `先複核`.
- Home data line now keeps `正式資料尚未啟用` visible next to data freshness.
- `/briefing` market action summary now includes a visible `下一步觀察` sentence.
- Stock decision compass now exposes `決策輔助摘要` above the 30-second cards.
- Stock investor action summary eyebrow is now `投資人行動摘要`.
- `check:home-core-indicator-readout` now aligns with Chinese-first public labels and blocks the old English `Core Indicator Readout` label from returning.

Latest checks passed:

- `check:home-core-indicator-readout`
- `check:public-beta-mainline-action-bridge`
- `check:public-visible-language-quality`
- `check:public-surface-user-facing-audit`
- `check:public-beta-core-route-quick-proof`
- `check:pm-brief-runtime-mainline-goal-and-workstreams`
- `check:public-beta-chinese-first-route-labels`
- `npx tsc --noEmit`
- Browser smoke confirmed `/`, `/briefing`, and `/stocks/2330` show the expected action language, no old English action labels, and no console errors.

Current route:

- `phase_1_public_free_index_dashboard_usable_loop`

Lane reminder:

- PM owns public action clarity.
- A1 continues data/source/coverage.
- A2 guards trust copy and non-advice boundaries.
- A3 guards launch engineering.
- A4 remains Phase 2 membership planning-only.

### Public Route Chinese-First Label Pass

CEO confirms Phase 1 public routes should be Chinese-first and investor-facing.

PM completed a focused public-label slice:

- Home labels now use `資料信任`, `標的瀏覽`, and `下一步`.
- `/briefing` labels now use `市場晨報` and `市場行動摘要`.
- `/weekly` labels now use `市場週報` and `週報行動摘要`.
- Added `check:public-beta-chinese-first-route-labels` for high-exposure routes: `/`, `/briefing`, `/weekly`, `/membership`, `/stocks/2330`, and `/stocks/TWII`.
- The gate blocks old English preview labels such as `Data Trust`, `Explore`, `Market Action Summary`, `Member MVP`, `Membership Preview`, `Next`, `Not Open Yet`, and `Weekly Report`.

Latest checks passed:

- `check:public-beta-chinese-first-route-labels`
- `check:public-visible-language-quality`
- `check:public-surface-user-facing-audit`
- Browser smoke confirmed `/`, `/weekly`, and `/briefing` show the expected Chinese labels, no old English preview labels, and no console errors.

Current route:

- `phase_1_public_free_index_dashboard_usable_loop`

Lane reminder:

- This is PM mainline public UX work. A1/A2/A3/A4 assignments remain unchanged.

### Membership Preview Trust Context Alignment

CEO confirms membership remains Phase 2, but the Phase 2 route must still be understandable and trustworthy during Phase 1.

PM completed a focused membership-preview trust slice:

- Added a dedicated `membership` context to `TrustRuntimeBoundaryNotice`.
- `/membership` now uses membership-specific trust copy instead of borrowing methodology-page copy.
- `/membership` eyebrow labels are now Chinese-first: `會員功能預覽`, `會員 MVP`, and `尚未開放`.
- The page continues to state that login, payment, watchlist storage, personalized alert execution, and member-only content are not open yet.

Latest checks passed:

- `check:public-beta-membership-mvp-roadmap`
- `check:public-visible-language-quality`
- `check:public-surface-user-facing-audit`
- `npx tsc --noEmit`

Current route:

- `phase_1_public_free_index_dashboard_usable_loop`

Lane reminder:

- A4 can plan membership MVP, but PM must not implement Phase 2 membership systems during Phase 1.

### Core Route Quick Proof Public-Brief Alignment

CEO confirms the active BRIEF is split into two execution phases:

- Phase 1: public free index-lighting site for all visitors.
- Phase 2: membership MVP after Phase 1 is stable enough.

PM completed a route-proof alignment slice:

- `check:public-beta-core-route-quick-proof` now validates public BRIEF language and route health instead of requiring early internal governance widgets on public pages.
- `/briefing` and `/weekly` are checked for user-facing market briefing, 30-second / 3-minute judgment, demo-data boundary, non-investment-advice wording, and membership-roadmap separation.
- Public source surfaces are scanned for high-risk internal residue, including command snippets, platform env names, SQL/Supabase/raw-data wording, hard-blocker labels, and external-reply workflow residue.
- Runtime promotion is still blocked by exact guardrails: no `scoreSource: "real"`, no `publicDataSource: "supabase"`, and no Supabase client use in guarded runtime files.

Latest checks passed:

- `check:public-beta-core-route-quick-proof`
- `check:public-visible-language-quality`
- `check:phase-1-public-beta-public-visible-residue-cleanup`
- `check:public-surface-user-facing-audit`
- `npx tsc --noEmit`

Current PM route:

- `phase_1_public_free_index_dashboard_usable_loop`

Current lane assignments:

- PM mainline: continue Phase 1 public usability, route health, and launch readiness.
- A1: continue legal/free/automatable data-source and coverage work; no raw market-row fetch unless explicitly opened.
- A2: continue public trust copy, non-advice copy, source/update-time disclosure, and free/member boundary.
- A3: continue launch engineering, deployment smoke, monitoring, rollback, and Vercel readiness.
- A4: keep Phase 2 membership MVP planning ready; do not implement membership in Phase 1.

### Stock Page Public Decision-Aid Alignment

CEO confirms the revised BRIEF execution split:

- Phase 1 remains the mainline: finish the public free index-lighting site for every visitor.
- Phase 2 remains planned: membership MVP, member-only daily interpretation, watchlist/custom alerts, and post-market review after Phase 1 is stable.
- A4 may keep membership MVP planning ready, but login, payment, watchlist persistence, alert execution, and member-only content are not Phase 1 blockers.

PM completed a stock-page public decision-aid slice:

- Stock pages now show a public decision compass for 30-second reading, risk heat, and demonstrative score boundary.
- Stock pages now connect `buildInvestorActionSummary` into a visible Investor Action Summary.
- Stock pages now include indicator priority: data confidence, main support, and main risk.
- Stock pages now include market context and data-boundary panels so users can place a single symbol back into the wider market.
- Stale stock checks that previously demanded internal governance/authorization panels were replaced with public BRIEF-aligned checks.

Current lane assignments:

- PM mainline: continue Phase 1 public comprehension and route health.
- A1: continue legal/free/automatable data-source and coverage work, without source promotion or raw row fetch unless explicitly opened.
- A2: continue trust copy, non-investment-advice wording, data-source/update-time disclosure, and free/member boundary.
- A3: keep launch engineering, remote smoke, monitoring, rollback, and deployment repair ready.
- A4: continue membership MVP planning only; do not implement Phase 2 during Phase 1.

Latest checks passed:

- `check:stock-route-investor-language-alignment`
- `check:stock-first-screen-action-summary`
- `check:stock-investor-action-summary`
- `check:stock-decision-compass`
- `check:stock-indicator-priority-panel`
- `check:stock-investor-indicator-roadmap-panel`
- `check:market-action-summary-coverage`
- `check:public-visible-language-quality`
- `check:phase-1-public-beta-public-visible-residue-cleanup`
- `check:public-surface-user-facing-audit`
- `npx tsc --noEmit`

### Public Title And Membership Reading Promise Follow-up

PM completed the next user-facing smoke slice after the BRIEF split:

- `/membership` now visibly carries the same 30-second / 3-minute reading promise as the Phase 1 public site.
- `/briefing`, `/weekly`, and `/membership` no longer duplicate the site name in browser titles.
- `check-public-visible-language-quality` now blocks duplicated `| 指數燈號 | 指數燈號` titles.
- Membership and public-surface gates now require 30-second / 3-minute copy on `/membership`.

Browser smoke confirmed:

- `/briefing`, `/weekly`, and `/membership` have clean titles.
- `/membership` shows 30-second and 3-minute language.
- No visible `Phase 1`, `Phase 2`, `Membership MVP`, command, `publicDataSource`, or `scoreSource` residue appeared.

CEO confirms the revised BRIEF is now the active product target and must be executed in two phases:

- Phase 1: finish the public free index-lighting site that every visitor can use.
- Phase 2: build the membership MVP only after Phase 1 is stable enough.

PM execution route:

- Current route: `phase_1_public_free_index_dashboard_usable_loop`.
- Primary objective: make the public site understandable, trustworthy, and launchable before opening membership implementation.
- Membership route `/membership` is now a public preview, not a member system.
- Home core indicators now include market mood, market breadth, risk heat, and data confidence.

Updated lane assignments:

- PM mainline: public comprehension, Home/briefing/stock route clarity, runtime/readability integration, and launch-readiness checks.
- A1: legal/free/automatable data-source and coverage work; PM integrates only accepted aggregate-safe outputs.
- A2: public trust copy, source/update-time disclosure, non-investment-advice posture, and free/member boundary.
- A3: launch engineering, metadata, route smoke, rollback, monitoring, and platform packets only when concrete platform action is needed.
- A4: Phase 2 membership MVP planning, including daily three-layer interpretation, watchlist/custom alerts, post-market review, analytics, and conversion path. A4 must not open login, payment, watchlist persistence, alerts, or member-only content during Phase 1.

Latest checks passed:

- `check:public-beta-index-dashboard-brief-loop`
- `check:phase-1-phase-2-execution-split-and-workflow-assignment`
- `check:public-beta-membership-mvp-roadmap`
- `check:public-visible-language-quality`
- `check:public-beta-core-route-quick-proof`
- `check:public-surface-user-facing-audit`
- `check:phase-1-public-beta-public-visible-residue-cleanup`
- `check:a3-phase-1-release-candidate-public-smoke-report`
- `npx tsc --noEmit`

## 0. CEO Phase Decision - 2026-06-13

The current BRIEF is now the `指數燈號網站 BRIEF`.

CEO decision:

- Phase 1 comes first: complete the public free index-lighting site that every user can use.
- Phase 2 comes later: build membership-only content, registration/login, watchlist, custom alerts, post-market review, and conversion metrics.
- Phase 2 planning is allowed, but Phase 2 implementation must not slow Phase 1 public launch readiness.
- PM may adjust active lanes from PM/A1/A2/A3/A4 based on stage needs.

Current lane model:

- PM mainline: Phase 1 product/runtime integration, public pages, market-light readability, and final launch gap tracker.
- A1 Data / Source / Coverage: legal free automated source candidates, coverage universe, field contracts, ingestion/backfill preparation, no-fetch/no-write until authorized.
- A2 Public Copy / Product Safety: trust copy, non-investment-advice posture, data-source disclosure, free/member boundary, and public wording guard.
- A3 Launch / Production Engineering: Vercel, env inventory, domain, monitoring, SEO, analytics, cache, release, and rollback checklist.
- A4 Membership MVP Planning: standby for Phase 2 membership MVP; activate only after PM decides it will not slow Phase 1.

Current CEO execution priority:

1. Finish Phase 1 public free site readiness.
2. Keep the membership MVP path visible but not blocking.
3. Convert all user-facing pages from internal project status to market status, risk status, source status, and next observation.
4. Keep `publicDataSource=mock` and `scoreSource=mock` until source, coverage, quality, rollback, and runtime gates pass.
5. Avoid over-governance: documents and checks should unlock implementation, not replace it.

Latest CEO route correction after revised BRIEF:

- CEO confirms the revised BRIEF must be split into Phase 1 and Phase 2.
- Phase 1 is the active mainline: a public free index-lighting site that every visitor can use without membership.
- Phase 2 is the membership MVP path: daily three-layer interpretation, watchlist/custom alert conditions, and post-market review.
- PM should not keep spending routine slices on operator/governance packet expansion unless it unlocks a concrete launch action or repair.
- Current PM route is `phase_1_public_free_index_dashboard_usable_loop`.
- PM mainline should push visible product usefulness first: 30-second market mood, 3-minute action judgment, signal reason, update time, source/data boundary, non-investment-advice copy, and route health.
- A1 continues legal/free/automatable data-source and coverage preparation; A2 guards trust copy and free/member boundary; A3 handles only launch/platform tasks that become necessary; A4 keeps membership MVP planning ready without implementing Phase 2 in Phase 1.

Latest Phase 1 public usability wording pass:

- PM tightened the shared Home/stock hero so the decision-aid line no longer repeats buy/sell wording; it now frames the site as observation support and says it should not be used as a trading basis.
- PM tightened `/weekly` so formal-data upgrade is separate from Phase 2 membership. Formal data waits for source, coverage, and quality conditions; member deep review remains a Phase 2 roadmap item.
- This keeps the Phase 1 public free site clearer without opening membership implementation or real-data promotion.
- Checks passed: `check:public-visible-language-quality`, `check:public-surface-user-facing-audit`, `check:weekly-market-action-summary`, and `check:public-beta-core-route-quick-proof`.
- Current PM route remains `phase_1_public_free_index_dashboard_usable_loop`.
- Next PM slice should continue only if it improves 30-second market mood, 3-minute action judgment, source/update clarity, non-advice trust, route health, or launch readiness.

Latest Phase 1 / Phase 2 visual priority pass:

- PM moved the Phase 2 membership MVP roadmap lower on Home and `/briefing`.
- The member roadmap remains visible, but users now first see the Phase 1 public value path: market mood, 30-second reading, 3-minute action judgment, data/update boundary, and source/coverage clarity.
- This preserves the BRIEF's membership path without letting Phase 2 compete with the public free launch path.
- Checks passed: `check:public-beta-membership-mvp-roadmap`, `check:public-visible-language-quality`, `check:public-beta-core-route-quick-proof`, and TypeScript.
- Next PM slice should continue improving the public usable loop; A4 should stay planning-only until Phase 1 public Beta is stable.

Latest Phase 1 alert actionability pass:

- PM fixed the remaining `/briefing` alert-list actionability gap by adding a visible `使用提醒` line.
- The briefing alert list now tells users to read alerts by status, cause, update time, impact level, and next step, which directly supports the BRIEF's 3-minute action judgment.
- Checks passed: `check:public-beta-alert-list-actionability`, `check:briefing-midpage-readability`, `check:public-visible-language-quality`, and `check:public-beta-core-route-quick-proof`.
- Next PM slice should move to launch-readiness evidence or a true route comprehension gap; do not spend more time on alert-list wording unless a rendered check fails.

Latest Phase 1 mock launch candidate rollup pass:

- PM/A3 updated `docs/PUBLIC_BETA_PHASE_1_LAUNCH_GAP_ROLLUP.md` from an operator-review next route to a mock launch candidate next route.
- Current launch posture is `GO_WITH_MOCK_ONLY_PUBLIC_BETA_CANDIDATE`.
- A3 operator/platform review remains a standby path only when a real platform action, manual platform checklist, or post-deploy smoke record is needed.
- Checks passed: `check:public-beta-phase-1-launch-gap-rollup`, `check:public-beta-mock-launch-proof-bundle`, and `check:public-beta-core-route-quick-proof`.
- Current PM route is `phase_1_public_beta_mock_launch_candidate_status_summary`.
- Next PM slice should produce a concise mock-only candidate status summary rather than expanding operator governance.

Latest Phase 1 mock launch candidate status summary:

- PM added `docs/PHASE_1_PUBLIC_BETA_MOCK_LAUNCH_CANDIDATE_STATUS_SUMMARY.md`.
- PM added and registered `check:phase-1-public-beta-mock-launch-candidate-status-summary`.
- The summary records what can go public now, what remains deferred, which checks prove the mock-only public site is usable, and when A3 platform/operator work resumes.
- Status is `phase_1_public_beta_mock_launch_candidate_status_summary_ready`.
- Decision remains `GO_WITH_MOCK_ONLY_PUBLIC_BETA_CANDIDATE`.
- Checks passed: `check:phase-1-public-beta-mock-launch-candidate-status-summary`, `check:public-beta-phase-1-launch-gap-rollup`, and `check:public-beta-mock-launch-proof-bundle`.
- Current PM route is `phase_1_public_beta_candidate_final_public_readiness_scan`.
- Next PM slice should perform a final public user-readiness scan across the candidate before asking for any A3 platform/operator action.

Latest Phase 1 final public readiness scan:

- PM added `docs/PHASE_1_PUBLIC_BETA_CANDIDATE_FINAL_PUBLIC_READINESS_SCAN.md`.
- PM added and registered `check:phase-1-public-beta-candidate-final-public-readiness-scan`.
- The scan covers `/`, `/briefing`, `/weekly`, `/stocks/2330`, `/stocks/TWII`, `/methodology`, `/disclaimer`, `/terms`, and `/privacy`.
- The candidate now has a mechanical public-readiness gate for the BRIEF's 30-second market mood, 3-minute action judgment, source/update/data boundary, non-investment-advice wording, and Phase 2 membership deferral.
- The gate blocks visible development residue such as command snippets, local paths, operator/packet/preflight wording, SQL/Supabase write/staging/raw-payload terms, secrets/env wording, `publicDataSource`/`scoreSource` field labels, mojibake markers, official endorsement, complete Taiwan coverage, real-time precision, guaranteed-return claims, and investment-advice claims.
- Status is `phase_1_public_beta_candidate_final_public_readiness_scan_ready`.
- Decision is `PUBLIC_CANDIDATE_SCAN_PASS_WITH_MOCK_BOUNDARY`.
- Result is `PASS_AS_MOCK_ONLY_PUBLIC_BETA_CANDIDATE`.
- Checks passed: `check:phase-1-public-beta-candidate-final-public-readiness-scan`.
- Current PM route is `phase_1_public_beta_human_visual_review_or_a3_no_secret_platform_checklist`.
- Next PM slice should perform a human/browser visual review for layout confidence or hand the candidate to A3 only if an actual no-secret platform action is desired.

Latest Phase 1 human/browser visual review:

- PM added `docs/PHASE_1_PUBLIC_BETA_HUMAN_VISUAL_REVIEW.md`.
- PM added and registered `check:phase-1-public-beta-human-visual-review`.
- Browser review covered `/`, `/briefing`, and `/stocks/2330` as representative routes for first-screen overview, briefing-level explanation, and stock/index detail-page decision support.
- The reviewed routes showed clear 30-second market mood language, 3-minute action-judgment language, source/update-time/demonstrative-data boundaries, non-investment-advice/no-buy-sell-advice wording, and Phase 2 membership deferral.
- The reviewed routes did not show hard blocker panels, command snippets, local paths, operator/packet/preflight/post-run residue, SQL/Supabase write/staging/raw-payload terms, secrets/env wording, `publicDataSource`/`scoreSource` residue, or mojibake markers in reviewed headings.
- Status is `phase_1_public_beta_human_visual_review_ready`.
- Decision is `PUBLIC_VISUAL_REVIEW_PASS_WITH_MOCK_BOUNDARY`.
- Result is `PASS_HUMAN_BROWSER_REVIEW_AS_MOCK_ONLY_PUBLIC_BETA`.
- Checks passed: `check:phase-1-public-beta-human-visual-review`, `check:phase-1-public-beta-candidate-final-public-readiness-scan`, and `check:pm-brief-runtime-mainline-goal-and-workstreams`.
- Current PM route is `phase_1_public_beta_a3_no_secret_platform_checklist_or_chairman_visual_acceptance`.
- Next PM slice should either prepare the A3 no-secret platform checklist handoff or record chairman visual acceptance, depending on whether the chairman wants an actual public deployment movement now.

Latest Phase 1 visual acceptance / A3 handoff:

- PM added `docs/PHASE_1_PUBLIC_BETA_VISUAL_ACCEPTANCE_AND_A3_HANDOFF.md`.
- PM added and registered `check:phase-1-public-beta-visual-acceptance-and-a3-handoff`.
- This is now the decision entrypoint after final public readiness and human/browser visual review.
- Current route is `phase_1_public_beta_visual_acceptance_and_a3_handoff`.
- Decision is `VISUAL_ACCEPTANCE_READY_THEN_A3_NO_SECRET_HANDOFF`.
- Result is `READY_FOR_CHAIRMAN_VISUAL_ACCEPTANCE_OR_A3_NO_SECRET_CHECKLIST`.
- The next valid PM actions are no longer broad readiness expansion:
  - record chairman visual acceptance if deployment waits;
  - hand the candidate to A3 using `docs/A3_PHASE_1_PUBLIC_BETA_MANUAL_PLATFORM_ACTION_CHECKLIST.md` if deployment movement proceeds.
- Checks passed: `check:phase-1-public-beta-visual-acceptance-and-a3-handoff`, `check:phase-1-public-beta-human-visual-review`, `check:phase-1-public-beta-candidate-final-public-readiness-scan`, and `check:a3-phase-1-public-beta-manual-platform-action-checklist`.
- PM should not reopen routine governance or operator packet expansion unless a concrete A3 action, failed smoke result, or public-page regression requires it.

Latest Phase 1 chairman visual acceptance record:

- PM added `docs/PHASE_1_PUBLIC_BETA_CHAIRMAN_VISUAL_ACCEPTANCE_RECORD.md`.
- PM added and registered `check:phase-1-public-beta-chairman-visual-acceptance-record`.
- The record accepts the Phase 1 mock-only public Beta visual/product candidate only.
- Accepted scope: public free index-lighting site, first-screen market mood/core indicator readout, 30-second comprehension, 3-minute observation/risk-reduction judgment support, source/update-time/demonstrative-data boundaries, non-investment-advice/no-buy-sell-advice posture, and Phase 2 membership as a deferred roadmap.
- Status is `phase_1_public_beta_chairman_visual_acceptance_recorded`.
- Decision is `ACCEPT_PHASE_1_MOCK_ONLY_PUBLIC_BETA_VISUAL_CANDIDATE`.
- Result is `PHASE_1_MOCK_ONLY_PUBLIC_BETA_VISUAL_CANDIDATE_ACCEPTED`.
- Checks passed: `check:phase-1-public-beta-chairman-visual-acceptance-record`, `check:phase-1-public-beta-visual-acceptance-and-a3-handoff`, and `check:pm-brief-runtime-mainline-goal-and-workstreams`.
- Current PM route is `phase_1_public_beta_a3_manual_platform_action_if_deployment_proceeds`.
- If deployment proceeds, A3 follows `docs/A3_PHASE_1_PUBLIC_BETA_MANUAL_PLATFORM_ACTION_CHECKLIST.md`; if deployment waits, PM should continue only concrete public comprehension, trust copy, source/coverage, or route-health fixes.

Latest A3 manual platform checklist evidence-chain refresh:

- PM/A3 updated `docs/A3_PHASE_1_PUBLIC_BETA_MANUAL_PLATFORM_ACTION_CHECKLIST.md`.
- PM/A3 updated `scripts/check-a3-phase-1-public-beta-manual-platform-action-checklist.mjs`.
- The A3 deployment-prep checklist now requires the latest:
  - final public readiness scan;
  - human/browser visual review;
  - visual acceptance / A3 handoff;
  - chairman visual acceptance record.
- The checklist now requires `docs/PHASE_1_PUBLIC_BETA_CHAIRMAN_VISUAL_ACCEPTANCE_RECORD.md` to be `phase_1_public_beta_chairman_visual_acceptance_recorded` before platform movement.
- The same checklist still states that the visual acceptance record does not authorize deployment by itself.
- Checks passed: `check:a3-phase-1-public-beta-manual-platform-action-checklist`, `check:phase-1-public-beta-chairman-visual-acceptance-record`, and `check:pm-brief-runtime-mainline-goal-and-workstreams`.
- Current PM/A3 route remains `phase_1_public_beta_a3_manual_platform_action_if_deployment_proceeds`.

Latest A3 no-secret pre-platform action packet:

- PM/A3 added `docs/A3_PHASE_1_PUBLIC_BETA_NO_SECRET_PRE_PLATFORM_ACTION_PACKET.md`.
- PM/A3 added and registered `check:a3-phase-1-public-beta-no-secret-pre-platform-action-packet`.
- The packet is now the one-page operator entrypoint before any future Phase 1 public Beta platform movement.
- It compresses chairman visual acceptance, final public readiness, human/browser visual review, A3 manual platform checklist, no-secret env/rollback checklist, and post-platform report template into a no-secret handoff.
- It defines required local commands before operator action, no-secret platform checks, allowed operator safe reply fields, accepted deferrals, stop lines, and the post-action report route.
- Status is `a3_phase_1_public_beta_no_secret_pre_platform_action_packet_ready`.
- Decision is `READY_FOR_NO_SECRET_OPERATOR_PRE_PLATFORM_ACTION`.
- Checks passed: `check:a3-phase-1-public-beta-no-secret-pre-platform-action-packet`, `check:a3-phase-1-public-beta-manual-platform-action-checklist`, and `check:a3-phase-1-public-beta-post-platform-action-report-template`.
- Current PM/A3 route is `phase_1_public_beta_operator_action_or_no_action_safe_reply`.
- If no platform movement is desired, PM/A3 should record no-action and return to concrete public comprehension, trust copy, source/coverage, route-health, or A1 data-readiness work.

Latest A3 operator action / no-action safe reply:

- PM/A3 added `docs/PHASE_1_PUBLIC_BETA_OPERATOR_ACTION_OR_NO_ACTION_SAFE_REPLY.md`.
- PM/A3 added and registered `check:phase-1-public-beta-operator-action-or-no-action-safe-reply`.
- The current A3 pre-platform packet loop is closed as `no_action`.
- Recorded safe reply values: `actionTaken: none`, `actionResult: not_run`, `publicUrl: pending`, `deploymentLabel: pending`, `routeSmoke: not_run`, `claimSmoke: not_run`, `publicDataSource: mock`, and `scoreSource: mock`.
- PM classification is `ACCEPT_NO_ACTION_RECORD`.
- No post-platform report should be filled because no platform action occurred.
- Checks passed: `check:phase-1-public-beta-operator-action-or-no-action-safe-reply`, `check:a3-phase-1-public-beta-no-secret-pre-platform-action-packet`, `check:phase-1-public-beta-operator-safe-reply-template`, and `check:phase-1-public-beta-operator-safe-reply-pm-intake-recorder`.
- Current PM route is `phase_1_public_beta_pm_mainline_or_reenter_a3_pre_platform_packet`.
- If deployment remains deferred, return to concrete public comprehension, trust copy, source/coverage, route-health, or A1 data-readiness work; if deployment becomes desired, re-enter the A3 no-secret pre-platform packet.

Latest revised-BRIEF consolidation:

- PM replaced `docs/PUBLIC_BETA_INDEX_DASHBOARD_BRIEF.md` with a readable Chinese BRIEF matching the chairman's latest product direction.
- The active split is explicit: Phase 1 is the public free index-lighting website; Phase 2 is the membership MVP path.
- Phase 1 must keep moving on public user comprehension, public route cleanup, runtime readability, source/update-time honesty, and launch readiness.
- Phase 2 membership planning is allowed through A4, but login, payment, member-only content, watchlist persistence, custom alert execution, and post-market review implementation do not block Phase 1 public Beta.
- A1 continues data/source/coverage without raw market-row fetch, A2 guards trust copy and free/member boundary, A3 guards production launch engineering, and A4 stays ready for membership MVP planning.
- Checks passed for this consolidation: `check:phase-1-phase-2-execution-split-and-workflow-assignment` and `check:public-visible-language-quality`.

Latest Phase 1 public route cleanup:

- PM cleaned public Home, `/briefing`, `/weekly`, and stock-route user-facing language so the product now reads as a market-status dashboard instead of an internal project dashboard.
- Home now exposes a public core indicator readout for `市場氣氛`, `風險熱度`, and `資料可信度`.
- Shared labels for assets, data freshness, signal modules, briefing, weekly, and stock metadata were rewritten to readable Chinese.
- Browser verification confirmed `/briefing`, `/weekly`, and `/stocks/2382` render without mojibake and preserve the mock-data / non-investment-advice boundary.
- Checks passed: `check:public-visible-language-quality`, `check:briefing-midpage-readability`, `check:weekly-market-action-summary`, `check:stock-decision-aid-actionability`, TypeScript, and `npm run build`.

Latest strict public surface audit:

- PM aligned `/weekly` with the BRIEF's 30-second / 3-minute promise by adding visible `30 秒` wording and explicit `非投資建議` copy.
- PM cleared a local Next dev `.next` chunk drift and restarted the local server after temporary 500s appeared during rendered-route checks.
- Checks passed: `check:public-surface-user-facing-audit`, `check:public-beta-core-route-quick-proof`, `check:weekly-market-action-summary`, and TypeScript.
- Next PM route: continue remaining public surface audit, then hand the stable Phase 1 candidate to A3 launch smoke readiness.

Latest A3 launch smoke readiness:

- PM fixed stock route metadata so `src/app/stocks/[symbol]/page.tsx` explicitly contains the standard `非投資建議` wording.
- A3 metadata and public-route smoke readiness now passes with `publicDataSource=mock` and `scoreSource=mock`.
- Checks passed: `check:a3-phase-1-metadata-and-public-route-smoke-checker`, `check:public-beta-core-route-quick-proof`, and TypeScript.
- Next PM/A3 route: prepare the Phase 1 release-candidate public smoke report, then continue the no-secret operator / post-deploy monitoring path.

Latest A3 release-candidate readiness:

- PM verified the Phase 1 public free index-lighting site has a ready mock-only release-candidate evidence path.
- Checks passed: `check:a3-phase-1-release-candidate-public-smoke-report`, `check:a3-phase-1-public-beta-release-go-no-go-packet`, `check:a3-phase-1-public-beta-release-review-summary-for-chairman`, `check:a3-phase-1-public-beta-manual-platform-action-checklist`, `check:a3-phase-1-post-deploy-smoke-and-monitoring-packet`, `check:a3-phase-1-public-beta-operator-execution-path-runbook`, `check:a3-phase-1-public-beta-operator-action-or-repair-result`, and `check:public-beta-mock-launch-proof-bundle`.
- CEO recommendation: route to `GO_WITH_DEFERRALS_TO_OPERATOR_REVIEW` using the prepared no-secret manual platform checklist; keep data/source/score deferrals explicit.
- If the operator path is not accepted, PM/A3 should repair the specific failed item and re-run the focused A3 gate instead of reopening broad governance.

Current PM/A3 operator route:

- The filled chairman/operator decision record exists at `docs/PHASE_1_PUBLIC_BETA_CHAIRMAN_OPERATOR_DECISION_2026_06_13.md`.
- Current decision: `GO_WITH_DEFERRALS`.
- Current operator route: use `docs/A3_PHASE_1_PUBLIC_BETA_MANUAL_PLATFORM_ACTION_CHECKLIST.md` for no-secret manual platform review.
- PM/A3 must not paste secrets, env values, dashboard screenshots containing values, SQL, Supabase rows, raw market payloads, or private platform URLs into the repo or chat.
- After any future operator action, PM/A3 records only no-secret outcomes in `docs/A3_PHASE_1_PUBLIC_BETA_POST_PLATFORM_ACTION_REPORT_TEMPLATE.md`, then chooses keep-open, repair, or rollback using the prepared decision packet.
- If no operator action is being performed in the current turn, keep moving on Phase 1 public surface, A2 trust copy, A1 data/source planning, or A4 membership MVP planning rather than adding more operator governance.

Latest A4 membership MVP roadmap alignment:

- PM repaired the Phase 2 membership roadmap gate by aligning `docs/PUBLIC_BETA_INDEX_DASHBOARD_BRIEF.md` with both standard Phase 1 / Phase 2 sentence forms required by the phase-split and roadmap checkers.
- PM replaced `/briefing` risk copy from `不保證報酬` to `不承諾投資結果`, preserving the non-investment-advice boundary without triggering forbidden public-claim wording.
- Checks passed: `check:phase-1-phase-2-execution-split-and-workflow-assignment`, `check:public-beta-membership-mvp-roadmap`, `check:public-visible-language-quality`, and TypeScript.
- A4 current scope: keep membership MVP as a planned Phase 2 route covering daily three-layer interpretation, watchlist/custom alert conditions, and post-market review.
- A4 non-scope for Phase 1: no member login, payment, watchlist persistence, alert execution, member-only content, or membership implementation.

Latest A1 source/coverage no-fetch readiness:

- PM verified A1's source/coverage/backfill preparation is PM-usable for mock runtime labels and public data-readiness wording.
- Checks passed: `check:a1-public-beta-source-coverage-gap-matrix-no-fetch`, `check:a1-public-beta-next-no-fetch-coverage-artifact`, `check:a1-public-beta-source-coverage-runtime-no-fetch-handoff`, `check:public-beta-user-value-source-coverage-bridge`, `check:source-coverage-runtime-handoff-docs`, `check:twse-openapi-bounded-metadata-terms-validation`, `check:twse-openapi-field-contract-roadmap`, and `check:twse-openapi-coverage-and-backfill-readiness`.
- Current A1 state: source/coverage/field/backfill planning is ready for mock runtime labels, but not real data completion.
- Next A1 route: `twse_openapi_runtime_mock_consumer_wiring_readiness`.
- Hard boundary remains: no real fetch, ingestion, backfill, SQL, Supabase read/write, row mutation, public source promotion, or `scoreSource=real` without a separate explicit gate.

Latest A3 release-smoke refresh after revised BRIEF:

- PM/A3 refreshed the release-candidate smoke report and metadata smoke checker so they now protect the current Phase 1 / Phase 2 split instead of older operator-governance wording.
- A3 release smoke now requires Home first-screen hierarchy, core indicator readout, weekly action summary, stock product-first readability, free/member phase split, member roadmap public boundary, core route quick proof, public visible language, metadata smoke, and route smoke.
- A3 remains a launch/platform lane, not a reason to keep expanding governance. If no concrete deploy, env, domain, monitoring, rollback, or public smoke action is being performed, PM should return to public comprehension, trust copy, data-source readiness, or route-health work.
- This slice is local-only/mock-only and does not authorize deployment, SQL, Supabase read/write, market-data fetch, `publicDataSource=supabase`, `scoreSource=real`, membership implementation, or investment-advice wording.

Latest public residue verification after A3 smoke refresh:

- PM re-ran `check:public-surface-user-facing-audit`, `check:phase-1-public-beta-public-visible-residue-cleanup`, `check:briefing-product-first-information-hierarchy`, and `check:briefing-midpage-readability`.
- The residue cleanup gate rendered 13 public routes and passed with no visible command strings, local file paths, hard-blocker panels, packet/operator workflow wording, Git/commit residue, source/score field labels, Supabase/SQL/raw-payload terms, role residue, external-reply placeholders, or mojibake markers.
- This confirms the public pages are no longer exposing the earlier development-process panels called out by the chairman.
- Next PM route should be a concrete Phase 1 improvement or launch-readiness action, not more generic governance.

Latest dashboard shell source cleanup and action-judgment pass:

- PM rewrote `src/components/dashboard-shell.tsx` into readable Chinese public copy while preserving the existing data flow and mock boundary.
- Home/stock shared surfaces now expose clear labels for market mood, core score, data confidence, 3-minute action judgment, symbol switching, strong observation, risk observation, and next reading.
- PM rewrote `scripts/check-home-core-indicator-readout.mjs` so the checker validates readable Chinese phrases instead of stale mojibake literals.
- Checks passed: `check:home-product-first-information-hierarchy`, `check:home-core-indicator-readout`, `check:stock-product-first-runtime-readability`, `check:public-visible-language-quality`, `check:phase-1-public-beta-public-visible-residue-cleanup`, `check:public-beta-core-route-quick-proof`, and TypeScript.
- Source-level scan confirmed `src/components/dashboard-shell.tsx` and the refreshed checker contain no replacement characters, private-use characters, question-mark runs, or known mojibake fragments.
- Broader source-level scan over `src/app`, `src/components`, and `src/lib` found zero files with those markers, so the public runtime source surface is no longer carrying the earlier mojibake class of residue.
- Next PM route should continue the same pattern on any remaining high-exposure public source file before opening new A3 governance.

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

- PM completed a user-only public-page cleanup slice. `/briefing` no longer exposes internal-style project progress percentages; the visible status area is now framed as `鞈?雿輻?? with `30 蝘?灼, `3 ??閬??節, `蝷箇?鞈?`, and `銝?嗆?鞎瑁都?誘`. PM also rewrote source/coverage and data-readiness public copy to avoid backend/process terms and expanded the rendered public-surface guards to block screenshot residue classes such as pre-launch language, hard blockers, request blocks, external reply instructions, command snippets, Git/commit wording, env placeholders, internal field names, local file paths, database/raw-payload terms, role labels, mojibake markers, and development-progress wording. Browser verification on `/briefing`, `check:public-surface-user-facing-audit`, `check:public-visible-language-quality`, TypeScript, build, and the full review gate pass. Next PM route is `continue_public_page_user_only_cleanup_into_weekly_methodology_and_stock_visual_scan`; next A1 route remains `continue_data_line_source_and_coverage_without_market_row_fetch`; next A2 route is `review_public_page_user_only_cleanup_copy_guard`.

- PM extended the data-actionability loop into stock routes. `StockRuntimeAtAGlance` now gives stock readers the same three outcomes as Home and `/briefing`: `30 蝘?灼, `3 ??閬??節, and `銝?嗆??鞎瑁都?誘`. The stock route checks now guard those phrases on `/stocks/2330`, `/stocks/TWII`, and `/stocks/0050`, while keeping the visible route free of internal workflow terms and investment-advice claims. Next PM route is `continue_stock_actionability_into_weekly_and_methodology_cross_route_consistency`; next A1 route remains `continue_data_line_source_and_coverage_without_market_row_fetch`; next A2 route is `review_stock_route_data_actionability_non_advice_copy_guard`.

- PM turned the public data-readiness status into a reader-facing actionability guide. Home and `/briefing` now tell users what the current demonstration data can support in `30 蝘?灼, what must be checked in `3 ??閬??節, and what remains explicitly disallowed through `銝?嗆?鞎瑁都?誘`. `check:public-beta-data-readiness-status` now guards these rendered phrases while preserving formal-data upgrade checks and internal-term blockers. Next PM route is `continue_public_beta_actionable_data_status_into_stock_route_consistency`; next A1 route remains `continue_data_line_source_and_coverage_without_market_row_fetch`; next A2 route is `review_public_data_status_actionability_copy_guard`.

- PM added a rendered public-surface user-facing audit as the current BRIEF cleanup guard. `check:public-surface-user-facing-audit` now checks Home, `/briefing`, `/weekly`, methodology, legal/trust routes, representative stock routes, and unauthenticated internal boundaries for user-facing readiness: required BRIEF phrases, no internal role labels, no command/workflow residue, no database/raw-payload wording, no local file paths, and no mojibake markers. The first run found `/methodology` needed a clearer non-investment-advice boundary, so PM added a short section stating that methods are observation tools, not trading instructions, and do not provide individual stock buy/sell advice. Next PM route is `continue_public_surface_guard_into_runtime_product_actionability_and_data_source_readiness`; next A1 route remains `continue_data_line_source_and_coverage_without_market_row_fetch`; next A2 route is `review_public_surface_user_facing_audit_copy_guard`.

- PM realigned the Home and `/briefing` product-first hierarchy checks with the current BRIEF public surface. The old checks still expected internal runtime-console strings such as `publicDataSource=mock`, `scoreSource=mock`, `Runtime Status`, and stale component names. They now guard the user-facing loop instead: 30-second market atmosphere, 3-minute action judgment, demonstration-data boundary, formal-data-not-enabled copy, non-investment-advice copy, compact visible text, and no internal workflow residue. Next PM route is `continue_runtime_product_copy_compaction_into_stock_route_actionability_guard`; next A1 route remains `continue_data_line_source_and_coverage_without_market_row_fetch`; next A2 route is `review_product_first_checker_public_copy_alignment`.

- PM tightened internal diagnostics exposure as part of the public residue cleanup. Internal pages now require diagnostics to be enabled and a matching configured token; enabling diagnostics without a token remains closed. The internal raw-market API no longer allows development fallback access when no token is configured, so unauthenticated requests return disabled/unauthorized before any raw-market loader runs. `check:public-visible-language-quality` now verifies both public routes and unauthenticated internal boundaries, including `/internal`, `/internal/cp3-dry-run`, `/internal/etf-source-readiness`, `/internal/raw-market-preview`, and `/api/internal/raw-market?symbol=2330`. Next PM route remains `continue_public_beta_route_cleanup_into_runtime_product_copy_compaction`; next A1 route remains `continue_data_line_source_and_coverage_without_market_row_fetch`; next A2 route is `review_public_route_residue_guard_and_reader_navigation`.

- PM completed a public route residue and navigation cleanup pass across the visible public website. Home, `/briefing`, `/weekly`, `/methodology`, `/disclaimer`, `/terms`, `/privacy`, and representative stock routes now pass rendered checks for no command strings, no internal source flags, no role labels, no raw-data terms, no workflow residue, and no mojibake markers. `/weekly` now includes a reader-facing route navigation strip aligned with Home and `/briefing`, and `check:experience-flow-navigation` now guards current public language and rendered route output instead of stale internal labels. A stale local dev server was restarted after temporary 500 responses; build and route checks pass afterward. Next PM route is `continue_public_beta_route_cleanup_into_runtime_product_copy_compaction`; next A1 route remains `continue_data_line_source_and_coverage_without_market_row_fetch`; next A2 route is `review_public_route_residue_guard_and_reader_navigation`.

- PM extended the Home/briefing reading-order convergence into `/weekly` and stock routes. Weekly now uses the same public Beta loop language: `30 蝘?撣瘞??`, `3 ???渡?銝梯?撖?暺, and `甇??鞈????炎?匝, with visible `???脫?`, `甇??撣鞈?撠?`, and `??鞈遣霅躬 copy. PM also cleaned stale weekly/stock checker expectations so they guard current public product language instead of requiring internal strings or old component names. `check:a2-weekly-readable-copy`, `check:weekly-market-action-summary`, `check:stock-product-first-runtime-readability`, `check:stock-route-investor-language-alignment`, `check:public-visible-language-quality`, TypeScript, build, and the full review gate pass. Next PM route is `continue_public_beta_reading_order_into_route_level_visual_density_and_nav`; next A1 route remains `continue_data_line_source_and_coverage_without_market_row_fetch`; next A2 route is `review_stock_weekly_reading_order_public_copy_and_checker_guard`.

- PM tightened the Home and `/briefing` public reading-order bridge. Home now explicitly tells users to read `30 蝘??湔除瘞, then make a `3 ??銵??斗`, and then use the `甇??鞈????炎?匝 to understand source, field, coverage, and fallback conditions before formal data can be enabled. `check:home-briefing-investor-reading-bridge`, `check:briefing-midpage-readability`, `check:public-beta-data-readiness-status`, `check:public-visible-language-quality`, `check:pm-brief-runtime-mainline-goal-and-workstreams`, TypeScript, build, and the full review gate pass after clearing a stale `.next` build cache. Next PM route is `continue_public_beta_reading_order_into_stock_weekly_consistency`; next A1 route remains `continue_data_line_source_and_coverage_without_market_row_fetch`; next A2 route is `review_home_briefing_reading_order_public_copy_and_non_advice_boundary`.

- PM added a visible formal-data upgrade-readiness block to the public data status surface. Home and `/briefing` now explain the three checks required before formal data promotion: `靘??舐璇辣`, `甈?????`, and `???牧?. This advances the public Beta usable loop by making the mock-to-formal-data boundary readable without exposing internal execution workflow or implying real data. `check:public-beta-data-readiness-status`, `check:public-visible-language-quality`, and TypeScript pass. Next PM route is `continue_formal_data_upgrade_readiness_into_brief_runtime_copy_density`; next A1 route remains `continue_data_line_source_and_coverage_without_market_row_fetch`; next A2 route is `review_formal_data_upgrade_readiness_copy_and_non_advice_boundary`.

- PM verified and locked the public Beta source/coverage user-value bridge as a mainline product surface. `PublicBetaSourceCoverageBridge` is wired into Home, `/briefing`, and stock routes so source/coverage status is expressed as what users can safely understand and do next, not as internal A1/PM execution state. `check:public-beta-user-value-source-coverage-bridge`, `check:public-beta-source-coverage-runtime-labels`, and `check:public-beta-value-loop-refinement` pass; the full review gate is green with `executedCount=171` and `failedCount=0`, and `npm run build` passes. Next PM route is `continue_public_beta_source_coverage_bridge_into_data_upgrade_readiness_copy`; next A1 route remains `continue_data_line_source_and_coverage_without_market_row_fetch`; next A2 route is `review_source_coverage_bridge_public_copy_and_mock_boundary`.

- PM completed a source-level public residue cleanup pass after the rendered public surface looked clean but several high-exposure source files still contained early mojibake or legacy internal wording. PM rewrote Home via `DashboardShell`, `/briefing`, `BriefingPublicDecisionSummaryPanel`, `PublicBetaIndexDashboardBriefLoopPanel`, `TrustRuntimeBoundaryNotice`, and the focused public route language checkers. Source scan over `src/app` and `src/components` now reports zero private-use/replacement markers and zero long question-mark runs across 54 TS/TSX files. `check:public-visible-language-quality`, `check:public-beta-core-route-quick-proof`, `check:stock-route-investor-language-alignment`, TypeScript, and build pass. Next PM route is `continue_public_beta_visible_surface_after_source_residue_cleanup`; next A1 route remains `continue_data_line_source_and_coverage_without_market_row_fetch`; next A2 route is `review_source_level_public_copy_guard`.

- PM completed a public visible-residue hardening pass. The rendered public routes now scan clean for early mojibake, private-use markers, double-question mojibake, internal field names, command/workflow residue, and developer-facing data terms. PM replaced remaining raw/internal-data wording with reader-facing trust copy, and converted the TWSE data-prep status component from parser/runtime/Supabase/row-coverage language into public data-source readiness language. Home, `/briefing`, and stock-route information hierarchy checks pass after the cleanup. Next PM route is `continue_brief_runtime_product_loop_after_visible_residue_hardening`; next A1 route remains `continue_data_line_source_and_coverage_without_market_row_fetch`; next A2 route is `review_public_visible_residue_guard_and_copy_safety`.

- PM completed a public product-language density pass after the public-page residue cleanup. The mainline reduced repeated data-state/product-status wording in shared runtime surfaces: `DataFreshnessStrip` is now a compact user-facing data-state line, `PublicBetaDataReadinessStatus` is no longer a multi-lane status board, `StockRuntimeAtAGlance` no longer repeats product-status and formal-data-preparation cards, and Home runtime copy now frames the page around market atmosphere and observation value. Next PM route is `continue_public_beta_product_surface_density_into_review_gate_and_visual_check`; next A1 route remains `continue_data_line_source_and_coverage_without_market_row_fetch`; next A2 route is `review_public_product_language_density_and_mock_boundary_copy`.

- PM completed a public-page residue cleanup pass. Home, `/briefing`, `/weekly`, `/methodology`, `/disclaimer`, `/terms`, `/privacy`, and representative stock pages now render as public product pages instead of internal execution consoles: early mojibake, internal workflow field names, command snippets, platform placeholders, and development-process residue are removed from the visible surface. `check:public-visible-language-quality` now guards the public routes for blocked internal fragments, mojibake markers, and required public trust phrases. Next PM route is `continue_public_beta_product_surface_after_residue_cleanup`; next A1 route remains `continue_data_line_source_and_coverage_without_market_row_fetch`; next A2 route is `review_public_page_residue_cleanup_copy_safety`.

- PM added the stock decision-aid actionability gate. `check:stock-decision-aid-actionability` now guards `/stocks/2330`, `/stocks/TWII`, and `/stocks/0050` so stock detail remains aligned with the Home/briefing closed loop: cause, update time, impact level, next observation, 3-minute review copy, `publicDataSource=mock`, `scoreSource=mock`, no visible internal execution workflow residue, and no mojibake markers. Next PM route is `continue_stock_actionability_into_weekly_or_route_local_trust_path`; next A1 route is `continue_data_line_source_and_coverage_without_market_row_fetch`; next A2 route is `review_stock_decision_aid_actionability_public_copy`.

- PM added the public Beta alert-list actionability gate. `check:public-beta-alert-list-actionability` now guards Home and `/briefing` so alert/observation lists retain status, cause, update time, impact level, next step, `publicDataSource=mock`, `scoreSource=mock`, no visible internal execution workflow residue, and no mojibake markers. Next PM route is `continue_alert_list_actionability_into_stock_or_weekly_reading_path`; next A1 route is `continue_data_line_source_and_coverage_without_market_row_fetch`; next A2 route is `review_public_beta_alert_list_actionability_copy`.

- PM rewrote the Home and `/briefing` market-action summary copy builders into clean reader-facing Chinese action language. Home now explains market breadth, data-state caution, primary observation, and the mock boundary; `/briefing` now explains market breadth, market context, risk observation, and the non-investment-advice boundary. `check:market-action-summary-readable-copy` guards `/` and `/briefing` for readable action-summary copy, `publicDataSource=mock`, `scoreSource=mock`, no visible internal workflow residue, and no mojibake markers. Next PM route is `continue_brief_runtime_decision_copy_into_alert_list_density`; next A1 route is `continue_data_line_source_and_coverage_without_market_row_fetch`; next A2 route is `review_market_action_summary_public_copy`.

- PM added a shared public Beta decision-journey panel across Home, `/briefing`, and stock routes. It turns the BRIEF into one visible route: 30-second market atmosphere, 3-minute action judgment, then stock-level cause and indicator priority review. `check:public-beta-decision-journey-panel` guards the public route output for required journey language, `publicDataSource=mock`, `scoreSource=mock`, no real-time claim, no buy/sell advice, and no internal execution workflow residue. Next PM route is `continue_public_beta_decision_journey_into_home_or_briefing_summary_density`; next A1 route is `continue_data_line_source_and_coverage_without_market_row_fetch`; next A2 route is `review_public_beta_decision_journey_public_copy`.

- PM added a stock indicator-priority panel to keep the stock page useful before full indicator implementation. It appears after the investor action summary and before the full investor indicator roadmap, reducing the indicator layer to three reader decisions: data credibility, primary support, and primary risk. `check:stock-indicator-priority-panel` guards `/stocks/2330`, `/stocks/TWII`, and `/stocks/0050` for that order and public-safe copy. Next PM route is `continue_stock_indicator_priority_into_briefing_crosslink_or_home_summary`; next A1 route is `continue_data_line_source_and_coverage_without_market_row_fetch`; next A2 route is `review_stock_indicator_priority_public_copy`.

- PM added a stock decision-aid summary before stock-page freshness metadata and deeper runtime details. Stock routes now render `StockDecisionAidSummaryPanel` after source/coverage context and before `DataFreshnessStrip`, giving users a compact 3-minute loop: cause, update time, impact level, and next observation. `check:stock-product-first-runtime-readability` now guards `/stocks/2330`, `/stocks/TWII`, and `/stocks/0050` for this decision-aid order and required labels while preserving mock boundary and non-investment-advice wording. Next PM route is `continue_stock_decision_aid_density_then_indicator_priority_copy`; next A1 route is `continue_data_line_source_and_coverage_without_market_row_fetch`; next A2 route is `review_stock_decision_aid_summary_public_copy`.

- PM aligned stock pages with the BRIEF product-first runtime order. Stock routes now render `StockRuntimeAtAGlance`, the public decision loop, usable loop, route consistency, source/coverage context, and only then freshness metadata. `check:stock-product-first-runtime-readability` guards `/stocks/2330`, `/stocks/TWII`, and `/stocks/0050` for visible product-first order, internal-term absence, `publicDataSource=mock`, `scoreSource=mock`, usable-loop copy, and non-investment-advice wording. Next PM route is `continue_stock_detail_density_cleanup_then_indicator_decision_aids`; next A1 route remains `prepare_etf_market_price_synthetic_contract_cases_no_fetch`; next A2 route is `review_stock_product_first_runtime_public_copy`.

- PM added a briefing product-first guard. `check:briefing-product-first-information-hierarchy` now proves `/briefing` stays within a 16k visible-text budget, keeps market atmosphere and 3-minute action judgment before source/runtime details, blocks internal workflow terms, and preserves `publicDataSource=mock`, `scoreSource=mock`, and non-investment-advice wording. Next PM route is `continue_stock_first_screen_runtime_readability_alignment`; next A1 route remains `prepare_etf_market_price_synthetic_contract_cases_no_fetch`; next A2 route is `review_briefing_product_first_public_copy`.

- PM reduced Home public runtime density. `HomeRuntimeStatusPanel` now keeps the compact public `Runtime Status` summary and next links visible, while detailed runtime diagnostics are retained in source behind `showDetailedRuntimeDiagnostics=false` and not rendered on `/` by default. The Home visible text budget is guarded at 16k characters by `check:home-product-first-information-hierarchy`, keeping the route product-first instead of internal-console-heavy. Next PM route is `continue_home_density_cleanup_then_briefing_runtime_alignment`; next A1 route remains `prepare_etf_market_price_synthetic_contract_cases_no_fetch`; next A2 route is `review_home_density_reduction_public_copy`.

- PM moved Home further toward product-first information hierarchy. The Home order is now `PublicBetaIndexDashboardBriefLoopPanel` -> `HomeProductOverview` -> `PublicBetaUsableLoopPanel` -> freshness/source coverage/runtime details, and `check:home-product-first-information-hierarchy` guards both the source order and rendered `/` order. This supports the BRIEF by showing market atmosphere, quick start, core indicator readout, and usable loop before detailed data/runtime state. Next PM route is `continue_home_three_layer_product_surface_density_cleanup`; next A1 route remains `prepare_etf_market_price_synthetic_contract_cases_no_fetch`; next A2 route is `review_home_product_first_hierarchy_public_copy`.

- PM tightened the public-page internal-language guard for the BRIEF product/runtime mainline. The Home rendered product surface no longer contains `blocker`, `cmd.exe`, `BETA_`, `packet`, `preflight`, `post-run`, or `operator`; the cadence copy now says `runtime product 70 / data readiness 20 / governance 10`; and `check:public-visible-language-quality` blocks lowercase `blocker` on public routes. This keeps `/`, `/briefing`, and stock pages closer to product language instead of internal execution-console language. Next PM route is `continue_home_three_layer_product_surface_without_internal_terms`; next A1 route remains `prepare_etf_market_price_synthetic_contract_cases_no_fetch`; next A2 route is `review_public_page_internal_language_guard`.

- PM added a shared `PublicBetaUsableLoopPanel` across Home, `/briefing`, and stock routes. The panel turns the BRIEF into a public readable loop: `30 蝘 `??撣瘞?`, `3 ??` `敶Ｘ?閫撖??, `??` `?Ⅱ隤????跆, plus current-use, real-data-upgrade, and non-investment-advice cards. It keeps `publicDataSource=mock`, `scoreSource=mock`, no real-data promotion, no Supabase write, and no investment advice. The new `check:public-beta-usable-loop-panel` is registered in the review gate, and `check:public-visible-language-quality` now requires the usable-loop language on public routes. Next PM route is `review_public_beta_usable_loop_then_prepare_next_runtime_readability_lane`; next A1 route remains `prepare_etf_market_price_synthetic_contract_cases_no_fetch`; next A2 route is `review_public_beta_usable_loop_copy_safety`.

- PM converted public runtime status vocabulary from internal English labels into Chinese reader-facing labels. Home, `/briefing`, and stock routes now use `?靘?`, `璇辣瑼Ｘ銝苜, `?芯??游?`, `?思??`, `撣瑼Ｘ銝苜, and `?思??亙` in `Source & Coverage`; Home runtime status cards use Chinese labels for public boundary/progress/next decision/blocked transition/row coverage; and investor-indicator roadmap names are now `撣皞怠漲`, `璅??亙熒摨圳, `憸券閮?`, `霈??菜葫`, `銝?甇亥?撖, and `靽∪?撅斤?`. The runtime-label checker blocks `Candidate`, `Checking`, `Future`, `Blocked`, `Excluded`, and `Mock only` from public route text. This improves the BRIEF 30-second reading path without changing data posture. Next PM route is `review_public_status_vocabulary_then_prepare_next_runtime_readability_lane`; next A1 route remains `prepare_etf_market_price_synthetic_contract_cases_no_fetch`; next A2 route is `review_public_status_vocabulary_safety`.

- PM wired the ETF mock runtime handoff into the shared public `Source & Coverage` runtime panel. Public routes now expose `ETF 30 蝘?蝯︶, `ETF 3 ??銵?`, and case-level mock statuses from the ETF synthetic fixture, so users can understand the `0050` and `006208` ETF market-price examples as context only. The integration preserves `publicDataSource=mock`, `scoreSource=mock`, `rawMarketDataFetch=false`, `sqlExecution=false`, and `supabaseWrite=false`, and it does not display NAV, holdings, premium/discount, complete ETF coverage, live-data claims, or investment advice. Next PM route is `review_etf_public_runtime_labels_then_prepare_next_source_coverage_lane`; next A1 route remains `prepare_etf_market_price_synthetic_contract_cases_no_fetch`; next A2 route is `review_etf_public_runtime_label_copy_safety`.

- PM added `src/lib/etf-market-price-mock-runtime-handoff.ts` and registered `scripts/check-etf-market-price-mock-runtime-handoff.mjs`. The handoff converts ETF synthetic fixture results into runtime-readable statuses: `?舐內蝭, `?怠??祇?`, and `?輻?敺Ⅱ隤, plus 30-second ETF context wording and 3-minute action guidance. It keeps `etf_market_price_mock_runtime_handoff_ready_no_fetch`, `publicDataSource=mock`, `scoreSource=mock`, `rawMarketDataFetch=false`, `sqlExecution=false`, and `supabaseWrite=false`. Next PM route is `etf_market_price_mock_runtime_handoff_review_then_public_label_integration`; next A1 route remains `prepare_etf_market_price_synthetic_contract_cases_no_fetch`; next A2 route is `review_etf_market_price_mock_runtime_handoff_public_copy_safety`.

- PM added `src/lib/etf-market-price-synthetic-fixture.ts` and registered `scripts/check-etf-market-price-synthetic-fixture.mjs`. The synthetic fixture executes only local rows and covers six ETF market-price contract cases: valid market-price points, missing close price, out-of-scope symbol, duplicate session, optional activity fields missing, and forbidden NAV-like fields. It keeps `etf_market_price_synthetic_fixture_ready_no_fetch`, `publicDataSource=mock`, `scoreSource=mock`, `rawMarketDataFetch=false`, `sqlExecution=false`, and `supabaseWrite=false`. Next PM route is `etf_market_price_synthetic_fixture_review_then_mock_runtime_handoff`; next A1 route is `prepare_etf_market_price_synthetic_contract_cases_no_fetch`; next A2 route is `review_etf_market_price_synthetic_fixture_public_copy_safety`.

- PM accepted and registered the A1 ETF market-price field contract at `docs/A1_ETF_MARKET_PRICE_FIELD_CONTRACT_NO_FETCH.md`. The contract keeps the ETF lane limited to `0050` and `006208`, names the minimum future normalized fields, separates required and optional values, and requires missing-session, revision, duplicate-date, fail-closed, attribution, and retention policies before any real-data use. It continues to exclude NAV, holdings, premium/discount, intraday iNAV, distributions, issuer factsheet text, and recommendation language. Next PM route is `prepare_etf_market_price_synthetic_fixture_no_fetch`; next A1 route is `prepare_etf_market_price_synthetic_contract_cases_no_fetch`; next A2 route is `review_etf_market_price_field_contract_public_copy_safety`.

- PM wired the accepted ETF market-price-only scope into the shared public `Source & Coverage` runtime panel. The public routes now show `ETF 撣蝭?`, `NAV ?思??亙`, `???⊥銝?匝, `?滯?寞銝?匝, and `ETF 銝?靘眺鞈?遣霅躬, so users can read `0050` and `006208` as mock ETF context anchors without mistaking the site for NAV, holdings, premium/discount, issuer/fund disclosure, or ETF recommendation coverage. Next PM route is `review_etf_scope_runtime_labels_then_prepare_field_contract_no_fetch`; next A1 route is `prepare_etf_market_price_field_contract_no_fetch`; next A2 route is `review_etf_market_price_scope_public_copy_safety`.

- PM accepted the A1 ETF market-price-only scope packet at `docs/A1_ETF_MARKET_PRICE_SOURCE_SCOPE_NO_FETCH.md`. It keeps `0050` and `006208` as mock runtime anchors, narrows future ETF real display to exchange-traded market-price fields, and explicitly excludes NAV, holdings, premium/discount, intraday iNAV, distribution schedules, issuer factsheet text, and ETF recommendation ranking. ETF source-rights remain `checking`; redistribution remains `not_approved`; ETF row coverage credit remains `blocked`. Next PM route is `wire_etf_market_price_scope_into_public_runtime_labels`; next A1 route is `prepare_etf_market_price_field_contract_no_fetch`; next A2 route is `review_etf_market_price_scope_public_copy_safety`.

- PM wired the accepted source/coverage gap matrix into the shared `Source & Coverage` runtime panel. The public routes now show seven coverage lanes in reader-facing language: `TWII ??箸?`, `?詨? ETF ?窗`, `Batch 1 ?蝷箇?`, `摰銝??∠巨`, `OTC ?芯??游?`, `?Ｘ平???窗`, and `銵???撅亡. This makes the source/coverage gate visible without exposing internal commands or claiming real data. A2 background review could not spawn because the agent thread limit was reached, so PM strengthened `scripts/check-public-beta-source-coverage-runtime-labels.mjs` to guard the public route output directly. Next PM route is `review_source_coverage_runtime_matrix_labels_then_prepare_etf_scope_no_fetch`; next A1 route remains `prepare_etf_market_price_source_scope_no_fetch`; next A2 route remains `review_source_coverage_gap_matrix_public_copy_safety`.

- PM accepted the A1 source/coverage gap matrix at `docs/A1_PUBLIC_BETA_SOURCE_COVERAGE_GAP_MATRIX_NO_FETCH.md`. The matrix separates `index_baseline`, `core_etf_context`, `listed_equity_batch1`, `listed_equity_full`, `otc_future_expansion`, `sector_industry_context`, and `derived_indicator_layer`, with source-rights status, field-contract readiness, public display posture, and next no-fetch tasks. This gives PM a concrete bridge from data coverage planning into runtime labels without claiming real data. Next PM route is `wire_source_coverage_gap_matrix_into_public_runtime_readiness_labels`; next A1 route is `prepare_etf_market_price_source_scope_no_fetch`; next A2 route is `review_source_coverage_gap_matrix_public_copy_safety`.

- PM completed the next A1/A2 support-lane assignment locally because background agent capacity was full. A1 now owns `docs/A1_BRIEF_SOURCE_COVERAGE_NEXT_HANDOFF_NO_FETCH.md` with next task `prepare_public_beta_source_coverage_gap_matrix_no_fetch`: keep source/coverage planning no-fetch, aggregate-only, no SQL, no Supabase, and no public real-data promotion. A2 now owns `docs/A2_BRIEF_PUBLIC_RUNTIME_SURFACE_AUDIT.md`, guarding public routes for `Public Beta Decision Loop`, `30 蝘??湔???3 ??銵??斗`, `Source & Coverage`, `Data Readiness`, `publicDataSource=mock`, `scoreSource=mock`, non-real-time wording, and non-investment-advice wording. PM registered both focused checkers and review-gate entries so these lanes can run in parallel while PM remains integration owner.

- PM is cleaning the public product runtime surfaces so the site reads like a Beta index status dashboard rather than an internal execution console. `Public Beta Reading Path`, `Data Readiness`, and `Source & Coverage` now focus on market mood, cause/time review, source coverage limits, mock/real boundary, and next observation action. A1 remains assigned to legal/free automated source and coverage evidence; A2 remains assigned to public copy safety. The mainline should keep integrating only the support-lane outputs that improve user comprehension or runtime safety, and defer broad visual polish until the foundation is stable.

- PM added a shared `PublicBetaDecisionLoopBridge` across `/`, `/briefing`, and stock runtime pages. The bridge uses the same public product loop everywhere: `30 蝘??湔???3 ??銵??斗`, `??撣瘞?`, `???????, and `?敺?鞈???`. It keeps the boundary visible: `publicDataSource=mock`, `scoreSource=mock`, not real-time live data, and no buy/sell advice. A1 continues the data/source/coverage lane without fetch, SQL, Supabase write, raw payload, or promotion. A2 now reviews this shared bridge for public-copy safety and should block any future copy that turns the bridge into live-data, official-source approval, or investment-advice language.

- PM surfaced TWII data-decision readiness on stock detail runtime pages. `src/components/stock-runtime-at-a-glance.tsx` now includes a `stock-twii-data-decision-status` strip that tells users the current state in public language: TWII source evidence is organized, one controlled read decision is still pending, and the public runtime remains `publicDataSource=mock` / `scoreSource=mock` with no buy/sell advice. This supports the BRIEF goal directly: users can understand what the stock page can be used for now within 30 seconds and why real-data claims are still locked before making a 3-minute observation decision. A1 remains assigned to source/coverage evidence; A2 remains assigned to public-copy safety. No SQL, Supabase read/write, market-data fetch/ingest/store/commit, `daily_prices` mutation, public source promotion, `publicDataSource=supabase`, `scoreSource=real`, real-time claim, or investment-advice claim occurred.

- PM surfaced TWII operator decision readiness in the public Beta data-readiness runtime surface. `src/lib/public-beta-data-readiness-status.ts` now exposes `operatorDecisionReadiness`, and `src/components/public-beta-data-readiness-status.tsx` renders three reader-facing cards: `TWII 靘?霅?`, `??瘙箇?`, and `?祕鞈???`, with public labels `撌脫??撠??祕鞈?`, `蝑??Ⅱ?豢?`, and `隞?雿. The copy explains that TWII evidence is organized, the explicit operator decision is still pending, and real-data promotion remains locked. The surface stays `publicDataSource=mock`, `scoreSource=mock`, no-execution, no-real-time, and non-investment-advice. The next PM route remains `wait_for_explicit_operator_decision_before_execution_packet`.

- PM accepted the next A1/A2 operator decision support slice. A1 prerequisites are recorded at `docs/A1_TWII_READONLY_EXECUTION_PACKET_PREREQUISITES_NO_EXECUTION.md`, requiring a future separate execution packet to stay TWII-only, aggregate-only, one-attempt-only, no-write, no-SQL, no-raw-payload, no-row-payload, no-public-promotion, and post-run-review-required. A2 copy guard is recorded at `docs/A2_TWII_OPERATOR_DECISION_PUBLIC_COPY_GUARD.md`, blocking wording that implies live data, source-rights approval, Supabase read/write, complete row coverage, official endorsement, or investment advice. The next PM route is `wait_for_explicit_operator_decision_before_execution_packet`; future PM route only if authorized is `prepare_separate_twii_readonly_execution_packet_no_write`.

- PM converted the accepted A1 TWII exact evidence packet into a no-execution operator readonly decision packet at `docs/TWII_OPERATOR_READONLY_DECISION_PACKET_NO_EXECUTION.md`. The packet names three future decisions, `authorize_one_bounded_readonly_attempt`, `request_evidence_repair`, and `defer_readonly_attempt`, while keeping `operatorDecisionAcceptedNow=false`, `executionPacketPreparedNow=false`, `runnerExecutableNow=false`, `readonlyAttemptExecutableNow=false`, `publicDataSource=mock`, and `scoreSource=mock`. It does not authorize SQL, Supabase connection/read/write, staging rows, `daily_prices` mutation, endpoint probe, OpenAPI call, CSV download, market-data fetch/ingest/storage/commit, public source promotion, real scoring, or investment advice. The next PM route is `review_operator_readonly_decision_packet_then_wait_for_explicit_operator_decision`; A1 next owns `prepare_twii_readonly_execution_packet_prerequisites_if_operator_authorizes_later`; A2 next owns `prepare_twii_operator_decision_public_copy_guard_if_pm_requests`.

- A1 TWII exact source-rights and field-contract evidence is ready for PM review at `docs/A1_TWII_EXACT_SOURCE_RIGHTS_AND_FIELD_CONTRACT_EVIDENCE_NO_FETCH.md`. The packet records official metadata references, daily cadence, free/open license reference, OpenAPI metadata reference, and minimum field contract for `trade_date`, `close_value`, `instrument_code`, `instrument_name`, `source_url_label`, and `source_updated_at`. It remains no-fetch/no-execution: no SQL, no Supabase connection/read/write, no staging rows, no `daily_prices` mutation, no endpoint probe, no row payload, no raw market-data storage, no source promotion, no `publicDataSource=supabase`, and no `scoreSource=real`. The next PM route is `review_exact_twii_evidence_then_prepare_operator_readonly_decision_packet_or_repair`; A1 next owns `prepare_twii_operator_readonly_decision_packet_no_execution_if_pm_accepts_evidence`; A2 next owns `prepare_twii_source_attribution_cadence_phrase_set_patch_if_pm_requests`.

- PM surfaced bounded readonly requirements in the shared public Beta data-readiness runtime surface. `src/lib/public-beta-data-readiness-status.ts` and `src/components/public-beta-data-readiness-status.tsx` now expose `靘?甈`, `甈?憟?`, `摰頛詨`, and `??? so users and PM can see what must be true before any future readonly gate, without implying authorization or execution. The next PM/A1 route is `prepare_exact_source_rights_and_field_contract_evidence_for_future_readonly_attempt`.
- A2 TWII source-attribution and cadence public-copy guard is ready for PM intake at `docs/A2_TWII_SOURCE_ATTRIBUTION_AND_CADENCE_PUBLIC_COPY_GUARD.md`. PM accepted the background output after bounded repair and registered `scripts/check-a2-twii-source-attribution-and-cadence-public-copy-guard.mjs`. The guard protects source-attribution wording, daily-after-close cadence wording, mock boundary, and non-investment-advice wording before any real-data promotion.
- A1 bounded readonly gate candidate requirements are now ready for PM intake at `docs/A1_TWII_BOUNDED_READONLY_GATE_CANDIDATE_REQUIREMENTS_NO_EXECUTION.md`. The packet defines future attempt fields, fail-closed requirements, source-rights evidence, field contract, cadence, no-secret output, no raw/row payload output, no Supabase write, no `daily_prices` mutation, no promotion, and post-run review requirements while remaining no-execution. The next PM route is `surface_bounded_readonly_requirements_as_runtime_readiness_then_wait_for_external_execution_decision`; A1 next owns `prepare_exact_source_rights_and_field_contract_evidence_for_future_readonly_attempt`; A2 next owns `review_twii_source_attribution_and_cadence_public_copy_guard`.
- PM wired the TWII terms/field/cadence/attribution packet into the shared public Beta data-readiness runtime surface. `src/lib/public-beta-data-readiness-status.ts` and `src/components/public-beta-data-readiness-status.tsx` now expose `鞈?璇狡`, `甈?撠`, `?湔蝭憟, and `?祇?撘` as reader-facing readiness cards. The integration keeps `publicDataSource=mock`, `scoreSource=mock`, no SQL, no Supabase, no raw market-data fetch, no endpoint probe, and no real-data promotion. The next PM route is `review_twii_terms_runtime_readiness_copy_then_prepare_bounded_readonly_requirements`; A1 next owns `prepare_twii_bounded_readonly_gate_candidate_requirements_no_execution`; A2 next owns `review_twii_source_attribution_and_cadence_public_copy_guard`.
- A1 TWII terms/field/cadence/attribution no-fetch packet is ready for PM intake at `docs/A1_TWII_TERMS_FIELD_CADENCE_ATTRIBUTION_NO_FETCH_PACKET.md`. It narrows the TWII source route into terms, minimum fields, daily-after-close cadence, and public attribution decisions while preserving `publicDataSource=mock`, `scoreSource=mock`, no SQL, no Supabase connection/write, no staging rows, no `daily_prices` mutation, no endpoint probe, no market-data fetch/ingest/store/commit, no row payloads, no row coverage points, and no real-data promotion. The next PM route is `wire_twii_terms_field_cadence_attribution_status_into_runtime_readiness_copy`; A1 next owns `prepare_twii_bounded_readonly_gate_candidate_requirements_no_execution`; A2 next owns `review_twii_source_attribution_and_cadence_public_copy_guard`.
- PM wired the accepted A1 no-fetch coverage artifact into the public data-readiness runtime surface. `src/lib/public-beta-data-readiness-status.ts` and `src/components/public-beta-data-readiness-status.tsx` now expose the next coverage scopes as user-readable cards: `TWII 憭抒?箸?皞?銝苜, `?詨? ETF 靘?璇辣敺Ⅱ隤, `蝚砌??嫣?撣蝷箇?`, `?Ｘ平??蝢文? taxonomy review`, and `?脤??? mock ?航圾???祕閮??芷??霉. The integration remains mock-only and does not promote public data, score source, row coverage points, SQL, Supabase, or raw market data.
- A1 next no-fetch coverage artifact is now ready for PM intake at `docs/A1_PUBLIC_BETA_NEXT_NO_FETCH_COVERAGE_ARTIFACT.md`. It separates `TWII`, core ETF (`0050`, `006208`), Batch 1 listed-equity demo anchors (`2330`, `2382`, `2308`), sector/industry, and derived indicators into PM-safe runtime coverage states. The next PM route is `wire_next_no_fetch_coverage_artifact_into_public_data_readiness_status`; A1 next owns `prepare_twii_terms_field_cadence_attribution_no_fetch_packet`; A2 next owns `review_data_readiness_and_coverage_artifact_public_copy_density`.
- PM repaired the shared public Beta data-readiness and data-realization runtime helpers. Home and `/briefing` now show readable Chinese for data readiness, row coverage evidence, TWII prerequisites, public data boundary, source-trust next steps, coverage rollout batches, readonly gate status, and mock-only stop lines. This slice keeps `publicDataSource=mock`, `scoreSource=mock`, no SQL, no Supabase write, no market-data fetch, and no real-data promotion. A1 next owns the next no-fetch coverage artifact; A2 next owns public-copy review for the repaired data readiness and coverage rollout wording.
- PM cleaned the shared public Beta route-reading path across Home, `/briefing`, and stock detail. The route panel now uses reader-facing Chinese for the three-step path, source/coverage state, next data gate, and mock boundary, and the dedicated checker blocks mojibake/developer residue on the shared route surface.
- PM cleaned the Home `Public Beta Index Dashboard` BRIEF loop so its headline, market overview, core indicator panel, alert list, update time, impact level, next step, and stop line are readable Chinese. The dedicated checker now blocks mojibake/developer residue in this high-exposure loop while preserving `publicDataSource=mock`, `scoreSource=mock`, and non-advice boundaries.
- PM translated the accepted Batch 1 listed-equity policy into the shared `Source & Coverage` public panel. The public label layer now explains `蝚砌??寧內蝭??, `銝摰銝??∠巨閬?`, and `銝????ETF/???` so users can understand that visible stock pages are mock demo anchors, not full listed-equity coverage or live data.
- PM accepted `docs/A1_BATCH1_LISTED_EQUITY_SYMBOL_POLICY_NO_ROW_LIST.md` as the Batch 1 listed-equity policy input. The accepted policy keeps the first listed-equity batch small, visible, and explainable; blocks full stock-id row-list output; separates listed equity from ETF, index, OTC, and other instrument scopes; and keeps public labels mock-only and non-advice. The next route is `prepare_batch1_listed_equity_mock_runtime_policy_labels`.
- PM integrated the index-baseline mock runtime handoff into the shared `Source & Coverage` public panel. The public label layer now shows `?舐內蝭, `?怠??祇?`, and `?輻?敺Ⅱ隤 for index baseline checks without exposing fixture, parser, or handoff internals.
- PM added `src/lib/twse-openapi-index-baseline-mock-runtime-handoff.ts` to summarize the index-baseline fixture into mock runtime statuses: `?舐內蝭, `?怠??祇?`, and `?輻?敺Ⅱ隤. The handoff status is `twse_openapi_index_baseline_mock_runtime_handoff_ready_no_fetch`, and the next route is `index_baseline_mock_runtime_handoff_review_then_public_label_integration`.
- PM converted A1's no-fetch index-baseline synthetic cases into `src/lib/twse-openapi-index-baseline-synthetic-fixture.ts`. The fixture status is `twse_openapi_index_baseline_synthetic_parser_fixture_ready_no_fetch` and covers valid date/close, missing close, duplicate date, missing optional fields, revision warning, and session-gap behavior without fetching market rows or promoting real data.
- Completed route anchor retained for checker continuity: `prepare_index_baseline_synthetic_parser_fixture_no_fetch`.
- The shared `Source & Coverage` runtime-label panel now includes field-contract status copy: `甈?撠隞瑼Ｘ`, `憭抒甈?撠`, and `銝??甈?撠`. PM converted the accepted A1 no-fetch field-contract packet into public-readable mock labels without claiming real parser readiness, complete coverage, or source promotion.
- The `Source & Coverage` runtime-label panel now includes a 3-minute reading action strip: check data state, check coverage gaps, and choose the next observation direction. This makes the source/coverage surface actionable for public Beta users while preserving mock-only and non-advice boundaries.
- Home, briefing, and stock detail now share a `Source & Coverage` runtime-label panel. The panel turns A1's no-fetch source/coverage handoff into reader-facing states: index baseline checking, core ETF blocked, and first listed-equity batch usable only as mock demonstration. PM accepted `docs/A1_TWSE_OPENAPI_TERMS_FIELD_COVERAGE_MATRIX_NO_FETCH.md` for mock runtime label planning and accepted `docs/A2_SOURCE_COVERAGE_RUNTIME_LABELS_PUBLIC_COPY_REVIEW.md` after applying bounded copy repair. This keeps source trust and coverage gaps visible without claiming real data, complete coverage, or real score readiness.
- Home, briefing, and stock detail now share a visible `Public Beta Reading Path` panel. The route consistency surface tells users how to move from 30-second market overview to 3-minute briefing judgment to stock detail confirmation, while translating A1 data-line status into reader-facing candidate-source confirmation and preserving `publicDataSource=mock` / `scoreSource=mock` / non-advice boundaries.
- Stock detail runtime pages now include a BRIEF-aligned public decision brief: `30 蝘??????, `3 ???扯??, cause, update time, impact level, next step, and a visible `publicDataSource=mock` / `scoreSource=mock` / non-investment-advice boundary. The stock-focused gates were refreshed to guard these user-facing requirements instead of stale internal process copy.
- `/briefing` has been moved closer to the BRIEF product target by converting visible navigation, decision boundary, reading bridge, watchlists, action cards, next-reading links, executive links, and runtime-plan copy into reader-facing public Beta language.
- The relevant gates now protect readable public Beta phrases, 30-second/3-minute decision flow, mock boundary, no-advice posture, and absence of internal blocker/process terms.
- Next PM mainline should continue with data-line mock runtime label readiness and only add public UI when it clarifies source trust, coverage state, or runtime safety; broad visual polish remains lower priority.
- Previous route anchor retained for checker continuity: `integrate_runtime_readability_and_source_trust_states_before_real_data_promotion`.

## 3. A1 Data / Source / Coverage Lane

A1 owns source and coverage preparation that does not fetch market rows.

Active A1 artifact:

- `docs/A1_ETF_MARKET_PRICE_SOURCE_SCOPE_NO_FETCH.md`
- `docs/A1_PUBLIC_BETA_SOURCE_COVERAGE_GAP_MATRIX_NO_FETCH.md`
- `docs/A1_BRIEF_SOURCE_COVERAGE_NEXT_HANDOFF_NO_FETCH.md`
- `docs/A1_OFFICIAL_OPEN_FREE_SOURCE_TERMS_AND_COVERAGE_MATRIX_NO_FETCH.md`
- `docs/A1_PUBLIC_BETA_SOURCE_COVERAGE_RUNTIME_NO_FETCH_HANDOFF.md`
- `docs/A1_TWSE_OPENAPI_TERMS_FIELD_COVERAGE_MATRIX_NO_FETCH.md`
- `docs/A1_TWSE_OPENAPI_INDEX_BASELINE_FIELD_CONTRACT_CONFIRMATION_NO_FETCH.md`
- `docs/A1_INDEX_BASELINE_SYNTHETIC_CONTRACT_CASES_NO_FETCH.md`
- `docs/A1_BATCH1_LISTED_EQUITY_SYMBOL_POLICY_NO_ROW_LIST.md`
- `docs/A1_PUBLIC_BETA_NEXT_NO_FETCH_COVERAGE_ARTIFACT.md`
- `docs/A1_TWII_TERMS_FIELD_CADENCE_ATTRIBUTION_NO_FETCH_PACKET.md`
- `docs/A1_TWII_BOUNDED_READONLY_GATE_CANDIDATE_REQUIREMENTS_NO_EXECUTION.md`
- `docs/A1_TWII_EXACT_SOURCE_RIGHTS_AND_FIELD_CONTRACT_EVIDENCE_NO_FETCH.md`
- `docs/TWII_OPERATOR_READONLY_DECISION_PACKET_NO_EXECUTION.md`
- `docs/A1_TWII_READONLY_EXECUTION_PACKET_PREREQUISITES_NO_EXECUTION.md`
- current PM assignment: wait for an explicit future operator decision before any execution packet is prepared.

A1 is responsible for:

- legal/free/automatable source candidate matrix,
- coverage categories for daily close, volume, date, symbol, ETF, index, and stock lanes,
- no-fetch terms review packets,
- source-lane questions for PM/CEO decisions.
- current next task: prepare `prepare_etf_market_price_field_contract_no_fetch`, defining planning-only ETF market-price fields, source metadata, quality controls, and public attribution language without fetching ETF rows or approving real display.
- next background task: prepare `A1_BRIEF_SOURCE_COVERAGE_NEXT_HANDOFF_NO_FETCH` when agent capacity is available, focused on source/coverage status, the next smallest no-fetch data task, PM-safe public runtime language, and checker requirements.
- fallback task while agent capacity is full: monitor future explicit operator decision; if authorization is later accepted, prepare no-write execution packet details from `docs/A1_TWII_READONLY_EXECUTION_PACKET_PREREQUISITES_NO_EXECUTION.md`.

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

- `docs/A2_BRIEF_PUBLIC_RUNTIME_SURFACE_AUDIT.md`
- `docs/A2_HOME_FIRST_SCREEN_PUBLIC_COPY_HANDOFF.md`
- `docs/A2_PUBLIC_COPY_UX_SAFETY_QA_HANDOFF_2026_06_12.md`
- `docs/A2_SOURCE_COVERAGE_RUNTIME_LABELS_PUBLIC_COPY_REVIEW.md`
- `docs/A2_FIELD_CONTRACT_PUBLIC_COPY_GUARD.md`
- `docs/A2_TWII_SOURCE_ATTRIBUTION_AND_CADENCE_PUBLIC_COPY_GUARD.md`
- `docs/A2_TWII_OPERATOR_DECISION_PUBLIC_COPY_GUARD.md`
- current PM assignment: review stock detail and home-to-briefing language for 30-second comprehension, 3-minute action judgment, mock/real boundary clarity, and non-advice wording; propose copy patches only when they improve comprehension or safety.

A2 is responsible for:

- first-screen wording that supports 30-second market atmosphere,
- 3-minute action judgment copy,
- mock/real boundary readability,
- non-investment-advice wording,
- blocking internal execution strings on public surfaces.
- current next task: review `docs/A1_ETF_MARKET_PRICE_SOURCE_SCOPE_NO_FETCH.md` for public-copy safety, especially NAV/holdings/premium-discount exclusions and non-advice wording; then keep the public runtime surface audit current across `/`, `/briefing`, weekly, stock, methodology, disclaimer, terms, and privacy routes.
- next background task: review the cleaned `Public Beta Reading Path`, `Data Readiness`, and `Source & Coverage` surfaces for public-copy safety when agent capacity is available.
- fallback task while agent capacity is full: monitor any future copy integration request and use `docs/A2_TWII_OPERATOR_DECISION_PUBLIC_COPY_GUARD.md`; keep it copy-only and do not approve source rights, real data, real scoring, SQL, Supabase, raw payloads, or investment advice.

A2 is not authorized by this goal to:

- edit data evidence,
- approve runtime promotion,
- run SQL,
- connect to or write Supabase,
- fetch or ingest market data,
- set `publicDataSource=supabase`,
- set `scoreSource=real`.

## 5. Integration Rules

## 5A. A3 Launch / Production Engineering Lane

A3 owns production-launch readiness that can proceed without touching market data execution.

Active A3 artifact:

- `docs/A3_LAUNCH_ENGINEERING_HANDOFF.md`

A3 is responsible for:

- Vercel production checklist,
- environment variable inventory without printing secret values,
- custom domain and DNS checklist,
- analytics event plan for free-to-member paths,
- SEO and sitemap readiness,
- monitoring and error visibility,
- cache and fallback policy,
- release and rollback checklist,
- public Beta launch checklist.

A3 must not run SQL, write Supabase, create staging rows, mutate `daily_prices`, fetch/ingest/store/commit raw market data, print secrets, promote `publicDataSource=supabase`, promote `scoreSource=real`, claim live real-time data, or claim investment advice.

Current A3 next task:

- `public_beta_phase_1_launch_readiness_checklist`

## 5B. A4 Membership MVP Planning Lane

A4 is standby for Phase 2.

Active A4 artifact:

- `docs/A4_MEMBERSHIP_MVP_PLANNING_HANDOFF.md`

A4 should activate only when PM decides Phase 1 public launch readiness is stable enough that membership planning will not slow the public site.

A4 is responsible for:

- free/member content boundary,
- member area information architecture,
- daily member market three-layer interpretation template,
- watchlist MVP behavior,
- one custom alert condition MVP,
- post-market review report structure,
- conversion metrics and event names,
- member-content non-investment-advice guard.

A4 must not implement payment, broker integration, trading, portfolio allocation advice, direct buy/sell recommendation, or anything that blocks Phase 1 launch readiness.

Current A4 next task:

- standby; if activated, prepare `membership_mvp_scope_and_free_paid_boundary`.

PM can integrate A1/A2/A3/A4 results when all are true:

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

## 8A. 2026-06-13 PM Mainline Runtime Copy Slice

CEO decision:

`continue_brief_product_runtime_public_readability_before_next_data_execution`

PM executed the route-local trust/readability slice because public Beta pages still exposed unreadable legacy copy on `/weekly`, `/methodology`, `/disclaimer`, `/terms`, and `/privacy`.

Completed mainline work:

- Rewrote `/weekly` as a concise public Beta weekly report that supports 30-second market atmosphere and 3-minute action judgment.
- Rewrote `/methodology` as a readable method explanation with indicator composition, data-quality grades, and score boundary language.
- Rewrote `/disclaimer`, `/terms`, and `/privacy` as public-facing trust pages with clear mock-only, non-investment-advice, privacy, and Beta-change boundaries.
- Rewrote `RouteLocalTrustCopyPanel`, `WeeklyRowCoverageStatus`, and `buildWeeklyMarketActionSummary` to remove mojibake and preserve publicDataSource/scoreSource mock boundaries.
- Updated A2 readability gates so the checks now assert the current public copy instead of stale mojibake expectations.
- Restored local runtime after `.next` dev-server chunk drift caused `/` and `/briefing` HTTP 500; root cause was stale dev cache (`Cannot find module './948.js'`), not source code.

Verification completed:

- `cmd.exe /c npm run check:a2-weekly-readable-copy`
- `cmd.exe /c npm run check:a2-legal-methodology-readable-copy`
- `cmd.exe /c npx tsc --noEmit`
- `cmd.exe /c npm run build`
- `cmd.exe /c npm run check:public-beta-core-route-quick-proof`
- `cmd.exe /c npm run check:review-gates`

Current lane assignments:

- PM mainline: continue BRIEF product/runtime closed loop; next priority is to make the route-local trust pages visually consistent with the home/briefing reading path without opening visual-polish-only work.
- A1 background: continue `source/coverage` no-fetch line, focusing on legal/free/automatable source coverage and field-contract readiness. Do not fetch rows, run SQL, connect Supabase, or prepare real promotion claims.
- A2 background: audit public copy surfaces after this slice; focus on blocking internal execution strings, stale governance copy, mojibake, and any wording that implies real data, complete coverage, or investment advice.

Next PM mainline candidate:

`public_beta_route_local_trust_visual_consistency_guard`

This should be a bounded product/runtime slice: add or update a checker that ensures `/weekly`, `/methodology`, `/disclaimer`, `/terms`, and `/privacy` remain readable, mock-boundary-safe, and free of development-process residue. Do not expand into broad UI redesign yet.

## 8B. 2026-06-13 Route-Local Trust Consistency Guard

CEO decision:

`guard_route_local_trust_consistency_without_broad_visual_polish`

PM executed the bounded guard slice after the route-local trust copy cleanup. This is not a broad UI redesign. It locks the minimum public Beta structure needed for usable trust pages:

- hero and stop-line copy,
- shared trust boundary notice,
- route-local trust panel,
- route-local quick-read cards,
- mock/score boundary language,
- non-investment-advice wording,
- privacy/source payload stop lines,
- no development-process residue.

New guard:

- `scripts/check-public-beta-route-local-trust-visual-consistency.mjs`
- package command: `check:public-beta-route-local-trust-visual-consistency`
- review-gate name: `public-beta-route-local-trust-visual-consistency`

Verification completed:

- `cmd.exe /c npm run check:public-beta-route-local-trust-visual-consistency`
- `cmd.exe /c npm run check:a2-weekly-readable-copy`
- `cmd.exe /c npm run check:a2-legal-methodology-readable-copy`

Current lane assignments:

- PM mainline: move back to BRIEF product/runtime closed loop on the high-traffic path (`/`, `/briefing`, `/stocks/[symbol]`) unless a trust page regression appears.
- A1 background: continue no-fetch source and coverage work, especially legal/free/automatable source and field-contract readiness.
- A2 background: use the new guard as the route-local trust baseline; focus future copy work on comprehension gaps, not style polish.

Next PM mainline candidate:

`home_briefing_stock_3_minute_action_bridge_guard`

This should check that the highest-traffic path still gives users a 30-second market mood and 3-minute action judgment without exposing internal execution language or real-data claims.

## 8C. 2026-06-13 Mainline 3-Minute Action Bridge Guard

CEO decision:

`guard_home_briefing_stock_3_minute_action_bridge_before_next_runtime_expansion`

PM executed a bounded BRIEF product/runtime guard for the highest-traffic path (`/`, `/briefing`, `/stocks/[symbol]`). This does not change the data source, does not promote real data, and does not open broad visual polish. It verifies that the public Beta product loop still gives users:

- a 30-second market atmosphere entry point,
- a 3-minute action judgment path,
- an observation / risk / stop-condition structure,
- mock-only publicDataSource and scoreSource boundaries,
- non-investment-advice language,
- no runtime helper dependency on Supabase, fetch, env secrets, or real score/source promotion.

New guard:

- `scripts/check-public-beta-mainline-action-bridge.mjs`
- package command: `check:public-beta-mainline-action-bridge`
- review-gate name: `public-beta-mainline-action-bridge`

Verification completed:

- `cmd.exe /c npm run check:public-beta-mainline-action-bridge`

Current lane assignments:

- PM mainline: keep pushing BRIEF product/runtime on high-traffic surfaces; next slice should either make the public dashboard surface less internally technical or add a user-facing progress/status summary that does not expose process residue.
- A1 background: continue legal/free/automatable source and coverage work as an independent data lane; no row fetch, SQL, Supabase write, raw payload storage, or real promotion.
- A2 background: audit copy comprehension on the high-traffic path using this guard as baseline; focus on phrases a normal investor cannot understand within 30 seconds.

Next PM mainline candidate:

`public_beta_home_briefing_stock_internal_residue_reduction`

This should reduce public-facing internal process residue on high-traffic pages without weakening the mock boundary, legal disclosure, or data-source caution.

## 8D. 2026-06-13 Briefing Public Decision Summary Cleanup

CEO decision:

`clean_briefing_first_view_public_decision_summary_before_broader_ui_polish`

PM executed the next BRIEF product/runtime slice on `/briefing`. The slice stayed narrow: it cleaned the first public decision summary helper and panel, synchronized the briefing action-summary checker, and added one visible 3-minute action judgment line to the Market Action Summary section. It did not change data source behavior, did not connect to Supabase, did not run SQL, did not fetch market data, and did not promote real scores.

Completed mainline work:

- Rewrote `src/lib/briefing-public-decision-summary.ts` into readable public copy for market mood, alert cause, update time, impact level, next step, and mock boundary.
- Rewrote `src/components/briefing-public-decision-summary-panel.tsx` to remove mojibake from the first visible briefing decision panel.
- Updated `scripts/check-briefing-market-action-summary.mjs` so the guard now expects readable BRIEF wording instead of legacy mojibake strings.
- Added visible `/briefing` copy for `3 ??銵??斗` in the action-summary path.

Verification completed:

- `cmd.exe /c npm run check:briefing-market-action-summary`
- `cmd.exe /c npm run check:public-beta-mainline-action-bridge`
- `cmd.exe /c npm run check:public-visible-language-quality`
- `cmd.exe /c npx tsc --noEmit`
- Browser visible-text check on `http://localhost:3000/briefing`: confirmed 30-second market mood, 3-minute action judgment, mock boundary, non-investment-advice copy, no visible replacement character, no `???` run, and no internal packet/cmd/PUBLIC_BETA terms in the checked first page text.

Current lane assignments:

- PM mainline: continue reducing public-facing internal residue on `/briefing`, then return to `/` and `/stocks/[symbol]` only where visible language blocks the 30-second / 3-minute reading path.
- A1 background: continue source and coverage work outside this runtime slice; do not fetch/store rows or alter source promotion state.
- A2 background: use the updated briefing checker as the copy-safety baseline and flag remaining user-visible jargon, especially `promotion gate`, `mock-only`, and any English process wording that can be phrased for investors.

Next PM mainline candidate:

`briefing_midpage_navigation_readability_cleanup`

This should target the next visible `/briefing` block with the most user-facing residue, especially navigation labels and reading-plan copy, while keeping the scope smaller than a full page rewrite.

Recommended next mainline action:

`wait_for_explicit_operator_decision_before_execution_packet`

Meaning:

PM now has the no-execution TWII operator decision packet plus A1 prerequisite shape and A2 copy guard. The next decision is external/operator-facing: either explicitly authorize one bounded readonly attempt, request evidence repair, or defer the attempt. Until then, PM should keep improving BRIEF product/runtime readability without preparing or executing a remote packet. Real-data promotion remains blocked until a separately accepted source-rights, coverage, quality, rollback, execution, post-run review, and runtime promotion gate is recorded.

## 8E. 2026-06-13 Briefing Midpage Investor Readability Guard

CEO decision:

`guard_briefing_midpage_investor_readability_without_full_ui_redesign`

PM executed the next BRIEF product/runtime slice on `/briefing`. The slice stayed product-facing and did not change data behavior. It cleaned the midpage reading path, decision strip, reading bridge, data-boundary panel, ETF watch copy, action-card copy, and final disclosure so the public Beta page reads like an investor-facing dashboard instead of an internal execution report.

Completed mainline work:

- Replaced visible engineering terms such as `mock-only public Beta reading interface`, `partial coverage`, `missing/delayed data`, `promotion gate`, `Model Boundary`, `Public data source`, `Score source`, and `Advice status` with investor-readable Chinese wording.
- Preserved explicit safety boundaries: `publicDataSource=mock`, `scoreSource=mock`, non-investment-advice status, no real-data claim, and no full-coverage claim.
- Added `scripts/check-briefing-midpage-readability.mjs` as a focused guard for the `/briefing` midpage reading path.
- Added package command `check:briefing-midpage-readability`.
- Added review-gate name `briefing-midpage-readability`.

Current lane assignments:

- PM mainline: continue BRIEF product/runtime convergence on high-traffic pages, but only where visible copy still blocks 30-second market mood or 3-minute action judgment.
- A1 background: continue source and coverage lane independently; keep no SQL, no Supabase write, no raw market row fetch/storage, and no real promotion.
- A2 background: use this guard as the briefing midpage copy baseline; future work should target user comprehension and public trust, not broad style polish.

Next PM mainline candidate:

`home_first_screen_investor_readability_and_briefing_bridge_alignment`

This should make the home first screen and briefing route feel like one continuous public Beta dashboard: the home page should invite the 30-second market mood scan, and `/briefing` should carry the 3-minute action judgment without exposing internal workflow residue.

## 8F. 2026-06-13 Home First-Screen And Briefing Bridge Alignment

CEO decision:

`align_home_first_screen_to_briefing_3_minute_judgment_without_real_data_promotion`

PM executed the next BRIEF product/runtime slice on the high-traffic entry path. The slice keeps `/` and `/briefing` connected as one public Beta reading journey: Home starts the 30-second market mood scan, and `/briefing` continues into the 3-minute action judgment. It does not change data source behavior, does not connect to Supabase, does not run SQL, does not fetch market data, and does not promote real scores.

Completed mainline work:

- Cleaned Home first-screen and product overview copy so the public route says `30 蝘絲暺, `蝷箇?鞈??祇? Beta`, and `蝷箇?鞈??梯?璅∪?` instead of process-heavy internal language.
- Cleaned briefing lower-page residue so the public route says `蝷箇?鞈??梯?隞`, `甇??鞈?撠??`, and plain-language data boundaries instead of `mock-only`, `promotion`, `raw market data`, or operator packet wording.
- Updated the public Data Readiness copy so the visible stop line says no database write, no raw payload import, no official-table mutation, and no formal-data/formal-score upgrade.
- Added `scripts/check-home-briefing-investor-reading-bridge.mjs` to guard the Home-to-briefing bridge across rendered `/` and `/briefing` routes.
- Updated `scripts/check-home-first-screen-action-summary.mjs`, `scripts/check-home-product-first-information-hierarchy.mjs`, `scripts/check-public-visible-language-quality.mjs`, package scripts, and review-gate registration so the checks assert current BRIEF language instead of stale internal or mojibake strings.

Verification completed:

- `cmd.exe /c npm run check:home-briefing-investor-reading-bridge`
- `cmd.exe /c npm run check:home-first-screen-action-summary`
- `cmd.exe /c npm run check:home-product-first-information-hierarchy`
- `cmd.exe /c npm run check:briefing-midpage-readability`
- `cmd.exe /c npm run check:public-visible-language-quality`
- `cmd.exe /c npm run check:public-beta-mainline-action-bridge`

Current lane assignments:

- PM mainline: continue BRIEF product/runtime convergence only where a visible route still blocks 30-second market mood, 3-minute action judgment, mock/real clarity, or public trust. Next likely route is stock-page investor-language alignment because stock detail still carries the most runtime-density risk.
- A1 background: continue the independent data/source/coverage lane, especially legal/free/automatable sources and coverage matrix work. Do not fetch rows, run SQL, connect/write Supabase, store raw payloads, or create real-data promotion claims.
- A2 background: use the new Home/briefing bridge guard as copy baseline; audit stock and weekly copy for the same investor-readable language, mock boundary clarity, and non-investment-advice posture.

Next PM mainline candidate:

`stock_route_investor_language_alignment_guard`

This should reduce stock-detail runtime density and internal residue only where it improves user comprehension. It should not become broad visual polish, and it must preserve `publicDataSource=mock`, `scoreSource=mock`, source-rights caution, and non-investment-advice wording.

## 8G. 2026-06-13 Stock Route Investor Language Alignment Guard

CEO decision:

`stock_route_investor_language_alignment_guard`

PM executed the next BRIEF product/runtime slice on `/stocks/2330`, `/stocks/TWII`, and `/stocks/0050`. The slice changes public presentation only: internal state still remains mock, but the visible stock pages now explain that state as `蝷箇?鞈?`, `蝷箇??`, data-source limits, and non-investment-advice boundaries instead of exposing developer/process tokens such as `publicDataSource`, `scoreSource`, `mock-only`, `packet`, `operator`, or command names.

Completed mainline work:

- Cleaned stock route public-language helpers and panels so stock detail pages read as an investor-facing dashboard instead of a runtime/governance console.
- Rewrote the stock decision-aid summary into a clear 3-minute loop: `??`, `?湔??`, `敶梢蝝`, and `銝?甇亥?撖.
- Rewrote investor action summary helper copy into readable Chinese with explicit `蝷箇?鞈?`, `蝷箇??`, and `??鞈遣霅躬 safety language.
- Rewrote source/coverage, route-consistency, TWII disclosure, runtime strip, SEO content, runtime summary, post-readonly status, ETF/index synthetic handoff wording, and related visible copy guards where they affected stock route readability.
- Added `scripts/check-stock-route-investor-language-alignment.mjs` and package command `check:stock-route-investor-language-alignment`.
- Updated `check:stock-product-first-runtime-readability`, `check:stock-decision-aid-actionability`, and `check:stock-investor-action-summary` so the gates assert the current BRIEF public-language standard instead of stale internal token requirements.

Verification completed:

- `cmd.exe /c npx tsc --noEmit`
- `cmd.exe /c npm run check:stock-route-investor-language-alignment`
- `cmd.exe /c npm run check:stock-product-first-runtime-readability`
- `cmd.exe /c npm run check:stock-decision-aid-actionability`
- `cmd.exe /c npm run check:stock-investor-action-summary`
- Rendered visible-text scan on `/stocks/2330`, `/stocks/TWII`, and `/stocks/0050`: confirmed HTTP 200 and no visible `publicDataSource`, `scoreSource`, `mock-only`, `Runtime`, `cmd.exe`, `packet`, `operator`, or similar internal workflow terms.

Current lane assignments:

- PM mainline: continue BRIEF product/runtime convergence on the highest-value visible route. Next priority should be `stock_route_remaining_mojibake_and_density_cleanup` if source-level mojibake still affects stock route maintenance, or `weekly_route_investor_language_alignment_guard` if the stock route remains stable.
- A1 background: continue the independent data/source/coverage lane, especially legal/free/automatable source and coverage matrix work. Do not fetch rows, run SQL, connect/write Supabase, store raw payloads, or create real-data promotion claims.
- A2 background: use `check:stock-route-investor-language-alignment` as the stock public-copy baseline. Audit stock/weekly/trust copy for user comprehension, internal-token leakage, mojibake, real-data implication, complete-coverage implication, and investment-advice risk.

Next PM mainline candidate:

`stock_route_remaining_mojibake_and_density_cleanup`

This should be bounded: clean only public or near-public stock-route source text that still risks rendering as mojibake or internal process residue. Do not open broad visual polish, data ingestion, Supabase writes, SQL, raw market-data fetch, `publicDataSource=supabase`, or `scoreSource=real`.

## 8H. 2026-06-13 Public Data Readiness Runtime Cleanup And Gate Split

CEO decision:

`promote_public_beta_data_readiness_to_visible_home_and_briefing_runtime_language`

PM executed the next BRIEF product/runtime slice on Home and `/briefing`. The slice makes the public Beta data-readiness state readable to general investors while keeping the runtime mock-only and fail-closed. The public surface now says what is ready, what remains blocked, and why real-data promotion is still locked, without showing internal command packets or development workflow residue.

Completed mainline work:

- Rewrote `src/lib/public-beta-data-readiness-status.ts` into readable public Chinese for source rights, field contracts, update cadence, attribution, bounded readonly requirements, TWII decision readiness, and coverage scopes.
- Rewrote `src/components/public-beta-data-readiness-status.tsx` so Home and `/briefing` expose user-facing data-readiness cards instead of internal governance language.
- Moved `PublicBetaDataReadinessStatus` out of the hidden Home diagnostics block so `/` now renders the same data-readiness status that `/briefing` already carried.
- Rewrote `src/lib/twse-openapi-index-baseline-mock-runtime-handoff.ts` with stable public statuses: `?舐內蝭, `?怠??祇?`, and `?輻?敺Ⅱ隤, while preserving `twse_openapi_index_baseline_mock_runtime_handoff_ready_no_fetch` and `mockOnly=true` for local gates.
- Updated `scripts/check-public-beta-data-readiness-status.mjs` and `scripts/check-twse-openapi-index-baseline-mock-runtime-handoff.mjs` so the checks guard readable public language, no-fetch behavior, mock-only status, and no real-data promotion.

Verification completed:

- `cmd.exe /c npx tsc --noEmit`
- `cmd.exe /c npm run check:public-beta-data-readiness-status`
- `cmd.exe /c npm run check:twse-openapi-index-baseline-mock-runtime-handoff`
- `cmd.exe /c npm run check:public-beta-source-coverage-runtime-labels`
- `cmd.exe /c npm run check:public-visible-language-quality`

Review-gate note:

- A full `check:review-gates` run was attempted after this slice, but it stalled in a broad TWII operator preflight fan-out before producing a JSON result. CEO decision is to treat this as a gate-orchestration problem, not a product/runtime content blocker. Future work should split TWII preflight fan-out from the BRIEF public-runtime gate so routine product/runtime slices do not spend minutes on unrelated no-execution operator packet checks.

Current lane assignments:

- PM mainline: continue BRIEF product/runtime convergence on visible user comprehension. Next priority is to remove remaining public-facing mojibake and internal density from the Home runtime summary and stock route support text, but only where it affects the 30-second market mood and 3-minute action loop.
- A1 background: continue data/source/coverage work independently. Focus on legal-free automatable source certainty, TWII first, without raw fetch, SQL, Supabase write, staging rows, or real-data promotion.
- A2 background: continue public copy guard. Use the current Home and `/briefing` data-readiness cards as baseline: no internal command names, no operator wording, no official endorsement, no real-time claim, and no investment advice.

Next PM mainline candidate:

`home_runtime_summary_public_copy_cleanup_then_gate_split`

This should clean only the visible Home runtime summary residue and then split/label the slow TWII preflight fan-out gate so future BRIEF slices can verify quickly without weakening necessary data-safety gates.

## 8I. 2026-06-13 Public Route Cleanup And Focused Review Gate Convergence

CEO decision:

`remove_non_user_facing_runtime_and_process_residue_from_public_routes`

PM executed a larger BRIEF product/runtime cleanup slice across public routes and focused review gates. The goal was to remove things that belong to development workflow, governance packets, runtime internals, or old diagnostic wording from pages intended for general users.

Completed mainline work:

- Strengthened the public visible-language checker to scan 13 public routes for command names, old process terms, internal runtime field names, Supabase/SQL labels, raw payload/data wording, promotion-gate residue, and mojibake markers.
- Rewrote stale public-route review gates so they validate the current product promise: 30-second market mood, 3-minute action judgment, demonstration-data transparency, data-readiness boundaries, and non-investment-advice copy.
- Kept TWSE/OpenAPI runtime mock wiring checks as source-safety checks only; they no longer force internal runtime cards back onto public pages.
- Added `銝?甇亥?撖 to the home market list description so the home page carries an explicit action cue.
- Confirmed the route-level public copy baseline on `/`, `/briefing`, `/weekly`, `/methodology`, `/disclaimer`, `/terms`, `/privacy`, and stock routes including `/stocks/TWII`, `/stocks/2330`, and `/stocks/0050`.

Verification completed:

- `cmd.exe /c npx tsc --noEmit`
- `cmd.exe /c npm run check:public-visible-language-quality`
- `cmd.exe /c npm run check:review-gates`
- `cmd.exe /c npm run build`

Current lane assignments:

- PM mainline: continue product/runtime work under the BRIEF, but do not spend more slices on old governance residue unless it blocks public user comprehension or a required gate.
- A1 background: continue data/source/coverage tasks independently, especially legal-free automatable source certainty and coverage planning. Keep no raw fetch, no SQL, no Supabase write, no staging rows, no `daily_prices` mutation, no real promotion.
- A2 background: continue public copy guard. Baseline: no internal field names, no command snippets, no official/live/complete-data claim, no investment-advice implication, and no mojibake.

Next PM mainline candidate:

`public_beta_home_briefing_stock_value_loop_refinement`

This should improve only the core user loop: market mood, reason, updated-at/data state, impact, and next observation. UI polish remains secondary unless a readability issue blocks the 30-second/3-minute promise.

## 8J. 2026-06-13 Public Beta Value Loop Refinement

CEO decision:

`restore_product_value_loop_after_public_route_cleanup`

PM executed the next BRIEF runtime slice after the broad public-route cleanup. The goal was to make the cleaned pages more useful to ordinary investors rather than leaving them as process-safe but thin status pages.

Completed mainline work:

- Added a visible `3 ???斗??` section to the home page for the market-wide decision loop.
- Added a visible `3 ???斗??` section to stock routes so individual stock pages explain market mood, cause, impact level, and next observation without offering buy/sell advice.
- Added the same decision-order concept to `/briefing`, connecting market mood, cause, data state, and next observation into a single user-readable flow.
- Added `scripts/check-public-beta-value-loop-refinement.mjs` and registered it as `check:public-beta-value-loop-refinement`.
- Integrated the new check into `scripts/check-review-gates.mjs` so future focused review gates block internal wording regressions on the public route set.
- Restarted the local dev server and cleared stale `.next` after dev-only stale 500s appeared on `/briefing` and `/weekly`; production build and refreshed dev routes are healthy.

Verification completed:

- `cmd.exe /c npx tsc --noEmit`
- `cmd.exe /c npm run check:public-beta-value-loop-refinement`
- `cmd.exe /c npm run check:public-visible-language-quality`
- `cmd.exe /c npm run build`
- `cmd.exe /c node scripts/check-review-gates.mjs > tmp\review-gates-latest.json`

Review gate result:

- `status=ok`
- `executedCount=170`
- `failed=[]`

Current lane assignments:

- PM mainline: continue from `public_beta_user_value_loop_to_source_coverage_bridge`. The next slice should connect visible user value to source/coverage readiness copy and avoid reopening broad governance cleanup unless a public page leaks internal wording again.
- A1 background: continue source-rights and coverage matrix work independently, with no raw market-data fetch, SQL, Supabase write, staging rows, `daily_prices` mutation, or real-data promotion.
- A2 background: continue public-copy guard, especially claims around official source status, data freshness, completeness, mock/demo boundaries, and non-investment-advice wording.

CEO speed note:

The broad residue cleanup was necessary because public pages were showing development-process concepts. After 8J, the project should stop spending routine slices on cleanup and move back to BRIEF delivery: user comprehension, source/coverage readiness, and eventually data promotion gates.

## 8K. 2026-06-13 Public Beta User Value / Source Coverage Bridge

CEO decision:

`connect_user_value_loop_to_source_coverage_readiness`

PM executed the next BRIEF product/runtime slice after 8J. The cleaned public pages now connect the market mood/action loop to a visible source/coverage bridge, so users can understand how much confidence to place in the current demonstration output.

Completed mainline work:

- Added `PublicBetaSourceCoverageBridge` as a lightweight public-facing component.
- Mounted the bridge on Home, `/briefing`, and stock detail routes.
- Reused the existing source/coverage runtime labels model without exposing internal field names or process commands.
- Added `check:public-beta-user-value-source-coverage-bridge` and registered it in the focused review gate.
- Kept the bridge focused on public meaning: current readable scope, coverage limits, full-market status, and upgrade conditions.

Current lane assignments:

- PM mainline: next route is `public_beta_source_coverage_bridge_action_path`. Add only the minimal action path that helps users move from source/coverage readiness to methodology/disclaimer/data-readiness context.
- A1 background: continue `continue_data_line_source_and_coverage_without_market_row_fetch`. A1 should keep source/coverage work independent and aggregate/planning-only until PM explicitly accepts a later executable gate.
- A2 background: review the bridge copy for public trust risk. It must not imply official endorsement, live data, complete Taiwan stock coverage, personalized advice, or readiness for real-score promotion.

Verification target for this slice:

- `cmd.exe /c npm run check:public-beta-user-value-source-coverage-bridge`
- `cmd.exe /c npm run check:public-beta-value-loop-refinement`
- `cmd.exe /c npm run check:public-visible-language-quality`
- `cmd.exe /c npx tsc --noEmit`
- focused `check:review-gates`

Boundary:

This slice is product/runtime only. It does not run SQL, write Supabase, create staging rows, mutate `daily_prices`, fetch or store raw market data, accept row coverage points, or switch public/scoring sources to real.

## 8L. 2026-06-13 Source Coverage Bridge Action Path

CEO decision:

`make_source_coverage_bridge_actionable`

PM executed a narrow follow-up to 8K. The source/coverage bridge now includes a clear action path instead of ending as a static explanation.

Completed mainline work:

- Added tracked links from the bridge to `/methodology`, `/disclaimer`, and `/briefing`.
- Kept the labels user-facing: `?亦??寞?隤芣?`, `?亦?憸券?脫?`, and `?撣?典`.
- Strengthened `check:public-beta-user-value-source-coverage-bridge` so it verifies both visible labels and href targets.

Current lane assignments:

- PM mainline: next route is `public_beta_methodology_disclaimer_source_coverage_alignment`. Only adjust destination pages if the bridge's target pages do not clearly support source/coverage interpretation and risk boundaries.
- A1 background: continue the no-fetch source/coverage matrix and legal-free automatable source path. Do not hand PM raw payloads or market rows.
- A2 background: guard public copy against official/live/complete-data implications and investment-advice language.

Boundary:

No SQL, Supabase write, staging rows, `daily_prices` mutation, raw market-data fetch/store/commit, public source promotion, or real score promotion occurred.

## 8P. 2026-06-14 Public Route Cleanup And Local Route Recovery

CEO decision:

`keep_phase_1_public_routes_user_facing_and_defer_membership_implementation`

PM executed the next BRIEF product/runtime slice after the revised Phase 1 / Phase 2 split. The goal was not cosmetic polish; it was to remove public-route content that still felt like project governance and replace it with product language for normal investors.

Completed mainline work:

- Replaced `/briefing` internal readiness and source-coverage route panels with a user-facing data-status and next-phase section.
- Replaced `/weekly` row-coverage status details with a user-facing weekly data-status section.
- Kept `/membership` as a future-feature preview only; no login, payment, saved watchlist, custom-alert execution, or member-only content was implemented.
- Recovered local route health after a stale Next dev chunk error by clearing `.next` and restarting the dev server.

Verification:

- `npx tsc --noEmit` passed.
- `npm run build` passed.
- `check:public-visible-language-quality` passed.
- `check:phase-1-public-beta-public-visible-residue-cleanup` passed.
- `check:public-surface-user-facing-audit` passed.
- Browser verification passed for `/briefing`, `/weekly`, and `/membership`; no visible mojibake, internal commands, PM/A-lane labels, database terms, raw-data terms, or development-process residue were detected.

Current lane assignments:

- PM mainline: keep Phase 1 public pages clear, readable, and aligned with the revised BRIEF before moving into deeper visual polish.
- A1 Data / Source / Coverage: continue legal-free automated-source and coverage work independently; PM integrates only accepted aggregate-safe outputs.
- A2 Public Copy / Product Safety: audit public pages for source/update/non-advice/member-boundary clarity.
- A3 Launch / Production Engineering: keep Vercel, monitoring, rollback, SEO, and post-deploy checks ready.
- A4 Membership MVP Planning: remain planning-only until Phase 1 public Beta is stable.

Boundary:

No SQL, Supabase read/write, staging rows, `daily_prices` mutation, raw market-data fetch/store/commit, source promotion, real score promotion, membership implementation, production env mutation, DNS change, or Vercel dashboard mutation occurred.

## 8Q. 2026-06-14 Public Brand Language Alignment

CEO decision:

`make_chinese_brand_primary_on_public_surfaces`

PM executed a brand-language cleanup after the public-route cleanup slice. The product is now presented as `指數燈號` on public titles, site chrome, trust pages, and the home hero, while English/internal project naming stays limited to repository/package context.

Completed mainline work:

- Changed the default site title to `指數燈號`.
- Changed the site logo subtitle to `市場狀態儀表站`.
- Changed public legal/trust metadata titles to Chinese-only titles.
- Changed disclaimer and terms body copy to use `指數燈號`.
- Changed the home hero eyebrow to `指數燈號`.
- Updated `check:site-chrome-readability` so it protects user-facing public language instead of requiring older engineering phrases.

Verification:

- `check:site-chrome-readability` passed.
- `check:public-visible-language-quality` passed.
- `check:phase-1-public-beta-public-visible-residue-cleanup` passed.
- `check:public-surface-user-facing-audit` passed.
- `npx tsc --noEmit` passed.
- `npm run build` passed.
- Local route checks for `/`, `/methodology`, and `/disclaimer` returned HTTP 200.

Current lane assignments:

- PM mainline: continue Phase 1 public readability, especially decision-aid clarity on home and stock pages.
- A1 Data / Source / Coverage: continue lawful automated-source and coverage work independently; no source promotion or market-row fetch is opened by this slice.
- A2 Public Copy / Product Safety: keep public copy aligned to Chinese brand, data status, and non-advice boundaries.
- A3 Launch / Production Engineering: keep deployment smoke, monitoring, rollback, and SEO checks ready.
- A4 Membership MVP Planning: remain Phase 2 planning-only until public Beta is stable.

Boundary:

No SQL, Supabase read/write, staging rows, `daily_prices` mutation, raw market-data fetch/store/commit, source promotion, real score promotion, membership implementation, production env mutation, DNS change, or Vercel dashboard mutation occurred.

## 8AR. 2026-06-14 Phase 1 / Phase 2 BRIEF Split and A3 Deploy Movement

CEO decision:

`split_revised_brief_into_phase_1_public_beta_and_phase_2_membership_mvp`

PM accepted the revised "index-lighting website" BRIEF and tightened the execution model so progress does not stall on membership architecture before the public product loop is useful.

Current phase decision:

- Phase 1 is the mainline: public free index-lighting experience for all users. It must make the market state, core indicators, risk reminders, update time, source/data boundary, and non-investment-advice posture understandable without exposing internal development residue.
- Phase 2 is planned but not implemented yet: member daily three-layer interpretation, watchlist, custom alert conditions, post-market review, login/member access, and conversion metrics.
- Membership copy may remain visible as a product roadmap, but login, payment, watchlist persistence, alert execution, and member-only content are deferred until Phase 1 public Beta is stable.

Completed mainline work:

- Classified the current local candidate as Phase 1 public Beta readiness work plus Phase 2 membership roadmap visibility.
- Repaired local route health after a stale `.next` cache caused HTTP 500. PM removed only the generated `.next` cache inside the workspace and restarted Next on `127.0.0.1:3000`.
- Confirmed `/` and `/stocks/2330` return HTTP 200 locally.
- Re-ran the focused pre-deploy verification package against `http://127.0.0.1:3000`.

Verification:

- `npm run build` passed.
- `npx tsc --noEmit` passed.
- `check:public-visible-language-quality` passed.
- `check:phase-1-public-beta-public-visible-residue-cleanup` passed.
- `check:public-surface-user-facing-audit` passed.
- `check:public-beta-core-route-quick-proof` passed.
- `check:briefing-product-first-information-hierarchy` passed.
- `check:pm-brief-runtime-mainline-goal-and-workstreams` passed.
- `check:public-beta-index-dashboard-brief-loop` passed.
- `check:a3-phase-1-release-candidate-public-smoke-report` passed.
- `check:a3-phase-1-public-beta-manual-platform-action-checklist` passed.

Current lane assignments:

- PM mainline: execute `phase_1_public_beta_candidate_git_push_and_remote_smoke`.
- A1 data/source/coverage: continue lawful free automated-source and coverage work independently; no market-row fetch or promotion is opened by this slice.
- A2 trust/public copy: continue guarding public pages against investment advice, real-time claims, complete-coverage claims, official endorsement claims, and development residue.
- A3 launch engineering: push/deploy the current candidate, then rerun remote quick-proof, visible-language quality, and residue cleanup on the Vercel URL.
- A4 membership MVP: keep planning ready for Phase 2, but do not implement membership until Phase 1 public Beta is stable.

Boundary:

No SQL, Supabase write, staging rows, `daily_prices` mutation, raw market-data fetch/store/commit, secret output, source promotion, real score promotion, production env mutation, DNS change, or membership implementation occurred.

Next PM route:

Commit and push the Phase 1 candidate to GitHub, then verify whether Vercel refreshes `https://market-signal-two.vercel.app/` from stale deployment to the current candidate.

## 8AS. 2026-06-14 GitHub Push Done, Vercel Public URL Still Stale

CEO decision:

`escalate_to_a3_vercel_deployment_state_check`

PM completed the Git-backed deployment movement but the public Vercel URL did not refresh to the new candidate during the smoke window.

Completed mainline work:

- Staged the Phase 1 public Beta candidate.
- Created commit `fc852d4d Prepare phase 1 public beta candidate`.
- Pushed `main` to GitHub.
- Verified `origin/main` points to `fc852d4d149032db3800253f3a6c95db24277471`.

Remote outcome:

- `https://market-signal-two.vercel.app/` returns HTTP 200 but remains an older deployment.
- `https://market-signal-two.vercel.app/membership` returns HTTP 404.
- Remote `check:public-beta-core-route-quick-proof` remains blocked only on `/membership: HTTP 404`.

Current lane assignments:

- PM mainline: pause public-URL acceptance and route to A3 platform-state verification.
- A1 data/source/coverage: continue independently; this Vercel blocker does not open data fetch, SQL, Supabase writes, or promotion.
- A2 public copy: no new copy change is needed until Vercel serves the candidate.
- A3 launch engineering: inspect Vercel Deployments for commit `fc852d4d`; determine whether deployment is pending, failed, not triggered, branch-disconnected, or root-directory/build-setting blocked.
- A4 membership MVP: remain deferred. The `/membership` route is Phase 2 roadmap visibility in Phase 1, not live membership implementation.

Boundary:

No SQL, Supabase write, staging rows, `daily_prices` mutation, raw market-data fetch/store/commit, source promotion, real score promotion, production env mutation, DNS change, or Vercel dashboard mutation occurred.

Next PM route:

Perform `verify_vercel_git_integration_or_manual_redeploy`, then rerun remote quick-proof, visible-language quality, and public residue cleanup once Vercel serves the latest commit.

## 8AT. 2026-06-14 Vercel Failed Deployment Confirmed

CEO decision:

`require_vercel_failed_deployment_log_before_more_local_cleanup`

PM used GitHub deployment/status APIs to verify the A3 blocker. The latest GitHub push did trigger Vercel, but Vercel marked the Production deployment as failed.

Evidence:

- Current GitHub `main`: `47d081daefbc90900c34af9ae2214a433388ea5a`.
- GitHub commit status context: `Vercel`.
- Status: `failure`.
- Vercel deployment id: `dpl_4wqKUxBjjcrNG36UPJEz1iYssjnk`.
- GitHub deployment id: `5048210902`.
- GitHub deployment status: `failure`.
- Failed deployment target URL: `https://market-signal-36y9mnjqf-flyjem-projects.vercel.app`.
- Current public alias remains stale; `/membership` still returns HTTP 404 on `https://market-signal-two.vercel.app`.

Log access result:

The official command is:

```powershell
cmd.exe /c npx vercel inspect dpl_4wqKUxBjjcrNG36UPJEz1iYssjnk --logs
```

PM attempted the command, but Vercel CLI started the device-login flow because no local Vercel credentials are available. The stuck CLI process was stopped. No credentials or secrets were printed.

Current lane assignments:

- PM mainline: wait for Vercel build error summary, then fix the exact repo/build issue.
- A1 data/source/coverage: continue independently; this failure does not open data fetch, SQL, Supabase writes, or source promotion.
- A2 public trust copy: no new public copy change until the failed deployment reason is known.
- A3 launch engineering: owner of the next platform action. Need authenticated Vercel deployment log for `dpl_4wqKUxBjjcrNG36UPJEz1iYssjnk`.
- A4 membership MVP: still deferred; `/membership` route is Phase 2 roadmap visibility, not live membership implementation.

Boundary:

No SQL, Supabase write, staging rows, `daily_prices` mutation, raw market-data fetch/store/commit, source promotion, real score promotion, production env mutation, DNS change, Vercel dashboard mutation, or credential output occurred.

Next PM route:

Collect Vercel failed-build log summary for `dpl_4wqKUxBjjcrNG36UPJEz1iYssjnk`, then run `fix_vercel_build_failure_and_redeploy`.

## 8AU. 2026-06-14 Latest Main Also Fails on Vercel

CEO decision:

`do_not_polish_more_until_vercel_build_error_is_known`

PM pushed the Vercel-failure evidence commit and checked the new GitHub/Vercel status. Vercel triggered again, then failed again.

Evidence:

- Current GitHub `main`: `e60f54b4bf50df96bf071d617bcfc366da8873ea`.
- GitHub status context: `Vercel`.
- Status: `failure`.
- Latest failed deployment id: `dpl_3vyMYi1vwPEhsaevhXe9XUjzDXFZ`.
- Vercel deployment page: `https://vercel.com/flyjem-projects/market-signal/3vyMYi1vwPEhsaevhXe9XUjzDXFZ`.
- Current public alias remains stale; `/membership` on `https://market-signal-two.vercel.app` still returns HTTP 404.

Official log command:

```powershell
cmd.exe /c npx vercel inspect dpl_3vyMYi1vwPEhsaevhXe9XUjzDXFZ --logs
```

PM interpretation:

This is now a confirmed Vercel build/deployment blocker. Local route health, build, TypeScript, and public-surface checks were already green before the push. The next useful work is not another public copy or governance slice; it is retrieving the Vercel build error and fixing that exact build/deployment mismatch.

Current lane assignments:

- PM mainline: wait for Vercel build log summary, then fix and redeploy.
- A1: continue no-fetch data/source/coverage work only if separate capacity is available.
- A2: pause extra public-copy polishing until deploy blocker is fixed.
- A3: owner of Vercel failed deployment log retrieval and repair loop.
- A4: remain deferred.

Boundary:

No SQL, Supabase write, staging rows, `daily_prices` mutation, raw market-data fetch/store/commit, source promotion, real score promotion, production env mutation, DNS change, Vercel dashboard mutation, or credential output occurred.

Next PM route:

Open the authenticated Vercel deployment log for `dpl_3vyMYi1vwPEhsaevhXe9XUjzDXFZ`, copy the first failing build error summary, and use that single error as the next repair target.

## 8AV. 2026-06-14 Repo-Side Vercel Config Hardening

CEO decision:

`apply_explicit_vercel_build_config_before_waiting_for_logs`

PM found that the repo itself can pass a Vercel-like clean build, so the most useful repo-side action is to remove implicit Vercel project assumptions.

Completed mainline work:

- Added `engines.node=20.x` to `package.json`.
- Added `vercel.json`.
- Explicit Vercel framework: `nextjs`.
- Explicit install command: `npm ci`.
- Explicit build command: `npm run build`.

Verification:

- `check:json` passed.
- `npm run build` passed.
- `npx tsc --noEmit` passed.
- `check:pm-brief-runtime-mainline-goal-and-workstreams` passed.
- A clean temp tree produced from `git archive HEAD` passed `npm ci`.
- The same clean temp tree passed `npm run build`.
- A no-`.env.local` build also passed earlier, so the failure is not explained by missing local Supabase/env values.

Current lane assignments:

- PM mainline: push the explicit Vercel config, observe the new Vercel status, and only then decide whether a log is still required.
- A1: continue no-fetch data/source/coverage independently.
- A2: no further public-copy polishing until A3 deployment is current.
- A3: if the next deployment fails, retrieve the new Vercel log id and first error.
- A4: remain deferred.

Boundary:

No SQL, Supabase write, staging rows, `daily_prices` mutation, raw market-data fetch/store/commit, source promotion, real score promotion, production env mutation, DNS change, Vercel dashboard mutation, or credential output occurred.

Next PM route:

Commit and push `apply_explicit_vercel_config_and_observe_next_deployment`.

## 8AW. 2026-06-14 A3 Public Beta Deployment Success

CEO decision:

`close_a3_deployment_blocker_and_resume_brief_mainline`

PM pushed the explicit Vercel config and observed the next deployment. Vercel completed successfully, and the public alias now serves the current Phase 1 candidate.

Completed A3 work:

- Commit `a8424b56 Harden Vercel build configuration` added `engines.node=20.x`.
- Added `vercel.json` with explicit Next.js framework, `npm ci`, and `npm run build`.
- Vercel deployment for `a8424b563be6eb2766818240e8f4fa1fdd4b5fc6` completed successfully.
- `https://market-signal-two.vercel.app/membership` now returns HTTP 200 instead of 404.

Remote verification:

- Remote core route quick proof passed.
- Remote public visible-language quality passed.
- Remote Phase 1 visible residue cleanup passed.
- Remote public surface user-facing audit passed.

Current lane assignments:

- PM mainline: resume Phase 1 public Beta BRIEF review and decide the next public Beta acceptance slice.
- A1: continue lawful free automated-source, coverage, ingestion/backfill preparation; do not fetch raw market rows or promote source yet.
- A2: run trust/legal/public-copy final review against the deployed URL.
- A3: add monitoring, rollback, SEO, and post-deploy runbook evidence now that deployment is current.
- A4: keep membership MVP route planning ready, but do not implement full login/payment/watchlist persistence until Phase 1 acceptance is stable.

Boundary:

No SQL, Supabase write, staging rows, `daily_prices` mutation, raw market-data fetch/store/commit, source promotion, real score promotion, DNS change, Vercel dashboard mutation, or credential output occurred. Public data and score sources remain mock/demo.

Next PM route:

Run `phase_1_public_beta_remote_acceptance_review_then_assign_a1_a2_a3_next_lanes`.

## 8AR. 2026-06-14 Briefing Phase 1 Product-First Ordering

CEO decision:

`prioritize_phase_1_market_reading_before_status_and_membership_density`

PM executed the next BRIEF product/runtime slice after the revised Phase 1 / Phase 2 split. The `/briefing` page now puts the public user's market-reading path before internal status, data-readiness, source/coverage, and membership-roadmap sections.

Completed mainline work:

- Reordered `/briefing` so the visible path starts with market action summary, today's alerts, market breadth, main market signal, 3-minute action judgment, and watch lists.
- Moved public status, data readiness, source/coverage bridge, membership preview, and Beta gate summary after the market-reading loop.
- Kept membership as a Phase 2 roadmap surface only; no login, payment, watchlist persistence, alert execution, or member-only content was opened.
- Updated `scripts/check-briefing-product-first-information-hierarchy.mjs` so future checks guard the product-first order instead of the older status-first order.

Current lane assignments:

- PM mainline: continue Phase 1 public free site readiness; next choose between A3 release smoke/operator checklist and only-needed Home/public density trimming.
- A1 data/source/coverage: continue independently; PM integrates only accepted aggregate-safe outputs and does not promote real data until gates pass.
- A2 public trust copy: keep guarding public pages against internal process residue, live/official/complete-data claims, and investment-advice implications.
- A3 launch engineering: prepare release smoke/operator checklist only when PM decides public readability is stable enough for deployment movement.
- A4 membership MVP: stay planning-only until Phase 1 public Beta is stable; membership remains visible as a later value path.

Checks passed:

- `check:briefing-product-first-information-hierarchy`
- `check:briefing-midpage-readability`
- `check:public-surface-user-facing-audit`
- `check:public-visible-language-quality`
- `check:home-product-first-information-hierarchy`
- `npx tsc --noEmit`

Boundary:

No platform deploy, DNS change, production env mutation, SQL, Supabase read/write, staging rows, `daily_prices` mutation, raw market-data fetch/store/commit, secret output, public source promotion, real score promotion, real-time claim, official endorsement claim, guaranteed-return claim, investment-advice claim, Git backup, or membership implementation occurred.

## 8AT. 2026-06-14 A3 HTTPS Remote Quick-Proof Tooling

CEO decision:

`repair_remote_public_url_quick_proof_before_redeploy_decision`

PM/A3 fixed the route-health tool so it can verify both local `http://localhost:3000` and remote `https://market-signal-two.vercel.app` with the same script.

Completed mainline work:

- Updated `scripts/check-public-beta-core-route-quick-proof.mjs` to use `https` for `https:` base URLs and `http` for `http:` base URLs.
- Added the remote route command to `docs/A3_PHASE_1_RELEASE_CANDIDATE_PUBLIC_SMOKE_REPORT.md`.
- Added the remote route command to `docs/A3_PHASE_1_PUBLIC_BETA_MANUAL_PLATFORM_ACTION_CHECKLIST.md`.
- Updated A3 release/manual-platform checkers to require the remote command.

Current result:

- Local quick-proof returned `status=ok`.
- Remote quick-proof against `https://market-signal-two.vercel.app` returned `status=blocked` because `/membership` is HTTP 404.
- This confirms the public URL is stale relative to the current local candidate.

Current lane assignments:

- PM mainline: avoid further broad public-copy polishing unless a route check fails locally.
- A3 launch engineering: next route is redeploy readiness or explicit deployment-wait record; after redeploy, rerun remote quick-proof plus remote public visible-language and residue cleanup.
- A1/A2/A4: continue safe support lanes, but do not change data posture or implement membership during this A3 deployment freshness issue.

Checks passed:

- `check:a3-phase-1-release-candidate-public-smoke-report`
- `check:a3-phase-1-public-beta-manual-platform-action-checklist`
- local `check:public-beta-core-route-quick-proof`

Known failing external check:

- remote `check:public-beta-core-route-quick-proof` blocks on `/membership: HTTP 404` until Vercel is redeployed or branch/artifact selection is repaired.

Boundary:

No platform deploy, DNS change, production env mutation, SQL, Supabase read/write, staging rows, `daily_prices` mutation, raw market-data fetch/store/commit, secret output, public source promotion, real score promotion, real-time claim, official endorsement claim, guaranteed-return claim, investment-advice claim, Git backup, or membership implementation occurred.

## 8AS. 2026-06-14 A3 Remote Public URL Smoke Observation

CEO decision:

`classify_public_vercel_url_as_stale_until_redeploy`

PM/A3 ran a read-only smoke against the known public URL after local Phase 1 route checks passed. This did not deploy, mutate platform settings, change DNS, or push code.

Observed public URL:

- `https://market-signal-two.vercel.app/`

Result:

- The remote home page returns HTTP 200.
- Remote `/membership` returns 404, while local `/membership` is now part of the current candidate.
- Remote public language checks still find older internal/process wording and stale title/content expectations.
- Local public route checks remain green, so this is a stale deployment gap, not a local code/runtime gap.

Current lane assignments:

- PM mainline: continue local Phase 1 product/runtime readiness only if it improves user value; do not treat remote stale content as local regression.
- A3 launch engineering: next concrete A3 action is Git-backed redeploy or platform redeploy, then rerun remote public smoke.
- A1/A2/A4: continue their existing safe lanes; no data promotion or membership implementation is opened by this remote observation.

Checks / probes:

- `curl.exe -I -L https://market-signal-two.vercel.app/` returned HTTP 200.
- `check:a3-phase-1-release-candidate-public-smoke-report` passed locally.
- Remote `check:public-visible-language-quality` blocked on stale deployed content.
- Remote `check:phase-1-public-beta-public-visible-residue-cleanup` blocked on stale deployed content.

Boundary:

No platform deploy, DNS change, production env mutation, SQL, Supabase read/write, staging rows, `daily_prices` mutation, raw market-data fetch/store/commit, secret output, public source promotion, real score promotion, real-time claim, official endorsement claim, guaranteed-return claim, investment-advice claim, Git backup, or membership implementation occurred.

## 8AR. 2026-06-14 Revised BRIEF Phase Split Confirmation

CEO decision:

`phase_1_public_free_site_first_phase_2_membership_mvp_later`

PM confirmed the chairman's revised `指數燈號網站 BRIEF` and split execution into two phases.

Execution decision:

- Phase 1 is the active mainline: public free index-lighting site usable by every visitor.
- Phase 2 is the membership MVP path: member-only daily three-layer interpretation, watchlist/custom alert conditions, and post-market review.
- Phase 2 planning may continue through A4, but Phase 2 implementation must not block Phase 1 public Beta readiness.
- PM should continue larger coherent public-product slices instead of reopening broad governance unless a concrete launch, repair, source trust, rollback, or membership-boundary decision requires it.

Completed mainline work:

- Rewrote `docs/PUBLIC_BETA_INDEX_DASHBOARD_BRIEF.md` into a clean readable Chinese BRIEF matching the latest chairman direction.
- Rewrote `docs/PHASE_1_PHASE_2_EXECUTION_SPLIT_AND_WORKFLOW_ASSIGNMENT.md` to preserve the Phase 1 / Phase 2 execution split and workstream assignment.
- Updated `scripts/check-phase-1-phase-2-execution-split-and-workflow-assignment.mjs` so the current BRIEF and phase split are mechanically checked without relying on legacy mojibake anchors.
- Tightened Home first-screen public status copy from exact section-name `警示清單` to `警示提醒` so the rendered user-reading order remains product-first: market status first, then the actual alert-list section.

Current lane assignments:

- PM mainline: continue Phase 1 public free site readiness, especially public comprehension, route health, source/update honesty, non-investment-advice trust, and launch candidate clarity.
- A1 data/source/coverage: continue legal free automated source and coverage work independently; no raw market-row fetch, SQL, Supabase write, or real-data promotion is opened by this slice.
- A2 public copy/product safety: continue public copy guard for data-source disclosure, free/member boundary, non-investment-advice, no live/official/complete coverage overclaim.
- A3 launch/production engineering: keep platform, domain, env, monitoring, SEO, analytics, and rollback tasks ready; execute only when PM/CEO opens a concrete launch action.
- A4 membership MVP planning: keep Phase 2 membership IA and MVP scope ready; do not implement login, payment, member-only content, watchlist persistence, alert execution, or post-market report runtime in Phase 1.

Checks passed:

- `check:phase-1-phase-2-execution-split-and-workflow-assignment`
- `check:home-product-first-information-hierarchy`
- `check:home-core-indicator-readout`
- `check:home-briefing-investor-reading-bridge`
- `check:public-visible-language-quality`
- `check:public-beta-core-route-quick-proof`

Boundary:

No SQL, Supabase read/write, staging rows, `daily_prices` mutation, raw market-data fetch/store/commit, source promotion, real score promotion, platform deploy, production env mutation, or membership implementation occurred.

Next PM route:

`phase_1_public_free_site_runtime_comprehension_gap_close`

This route should keep pushing visible Phase 1 user value: make Home, briefing, weekly, stock, methodology, disclaimer, terms, and privacy feel like a user product, not a project console. Phase 2 membership remains a roadmap until the public free site is stable enough.

## 8AS. 2026-06-14 Public Membership Wording Cleanup

CEO decision:

`hide_internal_phase_terms_from_public_pages`

PM executed the next Phase 1 public readability slice. The public website should not show internal planning labels such as `Phase 1`, `Phase 2`, or `Membership MVP` to general visitors. Those terms remain valid in PM/CEO documents and checkers, but public routes now use product language.

Completed mainline work:

- Updated `src/components/public-beta-membership-mvp-roadmap.tsx` so the visible label is `下一階段會員功能`.
- Replaced public roadmap copy that mentioned `Phase 1`, `Phase 2`, `Membership MVP`, or `會員 MVP` with user-facing wording such as `公開 Beta`, `下一階段會員功能`, and `會員版本`.
- Updated `/weekly` public copy so member-only additions are described as `下一階段會員版本`, not an internal Phase 2 route.
- Rewrote `scripts/check-public-visible-language-quality.mjs` with readable Chinese route requirements and public-residue blockers.
- Rewrote `scripts/check-public-beta-membership-mvp-roadmap.mjs` with readable Chinese anchors and a guard against public internal phase wording.

Checks passed:

- `check:public-visible-language-quality`
- `check:public-beta-membership-mvp-roadmap`
- `check:public-beta-core-route-quick-proof`
- `check:phase-1-phase-2-execution-split-and-workflow-assignment`

Current lane assignments:

- PM mainline: continue public route cleanup and runtime comprehension, prioritizing visible user value over internal governance.
- A1 data/source/coverage: continue source and coverage work independently; no real-data promotion is opened.
- A2 public copy/product safety: keep guarding against internal labels, development commands, overclaiming official/live/complete data, and investment-advice implications.
- A3 launch/production engineering: use the readable public language gate as a release smoke requirement.
- A4 membership MVP planning: keep membership architecture in planning documents; public pages should only say next-stage membership features.

Boundary:

No SQL, Supabase read/write, staging rows, `daily_prices` mutation, raw market-data fetch/store/commit, source promotion, real score promotion, platform deploy, production env mutation, or membership implementation occurred.

Next PM route:

`phase_1_public_route_user_value_density_audit`

This route should inspect whether Home, briefing, weekly, and stock pages are still too dense or repetitive for a general investor, then reduce wording only where it improves the 30-second / 3-minute comprehension promise.

## 8AT. 2026-06-14 Weekly Update-Time Readability Tightening

CEO decision:

`make_weekly_update_time_explicit_without_expanding_copy_density`

PM continued the Phase 1 public route comprehension audit. The density scan showed Home, briefing, and stock routes repeat trust-boundary language heavily, but a safer immediate improvement was the weekly route: it had data-status copy without the exact user-facing `資料更新時間` phrase.

Completed mainline work:

- Updated `/weekly` quick-read data reminder to show `資料更新時間：{freshness.asOfDate}`.
- Rewrote `scripts/check-weekly-market-action-summary.mjs` with readable Chinese anchors.
- The weekly checker now verifies rendered `/weekly` contains market-weekly value, 30-second reading, update time, demonstrative-data boundary, non-investment-advice boundary, and risk-disclosure path.
- The weekly checker also blocks public internal phase labels and runtime field names on `/weekly`.

Checks passed:

- `check:weekly-market-action-summary`
- `check:public-visible-language-quality`
- `check:public-beta-core-route-quick-proof`

Current lane assignments:

- PM mainline: continue the public route user-value density audit, prioritizing meaningful compression or clarity over cosmetic wording churn.
- A1 data/source/coverage: continue independent data-source and coverage work; no source promotion is opened.
- A2 public copy/product safety: use the readable public-language gate and weekly checker as baseline for future copy review.
- A3 launch/production engineering: treat weekly rendered-route check as part of public smoke.
- A4 membership MVP planning: no Phase 2 implementation is opened.

Boundary:

No SQL, Supabase read/write, staging rows, `daily_prices` mutation, raw market-data fetch/store/commit, source promotion, real score promotion, platform deploy, production env mutation, or membership implementation occurred.

Next PM route:

`phase_1_home_or_stock_copy_density_trim`

This route should reduce repetition only if a route has repeated boundary text that slows the 30-second / 3-minute comprehension path.

## 8AU. 2026-06-14 Stock Route Public Status Density Trim

CEO decision:

`keep_home_public_status_summary_off_stock_routes`

PM continued the Phase 1 public route density trim. Rendered-route measurement showed stock pages repeated the Home-level public status summary before the stock-specific 30-second readout. The summary is useful on Home, but it slows stock pages because those pages already have stock-specific status, data boundary, update time, and next-step sections.

Completed mainline work:

- Moved `PublicBetaPublicStatusSurface` inside the Home-only rendering path in `src/components/dashboard-shell.tsx`.
- Stock routes now start faster with `StockRuntimeAtAGlance`, `DataFreshnessStrip`, stock context, and source/coverage bridge.
- Rewrote `scripts/check-stock-product-first-runtime-readability.mjs` with readable route assertions.
- The stock readability checker now blocks `目前公開使用狀態` on stock routes and keeps stock-route visible text below the density limit.

Checks passed:

- `check:stock-product-first-runtime-readability`
- `check:home-product-first-information-hierarchy`
- `check:public-visible-language-quality`
- `check:public-beta-core-route-quick-proof`

Current lane assignments:

- PM mainline: continue public product comprehension, with the next high-value target being Home or stock repeated trust-boundary compression only where it improves the reading path.
- A1 data/source/coverage: continue independent source and coverage work; no source promotion is opened.
- A2 public copy/product safety: watch for internal labels and repetitive trust copy returning to public routes.
- A3 launch/production engineering: include stock readability in release smoke.
- A4 membership MVP planning: no Phase 2 implementation is opened.

Boundary:

No SQL, Supabase read/write, staging rows, `daily_prices` mutation, raw market-data fetch/store/commit, source promotion, real score promotion, platform deploy, production env mutation, or membership implementation occurred.

Next PM route:

`phase_1_home_public_copy_density_or_release_smoke_choice`

CEO should choose the next slice based on value: either trim Home repeated boundary wording, or move toward A3 release smoke if public route readability remains green.

## 8N. 2026-06-13 Phase 1 Launch Gap Rollup

CEO decision:

`roll_up_phase_1_launch_gap_without_expanding_phase_2_or_real_data_execution`

PM executed the next BRIEF product/runtime slice after 8M. The project now has a single Phase 1 launch gap rollup that separates what can go public in the free index-lighting site from what belongs to later real-data promotion or Phase 2 membership.

Completed mainline work:

- Added `docs/PUBLIC_BETA_PHASE_1_LAUNCH_GAP_ROLLUP.md`.
- Confirmed Phase 1 public free index-lighting site remains the current delivery target.
- Confirmed Phase 2 membership is a planned path, not a Phase 1 blocker.
- Recommended `GO_WITH_MOCK_ONLY_PUBLIC_BETA` after operator review and post-platform smoke are completed.
- Rejected `HOLD_FOR_REAL_DATA` and `HOLD_FOR_PHASE_2_MEMBERSHIP` as Phase 1 blockers.
- Added `check:public-beta-phase-1-launch-gap-rollup`.
- Registered the new check in the focused review gate.

Current lane assignments:

- PM mainline: next route is `phase_1_public_beta_operator_review_summary`, converting the gap rollup into a chairman/operator-facing summary.
- A1 data/source coverage: continue legal-free automatable source and coverage work independently, aggregate-safe only until a separate executable gate is accepted.
- A2 public trust copy: continue source, coverage, update-time, non-investment-advice, and membership-boundary guard.
- A3 launch operations: prepare operator review, post-platform smoke, and rollback reporting without executing platform changes from this slice.
- A4 membership MVP planning: remain planning-only until Phase 1 launch readiness is stable enough to open Phase 2 implementation.

Boundary:

No SQL, Supabase write, staging rows, `daily_prices` mutation, raw market-data fetch/store/commit, public source promotion, real score promotion, membership implementation, platform deploy, DNS change, or production env mutation occurred.

## 8P. 2026-06-13 Phase 1 Post-Operator Smoke Packet

CEO decision:

`prepare_post_operator_smoke_record_before_public_beta_keep_open_decision`

PM executed the next route after 8O. The project now has a PM-facing post-operator smoke packet that can be filled after a future platform/operator action.

Completed mainline work:

- Added `docs/PHASE_1_PUBLIC_BETA_POST_OPERATOR_SMOKE_PACKET.md`.
- Converted the operator summary into a concrete post-action evidence record.
- Added route smoke rows for `/`, `/briefing`, `/weekly`, `/methodology`, `/disclaimer`, `/terms`, `/privacy`, `/stocks/TWII`, `/stocks/2330`, `/stocks/0050`, `/robots.txt`, and `/sitemap.xml`.
- Added public claim smoke checks for internal residue, source/coverage wording, mock/formal-data boundary, non-advice wording, and forbidden public claims.
- Added PM/A1/A2/A3/A4 post-operator outcome rows.
- Added decision outcomes: `KEEP_OPEN_WITH_DEFERRALS`, `REPAIR_THEN_RECHECK`, and `ROLLBACK_OR_NO_GO`.
- Added `check:phase-1-public-beta-post-operator-smoke-packet`.
- Registered the new check in the focused review gate.

Current lane assignments:

- PM mainline: next route is `phase_1_public_beta_keep_open_or_repair_decision`, which should use the filled smoke packet to decide keep-open, repair, or rollback/no-go.
- A1 data/source coverage: confirm no real-data promotion happened and continue source/coverage separately.
- A2 public trust copy: confirm deployed public copy remains neutral, non-advice, and honest about mock/formal-data boundaries.
- A3 launch operations: fill route smoke, rollback readiness, monitoring cadence, and repair owner after operator action.
- A4 membership MVP planning: confirm Phase 2 membership remains deferred and non-blocking.

Boundary:

No platform deploy, DNS change, production env mutation, SQL, Supabase write, staging rows, `daily_prices` mutation, raw market-data fetch/store/commit, secret output, public source promotion, real score promotion, or membership implementation occurred.

## 8Q. 2026-06-13 Phase 1 Keep-Open Or Repair Decision

CEO decision:

`keep_open_repair_or_no_go_after_post_operator_smoke`

PM executed the next route after 8P. The project now has a decision model for turning a filled post-operator smoke packet into `KEEP_OPEN_WITH_DEFERRALS`, `REPAIR_THEN_RECHECK`, or `ROLLBACK_OR_NO_GO`.

Completed mainline work:

- Added `docs/PHASE_1_PUBLIC_BETA_KEEP_OPEN_OR_REPAIR_DECISION.md`.
- Defined the decision matrix for public route smoke, public claim smoke, rollback availability, and hard stop lines.
- Listed accepted deferrals that do not block Phase 1 keep-open.
- Defined a narrow repair loop with PM/A1/A2/A3 ownership.
- Added `check:phase-1-public-beta-keep-open-or-repair-decision`.
- Registered the new check in the focused review gate.

Current lane assignments:

- PM mainline: next route is `phase_1_public_beta_public_status_surface_alignment`, aligning public-facing status surfaces with the keep-open/repair/no-go decision model.
- A1 data/source coverage: continue source and coverage work outside the public Beta keep-open path.
- A2 public trust copy: ensure public status surfaces do not read as investment advice, live-data claims, complete-coverage claims, or official endorsement.
- A3 launch operations: own smoke evidence, rollback readiness, monitoring cadence, and repair owner after operator action.
- A4 membership MVP planning: remain deferred until Phase 1 public Beta is stable.

Boundary:

No platform deploy, DNS change, production env mutation, SQL, Supabase write, staging rows, `daily_prices` mutation, raw market-data fetch/store/commit, secret output, public source promotion, real score promotion, or membership implementation occurred.

## 8R. 2026-06-13 Phase 1 Public Status Surface Alignment

CEO decision:

`align_public_status_surfaces_with_keep_open_repair_model`

PM executed the next route after 8Q. The public pages now have a user-facing status surface that translates the internal keep-open/repair model into plain investor language instead of exposing launch-operation terms.

Completed mainline work:

- Added `src/lib/public-beta-public-status-surface.ts`.
- Added `src/components/public-beta-public-status-surface.tsx`.
- Mounted the status surface on Home and stock routes through `DashboardShell`.
- Mounted the status surface on `/briefing`.
- Added mobile layout coverage for the new surface.
- Added `check:phase-1-public-beta-public-status-surface-alignment`.
- Registered the new check in the focused review gate.

Current lane assignments:

- PM mainline: next route is `phase_1_public_beta_public_visible_residue_cleanup`, removing remaining user-visible development residue and old internal launch language from public pages.
- A1 data/source coverage: continue legal-free automated-source and coverage work; keep outputs aggregate-safe until PM accepts a promotion gate.
- A2 public trust copy: verify the public surface remains neutral, clear about demonstrative data, and free of investment-advice or guaranteed-return language.
- A3 launch operations: keep release packets and smoke evidence ready, but do not expose operator language on public pages.
- A4 membership MVP planning: keep membership as Phase 2; do not implement member-only content during Phase 1 public surface cleanup.

Boundary:

No platform deploy, DNS change, production env mutation, SQL, Supabase write, staging rows, `daily_prices` mutation, raw market-data fetch/store/commit, secret output, public source promotion, real score promotion, or membership implementation occurred.

## 8S. 2026-06-13 Phase 1 Public Visible Residue Cleanup Gate

CEO decision:

`lock_public_routes_against_development_residue_before_release_candidate_smoke`

PM executed the next route after 8R. The public routes now have a focused visible-residue gate that checks what users actually see, rather than over-counting internal docs, CSS class names, or non-public implementation artifacts.

Completed mainline work:

- Added `scripts/check-phase-1-public-beta-public-visible-residue-cleanup.mjs`.
- Registered `check:phase-1-public-beta-public-visible-residue-cleanup`.
- Added the gate to the focused review gate.
- Checked 13 public routes: `/`, `/briefing`, `/weekly`, `/methodology`, `/disclaimer`, `/terms`, `/privacy`, `/stocks/TWII`, `/stocks/2330`, `/stocks/0050`, `/stocks/006208`, `/stocks/2382`, and `/stocks/2308`.
- Guarded against visible command snippets, hard blockers, request blocks, external reply paths, operator/packet wording, platform placeholders, internal source fields, raw-payload/database terms, role labels, and mojibake markers.
- Confirmed all checked routes currently pass with required public signals and no visible development residue.

Current lane assignments:

- PM mainline: next route is `phase_1_public_beta_release_candidate_public_smoke_report_alignment`, tying the cleaned public surface to A3 release-candidate smoke evidence.
- A1 data/source coverage: continue legal-free automated-source and coverage work outside the public visible-residue gate.
- A2 public trust copy: continue watching the public routes for neutral, non-advice, non-guaranteed-return language.
- A3 launch operations: use this gate as one required input before any future public Beta release-candidate smoke report.
- A4 membership MVP planning: keep Phase 2 membership planned but not implemented in Phase 1.

Boundary:

No platform deploy, DNS change, production env mutation, SQL, Supabase write, staging rows, `daily_prices` mutation, raw market-data fetch/store/commit, secret output, public source promotion, real score promotion, or membership implementation occurred.

## 8T. 2026-06-13 Phase 1 Release-Candidate Public Smoke Alignment

CEO decision:

`attach_public_visible_residue_gate_to_a3_release_candidate_smoke_chain`

PM executed the next route after 8S. The cleaned public surface is now tied into A3 release-candidate launch evidence, so a future Phase 1 public Beta GO decision must include the public visible residue cleanup gate.

Completed mainline work:

- Updated `docs/A3_PHASE_1_RELEASE_CANDIDATE_PUBLIC_SMOKE_REPORT.md`.
- Updated `scripts/check-a3-phase-1-release-candidate-public-smoke-report.mjs`.
- Updated `docs/A3_PHASE_1_PUBLIC_BETA_RELEASE_OPS_INDEX.md`.
- Updated `scripts/check-a3-phase-1-public-beta-release-ops-index.mjs`.
- Updated `docs/A3_PHASE_1_PUBLIC_BETA_RELEASE_GO_NO_GO_PACKET.md`.
- Updated `scripts/check-a3-phase-1-public-beta-release-go-no-go-packet.mjs`.
- Required `cmd.exe /c npm run check:phase-1-public-beta-public-visible-residue-cleanup` before a future deploy or GO/GO_WITH_DEFERRALS decision.
- Confirmed A3 release-candidate smoke report, release ops index, and release go/no-go packet checks pass.

Current lane assignments:

- PM mainline: next route is `phase_1_public_beta_chairman_review_packet_residue_gate_alignment`, making the chairman-facing packet reflect the same public visible residue requirement.
- A1 data/source coverage: continue source and coverage evidence outside the A3 deployment chain.
- A2 public trust copy: keep visible public wording free of advice, guaranteed-return, official-endorsement, and real-time/complete-data claims.
- A3 launch operations: treat public visible residue cleanup as a required pre-deploy and GO/GO_WITH_DEFERRALS input.
- A4 membership MVP planning: remain Phase 2 and do not block Phase 1 public Beta launch decision.

Boundary:

No platform deploy, DNS change, production env mutation, SQL, Supabase write, staging rows, `daily_prices` mutation, raw market-data fetch/store/commit, secret output, public source promotion, real score promotion, or membership implementation occurred.

## 8U. 2026-06-13 Phase 1 Chairman Review Packet Residue-Gate Alignment

CEO decision:

`phase_1_public_beta_chairman_review_packet_requires_public_visible_residue_cleanup`

PM executed the next route after 8T. The Phase 1 public Beta review chain now carries the same public visible residue cleanup requirement into the chairman-facing decision packet. This keeps the release decision aligned with the revised BRIEF: Phase 1 launches as a clean public free index-lighting site; Phase 2 membership remains planned but non-blocking.

Completed mainline work:

- Updated `docs/A3_PHASE_1_PUBLIC_BETA_CHAIRMAN_REVIEW_PACKET.md`.
- Updated `scripts/check-a3-phase-1-public-beta-chairman-review-packet.mjs`.
- Required `cmd.exe /c npm run check:phase-1-public-beta-public-visible-residue-cleanup` as chairman-review evidence before `GO` or `GO_WITH_DEFERRALS`.
- Added chairman acceptance wording for public visible residue cleanup as required pre-release evidence.
- Confirmed `check:a3-phase-1-public-beta-chairman-review-packet` passes.

Current lane assignments:

- PM mainline: next route is `phase_1_public_beta_manual_platform_action_checklist_residue_gate_alignment_or_operator_packet_refresh`.
- A1 data/source coverage: continue legal-free automated-source and coverage work outside the release decision packet.
- A2 public trust copy: keep public wording neutral, non-advice, non-guaranteed, and clear about data/source boundaries.
- A3 launch operations: treat public visible residue cleanup as a required evidence item in the manual platform action path and post-action smoke packet.
- A4 membership MVP planning: remain Phase 2; do not implement member-only content, login, watchlist, or custom alerts until Phase 1 public launch readiness is stable.

Boundary:

No platform deploy, DNS change, production env mutation, SQL, Supabase write, staging rows, `daily_prices` mutation, raw market-data fetch/store/commit, secret output, public source promotion, real score promotion, or membership implementation occurred.

## 8V. 2026-06-13 Phase 1 Manual Platform Checklist Residue-Gate Alignment

CEO decision:

`phase_1_public_beta_manual_platform_action_checklist_requires_public_visible_residue_cleanup`

PM executed the next route after 8U. The future manual Vercel/platform action checklist now uses the same public visible residue cleanup gate as the chairman packet, release-candidate smoke report, release ops index, and go/no-go packet. This keeps Phase 1 launch operations focused on a clean public free site before any Phase 2 membership work.

Completed mainline work:

- Updated `docs/A3_PHASE_1_PUBLIC_BETA_MANUAL_PLATFORM_ACTION_CHECKLIST.md`.
- Updated `scripts/check-a3-phase-1-public-beta-manual-platform-action-checklist.mjs`.
- Added `cmd.exe /c npm run check:phase-1-public-beta-public-visible-residue-cleanup` to pre-platform local evidence.
- Required the operator to confirm no development residue appears on public routes before deploy.
- Added development residue to post-deploy public claim smoke.
- Confirmed `check:a3-phase-1-public-beta-manual-platform-action-checklist`, `check:phase-1-public-beta-public-visible-residue-cleanup`, and TypeScript pass.

Current lane assignments:

- PM mainline: next route is `phase_1_public_beta_post_platform_action_report_residue_gate_alignment`.
- A1 data/source coverage: continue legal-free automated-source and coverage work independently; no raw market-row fetch or data write is opened by this slice.
- A2 public trust copy: verify post-action report language stays neutral, non-advice, and clear about source/update boundaries.
- A3 launch operations: propagate the public visible residue cleanup requirement into the post-platform action report and keep-open/repair loop.
- A4 membership MVP planning: remain Phase 2; do not implement login, member-only content, watchlist, alerts, or payment in this Phase 1 launch-ops chain.

Boundary:

No platform deploy, DNS change, production env mutation, SQL, Supabase write, staging rows, `daily_prices` mutation, raw market-data fetch/store/commit, secret output, public source promotion, real score promotion, or membership implementation occurred.

## 8W. 2026-06-13 Phase 1 Post-Platform Action Report Residue-Gate Alignment

CEO decision:

`phase_1_public_beta_post_platform_action_report_requires_public_visible_residue_cleanup`

PM executed the next route after 8V. The future post-platform action report now records public visible residue cleanup before action and verifies no development residue is visible after action. This closes the same quality loop across chairman review, pre-platform checklist, and post-platform reporting.

Completed mainline work:

- Updated `docs/A3_PHASE_1_PUBLIC_BETA_POST_PLATFORM_ACTION_REPORT_TEMPLATE.md`.
- Updated `scripts/check-a3-phase-1-public-beta-post-platform-action-report-template.mjs`.
- Added `Public visible residue cleanup` to pre-action evidence.
- Added `no development residue visible` to public claim smoke.
- Confirmed `check:a3-phase-1-public-beta-post-platform-action-report-template`, `check:a3-phase-1-public-beta-manual-platform-action-checklist`, and TypeScript pass.

Current lane assignments:

- PM mainline: next route is `phase_1_public_beta_monitoring_and_repair_runbook_residue_gate_alignment`.
- A1 data/source coverage: continue legal-free automated-source and coverage work independently; do not open raw-row fetch or Supabase write from this product/runtime chain.
- A2 public trust copy: keep post-platform and monitoring language neutral, non-advice, and explicit about data/source boundaries.
- A3 launch operations: propagate the public visible residue cleanup requirement into monitoring, repair, and keep-open/repair decisions.
- A4 membership MVP planning: remain Phase 2 and non-blocking for Phase 1 public Beta.

Boundary:

No platform deploy, DNS change, production env mutation, SQL, Supabase write, staging rows, `daily_prices` mutation, raw market-data fetch/store/commit, secret output, public source promotion, real score promotion, or membership implementation occurred.

## 8X. 2026-06-13 Phase 1 Monitoring And Repair Runbook Residue-Gate Alignment

CEO decision:

`phase_1_public_beta_monitoring_and_repair_runbook_requires_public_visible_residue_cleanup`

PM executed the next route after 8W. The Beta monitoring and repair runbook now treats public visible residue cleanup as an ongoing operational guard, not only a pre-release check. This supports the revised BRIEF by protecting the public free site after launch while keeping Phase 2 membership deferred.

Completed mainline work:

- Updated `docs/A3_PHASE_1_PUBLIC_BETA_MONITORING_AND_REPAIR_RUNBOOK.md`.
- Updated `scripts/check-a3-phase-1-public-beta-monitoring-and-repair-runbook.mjs`.
- Added public visible residue cleanup to the business-day Beta monitoring cadence.
- Added development residue to A2 copy regression triage.
- Added visible development residue that harms trust as a P0 repair condition.
- Added `cmd.exe /c npm run check:phase-1-public-beta-public-visible-residue-cleanup` to copy/public-route repair checks.
- Confirmed `check:a3-phase-1-public-beta-monitoring-and-repair-runbook`, `check:phase-1-public-beta-public-visible-residue-cleanup`, and TypeScript pass.

Current lane assignments:

- PM mainline: next route is `phase_1_public_beta_release_ops_index_residue_gate_alignment_and_phase_2_deferred_visibility`.
- A1 data/source coverage: continue legal-free automated-source and coverage work independently; no raw market-row fetch or data write is opened by this slice.
- A2 public trust copy: own copy regression triage for non-advice, non-guarantee, source/update, and visible development-residue issues.
- A3 launch operations: keep release ops index aligned with chairman review, manual platform action, post-platform report, monitoring, repair, and rollback artifacts.
- A4 membership MVP planning: remain Phase 2 and non-blocking until Phase 1 public Beta is stable.

Boundary:

No platform deploy, DNS change, production env mutation, SQL, Supabase write, staging rows, `daily_prices` mutation, raw market-data fetch/store/commit, secret output, public source promotion, real score promotion, or membership implementation occurred.

## 8Y. 2026-06-13 Phase 1 Release Ops And Keep-Open Decision Residue-Gate Alignment

CEO decision:

`phase_1_public_beta_release_ops_and_keep_open_decision_require_public_visible_residue_cleanup`

PM executed the next route after 8X. The public visible residue cleanup gate now reaches the A3 release ops index and the keep-open/repair decision, so it is guarded before release review, before platform action, after platform action, during monitoring, and in the keep-open/repair/no-go decision.

Completed mainline work:

- Updated `docs/A3_PHASE_1_PUBLIC_BETA_RELEASE_OPS_INDEX.md`.
- Updated `scripts/check-a3-phase-1-public-beta-release-ops-index.mjs`.
- Updated `docs/PHASE_1_PUBLIC_BETA_KEEP_OPEN_OR_REPAIR_DECISION.md`.
- Updated `scripts/check-phase-1-public-beta-keep-open-or-repair-decision.mjs`.
- Added public visible residue cleanup as an A3 readiness area.
- Required confirming public visible residue cleanup before and after platform action.
- Required public visible residue cleanup before `KEEP_OPEN_WITH_DEFERRALS`.
- Treated development residue that harms public trust as `ROLLBACK_OR_NO_GO`.
- Confirmed `check:a3-phase-1-public-beta-release-ops-index`, `check:phase-1-public-beta-keep-open-or-repair-decision`, `check:a3-phase-1-public-beta-monitoring-and-repair-runbook`, and TypeScript pass.

Current lane assignments:

- PM mainline: next route is `phase_1_public_beta_release_review_summary_for_chairman`.
- A1 data/source coverage: continue legal-free automated-source and coverage work independently; no raw-row fetch or Supabase write is opened by this release-ops slice.
- A2 public trust copy: keep release-review and keep-open language neutral, non-advice, and clear about mock/formal-data boundaries.
- A3 launch operations: prepare a concise chairman/operator release review summary from the aligned A3 artifact chain.
- A4 membership MVP planning: remain Phase 2 and non-blocking; membership implementation begins only after Phase 1 public Beta readiness is stable.

Boundary:

No platform deploy, DNS change, production env mutation, SQL, Supabase write, staging rows, `daily_prices` mutation, raw market-data fetch/store/commit, secret output, public source promotion, real score promotion, or membership implementation occurred.

## 8Z. 2026-06-13 Phase 1 Release Review Summary For Chairman

CEO decision:

`GO_WITH_DEFERRALS_TO_OPERATOR_REVIEW`

PM executed the next route after 8Y. The project now has a concise chairman-facing release review summary that converts the revised BRIEF into a decision page: Phase 1 can move toward public free, mock-only Beta operator review; Phase 2 membership remains planned but non-blocking; real-data promotion remains deferred.

Completed mainline work:

- Added `docs/A3_PHASE_1_PUBLIC_BETA_RELEASE_REVIEW_SUMMARY_FOR_CHAIRMAN.md`.
- Added `scripts/check-a3-phase-1-public-beta-release-review-summary-for-chairman.mjs`.
- Registered `check:a3-phase-1-public-beta-release-review-summary-for-chairman` in `package.json`.
- Registered the new checker in the focused review gate.
- Summary includes Phase 1/Phase 2 split, what is ready, what still requires operator action, accepted deferrals, hard stop lines, and chairman decision options.
- Confirmed `check:a3-phase-1-public-beta-release-review-summary-for-chairman`, `check:a3-phase-1-public-beta-release-ops-index`, `check:phase-1-public-beta-keep-open-or-repair-decision`, and TypeScript pass.

Current lane assignments:

- PM mainline: next route is `phase_1_public_beta_chairman_or_operator_decision_record`.
- A1 data/source coverage: continue legal-free automated-source and coverage work independently; no raw-row fetch or Supabase write is opened by this release review.
- A2 public trust copy: review the chairman summary for non-advice, non-guarantee, source/update, and free/member boundary clarity.
- A3 launch operations: prepare the decision record that captures `GO`, `GO_WITH_DEFERRALS`, or `NO_GO` before any manual platform action.
- A4 membership MVP planning: remain Phase 2 and non-blocking until Phase 1 public Beta operator review is accepted.

Boundary:

No platform deploy, DNS change, production env mutation, SQL, Supabase write, staging rows, `daily_prices` mutation, raw market-data fetch/store/commit, secret output, public source promotion, real score promotion, or membership implementation occurred.

## 8AA. 2026-06-13 Phase 1 Chairman Operator Decision Record

CEO decision:

`phase_1_public_beta_chairman_operator_decision_record_ready`

PM executed the next route after 8Z. The release review summary now has a concrete decision-record artifact, so chairman/operator acceptance can be captured as `GO`, `GO_WITH_DEFERRALS`, or `NO_GO` before any manual platform action.

Completed mainline work:

- Added `docs/A3_PHASE_1_PUBLIC_BETA_CHAIRMAN_OPERATOR_DECISION_RECORD.md`.
- Added `scripts/check-a3-phase-1-public-beta-chairman-operator-decision-record.mjs`.
- Registered `check:a3-phase-1-public-beta-chairman-operator-decision-record` in `package.json`.
- Registered the new checker in the focused review gate.
- Decision record captures `decisionId`, `decisionTimestamp`, `decisionOwner`, `decision`, accepted deferrals, hard blockers, operator action allowance, and next route.
- Accepted `GO` / `GO_WITH_DEFERRALS` decisions route to the no-secret manual platform action checklist; `NO_GO` routes to narrow repair.
- Confirmed `check:a3-phase-1-public-beta-chairman-operator-decision-record`, `check:a3-phase-1-public-beta-release-review-summary-for-chairman`, and TypeScript pass.

Current lane assignments:

- PM mainline: next route is `operator_follows_phase_1_public_beta_manual_platform_action_checklist_or_pm_repairs_blocker`.
- A1 data/source coverage: continue legal-free automated-source and coverage work independently; no raw-row fetch or Supabase write is opened by this decision record.
- A2 public trust copy: review decision language for non-advice, non-guarantee, source/update, and free/member boundary clarity.
- A3 launch operations: if decision is accepted, follow the manual platform action checklist outside this repo; if rejected, coordinate narrow repair route.
- A4 membership MVP planning: remain Phase 2 and non-blocking until Phase 1 public Beta operator review is accepted.

Boundary:

No platform deploy, DNS change, production env mutation, SQL, Supabase write, staging rows, `daily_prices` mutation, raw market-data fetch/store/commit, secret output, public source promotion, real score promotion, or membership implementation occurred.

## 8AB. 2026-06-13 Phase 1 Operator Execution Path Runbook

CEO decision:

`phase_1_public_beta_operator_execution_path_runbook_ready`

PM executed the next route after 8AA. The A3 launch chain now has a concrete path after the chairman/operator decision record is filled: accepted decisions go to the no-secret manual platform action checklist, while rejected decisions open a narrow repair route.

Completed mainline work:

- Added `docs/A3_PHASE_1_PUBLIC_BETA_OPERATOR_EXECUTION_PATH_RUNBOOK.md`.
- Added `scripts/check-a3-phase-1-public-beta-operator-execution-path-runbook.mjs`.
- Registered `check:a3-phase-1-public-beta-operator-execution-path-runbook` in `package.json`.
- Registered the new checker in the focused review gate.
- Defined accepted route for `GO` and `GO_WITH_DEFERRALS`.
- Defined rejected route for `NO_GO`.
- Added minimum repair checks by blocker type.
- Confirmed `check:a3-phase-1-public-beta-operator-execution-path-runbook`, `check:a3-phase-1-public-beta-chairman-operator-decision-record`, `check:a3-phase-1-public-beta-manual-platform-action-checklist`, and TypeScript pass.

Current lane assignments:

- PM mainline: next route is `phase_1_public_beta_operator_action_or_repair_execution_result`.
- A1 data/source coverage: continue legal-free automated-source and coverage work independently; no raw-row fetch or Supabase write is opened by this operator path.
- A2 public trust copy: support repair route if blocker is public wording, trust/legal, source/update wording, or free/member boundary.
- A3 launch operations: if accepted, guide the human/operator through the no-secret checklist; if rejected, own platform/readiness repair tasks.
- A4 membership MVP planning: remain Phase 2 and non-blocking until Phase 1 public Beta operator path is accepted and stable.

Boundary:

No platform deploy, DNS change, production env mutation, SQL, Supabase write, staging rows, `daily_prices` mutation, raw market-data fetch/store/commit, secret output, public source promotion, real score promotion, or membership implementation occurred.

## 8AC. 2026-06-13 Phase 1 Operator Action Or Repair Result Template

CEO decision:

`phase_1_public_beta_operator_action_or_repair_result_ready`

PM executed the next route after 8AB. The A3 launch chain now has a result template for either accepted operator/platform-action outcomes or rejected-route repair outcomes. This keeps the Phase 1 public Beta path auditable after the operator execution path is used.

Completed mainline work:

- Added `docs/A3_PHASE_1_PUBLIC_BETA_OPERATOR_ACTION_OR_REPAIR_RESULT.md`.
- Added `scripts/check-a3-phase-1-public-beta-operator-action-or-repair-result.mjs`.
- Registered `check:a3-phase-1-public-beta-operator-action-or-repair-result` in `package.json`.
- Registered the new checker in the focused review gate.
- Template records accepted-path route smoke, public claim smoke, public visible residue cleanup, rollback need, and keep-open decision.
- Template records rejected-path blocker count, repair owner, repair scope, recheck commands, and decision-record reopen status.
- Confirmed `check:a3-phase-1-public-beta-operator-action-or-repair-result`, `check:a3-phase-1-public-beta-operator-execution-path-runbook`, `check:phase-1-public-beta-keep-open-or-repair-decision`, and TypeScript pass.

Current lane assignments:

- PM mainline: next route is `phase_1_public_beta_keep_open_repair_or_no_go_result_rollup`.
- A1 data/source coverage: continue legal-free automated-source and coverage work independently; no raw-row fetch or Supabase write is opened by this result template.
- A2 public trust copy: support claim-smoke and repair-result wording when the result touches trust/legal, source/update, or free/member boundaries.
- A3 launch operations: use this result template after any accepted operator action or rejected-route repair.
- A4 membership MVP planning: remain Phase 2 and non-blocking until Phase 1 public Beta keep-open/repair status is stable.

Boundary:

No platform deploy, DNS change, production env mutation, SQL, Supabase write, staging rows, `daily_prices` mutation, raw market-data fetch/store/commit, secret output, public source promotion, real score promotion, or membership implementation occurred.

## 8AD. 2026-06-13 Phase 1 Keep-Open Repair Or No-Go Result Rollup

CEO decision:

`phase_1_public_beta_keep_open_repair_or_no_go_result_rollup_ready`

PM executed the next route after 8AC. The A3 launch chain now has a final result rollup that turns an operator action or repair result into one of four states: keep open with deferrals, repair and recheck, rollback/no-go, or not run.

Completed mainline work:

- Added `docs/A3_PHASE_1_PUBLIC_BETA_KEEP_OPEN_REPAIR_OR_NO_GO_RESULT_ROLLUP.md`.
- Added `scripts/check-a3-phase-1-public-beta-keep-open-repair-or-no-go-result-rollup.mjs`.
- Registered `check:a3-phase-1-public-beta-keep-open-repair-or-no-go-result-rollup` in `package.json`.
- Registered the new checker in the focused review gate.
- Rollup records route smoke, public claim smoke, public visible residue cleanup, mock/source/update/non-advice boundaries, accepted deferrals, rollback path, and remaining hard blockers.
- Rollup assigns PM/A1/A2/A3/A4 follow-up actions for keep-open, repair, and rollback/no-go states.
- Confirmed `check:a3-phase-1-public-beta-keep-open-repair-or-no-go-result-rollup`, `check:a3-phase-1-public-beta-operator-action-or-repair-result`, `check:a3-phase-1-public-beta-monitoring-and-repair-runbook`, `check:pm-brief-runtime-mainline-goal-and-workstreams`, and TypeScript pass.

Current lane assignments:

- PM mainline: next route is `phase_1_public_beta_pre_operator_or_keep_open_status_dashboard_alignment`.
- A1 data/source coverage: continue legal-free automated-source and coverage work independently; no raw-row fetch or Supabase write is opened by this rollup.
- A2 public trust copy: ensure public/PM status wording remains neutral, non-advice, and clear about source/update and free/member boundaries.
- A3 launch operations: use the rollup to drive keep-open, repair, rollback, or no-go reporting after any future operator action.
- A4 membership MVP planning: remain Phase 2 and non-blocking until Phase 1 public Beta keep-open/repair/no-go status is stable.

Boundary:

No platform deploy, DNS change, production env mutation, SQL, Supabase write, staging rows, `daily_prices` mutation, raw market-data fetch/store/commit, secret output, public source promotion, real score promotion, or membership implementation occurred.

## 8AE. 2026-06-13 Phase 1 / Phase 2 Execution Split And Workflow Assignment

CEO decision:

`phase_1_phase_2_execution_split_ready`

PM executed the revised BRIEF alignment slice. The project now has one explicit execution-split artifact that says Phase 1 is the public free index-lighting site and Phase 2 is the membership MVP path. This prevents member-only content, login, watchlist, alerts, payment, and real-data promotion from slowing the Phase 1 public Beta path.

Completed mainline work:

- Added `docs/PHASE_1_PHASE_2_EXECUTION_SPLIT_AND_WORKFLOW_ASSIGNMENT.md`.
- Added `scripts/check-phase-1-phase-2-execution-split-and-workflow-assignment.mjs`.
- Registered `check:phase-1-phase-2-execution-split-and-workflow-assignment` in `package.json`.
- Registered the new checker in the focused review gate.
- Confirmed the split against `docs/PUBLIC_BETA_INDEX_DASHBOARD_BRIEF.md`, this PM workstream record, and `docs/A4_MEMBERSHIP_MVP_PLANNING_HANDOFF.md`.
- Confirmed public visible residue cleanup, PM BRIEF workstreams, A3 keep-open/repair/no-go rollup, and TypeScript still pass.

Current lane assignments:

- PM mainline: continue `phase_1_public_beta_pre_operator_or_keep_open_status_dashboard_alignment`.
- A1 data/source/coverage: continue legal free automated-source and coverage readiness in parallel; no raw market-row fetch or Supabase write is opened by this slice.
- A2 public copy/product safety: guard public wording, source/update disclosure, free/member boundary, and non-investment-advice posture.
- A3 launch/production engineering: keep the operator path, smoke checks, monitoring, and rollback artifacts ready.
- A4 membership MVP planning: remain Phase 2 planning-only until Phase 1 public Beta readiness is stable.

Acceleration rule:

Use larger coherent slices when work is alignment or cleanup. Add new governance only when it unlocks public route readiness, source/data trust, launch operator action, rollback/repair decision, membership boundary clarity, or removal of stale internal/development residue.

Boundary:

No platform deploy, DNS change, production env mutation, SQL, Supabase write, staging rows, `daily_prices` mutation, raw market-data fetch/store/commit, secret output, public source promotion, real score promotion, real-time claim, official endorsement claim, guaranteed-return claim, investment-advice claim, or membership implementation occurred.

## 8AF. 2026-06-13 Public Status Surface Checker Modernization

CEO decision:

`phase_1_public_beta_public_status_surface_alignment_checker_cleaned`

PM executed the next cleanup slice on the public status surface guard. The public status surface source was already clean Chinese, but its checker still required legacy mojibake phrases. That made the local gate less trustworthy and could have pulled future work back toward stale wording.

Completed mainline work:

- Replaced `scripts/check-phase-1-public-beta-public-status-surface-alignment.mjs` with a clean Phase 1 public-copy checker.
- The checker now requires `?桀??祇?雿輻??, `撣瘞??敹怨?`, `鞈????銴`, `??銝??挾`, demonstrative-data wording, formal-data-source wording, member-deep-reading deferral, and non-investment-advice wording.
- The checker still blocks internal keep-open/repair/no-go strings, operator/smoke/packet wording, source promotion wording, raw payload language, and role labels.
- The checker now detects replacement characters, private-use codepoints, and repeated question-mark mojibake on rendered public surfaces.
- Confirmed `check:phase-1-public-beta-public-status-surface-alignment`, `check:phase-1-public-beta-public-visible-residue-cleanup`, and TypeScript pass.

Current lane assignments:

- PM mainline: continue `phase_1_public_beta_pre_operator_or_keep_open_status_dashboard_alignment`.
- A1 data/source/coverage: continue independently; no raw market-row fetch or Supabase write is opened.
- A2 public copy/product safety: use this modernized checker as the baseline for public status wording.
- A3 launch/production engineering: keep this checker in the pre-operator and keep-open evidence set.
- A4 membership MVP planning: remain Phase 2 planning-only.

Boundary:

No platform deploy, DNS change, production env mutation, SQL, Supabase write, staging rows, `daily_prices` mutation, raw market-data fetch/store/commit, secret output, public source promotion, real score promotion, real-time claim, official endorsement claim, guaranteed-return claim, investment-advice claim, or membership implementation occurred.

## 8AG. 2026-06-13 Phase 1 Pre-Operator Keep-Open Status Dashboard Alignment

CEO decision:

`phase_1_public_beta_pre_operator_keep_open_status_dashboard_alignment_ready`

PM executed the next status-alignment slice after the A3 keep-open/repair/no-go rollup. The project now has a bridge between internal A3 execution states and public-safe status wording, so PM/A3 can reason about keep-open, repair, rollback/no-go, or not-run without exposing those strings on public pages.

Completed mainline work:

- Added `docs/PHASE_1_PUBLIC_BETA_PRE_OPERATOR_KEEP_OPEN_STATUS_DASHBOARD_ALIGNMENT.md`.
- Added `scripts/check-phase-1-public-beta-pre-operator-keep-open-status-dashboard-alignment.mjs`.
- Registered `check:phase-1-public-beta-pre-operator-keep-open-status-dashboard-alignment` in `package.json`.
- Registered the new checker in the focused review gate.
- Mapped `KEEP_OPEN_WITH_DEFERRALS`, `REPAIR_THEN_RECHECK`, `ROLLBACK_OR_NO_GO`, and `NOT_RUN` into public-safe status language.
- Confirmed internal PM/A3 artifacts may keep execution-state names, while public pages must stay user-facing and avoid operator, smoke, packet, SQL/Supabase, raw-payload, role-label, or go/no-go wording.
- Confirmed `check:phase-1-public-beta-pre-operator-keep-open-status-dashboard-alignment`, `check:phase-1-public-beta-public-status-surface-alignment`, `check:phase-1-public-beta-public-visible-residue-cleanup`, `check:a3-phase-1-public-beta-keep-open-repair-or-no-go-result-rollup`, `check:phase-1-phase-2-execution-split-and-workflow-assignment`, `check:pm-brief-runtime-mainline-goal-and-workstreams`, and TypeScript pass.

Current lane assignments:

- PM mainline: next route is `phase_1_public_beta_operator_decision_or_manual_platform_action_readiness_refresh`.
- A1 data/source/coverage: continue independently; no raw market-row fetch, Supabase read/write, or data promotion is opened by this alignment.
- A2 public copy/product safety: use the public message map to guard non-advice, update/source, and free/member boundary language.
- A3 launch/production engineering: use this alignment before operator decision refresh, manual platform action checklist refresh, or keep-open/repair/no-go reporting.
- A4 membership MVP planning: remain Phase 2 planning-only and non-blocking.

Boundary:

No platform deploy, DNS change, production env mutation, SQL, Supabase read/write, staging rows, `daily_prices` mutation, raw market-data fetch/store/commit, secret output, public source promotion, real score promotion, real-time claim, official endorsement claim, guaranteed-return claim, investment-advice claim, or membership implementation occurred.

## 8AH. 2026-06-13 Phase 1 Operator Decision Or Manual Platform Action Readiness Refresh

CEO decision:

`phase_1_public_beta_operator_decision_or_manual_platform_action_readiness_refresh_ready`

PM executed the readiness refresh after the pre-operator status dashboard alignment. The Phase 1 public Beta path now has a routing page for whether PM should request a chairman/operator decision, follow the no-secret manual platform checklist after an accepted decision, repair a bounded blocker first, or hold/no-go when a hard stop line is touched.

Completed mainline work:

- Added `docs/PHASE_1_PUBLIC_BETA_OPERATOR_DECISION_OR_MANUAL_PLATFORM_ACTION_READINESS_REFRESH.md`.
- Added `scripts/check-phase-1-public-beta-operator-decision-or-manual-platform-action-readiness-refresh.mjs`.
- Registered `check:phase-1-public-beta-operator-decision-or-manual-platform-action-readiness-refresh` in `package.json`.
- Registered the new checker in the focused review gate.
- Confirmed the refresh links Phase split, pre-operator status alignment, chairman/operator decision record, manual platform checklist, public status surface alignment, public visible residue cleanup, A3 keep-open/repair/no-go rollup, and PM BRIEF mainline.
- Confirmed `check:phase-1-public-beta-operator-decision-or-manual-platform-action-readiness-refresh`, `check:phase-1-public-beta-pre-operator-keep-open-status-dashboard-alignment`, `check:a3-phase-1-public-beta-chairman-operator-decision-record`, `check:a3-phase-1-public-beta-manual-platform-action-checklist`, `check:phase-1-public-beta-public-visible-residue-cleanup`, `check:phase-1-public-beta-public-status-surface-alignment`, `check:pm-brief-runtime-mainline-goal-and-workstreams`, and TypeScript pass.

Current lane assignments:

- PM mainline: next route is `phase_1_public_beta_chairman_operator_decision_readiness_packet_or_repair`.
- A1 data/source/coverage: continue independently; no raw market-row fetch, Supabase read/write, or data promotion is opened by this refresh.
- A2 public copy/product safety: repair any non-advice, source/update, public status, or free/member boundary issue if the packet finds stale copy.
- A3 launch/production engineering: own the no-secret manual platform action checklist, route smoke shape, monitoring, and rollback evidence.
- A4 membership MVP planning: remain Phase 2 planning-only and non-blocking.

Boundary:

No platform deploy, DNS change, production env mutation, SQL, Supabase read/write, staging rows, `daily_prices` mutation, raw market-data fetch/store/commit, secret output, public source promotion, real score promotion, real-time claim, official endorsement claim, guaranteed-return claim, investment-advice claim, or membership implementation occurred.

## 8AI. 2026-06-13 Phase 1 Chairman Operator Decision Readiness Packet Or Repair

CEO decision:

`phase_1_public_beta_chairman_operator_decision_readiness_packet_or_repair_ready`

PM executed the next BRIEF split slice after the operator decision/manual platform readiness refresh. The revised BRIEF is now treated as two phases: Phase 1 is the public free index-lighting site; Phase 2 membership remains a visible roadmap and planning lane, but not a Phase 1 launch blocker. This slice consolidates the chairman/operator decision path into one packet so PM can route to `GO`, `GO_WITH_DEFERRALS`, `NO_GO`, or `REPAIR_REQUIRED` without adding more scattered governance.

Completed mainline work:

- Added `docs/PHASE_1_PUBLIC_BETA_CHAIRMAN_OPERATOR_DECISION_READINESS_PACKET_OR_REPAIR.md`.
- Added `scripts/check-phase-1-public-beta-chairman-operator-decision-readiness-packet-or-repair.mjs`.
- Registered `check:phase-1-public-beta-chairman-operator-decision-readiness-packet-or-repair` in `package.json`.
- Registered the new checker in the focused review gate.
- Confirmed the packet links Phase split, operator decision readiness refresh, release review summary, chairman review packet, chairman/operator decision record, manual platform checklist, public visible residue cleanup, public status surface alignment, and PM BRIEF mainline.
- Confirmed `check:phase-1-public-beta-chairman-operator-decision-readiness-packet-or-repair`, `check:phase-1-public-beta-operator-decision-or-manual-platform-action-readiness-refresh`, `check:a3-phase-1-public-beta-release-review-summary-for-chairman`, `check:a3-phase-1-public-beta-chairman-review-packet`, `check:a3-phase-1-public-beta-chairman-operator-decision-record`, `check:a3-phase-1-public-beta-manual-platform-action-checklist`, `check:phase-1-public-beta-public-visible-residue-cleanup`, `check:pm-brief-runtime-mainline-goal-and-workstreams`, and TypeScript pass.

Current lane assignments:

- PM mainline: next route is `record_chairman_operator_decision_or_repair_phase_1_public_beta_blocker`.
- A1 data/source/coverage: continue independently; no raw market-row fetch, Supabase read/write, or data promotion is opened by this packet.
- A2 public copy/product safety: repair public wording if the packet detects stale source/update, non-advice, free/member, or internal-residue issues.
- A3 launch/production engineering: own the no-secret manual platform action checklist and post-action smoke/report/rollback evidence after an accepted decision.
- A4 membership MVP planning: remain Phase 2 planning-only and non-blocking until Phase 1 public Beta is stable.

Boundary:

No platform deploy, DNS change, production env mutation, SQL, Supabase read/write, staging rows, `daily_prices` mutation, raw market-data fetch/store/commit, secret output, public source promotion, real score promotion, real-time claim, official endorsement claim, guaranteed-return claim, investment-advice claim, or membership implementation occurred.

## 8AJ. 2026-06-13 Phase 1 Chairman Operator GO_WITH_DEFERRALS Decision Record

CEO decision:

`phase_1_public_beta_chairman_operator_decision_2026_06_13_recorded`

PM executed the next route after 8AI. The Phase 1 public Beta path now has a filled decision instance, not only a decision template. The recorded decision is `GO_WITH_DEFERRALS`: Phase 1 public free index-lighting can proceed toward the no-secret manual platform checklist route, while Phase 2 membership, real-data promotion, full Taiwan all-listed-equity coverage, global expansion, custom domain, paid vendor feeds, and complete source automation remain accepted deferrals.

Completed mainline work:

- Added `docs/PHASE_1_PUBLIC_BETA_CHAIRMAN_OPERATOR_DECISION_2026_06_13.md`.
- Added `scripts/check-phase-1-public-beta-chairman-operator-decision-2026-06-13.mjs`.
- Registered `check:phase-1-public-beta-chairman-operator-decision-2026-06-13` in `package.json`.
- Registered the new checker in the focused review gate.
- Recorded `decisionId=phase1-public-beta-chairman-operator-decision-20260613-1`.
- Recorded `operatorActionAllowed=yes_manual_platform_checklist_only`.
- Preserved `publicDataSource=mock` and `scoreSource=mock`.
- Confirmed `check:phase-1-public-beta-chairman-operator-decision-2026-06-13`, `check:phase-1-public-beta-chairman-operator-decision-readiness-packet-or-repair`, `check:a3-phase-1-public-beta-manual-platform-action-checklist`, `check:phase-1-public-beta-public-visible-residue-cleanup`, and TypeScript pass.

Current lane assignments:

- PM mainline: next route is `prepare_no_secret_manual_platform_action_or_repair_recheck_failure`.
- A1 data/source/coverage: continue data-realization and coverage work independently; no raw fetch, Supabase write, or source promotion is opened by this decision.
- A2 public copy/product safety: guard public pages against real-data, complete-coverage, official-endorsement, personalized-advice, guaranteed-return, or membership-overpromising language.
- A3 launch/production engineering: prepare manual platform action evidence and smoke/rollback packet shape, but do not execute platform deploy inside this repo.
- A4 membership MVP planning: continue Phase 2 plan only; no login, payment, watchlist persistence, alert execution, or member-only content implementation in Phase 1.

Boundary:

No platform deploy, DNS change, production env mutation, SQL, Supabase read/write, staging rows, `daily_prices` mutation, raw market-data fetch/store/commit, secret output, public source promotion, real score promotion, real-time claim, official endorsement claim, guaranteed-return claim, investment-advice claim, or membership implementation occurred.

## 8AK. 2026-06-13 Phase 1 No-Secret Manual Platform Action Readiness

CEO decision:

`phase_1_public_beta_no_secret_manual_platform_action_readiness_ready`

PM executed the next A3 route after 8AJ. The recorded `GO_WITH_DEFERRALS` decision now has a no-secret readiness bridge into the future human/operator hosting-dashboard step. This readiness packet keeps the project moving toward public Beta without allowing the repo to press deploy, change env values, expose secrets, or promote real data.

Completed mainline work:

- Added `docs/PHASE_1_PUBLIC_BETA_NO_SECRET_MANUAL_PLATFORM_ACTION_READINESS.md`.
- Added `scripts/check-phase-1-public-beta-no-secret-manual-platform-action-readiness.mjs`.
- Registered `check:phase-1-public-beta-no-secret-manual-platform-action-readiness` in `package.json`.
- Registered the new checker in the focused review gate.
- Defined which hosting-dashboard items the operator may verify by label or pass/fail only.
- Defined environment presence checks by name only, with no value recording.
- Linked the post-platform action report template and monitoring/repair runbook as the required after-action route.
- Confirmed `check:phase-1-public-beta-no-secret-manual-platform-action-readiness`, `check:phase-1-public-beta-chairman-operator-decision-2026-06-13`, `check:a3-phase-1-public-beta-post-platform-action-report-template`, `check:a3-phase-1-public-beta-monitoring-and-repair-runbook`, and TypeScript pass.

Current lane assignments:

- PM mainline: next route is `operator_uses_no_secret_manual_platform_checklist_or_pm_repairs_recheck_failure`.
- A1 data/source/coverage: continue independently; no raw fetch, Supabase write, source promotion, or scoring promotion is opened.
- A2 public copy/product safety: guard public route wording if any recheck fails due to source/update, non-advice, membership boundary, or residue language.
- A3 launch/production engineering: prepare the human/operator checklist, smoke report, rollback, monitoring, and route-health evidence; actual platform action remains outside the repo.
- A4 membership MVP planning: continue Phase 2 planning only and do not implement membership in Phase 1.

Boundary:

No platform deploy, DNS change, production env mutation, SQL, Supabase read/write, staging rows, `daily_prices` mutation, raw market-data fetch/store/commit, secret output, public source promotion, real score promotion, real-time claim, official endorsement claim, guaranteed-return claim, investment-advice claim, or membership implementation occurred.

## 8AL. 2026-06-13 Phase 1 Operator Safe Reply Template

CEO decision:

`phase_1_public_beta_operator_safe_reply_template_ready`

PM executed the next A3 route after 8AK. The operator now has one safe copy/paste reply block for Vercel or equivalent hosting review. This narrows future human input to labels, pass/fail outcomes, public URL, deployment label, rollback label, route smoke, public-claim smoke, and mock/mock posture, while explicitly blocking secrets and environment values.

Completed mainline work:

- Added `docs/PHASE_1_PUBLIC_BETA_OPERATOR_SAFE_REPLY_TEMPLATE.md`.
- Added `scripts/check-phase-1-public-beta-operator-safe-reply-template.mjs`.
- Registered `check:phase-1-public-beta-operator-safe-reply-template` in `package.json`.
- Registered the new checker in the focused review gate.
- Defined the only allowed operator reply fields.
- Defined forbidden reply content: environment values, API keys, auth tokens, private dashboard URLs, raw payloads, database row payloads, SQL snippets, Supabase row contents, local paths, and screenshots containing values.
- Confirmed `check:phase-1-public-beta-operator-safe-reply-template`, `check:phase-1-public-beta-no-secret-manual-platform-action-readiness`, `check:a3-phase-1-public-beta-post-platform-action-report-template`, `check:a3-phase-1-public-beta-monitoring-and-repair-runbook`, and TypeScript pass.

Current lane assignments:

- PM mainline: next route is `fill_post_platform_action_report_or_repair_failed_smoke`.
- A1 data/source/coverage: continue independently; no source promotion, Supabase write, or raw market fetch is opened.
- A2 public copy/product safety: repair public-claim smoke failures if the safe reply reports misleading source/update, non-advice, complete-coverage, official-endorsement, or membership language.
- A3 launch/production engineering: use the safe reply as intake before filling post-platform action report or routing repair.
- A4 membership MVP planning: remain Phase 2 planning-only and non-blocking.

Boundary:

No platform deploy, DNS change, production env mutation, SQL, Supabase read/write, staging rows, `daily_prices` mutation, raw market-data fetch/store/commit, secret output, public source promotion, real score promotion, real-time claim, official endorsement claim, guaranteed-return claim, investment-advice claim, or membership implementation occurred.

## 8AM. 2026-06-13 Phase 1 Operator Safe Reply PM Intake Recorder

CEO decision:

`phase_1_public_beta_operator_safe_reply_pm_intake_recorder_ready`

PM executed the next A3/PM route after 8AL. The project now has a formal PM intake recorder for a future operator safe reply. This closes the gap between "operator sends safe labels/pass-fail values" and "PM either fills the post-platform action report or routes a bounded repair."

Completed mainline work:

- Added `docs/PHASE_1_PUBLIC_BETA_OPERATOR_SAFE_REPLY_PM_INTAKE_RECORDER.md`.
- Added `scripts/check-phase-1-public-beta-operator-safe-reply-pm-intake-recorder.mjs`.
- Registered `check:phase-1-public-beta-operator-safe-reply-pm-intake-recorder` in `package.json`.
- Registered the new checker in the focused review gate.
- Defined intake statuses: `ACCEPT_FOR_POST_PLATFORM_REPORT`, `REPAIR_REQUIRED`, and `REJECT_UNSAFE_REPLY`.
- Defined repair owners and reasons for route smoke failure, public-claim failure, rollback missing, incomplete reply, unsafe content, wrong decision, wrong data posture, and wrong score posture.
- Confirmed `check:phase-1-public-beta-operator-safe-reply-pm-intake-recorder`, `check:phase-1-public-beta-operator-safe-reply-template`, `check:phase-1-public-beta-no-secret-manual-platform-action-readiness`, `check:a3-phase-1-public-beta-post-platform-action-report-template`, and TypeScript pass.

Current lane assignments:

- PM mainline: next route is `fill_post_platform_action_report_or_repair_failed_operator_intake`.
- A1 data/source/coverage: continue independently; no source promotion, Supabase write, or raw market fetch is opened.
- A2 public copy/product safety: repair public-claim smoke failure, non-advice wording, source/update wording, or member-boundary issues.
- A3 launch/production engineering: repair route smoke, rollback, metadata, platform label, env-presence, or post-platform report issues.
- A4 membership MVP planning: remain Phase 2 planning-only and non-blocking.

Boundary:

No platform deploy, DNS change, production env mutation, SQL, Supabase read/write, staging rows, `daily_prices` mutation, raw market-data fetch/store/commit, secret output, public source promotion, real score promotion, real-time claim, official endorsement claim, guaranteed-return claim, investment-advice claim, or membership implementation occurred.

## 8AN. 2026-06-13 Phase 1 Post-Platform Report Filled Placeholder Or Repair Scaffold

CEO decision:

`phase_1_public_beta_post_platform_report_filled_placeholder_or_repair_scaffold_ready`

PM executed the next route after 8AM. The project now has the bridge between PM intake and the A3 post-platform report: if a future operator safe reply passes intake, PM can fill a no-secret report placeholder; if it fails, PM routes the issue to PM/A2/A3 repair without opening deploy, SQL, Supabase, raw data, real-data promotion, or Phase 2 membership work.

Completed mainline work:

- Added `docs/PHASE_1_PUBLIC_BETA_POST_PLATFORM_REPORT_FILLED_PLACEHOLDER_OR_REPAIR_SCAFFOLD.md`.
- Added `scripts/check-phase-1-public-beta-post-platform-report-filled-placeholder-or-repair-scaffold.mjs`.
- Registered `check:phase-1-public-beta-post-platform-report-filled-placeholder-or-repair-scaffold` in `package.json`.
- Registered the new checker in the focused review gate.
- Defined the accepted report fill route: `READY_TO_FILL_FROM_SAFE_REPLY`.
- Defined repair routing for route smoke failure, public-claim failure, rollback missing, incomplete reply, wrong data posture, wrong score posture, and wrong decision.
- Defined reject routing for unsafe content, including secrets, env values, private URLs, raw payloads, database rows, SQL snippets, Supabase row contents, local paths, and screenshots with private values.
- Confirmed `check:phase-1-public-beta-post-platform-report-filled-placeholder-or-repair-scaffold`, `check:phase-1-public-beta-operator-safe-reply-pm-intake-recorder`, and `check:phase-1-public-beta-operator-safe-reply-template` pass.

Current lane assignments:

- PM mainline: next route is `continue_phase_1_public_beta_monitoring_or_repair_after_report_fill`.
- A1 data/source/coverage: continue independently; no source promotion, Supabase write, SQL, raw market fetch, or row coverage acceptance is opened.
- A2 public copy/product safety: own public-claim smoke repairs when the safe reply indicates misleading source/update, non-advice, complete-coverage, official-endorsement, or membership language.
- A3 launch/production engineering: own route smoke, rollback, metadata, platform label, env-presence, post-platform report, monitoring, and repair-runbook issues.
- A4 membership MVP planning: remain Phase 2 planning-only and non-blocking.

Boundary:

No platform deploy, DNS change, production env mutation, SQL, Supabase read/write, staging rows, `daily_prices` mutation, raw market-data fetch/store/commit, secret output, public source promotion, real score promotion, real-time claim, official endorsement claim, guaranteed-return claim, investment-advice claim, or membership implementation occurred.

## 8AO. 2026-06-13 Phase 1 Post-Report Monitoring Or Repair Decision Loop

CEO decision:

`phase_1_public_beta_post_report_monitoring_or_repair_decision_loop_ready`

PM executed the next route after 8AN. The project now has a PM decision loop for the moment after a future no-secret post-platform report is filled. This keeps Phase 1 public Beta movement practical: either keep open with explicit deferrals, repair and recheck, roll back / no-go, or wait because no operator action/report exists yet.

Completed mainline work:

- Added `docs/PHASE_1_PUBLIC_BETA_POST_REPORT_MONITORING_OR_REPAIR_DECISION_LOOP.md`.
- Added `scripts/check-phase-1-public-beta-post-report-monitoring-or-repair-decision-loop.mjs`.
- Registered `check:phase-1-public-beta-post-report-monitoring-or-repair-decision-loop` in `package.json`.
- Registered the new checker in the focused review gate.
- Defined decision outcomes: `KEEP_OPEN_WITH_DEFERRALS`, `REPAIR_THEN_RECHECK`, `ROLLBACK_OR_NO_GO`, and `NOT_RUN`.
- Defined owner-specific repair queues for PM, A1, A2, A3, and A4.
- Defined the monitoring cadence after a keep-open decision: first 15 minutes, first 60 minutes, first 24 hours, every business day, and weekly CEO/PM review.
- Confirmed `check:phase-1-public-beta-post-report-monitoring-or-repair-decision-loop` and `check:phase-1-phase-2-execution-split-and-workflow-assignment` pass.

Current lane assignments:

- PM mainline: next route is `keep_open_monitoring_cadence_or_repair_then_recheck_phase_1_public_beta`.
- A1 data/source/coverage: keep data promotion and source coverage moving as accepted deferrals unless public copy claims formal data is live.
- A2 public copy/product safety: own public-claim smoke and trust copy repairs.
- A3 launch/production engineering: own route health, rollback, metadata/share, robots/sitemap, monitoring, and repair-runbook issues.
- A4 membership MVP planning: keep Phase 2 membership/watchlist/alert/member content as deferred unless public pages promise availability now.

Boundary:

No platform deploy, DNS change, production env mutation, SQL, Supabase read/write, staging rows, `daily_prices` mutation, raw market-data fetch/store/commit, secret output, public source promotion, real score promotion, real-time claim, official endorsement claim, guaranteed-return claim, investment-advice claim, or membership implementation occurred.

## 8AP. 2026-06-13 Public Beta Membership MVP Roadmap

CEO decision:

`public_beta_membership_mvp_roadmap_ready`

PM moved the revised BRIEF back onto the public product surface. Home and `/briefing` now show a small Phase 2 membership MVP roadmap so visitors can understand the product direction without confusing Phase 2 with the current Phase 1 public Beta.

Completed mainline work:

- Rebuilt `scripts/check-public-visible-language-quality.mjs` with readable BRIEF-aligned required phrases instead of stale mojibake literals.
- The public language gate now scans 13 public routes and 5 internal boundary routes.
- It verifies 30-second / 3-minute product language, demonstrative-data boundaries, non-investment-advice wording, source/update/data-state language, and Phase 2 membership deferral where relevant.
- It blocks visible command snippets, deployment/process residue, internal role labels, local file paths, Supabase/SQL/raw-payload/internal field terms, promotion-gate wording, candidate artifact residue, mojibake markers, and development-progress wording.
- Confirmed `check:public-visible-language-quality`, `check:public-beta-membership-mvp-roadmap`, `check:phase-1-public-beta-public-status-surface-alignment`, and TypeScript pass.

Current lane assignments:

- PM mainline: next route is `continue_phase_1_public_beta_public_surface_cleanup_with_readable_guardrails`.
- A1 data/source/coverage: continue independently on lawful free automated source coverage and aggregate-only handoff; no public surface promotion is opened by this cleanup.
- A2 public trust copy: use the readable gate as the baseline for future public copy review and keep non-investment-advice / demonstrative-data language intact.
- A3 launch/production engineering: include `check:public-visible-language-quality` as required public-route smoke before future manual platform action and post-platform monitoring.
- A4 membership MVP planning: keep membership visible as Phase 2 only; no login, payment, watchlist persistence, alert execution, or member-only content implementation is opened.

Boundary:

No platform deploy, DNS change, production env mutation, SQL, Supabase read/write, staging rows, `daily_prices` mutation, raw market-data fetch/store/commit, secret output, public source promotion, real score promotion, real-time claim, official endorsement claim, guaranteed-return claim, investment-advice claim, or membership implementation occurred.

## 8AQ. 2026-06-13 Public Visible Language Quality Gate Cleanup

CEO decision:

`replace_stale_public_language_checker_mojibake_with_readable_brief_guardrails`

PM executed the next Phase 1 public-surface cleanup slice after the membership roadmap. The rendered public pages were already passing, but the language quality checker itself still contained stale mojibake required phrases. This slice makes the guard readable and maintainable so future public pages cannot regress into development-console wording.

Completed mainline work:

- Added `src/components/public-beta-membership-mvp-roadmap.tsx`.
- Added the roadmap to Home through `src/components/dashboard-shell.tsx`.
- Added the roadmap to `/briefing` through `src/app/briefing/page.tsx`.
- Added responsive styling in `src/app/globals.css`.
- Added `scripts/check-public-beta-membership-mvp-roadmap.mjs`.
- Registered `check:public-beta-membership-mvp-roadmap` in `package.json`.
- Registered the new checker in the focused review gate.
- Confirmed the roadmap shows the three Phase 2 membership MVP tracks: daily three-layer interpretation, watchlist/custom alert conditions, and post-market review.
- Confirmed the roadmap says Phase 1 does not currently provide member login, payment, watchlist storage, alert execution, or member-only content.

Current lane assignments:

- PM mainline: next route is `continue_phase_1_public_beta_value_loop_with_phase_2_membership_path_visible_but_deferred`.
- A1 data/source/coverage: continue independently; the roadmap does not open source promotion, ingestion, Supabase write, or raw row fetch.
- A2 public copy/product safety: review whether the roadmap preserves free/member boundaries and non-investment-advice language.
- A3 launch/production engineering: include the membership-roadmap surface in future public smoke and claim-smoke checks.
- A4 membership MVP planning: use this public roadmap as the visible Phase 2 boundary, but do not implement membership until Phase 1 public Beta is stable enough.

Boundary:

No platform deploy, DNS change, production env mutation, SQL, Supabase read/write, staging rows, `daily_prices` mutation, raw market-data fetch/store/commit, secret output, public source promotion, real score promotion, real-time claim, official endorsement claim, guaranteed-return claim, investment-advice claim, or membership implementation occurred.

## 8AX. 2026-06-14 Revised BRIEF Phase Split And Public Surface Cleanup

CEO decision:

`brief_phase_split_public_surface_cleanup_passed`

PM accepted the chairman's revised BRIEF and split execution into Phase 1 / Phase 2:

- Phase 1 comes first: the public free index-lighting site for every visitor.
- Phase 2 comes later: membership MVP, member content, watchlist, alert conditions, and post-market review.
- A4 Membership MVP Planning may continue as planning-only, but Phase 2 implementation must not block Phase 1 public Beta readiness.

Completed mainline work:

- Rebuilt `docs/PUBLIC_BETA_INDEX_DASHBOARD_BRIEF.md` into readable BRIEF text.
- Rebuilt public asset names, signal labels, module copy, and sample event copy.
- Rebuilt `src/components/dashboard-shell.tsx` so Home and stock pages read like a public market-status dashboard instead of an internal project console.
- Rebuilt `src/components/public-beta-membership-mvp-roadmap.tsx` into a future member-feature preview with clear non-advice boundaries.
- Removed Home exposure of internal readiness/status panels that looked like development process artifacts.

Verification:

- `npx tsc --noEmit` passed.
- `npm run build` passed.
- `check:phase-1-phase-2-execution-split-and-workflow-assignment` passed.
- `check:pm-brief-runtime-mainline-goal-and-workstreams` passed.
- `check:public-beta-membership-mvp-roadmap` passed.
- `check:public-visible-language-quality` passed.
- `check:phase-1-public-beta-public-visible-residue-cleanup` passed.
- `check:public-surface-user-facing-audit` passed.
- Browser verification passed for `/` and `/stocks/2330`.

Current lane assignments:

- PM mainline: keep moving on Phase 1 public usability and remove any remaining public-route internal dashboard residue.
- A1 Data / Source / Coverage: continue lawful free automated-source and coverage work independently; no source promotion or row fetch is opened by this slice.
- A2 Public Copy / Product Safety: audit trust copy and ensure public pages keep source/update/non-advice/member-boundary wording.
- A3 Launch / Production Engineering: keep Vercel, monitoring, rollback, SEO, and post-deploy checks ready.
- A4 Membership MVP Planning: remain Phase 2 planning-only until Phase 1 public Beta is stable enough.

Boundary:

No SQL, Supabase read/write, staging rows, `daily_prices` mutation, raw market-data fetch/store/commit, source promotion, real score promotion, real-time claim, official endorsement claim, guaranteed-return claim, investment-advice claim, production env mutation, DNS change, or membership implementation occurred.

## 8O. 2026-06-13 Phase 1 Operator Review Summary

CEO decision:

`GO_WITH_MOCK_ONLY_PUBLIC_BETA_AFTER_OPERATOR_SMOKE`

PM executed the next route after 8N. The project now has a concise operator review summary that tells the chairman/operator what can proceed, what remains deferred, and which stop lines must halt any Phase 1 public Beta action.

Completed mainline work:

- Added `docs/PHASE_1_PUBLIC_BETA_OPERATOR_REVIEW_SUMMARY.md`.
- Defined the operator GO condition for public route load, clean public wording, mock/formal-data boundary, source status, coverage status, update time, and non-investment-advice copy.
- Listed accepted Phase 1 deferrals, including Phase 2 membership and real-data promotion.
- Listed hard stop lines for SQL, Supabase write, staging rows, `daily_prices`, raw market data, secrets, source promotion, real score promotion, official endorsement, complete coverage, real-time precision, investment advice, and guaranteed-return claims.
- Assigned PM/A1/A2/A3/A4 follow-up actions.
- Added `check:phase-1-public-beta-operator-review-summary`.
- Registered the new check in the focused review gate.

Current lane assignments:

- PM mainline: next route is `phase_1_public_beta_post_operator_smoke_packet`, preparing the exact report shape for post-deploy/public-smoke evidence.
- A1 data/source coverage: continue legal-free automated-source and coverage validation outside the operator deploy path.
- A2 public trust copy: guard the deployed public surface against live-data, complete-coverage, official-endorsement, personalized-advice, or guaranteed-outcome wording.
- A3 launch operations: use the release ops index, manual platform checklist, post-platform action report template, and monitoring/repair runbook.
- A4 membership MVP planning: keep Phase 2 planned but do not implement membership during the Phase 1 operator path.

Boundary:

No SQL, Supabase write, staging rows, `daily_prices` mutation, raw market-data fetch/store/commit, public source promotion, real score promotion, membership implementation, platform deploy, DNS change, or production env mutation occurred.

## 8M. 2026-06-13 Methodology / Disclaimer Source Coverage Alignment

CEO decision:

`align_source_coverage_bridge_destinations_before_phase_1_public_beta`

PM executed the next BRIEF product/runtime slice after 8L. The source/coverage bridge already points users to `/methodology` and `/disclaimer`; this slice makes those destination pages answer why the links exist instead of only serving as generic legal pages.

Completed mainline work:

- Strengthened `/methodology` first-screen copy so it explicitly connects market status interpretation to data source, coverage rate, and update time.
- Strengthened `/methodology` method-boundary copy so it says both `銝?靘眺鞈?遣霅躬 and `銝?靘鞎瑁都撱箄降`.
- Strengthened `/disclaimer` first-screen and quick-read copy so users see data source, update time, coverage rate, formal-data lock, and non-advice boundaries.
- Added `check:public-beta-methodology-disclaimer-source-coverage-alignment`.
- Registered the new check in the focused review gate.

Current lane assignments:

- PM mainline: continue the Phase 1 public free index-lighting loop. Next route is `public_beta_phase_1_launch_gap_rollup`, combining public usability, route health, trust copy, A3 launch ops, and still-open data gates into one concise Beta readiness view.
- A1 background: continue source and coverage work independently; PM integrates only accepted aggregate-safe outputs.
- A2 background: keep public copy guard focused on source/coverage, formal-data lock, complete-coverage claims, and non-investment-advice language.
- A3 background: keep launch engineering packets ready for operator review; no platform action is executed by this slice.

Boundary:

No SQL, Supabase write, staging rows, `daily_prices` mutation, raw market-data fetch/store/commit, public source promotion, or real score promotion occurred.
