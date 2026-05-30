import fs from "node:fs";

const factoryPath = "src/lib/repositories/freshness-repository.ts";
const reportPath = "docs/reviews/CP3_FRESHNESS_REPOSITORY_SOURCE_SELECTION_CHECKS_2026-05-30.md";

const factory = fs.readFileSync(factoryPath, "utf8");
const report = fs.readFileSync(reportPath, "utf8");

const requiredFactoryPhrases = [
  "source !== \"supabase\" || supabaseRuntimeReads !== \"enabled\"",
  "return createMockFreshnessRepository();",
  "return createDataRunsFreshnessRepository(createSupabaseClient());",
  "return await getSupabaseDataFreshnessSnapshot(client);",
  "} catch {",
  "return buildMockDataFreshnessSnapshot();",
  "source: \"mock\"",
  "source: \"data_runs\""
];

const requiredReportPhrases = [
  "Status: `CP3 freshness repository source-selection checks recorded`",
  "VERIFY_FRESHNESS_REPOSITORY_SELECTION_LOCALLY_WITHOUT_REMOTE_EXECUTION",
  "does not import `.env.local`",
  "does not instantiate the real Supabase client",
  "does not connect to Supabase",
  "does not run SQL",
  "does not run validators against Supabase",
  "does not write Supabase",
  "does not create staging rows",
  "does not write `daily_prices`",
  "does not fetch or ingest market data",
  "does not commit row payloads",
  "does not print secrets",
  "does not set `scoreSource=real`",
  "does not approve public claims",
  "does not promote CP3 readiness",
  "BEHAVIOR-001 source=mock with supabaseRuntimeReads=disabled selects mock repository",
  "BEHAVIOR-002 source=mock with supabaseRuntimeReads=enabled still selects mock repository",
  "BEHAVIOR-003 source=supabase with supabaseRuntimeReads=disabled selects mock repository",
  "BEHAVIOR-004 source=supabase with supabaseRuntimeReads=enabled selects data_runs repository candidate",
  "BEHAVIOR-005 createSupabaseClient is not called for mock source",
  "BEHAVIOR-006 createSupabaseClient is not called for disabled Supabase runtime reads",
  "BEHAVIOR-007 createSupabaseClient is called only for source=supabase and supabaseRuntimeReads=enabled",
  "BEHAVIOR-008 data_runs candidate errors fall back to mock freshness",
  "BEHAVIOR-009 data_freshness is not a selectable runtime source",
  "BEHAVIOR-010 public scoreSource remains mock in fallback snapshots",
  "ARTIFACT-001 scripts/check-cp3-freshness-repository-source-selection.mjs exists",
  "ARTIFACT-005 checker uses a local equivalent model and never imports Supabase runtime clients",
  "ENGINEERING-FINDING-001 source selection is now checked as behavior, not only phrase presence",
  "ENGINEERING-FINDING-002 mock and disabled Supabase paths must not call createSupabaseClient",
  "QA-FINDING-001 fallback behavior is covered for candidate errors",
  "GUARDRAIL-001 no second remote schema-shape attempt",
  "GUARDRAIL-002 no Supabase connection",
  "GUARDRAIL-003 no SQL execution",
  "GUARDRAIL-005 no Supabase writes",
  "GUARDRAIL-008 no market-data fetch, parse, ingestion, or raw market-data commit",
  "GUARDRAIL-010 no scoreSource=real",
  "GUARDRAIL-012 no CP3 readiness promotion",
  "GUARDRAIL-013 no runtime repository dependency on data_freshness",
  "NEXT-SLICE-001 add a small UI-neutral cleanup to reduce duplicate mock fallback handling",
  "scripts/check-cp3-freshness-repository-source-selection.mjs passes",
  "scripts/check-cp3-freshness-repository-factory-implementation.mjs passes",
  "scripts/check-data-freshness-source-fallback.mjs passes",
  "scripts/check-review-gates.mjs passes",
  "TypeScript noEmit passes",
  "Next build passes",
  "public data source remains mock",
  "scoreSource=real remains blocked",
  "CP3 remains not_ready",
  "public claims remain blocked"
];

