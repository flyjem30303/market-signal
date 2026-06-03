import { getHomeRuntimeActionSummary } from "@/lib/home-runtime-action-summary";
import { getPostReadonlyRuntimeState } from "@/lib/post-readonly-runtime-state";
import { getRuntimeGateDecisionBrief } from "@/lib/runtime-gate-decision-brief";

export type RuntimeDecisionSummary = {
  blockedTransition: string;
  currentProgressPercent: 72;
  decisionLabel: "post-readonly runtime decision";
  headline: string;
  mode: "runtime_decision_summary";
  nextAction: string;
  nextLift: string;
  publicDataSource: "mock";
  readonlyState: string;
  route: "post_readonly_runtime_decision";
  safetyStopLine: string;
  scoreSource: "mock";
  stage: string;
  status: "mock_only_runtime_decision_ready";
  subhead: string;
  userFacingNow: string;
};

export function getRuntimeDecisionSummary(): RuntimeDecisionSummary {
  const action = getHomeRuntimeActionSummary();
  const postReadonly = getPostReadonlyRuntimeState();
  const gate = getRuntimeGateDecisionBrief();

  return {
    blockedTransition: action.blockedTransition,
    currentProgressPercent: action.currentProgressPercent,
    decisionLabel: action.nextAction,
    headline: "Post-readonly runtime decision is the active mainline",
    mode: "runtime_decision_summary",
    nextAction: gate.pmNextStep,
    nextLift: action.nextLift,
    publicDataSource: "mock",
    readonlyState: postReadonly.state,
    route: gate.currentDefaultRoute,
    safetyStopLine: action.safetyStopLine,
    scoreSource: "mock",
    stage: action.stage,
    status: "mock_only_runtime_decision_ready",
    subhead:
      "Object reachability is accepted as backend evidence, while public data and real scoring stay behind separate gates.",
    userFacingNow:
      "Users can read mock-only signal direction, disclosure state, and product flow; they cannot treat it as live market-data evidence or investment advice."
  };
}
