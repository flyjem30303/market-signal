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
    headline: "目前資料可以怎麼使用",
    lanes: [
      {
        id: "quick-read",
        label: "30 秒可用",
        status: "accepted",
        summary: "可用來理解市場氣氛、主燈號與今日提醒。"
      },
      {
        id: "review-needed",
        label: "3 分鐘要複核",
        status: "readying",
        summary: "行動判斷前要再看資料狀態、更新時間與風險聲明。"
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
      "正式資料尚未啟用；資料來源權利、欄位與覆蓋率、回退與公開說明完成前，不宣稱真實資料上線，也不提供個股買賣建議。",
    summary:
      "目前公開頁以示範資料呈現市場閱讀流程。使用者可以看懂燈號與風險順序，但仍需知道這不是正式市場資料。",
    upgradeChecks: [
      {
        id: "source-terms",
        label: "來源可用條件",
        status: "readying",
        summary: "確認資料來源是否可合法免費自動化使用與公開展示。"
      },
      {
        id: "field-coverage",
        label: "欄位與覆蓋率",
        status: "readying",
        summary: "確認每日收盤價、成交資訊、更新時間與缺漏狀態足以支撐公開頁。"
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
