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
  "pre_launch_executable_state",
  "formal launch-engineering program",
  "PM owns the mainline, integration, runtime, launch engineering, and acceptance decisions",
  "A1 owns the data / Supabase / market evidence support lane",
  "A2 owns the public trust / UX readability / disclosure support lane",
  "PM must assign new A1/A2 tasks whenever their current background tasks finish",
  "Push the project to a public Beta pre-launch executable state.",
  "CEO chooses only the highest-value blocker-removal slice.",
  "PM immediately executes local-only slices that do not trigger permission prompts.",
  "PM uses one-command runners when they already wrap the required local safety checks.",
  "Governance, role review, and UI micro-polish are deferred unless they directly remove a blocker.",
  "Full review gate is reserved for milestone integration, promotion, or deployment packet work.",
  "If safe blocker-removal work remains, continue instead of stopping only to report.",
  "Delivery-First GOAL Trim",
  "CEO Velocity Rewrite",
  "Move the project toward public Beta executable readiness with the shortest safe path.",
  "Primary completion chain",
  "Platform: collect and shape-validate BETA_HOSTING_PROJECT_NAME and BETA_TEMPORARY_URL",
  "Packet: run the no-secret packet-window proof chain to PM-reviewed artifact readiness.",
  "Data: move A1 TWII no-secret source-rights evidence to PM-classifiable state",
  "Runtime: keep /, /briefing, and stock routes healthy, readable, and explicitly mock-only.",
  "Prefer one coherent blocker-removal slice over many micro-governance slices.",
  "Run only the smallest checker set that proves the slice.",
  "CEO ruling: this rewrite supersedes the longer GOAL wording for day-to-day execution.",
  "Historical Operational GOAL v2 - Superseded",
  "This section is retained only as history.",
  "Operational GOAL v3 - Execution First",
  "Push the project to public Beta pre-launch executable readiness by closing only the active external blocker chain.",
  "Do the largest safe local slice that directly advances platform values, packet proof, A1 evidence classification, or runtime route health.",
  "Do not create new governance packets, role-review loops, visual polish slices, or broad audits unless they unblock the current chain.",
  "keep reviewed-artifact recording dry-run unless PM explicitly applies an accepted outcome",
  "Run focused checks only.",
  "Operational GOAL v3 below supersedes v2 for routine execution.",
  "Current hard blockers",
  "Missing `BETA_HOSTING_PROJECT_NAME`",
  "Missing `BETA_TEMPORARY_URL`",
  "Missing A1 TWII four-slot no-secret source-rights evidence",
  "Supabase write/readback/post-run review/rollback",
  "Coverage Universe Roadmap",
  "publicDataSource=supabase",
  "scoreSource=real",
  "Execution Ratio",
  "PM mainline",
  "A1",
  "A2",
  "Current PM next route: `external_input_response_readiness_then_platform_two_value_one_runner_or_a1_evidence_classification`",
  "Dynamic Reassignment Rule",
  "accepted",
  "rejected",
  "needs_bounded_repair",
  "blocked",
  "Current Level 1 MVP row coverage is `182/360`",
  "TW equity first closed loop is accepted at `180/180`",
  "TWII remains `0/60`",
  "ETF remains `2/120`, with `118` missing rows",
  "Public runtime boundary remains `publicDataSource=mock`",
  "Score boundary remains `scoreSource=mock`",
  "full review gate is reserved for milestone integration"
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
  "Latest Operational GOAL v3 execution-first rewrite slice",
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
  /\?\?/u,
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
      guardedStatus: "goal_launch_engineering_parallel_workstreams_ready",
      currentHardBlockers: [
        "BETA_HOSTING_PROJECT_NAME",
        "BETA_TEMPORARY_URL",
        "A1_TWII_FOUR_SLOT_NO_SECRET_SOURCE_RIGHTS_EVIDENCE"
      ],
      verificationPolicy: "focused_checks_first_full_review_gate_only_for_milestones"
    },
    null,
    2
  )
);

function read(path) {
  return fs.readFileSync(path, "utf8");
}
