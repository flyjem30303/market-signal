import fs from "node:fs";

const artifactPath = "data/evidence-intake/phase-1-runtime-promotion-narrowed-bounded-packet-readiness-no-execution.json";
const docPath = "docs/PHASE_1_RUNTIME_PROMOTION_NARROWED_BOUNDED_PACKET_READINESS_NO_EXECUTION.md";
const legacyPacketPath = "data/evidence-intake/phase-1-daily-prices-final-bounded-write-execution-packet-no-execution.json";
const sourceDepthPath = "src/lib/phase-1-source-depth-acceptance-contract.ts";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";

const problems = [];
const artifactText = read(artifactPath);
const artifact = parseJson(artifactText, artifactPath);
const doc = read(docPath);
const legacyPacket = parseJson(read(legacyPacketPath), legacyPacketPath);
const sourceDepth = read(sourceDepthPath);
const pkg = parseJson(read(packagePath), packagePath);
const reviewGate = read(reviewGatePath);

for (const phrase of [
  "Status: `blocked_pending_twii_plus_listed_stock_candidate_artifact_no_execution`",
  "Decision: `KEEP_MOCK_PREPARE_NARROWED_PACKET_INPUTS`",
  "`TWII`",
  "Taiwan listed-stock daily close",
  "ETF symbols `0050` and `006208` are deferred to Phase 1.1",
  "`phase1Universe=twii_plus_listed_stock_daily_close`",
  "`legacyEtfPacketSuperseded=true`",
  "`boundedAttemptExecutableNow=false`",
  "`writeGateExecutableNow=false`",
  "`runnerExecutableNow=false`",
  "`promotionAllowedNow=false`",
  "`publicDataSource=mock`",
  "`scoreSource=mock`",
  "`prepare_twii_plus_listed_stock_sanitized_candidate_artifact_no_execution`"
]) {
  if (!doc.includes(phrase)) problems.push(`${docPath} missing phrase: ${phrase}`);
}

for (const phrase of [
  "SQL execution",
  "SQL generation",
  "Supabase client import",
  "Supabase read/write",
  "Supabase connection",
  "staging-row creation",
  "`daily_prices` mutation",
  "market-data fetch",
  "market-data ingestion",
  "candidate-row acceptance",
  "raw payload output",
  "row payload output",
  "stock-id payload output",
  "secret or environment value output",
  "production environment mutation",
  "runtime flag mutation",
  "`publicDataSource=supabase`",
  "`scoreSource=real`",
  "real-time precision claim",
  "complete-market coverage claim",
  "investment-advice claim"
]) {
  if (!doc.includes(phrase)) problems.push(`${docPath} missing hard stop: ${phrase}`);
}

expect(artifact.packetMode, "phase_1_runtime_promotion_narrowed_bounded_packet_readiness_no_execution", "artifact.packetMode");
expect(artifact.status, "blocked_pending_twii_plus_listed_stock_candidate_artifact_no_execution", "artifact.status");
expect(artifact.decision, "KEEP_MOCK_PREPARE_NARROWED_PACKET_INPUTS", "artifact.decision");
expect(artifact.phase1Universe, "twii_plus_listed_stock_daily_close", "artifact.phase1Universe");
expect(artifact.legacyEtfPacketSuperseded, true, "artifact.legacyEtfPacketSuperseded");
expect(artifact.legacyEtfPacketPath, legacyPacketPath, "artifact.legacyEtfPacketPath");
expectArray(artifact.deferredSymbols, ["0050", "006208"], "artifact.deferredSymbols");
expectArray(artifact.deferredScopes, ["phase_1_1_etf_source_rights"], "artifact.deferredScopes");
expect(artifact.boundedAttemptExecutableNow, false, "artifact.boundedAttemptExecutableNow");
expect(artifact.writeGateExecutableNow, false, "artifact.writeGateExecutableNow");
expect(artifact.runnerExecutableNow, false, "artifact.runnerExecutableNow");
expect(artifact.promotionAllowedNow, false, "artifact.promotionAllowedNow");
expect(artifact.publicDataSource, "mock", "artifact.publicDataSource");
expect(artifact.scoreSource, "mock", "artifact.scoreSource");
expect(artifact.nextRoute, "prepare_twii_plus_listed_stock_sanitized_candidate_artifact_no_execution", "artifact.nextRoute");

expectArray(
  artifact.requiredBeforeExecution,
  [
    "twii_plus_listed_stock_sanitized_candidate_artifact",
    "explicit_operator_bounded_write_authorization",
    "server_only_credential_presence_shape_check",
    "bounded_insert_missing_only_contract_ready_for_current_scope",
    "aggregate_readback_contract_ready_for_current_scope",
    "rollback_or_quarantine_contract_ready_for_current_scope",
    "post_write_review_contract_ready_for_current_scope",
    "fresh_pm_go_no_go"
  ],
  "artifact.requiredBeforeExecution"
);

expectArray(
  artifact.missingForCurrentScope,
  [
    "twii_plus_listed_stock_sanitized_candidate_artifact",
    "bounded_insert_missing_only_contract_ready_for_current_scope",
    "aggregate_readback_contract_ready_for_current_scope",
    "rollback_or_quarantine_contract_ready_for_current_scope",
    "post_write_review_contract_ready_for_current_scope"
  ],
  "artifact.missingForCurrentScope"
);

