# A2 TWII One-Shot Authorization Packet Public Copy Guard

Status: `a2_twii_one_shot_auth_packet_public_copy_guard_ready`

Date: 2026-06-12

Owner lane: A2 Public Copy / Trust Boundary

Integration owner: PM mainline

Mode: `local_only_public_copy_guard`

Gate context: TWII one-shot authorization packet without execution

## Purpose

This A2 support document defines safe public wording for the PM mainline TWII one-shot authorization packet without execution.

The packet may prepare a later bounded operator decision, but it is not execution, not SQL, not Supabase write, not staging-row creation, not `daily_prices` mutation, not real-data launch, not real scoring, and not investment advice.

## Non-Executable Boundary

This file is copy-only and local-only. It does not authorize or perform:

- SQL execution;
- Supabase connection, read, write, mutation, schema action, or dashboard operation;
- staging row creation;
- `daily_prices` mutation;
- TWII row insertion, import, backfill, merge, acceptance, or repair;
- market-data fetch, ingest, storage, commit, or raw-data review;
- raw payload, row payload, stock-id payload, source-body, provider-body, secret, env, credential, token, or authorization-value output;
- readonly rerun;
- real source promotion;
- `publicDataSource=supabase`;
- `scoreSource=real`;
- public launch completion claims.

Current public runtime boundary remains `publicDataSource=mock`.

Current scoring boundary remains `scoreSource=mock`.

## Public Copy That May Be Used

Homepage and `/briefing` may say:

- TWII one-shot authorization is being prepared for future review.
- The authorization packet is a decision packet, not an execution result.
- Public Beta remains in mock mode.
- Live TWII public data is not enabled.
- Real TWII scoring is not enabled.
- No TWII rows have been written, staged, imported, repaired, accepted, or promoted by this packet.
- No `daily_prices` repair has happened because of this packet.
- The packet exists to make a future bounded attempt auditable before any operator action.
- Signals, scores, briefings, watchlists, and alerts are reading aids only, not investment advice.

Preferred homepage copy:

> Public Beta remains in mock mode while TWII one-shot authorization is prepared for review. No live TWII data, database write, real scoring, or investment advice is enabled.

Compact homepage trust strip:

> Mock mode: TWII authorization packet prepared, not executed. No live data, no real scoring.

Preferred `/briefing` copy:

> TWII one-shot authorization is a local-only decision packet. It has not executed SQL, written Supabase, created staging rows, repaired `daily_prices`, promoted real data, or enabled real scoring. Public pages remain mock-facing until a separate PM-approved execution and promotion gate passes.

PM decision-support copy:

> Treat the TWII one-shot authorization packet as a pre-execution control. It may define a future command, expected scope, rollback, retention, and post-run review, but public copy must not describe the packet as a completed repair, live data launch, or investment signal.

## Public Copy That Must Not Be Used

Never say or imply:

- TWII authorization has been executed.
- TWII coverage repair is complete.
- TWII real-data launch is ready.
- Public pages are backed by Supabase.
- Live TWII public market data is enabled.
- Real TWII scoring is enabled.
- `publicDataSource=supabase` is active, approved, ready, or pending merge.
- `scoreSource=real` is active, approved, ready, or pending merge.
- TWII rows were inserted, staged, imported, accepted, repaired, backfilled, merged, or written.
- `daily_prices` was updated, repaired, backfilled, merged, or accepted.
- A one-shot packet is equal to source-rights approval, runtime promotion, or launch approval.
- Raw TWII market data was fetched, ingested, stored, committed, printed, summarized, or made available.
- The result validates market prediction, forecast accuracy, future returns, loss avoidance, timing quality, or trading reliance.
- The product gives buy, sell, hold, allocation, timing, suitability, or personalized investment advice.

Forbidden phrase examples:

- `TWII authorization executed successfully.`
- `TWII live data is now active.`
- `TWII coverage repair is complete.`
- `Supabase-backed TWII data is live.`
- `Real TWII scores are enabled.`
- `Rows were accepted into daily_prices.`
- `The one-shot packet wrote TWII rows.`
- `The dashboard is ready for TWII investment decisions.`
- `This alert tells users whether to buy or sell.`

## Homepage Safe Copy

Recommended homepage trust card:

> TWII real-data preparation is still controlled by gates. The current packet prepares a future bounded authorization review; it has not written data or enabled live scoring.

Recommended homepage footnote:

> Market signals shown in Public Beta are for product demonstration and reading assistance. They are not investment advice and should not be used as buy/sell instructions.

