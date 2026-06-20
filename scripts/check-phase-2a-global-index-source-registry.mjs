import fs from "node:fs";

const registryPath = "src/lib/global-index-source-registry.ts";
const reportPath = "docs/PHASE_2A_GLOBAL_INDEX_SOURCE_REGISTRY_REPORT_ONLY.md";
const ceoDecisionPath = "docs/PHASE_2A_GLOBAL_INDEX_CEO_DECISION_AND_EXECUTION_SELECTOR.md";

const problems = [];
const registry = read(registryPath);
const report = read(reportPath);
const ceoDecision = read(ceoDecisionPath);
const combined = `${registry}\n${report}\n${ceoDecision}`;

for (const phrase of [
  "phase_2a_global_index_source_registry_report_only",
  "GlobalIndexSourceRegistryEntry",
  "legalUsageStatus",
  "sourceDecisionOwner",
  "nextDecisionNeeded",
  "SP500",
  "NASDAQCOM",
  "DJIA",
  "NIKKEI225",
  "KOSPI",
  "HSI",
  "SXXP",
  "DAX",
  "SSECOMP",
  "CSI300"
]) {
  if (!registry.includes(phrase)) problems.push(`${registryPath} missing: ${phrase}`);
}

for (const phrase of [
  "Status: `phase_2a_global_index_source_registry_report_only_ready`",
  "CEO decision: `proceed_with_phase_2a_global_index_source_registry_first`",
  "conditional | SP500, NASDAQCOM, DJIA, NIKKEI225",
  "rejected | HSI, SXXP, DAX",
  "unresolved | KOSPI, SSECOMP, CSI300",
  "accepted | none",
  "publicDataSource=mock",
  "scoreSource=mock",
  "marketDataFetchAllowed=false",
  "supabaseWriteAllowed=false"
]) {
  if (!report.includes(phrase)) problems.push(`${reportPath} missing: ${phrase}`);
}

if (!ceoDecision.includes("nextEngineeringSlice=phase_2a_global_index_source_registry_report_only")) {
  problems.push(`${ceoDecisionPath} missing source registry next slice selector`);
}

const symbolMatches = registry.match(/symbol:\s*"[^"]+"/g) ?? [];
if (symbolMatches.length !== 10) {
  problems.push(`${registryPath} expected 10 registry symbols, found ${symbolMatches.length}`);
}

for (const status of ["conditional", "rejected", "unresolved"]) {
  if (!registry.includes(`legalUsageStatus: "${status}"`)) {
    problems.push(`${registryPath} missing legalUsageStatus: ${status}`);
  }
}

for (const pattern of [
  /\bfetch\s*\(/iu,
  /\baxios\b/iu,
  /\bsupabase\.from\b/iu,
  /\binsert\s+into\b/iu,
  /\bupdate\s+daily_prices\b/iu,
  /legalUsageStatus:\s*"accepted"/iu,
  /\bclose\s*:/iu,
  /\bchange\s*:/iu,
  /\bchangePercent\s*:/iu,
  /\btradeDate\s*:/iu,
  /\bopen\s*:/iu,
  /\bhigh\s*:/iu,
  /\blow\s*:/iu,
  /\bvolume\s*:/iu,
  /\bturnover\s*:/iu,
  /marketDataFetchAllowed=true/iu,
  /supabaseWriteAllowed=true/iu,
  /publicDataSource\s*=\s*supabase/iu,
  /scoreSource\s*=\s*real/iu
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
      mode: "phase_2a_global_index_source_registry_report_only",
      ceoDecision: "proceed_with_phase_2a_global_index_source_registry_first",
      registryPath,
      reportPath,
      symbolCount: symbolMatches.length,
      sourceStatusSummary: {
        accepted: [],
        conditional: ["SP500", "NASDAQCOM", "DJIA", "NIKKEI225"],
        rejected: ["HSI", "SXXP", "DAX"],
        unresolved: ["KOSPI", "SSECOMP", "CSI300"]
      },
      runtimeBoundary: {
        publicDataSource: "mock",
        scoreSource: "mock",
        marketDataFetchAllowed: false,
        supabaseWriteAllowed: false,
        sqlAllowed: false,
        uiChangeAllowed: false
      },
      nextRecommendedSlice: "phase_2a_global_index_disabled_bounded_packet_design"
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
