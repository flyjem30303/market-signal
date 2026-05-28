import fs from "node:fs";

const path = "docs/CP3_TW_STOCK_BACKTEST_METHOD.md";
const requiredPhrases = [
  "Status: draft, not approved",
  "2020-01-01",
  "20 trading days",
  "60 trading days",
  "120 trading days",
  "avoid look-ahead data",
  "transaction cost",
  "false positives",
  "false negatives",
  "survivorship limitations",
  "not investment advice",
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
