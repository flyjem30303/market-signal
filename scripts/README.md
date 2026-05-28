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

## Validate Supabase Bootstrap

```bash
npm run db:validate
```

This requires `.env.local` with:

```text
NEXT_PUBLIC_SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
```

It checks row counts, latest trade dates, and `data_runs` statuses. It does not
switch the UI to Supabase.

## Generate Market Exchange Seed SQL

```bash
npm run seed:markets
```

This reads:

```text
data/seeds/markets.seed.json
```

and writes:

```text
supabase/seed/000_seed_markets.sql
```

Markets marked `is_active=false` are future expansion placeholders, not live
data coverage.

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

## Generate Data Run Seed SQL

```bash
npm run seed:data-runs
```

This writes:

```text
supabase/seed/003_seed_data_runs.sql
```

It records bootstrap source attribution, row counts, and latest data dates for
the current seed files.
