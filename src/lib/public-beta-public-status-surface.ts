export type PublicBetaPublicStatusSurfaceCard = {
  body: string;
  label: string;
  tone: "active" | "readying" | "blocked";
  title: string;
};

export type PublicBetaPublicStatusSurface = {
  cards: PublicBetaPublicStatusSurfaceCard[];
  headline: string;
  stopLine: string;
  summary: string;
};

export function getPublicBetaPublicStatusSurface(): PublicBetaPublicStatusSurface {
  return {
    cards: [
      {
        body: "可以用 30 秒先看市場偏多、觀望、警戒或高風險，再用核心指標與警示提醒決定是否加強觀察。",
        label: "可以使用",
        title: "市場氣氛快讀",
        tone: "active"
      },
      {
        body: "目前仍是示範資料與示範分數；正式資料來源、完整覆蓋率與更新流程完成前，請把燈號當成閱讀線索。",
        label: "需要保守",
        title: "資料狀態需複核",
        tone: "readying"
      },
      {
        body: "會員深度解讀、watchlist、自訂警示與盤後複盤屬於下一階段；目前先完成所有人都能使用的公開總覽。",
        label: "尚未提供",
        title: "會員功能下一階段",
        tone: "blocked"
      }
    ],
    headline: "目前公開使用狀態",
    stopLine: "本網站提供市場資訊整理、風險辨識與觀察輔助；不提供買賣建議、保證報酬或個人化投資建議。",
    summary:
      "公開 Beta 可用來快速理解市場燈號、核心指標、風險提示與資料更新時間。真實資料與會員功能會在後續條件成熟後再逐步開放。"
  };
}
