import fs from "node:fs";

const reportPath = "docs/reviews/CP3_LOCAL_ONLY_FRESHNESS_REPOSITORY_ABSTRACTION_PLAN_2026-05-30.md";
const sourcePath = "src/lib/data-freshness-source.ts";
const factoryPath = "src/lib/repositories/freshness-repository.ts";
const repositoryPath = "src/lib/repositories/supabase-data-freshness-repository.ts";
const dataFreshnessPath = "src/lib/data-freshness.ts";

const report = fs.readFileSync(reportPath, "utf8");
const source = fs.readFileSync(sourcePath, "utf8");
const factory = fs.readFileSync(factoryPath, "utf8");
const repository = fs.readFileSync(repositoryPath, "utf8");
const dataFreshness = fs.readFileSync(dataFreshnessPath, "utf8");

const requiredReportPhrases = [
  "Status: `CP3 local-only freshness repository abstraction plan recorded`",
  "DESIGN_FRESHNESS_REPOSITORY_ABSTRACTION_WITHOUT_ENABLING_REMOTE_RUNTIME_READS",
  "does not implement a new runtime Supabase read path",
  "does not import `data_freshness` into runtime repositories",
  "does not authorize a second remote attempt",
  "does not connect to Supabase",
  "does not run SQL",
  "does not run validators against Supabase",
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
  "BASELINE-001 src/lib/data-freshness-source.ts defaults DATA_FRESHNESS_SOURCE to mock",
  "BASELINE-002 src/lib/data-freshness-source.ts requires DATA_FRESHNESS_SUPABASE_READS=enabled before Supabase freshness reads",
  "BASELINE-004 src/lib/repositories/supabase-data-freshness-repository.ts currently reads data_runs, not data_freshness",
  "BASELINE-005 src/lib/data-freshness.ts exposes DataFreshnessSnapshot as the UI-facing boundary",
  "TARGET-001 introduce a FreshnessRepository boundary in a later implementation slice",
  "TARGET-002 repository output remains DataFreshnessSnapshot",
  "TARGET-003 mock implementation remains the default public-safe implementation",
  "TARGET-004 data_runs implementation remains the only local-baselined Supabase implementation candidate",
  "TARGET-005 data_freshness implementation remains blocked until migration/type/repository/QA gates exist",
  "TARGET-006 source selection must remain centralized behind getDataFreshnessSnapshot or a successor factory",
  "INTERFACE-001 FreshnessRepository.getSnapshot returns Promise<DataFreshnessSnapshot>",
  "INTERFACE-002 MockFreshnessRepository wraps buildMockDataFreshnessSnapshot",
  "INTERFACE-003 DataRunsFreshnessRepository wraps getSupabaseDataFreshnessSnapshot only behind an explicit runtime-read gate",
  "INTERFACE-004 DataFreshnessRemoteCandidateRepository is not implemented until data_freshness contract is mapped",
  "GATE-001 DATA_FRESHNESS_SOURCE defaults to mock",
  "GATE-002 DATA_FRESHNESS_SOURCE=supabase is insufficient by itself",
  "GATE-003 DATA_FRESHNESS_SUPABASE_READS=enabled is still required for any Supabase freshness read",
  "GATE-004 data_freshness remains unavailable as a source option",
  "GATE-005 scoreSource remains mock even when freshness data is partially real",
  "GATE-006 public data source remains mock unless a separate market-data runtime gate changes it",
  "ENGINEERING-FINDING-001 DataFreshnessSnapshot should remain the stable UI-facing shape",
  "ENGINEERING-FINDING-002 data_runs remains the only local-baselined Supabase freshness repository candidate",
  "ENGINEERING-FINDING-003 data_freshness must stay absent from runtime repository selection",
  "QA-FINDING-001 static checks must verify mock default and disabled Supabase read fallback",
  "GUARDRAIL-001 no second remote schema-shape attempt",
  "GUARDRAIL-002 no Supabase connection",
  "GUARDRAIL-003 no SQL execution",
  "GUARDRAIL-005 no Supabase writes",
  "GUARDRAIL-008 no market-data fetch, parse, ingestion, or raw market-data commit",
  "GUARDRAIL-010 no scoreSource=real",
  "GUARDRAIL-012 no CP3 readiness promotion",
  "GUARDRAIL-013 no runtime repository dependency on data_freshness",
  "NEXT-SLICE-001 create src/lib/repositories/freshness-repository-contract.draft.ts",
  "scripts/check-cp3-local-only-freshness-repository-abstraction-plan.mjs passes",
  "scripts/check-cp3-data-freshness-to-data-runs-relationship-note.mjs passes",
  "scripts/check-review-gates.mjs passes",
  "TypeScript noEmit passes",
  "Next build passes",
  "public data source remains mock",
  "scoreSource=real remains blocked",
  "CP3 remains not_ready",
  "public claims remain blocked"
];

const requiredCodePhrases = [
  { content: source, phrase: "env.DATA_FRESHNESS_SOURCE ?? \"mock\"" },
  { content: source, phrase: "env.DATA_FRESHNESS_SUPABASE_READS === \"enabled\" ? \"enabled\" : \"disabled\"" },
  { content: source, phrase: "env = process.env" },
  { content: source, phrase: "createFreshnessRepository({" },
  { content: factory, phrase: "return buildMockDataFreshnessSnapshot();" },
  { content: factory, phrase: "source !== \"supabase\" || supabaseRuntimeReads !== \"enabled\"" },
  { content: repository, phrase: "from(table: \"data_runs\")" },
  { content: repository, phrase: ".from(\"data_runs\")" },
  { content: dataFreshness, phrase: "export type DataFreshnessSnapshot" }
];

const forbiddenReportPhrases = [
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
  "data_freshness runtime source approved"
];

const forbiddenCodePhrases = [
  { content: repository, phrase: "from(table: \"data_freshness\")" },
  { content: repository, phrase: ".from(\"data_freshness\")" },
  { content: source, phrase: "DATA_FRESHNESS_SOURCE ?? \"supabase\"" }
];

const missing = [
  ...requiredReportPhrases.filter((phrase) => !report.includes(phrase)),
  ...requiredCodePhrases.filter(({ content, phrase }) => !content.includes(phrase)).map(({ phrase }) => phrase)
];
const forbidden = [
  ...forbiddenReportPhrases.filter((phrase) => report.includes(phrase)),
  ...forbiddenCodePhrases.filter(({ content, phrase }) => content.includes(phrase)).map(({ phrase }) => phrase)
];

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
