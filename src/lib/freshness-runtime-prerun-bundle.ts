import { getFreshnessRuntimeOneAttemptDecision } from "@/lib/freshness-runtime-one-attempt-decision";

export type FreshnessRuntimePreRunBundle = {
  automaticRemoteExecution: false;
  displayFinalGate: string;
  displayHeadline: string;
  displayImmediateChecksLabel: string;
  displayNextAction: string;
  displaySourceLine: string;
  displayStatus: string;
  displayStopLine: string;
  finalProjectGate: "node scripts/check-review-gates.mjs";
  immediateLocalChecks: string[];
  mode: "freshness_runtime_prerun_bundle";
  nextAction: string;
  oneAttemptStatus: "ready_for_explicit_one_attempt_request";
  publicDataSource: "mock";
  scoreSource: "mock";
  status: "ready_for_same_slice_pre_run_checks";
  stopLine: string;
};

export function getFreshnessRuntimePreRunBundle(): FreshnessRuntimePreRunBundle {
  const decision = getFreshnessRuntimeOneAttemptDecision();

  return {
    automaticRemoteExecution: false,
    displayFinalGate: "最後仍需通過完整 review gate",
    displayHeadline: "新鮮度遠端讀取前，必須先完成同一批本機預檢",
    displayImmediateChecksLabel: "5 項本機預檢",
    displayNextAction:
      "先完成本機預檢與完整專案檢查，再等待 CEO 另外明確點名一次唯讀新鮮度嘗試。",
    displaySourceLine: "公開資料來源與評分來源都維持 mock；不會因預檢而升級。",
    displayStatus: "本機預檢就緒，遠端執行尚未授權",
    displayStopLine:
      "這組預檢不會執行 runner、不會連線 Supabase、不會跑 SQL、不會寫入資料，也不會升級公開資料來源或真實評分來源。",
    finalProjectGate: "node scripts/check-review-gates.mjs",
    immediateLocalChecks: [
      "node scripts/check-freshness-runtime-readiness-contract.mjs",
      "node scripts/check-freshness-runtime-one-attempt-decision.mjs",
      "node scripts/check-cp3-freshness-runtime-wrapper-local-smoke.mjs",
      "node scripts/check-cp3-freshness-runtime-read-once-guarded-runner.mjs",
      "node scripts/check-freshness-runtime-read-once-pre-remote-behavior.mjs"
    ],
    mode: "freshness_runtime_prerun_bundle",
    nextAction:
      "Run the immediate local checks and the final project gate in the same slice before any separately named one-attempt freshness runtime read.",
    oneAttemptStatus: decision.status,
    publicDataSource: "mock",
    scoreSource: "mock",
    status: "ready_for_same_slice_pre_run_checks",
    stopLine:
      "The pre-run bundle does not execute the runner, does not connect to Supabase, does not run SQL, does not write data, does not promote publicDataSource=supabase, and does not set scoreSource=real."
  };
}
