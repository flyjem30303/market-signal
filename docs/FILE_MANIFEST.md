# File Manifest

搬移專案時至少需要以下檔案與資料夾。

## 根目錄

```text
README.md
PROJECT_STATUS.md
package.json
package-lock.json
.env.example
next.config.mjs
tsconfig.json
next-env.d.ts
index.html
styles.css
script.js
```

## Next.js App

```text
src/app/layout.tsx
src/app/page.tsx
src/app/globals.css
src/app/briefing/page.tsx
src/app/stocks/[symbol]/page.tsx
src/app/internal/page.tsx
src/app/internal/etf-source-readiness/page.tsx
src/app/weekly/page.tsx
src/app/methodology/page.tsx
src/app/disclaimer/page.tsx
src/app/privacy/page.tsx
src/app/terms/page.tsx
src/app/sitemap.ts
src/app/robots.ts
```

## Components

```text
src/components/dashboard-shell.tsx
src/components/stock-seo-content.tsx
src/components/commercial-slot.tsx
src/components/page-view-tracker.tsx
```

## Lib

```text
src/lib/assets.ts
src/lib/signal-model.ts
src/lib/market-data.ts
src/lib/site.ts
src/lib/tracking.ts
src/lib/repositories/types.ts
src/lib/repositories/mock-market-signal-repository.ts
src/lib/repositories/supabase-market-signal-repository.ts
src/lib/repositories/market-signal-repository.ts
src/lib/asset-type-policy.ts
src/lib/etf-source-readiness.ts
src/lib/public-release-gate.ts
src/lib/supabase/client.ts
src/lib/supabase/server.ts
src/lib/supabase/database.types.ts
```

## Data / Supabase / Scripts

```text
data/seeds/stocks.seed.json
data/seeds/markets.seed.json
data/source-gates/etf-source-gate.json
data/source-gates/etf-source-due-diligence.json
supabase/migrations/0001_initial_schema.sql
supabase/migrations/0002_etf_data_model.sql
supabase/bootstrap.sql
supabase/seed/000_seed_markets.sql
supabase/seed/001_seed_stocks.sql
supabase/seed/002_seed_latest_market_data.sql
supabase/seed/003_seed_data_runs.sql
scripts/seed-stocks-sql.mjs
scripts/seed-markets-sql.mjs
scripts/seed-data-runs-sql.mjs
scripts/fetch-twse-stock-master.mjs
scripts/fetch-twse-daily-market.mjs
scripts/build-supabase-bootstrap.mjs
scripts/validate-supabase-bootstrap.mjs
scripts/review-supabase-market-trust.mjs
scripts/check-asset-type-policy.mjs
scripts/check-supabase-etf-schema.mjs
scripts/check-etf-source-gate.mjs
scripts/check-etf-due-diligence.mjs
scripts/report-etf-source-readiness.mjs
scripts/README.md
```

## Docs

```text
docs/AB_COLLABORATION.md
docs/B_REQUESTS_TO_A.md
docs/C_REQUESTS_TO_A.md
docs/D_LEGAL_REVIEW.md
docs/E_CEO_STRATEGY.md
docs/E_REQUESTS_TO_A.md
docs/F_DESIGN_STRATEGY.md
docs/F_REQUESTS_TO_A.md
docs/HANDOFF.md
docs/GLOBALIZATION_STRATEGY.md
docs/PROJECT_REVIEW_CHECKPOINTS.md
docs/reviews/CP1_DATA_TRUST_2026-05-28.md
docs/reviews/CP1_SUPABASE_MARKET_TRUST_REVIEW_2026-05-29.md
docs/reviews/CP1_PUBLIC_RELEASE_GATE_2026-05-29.md
docs/reviews/CP1_ETF_DATA_MODEL_2026-05-29.md
docs/reviews/CP1_ETF_SCHEMA_2026-05-29.md
docs/reviews/CP1_ETF_SCHEMA_ROLLOUT_GUARD_2026-05-29.md
docs/reviews/CP1_ETF_SOURCE_SELECTION_GATE_2026-05-29.md
docs/reviews/CP1_ETF_SOURCE_RESEARCH_2026-05-29.md
docs/reviews/CP1_ETF_SOURCE_READINESS_SCORE_2026-05-29.md
docs/reviews/CP1_ETF_SOURCE_DUE_DILIGENCE_2026-05-29.md
docs/reviews/CP1_ETF_SOURCE_REPORTING_2026-05-29.md
docs/reviews/CP1_ETF_SOURCE_INTERNAL_VIEW_2026-05-29.md
docs/reviews/CP1_INTERNAL_DIAGNOSTICS_CONSOLE_2026-05-29.md
docs/MIGRATION_CHECKLIST.md
docs/FILE_MANIFEST.md
docs/MVP_TASKS.md
docs/STOCK_PAGE_STRATEGY.md
docs/MODEL_SCORING_STANDARD.md
docs/COMMERCIALIZATION_PLAN.md
docs/TRACKING_EVENTS.md
docs/REPOSITORY_ARCHITECTURE.md
docs/SUPABASE_SETUP.md
docs/SUPABASE_EXECUTION_RUNBOOK.md
docs/DATA_SCHEMA.md
docs/ETF_DATA_MODEL.md
docs/ETF_SCHEMA.md
docs/ETF_SOURCE_SELECTION.md
docs/ETF_SOURCE_RESEARCH_2026-05-29.md
docs/DATA_FRESHNESS_UI.md
docs/DATA_SOURCES.md
docs/INGESTION_PLAN.md
docs/SITEMAP.md
docs/ROADMAP.md
docs/NEXT_ENGINEERING_SLICE.md
docs/MARKETING_STRATEGY.md
```

如果部分文件不存在，以實際 `docs/` 資料夾為準。

## 不建議搬移

```text
node_modules/
.next/
dist/
build/
*.log
.env
.env.local
```
