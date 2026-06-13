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
  blockedState:
    "正式資料升級尚未開放。資料來源、覆蓋率、品質檢查與公開揭露都通過後，才會改變公開資料狀態。",
  currentState:
    "公開 Beta 目前使用示範資料，適合用來理解市場氣氛、燈號閱讀方式、資料更新提醒與風險揭露。",
  headline: "公開 Beta 使用邊界",
  nextStep:
    "下一步是確認資料來源權利、覆蓋率與品質；在這些條件完成前，頁面維持示範資料狀態。",
  stopLine:
    "目前不宣稱即時行情、完整覆蓋、正式分數、保證報酬或個別買賣建議。",
  summary:
    "請把燈號視為閱讀與觀察入口。資料可能延遲、缺漏或不完整，模型輸出也不是預測或投資建議。"
};

export function getPublicRuntimeBoundaryCopy(surface: PublicRuntimeBoundarySurface): PublicRuntimeBoundaryCopy {
  if (surface === "stock") {
    return {
      ...shared,
      currentState:
        "標的頁目前是示範資料閱讀介面，價格、分數、更新時間與覆蓋率提醒都只作為決策前的觀察脈絡。",
      headline: "標的頁使用邊界",
      summary:
        "標的分數與行動摘要不代表正式市場資料、完整覆蓋或買賣建議；請搭配成因、更新時間與自身風險承受度判斷。"
    };
  }

  if (surface === "trust") {
    return {
      ...shared,
      currentState:
        "風險聲明、方法說明、隱私、條款與週報頁都應用同一套邊界：示範資料、示範分數、部分覆蓋與非投資建議。",
      headline: "公開信任邊界",
      summary:
        "使用者行動前應先看清資料限制：目前仍是示範狀態，資料覆蓋尚未完整，模型限制與非投資建議必須清楚揭露。"
    };
  }

  return shared;
}
