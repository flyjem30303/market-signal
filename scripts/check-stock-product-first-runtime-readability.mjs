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

for (const phrase of [
  "<StockRuntimeAtAGlance",
  "<DataFreshnessStrip",
  '<PublicBetaSourceCoverageBridge context={isStockPage ? "stock" : "home"}',
  "<PublicBetaPublicStatusSurface />"
]) {
  if (!dashboard.includes(phrase)) problems.push(`${dashboardPath} missing ${phrase}`);
}

if (!dashboard.includes("!isStockPage") || !dashboard.includes("<PublicBetaPublicStatusSurface />")) {
  problems.push(`${dashboardPath} must keep public status surface on non-stock pages only`);
}

for (const route of ["/stocks/2330", "/stocks/TWII", "/stocks/0050"]) {
  const response = await fetch(`${baseUrl}${route}`);
  const html = await response.text();
  const visible = normalize(html);

  if (response.status !== 200) problems.push(`${route} returned ${response.status}`);
  if (visible.length > 3800) problems.push(`${route} visible text too dense after stock trim: ${visible.length}`);

  for (const required of [
    "30 秒快速閱讀",
    "3 分鐘要複核",
    "資料邊界",
    "示範資料",
    "示範分數",
    "正式資料尚未啟用",
    "更新時間",
    "下一步",
    "不提供買賣建議",
    "資料來源與覆蓋率"
  ]) {
    if (!visible.includes(required)) problems.push(`${route} missing ${required}`);
  }

  for (const forbidden of [
    "目前公開使用狀態",
    "Phase 1",
    "Phase 2",
    "Membership MVP",
    "會員 MVP",
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
    "mock-only",
    "Supabase",
    "SQL",
    "raw market data"
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
