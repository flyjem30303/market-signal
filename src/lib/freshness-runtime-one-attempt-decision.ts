import { getFreshnessRuntimeReadinessContract } from "@/lib/freshness-runtime-readiness-contract";

export type FreshnessRuntimeOneAttemptDecision = {
  approvalState: "requires_explicit_ceo_named_attempt";
  canExecuteAutomatically: false;
  displayCommandLabel: string;
  displayHeadline: string;
  displayNextAction: string;
  displayRollbackLabel: string;
  displayRollbackLine: string;
  displayStatus: string;
  displayStopLine: string;
  executionCommand: string;
  mode: "freshness_runtime_one_attempt_decision";
  nextAction: string;
  preRunChecks: string[];
  publicDataSource: "mock";
  rollbackTarget: {
    dataFreshnessSource: "mock";
    nextPublicDataSource: "mock";
    supabaseRuntimeReads: "disabled";
  };
  scoreSource: "mock";
  status: "ready_for_explicit_one_attempt_request";
  stopLine: string;
};

export function getFreshnessRuntimeOneAttemptDecision(): FreshnessRuntimeOneAttemptDecision {
  const readiness = getFreshnessRuntimeReadinessContract();

  return {
    approvalState: "requires_explicit_ceo_named_attempt",
    canExecuteAutomatically: false,
    displayCommandLabel: "遠端唯讀命令已保留，尚未執行",
    displayHeadline: "必須由 CEO 明確點名一次，才可做 bounded readonly attempt。",
    displayNextAction: "同一切片先完成本機預檢；若 CEO 未明確點名，就維持 mock 與 disabled。",
    displayRollbackLabel: "回復目標維持 mock / disabled",
    displayRollbackLine: "讀取關閉，公開資料來源維持 mock，評分來源也維持 mock。",
    displayStatus: "等待一次性明確授權",
    displayStopLine: "這張卡不會執行 runner、不會連線 Supabase、不會跑 SQL、不會寫資料，也不會升級公開來源或真實評分。",
    executionCommand:
      "DATA_FRESHNESS_SOURCE=supabase DATA_FRESHNESS_SUPABASE_READS=enabled NEXT_PUBLIC_DATA_SOURCE=mock FRESHNESS_RUNTIME_READ_ONCE_CONFIRMATION=CEO_APPROVED_ONE_READ_ONLY_FRESHNESS_RUNTIME_ATTEMPT node scripts/run-freshness-runtime-read-once.mjs",
    mode: "freshness_runtime_one_attempt_decision",
    nextAction:
      "CEO may explicitly name exactly one process-only freshness runtime read attempt after pre-run checks pass in the same slice.",
    preRunChecks: readiness.prechecks.map((precheck) => precheck.command),
    publicDataSource: "mock",
    rollbackTarget: readiness.baselineEnvironment,
    scoreSource: "mock",
    status: "ready_for_explicit_one_attempt_request",
    stopLine:
      "This decision card does not execute the runner, does not connect to Supabase, does not run SQL, does not write data, does not promote publicDataSource=supabase, and does not set scoreSource=real."
  };
}
