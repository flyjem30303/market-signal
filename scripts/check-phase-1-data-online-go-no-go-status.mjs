import { spawnSync } from "node:child_process";
import fs from "node:fs";

const docPath = "docs/PHASE_1_DATA_ONLINE_GO_NO_GO_STATUS.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const publicBetaReportPath = "scripts/report-public-beta-data-realification-next-action.mjs";
const twiiOperatorReportPath = "scripts/report-twii-final-operator-authorization-packet-preflight.mjs";
const writeRunnerCandidatePath = "scripts/run-phase-1-write-runner-implementation-candidate.mjs";

const args = parseArgs(process.argv.slice(2));
const candidateArtifactPath =
  args.candidateArtifact ?? process.env.PHASE_1_SANITIZED_ROW_PAYLOAD_CANDIDATE_PATH ?? null;
const problems = [];

const doc = readText(docPath);
const packageJson = JSON.parse(readText(packagePath));
const reviewGate = readText(reviewGatePath);
const publicBetaReport = runJson(publicBetaReportPath);
const twiiOperatorReport = runJson(twiiOperatorReportPath);
const writeRunnerCandidate = runJson(
  writeRunnerCandidatePath,
  candidateArtifactPath ? ["--candidate-artifact", candidateArtifactPath] : []
);

for (const phrase of [
  "phase_1_data_online_go_no_go_status_ready_no_go",
  "PUBLIC_RUNTIME_READY_BUT_DATA_ONLINE_NO_GO",
  "NO_GO_FOR_DATA_ONLINE",
  "Level 1 coverage is still `182/360`",
  "Missing Level 1 rows remain `178/360`",
  "TWII still needs `60` sanitized row-payload rows",
  "ETF coverage still needs `118` sanitized row-payload rows",
  "non-committed sanitized row-payload candidate artifact covering all `178` missing rows",
  "publicDataSource=mock",
  "scoreSource=mock",
  "check:twse-openapi-runtime-mock-consumer-wire",
  "report:twii-final-operator-authorization-packet-preflight",
  "run:phase-1-write-runner-implementation-candidate",
  "candidate_row_payloads_missing",
  "authorizationDecisionAcceptedNow=false",
  "runnerExecutableNow=false",
  "writeGateExecutableNow=false",
  "phase_1_data_online_no_go_status_then_request_sanitized_row_payload_candidate"
]) {
  if (!doc.includes(phrase)) problems.push(`${docPath} missing phrase: ${phrase}`);
}

if (
  packageJson.scripts?.["check:phase-1-data-online-go-no-go-status"] !==
  "node scripts/check-phase-1-data-online-go-no-go-status.mjs"
) {
  problems.push(`${packagePath} missing check:phase-1-data-online-go-no-go-status`);
}

if (!reviewGate.includes("scripts/check-phase-1-data-online-go-no-go-status.mjs")) {
  problems.push(`${reviewGatePath} missing checker command`);
}

if (!reviewGate.includes('"phase-1-data-online-go-no-go-status"')) {
  problems.push(`${reviewGatePath} missing focused gate name`);
}

const expectedCoverage = {
  fullLevel1ExpectedRows: 360,
  fullLevel1ObservedRows: 182,
  fullLevel1MissingRows: 178,
  twEquityObservedRows: 180,
  twEquityExpectedRows: 180,
  twiiMissingRows: 60,
  etfMissingRows: 118
};

for (const [key, value] of Object.entries(expectedCoverage)) {
  if (publicBetaReport.coverage?.[key] !== value) {
    problems.push(`public beta coverage ${key} must be ${value}`);
  }
}

if (publicBetaReport.sourceBoundary?.publicDataSource !== "mock") {
  problems.push("publicDataSource must remain mock");
}

if (publicBetaReport.sourceBoundary?.scoreSource !== "mock") {
  problems.push("scoreSource must remain mock");
}

if (publicBetaReport.sourceBoundary?.realDataDisplayActive !== false) {
  problems.push("realDataDisplayActive must be false");
}

if (publicBetaReport.sourceBoundary?.realScoreActive !== false) {
  problems.push("realScoreActive must be false");
}

if (twiiOperatorReport.operatorAuthorizationPacketState?.authorizationDecisionAcceptedNow !== false) {
  problems.push("TWII authorizationDecisionAcceptedNow must remain false");
}

if (twiiOperatorReport.operatorAuthorizationPacketState?.runnerExecutableNow !== false) {
  problems.push("TWII runnerExecutableNow must remain false");
}

if (twiiOperatorReport.operatorAuthorizationPacketState?.writeGateExecutableNow !== false) {
  problems.push("TWII writeGateExecutableNow must remain false");
}

if (!candidateArtifactPath && writeRunnerCandidate.status !== "blocked") {
  problems.push("write runner candidate must remain blocked before row-payload candidate");
}

if (!candidateArtifactPath && !writeRunnerCandidate.blockedReasons?.includes("candidate_row_payloads_missing")) {
  problems.push("write runner candidate must report candidate_row_payloads_missing");
}

if (!candidateArtifactPath && writeRunnerCandidate.rowPayloadStatus?.rowPayloadCandidatePathProvided !== false) {
  problems.push("row payload candidate path must be absent in default no-go check");
}

