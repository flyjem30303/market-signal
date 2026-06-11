import fs from "node:fs";
import { spawnSync } from "node:child_process";

const problems = [];

const paths = {
  alignment: "docs/TWII_ONE_SHOT_AUTHORIZATION_PACKET_ALIGNMENT.md",
  coverageGate: "docs/TWII_COVERAGE_REPAIR_GATE.md",
  futureDoc: "docs/TWII_FUTURE_ONE_TIME_AUTHORIZATION_PACKET.md",
  futurePacket: "data/source-gates/twii-future-one-time-authorization-packet.json",
  futureCheck: "scripts/check-twii-future-one-time-authorization-packet.mjs",
  a1: "docs/A1_TWII_ONE_SHOT_AUTH_PACKET_DATA_INPUTS.md",
  a2: "docs/A2_TWII_ONE_SHOT_AUTH_PACKET_PUBLIC_COPY_GUARD.md",
  status: "PROJECT_STATUS.md",
  packageJson: "package.json",
  reviewGate: "scripts/check-review-gates.mjs",
  localhostFullHealth: "scripts/check-localhost-full-health.mjs"
};

const files = Object.fromEntries(Object.entries(paths).map(([key, path]) => [key, read(path)]));
const pkg = JSON.parse(files.packageJson);
const futurePacket = JSON.parse(files.futurePacket);

const futureCheckRun = spawnSync(process.execPath, [paths.futureCheck], {
  cwd: process.cwd(),
  encoding: "utf8",
  shell: false,
  timeout: 120000,
  windowsHide: true
});

if (futureCheckRun.status !== 0) {
  problems.push("existing future one-time authorization packet check must pass");
}

requirePhrases(paths.alignment, files.alignment, [
  "TWII One-Shot Authorization Packet Alignment",
  "twii_one_shot_authorization_packet_alignment_ready_no_execution",
  "prepare_twii_one_shot_authorization_packet_without_execution",
  "docs/TWII_COVERAGE_REPAIR_GATE.md",
  "docs/TWII_FUTURE_ONE_TIME_AUTHORIZATION_PACKET.md",
  "data/source-gates/twii-future-one-time-authorization-packet.json",
  "docs/A1_TWII_ONE_SHOT_AUTH_PACKET_DATA_INPUTS.md",
  "docs/A2_TWII_ONE_SHOT_AUTH_PACKET_PUBLIC_COPY_GUARD.md",
  "targetSymbol=TWII",
  "targetRelation=daily_prices",
  "targetScope=twii_index_daily_prices_missing_rows",
  "maxRows=60",
  "writeMode=bounded_insert_missing_only",
  "duplicatePolicy=reject_duplicates",
  "currentObservedRows=0",
  "currentExpectedRows=60",
  "expectedMissingRows=60",
  "publicDataSource=mock",
  "scoreSource=mock",
  "executionAllowedNow=false",
  "writeGateExecutableNow=false",
  "implementationAllowedNow=false",
  "sqlExecuted=false",
  "supabaseConnectionAttempted=false",
  "supabaseWriteAllowedNow=false",
  "stagingRowsCreated=false",
  "dailyPricesMutationAllowedNow=false",
  "marketDataFetched=false",
  "marketDataIngested=false",
  "candidateRowsAccepted=false",
  "rowCoverageScoringAllowed=false",
  "prepare_pm_review_decision_for_twii_future_one_time_authorization_packet_without_execution"
]);

requirePhrases(paths.coverageGate, files.coverageGate, [
  "twii_coverage_repair_gate_ready_design_only_not_executable",
  "prepare_twii_one_shot_authorization_packet_without_execution",
  "targetSymbol=TWII",
  "targetRelation=daily_prices",
  "expectedMissingRows=60"
]);

requirePhrases(paths.futureDoc, files.futureDoc, [
  "twii_future_one_time_authorization_packet_ready_no_execution",
  "authorization_packet_ready_execution_still_blocked",
  "targetTable=daily_prices",
  "targetLane=TWII",
  "targetScope=twii_index_daily_prices_missing_rows",
  "maxRows=60",
  "writeMode=bounded_insert_missing_only",
  "duplicatePolicy=reject_duplicates",
  "executionAllowedNow=false"
]);

