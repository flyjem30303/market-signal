export type PublicRuntimeBoundarySurface = "home" | "stock" | "trust";

export type PublicRuntimeBoundaryCopy = {
  blockedState: string;
  currentState: string;
  headline: string;
  nextStep: string;
  stopLine: string;
  summary: string;
};

const shared: PublicRuntimeBoundaryCopy = {
  blockedState: "正式資料升級尚未開放；正式資料升級前，不會宣稱即時行情、保證準確或投資建議。",
  currentState: "公開 Beta 目前使用示範資料與 mock score，讓使用者先理解燈號閱讀方式。",
  headline: "公開資料邊界",
  nextStep: "正式資料來源、覆蓋率與品質通過後，才會進入正式資料升級審核。",
  stopLine: "本網站提供市場資訊整理與風險辨識，模型輸出也不是預測或投資建議。",
  summary: "公開頁先維持清楚揭露：資料來源仍是示範模式，分數仍是 mock，使用者可用來熟悉決策流程。"
};

export function getPublicRuntimeBoundaryCopy(surface: PublicRuntimeBoundarySurface): PublicRuntimeBoundaryCopy {
  if (surface === "stock") {
    return {
      ...shared,
      headline: "標的頁資料邊界",
      currentState: "標的燈號目前使用示範資料與 mock score，適合檢查閱讀流程與資訊層級。",
      summary: "標的頁會顯示狀態、原因與更新時間，但正式資料升級前仍不可視為真實投資訊號。"
    };
  }

  if (surface === "trust") {
    return {
      ...shared,
      headline: "信任與風險揭露",
      currentState: "條款、方法論與免責頁維持一致邊界：示範資料、非投資建議、延遲與錯誤需明確揭露。",
      summary: "這些頁面用來確保使用者知道網站定位是資訊整理與風險辨識，而不是交易建議。"
    };
  }

  return shared;
}
