import { spawnSync } from "node:child_process";

const runnerPath = "scripts/run-twii-bounded-readonly-preflight-remote-readonly-once.mjs";
const reviewPath = "scripts/report-twii-bounded-readonly-preflight-remote-readonly-post-run-review.mjs";
const attemptId = "twii-bounded-readonly-preflight-20260609-a";
const outDir = "tmp/twii-bounded-readonly-preflight-20260609-a";
const summaryPath = `${outDir}/twii-bounded-readonly-preflight-remote-readonly-${attemptId}.json`;

const runner = runJson([
  runnerPath,
  "--attempt-id",
  attemptId,
  "--candidate-artifact-path",
  "data/candidates/twii-sanitized-candidate.json",
  "--mode",
  "aggregate-only-readonly",
  "--confirm",
  "CEO_APPROVED_TWII_BOUNDED_READONLY_PREFLIGHT_ONCE",
  "--execute-readonly",
  "--authorization-phrase",
  "CEO_AUTHORIZES_ONE_TWII_BOUNDED_READONLY_PREFLIGHT_ATTEMPT_20260609_A",
  "--out-dir",
  outDir
]);

const review = runJson([
  reviewPath,
  "--summary-path",
  summaryPath
]);

const accepted = runner.ok && review.ok;
const report = {
  status: accepted
    ? "twii_bounded_readonly_preflight_open_one_remote_readonly_execution_path_ready"
    : "blocked",
  outcome: accepted ? "accepted_one_sanitized_remote_readonly_probe_path" : "blocked",
  attemptId,
  runnerStatus: runner.json.status ?? null,
  reviewStatus: review.json.status ?? null,
  summaryPath,
  nextRecommendedSlice: "twii_bounded_readonly_preflight_remote_readonly_result_to_data_route_decision",
  safety: {
    publicDataSource: "mock",
    scoreSource: "mock",
    sqlExecuted: false,
    supabaseReadAttempted: runner.json.safety?.supabaseReadAttempted === true,
    supabaseWriteAttempted: false,
    marketDataFetched: false,
    marketDataIngested: false,
    dailyPricesMutated: false,
    stagingRowsCreated: false,
    candidateRowsAccepted: false,
    rowCoverageScoringAllowed: false,
    rawPayloadOutput: false,
    rowPayloadOutput: false,
    stockIdPayloadOutput: false,
    secretsOutput: false,
    publicPromotionAllowed: false,
    scoreSourceRealAllowed: false
  },
  problems: [
    ...runner.problems,
    ...review.problems
  ]
};

console.log(JSON.stringify(report, null, 2));
if (!accepted) process.exit(1);

function runJson(args) {
  const run = spawnSync(process.execPath, args, {
    cwd: process.cwd(),
    encoding: "utf8",
    shell: false,
    timeout: 120000,
    windowsHide: true
  });
  let json = {};
  const problems = [];
  try {
    json = JSON.parse(run.stdout ?? "{}");
  } catch {
    problems.push(`${args[0]} stdout not valid json`);
  }
  if (run.status !== 0) problems.push(`${args[0]} exited ${run.status}`);
  return { json, ok: run.status === 0 && problems.length === 0, problems };
}
