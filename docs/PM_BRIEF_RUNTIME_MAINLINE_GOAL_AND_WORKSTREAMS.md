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

- PM added a shared `PublicBetaUsableLoopPanel` across Home, `/briefing`, and stock routes. The panel turns the BRIEF into a public readable loop: `30 秒` `看懂市場氛圍`, `3 分鐘` `形成觀察行動`, `邊界` `先確認資料限制`, plus current-use, real-data-upgrade, and non-investment-advice cards. It keeps `publicDataSource=mock`, `scoreSource=mock`, no real-data promotion, no Supabase write, and no investment advice. The new `check:public-beta-usable-loop-panel` is registered in the review gate, and `check:public-visible-language-quality` now requires the usable-loop language on public routes. Next PM route is `review_public_beta_usable_loop_then_prepare_next_runtime_readability_lane`; next A1 route remains `prepare_etf_market_price_synthetic_contract_cases_no_fetch`; next A2 route is `review_public_beta_usable_loop_copy_safety`.

- PM converted public runtime status vocabulary from internal English labels into Chinese reader-facing labels. Home, `/briefing`, and stock routes now use `候選來源`, `條件檢查中`, `未來擴充`, `暫不開放`, `市價檢查中`, and `暫不接入` in `Source & Coverage`; Home runtime status cards use Chinese labels for public boundary/progress/next decision/blocked transition/row coverage; and investor-indicator roadmap names are now `市場溫度`, `標的健康度`, `風險訊號`, `變化偵測`, `下一步觀察`, and `信心層級`. The runtime-label checker blocks `Candidate`, `Checking`, `Future`, `Blocked`, `Excluded`, and `Mock only` from public route text. This improves the BRIEF 30-second reading path without changing data posture. Next PM route is `review_public_status_vocabulary_then_prepare_next_runtime_readability_lane`; next A1 route remains `prepare_etf_market_price_synthetic_contract_cases_no_fetch`; next A2 route is `review_public_status_vocabulary_safety`.

- PM wired the ETF mock runtime handoff into the shared public `Source & Coverage` runtime panel. Public routes now expose `ETF 30 秒脈絡`, `ETF 3 分鐘行動`, and case-level mock statuses from the ETF synthetic fixture, so users can understand the `0050` and `006208` ETF market-price examples as context only. The integration preserves `publicDataSource=mock`, `scoreSource=mock`, `rawMarketDataFetch=false`, `sqlExecution=false`, and `supabaseWrite=false`, and it does not display NAV, holdings, premium/discount, complete ETF coverage, live-data claims, or investment advice. Next PM route is `review_etf_public_runtime_labels_then_prepare_next_source_coverage_lane`; next A1 route remains `prepare_etf_market_price_synthetic_contract_cases_no_fetch`; next A2 route is `review_etf_public_runtime_label_copy_safety`.

- PM added `src/lib/etf-market-price-mock-runtime-handoff.ts` and registered `scripts/check-etf-market-price-mock-runtime-handoff.mjs`. The handoff converts ETF synthetic fixture results into runtime-readable statuses: `可示範`, `暫停公開`, and `政策待確認`, plus 30-second ETF context wording and 3-minute action guidance. It keeps `etf_market_price_mock_runtime_handoff_ready_no_fetch`, `publicDataSource=mock`, `scoreSource=mock`, `rawMarketDataFetch=false`, `sqlExecution=false`, and `supabaseWrite=false`. Next PM route is `etf_market_price_mock_runtime_handoff_review_then_public_label_integration`; next A1 route remains `prepare_etf_market_price_synthetic_contract_cases_no_fetch`; next A2 route is `review_etf_market_price_mock_runtime_handoff_public_copy_safety`.

