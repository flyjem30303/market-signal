import fs from "node:fs";

const path = "docs/reviews/CP3_TWSE_STOCK_DAY_METADATA_PROBE_2026-05-29.md";
const requiredPhrases = [
  "Status: stock day metadata probe recorded",
  "REVISE",
  "metadata-only stock day probe",
  "one TWSE listed symbol only: 2330",
  "maximum 3 month probes: 20260501, 20200101, 20100101",
  "tested routes: exchangeReport/STOCK_DAY, rwd/zh/afterTrading/STOCK_DAY",
  "no raw market rows stored",
  "no CSV / JSON data files written",
  "no Supabase writes",
  "no scoreSource=real",
  "no public backtest claims",
  "response bodies discarded after metadata extraction",
  "source-depth smoke remains not_ready",
  "Keep public data source mock",
  "First Observed Date",
  "Last Observed Date",
  "Title Metadata",
  "Schema Fields",
  "Changing observed date ranges by requested month"
];

const content = fs.readFileSync(path, "utf8");
const missing = requiredPhrases.filter((phrase) => !content.includes(phrase));

console.log(
  JSON.stringify(
    {
      missing,
      report: path,
      status: missing.length === 0 ? "ok" : "blocked"
    },
    null,
    2
  )
);

if (missing.length > 0) {
  process.exitCode = 1;
}
