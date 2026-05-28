import fs from "node:fs";

const path = "docs/reviews/CP3_TWSE_STOCK_DAY_LICENSE_RATE_FIELD_CHECKLIST_2026-05-29.md";
const requiredPhrases = [
  "REVISE",
  "not approved for ingestion",
  "not approved for automated historical collection",
  "not approved for production storage",
  "not approved for public backtest claims",
  "not approved for scoreSource=real",
  "https://data.gov.tw/en/datasets/11549",
  "https://data.gov.tw/license",
  "https://data.gov.tw/en/faqs/903",
  "License: Open Government Data License, version 1.0",
  "Charge: free",
  "Update frequency: Every day",
  "confirm STOCK_DAY route is covered by the same dataset/license family as dataset 11549",
  "minimum 800 ms delay between requests",
  "no parallel requests",
  "maximum 3 retries per month after backoff",
  "stop on repeated HTTP 429 / 403 / 5xx",
  "source_id: twse-stock-day",
  "trade_date: 日期, convert ROC date to ISO date",
  "volume: 成交股數",
  "trade_value: 成交金額",
  "open_price: 開盤價",
  "high_price: 最高價",
  "low_price: 最低價",
  "close_price: 收盤價",
  "price_change: 漲跌價差",
  "transaction_count: 成交筆數",
  "convert ROC year to Gregorian year",
  "flag zero-row months",
  "do not infer missing prices silently",
  "corporate-action handling documented",
  "inactive / delisted symbol policy documented",
  "valuation / fundamental historical source verified",
  "keep CP3 source-depth production gate not_ready",
  "do not implement ingestion yet",
  "do not write Supabase",
  "do not commit raw market data",
  "keep public data source mock"
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
