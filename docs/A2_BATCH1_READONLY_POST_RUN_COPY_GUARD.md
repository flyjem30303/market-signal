# A2 Batch1 Readonly Post-Run Copy Guard

Status: `a2_batch1_readonly_post_run_copy_guard_ready`
Updated: 2026-06-12
Owner lane: A2 Public Trust / Product Copy
Integration owner: PM mainline
Mode: `local_only_public_copy_guard`

## Purpose

This guard prepares public wording after the Batch1 readonly attempt post-run review.
It prevents an aggregate-only readonly result from being described as real launch, public runtime promotion,
real scoring, complete coverage, investment advice, or a Supabase-backed public data release.

This document is copy-only and local-only. It does not approve execution, runtime promotion, source promotion,
data writes, row acceptance, coverage scoring, deployment, or public claim expansion.

## Non-Executable Boundary

- Do not run SQL.
- Do not connect to Supabase.
- Do not read Supabase.
- Do not write Supabase.
- Do not create staging rows.
- Do not modify `daily_prices`.
- Do not fetch, ingest, store, commit, backfill, print, or summarize raw market data.
- Do not output secrets, env values, authorization values, confirmation phrases, row payloads, raw payloads, stock-id payloads, source bodies, provider bodies, or real decision values.
- Do not set or imply `publicDataSource=supabase`.
- Do not set or imply `scoreSource=real`.
- Do not provide buy, sell, hold, timing, allocation, expected-return, forecast-quality, performance, or reliance claims.

## 1. If Readonly Is OK, Public Pages May Say What

If PM accepts the post-run review as sanitized, aggregate-only readonly evidence, public pages may say only:

- A bounded readonly readiness check has been reviewed.
- The review helps PM assess data-readiness and runtime-readiness gaps.
- Public Beta remains mock-facing unless a separate PM-approved promotion gate changes that boundary.
- The result is aggregate-only and does not expose rows, raw payloads, stock-id payloads, source bodies, provider bodies, secrets, credentials, authorization values, or real decision values.
- Live public data is not enabled by readonly review alone.
- Real scoring is not enabled by readonly review alone.
- Coverage, freshness, source rights, and data quality may still be partial, gated, or under review.
- Signals, summaries, rankings, and watchlists remain reading aids only, not investment advice.

Preferred public pattern:

> PM has reviewed bounded aggregate-only readonly evidence. Public Beta remains mock-facing while coverage, freshness, source-rights, and runtime promotion gates stay under review. Live public data, real scoring, and investment advice are not enabled.

Shorter public pattern:

> A bounded readonly check has been reviewed, but the public site is not promoted to live data or real scoring.

## 2. If Blocked Or Incomplete, Public Pages May Say What

If the readonly attempt is blocked, incomplete, ambiguous, not reviewed, or not PM-accepted, public pages should keep pre-attempt/mock-only wording and may say:

- Readiness review is still blocked or incomplete.
- Public Beta remains in mock mode.
- Data coverage, freshness, source-rights, and runtime readiness are still being checked.
- Live public data is not enabled.
- Real scoring is not enabled.
- The product does not provide investment advice.

Preferred public pattern:

> Readiness review is still incomplete, so Public Beta remains in mock mode. Live public data and real scoring are not enabled, and signals remain reading aids only.

Blocked-state support pattern:

> Some readiness evidence is still unavailable or under review. Public pages should continue to describe the product as mock-facing Public Beta.

## 3. Always Forbidden Claims

Never say or imply:

- The readonly attempt is a real launch.
- The public site is launched with real data.
- Supabase is backing public pages.
- Public data is live.
- Real scores are available.
- `publicDataSource=supabase` is active.
- `scoreSource=real` is active.
- Complete coverage has been achieved.
- Row coverage has passed unless a separate PM-approved public-safe aggregate claim explicitly allows it.
- Rows were accepted, inserted, staged, imported, backfilled, or written.
- `daily_prices` was modified.
- Raw market data was fetched, ingested, stored, committed, printed, summarized, or made available.
- Source rights, provider approval, redistribution rights, or public display rights are approved unless a separate PM/A1/legal gate explicitly approves the exact public wording.
- The readonly result validates investment quality, forecast accuracy, timing quality, expected returns, or user reliance.
- Any score, signal, summary, ranking, watchlist, or briefing tells users to buy, sell, hold, allocate, time the market, avoid losses, expect profit, or rely on the product for financial decisions.

Unsafe phrase examples:

- "Readonly passed, so real launch is ready."
- "Live TWII data is now available."
- "Supabase-backed public data is active."
- "Real scores are enabled."
- "Coverage is complete."
- "Rows have been accepted into production."
- "`daily_prices` is updated."
- "The signal is validated for investing."
- "This is a buy/sell/hold indicator."
- "Users can rely on this forecast."

## 4. `/briefing` Technical Wording

