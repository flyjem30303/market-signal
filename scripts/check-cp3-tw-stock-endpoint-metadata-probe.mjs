import fs from "node:fs";

const path = "docs/reviews/CP3_TW_STOCK_ENDPOINT_METADATA_PROBE_2026-05-29.md";
const requiredPhrases = [
  "Status: metadata probe recorded",
  "REVISE",
  "metadata-only endpoint probe",
  "no raw market rows stored",
  "no CSV / JSON data files written",
  "no Supabase writes",
  "no scoreSource=real",
  "no public backtest claims",
  "response bodies discarded after metadata extraction",
  "TWSE-PRICE-DAILY-ALL",
  "TWSE-PRICE-AVG-ALL",
  "TWSE-VALUATION-DATE",
  "TPEX-PRICE-DAILY",
  "TPEX-VALUATION",
  "source-depth smoke still not_ready"
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
