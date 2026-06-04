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
    blockedState: "真實市場資料、Supabase 公開資料來源與 scoreSource=real 尚未開放。",
    currentState: "目前公開頁面使用 mock 訊號，適合檢查閱讀流程、狀態揭露與操作導向。",
    headline: "目前是 mock runtime",
    nextStep: "下一步是完成 readonly 後的資料解讀與 post-run review，再決定是否進入更高風險 gate。",
    stopLine: "publicDataSource=mock，scoreSource=mock；不得從目前狀態推論真實資料或正式分數已上線。",
    summary: "公開頁面可以展示 mock 訊號與 freshness metadata，但不能宣稱真實市場資料品質、投資建議或正式分數。"
  };

  if (surface === "stock") {
    return {
      ...shared,
      headline: "標的頁仍是 mock runtime",
      summary: "標的頁可用來閱讀風險方向與產品流程；真實市場資料、來源權利與模型可信度仍需獨立 gate。"
    };
  }

  if (surface === "trust") {
    return {
      ...shared,
      headline: "信任頁揭露 runtime 邊界",
      summary: "此頁說明 mock、readonly、Supabase 與 scoreSource=real 的責任邊界，避免把準備狀態誤讀成正式上線。"
    };
  }

  return shared;
}
