import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";

const validatorPath = "scripts/check-phase-1-runtime-promotion-bounded-write-authorization-response-intake-validator.mjs";
const docPath = "docs/PHASE_1_RUNTIME_PROMOTION_BOUNDED_WRITE_AUTHORIZATION_RESPONSE_BRANCH_FIXTURES.md";
const templatePath = "data/evidence-intake/phase-1-runtime-promotion-bounded-write-authorization-response.template.json";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const projectStatusPath = "PROJECT_STATUS.md";
const problems = [];

const templateText = read(templatePath);
const template = parseJson(templateText, templatePath);
const doc = read(docPath);
const pkg = parseJson(read(packagePath), packagePath);
const reviewGate = read(reviewGatePath);
const projectStatus = read(projectStatusPath);

const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "market-signal-auth-branch-fixtures-"));
const rejectedPath = path.join(tempDir, "rejected-keep-mock.fixture.json");
const acceptedPath = path.join(tempDir, "accepted-one-bounded-write.fixture.json");

try {
  fs.writeFileSync(rejectedPath, JSON.stringify(makeRejectedFixture(), null, 2), "utf8");
  fs.writeFileSync(acceptedPath, JSON.stringify(makeAcceptedFixture(), null, 2), "utf8");

  const defaultRun = runValidator([]);
  const rejectedRun = runValidator(["--response", rejectedPath]);
  const acceptedRun = runValidator(["--response", acceptedPath]);

  validateRun("default", defaultRun, {
    accepted: false,
    nextRoute: "keep_mock_and_request_repair",
    operatorDecision: "REJECT_KEEP_MOCK"
  });
  validateRun("rejected", rejectedRun, {
    accepted: false,
    nextRoute: "keep_mock_and_request_repair",
    operatorDecision: "REJECT_KEEP_MOCK"
  });
  validateRun("accepted", acceptedRun, {
    accepted: true,
    nextRoute: "phase_1_runtime_promotion_one_bounded_write_attempt_runner_preparation_no_execution",
    operatorDecision: "APPROVE_ONE_BOUNDED_WRITE_ATTEMPT"
  });

  validateStaticContracts();

  const ok = problems.length === 0;
  console.log(
    JSON.stringify(
      {
        status: ok ? "ok" : "blocked",
        guardedStatus: ok
          ? "phase_1_runtime_promotion_bounded_write_authorization_response_branch_fixtures_ready_no_execution"
          : "phase_1_runtime_promotion_bounded_write_authorization_response_branch_fixtures_blocked",
        defaultAccepted: defaultRun.authorizationAcceptedForNextPreparation ?? null,
        rejectedAccepted: rejectedRun.authorizationAcceptedForNextPreparation ?? null,
        acceptedAccepted: acceptedRun.authorizationAcceptedForNextPreparation ?? null,
        acceptedNextRoute: acceptedRun.nextRoute ?? null,
        boundedAttemptExecutableNow: false,
        writeGateExecutableNow: false,
        publicDataSource: "mock",
        scoreSource: "mock",
        tempFixturesCommitted: false,
        problems
      },
      null,
      2
    )
  );

  if (!ok) process.exit(1);
} finally {
  fs.rmSync(tempDir, { force: true, recursive: true });
}

function makeRejectedFixture() {
  return {
    ...template,
    responseLabel: "PHASE_1_RUNTIME_PROMOTION_BOUNDED_WRITE_AUTHORIZATION_RESPONSE_FILLED_NO_EXECUTION",
    operatorDecision: "REJECT_KEEP_MOCK",
    confirmationCompleteness: "incomplete",
    confirmations: Object.fromEntries(Object.keys(template.confirmations ?? {}).map((key) => [key, false])),
    boundedAttemptExecutableNow: false,
    writeGateExecutableNow: false,
    runnerExecutableNow: false,
    promotionAllowedNow: false,
    publicDataSource: "mock",
    scoreSource: "mock",
    nextRoute: "keep_mock_and_request_repair",
    stopLine:
      "Rejected fixture only. Keep mock. Do not execute, connect to Supabase, generate SQL, write data, print secrets or payloads, or promote runtime source flags."
  };
}

function makeAcceptedFixture() {
  return {
    ...template,
    responseLabel: "PHASE_1_RUNTIME_PROMOTION_BOUNDED_WRITE_AUTHORIZATION_RESPONSE_FILLED_NO_EXECUTION",
    operatorDecision: "APPROVE_ONE_BOUNDED_WRITE_ATTEMPT",
    confirmationCompleteness: "complete",
    confirmations: Object.fromEntries(Object.keys(template.confirmations ?? {}).map((key) => [key, true])),
    boundedAttemptExecutableNow: false,
    writeGateExecutableNow: false,
    runnerExecutableNow: false,
    promotionAllowedNow: false,
    publicDataSource: "mock",
    scoreSource: "mock",
    nextRoute: "phase_1_runtime_promotion_one_bounded_write_attempt_runner_preparation_no_execution",
    stopLine:
      "Accepted branch fixture only. This is temporary proof of validator routing, not stored operator authorization and not execution permission."
  };
}

