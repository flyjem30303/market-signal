import fs from "node:fs";

const componentPath = "src/components/trust-runtime-boundary-notice.tsx";
const methodologyPath = "src/app/methodology/page.tsx";
const disclaimerPath = "src/app/disclaimer/page.tsx";
const termsPath = "src/app/terms/page.tsx";
const privacyPath = "src/app/privacy/page.tsx";
const weeklyPath = "src/app/weekly/page.tsx";
const cssPath = "src/app/globals.css";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";

const files = new Map(
  [componentPath, methodologyPath, disclaimerPath, termsPath, privacyPath, weeklyPath, cssPath, packagePath, reviewGatePath].map((file) => [
    file,
    fs.readFileSync(file, "utf8")
  ])
);

const required = [
  [componentPath, "TrustRuntimeBoundaryNotice"],
  [componentPath, "getRuntimeReadinessSummary"],
  [componentPath, "getRuntimeInterpretationSummary"],
  [componentPath, "getSourceDepthBlockerSummary"],
  [componentPath, "PublicRuntimeStateStrip"],
  [componentPath, "目前仍是 mock-only 判讀"],
  [componentPath, "方法論目前用 mock 資料展示評分邏輯"],
  [componentPath, "隱私權頁目前只說明低風險資料使用"],
  [componentPath, "使用條款目前鎖定展示型服務邊界"],
  [componentPath, "週報目前仍是 mock-only 市場節奏展示"],
  [componentPath, "Freshness metadata only explains data recency"],
  [componentPath, "scoreSource"],
  [componentPath, "runtimeInterpretation.decision"],
  [componentPath, "runtimeInterpretation.laneRatio.mockRuntimeHardening"],
  [componentPath, "runtimeInterpretation.stopLine"],
  [methodologyPath, "import { TrustRuntimeBoundaryNotice }"],
  [methodologyPath, "<TrustRuntimeBoundaryNotice context=\"methodology\" />"],
  [disclaimerPath, "import { TrustRuntimeBoundaryNotice }"],
  [disclaimerPath, "<TrustRuntimeBoundaryNotice context=\"disclaimer\" />"],
  [termsPath, "import { TrustRuntimeBoundaryNotice }"],
  [termsPath, "<TrustRuntimeBoundaryNotice context=\"terms\" />"],
  [privacyPath, "import { TrustRuntimeBoundaryNotice }"],
  [privacyPath, "<TrustRuntimeBoundaryNotice context=\"privacy\" />"],
  [weeklyPath, "import { TrustRuntimeBoundaryNotice }"],
  [weeklyPath, "<TrustRuntimeBoundaryNotice context=\"weekly\" />"],
  [cssPath, ".trust-runtime-boundary-notice"],
  [cssPath, ".trust-runtime-boundary-notice article.readying"],
  [cssPath, ".trust-runtime-boundary-notice article.blocked"],
  [packagePath, "\"check:trust-runtime-boundary-notice\": \"node scripts/check-trust-runtime-boundary-notice.mjs\""],
  [reviewGatePath, "scripts/check-trust-runtime-boundary-notice.mjs"]
];

const forbidden = [
  [componentPath, "@supabase/supabase-js"],
  [componentPath, "createClient"],
  [componentPath, "fetch("],
  [componentPath, ".from("],
  [componentPath, "process.env"],
  [componentPath, "scoreSource: \"real\""],
  [methodologyPath, "scoreSource=\"real\""],
  [disclaimerPath, "scoreSource=\"real\""],
  [termsPath, "scoreSource=\"real\""],
  [privacyPath, "scoreSource=\"real\""],
  [weeklyPath, "scoreSource=\"real\""]
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
