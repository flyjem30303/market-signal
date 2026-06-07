export type HomeRuntimeActionSummary = {
  blockedTransition: string;
  currentProgressPercent: 72;
  nextAction: "唯讀驗證後公開 Beta 決策";
  nextLift: string;
  safetyStopLine: string;
  stage: string;
};

export function getHomeRuntimeActionSummary(): HomeRuntimeActionSummary {
  return {
    blockedTransition: "正式分數切換",
    currentProgressPercent: 72,
    nextAction: "唯讀驗證後公開 Beta 決策",
    nextLift:
      "把已驗證的後端可讀性轉成資料結構、新鮮度、覆蓋率、資料品質、來源深度與公開解讀檢查；不得因此升級公開資料或正式分數。",
    safetyStopLine:
      "唯讀證據只能輔助審查；公開資料來源與正式分數必須等獨立檢查點通過後才能升級。",
    stage:
      "後端物件可讀性已驗證，但只屬於內部證據。公開版仍使用示範資料；資料匯入、SQL、正式公開資料與正式分數仍被阻擋。"
  };
}
