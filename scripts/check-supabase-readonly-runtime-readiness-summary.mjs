import fs from "node:fs";

const files = {
  packageJson: "package.json",
  reviewGate: "scripts/check-review-gates.mjs",
  localPreflight: "scripts/check-supabase-readonly-local-preflight.mjs",
  localPreflightReport: "scripts/report-supabase-readonly-local-preflight.mjs",
  decisionPacket: "scripts/check-supabase-readonly-decision-packet.mjs",
  decisionPacketReport: "scripts/report-supabase-readonly-decision.mjs",
  executionPreview: "scripts/check-supabase-readonly-execution-preview.mjs",
  executionPreviewReport: "scripts/report-supabase-readonly-execution-preview.mjs",
  finalPrep: "scripts/check-supabase-readonly-final-prep.mjs",
  finalPrepReport: "scripts/report-supabase-readonly-final-prep.mjs",
  validatorContract: "scripts/check-supabase-readonly-validator-output-contract.mjs",
  blankErrorRootCause: "scripts/check-supabase-readonly-blank-error-root-cause.mjs",
  latestSanitizedRun: "scripts/check-cp3-supabase-read-only-latest-sanitized-run.mjs",
  latestSanitizedRunDoc: "docs/reviews/CP3_SUPABASE_READ_ONLY_LATEST_SANITIZED_RUN_2026-06-02.md",
  runtimeFailClosed: "scripts/check-runtime-fail-closed.mjs",
  runtimeFailClosedLib: "src/lib/runtime-fail-closed.ts",
  runtimeStateConsistency: "scripts/check-runtime-state-consistency.mjs",
  postReadonlyRuntimeState: "scripts/check-post-readonly-runtime-state.mjs",
  publicRuntimeBoundary: "scripts/check-public-market-signal-runtime-boundary.mjs",
  sourceBoundary: "scripts/check-market-signal-source-boundary.mjs",
  script: "scripts/check-supabase-readonly-runtime-readiness-summary.mjs"
};

const read = (file) => fs.readFileSync(file, "utf8");
const sources = Object.fromEntries(Object.entries(files).map(([key, file]) => [key, read(file)]));
const packageJson = JSON.parse(sources.packageJson);

const requiredPackageScripts = {
  "check:supabase-readonly-runtime-readiness-summary": "node scripts/check-supabase-readonly-runtime-readiness-summary.mjs",
  "check:supabase-readonly-local-preflight": "node scripts/check-supabase-readonly-local-preflight.mjs",
  "check:supabase-readonly-decision-packet": "node scripts/check-supabase-readonly-decision-packet.mjs",
  "check:supabase-readonly-execution-preview": "node scripts/check-supabase-readonly-execution-preview.mjs",
  "check:supabase-readonly-final-prep": "node scripts/check-supabase-readonly-final-prep.mjs",
  "check:cp3-supabase-readonly-latest-sanitized-run": "node scripts/check-cp3-supabase-read-only-latest-sanitized-run.mjs",
  "check:runtime-fail-closed": "node scripts/check-runtime-fail-closed.mjs",
  "check:runtime-state-consistency": "node scripts/check-runtime-state-consistency.mjs"
};

const gateCheckers = [
  ["supabase-readonly-runtime-readiness-summary", files.script],
  ["supabase-readonly-local-preflight", files.localPreflight],
  ["supabase-readonly-decision-packet", files.decisionPacket],
  ["supabase-readonly-execution-preview", files.executionPreview],
  ["supabase-readonly-validator-output-contract", files.validatorContract],
  ["supabase-readonly-blank-error-root-cause", files.blankErrorRootCause],
  ["supabase-readonly-final-prep", files.finalPrep],
  ["cp3-supabase-readonly-latest-sanitized-run", files.latestSanitizedRun],
  ["runtime-fail-closed", files.runtimeFailClosed],
  ["runtime-state-consistency", files.runtimeStateConsistency],
  ["post-readonly-runtime-state", files.postReadonlyRuntimeState],
  ["public-market-signal-runtime-boundary", files.publicRuntimeBoundary],
  ["market-signal-source-boundary", files.sourceBoundary]
];

