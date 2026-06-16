import fs from "node:fs";

const fixturesPath = "data/evidence-intake/phase-1-current-scope-sanitized-candidate-reply-fixtures-no-row-payloads.json";
const fixturesDocPath = "docs/PHASE_1_CURRENT_SCOPE_SANITIZED_CANDIDATE_REPLY_FIXTURES_NO_ROW_PAYLOADS.md";
const validatorPath = "data/evidence-intake/phase-1-current-scope-sanitized-candidate-reply-intake-validator-no-row-payloads.json";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const projectStatusPath = "PROJECT_STATUS.md";

const problems = [];
const fixturesRaw = read(fixturesPath);
const fixtures = parseJson(fixturesRaw, fixturesPath);
const fixturesDoc = read(fixturesDocPath);
const validator = parseJson(read(validatorPath), validatorPath);
const pkg = parseJson(read(packagePath), packagePath);
const reviewGate = read(reviewGatePath);
const projectStatus = read(projectStatusPath);

const acceptedResult = validateFutureReply(fixtures.acceptedFixture ?? {});
const rejectedResults = (fixtures.rejectedFixtures ?? []).map((fixture) => {
  const reply = mergePatch(fixtures.acceptedFixture ?? {}, fixture.patch ?? {});
  return {
    label: fixture.label,
    expectedProblem: fixture.expectedProblem,
    result: validateFutureReply(reply)
  };
});

validateFixtures();
validateStaticContracts();
validateRegistration();
validateBoundaries();

const ok = problems.length === 0;
console.log(
  JSON.stringify(
    {
      status: ok ? "ok" : "blocked",
      guardedStatus: ok
        ? "phase_1_current_scope_sanitized_candidate_reply_fixtures_no_row_payloads_ready"
        : "phase_1_current_scope_sanitized_candidate_reply_fixtures_no_row_payloads_blocked",
      fixtureDecision: fixtures.fixtureDecision ?? null,
      acceptedFixtureAccepted: acceptedResult.accepted,
      rejectedFixtureCount: rejectedResults.length,
      rejectedFixturesRejected: rejectedResults.every((item) => !item.result.accepted),
      futureReplyAcceptedNow: fixtures.futureReplyAcceptedNow ?? null,
      candidateArtifactReadNow: fixtures.candidateArtifactReadNow ?? null,
      candidateRowsAcceptedNow: fixtures.candidateRowsAcceptedNow ?? null,
      publicDataSource: "mock",
      scoreSource: "mock",
      nextRoute: ok ? fixtures.nextRoute : "keep_mock_and_repair_fixture_contract",
      problems
    },
    null,
    2
  )
);

if (!ok) process.exit(1);

function validateFixtures() {
  expect(fixtures.status, "phase_1_current_scope_sanitized_candidate_reply_fixtures_no_row_payloads_ready", "fixtures.status");
  expect(
    fixtures.fixtureMode,
    "current_scope_sanitized_candidate_reply_accept_reject_fixtures_no_row_payloads",
    "fixtures.fixtureMode"
  );
  expect(fixtures.sourceValidatorPath, validatorPath, "fixtures.sourceValidatorPath");
  expect(fixtures.sourceValidatorStatus, validator.status, "fixtures.sourceValidatorStatus");
  expect(
    fixtures.fixtureDecision,
    "ready_to_verify_future_reply_accept_reject_branches_without_row_payloads",
    "fixtures.fixtureDecision"
  );
  expect(fixtures.phase1Universe, "twii_plus_listed_stock_daily_close", "fixtures.phase1Universe");
  expect(fixtures.targetScope, "twii_plus_listed_stock_daily_close", "fixtures.targetScope");
  expectArray(fixtures.deferredSymbols, ["0050", "006208"], "fixtures.deferredSymbols");
  expect(fixtures.futureReplyAcceptedNow, false, "fixtures.futureReplyAcceptedNow");
  expect(fixtures.candidateArtifactReadNow, false, "fixtures.candidateArtifactReadNow");
  expect(fixtures.candidateRowsAcceptedNow, false, "fixtures.candidateRowsAcceptedNow");
  expect(fixtures.nextRoute, "future_a1_or_pm_reply_can_be_checked_against_accept_reject_fixture_contract", "fixtures.nextRoute");
  validateSafety(fixtures.safety ?? {}, "fixtures.safety");

  if (!acceptedResult.accepted) problems.push(`accepted fixture rejected: ${acceptedResult.problems.join("; ")}`);
  expect(acceptedResult.nextRoute, "current_scope_sanitized_candidate_artifact_path_shape_ready_no_row_payloads", "acceptedResult.nextRoute");

  const expectedRejectedLabels = [
    "reject_raw_payload",
    "reject_row_payload",
    "reject_stock_id_payload",
    "reject_secrets",
    "reject_etf_current_scope_mismatch",
    "reject_real_promotion"
  ];
  expectArray(
    rejectedResults.map((item) => item.label),
    expectedRejectedLabels,
    "rejectedFixtureLabels"
  );
  for (const item of rejectedResults) {
    if (item.result.accepted) problems.push(`${item.label} should be rejected`);
    if (!item.result.problems.some((problem) => problem.includes(item.expectedProblem))) {
      problems.push(`${item.label} missing expected problem ${item.expectedProblem}`);
    }
  }
}

