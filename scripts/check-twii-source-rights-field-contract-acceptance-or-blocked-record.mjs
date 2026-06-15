import fs from "node:fs";
import { spawnSync } from "node:child_process";

const docPath = "docs/TWII_SOURCE_RIGHTS_FIELD_CONTRACT_ACCEPTANCE_OR_BLOCKED_RECORD.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const problems = [];

const doc = read(docPath);
const pkg = readJson(packagePath);
const reviewGate = read(reviewGatePath);
const sourceRights = runJson("scripts/check-twii-source-rights-outcome-acceptance-gate.mjs");
const alignment = runJson("scripts/check-twii-field-contract-asset-mapping-alignment-gate.mjs");

for (const phrase of [
  "Status: `twii_source_rights_field_contract_acceptance_record_aligned_for_candidate_gate_no_execution`",
  "Decision: `accept_prior_blocked_record_as_superseded_by_alignment_gate`",
  "Superseded prior blocked status: `twii_source_rights_field_contract_acceptance_or_blocked_record_blocked_external_evidence_pending`",
  "Current authority: `twii_field_contract_asset_mapping_aligned_for_sanitized_candidate_gate_no_execution`",
  "Next PM route: `twii_sanitized_candidate_artifact_readiness_gate`",
  "publicDataSource remains `mock`",
  "scoreSource remains `mock`",
  "TWII execution remains `false`",
  "This record does not authorize SQL, Supabase connection, Supabase read/write, staging rows, `daily_prices` mutation, market-data fetch, candidate row generation, row coverage scoring, public source promotion, real score promotion, raw payload, row payload, stock id payload, or secrets."
]) {
  if (!doc.includes(phrase)) problems.push(`${docPath} missing phrase: ${phrase}`);
}

if (sourceRights.guardedStatus !== "twii_source_rights_outcome_accepted_for_next_gate_only_no_execution") {
  problems.push("source-rights outcome gate must be accepted for next gate only");
}

if (alignment.guardedStatus !== "twii_field_contract_asset_mapping_aligned_for_sanitized_candidate_gate_no_execution") {
  problems.push("field-contract asset-mapping alignment gate must be green");
}

if (alignment.nextPMRoute !== "twii_sanitized_candidate_artifact_readiness_gate") {
  problems.push("alignment nextPMRoute must point to twii_sanitized_candidate_artifact_readiness_gate");
}

if (alignment.twiiExecutionAllowedNow !== false) {
  problems.push("TWII execution must remain blocked");
}

if (alignment.publicDataSource !== "mock" || alignment.scoreSource !== "mock") {
  problems.push("runtime boundary must remain mock/mock");
}

if (
  pkg.scripts?.["check:twii-source-rights-field-contract-acceptance-or-blocked-record"] !==
  "node scripts/check-twii-source-rights-field-contract-acceptance-or-blocked-record.mjs"
) {
  problems.push(`${packagePath} missing check:twii-source-rights-field-contract-acceptance-or-blocked-record script`);
}

for (const phrase of [
  "scripts/check-twii-source-rights-field-contract-acceptance-or-blocked-record.mjs",
  "twii-source-rights-field-contract-acceptance-or-blocked-record"
]) {
  if (!reviewGate.includes(phrase)) problems.push(`${reviewGatePath} missing phrase: ${phrase}`);
}

for (const pattern of [
  /@supabase\/supabase-js/u,
  /createClient/u,
  /\.from\(/u,
  /\.insert\(/u,
  /\.update\(/u,
  /\.delete\(/u,
  /\.upsert\(/u,
  /process\.env/u,
  /SQL is approved/iu,
  /Supabase connection is approved/iu,
  /Supabase write is approved/iu,
  /daily_prices mutation is approved/iu,
  /row coverage scoring is approved/iu,
  /publicDataSource=supabase is approved/u,
  /scoreSource=real is approved/u,
  /RUN_REMOTE_NOW/u,
  /EXECUTION_COMPLETED/u,
  /sb_secret_/u,
  /SUPABASE_SERVICE_ROLE_KEY=/u
]) {
  if (pattern.test(doc)) problems.push(`${docPath} contains forbidden pattern: ${pattern}`);
}

const ok = problems.length === 0;

console.log(
  JSON.stringify(
    {
      status: ok ? "ok" : "blocked",
      guardedStatus: ok
        ? "twii_source_rights_field_contract_acceptance_record_aligned_for_candidate_gate_no_execution"
        : "twii_source_rights_field_contract_acceptance_record_alignment_blocked",
      priorStatusSuperseded: "twii_source_rights_field_contract_acceptance_or_blocked_record_blocked_external_evidence_pending",
      currentAuthority: alignment.guardedStatus ?? null,
      nextPMRoute: alignment.nextPMRoute ?? null,
      publicDataSource: alignment.publicDataSource ?? null,
      scoreSource: alignment.scoreSource ?? null,
      twiiExecutionAllowedNow: alignment.twiiExecutionAllowedNow ?? null,
      problems
    },
    null,
    2
  )
);

if (!ok) process.exit(1);

function read(filePath) {
  if (!fs.existsSync(filePath)) {
    problems.push(`missing file: ${filePath}`);
    return "";
  }
  return fs.readFileSync(filePath, "utf8");
}

function readJson(filePath) {
  try {
    return JSON.parse(read(filePath));
  } catch (error) {
    problems.push(`${filePath} invalid JSON: ${error.message}`);
    return {};
  }
}

function runJson(scriptPath) {
  const result = spawnSync(process.execPath, [scriptPath], {
    cwd: process.cwd(),
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
    timeout: 120000
  });
  if (result.status !== 0) {
    problems.push(`${scriptPath} failed with exit ${result.status}`);
    return {};
  }
  const start = result.stdout.indexOf("{");
  try {
    return JSON.parse(result.stdout.slice(start));
  } catch (error) {
    problems.push(`${scriptPath} output invalid JSON: ${error.message}`);
    return {};
  }
}
