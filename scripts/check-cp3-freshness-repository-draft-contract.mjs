import fs from "node:fs";
import path from "node:path";

const contractPath = "src/lib/repositories/freshness-repository-contract.draft.ts";
const reportPath = "docs/reviews/CP3_FRESHNESS_REPOSITORY_DRAFT_CONTRACT_2026-05-30.md";
const runtimeRoots = ["src/app", "src/components", "src/lib/repositories"];

const contract = fs.readFileSync(contractPath, "utf8");
const report = fs.readFileSync(reportPath, "utf8");

const requiredContractPhrases = [
  "import type { DataFreshnessSnapshot } from \"@/lib/data-freshness\"",
  "export type FreshnessRepositoryContractState = \"draft_only\"",
  "export type FreshnessRepositoryRuntimeState = \"mock_default\" | \"supabase_read_blocked\" | \"candidate_only\"",
  "export type FreshnessRepositorySourceKind = \"mock\" | \"data_runs\" | \"data_freshness_candidate\"",
  "export type FreshnessRepositoryDraft",
  "getSnapshot(): Promise<DataFreshnessSnapshot>",
  "export type MockFreshnessRepositoryDraft",
  "sourceKind: \"mock\"",
  "export type DataRunsFreshnessRepositoryDraft",
  "sourceKind: \"data_runs\"",
  "export type DataFreshnessRemoteCandidateRepositoryDraft",
  "reason: \"data_freshness_unmapped_pending_decision\"",
  "sourceKind: \"data_freshness_candidate\"",
  "dataFreshnessRemoteObject: \"blocked\"",
  "publicDataSource: \"mock\"",
  "scoreSourceReal: \"blocked\"",
  "sqlExecution: \"blocked\"",
  "supabaseConnection: \"not_enabled_by_contract\"",
  "supabaseWrites: \"blocked\"",
  "export const freshnessRepositoryDraftSourceOrder",
  "export function canUseFreshnessRepositoryAtPublicRuntime",
  "repository.sourceKind === \"mock\" && repository.readMode === \"local_mock_only\"",
  "export function canUseDataRunsFreshnessCandidate",
  "source === \"supabase\" && supabaseRuntimeReads === \"enabled\"",
  "export function canUseDataFreshnessRemoteCandidate(): false",
  "return false",
  "export function getFreshnessRepositoryNextAction"
];

const requiredReportPhrases = [
  "Status: `CP3 freshness repository draft contract recorded`",
  "CREATE_DRAFT_REPOSITORY_CONTRACT_WITHOUT_RUNTIME_WIRING",
  "does not import the draft contract into pages, components, or runtime repositories",
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
  "ARTIFACT-001 src/lib/repositories/freshness-repository-contract.draft.ts exists",
  "ARTIFACT-002 FreshnessRepositoryDraft exists",
  "ARTIFACT-003 MockFreshnessRepositoryDraft exists",
  "ARTIFACT-004 DataRunsFreshnessRepositoryDraft exists",
  "ARTIFACT-005 DataFreshnessRemoteCandidateRepositoryDraft exists but is blocked",
  "ARTIFACT-008 canUseDataRunsFreshnessCandidate exists and requires source=supabase plus supabaseRuntimeReads=enabled",
  "ARTIFACT-009 canUseDataFreshnessRemoteCandidate always returns false",
  "CONTRACT-001 DataFreshnessSnapshot remains the UI-facing output boundary",
  "CONTRACT-002 mock repository is the only public-runtime-safe repository in this draft",
  "CONTRACT-003 data_runs is a gated Supabase read candidate only",
  "CONTRACT-004 data_freshness is a blocked remote candidate only",
  "CONTRACT-005 this draft contract does not enable Supabase reads",
  "SOURCE-004 public runtime can use only sourceKind=mock in this draft",
  "SOURCE-005 data_runs can become usable only after explicit source=supabase and supabaseRuntimeReads=enabled gate",
  "SOURCE-006 data_freshness cannot become usable from this draft",
  "WIRING-001 src/app must not import freshness-repository-contract.draft",
  "WIRING-002 src/components must not import freshness-repository-contract.draft",
  "WIRING-003 runtime repository implementation files must not import freshness-repository-contract.draft",
  "WIRING-006 public data source remains mock",
  "WIRING-007 scoreSource=real remains blocked",
  "WIRING-008 CP3 remains not_ready",
  "CEO-FINDING-001 this larger slice is the new working cadence: contract, checker, gate, validation, and commit together",
  "ENGINEERING-FINDING-002 canUseDataFreshnessRemoteCandidate must stay false until data_freshness is contracted",
  "ENGINEERING-FINDING-003 canUseDataRunsFreshnessCandidate must require explicit Supabase runtime-read enablement",
  "GUARDRAIL-001 no second remote schema-shape attempt",
  "GUARDRAIL-002 no Supabase connection",
  "GUARDRAIL-003 no SQL execution",
  "GUARDRAIL-005 no Supabase writes",
  "GUARDRAIL-008 no market-data fetch, parse, ingestion, or raw market-data commit",
  "GUARDRAIL-010 no scoreSource=real",
  "GUARDRAIL-012 no CP3 readiness promotion",
  "GUARDRAIL-013 no runtime repository dependency on data_freshness",
  "NEXT-SLICE-001 implement mock/default freshness repository factory with unchanged behavior",
  "scripts/check-cp3-freshness-repository-draft-contract.mjs passes",
  "scripts/check-cp3-local-only-freshness-repository-abstraction-plan.mjs passes",
  "scripts/check-review-gates.mjs passes",
  "TypeScript noEmit passes",
  "Next build passes",
  "public data source remains mock",
  "scoreSource=real remains blocked",
  "CP3 remains not_ready",
  "public claims remain blocked"
];

const forbiddenContractPhrases = [
  "sourceKind: \"data_freshness\"",
  "scoreSourceReal: \"approved\"",
  "publicDataSource: \"supabase\"",
  "sqlExecution: \"approved\"",
  "supabaseConnection: \"enabled\"",
  "supabaseWrites: \"approved\"",
  "return true"
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

const forbiddenRuntimeImports = runtimeRoots.flatMap(walkFiles).filter((file) => {
  if (path.normalize(file) === path.normalize(contractPath)) return false;
  return fs.readFileSync(file, "utf8").includes("freshness-repository-contract.draft");
});

const missing = [
  ...requiredContractPhrases.filter((phrase) => !contract.includes(phrase)),
  ...requiredReportPhrases.filter((phrase) => !report.includes(phrase))
];
const forbidden = [
  ...forbiddenContractPhrases.filter((phrase) => contract.includes(phrase)),
  ...forbiddenReportPhrases.filter((phrase) => report.includes(phrase))
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
