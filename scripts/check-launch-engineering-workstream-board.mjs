import fs from "node:fs";

const docPath = "docs/LAUNCH_ENGINEERING_WORKSTREAM_BOARD.md";
const statusPath = "PROJECT_STATUS.md";
const rolePath = "docs/ROLE_WORKSTREAMS.md";

const problems = [];

const doc = read(docPath);
const status = read(statusPath);
const roles = read(rolePath);

const requiredDocPhrases = [
  "Status: `launch_engineering_workstream_board_ready`",
  "CEO keeps the active GOAL pointed at formal launch engineering",
  "PM remains the only integration owner",
  "MVP row coverage target: `360/360`",
  "Latest accepted aggregate row coverage evidence: `182/360`",
  "Completed TW equity sub-scope: `2330`, `2382`, and `2308` at `180/180`",
  "Remaining TWII index sub-scope: `0/60`",
  "Remaining ETF sub-scope: `0050` and `006208` at `2/120`, with `118` missing",
  "publicDataSource=mock",
  "scoreSource=mock",
  "Produce `docs/A1_NEXT_DATA_COVERAGE_HANDOFF.md`",
  "`docs/A1_NEXT_DATA_COVERAGE_HANDOFF.md` is `accepted` for PM mainline review",
  "`docs/ETF_SOURCE_RIGHTS_AND_CANDIDATE_READINESS_PACKET.md` is `accepted` for PM mainline review",
  "Produce `docs/ETF_SOURCE_RIGHTS_AND_CANDIDATE_READINESS_PACKET.md`",
  "No deeper ETF data action is active until PM opens a separate source-rights outcome or execution gate",
  "PM accepts ETF as the current data-coverage route",
  "Produce `docs/A2_PUBLIC_TRUST_LAUNCH_COPY_HANDOFF.md`",
  "`docs/A2_PUBLIC_TRUST_LAUNCH_COPY_HANDOFF.md` is `accepted` for PM mainline review",
  "A2 copy-only launch-blocking wording pass is `accepted` for PM mainline review",
  "Run a copy-only launch-blocking wording pass",
  "Update public boundary copy and trust/runtime notice wording",
  "public trust readability",
  "PM Integration Loop",
  "accepted",
  "rejected",
  "needs_bounded_repair",
  "blocked",
  "Launch Gate Map",
  "MVP row coverage",
  "Ingestion / backfill",
  "Runtime promotion",
  "Investment indicators",
  "Public trust / legal copy",
  "Deployment readiness",
  "This board does not authorize"
];

for (const phrase of requiredDocPhrases) {
  if (!doc.includes(phrase)) {
    problems.push(`${docPath} missing phrase: ${phrase}`);
  }
}

const requiredStatusPhrases = [
  "Latest launch engineering workstream board slice",
  "launch_engineering_workstream_board_ready",
  "A1_NEXT_DATA_COVERAGE_HANDOFF.md",
  "A2_PUBLIC_TRUST_LAUNCH_COPY_HANDOFF.md"
];

for (const phrase of requiredStatusPhrases) {
  if (!status.includes(phrase)) {
    problems.push(`${statusPath} missing phrase: ${phrase}`);
  }
}

const requiredRolePhrases = [
  "PM may run mainline, A1, and A2 in parallel",
  "PM remains the only integration owner",
  "A1: Data / Supabase / Market Evidence",
  "A2: Frontend / UX Readability / Public Copy QA"
];

for (const phrase of requiredRolePhrases) {
  if (!roles.includes(phrase)) {
    problems.push(`${rolePath} missing phrase: ${phrase}`);
  }
}

const forbiddenPatterns = [
  /�/u,
  /[\uE000-\uF8FF]/u,
  /嚙/u,
  /摰/u,
  /銝/u,
  /SQL execution is approved/u,
  /Supabase writes are approved/u,
  /publicDataSource=supabase is approved/u,
  /scoreSource=real is approved/u,
  /launch complete/u
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
      guardedStatus: "launch_engineering_workstream_board_ready"
    },
    null,
    2
  )
);

function read(path) {
  return fs.readFileSync(path, "utf8");
}
