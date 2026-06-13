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
        body: "首頁、簡報與個股頁先服務一般投資者，可以用 30 秒完成市場氣氛快讀，知道主要風險與下一步觀察順序。",
        label: "目前公開使用狀態",
        title: "免費市場總覽優先",
        tone: "active"
      },
      {
        body: "正式資料上線前，頁面會清楚標示目前資料狀態、更新時間、可能延遲與使用邊界；示範資料與示範分數不等於正式行情。",
        label: "資料可信度",
        title: "資料狀態需複核",
        tone: "readying"
      },
      {
        body: "會員深度解讀、watchlist、自訂警示與盤後複盤會放在下一階段；現在先完成所有人可使用的公開頁閉環。",
        label: "會員功能下一階段",
        title: "會員功能不拖慢公開 Beta",
        tone: "blocked"
      }
    ],
    headline: "公開 Beta 先把所有人可用的市場總覽做好",
    stopLine: "本站不提供個股買賣建議、不保證報酬，也不代替使用者做投資決策。",
    summary:
      "目前產品重點是讓一般投資者在 30 秒內看懂市場狀態，並在 3 分鐘內完成關注、加強觀察或降低風險的判斷。"
  };
}
