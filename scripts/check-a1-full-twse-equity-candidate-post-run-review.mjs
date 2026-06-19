import { spawnSync } from "node:child_process";
import fs from "node:fs";

const problems = [];
const reportPath = "scripts/report-a1-full-twse-equity-candidate-post-run-review.mjs";
const runnerPath = "scripts/run-a1-full-twse-equity-rate-limited-candidate-generation-once.mjs";
const pkg = JSON.parse(read("package.json"));
const reportSource = read(reportPath);
const runnerSource = read(runnerPath);

if (pkg.scripts?.["report:a1-full-twse-equity-candidate-post-run-review"] !== `node ${reportPath}`) {
  problems.push("package.json missing report:a1-full-twse-equity-candidate-post-run-review");
}

if (
  pkg.scripts?.["check:a1-full-twse-equity-candidate-post-run-review"] !==
  "node scripts/check-a1-full-twse-equity-candidate-post-run-review.mjs"
) {
  problems.push("package.json missing check:a1-full-twse-equity-candidate-post-run-review");
}

for (const required of [
  "candidate_post_run_review_blocked",
  "outOfWindowRows",
  "duplicateSymbolDateCount",
  "sourcePayloadIncluded",
  "stockIdListPrinted",
  "publicDataSource: \"mock\"",
  "scoreSource: \"mock\""
]) {
  if (!reportSource.includes(required)) problems.push(`${reportPath} missing ${required}`);
}

for (const required of [
  "isTradeDateInsideRequestedWindow",
  "outOfWindowRowCount",
  "row_outside_requested_window"
]) {
  if (!runnerSource.includes(required)) problems.push(`${runnerPath} missing ${required}`);
}

const result = spawnSync(process.execPath, [reportPath], {
  cwd: process.cwd(),
  encoding: "utf8",
  shell: false
});

if (result.status !== 0) {
  problems.push(`${reportPath} failed: ${(result.stderr || result.stdout).trim()}`);
} else {
  const output = JSON.parse(result.stdout);
  if (!["candidate_post_run_review_ready_for_validation", "candidate_post_run_review_blocked"].includes(output.status)) {
    problems.push("unexpected post-run review status");
  }
  if (output.aggregateOnly !== true) problems.push("post-run review must be aggregate-only");
  if (typeof output.outOfWindowRows !== "number") problems.push("outOfWindowRows must be numeric");
  if (typeof output.duplicateSymbolDateCount !== "number") problems.push("duplicateSymbolDateCount must be numeric");
  if (output.safety?.sourcePayloadIncluded !== true) problems.push("source payload must be excluded");
  if (output.safety?.stockIdListPrinted !== true) problems.push("stock ID list must not be printed");
  if (output.safety?.publicDataSource !== "mock") problems.push("publicDataSource must remain mock");
  if (output.safety?.scoreSource !== "mock") problems.push("scoreSource must remain mock");
  if (/\b(1101|1102|2330|2308|2382|2454|2317)\b/u.test(result.stdout)) {
    problems.push("post-run review output must not include stock IDs");
  }
}

if (problems.length > 0) {
  console.log(JSON.stringify({ status: "blocked", problems }, null, 2));
  process.exit(1);
}

console.log(
  JSON.stringify(
    {
      status: "ok",
      mode: "a1_full_twse_equity_candidate_post_run_review_check",
      verified: {
        aggregateOnly: true,
        dateWindowReview: true,
        runnerWindowFilterRequired: true,
        noSupabase: true,
        noSql: true,
        noDailyPricesMutation: true,
        noStockIdOutput: true
      }
    },
    null,
    2
  )
);

function read(filePath) {
  if (!fs.existsSync(filePath)) {
    problems.push(`missing file: ${filePath}`);
    return "";
  }
  return fs.readFileSync(filePath, "utf8");
}
