import fs from "node:fs";
import { spawnSync } from "node:child_process";

const problems = [];

const docPath = "docs/TW_EQUITY_RUN_ID_UUID_CONTRACT_REPAIR_GATE.md";
const reportPath = "scripts/report-tw-equity-run-id-uuid-contract-repair-gate.mjs";
const statusPath = "PROJECT_STATUS.md";
const readableStatusPath = "scripts/check-readable-current-status.mjs";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const fullHealthPath = "scripts/check-localhost-full-health.mjs";

const doc = read(docPath);
const reportSource = read(reportPath);
const status = read(statusPath);
const readableStatus = read(readableStatusPath);
const pkg = JSON.parse(read(packagePath));
const reviewGate = read(reviewGatePath);
const fullHealth = read(fullHealthPath);

for (const phrase of [
  "TW Equity Run ID UUID Contract Repair Gate",
  "tw_equity_run_id_uuid_contract_repair_gate_complete_mock_only",
  "LOCAL_UUID_CONTRACT_REPAIRED_BEFORE_REMOTE_REPAIR_OR_THIRD_ATTEMPT",
  "candidate_run_run_id_must_be_uuid",
  "candidate_price_<index>_run_id_must_be_uuid",
  "crypto.randomUUID()",
  "data/candidates/tw-equity-staging-candidate.json",
  "all 180 candidate price rows",
  "runner mock path accepts the repaired artifact without remote connection",
  "no remote Supabase connection",
  "`publicDataSource=mock`",
  "`scoreSource=mock`"
]) {
  if (!doc.includes(phrase)) problems.push(`${docPath} missing: ${phrase}`);
}

for (const phrase of [
  "Latest TW equity run-id UUID contract repair gate slice",
  "docs/TW_EQUITY_RUN_ID_UUID_CONTRACT_REPAIR_GATE.md",
  "scripts/report-tw-equity-run-id-uuid-contract-repair-gate.mjs",
  "scripts/check-tw-equity-run-id-uuid-contract-repair-gate.mjs",
  "tw_equity_run_id_uuid_contract_repair_gate_complete_mock_only",
  "runner validator, sanitized candidate generator, validator documentation, and accepted sanitized candidate artifact now require UUID-shaped run ids",
  "No remote Supabase connection, SQL, migration execution, write attempt, staging row, `daily_prices` mutation, market-data fetch, public promotion, row coverage point, or real score source occurred"
]) {
  if (!status.includes(phrase)) problems.push(`${statusPath} missing: ${phrase}`);
  if (!readableStatus.includes(phrase)) problems.push(`${readableStatusPath} missing: ${phrase}`);
}

if (
  pkg.scripts?.["report:tw-equity-run-id-uuid-contract-repair-gate"] !==
  "node scripts/report-tw-equity-run-id-uuid-contract-repair-gate.mjs"
) {
  problems.push("package.json missing report:tw-equity-run-id-uuid-contract-repair-gate");
}

if (
  pkg.scripts?.["check:tw-equity-run-id-uuid-contract-repair-gate"] !==
  "node scripts/check-tw-equity-run-id-uuid-contract-repair-gate.mjs"
) {
  problems.push("package.json missing check:tw-equity-run-id-uuid-contract-repair-gate");
}

for (const [pathName, text] of [
  [reviewGatePath, reviewGate],
  [fullHealthPath, fullHealth]
]) {
  if (!text.includes("scripts/check-tw-equity-run-id-uuid-contract-repair-gate.mjs")) {
    problems.push(`${pathName} missing TW equity run-id UUID contract repair gate checker`);
  }
  if (!text.includes("tw-equity-run-id-uuid-contract-repair-gate")) {
    problems.push(`${pathName} missing tw-equity-run-id-uuid-contract-repair-gate name`);
  }
}

if (!reviewGate.includes('"tw-equity-run-id-uuid-contract-repair-gate"')) {
  problems.push("review gate core set missing tw-equity-run-id-uuid-contract-repair-gate");
}

const reportRun = spawnSync(process.execPath, [reportPath], { encoding: "utf8" });
if (reportRun.status !== 0) {
  problems.push(`${reportPath} failed to run`);
} else {
  try {
    const report = JSON.parse(reportRun.stdout);
    if (report.status !== "tw_equity_run_id_uuid_contract_repair_gate_complete_mock_only") {
      problems.push(`${reportPath} emitted unexpected status`);
    }
    for (const key of [
      "candidateRunIdIsUuidShaped",
      "candidatePriceRunIdsAllMatchRunId",
      "candidatePriceRunIdsAllUuidShaped",
      "generatorUsesRandomUuid",
      "runnerRejectsNonUuidCandidateRunId",
      "runnerRejectsNonUuidCandidatePriceRunId",
      "validatorDocMentionsUuidContract"
    ]) {
      if (report.localRepairEvidence?.[key] !== true) problems.push(`${reportPath} localRepairEvidence.${key} must be true`);
    }
    if (report.localRepairEvidence?.candidateInputPriceRows !== 180) {
      problems.push(`${reportPath} must preserve 180 candidate price rows`);
    }
    if (report.safety?.publicDataSource !== "mock" || report.safety?.scoreSource !== "mock") {
      problems.push(`${reportPath} must keep publicDataSource and scoreSource mock`);
    }
    for (const key of [
      "sqlExecuted",
      "migrationExecuted",
      "remoteSupabaseConnectionAttempted",
      "supabaseWriteAttempted",
      "stagingRowsCreated",
      "dailyPricesMutated",
      "marketDataFetched",
      "marketDataIngested",
      "rawPayloadsPrinted",
      "rowPayloadsPrinted",
      "secretsPrinted",
      "publicPromotionAllowed",
      "rowCoveragePointsAllowed",
      "scoreSourceRealAllowed"
    ]) {
      if (report.safety?.[key] !== false) problems.push(`${reportPath} safety.${key} must be false`);
    }
  } catch {
    problems.push(`${reportPath} did not emit JSON`);
  }
}

for (const [pathName, text] of [
  [docPath, doc],
  [reportPath, reportSource]
]) {
  for (const forbidden of [
    ".insert(",
    ".update(",
    ".delete(",
    ".upsert(",
    "await import(\"@supabase/supabase-js\")",
    "sb_secret_",
    "sb_publishable_"
  ]) {
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
    return "";
  }

  return fs.readFileSync(filePath, "utf8");
}
