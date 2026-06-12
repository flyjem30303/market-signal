import fs from "node:fs";

const path = "docs/OPEN_FREE_AUTO_DATA_SOURCE_GATE.md";
const content = fs.readFileSync(path, "utf8");

const requiredPhrases = [
  "Status: `open_free_auto_data_source_gate_ready_for_pm_selection`",
  "legal, free, no-manual-operation, automatable data source",
  "unconsented TWSE website crawling, scraping, scripted download, or browser automation",
  "manual daily download / manual upload as the primary operating model",
  "paid vendor contracts",
  "Candidate 1: TWSE OpenAPI via data.gov open-data references",
  "Status: `accepted_candidate_for_bounded_pm_validation`",
  "Data.gov license: `https://data.gov.tw/license`",
  "TWSE OpenAPI swagger: `https://openapi.twse.com.tw/v1/swagger.json`",
  "Data.gov dataset: `https://data.gov.tw/dataset/11669`",
  "Data.gov dataset: `https://data.gov.tw/dataset/11548`",
  "Data.gov dataset: `https://data.gov.tw/dataset/11549`",
  "/indicesReport/MI_5MINS_HIST",
  "/exchangeReport/STOCK_DAY_AVG_ALL",
  "/exchangeReport/STOCK_DAY_ALL",
  "/exchangeReport/MI_INDEX",
  "accepted: legal/free/automatable candidate for bounded PM validation",
  "daily close and same-day trading-information coverage appears sufficient",
  "no human daily operation required",
  "not accepted yet: Supabase write",
  "not accepted yet: `daily_prices` mutation",
  "not accepted yet: public real-data promotion",
  "not accepted yet: `publicDataSource=supabase`",
  "not accepted yet: `scoreSource=real`",
  "`twse_openapi_bounded_metadata_and_terms_validation`",
  "Candidate 2: TPEx OpenAPI for OTC / listed-over-counter expansion",
  "TPEx OpenAPI swagger: `https://www.tpex.org.tw/openapi/swagger.json`",
  "/tpex_mainboard_daily_close_quotes",
  "/tpex_daily_trading_index",
  "primary data-source path becomes `official_open_data_api`",
  "manual import becomes fallback only",
  "unconsented TWSE website crawling remains blocked",
  "runtime remains `publicDataSource=mock`",
  "score remains `scoreSource=mock`",
  "No SQL, Supabase write, staging row, `daily_prices` mutation, raw market-data storage, or public real-data promotion occurs"
];

const missing = requiredPhrases.filter((phrase) => !content.includes(phrase));

console.log(
  JSON.stringify(
    {
      status: missing.length === 0 ? "ok" : "blocked",
      docPath: path,
      guardedStatus: "open_free_auto_data_source_gate_ready_for_pm_selection",
      acceptedPrimaryCandidate: "twse_openapi_via_data_gov_open_data_references",
      nextGate: "twse_openapi_bounded_metadata_and_terms_validation",
      missing
    },
    null,
    2
  )
);

if (missing.length > 0) {
  process.exitCode = 1;
}
