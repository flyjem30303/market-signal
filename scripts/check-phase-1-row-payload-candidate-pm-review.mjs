import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";

const scriptPath = "scripts/run-phase-1-row-payload-candidate-pm-review-once.mjs";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const problems = [];

const missingRun = runPmReview([]);
expect(missingRun.output.status, "phase_1_row_payload_candidate_pm_review_blocked", "missing path status");
expect(missingRun.output.candidateArtifactPathProvided, false, "missing path flag");
if (!missingRun.output.problems?.includes("candidate_artifact_path_missing")) {
  problems.push("missing path run must report candidate_artifact_path_missing");
}

const fixturePath = writeFixture();
const acceptedRun = runPmReview(["--candidate-artifact", fixturePath]);
expect(
  acceptedRun.output.status,
  "phase_1_row_payload_candidate_pm_review_ready_for_separate_write_review",
  "accepted path status"
);
expect(acceptedRun.output.candidateArtifactPathProvided, true, "accepted path flag");
expect(acceptedRun.output.decision, "candidate_validated_keep_execution_separate", "accepted decision");
expect(acceptedRun.output.safety?.publicDataSource, "mock", "publicDataSource");
expect(acceptedRun.output.safety?.scoreSource, "mock", "scoreSource");
expect(acceptedRun.output.safety?.rowPayloadOutput, false, "rowPayloadOutput");
expect(acceptedRun.output.safety?.supabaseWriteAttempted, false, "supabaseWriteAttempted");

for (const id of [
  "validate_candidate_artifact",
  "check_data_online_go_no_go",
  "run_write_runner_implementation_candidate"
]) {
  if (!acceptedRun.output.commandResults?.some((result) => result.id === id)) {
    problems.push(`accepted run missing command result ${id}`);
  }
}

const packageJson = JSON.parse(fs.readFileSync(packagePath, "utf8"));
if (
  packageJson.scripts?.["run:phase-1-row-payload-candidate-pm-review-once"] !==
  "node scripts/run-phase-1-row-payload-candidate-pm-review-once.mjs"
) {
  problems.push(`${packagePath} missing run:phase-1-row-payload-candidate-pm-review-once`);
}
if (
  packageJson.scripts?.["check:phase-1-row-payload-candidate-pm-review"] !==
  "node scripts/check-phase-1-row-payload-candidate-pm-review.mjs"
) {
  problems.push(`${packagePath} missing check:phase-1-row-payload-candidate-pm-review`);
}

const reviewGate = fs.readFileSync(reviewGatePath, "utf8");
if (!reviewGate.includes("scripts/check-phase-1-row-payload-candidate-pm-review.mjs")) {
  problems.push(`${reviewGatePath} missing PM review checker command`);
}
if (!reviewGate.includes('"phase-1-row-payload-candidate-pm-review"')) {
  problems.push(`${reviewGatePath} missing PM review checker name`);
}

console.log(
  JSON.stringify(
    {
      status: problems.length === 0 ? "ok" : "blocked",
      guardedStatus:
        problems.length === 0
          ? "phase_1_row_payload_candidate_pm_review_checker_ready"
          : "phase_1_row_payload_candidate_pm_review_checker_blocked",
      missingPathStatus: missingRun.output.status ?? null,
      acceptedPathStatus: acceptedRun.output.status ?? null,
      acceptedCommandCount: acceptedRun.output.commandResults?.length ?? 0,
      safety: {
        sqlExecuted: false,
        supabaseConnected: false,
        supabaseWriteAttempted: false,
        marketDataFetched: false,
        rowPayloadOutput: false,
        rawPayloadOutput: false,
        secretsOutput: false,
        publicDataSource: "mock",
        scoreSource: "mock"
      },
      problems
    },
    null,
    2
  )
);

process.exitCode = 0;

function runPmReview(args) {
  const run = spawnSync(process.execPath, [scriptPath, ...args], {
    cwd: process.cwd(),
    encoding: "utf8",
    shell: false,
    timeout: 120000,
    windowsHide: true
  });
  return {
    status: run.status,
    output: parseJson(run.stdout, scriptPath)
  };
}

function writeFixture() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "phase-1-row-payload-pm-review-"));
  const rows = [];
  for (const [symbol, count] of [
    ["TWII", 60],
    ["0050", 59],
    ["006208", 59]
  ]) {
    for (let index = 1; index <= count; index += 1) {
      const date = new Date(Date.UTC(2026, 0, index));
      rows.push({
        symbol,
        trade_date: date.toISOString().slice(0, 10),
        close: 100 + index,
        source_name: "synthetic_fixture",
        source_updated_at: "2026-06-15T00:00:00.000Z",
        source_row_hash: `${symbol}-${index}`
      });
    }
  }
  const fixturePath = path.join(dir, "candidate.json");
  fs.writeFileSync(
    fixturePath,
    JSON.stringify(
      {
        artifactId: "phase-1-row-payload-pm-review-synthetic-fixture",
        createdAt: "2026-06-15T00:00:00.000Z",
        scope: "twii_and_etf_phase_1_missing_row_closure_only",
        sourceRightsStatus: "accepted",
        fieldContractStatus: "accepted",
        sanitizedRowPayloadIncluded: true,
        rawPayloadIncluded: false,
        stockIdPayloadIncluded: false,
        secretsIncluded: false,
        expectedRows: 178,
        rows
      },
      null,
      2
    )
  );
  return fixturePath;
}

function parseJson(text, label) {
  try {
    return JSON.parse(text);
  } catch (error) {
    problems.push(`${label} output unreadable: ${error.message}`);
    return {};
  }
}

function expect(actual, expected, label) {
  if (actual !== expected) {
    problems.push(`${label}: expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
  }
}
