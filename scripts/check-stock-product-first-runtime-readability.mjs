import fs from "node:fs";

const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const dashboardPath = "src/components/dashboard-shell.tsx";
const stockRuntimePath = "src/components/stock-runtime-at-a-glance.tsx";
const baseUrl = process.env.LOCALHOST_BASE_URL ?? "http://localhost:3000";

const problems = [];
const pkg = JSON.parse(read(packagePath));
const reviewGate = read(reviewGatePath);
const dashboard = read(dashboardPath);
const stockRuntime = read(stockRuntimePath);

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

for (const phrase of [
  'import { StockRuntimeAtAGlance } from "@/components/stock-runtime-at-a-glance";',
  "publicScoreLabelKey",
  '<StockRuntimeAtAGlance {...({ [publicScoreLabelKey]: publicScoreLabel } as any)} snapshot={snapshot} />',
  '<PublicBetaSourceCoverageBridge context={isStockPage ? "stock" : "home"}',
  "<PublicBetaPublicStatusSurface />",
  "<DataFreshnessStrip"
]) {
  if (!dashboard.includes(phrase)) problems.push(`${dashboardPath} missing ${phrase}`);
}

for (const phrase of [
  "狀態儀表",
  "標的快速判讀",
  "30 秒",
  "3 分鐘",
  "示範資料 / 示範分數",
  "不能當成個股買賣指令",
  "查看市場簡報",
  "查看方法說明",
  "buildStockDecisionBrief"
]) {
  if (!stockRuntime.includes(phrase)) problems.push(`${stockRuntimePath} missing ${phrase}`);
}

for (const route of ["/stocks/2330", "/stocks/TWII", "/stocks/0050"]) {
  const response = await fetch(`${baseUrl}${route}`);
  const html = await response.text();
  const visible = normalize(html);

  if (response.status !== 200) problems.push(`${route} returned ${response.status}`);
  if (visible.length > 7600) problems.push(`${route} visible text too dense after stock trim: ${visible.length}`);

  for (const required of ["狀態儀表", "標的快速判讀", "查看市場簡報", "查看方法說明"]) {
    if (!visible.includes(required)) problems.push(`${route} missing ${required}`);
  }

  for (const forbidden of [
    "Phase 1",
    "Phase 2",
    "Membership MVP",
    "cmd.exe",
    "npm run",
    "BETA_",
    "PUBLIC_BETA_EXTERNAL",
    "packet",
    "preflight",
    "post-run",
    "operator",
    "blocker",
    "publicDataSource",
    "scoreSource",
    "mock-only",
    "Supabase",
    "SQL",
    "raw market data"
  ]) {
    if (visible.includes(forbidden)) problems.push(`${route} visible text must not include ${forbidden}`);
  }

  for (const marker of findMojibakeMarkers(visible)) {
    problems.push(`${route} visible text has ${marker}`);
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

function findMojibakeMarkers(text) {
  const markers = [];
  if (/\uFFFD/u.test(text)) markers.push("replacement-character");
  if (/[\uE000-\uF8FF]/u.test(text)) markers.push("private-use-codepoint");
  if (/\?{3,}/u.test(text)) markers.push("question-mark-run");
  return markers;
}
