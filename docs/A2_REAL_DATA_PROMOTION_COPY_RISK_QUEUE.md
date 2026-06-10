# A2 Real Data Promotion Copy Risk Queue

Status: `a2_real_data_promotion_copy_risk_queue_ready`
Updated: 2026-06-11
Owner lane: A2 Frontend / UX Readability / Public Trust Copy
Integration owner: PM mainline
Mode: `local_only_copy_risk_queue`

## Purpose

This queue prepares public-site copy risks for the moment when PM enters an aggregate readback gate or a future bounded write gate.

It is intentionally a local-only copy and UX-readability artifact. It does not approve real data, source rights, row coverage, public redistribution, runtime reads, runtime writes, scoring promotion, or investment advice.

## Non-Executable Boundary

- Do not run SQL.
- Do not connect to Supabase.
- Do not read Supabase.
- Do not write Supabase.
- Do not mutate `daily_prices`.
- Do not fetch, import, ingest, store, commit, print, or summarize raw market data.
- Do not read or output secrets.
- Do not output raw payload, row payload, stock-id payload, source body, or provider terms body.
- Do not touch PM mainline gate, checker, status, board, package, runtime config, or source-promotion files.
- Do not set `publicDataSource=supabase`.
- Do not set `scoreSource=real`.
- Do not imply current public data is real data.
- Do not imply complete coverage.
- Do not imply investment advice, buy/sell/hold advice, personalized recommendation, or validated forecast quality.
- Do not imply source-rights approval, redistribution approval, or provider authorization until PM/A1/legal/source-rights gates explicitly approve that wording.

## Current Public Copy Risk Context

The public site must remain understandable while the backend and data-governance work advances. Aggregate readback or future bounded write work can easily create a copy mismatch: internal progress may sound like public readiness even when the website still must communicate a mock-only, partial, non-advice, source-rights-pending posture.

A2 should treat each new PM data milestone as copy-risk input, not as automatic public launch language.

## High-Risk Misleading Implications

| Risk | How public copy can mislead users | Required safer framing | Queue priority |
|---|---|---|---:|
| Real-data implication | "Readback passed", "write gate", "data connected", "live data", or "real market data" can make users think the public site now uses approved real data. | Say the public site remains in gated Beta/mock-only mode until PM explicitly promotes public runtime state. Keep `publicDataSource=mock` visible where technical flags are shown. | P0 |
| Complete-coverage implication | Coverage progress, missing-row closure, or row-count success can sound like the whole market, all symbols, and all sessions are covered. | Say coverage may still be partial by asset class, symbol, time window, and field. Avoid "complete", "full market", "all stocks", or "fully covered" unless a PM-approved coverage gate says so. | P0 |
| Source-rights approval implication | Source-rights review progress can be mistaken for public redistribution approval or permission to display source-derived values. | Say source-rights/public-use language remains pending until PM/A1/legal approve public wording. Avoid naming source approval as done unless the approved gate explicitly covers public display and redistribution language. | P0 |
| Investment-advice implication | Scores, rankings, watchlists, weekly summaries, and signal labels can look actionable once "real" data language appears nearby. | Keep a nearby limitation: not investment advice, not buy/sell/hold, not personalized recommendation, not validated forecast. | P0 |
| Freshness-as-quality implication | Freshness timestamps or readback recency can sound like quality acceptance, live-market timeliness, or model validity. | Say freshness is display context only unless PM approves stronger wording. It does not by itself prove source rights, coverage completeness, quality acceptance, or real-score authorization. | P1 |
| Gate-name leakage | Internal terms such as aggregate readback, bounded write, promotion gate, Supabase, row coverage, and scoreSource can confuse users or create misplaced confidence. | Put internal flags in technical disclosure areas only. Pair them with plain-language meaning for public readers. | P1 |
| Score promotion implication | Any mention of "real data available" near scores can imply `scoreSource=real`. | Keep `scoreSource=mock` until a dedicated scoring promotion gate says otherwise. Public score copy should describe mock/product-evaluation output, not real investment signal output. | P0 |
| Legal/disclosure mismatch | Public legal pages may lag behind data promotion language and fail to explain limitations consistently. | Update disclaimer/methodology/privacy/terms copy before or at the same time as any public data-state wording change. | P1 |

## Copy Queue For Future PM Gate Entry

