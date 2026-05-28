import fs from "node:fs";

const path = "docs/CP3_TW_STOCK_HISTORICAL_DATA_PLAN.md";
const requiredPhrases = [
  "Status: not approved",
  "daily_prices: at least 756 trading dates",
  "daily_fundamentals: at least 252 trading dates",
  "start_date: 2020-01-01 or earlier",
  "Path A: Official Historical Endpoints",
  "Path B: Contracted / Licensed Data",
  "Path C: Internal Research Import",
  "license / terms reviewed by D",
  "CP3 source-depth gate ready",
  "do not ingest yet",
  "no scoreSource=real",
  "REVISE"
];

const content = fs.readFileSync(path, "utf8");
const missing = requiredPhrases.filter((phrase) => !content.includes(phrase));

console.log(
  JSON.stringify(
    {
      missing,
      plan: path,
      status: missing.length === 0 ? "ok" : "blocked"
    },
    null,
    2
  )
);

if (missing.length > 0) {
  process.exitCode = 1;
}
