import fs from "node:fs";

const problems = [];

const files = {
  roadmap: "docs/A1_COVERAGE_GAP_NEXT_EXECUTION_ROADMAP.md",
  contract: "docs/A1_NO_FETCH_CANDIDATE_ARTIFACT_CONTRACT.md",
  handoff: "docs/A1_TWII_ETF_COVERAGE_PM_HANDOFF_SUMMARY.md",
  routeDecision: "docs/BATCH1_DATA_COVERAGE_ROUTE_DECISION_2026-06-12.md",
  coverageChecklist: "docs/A1_BATCH1_COVERAGE_GAP_REPAIR_CHECKLIST.md",
  twiiGate: "docs/TWII_COVERAGE_REPAIR_GATE.md",
  twiiPrereq: "docs/A1_TWII_COVERAGE_REPAIR_GATE_PREREQ_CHECKLIST.md",
  packageJson: "package.json",
  checkReview: "scripts/check-review-gates.mjs"
};

const fileText = {
  roadmap: read(files.roadmap),
  contract: read(files.contract),
  handoff: read(files.handoff),
  routeDecision: read(files.routeDecision),
  coverageChecklist: read(files.coverageChecklist),
  twiiGate: read(files.twiiGate),
  twiiPrereq: read(files.twiiPrereq),
  packageJson: read(files.packageJson),
  checkReview: read(files.checkReview)
};

validateContains("roadmap", fileText.roadmap, [
  "A1 Coverage Gap Next Execution Roadmap",
  "`a1_coverage_gap_next_execution_roadmap_ready_local_only`",
  "`TWII`: `0/60`",
  "`0050`: `1/60`",
  "`006208`: `1/60`",
  "總缺口：`178`",
  "MVP Level 1：`182/360`",
  "182/360",
  "publicDataSource = \"mock\"",
  "scoreSource = \"mock\"",
  "呼叫市場 endpoint",
  "`TWII`（先行）",
  "twii_coverage_repair_gate",
  "Coverage Gap Execution Packet Design",
  "duplicateRejectionRule",
  "reject_duplicates"
]);

validateContains("contract", fileText.contract, [
  "A1 No-Fetch Candidate Artifact Contract",
  "`a1_no_fetch_candidate_artifact_contract_ready_local_only`",
  "lane: TWII",
  "lane: 0050",
  "lane: 006208",
  "candidateArtifactScopePolicy: missing_rows_only",
  "duplicatePolicy: reject_duplicates",
  "expectedRows: 60",
  "missingRows: 60",
  "missingRows: 59",
  "coverageWindowSessions: 60",
  "candidateArtifactCreated` must remain `false`",
  "rowPayloadIncluded` must remain `false`",
  "rawPayloadIncluded` must remain `false`",
  "stockIdPayloadIncluded` must remain `false`",
  "No endpoint calls and no data ingest/store/commit in this packet",
  "No staging rows",
  "no SQL",
  "no Supabase write",
  "no daily_prices mutation"
]);

validateContains("handoff", fileText.handoff, [
  "A1 TWII + ETF Coverage PM Handoff Summary",
  "`a1_twii_etf_coverage_pm_handoff_summary_ready_local_only`",
  "Full MVP: `182/360`",
  "`TWII`: `0/60`",
  "`0050`: `1/60`",
  "`006208`: `1/60`",
  "prepare_twii_coverage_repair_gate",
  "canDoRealFetch`: `false`",
  "canDoSQL`: `false`",
  "canDoSupabaseWrite`: `false`",
  "canMutateDailyPrices`: `false`",
  "canPromotePublicSource`: `false`",
  "canPromoteRealScore`: `false`",
  "publicDataSource=mock",
  "scoreSource=mock"
]);

validateContains("routeDecision", fileText.routeDecision, [
  "Batch 1 Data Coverage Route Decision",
  "batch1_data_coverage_route_selected_twii_first_design_only",
  "`TWII` is `0/60`",
  "`0050` is `1/60`",
  "`006208` is `1/60`",
  "`TWII` first",
  "Selected route: `prepare_twii_coverage_repair_gate`",
  "design-only",
  "It does not approve SQL",
  "`daily_prices` mutation"
]);

