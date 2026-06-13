export type PublicBetaIndexDashboardBriefAlert = {
  cause: string;
  impactLevel: "低" | "中" | "高";
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
        cause: "市場氣氛、ETF 方向與風險標的需要放在同一條閱讀路徑中確認。",
        impactLevel: "中",
        nextStep: "先看市場晨報，再確認 ETF 與主要風險標的是否同向。",
        status: "觀察",
        title: "市場氣氛需要交叉確認",
        updatedAt: "示範更新"
      },
      {
        cause: "正式市場資料尚未啟用，分數只能用來示範閱讀順序。",
        impactLevel: "低",
        nextStep: "閱讀資料狀態與風險聲明，不把示範分數當成交易依據。",
        status: "資料提醒",
        title: "示範資料仍需保守解讀",
        updatedAt: "示範更新"
      }
    ],
    boundary: {
      publicDataSource: "mock",
      scoreSource: "mock"
    },
    headline: "30 秒可讀，3 分鐘可行動的指數狀態儀表站",
    indicatorPanel: [
      {
        label: "市場氣氛",
        state: "示範觀察",
        summary: "用紅黃綠燈先理解市場偏強、觀察或偏防守。"
      },
      {
        label: "核心指標",
        state: "快速摘要",
        summary: "把健康分數、風險分數與資料品質合併成可閱讀的判斷順序。"
      },
      {
        label: "警示清單",
        state: "下一步觀察",
        summary: "每則提醒都保留狀態、成因、更新時間、影響級別與下一步。"
      }
    ],
    marketOverview:
      "首頁包含三層視圖：全市場總覽、核心指標面板、警示清單。使用者先看市場氛圍，再看成因與資料狀態。",
    primaryAction: "30 秒可讀：先判斷市場氣氛。",
    secondaryAction: "3 分鐘可行動：再決定是否關注、加強觀察或降低風險。",
    stopLine: "目前是公開 Beta 示範資料，不提供個股買賣建議，也不宣稱即時或完整市場資料。",
    timeToAction: "3 分鐘可行動",
    timeToUnderstand: "30 秒可讀"
  };
}
