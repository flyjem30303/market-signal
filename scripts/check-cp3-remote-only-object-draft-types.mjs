import fs from "node:fs";
import path from "node:path";

const typePath = "src/lib/cp3-remote-only-object-contracts.draft.ts";
const reportPath = "docs/reviews/CP3_REMOTE_ONLY_OBJECT_DRAFT_TYPES_2026-05-30.md";
const forbiddenRuntimeRoots = ["src/app", "src/components", "src/lib/repositories"];

const typeFile = fs.existsSync(typePath) ? fs.readFileSync(typePath, "utf8") : "";
const report = fs.existsSync(reportPath) ? fs.readFileSync(reportPath, "utf8") : "";

const requiredTypePhrases = [
  "export type Cp3RemoteOnlyContractState = \"remote_only_pending_contract\"",
  "export type Cp3RuntimeDependencyState = \"blocked\"",
  "export type Cp3MarketAssetContractDraft",
  "export type Cp3ModelRunContractDraft",
  "export type Cp3DataFreshnessContractDraft",
  "export type Cp3RemoteOnlyObjectContractDraft",
  "objectName: \"market_assets\"",
  "objectName: \"model_runs\"",
  "objectName: \"data_freshness\"",
  "role: \"global_asset_identity_candidate_only\"",
  "role: \"score_provenance_candidate_only\"",
  "role: \"freshness_disclosure_candidate_only\"",
  "relationshipToDataRuns: \"unmapped_pending_decision\"",
  "sourceMode: \"mock\" | \"candidate\" | \"real_blocked\"",
  "publicDataSource: \"mock\"",
  "scoreSourceReal: \"blocked\"",
  "sqlExecution: \"blocked\"",
  "supabaseConnection: \"blocked\"",
  "supabaseWrites: \"blocked\"",
  "export const cp3RemoteOnlyObjectContractDrafts",
  "export function canUseRemoteOnlyObjectAtRuntime",
  "contract.shape.contractState !== \"remote_only_pending_contract\"",
  "export function getRemoteOnlyContractNextAction"
];

const requiredReportPhrases = [
  "Status: `CP3 remote-only object draft types recorded`",
  "CREATE_LOCAL_DRAFT_TYPES_WITHOUT_RUNTIME_WIRING",
  "does not import the draft contracts into pages, components, or repositories",
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
  "ARTIFACT-001 src/lib/cp3-remote-only-object-contracts.draft.ts exists",
  "MARKET-ASSETS-001 contract role is global_asset_identity_candidate_only",
  "MODEL-RUNS-003 sourceMode includes real_blocked, not real",
  "DATA-FRESHNESS-003 relationshipToDataRuns is unmapped_pending_decision",
  "WIRING-001 src/app must not import cp3-remote-only-object-contracts.draft",
  "WIRING-002 src/components must not import cp3-remote-only-object-contracts.draft",
  "WIRING-003 src/lib/repositories must not import cp3-remote-only-object-contracts.draft",
  "WIRING-006 public data source remains mock",
  "WIRING-007 scoreSource=real remains blocked",
  "WIRING-008 CP3 remains not_ready",
  "CEO-FINDING-001 this is the fastest safe acceleration from governance to implementation preparation",
  "ENGINEERING-FINDING-002 canUseRemoteOnlyObjectAtRuntime must remain false for remote_only_pending_contract objects",
  "GUARDRAIL-001 no second remote schema-shape attempt",
  "GUARDRAIL-002 no Supabase connection",
  "GUARDRAIL-003 no SQL execution",
  "GUARDRAIL-005 no Supabase writes",
  "GUARDRAIL-008 no market-data fetch, parse, ingestion, or raw market-data commit",
  "GUARDRAIL-010 no scoreSource=real",
  "GUARDRAIL-012 no CP3 readiness promotion",
  "NEXT-SLICE-001 create data_freshness to data_runs relationship note",
  "scripts/check-cp3-remote-only-object-draft-types.mjs passes",
  "scripts/check-cp3-remote-only-object-contract-plan.mjs passes",
  "scripts/check-review-gates.mjs passes",
  "TypeScript noEmit passes",
  "Next build passes",
  "public data source remains mock",
  "scoreSource=real remains blocked",
  "CP3 remains not_ready",
  "public claims remain blocked"
];

const forbiddenTypePhrases = [
  "sourceMode: \"real\"",
  "scoreSourceReal: \"approved\"",
  "publicDataSource: \"supabase\"",
  "sqlExecution: \"approved\"",
  "supabaseConnection: \"approved\"",
  "supabaseWrites: \"approved\"",
  "runtimeDependencyState: \"ready\""
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
  "runtime readiness is approved"
];

const forbiddenImports = forbiddenRuntimeRoots.flatMap(walkFiles).filter((file) => {
  if (path.normalize(file) === path.normalize(typePath)) return false;
  return fs.readFileSync(file, "utf8").includes("cp3-remote-only-object-contracts.draft");
});

const missing = [
  ...requiredTypePhrases.filter((phrase) => !typeFile.includes(phrase)),
  ...requiredReportPhrases.filter((phrase) => !report.includes(phrase))
];
const forbidden = [
  ...forbiddenTypePhrases.filter((phrase) => typeFile.includes(phrase)),
  ...forbiddenReportPhrases.filter((phrase) => report.includes(phrase))
];

console.log(
  JSON.stringify(
    {
      forbidden,
      forbiddenImports,
      missing,
      status: missing.length === 0 && forbidden.length === 0 && forbiddenImports.length === 0 ? "ok" : "blocked"
    },
    null,
    2
  )
);

if (missing.length > 0 || forbidden.length > 0 || forbiddenImports.length > 0) {
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
