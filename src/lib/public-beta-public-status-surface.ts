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
        body: "使用者可以用 30 秒先看紅黃綠燈號、市場氣氛快讀與主要風險提示，再決定是否進一步觀察。",
        label: "市場氣氛快讀",
        title: "免費公開頁先服務所有使用者",
        tone: "active"
      },
      {
        body: "目前使用示範資料與示範分數；正式資料來源、資料品質與覆蓋率通過前，所有判讀都需要複核。",
        label: "資料狀態需複核",
        title: "正式資料來源尚未升級",
        tone: "readying"
      },
      {
        body: "會員深度解讀、watchlist、自訂警示與盤後複盤屬於第二階段，現在只揭露路線，不開放會員入口。",
        label: "會員功能下一階段",
        title: "會員深度解讀先列為路線圖",
        tone: "blocked"
      }
    ],
    headline: "目前公開使用狀態：第一階段先完成所有人可用的指數燈號",
    stopLine: "本網站目前不提供買賣建議，也不提供個股買賣建議；正式資料來源升級前，請把燈號視為市場觀察輔助。",
    summary:
      "第一階段先讓使用者可以用 30 秒理解市場氣氛，並用 3 分鐘確認資料狀態、風險提示與下一步觀察。第二階段才推進會員深度解讀與個人化追蹤。"
  };
}
