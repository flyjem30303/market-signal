import fs from "node:fs";

const runnerPath = "scripts/run-daily-after-close-update.mjs";
const runner = fs.readFileSync(runnerPath, "utf8");

const requiredSnippets = [
  {
    id: "mi_index_base_url",
    snippet: "const TWSE_MI_INDEX_URL = \"https://www.twse.com.tw/exchangeReport/MI_INDEX\";",
    reason: "Daily runner must have a TWSE MI_INDEX fallback source when OpenAPI lags."
  },
  {
    id: "fallback_date_arg",
    snippet: "--fallback-date=",
    reason: "Daily runner needs an explicit fallback date for bounded same-day verification."
  },
  {
    id: "fetch_mi_index_date",
    snippet: "async function fetchMiIndexDate(",
    reason: "Daily runner must fetch a sanitized MI_INDEX daily candidate."
  },
  {
    id: "mi_index_stock_table",
    snippet: "每日收盤行情",
    reason: "MI_INDEX fallback must target the daily close table, not arbitrary tables."
  },
  {
    id: "mi_index_twii_table",
    snippet: "價格指數(臺灣證券交易所)",
    reason: "MI_INDEX fallback should be able to recover TWII when the OpenAPI index endpoint lags."
  },
  {
    id: "fallback_source_reported",
    snippet: "miIndexFallbackUsed",
    reason: "Dry-run and write summaries must reveal whether fallback was used."
  }
];

const failures = requiredSnippets
  .filter((requirement) => !runner.includes(requirement.snippet))
  .map(({ id, reason, snippet }) => ({ id, reason, snippet }));

const result = {
  checkedFile: runnerPath,
  failures,
  requiredCount: requiredSnippets.length,
  status: failures.length === 0 ? "ok" : "failed"
};

console.log(JSON.stringify(result, null, 2));
if (failures.length > 0) process.exitCode = 1;