- PM added `src/lib/etf-market-price-synthetic-fixture.ts` and registered `scripts/check-etf-market-price-synthetic-fixture.mjs`. The synthetic fixture executes only local rows and covers six ETF market-price contract cases: valid market-price points, missing close price, out-of-scope symbol, duplicate session, optional activity fields missing, and forbidden NAV-like fields. It keeps `etf_market_price_synthetic_fixture_ready_no_fetch`, `publicDataSource=mock`, `scoreSource=mock`, `rawMarketDataFetch=false`, `sqlExecution=false`, and `supabaseWrite=false`. Next PM route is `etf_market_price_synthetic_fixture_review_then_mock_runtime_handoff`; next A1 route is `prepare_etf_market_price_synthetic_contract_cases_no_fetch`; next A2 route is `review_etf_market_price_synthetic_fixture_public_copy_safety`.

- PM accepted and registered the A1 ETF market-price field contract at `docs/A1_ETF_MARKET_PRICE_FIELD_CONTRACT_NO_FETCH.md`. The contract keeps the ETF lane limited to `0050` and `006208`, names the minimum future normalized fields, separates required and optional values, and requires missing-session, revision, duplicate-date, fail-closed, attribution, and retention policies before any real-data use. It continues to exclude NAV, holdings, premium/discount, intraday iNAV, distributions, issuer factsheet text, and recommendation language. Next PM route is `prepare_etf_market_price_synthetic_fixture_no_fetch`; next A1 route is `prepare_etf_market_price_synthetic_contract_cases_no_fetch`; next A2 route is `review_etf_market_price_field_contract_public_copy_safety`.

- PM wired the accepted ETF market-price-only scope into the shared public `Source & Coverage` runtime panel. The public routes now show `ETF 市價範圍`, `NAV 暫不接入`, `成分股暫不接入`, `折溢價暫不接入`, and `ETF 不提供買賣建議`, so users can read `0050` and `006208` as mock ETF context anchors without mistaking the site for NAV, holdings, premium/discount, issuer/fund disclosure, or ETF recommendation coverage. Next PM route is `review_etf_scope_runtime_labels_then_prepare_field_contract_no_fetch`; next A1 route is `prepare_etf_market_price_field_contract_no_fetch`; next A2 route is `review_etf_market_price_scope_public_copy_safety`.

- PM accepted the A1 ETF market-price-only scope packet at `docs/A1_ETF_MARKET_PRICE_SOURCE_SCOPE_NO_FETCH.md`. It keeps `0050` and `006208` as mock runtime anchors, narrows future ETF real display to exchange-traded market-price fields, and explicitly excludes NAV, holdings, premium/discount, intraday iNAV, distribution schedules, issuer factsheet text, and ETF recommendation ranking. ETF source-rights remain `checking`; redistribution remains `not_approved`; ETF row coverage credit remains `blocked`. Next PM route is `wire_etf_market_price_scope_into_public_runtime_labels`; next A1 route is `prepare_etf_market_price_field_contract_no_fetch`; next A2 route is `review_etf_market_price_scope_public_copy_safety`.

- PM wired the accepted source/coverage gap matrix into the shared `Source & Coverage` runtime panel. The public routes now show seven coverage lanes in reader-facing language: `TWII 指數基準`, `核心 ETF 脈絡`, `Batch 1 個股示範`, `完整上市股票`, `OTC 未來擴充`, `產業分類脈絡`, and `衍生指標層`. This makes the source/coverage gate visible without exposing internal commands or claiming real data. A2 background review could not spawn because the agent thread limit was reached, so PM strengthened `scripts/check-public-beta-source-coverage-runtime-labels.mjs` to guard the public route output directly. Next PM route is `review_source_coverage_runtime_matrix_labels_then_prepare_etf_scope_no_fetch`; next A1 route remains `prepare_etf_market_price_source_scope_no_fetch`; next A2 route remains `review_source_coverage_gap_matrix_public_copy_safety`.

