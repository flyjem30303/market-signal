import { getHomeRuntimeActionSummary } from "@/lib/home-runtime-action-summary";
import { getPostReadonlyRuntimeState } from "@/lib/post-readonly-runtime-state";
import { getRuntimeGateDecisionBrief } from "@/lib/runtime-gate-decision-brief";

export type RuntimeDecisionSummary = {
  blockedTransition: string;
  currentProgressPercent: 72;
  decisionLabel: "Public Beta decision aid";
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
  const gateBrief = getRuntimeGateDecisionBrief();

  return {
    blockedTransition: action.blockedTransition,
    currentProgressPercent: action.currentProgressPercent,
    decisionLabel: "Public Beta decision aid",
    headline: "唯讀驗證後的公開 Beta 決策是目前主線",
    mode: "runtime_decision_summary",
    nextAction:
      "先完成正式資料升級前檢查：確認資料品質、來源揭露、更新時間、回復機制與公開文案，再決定是否切換正式資料模式。",
    nextLift: action.nextLift,
    publicDataSource: "mock",
    readonlyState: postReadonly.state,
    route: gateBrief.currentDefaultRoute,
    safetyStopLine: action.safetyStopLine,
    scoreSource: "mock",
    stage: action.stage,
    status: "mock_only_runtime_decision_ready",
    subhead:
      "後端物件可讀性已可作為內部證據，但網站仍維持示範資料與示範分數。這是保護使用者理解與法務邊界的必要暫停點。",
    userFacingNow:
      "使用者目前可以閱讀示範訊號方向、風險提示與下一步觀察；正式真實資料與正式分數必須等資料來源、品質與揭露檢查通過後才可啟用。"
  };
}
