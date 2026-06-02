import fs from "node:fs";

const summaryPath = "src/lib/runtime-readiness-score.ts";
const activationPath = "src/lib/freshness-runtime-activation.ts";
const decisionPath = "src/lib/supabase-readonly-decision.ts";
const executionPreviewPath = "src/lib/supabase-readonly-execution-preview.ts";
const evidencePath = "src/lib/supabase-readonly-evidence.ts";
const readonlySmokePath = "src/lib/freshness-readonly-smoke-report.ts";
const freshnessLatestEvidencePath = "src/lib/freshness-readonly-latest-evidence.ts";
const preflightPath = "src/lib/supabase-readonly-local-preflight.ts";
const componentPath = "src/components/runtime-readiness-panel.tsx";
const briefingPath = "src/app/briefing/page.tsx";
const cssPath = "src/app/globals.css";

const files = new Map(
  [summaryPath, activationPath, decisionPath, executionPreviewPath, evidencePath, readonlySmokePath, freshnessLatestEvidencePath, preflightPath, componentPath, briefingPath, cssPath].map(
    (file) => [file, fs.readFileSync(file, "utf8")]
  )
);

const required = [
  [summaryPath, "getRuntimeReadinessSummary"],
  [summaryPath, "npm run report:supabase-readonly-preflight"],
  [summaryPath, "npm run db:readonly-validate"],
  [summaryPath, "freshness interpretation"],
  [activationPath, "getFreshnessRuntimeActivationSummary"],
  [activationPath, "readonly_metadata_open"],
  [activationPath, "mock_only"],
  [activationPath, "automatedRemoteRun: false"],
  [activationPath, "connectionAttempted: false"],
  [activationPath, "sqlExecuted: false"],
  [activationPath, "writesEnabled: false"],
  [activationPath, "scoreSourceRealEnabled: false"],
  [activationPath, "nextPublicDataSource: \"mock\""],
  [evidencePath, "getSupabaseReadonlyEvidenceSummary"],
  [evidencePath, "object_reachability_accepted"],
  [evidencePath, "filesWritten: false"],
  [evidencePath, "mutations: false"],
  [evidencePath, "sqlExecuted: false"],
  [evidencePath, "scoreSourceRealChanged: false"],
  [readonlySmokePath, "buildFreshnessReadonlySmokeReport"],
  [readonlySmokePath, "connectionAttempted"],
  [readonlySmokePath, "sqlExecuted"],
  [readonlySmokePath, "writesEnabled"],
  [readonlySmokePath, "scoreSourceRealEnabled"],
  [readonlySmokePath, "rowPayloadsPrinted: false"],
  [readonlySmokePath, "secretsPrinted: false"],
  [freshnessLatestEvidencePath, "getFreshnessReadonlyLatestEvidenceSummary"],
  [freshnessLatestEvidencePath, "freshness_readonly_metadata_accepted"],
  [freshnessLatestEvidencePath, "asOfDate: \"2026-05-27\""],
  [freshnessLatestEvidencePath, "market: \"TWSE\""],
  [freshnessLatestEvidencePath, "sourceName: \"TWSE OpenAPI\""],
  [freshnessLatestEvidencePath, "scoreSource: \"mock\""],
  [freshnessLatestEvidencePath, "publicDataSource: \"mock\""],
  [freshnessLatestEvidencePath, "sqlExecuted: false"],
  [freshnessLatestEvidencePath, "writesEnabled: false"],
  [freshnessLatestEvidencePath, "ingestionStarted: false"],
  [freshnessLatestEvidencePath, "scoreSourceRealChanged: false"],
  [preflightPath, "getSupabaseReadonlyLocalPreflight"],
  [preflightPath, "connectionAttempted: false"],
  [preflightPath, "secretsPrinted: false"],
  [preflightPath, "rowPayloadsPrinted: false"],
  [preflightPath, "sqlExecuted: false"],
  [preflightPath, "mutations: false"],
  [decisionPath, "getSupabaseReadonlyDecision"],
  [decisionPath, "scoreSourceRealEnabled: false"],
  [decisionPath, "connectionAttempted: false"],
  [decisionPath, "sqlExecuted: false"],
  [decisionPath, "mutations: false"],
  [executionPreviewPath, "getSupabaseReadonlyExecutionPreview"],
  [executionPreviewPath, "manualApprovalRequired: true"],
  [executionPreviewPath, "willRunRemoteValidator: false"],
  [executionPreviewPath, "automatedRemoteRun: false"],
  [executionPreviewPath, "scoreSourceRealEnabled: false"],
  [executionPreviewPath, "connectionAttempted: false"],
  [executionPreviewPath, "sqlExecuted: false"],
  [executionPreviewPath, "mutations: false"],
  [componentPath, "RuntimeReadinessPanel"],
  [componentPath, "Runtime Readiness"],
  [componentPath, "Freshness runtime activation"],
  [componentPath, "freshnessActivation.state"],
  [componentPath, "buildFreshnessReadonlySmokeReport"],
  [componentPath, "getFreshnessReadonlyLatestEvidenceSummary"],
  [componentPath, "Freshness latest evidence"],
  [componentPath, "freshnessLatestEvidence.evidenceStatus"],
  [componentPath, "readonlySmokeReport.outcome"],
  [componentPath, "Freshness readonly smoke"],
  [componentPath, "Readonly evidence"],
  [componentPath, "Execution preview"],
  [componentPath, "Local preflight status"],
  [componentPath, "readonlyFinalPrepReady"],
  [componentPath, "Supabase readonly final prep decision summary"],
  [componentPath, "ready_for_ceo_oral_review"],
  [componentPath, "executionPreview.requiredConfirmation"],
  [componentPath, "Remote validator executed: false"],
  [componentPath, "executionPreview.postRunReviewTarget"],
  [briefingPath, "import { RuntimeReadinessPanel }"],
  [briefingPath, "<RuntimeReadinessPanel />"],
  [cssPath, ".runtime-readiness-panel"],
  [cssPath, ".runtime-readiness-command"],
  [cssPath, ".runtime-final-prep-card"],
  [cssPath, ".runtime-preflight-status"],
  [cssPath, ".runtime-readiness-lanes"],
  [cssPath, ".runtime-readiness-score"]
];

