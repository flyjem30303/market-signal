import fs from "node:fs";

const progressPath = "src/lib/project-progress-score.ts";
const componentPath = "src/components/project-progress-panel.tsx";
const briefingPath = "src/app/briefing/page.tsx";
const cssPath = "src/app/globals.css";

const files = new Map(
  [progressPath, componentPath, briefingPath, cssPath].map((file) => [file, fs.readFileSync(file, "utf8")])
);

const required = [
  [progressPath, "export type ProjectProgressLane"],
  [progressPath, "getProjectProgressSummary"],
  [progressPath, "adjustedScore"],
  [progressPath, "PM 估算目前整體開發進度"],
  [progressPath, "受控 Supabase 唯讀遠端驗證後的來源深度證據"],
  [progressPath, "Supabase object reachability 已完成"],
  [progressPath, "本地唯讀 preflight、輸出契約與一次受控 object reachability"],
  [progressPath, "模型可信度與回測證據"],
  [progressPath, "真實市場資料與 scoreSource=real 尚未開啟"],
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
  [progressPath, "scoreSource=real approved"],
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
  return files.get(file) ?? "";
}
