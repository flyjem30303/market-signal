import fs from "node:fs";

const designPath = "docs/PHASE_2A_GLOBAL_INDEX_PM_LEGAL_INTAKE_CHECKER_DESIGN.md";
const handoffPath = "docs/PHASE_2A_GLOBAL_INDEX_A2_HANDOFF_STATUS.md";

const problems = [];
const design = read(designPath);
const handoff = read(handoffPath);
const combined = `${design}\n${handoff}`;

for (const phrase of [
  "Status: `phase_2a_global_index_pm_legal_intake_checker_design_ready_report_only`",
  "CEO recommendation: `a2_continue_phase_2a_global_index_lane`",
  "The checker must validate intake completeness and fail closed",
  "read a local intake record",
  "check required fields",
  "check allowed enum values",
  "change legalUsageStatus",
  "change publicDataSource",
  "change scoreSource",
  "sourceStatusChanged=false",
  "ingestionApproved=false",
  "fetchApproved=false",
  "writeApproved=false",
  "requiresPmMainlineClassification=true",
  "accepted_candidate_pending_pm_mainline",
  "proposedClassification=accepted",
  "legalUsageStatus=accepted",
  "runtime behavior | none",
  "public UI | none",
  "Supabase write | none",
  "SQL execution | none",
  "market data fetch | none",
  "Requires PM integration: yes.",
  "phase_2a_global_index_pm_legal_intake_sample_record"
]) {
  if (!design.includes(phrase)) problems.push(`${designPath} missing: ${phrase}`);
}

if (!handoff.includes("A2 should continue updating this handoff status file after each coherent slice.")) {
  problems.push(`${handoffPath} missing standing handoff instruction`);
}

for (const pattern of [
  /\bfetch\s*\(/iu,
  /\baxios\b/iu,
  /\bsupabase\.from\b/iu,
  /\binsert\s+into\b/iu,
  /\bupdate\s+daily_prices\b/iu,
  /^market data fetch\s*\|\s*(?!none)/imu,
  /^Supabase write\s*\|\s*(?!none)/imu,
  /^SQL execution\s*\|\s*(?!none)/imu,
  /approved for ingestion/iu
]) {
  if (pattern.test(combined)) problems.push(`forbidden pattern found: ${pattern}`);
}

if (problems.length > 0) {
  console.error(JSON.stringify({ status: "blocked", problems }, null, 2));
  process.exit(1);
}

console.log(
  JSON.stringify(
    {
      status: "ok",
      mode: "phase_2a_global_index_pm_legal_intake_checker_design",
      ceoRecommendation: "a2_continue_phase_2a_global_index_lane",
      designPath,
      runtimeImpact: false,
      publicUiImpact: false,
      supabaseImpact: false,
      sqlImpact: false,
      dataFetchImpact: false,
      requiresPmIntegration: true,
      nextRecommendedSlice: "phase_2a_global_index_pm_legal_intake_sample_record"
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