expect(legacyPacket.supersededByPhase1Scope, true, "legacyPacket.supersededByPhase1Scope");
expect(legacyPacket.currentPhase1Universe, "twii_plus_listed_stock_daily_close", "legacyPacket.currentPhase1Universe");
expect(legacyPacket.nextRoute, "prepare_phase_1_twii_plus_listed_stock_daily_close_bounded_packet_no_execution", "legacyPacket.nextRoute");

for (const phrase of [
  "phase1Universe: \"twii_plus_listed_stock_daily_close\"",
  "ETF coverage is deferred to Phase 1.1",
  "Phase 1 source depth is accepted for TWII and listed-stock daily close"
]) {
  if (!sourceDepth.includes(phrase)) problems.push(`${sourceDepthPath} missing phrase: ${phrase}`);
}

for (const key of [
  "sqlExecuted",
  "sqlGenerated",
  "supabaseClientImported",
  "supabaseConnectionAttempted",
  "supabaseReadAttempted",
  "supabaseWriteAttempted",
  "stagingRowsCreated",
  "dailyPricesMutated",
  "marketDataFetched",
  "marketDataIngested",
  "candidateRowsAccepted",
  "rawPayloadOutput",
  "rowPayloadOutput",
  "stockIdPayloadOutput",
  "secretsOutput",
  "envMutated",
  "runtimeFlagMutated",
  "publicDataSourcePromoted",
  "scoreSourcePromoted",
  "investmentAdviceClaimAllowed"
]) {
  expect(artifact.safety?.[key], false, `artifact.safety.${key}`);
}

if (
  pkg.scripts?.["check:phase-1-runtime-promotion-narrowed-bounded-packet-readiness-no-execution"] !==
  "node scripts/check-phase-1-runtime-promotion-narrowed-bounded-packet-readiness-no-execution.mjs"
) {
  problems.push(`${packagePath} missing narrowed bounded packet readiness checker script`);
}

if (!reviewGate.includes("scripts/check-phase-1-runtime-promotion-narrowed-bounded-packet-readiness-no-execution.mjs")) {
  problems.push(`${reviewGatePath} missing narrowed bounded packet readiness checker registration`);
}

if (!reviewGate.includes('"phase-1-runtime-promotion-narrowed-bounded-packet-readiness-no-execution"')) {
  problems.push(`${reviewGatePath} missing narrowed bounded packet readiness focused gate name`);
}

for (const [label, text] of [
  [artifactPath, artifactText],
  [docPath, doc]
]) {
  for (const pattern of forbiddenPatterns()) {
    if (pattern.test(text)) problems.push(`${label} contains forbidden pattern ${pattern}`);
  }
}

const ok = problems.length === 0;
console.log(
  JSON.stringify(
    {
      status: ok ? "ok" : "blocked",
      guardedStatus: ok
        ? "phase_1_runtime_promotion_narrowed_bounded_packet_readiness_blocked_no_execution"
        : "phase_1_runtime_promotion_narrowed_bounded_packet_readiness_invalid",
      decision: artifact.decision ?? null,
      phase1Universe: artifact.phase1Universe ?? null,
      legacyEtfPacketSuperseded: artifact.legacyEtfPacketSuperseded === true,
      boundedAttemptExecutableNow: false,
      writeGateExecutableNow: false,
      publicDataSource: "mock",
      scoreSource: "mock",
      nextRoute: ok ? artifact.nextRoute : "keep_mock_and_request_repair",
      problems
    },
    null,
    2
  )
);

if (!ok) process.exit(1);

function read(filePath) {
  try {
    return fs.readFileSync(filePath, "utf8");
  } catch (error) {
    problems.push(`failed to read ${filePath}: ${error.message}`);
    return filePath.endsWith(".json") ? "{}" : "";
  }
}

function parseJson(text, label) {
  try {
    return JSON.parse(text);
  } catch (error) {
    problems.push(`${label} JSON parse failed: ${error.message}`);
    return {};
  }
}

function expect(actual, expected, label) {
  if (actual !== expected) problems.push(`${label} expected ${JSON.stringify(expected)} but got ${JSON.stringify(actual)}`);
}

function expectArray(actual, expected, label) {
  if (!Array.isArray(actual)) {
    problems.push(`${label} must be an array`);
    return;
  }
  const missing = expected.filter((item) => !actual.includes(item));
  const extra = actual.filter((item) => !expected.includes(item));
  if (missing.length > 0 || extra.length > 0) {
    problems.push(`${label} mismatch missing=${JSON.stringify(missing)} extra=${JSON.stringify(extra)}`);
  }
}

function forbiddenPatterns() {
  return [
    /@supabase\/supabase-js/u,
    /createClient\s*\(/u,
    /\.from\s*\(/u,
    /\.insert\s*\(/u,
    /\.update\s*\(/u,
    /\.delete\s*\(/u,
    /\.upsert\s*\(/u,
    /\bsb_(publishable|secret|anon|service_role)_[a-z0-9_-]+/iu,
    /"boundedAttemptExecutableNow"\s*:\s*true/u,
    /"writeGateExecutableNow"\s*:\s*true/u,
    /"runnerExecutableNow"\s*:\s*true/u,
    /"promotionAllowedNow"\s*:\s*true/u,
    /"publicDataSource"\s*:\s*"supabase"/u,
    /"scoreSource"\s*:\s*"real"/u,
    /\b(setx|vercel\s+env|supabase\s+db|psql|insert|update|delete|upsert|alter\s+table|drop\s+table)\b/iu,
    /SQL execution is approved/iu,
    /Supabase write is approved/iu,
    /guaranteed return/iu,
    /buy now/iu
  ];
}
