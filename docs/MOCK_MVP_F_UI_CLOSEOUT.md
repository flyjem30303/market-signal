# Mock MVP F/UI Minimal Closeout

Updated: 2026-06-06

## Outcome

Chairman outcome: accepted.

The mock MVP baseline is accepted for the current pre-launch review stage. The
F/UI closeout decision is to avoid a broad redesign now and keep the work to
first-screen comprehension, mock-only boundary clarity, and route-to-route
navigation confidence.

## Browser Review Scope

Reviewed locally on `http://localhost:3000`:

- `/`
- `/stocks/2330`
- `/briefing`
- `/disclaimer`

Observed result:

- No Internal Server Error.
- Home first screen explains the dashboard as a mock-only Taiwan stock and ETF
  signal reading surface.
- Stock first screen explains the selected stock as mock-only, not formal market
  data or formal scoring.
- Briefing first screen explains market direction, risk sorting, and product
  flow without presenting investment advice.
- Disclaimer first screen clearly states the mock-only, non-advisory, and
  non-live-market-data boundary.

## F/UI Closeout Decision

Accepted now:

- Keep the current visual structure.
- Keep the current first-screen hierarchy.
- Keep the current mock-only copy near score and signal areas.
- Keep the current disclaimer and methodology links visible.
- Defer broad visual polish, new design system work, animation, and brand
  refinement until the real-data authorization path is clearer.

Still blocked:

- Public real-data launch.
- SQL execution.
- Supabase writes.
- raw market-data fetch, ingestion, storage, or commit.
- `publicDataSource=supabase`.
- `scoreSource=real`.
- investment advice, rankings, recommendations, or performance claims.

## CEO Next Move

Open the next project goal around:

`Supabase readonly / data coverage / real-source promotion authorization`

The next goal must stay separate from this accepted mock MVP closeout and must
define what is allowed, what is blocked, what evidence is required, and what
post-run review must happen before any public source or real-score promotion.
