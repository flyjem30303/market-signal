import fs from "node:fs";

const problems = [];

const componentPath = "src/components/public-beta-data-readiness-status.tsx";
const libPath = "src/lib/public-beta-data-readiness-status.ts";
const homePanelPath = "src/components/home-runtime-status-panel.tsx";
const briefingPagePath = "src/app/briefing/page.tsx";
const cssPath = "src/app/globals.css";
const packagePath = "package.json";
const statusPath = "PROJECT_STATUS.md";
const boardPath = "docs/LAUNCH_ENGINEERING_WORKSTREAM_BOARD.md";
const reviewGatePath = "scripts/check-review-gates.mjs";
const a1MatrixPath = "docs/A1_OFFICIAL_OPEN_FREE_SOURCE_TERMS_AND_COVERAGE_MATRIX_NO_FETCH.md";

const component = read(componentPath);
const lib = read(libPath);
const homePanel = read(homePanelPath);
const briefingPage = read(briefingPagePath);
const css = read(cssPath);
const pkg = JSON.parse(read(packagePath));
const status = read(statusPath);
const board = read(boardPath);
const reviewGate = read(reviewGatePath);
const a1Matrix = read(a1MatrixPath);

for (const [filePath, source, phrase] of [
  [componentPath, component, "PublicBetaDataReadinessStatus"],
  [componentPath, component, "Public Beta data readiness status"],
  [componentPath, component, "資料準備狀態"],
  [componentPath, component, "覆蓋率證據"],
  [componentPath, component, "TWII 前置條件"],
  [componentPath, component, "公開資料邊界"],
  [componentPath, component, "coverageScopeStatusLabels"],
  [componentPath, component, "twiiTermsStatusLabels"],
  [componentPath, component, "boundedReadonlyStatusLabels"],
  [componentPath, component, "Public Beta next coverage artifact scopes"],
  [componentPath, component, "TWII terms field cadence attribution readiness"],
  [componentPath, component, "Bounded readonly gate requirements"],
  [componentPath, component, "public-beta-twii-terms-readiness"],
  [componentPath, component, "public-beta-bounded-readonly-requirements"],
  [componentPath, component, "public-beta-coverage-artifact-scopes"],
  [componentPath, component, "下一步："],
  [componentPath, component, "這不是完整覆蓋率承諾"],
  [libPath, lib, "資料真實化仍在準備，公開頁先用 mock 說清楚狀態"],
  [libPath, lib, "twiiTermsReadiness"],
  [libPath, lib, "資料條款"],
  [libPath, lib, "條款仍在確認"],
  [libPath, lib, "欄位對照"],
  [libPath, lib, "最小欄位待確認"],
  [libPath, lib, "更新節奏"],
  [libPath, lib, "每日收盤後候選"],
  [libPath, lib, "公開引用"],
  [libPath, lib, "引用文案待審"],
  [libPath, lib, "boundedReadonlyRequirements"],
  [libPath, lib, "來源權利"],
  [libPath, lib, "需確認來源條款"],
  [libPath, lib, "欄位契約"],
  [libPath, lib, "需確認欄位語意"],
  [libPath, lib, "安全輸出"],
  [libPath, lib, "只允許安全摘要"],
  [libPath, lib, "升級鎖"],
  [libPath, lib, "不自動升級資料源"],
  [libPath, lib, "coverageArtifactScopes"],
  [libPath, lib, "TWII 大盤基準準備中"],
  [libPath, lib, "核心 ETF 來源條件待確認"],
  [libPath, lib, "第一批上市個股示範"],
  [libPath, lib, "產業與族群待 taxonomy review"],
  [libPath, lib, "進階指標 mock 可解釋，真實計算未開放"],
  [libPath, lib, "acceptedSlots: 6"],
  [libPath, lib, "nextOwner: \"CEO/PM\""],
  [libPath, lib, "acceptedRows: 182"],
  [libPath, lib, "targetRows: 360"],
  [libPath, lib, "目前已接受 182/360 筆覆蓋證據"],
  [libPath, lib, "sourceTrust"],
  [libPath, lib, "TWSE OpenAPI 候選來源"],
  [libPath, lib, "TWII 指數候選"],
  [libPath, lib, "ETF 來源條件"],
  [libPath, lib, "no-fetch coverage artifact"],
  [libPath, lib, "terms、automation、free-use"],
  [libPath, lib, "ETF-specific review"],
  [libPath, lib, "publicDataSource: \"mock\""],
  [libPath, lib, "scoreSource: \"mock\""],
  [a1MatrixPath, a1Matrix, "A1 Official Open Free Source Terms and Coverage Matrix No-Fetch"],
  [a1MatrixPath, a1Matrix, "TWSE OpenAPI"],
  [a1MatrixPath, a1Matrix, "automation"],
  [a1MatrixPath, a1Matrix, "free"],
  [homePanelPath, homePanel, "import { PublicBetaDataReadinessStatus }"],
  [homePanelPath, homePanel, "<PublicBetaDataReadinessStatus />"],
  [briefingPagePath, briefingPage, "import { PublicBetaDataReadinessStatus }"],
  [briefingPagePath, briefingPage, "<PublicBetaDataReadinessStatus />"],
  [briefingPagePath, briefingPage, "<DataFreshnessStrip freshness={freshness} marketSignalSourceStatus={marketSignalSourceStatus} />"],
  [cssPath, css, ".public-beta-data-readiness-status"],
  [cssPath, css, ".public-beta-data-readiness-lanes"],
  [cssPath, css, ".public-beta-twii-terms-readiness"],
  [cssPath, css, ".public-beta-bounded-readonly-requirements"],
  [cssPath, css, ".public-beta-coverage-artifact-scopes"],
  [cssPath, css, ".public-beta-source-trust"],
  [cssPath, css, ".public-beta-source-trust article.reviewing"],
  [statusPath, status, "Latest public Beta data-readiness visible status slice"],
  [statusPath, status, "publicDataSource=mock"],
  [statusPath, status, "scoreSource=mock"],
  [boardPath, board, "`src/components/public-beta-data-readiness-status.tsx` is `accepted` as public Beta visible data-readiness status"],
  [reviewGatePath, reviewGate, "scripts/check-public-beta-data-readiness-status.mjs"],
  [reviewGatePath, reviewGate, "name: \"public-beta-data-readiness-status\""]
]) {
  if (!source.includes(phrase)) problems.push(`${filePath} missing phrase: ${phrase}`);
}

