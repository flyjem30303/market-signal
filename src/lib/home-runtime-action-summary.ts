export type HomeRuntimeActionSummary = {
  blockedTransition: string;
  currentProgressPercent: 72;
  nextAction: "補強公開 Beta 決策輔助";
  nextLift: string;
  safetyStopLine: string;
  stage: string;
};

export function getHomeRuntimeActionSummary(): HomeRuntimeActionSummary {
  return {
    blockedTransition: "正式資料與正式分數尚未啟用",
    currentProgressPercent: 72,
    nextAction: "補強公開 Beta 決策輔助",
    nextLift:
      "把市場狀態、成因、更新時間、影響級別與下一步觀察動作整理成使用者能快速理解的閱讀路徑。",
    safetyStopLine:
      "在資料來源、覆蓋率、品質檢查、回讀與揭露都通過前，公開頁只能呈現示範資料與非投資建議。",
    stage:
      "目前主線從純資料閉環推進到公開 Beta 可用閉環：資料仍是 mock，產品重點是讓使用者看懂狀態、風險與限制。"
  };
}
