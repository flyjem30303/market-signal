import fs from "node:fs";
import { spawnSync } from "node:child_process";

const problems = [];

const reportPath = "scripts/report-a1-tw-equity-candidate-artifact-production-checklist.mjs";
const checkerPath = "scripts/check-a1-tw-equity-candidate-artifact-production-checklist.mjs";
const docPath = "docs/A1_TW_EQUITY_CANDIDATE_ARTIFACT_PRODUCTION_CHECKLIST.md";
const packagePath = "package.json";
const statusPath = "PROJECT_STATUS.md";
const readableStatusPath = "scripts/check-readable-current-status.mjs";
const reviewGatePath = "scripts/check-review-gates.mjs";
const fullHealthPath = "scripts/check-localhost-full-health.mjs";

const reportSource = read(reportPath);
const doc = read(docPath);
const pkg = JSON.parse(read(packagePath));
const status = read(statusPath);
const readableStatus = read(readableStatusPath);
const reviewGate = read(reviewGatePath);
const fullHealth = read(fullHealthPath);

for (const phrase of [
  "a1_tw_equity_candidate_artifact_production_checklist_ready_no_candidate_data",
  "source_and_rights_evidence_attached",
  "sanitized_artifact_created_outside_this_slice",
  "a1_self_check_passed",
  "pm_intake_review_passed",
  "docs/A1_TW_EQUITY_CANDIDATE_ARTIFACT_DELIVERY_SPEC.md",
  "docs/A1_TW_EQUITY_CANDIDATE_ARTIFACT_SELF_CHECK.md",
  "docs/PM_TW_EQUITY_CANDIDATE_INTAKE_REVIEW.md",
  "TW-EQUITY-STAGING-WRITE-2026-06-06-AUTH-001",
  "staging_twse_stock_day_runs,staging_twse_stock_day_prices",
  "twse-stock-day",
  "sourcePayloadIncluded: false",
  "sourceUrlPayloadIncluded: false",
  "secretsIncluded: false",
  "candidateArtifactCreated: false",
  "realSupabaseWrites: false",
  "marketDataFetched: false",
  "marketDataIngested: false",
  "scoreSourceRealAllowed: false"
]) {
  if (!reportSource.includes(phrase)) problems.push(`${reportPath} missing: ${phrase}`);
}

for (const phrase of [
  "A1 TW Equity Candidate Artifact Production Checklist",
  "a1_tw_equity_candidate_artifact_production_checklist_ready_no_candidate_data",
  "source_and_rights_evidence_attached",
  "sanitized_artifact_created_outside_this_slice",
  "a1_self_check_passed",
  "pm_intake_review_passed",
  "node scripts/report-a1-tw-equity-candidate-artifact-production-checklist.mjs",
  "node scripts/check-a1-tw-equity-candidate-artifact-production-checklist.mjs",
  "A1_TW_EQUITY_CANDIDATE_ARTIFACT_PATH",
  "No candidate artifact is created in this slice",
  "No market-data fetch, market-data ingestion, Supabase connection, SQL, Supabase write"
]) {
  if (!doc.includes(phrase)) problems.push(`${docPath} missing: ${phrase}`);
}

for (const phrase of [
  "Latest A1 TW equity candidate artifact production checklist slice",
  "docs/A1_TW_EQUITY_CANDIDATE_ARTIFACT_PRODUCTION_CHECKLIST.md",
  "scripts/report-a1-tw-equity-candidate-artifact-production-checklist.mjs",
  "a1_tw_equity_candidate_artifact_production_checklist_ready_no_candidate_data",
  "A1 now has a concrete four-step production checklist before PM review",
  "the actual sanitized candidate artifact is still absent",
  "No candidate artifact, market-data fetch, Supabase connection, SQL, write, staging row, source payload output, public promotion, row coverage point, or real score source occurred"
]) {
  if (!status.includes(phrase)) problems.push(`${statusPath} missing: ${phrase}`);
  if (!readableStatus.includes(phrase)) problems.push(`${readableStatusPath} missing: ${phrase}`);
}

if (pkg.scripts?.["report:a1-tw-equity-candidate-artifact-production-checklist"] !== `node ${reportPath}`) {
  problems.push("package.json missing report:a1-tw-equity-candidate-artifact-production-checklist");
}
if (pkg.scripts?.["check:a1-tw-equity-candidate-artifact-production-checklist"] !== `node ${checkerPath}`) {
  problems.push("package.json missing check:a1-tw-equity-candidate-artifact-production-checklist");
}

for (const [pathName, text] of [
  [reviewGatePath, reviewGate],
  [fullHealthPath, fullHealth]
]) {
  if (!text.includes(checkerPath)) {
    problems.push(`${pathName} missing A1 candidate artifact production checklist checker`);
  }
  if (!text.includes("a1-tw-equity-candidate-artifact-production-checklist")) {
    problems.push(`${pathName} missing a1-tw-equity-candidate-artifact-production-checklist name`);
  }
}

if (!reviewGate.includes('"a1-tw-equity-candidate-artifact-production-checklist"')) {
  problems.push("review gate core set missing a1-tw-equity-candidate-artifact-production-checklist");
}

for (const [pathName, text] of [
  [reportPath, reportSource],
  [docPath, doc]
]) {
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

if (result.status !== 0) problems.push(`${reportPath} must exit 0`);
const report = parseJson(result.stdout);
if (report.status !== "a1_tw_equity_candidate_artifact_production_checklist_ready_no_candidate_data") {
  problems.push("production checklist report must stay ready_no_candidate_data");
}
if (report.safety?.candidateArtifactCreated !== false) problems.push("production checklist must not create candidate artifact");
if (report.safety?.publicDataSource !== "mock" || report.safety?.scoreSource !== "mock") {
  problems.push("production checklist safety must keep publicDataSource and scoreSource mock");
}
for (const key of [
  "sqlExecuted",
  "realSupabaseConnectionAttempted",
  "realSupabaseWrites",
  "stagingRowsCreated",
  "dailyPricesMutated",
  "marketDataFetched",
  "marketDataIngested",
  "sourcePayloadsPrinted",
  "rowPayloadsPrinted",
  "secretsPrinted",
  "serviceRoleKeyPrinted",
  "publicPromotionAllowed",
  "rowCoveragePointsAllowed",
  "scoreSourceRealAllowed"
]) {
  if (report.safety?.[key] !== false) problems.push(`production checklist safety ${key} must be false`);
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
