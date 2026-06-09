import fs from "node:fs";

const componentPath = "src/components/home-runtime-status-panel.tsx";
const dashboardPath = "src/components/dashboard-shell.tsx";
const decisionSummaryPath = "src/lib/runtime-decision-summary.ts";
const productSummaryPath = "src/lib/runtime-product-summary.ts";
const cssPath = "src/app/globals.css";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";

const files = new Map(
  [componentPath, dashboardPath, decisionSummaryPath, productSummaryPath, cssPath, packagePath, reviewGatePath].map(
    (file) => [file, fs.readFileSync(file, "utf8")]
  )
);

const required = [
  [componentPath, "HomeRuntimeStatusPanel"],
  [componentPath, "目前可用的是 mock 訊號閱讀模式"],
  [componentPath, "不是投資建議"],
  [componentPath, "scoreSource=real"],
  [componentPath, "runtime-product-summary"],
  [componentPath, "查看股票 mock 訊號"],
  [componentPath, "查看公開 Beta 簡報"],
  [componentPath, "查看 mock 方法論"],
  [componentPath, "查看 runtime 邊界與下一步 gate"],
  [componentPath, "This is readiness evidence only, not a public real-data claim."],
  [componentPath, "Real data, complete coverage, and advice wording remain blocked"],
  [componentPath, "scoreSource=real"],
  [componentPath, "boundaryCopy.stopLine"],
  [productSummaryPath, "Use mock signals for reading only"],
  [productSummaryPath, "Real-data claims are not live"],
  [productSummaryPath, "Decide post-readonly runtime interpretation"],
  [productSummaryPath, "可用於 mock 訊號閱讀"],
  [decisionSummaryPath, "publicDataSource: \"mock\""],
  [decisionSummaryPath, "scoreSource: \"mock\""],
  [dashboardPath, "import { HomeRuntimeStatusPanel }"],
  [dashboardPath, "<HomeRuntimeStatusPanel selectedSymbol={selected.symbol} />"],
  [cssPath, ".home-runtime-status-panel"],
  [cssPath, ".home-runtime-details"],
  [packagePath, "\"check:home-runtime-status-panel\": \"node scripts/check-home-runtime-status-panel.mjs\""],
  [reviewGatePath, "scripts/check-home-runtime-status-panel.mjs"]
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
