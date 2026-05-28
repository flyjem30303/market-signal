import fs from "node:fs";

const path = "docs/CP3_TW_STOCK_INPUT_READINESS.md";
const requiredPhrases = [
  "Status: partial, not approved for real scoring",
  "ready_for_real_score: false",
  "dry_run_possible: limited",
  "minimum_viable_modules: price-trend, valuation",
  "blocked_modules: fundamentals, flow, market-context, macro-risk",
  "daily_prices.close",
  "daily_fundamentals.pe",
  "daily_flows.foreign_net_buy",
  "scoreSource: mock",
  "public_eligible: false",
  "missing_module_flags: fundamentals, flow, market-context, macro-risk",
  "REVISE"
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
