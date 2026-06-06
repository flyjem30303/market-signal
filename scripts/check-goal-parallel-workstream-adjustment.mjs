import fs from "node:fs";

const docPath = "docs/GOAL_PARALLEL_WORKSTREAM_ADJUSTMENT.md";
const rolePath = "docs/ROLE_WORKSTREAMS.md";
const roadmapPath = "docs/COVERAGE_UNIVERSE_ROADMAP.md";
const statusPath = "PROJECT_STATUS.md";

const problems = [];

const doc = read(docPath);
const roles = read(rolePath);
const roadmap = read(roadmapPath);
const status = read(statusPath);

const requiredDocPhrases = [
  "Status: `goal_parallel_workstream_adjustment_ready_data_mainline_with_parallel_support`",
  "complete Level 1 MVP row coverage from `182/360` to `360/360`",
  "PM should not wait for A1/A2 when a safe mainline data step is available",
  "A1 is reassigned to the next data-expansion support lane",
  "prepare the Level 2 Taiwan all-listed universe manifest packet",
  "A2 is reassigned to launch-trust support while data coverage continues",
  "prepare public trust and legal-disclosure copy worklists",
  "完成「資料覆蓋率補齊」主線",
  "Level 1 MVP row coverage universe",
  "A1 可在背景準備 Level 2 台灣全上市 universe manifest packet",
  "A2 可在背景準備公開信任與揭露 copy worklist",
  "測試手段採輕量優先",
  "不為了驗證而重跑遠端操作",
  "不得未經 gate 跑 SQL",
  "不得未經 gate 寫 Supabase",
  "不得設定 publicDataSource=supabase",
  "不得設定 scoreSource=real",
  "full review gate should be reserved for milestone integration",
  "The next PM mainline action should remain Level 1 MVP coverage completion"
];

for (const phrase of requiredDocPhrases) {
  if (!doc.includes(phrase)) {
    problems.push(`${docPath} missing phrase: ${phrase}`);
  }
}

const requiredRolePhrases = [
  "PM may run mainline, A1, and A2 in parallel",
  "A1 removes data-readiness pressure from the mainline",
  "A2 removes visible-language and UX-readability pressure from the mainline"
];

for (const phrase of requiredRolePhrases) {
  if (!roles.includes(phrase)) {
    problems.push(`${rolePath} missing existing role phrase: ${phrase}`);
  }
}

const requiredRoadmapPhrases = [
  "Current GOAL completion means the MVP row coverage universe reaches `360/360`",
  "Taiwan all-listed coverage is the next major expansion stage",
  "This level is not allowed to reuse the MVP `360` denominator"
];

for (const phrase of requiredRoadmapPhrases) {
  if (!roadmap.includes(phrase)) {
    problems.push(`${roadmapPath} missing roadmap phrase: ${phrase}`);
  }
}

if (!status.includes("Latest GOAL parallel workstream adjustment slice")) {
  problems.push(`${statusPath} missing GOAL parallel workstream status entry`);
}

if (problems.length > 0) {
  console.error(JSON.stringify({ status: "blocked", problems }, null, 2));
  process.exit(1);
}

console.log(
  JSON.stringify(
    {
      status: "ok",
      docPath,
      guardedStatus: "goal_parallel_workstream_adjustment_ready_data_mainline_with_parallel_support"
    },
    null,
    2
  )
);

function read(path) {
  return fs.readFileSync(path, "utf8");
}
