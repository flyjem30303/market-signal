import fs from "node:fs";

const helperPath = "src/lib/narrow-approval-outcome-ledger.ts";
const dataPath = "data/source-gates/narrow-approval-outcomes.json";
const componentPath = "src/components/narrow-approval-outcome-panel.tsx";
const briefingPath = "src/app/briefing/page.tsx";
const cssPath = "src/app/globals.css";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const fullHealthPath = "scripts/check-localhost-full-health.mjs";

const files = new Map(
  [helperPath, dataPath, componentPath, briefingPath, cssPath, packagePath, reviewGatePath, fullHealthPath].map((file) => [
    file,
    fs.readFileSync(file, "utf8")
  ])
);
const missing = [];
const blocked = [];

for (const [file, phrase] of [
  [helperPath, "getNarrowApprovalOutcomeLedger"],
  [helperPath, "allRequiredOutcomesAccepted"],
  [helperPath, "publicDataSource: \"mock\""],
  [helperPath, "scoreSource: \"mock\""],
  [dataPath, "legal-source-terms-review"],
  [dataPath, "investment-non-advisory-interpretation-review"],
  [componentPath, "NarrowApprovalOutcomePanel"],
  [componentPath, "getNarrowApprovalOutcomeLedger"],
  [componentPath, "narrow-approval-outcome-panel"],
  [componentPath, "Readonly attempt gate"],
  [componentPath, "SQL, writes, ingestion, and scoreSource=real remain blocked."],
  [briefingPath, "import { NarrowApprovalOutcomePanel }"],
  [briefingPath, "<NarrowApprovalOutcomePanel />"],
  [cssPath, ".narrow-approval-outcome-panel"],
  [cssPath, ".narrow-approval-outcome-grid"],
  [packagePath, "\"check:narrow-approval-outcome-panel\": \"node scripts/check-narrow-approval-outcome-panel.mjs\""],
  [fullHealthPath, "scripts/check-narrow-approval-outcome-panel.mjs"],
  [reviewGatePath, "scripts/check-narrow-approval-outcome-panel.mjs"]
]) {
  if (!read(file).includes(phrase)) missing.push(`${file}: ${phrase}`);
}

for (const [file, phrase] of [
  [componentPath, "fetch("],
  [componentPath, "createClient"],
  [componentPath, "process.env"],
  [componentPath, "scoreSource=\"real\""],
  [helperPath, "publicDataSource: \"supabase\""],
  [helperPath, "scoreSource: \"real\""],
  [helperPath, "writeFileSync"]
]) {
  if (read(file).includes(phrase)) blocked.push(`${file}: ${phrase}`);
}

console.log(
  JSON.stringify(
    {
      blocked,
      missing,
      status: missing.length === 0 && blocked.length === 0 ? "ok" : "blocked"
    },
    null,
    2
  )
);

if (missing.length > 0 || blocked.length > 0) process.exitCode = 1;

function read(file) {
  return files.get(file) ?? "";
}