const forbidden = [
  [summaryPath, "scoreSource=real approved"],
  [summaryPath, "NEXT_PUBLIC_DATA_SOURCE=supabase"],
  [activationPath, "@supabase/supabase-js"],
  [activationPath, "createClient"],
  [activationPath, "fetch("],
  [activationPath, ".from("],
  [activationPath, ".insert("],
  [activationPath, ".update("],
  [activationPath, ".delete("],
  [activationPath, "automatedRemoteRun: true"],
  [activationPath, "connectionAttempted: true"],
  [activationPath, "sqlExecuted: true"],
  [activationPath, "writesEnabled: true"],
  [activationPath, "scoreSourceRealEnabled: true"],
  [activationPath, "nextPublicDataSource: \"supabase\""],
  [readonlySmokePath, "@supabase/supabase-js"],
  [readonlySmokePath, "createClient"],
  [readonlySmokePath, "fetch("],
  [readonlySmokePath, ".from("],
  [readonlySmokePath, ".insert("],
  [readonlySmokePath, ".update("],
  [readonlySmokePath, ".delete("],
  [readonlySmokePath, "connectionAttempted: true"],
  [readonlySmokePath, "sqlExecuted: true"],
  [readonlySmokePath, "writesEnabled: true"],
  [readonlySmokePath, "scoreSourceRealEnabled: true"],
  [freshnessLatestEvidencePath, "@supabase/supabase-js"],
  [freshnessLatestEvidencePath, "createClient"],
  [freshnessLatestEvidencePath, "fetch("],
  [freshnessLatestEvidencePath, ".from("],
  [freshnessLatestEvidencePath, ".insert("],
  [freshnessLatestEvidencePath, ".update("],
  [freshnessLatestEvidencePath, ".delete("],
  [freshnessLatestEvidencePath, "sqlExecuted: true"],
  [freshnessLatestEvidencePath, "writesEnabled: true"],
  [freshnessLatestEvidencePath, "ingestionStarted: true"],
  [freshnessLatestEvidencePath, "scoreSourceRealChanged: true"],
  [preflightPath, "@supabase/supabase-js"],
  [preflightPath, "createClient"],
  [preflightPath, "fetch("],
  [preflightPath, ".from("],
  [preflightPath, ".insert("],
  [preflightPath, ".update("],
  [preflightPath, ".delete("],
  [decisionPath, "@supabase/supabase-js"],
  [decisionPath, "createClient"],
  [decisionPath, "fetch("],
  [decisionPath, ".from("],
  [decisionPath, ".insert("],
  [decisionPath, ".update("],
  [decisionPath, ".delete("],
  [executionPreviewPath, "@supabase/supabase-js"],
  [executionPreviewPath, "createClient"],
  [executionPreviewPath, "fetch("],
  [executionPreviewPath, ".from("],
  [executionPreviewPath, ".insert("],
  [executionPreviewPath, ".update("],
  [executionPreviewPath, ".delete("],
  [componentPath, "fetch("],
  [componentPath, "createClient"],
  [componentPath, "process.env"]
];

const missing = required.filter(([file, phrase]) => !read(file).includes(phrase)).map(([file, phrase]) => `${file}: ${phrase}`);
const blocked = forbidden.filter(([file, phrase]) => read(file).includes(phrase)).map(([file, phrase]) => `${file}: ${phrase}`);

console.log(
  JSON.stringify(
    {
      blocked,
      missing,
      status: missing.length === 0 && blocked.length === 0 ? "ok" : "blocked"
    },
    null,
    2
  )
);

if (missing.length > 0 || blocked.length > 0) {
  process.exitCode = 1;
}

function read(file) {
  return files.get(file) ?? "";
}
