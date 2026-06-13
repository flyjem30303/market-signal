import fs from "node:fs";

const docPath = "docs/PM_BRIEF_RUNTIME_MAINLINE_GOAL_AND_WORKSTREAMS.md";
const a1Path = "docs/A1_OFFICIAL_OPEN_FREE_SOURCE_TERMS_AND_COVERAGE_MATRIX_NO_FETCH.md";
const a2Path = "docs/A2_HOME_FIRST_SCREEN_PUBLIC_COPY_HANDOFF.md";
const dashboardPath = "src/components/dashboard-shell.tsx";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";

const problems = [];
const doc = read(docPath);
const a1 = read(a1Path);
const a2 = read(a2Path);
const dashboard = read(dashboardPath);
const pkg = JSON.parse(read(packagePath));
const reviewGate = read(reviewGatePath);

const requiredPhrases = [
  [docPath, doc, "PM BRIEF Runtime Mainline Goal And Workstreams"],
  [docPath, doc, "CEO Phase Decision - 2026-06-13"],
  [docPath, doc, "Phase 1 comes first"],
  [docPath, doc, "Phase 2 comes later"],
  [docPath, doc, "A3 Launch / Production Engineering Lane"],
  [docPath, doc, "A4 Membership MVP Planning Lane"],
  [docPath, doc, "docs/A3_LAUNCH_ENGINEERING_HANDOFF.md"],
  [docPath, doc, "docs/A4_MEMBERSHIP_MVP_PLANNING_HANDOFF.md"],
  [docPath, doc, "30 seconds"],
  [docPath, doc, "3 minutes"],
  [docPath, doc, "PM owns the product/runtime engineering line"],
  [docPath, doc, "A1 Data / Source / Coverage Lane"],
  [docPath, doc, "A2 Public Copy / Product Safety Lane"],
  [docPath, doc, "docs/A1_OFFICIAL_OPEN_FREE_SOURCE_TERMS_AND_COVERAGE_MATRIX_NO_FETCH.md"],
  [docPath, doc, "docs/A2_HOME_FIRST_SCREEN_PUBLIC_COPY_HANDOFF.md"],
  [docPath, doc, "publicDataSource=mock"],
  [docPath, doc, "scoreSource=mock"],
  [docPath, doc, "SQL execution"],
  [docPath, doc, "Supabase writes"],
  [docPath, doc, "daily_prices"],
  [docPath, doc, "raw market-data fetch"],
  [docPath, doc, "non-investment-advice"],
  [docPath, doc, "stock_route_investor_language_alignment_guard"],
  [docPath, doc, "stock_route_remaining_mojibake_and_density_cleanup"],
  [a1Path, a1, "no-fetch"],
  [a1Path, a1, "TWSE OpenAPI"],
  [a1Path, a1, "coverage"],
  [a1Path, a1, "terms"],
  [a2Path, a2, "30 second market atmosphere"],
  [a2Path, a2, "3 minute action judgment"],
  [a2Path, a2, "No engineering strings"],
  [dashboardPath, dashboard, "指數狀態儀表站"],
  [dashboardPath, dashboard, "決策輔助摘要"],
  [dashboardPath, dashboard, "示範資料"],
  [dashboardPath, dashboard, "正式市場資料尚未啟用"],
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
  [dashboardPath, dashboard]
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
      guardedStatus: "pm_brief_runtime_mainline_goal_ready",
      publicDataSource: "mock",
      scoreSource: "mock",
      lanes: [
        "PM product/runtime mainline",
        "A1 data/source/coverage",
        "A2 public copy/product safety",
        "A3 launch/production engineering",
        "A4 membership MVP planning standby"
      ]
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
