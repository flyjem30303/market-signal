# A2 Rollback Readiness Public Copy Risk Queue

Status: `a2_rollback_readiness_public_copy_risk_queue_ready`
Updated: 2026-06-11
Owner lane: A2 Frontend / UX Readability / Public Trust Copy
Integration owner: PM mainline
Mode: `local_only_copy_risk_queue`

## Purpose

This queue prepares public-site copy risks for future rollback readiness, rollback dry-run, rollback plan, rejected review, and repair-request states.

It is intentionally local-only and copy-only. It does not approve execution, rollback execution, SQL, Supabase access, Supabase writes, market-data import, row coverage, runtime promotion, scoring promotion, UI changes, deployment, or public claim changes.

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
- Do not touch PM mainline gate, checker, status, board, package, runtime config, source-promotion, or scoring-promotion files.
- Do not set `publicDataSource=supabase`.
- Do not set `scoreSource=real`.
- Do not imply current public data is real data.
- Do not imply a write was executed.
- Do not imply rollback was executed.
- Do not imply a rejected review was automatically repaired.
- Do not imply complete coverage.
- Do not imply investment advice, buy/sell/hold advice, personalized recommendation, or validated forecast quality.

## Core Copy Rule

`rollback-ready` means only that a rollback plan, rollback owner, rollback scope, or rollback dry-run posture may be prepared for a future gated action.

It must not be presented as evidence that data is live, a write already happened, an issue has been fixed, coverage is complete, public data is Supabase-backed, scoring is real, or investment guidance is approved.

`rejected review` means only that a named review failed or was not accepted within its own gate. It must not be presented as automatic repair, automatic fallback, automatic rollback, public data removal, or public risk resolution unless a later PM-approved artifact explicitly says so.

## High-Risk Misleading Implications

| Risk | How public copy can mislead users | Required safer framing | Queue priority |
|---|---|---|---:|
| Rollback-ready as public safety proof | "Rollback ready" can sound like production safeguards are already active for live public data. | Say rollback readiness is an internal preparedness state only. It does not prove public real-data activation, successful execution, or post-rollback verification. | P0 |
| Rollback-ready as write proof | Users may infer that a write occurred because rollback scope or rollback owner is named. | Say a rollback plan may exist before any write. Do not say or imply rows were inserted, reverted, or repaired. | P0 |
| Rollback-ready as automatic repair | "Ready to roll back" can imply any bad data or rejected state will self-correct. | Say repair, rollback execution, and post-rollback review require separate PM-approved actions. | P0 |
| Rejected review as public status change | "Rejected" can make users think public data was removed, corrected, downgraded, or blocked on the site. | Say rejected review is an internal gate outcome. Public copy remains mock-only unless PM separately changes runtime/source/scoring state. | P0 |
| Rejected review as data-quality guarantee | A rejection can be mistaken for proof that weak data cannot reach users. | Say the rejection reduces internal risk for that artifact only; it is not a full data-quality certification. | P1 |
| Coverage overclaim | Rollback or rejection handling can sound like the coverage gap is solved. | Keep coverage wording bounded by approved scope. Avoid "complete", "fully covered", "all rows", "all sessions", or "whole Taiwan market" unless a separate coverage gate approves it. | P0 |
| Public runtime promotion | Rollback readiness can be misread as safe enough to enable Supabase-backed public data. | Preserve `publicDataSource=mock` until PM explicitly approves a separate public runtime promotion gate. | P0 |
| Real-score implication | Risk-control language near scores can make the score feel production-grade. | Preserve `scoreSource=mock` until a dedicated scoring promotion gate approves otherwise. | P0 |
| Investment-advice implication | "Reviewed", "rejected", "rollback-ready", or "risk controlled" can make signals feel like vetted advice. | Keep non-advice wording near scores, rankings, watchlists, and action labels. | P0 |
| Legal/trust mismatch | Methodology, disclaimer, SEO, or snippets may sound stronger than the gated state. | Legal/trust copy and metadata must not claim live data, complete coverage, provider approval, automatic repair, or investment advice. | P1 |

## Public Surface Review Queue

| Priority | Public surface | Copy risk to review | A2 follow-up copy task | Must not claim |
|---:|---|---|---|---|
| 1 | Shared runtime state strip / trust banner | Rollback readiness may look like public real-data safety approval. | Keep first-line state as gated Beta/mock-only until PM approves public runtime promotion. | Real data is active, rollback has run, or Supabase-backed public data is enabled. |
| 2 | Data freshness strip | Rejected review or rollback wording may be confused with corrected freshness. | State freshness/readback context only when approved, and avoid implying repair or live timeliness. | Live market data, completed correction, or freshness certification. |
| 3 | Score/ranking/watchlist areas | Risk-control wording can make scores look validated or actionable. | Keep limitation copy near score clusters: not investment advice, not buy/sell/hold, not personalized recommendation, not validated forecast. | `scoreSource=real`, validated signal, or investment recommendation. |
| 4 | Stock detail pages | Symbol-level pages can make rollback scope look like symbol coverage has been repaired. | Keep symbol copy bounded: data may remain partial, delayed, unavailable, mock-derived, or internally rejected. | Symbol-level coverage is complete or repaired. |
| 5 | Weekly / briefing summaries | Internal rejection and repair status can sound like current market guidance. | Use Beta/product-evaluation framing and avoid route language that sounds like market calls. | Latest recommendation, full weekly coverage, or resolved data issue. |
| 6 | Methodology page | Prepared rollback controls can sound like full operational maturity. | Separate preparedness from execution, verification, source rights, quality acceptance, coverage, and scoring. | Production-grade model, completed rollback, or complete data governance. |
| 7 | Disclaimer / terms / privacy | Legal pages may lag behind risk-control language. | Ensure legal/trust pages are at least as restrictive as visible copy before any public claim changes. | Provider approval, source redistribution approval, or advisory status. |
| 8 | SEO metadata / Open Graph / snippets | Search snippets may omit gate boundaries. | Avoid "live", "real-time", "complete", "fixed", "approved", "safe", "advice", or "recommendation" phrasing. | Live data, automatic repair, complete coverage, or investment advice. |

