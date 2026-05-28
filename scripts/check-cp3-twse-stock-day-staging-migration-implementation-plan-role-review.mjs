import fs from "node:fs";

const reportPath = "docs/reviews/CP3_TWSE_STOCK_DAY_STAGING_MIGRATION_IMPLEMENTATION_PLAN_ROLE_REVIEW_2026-05-29.md";

const requiredPhrases = [
  "Status: role review recorded",
  "REVISE",
  "decision-ready plan",
  "role review only",
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
  "source_id: twse-stock-day",
  "total_parsed_row_count: 787",
  "decision: ready_for_review",
  "A / PM+Dev",
  "B / Marketing",
  "C / Investment",
  "D / Legal",
  "E / CEO",
  "F / Design",
  "Conflicts",
  "CEO Synthesis",
  "The plan is complete enough to ask for a migration draft approval decision",
  "next gate must name whether migration draft creation is approved",
  "record CEO migration draft approval gate for TWSE STOCK_DAY staging",
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
