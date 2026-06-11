# A2 Final Execution Packet Public Copy Guard

Status: `a2_final_execution_packet_public_copy_guard_ready`
Updated: 2026-06-11
Owner lane: A2 Frontend / UX Readability / Public Trust Copy
Integration owner: PM mainline
Mode: `local_only_public_copy_guard`

## Purpose

This guard prepares public-site copy and external operating language for the moment when a future final execution packet preflight appears ready.

It prevents `packet ready`, `preflight ready`, or `final execution packet ready` from being mistaken for execution approval, public data activation, complete coverage, source promotion, scoring promotion, launch completion, or investment advice.

This document is local-only and copy-only. It does not approve execution, deployment, source rights, row coverage scoring, runtime promotion, scoring promotion, data ingestion, public launch, or public copy changes.

## Non-Executable Boundary

- Do not run SQL.
- Do not connect to Supabase.
- Do not read Supabase.
- Do not write Supabase.
- Do not mutate `daily_prices`.
- Do not fetch, import, ingest, store, commit, print, or summarize raw market data.
- Do not read or output secrets.
- Do not output raw payload, row payload, stock-id payload, source body, provider body, or row-level market values.
- Do not touch UI code.
- Do not touch PM mainline gate, checker, status, board, package, runtime config, or source-promotion files.
- Do not set `publicDataSource=supabase`.
- Do not set `scoreSource=real`.

## Core Guard

`final execution packet preflight ready` means only that a local packet appears prepared for PM review inside its own preflight boundary.

It is not any of the following:

- execution approved;
- execution completed;
- data live;
- public runtime promoted;
- complete row coverage;
- complete symbol, session, field, asset-class, or market coverage;
- source-rights approval;
- public redistribution approval;
- provider authorization;
- source promotion;
- scoring promotion;
- `publicDataSource=supabase`;
- `scoreSource=real`;
- launch complete;
- investment advice, buy/sell/hold guidance, personalized recommendation, validated forecast, or model-quality certification.

## Public Website Copy Guard

| Public surface | Risk after packet-ready language appears | Required safe wording boundary |
|---|---|---|
| Shared trust strip | Users may think the site is now using live approved data. | Say the public site remains gated and mock-only until PM explicitly approves public runtime promotion. |
| Data freshness strip | Preflight timing can look like live freshness or data-quality proof. | Say freshness or readback context is not live-market approval, complete coverage, source approval, or scoring approval. |
| Score, ranking, and watchlist areas | Packet readiness can make scores look investable or production-grade. | Keep `scoreSource=mock` and non-advice language near any score, signal, ranking, or action label. |
| Symbol or asset detail pages | A specific page can make partial data look complete for that symbol. | State that coverage may still be partial, delayed, unavailable, or mock-derived unless a separate coverage and public-use gate approves stronger wording. |
| Weekly or briefing pages | Operational progress can sound like current market guidance. | Frame summaries as Beta/product-flow context, not latest market advice or complete market analysis. |
| Methodology page | Packet readiness can be mistaken for model validation. | Separate data-pipeline readiness from model validation and investment usefulness. |
| Disclaimer, privacy, and terms | Legal/trust pages may lag behind stronger public claims. | No public phrase may be stronger than the matching legal/trust limitation language. |
| SEO metadata and social snippets | Short snippets may omit the limitations and overclaim. | Avoid live, real-time, complete, source-approved, real-score, recommendation, or advice wording. |

## External Operations Talking Points

Use this posture for support replies, release notes, internal-to-external summaries, stakeholder updates, and any non-UI public-facing communication.

Safe language:

- `A final execution packet preflight is prepared for PM review. It is not execution approval.`
- `Public data display remains gated until separate runtime, source-rights, coverage, and scoring gates are approved.`
- `The public site remains in mock-only Beta posture unless PM explicitly promotes the public data source.`
- `Coverage claims remain bounded and may still be partial by asset, symbol, session, field, or data lane.`
- `Source-rights and public-use wording remain subject to PM/A1/legal approval.`
- `Scores and summaries remain non-advisory and must not be treated as buy, sell, hold, personalized, or validated forecast guidance.`