Recommended status chip:

> TWII: authorization packet prepared, not executed

Avoid homepage wording that uses:

- `live`;
- `real scoring`;
- `written`;
- `repaired`;
- `accepted`;
- `ready for investment decisions`;
- `buy`, `sell`, `hold`;
- `guaranteed`, `accurate`, `prediction`.

## `/briefing` Safe Copy

Recommended `/briefing` status block:

> TWII one-shot authorization packet is ready for PM review, but it remains non-executable in public copy. Current public mode is mock, current score mode is mock, and no database write or real-data promotion has occurred.

Recommended `/briefing` next-action wording:

> Next PM action: review whether the future one-shot attempt has exact scope, operator authority, rollback, retention, and post-run review. Do not describe this as completed data repair until a separate execution and post-run acceptance gate passes.

Recommended `/briefing` blocker wording:

> Blocked from public real-data claims until execution authorization, source-rights acceptance, aggregate readback, coverage acceptance, runtime promotion, and public-copy/legal review are all separately accepted.

## General Investor 30-Second Explanation

Use this Chinese explanation for general investors:

> 目前網站仍是公開 Beta 的示範模式。TWII 的 one-shot authorization packet 只是把未來「是否可以嘗試補資料」的條件整理清楚，還沒有執行、沒有寫入資料庫、沒有啟用真實 TWII 資料，也沒有啟用真實分數。因此現在看到的燈號與說明，是幫助理解產品如何呈現市場狀態，不是投資建議，也不是買賣指示。

Short version:

> TWII 仍在示範模式。授權包只是準備未來審核，尚未執行、尚未寫入、尚未啟用真實資料或真實分數。

## Mock / Real Boundary

| Surface | Current allowed state | Must not imply |
| --- | --- | --- |
| Homepage | Mock mode, authorization packet prepared, not executed | live TWII data, completed repair, real scoring, investment advice |
| `/briefing` | PM review context, `publicDataSource=mock`, `scoreSource=mock` | Supabase-backed public route, executed one-shot, real-data promotion |
| TWII status chip | prepared, pending review, gated, not executed | accepted rows, repaired coverage, official launch |
| TWII explanation card | broad-market reference under preparation | verified real-market signal, trading instruction, forecast certainty |
| Release notes | authorization packet preparation only | database mutation, staging creation, `daily_prices` repair |
| Support or FAQ copy | demonstration disclosure and non-advice boundary | personalized recommendation, suitability, buy/sell/hold instruction |

## UI Copy Acceptance Checklist

Before PM updates homepage, `/briefing`, status chips, tooltips, release notes, screenshots, support copy, or investor-facing explanations for the TWII one-shot authorization packet, confirm:

- Copy says the authorization packet is prepared or under review, not executed.
- Copy says Public Beta remains mock-facing unless a separate accepted promotion gate exists.
- Copy preserves `publicDataSource=mock`.
- Copy preserves `scoreSource=mock`.
- Copy does not imply Supabase-backed public data.
- Copy does not imply live TWII public data.
- Copy does not imply real scoring.
- Copy does not imply completed TWII coverage repair.
- Copy does not imply source-rights, redistribution, official-feed, derived-display, or public-display approval.
- Copy does not imply row acceptance, staging, import, backfill, write, merge, or `daily_prices` mutation.
- Copy does not include raw payloads, row payloads, stock-id payloads, source bodies, provider bodies, secrets, env values, authorization values, confirmation phrases, or real decision values.
- Copy keeps the non-investment-advice statement close to scores, pressure signals, summaries, rankings, watchlists, alerts, and `/briefing`.
- Copy avoids buy, sell, hold, allocation, timing, suitability, forecast-certainty, guaranteed-return, and loss-avoidance language.
- Copy is understandable without database knowledge on the homepage.
- Copy uses technical flags on `/briefing` only when they reinforce mock mode and blocked promotion.
- Copy routes next action to PM-controlled review, not immediate execution, retry, launch, runtime promotion, or public real-data activation.

Acceptance line for PM:

> Accept only if the UI copy keeps TWII one-shot authorization in non-executed, mock-facing, review-only language and does not convert the packet into public real-data, Supabase-backed, real-score, database-write, or investment-use claims.

## Boundary Statement

This file only guards public copy for the TWII one-shot authorization packet without execution. It does not change UI code, routes, checkers, packages, runtime configuration, SQL, Supabase state, market data, staging rows, `daily_prices`, row coverage scoring, `publicDataSource`, or `scoreSource`.
