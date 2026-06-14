import fs from "node:fs";

const docPath = "docs/PHASE_1_PHASE_2_EXECUTION_SPLIT_AND_WORKFLOW_ASSIGNMENT.md";
const briefPath = "docs/PUBLIC_BETA_INDEX_DASHBOARD_BRIEF.md";
const pmBriefPath = "docs/PM_BRIEF_RUNTIME_MAINLINE_GOAL_AND_WORKSTREAMS.md";
const a4Path = "docs/A4_MEMBERSHIP_MVP_PLANNING_HANDOFF.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";

const problems = [];
const doc = read(docPath);
const brief = read(briefPath);
const pmBrief = read(pmBriefPath);
const a4 = read(a4Path);
const pkg = JSON.parse(read(packagePath));
const reviewGate = read(reviewGatePath);

requireIncludes(docPath, doc, [
  "phase_1_phase_2_execution_split_ready",
  "Phase 1 is the public free index-lighting site",
  "Phase 2 is the membership MVP path",
  "Phase 2 planning may continue",
  "Phase 2 implementation must not block Phase 1 public Beta readiness",
  "The chairman's latest BRIEF revision keeps membership as the next product direction",
  "GOAL execution should keep PM on Phase 1 product/runtime integration",
  "PM mainline",
  "A1 Data / Source / Coverage",
  "A2 Public Copy / Product Safety",
  "A3 Launch / Production Engineering",
  "A4 Membership MVP Planning",
  "Use larger coherent slices",
  "phase_1_public_free_index_dashboard_usable_loop",
  "Current GOAL Operating Shape",
  "PM 50%, A1 20%, A2 15%, A3 15%, A4 planning only",
  "operator/governance console",
  "publicDataSource=supabase",
  "scoreSource=real"
]);

requireIncludes(briefPath, brief, [
  "index_signal_brief_phase_1_public_first_phase_2_membership_path",
  "指數燈號網站 BRIEF",
  "免費市場總覽 + 會員深度解讀 + 個人化追蹤",
  "會員 watchlist + 自訂警示條件",
  "盤後複盤報告",
  "本網站定位為市場資訊整理、風險辨識與觀察輔助工具",
  "Phase 1 is the public free index-lighting site",
  "Phase 2 is the membership MVP path",
  "Phase 1 is current execution priority.",
  "Phase 2 should not delay Phase 1 launch readiness.",
  "understand the market mood within 30 seconds",
  "decide within 3 minutes"
]);

requireIncludes(pmBriefPath, pmBrief, [
  "CEO Phase Decision - 2026-06-13",
  "Chairman BRIEF Phase Split Confirmation",
  "Phase 1 comes first",
  "Phase 2 comes later",
  "A4 Membership MVP Planning",
  "Avoid over-governance",
  "phase_1_public_free_index_dashboard_usable_loop"
]);

requireIncludes(a4Path, a4, [
  "a4_membership_mvp_planning_lane_standby",
  "Phase 2 membership MVP",
  "should begin only when PM decides Phase 1 public launch readiness is stable enough",
  "must not",
  "block Phase 1 public launch readiness"
]);

const scriptName = "check:phase-1-phase-2-execution-split-and-workflow-assignment";
if (pkg.scripts?.[scriptName] !== "node scripts/check-phase-1-phase-2-execution-split-and-workflow-assignment.mjs") {
  problems.push(`${packagePath} missing ${scriptName}`);
}

requireIncludes(reviewGatePath, reviewGate, [
  "scripts/check-phase-1-phase-2-execution-split-and-workflow-assignment.mjs",
  "phase-1-phase-2-execution-split-and-workflow-assignment"
]);

for (const [filePath, source] of [
  [docPath, doc],
  [briefPath, brief]
]) {
  for (const marker of findBadEncodingMarkers(source)) {
    problems.push(`${filePath} contains ${marker}`);
  }
}

for (const [filePath, source] of [
  [docPath, doc],
  [briefPath, brief],
  [pmBriefPath, pmBrief],
  [a4Path, a4]
]) {
  for (const pattern of forbiddenPatterns()) {
    if (pattern.test(source)) problems.push(`${filePath} contains forbidden pattern ${String(pattern)}`);
  }
}

if (problems.length > 0) {
  console.error(JSON.stringify({ status: "blocked", problems }, null, 2));
  process.exit(1);
}

console.log(
  JSON.stringify(
    {
      status: "ok",
      guardedStatus: "phase_1_phase_2_execution_split_ready",
      phase1: "public free index-lighting site",
      phase2: "membership MVP path deferred",
      publicDataSource: "mock",
      scoreSource: "mock"
    },
    null,
    2
  )
);

function read(filePath) {
  if (!fs.existsSync(filePath)) {
    problems.push(`missing file: ${filePath}`);
    return filePath.endsWith(".json") ? "{}" : "";
  }

  return fs.readFileSync(filePath, "utf8");
}

function requireIncludes(label, source, phrases) {
  for (const phrase of phrases) {
    if (!source.includes(phrase)) problems.push(`${label} missing phrase: ${phrase}`);
  }
}

function findBadEncodingMarkers(source) {
  const markers = [];
  if (/\uFFFD/u.test(source)) markers.push("replacement-character");
  if (/[\uE000-\uF8FF]/u.test(source)) markers.push("private-use-character");
  if (/[\u0080-\u009F]/u.test(source)) markers.push("c1-control-character");
  if (/[?]{4,}/u.test(source)) markers.push("question-mark-run");
  return markers;
}

function forbiddenPatterns() {
  return [
    /publicDataSource\s*=\s*"supabase"/u,
    /scoreSource\s*=\s*"real"/u,
    /SQL execution is approved/u,
    /Supabase writes are approved/u,
    /raw market data fetch is approved/u,
    /investment advice is provided/u,
    /buy\/sell recommendation is provided/u,
    /\bsb_(publishable|secret|anon|service_role)_[a-z0-9_-]+/iu
  ];
}
