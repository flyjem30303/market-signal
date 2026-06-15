export type PublicBetaDataReadinessLane = {
  id: string;
  label: string;
  status: "accepted" | "readying" | "blocked";
  summary: string;
};

export type PublicBetaDataReadinessStatus = {
  headline: string;
  lanes: PublicBetaDataReadinessLane[];
  publicDataSource: "mock";
  scoreSource: "mock";
  stopLine: string;
  summary: string;
  upgradeChecks: PublicBetaDataReadinessLane[];
};

export function getPublicBetaDataReadinessStatus(): PublicBetaDataReadinessStatus {
  return {
    headline: "目前資料可用於閱讀流程，尚未切換正式資料",
    lanes: [
      {
        id: "quick-read",
        label: "30 秒可用：市場閱讀",
        status: "accepted",
        summary: "可用來理解市場氣氛、主燈號、今日提醒與指標閱讀順序。"
      },
      {
        id: "equity-demo",
        label: "個股示範覆蓋",
        status: "readying",
        summary: "台股個股示範資料可支撐前台演示；正式上線仍需完成來源權利、品質與回退檢查。"
      },
      {
        id: "not-trading-command",
        label: "不能當成買賣指令",
        status: "blocked",
        summary: "示範分數只用於產品閱讀流程，不代表交易建議。"
      }
    ],
    publicDataSource: "mock",
    scoreSource: "mock",
    stopLine:
      "正式資料尚未啟用；大盤指數與 ETF 的覆蓋、來源權利、品質檢查、寫入回讀與回退說明完成前，不宣稱真實資料上線，也不提供個股買賣建議。",
    summary:
      "目前公開頁以示範資料呈現市場閱讀流程。使用者可以看懂燈號、風險順序與觀察重點，但仍需知道這不是正式市場資料。",
    upgradeChecks: [
      {
        id: "source-terms",
        label: "來源可用條件",
        status: "readying",
        summary: "確認每日收盤價與當日交易資訊來源可合法免費自動化使用與公開展示。"
      },
      {
        id: "field-coverage",
        label: "大盤指數與 ETF 覆蓋",
        status: "readying",
        summary: "補齊大盤指數與 ETF 每日資料缺口，並清楚顯示更新時間與缺漏狀態。"
      },
      {
        id: "fallback-copy",
        label: "回退與公開說明",
        status: "blocked",
        summary: "資料異常時，前台必須清楚說明延遲、缺漏或回退到示範資料。"
      }
    ]
  };
}
