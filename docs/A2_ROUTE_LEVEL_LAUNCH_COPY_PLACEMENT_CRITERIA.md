# A2 Route-Level Launch Copy Placement Criteria

Status: `a2_route_level_launch_copy_placement_criteria_ready`
Updated: 2026-06-07
Owner lane: A2 Frontend / UX Readability / Public Copy QA
Integration owner: PM mainline
Mode: `bounded_local_only_copy_criteria`

## Boundary

This document defines where launch-ready public trust copy should appear by route or surface. It is criteria only: no UI redesign, no runtime promotion, no data evidence work, no deployment, and no source or score upgrade.

- Keep `publicDataSource=mock`.
- Keep `scoreSource=mock`.
- Do not run SQL.
- Do not connect to Supabase.
- Do not write Supabase.
- Do not fetch, store, ingest, or commit raw market data.
- Do not touch A1 data evidence.
- Do not change runtime toggles.
- Do not set `publicDataSource=supabase`.
- Do not set `scoreSource=real`.

## Placement Matrix

| Route / surface | Required trust copy | Launch-blocking if missing | Later visual polish |
|---|---|---|---|
| Home first screen `/` | State that the site is mock-only today; explain the visible signal is for product-flow and market-reading context; show exact stop lines nearby or in the first trust module: `publicDataSource=mock` and `scoreSource=mock`; say it is not investment advice. | Hidden mock-only state; real market data implied; no non-investment-advice wording near first signal/action summary. | Shorten repeated text, tune label hierarchy, and add tooltips after PM freezes wording. |
| Home runtime/details | Explain data freshness as freshness metadata or readiness, not live freshness; explain coverage as partial coverage/readiness, not complete coverage; explain missing/delayed data downgrade behavior. | Freshness copy reads as live market data; coverage reads as complete; missing or delayed data has no visible limitation. | Collapse dense details, adjust disclosure density, and align card labels. |
| Stock page first screen `/stocks/[symbol]` | State that the stock signal is mock-only; explain score/model limitation; keep non-investment-advice wording near score, risk, and action summary. | Score appears like a real model conclusion; signal appears like buy/sell/hold advice; `scoreSource=real` appears enabled or approved. | Improve spacing around score caveats and align labels with home after launch copy is accepted. |
| Stock runtime/governance details | Explain freshness metadata, partial coverage, missing/delayed data, source limitations, and model limitations; keep exact stop lines visible in a disclosure/detail section. | Row coverage or source readiness is presented as complete public coverage; metadata is presented as real data quality approval. | Move repeated caveats into shared components after phrase set approval. |
| Briefing `/briefing` | Summarize mock-only state, runtime gate state, data freshness/readiness, partial coverage, missing/delayed data risk, model limitation, and non-investment-advice boundary in executive-readable wording. | First summary hides public source/score boundaries; briefing implies launch approval, real data, complete coverage, or real score. | Reduce internal workflow terms and improve section density after PM accepts route copy. |
| Weekly `/weekly` | Explain weekly cadence; state freshness is metadata/readiness unless real freshness is approved; disclose partial coverage and missing/delayed data; keep non-investment-advice and risk language near summary. | Weekly page implies live market coverage, complete market data, or validated forecast before promotion. | Tighten cadence labels and reuse shared disclosure after copy acceptance. |
| Shared runtime boundary | Provide one reusable mock-only explanation; exact stop lines `publicDataSource=mock` and `scoreSource=mock`; not-live-yet copy; missing/delayed data and model limitation summary. | Shared copy omits stop lines, allows real-source wording before gate, or contains mojibake/unreadable text. | Componentize repeated copy and tune typography later. |
| Footer / legal pages `/disclaimer`, `/terms`, `/privacy`, `/methodology` | Include non-investment-advice, risk disclosure, data freshness limitation, source-rights limitation, partial coverage, missing/delayed data, and model/score limitation. | Legal pages lack non-advice/risk language; source rights or real data appear approved; model output appears guaranteed. | Harmonize footer/legal copy length and page-specific labels. |
| Empty / error / unavailable states | Explain missing data, delayed data, stale data, unavailable coverage, downgraded confidence, and next safe action; preserve mock-only state. | Empty/error state silently shows confidence, hides missing data, or suggests real data is unavailable only due to a temporary UI issue. | Add icons, compact wording, and reusable empty-state layout after wording is stable. |

