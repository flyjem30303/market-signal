import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";

const runnerPath = "scripts/run-phase-1-current-scope-sanitized-candidate-reply-intake-once.mjs";
const fixturesPath = "data/evidence-intake/phase-1-current-scope-sanitized-candidate-reply-fixtures-no-row-payloads.json";
const runnerDocPath = "docs/PHASE_1_CURRENT_SCOPE_SANITIZED_CANDIDATE_REPLY_INTAKE_RUNNER_NO_ROW_PAYLOADS.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const projectStatusPath = "PROJECT_STATUS.md";

const problems = [];
const fixturesRaw = read(fixturesPath);
const fixtures = parseJson(fixturesRaw, fixturesPath);
const runnerDoc = read(runnerDocPath);
const pkg = parseJson(read(packagePath), packagePath);
const reviewGate = read(reviewGatePath);
const projectStatus = read(projectStatusPath);
const runnerSource = read(runnerPath);

const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "market-signal-current-scope-reply-intake-"));
try {
  const acceptedReplyPath = path.join(tempDir, "accepted.fixture.json");
  fs.writeFileSync(acceptedReplyPath, JSON.stringify(fixtures.acceptedFixture, null, 2), "utf8");

  const missingRun = runRunner([]);
  const acceptedRun = runRunner(["--reply", acceptedReplyPath]);
  validateMissingRun(missingRun);
  validateAcceptedRun(acceptedRun);

  for (const fixture of fixtures.rejectedFixtures ?? []) {
    const replyPath = path.join(tempDir, `${fixture.label}.fixture.json`);
    fs.writeFileSync(replyPath, JSON.stringify(mergePatch(fixtures.acceptedFixture, fixture.patch ?? {}), null, 2), "utf8");
    validateRejectedRun(fixture, runRunner(["--reply", replyPath]));
  }

  validateStaticContracts();
  validateBoundaries();

  const ok = problems.length === 0;
  console.log(
    JSON.stringify(
      {
        status: ok ? "ok" : "blocked",
        guardedStatus: ok
          ? "phase_1_current_scope_sanitized_candidate_reply_intake_runner_no_row_payloads_ready"
          : "phase_1_current_scope_sanitized_candidate_reply_intake_runner_no_row_payloads_blocked",
        missingReplyFailsClosed: missingRun.status === "blocked",
        acceptedFixtureAccepted: acceptedRun.replyAcceptedNow === true,
        rejectedFixtureCount: fixtures.rejectedFixtures?.length ?? 0,
        candidateArtifactReadNow: false,
        candidateRowsAcceptedNow: false,
        publicDataSource: "mock",
        scoreSource: "mock",
        nextRoute: ok ? "use_runner_when_a1_or_pm_provides_current_scope_reply_json" : "keep_mock_and_repair_runner",
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

function validateMissingRun(run) {
  expect(run.exitCode, 1, "missing.exitCode");
  expect(run.status, "blocked", "missing.status");
  expect(run.replyAcceptedNow, false, "missing.replyAcceptedNow");
  expect(run.candidateArtifactReadNow, false, "missing.candidateArtifactReadNow");
  expect(run.nextRoute, "provide_current_scope_sanitized_candidate_reply_json", "missing.nextRoute");
}

function validateAcceptedRun(run) {
  expect(run.exitCode, 0, "accepted.exitCode");
  expect(run.status, "ok", "accepted.status");
  expect(run.replyAcceptedNow, true, "accepted.replyAcceptedNow");
  expect(run.candidateArtifactPathAcceptedNow, true, "accepted.candidateArtifactPathAcceptedNow");
  expect(run.candidateArtifactReadNow, false, "accepted.candidateArtifactReadNow");
  expect(run.candidateRowsAcceptedNow, false, "accepted.candidateRowsAcceptedNow");
  expect(run.publicDataSource, "mock", "accepted.publicDataSource");
  expect(run.scoreSource, "mock", "accepted.scoreSource");
  expect(run.nextRoute, "current_scope_sanitized_candidate_artifact_path_shape_ready_no_row_payloads", "accepted.nextRoute");
}

function validateRejectedRun(fixture, run) {
  expect(run.exitCode, 1, `${fixture.label}.exitCode`);
  expect(run.status, "blocked", `${fixture.label}.status`);
  expect(run.replyAcceptedNow, false, `${fixture.label}.replyAcceptedNow`);
  expect(run.candidateArtifactReadNow, false, `${fixture.label}.candidateArtifactReadNow`);
  if (!run.problems?.some((problem) => problem.includes(fixture.expectedProblem))) {
    problems.push(`${fixture.label} missing expected problem ${fixture.expectedProblem}`);
  }
}

function validateStaticContracts() {
  for (const [label, text, tokens] of [
    [
      runnerDocPath,
      runnerDoc,
      [
        "phase_1_current_scope_sanitized_candidate_reply_intake_runner_no_row_payloads_ready",
        "run:phase-1-current-scope-sanitized-candidate-reply-intake-once",
        "check:phase-1-current-scope-sanitized-candidate-reply-intake-runner-no-row-payloads",
        "--reply",
        "Only the reply JSON is read.",
        "The candidate artifact file is not opened.",
        "`publicDataSource=mock`",
        "`scoreSource=mock`"
      ]
    ],
    [
      projectStatusPath,
      projectStatus,
      [
        "Latest Phase 1 Current-Scope Candidate Reply Intake Runner",
        "phase_1_current_scope_sanitized_candidate_reply_intake_runner_no_row_payloads_ready",
        "use_runner_when_a1_or_pm_provides_current_scope_reply_json"
      ]
    ]
  ]) {
    for (const token of tokens) if (!text.includes(token)) problems.push(`${label} missing token ${token}`);
  }

  if (
    pkg.scripts?.["run:phase-1-current-scope-sanitized-candidate-reply-intake-once"] !==
    "node scripts/run-phase-1-current-scope-sanitized-candidate-reply-intake-once.mjs"
  ) {
    problems.push(`${packagePath} missing run:phase-1-current-scope-sanitized-candidate-reply-intake-once`);
  }
  if (
    pkg.scripts?.["check:phase-1-current-scope-sanitized-candidate-reply-intake-runner-no-row-payloads"] !==
    "node scripts/check-phase-1-current-scope-sanitized-candidate-reply-intake-runner-no-row-payloads.mjs"
  ) {
    problems.push(`${packagePath} missing check:phase-1-current-scope-sanitized-candidate-reply-intake-runner-no-row-payloads`);
  }
  if (!reviewGate.includes("scripts/check-phase-1-current-scope-sanitized-candidate-reply-intake-runner-no-row-payloads.mjs")) {
    problems.push(`${reviewGatePath} missing current-scope reply intake runner checker`);
  }
  if (!reviewGate.includes('"phase-1-current-scope-sanitized-candidate-reply-intake-runner-no-row-payloads"')) {
    problems.push(`${reviewGatePath} missing current-scope reply intake runner focused gate`);
  }
}

function validateBoundaries() {
  for (const [label, text] of [
    [runnerPath, runnerSource],
    [runnerDocPath, runnerDoc]
  ]) {
    for (const pattern of forbiddenPatterns()) {
      if (pattern.test(text)) problems.push(`${label} contains forbidden pattern ${pattern}`);
    }
  }
  if (runnerSource.includes("fs.readFileSync(reply.candidateArtifactPath")) {
    problems.push(`${runnerPath} must not read candidateArtifactPath`);
  }
}

function runRunner(args) {
  const run = spawnSync(process.execPath, [runnerPath, ...args], {
    cwd: process.cwd(),
    encoding: "utf8",
    shell: false,
    timeout: 120000,
    windowsHide: true
  });
  let parsed = {};
  try {
    parsed = JSON.parse(run.stdout);
  } catch (error) {
    problems.push(`${runnerPath} ${args.join(" ")} did not emit JSON: ${error.message}`);
  }
  return { ...parsed, exitCode: run.status };
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
    /candidateRowsAcceptedNow"\s*:\s*true/u,
    /candidateArtifactReadNow"\s*:\s*true/u,
    /SQL execution is approved/iu,
    /Supabase write is approved/iu,
    /guaranteed return/iu,
    /buy now/iu
  ];
}
