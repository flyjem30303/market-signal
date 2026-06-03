import { getFreshnessRuntimeReadinessContract } from "@/lib/freshness-runtime-readiness-contract";

export type FreshnessRuntimeOneAttemptDecision = {
  approvalState: "requires_explicit_ceo_named_attempt";
  canExecuteAutomatically: false;
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
