# Supabase Execution Runbook

## Purpose

This runbook is the exact execution path for creating the first Supabase
database and validating the bootstrap data.

This does not switch the UI to Supabase. Per CP1, the app must continue using:

```text
NEXT_PUBLIC_DATA_SOURCE=mock
```

until repository queries, data freshness display, and source attribution are
ready.

## Step 1: Create Supabase Project

Create a new Supabase project from the Supabase dashboard.

Recommended project settings:

```text
Project name: taiwan-market-signal
Region: closest stable region to target users
Database password: store securely
```

Do not paste the service role key into browser code, commits, chat, or public
documentation.

## Step 2: Generate Bootstrap SQL

Run locally:

```bash
npm run db:bootstrap
```

This generates:

```text
supabase/bootstrap.sql
```

## Step 3: Run Bootstrap SQL

Open the Supabase SQL Editor and run the full contents of:

```text
supabase/bootstrap.sql
```

The bootstrap creates:

- `market_exchanges`
- `data_runs`
- `stocks`
- `daily_prices`
- `daily_fundamentals`
- `daily_flows`
- `daily_scores`
- `score_modules`
- `news_items`
- `stock_news`
- `profiles`
- `user_favorites`

It also seeds:

- market metadata
- TWSE stock master
- latest daily TWSE prices
- latest daily TWSE valuation data
- bootstrap data run records

## Step 4: Create `.env.local`

Create a local-only file:

```text
.env.local
```

Use this format:

```text
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_DATA_SOURCE=mock
DATA_FRESHNESS_SOURCE=mock
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Important:

- `.env.local` must not be committed.
- Keep `NEXT_PUBLIC_DATA_SOURCE=mock`.
- Keep `DATA_FRESHNESS_SOURCE=mock` until `npm run db:freshness` passes.
- The service role key is only for server-side scripts such as validation.

## Step 5: Validate Bootstrap

Before validating the live Supabase database, run:

```bash
npm run db:preflight
```

Expected result when local setup is ready:

```json
{
  "status": "ok",
  "ready_for_db_validate": true
}
```

If `.env.local` is missing or incomplete, this command reports the missing
fields without contacting Supabase.

Run:

```bash
npm run db:validate
```

Expected result:

```json
{
  "status": "ok"
}
```

The validation checks minimum row counts, latest data dates, and `data_runs`
statuses.

Expected minimums:

```text
market_exchanges >= 4
stocks >= 1000
daily_prices >= 1000
daily_fundamentals >= 1000
data_runs >= 4
```

Expected latest dates:

```text
latest_price_date: latest TWSE trading date in seed
latest_fundamental_date: latest TWSE valuation date in seed
```

## Step 6: Check Freshness Snapshot

Run:

```bash
npm run db:freshness
```

Expected result:

```json
{
  "status": "ok",
  "freshness": {
    "state": "complete"
  }
}
```

This checks only the data freshness read path for `market_exchanges` and
`data_runs`. It does not switch the UI to Supabase.

## Step 7: Check Raw Market Read Path

Run:

```bash
npm run db:raw-market
```

Expected result:

```json
{
  "status": "ok",
  "target": {
    "country": "TW",
    "exchange": "TWSE",
    "symbol": "2330"
  }
}
```

This checks active market metadata, stock identity, latest daily price, and
latest daily fundamentals. It does not switch the UI to Supabase.

Optional target override:

```bash
RAW_MARKET_SYMBOL=2317 npm run db:raw-market
```

## Step 8: Keep UI On Mock

Do not change this yet:

```text
NEXT_PUBLIC_DATA_SOURCE=mock
```

The freshness source should also remain mock until the smoke test passes:

```text
DATA_FRESHNESS_SOURCE=mock
```

The UI must not switch to Supabase until a future checkpoint approves:

- Supabase repository query implementation.
- data freshness UI.
- source attribution display.
- legal and model caveat copy.

## Optional: Internal Raw Market Diagnostics

The internal diagnostics route is disabled by default:

```text
INTERNAL_DIAGNOSTICS_ENABLED=false
```

For local/server verification only, set:

```text
INTERNAL_DIAGNOSTICS_ENABLED=true
INTERNAL_DIAGNOSTICS_TOKEN=your-local-token
```

Then request:

```text
/api/internal/raw-market?symbol=2330&token=your-local-token
```

Expected result:

```json
{
  "status": "ok"
}
```

Do not enable this route in a public environment without a private token.

## Troubleshooting

### Missing `.env.local`

`npm run db:validate` will fail if `.env.local` is missing.

Fix:

- Create `.env.local`.
- Add Supabase URL and service role key.

### Permission Error

If validation fails with permission errors:

- Confirm `SUPABASE_SERVICE_ROLE_KEY` is correct.
- Do not use anon key as service role key.

### Row Count Too Low

If validation says a table is below expected minimum:

- Confirm `supabase/bootstrap.sql` was run completely.
- Run the verification queries at the bottom of `supabase/bootstrap.sql`.
- Re-run `npm run db:bootstrap` and execute the regenerated SQL again if needed.

### UI Shows Mock Data

This is expected. CP1 explicitly requires the UI to remain on mock data until
the next approved repository slice.

## Exit Criteria

This runbook is complete when:

- Supabase project exists.
- `supabase/bootstrap.sql` runs successfully.
- `.env.local` exists locally.
- `npm run db:preflight` returns `status: ok`.
- `npm run db:validate` returns `status: ok`.
- `npm run db:freshness` returns `status: ok`.
- `npm run db:raw-market` returns `status: ok`.
- `NEXT_PUBLIC_DATA_SOURCE` remains `mock`.

After exit criteria are met, the next checkpoint is:

```text
CP1 follow-up: Supabase Repository Readiness
```
