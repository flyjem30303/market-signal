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
  "CEO keeps the active GOAL pointed at public Beta readiness plus the first usable data-realification closed loop",
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
  "`docs/A1_ETF_SOURCE_RIGHTS_OUTCOME_DECISION_SUPPORT.md` is `accepted` for PM mainline review",
  "`docs/A1_TWII_SOURCE_RIGHTS_AND_CANDIDATE_READINESS_PACKET.md` is `accepted` for PM mainline review",
  "`docs/A1_TWII_INDEX_FIELD_CONTRACT_DECISION_SUPPORT.md` is `accepted` for PM mainline review",
  "`docs/A1_MVP_COVERAGE_CLOSURE_ROUTE_SUPPORT.md` is `accepted` for PM mainline review",
  "Produce `docs/ETF_SOURCE_RIGHTS_AND_CANDIDATE_READINESS_PACKET.md`",
  "`docs/ETF_SOURCE_RIGHTS_OUTCOME_DECISION_GATE.md` is `blocked` as a PM mainline execution gate",
  "`docs/TWII_SOURCE_RIGHTS_OUTCOME_GATE.md` is `blocked` as a PM mainline data gate",
  "ETF source-rights outcome decision is open and currently blocked at `rejected_for_execution_pending_external_rights`",
  "TWII source-rights and candidate readiness is accepted as the next alternative data branch",
  "TWII remains `not_approved_for_probe_or_ingestion`",
  "PM accepts A1's TWII field-contract decision support as local-only planning evidence",
  "PM accepts A1's MVP coverage closure route support as the current coverage-route map from `182/360` to `360/360`",
  "PM should reassign A1 next to a TWII sanitized candidate artifact readiness gate only after source rights and field contract are accepted",
  "PM accepts ETF as the current data-coverage route",
  "Produce `docs/A1_MVP_COVERAGE_CLOSURE_ROUTE_SUPPORT.md`",
  "source-rights evidence intake checklist",
  "`docs/FORMAL_LAUNCH_DEPLOYMENT_READINESS_GATE.md` is `accepted` as PM mainline deployment preflight",
  "`docs/PUBLIC_BETA_READINESS_GATE.md` is `accepted` as PM mainline Beta preflight",
  "formal_launch_deployment_readiness_gate_ready_not_deployed",
  "public_beta_readiness_gate_ready_local_beta_allowed_real_promotion_blocked",
  "ready_for_local_public_beta_preflight_not_production_deployed",
  "TW equity has a verified first `daily_prices` closed loop",
  "launch deployment preconditions can progress without source promotion",
  "Produce `docs/A2_PUBLIC_TRUST_LAUNCH_COPY_HANDOFF.md`",
  "`docs/A2_PUBLIC_TRUST_LAUNCH_COPY_HANDOFF.md` is `accepted` for PM mainline review",
  "`docs/A2_ROUTE_LEVEL_LAUNCH_COPY_PLACEMENT_CRITERIA.md` is `accepted` for PM mainline review",
  "`docs/A2_ROUTE_LEVEL_LAUNCH_COPY_AUDIT.md` is `accepted` for PM mainline review",
  "A2 copy-only launch-blocking wording pass is `accepted` for PM mainline review",
  "`docs/A2 briefing copy-only patch` is `accepted` for PM mainline review",
  "`docs/A2_PUBLIC_BETA_TRUST_COPY_READINESS.md` is `accepted` for PM mainline review",
  "Run a copy-only launch-blocking wording pass",
  "Update public boundary copy and trust/runtime notice wording",
  "public trust readability",
  "Produce `docs/A2_PUBLIC_BETA_TRUST_COPY_READINESS.md`",
  "shared trust surfaces, footer/legal, home/stocks, briefing, weekly, and empty/error state copy before visual polish",
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
  "A1_MVP_COVERAGE_CLOSURE_ROUTE_SUPPORT.md",
  "A2_PUBLIC_TRUST_LAUNCH_COPY_HANDOFF.md",
  "A2_PUBLIC_BETA_TRUST_COPY_READINESS.md"
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
