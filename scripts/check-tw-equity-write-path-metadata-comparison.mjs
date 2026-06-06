import fs from "node:fs";
import { spawnSync } from "node:child_process";

const problems = [];

const docPath = "docs/TW_EQUITY_WRITE_PATH_METADATA_COMPARISON.md";
const reportPath = "scripts/report-tw-equity-write-path-metadata-comparison.mjs";
const statusPath = "PROJECT_STATUS.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const fullHealthPath = "scripts/check-localhost-full-health.mjs";

const doc = read(docPath);
const reportSource = read(reportPath);
const status = read(statusPath);
const pkg = JSON.parse(read(packagePath));
const reviewGate = read(reviewGatePath);
const fullHealth = read(fullHealthPath);

for (const phrase of [
  "TW Equity Write-Path Metadata Comparison",
  "tw_equity_write_path_metadata_comparison_local_insert_contract_clean_remote_write_path_unresolved",
  "readonly metadata is reachable",
  "local insert contract is clean",
  "write-path schema exposure",
  "before any third write attempt",
  "No Supabase connection",
  "`publicDataSource=mock`",
  "`scoreSource=mock`"
]) {
  if (!doc.includes(phrase)) problems.push(`${docPath} missing: ${phrase}`);
}

for (const phrase of [
  "Latest TW equity write-path metadata comparison slice",
  "docs/TW_EQUITY_WRITE_PATH_METADATA_COMPARISON.md",
  "scripts/report-tw-equity-write-path-metadata-comparison.mjs",
  "scripts/check-tw-equity-write-path-metadata-comparison.mjs",
  "tw_equity_write_path_metadata_comparison_local_insert_contract_clean_remote_write_path_unresolved",
  "candidate insert columns match the local migration contract",
  "No Supabase connection, SQL, migration execution, write attempt, staging row, `daily_prices` mutation, market-data fetch, public promotion, row coverage point, or real score source occurred"
]) {
  if (!status.includes(phrase)) problems.push(`${statusPath} missing: ${phrase}`);
}

if (
  pkg.scripts?.["report:tw-equity-write-path-metadata-comparison"] !==
  "node scripts/report-tw-equity-write-path-metadata-comparison.mjs"
) {
  problems.push("package.json missing report:tw-equity-write-path-metadata-comparison");
}

if (
  pkg.scripts?.["check:tw-equity-write-path-metadata-comparison"] !==
  "node scripts/check-tw-equity-write-path-metadata-comparison.mjs"
) {
  problems.push("package.json missing check:tw-equity-write-path-metadata-comparison");
}

for (const [pathName, text] of [
  [reviewGatePath, reviewGate],
  [fullHealthPath, fullHealth]
]) {
  if (!text.includes("scripts/check-tw-equity-write-path-metadata-comparison.mjs")) {
    problems.push(`${pathName} missing TW equity write-path metadata comparison checker`);
  }
  if (!text.includes("tw-equity-write-path-metadata-comparison")) {
    problems.push(`${pathName} missing tw-equity-write-path-metadata-comparison name`);
  }
}

const reportRun = spawnSync(process.execPath, [reportPath], { encoding: "utf8" });
if (reportRun.status !== 0) {
  problems.push(`${reportPath} failed to run`);
} else {
  try {
    const report = JSON.parse(reportRun.stdout);
    if (report.status !== "tw_equity_write_path_metadata_comparison_local_insert_contract_clean_remote_write_path_unresolved") {
      problems.push(`${reportPath} emitted unexpected status`);
    }
    if (report.localInsertContractClean !== true) problems.push(`${reportPath} must prove local insert contract clean`);
    if (report.problems?.length !== 0) problems.push(`${reportPath} must have no local insert contract problems`);
    if (report.latestMetadataEvidence?.runsReachableOk !== true || report.latestMetadataEvidence?.pricesReachableOk !== true) {
      problems.push(`${reportPath} must preserve latest reachable metadata evidence`);
    }
    for (const [table, extras] of Object.entries(report.extraCandidateColumns ?? {})) {
      if (extras.length !== 0) problems.push(`${reportPath} ${table} has extra candidate columns`);
    }
    for (const [table, missing] of Object.entries(report.missingFromCandidate ?? {})) {
      if (missing.length !== 0) problems.push(`${reportPath} ${table} has missing candidate columns`);
    }
    for (const key of [
      "connectionAttempted",
      "sqlExecuted",
      "migrationExecuted",
      "supabaseWriteAttempted",
      "stagingRowsCreated",
      "dailyPricesMutated",
      "marketDataFetched",
      "marketDataIngested",
      "rawPayloadsPrinted",
      "rowPayloadsPrinted",
      "secretsPrinted"
    ]) {
      if (report.safety?.[key] !== false) problems.push(`${reportPath} safety.${key} must be false`);
    }
    if (report.safety?.publicDataSource !== "mock" || report.safety?.scoreSource !== "mock") {
      problems.push(`${reportPath} must keep mock public/score sources`);
    }
  } catch {
    problems.push(`${reportPath} did not emit JSON`);
  }
}

for (const [pathName, text] of [
  [docPath, doc],
  [reportPath, reportSource]
]) {
  for (const forbidden of [".insert(", ".update(", ".delete(", ".upsert(", "sb_secret_", "sb_publishable_"]) {
    if (text.includes(forbidden)) problems.push(`${pathName} contains forbidden token: ${forbidden}`);
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
    return "{}";
  }

  return fs.readFileSync(filePath, "utf8");
}
