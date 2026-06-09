import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const problems = [];

const wrapperPath = "scripts/run-twii-bounded-data-acceptance-attempt.mjs";
const reportPath = "scripts/report-twii-bounded-data-acceptance-post-run-review.mjs";
const docPath = "docs/TWII_BOUNDED_DATA_ACCEPTANCE_POST_RUN_REVIEW_GATE.md";
const packagePath = "package.json";
const statusPath = "PROJECT_STATUS.md";
const boardPath = "docs/LAUNCH_ENGINEERING_WORKSTREAM_BOARD.md";
const reviewGatePath = "scripts/check-review-gates.mjs";
const tmpDir = "tmp";
const syntheticArtifactPath = path.join(tmpDir, "twii-bounded-post-run-review-synthetic-artifact.safe.json");
const safeSummaryPath = path.join(tmpDir, "twii-bounded-post-run-review-safe-summary.json");
const safeReviewPath = path.join(tmpDir, "twii-bounded-post-run-review-safe-result.json");
const unsafeSummaryPath = path.join(tmpDir, "twii-bounded-post-run-review-unsafe-summary.json");
const unsafeReviewPath = path.join(tmpDir, "twii-bounded-post-run-review-unsafe-result.json");

const doc = read(docPath);
const pkg = JSON.parse(read(packagePath));
const status = read(statusPath);
const board = read(boardPath);
const reviewGate = read(reviewGatePath);
const reportSource = read(reportPath);

fs.mkdirSync(tmpDir, { recursive: true });
fs.writeFileSync(
  syntheticArtifactPath,
  `${JSON.stringify({ fixtureKind: "synthetic_safe_metadata_only", candidateRows: [] }, null, 2)}\n`
);

const wrapperRun = spawnSync(
  process.execPath,
  [
    wrapperPath,
    "--attempt-id",
    "twii-bounded-post-review-check",
    "--candidate-artifact-path",
    syntheticArtifactPath,
    "--mode",
    "no-write-preview",
    "--out",
    safeSummaryPath
  ],
  { cwd: process.cwd(), encoding: "utf8", shell: false, timeout: 120000, windowsHide: true }
);

if (wrapperRun.status !== 0) problems.push("wrapper must create a safe summary for post-run review check");

const safeReviewRun = spawnSync(
  process.execPath,
  [reportPath, "--summary-path", safeSummaryPath, "--out", safeReviewPath],
  { cwd: process.cwd(), encoding: "utf8", shell: false, timeout: 120000, windowsHide: true }
);

const safeReview = parseJson(safeReviewRun.stdout ?? "", "safe review stdout");
if (safeReviewRun.status !== 0) problems.push("safe post-run review must exit 0");
if (safeReview.status !== "twii_bounded_data_acceptance_post_run_review_accepted_no_write") {
  problems.push("safe post-run review must be accepted no-write");
}
if (safeReview.outcome !== "accepted") problems.push("safe post-run review outcome must be accepted");
assertReviewSafety(safeReview, "safe review");

const unsafeSummary = parseJson(fs.existsSync(safeSummaryPath) ? fs.readFileSync(safeSummaryPath, "utf8") : "{}", "safe summary");
unsafeSummary.dryRunResult = { ...unsafeSummary.dryRunResult, dailyPricesMutated: true };
unsafeSummary.safety = { ...unsafeSummary.safety, supabaseConnectionAttempted: true };
fs.writeFileSync(unsafeSummaryPath, `${JSON.stringify(unsafeSummary, null, 2)}\n`);

const unsafeReviewRun = spawnSync(
  process.execPath,
  [reportPath, "--summary-path", unsafeSummaryPath, "--out", unsafeReviewPath],
  { cwd: process.cwd(), encoding: "utf8", shell: false, timeout: 120000, windowsHide: true }
);
const unsafeReview = parseJson(unsafeReviewRun.stdout ?? "", "unsafe review stdout");
if (unsafeReviewRun.status === 0) problems.push("unsafe post-run review must fail closed");
if (unsafeReview.status !== "blocked" || unsafeReview.outcome !== "blocked") {
  problems.push("unsafe post-run review must be blocked");
}

if (
  pkg.scripts?.["report:twii-bounded-data-acceptance-post-run-review"] !==
  `node ${reportPath}`
) {
  problems.push(`${packagePath} missing report:twii-bounded-data-acceptance-post-run-review`);
}
if (
  pkg.scripts?.["check:twii-bounded-data-acceptance-post-run-review"] !==
  "node scripts/check-twii-bounded-data-acceptance-post-run-review.mjs"
) {
  problems.push(`${packagePath} missing check:twii-bounded-data-acceptance-post-run-review`);
}

