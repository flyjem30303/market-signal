import fs from "node:fs";

const packetPath = "src/lib/global-index-disabled-bounded-packet.ts";
const docPath = "docs/PHASE_2A_GLOBAL_INDEX_DISABLED_BOUNDED_PACKET_DESIGN.md";
const handoffPath = "docs/PHASE_2A_GLOBAL_INDEX_A2_HANDOFF_STATUS.md";

const problems = [];
const packet = read(packetPath);
const doc = read(docPath);
const handoff = read(handoffPath);
const combined = `${packet}\n${doc}\n${handoff}`;

for (const phrase of [
  "phase_2a_global_index_disabled_bounded_packet_design",
  "enabled: false",
  "writeEnabled: false",
  "fetchExecuted: false",
  "requiresLegalUsageStatus: \"accepted\"",
  "maxRowsPerSymbol: 2",
  "requiresSourceAttribution: true",
  "requiresNoSecretsInOutput: true",
  "legalUsageStatus === \"conditional\""
]) {
  if (!packet.includes(phrase)) problems.push(`${packetPath} missing: ${phrase}`);
}

for (const phrase of [
  "Status: `phase_2a_global_index_disabled_bounded_packet_design_ready`",
  "CEO recommendation: `a2_continue_phase_2a_global_index_lane`",
  "enabled=false",
  "writeEnabled=false",
  "fetchExecuted=false",
  "requiresLegalUsageStatus=accepted",
  "SP500",
  "NASDAQCOM",
  "DJIA",
  "NIKKEI225",
  "runtime behavior | none",
  "public UI | none",
  "Supabase write | none",
  "SQL execution | none",
  "market data fetch | none",
  "phase_2a_global_index_source_rights_evidence_worksheet"
]) {
  if (!doc.includes(phrase)) problems.push(`${docPath} missing: ${phrase}`);
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
  /enabled:\s*true/iu,
  /writeEnabled:\s*true/iu,
  /fetchExecuted:\s*true/iu,
  /enabled=true/iu,
  /writeEnabled=true/iu,
  /fetchExecuted=true/iu,
  /marketDataFetchAllowed=true/iu,
  /supabaseWriteAllowed=true/iu,
  /publicDataSource\s*=\s*supabase/iu,
  /scoreSource\s*=\s*real/iu,
  /raw source response sample/iu
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
      mode: "phase_2a_global_index_disabled_bounded_packet_design",
      ceoRecommendation: "a2_continue_phase_2a_global_index_lane",
      packetPath,
      docPath,
      packet: {
        enabled: false,
        writeEnabled: false,
        fetchExecuted: false,
        requiresLegalUsageStatus: "accepted",
        maxRowsPerSymbol: 2
      },
      runtimeImpact: false,
      publicUiImpact: false,
      supabaseImpact: false,
      sqlImpact: false,
      dataFetchImpact: false,
      nextRecommendedSlice: "phase_2a_global_index_source_rights_evidence_worksheet"
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
