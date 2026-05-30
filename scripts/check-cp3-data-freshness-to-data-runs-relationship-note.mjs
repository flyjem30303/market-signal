import fs from "node:fs";
import path from "node:path";

const reportPath = "docs/reviews/CP3_DATA_FRESHNESS_TO_DATA_RUNS_RELATIONSHIP_NOTE_2026-05-30.md";
const repositoryPath = "src/lib/repositories/supabase-data-freshness-repository.ts";
const dataFreshnessPath = "src/lib/data-freshness.ts";
const draftContractPath = "src/lib/cp3-remote-only-object-contracts.draft.ts";

const report = fs.readFileSync(reportPath, "utf8");
const repository = fs.readFileSync(repositoryPath, "utf8");
const dataFreshness = fs.readFileSync(dataFreshnessPath, "utf8");
const draftContract = fs.readFileSync(draftContractPath, "utf8");

const requiredReportPhrases = [
  "Status: `CP3 data_freshness to data_runs relationship note recorded`",
  "KEEP_DATA_RUNS_AS_CURRENT_RUNTIME_BASELINE_AND_DATA_FRESHNESS_AS_UNMAPPED_REMOTE_CANDIDATE",
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
  "EVIDENCE-001 supabase/migrations/0001_initial_schema.sql defines public.data_runs",
  "EVIDENCE-003 src/lib/supabase/database.types.ts contains data_runs",
  "EVIDENCE-005 src/lib/repositories/supabase-data-freshness-repository.ts reads from data_runs",
  "EVIDENCE-006 src/lib/repositories/supabase-data-freshness-repository.ts does not read from data_freshness",
  "EVIDENCE-007 src/lib/data-freshness.ts builds Supabase freshness snapshots from DataRunFreshnessRow[]",
  "EVIDENCE-008 src/lib/cp3-remote-only-object-contracts.draft.ts marks data_freshness relationshipToDataRuns as unmapped_pending_decision",
  "RELATIONSHIP-001 data_runs remains the current local runtime baseline for freshness behavior",
  "RELATIONSHIP-002 data_freshness remains a remote-only freshness disclosure candidate",
  "RELATIONSHIP-003 data_freshness must not replace data_runs until local migration, generated types, repository contract, and QA gates exist",
  "RELATIONSHIP-004 runtime freshness UI must continue to rely on existing mock/public-safe state unless a separate gate authorizes Supabase reads",
  "RELATIONSHIP-005 DATA_FRESHNESS_SOURCE must remain mock by default",
  "RELATIONSHIP-006 DATA_FRESHNESS_SUPABASE_READS must remain disabled unless a separate runtime-read gate authorizes it",
  "RELATIONSHIP-007 data_freshness reachability is not freshness quality evidence",
  "REPOSITORY-001 current repository contract remains data_runs-based",
  "REPOSITORY-002 future repository abstraction may normalize data_runs and data_freshness into one DataFreshnessSnapshot boundary",
  "REPOSITORY-003 future data_freshness adoption requires explicit object purpose: table, view, summary object, or replacement candidate",
  "REPOSITORY-004 future adoption requires field-level mapping to DataRunFreshnessRow or a new explicit row type",
  "CEO-FINDING-001 this resolves a runtime ambiguity without slowing down global architecture work",
  "ENGINEERING-FINDING-001 no runtime import or query should target data_freshness yet",
  "ENGINEERING-FINDING-002 data_runs is the only local-baselined freshness table in this slice",
  "DATA-FINDING-001 data_freshness may become useful as a summary object, but its semantics are not proven",
  "QA-FINDING-001 data_freshness must stay blocked from runtime until migration/type/repository tests exist",
  "GUARDRAIL-001 no second remote schema-shape attempt",
  "GUARDRAIL-002 no Supabase connection",
  "GUARDRAIL-003 no SQL execution",
  "GUARDRAIL-005 no Supabase writes",
  "GUARDRAIL-008 no market-data fetch, parse, ingestion, or raw market-data commit",
  "GUARDRAIL-010 no scoreSource=real",
  "GUARDRAIL-012 no CP3 readiness promotion",
  "GUARDRAIL-013 no runtime repository dependency on data_freshness",
  "NEXT-SLICE-001 create a local-only freshness repository abstraction plan",
  "scripts/check-cp3-data-freshness-to-data-runs-relationship-note.mjs passes",
  "scripts/check-cp3-remote-only-object-draft-types.mjs passes",
  "scripts/check-review-gates.mjs passes",
  "TypeScript noEmit passes",
  "Next build passes",
  "public data source remains mock",
  "scoreSource=real remains blocked",
  "CP3 remains not_ready",
  "public claims remain blocked"
];

const requiredCodePhrases = [
  { content: repository, phrase: "from(table: \"data_runs\")" },
  { content: repository, phrase: ".from(\"data_runs\")" },
  { content: repository, phrase: "buildSupabaseDataFreshnessSnapshot" },
  { content: dataFreshness, phrase: "export type DataRunFreshnessRow" },
  { content: dataFreshness, phrase: "dataRuns: DataRunFreshnessRow[]" },
  { content: draftContract, phrase: "relationshipToDataRuns: \"unmapped_pending_decision\"" }
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
  "data_freshness replaces data_runs now"
];

const forbiddenRepositoryPhrases = [
  "from(table: \"data_freshness\")",
  ".from(\"data_freshness\")",
  "DataFreshnessRow"
];

const forbiddenRuntimeImports = walkFiles("src/app")
  .concat(walkFiles("src/components"))
  .concat(walkFiles("src/lib/repositories"))
  .filter((file) => fs.readFileSync(file, "utf8").includes("cp3-remote-only-object-contracts.draft"));

const missing = [
  ...requiredReportPhrases.filter((phrase) => !report.includes(phrase)),
  ...requiredCodePhrases.filter(({ content, phrase }) => !content.includes(phrase)).map(({ phrase }) => phrase)
];
const forbidden = [
  ...forbiddenReportPhrases.filter((phrase) => report.includes(phrase)),
  ...forbiddenRepositoryPhrases.filter((phrase) => repository.includes(phrase))
];

console.log(
  JSON.stringify(
    {
      forbidden,
      forbiddenRuntimeImports,
      missing,
      status: missing.length === 0 && forbidden.length === 0 && forbiddenRuntimeImports.length === 0 ? "ok" : "blocked"
    },
    null,
    2
  )
);

if (missing.length > 0 || forbidden.length > 0 || forbiddenRuntimeImports.length > 0) {
  process.exitCode = 1;
}

function walkFiles(root) {
  if (!fs.existsSync(root)) return [];
  const files = [];
  for (const entry of fs.readdirSync(root, { withFileTypes: true })) {
    const fullPath = path.join(root, entry.name);
    if (entry.isDirectory()) {
      files.push(...walkFiles(fullPath));
    } else if (/\.(ts|tsx)$/.test(entry.name)) {
      files.push(fullPath);
    }
  }
  return files;
}
