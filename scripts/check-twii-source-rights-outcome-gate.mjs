import fs from "node:fs";

const problems = [];

const docPath = "docs/TWII_SOURCE_RIGHTS_OUTCOME_GATE.md";
const readinessPath = "docs/A1_TWII_SOURCE_RIGHTS_AND_CANDIDATE_READINESS_PACKET.md";
const scoringPath = "docs/TW_EQUITY_ROW_COVERAGE_SCORING_GATE.md";
const etfGatePath = "docs/ETF_SOURCE_RIGHTS_OUTCOME_DECISION_GATE.md";
const boardPath = "docs/LAUNCH_ENGINEERING_WORKSTREAM_BOARD.md";
const statusPath = "PROJECT_STATUS.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";

const doc = read(docPath);
const readiness = read(readinessPath);
const scoring = read(scoringPath);
const etfGate = read(etfGatePath);
const board = read(boardPath);
const status = read(statusPath);
const pkg = JSON.parse(read(packagePath));
const reviewGate = read(reviewGatePath);

for (const phrase of [
  "Status: `twii_source_rights_outcome_gate_blocked_external_rights_pending`",
  "`rejected_for_execution_pending_external_rights_and_field_contract`",
  "The TWII route remains `not_approved_for_probe_or_ingestion`",
  "Level 1 MVP row coverage remains `182/360`",
  "TWII is `0/60`",
  "ETF remains blocked by `legal_and_redistribution_terms_unapproved`",
  "TWII selected first candidate: `official-exchange-index`",
  "TWII selection status: `accepted_for_rights_and_field_contract_review_only`",
  "TWII review state: `not_approved_for_probe_or_ingestion`",
  "TWII fallback candidates: `licensed-market-data-vendor`, `internal-approved-feed`",
  "Runtime boundary remains `publicDataSource=mock`",
  "Score boundary remains `scoreSource=mock`",
  "`no_current_execution_acceptance`",
  "No item is accepted by this gate",
  "This gate decides that no TWII execution is currently allowed",
  "A1 may prepare TWII index field-contract decision support",
  "A2 may improve briefing or legal copy",
  "PM remains the only integration owner",
  "does not approve source rights",
  "does not approve field contract",
  "does not generate TWII candidates",
  "does not probe an external endpoint",
  "does not promote `publicDataSource=supabase`",
  "does not set `scoreSource=real`"
]) {
  if (!doc.includes(phrase)) problems.push(`${docPath} missing: ${phrase}`);
}

for (const phrase of [
  "Status: `a1_twii_source_rights_and_candidate_readiness_packet_ready_local_only_not_executable`",
  "Full MVP row coverage: `182/360`",
  "`TWII`: `0/60`",
  "Selected first candidate: `official-exchange-index`",
  "Review state: `not_approved_for_probe_or_ingestion`"
]) {
  if (!readiness.includes(phrase)) problems.push(`${readinessPath} missing: ${phrase}`);
}

for (const phrase of ["observed rows: `182`", "full-scope status: `blocked_incomplete`", "`TWII`: `0/60`"]) {
  if (!scoring.includes(phrase)) problems.push(`${scoringPath} missing: ${phrase}`);
}

for (const phrase of [
  "Status: `etf_source_rights_outcome_decision_gate_blocked_external_rights_pending`",
  "`rejected_for_execution_pending_external_rights`",
  "`legal_and_redistribution_terms_unapproved`"
]) {
  if (!etfGate.includes(phrase)) problems.push(`${etfGatePath} missing: ${phrase}`);
}

for (const phrase of [
  "`docs/TWII_SOURCE_RIGHTS_OUTCOME_GATE.md` is `blocked` as a PM mainline data gate",
  "`docs/A1_TWII_INDEX_FIELD_CONTRACT_DECISION_SUPPORT.md` is `accepted` for PM mainline review",
  "`docs/A2 briefing copy-only patch` is `accepted` for PM mainline review",
  "TWII remains `not_approved_for_probe_or_ingestion`",
  "PM should reassign A1 next to a TWII sanitized candidate artifact readiness gate only after source rights and field contract are accepted"
]) {
  if (!board.includes(phrase)) problems.push(`${boardPath} missing: ${phrase}`);
}

for (const phrase of [
  "Latest TWII source-rights outcome gate slice",
  "twii_source_rights_outcome_gate_blocked_external_rights_pending",
  "rejected_for_execution_pending_external_rights_and_field_contract",
  "not_approved_for_probe_or_ingestion"
]) {
  if (!status.includes(phrase)) problems.push(`${statusPath} missing: ${phrase}`);
}

if (pkg.scripts?.["check:twii-source-rights-outcome-gate"] !== "node scripts/check-twii-source-rights-outcome-gate.mjs") {
  problems.push(`${packagePath} missing check:twii-source-rights-outcome-gate script`);
}

if (!reviewGate.includes("scripts/check-twii-source-rights-outcome-gate.mjs")) {
  problems.push(`${reviewGatePath} missing twii-source-rights-outcome-gate registration`);
}

const forbiddenDocPatterns = [
  /@supabase\/supabase-js/u,
  /createClient/u,
  /\.from\(/u,
  /\.insert\(/u,
  /\.update\(/u,
  /\.delete\(/u,
  /\.upsert\(/u,
  /process\.env/u,
  /source rights (are )?approved/iu,
  /rights (are )?passed/iu,
  /not_approved_for_probe_or_ingestion is resolved/u,
  /field contract is approved/u,
  /candidate generation is approved/u,
  /SQL execution is approved/u,
  /Supabase connection is approved/u,
  /Supabase writes are approved/u,
  /staging rows are approved/u,
  /daily_prices mutation is approved/u,
  /raw market data fetch is approved/u,
  /row coverage points awarded/u,
  /publicDataSource=supabase is approved/u,
  /scoreSource=real is approved/u,
  /RUN_REMOTE_NOW/u,
  /EXECUTION_COMPLETED/u,
  /sb_secret_/u,
  /sb_publishable_/u,
  /SUPABASE_SERVICE_ROLE_KEY=/u
];

for (const pattern of forbiddenDocPatterns) {
  if (pattern.test(doc)) problems.push(`${docPath} contains forbidden token: ${pattern}`);
}

if (problems.length > 0) {
  console.log(JSON.stringify({ status: "blocked", problems }, null, 2));
  process.exit(1);
}

console.log(
  JSON.stringify(
    {
      status: "blocked",
      blockedReason: "twii_source_rights_and_field_contract_evidence_unresolved",
      gate: "twii_source_rights_outcome_gate"
    },
    null,
    2
  )
);

function read(filePath) {
  if (!fs.existsSync(filePath)) {
    problems.push(`missing file: ${filePath}`);
    return "";
  }

  return fs.readFileSync(filePath, "utf8");
}
