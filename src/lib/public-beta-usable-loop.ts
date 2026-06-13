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
      ? `${stockSymbol} 目前用 mock 資料展示讀法，請先看燈號、風險分數與資料時間，再決定是否加強觀察。`
      : context === "briefing"
        ? "盤面簡報把市場總覽、警示清單與資料邊界放在同一條閱讀路徑，協助使用者快速建立今日觀察順序。"
        : "首頁先提供全市場燈號、核心指標與資料更新狀態，讓使用者在短時間內知道市場偏多、觀望或警戒。";

  return {
    actionCards: [
      {
        body: "先看市場或標的目前是偏多、觀望、警戒或高風險，不需要先讀完整技術細節。",
        id: "thirty-second-market-mood",
        label: "30 秒",
        title: "看懂目前狀態",
        tone: "active"
      },
      {
        body: "再看風險來源、資料時間與下一步觀察重點，判斷是持續關注、加強觀察，還是降低風險暴露。",
        id: "three-minute-action-judgement",
        label: "3 分鐘",
        title: "形成觀察判斷",
        tone: "readying"
      },
      {
        body: "目前仍是公開 Beta 示範資料，不宣稱即時行情，也不把分數當成買賣建議。",
        id: "mock-boundary-confirmation",
        label: "資料邊界",
        title: "確認可用範圍",
        tone: "blocked"
      }
    ],
    boundaryCards: [
      {
        body: "免費頁面提供市場總覽、核心指標、主要風險提示與更新時間，適合建立每日觀察流程。",
        id: "usable-now",
        label: "現在可用",
        title: "公開市場總覽",
        tone: "active"
      },
      {
        body: "真實資料、完整覆蓋率與正式分數需等資料來源權利、欄位契約、回補與正式升級檢查都通過後才會啟用。",
        id: "not-yet-real",
        label: "尚未啟用",
        title: "正式資料升級",
        tone: "readying"
      },
      {
        body: "所有內容都是資訊整理與風險辨識，不提供個股買進、賣出、持有或個人化投資建議。",
        id: "never-advice",
        label: "使用邊界",
        title: "非投資建議",
        tone: "blocked"
      }
    ],
    context,
    contextLine,
    headline: "公開 Beta 可用閱讀流程",
    stopLine: "本頁仍為 mock 展示；資料可能延遲、不完整或尚未取得正式公開使用核准，請勿視為即時行情或投資建議。",
    summary: "先用 30 秒掌握狀態，再用 3 分鐘檢查風險、資料時間與下一步觀察，最後確認資料與非投資建議邊界。"
  };
}