function validateStaticContracts() {
  for (const [label, text, tokens] of [
    [
      fixturesDocPath,
      fixturesDoc,
      [
        "phase_1_current_scope_sanitized_candidate_reply_fixtures_no_row_payloads_ready",
        "ready_to_verify_future_reply_accept_reject_branches_without_row_payloads",
        "phase1Universe=twii_plus_listed_stock_daily_close",
        "scope=twii_plus_listed_stock_daily_close",
        "sanitizedAggregateOnly=true",
        "rawPayloadIncluded=false",
        "rowPayloadIncluded=false",
        "stockIdPayloadIncluded=false",
        "secretsIncluded=false",
        "publicDataSource=mock",
        "scoreSource=mock",
        "raw payload included",
        "row payload included",
        "stock-id payload included",
        "secrets included",
        "ETF current-scope mismatch",
        "real-data promotion attempt",
        "No artifact content read",
        "No candidate row acceptance",
        "No Supabase read/write",
        "No `daily_prices` mutation",
        "No public real-data promotion"
      ]
    ],
    [
      projectStatusPath,
      projectStatus,
      [
        "Latest Phase 1 Current-Scope Candidate Reply Fixtures",
        "phase_1_current_scope_sanitized_candidate_reply_fixtures_no_row_payloads_ready",
        "ready_to_verify_future_reply_accept_reject_branches_without_row_payloads"
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
    pkg.scripts?.["check:phase-1-current-scope-sanitized-candidate-reply-fixtures-no-row-payloads"] !==
    "node scripts/check-phase-1-current-scope-sanitized-candidate-reply-fixtures-no-row-payloads.mjs"
  ) {
    problems.push(`${packagePath} missing check:phase-1-current-scope-sanitized-candidate-reply-fixtures-no-row-payloads`);
  }
  if (!reviewGate.includes("scripts/check-phase-1-current-scope-sanitized-candidate-reply-fixtures-no-row-payloads.mjs")) {
    problems.push(`${reviewGatePath} missing current-scope reply fixture checker`);
  }
  if (!reviewGate.includes('"phase-1-current-scope-sanitized-candidate-reply-fixtures-no-row-payloads"')) {
    problems.push(`${reviewGatePath} missing current-scope reply fixture focused gate`);
  }
}

function validateBoundaries() {
  for (const [label, text] of [
    [fixturesPath, fixturesRaw],
    [fixturesDocPath, fixturesDoc]
  ]) {
    for (const pattern of forbiddenPatterns()) {
      if (pattern.test(text)) problems.push(`${label} contains forbidden pattern ${pattern}`);
    }
  }
}

function validateFutureReply(reply) {
  const result = {
    accepted: false,
    nextRoute: "keep_mock_and_request_repair",
    problems: []
  };
  for (const field of [
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
  ]) {
    if (!(field in reply)) result.problems.push(`${field} is required`);
  }
  if (reply.phase1Universe !== "twii_plus_listed_stock_daily_close") {
    result.problems.push("phase1Universe must be twii_plus_listed_stock_daily_close");
  }
  if (reply.scope !== "twii_plus_listed_stock_daily_close") {
    result.problems.push("scope must be twii_plus_listed_stock_daily_close");
  }
  for (const [field, expected] of Object.entries({
    sanitizedAggregateOnly: true,
    rawPayloadIncluded: false,
    rowPayloadIncluded: false,
    stockIdPayloadIncluded: false,
    secretsIncluded: false
  })) {
    if (reply[field] !== expected) result.problems.push(`${field} must be ${expected}`);
  }
  if (reply.safetyFlags?.publicDataSource !== "mock") result.problems.push("publicDataSource must remain mock");
  if (reply.safetyFlags?.scoreSource !== "mock") result.problems.push("scoreSource must remain mock");
  for (const [field, expected] of Object.entries({
    candidateArtifactReadNow: false,
    candidateRowsAcceptedNow: false,
    sqlExecuted: false,
    supabaseWriteAttempted: false,
    dailyPricesMutated: false,
    marketDataFetched: false,
    marketDataIngested: false
  })) {
    if (reply.safetyFlags?.[field] !== expected) result.problems.push(`${field} must be ${expected}`);
  }
  if (containsDeferredSymbols(reply)) result.problems.push("deferred ETF symbols must not be part of current-scope reply");
  result.accepted = result.problems.length === 0;
  result.nextRoute = result.accepted
    ? "current_scope_sanitized_candidate_artifact_path_shape_ready_no_row_payloads"
    : "keep_mock_and_request_repair";
  return result;
}

function containsDeferredSymbols(value) {
  if (typeof value === "string") return /\b(0050|006208)\b/u.test(value);
  if (Array.isArray(value)) return value.some(containsDeferredSymbols);
  if (value && typeof value === "object") return Object.values(value).some(containsDeferredSymbols);
  return false;
}

function mergePatch(base, patch) {
  const output = structuredClone(base);
  for (const [key, value] of Object.entries(patch)) {
    if (value && typeof value === "object" && !Array.isArray(value) && output[key] && typeof output[key] === "object") {
      output[key] = { ...output[key], ...value };
    } else {
      output[key] = value;
    }
  }
  return output;
}

function validateSafety(safety, label) {
  expect(safety.publicDataSource, "mock", `${label}.publicDataSource`);
  expect(safety.scoreSource, "mock", `${label}.scoreSource`);
  for (const key of [
    "sqlExecuted",
    "supabaseClientImported",
    "supabaseConnectionAttempted",
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
    /futureReplyAcceptedNow"\s*:\s*true/u,
    /candidateArtifactReadNow"\s*:\s*true/u,
    /candidateRowsAcceptedNow"\s*:\s*true/u,
    /SQL execution is approved/iu,
    /Supabase write is approved/iu,
    /guaranteed return/iu,
    /buy now/iu
  ];
}
