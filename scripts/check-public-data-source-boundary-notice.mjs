import fs from "node:fs";

const files = {
  component: "src/components/public-data-source-boundary-notice.tsx",
  dashboardShell: "src/components/dashboard-shell.tsx",
  briefing: "src/app/briefing/page.tsx",
  packageJson: "package.json",
  reviewGates: "scripts/check-review-gates.mjs",
  projectStatus: "PROJECT_STATUS.md"
};

function read(path) {
  return fs.existsSync(path) ? fs.readFileSync(path, "utf8") : "";
}

function includes(text, fragment) {
  return text.includes(fragment);
}

const component = read(files.component);
const dashboardShell = read(files.dashboardShell);
const briefing = read(files.briefing);
const packageJson = read(files.packageJson);
const reviewGates = read(files.reviewGates);
const projectStatus = read(files.projectStatus);

const requiredComponentFragments = [
  "臺灣證券交易所 OpenAPI",
  "政府資料開放平臺",
  "目前仍為示範資料",
  "正式資料上線前",
  "非即時行情",
  "不構成投資建議",
  "資料更新時間",
  "來源與授權",
  "延遲或調整",
  "公開 Beta"
];

const forbiddenComponentFragments = [
  "publicDataSource",
  "scoreSource",
  "Supabase",
  "SQL",
  "daily_prices",
  "staging rows",
  "raw payload",
  "OFFICIAL-",
  "candidateArtifactPath",
  "cmd.exe",
  "npm run",
  "operator",
  "packet",
  "preflight",
  "post-run",
  "mock-only",
  "Phase 1",
  "Phase 2"
];

const failures = [];

if (!component) {
  failures.push(`${files.component} is missing`);
}

for (const fragment of requiredComponentFragments) {
  if (!includes(component, fragment)) {
    failures.push(`component missing public copy fragment: ${fragment}`);
  }
}

for (const fragment of forbiddenComponentFragments) {
  if (includes(component, fragment)) {
    failures.push(`component contains internal or unsafe fragment: ${fragment}`);
  }
}

if (!includes(dashboardShell, "PublicDataSourceBoundaryNotice")) {
  failures.push("DashboardShell must import and render PublicDataSourceBoundaryNotice");
}

if (!includes(dashboardShell, 'context={isStockPage ? "stock" : "home"}')) {
  failures.push("DashboardShell must render home/stock context based on route type");
}

if (!includes(briefing, "PublicDataSourceBoundaryNotice")) {
  failures.push("Briefing page must import and render PublicDataSourceBoundaryNotice");
}

if (!includes(briefing, 'context="briefing"')) {
  failures.push("Briefing page must render briefing context");
}

if (!includes(packageJson, '"check:public-data-source-boundary-notice"')) {
  failures.push("package.json missing check:public-data-source-boundary-notice");
}

if (!includes(reviewGates, "public-data-source-boundary-notice")) {
  failures.push("review gate registry missing public-data-source-boundary-notice");
}

if (!includes(projectStatus, "public_data_source_boundary_notice_ready")) {
  failures.push("PROJECT_STATUS missing public_data_source_boundary_notice_ready slice record");
}

const result = {
  status: failures.length === 0 ? "ok" : "blocked",
  checkedFiles: files,
  failures
};

console.log(JSON.stringify(result, null, 2));
process.exit(failures.length === 0 ? 0 : 1);
