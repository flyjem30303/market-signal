import fs from "node:fs";

const reportPath = "docs/CP3_SOURCE_DEPTH_EVIDENCE_TEMPLATE_USAGE_GUIDE_2026-05-29.md";

const requiredPhrases = [
  "Status: local-only usage guide recorded",
  "REVISE",
  "local-only usage guide",
  "does not approve creating real evidence artifact files, filling template values, creating the future evidence checker",
  "source-depth approval, or public claims",
  "docs/evidence/CP3_SOURCE_DEPTH_CATEGORY_EVIDENCE_TEMPLATE.md",
  "scripts/check-cp3-source-depth-evidence-blank-template.mjs",
  "docs/reviews/CP3_SOURCE_DEPTH_EVIDENCE_BLANK_TEMPLATE_ROLE_REVIEW_2026-05-29.md",
  "scripts/check-cp3-tw-stock-source-depth.mjs remains not_ready as expected",
  "start from the blank template",
  "choose one evidence category",
  "duplicate only after separate CEO approval",
  "copied artifact starts as not_ready",
  "keep Public-Claim Boundary",
  "keep Source-Rights Boundary",
  "keep Display-State Boundary",
  "never paste raw rows or market data",
  "Windows-safe future artifact naming",
  "docs/evidence/CP3_SOURCE_DEPTH_<SAFE_CATEGORY>_EVIDENCE_YYYY-MM-DD.md",
  "SAFE_CATEGORY must use uppercase letters, numbers, and underscores only",
  "replace TODO only with documented summaries after separate approval",
  "never fabricate dates, trading date counts, or field coverage",
  "Approval Status remains not_ready until CEO synthesis",
  "no raw market rows",
  "no CSV market data",
  "no JSON market data",
  "no Supabase reads",
  "no SQL execution",
  "PM+Dev owner review required",
  "Investment owner review required",
  "Legal source-rights and public-claim check required",
  "Design display-state boundary review required",
  "CEO synthesis required",
  "does not create evidence artifacts",
  "does not fill template values",
  "does not create the future evidence checker",
  "does not make source_depth_state",
  "role review for this usage guide",
  "usage guide only",
  "do not create real evidence artifact files",
  "do not fill template values",
  "do not create future evidence checker",
  "do not create JSON sample artifacts",
  "do not create JSON market data",
  "do not create CSV market data",
  "do not fetch market data",
  "do not parse market rows",
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
  "record CP3 source-depth evidence template usage guide role review"
];

const forbiddenPhrases = [
  "Status: approved",
  "scoreSource=real approved",
  "source_depth_state is reviewable",
  "public claims are approved",
  "source-rights are approved",
  "backtest approved",
  "Supabase read completed",
  "SQL executed"
];

const report = fs.existsSync(reportPath) ? fs.readFileSync(reportPath, "utf8") : "";
const missing = requiredPhrases.filter((phrase) => !report.includes(phrase));
const forbidden = forbiddenPhrases.filter((phrase) => report.includes(phrase));

console.log(
  JSON.stringify(
    {
      forbidden,
      missing,
      report: reportPath,
      status: missing.length === 0 && forbidden.length === 0 ? "ok" : "blocked"
    },
    null,
    2
  )
);

if (missing.length > 0 || forbidden.length > 0) {
  process.exitCode = 1;
}
