import fs from "node:fs";

const problems = [];

const readbackPath = "docs/reviews/TW_EQUITY_POST_MERGE_ROW_COVERAGE_READBACK_POST_RUN_REVIEW_2026-06-07.md";
const gatePath = "docs/TW_EQUITY_ROW_COVERAGE_SCORING_GATE.md";
const statusPath = "PROJECT_STATUS.md";
const readableStatusPath = "scripts/check-readable-current-status.mjs";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const fullHealthPath = "scripts/check-localhost-full-health.mjs";

const readback = read(readbackPath);
const gate = read(gatePath);
const status = read(statusPath);
const readableStatus = read(readableStatusPath);
const pkg = JSON.parse(read(packagePath));
const reviewGate = read(reviewGatePath);
const fullHealth = read(fullHealthPath);

for (const phrase of [
  "Status: `tw_equity_post_merge_row_coverage_readback_executed_overall_blocked_tw_equity_complete`",
  "observed total rows: `182`",
  "missing rows: `178`",
  "coverage status: `blocked`",
  "`TWII`: observed rows `0` of `60`",
  "`0050`: observed rows `1` of `60`",
  "`006208`: observed rows `1` of `60`",
  "`2330`: observed rows `60` of `60`",
  "`2382`: observed rows `60` of `60`",
  "`2308`: observed rows `60` of `60`",
  "overall_row_coverage_blocked_tw_equity_subscope_complete",
  "canAwardRowCoveragePoints: `false`",
  "publicDataSource: `mock`",
  "scoreSource: `mock`"
]) {
  if (!readback.includes(phrase)) problems.push(`${readbackPath} missing: ${phrase}`);
}

for (const phrase of [
  "Status: `tw_equity_row_coverage_subscope_accepted_overall_coverage_blocked`",
  "CEO accepts the TW equity sub-scope coverage result",
  "This gate does not promote the full MVP to real-data readiness",
  "expected rows: `180`",
  "observed rows: `180`",
  "sub-scope status: `accepted_complete`",
  "expected rows: `360`",
  "observed rows: `182`",
  "missing rows: `178`",
  "full-scope status: `blocked_incomplete`",
  "`TWII`: `0/60`",
  "`0050`: `1/60`",
  "`006208`: `1/60`",
  "public source promotion",
  "real score source promotion",
  "additional Supabase writes"
]) {
  if (!gate.includes(phrase)) problems.push(`${gatePath} missing: ${phrase}`);
}

if (gate.includes("publicDataSource=supabase") || gate.includes("scoreSource=real")) {
  problems.push(`${gatePath} must not contain promotion-like config assignments`);
}

if (
  pkg.scripts?.["check:tw-equity-row-coverage-scoring-gate"] !==
  "node scripts/check-tw-equity-row-coverage-scoring-gate.mjs"
) {
  problems.push(`${packagePath} missing check:tw-equity-row-coverage-scoring-gate`);
}

for (const [pathName, text] of [
  [reviewGatePath, reviewGate],
  [fullHealthPath, fullHealth]
]) {
  if (!text.includes("scripts/check-tw-equity-row-coverage-scoring-gate.mjs")) {
    problems.push(`${pathName} missing row coverage scoring gate checker command`);
  }
  if (!text.includes("tw-equity-row-coverage-scoring-gate")) {
    problems.push(`${pathName} missing row coverage scoring gate checker name`);
  }
}

for (const phrase of [
  "Latest TW equity row coverage scoring gate slice",
  "docs/reviews/TW_EQUITY_POST_MERGE_ROW_COVERAGE_READBACK_POST_RUN_REVIEW_2026-06-07.md",
  "docs/TW_EQUITY_ROW_COVERAGE_SCORING_GATE.md",
  "scripts/check-tw-equity-row-coverage-scoring-gate.mjs",
  "tw_equity_row_coverage_subscope_accepted_overall_coverage_blocked",
  "TW equity sub-scope is complete at `180/180`",
  "full MVP row coverage remains blocked at `182/360` with `178` missing rows",
  "`TWII` `0/60`, `0050` `1/60`, and `006208` `1/60`"
]) {
  if (!status.includes(phrase)) problems.push(`${statusPath} missing: ${phrase}`);
  if (!readableStatus.includes(phrase)) problems.push(`${readableStatusPath} missing: ${phrase}`);
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
