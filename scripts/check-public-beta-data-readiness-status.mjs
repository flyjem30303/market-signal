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
const baseUrl = process.env.LOCALHOST_BASE_URL ?? "http://localhost:3000";

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

for (const [filePath, source, phrases] of [
  [
    componentPath,
    component,
    [
      "PublicBetaDataReadinessStatus",
      "Public Beta data readiness status",
      "Data Readiness",
      "覆蓋證據",
      "TWII 前置條件",
      "公開資料邊界",
      "TWII data decision readiness",
      "coverageScopeStatusLabels",
      "twiiTermsStatusLabels",
      "boundedReadonlyStatusLabels",
      "operatorDecisionStatusLabels",
      "public-beta-twii-terms-readiness",
      "public-beta-bounded-readonly-requirements",
      "public-beta-twii-decision-readiness",
      "public-beta-coverage-artifact-scopes"
    ]
  ],
  [
    libPath,
    lib,
    [
      "資料真實化仍在準備中，公開頁維持 mock",
      "目前可檢查的覆蓋證據 182/360",
      "twiiTermsReadiness",
      "資料條款",
      "欄位契約",
      "更新節奏",
      "公開引用",
      "boundedReadonlyRequirements",
      "來源權利",
      "安全輸出",
      "升級鎖",
      "operatorDecisionReadiness",
      "TWII 資料證據",
      "受控讀取決策",
      "真實資料升級",
      "coverageArtifactScopes",
      "TWII",
      "0050 / 006208",
      "2330 / 2382 / 2308",
      "產業 / 族群",
      "波動率 / 資金流 / 乖離 / 動能",
      "acceptedSlots: 6",
      "acceptedRows: 182",
      "targetRows: 360",
      "sourceTrust",
      "TWSE OpenAPI 候選來源",
      "TWII 指數候選線",
      "ETF 來源條件",
      "不執行資料庫寫入",
      "不匯入原始資料酬載",
      "不修改正式資料表",
      'publicDataSource: "mock"',
      'scoreSource: "mock"'
    ]
  ],
  [
    a1MatrixPath,
    a1Matrix,
    ["A1 Official Open Free Source Terms and Coverage Matrix No-Fetch", "TWSE OpenAPI", "automation", "free"]
  ],
  [homePanelPath, homePanel, ["import { PublicBetaDataReadinessStatus }", "<PublicBetaDataReadinessStatus />"]],
  [briefingPagePath, briefingPage, ["import { PublicBetaDataReadinessStatus }", "<PublicBetaDataReadinessStatus />"]],
  [
    cssPath,
    css,
    [
      ".public-beta-data-readiness-status",
      ".public-beta-data-readiness-lanes",
      ".public-beta-twii-terms-readiness",
      ".public-beta-bounded-readonly-requirements",
      ".public-beta-twii-decision-readiness",
      ".public-beta-coverage-artifact-scopes",
      ".public-beta-source-trust"
    ]
  ],
  [
    statusPath,
    status,
    ["Latest public Beta data-readiness visible status slice", "publicDataSource=mock", "scoreSource=mock"]
  ],
  [
    boardPath,
    board,
    ["`src/components/public-beta-data-readiness-status.tsx` is `accepted` as public Beta visible data-readiness status"]
  ],
  [reviewGatePath, reviewGate, ["scripts/check-public-beta-data-readiness-status.mjs", "public-beta-data-readiness-status"]]
]) {
  requireIncludes(filePath, source, phrases);
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
  for (const marker of findMojibakeMarkers(source)) {
    problems.push(`${filePath} exposes ${marker}`);
  }
}

const routeResults = await Promise.all(["/", "/briefing"].map(checkRoute));

if (problems.length > 0) {
  console.error(JSON.stringify({ status: "blocked", problems, routeResults }, null, 2));
  process.exit(1);
}

console.log(
  JSON.stringify(
    {
      routeResults,
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

async function checkRoute(path) {
  const response = await fetch(`${baseUrl}${path}`);
  const html = await response.text();
  const text = normalizeVisibleText(html);
  const required = [
    "Data Readiness",
    "資料真實化仍在準備中，公開頁維持 mock",
    "覆蓋證據",
    "目前可檢查的覆蓋證據 182/360",
    "TWII 前置條件",
    "公開資料邊界",
    "TWSE OpenAPI 候選來源",
    "真實資料升級",
    "publicDataSource=mock",
    "scoreSource=mock",
    "不執行資料庫寫入",
    "不匯入原始資料酬載",
    "不修改正式資料表"
  ];
  const forbidden = [
    "publicDataSource=supabase approved",
    "scoreSource=real approved",
    "SQL execution is approved",
    "Supabase writes are approved",
    "raw market data fetch is approved",
    "Current hard blockers",
    "External reply dry-run intake",
    "cmd.exe /c npm run"
  ];
  const missing = required.filter((token) => !text.includes(token));
  const blocked = forbidden.filter((token) => text.includes(token));
  const markers = findMojibakeMarkers(text);

  if (response.status !== 200) problems.push(`${path} returned ${response.status}`);
  for (const token of missing) problems.push(`${path} missing ${token}`);
  for (const token of blocked) problems.push(`${path} exposes ${token}`);
  for (const token of markers) problems.push(`${path} exposes ${token}`);

  return {
    blocked,
    markers,
    missing,
    pass: response.status === 200 && missing.length === 0 && blocked.length === 0 && markers.length === 0,
    path,
    status: response.status
  };
}

function read(filePath) {
  if (!fs.existsSync(filePath)) {
    problems.push(`missing file: ${filePath}`);
    return "{}";
  }
  return fs.readFileSync(filePath, "utf8");
}

function requireIncludes(label, text, needles) {
  for (const needle of needles) {
    if (!text.includes(needle)) problems.push(`${label} missing phrase: ${needle}`);
  }
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
    /real market data is live/iu
  ];
}

function findMojibakeMarkers(text) {
  const markers = [];
  if (/[\uE000-\uF8FF\uFFFD]/u.test(text)) markers.push("private-use-or-replacement-code-point");
  if (/\?{3,}/u.test(text)) markers.push("question-mark-run");
  return markers;
}

function normalizeVisibleText(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
}