`/briefing` may use technical wording only when it is framed as readiness context and not as public launch, live market guidance, or investment advice.

Allowed `/briefing` terms:

- `publicDataSource=mock`
- `scoreSource=mock`
- `mock-facing Public Beta`
- `bounded readonly check`
- `post-run review`
- `sanitized aggregate-only evidence`
- `readiness context`
- `coverage gate`
- `freshness gate`
- `source-rights gate`
- `runtime promotion still gated`
- `real scoring still gated`
- `PM review required`
- `fail-closed`

Preferred `/briefing` pattern when readonly is OK:

> `/briefing` remains `publicDataSource=mock` and `scoreSource=mock`. PM-reviewed aggregate-only readonly evidence is readiness context only; it does not enable live public data, real scoring, complete coverage, or investment advice.

Preferred `/briefing` pattern when blocked or incomplete:

> `/briefing` remains mock-facing because readonly post-run evidence is blocked or incomplete. Live public data, real scoring, and investment-use claims remain unavailable.

`/briefing` stop lines:

- Do not turn aggregate evidence into row-level detail.
- Do not turn post-run status into public launch status.
- Do not place technical flags in a way that contradicts visible mock-only copy.
- Keep the non-advice line close to summaries, rankings, watchlists, and action-oriented labels.

## 5. Homepage Wording

The homepage should lead with reader-facing language, not operator or database language.

Use:

- "Public Beta"
- "mock mode"
- "data is still being checked"
- "coverage may be incomplete"
- "freshness may be delayed"
- "live data is not enabled yet"
- "real scoring is not enabled yet"
- "signals are reading aids"
- "not investment advice"

Avoid on the homepage:

- attempt IDs;
- runner status;
- table names;
- staging concepts;
- authorization wording;
- row acceptance wording;
- source-body or provider-body wording;
- broad launch language;
- performance, forecast, or trading-reliance language.

Preferred homepage pattern when readonly is OK:

> Public Beta is still in mock mode while PM reviews aggregate-only readiness evidence. Live data and real scoring are not enabled yet. Signals are reading aids only, not investment advice.

Preferred homepage pattern when blocked or incomplete:

> Public Beta remains in mock mode while readiness review continues. Coverage or freshness may be incomplete, and live data is not enabled yet.

Compact homepage trust strip:

> Mock mode: data readiness under review. No live data, no real scoring, no investment advice.

## 6. PM-Ready Copy Lines

1. PM-reviewed readonly evidence is aggregate-only readiness context, not real launch.
2. Public Beta remains mock-facing unless a separate promotion gate explicitly changes the runtime boundary.
3. Live public data is not enabled by this readonly review.
4. Real scoring is not enabled by this readonly review.
5. Keep `publicDataSource=mock` visible anywhere technical status is shown.
6. Keep `scoreSource=mock` visible anywhere score status is shown.
7. Do not describe Supabase as connected, public, live, or backing public pages.
8. Do not describe coverage as complete unless a separate PM-approved public-safe coverage claim allows it.
9. Do not mention rows, raw payloads, stock-id payloads, source bodies, provider bodies, secrets, authorization values, confirmation phrases, or real decision values.
10. Do not say rows were accepted, staged, imported, backfilled, written, or merged.
11. Do not say or imply `daily_prices` changed.
12. If readonly is blocked or incomplete, keep the public site copy in mock-only readiness-review language.
13. If readonly is OK, say only that bounded aggregate-only readiness evidence was reviewed.
14. Signals, summaries, rankings, and watchlists are reading aids only.
15. No copy may provide buy/sell/hold guidance, allocation guidance, expected returns, performance promises, or personalized financial recommendations.

## Copy Review Checklist

Before PM accepts any public page, `/briefing`, homepage, release-note, SEO, support, or status wording, confirm:

- The copy does not convert readonly review into real launch.
- The copy preserves `publicDataSource=mock`.
- The copy preserves `scoreSource=mock`.
- The copy does not imply Supabase-backed public data.
- The copy does not imply live public data.
- The copy does not imply real scoring.
- The copy does not imply complete coverage.
- The copy does not imply source-rights/public-redistribution approval beyond a separately approved gate.
- The copy stays aggregate-only.
- The copy avoids rows, raw payloads, stock-id payloads, source bodies, provider bodies, secrets, env values, authorization values, confirmation phrases, and real decision values.
- The copy avoids SQL, Supabase read/write, staging row, `daily_prices`, row acceptance, raw market data, or market-data ingestion claims.
- The copy keeps non-investment-advice language near scores, signals, summaries, rankings, watchlists, and `/briefing`.

## Boundary Statement

This document only guards public and `/briefing` wording after Batch1 readonly post-run review.
It does not change UI, route code, PM gates, checkers, status boards, packages, runtime code, SQL,
Supabase state, market data, staging rows, `daily_prices`, row acceptance, row coverage scoring,
`publicDataSource`, or `scoreSource`.
