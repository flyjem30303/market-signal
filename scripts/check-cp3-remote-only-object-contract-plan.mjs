import fs from "node:fs";

const reportPath = "docs/reviews/CP3_REMOTE_ONLY_OBJECT_CONTRACT_PLAN_2026-05-30.md";
const report = fs.readFileSync(reportPath, "utf8");

const requiredPhrases = [
  "Status: `CP3 remote-only object contract plan recorded`",
  "MAP_REMOTE_ONLY_OBJECTS_TO_LOCAL_RUNTIME_CONTRACTS_WITHOUT_RUNTIME_RELIANCE",
  "does not authorize a second remote attempt",
  "does not connect to Supabase",
  "does not run SQL",
  "does not run validators",
  "does not write Supabase",
  "does not create staging rows",
  "does not write `daily_prices`",
  "does not modify `.env.local`",
  "does not fetch or ingest market data",
  "does not commit row payloads",
  "does not print secrets",
  "does not set `scoreSource=real`",
  "does not approve public claims",
  "does not promote CP3 readiness",
  "INPUT-001 CP3_SUPABASE_SCHEMA_SHAPE_ONE_ATTEMPT_POST_RUN_REVIEW_2026-05-30 is accepted as narrow schema-shape evidence",
  "INPUT-002 CP3_SUPABASE_SCHEMA_SHAPE_EVIDENCE_TO_ACTION_MAP_2026-05-30 requires remote-only object contract planning",
  "INPUT-003 CP3_SUPABASE_LOCAL_SCHEMA_CONTRACT_ALIGNMENT_2026-05-30 says market_assets has no local migration or generated type baseline",
  "INPUT-004 CP3_SUPABASE_LOCAL_SCHEMA_CONTRACT_ALIGNMENT_2026-05-30 says model_runs has no local migration or generated type baseline",
  "INPUT-005 CP3_SUPABASE_LOCAL_SCHEMA_CONTRACT_ALIGNMENT_2026-05-30 says data_freshness has no confirmed local migration or generated type baseline",
  "INPUT-006 market_assets reachable ok but remote-only-pending-contract",
  "INPUT-007 model_runs reachable ok but remote-only-pending-contract",
  "INPUT-008 data_freshness reachable ok but remote-only-pending-contract",
  "INPUT-009 local freshness baseline currently uses data_runs, not confirmed data_freshness",
  "GLOBAL_ASSET_IDENTITY_CANDIDATE_ONLY",
  "SCORE_PROVENANCE_CANDIDATE_ONLY",
  "FRESHNESS_DISCLOSURE_CANDIDATE_ONLY",
  "MARKET-ASSETS-001 define canonical asset id and market id semantics",
  "MARKET-ASSETS-004 add local type or migration alignment before runtime reads",
  "MODEL-RUNS-001 define model version naming and source mode semantics",
  "MODEL-RUNS-005 keep scoreSource=real blocked until separate runtime/source gates pass",
  "DATA-FRESHNESS-001 document whether data_freshness is a view, table, summary object, or future replacement candidate",
  "DATA-FRESHNESS-002 map data_freshness fields to current data_runs-driven freshness behavior",
  "DATA-FRESHNESS-005 keep DATA_FRESHNESS_SOURCE and Supabase runtime reads off unless a separate gate authorizes them",
  "RUNTIME-001 daily_prices is schema-shape checked but not data-quality, freshness, or historical-depth ready",
  "RUNTIME-002 twse_stock_day_staging remains review/support-only until naming and object identity are reconciled",
  "RUNTIME-003 market_assets has no runtime reliance until local migration, generated type, and field contract alignment exist",
  "RUNTIME-004 model_runs has no runtime reliance until score provenance semantics and review gates exist",
  "RUNTIME-005 data_freshness has no runtime reliance until its relationship to data_runs is documented",
  "RUNTIME-006 public data source remains mock",
  "RUNTIME-007 CP3 remains not_ready",
  "RUNTIME-008 public claims remain blocked",
  "CEO-FINDING-001 the project should accelerate by converting remote evidence into contract work, not by repeating remote checks",
  "CEO-FINDING-002 global readiness depends first on market_assets contract clarity",
  "CEO-FINDING-003 scoreSource=real remains blocked even if model_runs exists remotely",
  "PM-FINDING-002 next work should be local type contracts or data_freshness-to-data_runs mapping",
  "ENGINEERING-FINDING-001 no runtime code should depend on remote-only objects yet",
  "ENGINEERING-FINDING-003 no SQL, migration execution, or Supabase write is approved by this plan",
  "DATA-FINDING-001 reachable objects still need field-level semantics before source-depth or quality claims",
  "QA-FINDING-001 schema-shape evidence is not freshness, correctness, or completeness evidence",
  "SECURITY-FINDING-001 this slice avoids secrets and row payloads entirely",
  "LEGAL-FINDING-001 no market-data rights, public coverage claim, or investment-advice claim is approved",
  "GUARDRAIL-001 no second remote schema-shape attempt",
  "GUARDRAIL-002 no Supabase connection",
  "GUARDRAIL-003 no SQL execution",
  "GUARDRAIL-004 no validator execution against Supabase",
  "GUARDRAIL-005 no Supabase writes",
  "GUARDRAIL-008 no market-data fetch, parse, ingestion, or raw market-data commit",
  "GUARDRAIL-009 no secrets, key prefixes, key suffixes, key lengths, or row payloads printed",
  "GUARDRAIL-010 no scoreSource=real",
  "GUARDRAIL-012 no CP3 readiness promotion",
  "NEXT-SLICE-001 create draft local TypeScript/domain contracts for remote-only objects without runtime wiring",
  "NEXT-SLICE-002 create data_freshness to data_runs relationship note for repository and UI behavior",
  "scripts/check-cp3-remote-only-object-contract-plan.mjs passes",
  "scripts/check-cp3-supabase-schema-shape-evidence-to-action-map.mjs passes",
  "scripts/check-cp3-twse-stock-day-staging-canonical-naming-rule-decision-ledger.mjs passes",
  "scripts/check-review-gates.mjs passes",
  "TypeScript noEmit passes",
  "public data source remains mock",
  "scoreSource=real remains blocked",
  "CP3 remains not_ready",
  "public claims remain blocked"
];

const forbiddenPhrases = [
  "AUTHORIZE_SECOND_ATTEMPT",
  "RUN_VALIDATOR_AGAIN",
  "Supabase connection is approved",
  "SQL execution is approved now",
  "migration execution is approved now",
  "Supabase writes are approved now",
  "market ingestion is approved now",
  "scoreSource=real approved",
  "CP3_READY_NOW",
  "public claims are approved",
  "runtime readiness is approved",
  "remote-only objects are runtime-ready",
  "data_freshness replaces data_runs now"
];

const missing = requiredPhrases.filter((phrase) => !report.includes(phrase));
const forbidden = forbiddenPhrases.filter((phrase) => report.includes(phrase));

console.log(
  JSON.stringify(
    {
      forbidden,
      missing,
      status: missing.length === 0 && forbidden.length === 0 ? "ok" : "blocked"
    },
    null,
    2
  )
);

if (missing.length > 0 || forbidden.length > 0) {
  process.exitCode = 1;
}
