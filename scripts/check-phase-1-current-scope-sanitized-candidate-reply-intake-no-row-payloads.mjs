import fs from "node:fs";

const templatePath = "data/evidence-intake/phase-1-current-scope-sanitized-candidate-reply-template-no-row-payloads.json";
const templateDocPath = "docs/PHASE_1_CURRENT_SCOPE_SANITIZED_CANDIDATE_REPLY_TEMPLATE_NO_ROW_PAYLOADS.md";
const validatorPath = "data/evidence-intake/phase-1-current-scope-sanitized-candidate-reply-intake-validator-no-row-payloads.json";
const validatorDocPath = "docs/PHASE_1_CURRENT_SCOPE_SANITIZED_CANDIDATE_REPLY_INTAKE_VALIDATOR_NO_ROW_PAYLOADS.md";
const readinessPath = "data/evidence-intake/phase-1-current-scope-sanitized-candidate-artifact-readiness.json";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";

const problems = [];
const templateRaw = read(templatePath);
const template = parseJson(templateRaw, templatePath);
const templateDoc = read(templateDocPath);
const validatorRaw = read(validatorPath);
const validator = parseJson(validatorRaw, validatorPath);
const validatorDoc = read(validatorDocPath);
const readiness = parseJson(read(readinessPath), readinessPath);
const pkg = parseJson(read(packagePath), packagePath);
const reviewGate = read(reviewGatePath);

validateTemplate();
validateValidator();
validateDocs();
validateRegistration();
validateBoundaries();

const ok = problems.length === 0;
console.log(
  JSON.stringify(
    {
      status: ok ? "ok" : "blocked",
      guardedStatus: ok
        ? "phase_1_current_scope_sanitized_candidate_reply_intake_no_row_payloads_ready"
        : "phase_1_current_scope_sanitized_candidate_reply_intake_no_row_payloads_blocked",
      templateDecision: template.templateDecision ?? null,
      validatorDecision: validator.validatorDecision ?? null,
      futureReplyPresentNow: validator.futureReplyPresentNow ?? null,
      replyAcceptedNow: validator.replyAcceptedNow ?? null,
      candidateArtifactReadNow: validator.candidateArtifactReadNow ?? null,
      publicDataSource: "mock",
      scoreSource: "mock",
      nextRoute: ok ? validator.nextRoute : "keep_mock_and_request_repair",
      problems
    },
    null,
    2
  )
);

if (!ok) process.exit(1);

function validateTemplate() {
  expect(template.status, "phase_1_current_scope_sanitized_candidate_reply_template_no_row_payloads_ready", "template.status");
  expect(template.templateMode, "a1_or_pm_current_scope_sanitized_candidate_reply_template_no_row_payloads", "template.templateMode");
  expect(template.sourceReadinessPath, readinessPath, "template.sourceReadinessPath");
  expect(template.sourceReadinessStatus, readiness.status, "template.sourceReadinessStatus");
  expect(template.templateDecision, "ready_for_current_scope_sanitized_aggregate_reply", "template.templateDecision");
  expect(template.phase1Universe, "twii_plus_listed_stock_daily_close", "template.phase1Universe");
  expect(template.targetScope, "twii_plus_listed_stock_daily_close", "template.targetScope");
  expectArray(template.deferredSymbols, ["0050", "006208"], "template.deferredSymbols");
  expect(template.requiredSanitizedAggregateOnly, true, "template.requiredSanitizedAggregateOnly");
  expect(template.outputContainsRowPayload, false, "template.outputContainsRowPayload");
  expect(template.outputContainsRawPayload, false, "template.outputContainsRawPayload");
  expect(template.outputContainsStockIdPayload, false, "template.outputContainsStockIdPayload");
  expect(template.outputContainsSecrets, false, "template.outputContainsSecrets");
  expect(template.nextRoute, "future_reply_then_pm_current_scope_candidate_path_intake_no_row_payloads", "template.nextRoute");
  expectArray(
    template.requiredReplyFields,
    [
      "candidateArtifactPath",
      "artifactId",
      "phase1Universe",
      "scope",
      "sourceLane",
      "coverageWindowSessions",
      "aggregateRowCount",
      "symbolsCoveredCount",
      "dateBounds",
      "duplicateCount",
      "rejectedCount",
      "missingRequiredFieldCount",
      "forbiddenFieldCount",
      "sanitizedAggregateOnly",
      "rawPayloadIncluded",
      "rowPayloadIncluded",
      "stockIdPayloadIncluded",
      "secretsIncluded",
      "safetyFlags"
    ],
    "template.requiredReplyFields"
  );
  expectDeepEqual(
    template.requiredBooleans,
    {
      sanitizedAggregateOnly: true,
      rawPayloadIncluded: false,
      rowPayloadIncluded: false,
      stockIdPayloadIncluded: false,
      secretsIncluded: false
    },
    "template.requiredBooleans"
  );
  validateSafety(template.safety ?? {}, "template.safety");
}

