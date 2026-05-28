import fs from "node:fs";

const reportPath = "docs/CP3_PUBLIC_CLAIM_APPROVAL_CHECKLIST_2026-05-29.md";

const requiredPhrases = [
  "Status: draft, not approved",
  "publicly claim real scores",
  "public claim checklist draft only",
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
  "Forbidden Until Approved",
  "AI stock advisor",
  "model_version",
  "A / PM+Dev confirms runtime state matches public copy",
  "REVISE",
  "review CP3 public claim approval checklist by role"
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
