export type PublicBetaDataRealizationStage = {
  currentState: string;
  id: string;
  label: string;
  nextStep: string;
  publicMeaning: string;
  tone: "active" | "blocked" | "hold";
};

export type PublicBetaDataRealizationRoadmap = {
  disclosure: string;
  headline: string;
  stages: PublicBetaDataRealizationStage[];
  summary: string;
};

export function getPublicBetaDataRealizationRoadmap(): PublicBetaDataRealizationRoadmap {
  return {
    disclosure:
      "目前公開頁仍維持 publicDataSource=mock / scoreSource=mock；正式資料、Supabase 寫入、ingestion/backfill 與 scoreSource=real 尚未啟用。",
    headline: "資料真實化路徑",
    stages: [
      {
        currentState: "TWII 與少量 ETF / 個股已有 mock 展示；完整上市公司 universe 尚未完成。",
        id: "coverage-universe",
        label: "覆蓋範圍",
        nextStep: "先鎖定 TWII、ETF、核心權值股與板塊，建立分批補齊順序。",
        publicMeaning: "使用者需要知道目前看得到哪些市場與標的，避免誤以為已覆蓋全部台股。",
        tone: "hold"
      },
      {
        currentState: "來源權利與公開引用規則仍需逐項確認。",
        id: "source-rights",
        label: "來源與權利",
        nextStep: "保留來源狀態與引用邊界，未確認前不宣稱正式資料服務。",
        publicMeaning: "資料可信度不只看數字，也要知道來源是否能公開展示。",
        tone: "blocked"
      },
      {
        currentState: "Supabase 專案與資料表已進入準備，但公開 runtime 仍不讀寫正式資料。",
        id: "supabase-readiness",
        label: "資料庫就緒",
        nextStep: "完成 readonly / write path gate 後，才進入正式資料 promotion。",
        publicMeaning: "資料庫準備中不等於真實分數已上線，公開頁需明確標示 mock 邊界。",
        tone: "hold"
      },
      {
        currentState: "ingestion / backfill 仍在設計與安全檢查階段。",
        id: "ingestion-backfill",
        label: "匯入與回補",
        nextStep: "先建立可重跑、可驗證、可回退的流程，再補歷史資料。",
        publicMeaning: "更新時間、缺漏資料與回補狀態會影響使用者是否能信任警示。",
        tone: "hold"
      },
      {
        currentState: "公開頁仍使用 mock score，不提供 real-time 或 real score 宣稱。",
        id: "runtime-promotion",
        label: "Runtime promotion",
        nextStep: "資料覆蓋、品質、來源權利與法務揭露通過後，才允許升級到 real。",
        publicMeaning: "使用者可以先理解產品，但不能把目前燈號當正式投資訊號。",
        tone: "blocked"
      }
    ],
    summary:
      "第二階段的核心不是一次補完所有資料，而是把覆蓋範圍、來源權利、資料庫、匯入回補與 runtime promotion 做成可追蹤閉環。"
  };
}
