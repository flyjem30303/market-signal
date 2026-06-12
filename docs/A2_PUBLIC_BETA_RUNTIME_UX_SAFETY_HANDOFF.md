# A2 Public Beta Runtime UX Safety Handoff

Status: `a2_public_beta_runtime_ux_safety_handoff_ready`

Owner lane: A2 Product / Runtime UX Safety

Scope: product and UX safety review for the public Beta index status dashboard, focused on `/` and `/briefing`. This handoff is copy, comprehension, and PM routing support only.

This file does not authorize SQL, Supabase access, Supabase writes, staging rows, `daily_prices` mutation, raw market-data fetch, raw market-data storage, raw market-data ingest, raw market-data commit, secret or raw payload review, real public data promotion, real scoring, or investment advice.

Current public runtime boundary:

- `publicDataSource=mock`
- `scoreSource=mock`
- Public pages may describe market mood, attention level, cause, update/freshness, and next observation.
- Public pages must not describe the dashboard as real-time market data, complete market coverage, official source evidence, accepted production scoring, or a buy/sell decision engine.

## BRIEF User Test

30 秒 BRIEF:

A general investor should understand within 30 seconds that this is a public Beta market-status dashboard, the current view is mock-source, the page is for context review, and it is not a buy/sell recommendation.

3 分鐘 BRIEF:

Within 3 minutes, the same user should be able to identify the market mood, why the state appears, when or how the state was last updated, what to observe next, and where the mock/real boundary sits before trusting any score or alert.

## Home User Understandability

Current state: needs copy cleanup before broad public Beta confidence.

What works:

- The home route loads the dashboard experience directly instead of a marketing landing page.
- The page attempts to keep BRIEF elements visible: market mood, scores, risk/health context, freshness, and next reading path.
- Mock posture is present in several surfaces, including source and score language.

UX safety risks:

- Several visible strings are mojibake or unreadable, which breaks the 30 秒 BRIEF immediately.
- The first screen mixes user-facing market language with internal runtime terms, making the page feel like an engineering status board.
- Technical labels such as source status, score source, runtime readiness, row coverage, and promotion language can appear before the user has a plain explanation.
- The page has too many competing panels for a first-time investor; it should lead with one market mood, one cause, one freshness line, one next observation, and one safety line.

PM-readable status:

Home can remain the primary public entry, but it needs a focused reader-first copy pass before it should be treated as Beta-ready for general investors.

## Briefing User Understandability

Current state: valuable as a product walkthrough, but too noisy and too technical for a public investor briefing in its current shape.

What works:

- `/briefing` has the right information architecture for a 3-minute reading path: summary, market action, alert list, runtime boundary, methodology links, and disclosure.
- It repeatedly states that the view is mock-source and not investment advice.
- It includes the important user questions: what is happening, why, what changed, and what should be observed next.

UX safety risks:

- Multiple above-the-fold strings are unreadable mojibake, so a general user cannot complete the BRIEF.
- Internal process vocabulary is too prominent: gate, promotion, readonly, row coverage, Batch 1 readiness, source depth, and runtime status.
- `/briefing` currently carries too much governance detail for a public page. It should summarize readiness in plain language and move deeper process state to internal pages or docs.
- Some cards may imply operational authority because they show blocker counts, readiness percentages, or workflow state near market-status copy.

PM-readable status:

`/briefing` should become the public explanation layer, not the public engineering ledger. Keep the 3-minute BRIEF, but demote or remove process-heavy readiness blocks from the investor-facing path.

## Trust And Legal Boundaries To Keep

Keep these visible near any score, alert, pressure state, or suggested next observation:

- This is a public Beta decision aid, not investment advice.
- The dashboard does not recommend buying, selling, holding, shorting, timing the market, or predicting returns.
- The current public source is `publicDataSource=mock`.
- The current scoring source is `scoreSource=mock`.
- Real-data display and real scoring require separate PM-owned acceptance before public language changes.
- If source rights, freshness, field meaning, coverage, or runtime safeguards are unclear, the public page should show mock or blocked language instead of confidence.
- The page may say market mood or attention level; it must not say live signal, official real-time feed, complete coverage, guaranteed forecast, or trading instruction.

Recommended short safety line:

`This Beta view uses mock-source signals for context review. It is not investment advice and does not recommend buying, selling, or timing the market.`

## Development Process Information To Move Or Remove

Move to internal pages, PM docs, or reviewer handoffs:

| Current information type | Public risk | Safer public replacement |
| --- | --- | --- |
| Gate names, packet names, preflight/post-run language | Looks like an execution console, not an investor product | `Required reviews are still incomplete.` |
| Row coverage counts, missing rows, table names, `daily_prices` references | Can imply accepted coverage proof or expose operational detail | `Real-data coverage still needs accepted review.` |
| Supabase write/readback/readonly details | Can imply database authority or hidden production behavior | `Database safeguards are still under review.` |
| A1/A2/PM/CEO lane mechanics | Users need status, not team routing | `The Beta is still being reviewed before real-data display.` |
| Batch 1 blocker maps as first-screen content | Distracts from market mood and non-advice boundary | `Batch 1 starts with broad-market references first.` |
| Promotion or real-scoring transition detail | Can sound like real-data launch is already approved | `The page stays mock-labeled until a separate acceptance step passes.` |
| Raw payload, candidate row, operator value, confirmation phrase, or secret-related language | Not suitable for public surfaces | Omit entirely from public pages. |

Keep exact technical flags only as secondary disclosure, not as the headline.

## Next Runtime UX Slice

Recommended next slice: `a2_home_briefing_first_screen_plain_language_patch`.

Acceptance shape:

1. Replace mojibake above the fold on `/` and `/briefing` with readable zh-TW or clear English.
2. Home first screen contains market mood, cause, freshness/update state, next observation, and the short safety line.
3. `/briefing` first screen contains 30 秒 BRIEF and 3 分鐘 BRIEF path language before any governance detail.
4. Move deep readiness/governance blocks below the public reading path or to internal routes/docs.
5. Keep `publicDataSource=mock`, `scoreSource=mock`, and non-investment-advice language visible.
6. Add a route-copy checker that fails on mojibake patterns, internal-lane labels, and public claims of live/official/complete/real-time data.

Suggested PM next action:

Assign a narrow A2 implementation pass against `src/components/dashboard-shell.tsx`, `src/app/briefing/page.tsx`, and the shared runtime/readiness panels used by those routes. Do not combine it with A1 data work.

## A2 Conclusion

The public Beta runtime UX safety review is ready for PM intake. The current product has the right safety posture and mock boundary, but the public user experience still needs a reader-first cleanup: remove unreadable text, demote internal process detail, preserve legal/trust boundaries, and make the first 30 seconds explain market mood without implying live data or investment advice.
