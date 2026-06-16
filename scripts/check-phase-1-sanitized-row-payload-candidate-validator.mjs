import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";

const validatorPath = "scripts/validate-phase-1-sanitized-row-payload-candidate-artifact.mjs";
const dataOnlineGoNoGoPath = "scripts/check-phase-1-data-online-go-no-go-status.mjs";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const problems = [];

const validatorSource = readText(validatorPath);
const packageJson = JSON.parse(readText(packagePath));
const reviewGate = readText(reviewGatePath);
const missingRun = runValidator("__missing__/phase-1-row-payload.json");
const fixturePath = writeFixture();
const fixtureRun = runValidator(fixturePath);
const dataOnlineCandidateRun = runScript(dataOnlineGoNoGoPath, ["--candidate-artifact", fixturePath]);
const badDatePath = writeFixture({ invalidDate: true });
const badDateRun = runValidator(badDatePath);
const badSourceMetadataPath = writeFixture({ invalidSourceMetadata: true });
const badSourceMetadataRun = runValidator(badSourceMetadataPath);
const badOptionalNumberPath = writeFixture({ invalidOptionalNumber: true });
const badOptionalNumberRun = runValidator(badOptionalNumberPath);
const wrongCountPath = writeFixture({ wrongSymbolCounts: true });
const wrongCountRun = runValidator(wrongCountPath);
const unacceptedStatusPath = writeFixture({ unacceptedStatus: true });
const unacceptedStatusRun = runValidator(unacceptedStatusPath);
const committedCandidateFolderPath = writeCommittedCandidateFolderFixture();
const committedCandidateFolderRun = runValidator(committedCandidateFolderPath);
cleanupFile(committedCandidateFolderPath);
const unignoredRepositoryPath = writeUnignoredRepositoryFixture();
const unignoredRepositoryRun = runValidator(unignoredRepositoryPath);
cleanupFile(unignoredRepositoryPath);

validateMissingRun();
validateFixtureRun();
validateDataOnlineCandidateRun();
validateBadDateRun();
validateBadSourceMetadataRun();
validateBadOptionalNumberRun();
validateWrongCountRun();
validateUnacceptedStatusRun();
validateCommittedCandidateFolderRun();
validateUnignoredRepositoryRun();
validateRegistration();
validateBoundaries();

const ok = problems.length === 0;
console.log(
  JSON.stringify(
    {
      status: ok ? "ok" : "blocked",
      guardedStatus: ok
        ? "phase_1_sanitized_row_payload_candidate_validator_ready_no_committed_market_rows"
        : "phase_1_sanitized_row_payload_candidate_validator_blocked",
      validatorMode: "aggregate_only_no_row_output",
      fixtureAccepted: fixtureRun.output.accepted ?? false,
      dataOnlineCandidateReady: dataOnlineCandidateRun.output.rowPayloadCandidate?.accepted ?? false,
      badDateAccepted: badDateRun.output.accepted ?? false,
      badSourceMetadataAccepted: badSourceMetadataRun.output.accepted ?? false,
      badOptionalNumberAccepted: badOptionalNumberRun.output.accepted ?? false,
      wrongCountAccepted: wrongCountRun.output.accepted ?? false,
      unacceptedStatusAccepted: unacceptedStatusRun.output.accepted ?? false,
      committedCandidateFolderAccepted: committedCandidateFolderRun.output.accepted ?? false,
      unignoredRepositoryAccepted: unignoredRepositoryRun.output.accepted ?? false,
      missingPathStatus: missingRun.output.status ?? null,
      publicDataSource: "mock",
      scoreSource: "mock",
      problems
    },
    null,
    2
  )
);

if (!ok) process.exit(1);

function validateMissingRun() {
  expect(missingRun.status, 0, "missing run exit status");
  expect(missingRun.output.status, "phase_1_sanitized_row_payload_candidate_artifact_blocked", "missing status");
  expect(missingRun.output.accepted, false, "missing accepted");
  expectIncludes(missingRun.output.problems, "candidate_artifact_unreadable", "missing problems");
}

