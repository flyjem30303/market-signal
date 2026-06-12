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
        cause:
          "TWII 目前只接到 synthetic-only mock runtime，用來驗證市場氛圍閱讀流程；正式資料來源與覆蓋率仍未升級。",
        impactLevel: "中",
        nextStep: "先看大盤、ETF、上市個股哪一層仍在檢查，再回到晨報確認成因與更新時間。",
        status: "觀察",
        title: "TWII 市場氛圍仍是示範狀態",
        updatedAt: "mock runtime"
      },
      {
        cause:
          "publicDataSource 與 scoreSource 仍維持 mock，避免使用者把示範燈號誤認為即時行情或正式投資訊號。",
        impactLevel: "低",
        nextStep: "正式資料上線前，僅把燈號當成觀察入口，不作為買賣建議或保證報酬依據。",
        status: "邊界",
        title: "資料與分數仍維持 mock",
        updatedAt: "持續檢查"
      }
    ],
    boundary: {
      publicDataSource: "mock",
      scoreSource: "mock"
    },
    headline: "30 秒看懂市場氣氛，3 分鐘形成下一步觀察",
    indicatorPanel: [
      {
        label: "市場氛圍",
        state: "示範觀察",
        summary: "用紅黃綠燈與核心指標先判斷今天偏向正向、觀察或防守。"
      },
      {
        label: "風險焦點",
        state: "需要複核",
        summary: "風險分數只協助排序注意力，仍需搭配成因、更新時間與資料狀態。"
      },
      {
        label: "資料可信度",
        state: "mock 邊界",
        summary: "目前先展示閱讀流程；來源權利、覆蓋品質與正式更新節奏仍在檢查。"
      }
    ],
    marketOverview:
      "首頁把全市場總覽、核心指標與警示清單放在同一條路徑，讓一般投資者先理解市場氣氛，再決定要關注、加強觀察或減少風險。",
    primaryAction: "30 秒內：先判斷目前市場偏向正向、觀察或防守。",
    secondaryAction: "3 分鐘內：再看警示成因、更新時間、影響級別與下一步觀察。",
    stopLine:
      "目前仍是 mock-only 公開 Beta，不宣稱即時真實資料、不宣稱完整覆蓋、不提供買賣建議，也不保證任何投資結果。",
    timeToAction: "3 分鐘形成下一步觀察",
    timeToUnderstand: "30 秒看懂市場氛圍"
  };
}
