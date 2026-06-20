import fs from "node:fs";

const samplePath = "docs/PHASE_2A_GLOBAL_INDEX_PM_LEGAL_INTAKE_SAMPLE_RECORD.md";
const handoffPath = "docs/PHASE_2A_GLOBAL_INDEX_A2_HANDOFF_STATUS.md";

const problems = [];
const sample = read(samplePath);
const handoff = read(handoffPath);
const combined = `${sample}\n${handoff}`;

for (const phrase of [
  "Status: `phase_2a_global_index_pm_legal_intake_sample_record_ready_no_fetch`",
  "CEO recommendation: `a2_continue_phase_2a_global_index_lane`",
  "It is not a real source-owner reply.",
  "It does not approve ingestion.",
  "It does not change source status.",
  "replyType: internal_followup_needed",
  "automationAllowed: needs_more_review",
  "storageAllowed: needs_more_review",
  "publicDisplayAllowed: needs_more_review",
  "derivedFieldsAllowed: needs_more_review",
  "redistributionAllowed: needs_more_review",
  "commercialUseAllowed: needs_more_review",
  "proposedClassification: unresolved",
  "pmMainlineClassification: PM-owned, not set by A2",
  "replyRecorded=true",
  "sourceStatusChanged=false",
  "ingestionApproved=false",
  "fetchApproved=false",
  "writeApproved=false",
  "requiresPmMainlineClassification=true",
  "runtime behavior | none",
  "public UI | none",
  "Supabase write | none",
  "SQL execution | none",
  "market data fetch | none",
  "Requires PM integration: yes.",
  "phase_2a_global_index_no_fetch_workstream_rollup"
]) {
  if (!sample.includes(phrase)) problems.push(`${samplePath} missing: ${phrase}`);
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
  /requiresPmMainlineClassification=false/iu,
  /publicDataSource\s*=\s*supabase/iu,
  /scoreSource\s*=\s*real/iu,
  /proposedClassification:\s*accepted\s*$/imu,
  /source acceptance approved/iu
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
      mode: "phase_2a_global_index_pm_legal_intake_sample_record",
      ceoRecommendation: "a2_continue_phase_2a_global_index_lane",
      samplePath,
      sourceStatusChanged: false,
      ingestionApproved: false,
      fetchApproved: false,
      writeApproved: false,
      runtimeImpact: false,
      publicUiImpact: false,
      supabaseImpact: false,
      sqlImpact: false,
      dataFetchImpact: false,
      requiresPmIntegration: true,
      nextRecommendedSlice: "phase_2a_global_index_no_fetch_workstream_rollup"
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
