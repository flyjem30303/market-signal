import fs from "node:fs";

const problems = [];

const docPath = "docs/A1_TW_EQUITY_CANDIDATE_ARTIFACT_DELIVERY_SPEC.md";
const folderReadmePath = "data/candidates/README.md";
const intakeReportPath = "scripts/report-a1-tw-equity-candidate-artifact-intake.mjs";
const intakeCheckerPath = "scripts/check-a1-tw-equity-candidate-artifact-intake.mjs";
const packagePath = "package.json";
const statusPath = "PROJECT_STATUS.md";
const readableStatusPath = "scripts/check-readable-current-status.mjs";
const reviewGatePath = "scripts/check-review-gates.mjs";
const fullHealthPath = "scripts/check-localhost-full-health.mjs";

const doc = read(docPath);
const folderReadme = read(folderReadmePath);
const intakeReport = read(intakeReportPath);
const intakeChecker = read(intakeCheckerPath);
const pkg = JSON.parse(read(packagePath));
const status = read(statusPath);
const readableStatus = read(readableStatusPath);
const reviewGate = read(reviewGatePath);
const fullHealth = read(fullHealthPath);

for (const phrase of [
  "A1 TW Equity Candidate Artifact Delivery Spec",
  "a1_tw_equity_candidate_artifact_delivery_spec_ready_no_candidate_data",
  "data/candidates/tw-equity-staging-candidate.json",
  "A1_TW_EQUITY_CANDIDATE_ARTIFACT_PATH=<local-json-path>",
  "Do not commit a filled artifact unless CEO separately approves committing sanitized candidate data",
  "`authorizationId` equal to `TW-EQUITY-STAGING-WRITE-2026-06-06-AUTH-001`",
  "`targetRelation` equal to `staging_twse_stock_day_runs,staging_twse_stock_day_prices`",
  "`sourceId` equal to `twse-stock-day`",
  "`symbols` equal to `2330`, `2382`, `2308`",
  "`sourcePayloadIncluded=false`",
  "`sourceUrlPayloadIncluded=false`",
  "`secretsIncluded=false`",
  "`candidateRun`",
  "`candidatePrices`",
  "`run_type=staging_candidate`",
  "`source_id=twse-stock-day`",
  "`decision=ready_for_review`",
  "`exchange_code=TWSE`",
  "`quality_flags` as an array",
  "`source_row_hash`",
  "`rawSourcePayload`",
  "`sourcePayload`",
  "`sourceRows`",
  "`rawRows`",
  "`sourceUrlPayload`",
  "`html`",
  "`csv`",
  "`secret`",
  "`secrets`",
  "node scripts/report-a1-tw-equity-candidate-artifact-intake.mjs",
  "node scripts/check-a1-tw-equity-candidate-artifact-intake.mjs",
  "No candidate artifact is created in this slice",
  "No market-data fetch, market-data ingestion, Supabase connection, SQL, Supabase write"
]) {
  if (!doc.includes(phrase)) problems.push(`${docPath} missing: ${phrase}`);
}

for (const phrase of [
  "Candidate Artifact Intake Folder",
  "data/candidates/tw-equity-staging-candidate.json",
  "Do not commit a filled candidate artifact here unless CEO separately approves committing sanitized candidate data",
  "Current status: no candidate artifact is provided"
]) {
  if (!folderReadme.includes(phrase)) problems.push(`${folderReadmePath} missing: ${phrase}`);
}

for (const [pathName, text, phrase] of [
  [intakeReportPath, intakeReport, "A1_TW_EQUITY_CANDIDATE_ARTIFACT_PATH"],
  [intakeReportPath, intakeReport, "data/candidates/tw-equity-staging-candidate.json"],
  [intakeCheckerPath, intakeChecker, "a1_tw_equity_candidate_artifact_intake_blocked_candidate_artifact_not_provided"]
]) {
  if (!text.includes(phrase)) problems.push(`${pathName} missing: ${phrase}`);
}

for (const phrase of [
  "Latest A1 TW equity candidate artifact delivery spec slice",
  "docs/A1_TW_EQUITY_CANDIDATE_ARTIFACT_DELIVERY_SPEC.md",
  "a1_tw_equity_candidate_artifact_delivery_spec_ready_no_candidate_data",
  "data/candidates/README.md",
  "A1 now has an explicit delivery contract and PM intake command map",
  "No candidate artifact, market-data fetch, Supabase connection, SQL, write, staging row, source payload output, public promotion, row coverage point, or real score source occurred"
]) {
  if (!status.includes(phrase)) problems.push(`${statusPath} missing: ${phrase}`);
  if (!readableStatus.includes(phrase)) problems.push(`${readableStatusPath} missing: ${phrase}`);
}

if (pkg.scripts?.["check:a1-tw-equity-candidate-artifact-delivery-spec"] !== "node scripts/check-a1-tw-equity-candidate-artifact-delivery-spec.mjs") {
  problems.push("package.json missing check:a1-tw-equity-candidate-artifact-delivery-spec");
}

for (const [pathName, text] of [
  [reviewGatePath, reviewGate],
  [fullHealthPath, fullHealth]
]) {
  if (!text.includes("scripts/check-a1-tw-equity-candidate-artifact-delivery-spec.mjs")) {
    problems.push(`${pathName} missing A1 candidate artifact delivery spec checker`);
  }
  if (!text.includes("a1-tw-equity-candidate-artifact-delivery-spec")) {
    problems.push(`${pathName} missing a1-tw-equity-candidate-artifact-delivery-spec name`);
  }
}

if (!reviewGate.includes('"a1-tw-equity-candidate-artifact-delivery-spec"')) {
  problems.push("review gate core set missing a1-tw-equity-candidate-artifact-delivery-spec");
}

if (fs.existsSync("data/candidates/tw-equity-staging-candidate.json")) {
  problems.push("default candidate artifact must not be committed by this spec slice");
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
