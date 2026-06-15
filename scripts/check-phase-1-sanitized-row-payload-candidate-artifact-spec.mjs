import fs from "node:fs";

const docPath = "docs/PHASE_1_SANITIZED_ROW_PAYLOAD_CANDIDATE_ARTIFACT_SPEC.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const problems = [];

const doc = readText(docPath);
const packageJson = JSON.parse(readText(packagePath));
const reviewGate = readText(reviewGatePath);

validateDoc();
validateRegistration();
validateBoundaries();

const ok = problems.length === 0;
console.log(
  JSON.stringify(
    {
      status: ok ? "ok" : "blocked",
      guardedStatus: ok
        ? "phase_1_sanitized_row_payload_candidate_artifact_spec_ready_no_market_rows"
        : "phase_1_sanitized_row_payload_candidate_artifact_spec_blocked",
      nextRoute: "a1_prepare_local_or_external_sanitized_row_payload_candidate_artifact_path",
      publicDataSource: "mock",
      scoreSource: "mock",
      problems
    },
    null,
    2
  )
);

if (!ok) process.exit(1);

function validateDoc() {
  for (const token of [
    "phase_1_sanitized_row_payload_candidate_artifact_spec_ready_no_market_rows",
    "row_payload_candidate_artifact_spec_no_market_rows",
    "candidate_row_payloads_missing",
    "deliveryMode=local_or_external_path_only",
    "commitPolicy=do_not_commit_market_row_payloads_by_default",
    "validatorOutput=aggregate_counts_only",
    "boundedAttemptScope=twii_and_etf_phase_1_missing_row_closure_only",
    "fullLevel1MissingRows=178",
    "twiiMissingRows=60",
    "etfMissingRows=118",
    "`TWII`, `0050`, `006208`",
    "`symbol`",
    "`trade_date`",
    "`close`",
    "`source_row_hash`",
    "stock_id",
    "No committed market row payloads",
    "No row payload output",
    "No public real-data claim",
    "No investment advice",
    "A1 should prepare a local or external sanitized row-payload candidate artifact path"
  ]) {
    if (!doc.includes(token)) problems.push(`${docPath} missing ${token}`);
  }
}

function validateRegistration() {
  if (
    packageJson.scripts?.["check:phase-1-sanitized-row-payload-candidate-artifact-spec"] !==
    "node scripts/check-phase-1-sanitized-row-payload-candidate-artifact-spec.mjs"
  ) {
    problems.push("package.json missing check:phase-1-sanitized-row-payload-candidate-artifact-spec");
  }
  if (!reviewGate.includes("scripts/check-phase-1-sanitized-row-payload-candidate-artifact-spec.mjs")) {
    problems.push("review gate missing row-payload candidate artifact spec checker");
  }
  if (!reviewGate.includes('"phase-1-sanitized-row-payload-candidate-artifact-spec"')) {
    problems.push("focused review gate missing row-payload candidate artifact spec checker");
  }
}

function validateBoundaries() {
  for (const pattern of [
    /@supabase\/supabase-js/u,
    /createClient\s*\(/u,
    /\.from\s*\(/u,
    /\.insert\s*\(/u,
    /\.update\s*\(/u,
    /\.delete\s*\(/u,
    /\.upsert\s*\(/u,
    /\bsb_(publishable|secret|anon|service_role)_[a-z0-9_-]+/iu,
    /publicDataSource=supabase/u,
    /scoreSource=real/u,
    /SQL execution is approved/u,
    /Supabase write is approved/u
  ]) {
    if (pattern.test(doc)) problems.push(`${docPath} contains forbidden pattern ${pattern}`);
  }
}

function readText(filePath) {
  try {
    return fs.readFileSync(filePath, "utf8");
  } catch (error) {
    problems.push(`failed to read ${filePath}: ${error.message}`);
    return "{}";
  }
}