function validateValidator() {
  expect(validator.status, "phase_1_current_scope_sanitized_candidate_reply_intake_validator_no_row_payloads_ready", "validator.status");
  expect(
    validator.validatorMode,
    "current_scope_sanitized_candidate_reply_intake_validator_no_row_payloads",
    "validator.validatorMode"
  );
  expect(validator.sourceTemplatePath, templatePath, "validator.sourceTemplatePath");
  expect(validator.sourceTemplateStatus, template.status, "validator.sourceTemplateStatus");
  expect(validator.validatorDecision, "ready_to_validate_future_current_scope_reply_shape_only", "validator.validatorDecision");
  expect(validator.futureReplyRequired, true, "validator.futureReplyRequired");
  expect(validator.futureReplyPresentNow, false, "validator.futureReplyPresentNow");
  expect(validator.replyAcceptedNow, false, "validator.replyAcceptedNow");
  expect(validator.candidateArtifactPathAcceptedNow, false, "validator.candidateArtifactPathAcceptedNow");
  expect(validator.candidateArtifactReadNow, false, "validator.candidateArtifactReadNow");
  expect(validator.candidateRowsAcceptedNow, false, "validator.candidateRowsAcceptedNow");
  expect(validator.phase1Universe, "twii_plus_listed_stock_daily_close", "validator.phase1Universe");
  expect(validator.targetScope, "twii_plus_listed_stock_daily_close", "validator.targetScope");
  expectArray(validator.deferredSymbols, ["0050", "006208"], "validator.deferredSymbols");
  expect(validator.requiredSanitizedAggregateOnly, true, "validator.requiredSanitizedAggregateOnly");
  expect(validator.nextRoute, "wait_for_current_scope_sanitized_candidate_artifact_reply", "validator.nextRoute");
  expect(validator.nextRouteIfFutureReplyPasses, "current_scope_sanitized_candidate_artifact_path_intake_no_row_payloads", "validator.nextRouteIfFutureReplyPasses");
  expectDeepEqual(validator.requiredBooleans, template.requiredBooleans, "validator.requiredBooleans");
  validateSafety(validator.safety ?? {}, "validator.safety");
}

function validateDocs() {
  for (const [label, text, tokens] of [
    [
      templateDocPath,
      templateDoc,
      [
        "phase_1_current_scope_sanitized_candidate_reply_template_no_row_payloads_ready",
        "ready_for_current_scope_sanitized_aggregate_reply",
        "phase1Universe=twii_plus_listed_stock_daily_close",
        "scope=twii_plus_listed_stock_daily_close",
        "sanitizedAggregateOnly=true",
        "rawPayloadIncluded=false",
        "rowPayloadIncluded=false",
        "stockIdPayloadIncluded=false",
        "secretsIncluded=false",
        "No raw market data",
        "No row payload",
        "No stock-id payload",
        "No secret",
        "No Supabase read/write",
        "No `publicDataSource=supabase`",
        "No `scoreSource=real`"
      ]
    ],
    [
      validatorDocPath,
      validatorDoc,
      [
        "phase_1_current_scope_sanitized_candidate_reply_intake_validator_no_row_payloads_ready",
        "ready_to_validate_future_current_scope_reply_shape_only",
        "futureReplyPresentNow=false",
        "replyAcceptedNow=false",
        "candidateArtifactPathAcceptedNow=false",
        "candidateArtifactReadNow=false",
        "candidateRowsAcceptedNow=false",
        "phase1Universe=twii_plus_listed_stock_daily_close",
        "targetScope=twii_plus_listed_stock_daily_close",
        "No artifact content read",
        "No candidate row acceptance",
        "No Supabase write",
        "No public real-data promotion"
      ]
    ]
  ]) {
    for (const token of tokens) {
      if (!text.includes(token)) problems.push(`${label} missing token ${token}`);
    }
  }
}

