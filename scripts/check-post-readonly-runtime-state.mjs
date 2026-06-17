import fs from "node:fs";

const helperPath = "src/lib/post-readonly-runtime-state.ts";
const productStatusPath = "src/components/post-readonly-product-status.tsx";
const briefingPanelPath = "src/components/runtime-readiness-panel.tsx";
const cssPath = "src/app/globals.css";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";

const files = new Map(
  [helperPath, productStatusPath, briefingPanelPath, cssPath, packagePath, reviewGatePath].map((file) => [
    file,
    fs.readFileSync(file, "utf8")
  ])
);

const required = [
  [helperPath, "PostReadonlyRuntimeState"],
  [helperPath, "getPostReadonlyRuntimeState"],
  [helperPath, "coverage_complete_mock_only"],
  [helperPath, "objectsReachable: evidence.objects.length"],
  [helperPath, "rowCoverage: {"],
  [helperPath, "coverageStatus: \"complete\""],
  [helperPath, "expectedRows: 360"],
  [helperPath, "missingRows: 0"],
  [helperPath, "observedRows: 360"],
  [helperPath, "aggregate_count_complete"],
  [helperPath, "資料覆蓋已完成"],
  [helperPath, "公開 runtime 仍維持示範資料"],
  [helperPath, "公開頁仍維持示範資料與示範分數"],
  [helperPath, "publicDataSource: \"mock\""],
  [helperPath, "scoreSource: \"mock\""],
  [productStatusPath, "PostReadonlyProductStatus"],
  [productStatusPath, "getPostReadonlyRuntimeState"],
  [productStatusPath, "資料覆蓋完成"],
  [productStatusPath, "正式資料切換"],
  [productStatusPath, "Promotion readiness"],
  [productStatusPath, "尚未允許正式資料模式"],
  [productStatusPath, "publicDataSource={state.publicDataSource}; scoreSource={state.scoreSource}"],
  [briefingPanelPath, "getPostReadonlyRuntimeState"],
  [briefingPanelPath, "Post-readonly runtime"],
  [briefingPanelPath, "postReadonlyRuntime.userFacingSummary"],
  [briefingPanelPath, "postReadonlyRuntime.rowCoverage.reason"],
  [cssPath, ".post-readonly-product-status"],
  [cssPath, ".post-readonly-product-status-main"],
  [cssPath, ".post-readonly-product-status article.blocked"],
  [cssPath, ".post-readonly-runtime-card"],
  [packagePath, "\"check:post-readonly-runtime-state\": \"node scripts/check-post-readonly-runtime-state.mjs\""],
  [reviewGatePath, "scripts/check-post-readonly-runtime-state.mjs"]
];

const forbidden = [
  [helperPath, "@supabase/supabase-js"],
  [helperPath, "createClient"],
  [helperPath, "fetch("],
  [helperPath, ".from("],
  [helperPath, ".insert("],
  [helperPath, ".update("],
  [helperPath, ".delete("],
  [helperPath, "process.env"],
  [helperPath, "node:fs"],
  [helperPath, "publicDataSource: \"supabase\""],
  [helperPath, "scoreSource: \"real\""],
  [helperPath, "scoreSource=real approved"],
  [productStatusPath, "@supabase/supabase-js"],
  [productStatusPath, "createClient"],
  [productStatusPath, "fetch("],
  [productStatusPath, ".from("],
  [productStatusPath, ".insert("],
  [productStatusPath, ".update("],
  [productStatusPath, ".delete("],
  [productStatusPath, "process.env"],
  [productStatusPath, "node:fs"],
  [productStatusPath, "publicDataSource: \"supabase\""],
  [productStatusPath, "scoreSource: \"real\""],
  [productStatusPath, "scoreSource=real approved"],
  [briefingPanelPath, "scoreSource=real approved"]
];

const mojibakePatterns = [/鞈/u, /銝/u, /嚗/u, /蝣/u, /撌/u, /甇/u, /摰/u, /靘/u, /雿/u, /蝺/u, /�/u];
const missing = required.filter(([file, phrase]) => !read(file).includes(phrase)).map(([file, phrase]) => `${file}: ${phrase}`);
const blocked = forbidden.filter(([file, phrase]) => read(file).includes(phrase)).map(([file, phrase]) => `${file}: ${phrase}`);

for (const file of [helperPath, productStatusPath]) {
  for (const pattern of mojibakePatterns) {
    if (pattern.test(read(file))) blocked.push(`${file}: mojibake pattern ${pattern}`);
  }
}

console.log(JSON.stringify({ blocked, missing, status: missing.length === 0 && blocked.length === 0 ? "ok" : "blocked" }, null, 2));

if (missing.length > 0 || blocked.length > 0) {
  process.exitCode = 1;
}

function read(file) {
  return files.get(file) ?? "";
}
