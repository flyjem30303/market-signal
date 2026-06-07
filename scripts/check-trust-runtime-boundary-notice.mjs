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
  [componentPath, methodologyPath, disclaimerPath, termsPath, privacyPath, weeklyPath, cssPath, packagePath, reviewGatePath].map(
    (file) => [file, fs.readFileSync(file, "utf8")]
  )
);

const required = [
  [componentPath, "TrustRuntimeBoundaryNotice"],
  [componentPath, "getRuntimeReadinessSummary"],
  [componentPath, "getRuntimeInterpretationSummary"],
  [componentPath, "getSourceDepthBlockerSummary"],
  [componentPath, "PublicRuntimeStateStrip"],
  [componentPath, "Investment and data limits: currently mock-only"],
  [componentPath, "Methodology: mock scores are not formal model conclusions"],
  [componentPath, "Privacy and data boundary: mock display does not enable real data"],
  [componentPath, "Terms of use: public information remains mock-only"],
  [componentPath, "Weekly boundary: not live or complete market data"],
  [componentPath, "publicDataSource=mock; scoreSource=mock"],
  [componentPath, "Do not describe mock signals as real data, complete"],
  [componentPath, "Source and score boundary"],
  [componentPath, "Promotion stop line"],
  [componentPath, "data freshness metadata"],
  [componentPath, "not investment advice"],
  [componentPath, "示範流程強化"],
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