- PM accepted the A1 source/coverage gap matrix at `docs/A1_PUBLIC_BETA_SOURCE_COVERAGE_GAP_MATRIX_NO_FETCH.md`. The matrix separates `index_baseline`, `core_etf_context`, `listed_equity_batch1`, `listed_equity_full`, `otc_future_expansion`, `sector_industry_context`, and `derived_indicator_layer`, with source-rights status, field-contract readiness, public display posture, and next no-fetch tasks. This gives PM a concrete bridge from data coverage planning into runtime labels without claiming real data. Next PM route is `wire_source_coverage_gap_matrix_into_public_runtime_readiness_labels`; next A1 route is `prepare_etf_market_price_source_scope_no_fetch`; next A2 route is `review_source_coverage_gap_matrix_public_copy_safety`.

- PM completed the next A1/A2 support-lane assignment locally because background agent capacity was full. A1 now owns `docs/A1_BRIEF_SOURCE_COVERAGE_NEXT_HANDOFF_NO_FETCH.md` with next task `prepare_public_beta_source_coverage_gap_matrix_no_fetch`: keep source/coverage planning no-fetch, aggregate-only, no SQL, no Supabase, and no public real-data promotion. A2 now owns `docs/A2_BRIEF_PUBLIC_RUNTIME_SURFACE_AUDIT.md`, guarding public routes for `Public Beta Decision Loop`, `30 秒市場氛圍，3 分鐘行動判斷`, `Source & Coverage`, `Data Readiness`, `publicDataSource=mock`, `scoreSource=mock`, non-real-time wording, and non-investment-advice wording. PM registered both focused checkers and review-gate entries so these lanes can run in parallel while PM remains integration owner.

- PM is cleaning the public product runtime surfaces so the site reads like a Beta index status dashboard rather than an internal execution console. `Public Beta Reading Path`, `Data Readiness`, and `Source & Coverage` now focus on market mood, cause/time review, source coverage limits, mock/real boundary, and next observation action. A1 remains assigned to legal/free automated source and coverage evidence; A2 remains assigned to public copy safety. The mainline should keep integrating only the support-lane outputs that improve user comprehension or runtime safety, and defer broad visual polish until the foundation is stable.

- PM added a shared `PublicBetaDecisionLoopBridge` across `/`, `/briefing`, and stock runtime pages. The bridge uses the same public product loop everywhere: `30 秒市場氛圍，3 分鐘行動判斷`, `先看市場氛圍`, `再看成因與時間`, and `最後看資料邊界`. It keeps the boundary visible: `publicDataSource=mock`, `scoreSource=mock`, not real-time live data, and no buy/sell advice. A1 continues the data/source/coverage lane without fetch, SQL, Supabase write, raw payload, or promotion. A2 now reviews this shared bridge for public-copy safety and should block any future copy that turns the bridge into live-data, official-source approval, or investment-advice language.

- PM surfaced TWII data-decision readiness on stock detail runtime pages. `src/components/stock-runtime-at-a-glance.tsx` now includes a `stock-twii-data-decision-status` strip that tells users the current state in public language: TWII source evidence is organized, one controlled read decision is still pending, and the public runtime remains `publicDataSource=mock` / `scoreSource=mock` with no buy/sell advice. This supports the BRIEF goal directly: users can understand what the stock page can be used for now within 30 seconds and why real-data claims are still locked before making a 3-minute observation decision. A1 remains assigned to source/coverage evidence; A2 remains assigned to public-copy safety. No SQL, Supabase read/write, market-data fetch/ingest/store/commit, `daily_prices` mutation, public source promotion, `publicDataSource=supabase`, `scoreSource=real`, real-time claim, or investment-advice claim occurred.

