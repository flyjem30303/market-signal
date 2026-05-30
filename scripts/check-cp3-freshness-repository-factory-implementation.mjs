import fs from "node:fs";

const factoryPath = "src/lib/repositories/freshness-repository.ts";
const sourcePath = "src/lib/data-freshness-source.ts";
const reportPath = "docs/reviews/CP3_FRESHNESS_REPOSITORY_FACTORY_IMPLEMENTATION_2026-05-30.md";

const factory = fs.readFileSync(factoryPath, "utf8");
const source = fs.readFileSync(sourcePath, "utf8");
const report = fs.readFileSync(reportPath, "utf8");

const requiredFactoryPhrases = [
  "export type FreshnessSource = \"mock\" | \"supabase\"",
  "export type SupabaseRuntimeReads = \"disabled\" | \"enabled\"",
  "export type FreshnessRepository",
  "createMockFreshnessRepository",
  "return buildMockDataFreshnessSnapshot();",
  "createDataRunsFreshnessRepository",
  "return await getSupabaseDataFreshnessSnapshot(client);",
  "} catch {",
  "return buildMockDataFreshnessSnapshot();",
  "createFreshnessRepository",
  "source !== \"supabase\" || supabaseRuntimeReads !== \"enabled\"",
  "return createMockFreshnessRepository();",
  "return createDataRunsFreshnessRepository(createSupabaseClient());"
];

const requiredSourcePhrases = [
  "type FreshnessSource",
  "type SupabaseRuntimeReads",
  "process.env.DATA_FRESHNESS_SOURCE ?? \"mock\"",
  "process.env.DATA_FRESHNESS_SUPABASE_READS === \"enabled\" ? \"enabled\" : \"disabled\"",
  "createFreshnessRepository({",
  "createSupabaseClient: () => createServerSupabaseClient() as unknown as SupabaseDataFreshnessClient",
  "source: getFreshnessSource()",
  "supabaseRuntimeReads: getSupabaseRuntimeReads()",
  "return repository.getSnapshot();"
];

const requiredReportPhrases = [
  "Status: `CP3 freshness repository factory implementation recorded`",
  "IMPLEMENT_MOCK_DEFAULT_FRESHNESS_REPOSITORY_FACTORY_WITH_UNCHANGED_RUNTIME_GATES",
  "does not enable Supabase runtime reads by default",
  "does not import `data_freshness` into runtime repositories",
  "does not authorize a second remote attempt",
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
  "ARTIFACT-001 src/lib/repositories/freshness-repository.ts exists",
  "RUNTIME-001 DATA_FRESHNESS_SOURCE still defaults to mock",
  "RUNTIME-002 DATA_FRESHNESS_SUPABASE_READS still defaults to disabled behavior unless exactly enabled",
  "RUNTIME-004 source=supabase with supabaseRuntimeReads=disabled returns createMockFreshnessRepository",
  "RUNTIME-005 source=supabase with supabaseRuntimeReads=enabled returns createDataRunsFreshnessRepository",
  "RUNTIME-008 data_freshness is not a source option",
  "RUNTIME-010 public data source remains mock",
  "CEO-FINDING-001 this is the intended larger-slice cadence: runtime-safe implementation plus gates in one pass",
  "ENGINEERING-FINDING-003 data_freshness remains absent from runtime repository selection",
  "QA-FINDING-001 fallback behavior is still mock when Supabase runtime reads are disabled or fail",
  "GUARDRAIL-001 no second remote schema-shape attempt",
  "GUARDRAIL-002 no SQL execution",
  "GUARDRAIL-004 no Supabase writes",
  "GUARDRAIL-007 no market-data fetch, parse, ingestion, or raw market-data commit",
  "GUARDRAIL-009 no scoreSource=real",
  "GUARDRAIL-011 no CP3 readiness promotion",
  "GUARDRAIL-012 no runtime repository dependency on data_freshness",
  "NEXT-SLICE-001 add local-only repository source-selection checks",
  "scripts/check-cp3-freshness-repository-factory-implementation.mjs passes",
  "scripts/check-data-freshness-source-fallback.mjs passes",
  "scripts/check-cp3-freshness-repository-draft-contract.mjs passes",
  "scripts/check-review-gates.mjs passes",
  "TypeScript noEmit passes",
  "Next build passes",
  "public data source remains mock",
  "scoreSource=real remains blocked",
  "CP3 remains not_ready",
  "public claims remain blocked"
];

const forbiddenPhrases = [
  "data_freshness",
  "scoreSource: \"real\"",
  "scoreSource=real",
  "DATA_FRESHNESS_SOURCE ?? \"supabase\"",
  "DATA_FRESHNESS_SUPABASE_READS ?? \"enabled\"",
  "throw error;",
  "throw new Error(`Failed to load"
];

const missing = [
  ...requiredFactoryPhrases.filter((phrase) => !factory.includes(phrase)),
  ...requiredSourcePhrases.filter((phrase) => !source.includes(phrase)),
  ...requiredReportPhrases.filter((phrase) => !report.includes(phrase))
];
const forbidden = [
  ...forbiddenPhrases.filter((phrase) => factory.includes(phrase)).map((phrase) => ({ file: factoryPath, phrase })),
  ...forbiddenPhrases.filter((phrase) => source.includes(phrase)).map((phrase) => ({ file: sourcePath, phrase }))
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
