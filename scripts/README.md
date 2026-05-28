# Scripts

## Build Supabase Bootstrap SQL

```bash
npm run db:bootstrap
```

This combines the schema migration and seed SQL files into:

```text
supabase/bootstrap.sql
```

Run that file in a new Supabase project's SQL editor to create the schema,
stocks, latest prices, and latest fundamentals in one pass.

## Fetch TWSE Stock Master

```bash
npm run fetch:stocks
```

This fetches TWSE listed common stocks from the official TWSE OpenAPI and merges
them into:

```text
data/seeds/stocks.seed.json
```

Use a dry run before writing:

```bash
node scripts/fetch-twse-stock-master.mjs --dry-run
```

Manual symbols already in the seed, such as index and ETF placeholders, are
preserved during the merge.

## Fetch Latest TWSE Daily Market Data

```bash
npm run fetch:daily-market
```

This fetches latest TWSE daily prices and valuation ratios from the official
TWSE OpenAPI and writes an upsert SQL file:

```text
supabase/seed/002_seed_latest_market_data.sql
```

Use a dry run before writing:

```bash
node scripts/fetch-twse-daily-market.mjs --dry-run
```

The script only generates rows for symbols that already exist in
`data/seeds/stocks.seed.json`.

## Generate Stock Seed SQL

```bash
npm run seed:stocks
```

This reads:

```text
data/seeds/stocks.seed.json
```

and writes:

```text
supabase/seed/001_seed_stocks.sql
```

The generated SQL can be run in Supabase SQL editor or included in a local seed workflow.
