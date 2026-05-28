import fs from "node:fs";

const reportPath = "docs/CP3_UI_WIRING_LAUNCH_BLOCKER_IMPLEMENTATION_PLAN_2026-05-29.md";

const requiredPhrases = [
  "Status: CP3 UI wiring launch-blocker implementation plan recorded",
  "REVISE",
  "does not approve public UI wiring",
  "local-only work required",
  "turn launch blockers into explicit implementation gates",
  "preserve public data source mock",
  "preserve scoreSource mock",
  "keep runtime policy draft non-runtime",
  "keep UI copy tokens draft non-runtime",
  "prevent accidental public imports",
  "define approved runtime state source contract",
  "define source-depth evidence gate",
  "define UI placement implementation gate",
  "define legal disclosure gate",
  "define public claim release gate",
  "define production score-source gate",
  "define rollback and monitoring gate",
  "require CEO synthesis before runtime wiring",
  "Runtime State Source Gate",
  "Source-Depth Evidence Gate",
  "UI Placement Implementation Gate",
  "Legal Disclosure Gate",
  "Public Claim Release Gate",
  "Production Score-Source Gate",
  "Rollback And Monitoring Gate",
  "without connecting to Supabase during the planning phase",
  "without importing draft tokens into public pages",
  "scripts/check-cp3-runtime-policy-draft.mjs must continue blocking public imports",
  "scripts/check-cp3-ui-copy-tokens-draft.mjs must continue blocking public imports",
  "scripts/check-review-gates.mjs must include this implementation plan checker",
  "TypeScript noEmit must pass",
  "implementation plan only",
  "do not import copy tokens into public pages",
  "do not import copy tokens into public components",
  "do not import policy into public pages",
  "do not import policy into public components",
  "do not wire policy into data fetching",
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
  "CP3 source-depth production gate remains not_ready",
  "Keep public data source mock",
  "none of the blockers are cleared",
  "record CP3 UI wiring launch-blocker implementation plan role review"
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
