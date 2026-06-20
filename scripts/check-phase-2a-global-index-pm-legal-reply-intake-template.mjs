import fs from "node:fs";

const templatePath = "docs/PHASE_2A_GLOBAL_INDEX_PM_LEGAL_REPLY_INTAKE_TEMPLATE.md";
const handoffPath = "docs/PHASE_2A_GLOBAL_INDEX_A2_HANDOFF_STATUS.md";

const problems = [];
const template = read(templatePath);
const handoff = read(handoffPath);
const combined = `${template}\n${handoff}`;

for (const phrase of [
  "Status: `phase_2a_global_index_pm_legal_reply_intake_template_ready_no_fetch`",
  "CEO recommendation: `a2_continue_phase_2a_global_index_lane`",
  "It is an intake record only.",
  "A2 must not change `legalUsageStatus` to `accepted` unless PM mainline explicitly approves the classification after Legal review.",
  "replyRecorded=true",
  "sourceStatusChanged=false",
  "ingestionApproved=false",
  "fetchApproved=false",
  "writeApproved=false",
  "requiresPmMainlineClassification=true",
  "accepted_candidate_pending_pm_mainline",
  "Forbidden A2-only classification:",
  "pmMainlineClassification: PM-owned, not set by A2",
  "runtime behavior | none",
  "public UI | none",
  "Supabase write | none",
  "SQL execution | none",
  "market data fetch | none",
  "Requires PM integration: yes.",
  "phase_2a_global_index_pm_legal_intake_checker_design"
]) {
  if (!template.includes(phrase)) problems.push(`${templatePath} missing: ${phrase}`);
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
  /sourceStatusChanged=true/iu,
  /ingestionApproved=true/iu,
  /fetchApproved=true/iu,
  /writeApproved=true/iu,
  /publicDataSource\s*=\s*supabase/iu,
  /scoreSource\s*=\s*real/iu,
  /raw source response sample/iu,
  /proposedClassification:\s*accepted\s*$/imu
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
      mode: "phase_2a_global_index_pm_legal_reply_intake_template",
      ceoRecommendation: "a2_continue_phase_2a_global_index_lane",
      templatePath,
      runtimeImpact: false,
      publicUiImpact: false,
      supabaseImpact: false,
      sqlImpact: false,
      dataFetchImpact: false,
      requiresPmIntegration: true,
      nextRecommendedSlice: "phase_2a_global_index_pm_legal_intake_checker_design"
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
