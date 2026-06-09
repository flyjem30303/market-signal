import fs from "node:fs";

const problems = [];

const docPath = "docs/PUBLIC_BETA_READINESS_GATE.md";
const statusPath = "PROJECT_STATUS.md";
const boardPath = "docs/LAUNCH_ENGINEERING_WORKSTREAM_BOARD.md";
const formalLaunchPath = "docs/FORMAL_LAUNCH_DEPLOYMENT_READINESS_GATE.md";
const twiiGatePath = "docs/TWII_SOURCE_RIGHTS_OUTCOME_GATE.md";
const etfGatePath = "docs/ETF_SOURCE_RIGHTS_OUTCOME_DECISION_GATE.md";
const scoringGatePath = "docs/TW_EQUITY_ROW_COVERAGE_SCORING_GATE.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";

const doc = read(docPath);
const status = read(statusPath);
const board = read(boardPath);
const formalLaunch = read(formalLaunchPath);
const twiiGate = read(twiiGatePath);
const etfGate = read(etfGatePath);
const scoringGate = read(scoringGatePath);
const pkg = JSON.parse(read(packagePath));
const reviewGate = read(reviewGatePath);

for (const phrase of [
  "Status: `public_beta_readiness_gate_ready_local_beta_allowed_real_promotion_blocked`",
  "`public_beta_ready_if_mock_boundary_visible_and_real_promotion_blocked`",
  "does not claim formal production launch completion",
  "does not promote `publicDataSource=supabase`",
  "does not set `scoreSource=real`",
  "TW equity production `daily_prices` insert-missing merge completed with final target rows `180`",
  "TW equity sub-scope is accepted at `180/180`",
  "Full Level 1 MVP row coverage remains `182/360`",
  "Remaining TWII sub-scope remains `0/60`",
  "Remaining ETF sub-scope remains `2/120`",
  "TWII source-rights outcome gate is `twii_source_rights_outcome_gate_candidate_ready_for_pm_review`, but TWII execution and real promotion remain blocked.",
  "ETF source-rights outcome remains blocked by `legal_and_redistribution_terms_unapproved`",
  "Public runtime boundary remains `publicDataSource=mock`",
  "Score boundary remains `scoreSource=mock`",
  "Formal deployment readiness is `formal_launch_deployment_readiness_gate_ready_not_deployed`",
  "`ready_for_local_public_beta_preflight_not_production_deployed`",
  "PM may continue preparing public Beta release artifacts",
  "PM must not publish a production deployment from this gate",
  "PM must not claim real data coverage is complete",
  "PM must not promote public source or score source",
  "Public Beta readiness requires these criteria",
  "`tw_equity_closed_loop_partial_coverage`",
  "`mock_required`",
  "`preflight_ready_not_deployed`",
  "`human_or_external_required`",
  "Full MVP row coverage is still `182/360`, not `360/360`",
  "TWII remains `not_approved_for_probe_or_ingestion`",
  "ETF source rights remain `legal_and_redistribution_terms_unapproved`",
  "A1 next task",
  "A2 next task"
]) {
  if (!doc.includes(phrase)) problems.push(`${docPath} missing: ${phrase}`);
}

for (const phrase of [
  "does not deploy production",
  "does not run SQL",
  "does not connect to Supabase",
  "does not write Supabase",
  "does not create staging rows",
  "does not modify `daily_prices`",
  "does not fetch raw market data",
  "does not ingest raw market data",
  "does not store raw market data",
  "does not commit raw market data",
  "does not output secrets",
  "does not output raw payload",
  "does not output row payload",
  "does not output stock id payload",
  "does not give row coverage points",
  "does not promote `publicDataSource=supabase`",
  "does not set `scoreSource=real`",
  "does not claim formal launch completion",
  "does not claim full MVP coverage completion"
]) {
  if (!doc.includes(phrase)) problems.push(`${docPath} missing hard stop: ${phrase}`);
}

