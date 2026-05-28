import fs from "node:fs";

const reportPath = "docs/reviews/CP3_SOURCE_DEPTH_EVIDENCE_GATE_DRAFT_2026-05-29.md";

const requiredPhrases = [
  "Status: CP3 source-depth evidence gate draft recorded",
  "REVISE",
  "local-only planning artifact",
  "does not approve historical ingestion, remote validation, Supabase reads, SQL execution, runtime repository work, public UI wiring, production `scoreSource=real`, or public claims",
  "define what evidence is required before source_depth_state can move beyond not_ready",
  "keep latest-row dry-run separate from historical evidence",
  "keep source-depth evidence separate from source-rights evidence",
  "keep source-depth evidence separate from backtest approval",
  "keep source-depth evidence separate from public claim approval",
  "prevent scoreSource=real from bypassing source-depth evidence",
  "price history depth evidence",
  "fundamental history depth evidence",
  "preferred start date evidence",
  "continuous symbol coverage evidence",
  "missing-date handling evidence",
  "corporate-action handling evidence",
  "inactive and delisted symbol handling evidence",
  "endpoint stability evidence",
  "field semantics evidence",
  "market-calendar alignment evidence",
  "sample-size threshold evidence",
  "reproducibility evidence",
  "price history must cover at least 756 trading dates",
  "fundamental history must cover at least 252 trading dates",
  "preferred start date must be 2020-01-01 or earlier",
  "source_depth_state remains not_ready",
  "price-history-depth-not-ready remains expected",
  "fundamental-history-depth-not-ready remains expected",
  "latest-row seed is not historical evidence",
  "controlled dry-run report is not backtest evidence",
  "sample packet validation is not source-depth evidence",
  "docs/CP3_TW_STOCK_SOURCE_DEPTH_VALIDATION.md",
  "scripts/check-cp3-tw-stock-source-depth.mjs",
  "source-depth evidence gate draft only",
  "do not create JSON sample artifacts",
  "do not create JSON market data",
  "do not create CSV market data",
  "do not fetch market data",
  "do not run source-depth validator against Supabase",
  "do not import copy tokens into public pages",
  "do not import copy tokens into public components",
  "do not import policy into public pages",
  "do not import policy into public components",
  "do not wire policy into data fetching",
  "do not implement runtime repository",
  "do not read remote data",
  "do not run validator",
  "do not connect to Supabase",
  "do not run SQL",
  "do not write Supabase",
  "do not write staging rows",
  "do not write daily_prices",
  "do not create seed SQL",
  "do not store raw market rows",
  "do not commit CSV / JSON market data files",
  "do not set scoreSource=real",
  "do not make public backtest claims",
  "do not clear source-depth not_ready",
  "CP3 source-depth production gate remains not_ready",
  "Keep public data source mock",
  "record CP3 source-depth evidence gate role review"
];

const report = fs.existsSync(reportPath) ? fs.readFileSync(reportPath, "utf8") : "";
const missing = requiredPhrases.filter((phrase) => !report.includes(phrase));

console.log(
  JSON.stringify(
    {
      missing,
      report: reportPath,
      status: missing.length === 0 ? "ok" : "blocked"
    },
    null,
    2
  )
);

if (missing.length > 0) {
  process.exitCode = 1;
}
