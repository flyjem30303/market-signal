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
        label: "30 秒可理解",
        status: "accepted",
        summary: "首頁與市場快報已能讓使用者快速看懂燈號、風險與下一步觀察。"
      },
      {
        id: "listed-stock-demo",
        label: "上市股票日收盤價",
        status: "readying",
        summary: "資料覆蓋已可作為內部證據；公開切換仍需資料品質、來源揭露與回復機制審核。"
      },
      {
        id: "not-trading-command",
        label: "非交易指令",
        status: "blocked",
        summary: "燈號與分數只作資訊整理與風險辨識，不是買賣建議。"
      }
    ],
    publicDataSource: "mock",
    scoreSource: "mock",
    stopLine:
      "正式資料升級前，公開頁仍維持示範資料與示範分數；不可宣稱即時真實資料、保證準確或投資建議。",
    summary:
      "公開頁已能支援 BRIEF 的第一層目標：讓使用者快速理解市場狀態。下一步是把資料來源、更新時間、品質與降級說明整理到可公開切換的審核狀態。",
    upgradeChecks: [
      {
        id: "source-terms",
        label: "來源條件",
        status: "readying",
        summary: "資料來源必須可驗證、可追溯，並符合公開使用條件。"
      },
      {
        id: "field-coverage",
        label: "欄位與覆蓋",
        status: "readying",
        summary: "台股大盤與上市股票日收盤價是目前主範圍；ETF 全量覆蓋延後處理。"
      },
      {
        id: "fallback-copy",
        label: "錯誤與降級文案",
        status: "blocked",
        summary: "資料未更新或異常時，前台必須清楚顯示，不讓使用者誤判。"
      }
    ]
  };
}