for (const phrase of [
  "TWII Bounded Data Acceptance Post-Run Review Gate",
  "twii_bounded_data_acceptance_post_run_review_gate_ready",
  "twii_bounded_data_acceptance_post_run_review_accepted_no_write",
  "accepted",
  "blocked",
  "publicDataSource=mock",
  "scoreSource=mock",
  "No SQL",
  "No Supabase",
  "No daily_prices mutation"
]) {
  if (!doc.includes(phrase)) problems.push(`${docPath} missing: ${phrase}`);
}

for (const phrase of [
  "Latest TWII bounded data acceptance post-run review gate slice",
  "docs/TWII_BOUNDED_DATA_ACCEPTANCE_POST_RUN_REVIEW_GATE.md",
  "twii_bounded_data_acceptance_post_run_review_gate_ready"
]) {
  if (!status.includes(phrase)) problems.push(`${statusPath} missing: ${phrase}`);
}

for (const phrase of [
  "`docs/TWII_BOUNDED_DATA_ACCEPTANCE_POST_RUN_REVIEW_GATE.md` is `accepted` as TWII bounded data acceptance post-run review gate",
  "twii_bounded_data_acceptance_post_run_review_gate_ready"
]) {
  if (!board.includes(phrase)) problems.push(`${boardPath} missing: ${phrase}`);
}

for (const phrase of [
  "scripts/check-twii-bounded-data-acceptance-post-run-review.mjs",
  "name: \"twii-bounded-data-acceptance-post-run-review\"",
  "\"twii-bounded-data-acceptance-post-run-review\""
]) {
  if (!reviewGate.includes(phrase)) problems.push(`${reviewGatePath} missing: ${phrase}`);
}

for (const [filePath, text] of [
  [reportPath, reportSource],
  [docPath, doc],
  ["safe review stdout", safeReviewRun.stdout ?? ""]
]) {
  for (const pattern of forbiddenPatterns()) {
    if (pattern.test(text)) problems.push(`${filePath} contains forbidden pattern ${String(pattern)}`);
  }
}

if (problems.length > 0) {
  console.error(JSON.stringify({ status: "blocked", problems }, null, 2));
  process.exit(1);
}

console.log(
  JSON.stringify(
    {
      status: "ok",
      guardedStatus: "twii_bounded_data_acceptance_post_run_review_gate_ready",
      acceptedStatus: safeReview.status,
      blockedFixtureStatus: unsafeReview.status
    },
    null,
    2
  )
);

function assertReviewSafety(output, label) {
  if (output.safety?.publicDataSource !== "mock" || output.safety?.scoreSource !== "mock") {
    problems.push(`${label} must stay mock/mock`);
  }
  for (const key of [
    "sqlExecuted",
    "supabaseConnectionAttempted",
    "supabaseReadsEnabled",
    "supabaseWritesEnabled",
    "marketDataFetched",
    "marketDataIngested",
    "candidateArtifactContentRead",
    "candidateRowsAccepted",
    "dailyPricesMutated",
    "stagingRowsCreated",
    "rowCoverageScoringAllowed",
    "sourcePayloadsPrinted",
    "rowPayloadsPrinted",
    "stockIdPayloadsPrinted",
    "secretsPrinted",
    "publicPromotionAllowed",
    "scoreSourceRealAllowed"
  ]) {
    if (output.safety?.[key] !== false) problems.push(`${label}.safety.${key} must be false`);
  }
}

function read(filePath) {
  if (!fs.existsSync(filePath)) {
    problems.push(`missing file: ${filePath}`);
    return filePath.endsWith(".json") ? "{}" : "";
  }
  return fs.readFileSync(filePath, "utf8");
}

function parseJson(text, label) {
  try {
    return JSON.parse(text);
  } catch {
    problems.push(`${label} is not valid JSON`);
    return {};
  }
}

function forbiddenPatterns() {
  return [
    /\bfetch\s*\(/u,
    /@supabase\/supabase-js/u,
    /createClient/u,
    /\.from\(/u,
    /\.insert\(/u,
    /\.update\(/u,
    /\.delete\(/u,
    /\.upsert\(/u,
    /\bsb_(publishable|secret|anon|service_role)_[a-z0-9_-]+/iu,
    /publicDataSource":\s*"supabase"/u,
    /scoreSource":\s*"real"/u
  ];
}
