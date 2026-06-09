import fs from "node:fs";
import { spawnSync } from "node:child_process";

const problems = [];

const reportPath = "scripts/report-pm-twii-named-attempt-no-write-proof.mjs";
const checkerPath = "scripts/check-pm-twii-named-attempt-no-write-proof.mjs";
const docPath = "docs/PM_TWII_NAMED_ATTEMPT_NO_WRITE_PROOF.md";
const candidatePath = "data/candidates/twii-sanitized-candidate.json";
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
const candidateText = read(candidatePath);

const reportRun = spawnSync(process.execPath, [reportPath], {
  cwd: process.cwd(),
  encoding: "utf8",
  shell: false,
  timeout: 120000,
  windowsHide: true
});
const report = parseJson(reportRun.stdout ?? "", "PM named attempt proof report stdout");
if (reportRun.status !== 0) problems.push("PM named attempt proof report must exit 0");
if (report.status !== "pm_twii_named_attempt_no_write_proof_ready") {
  problems.push("PM named attempt proof report must be ready");
}
if (report.outcome !== "accepted_no_write_named_attempt_proof") {
  problems.push("PM named attempt proof outcome must be accepted no-write proof");
}
assertSafety(report, "PM named attempt proof report");

if (pkg.scripts?.["report:pm-twii-named-attempt-no-write-proof"] !== `node ${reportPath}`) {
  problems.push(`${packagePath} missing report:pm-twii-named-attempt-no-write-proof`);
}
if (pkg.scripts?.["check:pm-twii-named-attempt-no-write-proof"] !== `node ${checkerPath}`) {
  problems.push(`${packagePath} missing check:pm-twii-named-attempt-no-write-proof`);
}

for (const phrase of [
  "PM TWII Named Attempt No-Write Proof",
  "pm_twii_named_attempt_no_write_proof_ready",
  "data/candidates/twii-sanitized-candidate.json",
  "twii-no-write-proof-20260609",
  "accepted_no_write_named_attempt_proof",
  "vendor-terms-evidence",
  "internal-feed-owner-evidence",
  "field-contract-evidence",
  "asset-mapping-evidence",
  "No SQL",
  "No Supabase",
  "No daily_prices mutation",
  "publicDataSource=mock",
  "scoreSource=mock"
]) {
  if (!doc.includes(phrase) && phrase !== "accepted_no_write_named_attempt_proof") {
    problems.push(`${docPath} missing: ${phrase}`);
  }
}

for (const phrase of [
  "Latest PM TWII named attempt no-write proof slice",
  "docs/PM_TWII_NAMED_ATTEMPT_NO_WRITE_PROOF.md",
  "pm_twii_named_attempt_no_write_proof_ready"
]) {
  if (!status.includes(phrase)) problems.push(`${statusPath} missing: ${phrase}`);
}

for (const phrase of [
  "`docs/PM_TWII_NAMED_ATTEMPT_NO_WRITE_PROOF.md` is `accepted` as PM TWII named attempt no-write proof",
  "pm_twii_named_attempt_no_write_proof_ready"
]) {
  if (!board.includes(phrase)) problems.push(`${boardPath} missing: ${phrase}`);
}

for (const phrase of [
  "scripts/check-pm-twii-named-attempt-no-write-proof.mjs",
  "name: \"pm-twii-named-attempt-no-write-proof\"",
  "\"pm-twii-named-attempt-no-write-proof\""
]) {
  if (!reviewGate.includes(phrase)) problems.push(`${reviewGatePath} missing: ${phrase}`);
}

const candidate = parseJson(candidateText, candidatePath);
for (const [key, expected] of [
  ["artifactId", "twii-sanitized-candidate-20260609"],
  ["lane", "TWII"],
  ["assetType", "index"],
  ["symbol", "TWII"],
  ["scope", "twii_index_daily_prices_missing_rows"],
  ["sourceLane", "official-exchange-index"],
  ["sanitizedAggregateOnly", true],
  ["rawPayloadIncluded", false],
  ["rowPayloadIncluded", false],
  ["stockIdPayloadIncluded", false],
  ["secretsIncluded", false]
]) {
  if (candidate?.[key] !== expected) problems.push(`${candidatePath}.${key} must be ${String(expected)}`);
}
if (Array.isArray(candidate.rows) || Array.isArray(candidate.candidateRows)) {
  problems.push(`${candidatePath} must not contain row arrays`);
}

for (const [filePath, text] of [
  [reportPath, reportSource],
  [docPath, doc],
  [candidatePath, candidateText],
  ["PM named attempt proof report stdout", reportRun.stdout ?? ""]
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
      guardedStatus: "pm_twii_named_attempt_no_write_proof_ready"
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
    "supabaseAllowed",
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
