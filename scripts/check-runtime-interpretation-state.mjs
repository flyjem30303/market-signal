import fs from "node:fs";

const libPath = "src/lib/runtime-interpretation.ts";
const stockPath = "src/components/stock-runtime-at-a-glance.tsx";
const homePath = "src/components/home-runtime-status-panel.tsx";
const trustPath = "src/components/trust-runtime-boundary-notice.tsx";
const cssPath = "src/app/globals.css";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";

const files = new Map(
  [libPath, stockPath, homePath, trustPath, cssPath, packagePath, reviewGatePath].map((file) => [
    file,
    fs.readFileSync(file, "utf8")
  ])
);

const required = [
  [libPath, "getRuntimeInterpretationSummary"],
  [libPath, "mock_runtime_hardening"],
  [libPath, "Mock runtime hardening is the active CEO track"],
  [libPath, "mockRuntimeHardening: 70"],
  [libPath, "supabaseReadonlyPreparation: 30"],
  [libPath, "publicDataSource: \"mock\""],
  [libPath, "scoreSource: \"mock\""],
  [libPath, "Supabase row coverage attempt must be a separately named readonly action"],
  [libPath, "source rights and disclosure are not approved"],
  [libPath, "model credibility and backtest evidence are not approved"],
  [libPath, "data quality evidence is not sufficient for scoreSource=real"],
  [libPath, "Do not promote publicDataSource=supabase or scoreSource=real"],
  [stockPath, "getRuntimeInterpretationSummary"],
  [stockPath, "示範流程強化"],
  [stockPath, "runtimeInterpretation.laneRatio.mockRuntimeHardening"],
  [stockPath, "runtimeInterpretation.stopLine"],
  [homePath, "getRuntimeInterpretationSummary"],
  [homePath, "示範流程強化"],
  [homePath, "runtimeInterpretation.laneRatio.mockRuntimeHardening"],
  [homePath, "runtimeInterpretation.stopLine"],
  [trustPath, "getRuntimeInterpretationSummary"],
  [trustPath, "示範流程強化"],
  [trustPath, "runtimeInterpretation.laneRatio.mockRuntimeHardening"],
  [trustPath, "runtimeInterpretation.stopLine"],
  [cssPath, "repeat(auto-fit, minmax(150px"],
  [cssPath, ".runtime-boundary-copy-card"],
  [packagePath, "\"check:runtime-interpretation-state\": \"node scripts/check-runtime-interpretation-state.mjs\""],
  [reviewGatePath, "scripts/check-runtime-interpretation-state.mjs"]
];

const forbidden = [
  [libPath, "@supabase/supabase-js"],
  [libPath, "createClient"],
  [libPath, "fetch("],
  [libPath, ".from("],
  [libPath, ".insert("],
  [libPath, ".update("],
  [libPath, ".delete("],
  [libPath, "publicDataSource: \"supabase\""],
  [libPath, "scoreSource: \"real\""],
  [stockPath, "scoreSource: \"real\""],
  [homePath, "scoreSource: \"real\""],
  [trustPath, "scoreSource: \"real\""]
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
