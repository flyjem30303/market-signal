# Globalization Strategy

## CEO Decision

The product will start with Taiwan stocks and Taiwan users, but it must be built
as a global market signal platform from the beginning.

The first wedge remains Taiwan because:

- The team already understands Taiwan market data and user behavior.
- TWSE official data gives a credible first data pipeline.
- Taiwan investors create a focused MVP audience.
- A narrow first market is faster to validate than a broad but shallow global app.

However, Taiwan is not the final product boundary. The long-term product is:

```text
Global market status dashboard for investors who track risk, momentum, and market rhythm across countries.
```

## Product Principle

Do not over-generalize the MVP UI before the Taiwan workflow is useful.
Do not hard-code Taiwan assumptions into the architecture.

This means:

- Build the first experience for Taiwan users.
- Store data with market, exchange, currency, timezone, locale, and country in mind.
- Keep scoring models versioned and market-specific.
- Design URLs and navigation so global markets can be added later.
- Keep legal disclaimers broad enough for multi-country information services.

## Global Expansion Order

### Phase 1: Taiwan Wedge

- TWSE listed stocks.
- Taiwan ETFs.
- Taiwan daily briefing.
- Traditional Chinese UI.
- TWD prices.
- Asia/Taipei timezone.

### Phase 2: Taiwan Plus US Reference

- Add US reference indices and stocks that Taiwan investors care about.
- Examples: NASDAQ, SOX, S&P 500, NVIDIA, Apple, Microsoft.
- Use these first as macro / upstream context, not as full US stock pages.

### Phase 3: Full US Market Pages

- US stock pages with USD, US exchange metadata, and US trading calendar.
- English UI entry points.
- Separate SEO strategy for US tickers.

### Phase 4: Multi-Market Platform

- Japan, Hong Kong, Korea, and major ETF markets.
- Market selector.
- User locale preference.
- Multi-currency display.
- Region-specific legal and commercial disclosures.

## Architecture Requirements

### Data

Future schema changes should support:

- country
- exchange
- currency
- timezone
- asset_type
- market_calendar
- symbol namespace, because symbols can collide across countries
- source attribution per data record
- model version per market

Current `market` values such as `TWSE` are acceptable for the Taiwan MVP, but
future work should avoid assuming all symbols are Taiwan symbols.

### URLs

Current Taiwan MVP route:

```text
/stocks/2330
```

Future global-safe routes may need:

```text
/markets/tw/stocks/2330
/markets/us/stocks/NVDA
```

Do not rush this migration before SEO and UX are planned. For now, keep current
routes and add a compatibility plan before global routes are introduced.

### UI / UX

The first UI can remain Taiwan-focused, but components should avoid hard-coded:

- TWD-only labels
- Taiwan-only market names
- Asia/Taipei-only date assumptions
- Chinese-only data labels inside reusable logic

### Scoring

Do not use one universal score formula for all countries.

Each market can have:

- Different trading calendars.
- Different disclosure rules.
- Different valuation norms.
- Different liquidity and short-selling structures.
- Different macro drivers.

Scoring must remain `market + model_version` aware.

### Legal

The service remains an information tool, not investment advice.

Global expansion requires region-specific review before:

- Running paid memberships.
- Sending personalized alerts.
- Displaying broker affiliate offers.
- Making market-specific ranking claims.

## Near-Term Instructions To Roles

### A: PM + Developer

- Continue Taiwan data pipeline work.
- Add global-ready fields only when they support the next engineering slice.
- Avoid premature rewrites.
- Before connecting Supabase repository, review whether `stocks` needs `country`,
  `exchange`, `currency`, and `asset_type`.

### B: Marketing

- Taiwan SEO remains first.
- Start collecting future keyword groups for US and global market pages.
- Do not dilute Taiwan positioning before MVP proves retention.

### C: Investment Advisor

- Define which model assumptions are Taiwan-specific.
- Prepare a model calibration checklist for US equities and ETFs.

### D: Legal

- Keep disclaimers non-advisory.
- Flag which future features need country-specific legal review.

### E: CEO

- Protect the Taiwan wedge from becoming a permanent ceiling.
- Reject global expansion that is only more pages without credible data.

### F: Product Design / UIUX

- Keep the current app comfortable for Taiwan users.
- Design future market and locale selectors without cluttering the MVP.
