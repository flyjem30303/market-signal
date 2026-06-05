import fs from "node:fs";
import { spawnSync } from "node:child_process";

const helperPath = "src/lib/blocker-closure-readiness-gate.ts";
const progressPath = "src/lib/project-progress-score.ts";
const componentPath = "src/components/project-progress-panel.tsx";
const cssPath = "src/app/globals.css";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";

const files = new Map(
  [helperPath, progressPath, componentPath, cssPath, packagePath, reviewGatePath].map((file) => [
    file,
    fs.readFileSync(file, "utf8")
  ])
);

const required = [
  [helperPath, "BlockerClosureReadinessGate"],
  [helperPath, "getBlockerClosureReadinessGate"],
  [helperPath, "blocker_closure_readiness_gate"],
  [helperPath, "local_closure_ready_remote_paused"],
  [helperPath, "getBlockerClosureMap"],
  [helperPath, "getBlockerReadinessSummary"],
  [helperPath, "buildDataQualityScoreContract"],
  [helperPath, "closurePercent"],
  [helperPath, "source-rights-and-disclosure"],
  [helperPath, "model-credibility"],
  [helperPath, "data-quality-evidence"],
  [helperPath, "held_until_remote_evidence"],
  [helperPath, "canPromotePublicDataSource: false"],
  [helperPath, "canRaiseDataQualityScore: false"],
  [helperPath, "canSetScoreSourceReal: false"],
  [helperPath, "publicDataSource: \"mock\""],
  [helperPath, "scoreSource: \"mock\""],
  [helperPath, "does not run SQL"],
  [helperPath, "publicDataSource=supabase"],
  [helperPath, "scoreSource=real"],
  [progressPath, "BlockerClosureReadinessGate"],
  [progressPath, "blockerClosureReadinessGate: BlockerClosureReadinessGate"],
  [progressPath, "blockerClosureReadinessGate = getBlockerClosureReadinessGate()"],
  [progressPath, "blockerClosureReadinessGate,"],
  [progressPath, "current: 88"],
  [progressPath, "blocker closure readiness"],
  [progressPath, "current: 83"],
  [progressPath, "closure readiness"],
  [componentPath, "progress.blockerClosureReadinessGate.status"],
  [componentPath, "project-progress-blocker-readiness-gate"],
  [componentPath, "progress.blockerClosureReadinessGate.closurePercent"],
  [componentPath, "progress.blockerClosureReadinessGate.items.map"],
  [componentPath, "item.closureState"],
  [cssPath, ".project-progress-blocker-readiness-gate"],
  [cssPath, ".project-progress-blocker-readiness-gate article.local_ready_external_pending"],
  [cssPath, ".project-progress-blocker-readiness-gate article.held_until_remote_evidence"],
  [packagePath, "\"check:blocker-closure-readiness-gate\": \"node scripts/check-blocker-closure-readiness-gate.mjs\""],
  [reviewGatePath, "scripts/check-blocker-closure-readiness-gate.mjs"],
  [reviewGatePath, "blocker-closure-readiness-gate"]
];

const forbidden = [
  [helperPath, "@supabase/supabase-js"],
  [helperPath, "createClient"],
  [helperPath, "fetch("],
  [helperPath, ".from("],
  [helperPath, ".insert("],
  [helperPath, ".update("],
  [helperPath, ".delete("],
  [helperPath, ".upsert("],
  [helperPath, "process.env"],
  [helperPath, "node:fs"],
  [helperPath, "publicDataSource: \"supabase\""],
  [helperPath, "scoreSource: \"real\""],
  [helperPath, "canPromotePublicDataSource: true"],
  [helperPath, "canRaiseDataQualityScore: true"],
  [helperPath, "canSetScoreSourceReal: true"],
  [componentPath, "@supabase/supabase-js"],
  [componentPath, "createClient"],
  [componentPath, "fetch("],
  [componentPath, ".from("],
  [componentPath, ".insert("],
  [componentPath, ".update("],
  [componentPath, ".delete("],
  [componentPath, "process.env"],
  [componentPath, "scoreSource=real approved"]
];

const missing = required.filter(([file, phrase]) => !read(file).includes(phrase)).map(([file, phrase]) => `${file}: ${phrase}`);
const blocked = forbidden.filter(([file, phrase]) => read(file).includes(phrase)).map(([file, phrase]) => `${file}: ${phrase}`);

const snapshot = spawnSync(process.execPath, ["scripts/report-project-progress-snapshot.mjs"], {
  cwd: process.cwd(),
  encoding: "utf8",
  shell: false
});

if (snapshot.status !== 0) {
  blocked.push("scripts/report-project-progress-snapshot.mjs failed");
} else {
  const parsed = JSON.parse(snapshot.stdout);
  if (parsed.project.adjustedScore < 70) {
    missing.push("project progress adjustedScore at least 70");
  }
  if (parsed.safety.publicDataSource !== "mock" || parsed.safety.scoreSource !== "mock") {
    blocked.push("project progress snapshot safety must stay mock");
  }
  if (
    parsed.safety.sqlExecuted ||
    parsed.safety.supabaseWritesEnabled ||
    parsed.safety.ingestionStarted ||
    parsed.safety.scoreSourceRealEnabled
  ) {
    blocked.push("project progress snapshot attempted a forbidden promotion");
  }
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

if (missing.length > 0 || blocked.length > 0) {
  process.exitCode = 1;
}

function read(file) {
  return files.get(file) ?? "";
}
