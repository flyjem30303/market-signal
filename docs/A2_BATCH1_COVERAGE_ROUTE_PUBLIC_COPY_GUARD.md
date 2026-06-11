# A2 Batch1 Coverage Route Public Copy Guard

Status: `a2_batch1_coverage_route_public_copy_guard_ready`

Date: 2026-06-12

Owner lane: A2 Public Copy / Trust Boundary

Integration owner: PM mainline

Mode: `local_only_public_copy_guard`

Source review: `docs/reviews/BATCH1_ROW_COVERAGE_READONLY_POST_RUN_REVIEW_2026-06-12.md`

## Purpose

This A2 support document converts the Batch 1 readonly post-run review into safe homepage and `/briefing` wording for the next PM route decision.

The recorded Batch 1 readonly result is blocked: `182/360` observed rows, `178` missing rows, and `aggregate_count_incomplete`. The result is useful diagnostic evidence only. It does not approve public real-data promotion, complete coverage, real scoring, investment-use claims, source-rights approval, row coverage points, row acceptance, or runtime readiness.

## Non-Executable Boundary

This file is copy-only and local-only. It does not authorize or perform:

- SQL execution;
- Supabase reads or writes;
- staging row creation;
- `daily_prices` mutation;
- market-data fetch, ingest, storage, or commit;
- raw payload, row payload, stock-id payload, source-body, provider-body, secret, env, or authorization-value output;
- row acceptance, row coverage scoring, or row coverage point award;
- public source promotion;
- `publicDataSource=supabase`;
- `scoreSource=real`;
- public launch completion claims.

Current public runtime boundary remains `publicDataSource=mock`.

Current scoring boundary remains `scoreSource=mock`.

## Public Copy That May Be Used

Homepage and `/briefing` may say:

- Batch 1 coverage review is still incomplete.
- Public Beta remains in mock mode.
- The latest bounded readonly review found `182/360` aggregate rows, so full Batch 1 coverage is not ready.
- `178` aggregate rows remain missing before Batch 1 can be treated as complete.
- The review confirms a readiness gap, not a public launch.
- Live public data is not enabled.
- Real scoring is not enabled.
- Coverage, source-rights, freshness, data quality, and runtime promotion remain gated.
- Signals, scores, summaries, rankings, watchlists, and briefings are reading aids only, not investment advice.

Preferred homepage copy:

> Public Beta remains in mock mode while Batch 1 coverage is repaired. The latest bounded readonly review found 182 of 360 expected aggregate rows, so live data and real scoring are not enabled yet. Signals are reading aids only, not investment advice.

Compact homepage trust strip:

> Mock mode: Batch 1 coverage incomplete. No live data, no real scoring, no investment advice.

Preferred `/briefing` copy:

> `/briefing` remains `publicDataSource=mock` and `scoreSource=mock`. Batch 1 readonly review is blocked at 182/360 aggregate rows, so this is readiness context only and does not enable live public data, real scoring, complete coverage, or investment-use claims.

PM route-decision support copy:

> Batch 1 should route to coverage repair for TWII, 0050, and 006208 before any public real-data promotion is considered.

## Public Copy That Must Not Be Used

Never say or imply:

- Batch 1 coverage is complete.
- The readonly post-run review passed for launch.
- Public pages are backed by Supabase.
- Live public market data is enabled.
- Real scoring is enabled.
- `publicDataSource=supabase` is active, approved, or ready.
- `scoreSource=real` is active, approved, or ready.
- Row coverage points were awarded.
- `daily_prices` was updated, repaired, backfilled, merged, or accepted.
- Rows were inserted, staged, imported, accepted, mutated, or written.
- Raw market data was fetched, ingested, stored, committed, printed, summarized, or made available.
- Source rights, redistribution rights, official feed status, or public display rights are approved.
- The result validates market prediction, forecast accuracy, future returns, loss avoidance, timing quality, or trading reliance.
- The product gives buy, sell, hold, allocation, timing, suitability, or personalized investment advice.

Forbidden phrase examples:

