# A2 TWII Coverage Repair Gate Public Copy Guard

Status: `a2_twii_coverage_repair_gate_public_copy_guard_ready`

Date: 2026-06-12

Owner lane: A2 Public Copy / Trust Boundary

Integration owner: PM mainline

Mode: `local_only_public_copy_guard`

Gate context: TWII first coverage repair gate

## Purpose

This A2 support document defines safe homepage and `/briefing` wording for the TWII first coverage repair gate.

The gate is local-only authorization preparation. It may help PM explain why TWII coverage repair is still gated, what users can understand from the Beta today, and which public claims must stay blocked. It is not SQL execution, Supabase write authorization, staging-row creation, `daily_prices` repair, real-data promotion, real scoring, or public launch approval.

## Non-Executable Boundary

This file is copy-only and local-only. It does not authorize or perform:

- SQL execution;
- Supabase connection, read, write, mutation, or schema action;
- staging row creation;
- `daily_prices` mutation;
- TWII row insertion, import, backfill, merge, acceptance, or repair;
- market-data fetch, ingest, storage, commit, or raw-data review;
- raw payload, row payload, stock-id payload, source-body, provider-body, secret, env, credential, token, or authorization-value output;
- real source promotion;
- `publicDataSource=supabase`;
- `scoreSource=real`;
- public launch completion claims.

Current public runtime boundary remains `publicDataSource=mock`.

Current scoring boundary remains `scoreSource=mock`.

## Public Copy That May Be Used

Homepage and `/briefing` may say:

- TWII coverage repair is still in preparation.
- Public Beta remains in mock mode.
- TWII is being reviewed as the first broad-market coverage repair lane.
- The current work prepares the wording and trust boundary for a future PM decision.
- Live public TWII data is not enabled.
- Real TWII scoring is not enabled.
- TWII source rights, field contract, coverage sufficiency, missing-session handling, freshness labels, data quality, runtime promotion, rollback behavior, and public-copy/legal review remain gated.
- Signals, scores, pressure summaries, alerts, watchlists, and briefings are reading aids only, not investment advice.

Preferred homepage copy:

> Public Beta remains in mock mode while TWII coverage repair is prepared. Live TWII data and real scoring are not enabled yet. Signals are reading aids only, not investment advice.

Compact homepage trust strip:

> Mock mode: TWII coverage repair pending. No live data, no real scoring, no investment advice.

Preferred `/briefing` copy:

> `/briefing` remains `publicDataSource=mock` and `scoreSource=mock`. TWII first coverage repair is a local-only preparation gate, so it supports readiness review but does not enable live public data, Supabase-backed display, real scoring, or investment-use claims.

PM route-decision support copy:

> TWII should stay in coverage-repair language until PM separately accepts source rights, field contract, coverage evidence, runtime read/write readiness, post-run review, rollback behavior, and public-copy/legal readiness.

## Public Copy That Must Not Be Used

Never say or imply:

- TWII coverage repair is complete.
- TWII real-data launch is ready.
- Public pages are backed by Supabase.
- Live public TWII market data is enabled.
- Real TWII scoring is enabled.
- `publicDataSource=supabase` is active, approved, ready, or pending merge.
- `scoreSource=real` is active, approved, ready, or pending merge.
- TWII rows were inserted, staged, imported, accepted, repaired, backfilled, merged, or written.
- `daily_prices` was updated, repaired, backfilled, merged, or accepted.
- Raw TWII market data was fetched, ingested, stored, committed, printed, summarized, or made available.
- Source rights, redistribution rights, official feed status, public display rights, or derived-display rights are approved.
- The result validates market prediction, forecast accuracy, future returns, loss avoidance, timing quality, or trading reliance.
- The product gives buy, sell, hold, allocation, timing, suitability, or personalized investment advice.

Forbidden phrase examples:

- `TWII coverage is complete.`
- `TWII live data is ready.`
- `Supabase-backed TWII data is active.`
- `Real TWII scores are enabled.`
- `Batch 1 can now use publicDataSource=supabase.`
- `TWII can now use scoreSource=real.`
- `Rows were accepted into daily_prices.`
- `Raw TWII data has been imported.`
- `The dashboard is ready for TWII investment decisions.`