function validateFixtureRun() {
  expect(fixtureRun.status, 0, "fixture run exit status");
  expect(
    fixtureRun.output.status,
    "phase_1_sanitized_row_payload_candidate_artifact_validated_aggregate_only",
    "fixture status"
  );
  expect(fixtureRun.output.validatorMode, "aggregate_only_no_row_output", "validatorMode");
  expect(fixtureRun.output.rowCount, 178, "rowCount");
  expect(fixtureRun.output.expectedRows, 178, "expectedRows");
  expect(fixtureRun.output.duplicateCount, 0, "duplicateCount");
  expect(fixtureRun.output.missingRequiredFieldCount, 0, "missingRequiredFieldCount");
  expect(fixtureRun.output.forbiddenFieldCount, 0, "forbiddenFieldCount");
  expect(fixtureRun.output.invalidTradeDateCount, 0, "invalidTradeDateCount");
  expect(fixtureRun.output.invalidSourceMetadataCount, 0, "invalidSourceMetadataCount");
  expect(fixtureRun.output.invalidOptionalNumberCount, 0, "invalidOptionalNumberCount");
  expect(fixtureRun.output.accepted, true, "accepted");
  for (const symbol of ["0050", "006208", "TWII"]) expectIncludes(fixtureRun.output.symbolsCovered, symbol, "symbolsCovered");
  expect(fixtureRun.output.symbolCounts?.TWII, 60, "TWII symbol count");
  expect(fixtureRun.output.symbolCounts?.["0050"], 59, "0050 symbol count");
  expect(fixtureRun.output.symbolCounts?.["006208"], 59, "006208 symbol count");
  for (const key of [
    "rowPayloadOutput",
    "rawPayloadOutput",
    "stockIdPayloadOutput",
    "secretsOutput",
    "sqlExecuted",
    "supabaseClientImported",
    "supabaseConnectionAttempted",
    "supabaseWriteAttempted",
    "dailyPricesMutated"
  ]) {
    expect(fixtureRun.output.safety?.[key], false, `fixture safety.${key}`);
  }
  expect(fixtureRun.output.safety?.publicDataSource, "mock", "fixture publicDataSource");
  expect(fixtureRun.output.safety?.scoreSource, "mock", "fixture scoreSource");
  expect(fixtureRun.output.candidatePathPolicy?.insideRepository, false, "fixture outside repository");
}

function validateDataOnlineCandidateRun() {
  expect(dataOnlineCandidateRun.status, 0, "data-online candidate run exit status");
  expect(dataOnlineCandidateRun.output.status, "ok", "data-online candidate status");
  expect(
    dataOnlineCandidateRun.output.guardedStatus,
    "phase_1_data_online_go_no_go_status_coverage_complete_promotion_pending",
    "data-online candidate guardedStatus"
  );
  expect(
    dataOnlineCandidateRun.output.decision,
    "DATA_COVERAGE_COMPLETE_BUT_RUNTIME_PROMOTION_NO_GO",
    "data-online candidate decision"
  );
  expect(dataOnlineCandidateRun.output.accepted, true, "data-online accepted");
  expect(dataOnlineCandidateRun.output.coverage?.acceptedCoverageRows, 178, "data-online acceptedCoverageRows");
  expect(dataOnlineCandidateRun.output.coverage?.insertedRows, 176, "data-online insertedRows");
  expect(dataOnlineCandidateRun.output.coverage?.skippedExistingRows, 2, "data-online skippedExistingRows");
  expect(dataOnlineCandidateRun.output.coverage?.missingRowsAfterWrite, 0, "data-online missingRowsAfterWrite");
  expect(dataOnlineCandidateRun.output.runtimePromotionAllowedNow, false, "data-online promotion remains blocked");
  expect(dataOnlineCandidateRun.output.publicDataSource, "mock", "data-online candidate publicDataSource");
  expect(dataOnlineCandidateRun.output.scoreSource, "mock", "data-online candidate scoreSource");
}

function validateBadDateRun() {
  expect(badDateRun.status, 0, "bad-date run exit status");
  expect(badDateRun.output.status, "phase_1_sanitized_row_payload_candidate_artifact_blocked", "bad-date status");
  expect(badDateRun.output.accepted, false, "bad-date accepted");
  expectIncludes(badDateRun.output.problems, "invalid_trade_date", "bad-date problems");
  if (!(badDateRun.output.invalidTradeDateCount > 0)) problems.push("bad-date invalidTradeDateCount must be > 0");
}

function validateBadSourceMetadataRun() {
  expect(badSourceMetadataRun.status, 0, "bad-source-metadata run exit status");
  expect(
    badSourceMetadataRun.output.status,
    "phase_1_sanitized_row_payload_candidate_artifact_blocked",
    "bad-source-metadata status"
  );
  expect(badSourceMetadataRun.output.accepted, false, "bad-source-metadata accepted");
  expectIncludes(badSourceMetadataRun.output.problems, "invalid_source_metadata", "bad-source-metadata problems");
  if (!(badSourceMetadataRun.output.invalidSourceMetadataCount > 0)) {
    problems.push("bad-source-metadata invalidSourceMetadataCount must be > 0");
  }
}

