# A2 Public Beta Readonly Copy Guard

Status: `a2_public_beta_readonly_copy_guard_ready`
Updated: 2026-06-12
Owner lane: A2 Public Trust / Product Copy
Integration owner: PM mainline
Mode: `bounded_local_only_public_copy_guard`

## Purpose

This guard defines what public pages and `/briefing` may say before and after a bounded readonly attempt.
It is a copy reference for public trust, product wording, and PM review only.

This is not a UI patch, not a runtime action, not a gate/checker/status/board/package change, not a
Supabase action, not a market-data action, not a source promotion, and not an investment decision surface.

## Non-Executable Boundary

- Do not run SQL.
- Do not connect to Supabase.
- Do not read Supabase.
- Do not write Supabase.
- Do not create staging rows.
- Do not modify `daily_prices`.
- Do not fetch, ingest, store, commit, or backfill raw market data.
- Do not output secrets, env values, authorization values, confirmation phrases, row payloads, raw payloads, stock-id payloads, source bodies, provider bodies, or real decision values.
- Do not set or imply `publicDataSource=supabase`.
- Do not set or imply `scoreSource=real`.
- Do not present scores, rankings, watchlists, summaries, or signals as buy/sell/hold advice, price forecasts, allocation guidance, expected return, guaranteed performance, or personal investment recommendations.

## Public Pages Before Readonly Attempt

Before a separately approved bounded readonly attempt has completed and passed PM review, public pages may say:

- The public Beta is still a mock-facing product-flow and market-reading experience.
- Runtime data remains in a gated readiness state.
- Coverage, freshness, and source status are still being checked.
- Some market data may be missing, stale, delayed, unavailable, or unvalidated.
- Scores and summaries are model-limited public Beta aids, not real trading signals.
- `publicDataSource=mock` remains the public runtime boundary.
- `scoreSource=mock` remains the public score boundary.
- A future readonly check may help PM assess readiness, but it has not made public data live.

Preferred public pattern:

> Public Beta is running in mock mode while data coverage, source rights, freshness, and runtime readiness are reviewed. Signals are reading aids only, not investment advice.

## Public Pages After Readonly Attempt

After a bounded readonly attempt, public pages may only change wording if PM has accepted a sanitized, aggregate-only post-run review. Even then, public copy may say only:

- A bounded readonly check was reviewed by PM.
- The check informs readiness review, not public runtime promotion.
- Public Beta remains mock-facing unless a separate promotion gate explicitly changes the runtime boundary.
- Any mentioned result must stay aggregate-only and must avoid rows, raw payloads, stock-id payloads, secrets, credentials, source bodies, provider bodies, and real decision values.
- `publicDataSource=mock` remains active unless a separate approved promotion explicitly changes it.
- `scoreSource=mock` remains active unless a separate approved promotion explicitly changes it.
- The product still does not provide investment advice.

Preferred public pattern:

> PM has reviewed bounded readiness evidence, but public Beta remains mock-facing. Live public data, real scoring, and investment-use claims are not enabled.

If the attempt is blocked, incomplete, ambiguous, or not PM-accepted, public pages should keep the pre-attempt wording and may add:

> Readiness review is still blocked or incomplete, so public Beta remains in mock mode.

## What Public Copy Must Not Say

Do not use wording that says or implies:

- The readonly attempt executed successfully unless PM has accepted a sanitized aggregate post-run review that allows that exact public status.
- Supabase is connected, live, public, or backing public pages.
- Public data is live.
- `publicDataSource=supabase` is active.
- `scoreSource=real` is active.
- Real scores, real signals, or validated trading signals are available.
- Coverage is complete.
- Row coverage has passed unless PM has approved a separate public-safe aggregate claim.
- Rows were accepted, inserted, staged, imported, backfilled, or written.
- `daily_prices` was changed.
- Raw market data was fetched, ingested, stored, or committed.
- A readonly check proves investment quality, timing quality, forecast quality, or user reliance.
- Any signal tells users to buy, sell, hold, allocate, time the market, expect returns, avoid losses, or rely on the product for financial decisions.

Unsafe phrase patterns:

- "Live data is ready."
- "Supabase-backed public data is active."
- "Real scores are now enabled."
- "Coverage is complete."
- "Readonly passed, so the public site is promoted."
- "The signal is reliable for investment decisions."
- "This is a buy/sell/hold indicator."
- "Users can rely on this forecast."

## `/briefing` Technical And Gate Language

