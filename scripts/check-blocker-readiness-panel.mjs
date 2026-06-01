import fs from "node:fs";

const helperPath = "src/lib/blocker-readiness.ts";
const componentPath = "src/components/blocker-readiness-panel.tsx";
const briefingPath = "src/app/briefing/page.tsx";
const cssPath = "src/app/globals.css";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";

const files = new Map(
  [helperPath, componentPath, briefingPath, cssPath, packagePath, reviewGatePath].map((file) => [
    file,
    fs.readFileSync(file, "utf8")
  ])
);
const missing = [];
const blocked = [];

for (const [file, phrase] of [
  [helperPath, "getBlockerReadinessSummary"],
  [helperPath, "local_checklists_ready_remote_paused"],
  [helperPath, "data-quality-evidence"],
  [helperPath, "source-rights-and-disclosure"],
  [helperPath, "model-credibility"],
  [helperPath, "npm run report:data-quality-evidence-checklist"],
  [helperPath, "npm run report:source-rights-disclosure-checklist"],
  [helperPath, "npm run report:model-credibility-checklist"],
  [helperPath, "publicDataSource: \"mock\""],
  [helperPath, "scoreSource: \"mock\""],
  [componentPath, "BlockerReadinessPanel"],
  [componentPath, "getBlockerReadinessSummary"],
  [componentPath, "blocker-readiness-panel"],
  [componentPath, "summary.lanes.map"],
  [briefingPath, "import { BlockerReadinessPanel }"],
  [briefingPath, "<BlockerReadinessPanel />"],
  [cssPath, ".blocker-readiness-panel"],
  [cssPath, ".blocker-readiness-grid"],
  [packagePath, "\"check:blocker-readiness-panel\": \"node scripts/check-blocker-readiness-panel.mjs\""],
  [reviewGatePath, "scripts/check-blocker-readiness-panel.mjs"]
]) {
  if (!read(file).includes(phrase)) missing.push(`${file}: ${phrase}`);
}

for (const [file, phrase] of [
  [helperPath, "@supabase/supabase-js"],
  [helperPath, "createClient"],
  [helperPath, "fetch("],
  [helperPath, ".from("],
  [helperPath, "scoreSource: \"real\""],
  [helperPath, "publicDataSource: \"supabase\""],
  [helperPath, "writeFileSync"],
  [componentPath, "fetch("],
  [componentPath, "process.env"],
  [componentPath, "createClient"],
  [briefingPath, "scoreSource=\"real\""]
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
