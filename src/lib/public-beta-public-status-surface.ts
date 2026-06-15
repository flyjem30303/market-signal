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
        body: "先用市場總覽、核心分數與風險提示判斷目前市場氣氛，再進一步看原因與資料時間。",
        label: "快速判讀",
        title: "先用 30 秒看懂市場氣氛",
        tone: "active"
      },
      {
        body: "正式每日資料尚未完全啟用；目前為示範資料，資料品質、覆蓋率與更新時間需持續複核。",
        label: "資料邊界",
        title: "資料品質需持續複核",
        tone: "readying"
      },
      {
        body: "會員深度解讀、watchlist 與自訂警示屬於 Phase 2 規劃；Phase 1 先完成公開免費版可用閉環。",
        label: "產品階段",
        title: "會員功能規劃中",
        tone: "blocked"
      }
    ],
    headline: "公開 Beta 使用狀態",
    stopLine: "本網站提供市場資訊整理與風險辨識，不提供個股買賣建議、不保證報酬，也不代替使用者做投資決策。",
    summary: "Phase 1 先讓一般投資者快速理解市場狀態；正式資料、會員功能與個人化警示會在通過資料與產品驗收後逐步開放。"
  };
}
