import fs from "node:fs";

const docPath = "docs/PHASE_2A_GLOBAL_INDEX_CEO_DECISION_AND_EXECUTION_SELECTOR.md";
const planPath = "docs/PHASE_2A_GLOBAL_INDEX_DATA_PLAN.md";
const reviewPath = "docs/PHASE_2A_GLOBAL_INDEX_SOURCE_REVIEW.md";

const problems = [];
const doc = read(docPath);
const plan = read(planPath);
const review = read(reviewPath);
const combined = `${doc}\n${plan}\n${review}`;

for (const phrase of [
  "Status: `phase_2a_global_index_ceo_decision_ready_report_only`",
  "CEO decision: `proceed_with_phase_2a_global_index_source_registry_first`",
  "Phase 2A will move forward under CEO leadership",
  "source registry, source-rights evidence, and bounded packet design",
  "publicDataSource=mock",
  "scoreSource=mock",
  "accepted for production ingestion | none",
  "marketDataFetchAllowed=false",
  "supabaseWriteAllowed=false",
  "sqlAllowed=false",
  "uiChangeAllowed=false",
  "nextEngineeringSlice=phase_2a_global_index_source_registry_report_only",
  "No real global index ingestion.",
  "No Supabase or SQL execution.",
  "No public real-data display."
]) {
  if (!doc.includes(phrase)) problems.push(`${docPath} missing: ${phrase}`);
}

for (const [filePath, content, phrase] of [
  [planPath, plan, "Status: `phase_2a_global_index_data_plan_ready_report_only`"],
  [reviewPath, review, "Status: `phase_2a_global_index_source_review_ready_report_only`"]
]) {
  if (!content.includes(phrase)) problems.push(`${filePath} missing baseline phrase: ${phrase}`);
}

for (const pattern of [
  /\bfetch\s*\(/iu,
  /\bsupabase\.from\b/iu,
  /\binsert\s+into\b/iu,
  /\bupdate\s+daily_prices\b/iu,
  /marketDataFetchAllowed=true/iu,
  /supabaseWriteAllowed=true/iu,
  /sqlAllowed=true/iu,
  /uiChangeAllowed=true/iu,
  /publicDataSource\s*=\s*supabase/iu,
  /scoreSource\s*=\s*real/iu,
  /raw source response sample/iu,
  /real global index ingestion approved/iu
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
      mode: "phase_2a_global_index_ceo_decision_report_only",
      ceoDecision: "proceed_with_phase_2a_global_index_source_registry_first",
      executionSelector: {
        currentPhase: "phase_2a_global_index",
        currentLane: "source_registry_and_rights_evidence",
        executionMode: "report_only",
        executionAllowedNow: true,
        marketDataFetchAllowed: false,
        supabaseWriteAllowed: false,
        sqlAllowed: false,
        uiChangeAllowed: false,
        nextEngineeringSlice: "phase_2a_global_index_source_registry_report_only"
      },
      runtimeBoundary: {
        publicDataSource: "mock",
        scoreSource: "mock"
      },
      docPath
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
