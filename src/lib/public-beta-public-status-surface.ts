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
        body:
          "首頁會先呈現市場總覽、核心分數與風險提示，讓使用者快速知道目前偏多、觀望、警戒或高風險。",
        label: "快速判讀",
        title: "先用 30 秒看懂市場氣氛",
        tone: "active"
      },
      {
        body:
          "正式每日資料尚未全面啟用前，前台維持示範資料與清楚標示；資料品質、覆蓋率與更新時間需持續複核。",
        label: "資料邊界",
        title: "資料品質需持續複核",
        tone: "readying"
      },
      {
        body:
          "會員深度解讀、自選追蹤與自訂警示屬於 Phase 2 規劃；Phase 1 先完成公開免費版可用閉環。",
        label: "產品階段",
        title: "會員功能規劃中",
        tone: "blocked"
      }
    ],
    headline: "公開 Beta 使用狀態",
    stopLine: "本網站提供市場資訊整理與風險觀察，不構成投資建議，也不保證任何投資結果。",
    summary:
      "Phase 1 目標是讓一般投資者能看懂市場燈號、核心指標與風險提示；正式資料與會員功能會在資料權利、覆蓋率與品質門檻通過後再開放。"
  };
}