requirePhrases(paths.a1, files.a1, [
  "a1_twii_one_shot_auth_packet_data_inputs_ready_local_only",
  "TWII",
  "daily_prices",
  "twii_index_daily_prices_missing_rows",
  "maxRows=60",
  "bounded_insert_missing_only",
  "reject_duplicates",
  "source-rights",
  "field-contract",
  "sanitized candidate artifact",
  "rollback",
  "readback",
  "post-run review"
]);

requirePhrases(paths.a2, files.a2, [
  "a2_twii_one_shot_auth_packet_public_copy_guard_ready",
  "mock",
  "not investment advice",
  "one-shot authorization packet",
  "not enabled",
  "not written",
  "TWII"
]);

requirePhrases(paths.status, files.status, [
  "Latest TWII one-shot authorization packet alignment slice",
  "twii_one_shot_authorization_packet_alignment_ready_no_execution",
  "docs/TWII_ONE_SHOT_AUTHORIZATION_PACKET_ALIGNMENT.md",
  "docs/A1_TWII_ONE_SHOT_AUTH_PACKET_DATA_INPUTS.md",
  "docs/A2_TWII_ONE_SHOT_AUTH_PACKET_PUBLIC_COPY_GUARD.md"
]);

if (pkg.scripts?.["check:twii-one-shot-authorization-packet-alignment"] !== "node scripts/check-twii-one-shot-authorization-packet-alignment.mjs") {
  problems.push(`${paths.packageJson} missing check:twii-one-shot-authorization-packet-alignment script`);
}

requirePhrases(paths.reviewGate, files.reviewGate, [
  "scripts/check-twii-one-shot-authorization-packet-alignment.mjs",
  "twii-one-shot-authorization-packet-alignment"
]);

requirePhrases(paths.localhostFullHealth, files.localhostFullHealth, [
  "scripts/check-twii-one-shot-authorization-packet-alignment.mjs",
  "twii-one-shot-authorization-packet-alignment"
]);

assertFuturePacket();

for (const [label, text] of Object.entries(files)) {
  if (label === "packageJson" || label === "reviewGate" || label === "localhostFullHealth" || label === "status") {
    continue;
  }
  for (const pattern of forbiddenPatterns()) {
    if (pattern.test(text)) problems.push(`${paths[label]} contains forbidden pattern ${String(pattern)}`);
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
      alignmentStatus: "twii_one_shot_authorization_packet_alignment_ready_no_execution",
      canonicalPacket: paths.futurePacket,
      targetSymbol: "TWII",
      targetRelation: "daily_prices",
      maxRows: 60,
      executionAllowedNow: false,
      publicDataSource: "mock",
      scoreSource: "mock"
    },
    null,
    2
  )
);

function assertFuturePacket() {
  const expected = {
    authorizationPacketKind: "twii_future_one_time_authorization_packet",
    targetTable: "daily_prices",
    targetLane: "TWII",
    targetScope: "twii_index_daily_prices_missing_rows",
    maxRows: 60,
    writeMode: "bounded_insert_missing_only",
    duplicatePolicy: "reject_duplicates",
    authorizationReadyForPmReview: true,
    executionAllowedNow: false,
    writeGateExecutableNow: false,
    implementationAllowedNow: false
  };
  for (const [key, value] of Object.entries(expected)) {
    if (futurePacket[key] !== value) problems.push(`futurePacket.${key} must be ${JSON.stringify(value)}`);
  }
  if (futurePacket.safety?.publicDataSource !== "mock") problems.push("futurePacket publicDataSource must be mock");
  if (futurePacket.safety?.scoreSource !== "mock") problems.push("futurePacket scoreSource must be mock");
}

function read(path) {
  if (!fs.existsSync(path)) {
    problems.push(`${path} missing`);
    return path.endsWith(".json") ? "{}" : "";
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
    /writeGateExecutableNow=true/,
    /implementationAllowedNow=true/,
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
