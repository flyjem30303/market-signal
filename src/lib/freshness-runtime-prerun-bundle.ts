import { getFreshnessRuntimeOneAttemptDecision } from "@/lib/freshness-runtime-one-attempt-decision";

export type FreshnessRuntimePreRunBundle = {
  automaticRemoteExecution: false;
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
