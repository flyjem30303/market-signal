# Scripts

## Generate Stock Seed SQL

```bash
node scripts/seed-stocks-sql.mjs
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