- PM surfaced TWII operator decision readiness in the public Beta data-readiness runtime surface. `src/lib/public-beta-data-readiness-status.ts` now exposes `operatorDecisionReadiness`, and `src/components/public-beta-data-readiness-status.tsx` renders three reader-facing cards: `TWII 來源證據`, `操作決策`, and `真實資料升級`, with public labels `已整理，尚未啟用真實資料`, `等待明確選擇`, and `仍鎖住`. The copy explains that TWII evidence is organized, the explicit operator decision is still pending, and real-data promotion remains locked. The surface stays `publicDataSource=mock`, `scoreSource=mock`, no-execution, no-real-time, and non-investment-advice. The next PM route remains `wait_for_explicit_operator_decision_before_execution_packet`.

- PM accepted the next A1/A2 operator decision support slice. A1 prerequisites are recorded at `docs/A1_TWII_READONLY_EXECUTION_PACKET_PREREQUISITES_NO_EXECUTION.md`, requiring a future separate execution packet to stay TWII-only, aggregate-only, one-attempt-only, no-write, no-SQL, no-raw-payload, no-row-payload, no-public-promotion, and post-run-review-required. A2 copy guard is recorded at `docs/A2_TWII_OPERATOR_DECISION_PUBLIC_COPY_GUARD.md`, blocking wording that implies live data, source-rights approval, Supabase read/write, complete row coverage, official endorsement, or investment advice. The next PM route is `wait_for_explicit_operator_decision_before_execution_packet`; future PM route only if authorized is `prepare_separate_twii_readonly_execution_packet_no_write`.

- PM converted the accepted A1 TWII exact evidence packet into a no-execution operator readonly decision packet at `docs/TWII_OPERATOR_READONLY_DECISION_PACKET_NO_EXECUTION.md`. The packet names three future decisions, `authorize_one_bounded_readonly_attempt`, `request_evidence_repair`, and `defer_readonly_attempt`, while keeping `operatorDecisionAcceptedNow=false`, `executionPacketPreparedNow=false`, `runnerExecutableNow=false`, `readonlyAttemptExecutableNow=false`, `publicDataSource=mock`, and `scoreSource=mock`. It does not authorize SQL, Supabase connection/read/write, staging rows, `daily_prices` mutation, endpoint probe, OpenAPI call, CSV download, market-data fetch/ingest/storage/commit, public source promotion, real scoring, or investment advice. The next PM route is `review_operator_readonly_decision_packet_then_wait_for_explicit_operator_decision`; A1 next owns `prepare_twii_readonly_execution_packet_prerequisites_if_operator_authorizes_later`; A2 next owns `prepare_twii_operator_decision_public_copy_guard_if_pm_requests`.

- A1 TWII exact source-rights and field-contract evidence is ready for PM review at `docs/A1_TWII_EXACT_SOURCE_RIGHTS_AND_FIELD_CONTRACT_EVIDENCE_NO_FETCH.md`. The packet records official metadata references, daily cadence, free/open license reference, OpenAPI metadata reference, and minimum field contract for `trade_date`, `close_value`, `instrument_code`, `instrument_name`, `source_url_label`, and `source_updated_at`. It remains no-fetch/no-execution: no SQL, no Supabase connection/read/write, no staging rows, no `daily_prices` mutation, no endpoint probe, no row payload, no raw market-data storage, no source promotion, no `publicDataSource=supabase`, and no `scoreSource=real`. The next PM route is `review_exact_twii_evidence_then_prepare_operator_readonly_decision_packet_or_repair`; A1 next owns `prepare_twii_operator_readonly_decision_packet_no_execution_if_pm_accepts_evidence`; A2 next owns `prepare_twii_source_attribution_cadence_phrase_set_patch_if_pm_requests`.

