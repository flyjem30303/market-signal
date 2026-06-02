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
  [helperPath, "local_review_recorded_external_rights_unverified"],
  [helperPath, "local_review_recorded_model_not_approved_for_real_scoring"],
  [helperPath, "qa_review_recorded_no_points_awarded"],
  [helperPath, "approvedScope"],
  [helperPath, "remainingDecision"],
  [helperPath, "data-quality-evidence"],
  [helperPath, "source-rights-and-disclosure"],
  [helperPath, "model-credibility"],
  [helperPath, "npm run report:data-quality-evidence-checklist"],
  [helperPath, "npm run report:source-rights-disclosure-checklist"],
  [helperPath, "npm run report:model-credibility-checklist"],
  [helperPath, "firstMove"],
  [helperPath, "parallelMoves"],
  [helperPath, "accelerationPlan"],
  [helperPath, "ready_for_separate_readonly_decision"],
  [helperPath, "fastestSafePath"],
  [helperPath, "readonly readiness 55 / runtime hardening 35 / blocker execution 10"],
  [helperPath, "npm run check:narrow-approval-post-review-gate && npm run report:supabase-readonly-final-prep"],
  [helperPath, "npm run report:source-rights-disclosure-local-review"],
  [helperPath, "npm run report:model-credibility-local-review"],
  [helperPath, "npm run report:data-quality-field-validity-qa-review"],
  [helperPath, "publicDataSource: \"mock\""],
  [helperPath, "scoreSource: \"mock\""],
  [componentPath, "BlockerReadinessPanel"],
  [componentPath, "getBlockerReadinessSummary"],
  [componentPath, "blocker-readiness-panel"],
  [componentPath, "Runtime unblock acceleration"],
  [componentPath, "Fastest safe unblock path"],
  [componentPath, "summary.accelerationPlan.fastestSafePath.map"],
  [componentPath, "blocker-priority-strip"],
  [componentPath, "summary.firstMove"],
  [componentPath, "summary.parallelMoves.map"],
  [componentPath, "summary.lanes.map"],
  [componentPath, "lane.localReviewState"],
  [componentPath, "lane.approvedScope"],
  [componentPath, "lane.remainingDecision"],
  [briefingPath, "import { BlockerReadinessPanel }"],
  [briefingPath, "<BlockerReadinessPanel />"],
  [cssPath, ".blocker-readiness-panel"],
  [cssPath, ".blocker-acceleration-strip"],
  [cssPath, ".blocker-fastest-path"],
  [cssPath, ".blocker-priority-strip"],
  [cssPath, ".blocker-readiness-grid"],
  [cssPath, ".blocker-readiness-grid em"],
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
