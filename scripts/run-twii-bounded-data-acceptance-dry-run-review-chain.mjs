import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const args = parseArgs(process.argv.slice(2));
const problems = [];

const attemptId = args["attempt-id"];
const candidateArtifactPath = args["candidate-artifact-path"];
const mode = args.mode;
const outDir = args["out-dir"] ?? "tmp";

if (!attemptId || !/^[a-z0-9][a-z0-9_-]{2,80}$/iu.test(attemptId)) {
  problems.push("attempt-id is required and must be a safe 3-81 character id");
}
if (mode !== "no-write-preview") {
  problems.push("mode must be no-write-preview");
}
if (!candidateArtifactPath) {
  problems.push("candidate-artifact-path is required");
}

const safeAttemptId = safeFileStamp(attemptId ?? "missing");
const dryRunSummaryPath = path.join(outDir, `twii-bounded-data-acceptance-attempt-${safeAttemptId}.json`);
const postRunReviewPath = path.join(outDir, `twii-bounded-data-acceptance-post-run-review-${safeAttemptId}.json`);
const chainSummaryPath = path.join(outDir, `twii-bounded-data-acceptance-chain-${safeAttemptId}.json`);

let dryRun = {};
let postRunReview = {};
let dryRunExitCode = null;
let reviewExitCode = null;

if (problems.length === 0) {
  const dryRunResult = spawnSync(
    process.execPath,
    [
      "scripts/run-twii-bounded-data-acceptance-attempt.mjs",
      "--attempt-id",
      attemptId,
      "--candidate-artifact-path",
      candidateArtifactPath,
      "--mode",
      mode,
      "--out",
      dryRunSummaryPath
    ],
    { cwd: process.cwd(), encoding: "utf8", shell: false, timeout: 120000, windowsHide: true }
  );
  dryRunExitCode = dryRunResult.status;
  dryRun = parseJson(dryRunResult.stdout ?? "", "dry-run wrapper stdout");
  if (dryRunResult.status !== 0) problems.push("dry-run wrapper failed");
}

if (problems.length === 0) {
  const reviewResult = spawnSync(
    process.execPath,
    [
      "scripts/report-twii-bounded-data-acceptance-post-run-review.mjs",
      "--summary-path",
      dryRunSummaryPath,
      "--out",
      postRunReviewPath
    ],
    { cwd: process.cwd(), encoding: "utf8", shell: false, timeout: 120000, windowsHide: true }
  );
  reviewExitCode = reviewResult.status;
  postRunReview = parseJson(reviewResult.stdout ?? "", "post-run review stdout");
  if (reviewResult.status !== 0) problems.push("post-run review failed");
}

const chain = {
  status:
    problems.length === 0 &&
    dryRun.status === "twii_bounded_data_acceptance_attempt_dry_run_ready_no_write" &&
    postRunReview.status === "twii_bounded_data_acceptance_post_run_review_accepted_no_write"
      ? "twii_bounded_data_acceptance_dry_run_review_chain_completed_no_write"
      : "blocked",
  outcome: problems.length === 0 ? "accepted_no_write_chain" : "blocked",
  attemptId: attemptId ?? null,
  mode: mode ?? null,
  targetLane: "TWII",
  targetScope: "twii_index_daily_prices_missing_rows",
  outputs: {
    dryRunSummaryPath,
    postRunReviewPath,
    chainSummaryPath
  },
  executedSteps: {
    dryRunWrapper: dryRunExitCode === 0,
    postRunReviewGate: reviewExitCode === 0
  },
  reviewedStatuses: {
    dryRunStatus: dryRun.status ?? null,
    postRunReviewStatus: postRunReview.status ?? null
  },
  safety: {
    publicDataSource: "mock",
    scoreSource: "mock",
    sqlExecuted: false,
    supabaseConnectionAttempted: false,
    supabaseReadsEnabled: false,
    supabaseWritesEnabled: false,
    marketDataFetched: false,
    marketDataIngested: false,
    candidateArtifactContentRead: false,
    candidateRowsAccepted: false,
    dailyPricesMutated: false,
    stagingRowsCreated: false,
    rowCoverageScoringAllowed: false,
    sourcePayloadsPrinted: false,
    rowPayloadsPrinted: false,
    stockIdPayloadsPrinted: false,
    secretsPrinted: false,
    publicPromotionAllowed: false,
    scoreSourceRealAllowed: false
  },
  stopLine:
    "No SQL, Supabase read/write, market-data fetch, daily_prices mutation, staging rows, candidate row acceptance, row coverage scoring, source promotion, or scoreSource=real occurred.",
  problems
};

fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(chainSummaryPath, `${JSON.stringify(chain, null, 2)}\n`);
console.log(JSON.stringify(chain, null, 2));

if (chain.status === "blocked") process.exit(1);

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

function parseJson(text, label) {
  try {
    return JSON.parse(text);
  } catch {
    problems.push(`${label} is not valid JSON`);
    return {};
  }
}

function safeFileStamp(value) {
  return String(value).replace(/[^a-z0-9_-]/giu, "_").slice(0, 80);
}
