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
  [componentPath, "投資與資料限制：目前仍是 mock-only"],
  [componentPath, "方法說明：mock 分數不等於正式模型結論"],
  [componentPath, "隱私與資料邊界：不因 mock 展示啟用真實資料線"],
  [componentPath, "使用條款：公開資訊仍受 mock-only 邊界限制"],
  [componentPath, "週報邊界：目前不是即時或完整市場資料"],
  [componentPath, "publicDataSource=mock; scoreSource=mock"],
  [componentPath, "不得把 mock 訊號說成真實資料、完整覆蓋率或正式投資建議"],
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

for (const marker of findMojibakeMarkers(read(componentPath))) {
  blocked.push(`${componentPath}: ${marker}`);
}

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

function findMojibakeMarkers(text) {
  const markers = [];
  if (/[\uE000-\uF8FF\uFFFD]/u.test(text)) markers.push("private-use-or-replacement-code-point");
  if (/\?{3,}/u.test(text)) markers.push("question-mark-run");
  return markers;
}
