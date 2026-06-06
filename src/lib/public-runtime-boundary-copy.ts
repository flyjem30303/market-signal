export type PublicRuntimeBoundarySurface = "home" | "stock" | "trust";

export type PublicRuntimeBoundaryCopy = {
  blockedState: string;
  currentState: string;
  headline: string;
  nextStep: string;
  stopLine: string;
  summary: string;
};

export function getPublicRuntimeBoundaryCopy(surface: PublicRuntimeBoundarySurface): PublicRuntimeBoundaryCopy {
  const shared: PublicRuntimeBoundaryCopy = {
    blockedState:
      "尚未啟用真實公開資料、真實分數、完整覆蓋率或投資建議。若資料缺值、延遲或尚未通過審核，頁面只能顯示 mock 狀態或降級說明。",
    currentState:
      "目前公開網站仍是 mock-only：可以用來理解產品流程、風險閱讀方式與揭露位置，但不能視為即時市場資料或正式投資訊號。",
    headline: "公開狀態：mock-only",
    nextStep:
      "下一步必須等 PM 接受 runtime promotion gate、來源權利、資料新鮮度、覆蓋率與模型限制文案後，才可討論公開真實資料或真實分數。",
    stopLine:
      "publicDataSource=mock; scoreSource=mock. 不得宣稱真實資料已上線、不得宣稱 scoreSource=real、不得提供個人化投資建議。",
    summary:
      "使用者現在看到的是 mock 訊號與 freshness metadata 的可讀展示；資料來源、覆蓋率、缺值/延遲與模型分數仍需保留限制說明。"
  };

  if (surface === "stock") {
    return {
      ...shared,
      headline: "個股頁公開狀態：mock-only",
      summary:
        "個股頁可協助閱讀 mock 分數、風險方向、缺值/延遲提示與模型限制。這不是即時行情、完整覆蓋率或買賣建議。",
      currentState:
        "目前個股訊號仍由 mock 狀態支撐；freshness metadata 只說明資料狀態可讀，不代表真實市場資料品質或真實分數已核准。"
    };
  }

  if (surface === "trust") {
    return {
      ...shared,
      headline: "信任揭露：mock-only 邊界",
      summary:
        "法律、方法論、隱私與條款頁必須清楚說明：目前公開資料與分數仍是 mock，任何真實來源、資料新鮮度、覆蓋率、延遲資料與模型限制都要等 gate 後才能改寫。",
      currentState:
        "這些揭露頁的任務是讓使用者知道限制：資訊僅供理解產品與市場訊號閱讀，不構成投資建議，也不保證資料完整或即時。"
    };
  }

  return shared;
}
