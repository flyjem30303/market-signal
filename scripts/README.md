# Scripts

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
