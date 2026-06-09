import fs from "node:fs";
import { spawnSync } from "node:child_process";

const problems = [];

const reportPath = "scripts/report-twii-no-write-proof-post-review-readiness-gate.mjs";
const checkerPath = "scripts/check-twii-no-write-proof-post-review-readiness-gate.mjs";
const docPath = "docs/TWII_NO_WRITE_PROOF_POST_REVIEW_READINESS_GATE.md";
const packagePath = "package.json";
const statusPath = "PROJECT_STATUS.md";
const boardPath = "docs/LAUNCH_ENGINEERING_WORKSTREAM_BOARD.md";
const reviewGatePath = "scripts/check-review-gates.mjs";

const doc = read(docPath);
const pkg = JSON.parse(read(packagePath));
const status = read(statusPath);
const board = read(boardPath);
const reviewGate = read(reviewGatePath);
const reportSource = read(reportPath);

const reportRun = spawnSync(process.execPath, [reportPath], {
  cwd: process.cwd(),
  encoding: "utf8",
  shell: false,
  timeout: 120000,
  windowsHide: true
});
const report = parseJson(reportRun.stdout ?? "", "TWII no-write proof post-review gate report stdout");
if (reportRun.status !== 0) problems.push("TWII no-write proof post-review gate report must exit 0");
if (report.status !== "twii_no_write_proof_post_review_readiness_gate_ready") {
  problems.push("TWII no-write proof post-review gate report must be ready");
}
if (report.outcome !== "ready_for_bounded_supabase_readonly_preflight_candidate_write_preflight_blocked") {
  problems.push("TWII no-write proof post-review gate outcome must route to readonly candidate and keep write blocked");
}
assertSafety(report, "post-review readiness gate report");

if (
  pkg.scripts?.["report:twii-no-write-proof-post-review-readiness-gate"] !==
  `node ${reportPath}`
) {
  problems.push(`${packagePath} missing report:twii-no-write-proof-post-review-readiness-gate`);
}
if (
  pkg.scripts?.["check:twii-no-write-proof-post-review-readiness-gate"] !==
  `node ${checkerPath}`
) {
  problems.push(`${packagePath} missing check:twii-no-write-proof-post-review-readiness-gate`);
}

for (const phrase of [
  "TWII No-Write Proof Post-Review Readiness Gate",
  "twii_no_write_proof_post_review_readiness_gate_ready",
  "ready_for_bounded_supabase_readonly_preflight_candidate_write_preflight_blocked",
  "TWII bounded readonly preflight candidate design",
  "No SQL",
  "No Supabase connection in this gate",
  "No Supabase write",
  "No daily_prices mutation",
  "publicDataSource=mock",
  "scoreSource=mock"
]) {
  if (!doc.includes(phrase)) problems.push(`${docPath} missing: ${phrase}`);
}

for (const phrase of [
  "Latest TWII no-write proof post-review readiness gate slice",
  "docs/TWII_NO_WRITE_PROOF_POST_REVIEW_READINESS_GATE.md",
  "twii_no_write_proof_post_review_readiness_gate_ready"
]) {
  if (!status.includes(phrase)) problems.push(`${statusPath} missing: ${phrase}`);
}

for (const phrase of [
  "`docs/TWII_NO_WRITE_PROOF_POST_REVIEW_READINESS_GATE.md` is `accepted` as TWII no-write proof post-review readiness gate",
  "twii_no_write_proof_post_review_readiness_gate_ready"
]) {
  if (!board.includes(phrase)) problems.push(`${boardPath} missing: ${phrase}`);
}

for (const phrase of [
  "scripts/check-twii-no-write-proof-post-review-readiness-gate.mjs",
  "name: \"twii-no-write-proof-post-review-readiness-gate\"",
  "\"twii-no-write-proof-post-review-readiness-gate\""
]) {
  if (!reviewGate.includes(phrase)) problems.push(`${reviewGatePath} missing: ${phrase}`);
}

for (const [filePath, text] of [
  [reportPath, reportSource],
  [docPath, doc],
  ["TWII no-write proof post-review gate report stdout", reportRun.stdout ?? ""]
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
      guardedStatus: "twii_no_write_proof_post_review_readiness_gate_ready"
    },
    null,
    2
  )
);

function assertSafety(output, label) {
  if (output.safety?.publicDataSource !== "mock" || output.safety?.scoreSource !== "mock") {
    problems.push(`${label} must stay mock/mock`);
  }
  for (const key of [
    "sqlAllowed",
    "supabaseConnectionAllowedInThisGate",
    "supabaseWriteAllowed",
    "marketDataFetchAllowed",
    "marketDataIngestAllowed",
    "dailyPricesMutationAllowed",
    "stagingRowsAllowed",
    "candidateRowsAcceptanceAllowed",
    "rowCoverageScoringAllowed",
    "rawPayloadOutputAllowed",
    "rowPayloadOutputAllowed",
    "stockIdPayloadOutputAllowed",
    "secretOutputAllowed",
    "publicPromotionAllowed",
    "scoreSourceRealAllowed"
  ]) {
    if (output.safety?.[key] !== false) problems.push(`${label}.safety.${key} must be false`);
  }
}

function read(filePath) {
  if (!fs.existsSync(filePath)) {
    problems.push(`missing file: ${filePath}`);
    return "";
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
    /publicDataSource=supabase is approved/u,
    /scoreSource=real is approved/u,
    /SQL execution is approved/u,
    /Supabase writes are approved/u
  ];
}
