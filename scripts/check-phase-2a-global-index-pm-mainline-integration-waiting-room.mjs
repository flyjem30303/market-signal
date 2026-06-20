import fs from "node:fs";

const waitingRoomPath = "docs/PHASE_2A_GLOBAL_INDEX_PM_MAINLINE_INTEGRATION_WAITING_ROOM.md";
const handoffPath = "docs/PHASE_2A_GLOBAL_INDEX_A2_HANDOFF_STATUS.md";

const problems = [];
const waitingRoom = read(waitingRoomPath);
const handoff = read(handoffPath);
const combined = `${waitingRoom}\n${handoff}`;

for (const phrase of [
  "Status: `phase_2a_global_index_pm_mainline_integration_waiting_room_ready`",
  "CEO recommendation: `a2_continue_phase_2a_global_index_lane`",
  "This is an A2-owned waiting-room note for PM mainline integration.",
  "This document does not modify PM mainline files.",
  "Accept A2 rollup as ready for PM/Legal review",
  "Choose first legal review target: FRED route or KRX route",
  "Prioritize FRED rights review first.",
  "Keep FRED route conditional.",
  "Do not fetch.",
  "Do not write.",
  "accepted | none",
  "conditional | SP500, NASDAQCOM, DJIA, NIKKEI225",
  "rejected | HSI, SXXP, DAX",
  "unresolved | KOSPI, SSECOMP, CSI300",
  "runtime behavior | none",
  "public UI | none",
  "Supabase write | none",
  "SQL execution | none",
  "market data fetch | none",
  "wait_for_pm_mainline_integration_or_continue_no_fetch_source_rights_support",
  "phase_2a_global_index_fred_outreach_draft"
]) {
  if (!waitingRoom.includes(phrase)) problems.push(`${waitingRoomPath} missing: ${phrase}`);
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
  /writeApproved=true/iu
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
      mode: "phase_2a_global_index_pm_mainline_integration_waiting_room",
      ceoRecommendation: "a2_continue_phase_2a_global_index_lane",
      waitingRoomPath,
      pmMainlineIntegrationNeeded: true,
      accepted: [],
      conditional: ["SP500", "NASDAQCOM", "DJIA", "NIKKEI225"],
      rejected: ["HSI", "SXXP", "DAX"],
      unresolved: ["KOSPI", "SSECOMP", "CSI300"],
      runtimeImpact: false,
      publicUiImpact: false,
      supabaseImpact: false,
      sqlImpact: false,
      dataFetchImpact: false,
      nextRecommendedSlice: "phase_2a_global_index_fred_outreach_draft"
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
