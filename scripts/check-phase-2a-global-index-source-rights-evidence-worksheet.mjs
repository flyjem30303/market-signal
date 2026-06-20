import fs from "node:fs";

const worksheetPath = "docs/PHASE_2A_GLOBAL_INDEX_SOURCE_RIGHTS_EVIDENCE_WORKSHEET.md";
const handoffPath = "docs/PHASE_2A_GLOBAL_INDEX_A2_HANDOFF_STATUS.md";

const problems = [];
const worksheet = read(worksheetPath);
const handoff = read(handoffPath);
const combined = `${worksheet}\n${handoff}`;

for (const phrase of [
  "Status: `phase_2a_global_index_source_rights_evidence_worksheet_ready_no_fetch`",
  "CEO recommendation: `a2_continue_phase_2a_global_index_lane`",
  "No source may be upgraded to `accepted` unless every required evidence field is filled and reviewed by PM/Legal.",
  "sourceOwner",
  "automationAllowed",
  "storageAllowed",
  "publicDisplayAllowed",
  "redistributionAllowed",
  "derivedFieldsAllowed",
  "attributionRequired",
  "commercialUseAllowed",
  "rateLimitPolicy",
  "pmLegalDecision",
  "decisionOwner",
  "FRED Candidate Route",
  "KRX Candidate Route",
  "Licensed Vendor Route",
  "SP500 | conditional",
  "NASDAQCOM | conditional",
  "DJIA | conditional",
  "NIKKEI225 | conditional",
  "KOSPI | unresolved",
  "HSI | rejected",
  "SXXP | rejected",
  "DAX | rejected",
  "SSECOMP | unresolved",
  "CSI300 | unresolved",
  "runtime behavior | none",
  "public UI | none",
  "Supabase write | none",
  "SQL execution | none",
  "market data fetch | none",
  "phase_2a_global_index_fred_rights_decision_packet"
]) {
  if (!worksheet.includes(phrase)) problems.push(`${worksheetPath} missing: ${phrase}`);
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
  /can fetch now\s*\|\s*yes/iu,
  /can write now\s*\|\s*yes/iu,
  /^market data fetch\s*\|\s*(?!none)/imu,
  /^Supabase write\s*\|\s*(?!none)/imu,
  /^SQL execution\s*\|\s*(?!none)/imu,
  /publicDataSource\s*=\s*supabase/iu,
  /scoreSource\s*=\s*real/iu,
  /raw source response sample/iu,
  /pmLegalDecision\s*=\s*accepted/iu
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
      mode: "phase_2a_global_index_source_rights_evidence_worksheet",
      ceoRecommendation: "a2_continue_phase_2a_global_index_lane",
      worksheetPath,
      runtimeImpact: false,
      publicUiImpact: false,
      supabaseImpact: false,
      sqlImpact: false,
      dataFetchImpact: false,
      nextRecommendedSlice: "phase_2a_global_index_fred_rights_decision_packet"
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
