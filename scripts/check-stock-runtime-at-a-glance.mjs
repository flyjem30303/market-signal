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
  [componentPath, "30 秒看懂標的狀態"],
  [componentPath, "3 分鐘內請看"],
  [componentPath, "成因"],
  [componentPath, "更新時間"],
  [componentPath, "影響級別"],
  [componentPath, "下一步"],
  [componentPath, "資料邊界：publicDataSource=mock，scoreSource=mock"],
  [componentPath, "目前不是即時真實資料"],
  [componentPath, "不提供買賣建議"],
  [componentPath, "stock-runtime-headline-summary"],
  [componentPath, "Stock decision aid groups"],
  [componentPath, "runtime-product-summary"],
  [componentPath, "看公開 Beta 市場摘要"],
  [componentPath, "了解示範資料邊界"],
  [componentPath, "回首頁看市場總覽"],
  [componentPath, "正式資料升級必須先完成來源、覆蓋率、品質檢查、回讀與揭露條件"],
  [componentPath, "buildStockDecisionBrief"],
  [productSummaryPath, "Use mock signals for reading only"],
  [productSummaryPath, "Real-data claims are not live"],
  [headlineSummaryPath, "StockRuntimeHeadlineSummary"],
  [headlineSummaryPath, "decisionAidGroups"],
  [headlineSummaryPath, "本頁不宣稱正式資料來源"],
  [decisionSummaryPath, 'publicDataSource: "mock"'],
  [decisionSummaryPath, 'scoreSource: "mock"'],
  [dashboardPath, "import { StockRuntimeAtAGlance }"],
  [dashboardPath, "<StockRuntimeAtAGlance scoreSourceLabel={freshness.scoreSourceLabel} snapshot={snapshot} />"],
  [cssPath, ".stock-runtime-at-a-glance"],
  [cssPath, ".stock-public-decision-summary"],
  [cssPath, ".stock-runtime-headline-summary"],
  [cssPath, ".stock-runtime-governance-details"],
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

for (const file of [componentPath, productSummaryPath, headlineSummaryPath]) {
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
