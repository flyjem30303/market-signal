# Mock MVP Chairman Review Packet

Updated: 2026-06-06

## CEO Verdict

The mock MVP is ready for chairman review as a pre-launch review artifact.
It is not a real-data production launch. The site should be reviewed as a
mock-only decision-support product surface with clear boundaries and a separate
future authorization path for Supabase, SQL, real market data, and real scoring.

## Review Scope

Review these routes first:

- `/`
- `/stocks/2330`
- `/stocks/TWII`
- `/briefing`
- `/weekly`
- `/methodology`
- `/disclaimer`

The current browser review found these pages reachable locally, readable, and
consistent with the mock-only boundary. No Internal Server Error, secret text,
raw payload, SQL text, real-score approval, or public source promotion claim was
observed in the visible page text.

## What The Chairman Should Approve Now

- The current mock MVP is acceptable as a pre-launch review baseline.
- Users can understand that the product is still mock-only.
- The public pages show market-signal flow, stock/ETF navigation, readiness
  state, and legal boundary without claiming live market evidence.
- The project can move from "finish the mock MVP" to "review launch polish and
  plan separately authorized real-data promotion."

## What The Chairman Should Not Approve Yet

- Public real-data launch.
- `publicDataSource=supabase`.
- `scoreSource=real`.
- SQL execution.
- Supabase writes.
- staging row writes.
- `daily_prices` writes.
- raw market-data fetch, ingestion, storage, or commit.
- investment advice, performance claims, rankings, or recommendation claims.

## F / UI Minimal Closeout

Do this only after chairman review confirms the mock MVP direction:

1. Home first screen: make the mock-only product value and primary next action
   clear within the first viewport.
2. Stock page first screen: tighten the relationship between headline signal,
   mock boundary, and the next useful user action.
3. Briefing page: keep the PM progress and gate language readable, but reduce
   decision fatigue if the first viewport feels too operational.
4. Mobile pass: confirm nav, search, stock cards, disclosure text, and primary
   links remain readable without overlapping.
5. Legal boundary copy: preserve non-advisory wording and mock-source wording;
   do not simplify it into weaker risk language.

Do not start a broad redesign, brand overhaul, new design system, animation
system, or visual-asset campaign before the chairman review is accepted.

## Next Phase After Review

If the chairman accepts the mock MVP baseline, CEO should open a new goal for:

`Supabase readonly / data coverage / real-source promotion authorization`

That next goal should explicitly decide whether to run a bounded readonly
attempt, whether SQL is allowed, whether staging rows are allowed, and what
evidence is required before any public source or real-score promotion.

## Current Safety State

- `publicDataSource=mock`
- `scoreSource=mock`
- SQL execution: blocked
- Supabase writes: blocked
- raw market data: blocked
- real scoring: blocked

## CEO Next Action

Ask the chairman to review the mock MVP pages and choose one of three outcomes:

- Accept the mock MVP baseline and move to minimal F/UI closeout.
- Accept the mock MVP baseline and move directly to the real-data authorization
  goal.
- Reject the baseline with concrete page-level fixes before any next phase.
