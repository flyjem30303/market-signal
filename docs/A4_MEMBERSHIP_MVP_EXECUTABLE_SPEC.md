# A4 Membership MVP Executable Spec

Updated: 2026-06-14

Status: `a4_membership_mvp_executable_spec_ready`

Owner: A4 Membership / Conversion Planning

## Purpose

This document turns the revised `指數燈號網站 BRIEF` and the A4 free/member boundary into an executable Phase 2 membership MVP spec.

It is still planning-only. It does not approve or implement login, payment, persisted watchlists, personalized alert execution, member-only gating, SQL, Supabase writes, raw market-data fetches, `publicDataSource=supabase`, or `scoreSource=real`.

## CEO Decision

Phase 1 remains the mainline: public free index-lighting site first.

Phase 2 membership is a product path, not a Phase 1 blocker. A4 may prepare the minimum viable membership spec in parallel so Phase 2 can start faster later, but PM must keep execution focused on public usability, route health, data-boundary clarity, and non-investment-advice trust.

## Phase 2 MVP Scope

The first membership MVP should include exactly four product surfaces:

1. Member daily market three-layer interpretation.
2. Member watchlist for selected indices, ETFs, or indicators.
3. One custom alert condition MVP.
4. Post-market review report.

Anything outside these four surfaces is backlog unless PM explicitly reopens scope after Phase 1 is stable.

## Member Daily Three-Layer Interpretation

Purpose: help a member understand why the public light changed without receiving buy/sell advice.

Required sections:

1. Market overview: current market light, market mood, and one neutral summary.
2. Key indicator changes: which public indicators changed and why they matter.
3. Next observations: what to watch next, written as observation prompts.

Required wording rules:

- Use observe, review, compare, and wait language.
- Do not use buy, sell, hold, target price, promised-return, or personalized advice language.
- Include update time and data-boundary wording.
- Keep the summary short enough for a 3-minute member read.

## Watchlist MVP

Purpose: let members track a small set of markets without turning the product into a trading tool.

Minimum behavior:

- Add or remove selected indices, ETFs, or indicators.
- Show current light, last update time, and one short reason line.
- Keep the watchlist as observation context only.
- Do not connect to brokerage, portfolio allocation, holdings, or order execution.

Phase 1 public route may show only a preview of this future behavior.

## Custom Alert Condition MVP

Purpose: let members define one observation trigger.

First alert condition:

- Trigger when a selected symbol or indicator changes light state.

Required alert copy:

- Explain the state change and update time.
- Include `not investment advice` posture in user-facing wording.
- Use observation wording, not trading commands.

Not in MVP:

- price target alerts;
- personal portfolio alerts;
- order or broker execution;
- high-frequency real-time alerts;
- push notification infrastructure unless separately opened.

## Post-Market Review Report

Purpose: help members review whether the day's signals were useful or noisy.

Required sections:

1. Today light and market context.
2. Important changes since the prior session.
3. Useful signals and noisy signals.
4. Tomorrow observation checklist.
5. Non-investment-advice reminder.

The report may reuse the same public signal model, but Phase 2 must add clearer explanation and historical context.

## Analytics Event Spec

Phase 2 should track only product-learning events at first:

| Event | Purpose |
| --- | --- |
| `membership_preview_page_viewed` | Measures interest in the future member path. |
| `membership_preview_link_clicked` | Measures conversion intent from public pages. |
| `member_three_layer_read_started` | Measures member report consumption. |
| `member_watchlist_item_added` | Measures watchlist value. |
| `member_alert_condition_created` | Measures alert demand. |
| `member_post_market_review_opened` | Measures review-loop retention. |

Do not track sensitive brokerage, trading, portfolio, or credential data.

## A1 / A2 / A3 / A4 Coordination

- A1 provides source and coverage readiness only; A1 does not approve member runtime implementation.
- A2 reviews member wording before implementation.
- A3 reviews auth, deployment, rollback, monitoring, and platform implications before implementation.
- A4 owns this scope and may refine it, but PM remains the integration owner.

## Stop Lines

Do not implement during Phase 1:

- login;
- payment;
- persisted watchlist;
- personalized alert execution;
- member-only content gating;
- brokerage integration;
- portfolio allocation;
- buy/sell/hold guidance;
- promised returns;
- SQL execution;
- Supabase writes;
- `daily_prices` mutation;
- raw market-data fetch, store, or commit;
- `publicDataSource=supabase`;
- `scoreSource=real`.

## Completion Definition

This A4 planning slice is complete when:

- the four Phase 2 MVP surfaces are explicit;
- the first alert condition is defined;
- member content remains non-investment-advice;
- analytics events are named;
- A1/A2/A3/A4 coordination is explicit;
- Phase 1 remains the current mainline;
- a checker protects this document and the public membership preview.

## Next Route

`phase_1_public_runtime_then_phase_2_membership_mvp_implementation_gate`