## General Investor 30-Second Explanation

Use this plain-language explanation when the audience is a general investor:

> This Beta is still using simulated data. TWII coverage repair is being prepared so the team can later review whether the broad Taiwan market reference can move toward real display. That review has not approved live data or real scoring. For now, the dashboard only shows how the market-pressure explanation experience will work. It is not investment advice and does not tell you what to buy or sell.

Short version:

> TWII is still in mock-labeled coverage repair. Live data and real scoring are not enabled, so the page is a learning aid, not an investment signal.

Chinese-facing version:

> 目前公開 Beta 仍是模擬資料模式。TWII 覆蓋修復只是準備後續審查，還沒有啟用即時或正式市場資料，也沒有啟用真實分數。頁面可以幫助你理解壓力說明會怎麼呈現，但不是投資建議，也不代表買賣訊號。

## Mock / Real Boundary

| Surface | Current allowed state | Must not imply |
| --- | --- | --- |
| Homepage | Public Beta, mock mode, TWII coverage repair pending | live TWII data, complete TWII coverage, real scoring, investment advice |
| `/briefing` | `publicDataSource=mock`, `scoreSource=mock`, local-only readiness context | Supabase-backed public route, real score route, launch approval |
| TWII status chip | mock, pending repair, under review, gated | accepted rows, official feed approval, complete coverage |
| TWII explanation card | broad-market reference under preparation | verified real market evidence, trading signal, forecast promise |
| Release notes | copy/readiness preparation only | data mutation, write attempt, staging creation, `daily_prices` repair |
| Support or FAQ copy | simulated-data disclosure and non-advice boundary | personalized recommendation, suitability, buy/sell/hold instruction |

Real-data wording may be reconsidered only after separate PM-accepted gates cover source rights, field contract, candidate artifact, bounded execution authorization, aggregate readback, post-run review, coverage acceptance, public copy/legal review, rollback/fail-closed readiness, and explicit runtime promotion.

## UI Copy Acceptance Checklist

Before PM updates homepage, `/briefing`, status chips, tooltips, release notes, screenshots, support copy, or investor-facing explanations for TWII coverage repair, confirm:

- Copy says Public Beta remains mock-facing unless PM has a separate accepted promotion gate.
- Copy preserves `publicDataSource=mock`.
- Copy preserves `scoreSource=mock`.
- Copy describes TWII coverage repair as preparation, review, pending, gated, or incomplete.
- Copy does not imply Supabase-backed public data.
- Copy does not imply live public data.
- Copy does not imply real scoring.
- Copy does not imply complete TWII coverage.
- Copy does not imply source-rights, redistribution, official-feed, derived-display, or public-display approval.
- Copy does not imply row acceptance, staging, import, backfill, write, merge, or `daily_prices` mutation.
- Copy does not include raw payloads, row payloads, stock-id payloads, source bodies, provider bodies, secrets, env values, authorization values, confirmation phrases, or real decision values.
- Copy keeps the non-investment-advice sentence close to scores, pressure signals, summaries, rankings, watchlists, alerts, and `/briefing`.
- Copy avoids buy, sell, hold, allocation, timing, suitability, forecast-certainty, guaranteed-return, and loss-avoidance language.
- Copy is understandable without database knowledge on the homepage.
- Copy uses technical flags on `/briefing` only when they reinforce mock mode and blocked promotion.
- Copy routes next action to PM-controlled TWII coverage repair review, not immediate retry, launch, runtime promotion, or public real-data activation.

Acceptance line for PM:

> Accept only if the UI copy keeps TWII in mock-facing coverage-repair language and does not convert a local-only preparation gate into public real-data, Supabase-backed, real-score, or investment-use claims.

## Boundary Statement

This file only guards public copy for the TWII first coverage repair gate. It does not change UI code, routes, checkers, packages, runtime configuration, SQL, Supabase state, market data, staging rows, `daily_prices`, row coverage scoring, `publicDataSource`, or `scoreSource`.
