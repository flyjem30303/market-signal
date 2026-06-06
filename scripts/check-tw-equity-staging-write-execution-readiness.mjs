import fs from "node:fs";
import { spawnSync } from "node:child_process";

const problems = [];

const reportPath = "scripts/report-tw-equity-staging-write-execution-readiness.mjs";
const checkerPath = "scripts/check-tw-equity-staging-write-execution-readiness.mjs";
const runnerPath = "scripts/run-tw-equity-staging-write-once.mjs";
const statusPath = "PROJECT_STATUS.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const fullHealthPath = "scripts/check-localhost-full-health.mjs";
const readableStatusPath = "scripts/check-readable-current-status.mjs";

const reportSource = read(reportPath);
const checkerSource = read(checkerPath);
const runner = read(runnerPath);
const status = read(statusPath);
const pkg = JSON.parse(read(packagePath));
const reviewGate = read(reviewGatePath);
const fullHealth = read(fullHealthPath);
const readableStatus = read(readableStatusPath);

for (const phrase of [
  "tw_equity_staging_write_execution_readiness_blocked_candidate_artifact_missing",
  "tw_equity_staging_write_execution_ready_for_one_attempt",
  "accepted_sanitized_candidate_input_artifact_missing",
  "candidateArtifactReady",
  "candidatePreExecutionProbe",
  "pmCandidateIntakeReview",
  "readyForCeoBoundedWriteDecision",
  "name or reject exactly one bounded staging write attempt",
  "produce one accepted sanitized candidate input artifact",
  "publicDataSource: \"mock\"",
  "scoreSource: \"mock\"",
  "realSupabaseWrites: false",
  "stagingRowsCreated: false",
  "dailyPricesMutated: false",
  "marketDataFetched: false",
  "marketDataIngested: false",
  "scoreSourceRealAllowed: false"
]) {
  if (!reportSource.includes(phrase)) problems.push(`${reportPath} missing: ${phrase}`);
}

for (const phrase of [
  "tw_equity_staging_write_fail_closed_write_capable_runner",
  "writeImplementationReady: true",
  "executeBoundedStagingWrite",
  "createWriteClient"
]) {
  if (!runner.includes(phrase)) problems.push(`${runnerPath} missing: ${phrase}`);
}

for (const phrase of [
  "Latest TW equity staging write execution readiness slice",
  "scripts/report-tw-equity-staging-write-execution-readiness.mjs",
  "tw_equity_staging_write_execution_readiness_blocked_candidate_artifact_missing",
  "tw_equity_staging_write_execution_ready_for_one_attempt",
  "runner is write-capable but the accepted sanitized candidate input artifact is still missing",
  "PM intake review plus candidate pre-execution validation now show one accepted sanitized candidate input artifact",
  "actual bounded write is still not executed",
  "next owner is A1 Data / Supabase / Market Evidence",
  "No real Supabase connection, SQL, write, staging row, raw data, public promotion, row coverage point, or real score source occurred"
]) {
  if (!status.includes(phrase)) problems.push(`${statusPath} missing: ${phrase}`);
  if (!readableStatus.includes(phrase)) problems.push(`${readableStatusPath} missing: ${phrase}`);
}

if (
  pkg.scripts?.["report:tw-equity-staging-write-execution-readiness"] !==
  "node scripts/report-tw-equity-staging-write-execution-readiness.mjs"
) {
  problems.push("package.json missing report:tw-equity-staging-write-execution-readiness");
}

if (
  pkg.scripts?.["check:tw-equity-staging-write-execution-readiness"] !==
  "node scripts/check-tw-equity-staging-write-execution-readiness.mjs"
) {
  problems.push("package.json missing check:tw-equity-staging-write-execution-readiness");
}

for (const [pathName, text] of [
  [reviewGatePath, reviewGate],
  [fullHealthPath, fullHealth]
]) {
  if (!text.includes("scripts/check-tw-equity-staging-write-execution-readiness.mjs")) {
    problems.push(`${pathName} missing staging write execution readiness checker`);
  }
  if (!text.includes("tw-equity-staging-write-execution-readiness")) {
    problems.push(`${pathName} missing tw-equity-staging-write-execution-readiness name`);
  }
}

if (!reviewGate.includes('"tw-equity-staging-write-execution-readiness"')) {
  problems.push("review gate core set missing tw-equity-staging-write-execution-readiness");
}

