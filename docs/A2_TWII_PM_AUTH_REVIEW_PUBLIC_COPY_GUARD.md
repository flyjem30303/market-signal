# A2 TWII PM Auth Review Public Copy Guard

Status: `a2_twii_pm_auth_review_public_copy_guard_ready`

Date: 2026-06-12

Owner lane: A2 Public Copy / Trust Boundary

Integration owner: PM mainline

Mode: `local_only_public_copy_guard`

Gate context: PM review decision without execution for TWII future one-time authorization packet

## Purpose

This A2 support document defines safe public wording for the PM review decision without execution.

The PM review may classify a future TWII authorization packet as `accepted`, `rejected`, or `needs-repair`, but the review decision is not SQL execution, not Supabase write, not staging-row creation, not `daily_prices` mutation, not TWII coverage repair, not real-data launch, not real scoring, and not investment advice.

## Non-Executable Boundary

This file is copy-only and local-only. It does not authorize or perform:

- SQL execution;
- Supabase connection, read, write, mutation, schema action, or dashboard operation;
- staging row creation;
- `daily_prices` mutation;
- TWII row insertion, import, backfill, merge, acceptance, or repair;
- market-data fetch, ingest, storage, commit, or raw-data review;
- raw payload, row payload, stock-id payload, source body, provider body, secret, env, credential, token, or authorization-value output;
- readonly rerun;
- real source promotion;
- `publicDataSource=supabase`;
- `scoreSource=real`;
- public launch completion claims.

Current public runtime boundary remains `publicDataSource=mock`.

Current scoring boundary remains `scoreSource=mock`.

## Public Copy That May Be Used

Homepage and `/briefing` may say:

- PM review classified the future TWII authorization packet.
- PM review is a decision record, not an execution result.
- Public Beta remains in mock mode.
- Live TWII public data is not enabled.
- Real TWII scoring is not enabled.
- No TWII rows have been written, staged, imported, repaired, accepted, or promoted by the PM review.
- No `daily_prices` repair has happened because of the PM review.
- The review exists to decide whether a later bounded attempt is ready, blocked, or needs repair before any operator action.
- Signals, scores, briefings, watchlists, and alerts are reading aids only, not investment advice.

Preferred homepage copy:

> Public Beta remains in mock mode while PM reviews the TWII authorization packet. The review records readiness only; no database write, live TWII data, real scoring, or investment advice is enabled.

Compact homepage trust strip:

> Mock mode: TWII PM review recorded, not executed. No live data, no real scoring.

Preferred `/briefing` copy:

> TWII PM review is a local-only decision record. It has not executed SQL, written Supabase, created staging rows, repaired `daily_prices`, promoted real data, or enabled real scoring. Public pages remain mock-facing until a separate PM-approved execution and promotion gate passes.

PM decision-support copy:

> Treat PM review as a control decision for a future one-time attempt. It may classify the packet as accepted, rejected, or needs-repair, but public copy must not describe that classification as completed data repair, live data launch, or investment signal.

## Public Copy That Must Not Be Used

Never say or imply:

- TWII authorization has been executed.
- PM review wrote, staged, imported, repaired, accepted, or promoted TWII rows.
- TWII coverage repair is complete.
- TWII real-data launch is ready.
- Public pages are backed by Supabase.
- Live TWII public market data is enabled.
- Real TWII scoring is enabled.
- `publicDataSource=supabase` is active, approved, ready, or pending merge.
- `scoreSource=real` is active, approved, ready, or pending merge.
- `daily_prices` was updated, repaired, backfilled, merged, or accepted.
- PM review is equal to execution authorization, source-rights approval, runtime promotion, or launch approval.
- Raw TWII market data was fetched, ingested, stored, committed, printed, summarized, or made available.
- The result validates market prediction, forecast accuracy, future returns, loss avoidance, timing quality, or trading reliance.
- The product gives buy, sell, hold, allocation, timing, suitability, or personalized investment advice.

Forbidden phrase examples:

- `TWII PM review executed successfully.`
- `PM accepted TWII rows into daily_prices.`
- `TWII live data is now active.`
- `TWII coverage repair is complete.`
- `Supabase-backed TWII data is live.`
- `Real TWII scores are enabled.`
- `Rows were accepted into daily_prices.`
- `The dashboard is ready for TWII investment decisions.`
- `This alert tells users whether to buy or sell.`

## Decision Label Boundaries

| PM review label | Public-safe meaning | Must not imply |
| --- | --- | --- |
| `accepted` | PM accepts the packet as ready for a separate future operator decision | SQL executed, Supabase written, rows accepted, `daily_prices` repaired, real data launched |
| `rejected` | PM rejects the packet for now; future execution is blocked until a new packet is prepared | failed market data, invalid TWII data, user-facing outage, investment signal failure |
| `needs-repair` | PM requires fixes before any future operator decision can be considered | partial execution, partial write, partial row acceptance, production incident |

Accepted-safe wording:

> PM review accepted the TWII packet for future bounded authorization review. This is not execution and does not enable live TWII data.

Rejected-safe wording:

> PM review rejected the current TWII packet. No execution occurred, and Public Beta remains mock-facing.

Needs-repair-safe wording:

