import fs from "node:fs";

const path = "docs/CP3_TW_STOCK_HISTORICAL_PARAMETER_PROBE_PLAN_2026-05-29.md";
const requiredPhrases = [
  "Status: probe plan drafted",
  "REVISE",
  "metadata-only parameter probe",
  "maximum 3 test dates per endpoint",
  "maximum 5 endpoints per run",
  "discard response bodies after metadata extraction",
  "no bulk crawl",
  "no symbol loop",
  "no month loop",
  "no year loop",
  "no committed CSV / JSON market data",
  "no Supabase writes",
  "no scoreSource=real",
  "no public backtest claims",
  "2020-01-02",
  "TWSE-PRICE-DATE-PARAM",
  "TWSE-VALUATION-DATE-PARAM",
  "TPEX-PRICE-DATE-PARAM",
  "TPEX-VALUATION-DATE-PARAM",
  "Status: parameter metadata probe recorded",
  "source-depth smoke remains not_ready",
  "Keep public data source mock"
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
