export type PublicBetaIndexDashboardBriefAlert = {
  cause: string;
  impactLevel: "觀察" | "提醒" | "阻塞";
  nextStep: string;
  status: string;
  title: string;
  updatedAt: string;
};

export type PublicBetaIndexDashboardBriefLoop = {
  alerts: PublicBetaIndexDashboardBriefAlert[];
  boundary: {
    publicDataSource: "mock";
    scoreSource: "mock";
  };
  headline: string;
  indicatorPanel: Array<{
    label: string;
    state: string;
    summary: string;
  }>;
  marketOverview: string;
  primaryAction: string;
  secondaryAction: string;
  stopLine: string;
  timeToAction: string;
  timeToUnderstand: string;
};

export function getPublicBetaIndexDashboardBriefLoop(): PublicBetaIndexDashboardBriefLoop {
  return {
    alerts: [
      {
        cause: "TWII runtime 目前只接 synthetic-only consumer wire，尚未通過資料來源與覆蓋率 gate。",
        impactLevel: "觀察",
        nextStep: "先用示範卡理解指標結構，等待資料線完成合法來源與 coverage handoff。",
        status: "可讀示範",
        title: "TWII 市場氛圍示範",
        updatedAt: "mock runtime"
      },
      {
        cause: "publicDataSource 與 scoreSource 都仍保持 mock，避免誤導使用者以為已經上真實資料。",
        impactLevel: "阻塞",
        nextStep: "正式資料 promotion 前，首頁與個股頁都必須繼續顯示資料邊界。",
        status: "真實資料未啟用",
        title: "資料真實化邊界",
        updatedAt: "持續檢查"
      }
    ],
    boundary: {
      publicDataSource: "mock",
      scoreSource: "mock"
    },
    headline: "指數狀態儀表站：先看氣氛，再看原因，最後決定要不要加強觀察",
    indicatorPanel: [
      {
        label: "市場氛圍",
        state: "示範觀察",
        summary: "目前以 mock 訊號演練紅黃綠燈流程，讓使用者先熟悉判讀順序。"
      },
      {
        label: "風險溫度",
        state: "需交叉驗證",
        summary: "風險分數只代表產品模型示範，尚未連到正式資料來源或真實分數。"
      },
      {
        label: "資料可信度",
        state: "資料線建置中",
        summary: "資料支援線正在處理合法免費可自動化來源與覆蓋率補齊前置。"
      }
    ],
    marketOverview:
      "首頁先提供全市場總覽、核心指標面板與警示清單三層視圖，避免使用者直接被表格或工程狀態淹沒。",
    primaryAction: "30 秒內：確認目前是觀察、提醒或阻塞狀態。",
    secondaryAction: "3 分鐘內：查看成因、更新時間、影響級別，決定是否追蹤 TWII、ETF 或個股頁。",
    stopLine:
      "目前仍是 mock 資料與 mock 分數；不代表即時市場資料，不提供買賣建議，也不應被解讀為報酬保證。",
    timeToAction: "3 分鐘形成下一步觀察",
    timeToUnderstand: "30 秒看懂市場氛圍"
  };
}
