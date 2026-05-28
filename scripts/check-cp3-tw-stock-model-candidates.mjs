import fs from "node:fs";

const path = "docs/CP3_TW_STOCK_MODEL_CANDIDATES.md";
const requiredPhrases = [
  "Status: draft, not approved",
  "tw-stock-signal-v0.1-candidate",
  "price-trend",
  "valuation",
  "fundamentals",
  "flow",
  "market-context",
  "macro-risk",
  "data_quality_score >= 80",
  "scoreSource must remain mock or unavailable",
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
