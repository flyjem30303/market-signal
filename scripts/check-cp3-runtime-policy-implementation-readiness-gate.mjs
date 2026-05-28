import fs from "node:fs";

const reportPath = "docs/reviews/CP3_RUNTIME_POLICY_IMPLEMENTATION_READINESS_GATE_2026-05-29.md";

const requiredPhrases = [
  "Status: CP3 runtime policy implementation readiness gate recorded",
  "REVISE",
  "does not approve wiring the TypeScript policy draft into public pages",
  "typed policy draft exists",
  "static guard blocks public runtime imports",
  "UI copy plan not approved",
  "runtime state source not approved",
  "implementation readiness gate only",
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
  "CP3 source-depth production gate remains not_ready",
  "Keep public data source mock",
  "Runtime wiring remains blocked",
  "draft CP3 UI state and disclosure placement plan"
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
