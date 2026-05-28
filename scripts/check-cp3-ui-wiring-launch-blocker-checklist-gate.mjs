import fs from "node:fs";

const reportPath = "docs/reviews/CP3_UI_WIRING_LAUNCH_BLOCKER_CHECKLIST_GATE_2026-05-29.md";

const requiredPhrases = [
  "Status: CP3 UI wiring launch-blocker checklist gate recorded",
  "REVISE",
  "does not approve wiring CP3 runtime policy",
  "local-only launch-blocker definition",
  "runtime state source not approved",
  "UI placement implementation not approved",
  "public claim approval not approved",
  "legal disclosure copy not approved",
  "source-depth production gate remains not_ready",
  "remote read-only validation remains unexecuted",
  "scoreSource=real remains forbidden",
  "public data source remains mock",
  "source-depth evidence gate",
  "runtime state source gate",
  "UI placement implementation gate",
  "legal disclosure gate",
  "public claim release gate",
  "production score-source gate",
  "rollback and monitoring gate",
  "launch-blocker checklist gate only",
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
  "draft CP3 UI wiring launch-blocker implementation plan"
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
