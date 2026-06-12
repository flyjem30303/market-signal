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
  pkg.scripts?.["check:stock-product-first-runtime-readability"] !==
  "node scripts/check-stock-product-first-runtime-readability.mjs"
) {
  problems.push(`${packagePath} missing check:stock-product-first-runtime-readability`);
}

for (const phrase of [
  "scripts/check-stock-product-first-runtime-readability.mjs",
  '"stock-product-first-runtime-readability"'
]) {
  if (!reviewGate.includes(phrase)) problems.push(`${reviewGatePath} missing ${phrase}`);
}

const includeSeoStart = dashboard.indexOf("{includeSeoContent && (");
const includeSeoEnd = dashboard.indexOf("<StockPageCompass", includeSeoStart);
const stockSeoSlice = includeSeoStart >= 0 && includeSeoEnd > includeSeoStart
  ? dashboard.slice(includeSeoStart, includeSeoEnd)
  : "";

assertOrder("stock page source product-first runtime order", stockSeoSlice, [
  "<StockRuntimeAtAGlance",
  '<PublicBetaDecisionLoopBridge context="stock"',
  '<PublicBetaUsableLoopPanel context="stock"',
  '<PublicBetaRouteConsistencyPanel context="stock"',
  '<PublicBetaSourceCoverageRuntimeLabelsPanel context="stock"',
  "<DataFreshnessStrip"
]);

for (const route of ["/stocks/2330", "/stocks/TWII", "/stocks/0050"]) {
  const response = await fetch(`${baseUrl}${route}`);
  const html = await response.text();
  const visible = normalize(html);

  if (response.status !== 200) problems.push(`${route} returned ${response.status}`);
  if (visible.length > 20000) {
    problems.push(`${route} visible text too dense for stock product-first surface: ${visible.length}`);
  }

  assertOrder(`${route} visible product-first stock order`, visible, [
    "Market Signal Dashboard",
    "Stock Decision Brief",
    "Public Beta Decision Loop",
    "\u8cc7\u6599\u4f86\u6e90\u8207\u8986\u84cb\u7bc4\u570d",
    "\u8cc7\u6599\u65b0\u9bae\u5ea6 metadata"
  ]);

  if (!visible.includes("\u53ef\u7528\u9589\u74b0")) {
    problems.push(`${route} missing usable-loop copy`);
  }

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
    if (visible.includes(forbidden)) problems.push(`${route} visible text must not include ${forbidden}`);
  }

  if (!visible.includes("publicDataSource=mock")) problems.push(`${route} missing publicDataSource=mock`);
  if (!visible.includes("scoreSource=mock")) problems.push(`${route} missing scoreSource=mock`);
  if (!visible.includes("\u4e0d\u69cb\u6210\u6295\u8cc7\u5efa\u8b70") && !visible.includes("\u4e0d\u63d0\u4f9b\u8cb7\u8ce3\u5efa\u8b70")) {
    problems.push(`${route} missing non-investment-advice copy`);
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
      guardedStatus: "stock_product_first_runtime_readability_ready",
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
