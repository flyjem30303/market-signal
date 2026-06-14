import fs from "node:fs";

const problems = [];

const docPath = "docs/PHASE_1_LEVEL_1_CLOSURE_EXECUTION_PACKET.md";
const statusPath = "PROJECT_STATUS.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";

const doc = read(docPath);
const status = read(statusPath);
const pkg = JSON.parse(read(packagePath));
const reviewGate = read(reviewGatePath);

const requiredDocPhrases = [
  "Status: `phase_1_level_1_closure_execution_packet_ready_no_raw_payloads`",
  "prepare_twii_etf_level_1_closure_execution_packet_without_raw_payloads",
  "expected rows: `360`",
  "observed rows: `182`",
  "missing rows: `178`",
  "TW equity sub-scope: `2330`, `2382`, `2308` at `180/180`",
  "remaining TWII lane: `TWII` at `0/60`",
  "remaining ETF lane: `0050` and `006208` at `2/120`",
  "publicDataSource=mock",
  "scoreSource=mock",
  "Packet A - TWII",
  "Packet B - ETF 0050",
  "Packet C - ETF 006208",
  "phase1-level1-twii-closure-prep",
  "phase1-level1-0050-closure-prep",
  "phase1-level1-006208-closure-prep",
  "TWII should remain the first execution candidate",
  "source-rights outcome",
  "field contract",
  "candidate artifact",
  "post-run review template",
  "aggregate readback contract",
  "rollback/cleanup rule",
  "row coverage scoring gate update",
  "one exact command string",
  "authorization id",
  "confirmation token",
  "missing-only behavior",
  "skip-existing behavior",
  "duplicate rejection",
  "Any command drift",
  "Public pages must not say:",
  "real-time data is live",
  "all Level 1 coverage is complete",
  "public source has been promoted",
  "scoring is real",
  "## PM / A1 / A2 / A3 Assignments",
  "## Hard Stops",
  "does not authorize:",
  "SQL execution",
  "Supabase connection",
  "Supabase write",
  "`daily_prices` mutation",
  "market endpoint fetch",
  "raw market-data ingest, storage, or commit",
  "source-derived ETF candidate generation",
  "public source promotion",
  "`publicDataSource=supabase`",
  "`scoreSource=real`",
  "Next route: `twii_first_level_1_closure_exact_execution_gate_or_repair`",
  "twii_source_rights_field_contract_repair_before_execution",
  "etf_source_rights_field_contract_parallel_repair"
];

for (const phrase of requiredDocPhrases) {
  if (!doc.includes(phrase)) problems.push(`${docPath} missing: ${phrase}`);
}

const requiredStatusPhrases = [
  "phase_1_level_1_closure_execution_packet_ready_no_raw_payloads",
  "Phase 1 Level 1 Closure Execution Packet",
  "twii_first_level_1_closure_exact_execution_gate_or_repair"
];

for (const phrase of requiredStatusPhrases) {
  if (!status.includes(phrase)) problems.push(`${statusPath} missing: ${phrase}`);
}

if (
  pkg.scripts?.["check:phase-1-level-1-closure-execution-packet"] !==
  "node scripts/check-phase-1-level-1-closure-execution-packet.mjs"
) {
  problems.push(`${packagePath} missing check:phase-1-level-1-closure-execution-packet script`);
}

for (const phrase of [
  "scripts/check-phase-1-level-1-closure-execution-packet.mjs",
  "phase-1-level-1-closure-execution-packet"
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
  /SQL execution is approved/u,
  /Supabase write is approved/u,
  /market endpoint fetch is approved/u,
  /daily_prices mutation is approved/u,
  /investment advice approved/u,
  /guaranteed return approved/u
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
      guardedStatus: "phase_1_level_1_closure_execution_packet_ready_no_raw_payloads",
      nextRoute: "twii_first_level_1_closure_exact_execution_gate_or_repair",
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
