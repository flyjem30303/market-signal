import fs from "node:fs";
import { spawnSync } from "node:child_process";

const args = parseArgs(process.argv.slice(2));
const templateDocPath = "docs/PHASE_1_RUNTIME_PROMOTION_BOUNDED_WRITE_AUTHORIZATION_RESPONSE_TEMPLATE.md";
const intakeDocPath = "docs/PHASE_1_RUNTIME_PROMOTION_BOUNDED_WRITE_AUTHORIZATION_RESPONSE_INTAKE_VALIDATOR.md";
const templatePath = "data/evidence-intake/phase-1-runtime-promotion-bounded-write-authorization-response.template.json";
const requiredGateCheckerPath = "scripts/check-phase-1-runtime-promotion-explicit-operator-bounded-write-authorization-required.mjs";
const responsePath = args.response ?? templatePath;
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const problems = [];

const templateDoc = read(templateDocPath);
const intakeDoc = read(intakeDocPath);
const templateText = read(templatePath);
const responseText = read(responsePath);
const response = parseJson(responseText, responsePath);
const pkg = parseJson(read(packagePath), packagePath);
const reviewGate = read(reviewGatePath);
const requiredGate = runJson(requiredGateCheckerPath);

const requiredConfirmations = [
  "oneBoundedWriteAttemptOnly",
  "sourceLegalityReviewed",
  "candidateArtifactSetAccepted",
  "serverOnlyCredentialPresenceReviewed",
  "readbackRequired",
  "rollbackOrQuarantineRequired",
  "postRunReviewRequired",
  "publicRuntimeMustRemainMockUntilPromotionReview",
  "noSecretValuesPrintedOrRequested",
  "noRawRowPayloadsPrintedOrRequested",
  "noInvestmentAdviceOrRealtimeGuarantee"
];

validateDocs();
validateRequiredGate();
validateResponse();
validateRegistration();
validateBoundaries();

const approved =
  response.operatorDecision === "APPROVE_ONE_BOUNDED_WRITE_ATTEMPT" &&
  response.confirmationCompleteness === "complete" &&
  requiredConfirmations.every((key) => response.confirmations?.[key] === true) &&
  problems.length === 0;

const ok = problems.length === 0;
console.log(
  JSON.stringify(
    {
      status: ok ? "ok" : "blocked",
      guardedStatus: ok
        ? "phase_1_runtime_promotion_bounded_write_authorization_response_intake_validator_ready_no_execution"
        : "phase_1_runtime_promotion_bounded_write_authorization_response_intake_validator_blocked",
      responsePath,
      operatorDecision: response.operatorDecision ?? null,
      authorizationAcceptedForNextPreparation: approved,
      boundedAttemptExecutableNow: false,
      writeGateExecutableNow: false,
      publicDataSource: "mock",
      scoreSource: "mock",
      nextRoute: ok ? response.nextRoute : "keep_mock_and_request_repair",
      problems
    },
    null,
    2
  )
);

if (!ok) process.exit(1);

function validateDocs() {
  for (const [label, text, phrases] of [
    [
      templateDocPath,
      templateDoc,
      [
        "Status: `phase_1_runtime_promotion_bounded_write_authorization_response_template_ready_no_execution`",
        "Decision: `KEEP_MOCK_BOUNDED_WRITE_AUTHORIZATION_RESPONSE_TEMPLATE_READY`",
        "`operatorDecision=REJECT_KEEP_MOCK`",
        "`APPROVE_ONE_BOUNDED_WRITE_ATTEMPT`",
        "`phase_1_runtime_promotion_one_bounded_write_attempt_runner_preparation_no_execution`",
        "No response outcome may directly execute mutation"
      ]
    ],
    [
      intakeDocPath,
      intakeDoc,
      [
        "Status: `phase_1_runtime_promotion_bounded_write_authorization_response_intake_validator_ready_no_execution`",
        "Decision: `KEEP_MOCK_BOUNDED_WRITE_AUTHORIZATION_INTAKE_READY`",
        "`operatorDecision=APPROVE_ONE_BOUNDED_WRITE_ATTEMPT`",
        "`confirmationCompleteness=complete`",
        "`boundedAttemptExecutableNow=false`",
        "`writeGateExecutableNow=false`",
        "`publicDataSource=mock`",
        "`scoreSource=mock`"
      ]
    ]
  ]) {
    for (const phrase of phrases) if (!text.includes(phrase)) problems.push(`${label} missing phrase: ${phrase}`);
    for (const phrase of hardStops()) if (!text.includes(phrase)) problems.push(`${label} missing hard stop: ${phrase}`);
  }

  for (const key of requiredConfirmations) {
    if (!templateDoc.includes(`\`${key}\``)) problems.push(`${templateDocPath} missing confirmation ${key}`);
  }
}

function validateRequiredGate() {
  expect(requiredGate.status, "ok", "requiredGate.status");
  expect(
    requiredGate.guardedStatus,
    "phase_1_runtime_promotion_explicit_operator_bounded_write_authorization_required_ready",
    "requiredGate.guardedStatus"
  );
  expect(requiredGate.nextRoute, "await_explicit_operator_bounded_write_authorization", "requiredGate.nextRoute");
}

