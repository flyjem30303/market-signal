import fs from "node:fs";

const reportPath = "docs/reviews/CP3_NON_RUNTIME_TYPESCRIPT_POLICY_DRAFT_APPROVAL_GATE_2026-05-29.md";

const requiredPhrases = [
  "Status: CP3 non-runtime TypeScript policy draft approval gate recorded",
  "PROCEED",
  "non-runtime TypeScript policy artifact only",
  "does not approve wiring the policy into the public UI",
  "create a non-runtime TypeScript policy draft",
  "do not import the policy into pages or components",
  "add static checks for forbidden runtime wiring",
  "approval gate only",
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
  "draft non-runtime CP3 TypeScript policy artifact"
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