| Priority | Public surface | Copy risk to review when PM enters aggregate readback / future write gate | A2 follow-up copy task | Must not claim |
|---:|---|---|---|---|
| 1 | Shared runtime state strip / trust banner | Users may see backend progress as public real-data activation. | Add or preserve a first-line state: public site remains gated Beta/mock-only until PM promotes runtime state. | Real data is active, source rights are approved, or public runtime has moved to Supabase. |
| 2 | Data freshness strip | Readback recency can be mistaken for live data or quality acceptance. | Clarify that freshness/readback metadata is context, not public approval, complete coverage, or real-score authorization. | Live market data, complete freshness, or quality pass. |
| 3 | Score/ranking/watchlist areas | Data progress can make scores look like investable recommendations. | Keep non-advice copy beside score clusters and ranking/action labels. | Buy/sell/hold, personalized advice, validated forecast, or `scoreSource=real`. |
| 4 | Stock detail pages | Individual-symbol pages make partial data look specific and actionable. | State symbol-level data may be partial, delayed, unavailable, or mock-derived until PM approves real public use. | Symbol-level coverage is complete or source-derived values are public-approved. |
| 5 | Weekly / briefing summaries | Summaries can sound like current market guidance once any real-data milestone is mentioned. | Use "product-flow reading" or "Beta interpretation" framing, with non-advice and partial-coverage limits nearby. | Latest market advice, current recommendation, or complete weekly market coverage. |
| 6 | Methodology page | Method credibility can be over-read as model validation after data gates move. | Separate data-readiness from model validation; say scoring remains mock/product-evaluation unless a scoring gate approves otherwise. | Validated forecast quality or production investment model readiness. |
| 7 | Disclaimer / terms / privacy | Legal and trust pages must match any public data-state wording. | Review all legal/trust pages before any public language changes from mock-only to real-data-ready. | Provider authorization, redistribution approval, legal completion, or investment advisory status. |
| 8 | SEO metadata / Open Graph / snippets | Search snippets may omit limitations and overstate real-data readiness. | Keep titles/descriptions from saying live, real-time, complete, approved, or advice-oriented phrases. | Live signals, complete coverage, source-approved data, or investment recommendations. |

## Launch-Safe Draft Phrases

These are draft phrases for later PM review. They are not authorization to patch UI.

- `目前公開網站仍為 Beta / mock-only 顯示；後端 gate 進度不等於公開 real data 已啟用。`
- `資料讀回或寫入 gate 的通過，只代表 PM 可檢查下一步，不代表完整 coverage、來源權利核准或公開再利用許可。`
- `分數與排行仍不得被解讀為買進、賣出、持有、個人化投資建議或已驗證預測。`
- `若未經 PM/A1/legal/source-rights 明確核准，公開文案不得宣稱來源授權、轉載授權、完整市場覆蓋或 real score 上線。`
- `技術旗標仍需保持清楚：publicDataSource=mock、scoreSource=mock，直到對應 promotion gate 明確變更。`

## Unsafe Phrases To Avoid Until Approved

- `real data is live`
- `live market data`
- `fully covered`
- `complete Taiwan market coverage`
- `source-rights approved`
- `provider-approved public data`
- `real score`
- `validated investment signal`
- `buy/sell/hold recommendation`
- `personalized investment advice`
- `Supabase-backed public data is enabled`
- `readback passed, so public data is ready`
- `write gate passed, so launch is complete`

## A2 Acceptance Criteria

- The document remains local-only and copy-only.
- It contains no SQL, Supabase instructions, raw payloads, row payloads, stock-id payloads, secrets, source bodies, or source-derived market values.
- It does not modify UI code, PM mainline gate/checker/status/board/package files, runtime config, data files, `daily_prices`, source-rights artifacts, or checker outputs.
- It treats aggregate readback and future write gates as internal PM milestones only.
- It keeps public-site wording bounded by mock-only, partial-coverage risk, non-advice, and source-rights-pending language.
- It preserves the stop-line flags `publicDataSource=mock` and `scoreSource=mock` as the safe public runtime posture until PM explicitly approves promotion.

## PM Intake Questions

1. Which public surface should A2 review first if aggregate readback begins: shared state strip, data freshness strip, score surfaces, or legal pages?
2. Should PM require a copy-readiness check before any public wording changes that mention readback/write progress?
3. Which wording owner must approve source-rights/public redistribution claims before they appear on public pages?
4. Should SEO metadata be included in the same copy gate as visible page copy?

## Handoff Note

This queue is a preparation artifact only. It did not execute SQL, connect to Supabase, read Supabase, write Supabase, mutate `daily_prices`, fetch/import/ingest/store raw market data, output secrets, output raw/row/stock-id payloads, change runtime flags, change scoring, or modify PM mainline gate/checker/status/board/package files.
