import fs from "node:fs";

const summaryPath = "src/lib/runtime-readiness-score.ts";
const componentPath = "src/components/runtime-readiness-panel.tsx";
const briefingPath = "src/app/briefing/page.tsx";
const cssPath = "src/app/globals.css";

const files = new Map(
  [summaryPath, componentPath, briefingPath, cssPath].map((file) => [file, fs.readFileSync(file, "utf8")])
);

const required = [
  [summaryPath, "Runtime 進入可加速前置，但仍維持 mock-only"],
  [summaryPath, "Supabase 唯讀 preflight"],
  [summaryPath, "不切主資料源、不寫資料"],
  [summaryPath, "正式分數來源"],
  [componentPath, "RuntimeReadinessPanel"],
  [componentPath, "Runtime Readiness"],
  [componentPath, "Runtime readiness"],
  [briefingPath, "import { RuntimeReadinessPanel }"],
  [briefingPath, "<RuntimeReadinessPanel />"],
  [cssPath, ".runtime-readiness-panel"],
  [cssPath, ".runtime-readiness-lanes"],
  [cssPath, ".runtime-readiness-score"]
];

const forbidden = [
  [summaryPath, "scoreSource=real"],
  [summaryPath, "NEXT_PUBLIC_DATA_SOURCE=supabase"],
  [summaryPath, "DATA_FRESHNESS_SUPABASE_READS=enabled"],
  [componentPath, "fetch("],
  [componentPath, "createClient"],
  [componentPath, "process.env"]
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
