import fs from "node:fs";

const rollupPath = "docs/PHASE_2A_GLOBAL_INDEX_NO_FETCH_WORKSTREAM_ROLLUP.md";
const handoffPath = "docs/PHASE_2A_GLOBAL_INDEX_A2_HANDOFF_STATUS.md";

const problems = [];
const rollup = read(rollupPath);
const handoff = read(handoffPath);
const combined = `${rollup}\n${handoff}`;

for (const phrase of [
  "Status: `phase_2a_global_index_no_fetch_workstream_rollup_ready`",
  "CEO recommendation: `a2_continue_phase_2a_global_index_lane`",
  "It is a no-fetch, no-write, report-only workstream summary.",
  "phase_2a_global_index_source_registry_report_only",
  "phase_2a_global_index_disabled_bounded_packet_design",
  "phase_2a_global_index_source_rights_evidence_worksheet",
  "phase_2a_global_index_fred_rights_decision_packet",
  "phase_2a_global_index_external_source_owner_question_template",
  "phase_2a_global_index_pm_legal_reply_intake_template",
  "phase_2a_global_index_pm_legal_intake_checker_design",
  "phase_2a_global_index_pm_legal_intake_sample_record",
  "accepted | none",
  "conditional | SP500, NASDAQCOM, DJIA, NIKKEI225",
  "rejected | HSI, SXXP, DAX",
  "unresolved | KOSPI, SSECOMP, CSI300",
  "Do not ingest.",
  "Do not fetch.",
  "Do not write.",
  "runtime behavior | none",
  "public UI | none",
  "Supabase write | none",
  "SQL execution | none",
  "market data fetch | none",
  "Requires PM integration: yes.",
  "phase_2a_global_index_pm_mainline_integration_waiting_room"
]) {
  if (!rollup.includes(phrase)) problems.push(`${rollupPath} missing: ${phrase}`);
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
  /source acceptance approved/iu,
  /ingestion approval granted/iu
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
      mode: "phase_2a_global_index_no_fetch_workstream_rollup",
      ceoRecommendation: "a2_continue_phase_2a_global_index_lane",
      rollupPath,
      accepted: [],
      conditional: ["SP500", "NASDAQCOM", "DJIA", "NIKKEI225"],
      rejected: ["HSI", "SXXP", "DAX"],
      unresolved: ["KOSPI", "SSECOMP", "CSI300"],
      runtimeImpact: false,
      publicUiImpact: false,
      supabaseImpact: false,
      sqlImpact: false,
      dataFetchImpact: false,
      requiresPmIntegration: true,
      nextRecommendedSlice: "phase_2a_global_index_pm_mainline_integration_waiting_room"
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