validateContains("coverageChecklist", fileText.coverageChecklist, [
  "A1 Batch 1 Coverage Gap Repair Checklist",
  "a1_batch1_coverage_gap_repair_checklist_prepared_local_only",
  "Current Aggregate-Only Batch 1 State",
  "Observed total rows",
  "Three symbols were complete",
  "TWII",
  "0/60",
  "`0050=1/60`",
  "`006208=1/60`",
  "publicDataSource=mock",
  "scoreSource=mock",
  "It does not run SQL"
]);

validateContains("twiiGate", fileText.twiiGate, [
  "TWII Coverage Repair Gate",
  "twii_coverage_repair_gate_ready_design_only_not_executable",
  "targetScope=twii_index_daily_prices_missing_rows",
  "currentObservedRows=0",
  "expectedMissingRows=60",
  "publicDataSource=mock",
  "scoreSource=mock",
  "executionAllowedNow=false",
  "dailyPricesMutationAllowedNow=false",
  "Stop Lines",
  "publicDataSource=supabase"
]);

validateContains("twiiPrereq", fileText.twiiPrereq, [
  "A1 TWII Coverage Repair Gate Prereq Checklist",
  "a1_twii_coverage_repair_gate_prereq_checklist_prepared_local_only",
  "TWII 0/60",
  "publicDataSource=mock",
  "scoreSource=mock",
  "Target-table boundary",
  "No SQL, Supabase connection",
  "Supabase write",
  "`daily_prices` mutation",
  "No SQL, Supabase connection, Supabase write, staging rows",
  "PM may mark this prerequisite checklist usable",
  "No SQL, Supabase connection, Supabase write, staging rows"
]);

for (const [section, text] of [
  ["roadmap", fileText.roadmap],
  ["contract", fileText.contract],
  ["handoff", fileText.handoff]
]) {
  if (forbiddenPatterns(text)) {
    problems.push(`${section} contains forbidden hard-stop pattern`);
  }
}

if (!fileText.checkReview.includes("check-a1-coverage-gap-next-execution-roadmap") ) {
  problems.push(`${files.checkReview} missing checker registration`);
}
if (!fileText.checkReview.includes("scripts/check-a1-coverage-gap-next-execution-roadmap.mjs")) {
  problems.push(`${files.checkReview} missing checker script reference`);
}
let packageData = {};
try {
  packageData = JSON.parse(fileText.packageJson);
} catch {
  problems.push(`${files.packageJson} invalid JSON`);
}
if (
  packageData?.scripts?.["check:a1-coverage-gap-next-execution-roadmap"] !==
  "node scripts/check-a1-coverage-gap-next-execution-roadmap.mjs"
) {
  problems.push(`${files.packageJson} missing npm script`);
}

if (problems.length > 0) {
  console.error(JSON.stringify({ status: "blocked", problems }, null, 2));
  process.exitCode = 1;
}

console.log(
  JSON.stringify(
    {
      status: "ok",
      mode: "a1_coverage_gap_next_execution_roadmap_readiness",
      runtimeBoundary: {
        publicDataSource: "mock",
        scoreSource: "mock",
        fixturePolicy: "synthetic_or_contract_only",
        rawMarketDataFetch: false,
        sqlExecuted: false,
        supabaseWrite: false,
        stagingWriteEnabled: false,
        dailyPricesMutation: false
      },
      coverageState: {
        twii: "0/60",
        etf0050: "1/60",
        etf006208: "1/60",
        totalObserved: "182",
        totalExpected: "360",
        totalMissing: "178"
      }
    },
    null,
    2
  )
);

function validateContains(section, text, phrases) {
  for (const phrase of phrases) {
    if (!text.includes(phrase)) {
      problems.push(`${section} missing: ${phrase}`);
    }
  }
}

function forbiddenPatterns(text) {
  const forbidden = [
    /\bfetch\(/i,
    /\bfrom\(/i,
    /\binsert\(/i,
    /\bupdate\(/i,
    /\bdelete\(/i,
    /\bupsert\(/i,
    /SUPABASE_SERVICE_ROLE_KEY/i,
    /sb_(secret|publishable|anon)/i,
    /rawMarketDataFetch\s*=\s*true/i
  ];

  return forbidden.some((pattern) => pattern.test(text));
}

function read(filePath) {
  if (!fs.existsSync(filePath)) {
    problems.push(`missing file: ${filePath}`);
    return "";
  }
  return fs.readFileSync(filePath, "utf8");
}
