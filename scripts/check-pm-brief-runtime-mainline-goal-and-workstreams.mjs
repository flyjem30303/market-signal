import fs from "node:fs";

const docPath = "docs/PM_BRIEF_RUNTIME_MAINLINE_GOAL_AND_WORKSTREAMS.md";
const a1Path = "docs/A1_OFFICIAL_OPEN_FREE_SOURCE_TERMS_AND_COVERAGE_MATRIX_NO_FETCH.md";
const a2Path = "docs/A2_HOME_FIRST_SCREEN_PUBLIC_COPY_HANDOFF.md";
const dashboardPath = "src/components/dashboard-shell.tsx";
const runtimePanelPath = "src/components/home-runtime-status-panel.tsx";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";

const problems = [];
const doc = read(docPath);
const a1 = read(a1Path);
const a2 = read(a2Path);
const dashboard = read(dashboardPath);
const runtimePanel = read(runtimePanelPath);
const pkg = JSON.parse(read(packagePath));
const reviewGate = read(reviewGatePath);

const requiredPhrases = [
  [docPath, doc, "PM BRIEF Runtime Mainline Goal And Workstreams"],
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
  [docPath, doc, "integrate_runtime_readability_and_source_trust_states_before_real_data_promotion"],
  [a1Path, a1, "no-fetch"],
  [a1Path, a1, "TWSE OpenAPI"],
  [a1Path, a1, "coverage"],
  [a1Path, a1, "terms"],
  [a2Path, a2, "30 second market atmosphere"],
  [a2Path, a2, "3 minute action judgment"],
  [a2Path, a2, "No engineering strings"],
  [dashboardPath, dashboard, "Public Beta Index Dashboard"],
  [dashboardPath, dashboard, "30 秒看懂市場氛圍"],
  [dashboardPath, dashboard, "全市場總覽"],
  [dashboardPath, dashboard, "核心指標面板"],
  [dashboardPath, dashboard, "警示清單"],
  [runtimePanelPath, runtimePanel, "目前可用的是 mock 訊號閱讀模式"],
  [runtimePanelPath, runtimePanel, "不是投資建議。"],
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
  [dashboardPath, dashboard],
  [runtimePanelPath, runtimePanel]
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
      lanes: ["PM product/runtime mainline", "A1 data/source/coverage", "A2 public copy/product safety"]
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
