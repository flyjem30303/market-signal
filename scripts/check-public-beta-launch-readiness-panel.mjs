import fs from "node:fs";

const problems = [];

const componentPath = "src/components/public-beta-launch-readiness-panel.tsx";
const dataPath = "src/lib/public-beta-launch-readiness.ts";
const dashboardPath = "src/components/dashboard-shell.tsx";
const briefingPath = "src/app/briefing/page.tsx";
const cssPath = "src/app/globals.css";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const statusPath = "PROJECT_STATUS.md";

const component = read(componentPath);
const data = read(dataPath);
const dashboard = read(dashboardPath);
const briefing = read(briefingPath);
const css = read(cssPath);
const pkg = JSON.parse(read(packagePath));
const reviewGate = read(reviewGatePath);
const status = read(statusPath);

for (const [filePath, source, phrase] of [
  [componentPath, component, "PublicBetaLaunchReadinessPanel"],
  [componentPath, component, "公開 Beta 上線進度"],
  [componentPath, component, "pre-launch executable"],
  [componentPath, component, "publicDataSource="],
  [componentPath, component, "scoreSource="],
  [dataPath, data, "getPublicBetaLaunchReadinessSummary"],
  [dataPath, data, "公開 Beta 上線前可執行狀態"],
  [dataPath, data, "Runtime 核心路由"],
  [dataPath, data, "Beta packet / platform"],
  [dataPath, data, "A1 資料覆蓋與權利"],
  [dataPath, data, "A2 信任 / 法務文案"],
  [dataPath, data, "Mock / real 邊界"],
  [dataPath, data, "BETA_HOSTING_PROJECT_NAME"],
  [dataPath, data, "BETA_TEMPORARY_URL"],
  [dataPath, data, "publicDataSource: \"mock\""],
  [dataPath, data, "scoreSource: \"mock\""],
  [dataPath, data, "尚未正式上線"],
  [dashboardPath, dashboard, "import { PublicBetaLaunchReadinessPanel }"],
  [dashboardPath, dashboard, "<PublicBetaLaunchReadinessPanel compact />"],
  [briefingPath, briefing, "import { PublicBetaLaunchReadinessPanel }"],
  [briefingPath, briefing, "<PublicBetaLaunchReadinessPanel />"],
  [cssPath, css, ".public-beta-launch-readiness"],
  [cssPath, css, ".public-beta-launch-readiness-grid"],
  [cssPath, css, ".public-beta-launch-readiness-route"],
  [packagePath, JSON.stringify(pkg), "check:public-beta-launch-readiness-panel"],
  [reviewGatePath, reviewGate, "name: \"public-beta-launch-readiness-panel\""],
  [statusPath, status, "Latest public Beta launch readiness visibility slice"]
]) {
  if (!source.includes(phrase)) problems.push(`${filePath} missing phrase: ${phrase}`);
}

if (pkg.scripts?.["check:public-beta-launch-readiness-panel"] !== "node scripts/check-public-beta-launch-readiness-panel.mjs") {
  problems.push(`${packagePath} missing check:public-beta-launch-readiness-panel`);
}

for (const [filePath, source] of [
  [componentPath, component],
  [dataPath, data]
]) {
  for (const pattern of forbiddenPatterns()) {
    if (pattern.test(source)) problems.push(`${filePath} forbidden pattern ${String(pattern)}`);
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
      guardedStatus: "public_beta_launch_readiness_panel_visible",
      surfaces: ["/", "/briefing"],
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

function forbiddenPatterns() {
  return [
    /NEXT_PUBLIC_SUPABASE_URL\s*=\s*https?:/u,
    /NEXT_PUBLIC_SUPABASE_ANON_KEY\s*=/u,
    /SUPABASE_SERVICE_ROLE_KEY\s*=/u,
    /\bsb_(publishable|secret|anon|service_role)_[a-z0-9_-]+/iu,
    /publicDataSource: "supabase"/u,
    /scoreSource: "real"/u,
    /正式上線完成/u,
    /真實分數已啟用/u,
    /投資建議/u
  ];
}
