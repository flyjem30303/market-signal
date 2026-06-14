import fs from "node:fs";

const problems = [];

const docPath = "docs/PHASE_1_DATA_ONLINE_GAP_CLOSURE_MAP.md";
const statusPath = "PROJECT_STATUS.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";

const doc = read(docPath);
const status = read(statusPath);
const pkg = JSON.parse(read(packagePath));
const reviewGate = read(reviewGatePath);

const requiredDocPhrases = [
  "Status: `phase_1_data_online_gap_closure_map_ready`",
  "finish Level 1 MVP row coverage from `182/360` to `360/360`",
  "`TWII`, `0050`, and `006208`",
  "publicDataSource=mock",
  "scoreSource=mock",
  "expected rows: `360`",
  "observed rows: `182`",
  "missing rows: `178`",
  "accepted TW equity sub-scope: `2330`, `2382`, `2308` at `180/180`",
  "remaining index lane: `TWII` at `0/60`",
  "remaining ETF lane: `0050` and `006208` at `2/120`",
  "docs/DATA_REALIFICATION_FIRST_CLOSED_LOOP_ROLLUP.md",
  "docs/RUNTIME_DATA_PROMOTION_HANDOFF_CHECKLIST.md",
  "docs/COVERAGE_UNIVERSE_ROADMAP.md",
  "docs/DATA_POPULATION_ROUTE_DECISION_2026-06-06.md",
  "docs/TW_EQUITY_ROW_COVERAGE_SCORING_GATE.md",
  "Do not expand to all TWSE listed stocks before Level 1 closes",
  "source rights, field contract, candidate, bounded write/readback/post-run review, scoring",
  "separate approval for `publicDataSource=supabase`",
  "separate approval for `scoreSource=real`",
  "PM mainline:",
  "A1:",
  "A2:",
  "A3:",
  "## Hard Stops",
  "does not authorize:",
  "SQL execution",
  "Supabase write",
  "`daily_prices` mutation",
  "raw market-data fetch, ingest, storage, or commit",
  "Next route: `phase_1_data_online_level_1_closure_then_runtime_promotion_gate`",
  "prepare_twii_etf_level_1_closure_execution_packet_without_raw_payloads",
  "implement_public_runtime_data_online_readiness_summary_fail_closed"
];

for (const phrase of requiredDocPhrases) {
  if (!doc.includes(phrase)) problems.push(`${docPath} missing: ${phrase}`);
}

const requiredStatusPhrases = [
  "phase_1_data_online_gap_closure_map_ready",
  "Phase 1 Data Online Gap Closure Map",
  "phase_1_data_online_level_1_closure_then_runtime_promotion_gate"
];

for (const phrase of requiredStatusPhrases) {
  if (!status.includes(phrase)) problems.push(`${statusPath} missing: ${phrase}`);
}

if (
  pkg.scripts?.["check:phase-1-data-online-gap-closure-map"] !==
  "node scripts/check-phase-1-data-online-gap-closure-map.mjs"
) {
  problems.push(`${packagePath} missing check:phase-1-data-online-gap-closure-map script`);
}

for (const phrase of [
  "scripts/check-phase-1-data-online-gap-closure-map.mjs",
  "phase-1-data-online-gap-closure-map"
]) {
  if (!reviewGate.includes(phrase)) problems.push(`${reviewGatePath} missing: ${phrase}`);
}

const forbiddenPatterns = [
  /NEXT_PUBLIC_SUPABASE_URL\s*=\s*https?:/u,
  /NEXT_PUBLIC_SUPABASE_ANON_KEY\s*=/u,
  /SUPABASE_SERVICE_ROLE_KEY\s*=/u,
  /\bsb_(publishable|secret|anon|service_role)_[a-z0-9_-]+/iu,
  /publicDataSource=supabase is approved/u,
  /scoreSource=real is approved/u,
  /full MVP coverage complete/u,
  /SQL execution is approved/u,
  /Supabase write is approved/u,
  /investment advice approved/u
];

for (const pattern of forbiddenPatterns) {
  if (pattern.test(doc)) problems.push(`${docPath} contains forbidden pattern: ${pattern}`);
}

if (problems.length > 0) {
  console.error(JSON.stringify({ status: "blocked", problems }, null, 2));
  process.exit(1);
}

console.log(
  JSON.stringify(
    {
      status: "ok",
      guardedStatus: "phase_1_data_online_gap_closure_map_ready",
      nextRoute: "phase_1_data_online_level_1_closure_then_runtime_promotion_gate",
      docPath
    },
    null,
    2
  )
);

function read(filePath) {
  if (!fs.existsSync(filePath)) {
    problems.push(`missing file: ${filePath}`);
    return "";
  }
  return fs.readFileSync(filePath, "utf8");
}
