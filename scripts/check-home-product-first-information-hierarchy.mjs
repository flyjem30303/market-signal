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
  "<DataFreshnessStrip",
  "<HomeRuntimeStatusPanel",
  "<PublicBetaDataReadinessStatus />",
  '<PublicBetaSourceCoverageBridge context={isStockPage ? "stock" : "home"}'
];

assertOrder("dashboard home product-first component order", dashboard, orderedDashboardMarkers);

const home = await fetch(`${baseUrl}/`);
const homeHtml = await home.text();
const visible = normalize(homeHtml);

if (home.status !== 200) problems.push(`/ returned ${home.status}`);
if (visible.length > 16000) {
  problems.push(`home visible text too dense for product-first Beta surface: ${visible.length}`);
}

const orderedVisibleMarkers = [
  "\u6307\u6578\u72c0\u614b\u5100\u8868\u7ad9",
  "30 \u79d2",
  "3 \u5206\u9418",
  "\u6c7a\u7b56\u8f14\u52a9\u6458\u8981",
  "Index Dashboard",
  "\u8b66\u793a\u6e05\u55ae",
  "\u4e0b\u4e00\u6b65\u95b1\u8b80"
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
  "blocker",
  "publicDataSource",
  "scoreSource",
  "Runtime Status",
  "Supabase",
  "SQL",
  "raw market data"
]) {
  if (visible.includes(forbidden)) problems.push(`home visible text must not include ${forbidden}`);
}

for (const phrase of [
  "\u793a\u7bc4\u8cc7\u6599",
  "\u793a\u7bc4\u5206\u6578",
  "\u8cc7\u6599\u72c0\u614b",
  "\u6b63\u5f0f\u8cc7\u6599\u5347\u7d1a\u524d\u6aa2\u67e5",
  "\u4e0d\u63d0\u4f9b\u500b\u80a1\u8cb7\u8ce3\u5efa\u8b70",
  "\u4e0d\u5ba3\u7a31\u5373\u6642\u6216\u5b8c\u6574\u5e02\u5834\u8cc7\u6599"
]) {
  if (!visible.includes(phrase)) problems.push(`home visible text missing ${phrase}`);
}

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
