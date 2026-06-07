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
  "Status: `goal_launch_engineering_parallel_workstreams_ready`",
  "formal launch-engineering program",
  "PM owns the mainline and integration",
  "A1 owns the data / Supabase / market evidence support lane",
  "A2 owns the public trust / UX readability / disclosure support lane",
  "PM must assign new A1/A2 tasks whenever their current background tasks finish",
  "The GOAL should move toward formal launch engineering",
  "Dynamic Reassignment Rule",
  "When A1 or A2 completes a task",
  "PM immediately assigns the next highest-value side-lane task",
  "請把目標推向「正式上線工程完成」",
  "PM 是主線與唯一整合 owner",
  "A1 是 Data / Supabase / Market Evidence 副線",
  "A2 是 Frontend / UX Readability / Public Copy QA 副線",
  "accepted / rejected / needs_bounded_repair / blocked",
  "Level 1 MVP row coverage",
  "Runtime promotion gate",
  "Ingestion / backfill",
  "publicDataSource=mock / scoreSource=mock",
  "publicDataSource=supabase",
  "scoreSource=real",
  "A1/A2 不獨立 commit",
  "full review gate should be reserved for milestone integration"
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

const requiredStatusPhrases = [
  "Latest GOAL launch-engineering parallel workstream adjustment slice",
  "goal_launch_engineering_parallel_workstreams_ready",
  "A1/A2 completion now triggers immediate PM reassignment",
  "formal launch engineering"
];

for (const phrase of requiredStatusPhrases) {
  if (!status.includes(phrase)) {
    problems.push(`${statusPath} missing status phrase: ${phrase}`);
  }
}

const forbiddenPatterns = [
  /[\uE000-\uF8FF\uFFFD]/u,
  /\?{3,}/u,
  /Supabase writes are approved/u,
  /SQL execution is approved/u,
  /publicDataSource=supabase is approved/u,
  /scoreSource=real is approved/u,
  /RUN_REMOTE_NOW/u,
  /EXECUTION_COMPLETED/u
];

for (const pattern of forbiddenPatterns) {
  if (pattern.test(doc)) {
    problems.push(`${docPath} contains forbidden pattern: ${pattern}`);
  }
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
      guardedStatus: "goal_launch_engineering_parallel_workstreams_ready"
    },
    null,
    2
  )
);

function read(path) {
  return fs.readFileSync(path, "utf8");
}
