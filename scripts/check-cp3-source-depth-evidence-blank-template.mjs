import fs from "node:fs";

const templatePath = "docs/evidence/CP3_SOURCE_DEPTH_CATEGORY_EVIDENCE_TEMPLATE.md";

const requiredPhrases = [
  "# CP3 Source-Depth Evidence: <CATEGORY>",
  "Status: not_ready",
  "## Evidence Category",
  "## Market And Asset Scope",
  "## Symbol Scope",
  "## Date Range Summary",
  "## Trading Date Count Summary",
  "## Field Availability Summary",
  "## Missing-Date Policy",
  "## Corporate-Action Policy",
  "## Inactive And Delisted Symbol Policy",
  "## Endpoint Stability Summary",
  "## Field Semantics Summary",
  "## Market Calendar Summary",
  "## Sample Size Summary",
  "## Reproducibility Steps",
  "## Public-Claim Boundary",
  "no public claims approved",
  "## Source-Rights Boundary",
  "no source-rights approval granted",
  "## Display-State Boundary",
  "non-runtime state labels only",
  "## Limitations",
  "## Review Owner",
  "## Approval Status",
  "not_ready",
  "## CEO Synthesis",
  "## Non-Negotiable Guardrails",
  "blank template only",
  "do not add raw market rows",
  "do not add CSV market data",
  "do not add JSON market data",
  "do not add Supabase reads",
  "do not add SQL execution",
  "do not set scoreSource=real",
  "do not approve public claims",
  "do not approve source rights",
  "do not approve backtest claims",
  "do not clear source-depth not_ready",
  "CP3 source-depth production gate remains not_ready",
  "Keep public data source mock"
];

const forbiddenPhrases = [
  "Status: approved",
  "scoreSource=real approved",
  "public claims are approved",
  "source-rights are approved",
  "backtest approved",
  "Supabase read completed",
  "SQL executed",
  "raw OHLCV",
  "daily_prices"
];

const template = fs.existsSync(templatePath) ? fs.readFileSync(templatePath, "utf8") : "";
const missing = requiredPhrases.filter((phrase) => !template.includes(phrase));
const forbidden = forbiddenPhrases.filter((phrase) => template.includes(phrase));

console.log(
  JSON.stringify(
    {
      forbidden,
      missing,
      report: templatePath,
      status: missing.length === 0 && forbidden.length === 0 ? "ok" : "blocked"
    },
    null,
    2
  )
);

if (missing.length > 0 || forbidden.length > 0) {
  process.exitCode = 1;
}
