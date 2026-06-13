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
  const isHighRisk = snapshot.riskScore >= 70;
  const isWatch = snapshot.riskScore >= 55 && snapshot.riskScore < 70;

  return {
    decisionAidGroups: [
      {
        items: ["先看燈號顏色", "再看風險分數", "最後看資料更新時間"],
        label: "30 秒",
        state: "active",
        title: "快速理解目前市場狀態"
      },
      {
        items: ["確認成因", "比較趨勢與波動", "決定是否加強觀察或降低風險"],
        label: "3 分鐘",
        state: riskState,
        title: "把燈號轉成觀察行動"
      },
      {
        items: ["目前仍為示範資料", "正式資料來源尚未完整升級", "不提供個股買賣建議"],
        label: "資料邊界",
        state: "blocked",
        title: "避免把示範燈號當成交易訊號"
      }
    ],
    headline: `${snapshot.asset.symbol} 目前為${snapshot.signal.title}狀態`,
    items: [
      {
        body: isHighRisk
          ? "風險分數偏高，適合先檢查下跌、波動或資料缺漏是否正在擴大。"
          : isWatch
            ? "目前需要觀察，建議留意燈號是否連續轉弱或風險分數升高。"
            : "目前示範燈號偏穩，仍建議搭配更新時間與資料狀態一起閱讀。",
        label: "市場狀態",
        state: riskState,
        value: `${snapshot.signal.title} / ${snapshot.signal.key.toUpperCase()}`
      },
      {
        body:
          warningCount > 0
            ? `目前有 ${warningCount} 個資料提示需要注意，請先確認更新時間、缺漏欄位與資料狀態。`
            : "目前示範資料沒有明顯缺漏提示；正式資料上線前仍不代表完整覆蓋。",
        label: "資料可信度",
        state: warningCount > 0 ? "readying" : "active",
        value: warningCount > 0 ? "需要複核" : "可閱讀"
      },
      {
        body: "這個頁面協助使用者把市場氛圍、風險分數與觀察重點排成順序，不取代個人投資判斷。",
        label: "下一步",
        state: "readying",
        value: "觀察與複核"
      }
    ],
    stopLine: "本頁為市場資訊整理與風險辨識工具，不提供個股買賣建議、不保證報酬，也不代替使用者做投資決策。",
    subhead: "用燈號先判斷市場氛圍，再用分數、成因與更新時間確認是否需要關注、加強觀察或降低風險。"
  };
}