- PM surfaced bounded readonly requirements in the shared public Beta data-readiness runtime surface. `src/lib/public-beta-data-readiness-status.ts` and `src/components/public-beta-data-readiness-status.tsx` now expose `來源權利`, `欄位契約`, `安全輸出`, and `升級鎖` so users and PM can see what must be true before any future readonly gate, without implying authorization or execution. The next PM/A1 route is `prepare_exact_source_rights_and_field_contract_evidence_for_future_readonly_attempt`.
- A2 TWII source-attribution and cadence public-copy guard is ready for PM intake at `docs/A2_TWII_SOURCE_ATTRIBUTION_AND_CADENCE_PUBLIC_COPY_GUARD.md`. PM accepted the background output after bounded repair and registered `scripts/check-a2-twii-source-attribution-and-cadence-public-copy-guard.mjs`. The guard protects source-attribution wording, daily-after-close cadence wording, mock boundary, and non-investment-advice wording before any real-data promotion.
- A1 bounded readonly gate candidate requirements are now ready for PM intake at `docs/A1_TWII_BOUNDED_READONLY_GATE_CANDIDATE_REQUIREMENTS_NO_EXECUTION.md`. The packet defines future attempt fields, fail-closed requirements, source-rights evidence, field contract, cadence, no-secret output, no raw/row payload output, no Supabase write, no `daily_prices` mutation, no promotion, and post-run review requirements while remaining no-execution. The next PM route is `surface_bounded_readonly_requirements_as_runtime_readiness_then_wait_for_external_execution_decision`; A1 next owns `prepare_exact_source_rights_and_field_contract_evidence_for_future_readonly_attempt`; A2 next owns `review_twii_source_attribution_and_cadence_public_copy_guard`.
- PM wired the TWII terms/field/cadence/attribution packet into the shared public Beta data-readiness runtime surface. `src/lib/public-beta-data-readiness-status.ts` and `src/components/public-beta-data-readiness-status.tsx` now expose `資料條款`, `欄位對照`, `更新節奏`, and `公開引用` as reader-facing readiness cards. The integration keeps `publicDataSource=mock`, `scoreSource=mock`, no SQL, no Supabase, no raw market-data fetch, no endpoint probe, and no real-data promotion. The next PM route is `review_twii_terms_runtime_readiness_copy_then_prepare_bounded_readonly_requirements`; A1 next owns `prepare_twii_bounded_readonly_gate_candidate_requirements_no_execution`; A2 next owns `review_twii_source_attribution_and_cadence_public_copy_guard`.
- A1 TWII terms/field/cadence/attribution no-fetch packet is ready for PM intake at `docs/A1_TWII_TERMS_FIELD_CADENCE_ATTRIBUTION_NO_FETCH_PACKET.md`. It narrows the TWII source route into terms, minimum fields, daily-after-close cadence, and public attribution decisions while preserving `publicDataSource=mock`, `scoreSource=mock`, no SQL, no Supabase connection/write, no staging rows, no `daily_prices` mutation, no endpoint probe, no market-data fetch/ingest/store/commit, no row payloads, no row coverage points, and no real-data promotion. The next PM route is `wire_twii_terms_field_cadence_attribution_status_into_runtime_readiness_copy`; A1 next owns `prepare_twii_bounded_readonly_gate_candidate_requirements_no_execution`; A2 next owns `review_twii_source_attribution_and_cadence_public_copy_guard`.
- PM wired the accepted A1 no-fetch coverage artifact into the public data-readiness runtime surface. `src/lib/public-beta-data-readiness-status.ts` and `src/components/public-beta-data-readiness-status.tsx` now expose the next coverage scopes as user-readable cards: `TWII 大盤基準準備中`, `核心 ETF 來源條件待確認`, `第一批上市個股示範`, `產業與族群待 taxonomy review`, and `進階指標 mock 可解釋，真實計算未開放`. The integration remains mock-only and does not promote public data, score source, row coverage points, SQL, Supabase, or raw market data.
- A1 next no-fetch coverage artifact is now ready for PM intake at `docs/A1_PUBLIC_BETA_NEXT_NO_FETCH_COVERAGE_ARTIFACT.md`. It separates `TWII`, core ETF (`0050`, `006208`), Batch 1 listed-equity demo anchors (`2330`, `2382`, `2308`), sector/industry, and derived indicators into PM-safe runtime coverage states. The next PM route is `wire_next_no_fetch_coverage_artifact_into_public_data_readiness_status`; A1 next owns `prepare_twii_terms_field_cadence_attribution_no_fetch_packet`; A2 next owns `review_data_readiness_and_coverage_artifact_public_copy_density`.
- PM repaired the shared public Beta data-readiness and data-realization runtime helpers. Home and `/briefing` now show readable Chinese for data readiness, row coverage evidence, TWII prerequisites, public data boundary, source-trust next steps, coverage rollout batches, readonly gate status, and mock-only stop lines. This slice keeps `publicDataSource=mock`, `scoreSource=mock`, no SQL, no Supabase write, no market-data fetch, and no real-data promotion. A1 next owns the next no-fetch coverage artifact; A2 next owns public-copy review for the repaired data readiness and coverage rollout wording.
- PM cleaned the shared public Beta route-reading path across Home, `/briefing`, and stock detail. The route panel now uses reader-facing Chinese for the three-step path, source/coverage state, next data gate, and mock boundary, and the dedicated checker blocks mojibake/developer residue on the shared route surface.
- PM cleaned the Home `Public Beta Index Dashboard` BRIEF loop so its headline, market overview, core indicator panel, alert list, update time, impact level, next step, and stop line are readable Chinese. The dedicated checker now blocks mojibake/developer residue in this high-exposure loop while preserving `publicDataSource=mock`, `scoreSource=mock`, and non-advice boundaries.
- PM translated the accepted Batch 1 listed-equity policy into the shared `Source & Coverage` public panel. The public label layer now explains `第一批示範標的`, `不是完整上市股票覆蓋`, and `上市個股與 ETF/指數分開` so users can understand that visible stock pages are mock demo anchors, not full listed-equity coverage or live data.
- PM accepted `docs/A1_BATCH1_LISTED_EQUITY_SYMBOL_POLICY_NO_ROW_LIST.md` as the Batch 1 listed-equity policy input. The accepted policy keeps the first listed-equity batch small, visible, and explainable; blocks full stock-id row-list output; separates listed equity from ETF, index, OTC, and other instrument scopes; and keeps public labels mock-only and non-advice. The next route is `prepare_batch1_listed_equity_mock_runtime_policy_labels`.
- PM integrated the index-baseline mock runtime handoff into the shared `Source & Coverage` public panel. The public label layer now shows `可示範`, `暫停公開`, and `政策待確認` for index baseline checks without exposing fixture, parser, or handoff internals.
- PM added `src/lib/twse-openapi-index-baseline-mock-runtime-handoff.ts` to summarize the index-baseline fixture into mock runtime statuses: `可示範`, `暫停公開`, and `政策待確認`. The handoff status is `twse_openapi_index_baseline_mock_runtime_handoff_ready_no_fetch`, and the next route is `index_baseline_mock_runtime_handoff_review_then_public_label_integration`.
- PM converted A1's no-fetch index-baseline synthetic cases into `src/lib/twse-openapi-index-baseline-synthetic-fixture.ts`. The fixture status is `twse_openapi_index_baseline_synthetic_parser_fixture_ready_no_fetch` and covers valid date/close, missing close, duplicate date, missing optional fields, revision warning, and session-gap behavior without fetching market rows or promoting real data.
- Completed route anchor retained for checker continuity: `prepare_index_baseline_synthetic_parser_fixture_no_fetch`.
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

Recommended next mainline action:

`wait_for_explicit_operator_decision_before_execution_packet`

Meaning:

PM now has the no-execution TWII operator decision packet plus A1 prerequisite shape and A2 copy guard. The next decision is external/operator-facing: either explicitly authorize one bounded readonly attempt, request evidence repair, or defer the attempt. Until then, PM should keep improving BRIEF product/runtime readability without preparing or executing a remote packet. Real-data promotion remains blocked until a separately accepted source-rights, coverage, quality, rollback, execution, post-run review, and runtime promotion gate is recorded.
