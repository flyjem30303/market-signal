# CP1 Follow-up: Freshness Source Readiness

Date: 2026-05-28

Trigger:

- Data freshness UI now exists on briefing and stock pages.
- Supabase `data_runs` freshness helper, repository, and smoke test now exist.
- `DATA_FRESHNESS_SOURCE` can switch freshness independently from
  `NEXT_PUBLIC_DATA_SOURCE`.
- Next likely work is Supabase market repository read path.

## A / PM + Developer

The current implementation has a useful separation of concerns:

- `NEXT_PUBLIC_DATA_SOURCE` controls the main market signal repository.
- `DATA_FRESHNESS_SOURCE` controls only freshness metadata.
- The UI can test Supabase freshness without switching prices, scores, news, or
  commentary away from mock data.

This reduces blast radius. A recommends keeping this split even after real data
arrives, because freshness and scoring may mature at different speeds by market.

Engineering risks:

- Supabase SDK types are complex enough that the freshness boundary currently
  uses a narrow client cast.
- Real repository reads will require async server loaders or a parallel
  server-only read model.
- The current mock dashboard still assumes synchronous repository methods.

A recommends:

- Proceed to design the Supabase market repository read contract.
- Do not implement the full UI switch yet.
- Start with server-side asset list and latest snapshot reads.

## B / Marketing

Freshness-first is a positive trust signal. It gives future SEO pages a visible
answer to the question: "what data is this based on?"

B still does not recommend indexing broad stock pages yet:

- Real content depth is not ready.
- Industry names are not yet user-friendly.
- Scores are still mock and must not be marketed as real coverage.

B recommends the next slice support:

- Real stock master display.
- Better market / exchange labels.
- Later SEO expansion only after real snapshot quality is credible.

## C / Investment Advisor

C supports the staged approach. Showing freshness before showing real scores is
the right order for a financial product.

Remaining investment credibility gaps:

- Latest TWSE price / valuation is only one data layer.
- No historical scoring evidence is connected to the real database yet.
- No data quality score is calculated from actual missingness.
- No real score should appear beside real prices without model caveats.

C recommends:

- Build real read path for stock identity and latest raw data first.
- Keep model score output mock until model version and data quality are derived
  from real inputs.

## D / Legal

D approves the separation between freshness and main data. It lowers the chance
that users confuse a technical database experiment with live investment
coverage.

D requirements before any real-data public switch:

- Keep freshness visible above or near interpreted score areas.
- Keep disclaimer links near score interpretation.
- Do not combine real prices with mock scores without visible labeling.
- Do not activate non-TW markets without region-specific review.

## F / Product Design / UIUX

F agrees that the UI should not become a warning-heavy interface. The freshness
strip is compact enough for the current stage.

Design concerns for the next slice:

- If real prices are added while scores remain mock, the UI needs very clear
  labeling.
- Users should not have to inspect environment mode to understand what is real.
- Multi-market future support should use consistent exchange, currency, and
  timezone patterns.

F recommends:

- Keep the strip near quote / score areas.
- Add visual distinction later between "real raw market data" and "mock model
  interpretation" if those modes are mixed.

## Role Conflicts

- A wants to begin real repository reads, while C/D want to avoid public real
  interpretation until data quality and model caveats are stronger.
- B wants eventual SEO scale, while C/F warn that shallow real-data pages could
  damage trust.
- E wants global-ready architecture, while A recommends proving TWSE real reads
  before expanding active markets.

## E / CEO Synthesis

The project is still moving correctly. The freshness-first sequence is approved
because it creates trust infrastructure before real market interpretation.

CEO decision:

```text
PROCEED
```

This approval is narrow. It does not approve switching the full UI repository to
Supabase. It approves beginning the next implementation slice: a server-side
Supabase market read contract for raw market identity and latest data.

## Required Adjustments

Before `NEXT_PUBLIC_DATA_SOURCE=supabase` can be used:

1. Define a Supabase market read contract separate from the mock signal model.
2. Read active market metadata and stock identity from Supabase.
3. Read latest raw daily price / valuation rows for a symbol.
4. Keep model score, news, commentary, and backtest mock until model credibility
   work is complete.
5. Preserve visible freshness labels when any real raw data appears.

## Next Implementation Slice

Approved next slice:

```text
Define Supabase raw market read model and repository contract.
```

Implementation note:

- Completed: Supabase raw market read model and repository contract.
- Completed: raw market smoke test command for a real Supabase project.
- Still pending: server loader that exercises the contract inside Next.js
  without switching the public UI repository.

Not approved yet:

```text
Switch NEXT_PUBLIC_DATA_SOURCE=supabase.
Show real model scores.
Index broad real stock pages.
Activate non-TW markets.
```

## Decision

```text
PROCEED
```
