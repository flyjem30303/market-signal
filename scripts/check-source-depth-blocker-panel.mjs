import fs from "node:fs";

const helperPath = "src/lib/source-depth-blockers.ts";
const componentPath = "src/components/source-depth-blocker-panel.tsx";
const briefingPath = "src/app/briefing/page.tsx";
const cssPath = "src/app/globals.css";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";

const files = new Map(
  [helperPath, componentPath, briefingPath, cssPath, packagePath, reviewGatePath].map((file) => [
    file,
    fs.readFileSync(file, "utf8")
  ])
);

const required = [
  [helperPath, "getSourceDepthBlockerSummary"],
  [helperPath, "來源深度仍是 scoreSource=real 前的主要阻塞"],
  [helperPath, "Supabase reachability 只能證明物件可讀"],
  [helperPath, "sourceDepthState: \"not_ready\""],
  [helperPath, "scoreSource: \"mock\""],
  [helperPath, "不得因 UI、metadata reachability、schema shape 或 Supabase object reachability 而升級公開宣稱"],
  [componentPath, "SourceDepthBlockerPanel"],
  [componentPath, "getSourceDepthBlockerSummary"],
  [componentPath, "source-depth-blocker-panel"],
  [componentPath, "scoreSource: {summary.scoreSource}"],
  [briefingPath, "import { SourceDepthBlockerPanel }"],
  [briefingPath, "<SourceDepthBlockerPanel />"],
  [cssPath, ".source-depth-blocker-panel"],
  [cssPath, ".source-depth-blocker-grid"],
  [packagePath, "\"check:source-depth-blocker-panel\": \"node scripts/check-source-depth-blocker-panel.mjs\""],
  [reviewGatePath, "scripts/check-source-depth-blocker-panel.mjs"]
];

const forbidden = [
  [helperPath, "scoreSource: \"real\""],
  [helperPath, "sourceDepthState: \"approved\""],
  [helperPath, "@supabase/supabase-js"],
  [helperPath, "fetch("],
  [helperPath, ".from("],
  [helperPath, "writeFileSync"],
  [componentPath, "fetch("],
  [componentPath, "process.env"],
  [componentPath, "createClient"],
  [briefingPath, "sourceDepthState=\"approved\""]
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
