# Daily After-Close Update Runbook

## Purpose

Keep Phase 1 market data current after the Taiwan market closes.

The update writes the latest TWSE OpenAPI daily close data into:

- `daily_prices`
- `daily_scores`
- `data_runs`

Phase 1 scope is `TWII` plus TWSE listed stocks. ETFs remain Phase 1.1.

## Required Secrets

Set these GitHub repository secrets before relying on the scheduled workflow:

- `NEXT_PUBLIC_SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

Do not print or commit secret values.

## Schedule

GitHub Actions workflow:

- `.github/workflows/daily-after-close-update.yml`
- Weekdays at `17:30 Asia/Taipei`
- Manual trigger is also available through `workflow_dispatch`

## Manual Commands

Dry-run:

```bash
node --env-file=.env.local scripts/run-daily-after-close-update.mjs
```

Write:

```bash
node --env-file=.env.local scripts/run-daily-after-close-update.mjs --write
```

Readback:

```bash
node --env-file=.env.local scripts/check-supabase-freshness.mjs
```

## Success Criteria

The update is healthy when:

- `run:daily-after-close-update` returns `status: "ok"`
- `dryRun` is `false`
- `priceRowsWritten` is greater than `0`
- `scoreRowsWritten` is greater than `0`
- `db:freshness` returns `status: "ok"`
- `daily_prices` and `daily_scores` share the same latest `data_end_date`

## Failure Handling

If the workflow fails:

1. Run the dry-run command locally.
2. Check whether TWSE OpenAPI has published that trading day.
3. Run `db:freshness` to confirm the last successful date.
4. Do not change source labels or claim newer data until readback passes.
