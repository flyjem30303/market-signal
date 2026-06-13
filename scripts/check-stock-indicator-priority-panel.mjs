import fs from "node:fs";

const baseUrl = process.env.LOCALHOST_BASE_URL ?? "http://localhost:3000";
const componentPath = "src/components/dashboard-shell.tsx";
const cssPath = "src/app/globals.css";

const component = fs.readFileSync(componentPath, "utf8");
const css = fs.readFileSync(cssPath, "utf8");
const problems = [];

for (const phrase of [
  "function StockIndicatorPriorityPanel",
  "stock-indicator-priority-panel",
  "stock-indicator-priority-grid",
  "snapshot.modules.slice().sort",
  "snapshot.missingModuleFlags",
  "snapshot.staleDataFlags",
  "示範資料只用來展示閱讀順序",
  "onTab(item.tab)"
]) {
  if (!component.includes(phrase)) problems.push(`${componentPath} missing ${phrase}`);
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
  const visible = normalize(await response.text());
  const prioritySlice = sliceFrom(visible, "Indicator Priority", "指標路線圖");

  if (response.status !== 200) problems.push(`${route} returned ${response.status}`);
  assertOrder(`${route} visible indicator priority order`, prioritySlice, [
    "Indicator Priority",
    "指標優先順序",
    "資料可信度",
    "主要支撐",
    "主要風險",
    "指標路線圖"
  ]);

  for (const phrase of [
    "支撐指標",
    "風險來源",
    "示範資料",
    "示範分數",
    "不提供買賣建議"
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
    "publicDataSource",
    "scoreSource",
    "Supabase",
    "SQL",
    "daily_prices"
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
      guardedStatus: "stock_indicator_priority_panel_public_ready",
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
    if (index <= cursor) problems.push(`${label} has ${marker} out of order`);
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

function sliceFrom(text, startNeedle, endNeedle) {
  const start = text.indexOf(startNeedle);
  if (start < 0) return text;
  const end = text.indexOf(endNeedle, start);
  return end < 0 ? text.slice(start) : text.slice(start, end + endNeedle.length);
}
