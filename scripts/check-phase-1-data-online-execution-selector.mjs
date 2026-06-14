import { spawnSync } from "node:child_process";
import fs from "node:fs";

const docPath = "docs/PHASE_1_DATA_ONLINE_EXECUTION_SELECTOR.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";

const requiredDocs = [
  "docs/PHASE_1_DATA_ONLINE_GAP_CLOSURE_MAP.md",
  "docs/PHASE_1_LEVEL_1_CLOSURE_EXECUTION_PACKET.md",
  "docs/PHASE_1_DATA_ONLINE_GO_NO_GO_STATUS.md",
  "docs/OPEN_FREE_AUTO_DATA_SOURCE_GATE.md",
  "docs/PHASE_1_TWII_OPERATOR_DECISION_PACKET_REQUEST.md",
  "docs/PHASE_1_ETF_COVERAGE_CLOSURE_READINESS_ROLLUP.md"
];

const problems = [];
const doc = read(docPath);
const pkg = JSON.parse(read(packagePath));
const reviewGate = read(reviewGatePath);
const publicBetaReport = runJson("scripts/report-public-beta-data-realification-next-action.mjs");
const twiiOperatorReport = runJson("scripts/report-twii-final-operator-authorization-packet-preflight.mjs");

const requiredPhrases = [
  "Status: `phase_1_data_online_execution_selector_ready_no_execution`",
  "Selected next route: `twii_first_level_1_closure_exact_execution_gate_or_repair`",
  "Level 1 expected rows: `360`",
  "Level 1 observed rows: `182`",
  "Level 1 missing rows: `178`",
  "accepted TW equity rows: `180/180`",
  "remaining TWII rows: `0/60`",
  "remaining ETF rows: `2/120`",
  "data-online decision: `NO_GO_FOR_DATA_ONLINE`",
  "Route 1 - TWII Exact Execution Gate Or Repair",
  "Current posture: `selected_but_execution_blocked`",
  "Route 2 - ETF Source-Rights And Field-Contract Parallel Repair",
  "Current posture: `parallel_pre_execution_only`",
  "Route 3 - TWSE OpenAPI Metadata / Terms / Backfill Readiness",
  "Current posture: `safe_no_fetch_parallel_support`",
  "Route 4 - Runtime Promotion Gate Preparation",
  "Current posture: `blocked_until_write_readback_quality_rollback_pass`",
  "PM should apply this selector at the start of every data-online slice",
  "publicDataSource=mock",
  "scoreSource=mock",
  "does not authorize SQL, Supabase write, staging rows, `daily_prices` mutation"
];

for (const phrase of requiredPhrases) {
  if (!doc.includes(phrase)) problems.push(`${docPath} missing: ${phrase}`);
}

for (const requiredDoc of requiredDocs) {
  if (!doc.includes(requiredDoc)) problems.push(`${docPath} missing authoritative reference: ${requiredDoc}`);
  if (!fs.existsSync(requiredDoc)) problems.push(`missing required source doc: ${requiredDoc}`);
}

if (
  pkg.scripts?.["check:phase-1-data-online-execution-selector"] !==
  "node scripts/check-phase-1-data-online-execution-selector.mjs"
) {
  problems.push(`${packagePath} missing check:phase-1-data-online-execution-selector script`);
}

for (const phrase of [
  "scripts/check-phase-1-data-online-execution-selector.mjs",
  "phase-1-data-online-execution-selector"
]) {
  if (!reviewGate.includes(phrase)) problems.push(`${reviewGatePath} missing: ${phrase}`);
}

const expectedCoverage = {
  fullLevel1ExpectedRows: 360,
  fullLevel1ObservedRows: 182,
  fullLevel1MissingRows: 178,
  twEquityObservedRows: 180,
  twEquityExpectedRows: 180,
  twiiMissingRows: 60,
  etfMissingRows: 118
};

for (const [key, value] of Object.entries(expectedCoverage)) {
  if (publicBetaReport.coverage?.[key] !== value) {
    problems.push(`public beta coverage ${key} must be ${value}`);
  }
}

if (publicBetaReport.sourceBoundary?.publicDataSource !== "mock") {
  problems.push("publicDataSource must remain mock");
}

if (publicBetaReport.sourceBoundary?.scoreSource !== "mock") {
  problems.push("scoreSource must remain mock");
}

if (twiiOperatorReport.operatorAuthorizationPacketState?.authorizationDecisionAcceptedNow !== false) {
  problems.push("TWII authorizationDecisionAcceptedNow must remain false");
}

if (twiiOperatorReport.operatorAuthorizationPacketState?.executionAllowedNow !== false) {
  problems.push("TWII executionAllowedNow must remain false");
}

for (const [key, value] of Object.entries(publicBetaReport.hardStops ?? {})) {
  if (value !== false) problems.push(`hardStops.${key} must be false`);
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
  /daily_prices mutation is approved/u,
  /raw market-data fetch is approved/u,
  /investment advice approved/u,
  /guaranteed return approved/u
];

for (const pattern of forbiddenPatterns) {
  if (pattern.test(doc)) problems.push(`${docPath} contains forbidden pattern: ${pattern}`);
}

const status = problems.length === 0 ? "ok" : "blocked";

console.log(
  JSON.stringify(
    {
      status,
      guardedStatus: "phase_1_data_online_execution_selector_ready_no_execution",
      selectedNextRoute: "twii_first_level_1_closure_exact_execution_gate_or_repair",
      fallbackRoutes: [
        "etf_source_rights_field_contract_parallel_repair",
        "twse_openapi_metadata_terms_backfill_readiness_refresh",
        "runtime_promotion_gate_prepare_but_keep_mock"
      ],
      coverage: expectedCoverage,
      publicDataSource: publicBetaReport.sourceBoundary?.publicDataSource,
      scoreSource: publicBetaReport.sourceBoundary?.scoreSource,
      twiiExecutionAllowedNow: twiiOperatorReport.operatorAuthorizationPacketState?.executionAllowedNow,
      problems
    },
    null,
    2
  )
);

if (status !== "ok") process.exitCode = 1;

function read(filePath) {
  if (!fs.existsSync(filePath)) {
    problems.push(`missing file: ${filePath}`);
    return "{}";
  }
  return fs.readFileSync(filePath, "utf8");
}

function runJson(scriptPath) {
  const run = spawnSync(process.execPath, [scriptPath], {
    encoding: "utf8",
    maxBuffer: 1024 * 1024 * 4
  });
  if (run.status !== 0) problems.push(`${scriptPath} exited ${run.status}`);
  try {
    return JSON.parse(run.stdout);
  } catch {
    problems.push(`${scriptPath} did not emit JSON`);
    return {};
  }
}
