import fs from "node:fs";

const reportPath = "docs/CP3_TWSE_STOCK_DAY_STAGING_SQL_DESIGN_2026-05-29.md";

const requiredPhrases = [
  "Status: design only",
  "REVISE",
  "non-executable SQL design",
  "no migration file",
  "no SQL code block",
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
  "CEO approval required before migration implementation",
  "staging_twse_stock_day_runs",
  "staging_twse_stock_day_prices",
  "run_id: uuid primary key",
  "source_id: text, expected twse-stock-day",
  "review_status: text",
  "decision: text",
  "unique(run_id, exchange_code, symbol, trade_date)",
  "RLS enabled on both staging tables",
  "no anonymous read",
  "service role write only for approved staging job",
  "internal review read only through token-gated server route",
  "dry-run cleanup count required",
  "never delete production daily_prices from staging cleanup",
  "Migration Review Checklist",
  "A / PM+Dev",
  "B / Marketing",
  "C / Investment",
  "D / Legal",
  "E / CEO",
  "F / Design",
  "draft migration review checklist for TWSE STOCK_DAY staging",
  "do not create migration file",
  "do not run SQL",
  "do not create staging tables"
];

const forbiddenPhrases = [
  "```sql",
  "CREATE TABLE ",
  "ALTER TABLE ",
  "INSERT INTO ",
  "CREATE INDEX ",
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