for (const [pathName, text] of [[reportPath, reportSource]]) {
  for (const pattern of [
    /\bfetch\s*\(/u,
    /\.insert\(/u,
    /\.update\(/u,
    /\.delete\(/u,
    /\.upsert\(/u,
    /await import\("@supabase\/supabase-js"\)/u,
    /sb_secret_/u,
    /sb_publishable_/u
  ]) {
    if (pattern.test(text)) problems.push(`${pathName} contains forbidden token: ${pattern}`);
  }
}

const result = spawnSync(process.execPath, [reportPath], {
  cwd: process.cwd(),
  encoding: "utf8",
  shell: false
});

if (result.status !== 0) {
  problems.push(`${reportPath} must exit 0`);
} else {
  const report = parseJson(result.stdout);
  if (report.status !== "tw_equity_staging_write_execution_ready_for_one_attempt") {
    problems.push("report must become ready when accepted candidate artifact exists");
  }
  if (report.implementationReady !== true) problems.push("report must show implementationReady true");
  if (report.candidateArtifactReady !== true) problems.push("report must show candidateArtifactReady true");
  if (report.actualBoundedWriteExecuted !== false) problems.push("report must not execute bounded write");
  if (report.dryRunProbe?.connectionAttempted !== false) problems.push("dry run must not connect");
  if (report.dryRunProbe?.mutations !== false) problems.push("dry run must not mutate");
  if (report.missingCandidateExecutionProbe?.connectionAttempted !== false) {
    problems.push("missing candidate execution probe must not connect");
  }
  if (report.missingCandidateExecutionProbe?.mutations !== false) {
    problems.push("missing candidate execution probe must not mutate");
  }
  if (!report.missingCandidateExecutionProbe?.problems?.includes("missing_candidate_input_artifact_contract")) {
    problems.push("missing candidate probe must include missing_candidate_input_artifact_contract");
  }
  if (report.candidatePreExecutionProbe?.candidateInputAccepted !== true) {
    problems.push("candidate pre-execution probe must accept the generated candidate input");
  }
  if (report.candidatePreExecutionProbe?.candidateInputPriceRows !== 180) {
    problems.push("candidate pre-execution probe must show 180 candidate price rows");
  }
  if (report.candidatePreExecutionProbe?.connectionAttempted !== false) {
    problems.push("candidate pre-execution probe must not connect");
  }
  if (report.candidatePreExecutionProbe?.mutations !== false) {
    problems.push("candidate pre-execution probe must not mutate");
  }
  if (report.pmCandidateIntakeReview?.readyForCeoBoundedWriteDecision !== true) {
    problems.push("PM candidate intake review must be ready for CEO bounded write decision");
  }
  if (report.pmCandidateIntakeReview?.stagingWriteExecutionAllowed !== false) {
    problems.push("PM intake review must not authorize staging write execution");
  }
  if (report.safety?.publicDataSource !== "mock" || report.safety?.scoreSource !== "mock") {
    problems.push("report safety must keep publicDataSource and scoreSource mock");
  }
  for (const key of [
    "sqlExecuted",
    "realSupabaseConnectionAttempted",
    "realSupabaseWrites",
    "stagingRowsCreated",
    "dailyPricesMutated",
    "marketDataFetched",
    "marketDataIngested",
    "rawPayloadsPrinted",
    "rowPayloadsPrinted",
    "secretsPrinted",
    "serviceRoleKeyPrinted",
    "publicPromotionAllowed",
    "rowCoveragePointsAllowed",
    "scoreSourceRealAllowed"
  ]) {
    if (report.safety?.[key] !== false) problems.push(`report safety ${key} must be false`);
  }
}

const missingResult = spawnSync(process.execPath, [reportPath], {
  cwd: process.cwd(),
  encoding: "utf8",
  env: {
    ...process.env,
    A1_TW_EQUITY_CANDIDATE_ARTIFACT_PATH: "__missing__/candidate.json"
  },
  shell: false
});

if (missingResult.status !== 0) {
  problems.push(`${reportPath} missing-artifact mode must exit 0`);
} else {
  const missingReport = parseJson(missingResult.stdout);
  if (missingReport.status !== "tw_equity_staging_write_execution_readiness_blocked_candidate_artifact_missing") {
    problems.push("missing-artifact mode must remain blocked");
  }
  if (missingReport.candidateArtifactReady !== false) {
    problems.push("missing-artifact mode must show candidateArtifactReady false");
  }
  if (missingReport.actualBoundedWriteExecuted !== false) {
    problems.push("missing-artifact mode must not execute bounded write");
  }
  if (missingReport.candidatePreExecutionProbe?.connectionAttempted !== false) {
    problems.push("missing-artifact candidate pre-execution probe must not connect");
  }
  if (missingReport.candidatePreExecutionProbe?.mutations !== false) {
    problems.push("missing-artifact candidate pre-execution probe must not mutate");
  }
}

if (problems.length > 0) {
  console.log(JSON.stringify({ problems, status: "blocked" }, null, 2));
  process.exit(1);
}

console.log(JSON.stringify({ status: "ok" }, null, 2));

function read(filePath) {
  if (!fs.existsSync(filePath)) {
    problems.push(`missing file: ${filePath}`);
    return "";
  }

  return fs.readFileSync(filePath, "utf8");
}

function parseJson(text) {
  try {
    return JSON.parse(text);
  } catch {
    problems.push("report output is not valid JSON");
    return {};
  }
}
