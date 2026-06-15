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
        body: "首頁、快報、週報與標的頁會用一致順序呈現市場狀態、風險提示與更新時間。",
        label: "可閱讀",
        title: "公開版流程已可展示",
        tone: "active"
      },
      {
        body: "正式資料仍需合法來源、資料覆蓋率、品質驗證、寫入回讀與復原準備。",
        label: "待完成",
        title: "資料真實化仍在 gate 前",
        tone: "readying"
      },
      {
        body: "目前不宣稱即時真實資料、不提供投資建議，也不把後續功能包裝成已上線能力。",
        label: "不可宣稱",
        title: "維持公開版邊界",
        tone: "blocked"
      }
    ],
    headline: "公開版使用狀態",
    stopLine: "正式資料與進階功能通過 gate 前，前台維持示範模式與非投資建議提示。",
    summary:
      "Phase 1 先讓一般投資者能看懂市場燈號、核心指標與風險提示；資料真實化完成後，才逐步升級公開資料來源。"
  };
}
