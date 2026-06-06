import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const intakeReportPath = "scripts/report-a1-tw-equity-candidate-artifact-intake.mjs";
const candidatePath = process.env.A1_TW_EQUITY_CANDIDATE_ARTIFACT_PATH ?? "data/candidates/tw-equity-staging-candidate.json";
const resolvedCandidatePath = path.resolve(process.cwd(), candidatePath);
const candidateArtifactProvided = fs.existsSync(resolvedCandidatePath);
const intake = runIntakeReport(candidatePath);
const intakeAccepted =
  candidateArtifactProvided &&
  intake.statusCode === 0 &&
  intake.output?.candidateArtifactAccepted === true &&
  intake.output?.validation?.candidateInputAccepted === true;

const report = {
  status: intakeAccepted
    ? "a1_tw_equity_candidate_artifact_self_check_ready_for_pm_intake_review"
    : "a1_tw_equity_candidate_artifact_self_check_blocked_candidate_artifact_not_provided",
  owner: "A1 self-check before PM integration intake",
  candidateArtifactPath: candidatePath,
  candidateArtifactProvided,
  readyForPmIntakeReview: intakeAccepted,
  pmIntakeCommand: "node scripts/report-a1-tw-equity-candidate-artifact-intake.mjs",
  checkerCommand: "node scripts/check-a1-tw-equity-candidate-artifact-self-check.mjs",
  intakeSummary: {
    statusCode: intake.statusCode,
    status: intake.output?.status ?? "blocked",
    candidateArtifactAccepted: intake.output?.candidateArtifactAccepted === true,
    candidateInputAccepted: intake.output?.validation?.candidateInputAccepted === true,
    candidateInputRunRows: intake.output?.validation?.candidateInputRunRows ?? 0,
    candidateInputPriceRows: intake.output?.validation?.candidateInputPriceRows ?? 0,
    problems: intake.output?.validation?.problems ?? intake.problems
  },
  nextAction: intakeAccepted
    ? "A1 may hand the artifact path to PM for intake review; this does not authorize staging write execution."
    : "A1 must provide one sanitized candidate artifact at the default path or set A1_TW_EQUITY_CANDIDATE_ARTIFACT_PATH before PM intake.",
  authorizationBoundary: {
    pmIntakeReviewAllowed: intakeAccepted,
    stagingWriteExecutionAllowed: false,
    passingSelfCheckMeans: "ready_for_pm_intake_review_only",
    stillRequires: [
      "PM intake review",
      "CEO named bounded staging write attempt",
      "exact command confirmation",
      "credentials posture check",
      "same-slice post-run review"
    ]
  },
  safety: {
    publicDataSource: "mock",
    scoreSource: "mock",
    sqlExecuted: false,
    realSupabaseConnectionAttempted: false,
    realSupabaseWrites: false,
    stagingRowsCreated: false,
    dailyPricesMutated: false,
    marketDataFetched: false,
    marketDataIngested: false,
    sourcePayloadsPrinted: false,
    rowPayloadsPrinted: false,
    secretsPrinted: false,
    serviceRoleKeyPrinted: false,
    publicPromotionAllowed: false,
    rowCoveragePointsAllowed: false,
    scoreSourceRealAllowed: false
  }
};

console.log(JSON.stringify(report, null, 2));

function runIntakeReport(inputPath) {
  const result = spawnSync(process.execPath, [intakeReportPath], {
    cwd: process.cwd(),
    encoding: "utf8",
    env: {
      ...process.env,
      A1_TW_EQUITY_CANDIDATE_ARTIFACT_PATH: inputPath
    },
    shell: false
  });

  return {
    statusCode: result.status,
    output: parseJson(result.stdout),
    problems: result.status === 0 ? [] : ["pm_intake_report_blocked"]
  };
}

function parseJson(text) {
  try {
    return JSON.parse(text);
  } catch {
    return {};
  }
}