function validateRegistration() {
  if (
    pkg.scripts?.["check:phase-1-current-scope-sanitized-candidate-reply-intake-no-row-payloads"] !==
    "node scripts/check-phase-1-current-scope-sanitized-candidate-reply-intake-no-row-payloads.mjs"
  ) {
    problems.push(`${packagePath} missing check:phase-1-current-scope-sanitized-candidate-reply-intake-no-row-payloads`);
  }
  if (!reviewGate.includes("scripts/check-phase-1-current-scope-sanitized-candidate-reply-intake-no-row-payloads.mjs")) {
    problems.push(`${reviewGatePath} missing current-scope reply intake checker`);
  }
  if (!reviewGate.includes('"phase-1-current-scope-sanitized-candidate-reply-intake-no-row-payloads"')) {
    problems.push(`${reviewGatePath} missing current-scope reply intake focused gate`);
  }
}

function validateBoundaries() {
  for (const [label, text] of [
    [templatePath, templateRaw],
    [validatorPath, validatorRaw],
    [templateDocPath, templateDoc],
    [validatorDocPath, validatorDoc]
  ]) {
    for (const pattern of forbiddenPatterns()) {
      if (pattern.test(text)) problems.push(`${label} contains forbidden pattern ${pattern}`);
    }
  }
}

function validateSafety(safety, label) {
  expect(safety.publicDataSource, "mock", `${label}.publicDataSource`);
  expect(safety.scoreSource, "mock", `${label}.scoreSource`);
  for (const key of [
    "sqlExecuted",
    "supabaseClientImported",
    "supabaseConnectionAttempted",
    "supabaseReadsEnabled",
    "supabaseWritesEnabled",
    "supabaseReadAttempted",
    "supabaseWriteAttempted",
    "marketDataFetched",
    "marketDataIngested",
    "dailyPricesMutated",
    "stagingRowsCreated",
    "candidateRowsAccepted",
    "candidateArtifactRowsRead",
    "rowPayloadRead",
    "rawPayloadRead",
    "rowPayloadOutput",
    "rawPayloadOutput",
    "stockIdPayloadOutput",
    "secretsOutput",
    "publicPromotionAllowed",
    "scoreSourceRealAllowed",
    "investmentAdviceClaimAllowed"
  ]) {
    if (key in safety) expect(safety[key], false, `${label}.${key}`);
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

function expectDeepEqual(actual, expected, label) {
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    problems.push(`${label} expected ${JSON.stringify(expected)} but got ${JSON.stringify(actual)}`);
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
    /\.rpc\s*\(/u,
    /\bsb_(publishable|secret|anon|service_role)_[a-z0-9_-]+/iu,
    /publicDataSource"\s*:\s*"supabase"/u,
    /scoreSource"\s*:\s*"real"/u,
    /futureReplyPresentNow"\s*:\s*true/u,
    /replyAcceptedNow"\s*:\s*true/u,
    /candidateArtifactReadNow"\s*:\s*true/u,
    /candidateRowsAcceptedNow"\s*:\s*true/u,
    /rowPayloadIncluded:\s*true/u,
    /rawPayloadIncluded:\s*true/u,
    /secretsIncluded:\s*true/u,
    /SQL execution is approved/iu,
    /Supabase write is approved/iu,
    /guaranteed return/iu,
    /buy now/iu
  ];
}