- `Coverage is complete.`
- `Readonly passed, so real launch is ready.`
- `Live TWII and ETF data is available.`
- `Supabase-backed public data is active.`
- `Real scores are enabled.`
- `Batch 1 can now use scoreSource=real.`
- `Rows were accepted into daily_prices.`
- `The dashboard is ready for investment decisions.`

## Mock / Real Boundary

| Surface | Current allowed state | Must not imply |
| --- | --- | --- |
| Homepage | Public Beta, mock mode, coverage incomplete, data readiness under review | live data, complete Batch 1, real scoring, investment advice |
| `/briefing` | `publicDataSource=mock`, `scoreSource=mock`, blocked readonly evidence, readiness context | Supabase-backed public route, real score route, launch approval |
| Batch 1 status | `182/360`, `178` missing, `aggregate_count_incomplete`, route decision pending | row coverage pass, row coverage points, accepted rows |
| TWII lane | `0/60` observed in aggregate review, route repair needed | accepted index rows, approved source rights, public official index feed |
| ETF lane | `0050` `1/60`, `006208` `1/60`, route repair needed | approved ETF redistribution, complete ETF coverage, public ETF live data |
| TW equity lane | three symbols complete in aggregate review only | full MVP completion or all-market completion |

Real-data wording may be reconsidered only after separate PM-accepted gates cover source rights, field contract, candidate artifact, bounded execution, aggregate readback, post-run review, row coverage scoring, public copy/legal review, rollback/fail-closed readiness, and explicit runtime promotion.

## 30-Second Investor Explanation

Use this plain-language explanation when the audience is a general investor:

> This Beta is still using simulated data. We ran a limited readonly coverage check for the first real-data batch, and it found only 182 of 360 expected aggregate rows. That means coverage is not complete yet, so the site should not be treated as live market data or a real trading signal. The dashboard can help you understand how market-pressure explanations will look, but it is not investment advice and does not tell you what to buy or sell.

Short version:

> Batch 1 is not ready for live use yet. Coverage is incomplete at 182/360, so the public experience stays mock-labeled and non-advisory.

## PM Route Decision UI Copy Acceptance Checklist

Before PM updates homepage, `/briefing`, status chips, tooltips, release notes, screenshots, or support copy after the route decision, confirm:

- Copy says Public Beta remains mock-facing unless PM has a separate accepted promotion gate.
- Copy preserves `publicDataSource=mock`.
- Copy preserves `scoreSource=mock`.
- Copy names the blocked result as `182/360` aggregate coverage only if numeric detail is useful for the surface.
- Copy keeps `178` missing rows framed as aggregate readiness context, not row payload detail.
- Copy does not imply Supabase-backed public data.
- Copy does not imply live public data.
- Copy does not imply real scoring.
- Copy does not imply complete coverage.
- Copy does not imply source-rights, redistribution, official-feed, or public-display approval.
- Copy does not imply row acceptance, staging, import, backfill, write, merge, or `daily_prices` mutation.
- Copy avoids raw payloads, row payloads, stock-id payloads, source bodies, provider bodies, secrets, env values, authorization values, confirmation phrases, and real decision values.
- Copy keeps the non-investment-advice sentence close to scores, signals, summaries, rankings, watchlists, alerts, and `/briefing`.
- Copy routes next action to PM-controlled coverage repair for incomplete lanes, not immediate retry, launch, or public promotion.
- Copy is understandable without database knowledge on the homepage.
- Copy can use technical flags on `/briefing` only when they reinforce mock mode and blocked promotion.

Acceptance line for PM:

> Accept only if the UI copy keeps Batch 1 in mock-facing coverage-repair language and does not convert the blocked readonly result into public real-data, real-score, or investment-use claims.

## Boundary Statement

This file only guards public copy after the Batch 1 coverage route review. It does not change UI code, routes, checkers, packages, runtime configuration, SQL, Supabase state, market data, staging rows, `daily_prices`, row coverage scoring, `publicDataSource`, or `scoreSource`.
