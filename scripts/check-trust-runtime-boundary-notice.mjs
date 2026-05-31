import fs from "node:fs";

const componentPath = "src/components/trust-runtime-boundary-notice.tsx";
const methodologyPath = "src/app/methodology/page.tsx";
const disclaimerPath = "src/app/disclaimer/page.tsx";
const cssPath = "src/app/globals.css";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";

const files = new Map(
  [componentPath, methodologyPath, disclaimerPath, cssPath, packagePath, reviewGatePath].map((file) => [
    file,
    fs.readFileSync(file, "utf8")
  ])
);

const required = [
  [componentPath, "TrustRuntimeBoundaryNotice"],
  [componentPath, "getRuntimeReadinessSummary"],
  [componentPath, "getSourceDepthBlockerSummary"],
  [componentPath, "mock-only runtime"],
  [componentPath, "不構成投資建議"],
  [componentPath, "scoreSource"],
  [componentPath, "sourceDepth.stopLine"],
  [methodologyPath, "import { TrustRuntimeBoundaryNotice }"],
  [methodologyPath, "<TrustRuntimeBoundaryNotice context=\"methodology\" />"],
  [disclaimerPath, "import { TrustRuntimeBoundaryNotice }"],
  [disclaimerPath, "<TrustRuntimeBoundaryNotice context=\"disclaimer\" />"],
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
  [disclaimerPath, "scoreSource=\"real\""]
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
