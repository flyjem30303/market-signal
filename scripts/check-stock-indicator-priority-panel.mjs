import fs from "node:fs";

const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const dashboardPath = "src/components/dashboard-shell.tsx";
const cssPath = "src/app/globals.css";
const baseUrl = process.env.LOCALHOST_BASE_URL ?? "http://localhost:3000";

const problems = [];
const pkg = JSON.parse(read(packagePath));
const reviewGate = read(reviewGatePath);
const dashboard = read(dashboardPath);
const css = read(cssPath);

if (pkg.scripts?.["check:stock-indicator-priority-panel"] !== "node scripts/check-stock-indicator-priority-panel.mjs") {
  problems.push(`${packagePath} missing check:stock-indicator-priority-panel`);
}

for (const phrase of [
  "scripts/check-stock-indicator-priority-panel.mjs",
  '"stock-indicator-priority-panel"'
]) {
  if (!reviewGate.includes(phrase)) problems.push(`${reviewGatePath} missing ${phrase}`);
}

const includeSeoStart = dashboard.indexOf("{includeSeoContent && (");
const includeSeoEnd = dashboard.indexOf("<StockMarketContextPanel", includeSeoStart);
const stockSeoSlice = includeSeoStart >= 0 && includeSeoEnd > includeSeoStart
  ? dashboard.slice(includeSeoStart, includeSeoEnd)
  : "";

assertOrder("stock indicator priority source order", stockSeoSlice, [
  "<StockInvestorActionSummary",
  "<StockIndicatorPriorityPanel",
  "<StockInvestorIndicatorRoadmap"
]);

for (const phrase of [
  "function StockIndicatorPriorityPanel",
  "stock-indicator-priority-panel",
  "stock-indicator-priority-grid",
  "snapshot.modules.slice().sort",
  "snapshot.missingModuleFlags",
  "snapshot.staleDataFlags",
  "Beta mock",
  "onTab(item.tab)"
]) {
  if (!dashboard.includes(phrase)) problems.push(`${dashboardPath} missing ${phrase}`);
}

for (const phrase of [
  ".stock-indicator-priority-panel",
  ".stock-indicator-priority-grid",
  ".stock-indicator-priority-grid article.active",
  ".stock-indicator-priority-grid article.hold",
  ".stock-indicator-priority-grid article.blocked",
  ".stock-indicator-priority-grid button:hover"
]) {
  if (!css.includes(phrase)) problems.push(`${cssPath} missing ${phrase}`);
}

for (const route of ["/stocks/2330", "/stocks/TWII", "/stocks/0050"]) {
  const response = await fetch(`${baseUrl}${route}`);
  const html = await response.text();
  const visible = normalize(html);

  if (response.status !== 200) problems.push(`${route} returned ${response.status}`);
  assertOrder(`${route} visible indicator priority order`, visible, [
    "Investor Action Summary",
    "Indicator Priority",
    "\u8cc7\u6599\u53ef\u4fe1\u5ea6",
    "\u4e3b\u8981\u652f\u6490",
    "3. \u4e3b\u8981\u98a8\u96aa",
    "\u6307\u6a19\u8def\u7dda\u5716"
  ]);

  for (const phrase of [
    "\u6307\u6a19\u512a\u5148\u9806\u5e8f",
    "\u8cc7\u6599\u908a\u754c",
    "\u652f\u6490\u6307\u6a19",
    "\u98a8\u96aa\u4f86\u6e90",
    "\u4e0d\u63d0\u4f9b\u8cb7\u8ce3\u5efa\u8b70",
    "publicDataSource=mock",
    "scoreSource=mock"
  ]) {
    if (!visible.includes(phrase)) problems.push(`${route} missing ${phrase}`);
  }

  for (const forbidden of [
    "cmd.exe",
    "BETA_",
    "PUBLIC_BETA_EXTERNAL",
    "packet",
    "preflight",
    "post-run",
    "operator",
    "scoreSource=real approved",
    "publicDataSource=supabase approved"
  ]) {
    if (visible.includes(forbidden)) problems.push(`${route} visible text must not include ${forbidden}`);
  }
}

if (problems.length) {
  console.error(JSON.stringify({ problems, status: "blocked" }, null, 2));
  process.exit(1);
}

console.log(
  JSON.stringify(
    {
      checkedRoutes: ["/stocks/2330", "/stocks/TWII", "/stocks/0050"],
      guardedStatus: "stock_indicator_priority_panel_ready",
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
    .replace(/&amp;/g, "&")
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
