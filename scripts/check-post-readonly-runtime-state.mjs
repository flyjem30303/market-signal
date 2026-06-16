import fs from "node:fs";

const helperPath = "src/lib/post-readonly-runtime-state.ts";
const productStatusPath = "src/components/post-readonly-product-status.tsx";
const briefingPanelPath = "src/components/runtime-readiness-panel.tsx";
const cssPath = "src/app/globals.css";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";

const files = new Map(
  [
    helperPath,
    productStatusPath,
    briefingPanelPath,
    cssPath,
    packagePath,
    reviewGatePath
  ].map((file) => [file, fs.readFileSync(file, "utf8")])
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
  [helperPath, "publicDataSource: \"mock\""],
  [helperPath, "scoreSource: \"mock\""],
  [helperPath, "資料覆蓋已完成後台驗證"],
  [helperPath, "不切換 publicDataSource=supabase"],
  [helperPath, "不設定 scoreSource=real"],
  [productStatusPath, "PostReadonlyProductStatus"],
  [productStatusPath, "getPostReadonlyRuntimeState"],
  [productStatusPath, "資料覆蓋已完成"],
  [productStatusPath, "公開頁仍需通過 promotion gate"],
  [productStatusPath, "唯讀證據"],
  [productStatusPath, "資料覆蓋"],
  [productStatusPath, "公開邊界"],
  [productStatusPath, "下一道 gate"],
  [productStatusPath, "publicDataSource={state.publicDataSource}; scoreSource={state.scoreSource}"],
  [productStatusPath, "不會自動啟用 scoreSource=real"],
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

const missing = required.filter(([file, phrase]) => !read(file).includes(phrase)).map(([file, phrase]) => `${file}: ${phrase}`);
const blocked = forbidden.filter(([file, phrase]) => read(file).includes(phrase)).map(([file, phrase]) => `${file}: ${phrase}`);

console.log(
  JSON.stringify(
    {
      blocked,
      missing,
      status: missing.length === 0 && blocked.length === 0 ? "ok" : "blocked"
    },
    null,
    2
  )
);

if (missing.length > 0 || blocked.length > 0) {
  process.exitCode = 1;
}

function read(file) {
  return files.get(file) ?? "";
}
