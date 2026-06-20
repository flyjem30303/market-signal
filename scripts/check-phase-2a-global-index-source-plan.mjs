import fs from "node:fs";

const planPath = "docs/PHASE_2A_GLOBAL_INDEX_DATA_PLAN.md";
const reviewPath = "docs/PHASE_2A_GLOBAL_INDEX_SOURCE_REVIEW.md";

const problems = [];
const plan = read(planPath);
const review = read(reviewPath);
const combined = `${plan}\n${review}`;

const requiredPlanPhrases = [
  "Status: `phase_2a_global_index_data_plan_ready_report_only`",
  "Phase 2A should begin with a metadata and source-rights slice, not live ingestion.",
  "S&P 500",
  "NASDAQ Composite",
  "Dow Jones Industrial Average",
  "Nikkei 225",
  "KOSPI",
  "Hang Seng Index",
  "STOXX Europe 600",
  "DAX",
  "SSE Composite",
  "CSI 300",
  "global_indices",
  "global_index_prices",
  "global_index_scores",
  "Do not use stock-specific valuation, earnings, margin, or institutional-flow modules for global index V1.",
  "publicDataSource=mock",
  "scoreSource=mock"
];

const requiredReviewPhrases = [
  "Status: `phase_2a_global_index_source_review_ready_report_only`",
  "No market data fetch.",
  "No raw market payload stored, printed, transformed, or committed.",
  "accepted",
  "conditional",
  "rejected",
  "unresolved",
  "FRED",
  "KRX",
  "HKEX",
  "STOXX",
  "SSE",
  "Source Status Summary",
  "accepted | None for production DB storage/public display yet.",
  "conditional | S&P 500, NASDAQ Composite, Dow Jones, Nikkei 225 through FRED candidate route.",
  "rejected | Hang Seng, STOXX 600, DAX for free automated path; unofficial quote portals.",
  "unresolved | KOSPI, SSE Composite, CSI 300."
];

for (const phrase of requiredPlanPhrases) {
  if (!plan.includes(phrase)) problems.push(`${planPath} missing: ${phrase}`);
}

for (const phrase of requiredReviewPhrases) {
  if (!review.includes(phrase)) problems.push(`${reviewPath} missing: ${phrase}`);
}

for (const [label, content] of [
  [planPath, plan],
  [reviewPath, review]
]) {
  for (const phrase of [
    "source",
    "sourceUrl",
    "updateFrequency",
    "legalUsageStatus"
  ]) {
    if (!content.includes(phrase)) problems.push(`${label} missing contract term: ${phrase}`);
  }
}

for (const phrase of ["schema", "mapping"]) {
  if (!plan.includes(phrase)) problems.push(`${planPath} missing contract term: ${phrase}`);
}

const forbiddenPatterns = [
  /\bfetch\s*\(/iu,
  /\baxios\b/iu,
  /\bgot\b/iu,
  /\bsupabase\.from\b/iu,
  /\binsert\s+into\b/iu,
  /\bupdate\s+daily_prices\b/iu,
  /\bdaily_prices\s+mutation\b/iu,
  /\bdaily_scores\s+mutation\b/iu,
  /publicDataSource\s*=\s*supabase/iu,
  /scoreSource\s*=\s*real/iu,
  /legalUsageStatus\s*:\s*accepted_for_execution/iu,
  /raw market data sample/iu,
  /source response body/iu,
  /SQL execution approved/iu,
  /Supabase writes approved/iu
];

for (const pattern of forbiddenPatterns) {
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
      mode: "phase_2a_global_index_source_plan_report_only",
      docs: [planPath, reviewPath],
      runtimeBoundary: {
        publicDataSource: "mock",
        scoreSource: "mock",
        marketDataFetch: false,
        rawPayloadStored: false,
        sqlExecuted: false,
        supabaseReadAttempt: false,
        supabaseWrite: false,
        uiChanged: false
      },
      sourceStatusSummary: {
        accepted: [],
        conditional: ["SP500", "NASDAQCOM", "DJIA", "NIKKEI225"],
        rejectedForFreePath: ["HSI", "SXXP", "DAX"],
        unresolved: ["KOSPI", "SSECOMP", "CSI300"]
      },
      nextRecommendedSlice: "phase_2a_global_index_source_registry_report_only"
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