function validateResponse() {
  expect(response.responseMode, "phase_1_runtime_promotion_bounded_write_authorization_response", "response.responseMode");
  if (
    ![
      "PHASE_1_RUNTIME_PROMOTION_BOUNDED_WRITE_AUTHORIZATION_RESPONSE_TEMPLATE_NO_EXECUTION",
      "PHASE_1_RUNTIME_PROMOTION_BOUNDED_WRITE_AUTHORIZATION_RESPONSE_FILLED_NO_EXECUTION"
    ].includes(response.responseLabel)
  ) {
    problems.push(`response.responseLabel is not allowed: ${JSON.stringify(response.responseLabel)}`);
  }
  if (!["REJECT_KEEP_MOCK", "APPROVE_ONE_BOUNDED_WRITE_ATTEMPT"].includes(response.operatorDecision)) {
    problems.push(`response.operatorDecision is not allowed: ${JSON.stringify(response.operatorDecision)}`);
  }
  expect(response.targetTable, "daily_prices", "response.targetTable");
  expect(response.targetScope, "twii_and_etf_phase_1_missing_row_closure_only", "response.targetScope");
  expect(response.maxRowsPerAttempt, 178, "response.maxRowsPerAttempt");
  expect(response.boundedAttemptExecutableNow, false, "response.boundedAttemptExecutableNow");
  expect(response.writeGateExecutableNow, false, "response.writeGateExecutableNow");
  expect(response.runnerExecutableNow, false, "response.runnerExecutableNow");
  expect(response.promotionAllowedNow, false, "response.promotionAllowedNow");
  expect(response.publicDataSource, "mock", "response.publicDataSource");
  expect(response.scoreSource, "mock", "response.scoreSource");

  if (response.operatorDecision === "APPROVE_ONE_BOUNDED_WRITE_ATTEMPT") {
    expect(response.responseLabel, "PHASE_1_RUNTIME_PROMOTION_BOUNDED_WRITE_AUTHORIZATION_RESPONSE_FILLED_NO_EXECUTION", "approved responseLabel");
    expect(response.confirmationCompleteness, "complete", "approved confirmationCompleteness");
    expect(response.nextRoute, "phase_1_runtime_promotion_one_bounded_write_attempt_runner_preparation_no_execution", "approved nextRoute");
    for (const key of requiredConfirmations) {
      expect(response.confirmations?.[key], true, `approved confirmations.${key}`);
    }
  } else {
    expect(response.confirmationCompleteness, "incomplete", "rejected confirmationCompleteness");
    expect(response.nextRoute, "keep_mock_and_request_repair", "rejected nextRoute");
  }
}

function validateRegistration() {
  if (
    pkg.scripts?.["check:phase-1-runtime-promotion-bounded-write-authorization-response-intake-validator"] !==
    "node scripts/check-phase-1-runtime-promotion-bounded-write-authorization-response-intake-validator.mjs"
  ) {
    problems.push(`${packagePath} missing check:phase-1-runtime-promotion-bounded-write-authorization-response-intake-validator`);
  }
  if (!reviewGate.includes("scripts/check-phase-1-runtime-promotion-bounded-write-authorization-response-intake-validator.mjs")) {
    problems.push(`${reviewGatePath} missing bounded write authorization response intake validator registration`);
  }
  if (!reviewGate.includes('"phase-1-runtime-promotion-bounded-write-authorization-response-intake-validator"')) {
    problems.push(`${reviewGatePath} missing bounded write authorization response intake focused gate name`);
  }
}

function validateBoundaries() {
  for (const [label, text] of [
    [templateDocPath, templateDoc],
    [intakeDocPath, intakeDoc],
    [templatePath, templateText],
    [responsePath, responseText]
  ]) {
    for (const pattern of forbiddenPatterns()) {
      if (pattern.test(text)) problems.push(`${label} contains forbidden pattern ${pattern}`);
    }
  }
}

function hardStops() {
  return [
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
  ];
}

function parseArgs(rawArgs) {
  const parsed = {};
  for (let index = 0; index < rawArgs.length; index += 1) {
    const current = rawArgs[index];
    if (!current.startsWith("--")) continue;
    const key = current.slice(2);
    const next = rawArgs[index + 1];
    if (next && !next.startsWith("--")) {
      parsed[key] = next;
      index += 1;
    } else {
      parsed[key] = "true";
    }
  }
  return parsed;
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

function runJson(scriptPath) {
  const run = spawnSync(process.execPath, [scriptPath], {
    cwd: process.cwd(),
    encoding: "utf8",
    shell: false,
    timeout: 120000,
    windowsHide: true
  });
  if (run.status !== 0) problems.push(`${scriptPath} exited ${run.status}`);
  try {
    return JSON.parse(run.stdout);
  } catch (error) {
    problems.push(`${scriptPath} did not emit JSON: ${error.message}`);
    return {};
  }
}

function expect(actual, expected, label) {
  if (actual !== expected) problems.push(`${label} expected ${JSON.stringify(expected)} but got ${JSON.stringify(actual)}`);
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
    /\b(setx|vercel\s+env|supabase\s+db|psql|alter\s+table|drop\s+table)\b/iu,
    /SQL execution is approved/iu,
    /Supabase write is approved/iu,
    /guaranteed return/iu,
    /buy now/iu
  ];
}
