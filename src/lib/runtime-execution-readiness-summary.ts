import { getDataReadinessDecisionSummary } from "@/lib/data-readiness-decision-summary";
import { getRowCoverageSecondAttemptReadiness } from "@/lib/row-coverage-second-attempt-readiness";

export type RuntimeExecutionReadinessSummary = {
  allowedEvidence: string[];
  chairBrief: string;
  commandLabel: string;
  decisionQuestion: string;
  mode: "runtime_execution_readiness_summary";
  nextAction: string;
  publicDataSource: "mock";
  scoreSource: "mock";
  state: "ready_for_ceo_oral_decision_not_execution";
  stillBlocked: string[];
  stopLine: string;
};

export function getRuntimeExecutionReadinessSummary(): RuntimeExecutionReadinessSummary {
  const rowCoverage = getRowCoverageSecondAttemptReadiness();
  const dataReadiness = getDataReadinessDecisionSummary();

  return {
    allowedEvidence: [
      "attempt status",
      "aggregate coverage status",
      "observed and expected row counts",
      "missing row count",
      "sanitized blocker reason"
    ],
    chairBrief:
      "Row coverage readonly is locally ready for a CEO oral decision, but it is not execution and it does not connect to Supabase.",
    commandLabel: rowCoverage.commandMap.packageCommand,
    decisionQuestion:
      "Authorize exactly one bounded Supabase readonly row coverage attempt only after immediate local prechecks pass?",
    mode: "runtime_execution_readiness_summary",
    nextAction:
      "Continue mock runtime hardening unless CEO explicitly names one bounded readonly attempt and accepts immediate post-run review.",
    publicDataSource: dataReadiness.safety.publicDataSource,
    scoreSource: dataReadiness.safety.scoreSource,
    state: "ready_for_ceo_oral_decision_not_execution",
    stillBlocked: [
      "publicDataSource=supabase",
      "scoreSource=real",
      "row coverage points",
      "CP3_READY_NOW",
      "investment-grade claims"
    ],
    stopLine:
      "This runtime summary does not execute Supabase, run SQL, write data, fetch market data, print secrets, print row payloads, promote publicDataSource=supabase, award row coverage points, or set scoreSource=real."
  };
}
