# A2 Public Beta Batch 1 TWII Core ETF Trust Copy

Status: a2_public_beta_batch1_twii_core_etf_trust_copy_ready

Scope: local-only A2 Product / Public Trust / Decision Aid copy packet for Batch 1 public Beta wording: TWII + core ETF. This file is for public-page copy, briefing language, checklist wording, and forbidden claims only.

Current public posture:

- `publicDataSource=mock`
- `scoreSource=mock`
- Batch 1 may be explained as the first real-data candidate lane.
- Batch 1 must not be described as real-data approved, live, complete, tradeable, or investment-signal ready.

This file does not authorize SQL, Supabase access, Supabase writes, staging rows, `daily_prices` mutation, market-data fetch, market-data ingest, raw payload handling, secret/env reading, candidate row acceptance, public real-data promotion, or `scoreSource=real`.

## 一般使用者說明

### 為何 TWII + core ETF 先做

TWII gives users the broad Taiwan market reference point. Core ETF adds an investable-proxy comparison layer that many users already understand, while still letting the product avoid individual-stock picking language. Batch 1 is therefore useful for public learning: users can see how market pressure, source status, and explanation copy will work before broader stock, sector, and derived-indicator coverage is ready.

Safe public wording:

`Batch 1 starts with TWII and core ETF because they are the clearest public reference points for explaining broad market pressure without turning the Beta into stock-picking or trading advice.`

### 目前為何仍 mock

The public page remains mock because source rights, field contract, update cadence, missing-session rules, readonly gate, write gate, and rollback/fail-closed behavior still need accepted review before any real public display. Mock mode lets users inspect the decision-aid experience and trust labels without mistaking the page for verified market evidence.

Safe public wording:

`This Beta is still mock-labeled while TWII and core ETF rights, fields, update cadence, missing-session rules, database gates, and rollback behavior are reviewed.`

### 何時才可能 real

Real display becomes possible only after every required gate is accepted and PM explicitly integrates the accepted state. A partial pass can support internal readiness notes, but it cannot approve `publicDataSource=supabase`, `scoreSource=real`, real-time wording, trading-language claims, or public real-data promotion.

Safe public wording:

`TWII and core ETF can move toward real display only after rights, field contract, cadence, missing-session rules, readonly/write gates, and fail-closed rollback checks are all accepted.`

## 新手版文案

1. `我們先用 TWII 和核心 ETF 做 Batch 1，因為它們最適合說明整體台股壓力與市場參考感。現在頁面仍是 mock，重點是讓你看懂判讀方式，不是提供正式投資訊號。`
2. `目前看到的是模擬資料與示範狀態。真實資料要等來源權利、欄位、更新頻率、缺漏交易日規則與安全回復機制都通過後，才可能放到公開頁。`
3. `這個頁面可以幫你檢查市場壓力與自己的風險假設，但不會告訴你買進或賣出，也不承諾收益或即時精準到秒。`

## 進階版文案

1. `Batch 1 focuses on TWII plus core ETF as the broad-index lane and investable-proxy lane. Public display remains publicDataSource=mock and scoreSource=mock until source rights, field contract, cadence, and gate checks are accepted.`
2. `TWII and core ETF real-data promotion requires accepted source-rights scope, attribution, session-date and value-field contract, missing-session policy, readonly/readback readiness, bounded write-gate readiness, and rollback/fail-closed behavior.`
3. `The public page may describe Batch 1 readiness and blockers, but it must not imply real-time approval, Supabase-backed public data, real scoring, complete Taiwan-market coverage, or investment instructions.`

## Batch 1 Checklist Copy