if (writeRunnerCandidate.rowPayloadStatus?.twiiRowPayloadIncluded !== false) {
  problems.push("TWII aggregate candidate must not include row payload");
}

if (writeRunnerCandidate.rowPayloadStatus?.etfRowPayloadIncluded !== false) {
  problems.push("ETF aggregate candidate must not include row payload");
}

for (const [key, value] of Object.entries(publicBetaReport.hardStops ?? {})) {
  if (value !== false) problems.push(`hardStops.${key} must be false`);
}

for (const pattern of [
  /sb_secret_/u,
  /SUPABASE_SERVICE_ROLE_KEY\s*=/u,
  /executeSwitchValue/u,
  /confirmationPhraseValue/u,
  /rowBody/u,
  /rawPayload/u,
  /buySellHoldSignal/u,
  /guaranteed return/iu
]) {
  if (pattern.test(doc)) problems.push(`${docPath} contains forbidden pattern ${pattern}`);
}

const status = problems.length === 0 ? "ok" : "blocked";
const rowPayloadCandidateAccepted = writeRunnerCandidate.rowPayloadStatus?.rowPayloadCandidateAccepted === true;
const decision = rowPayloadCandidateAccepted
  ? "PUBLIC_RUNTIME_READY_ROW_PAYLOAD_CANDIDATE_READY_WRITE_REVIEW_REQUIRED"
  : "PUBLIC_RUNTIME_READY_BUT_DATA_ONLINE_NO_GO";
const guardedStatus = rowPayloadCandidateAccepted
  ? "phase_1_data_online_candidate_ready_write_review_required"
  : "phase_1_data_online_go_no_go_status_ready_no_go";

console.log(
  JSON.stringify(
    {
      status,
      guardedStatus,
      decision,
      coverage: expectedCoverage,
      rowPayloadCandidate: {
        status: writeRunnerCandidate.status ?? null,
        blockedReasons: writeRunnerCandidate.blockedReasons ?? [],
        nextRoute: writeRunnerCandidate.nextRoute ?? null,
        pathProvided: writeRunnerCandidate.rowPayloadStatus?.rowPayloadCandidatePathProvided ?? null,
        accepted: rowPayloadCandidateAccepted,
        rowCount: writeRunnerCandidate.rowPayloadStatus?.rowPayloadCandidateRowCount ?? null,
        symbolsCovered: writeRunnerCandidate.rowPayloadStatus?.rowPayloadCandidateSymbolsCovered ?? [],
        symbolCounts: writeRunnerCandidate.rowPayloadStatus?.rowPayloadCandidateSymbolCounts ?? null,
        dateBounds: writeRunnerCandidate.rowPayloadStatus?.rowPayloadCandidateDateBounds ?? null,
        duplicateCount: writeRunnerCandidate.rowPayloadStatus?.rowPayloadCandidateDuplicateCount ?? null,
        missingRequiredFieldCount:
          writeRunnerCandidate.rowPayloadStatus?.rowPayloadCandidateMissingRequiredFieldCount ?? null,
        forbiddenFieldCount: writeRunnerCandidate.rowPayloadStatus?.rowPayloadCandidateForbiddenFieldCount ?? null,
        invalidTradeDateCount:
          writeRunnerCandidate.rowPayloadStatus?.rowPayloadCandidateInvalidTradeDateCount ?? null,
        invalidSourceMetadataCount:
          writeRunnerCandidate.rowPayloadStatus?.rowPayloadCandidateInvalidSourceMetadataCount ?? null,
        invalidOptionalNumberCount:
          writeRunnerCandidate.rowPayloadStatus?.rowPayloadCandidateInvalidOptionalNumberCount ?? null,
        expectedRows: 178,
        expectedSymbolCounts: {
          TWII: 60,
          "0050": 59,
          "006208": 59
        }
      },
      publicDataSource: publicBetaReport.sourceBoundary?.publicDataSource,
      scoreSource: publicBetaReport.sourceBoundary?.scoreSource,
      twiiExecutionAllowedNow: twiiOperatorReport.operatorAuthorizationPacketState?.executionAllowedNow,
      problems
    },
    null,
    2
  )
);

if (status !== "ok") process.exit(1);

function parseArgs(tokens) {
  const parsed = {};
  for (let index = 0; index < tokens.length; index += 1) {
    const token = tokens[index];
    if (!token.startsWith("--")) continue;
    const key = token.slice(2).replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
    const next = tokens[index + 1];
    if (!next || next.startsWith("--")) {
      parsed[key] = true;
      continue;
    }
    parsed[key] = next;
    index += 1;
  }
  return parsed;
}

function readText(path) {
  if (!fs.existsSync(path)) {
    problems.push(`missing ${path}`);
    return "{}";
  }

  return fs.readFileSync(path, "utf8");
}

function runJson(scriptPath, scriptArgs = []) {
  const run = spawnSync(process.execPath, [scriptPath, ...scriptArgs], {
    encoding: "utf8",
    maxBuffer: 1024 * 1024 * 2
  });

  if (run.status !== 0) problems.push(`${scriptPath} exited ${run.status}`);

  try {
    return JSON.parse(run.stdout);
  } catch {
    problems.push(`${scriptPath} did not emit JSON`);
    return {};
  }
}
