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
        body: "首頁、晨報、週報、個股頁、方法說明與風險聲明都可閱讀；使用者可以先用 30 秒看懂市場氣氛，再用 3 分鐘確認觀察順序。",
        label: "公開使用狀態",
        title: "公開頁可用",
        tone: "active"
      },
      {
        body: "目前為示範資料與示範分數，資料品質需持續複核；正式資料、資料來源權利與覆蓋率完成前，不會宣稱真實資料已上線。",
        label: "資料邊界",
        title: "資料品質需持續複核",
        tone: "readying"
      },
      {
        body: "會員功能先以預覽與路線圖呈現；登入、付費、自選追蹤儲存、自訂警示執行與盤後複盤內容屬於會員下一階段。",
        label: "下一階段會員功能",
        title: "會員功能規劃中",
        tone: "blocked"
      }
    ],
    headline: "公開 Beta 使用狀態",
    stopLine: "本網站目前提供市場資訊整理與風險辨識輔助，不提供個股買賣建議、不保證獲利，也不代替使用者做投資決策。",
    summary:
      "目前重點是讓一般投資者快速看懂市場燈號、主要風險與資料更新狀態；會員深度解讀與個人化追蹤會在會員下一階段另行開放。"
  };
}