`/briefing` may keep technical and gate language when it is visibly framed as readiness context, not user-facing investment guidance.

Allowed `/briefing` technical language:

- `publicDataSource=mock`
- `scoreSource=mock`
- `mock-only`
- `bounded readonly attempt`
- `sanitized aggregate-only review`
- `readiness evidence`
- `coverage gate`
- `source-rights gate`
- `freshness metadata`
- `runtime promotion still blocked`
- `real scoring still blocked`
- `PM review required`
- `fail-closed`

Rules for `/briefing`:

- Technical labels should explain why a briefing is limited, not why a user should act.
- Gate language should appear near data freshness, source status, model boundary, or disclaimer areas.
- Any post-attempt reference must remain aggregate-only and PM-accepted.
- If evidence is blocked or incomplete, `/briefing` should say the briefing stays mock-only.
- Keep the non-advice line close to summaries, rankings, watchlists, and action-oriented wording.

Preferred `/briefing` pattern:

> Briefing remains `publicDataSource=mock` and `scoreSource=mock`. Bounded readonly evidence is readiness context only; it does not enable live data, real scoring, or investment advice.

## Home Page User Language

The home page should use plain user language first and technical language second.

Use:

- "Public Beta"
- "mock mode"
- "data is still being checked"
- "coverage may be incomplete"
- "freshness may be delayed"
- "signals are reading aids"
- "not investment advice"
- "live data is not enabled yet"

Avoid making the home page feel like an operator console. Do not lead with internal attempt IDs, runner status, table names, staging concepts, authorization wording, or implementation labels. If technical labels are needed, keep them in a compact trust/detail area after the user-facing explanation.

Preferred home pattern:

> Public Beta is in mock mode while data coverage and freshness are checked. Use the signals as reading aids only; live data, real scoring, and investment advice are not enabled.

## PM-Ready Short Copy

1. Public Beta is in mock mode while data coverage, freshness, and source readiness are reviewed.
2. Signals are reading aids only; they are not investment advice or buy/sell/hold guidance.
3. Live public data is not enabled yet.
4. Real scoring is not enabled yet.
5. Coverage may be incomplete, delayed, or unavailable.
6. Bounded readonly review can inform readiness, but it does not promote the public site by itself.
7. PM-reviewed readiness evidence stays aggregate-only and does not expose rows, raw payloads, secrets, or real decision values.
8. `/briefing` remains `publicDataSource=mock` and `scoreSource=mock` until a separate promotion gate says otherwise.
9. If readonly evidence is blocked or incomplete, the public experience stays mock-only.
10. This product does not provide investment advice, performance promises, or personalized financial recommendations.

## Review Checklist

Before PM accepts public page or `/briefing` copy, confirm:

- The copy preserves `publicDataSource=mock`.
- The copy preserves `scoreSource=mock`.
- The copy does not imply Supabase-backed public data.
- The copy does not imply real scoring.
- The copy does not imply complete coverage.
- The copy does not imply SQL, Supabase reads, Supabase writes, staging rows, `daily_prices` mutation, market-data ingestion, or row acceptance.
- The copy does not expose secrets, env values, authorization values, confirmation phrases, row payloads, raw payloads, stock-id payloads, source bodies, provider bodies, or real decision values.
- The copy frames any readonly result as PM readiness context only.
- The copy says signals are not investment advice.
- The copy avoids buy/sell/hold, timing, allocation, reliance, forecast, expected-return, guarantee, or performance-promise language.

## Stop Lines

Stop and route back to PM if proposed copy:

- needs live runtime state to be true;
- needs Supabase connection, Supabase read, Supabase write, SQL, staging rows, `daily_prices` mutation, row acceptance, or market-data ingestion;
- needs raw, row-level, stock-id, secret, authorization, confirmation, provider-body, source-body, or real decision-value output;
- changes or implies `publicDataSource=supabase`;
- changes or implies `scoreSource=real`;
- turns readiness review into public launch approval;
- turns aggregate evidence into complete coverage;
- turns briefing language into investment advice, trading guidance, forecast validation, performance claims, or user reliance.

## Boundary Statement

This document only guards wording for public pages and `/briefing` around bounded readonly readiness.
It does not change UI, route code, PM gates, checkers, status boards, package files, runtime code, SQL,
Supabase state, market data, staging rows, `daily_prices`, row acceptance, row coverage scoring,
`publicDataSource`, or `scoreSource`.
