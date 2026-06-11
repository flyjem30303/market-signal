import fs from "node:fs";

const problems = [];

const paths = {
  gate: "docs/TWII_COVERAGE_REPAIR_GATE.md",
  a1: "docs/A1_TWII_COVERAGE_REPAIR_GATE_PREREQ_CHECKLIST.md",
  a2: "docs/A2_TWII_COVERAGE_REPAIR_GATE_PUBLIC_COPY_GUARD.md",
  routeDecision: "docs/BATCH1_DATA_COVERAGE_ROUTE_DECISION_2026-06-12.md",
  status: "PROJECT_STATUS.md",
  packageJson: "package.json",
  reviewGate: "scripts/check-review-gates.mjs",
  localhostFullHealth: "scripts/check-localhost-full-health.mjs"
};

const files = Object.fromEntries(Object.entries(paths).map(([key, path]) => [key, read(path)]));
const pkg = JSON.parse(files.packageJson);

requirePhrases(paths.gate, files.gate, [
  "TWII Coverage Repair Gate",
  "twii_coverage_repair_gate_ready_design_only_not_executable",
  "prepare_twii_coverage_repair_gate",
  "docs/BATCH1_DATA_COVERAGE_ROUTE_DECISION_2026-06-12.md",
  "targetSymbol=TWII",
  "targetRelation=daily_prices",
  "targetScope=twii_index_daily_prices_missing_rows",
  "currentObservedRows=0",
  "currentExpectedRows=60",
  "expectedMissingRows=60",
  "batchObservedRows=182",
  "batchExpectedRows=360",
  "batchMissingRows=178",
  "publicDataSource=mock",
  "scoreSource=mock",
  "executionAllowedNow=false",
  "sqlExecuted=false",
  "supabaseWriteAllowedNow=false",
  "dailyPricesMutationAllowedNow=false",
  "sourceRightsPrerequisiteRequired=true",
  "fieldContractPrerequisiteRequired=true",
  "sanitizedCandidateArtifactRequired=true",
  "targetTableBoundaryRequired=true",
  "rollbackRetentionRequired=true",
  "postRunReviewRequired=true",
  "exactFutureAuthorizationRequired=true",
  "oneAttemptMaximumRequired=true",
  "prepare_twii_one_shot_authorization_packet_without_execution"
]);

requirePhrases(paths.a1, files.a1, [
  "a1_twii_coverage_repair_gate_prereq_checklist_prepared_local_only",
  "Route priority | `TWII first`",
  "Target table | `daily_prices`",
  "Batch 1 missing TWII rows | `60`",
  "publicDataSource=mock",
  "scoreSource=mock",
  "Source-rights",
  "Field contract",
  "Sanitized candidate artifact",
  "Rollback / disable"
]);

requirePhrases(paths.a2, files.a2, [
  "a2_twii_coverage_repair_gate_public_copy_guard_ready",
  "Public Beta remains in mock mode while TWII coverage repair is prepared",
  "Mock mode: TWII coverage repair pending",
  "Live data and real scoring are not enabled",
  "目前公開 Beta 仍是模擬資料模式",
  "not investment advice",
  "publicDataSource=mock",
  "scoreSource=mock"
]);

requirePhrases(paths.routeDecision, files.routeDecision, [
  "batch1_data_coverage_route_selected_twii_first_design_only",
  "`TWII`-first",
  "TWII",
  "0/60",
  "60"
]);

requirePhrases(paths.status, files.status, [
  "Latest TWII coverage repair gate slice",
  "twii_coverage_repair_gate_ready_design_only_not_executable",
  "docs/TWII_COVERAGE_REPAIR_GATE.md",
  "docs/A1_TWII_COVERAGE_REPAIR_GATE_PREREQ_CHECKLIST.md",
  "docs/A2_TWII_COVERAGE_REPAIR_GATE_PUBLIC_COPY_GUARD.md"
]);

if (pkg.scripts?.["check:twii-coverage-repair-gate"] !== "node scripts/check-twii-coverage-repair-gate.mjs") {
  problems.push(`${paths.packageJson} missing check:twii-coverage-repair-gate script`);
}

requirePhrases(paths.reviewGate, files.reviewGate, [
  "scripts/check-twii-coverage-repair-gate.mjs",
  "twii-coverage-repair-gate"
]);

requirePhrases(paths.localhostFullHealth, files.localhostFullHealth, [
  "scripts/check-twii-coverage-repair-gate.mjs",
  "twii-coverage-repair-gate"
]);

for (const [label, text] of Object.entries(files)) {
  if (label === "packageJson" || label === "reviewGate" || label === "localhostFullHealth" || label === "status") {
    continue;
  }
  for (const pattern of forbiddenPatterns()) {
    if (pattern.test(text)) problems.push(`${paths[label]} contains forbidden pattern ${String(pattern)}`);
  }
}

if (files.a2.includes("?桀") || files.a2.includes("�")) {
  problems.push(`${paths.a2} contains mojibake in public copy guard`);
}

if (problems.length > 0) {
  console.error(JSON.stringify({ status: "blocked", problems }, null, 2));
  process.exit(1);
}

console.log(
  JSON.stringify(
    {
      status: "ok",
      gateStatus: "twii_coverage_repair_gate_ready_design_only_not_executable",
      targetSymbol: "TWII",
      targetRelation: "daily_prices",
      expectedMissingRows: 60,
      executionAllowedNow: false,
      publicDataSource: "mock",
      scoreSource: "mock"
    },
    null,
    2
  )
);

function read(path) {
  if (!fs.existsSync(path)) {
    problems.push(`${path} missing`);
    return "";
  }
  return fs.readFileSync(path, "utf8");
}

function requirePhrases(path, text, phrases) {
  for (const phrase of phrases) {
    if (!text.includes(phrase)) problems.push(`${path} missing: ${phrase}`);
  }
}

function forbiddenPatterns() {
  return [
    /executionAllowedNow=true/,
    /sqlExecuted=true/,
    /supabaseWriteAllowedNow=true/,
    /dailyPricesMutationAllowedNow=true/,
    /RUN_REMOTE_NOW/,
    /EXECUTION_COMPLETED/,
    /sb_secret_/,
    /sb_publishable_/,
    /SUPABASE_SERVICE_ROLE/i,
    /NEXT_PUBLIC_SUPABASE_URL/i,
    /NEXT_PUBLIC_SUPABASE_ANON_KEY/i,
    /raw payload:/i,
    /row payload:/i,
    /stock_id payload:/i
  ];
}