> PM review marked the TWII packet as needs-repair. The packet must be corrected before any future bounded attempt can be considered.

## Homepage Safe Copy

Recommended homepage trust card:

> TWII real-data preparation is still controlled by gates. PM review records whether the future authorization packet is ready, rejected, or needs repair; it has not written data or enabled live scoring.

Recommended homepage footnote:

> Market signals shown in Public Beta are for product demonstration and reading assistance. They are not investment advice and should not be used as buy/sell instructions.

Recommended status chips:

- `TWII: PM review accepted, not executed`
- `TWII: PM review rejected, not executed`
- `TWII: PM review needs repair, not executed`

Avoid homepage wording that uses:

- `live`;
- `real scoring`;
- `written`;
- `repaired`;
- `rows accepted`;
- `ready for investment decisions`;
- `buy`, `sell`, `hold`;
- `guaranteed`, `accurate`, `prediction`.

## `/briefing` Safe Copy

Recommended `/briefing` status block:

> TWII PM review decision is recorded for the future authorization packet, but it remains non-executable in public copy. Current public mode is mock, current score mode is mock, and no database write or real-data promotion has occurred.

Recommended `/briefing` next-action wording:

> Next PM action: if the review is accepted, prepare a separate operator decision gate with exact scope, authority, rollback, retention, and post-run review. If rejected or needs-repair, repair the packet before any future execution request.

Recommended `/briefing` blocker wording:

> Blocked from public real-data claims until execution authorization, source-rights acceptance, aggregate readback, coverage acceptance, runtime promotion, and public-copy/legal review are all separately accepted.

## General Investor 30-Second Explanation

Use this Chinese explanation for general investors:

> 目前網站仍是示範模式。PM review 只是內部審核 TWII 後續資料修補包是否可以進入下一個授權階段，並不是已經把資料寫入資料庫，也不是已經啟用真實 TWII 資料或真實分數。即使審核結果是 accepted，也只代表「可以準備下一個受控步驟」，不代表資料已上線。網站上的燈號與摘要仍是閱讀輔助，不是買賣建議。

Short version:

> TWII PM review 是審核紀錄，不是執行結果。資料尚未寫入，真實資料與真實分數尚未上線，網站仍維持示範模式。

## Mock / Real Boundary

| Surface | Current allowed state | Must not imply |
| --- | --- | --- |
| Homepage | Mock mode, PM review recorded, not executed | live TWII data, completed repair, real scoring, investment advice |
| `/briefing` | PM review context, `publicDataSource=mock`, `scoreSource=mock` | Supabase-backed public route, executed one-shot, real-data promotion |
| TWII status chip | accepted/rejected/needs-repair, not executed | accepted rows, repaired coverage, official launch |
| TWII explanation card | broad-market reference under preparation | verified real-market signal, trading instruction, forecast certainty |
| Release notes | PM review decision only | database mutation, staging creation, `daily_prices` repair |
| Support or FAQ copy | demonstration disclosure and non-advice boundary | personalized recommendation, suitability, buy/sell/hold instruction |

## UI Copy Acceptance Checklist

Before PM updates homepage, `/briefing`, status chips, tooltips, release notes, screenshots, support copy, or investor-facing explanations for the TWII PM review decision, confirm:

- Copy says PM review is recorded or classified, not executed.
- Copy says Public Beta remains mock-facing unless a separate accepted promotion gate exists.
- Copy preserves `publicDataSource=mock`.
- Copy preserves `scoreSource=mock`.
- Copy does not imply Supabase-backed public data.
- Copy does not imply live TWII public data.
- Copy does not imply real scoring.
- Copy does not imply completed TWII coverage repair.
- Copy does not imply source-rights, redistribution, official-feed, derived-display, or public-display approval.
- Copy does not imply row acceptance, staging, import, backfill, write, merge, or `daily_prices` mutation.
- Copy keeps `accepted`, `rejected`, and `needs-repair` as PM review labels only.
- Copy does not include raw payloads, row payloads, stock-id payloads, source bodies, provider bodies, secrets, env values, authorization values, confirmation phrases, or real decision values.
- Copy keeps the non-investment-advice statement close to scores, pressure signals, summaries, rankings, watchlists, alerts, and `/briefing`.
- Copy avoids buy, sell, hold, allocation, timing, suitability, forecast-certainty, guaranteed-return, and loss-avoidance language.
- Copy is understandable without database knowledge on the homepage.
- Copy uses technical flags on `/briefing` only when they reinforce mock mode and blocked promotion.
- Copy routes next action to PM-controlled review and later operator decision, not immediate execution, retry, launch, runtime promotion, or public real-data activation.

Acceptance line for PM:

> Accept only if the UI copy keeps TWII PM review in non-executed, mock-facing, review-only language and does not convert `accepted`, `rejected`, or `needs-repair` into public real-data, Supabase-backed, real-score, database-write, or investment-use claims.

## Boundary Statement

This file only guards public copy for the TWII PM review decision without execution. It does not change UI code, routes, checkers, packages, runtime configuration, SQL, Supabase state, market data, staging rows, `daily_prices`, row coverage scoring, `publicDataSource`, or `scoreSource`.