| Checklist item | Public wording | What users can trust now | What is not yet claimed | Forbidden wording |
| --- | --- | --- | --- | --- |
| Source rights | `TWII and core ETF real display waits for accepted source rights, attribution, redistribution/display scope, and derived-display review.` | Users can trust that the page separates product demonstration from source approval. Mock labels remain intentional until accepted rights exist. | No claim that TWII or ETF data is approved for public redistribution, real display, derived scoring, permanent storage, or official-source use. | `real-time approved`; `official feed approved`; `source rights fully approved`; `unrestricted redistribution`; `publicDataSource=supabase approved`; `scoreSource=real approved` |
| Field contract | `Real display requires an accepted field contract for symbols, display names, session labels, close/level or price labels, change labels, source status, rights status, and attribution.` | Users can trust that visible fields will not be treated as real evidence until their meaning and display boundaries are reviewed. | No claim that TWII index fields, ETF price fields, precision, timezone, attribution, NAV, holdings, or premium/discount fields are accepted for public real display. | `field contract approved for real public use`; `all ETF fields approved`; `complete official fields`; `即時精準到秒`; `完整覆蓋全台股` |
| Update cadence | `Every Batch 1 public state needs a visible freshness label such as simulated, delayed, last updated, blocked, or approved cadence.` | Users can trust that cadence and freshness are treated as visible trust information, not hidden implementation detail. | No claim of real-time, live, second-level precision, official exchange timing, or always-current ETF/TWII updates. | `real-time approved`; `live now`; `即時精準到秒`; `official live cadence`; `always current` |
| Missing session rules | `If a session is missing, unclear, delayed, or outside accepted scope, the public page should say blocked, delayed, or mock instead of filling the gap silently.` | Users can trust that missing-session uncertainty should reduce claims and keep the visible state conservative. | No claim that all sessions are complete, all holidays and no-trade days are resolved, all historical gaps are repaired, or all Batch 1 rows are accepted. | `all sessions complete`; `no missing sessions`; `完整覆蓋全台股`; `all history imported`; `real-data coverage approved` |
| Readonly gate | `Readonly readiness is checked before any public real display; until it passes, Batch 1 stays mock-labeled or blocked.` | Users can trust that public copy will not pretend a local plan or partial review is production read readiness. | No claim that Supabase readonly, public read route, schema visibility, readback, or production database display is approved. | `publicDataSource=supabase approved`; `Supabase public reads approved`; `production read path ready`; `real public data live` |
| Write gate | `Write readiness is separate from public copy. No Batch 1 public wording should imply rows can be written, accepted, mutated, or promoted.` | Users can trust that this copy does not authorize writes and does not imply database mutation happened. | No claim that staging rows, `daily_prices`, candidate rows, ETF/TWII inserts, bounded writes, or write runners are approved. | `writes approved`; `daily_prices mutation approved`; `candidate rows accepted`; `scoreSource=real approved`; `publicDataSource=supabase approved` |
| Rollback/fail-closed | `If any Batch 1 gate fails, becomes unclear, or loses accepted status, the page should fall back to mock or blocked wording rather than continue real-data claims.` | Users can trust that uncertainty should make the product more conservative. The safe public fallback is mock, blocked, or delayed status. | No claim that rollback automation, incident response, production failover, or permanent real-data availability is complete. | `cannot fail`; `real data will always stay online`; `auto-recovery guaranteed`; `promotion cannot be rolled back`; `real-time approved` |

## Required Forbidden Wording

Do not use these phrases on public pages, PM briefing, launch notes, screenshots, captions, tooltips, status chips, or checklist summaries for Batch 1:

- `real-time approved`
- `scoreSource=real approved`
- `publicDataSource=supabase approved`
- `買進`
- `賣出`
- `收益承諾`
- `即時精準到秒`
- `完整覆蓋全台股`
- `正式投資訊號`

Also avoid equivalent claims:

- buy, sell, short, add leverage, exit all positions, enter a trade, or rebalance now;
- guaranteed return, guaranteed accuracy, loss avoidance, future direction certainty, or personalized suitability;
- real-time, live, official, complete, fully covered, production approved, real score, real model, accepted public promotion, or all-market coverage before separate gates pass.

## PM Integration Notes

Best three Batch 1 sentences for the mainline homepage or briefing:

1. `Batch 1 starts with TWII and core ETF so users can understand broad market pressure and ETF proxy context before wider stock or sector coverage is ready.`
2. `The page remains mock-labeled today because rights, field contract, cadence, missing-session rules, readonly/write gates, and rollback behavior are still under review.`
3. `Real display will be considered only after every Batch 1 trust gate is accepted; until then, this is a decision aid, not a formal investment signal or buy/sell instruction.`

PM should place one short Batch 1 status line near the first public Beta explanation, one mock/source boundary near TWII and ETF cards, and one non-investment-advice sentence near any pressure, score, or alert wording.

## A2 Conclusion

Batch 1 TWII + core ETF trust copy is ready for PM integration as a local-only, mock-preserving public-page copy packet. It preserves `publicDataSource=mock`, `scoreSource=mock`, no-SQL/no-Supabase/no-market-fetch boundaries, and forbids real-time, real-score, Supabase-approved, trading-instruction, return-promise, complete-coverage, and formal-investment-signal claims.
