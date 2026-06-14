import fs from "node:fs";

const docPath = "docs/PM_BRIEF_RUNTIME_MAINLINE_GOAL_AND_WORKSTREAMS.md";
const phasePath = "docs/PHASE_1_PHASE_2_EXECUTION_SPLIT_AND_WORKFLOW_ASSIGNMENT.md";
const briefPath = "docs/PUBLIC_BETA_INDEX_DASHBOARD_BRIEF.md";
const a1Path = "docs/A1_OFFICIAL_OPEN_FREE_SOURCE_TERMS_AND_COVERAGE_MATRIX_NO_FETCH.md";
const a2Path = "docs/A2_HOME_FIRST_SCREEN_PUBLIC_COPY_HANDOFF.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";

const problems = [];
const doc = read(docPath);
const phase = read(phasePath);
const brief = read(briefPath);
const a1 = read(a1Path);
const a2 = read(a2Path);
const pkg = JSON.parse(read(packagePath));
const reviewGate = read(reviewGatePath);

const requiredPhrases = [
  [docPath, doc, "PM BRIEF Runtime Mainline Goal And Workstreams"],
  [docPath, doc, "Chairman BRIEF Phase 1 / Phase 2 Acceleration Decision"],
  [docPath, doc, "Phase 1 comes first"],
  [docPath, doc, "Phase 2 comes later"],
  [docPath, doc, "PM owns the product/runtime engineering line"],
  [docPath, doc, "A1 Data / Source / Coverage Lane"],
  [docPath, doc, "A2 Public Copy / Product Safety Lane"],
  [docPath, doc, "A3 Launch / Production Engineering Lane"],
  [docPath, doc, "A4 Membership MVP Planning Lane"],
  [docPath, doc, "Avoid over-governance"],
  [docPath, doc, "publicDataSource=mock"],
  [docPath, doc, "scoreSource=mock"],
  [docPath, doc, "no SQL execution"],
  [docPath, doc, "no Supabase writes"],
  [docPath, doc, "no `daily_prices` mutation"],
  [docPath, doc, "no raw market-data fetch/store/commit"],
  [docPath, doc, "no investment advice"],
  [docPath, doc, "phase_1_public_free_index_dashboard_usable_loop"],
  [phasePath, phase, "PM 55%, A1 20%, A2 10%, A3 15%"],
  [phasePath, phase, "PM remains the integration owner"],
  [briefPath, brief, "指數燈號網站 BRIEF"],
  [briefPath, brief, "免費市場總覽 + 會員深度解讀 + 個人化追蹤"],
  [briefPath, brief, "會員 MVP 優先內容"],
  [a1Path, a1, "no-fetch"],
  [a1Path, a1, "TWSE OpenAPI"],
  [a1Path, a1, "coverage"],
  [a1Path, a1, "terms"],
  [a2Path, a2, "30 second market atmosphere"],
  [a2Path, a2, "3 minute action judgment"],
  [a2Path, a2, "No engineering strings"],
  [packagePath, JSON.stringify(pkg), "check:pm-brief-runtime-mainline-goal-and-workstreams"],
  [reviewGatePath, reviewGate, "pm-brief-runtime-mainline-goal-and-workstreams"]
];

for (const [filePath, source, phrase] of requiredPhrases) {
  if (!source.includes(phrase)) problems.push(`${filePath} missing phrase: ${phrase}`);
}

if (
  pkg.scripts?.["check:pm-brief-runtime-mainline-goal-and-workstreams"] !==
  "node scripts/check-pm-brief-runtime-mainline-goal-and-workstreams.mjs"
) {
  problems.push(`${packagePath} missing check:pm-brief-runtime-mainline-goal-and-workstreams script`);
}

for (const [filePath, source] of [
  [docPath, doc],
  [phasePath, phase],
  [briefPath, brief]
]) {
  for (const marker of findBadEncodingMarkers(source)) {
    problems.push(`${filePath} contains ${marker}`);
  }

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
      guardedStatus: "pm_brief_runtime_mainline_goal_ready",
      phase1: "public free index-lighting mainline",
      phase2: "membership MVP deferred",
      lanes: [
        "PM product/runtime mainline",
        "A1 data/source/coverage",
        "A2 public copy/product safety",
        "A3 launch/production engineering",
        "A4 membership MVP planning standby"
      ],
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
