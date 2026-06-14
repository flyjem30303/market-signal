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
        body: "首頁、簡報與個股頁會先用示範資料呈現燈號、成因與更新時間，讓使用者能先建立固定的市場觀察流程。",
        label: "市場燈號閱讀",
        title: "先用 30 秒看懂市場氣氛",
        tone: "active"
      },
      {
        body: "正式市場資料尚未啟用前，頁面會清楚標示示範資料、更新狀態與資料邊界，避免把測試內容誤認成即時行情。",
        label: "資料品質",
        title: "資料品質需持續複核",
        tone: "readying"
      },
      {
        body: "下一階段會把每日三層解讀、watchlist、自訂警示與盤後複盤整理成會員功能，但不提供個股買賣建議。",
        label: "會員功能",
        title: "會員功能規劃中",
        tone: "blocked"
      }
    ],
    headline: "公開 Beta 使用狀態",
    stopLine: "目前為示範資料與產品流程驗證，不提供買賣建議；正式資料來源、更新頻率與會員功能通過檢查後才會逐步開放。",
    summary:
      "這個區塊說明目前公開網站能提供什麼、哪些資料仍在驗證，以及使用者應如何理解燈號。目標是降低資訊理解門檻，同時保留清楚的資料與風險邊界。"
  };
}
