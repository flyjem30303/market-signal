# Coverage Universe Roadmap

Status: `coverage_universe_roadmap_ready_mvp_now_all_listed_next`

Date: 2026-06-07

## CEO Decision

CEO clarifies that `資料覆蓋率補齊` has two different meanings that must not be mixed:

1. Current GOAL completion means the MVP row coverage universe reaches `360/360`.
2. Product end-state coverage means Taiwan listed company coverage, then broader Taiwan ETF/index/TPEx coverage, and later global markets.

The current active GOAL remains scoped to the MVP universe because it is proving the data pipeline, Supabase boundaries, post-run review pattern, and row coverage scoring gate. Taiwan all-listed coverage is the next major expansion stage, not the current GOAL success condition.

## Universe Levels

### Level 0 - Runtime / Mock Surface

- Purpose: keep the product usable while data is incomplete.
- Scope: public UI may show mock-backed interpretation and explicit boundary copy.
- Promotion state: `publicDataSource` remains mock and `scoreSource` remains mock.
- Completion meaning: user can review the product surface, but no real-data readiness claim is allowed.

### Level 1 - MVP Row Coverage Universe

- Purpose: prove the end-to-end real-data pipeline with a small representative set.
- Symbols: `TWII`, `0050`, `006208`, `2330`, `2382`, `2308`.
- Session policy: `60` trading sessions per symbol.
- Denominator: `6 x 60 = 360` rows.
- Current evidence: `182/360`.
- Completed sub-scope: TW equity `2330`, `2382`, `2308` is `180/180`.
- Remaining MVP blockers: `TWII` is `0/60`, `0050` is `1/60`, and `006208` is `1/60`.
- Current GOAL completion: reach `360/360` with bounded write/readback evidence and keep public/scoring promotion blocked until a separate promotion gate accepts it.

### Level 2 - Taiwan Listed Company Universe

- Purpose: make the product useful for Taiwan listed common stocks beyond the sample set.
- Target: all active TWSE listed common stocks from the seeded stock master.
- Current repo evidence: the stock master seed has been expanded to `1086` listed-stock records.
- Working denominator policy: `active TWSE listed common stocks x 60 sessions`.
- Required before execution:
  - explicit all-listed universe manifest;
  - source-rights confirmation for historical daily OHLCV/turnover storage and derived analysis;
  - batch ingestion/backfill plan;
  - failure/retry partition policy;
  - bounded staging-first write path;
  - production merge/readback gates;
  - coverage scoring gate that can report by batch, industry, and full listed universe.
- This level is not allowed to reuse the MVP `360` denominator.

### Level 3 - Taiwan ETF / Index / TPEx Expansion

- Purpose: expand from listed common stocks to the broader Taiwan market.
- ETF target: `0050`, `006208`, then broader ETF universe after source-rights approval.
- Index target: `TWII`, then sector/index families after source-rights approval.
- TPEx target: active TPEx securities after source, schema, and seed coverage are ready.
- Required before execution:
  - source-specific rights and field contracts;
  - ETF/index-specific candidate artifact shape;
  - separate row coverage denominators;
  - public copy rules that do not imply common-stock fundamentals apply to ETF/index assets.

### Level 4 - Global Market Universe

- Purpose: support global stock markets and multi-country users.
- Scope: country/exchange-specific universes, currencies, calendars, symbols, source rights, and localization.
- Required before execution:
  - global market hierarchy;
  - per-market data provider decision;
  - calendar and trading-session policy;
  - currency and timezone contract;
  - localized disclosure and jurisdiction-specific public claim boundaries.

## Roadmap Sequence

1. Finish Level 1 MVP row coverage at `360/360`.
2. Create the Level 2 Taiwan all-listed universe manifest and denominator.
3. Run all-listed coverage in batches through staging, merge, readback, and scoring gates.
4. Add ETF/index/TPEx source-specific universes.
5. Promote public real-data and score-source only after separate runtime promotion gates accept coverage, source rights, data quality, model credibility, and public-claim readiness.
6. Expand to global markets after the Taiwan universe pattern is stable.

## Boundary

This roadmap:

- does not run SQL;
- does not connect to Supabase;
- does not write Supabase;
- does not fetch or ingest market data;
- does not generate candidate artifacts;
- does not mutate `daily_prices`;
- does not print row payloads or secrets;
- does not award row coverage points;
- does not promote public source;
- does not promote real score source.

## CEO Recommendation

Continue the active GOAL with Level 1 until `360/360` is complete. In parallel, PM should prepare a Level 2 all-listed universe manifest packet so the next major goal can expand from MVP sample coverage to Taiwan all-listed common-stock coverage without redefining the current GOAL midway.