Unsafe language until separately approved:

- `execution approved`
- `execution completed`
- `data is live`
- `live market data`
- `real data is enabled`
- `launch is complete`
- `coverage is complete`
- `full Taiwan market coverage`
- `all rows are approved`
- `source promotion approved`
- `source-rights approved for public use`
- `provider-approved public display`
- `Supabase-backed public data is enabled`
- `real score`
- `validated signal`
- `validated forecast`
- `investment recommendation`
- `buy/sell/hold recommendation`
- `personalized investment advice`

## Copy Review Questions Before Any Public Change

1. Which PM gate explicitly approved execution, and does it say public copy may mention it?
2. Which PM gate explicitly approved public runtime promotion, and does it change the current mock-only public posture?
3. Which scoring gate explicitly approved any move away from `scoreSource=mock`?
4. Which coverage gate defines the exact approved scope by asset, symbol, session, field, and missing-data downgrade rule?
5. Which source-rights or legal gate approved public display, attribution, retention, redistribution, and provider/source wording?
6. Which public surfaces are approved for language changes: visible route copy, shared trust strips, methodology, legal pages, SEO metadata, release notes, or support replies?
7. What limitation text must remain adjacent to scores, rankings, watchlists, summaries, and action labels?

## Minimal Public Copy Pattern

When public copy must mention packet readiness, use this order:

1. Name the packet-ready state as an internal preflight milestone.
2. Say it is not execution approval.
3. Say public data remains gated and mock-only unless PM separately promotes runtime state.
4. Say coverage remains bounded and may be incomplete.
5. Say source-rights/public-use approval remains separate.
6. Say scores, rankings, and summaries are not investment advice.

Example:

> A final execution packet preflight is prepared for PM review. This does not approve execution, public real-data display, complete coverage, source promotion, or real scoring. The public site remains in gated Beta/mock-only posture until separate PM-approved runtime, source-rights, coverage, and scoring gates say otherwise. Scores and summaries are not investment advice.

## Stop Lines

Stop and route back to PM if any proposed public or external copy:

- treats packet readiness as execution approval;
- treats preflight readiness as a completed run;
- says or implies public data is live;
- says or implies coverage is complete without a separate approved coverage gate;
- says or implies source promotion or public source rights are approved;
- says or implies `publicDataSource=supabase`;
- says or implies `scoreSource=real`;
- presents scores, rankings, summaries, or watchlists as investment advice;
- removes or weakens mock-only, partial-coverage, source-rights, or non-advice limitations;
- uses stronger language in SEO, release notes, or support replies than visible route copy and legal/trust pages.

## A2 Acceptance Criteria

- This file remains local-only and copy-only.
- It contains no SQL, Supabase instructions, secrets, raw payloads, row payloads, stock-id payloads, source bodies, provider bodies, or row-level market values.
- It does not modify UI code, PM mainline gate/checker/status/board/package files, runtime config, data files, `daily_prices`, source-rights artifacts, or checker outputs.
- It treats final execution packet preflight readiness as an internal PM-review milestone only.
- It explicitly blocks copy that equates packet readiness with execution approval, data live, complete coverage, source promotion, real scoring, launch completion, or investment advice.
- It keeps public language bounded by mock-only runtime, partial-coverage risk, separate source-rights/public-use gates, separate scoring gates, and non-advice limitations.

## Handoff Note

This guard is a preparation artifact for future A2 copy review. It did not execute SQL, connect to Supabase, read Supabase, write Supabase, mutate `daily_prices`, fetch/import/ingest/store raw market data, output secrets, output raw/row/stock-id payloads, change runtime flags, change scoring, modify UI code, or modify PM mainline gate/checker/status/board/package files.
