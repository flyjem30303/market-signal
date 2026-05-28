import fs from "node:fs";

const path = "docs/reviews/CP3_TW_STOCK_HISTORICAL_PARAMETER_PROBE_2026-05-29.md";
const requiredPhrases = [
  "Status: parameter metadata probe recorded",
  "REVISE",
  "metadata-only parameter probe",
  "one endpoint family tested",
  "tested endpoint family: TWSE-PRICE-DATE-PARAM",
  "tested parameter names: date, response_json_date, queryDate",
  "tested dates: 20260527, 20260526, 20200102",
  "no raw market rows stored",
  "no CSV / JSON data files written",
  "no Supabase writes",
  "no scoreSource=real",
  "no public backtest claims",
  "response bodies discarded after metadata extraction",
  "Observed Date Values Only As Metadata",
  "source-depth smoke remains not_ready",
  "Keep public data source mock"
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
