import fs from "node:fs";

const packetPath = "docs/PHASE_2A_GLOBAL_INDEX_FRED_RIGHTS_DECISION_PACKET.md";
const handoffPath = "docs/PHASE_2A_GLOBAL_INDEX_A2_HANDOFF_STATUS.md";

const problems = [];
const packet = read(packetPath);
const handoff = read(handoffPath);
const combined = `${packet}\n${handoff}`;

for (const phrase of [
  "Status: `phase_2a_global_index_fred_rights_decision_packet_ready_no_fetch`",
  "CEO recommendation: `a2_continue_phase_2a_global_index_lane`",
  "SP500",
  "NASDAQCOM",
  "DJIA",
  "NIKKEI225",
  "Current status:",
  "conditional",
  "https://fred.stlouisfed.org/docs/api/terms_of_use.html",
  "https://fred.stlouisfed.org/legal/",
  "https://fred.stlouisfed.org/docs/api/fred/",
  "PM/Legal Decision Questions",
  "Does FRED API access allow our planned automated cadence?",
  "May we store daily close values in our DB?",
  "May we derive and display change and changePercent?",
  "May we publicly display daily close and derived changes with attribution?",
  "Does public display count as redistribution under source-owner terms?",
  "Keep FRED route conditional.",
  "Do not enable bounded fetch.",
  "Do not write Supabase.",
  "runtime behavior | none",
  "public UI | none",
  "Supabase write | none",
  "SQL execution | none",
  "market data fetch | none",
  "Requires PM integration: yes.",
  "phase_2a_global_index_external_source_owner_question_template"
]) {
  if (!packet.includes(phrase)) problems.push(`${packetPath} missing: ${phrase}`);
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
  /Do enable bounded fetch/iu,
  /Do write Supabase/iu,
  /^market data fetch\s*\|\s*(?!none)/imu,
  /^Supabase write\s*\|\s*(?!none)/imu,
  /^SQL execution\s*\|\s*(?!none)/imu,
  /publicDataSource\s*=\s*supabase/iu,
  /scoreSource\s*=\s*real/iu,
  /raw source response sample/iu,
  /FRED route accepted/iu
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
      mode: "phase_2a_global_index_fred_rights_decision_packet",
      ceoRecommendation: "a2_continue_phase_2a_global_index_lane",
      packetPath,
      currentSourceStatus: "conditional",
      candidateSymbols: ["SP500", "NASDAQCOM", "DJIA", "NIKKEI225"],
      runtimeImpact: false,
      publicUiImpact: false,
      supabaseImpact: false,
      sqlImpact: false,
      dataFetchImpact: false,
      requiresPmIntegration: true,
      nextRecommendedSlice: "phase_2a_global_index_external_source_owner_question_template"
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
