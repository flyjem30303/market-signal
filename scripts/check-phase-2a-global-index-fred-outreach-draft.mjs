import fs from "node:fs";

const draftPath = "docs/PHASE_2A_GLOBAL_INDEX_FRED_OUTREACH_DRAFT.md";
const handoffPath = "docs/PHASE_2A_GLOBAL_INDEX_A2_HANDOFF_STATUS.md";

const problems = [];
const draft = read(draftPath);
const handoff = read(handoffPath);
const combined = `${draft}\n${handoff}`;

for (const phrase of [
  "Status: `phase_2a_global_index_fred_outreach_draft_ready_no_fetch`",
  "CEO recommendation: `a2_continue_phase_2a_global_index_lane`",
  "It is not sent by A2.",
  "It is not legal approval.",
  "FRED candidate route",
  "SP500",
  "NASDAQCOM",
  "DJIA",
  "NIKKEI225",
  "Current status:",
  "conditional",
  "Question about permitted use of FRED daily index series",
  "Automated retrieval through an approved FRED API",
  "Internal storage of daily close values",
  "Public display of delayed daily close values",
  "Deriving and displaying daily point change and percentage change",
  "Whether public display or derived fields count as redistribution",
  "commercial/public product use",
  "Required attribution text",
  "separate permission is required from the underlying third-party index owners",
  "We will not fetch, store, or display the data until this permission boundary is clear.",
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
  "phase_2a_global_index_krx_terms_review_question_draft"
]) {
  if (!draft.includes(phrase)) problems.push(`${draftPath} missing: ${phrase}`);
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
  /FRED route accepted/iu,
  /permission granted/iu
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
      mode: "phase_2a_global_index_fred_outreach_draft",
      ceoRecommendation: "a2_continue_phase_2a_global_index_lane",
      draftPath,
      currentSourceStatus: "conditional",
      sentByA2: false,
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
      nextRecommendedSlice: "phase_2a_global_index_krx_terms_review_question_draft"
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
