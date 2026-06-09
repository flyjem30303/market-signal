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
  [componentPath, "目前是 mock 訊號閱讀頁"],
  [componentPath, "不是個人化投資建議"],
  [componentPath, "scoreSource=real 尚未啟用"],
  [componentPath, "stock-runtime-headline-summary"],
  [componentPath, "Stock decision aid groups"],
  [componentPath, "runtime-product-summary"],
  [componentPath, "查看公開 Beta 簡報"],
  [componentPath, "查看 mock 方法論"],
  [componentPath, "回到首頁"],
  [componentPath, "Stock page remains mock runtime"],
  [componentPath, "scoreSource=real is not enabled"],
  [componentPath, "This is readiness evidence only, not a public real-data claim."],
  [componentPath, "Real data, complete coverage, and advice wording remain blocked"],
  [componentPath, "Mock runtime hardening remains active"],
  [componentPath, "Stop at gates before any mock-to-real promotion"],
  [productSummaryPath, "Use mock signals for reading only"],
  [productSummaryPath, "Real-data claims are not live"],
  [headlineSummaryPath, "StockRuntimeHeadlineSummary"],
  [headlineSummaryPath, "decisionAidGroups"],
  [headlineSummaryPath, "does not approve publicDataSource=supabase"],
  [decisionSummaryPath, "publicDataSource: \"mock\""],
  [decisionSummaryPath, "scoreSource: \"mock\""],
  [dashboardPath, "import { StockRuntimeAtAGlance }"],
  [dashboardPath, "<StockRuntimeAtAGlance scoreSourceLabel={freshness.scoreSourceLabel} snapshot={snapshot} />"],
  [cssPath, ".stock-runtime-at-a-glance"],
  [cssPath, ".stock-runtime-headline-summary"],
  [cssPath, ".stock-runtime-governance-details"],
  [packagePath, "\"check:stock-runtime-at-a-glance\": \"node scripts/check-stock-runtime-at-a-glance.mjs\""],
  [reviewGatePath, "scripts/check-stock-runtime-at-a-glance.mjs"]
];

const forbidden = [
  [componentPath, "@supabase/supabase-js"],
  [componentPath, "createClient"],
  [componentPath, "fetch("],
  [componentPath, ".from("],
  [componentPath, "process.env"],
  [componentPath, "scoreSource: \"real\""],
  [componentPath, "publicDataSource: \"supabase\""],
  [dashboardPath, "scoreSource=\"real\""]
];

const missing = required.filter(([file, phrase]) => !read(file).includes(phrase)).map(([file, phrase]) => `${file}: ${phrase}`);
const blocked = forbidden.filter(([file, phrase]) => read(file).includes(phrase)).map(([file, phrase]) => `${file}: ${phrase}`);

for (const file of [componentPath, productSummaryPath]) {
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