function validateRun(label, run, expectation) {
  expect(run.status, "ok", `${label}.status`);
  expect(
    run.guardedStatus,
    "phase_1_runtime_promotion_bounded_write_authorization_response_intake_validator_ready_no_execution",
    `${label}.guardedStatus`
  );
  expect(run.operatorDecision, expectation.operatorDecision, `${label}.operatorDecision`);
  expect(run.authorizationAcceptedForNextPreparation, expectation.accepted, `${label}.authorizationAcceptedForNextPreparation`);
  expect(run.boundedAttemptExecutableNow, false, `${label}.boundedAttemptExecutableNow`);
  expect(run.writeGateExecutableNow, false, `${label}.writeGateExecutableNow`);
  expect(run.publicDataSource, "mock", `${label}.publicDataSource`);
  expect(run.scoreSource, "mock", `${label}.scoreSource`);
  expect(run.nextRoute, expectation.nextRoute, `${label}.nextRoute`);
}

function validateStaticContracts() {
  for (const [label, text, phrases] of [
    [
      docPath,
      doc,
      [
        "Status: `phase_1_runtime_promotion_bounded_write_authorization_response_branch_fixtures_ready_no_execution`",
        "Decision: `VERIFY_ACCEPTED_REJECTED_BRANCHES_WITH_TEMP_FIXTURES_KEEP_MOCK`",
        "No accepted authorization response is committed to the repository.",
        "`authorizationAcceptedForNextPreparation=false`",
        "`authorizationAcceptedForNextPreparation=true`",
        "`boundedAttemptExecutableNow=false`",
        "`writeGateExecutableNow=false`",
        "`publicDataSource=mock`",
        "`scoreSource=mock`"
      ]
    ],
    [
      projectStatusPath,
      projectStatus,
      [
        "Latest Runtime Promotion Bounded Write Authorization Response Branch Fixtures",
        "phase_1_runtime_promotion_bounded_write_authorization_response_branch_fixtures_ready_no_execution",
        "VERIFY_ACCEPTED_REJECTED_BRANCHES_WITH_TEMP_FIXTURES_KEEP_MOCK"
      ]
    ]
  ]) {
    for (const phrase of phrases) if (!text.includes(phrase)) problems.push(`${label} missing phrase: ${phrase}`);
    for (const phrase of hardStops()) if (!text.includes(phrase)) problems.push(`${label} missing hard stop: ${phrase}`);
    for (const pattern of forbiddenPatterns()) {
      if (pattern.test(text)) problems.push(`${label} contains forbidden pattern ${pattern}`);
    }
  }

  if (
    pkg.scripts?.["check:phase-1-runtime-promotion-bounded-write-authorization-response-branch-fixtures"] !==
    "node scripts/check-phase-1-runtime-promotion-bounded-write-authorization-response-branch-fixtures.mjs"
  ) {
    problems.push(`${packagePath} missing check:phase-1-runtime-promotion-bounded-write-authorization-response-branch-fixtures`);
  }
  if (!reviewGate.includes("scripts/check-phase-1-runtime-promotion-bounded-write-authorization-response-branch-fixtures.mjs")) {
    problems.push(`${reviewGatePath} missing branch fixture checker registration`);
  }
  if (!reviewGate.includes('"phase-1-runtime-promotion-bounded-write-authorization-response-branch-fixtures"')) {
    problems.push(`${reviewGatePath} missing branch fixture focused gate name`);
  }

  expect(template.operatorDecision, "REJECT_KEEP_MOCK", "template.operatorDecision");
  expect(template.confirmationCompleteness, "incomplete", "template.confirmationCompleteness");
  expect(template.boundedAttemptExecutableNow, false, "template.boundedAttemptExecutableNow");
  expect(template.writeGateExecutableNow, false, "template.writeGateExecutableNow");
  expect(template.publicDataSource, "mock", "template.publicDataSource");
  expect(template.scoreSource, "mock", "template.scoreSource");
}

function runValidator(args) {
  const run = spawnSync(process.execPath, [validatorPath, ...args], {
    cwd: process.cwd(),
    encoding: "utf8",
    shell: false,
    timeout: 120000,
    windowsHide: true
  });
  if (run.status !== 0) problems.push(`${validatorPath} ${args.join(" ")} exited ${run.status}: ${run.stderr || run.stdout}`);
  try {
    return JSON.parse(run.stdout);
  } catch (error) {
    problems.push(`${validatorPath} ${args.join(" ")} did not emit JSON: ${error.message}`);
    return {};
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
