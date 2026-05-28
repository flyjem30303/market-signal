import fs from "node:fs";

const path = "docs/CP3_TW_STOCK_HISTORICAL_SOURCE_RESEARCH_2026-05-29.md";
const requiredPhrases = [
  "Status: research recorded",
  "REVISE",
  "https://data.gov.tw/dataset/11549",
  "https://data.gov.tw/en/datasets/11548",
  "https://data.gov.tw/en/datasets/11547",
  "https://www.twse.com.tw/zh/trading/historical/stock-day.html",
  "https://www.tpex.org.tw/openapi/",
  "https://www.tpex.org.tw/en-us/mainboard/trading/info/pricing_hist96.html",
  "https://eshop.tpex.org.tw/en/product/detail/2c92e01394fcf4c7019518bffe06000c",
  "license / terms reviewed by D",
  "endpoint contract documented by A",
  "historical depth smoke report passes",
  "no historical ingestion",
  "no Supabase writes",
  "no public backtest claims",
  "no scoreSource=real"
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
