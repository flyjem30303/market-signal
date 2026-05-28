import fs from "node:fs";

const path = "docs/CP3_TWSE_STOCK_DAY_HISTORICAL_ENDPOINT_RESEARCH_2026-05-29.md";
const requiredPhrases = [
  "Status: candidate historical endpoint identified",
  "REVISE",
  "STOCK_DAY_ALL returned the same observed date 1150527",
  "https://www.twse.com.tw/zh/trading/historical/stock-day.html",
  "https://www.twse.com.tw/exchangeReport/STOCK_DAY?response=json&date=YYYYMMDD&stockNo=2330",
  "https://www.twse.com.tw/rwd/zh/afterTrading/STOCK_DAY?response=json&date=YYYYMMDD&stockNo=2330",
  "one TWSE listed symbol only: 2330",
  "maximum 3 month probes: 20260501, 20200101, 20100101",
  "discard response bodies after metadata extraction",
  "no bulk crawl",
  "no symbol loop",
  "no month loop",
  "no year loop",
  "no raw market rows stored",
  "no Supabase writes",
  "no scoreSource=real",
  "no public backtest claims",
  "automated collection, storage, attribution, and derived-score use still require review",
  "CP3 source-depth remains not_ready"
];

const content = fs.readFileSync(path, "utf8");
const missing = requiredPhrases.filter((phrase) => !content.includes(phrase));

console.log(
  JSON.stringify(
    {
      missing,
      research: path,
      status: missing.length === 0 ? "ok" : "blocked"
    },
    null,
    2
  )
);

if (missing.length > 0) {
  process.exitCode = 1;
}
