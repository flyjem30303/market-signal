# A2 TWII Source Attribution And Cadence Public Copy Guard

Status: `a2_twii_source_attribution_cadence_public_copy_guard_ready_for_pm_intake`

Date: 2026-06-12

Owner: A2 Public Copy / Product Safety lane

Integration owner: PM mainline

Runtime posture:

- `publicDataSource=mock`
- `scoreSource=mock`

## Purpose

This guard defines how public pages may talk about TWII source attribution and daily-after-close cadence before any real-data promotion.

It is a copy-safety guard only. It does not approve source rights, execute a readonly attempt, fetch market data, write Supabase, or switch runtime sources.

## Public-Copy Goal

A general investor should understand within 30 seconds that:

1. TWII is still shown through a Public Beta mock-only decision-support surface.
2. Source attribution and update cadence are being prepared, not approved for real public display.
3. Daily-after-close cadence is a target policy, not a real-time feed.
4. Source/cadence labels are not investment advice or trading instructions.

## Allowed Public Meaning

Public pages may say:

- TWII source attribution is under review.
- Exact source naming, attribution placement, redistribution limits, retention, and derived-display wording still need PM/A1/D confirmation.
- TWII real-data readiness is moving toward daily-after-close use, not intraday or second-level freshness.
- The current Public Beta remains mock-only until separate promotion gates pass.
- Users should treat the page as information organization and risk-identification support, not as a buy/sell/hold instruction.

## Blocked Public Meaning

Public pages must not say or imply:

- TWII official source rights are accepted.
- TWII redistribution is accepted.
- TWII data is official live market data.
- TWII daily updates are guaranteed.
- Every TWII trading day is fully covered.
- Public pages have switched to real market data.
- Scores are real-data scores.
- Any label is a buy, sell, hold, target-price, guaranteed-return, allocation, or personalized suitability recommendation.

## Preferred Copy Patterns

Source attribution:

`TWII 來源標示仍在確認。公開 Beta 目前只顯示 mock 狀態，正式來源名稱、引用位置與可公開使用條件需經 PM/A1/D 確認後才會切換。`

Cadence:

`TWII 真實資料路線以每日收盤後更新為候選節奏，不提供即時到秒行情。公開 Beta 目前仍以 mock 狀態說明資料準備進度。`

Mock boundary:

`目前頁面維持 mock-only；真實資料與真實分數需另外通過來源權利、覆蓋品質、更新節奏、回退機制與公開揭露 gate。`

Non-investment-advice:

`本頁提供資訊整理與風險辨識輔助，不提供買進、賣出、持有、目標價、報酬保證或個人化投資建議。`

## A2 Review Checklist

Before PM integrates any TWII source/cadence public copy, A2 should confirm:

1. Source attribution stays generic unless PM/A1/D accepts exact source wording.
2. Daily-after-close cadence is framed as target/reviewed cadence, not live data.
3. Mock boundary appears near the source/cadence label, not only in a footer.
4. `publicDataSource=mock` and `scoreSource=mock` remain visible in technical disclosure areas.
5. Any score, pressure, alert, or next-step sentence has nearby non-advice limitation.
6. Copy does not mention SQL, Supabase, staging rows, `daily_prices`, raw payloads, secrets, or runtime execution as a public promise.
7. Copy does not imply real-data promotion, full coverage, source-rights approval, official endorsement, or investment advice.

## PM Intake Route

PM-safe intake route:

`accept_a2_twii_source_attribution_and_cadence_public_copy_guard`

Next PM route:

`use_a2_twii_copy_guard_when_surface_bounded_readonly_requirements_runtime_readiness`

Next A1 route:

`prepare_exact_source_rights_and_field_contract_evidence_for_future_readonly_attempt`

Next A2 route:

`prepare_twii_source_attribution_cadence_phrase_set_patch_if_pm_requests`

## Hard Stop Lines

This guard does not authorize:

- SQL execution,
- Supabase connection,
- Supabase reads,
- Supabase writes,
- staging rows,
- `daily_prices` mutation,
- endpoint probe,
- market-data fetch,
- market-data ingest,
- market-data storage,
- market-data commit,
- raw payload output,
- row payload output,
- stock-id row-list output,
- secret output,
- row coverage points,
- public source promotion,
- `publicDataSource=supabase`,
- `scoreSource=real`,
- real-time market-data claims,
- official endorsement claims,
- investment advice claims.

## Completion Definition

This guard is complete when:

- source attribution, cadence, mock boundary, and non-advice copy patterns are present;
- blocked public meanings are explicit;
- PM, A1, and A2 next routes are named;
- no-execution and no-promotion stop lines are explicit;
- the checker is registered in `package.json` and `scripts/check-review-gates.mjs`.
