import fs from "node:fs";

const reportPath = "docs/CP3_SOURCE_DEPTH_EVIDENCE_MATRIX_2026-05-29.md";

const requiredPhrases = [
  "Status: CP3 source-depth evidence matrix recorded",
  "REVISE",
  "local-only planning artifact",
  "does not approve historical ingestion, remote validation, Supabase reads, SQL execution, runtime repository work, public UI wiring, production",
  "source-depth approval, or public claims",
  "Price history depth",
  "Fundamental history depth",
  "Preferred start date",
  "Continuous symbol coverage",
  "Missing-date handling",
  "Corporate-action handling",
  "Inactive and delisted symbol handling",
  "Endpoint stability",
  "Field semantics",
  "Market-calendar alignment",
  "Sample-size thresholds",
  "Reproducibility",
  "Documented trading-date count by market, symbol set, and date range",
  "Documented valuation / fundamental date count and field availability",
  "Evidence that usable history starts 2020-01-01 or earlier",
  "Coverage table for selected symbols, listing gaps and exclusions",
  "Documented policy for holidays, suspended trading, no-trade days, and missing rows",
  "Documented adjustment policy for splits, dividends, capital reductions, and comparable price history",
  "Documented endpoint behavior, rate behavior, schema stability, and failure modes",
  "Documented meaning, unit, adjustment status, and permitted use for every score field",
  "Documented rerun steps, deterministic inputs, versioned assumptions, and review owner",
  "source_depth_state remains not_ready",
  "price history depth remains not_ready",
  "fundamental history depth remains not_ready",
  "preferred start date remains not_ready",
  "continuous symbol coverage remains not_ready",
  "missing-date handling remains not_ready",
  "corporate-action handling remains not_ready",
  "inactive and delisted symbol handling remains not_ready",
  "endpoint stability remains not_ready",
  "field semantics remains not_ready",
  "market-calendar alignment remains not_ready",
  "sample-size thresholds remains not_ready",
  "reproducibility remains not_ready",
  "latest-row seed is not historical evidence",
  "controlled dry-run report is not backtest evidence",
  "sample packet validation is not source-depth evidence",
  "source-depth evidence is not source-rights evidence",
  "source-depth evidence is not backtest approval",
  "source-depth evidence is not public claim approval",
  "future evidence checker must keep all evidence categories separate",
  "future evidence checker must reject source_depth_state approved when any category is not_ready",
  "future evidence checker must reject public approved display when price history depth is not_ready",
  "future evidence checker must reject public approved display when fundamental history depth is not_ready",
  "future evidence checker must reject public approved display when reproducibility is not_ready",
  "future evidence checker must remain local-only until CEO approves remote validation",
  "source-depth evidence matrix only",
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
  "record CP3 source-depth evidence matrix role review"
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
