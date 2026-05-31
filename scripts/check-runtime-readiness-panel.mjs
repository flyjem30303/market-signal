import fs from "node:fs";

const summaryPath = "src/lib/runtime-readiness-score.ts";
const decisionPath = "src/lib/supabase-readonly-decision.ts";
const executionPreviewPath = "src/lib/supabase-readonly-execution-preview.ts";
const evidencePath = "src/lib/supabase-readonly-evidence.ts";
const preflightPath = "src/lib/supabase-readonly-local-preflight.ts";
const componentPath = "src/components/runtime-readiness-panel.tsx";
const briefingPath = "src/app/briefing/page.tsx";
const cssPath = "src/app/globals.css";

const files = new Map(
  [summaryPath, decisionPath, executionPreviewPath, evidencePath, preflightPath, componentPath, briefingPath, cssPath].map((file) => [
    file,
    fs.readFileSync(file, "utf8")
  ])
);

const required = [
  [summaryPath, "Runtime 已通過 Supabase object reachability，但仍維持 mock-only"],
  [summaryPath, "Supabase 唯讀 object reachability"],
  [summaryPath, "本地 preflight 只檢查環境與安全開關"],
  [summaryPath, "不連線、不印 secrets、不跑 SQL"],
  [summaryPath, "npm run report:supabase-readonly-preflight"],
  [summaryPath, "npm run db:readonly-validate"],
  [summaryPath, "模型與回測證據"],
  [summaryPath, "schema shape、freshness interpretation 與 UI state wiring"],
  [evidencePath, "getSupabaseReadonlyEvidenceSummary"],
  [evidencePath, "object_reachability_accepted"],
  [evidencePath, "Do not convert object reachability into SQL, writes, ingestion, public claims, or scoreSource=real."],
  [evidencePath, "filesWritten: false"],
  [evidencePath, "mutations: false"],
  [evidencePath, "sqlExecuted: false"],
  [evidencePath, "scoreSourceRealChanged: false"],
  [preflightPath, "getSupabaseReadonlyLocalPreflight"],
  [preflightPath, "connectionAttempted: false"],
  [preflightPath, "secretsPrinted: false"],
  [preflightPath, "rowPayloadsPrinted: false"],
  [preflightPath, "sqlExecuted: false"],
  [preflightPath, "mutations: false"],
  [preflightPath, "ready_for_guarded_readonly_decision"],
  [decisionPath, "getSupabaseReadonlyDecision"],
  [decisionPath, "supabase_readonly_decision_packet"],
  [decisionPath, "proceed_to_ceo_review"],
  [decisionPath, "ready_for_ceo_decision"],
  [decisionPath, "warningCount"],
  [decisionPath, "boundary.status !== \"ok\""],
  [decisionPath, "scoreSourceRealEnabled: false"],
  [decisionPath, "connectionAttempted: false"],
  [decisionPath, "sqlExecuted: false"],
  [decisionPath, "mutations: false"],
  [executionPreviewPath, "getSupabaseReadonlyExecutionPreview"],
  [executionPreviewPath, "supabase_readonly_execution_preview"],
  [executionPreviewPath, "ready_for_manual_ceo_run"],
  [executionPreviewPath, "readinessPromotionBlocked: true"],
  [executionPreviewPath, "blockedPromotions"],
  [executionPreviewPath, "cp3_readiness"],
  [executionPreviewPath, "public_data_source"],
  [executionPreviewPath, "source_depth_production_ready"],
  [executionPreviewPath, "manualApprovalRequired: true"],
  [executionPreviewPath, "pending_ceo_confirmation"],
  [executionPreviewPath, "manualRunPrerequisites"],
  [executionPreviewPath, "CEO confirms exactly one manual readonly attempt"],
  [executionPreviewPath, "post-run review captures status without secrets or row payloads"],
  [executionPreviewPath, "postRunReviewTarget"],
  [executionPreviewPath, "scripts/check-cp3-supabase-read-only-one-attempt-direct-node-execution-post-run-review.mjs"],
  [executionPreviewPath, "postRunAcceptedOutcomeCategories"],
  [executionPreviewPath, "ok_object_reachability_only"],
  [executionPreviewPath, "blocked_sensitive_output"],
  [executionPreviewPath, "willRunRemoteValidator: false"],
  [executionPreviewPath, "automatedRemoteRun: false"],
  [executionPreviewPath, "scoreSourceRealEnabled: false"],
  [executionPreviewPath, "connectionAttempted: false"],
  [executionPreviewPath, "sqlExecuted: false"],
  [executionPreviewPath, "mutations: false"],
  [executionPreviewPath, "npm run db:readonly-validate"],
  [executionPreviewPath, "stopConditions"],
  [executionPreviewPath, "do not run this preview as approval"],
  [executionPreviewPath, "do not run if confirmation is not process-scoped"],
  [componentPath, "RuntimeReadinessPanel"],
  [componentPath, "Runtime Readiness"],
  [componentPath, "Runtime readiness"],
  [componentPath, "Readonly evidence"],
  [componentPath, "readonlyEvidence.objects.length"],
  [componentPath, "runtime-readiness-command"],
  [componentPath, "runtime-preflight-status"],
  [componentPath, "CEO next move"],
  [componentPath, "automated remote run"],
  [componentPath, "Stop first:"],
  [componentPath, "executionPreview.stopConditions[0]"],
  [componentPath, "CEO decision packet"],
  [componentPath, "decision.recommendedWorkMix"],
  [componentPath, "decision.warningCount"],
  [componentPath, "Execution preview"],
  [componentPath, "Manual approval:"],
  [componentPath, "executionPreview.manualApprovalState"],
  [componentPath, "Manual prerequisites:"],
  [componentPath, "executionPreview.manualRunPrerequisites.length"],
  [componentPath, "Post-run target:"],
  [componentPath, "executionPreview.postRunReviewTarget"],
  [componentPath, "executionPreview.postRunAcceptedOutcomeCategories.length"],
  [componentPath, "Readiness promotion:"],
  [componentPath, "executionPreview.readinessPromotionBlocked"],
  [componentPath, "executionPreview.blockedPromotions.length"],
  [componentPath, "executionPreview.safety.automatedRemoteRun"],
  [componentPath, "executionPreview.nextRemoteCommand"],
  [componentPath, "Stop conditions:"],
  [componentPath, "executionPreview.stopConditions.length"],
  [componentPath, "Local preflight status"],
  [componentPath, "ready for guarded decision"],
  [componentPath, "不得由 UI 或 review gate 自動執行"],
  [componentPath, "遠端唯讀驗證維持 blocked"],
  [componentPath, "CEO 單次手動 gate"],
  [briefingPath, "import { RuntimeReadinessPanel }"],
  [briefingPath, "<RuntimeReadinessPanel />"],
  [cssPath, ".runtime-readiness-panel"],
  [cssPath, ".runtime-readiness-command"],
  [cssPath, ".runtime-preflight-status"],
  [cssPath, ".runtime-readiness-lanes"],
  [cssPath, ".runtime-readiness-score"]
];

const forbidden = [
  [summaryPath, "scoreSource=real approved"],
  [summaryPath, "NEXT_PUBLIC_DATA_SOURCE=supabase"],
  [summaryPath, "DATA_FRESHNESS_SUPABASE_READS=enabled"],
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
