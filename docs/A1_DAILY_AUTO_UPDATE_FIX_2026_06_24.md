# A1 Daily Auto Update Fix - 2026-06-24

## Incident

Production freshness can lag behind the latest TWSE trading day when the scheduled daily write fails or when the homepage serves stale cached HTML.

## Fix

- `scripts/run-daily-after-close-update.mjs`
  - Adds bounded retry for TWSE OpenAPI and MI_INDEX source fetches.
  - Retry delays: `750ms`, `2000ms`, `5000ms`.
- `.github/workflows/daily-after-close-update.yml`
  - Keeps 15:30 Asia/Taipei observation run as no-write.
  - Keeps 17:30 Asia/Taipei write run as the only scheduled write.
  - Runs listed-equity coverage rollup as `--report-only` so metadata/coverage review remains visible but does not mark a successful write as failed.
- `src/app/page.tsx`
  - Uses `dynamic = "force-dynamic"` so the homepage reads latest freshness instead of stale ISR HTML.

## Hard Gates

- Supabase freshness remains a hard gate.
- Core symbol freshness remains a hard gate.
- Daily write failure remains a hard gate.

## Review-Only Signal

Listed-equity coverage can be `review` when a small number of symbols are missing from the latest TWSE payload or require metadata maintenance. This should be visible to PM but should not block the daily workflow if core freshness passes.

## Post-Deploy Verification

1. Open production homepage and confirm the visible data date is the latest Supabase freshness date.
2. Run `node --env-file=.env.local scripts/check-supabase-freshness.mjs`.
3. Run `node --env-file=.env.local scripts/check-phase-1-1-core-symbol-freshness.mjs`.
4. Observe the next scheduled daily workflow.

## Boundaries

- No arbitrary historical rerun.
- No raw market data committed.
- No Phase 2A global ingestion.
- No production scoring formula change.
