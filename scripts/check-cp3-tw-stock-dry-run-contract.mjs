import fs from "node:fs";

const path = "docs/CP3_TW_STOCK_DRY_RUN_CONTRACT.md";
const requiredPhrases = [
  "Status: draft, internal-only",
  "price-trend",
  "valuation",
  "model_version: tw-stock-signal-v0.1-candidate-dry-run",
  "scoreSource: mock",
  "public_eligible: false",
  "missing_module_flags",
  "fundamentals",
  "flow",
  "market-context",
  "macro-risk",
  "not investment advice",
  "must not write",
  "Supabase daily_scores",
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