## Required Trust Copy By Topic

- Mock-only: Every route that shows signals, scores, action summaries, freshness, or coverage must say the public state is still mock-facing before promotion.
- Data freshness: Before promotion, call freshness "freshness metadata", "readiness", or "not live market freshness"; do not imply live or current market data.
- Coverage / partial coverage: Treat coverage as readiness or partial coverage until PM/A1 accepts evidence and downgrade rules; do not call it complete coverage.
- Missing / delayed data: Explain missing, delayed, stale, unavailable, or unvalidated values with downgrade language.
- Risk: Mention market movement, liquidity, source delay, model error, and incomplete data where a user may rely on a signal.
- Model limitation: Say scores are simplified indicators, can be wrong, depend on source quality, and are not forecasts or guarantees.
- Non-investment-advice: Place near first signal/action summary, stock score areas, legal/footer copy, and methodology copy.

## Launch-Blocking Copy

These items block launch copy readiness:

- Any primary public route hides mock-only state.
- Any route implies `real market data` is live before PM authorizes source promotion.
- Any route implies `complete coverage` before PM/A1 accepts coverage evidence and downgrade rules.
- Any route implies `scoreSource=real` before PM authorizes real score promotion.
- Any route presents a signal, score, action summary, or risk label as `investment advice`.
- Any score/model area lacks model limitation and non-investment-advice wording.
- Any freshness or coverage area lacks missing/delayed/partial limitation wording.
- Any trust surface contains mojibake, unreadable copy, or raw internal workflow terms as the primary user explanation.

## Non-Blocking Visual Polish

These can wait until after PM accepts route-level wording:

- Typography, spacing, icon, and label refinements.
- Tooltip copy for dense terms.
- Moving repeated disclosure into shared components.
- Mobile density tuning where text is already readable.
- Screenshot annotation passes and final visual polish.

## Mock / Real Promotion Copy Rules

Before promotion:

- Use "mock-only", "mock signal", "sample signal", "product-flow example", "freshness metadata", and "partial coverage/readiness".
- Keep exact stop lines `publicDataSource=mock` and `scoreSource=mock` in explicit disclosure or technical-detail sections.
- Do not say `real market data`, `complete coverage`, `scoreSource=real`, validated forecast, or investment advice.
- Explain source rights, freshness, coverage, model credibility, and release gates as separate approval paths.

After PM accepts promotion gates:

- Replace mock-only wording only from a PM-approved phrase set.
- Publish real freshness only after PM accepts the freshness source and stale behavior.
- Publish coverage numbers only after PM/A1 accepts evidence and downgrade rules.
- Publish source names, rights, retention, or redistribution wording only after source-rights approval.
- Keep risk, non-investment-advice, missing/delayed data, and model limitation copy visible even after real promotion.

## PM Intake Checklist

- Confirm this document is criteria only and did not change UI, data evidence, runtime toggles, Supabase, or raw market data.
- Assign each launch-blocking route/surface gap to PM or A2 before public release review.
- Approve one shared phrase set for mock-only, not-live-yet, freshness metadata, partial coverage, missing/delayed data, model limitation, risk, and non-investment-advice copy.
- Decide whether each route needs first-screen copy, detail-section copy, footer/legal copy, or empty/error-state copy.
- Route any real-source, complete-coverage, real-freshness, or real-score wording through PM/A1/legal/investment gates before public use.
- Run focused public copy checkers, public visible language quality, route health, and review gates after implementation.

## Suggested Next A2 Task

Create a copy-only route audit that maps the criteria above to current files and reports which route/surface already satisfies the placement requirement, which needs a small copy patch, and which should wait for PM phrase-set approval. The audit should remain local-only and must not touch data evidence, Supabase, runtime toggles, or visual polish.
