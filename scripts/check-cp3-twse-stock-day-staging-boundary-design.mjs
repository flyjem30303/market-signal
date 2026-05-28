import fs from "node:fs";

const reportPath = "docs/CP3_TWSE_STOCK_DAY_STAGING_BOUNDARY_DESIGN_2026-05-29.md";

const requiredPhrases = [
  "Status: design only",
  "REVISE",
  "staging boundary",
  "source_id: twse-stock-day",
  "total_parsed_row_count: 787",
  "decision: ready_for_review",
  "design only",
  "no Supabase writes",
  "no staging writes",
  "no daily_prices writes",
  "no seed SQL",
  "no table creation",
  "no raw market rows stored",
  "no CSV / JSON market data files",
  "no scoreSource=real",
  "no public backtest claims",
  "CP3 source-depth production gate remains not_ready",
  "Keep public data source mock",
  "CEO approval required before staging implementation",
  "staging_twse_stock_day_runs",
  "staging_twse_stock_day_prices",
  "run_id",
  "review_status: draft / pending_review / approved_for_production / rejected",
  "unique(run_id, exchange_code, symbol, trade_date)",
  "delete by run_id only",
  "never delete production daily_prices from staging cleanup",
  "source_row_hash",
  "RLS policy reviewed before staging implementation",
  "no public API exposes staging rows",
  "internal route token gate required before any staging review UI",
  "A / PM+Dev",
  "B / Marketing",
  "C / Investment",
  "D / Legal",
  "E / CEO",
  "F / Design",
  "draft staging SQL design for TWSE STOCK_DAY",
  "do not run SQL",
  "do not create staging tables",
  "do not create seed SQL yet"
];

const forbiddenPhrases = [
  "```sql",
  "supabase.from(",
  ".insert(",
  ".upsert(",
  "createClient",
  "@supabase/supabase-js"
];

const report = fs.existsSync(reportPath) ? fs.readFileSync(reportPath, "utf8") : "";
const missing = requiredPhrases.filter((phrase) => !report.includes(phrase));
const forbidden = forbiddenPhrases.filter((phrase) => report.includes(phrase));

console.log(
  JSON.stringify(
    {
      forbidden,
      missing,
      report: reportPath,
      status: missing.length === 0 && forbidden.length === 0 ? "ok" : "blocked"
    },
    null,
    2
  )
);

if (missing.length > 0 || forbidden.length > 0) {
  process.exitCode = 1;
}