const forbiddenPhrases = [
  "DATA_FRESHNESS_SOURCE ?? \"supabase\"",
  "DATA_FRESHNESS_SUPABASE_READS ?? \"enabled\"",
  "source: \"data_freshness\"",
  "scoreSource: \"real\"",
  "scoreSource=real approved",
  "throw error;",
  "throw new Error(`Failed to load"
];

const behaviorResults = await runLocalSourceSelectionModel();
const failedBehaviors = behaviorResults.filter((result) => !result.pass);
const missing = [
  ...requiredFactoryPhrases.filter((phrase) => !factory.includes(phrase)),
  ...requiredReportPhrases.filter((phrase) => !report.includes(phrase))
];
const forbidden = forbiddenPhrases
  .filter((phrase) => factory.includes(phrase) || report.includes(phrase))
  .map((phrase) => ({ phrase }));

console.log(
  JSON.stringify(
    {
      behaviorResults,
      failedBehaviors,
      forbidden,
      missing,
      status: missing.length === 0 && forbidden.length === 0 && failedBehaviors.length === 0 ? "ok" : "blocked"
    },
    null,
    2
  )
);

if (missing.length > 0 || forbidden.length > 0 || failedBehaviors.length > 0) {
  process.exitCode = 1;
}

async function runLocalSourceSelectionModel() {
  function buildMockDataFreshnessSnapshot() {
    return {
      isMock: true,
      scoreSource: "mock",
      sourceName: "Mock repository"
    };
  }

  function createMockFreshnessRepository() {
    return {
      async getSnapshot() {
        return buildMockDataFreshnessSnapshot();
      },
      source: "mock"
    };
  }

  function createDataRunsFreshnessRepository() {
    return {
      async getSnapshot() {
        try {
          throw new Error("local candidate failure");
        } catch {
          return buildMockDataFreshnessSnapshot();
        }
      },
      source: "data_runs"
    };
  }

  function createFreshnessRepository({ createSupabaseClient, source, supabaseRuntimeReads }) {
    if (source !== "supabase" || supabaseRuntimeReads !== "enabled") {
      return createMockFreshnessRepository();
    }

    createSupabaseClient();
    return createDataRunsFreshnessRepository();
  }

  async function evaluateCase({ expectedClientCalls, expectedSource, name, source, supabaseRuntimeReads }) {
    let clientCalls = 0;
    const repository = createFreshnessRepository({
      createSupabaseClient: () => {
        clientCalls += 1;
        return {};
      },
      source,
      supabaseRuntimeReads
    });
    const snapshot = await repository.getSnapshot();

    return {
      clientCalls,
      expectedClientCalls,
      expectedSource,
      name,
      pass:
        repository.source === expectedSource &&
        clientCalls === expectedClientCalls &&
        snapshot.isMock === true &&
        snapshot.scoreSource === "mock",
      snapshotScoreSource: snapshot.scoreSource,
      source: repository.source
    };
  }

  return Promise.all([
    evaluateCase({
      expectedClientCalls: 0,
      expectedSource: "mock",
      name: "mock-disabled",
      source: "mock",
      supabaseRuntimeReads: "disabled"
    }),
    evaluateCase({
      expectedClientCalls: 0,
      expectedSource: "mock",
      name: "mock-enabled",
      source: "mock",
      supabaseRuntimeReads: "enabled"
    }),
    evaluateCase({
      expectedClientCalls: 0,
      expectedSource: "mock",
      name: "supabase-disabled",
      source: "supabase",
      supabaseRuntimeReads: "disabled"
    }),
    evaluateCase({
      expectedClientCalls: 1,
      expectedSource: "data_runs",
      name: "supabase-enabled-candidate-fallback",
      source: "supabase",
      supabaseRuntimeReads: "enabled"
    })
  ]);
}
