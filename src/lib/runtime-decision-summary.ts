import { getHomeRuntimeActionSummary } from "@/lib/home-runtime-action-summary";
import { getPostReadonlyRuntimeState } from "@/lib/post-readonly-runtime-state";

export type RuntimeDecisionSummary = {
  blockedTransition: string;
  currentProgressPercent: 72;
  decisionLabel: "補強公開 Beta 決策輔助";
  headline: string;
  mode: "runtime_decision_summary";
  nextAction: string;
  nextLift: string;
  publicDataSource: "mock";
  readonlyState: string;
  route: "public_beta_decision_aid";
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

  return {
    blockedTransition: action.blockedTransition,
    currentProgressPercent: action.currentProgressPercent,
    decisionLabel: action.nextAction,
    headline: "公開 Beta 儀表站正在補強可行動解讀",
    mode: "runtime_decision_summary",
    nextAction: "優先把燈號成因、更新時間、影響級別與下一步觀察動作放進主要閱讀路徑。",
    nextLift: action.nextLift,
    publicDataSource: "mock",
    readonlyState: postReadonly.state,
    route: "public_beta_decision_aid",
    safetyStopLine: action.safetyStopLine,
    scoreSource: "mock",
    stage: action.stage,
    status: "mock_only_runtime_decision_ready",
    subhead: "目前先讓使用者看懂市場氛圍與限制；正式資料升級仍需另行通過資料與揭露檢查。",
    userFacingNow: "使用者可以把本頁當作示範儀表站，快速理解風險方向、觀察重點與資料限制。"
  };
}