const requiredEvidence = [
  [sources.localPreflightReport, "connectionAttempted: false", "local preflight does not connect"],
  [sources.localPreflightReport, "sqlExecuted: false", "local preflight does not run SQL"],
  [sources.localPreflightReport, "mutations: false", "local preflight does not mutate"],
  [sources.localPreflightReport, "secretsPrinted: false", "local preflight does not print secrets"],
  [sources.decisionPacketReport, "mode: \"supabase_readonly_decision_packet\"", "decision packet mode"],
  [sources.executionPreviewReport, "mode: \"supabase_readonly_execution_preview\"", "execution preview mode"],
  [sources.finalPrepReport, "mode: \"supabase_readonly_final_prep\"", "final prep mode"],
  [sources.finalPrepReport, "ready_for_ceo_oral_review", "CEO oral review state"],
  [sources.finalPrepReport, "automatedRemoteRun: false", "final prep blocks automated remote run"],
  [sources.finalPrepReport, "willRunRemoteValidator: false", "final prep blocks direct validator run"],
  [sources.latestSanitizedRunDoc, "Validator status: `blocked`", "latest sanitized run remains blocked"],
  [sources.latestSanitizedRunDoc, "Connection status: `blocked`", "latest connection status remains blocked"],
  [sources.latestSanitizedRunDoc, "Additional remote attempts require a new explicit gate", "new attempt requires gate"],
  [sources.latestSanitizedRunDoc, "Public data source remains mock", "public data remains mock"],
  [sources.latestSanitizedRunDoc, "`scoreSource=real` remains blocked", "scoreSource real remains blocked"],
  [sources.runtimeFailClosedLib, "failClosedState: \"active\"", "runtime fail-closed active"],
  [sources.runtimeFailClosedLib, "publicDataSource: \"mock\"", "runtime public source mock"],
  [sources.runtimeFailClosedLib, "scoreSource: \"mock\"", "runtime score source mock"],
  [sources.publicRuntimeBoundary, "publicScoreSource", "public runtime boundary checked"],
  [sources.sourceBoundary, "scoreSource", "source boundary checked"]
];

const forbiddenSummaryTokens = [
  "CP3_READY_NOW",
  "PROMOTE_CP3_READINESS_NOW",
  "scoreSource=real approved",
  "publicDataSource=supabase approved",
  "ALLOW_SQL_EXECUTION",
  "ALLOW_MIGRATION_EXECUTION",
  "ALLOW_SUPABASE_WRITES",
  "ALLOW_INSERT_UPDATE_UPSERT_DELETE",
  "ALLOW_MARKET_INGESTION",
  "ALLOW_RAW_MARKET_DATA_COMMIT",
  "PUBLIC_CLAIMS_APPROVED",
  "SOURCE_DEPTH_PRODUCTION_READY",
  "SECOND_REMOTE_ATTEMPT_APPROVED"
];

const forbiddenCodeTokens = [
  "@supabase/supabase-js",
  "createClient",
  "fetch(",
  ".from(",
  ".select(",
  ".insert(",
  ".upsert(",
  ".update(",
  ".delete(",
  ".rpc(",
  "insert into",
  "delete from",
  "truncate",
  "drop table",
  "alter table",
  "create table",
  "writeFileSync",
  "appendFileSync",
  "process.env"
];

const packageFailures = Object.entries(requiredPackageScripts)
  .filter(([name, expected]) => packageJson.scripts?.[name] !== expected)
  .map(([name, expected]) => ({ check: "package-script", name, expected, actual: packageJson.scripts?.[name] ?? null }));

const gateFailures = gateCheckers.flatMap(([name, file]) => {
  const missing = [];
  if (!sources.reviewGate.includes(file)) missing.push({ check: "review-gate-file", name, file });
  if (!sources.reviewGate.includes(`name: "${name}"`)) missing.push({ check: "review-gate-name", name });
  return missing;
});

const evidenceFailures = requiredEvidence
  .filter(([source, token]) => !source.includes(token))
  .map(([, token, check]) => ({ check, token }));

const forbiddenEvidence = [
  ["latestSanitizedRunDoc", sources.latestSanitizedRunDoc],
  ["finalPrepReport", sources.finalPrepReport],
  ["runtimeFailClosedLib", sources.runtimeFailClosedLib],
  ["runtimeStateConsistency", sources.runtimeStateConsistency]
].flatMap(([name, source]) =>
  forbiddenSummaryTokens.filter((token) => source.includes(token)).map((token) => ({ source: name, token }))
);

const normalizedScript = sources.script
  .replace(/const forbiddenCodeTokens = \[[\s\S]*?\];/, "const forbiddenCodeTokens = [];");
const forbiddenCode = forbiddenCodeTokens.filter((token) => normalizedScript.includes(token)).map((token) => ({ source: "script", token }));

const failures = [...packageFailures, ...gateFailures, ...evidenceFailures, ...forbiddenEvidence, ...forbiddenCode];
const summary = {
  status: failures.length === 0 ? "ok" : "blocked",
  decision: failures.length === 0 ? "ready_for_ceo_review_before_bounded_readonly_attempt" : "not_ready",
  nextActionBoundary: "manual bounded read-only attempt only after CEO/Chairman gate; no SQL, no writes, no raw market data, no scoreSource=real",
  laneState: {
    runtime: "mock_fail_closed_ready",
    supabaseReadonly: "pre_attempt_summary_ready",
    publicDataSource: "mock",
    scoreSource: "mock"
  },
  checked: {
    packageScripts: Object.keys(requiredPackageScripts),
    reviewGateNames: gateCheckers.map(([name]) => name),
    evidenceItems: requiredEvidence.map(([, , check]) => check)
  },
  failures
};

console.log(JSON.stringify(summary, null, 2));
process.exit(failures.length === 0 ? 0 : 1);
