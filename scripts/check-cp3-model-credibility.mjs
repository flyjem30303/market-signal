import fs from "node:fs";

const path = "docs/CP3_MODEL_CREDIBILITY_PLAN.md";
const requiredBlockingPhrases = [
  "Status: not ready",
  "NOT_READY",
  "real scoring model design: not approved",
  "data quality rules: not approved",
  "backtest methodology: not approved",
  "public model disclosure: not approved",
  "market-specific calibration: not approved"
];
const requiredOpenItems = [
  "- [ ] C / Investment Advisor approves score purpose and non-advisory framing.",
  "- [ ] Health score and risk score formulas are documented.",
  "- [ ] Required input fields are mapped to approved sources.",
  "- [ ] Backtest sample period is documented.",
  "- [ ] D / Legal approves public model disclosure."
];

const content = fs.readFileSync(path, "utf8");
const missingBlockingPhrases = requiredBlockingPhrases.filter((phrase) => !content.includes(phrase));
const missingOpenItems = requiredOpenItems.filter((item) => !content.includes(item));
const status = missingBlockingPhrases.length === 0 && missingOpenItems.length === 0 ? "not_ready" : "blocked";

console.log(
  JSON.stringify(
    {
      missing_blocking_phrases: missingBlockingPhrases,
      missing_open_items: missingOpenItems,
      plan: path,
      status
    },
    null,
    2
  )
);

if (status !== "not_ready") {
  process.exitCode = 1;
}
