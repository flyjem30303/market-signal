import fs from "node:fs";

const summaryPath = "src/lib/runtime-readiness-score.ts";
const decisionPath = "src/lib/supabase-readonly-decision.ts";
const executionPreviewPath = "src/lib/supabase-readonly-execution-preview.ts";
const preflightPath = "src/lib/supabase-readonly-local-preflight.ts";
const componentPath = "src/components/runtime-readiness-panel.tsx";
const briefingPath = "src/app/briefing/page.tsx";
const cssPath = "src/app/globals.css";

const files = new Map(
  [summaryPath, decisionPath, executionPreviewPath, preflightPath, componentPath, briefingPath, cssPath].map((file) => [
    file,
    fs.readFileSync(file, "utf8")
  ])
);

const required = [
  [summaryPath, "Runtime 前置可加速，主系統仍維持 mock-only"],
  [summaryPath, "Supabase 唯讀 preflight"],
  [summaryPath, "本地 preflight 可安全執行"],
  [summaryPath, "npm run report:supabase-readonly-preflight"],
  [summaryPath, "npm run db:readonly-validate"],
  [summaryPath, "主資料源不切換、不寫資料"],
  [summaryPath, "正式分數來源"],
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
  [componentPath, "runtime-readiness-command"],
  [componentPath, "runtime-preflight-status"],
  [componentPath, "CEO decision packet"],
  [componentPath, "decision.recommendedWorkMix"],
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
  [componentPath, "目前不在自動 review gate 內執行"],
  [briefingPath, "import { RuntimeReadinessPanel }"],
  [briefingPath, "<RuntimeReadinessPanel />"],
  [cssPath, ".runtime-readiness-panel"],
  [cssPath, ".runtime-readiness-command"],
  [cssPath, ".runtime-preflight-status"],
  [cssPath, ".runtime-readiness-lanes"],
  [cssPath, ".runtime-readiness-score"]
];

const forbidden = [
  [summaryPath, "scoreSource=real"],
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
