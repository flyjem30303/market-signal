import { getHomeRuntimeActionSummary } from "@/lib/home-runtime-action-summary";
import { getPostReadonlyRuntimeState } from "@/lib/post-readonly-runtime-state";
import { getRuntimeGateDecisionBrief } from "@/lib/runtime-gate-decision-brief";

export type RuntimeDecisionSummary = {
  blockedTransition: string;
  currentProgressPercent: 72;
  decisionLabel: "唯讀驗證後公開 Beta 決策";
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
    headline: "唯讀驗證後的公開 Beta 決策是目前主線",
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
      "後端物件可讀性已可作為內部證據；公開資料切換與正式分數仍需通過獨立檢查點。",
    userFacingNow:
      "使用者目前可以閱讀示範訊號方向、揭露狀態與產品流程；這不能視為即時市場資料、正式投資證據或投資建議。"
  };
}
