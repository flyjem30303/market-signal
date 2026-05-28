import fs from "node:fs";

const path = "docs/reviews/CP3_TW_STOCK_LEGAL_FIELD_CONTRACT_REVIEW_2026-05-29.md";
const requiredPhrases = [
  "REVISE",
  "not approved for ingestion",
  "not approved for automated historical collection",
  "not approved for public raw redistribution",
  "not approved for scoreSource=real",
  "not approved for public backtest claims",
  "https://data.gov.tw/license",
  "https://data.gov.tw/en/faqs/903",
  "https://www.tpex.org.tw/openapi/",
  "contract review required",
  "Date -> trade_date",
  "Code -> symbol",
  "SecuritiesCompanyCode -> symbol",
  "corporate-action adjustment policy not documented",
  "inactive / delisted symbol handling not documented",
  "survivorship-bias policy not documented",
  "ETF exclusion filter not documented",
  "keep CP3 source-depth gate not_ready",
  "do not write Supabase",
  "do not commit downloaded market data"
];

const content = fs.readFileSync(path, "utf8");
const missing = requiredPhrases.filter((phrase) => !content.includes(phrase));

console.log(
  JSON.stringify(
    {
      missing,
      review: path,
      status: missing.length === 0 ? "ok" : "blocked"
    },
    null,
    2
  )
);

if (missing.length > 0) {
  process.exitCode = 1;
}
