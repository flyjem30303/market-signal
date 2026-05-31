import fs from "node:fs";

const progressPath = "src/lib/project-progress-score.ts";
const componentPath = "src/components/project-progress-panel.tsx";
const briefingPath = "src/app/briefing/page.tsx";
const cssPath = "src/app/globals.css";

const progress = fs.readFileSync(progressPath, "utf8");
const component = fs.readFileSync(componentPath, "utf8");
const briefing = fs.readFileSync(briefingPath, "utf8");
const css = fs.readFileSync(cssPath, "utf8");

const required = [
  [progressPath, "export type ProjectProgressLane"],
  [progressPath, "getProjectProgressSummary"],
  [progressPath, "adjustedScore"],
  [progressPath, "PM 估算目前進度約 42%"],
  [progressPath, "Supabase 唯讀 gate 與真實資料來源深度證據"],
  [progressPath, "scoreSource=real / 模型可信度"],
  [componentPath, "ProjectProgressPanel"],
  [componentPath, "PM Progress Score"],
  [componentPath, "Project progress"],
  [briefingPath, "import { ProjectProgressPanel }"],
  [briefingPath, "<ProjectProgressPanel />"],
  [cssPath, ".project-progress-panel"],
  [cssPath, ".project-progress-meter"],
  [cssPath, ".project-progress-lanes"]
];

const forbidden = [
  [progressPath, "adjustedScore: 100"],
  [progressPath, "scoreSource=real 已完成"],
  [componentPath, "connect Supabase"],
  [componentPath, "run SQL"],
  [componentPath, "fetch("]
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
  if (file === progressPath) return progress;
  if (file === componentPath) return component;
  if (file === briefingPath) return briefing;
  return css;
}
