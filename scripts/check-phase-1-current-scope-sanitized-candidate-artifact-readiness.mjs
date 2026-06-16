import fs from "node:fs";

const docPath = "docs/PHASE_1_CURRENT_SCOPE_SANITIZED_CANDIDATE_ARTIFACT_READINESS.md";
const artifactPath = "data/evidence-intake/phase-1-current-scope-sanitized-candidate-artifact-readiness.json";
const sourceDepthPath = "src/lib/phase-1-source-depth-acceptance-contract.ts";
const narrowedPacketPath = "data/evidence-intake/phase-1-runtime-promotion-narrowed-bounded-packet-readiness-no-execution.json";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";

const problems = [];
const doc = read(docPath);
const artifactText = read(artifactPath);
const artifact = parseJson(artifactText, artifactPath);
const sourceDepth = read(sourceDepthPath);
const narrowedPacket = parseJson(read(narrowedPacketPath), narrowedPacketPath);
const pkg = parseJson(read(packagePath), packagePath);
const reviewGate = read(reviewGatePath);

validateDoc();
validateArtifact();
validateCrossLinks();
validateRegistration();
validateBoundaries();

const ok = problems.length === 0;
console.log(
  JSON.stringify(
    {
      status: ok ? "ok" : "blocked",
      guardedStatus: ok
        ? "phase_1_current_scope_sanitized_candidate_artifact_readiness_ready_no_market_rows"
        : "phase_1_current_scope_sanitized_candidate_artifact_readiness_blocked",
      decision: artifact.decision ?? null,
      phase1Universe: artifact.phase1Universe ?? null,
      legacyEtfScopeSupersededForCurrentPhase1: artifact.legacyEtfScopeSupersededForCurrentPhase1 === true,
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

function validateDoc() {
  for (const phrase of [
    "Status: `phase_1_current_scope_sanitized_candidate_artifact_readiness_ready_no_market_rows`",
    "Decision: `PREPARE_TWII_PLUS_LISTED_STOCK_CANDIDATE_ARTIFACT_KEEP_MOCK`",
    "The old `TWII + 0050 + 006208` artifact path remains historical only",
    "`TWII`",
    "Taiwan listed-stock daily close",
    "`0050`",
    "`006208`",
    "`deliveryMode=local_or_external_path_only`",
    "`commitPolicy=do_not_commit_market_row_payloads_by_default`",
    "`pathPolicy=local_or_external_path_outside_git_or_gitignored`",
    "`validatorOutput=aggregate_counts_only`",
    "`scope=twii_plus_listed_stock_daily_close`",
    "`phase1Universe=twii_plus_listed_stock_daily_close`",
    "`a1_or_pm_prepare_twii_plus_listed_stock_sanitized_candidate_artifact_path_no_execution`"
  ]) {
    if (!doc.includes(phrase)) problems.push(`${docPath} missing phrase: ${phrase}`);
  }

  for (const field of [
    "artifactId",
    "createdAt",
    "scope",
    "phase1Universe",
    "sourceRightsStatus",
    "fieldContractStatus",
    "sanitizedRowPayloadIncluded",
    "rawPayloadIncluded",
    "stockIdPayloadIncluded",
    "secretsIncluded",
    "expectedRows",
    "rows",
    "symbol",
    "trade_date",
    "close",
    "source_name",
    "source_updated_at",
    "source_row_hash"
  ]) {
    if (!doc.includes(`\`${field}\``)) problems.push(`${docPath} missing field ${field}`);
  }
}

function validateArtifact() {
  expect(artifact.mode, "phase_1_current_scope_sanitized_candidate_artifact_readiness", "artifact.mode");
  expect(
    artifact.status,
    "phase_1_current_scope_sanitized_candidate_artifact_readiness_ready_no_market_rows",
    "artifact.status"
  );
  expect(artifact.decision, "PREPARE_TWII_PLUS_LISTED_STOCK_CANDIDATE_ARTIFACT_KEEP_MOCK", "artifact.decision");
  expect(artifact.phase1Universe, "twii_plus_listed_stock_daily_close", "artifact.phase1Universe");
  expectArray(artifact.currentScope, ["TWII", "tw_listed_stock_daily_close"], "artifact.currentScope");
  expectArray(artifact.deferredSymbols, ["0050", "006208"], "artifact.deferredSymbols");
  expect(artifact.legacyEtfScopeSupersededForCurrentPhase1, true, "artifact.legacyEtfScopeSupersededForCurrentPhase1");
  expect(artifact.deliveryMode, "local_or_external_path_only", "artifact.deliveryMode");
  expect(artifact.commitPolicy, "do_not_commit_market_row_payloads_by_default", "artifact.commitPolicy");
  expect(artifact.pathPolicy, "local_or_external_path_outside_git_or_gitignored", "artifact.pathPolicy");
  expect(artifact.validatorOutput, "aggregate_counts_only", "artifact.validatorOutput");
  expect(artifact.rowPayloadAllowedForFutureValidator, true, "artifact.rowPayloadAllowedForFutureValidator");
  expect(artifact.rowPayloadPrinted, false, "artifact.rowPayloadPrinted");
  expect(artifact.rawPayloadIncluded, false, "artifact.rawPayloadIncluded");
  expect(artifact.stockIdPayloadIncluded, false, "artifact.stockIdPayloadIncluded");
  expect(artifact.secretsIncluded, false, "artifact.secretsIncluded");
  expect(artifact.boundedAttemptExecutableNow, false, "artifact.boundedAttemptExecutableNow");
  expect(artifact.writeGateExecutableNow, false, "artifact.writeGateExecutableNow");
  expect(artifact.runnerExecutableNow, false, "artifact.runnerExecutableNow");
  expect(artifact.promotionAllowedNow, false, "artifact.promotionAllowedNow");
  expect(artifact.publicDataSource, "mock", "artifact.publicDataSource");
  expect(artifact.scoreSource, "mock", "artifact.scoreSource");
  expect(
    artifact.nextRoute,
    "a1_or_pm_prepare_twii_plus_listed_stock_sanitized_candidate_artifact_path_no_execution",
    "artifact.nextRoute"
  );

  expectArray(
    artifact.requiredTopLevelFields,
    [
      "artifactId",
      "createdAt",
      "scope",
      "phase1Universe",
      "sourceRightsStatus",
      "fieldContractStatus",
      "sanitizedRowPayloadIncluded",
      "rawPayloadIncluded",
      "stockIdPayloadIncluded",
      "secretsIncluded",
      "expectedRows",
      "rows"
    ],
    "artifact.requiredTopLevelFields"
  );

  expectArray(
    artifact.requiredRowFields,
    ["symbol", "trade_date", "close", "source_name", "source_updated_at", "source_row_hash"],
    "artifact.requiredRowFields"
  );
  expectArray(artifact.optionalRowFields, ["open", "high", "low", "volume"], "artifact.optionalRowFields");
  expectArray(
    artifact.forbiddenRowFields,
    [
      "stock_id",
      "raw_source_payload",
      "raw_url_with_query_secret",
      "authentication_header",
      "api_key",
      "unnormalized_source_row_body",
      "investment_recommendation_label"
    ],
    "artifact.forbiddenRowFields"
  );

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
}

function validateCrossLinks() {
  for (const phrase of [
    "phase1Universe: \"twii_plus_listed_stock_daily_close\"",
    "tw_listed_stock_daily_close",
    "ETF coverage is deferred to Phase 1.1"
  ]) {
    if (!sourceDepth.includes(phrase)) problems.push(`${sourceDepthPath} missing phrase: ${phrase}`);
  }

  expect(narrowedPacket.phase1Universe, "twii_plus_listed_stock_daily_close", "narrowedPacket.phase1Universe");
}

function validateRegistration() {
  if (
    pkg.scripts?.["check:phase-1-current-scope-sanitized-candidate-artifact-readiness"] !==
    "node scripts/check-phase-1-current-scope-sanitized-candidate-artifact-readiness.mjs"
  ) {
    problems.push(`${packagePath} missing current-scope sanitized candidate readiness checker script`);
  }

  if (!reviewGate.includes("scripts/check-phase-1-current-scope-sanitized-candidate-artifact-readiness.mjs")) {
    problems.push(`${reviewGatePath} missing current-scope sanitized candidate readiness checker registration`);
  }

  if (!reviewGate.includes('"phase-1-current-scope-sanitized-candidate-artifact-readiness"')) {
    problems.push(`${reviewGatePath} missing current-scope sanitized candidate focused gate name`);
  }
}

function validateBoundaries() {
  for (const [label, text] of [
    [docPath, doc],
    [artifactPath, artifactText]
  ]) {
    for (const pattern of forbiddenPatterns()) {
      if (pattern.test(text)) problems.push(`${label} contains forbidden pattern ${pattern}`);
    }
  }
}

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