if (pkg.scripts?.["check:public-beta-data-readiness-status"] !== "node scripts/check-public-beta-data-readiness-status.mjs") {
  problems.push(`${packagePath} missing check:public-beta-data-readiness-status`);
}

for (const [filePath, source] of [
  [componentPath, component],
  [libPath, lib],
  [homePanelPath, homePanel],
  [briefingPagePath, briefingPage]
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
      guardedStatus: "public_beta_data_readiness_source_trust_visible_mock_only",
      publicDataSource: "mock",
      scoreSource: "mock",
      sourceTrust: ["TWSE OpenAPI candidate", "TWII index candidate", "ETF source blocked"]
    },
    null,
    2
  )
);

function read(filePath) {
  if (!fs.existsSync(filePath)) {
    problems.push(`missing file: ${filePath}`);
    return "{}";
  }
  return fs.readFileSync(filePath, "utf8");
}

function forbiddenPatterns() {
  return [
    /@supabase\/supabase-js/u,
    /createClient/u,
    /\.from\(/u,
    /\.insert\(/u,
    /\.update\(/u,
    /\.delete\(/u,
    /\.upsert\(/u,
    /\bsb_(publishable|secret|anon|service_role)_[a-z0-9_-]+/iu,
    /publicDataSource:\s*"supabase"/u,
    /scoreSource:\s*"real"/u,
    /complete coverage claim/iu,
    /row coverage points awarded/iu,
    /official source is approved/iu,
    /real market data is live/iu,
    /[�]/u,
    /[蝬鞈撌銝嚗雿摰璅閬]/u
  ];
}
