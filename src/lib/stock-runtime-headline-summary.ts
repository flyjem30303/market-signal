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
  const warningCount = snapshot.missingModuleFlags.length + snapshot.staleDataFlags.length;
  const riskState = snapshot.riskScore >= 70 ? "blocked" : snapshot.riskScore >= 55 ? "readying" : "active";

  return {
    decisionAidGroups: [
      {
        items: ["先看燈號與風險方向", "再確認資料更新時間", "最後回到市場晨報交叉檢查"],
        label: "30 秒閱讀",
        state: "active",
        title: "先建立標的狀態初判"
      },
      {
        items: ["拆解成因", "確認影響級別", "決定關注、加強觀察或先降低風險"],
        label: "3 分鐘判斷",
        state: riskState,
        title: "把分數轉成觀察動作"
      },
      {
        items: ["正式資料尚未啟用", "完整覆蓋率尚未宣稱", "不提供買賣建議"],
        label: "停止線",
        state: "blocked",
        title: "示範資料不能放大成交易結論"
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
        body:
          warningCount > 0
            ? `目前有 ${warningCount} 個資料旗標，請先把所有分數視為示範閱讀。`
            : "正式市場資料、完整覆蓋率、真實分數與買賣建議仍未啟用。",
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
