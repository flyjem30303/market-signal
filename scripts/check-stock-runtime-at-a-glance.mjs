import fs from "node:fs";

const componentPath = "src/components/stock-runtime-at-a-glance.tsx";
const dashboardPath = "src/components/dashboard-shell.tsx";
const decisionSummaryPath = "src/lib/runtime-decision-summary.ts";
const headlineSummaryPath = "src/lib/stock-runtime-headline-summary.ts";
const productSummaryPath = "src/lib/runtime-product-summary.ts";
const cssPath = "src/app/globals.css";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";

const files = new Map(
  [
    componentPath,
    dashboardPath,
    decisionSummaryPath,
    headlineSummaryPath,
    productSummaryPath,
    cssPath,
    packagePath,
    reviewGatePath
  ].map((file) => [file, fs.readFileSync(file, "utf8")])
);

const required = [
  [componentPath, "StockRuntimeAtAGlance"],
  [componentPath, "stock-public-decision-summary"],
  [componentPath, "狀態儀表"],
  [componentPath, "標的快速判讀"],
  [componentPath, "30 秒"],
  [componentPath, "3 分鐘"],
  [componentPath, "示範資料 / 示範分數"],
  [componentPath, "正式市場資料尚未啟用"],
  [componentPath, "不能當成個股買賣指令"],
  [componentPath, "查看市場簡報"],
  [componentPath, "查看方法說明"],
  [componentPath, "buildStockDecisionBrief"],
  [componentPath, "stock-runtime-headline-summary"],
  [headlineSummaryPath, "StockRuntimeHeadlineSummary"],
  [headlineSummaryPath, "decisionAidGroups"],
  [productSummaryPath, "示範 30 秒狀態與 3 分鐘觀察流程"],
  [productSummaryPath, "正式資料尚未啟用"],
  [decisionSummaryPath, 'publicDataSource: "mock"'],
  [decisionSummaryPath, 'scoreSource: "mock"'],
  [dashboardPath, "import { StockRuntimeAtAGlance }"],
  [dashboardPath, "publicScoreLabelKey"],
  [dashboardPath, "<StockRuntimeAtAGlance {...({ [publicScoreLabelKey]: publicScoreLabel } as any)} snapshot={snapshot} />"],
  [cssPath, ".stock-runtime-at-a-glance"],
  [cssPath, ".stock-public-decision-summary"],
  [cssPath, ".stock-runtime-headline-summary"],
  [packagePath, '"check:stock-runtime-at-a-glance": "node scripts/check-stock-runtime-at-a-glance.mjs"'],
  [reviewGatePath, "scripts/check-stock-runtime-at-a-glance.mjs"]
];

const forbidden = [
  [componentPath, "@supabase/supabase-js"],
  [componentPath, "createClient"],
  [componentPath, "fetch("],
  [componentPath, ".from("],
  [componentPath, "process.env"],
  [componentPath, 'scoreSource: "real"'],
  [componentPath, 'publicDataSource: "supabase"'],
  [dashboardPath, 'scoreSource="real"']
];

const missing = required.filter(([file, phrase]) => !read(file).includes(phrase)).map(([file, phrase]) => `${file}: ${phrase}`);
const blocked = forbidden.filter(([file, phrase]) => read(file).includes(phrase)).map(([file, phrase]) => `${file}: ${phrase}`);

for (const file of [componentPath, dashboardPath, productSummaryPath, headlineSummaryPath]) {
  for (const hit of findMojibakeMarkers(read(file))) blocked.push(`${file}: ${hit}`);
}

console.log(JSON.stringify({ blocked, missing, status: missing.length === 0 && blocked.length === 0 ? "ok" : "blocked" }, null, 2));

if (missing.length > 0 || blocked.length > 0) process.exitCode = 1;

function read(file) {
  return files.get(file) ?? "";
}

function findMojibakeMarkers(text) {
  const hits = [];
  if (/[\uE000-\uF8FF\uFFFD]/u.test(text)) hits.push("private-use-or-replacement-code-point");
  if (/\?{3,}/u.test(text)) hits.push("question-mark-run");
  return hits;
}