function validateBadOptionalNumberRun() {
  expect(badOptionalNumberRun.status, 0, "bad-optional-number run exit status");
  expect(
    badOptionalNumberRun.output.status,
    "phase_1_sanitized_row_payload_candidate_artifact_blocked",
    "bad-optional-number status"
  );
  expect(badOptionalNumberRun.output.accepted, false, "bad-optional-number accepted");
  expectIncludes(badOptionalNumberRun.output.problems, "invalid_optional_number_fields", "bad-optional-number problems");
  if (!(badOptionalNumberRun.output.invalidOptionalNumberCount > 0)) {
    problems.push("bad-optional-number invalidOptionalNumberCount must be > 0");
  }
}

function validateWrongCountRun() {
  expect(wrongCountRun.status, 0, "wrong-count run exit status");
  expect(wrongCountRun.output.status, "phase_1_sanitized_row_payload_candidate_artifact_blocked", "wrong-count status");
  expect(wrongCountRun.output.accepted, false, "wrong-count accepted");
  expectIncludes(wrongCountRun.output.problems, "symbol_count_mismatch:TWII", "wrong-count TWII problems");
  expectIncludes(wrongCountRun.output.problems, "symbol_count_mismatch:0050", "wrong-count 0050 problems");
}

function validateUnacceptedStatusRun() {
  expect(unacceptedStatusRun.status, 0, "unaccepted-status run exit status");
  expect(
    unacceptedStatusRun.output.status,
    "phase_1_sanitized_row_payload_candidate_artifact_blocked",
    "unaccepted-status status"
  );
  expect(unacceptedStatusRun.output.accepted, false, "unaccepted-status accepted");
  expectIncludes(unacceptedStatusRun.output.problems, "source_rights_status_not_accepted", "unaccepted-status source rights");
  expectIncludes(unacceptedStatusRun.output.problems, "field_contract_status_not_accepted", "unaccepted-status field contract");
}

function validateCommittedCandidateFolderRun() {
  expect(committedCandidateFolderRun.status, 0, "committed-candidate-folder run exit status");
  expect(
    committedCandidateFolderRun.output.status,
    "phase_1_sanitized_row_payload_candidate_artifact_blocked",
    "committed-candidate-folder status"
  );
  expect(committedCandidateFolderRun.output.accepted, false, "committed-candidate-folder accepted");
  expectIncludes(
    committedCandidateFolderRun.output.problems,
    "candidate_artifact_path_must_stay_outside_data_candidates",
    "committed-candidate-folder problems"
  );
  expect(
    committedCandidateFolderRun.output.candidatePathPolicy?.insideCommittedCandidateFolder,
    true,
    "committed-candidate-folder path policy"
  );
}

function validateUnignoredRepositoryRun() {
  expect(unignoredRepositoryRun.status, 0, "unignored-repository run exit status");
  expect(
    unignoredRepositoryRun.output.status,
    "phase_1_sanitized_row_payload_candidate_artifact_blocked",
    "unignored-repository status"
  );
  expect(unignoredRepositoryRun.output.accepted, false, "unignored-repository accepted");
  expectIncludes(
    unignoredRepositoryRun.output.problems,
    "candidate_artifact_path_must_be_outside_git_or_ignored",
    "unignored-repository problems"
  );
  expect(unignoredRepositoryRun.output.candidatePathPolicy?.insideRepository, true, "unignored-repository inside repo");
  expect(unignoredRepositoryRun.output.candidatePathPolicy?.gitIgnored, false, "unignored-repository git ignored");
}

function validateRegistration() {
  if (
    packageJson.scripts?.["validate:phase-1-sanitized-row-payload-candidate-artifact"] !==
    "node scripts/validate-phase-1-sanitized-row-payload-candidate-artifact.mjs"
  ) {
    problems.push("package.json missing validate:phase-1-sanitized-row-payload-candidate-artifact");
  }
  if (
    packageJson.scripts?.["check:phase-1-sanitized-row-payload-candidate-validator"] !==
    "node scripts/check-phase-1-sanitized-row-payload-candidate-validator.mjs"
  ) {
    problems.push("package.json missing check:phase-1-sanitized-row-payload-candidate-validator");
  }
  if (!reviewGate.includes("scripts/check-phase-1-sanitized-row-payload-candidate-validator.mjs")) {
    problems.push("review gate missing row-payload candidate validator checker");
  }
  if (!reviewGate.includes('"phase-1-sanitized-row-payload-candidate-validator"')) {
    problems.push("focused review gate missing row-payload candidate validator checker");
  }
}

