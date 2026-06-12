import fs from "node:fs";

const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const dashboardPath = "src/components/dashboard-shell.tsx";
const baseUrl = process.env.LOCALHOST_BASE_URL ?? "http://localhost:3000";

const problems = [];

const pkg = JSON.parse(read(packagePath));
const reviewGate = read(reviewGatePath);
const dashboard = read(dashboardPath);

if (
  pkg.scripts?.["check:home-product-first-information-hierarchy"] !==
  "node scripts/check-home-product-first-information-hierarchy.mjs"
) {
  problems.push(`${packagePath} missing check:home-product-first-information-hierarchy`);
}

for (const phrase of [
  "scripts/check-home-product-first-information-hierarchy.mjs",
  '"home-product-first-information-hierarchy"'
]) {
  if (!reviewGate.includes(phrase)) problems.push(`${reviewGatePath} missing ${phrase}`);
}

const orderedDashboardMarkers = [
  "<PublicBetaIndexDashboardBriefLoopPanel />",
  "<HomeProductOverview",
  '<PublicBetaUsableLoopPanel context="home"',
  "<DataFreshnessStrip",
  '<PublicBetaSourceCoverageRuntimeLabelsPanel context="home"',
  '<PublicBetaDecisionLoopBridge context="home"',
  '<PublicBetaRouteConsistencyPanel context="home"',
  "<HomeRuntimeStatusPanel"
];

assertOrder("dashboard home product-first component order", dashboard, orderedDashboardMarkers);

const home = await fetch(`${baseUrl}/`);
const homeHtml = await home.text();
const visible = normalize(homeHtml);

if (home.status !== 200) problems.push(`/ returned ${home.status}`);

const orderedVisibleMarkers = [
  "Public Beta Index Dashboard",
  "Quick Start",
  "Core Indicator Readout",
  "\u53ef\u7528\u9589\u74b0",
  "\u8cc7\u6599\u65b0\u9bae\u5ea6 metadata",
  "Public Beta Decision Loop",
  "Runtime Status"
];

assertOrder("home visible product-first order", visible, orderedVisibleMarkers);

for (const forbidden of [
  "cmd.exe",
  "BETA_",
  "PUBLIC_BETA_EXTERNAL",
  "packet",
  "preflight",
  "post-run",
  "operator",
  "blocker"
]) {
  if (visible.includes(forbidden)) problems.push(`home visible text must not include ${forbidden}`);
}

if (!visible.includes("publicDataSource=mock")) problems.push("home visible text missing publicDataSource=mock");
if (!visible.includes("scoreSource=mock")) problems.push("home visible text missing scoreSource=mock");

if (problems.length) {
  console.error(JSON.stringify({ problems, status: "blocked" }, null, 2));
  process.exit(1);
}

console.log(
  JSON.stringify(
    {
      checkedRoutes: ["/"],
      guardedStatus: "home_product_first_information_hierarchy_ready",
      status: "ok"
    },
    null,
    2
  )
);

function assertOrder(label, text, markers) {
  let cursor = -1;
  for (const marker of markers) {
    const index = text.indexOf(marker);
    if (index < 0) {
      problems.push(`${label} missing ${marker}`);
      continue;
    }
    if (index <= cursor) {
      problems.push(`${label} has ${marker} out of order`);
    }
    cursor = index;
  }
}

function normalize(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function read(path) {
  if (!fs.existsSync(path)) {
    problems.push(`missing ${path}`);
    return path.endsWith(".json") ? "{}" : "";
  }
  return fs.readFileSync(path, "utf8");
}
