export type PublicBetaUsableLoopContext = "home" | "briefing" | "stock";

export type PublicBetaUsableLoopCard = {
  body: string;
  id: string;
  label: string;
  title: string;
  tone: "active" | "readying" | "blocked";
};

export type PublicBetaUsableLoop = {
  actionCards: PublicBetaUsableLoopCard[];
  boundaryCards: PublicBetaUsableLoopCard[];
  context: PublicBetaUsableLoopContext;
  contextLine: string;
  headline: string;
  stopLine: string;
  summary: string;
};

export function getPublicBetaUsableLoop(
  context: PublicBetaUsableLoopContext,
  stockSymbol = "TWII"
): PublicBetaUsableLoop {
  const contextLine =
    context === "stock"
      ? `${stockSymbol} 頁先協助使用者看懂標的燈號、主要成因、更新時間與資料邊界。`
      : context === "briefing"
        ? "今日簡報把市場氣氛、風險集中度、警示清單與資料限制放在同一個閱讀流程。"
        : "首頁先回答市場現在偏多、觀望、警戒或高風險，再引導使用者確認原因與下一步觀察。";

  return {
    actionCards: [
      {
        body: "先看市場或標的目前是偏多、觀望、警戒或高風險，再決定是否需要打開更多細節。",
        id: "thirty-second-market-mood",
        label: "30 秒",
        title: "看懂市場氛圍",
        tone: "active"
      },
      {
        body: "再檢查成因、主要風險、更新時間與資料邊界，形成觀察、複核或降低風險的行動。",
        id: "three-minute-action-judgement",
        label: "3 分鐘",
        title: "形成觀察行動",
        tone: "readying"
      },
      {
        body: "若資料標示為示範資料、延遲或狀態不明，先確認資料限制，不把燈號當成交易指令。",
        id: "source-boundary-confirmation",
        label: "資料邊界",
        title: "先確認資料限制",
        tone: "blocked"
      }
    ],
    boundaryCards: [
      {
        body: "現在可用的是公開 Beta 閱讀閉環：市場總覽、核心指標、風險提示、更新時間與下一步觀察。",
        id: "usable-now",
        label: "現在可用",
        title: "公開 Beta 閱讀閉環",
        tone: "active"
      },
      {
        body: "真實資料升級前，公開頁維持示範資料與示範分數，並清楚標示資料來源、更新時間與可能延遲。",
        id: "not-yet-real",
        label: "資料狀態",
        title: "真實資料升級前維持保守標示",
        tone: "readying"
      },
      {
        body: "本網站只提供市場資訊整理、風險辨識與觀察輔助，不提供買賣建議、不保證報酬。",
        id: "never-advice",
        label: "使用邊界",
        title: "不是投資建議",
        tone: "blocked"
      }
    ],
    context,
    contextLine,
    headline: "公開 Beta 可用閉環",
    stopLine: "若資料來源、更新時間或風險提示不清楚，請先暫停解讀，改看風險揭露與方法說明。",
    summary: "用 30 秒看懂市場氛圍，再用 3 分鐘複核成因、風險、更新時間與下一步觀察。"
  };
}
