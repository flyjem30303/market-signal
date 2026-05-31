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
  [progressPath, "Supabase schema / repository readiness"],
  [progressPath, "Supabase object reachability"],
  [progressPath, "freshness interpretation"],
  [progressPath, "data_runs baseline"],
  [progressPath, "data_freshness candidate"],
  [progressPath, "scoreSource=real"],
  [progressPath, "owner: \"CEO\""],
  [progressPath, "owner: \"Data\""],
  [progressPath, "owner: \"Engineering\""],
  [progressPath, "owner: \"Investment\""],
  [progressPath, "owner: \"PM\""],
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
  [progressPath, "currentPublicSource: \"supabase\""],
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