function validateBoundaries() {
  for (const pattern of [
    /@supabase\/supabase-js/u,
    /createClient\s*\(/u,
    /\.from\s*\(/u,
    /\.insert\s*\(/u,
    /\.update\s*\(/u,
    /\.delete\s*\(/u,
    /\.upsert\s*\(/u,
    /\bsb_(publishable|secret|anon|service_role)_[a-z0-9_-]+/iu,
    /publicDataSource"\s*:\s*"supabase"/u,
    /scoreSource"\s*:\s*"real"/u,
    /dailyPricesMutated"\s*:\s*true/u,
    /supabaseWriteAttempted"\s*:\s*true/u
  ]) {
    if (pattern.test(validatorSource)) problems.push(`${validatorPath} contains forbidden pattern ${pattern}`);
  }
}

function writeFixture(options = {}) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "phase-1-row-payload-fixture-"));
  const rows = [];
  const counts = options.wrongSymbolCounts
    ? [
        ["TWII", 59],
        ["0050", 60],
        ["006208", 59]
      ]
    : [
    ["TWII", 60],
    ["0050", 59],
    ["006208", 59]
      ];
  for (const [symbol, count] of counts) {
    for (let index = 1; index <= count; index += 1) {
      const date = new Date(Date.UTC(2026, 0, index));
      rows.push({
        symbol,
        trade_date: options.invalidDate && symbol === "TWII" && index === 60
          ? "2026-02-30"
          : date.toISOString().slice(0, 10),
        close: 100 + index,
        source_name: options.invalidSourceMetadata && symbol === "TWII" && index === 1 ? "" : "synthetic_fixture",
        source_updated_at: options.invalidSourceMetadata && symbol === "TWII" && index === 2
          ? "2026-06-15"
          : "2026-06-15T00:00:00.000Z",
        source_row_hash: options.invalidSourceMetadata && symbol === "TWII" && index === 3 ? "" : `${symbol}-${index}`,
        ...(options.invalidOptionalNumber && symbol === "0050" && index === 1 ? { volume: "bad-volume" } : {})
      });
    }
  }
  const artifact = {
    artifactId: "phase-1-row-payload-synthetic-fixture",
    createdAt: "2026-06-15T00:00:00.000Z",
    scope: "twii_and_etf_phase_1_missing_row_closure_only",
    sourceRightsStatus: options.unacceptedStatus ? "fixture_only_not_source_evidence" : "accepted",
    fieldContractStatus: options.unacceptedStatus ? "fixture_only_not_field_contract_evidence" : "accepted",
    sanitizedRowPayloadIncluded: true,
    rawPayloadIncluded: false,
    stockIdPayloadIncluded: false,
    secretsIncluded: false,
    expectedRows: 178,
    rows
  };
  const fixturePath = path.join(dir, "candidate.json");
  fs.writeFileSync(fixturePath, JSON.stringify(artifact, null, 2));
  return fixturePath;
}

function writeCommittedCandidateFolderFixture() {
  const fixturePath = path.join("data", "candidates", "__phase_1_row_payload_path_policy_fixture.json");
  fs.writeFileSync(fixturePath, JSON.stringify({ artifactId: "path-policy-fixture-no-rows" }, null, 2));
  return fixturePath;
}

function writeUnignoredRepositoryFixture() {
  const fixturePath = "__phase_1_row_payload_path_policy_fixture.json";
  fs.writeFileSync(fixturePath, JSON.stringify({ artifactId: "path-policy-fixture-no-rows" }, null, 2));
  return fixturePath;
}

function cleanupFile(filePath) {
  try {
    fs.unlinkSync(filePath);
  } catch {
    // Best effort cleanup for a local checker-only fixture.
  }
}

function runValidator(candidatePath) {
  return runScript(validatorPath, ["--candidate-artifact", candidatePath]);
}

function runScript(scriptPath, scriptArgs) {
  const run = spawnSync(process.execPath, [scriptPath, ...scriptArgs], {
    cwd: process.cwd(),
    encoding: "utf8",
    shell: false,
    timeout: 120000,
    windowsHide: true
  });
  return {
    status: run.status,
    output: parseJson(run.stdout, `${scriptPath} stdout`)
  };
}

function expect(actual, expected, label) {
  if (actual !== expected) problems.push(`${label} expected ${JSON.stringify(expected)} but got ${JSON.stringify(actual)}`);
}

function expectIncludes(actual, expected, label) {
  if (!Array.isArray(actual) || !actual.some((item) => String(item).includes(expected))) {
    problems.push(`${label} missing ${expected}`);
  }
}

function readText(filePath) {
  try {
    return fs.readFileSync(filePath, "utf8");
  } catch (error) {
    problems.push(`failed to read ${filePath}: ${error.message}`);
    return "{}";
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
