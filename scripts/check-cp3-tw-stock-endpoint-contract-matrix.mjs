import fs from "node:fs";

const path = "docs/CP3_TW_STOCK_ENDPOINT_CONTRACT_MATRIX_2026-05-29.md";
const requiredPhrases = [
  "Status: contract matrix drafted",
  "REVISE",
  "metadata probe only",
  "no historical data download committed",
  "no Supabase writes",
  "no scoreSource=real",
  "no public backtest claims",
  "license / terms reviewed by D before ingestion",
  "TWSE-PRICE-DAILY-ALL",
  "exchangeReport/STOCK_DAY_ALL",
  "TWSE-PRICE-AVG-ALL",
  "exchangeReport/STOCK_DAY_AVG_ALL",
  "TWSE-VALUATION-DATE",
  "exchangeReport/BWIBBU_d",
  "TPEX-PRICE-DAILY",
  "tpex_mainboard_daily_close_quotes",
  "TPEX-VALUATION",
  "tpex_mainboard_peratio_analysis",
  "TPEX-ESHOP-EOD",
  "record HTTP status, content type, schema keys, and sample row count",
  "discard response body after extracting metadata",
  "do not write data files"
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