for (const phrase of [
  "insert_missing_merge_passed_readback_complete",
  "final target rows `180`",
  "tw_equity_row_coverage_subscope_accepted_overall_coverage_blocked",
  "full MVP row coverage remains blocked at `182/360`",
  "TWII` `0/60",
  "0050` `1/60",
  "006208` `1/60",
  "Latest TWII source-rights outcome gate slice"
]) {
  if (!status.includes(phrase)) problems.push(`${statusPath} missing: ${phrase}`);
}

for (const phrase of [
  "Status: `launch_engineering_workstream_board_ready`",
  "PM owns the launch path",
  "MVP row coverage target: `360/360`",
  "Latest accepted aggregate row coverage evidence: `182/360`",
  "Public trust / legal copy",
  "Deployment readiness"
]) {
  if (!board.includes(phrase)) problems.push(`${boardPath} missing: ${phrase}`);
}

for (const phrase of [
  "Status: `formal_launch_deployment_readiness_gate_ready_not_deployed`",
  "`ready_for_deployment_preflight_review_not_deployed`",
  "Required local proof before deployment review",
  "Required production proof after a future deployment attempt"
]) {
  if (!formalLaunch.includes(phrase)) problems.push(`${formalLaunchPath} missing: ${phrase}`);
}

for (const phrase of [
  "Status: `twii_source_rights_outcome_gate_candidate_ready_for_pm_review`",
  "`candidate_ready_no_execution_authority`",
  "this gate is ready for PM/CEO review only"
]) {
  if (!twiiGate.includes(phrase)) problems.push(`${twiiGatePath} missing: ${phrase}`);
}

for (const phrase of [
  "Status: `etf_source_rights_outcome_decision_gate_blocked_external_rights_pending`",
  "`rejected_for_execution_pending_external_rights`",
  "`legal_and_redistribution_terms_unapproved`"
]) {
  if (!etfGate.includes(phrase)) problems.push(`${etfGatePath} missing: ${phrase}`);
}

for (const phrase of [
  "CEO accepts the TW equity sub-scope coverage result",
  "TW equity sub-scope:",
  "full-scope status: `blocked_incomplete`",
  "`TWII`: `0/60`",
  "`0050`: `1/60`",
  "`006208`: `1/60`"
]) {
  if (!scoringGate.includes(phrase)) problems.push(`${scoringGatePath} missing: ${phrase}`);
}

if (pkg.scripts?.["check:public-beta-readiness-gate"] !== "node scripts/check-public-beta-readiness-gate.mjs") {
  problems.push(`${packagePath} missing check:public-beta-readiness-gate script`);
}

for (const phrase of [
  "scripts/check-public-beta-readiness-gate.mjs",
  "expectStatus: \"ok\"",
  "name: \"public-beta-readiness-gate\""
]) {
  if (!reviewGate.includes(phrase)) problems.push(`${reviewGatePath} missing: ${phrase}`);
}

const forbiddenDocPatterns = [
  /NEXT_PUBLIC_SUPABASE_URL\s*=\s*https?:/u,
  /NEXT_PUBLIC_SUPABASE_ANON_KEY\s*=/u,
  /SUPABASE_SERVICE_ROLE_KEY\s*=/u,
  /\bsb_(publishable|secret|anon|service_role)_[a-z0-9_-]+/iu,
  /@supabase\/supabase-js/u,
  /createClient/u,
  /\.from\(/u,
  /\.insert\(/u,
  /\.update\(/u,
  /\.delete\(/u,
  /\.upsert\(/u,
  /SQL execution is approved/u,
  /Supabase writes are approved/u,
  /formal launch complete/u,
  /full MVP coverage complete/u,
  /publicDataSource=supabase is approved/u,
  /scoreSource=real is approved/u,
  /row coverage points awarded/u,
  /RUN_DEPLOY_NOW/u,
  /EXECUTION_COMPLETED/u
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
      status: "ok",
      decisionStatus: "public_beta_readiness_gate_ready_local_beta_allowed_real_promotion_blocked",
      betaOutcome: "ready_for_local_public_beta_preflight_not_production_deployed",
      docPath
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
