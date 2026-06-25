# A1 Daily Auto Update Fix - 2026-06-24

## Incident

Production site still showed data date `2026-06-22` on 2026-06-24, while TWSE OpenAPI had already published `2026-06-23`.

## Findings

- TWSE OpenAPI source had `2026-06-23`.
- Supabase was still at `2026-06-22` before recovery.
- GitHub Actions had schedule runs, including one success and one failure.
- The failed schedule stopped at `Update daily prices and scores`.
- Local dry-run of the same daily runner produced `dataDate=2026-06-23`.
- After recovery write, Supabase freshness advanced to `2026-06-23`.
- Production homepage still rendered `2026-06-22` because the response was served from Vercel cache.

## Recovery write

This was a bounded production freshness recovery, not a historical rerun.

- Source: TWSE OpenAPI
- Target date: `2026-06-23`
- Target tables: `daily_prices`, `daily_scores`, `data_runs`
- Price rows written: 1082
- Score rows written: 1082
- Result: `status=ok`

## Verification after recovery

- `check-supabase-freshness`: `as_of_date=2026-06-23`, `status=ok`
- `check-phase-1-1-core-symbol-freshness`: all core symbols latest price/score date `2026-06-23`, `status=ok`
- `check-phase-1-1-listed-equity-coverage-rollup`: adjusted price/score coverage `100%`, latest date `2026-06-23`, `status=ok`

## Code fixes prepared

### Daily runner retry

File:

- `scripts/run-daily-after-close-update.mjs`

Change:

- Added TWSE fetch retry for daily source fetches.
- Retry delays: `750ms`, `2000ms`, `5000ms`.
- Goal: avoid one transient TWSE/network failure causing the scheduled write run to fail.

### Homepage freshness cache

File:

- `src/app/page.tsx`

Change:

- Replaced `revalidate = 300` with `dynamic = "force-dynamic"`.
- Goal: production homepage reads latest Supabase freshness instead of serving stale Vercel/ISR HTML after daily data writes.

## PM integration files

PM should integrate and deploy:

- `.github/workflows/daily-after-close-update.yml`
- `scripts/run-daily-after-close-update.mjs`
- `src/app/page.tsx`
- `docs/A1_DAILY_AUTO_UPDATE_FIX_2026_06_24.md`

## PM follow-up correction

Daily workflow status must distinguish hard freshness failures from coverage/metadata review items.

- `check-supabase-freshness` remains a hard gate.
- `check-phase-1-1-core-symbol-freshness` remains a hard gate.
- `check-phase-1-1-listed-equity-coverage-rollup` now runs as `--report-only` in the scheduled workflow.
- Post-deploy PM verification should read live freshness with `db:freshness` and `check:phase-1-1-core-symbol-freshness` before interpreting the broader daily ops summary.

Reason:

- A small number of active symbols can be absent from the latest TWSE payload or require metadata review.
- Those cases should be visible to PM, but they should not mark an otherwise successful daily write as failed.
- A true red light remains core freshness failure, Supabase freshness failure, stale score/price mismatch, or write failure.

Related existing context:

- `docs/A1_PM_INTEGRATION_HANDOFF_2026_06_22.md`
- `docs/A1_DAILY_PRODUCTION_WORKFLOW_HARDENING_RUNBOOK.md`
- `docs/A1_PM_CEO_ROUTINE_OPS_ADOPTION_DECISION_2026_06_21.md`

## Post-deploy verification

After PM merges and deploys:

1. Open production homepage and confirm visible date is `2026-06-23` or newer.
2. Check response headers; homepage should not remain stale solely due to Vercel cache.
3. Run `report:a1-daily-ops-summary`.
4. Observe the next scheduled daily workflow.
5. If the scheduled write run fails again, inspect the failed step log with repo admin access and escalate using the A1 red-light packet.

## Boundaries preserved

- No UI layout changes.
- No `/stocks` full-history query expansion.
- No raw market data committed.
- No arbitrary historical rerun.
- No Phase 2A global ingestion.
- Freshness/stale status remains a data confidence signal, not a market reason.
