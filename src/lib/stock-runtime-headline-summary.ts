import type { SignalSnapshot } from "@/lib/signal-model";

export type StockRuntimeHeadlineSummary = {
  decisionAidGroups: Array<{
    items: string[];
    label: string;
    state: "active" | "readying" | "blocked";
    title: string;
  }>;
  headline: string;
  items: Array<{
    body: string;
    label: string;
    state: "active" | "readying" | "blocked";
    value: string;
  }>;
  stopLine: string;
  subhead: string;
};

export function getStockRuntimeHeadlineSummary(snapshot: SignalSnapshot): StockRuntimeHeadlineSummary {
  return {
    decisionAidGroups: [
      {
        items: ["示範分數方向", "風險高低排序", "資料更新狀態說明"],
        label: "現在可參考",
        state: "active",
        title: "適合用來理解相對強弱與風險氛圍"
      },
      {
        items: ["報價與模組細節", "回看樣本與新聞摘要", "同族群比較卡片"],
        label: "輔助閱讀",
        state: "readying",
        title: "可協助理解頁面流程，但不是正式投資證據"
      },
      {
        items: ["即時真實行情宣稱", "正式資料來源", "正式分數與買賣建議"],
        label: "尚未開放",
        state: "blocked",
        title: "需等資料來源、覆蓋率、品質與法務揭露都通過"
      }
    ],
    headline: `${snapshot.asset.symbol} 目前可作為示範訊號閱讀`,
    items: [
      {
        body: "先看燈號、風險方向、資料更新說明與目前停止線，建立 30 秒初判。",
        label: "現在可看",
        state: "active",
        value: "示範訊號可讀"
      },
      {
        body: "正式市場資料、完整覆蓋率、真實分數與買賣建議仍未啟用。",
        label: "仍不可推論",
        state: "blocked",
        value: "正式資料未啟用"
      },
      {
        body: "下一步優先補強解釋、來源深度與資料覆蓋，讓使用者能在 3 分鐘內決定要關注、加強觀察，或先減少風險。",
        label: "下一步",
        state: "readying",
        value: "補強決策輔助"
      }
    ],
    stopLine: "本頁不宣稱正式資料來源、完整資料品質或正式分數已啟用，也不提供投資建議。",
    subhead: "首屏摘要：先說明現在能讀什麼、不能推論什麼，以及下一步補強方向。"
  };
}
