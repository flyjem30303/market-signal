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
        body: "首頁、簡報、週報、個股頁與法務頁都已收斂成一般投資者可閱讀的公開內容，先用 30 秒看懂市場氣氛。",
        label: "公開閱讀",
        title: "核心路由可用",
        tone: "active"
      },
      {
        body: "目前為示範資料，真實資料來源、授權條件與更新流程確認後才會切換；資料品質需持續複核。",
        label: "資料狀態",
        title: "示範資料清楚標示",
        tone: "readying"
      },
      {
        body: "會員功能規劃中，公開版先完成市場總覽、核心指標與風險提示。",
        label: "會員規劃",
        title: "不阻塞公開版",
        tone: "blocked"
      }
    ],
    headline: "公開 Beta 使用狀態：先聚焦可理解的市場總覽",
    stopLine: "正式市場資料尚未啟用；所有頁面維持非投資建議、不提供買賣建議、示範資料與更新時間揭露，避免使用者誤判。",
    summary:
      "目前網站定位是指數狀態儀表站：讓使用者先看懂市場氛圍、關鍵指標與風險提醒，再決定是否深入觀察。"
  };
}