## Safe Public Framing Pattern

When a public surface must reference rollback or review status, use this order:

1. Name the status as an internal review or preparedness state.
2. State that it does not mean public real-data display is active.
3. Preserve `publicDataSource=mock` and `scoreSource=mock` where technical flags are shown.
4. State that writes, rollback execution, repair, coverage scoring, and public promotion require separate PM-approved gates.
5. Keep non-investment-advice and model limitation wording near score, signal, ranking, watchlist, or action language.

Example safe shape:

> Rollback readiness is an internal preparedness checkpoint. It does not mean a write has executed, a rollback has run, public real data is live, or a rejected review has been repaired. The public site remains gated Beta/mock-only with `publicDataSource=mock` and `scoreSource=mock` until PM approves separate runtime, coverage, source-rights, and scoring gates.

## Unsafe Phrases Until Separately Approved

- `rollback-ready, so public data is safe`
- `rollback-ready, so the write is complete`
- `rollback-ready, so the issue is fixed`
- `rollback has already repaired the data`
- `rejected review automatically corrected`
- `rejected data was removed from public pages`
- `review rejected, so users are protected`
- `public real data is live`
- `Supabase-backed public data is enabled`
- `live market data`
- `real-time data`
- `fully covered`
- `complete Taiwan market coverage`
- `all rows are approved`
- `all coverage gaps are closed`
- `real score`
- `scoreSource=real`
- `validated investment signal`
- `validated forecast`
- `investment recommendation`
- `buy/sell/hold recommendation`
- `personalized investment advice`

## Rejected Review Copy Guardrails

| Rejected state | Public-copy risk | Required safer interpretation |
|---|---|---|
| Candidate artifact rejected | Sounds like public data was already blocked or repaired. | Internal artifact failed review only; public runtime and scoring remain unchanged. |
| Write implementation rejected | Sounds like attempted write was rolled back. | Implementation was not accepted; do not imply execution, rollback, or production mutation. |
| Post-run review rejected | Sounds like bad data was fixed or removed. | A later repair, rollback, or review gate is required before claiming correction. |
| Coverage scoring rejected | Sounds like coverage is known complete or incomplete for users. | State only the approved bounded scope; avoid broad public coverage claims. |
| Source-rights review rejected | Sounds like all public data is unauthorized or all source issues are resolved by removal. | Keep source/public-use wording pending and separate from runtime state. |
| Scoring promotion rejected | Sounds like scores are invalid investment advice or have been corrected. | Keep `scoreSource=mock`; describe score output as product-evaluation/mock-only unless PM approves otherwise. |

## A2 Acceptance Criteria

- This document remains local-only and copy-only.
- It contains no SQL, Supabase instructions, secrets, raw payloads, row payloads, stock-id payloads, source bodies, provider bodies, or market-data values.
- It does not modify UI code, PM mainline gate/checker/status/board/package files, runtime config, data files, `daily_prices`, source-rights artifacts, checker outputs, or scoring outputs.
- It treats rollback readiness as internal preparedness only.
- It treats rejected review as an internal gate outcome only.
- It explicitly blocks copy that equates rollback readiness or rejected review with public real-data activation, write execution, rollback execution, automatic repair, complete coverage, investment advice, or `scoreSource=real`.
- It preserves the safe public posture: `publicDataSource=mock` and `scoreSource=mock` until PM explicitly approves separate promotion gates.

## PM Intake Questions

1. Which public surfaces may mention rollback or rejected review status at all: visible page copy, technical disclosure, methodology, legal pages, SEO, or none?
2. Should rollback readiness be hidden from general users and reserved for internal/operator disclosure?
3. What exact wording should PM require before any rejected review state is described as repaired, remediated, or closed?
4. Which separate artifact must approve any public wording that says data was removed, reverted, corrected, or downgraded?
5. Should copy review be mandatory before any route displays rollback, rejected, repaired, or remediated language?

## Handoff Note

This queue is a preparation artifact only. It did not execute SQL, connect to Supabase, read Supabase, write Supabase, mutate `daily_prices`, fetch/import/ingest/store raw market data, output secrets, output raw/row/stock-id payloads, change runtime flags, change scoring, modify UI code, or modify PM mainline gate/checker/status/board/package files.
