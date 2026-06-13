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
      ? `${stockSymbol} 頁面目前用 mock 資料示範標的判讀流程，請先看狀態、成因與資料邊界。`
      : context === "briefing"
        ? "晨報把市場氣氛、警示清單與資料邊界放在同一條 3 分鐘閱讀路徑。"
        : "首頁先回答市場氣氛、核心指標、警示清單與資料可信度，讓使用者不用翻找內部狀態。";

  return {
    actionCards: [
      {
        body: "先看市場氣氛與核心指標，只判斷今天偏關注、加強觀察或降低風險。",
        id: "thirty-second-market-mood",
        label: "30 秒",
        title: "看懂市場氛圍",
        tone: "active"
      },
      {
        body: "再看警示成因、更新時間、影響級別與下一步，避免只看單一分數。",
        id: "three-minute-action-judgement",
        label: "3 分鐘",
        title: "形成觀察行動",
        tone: "readying"
      },
      {
        body: "最後確認資料來源與分數來源仍為示範狀態，所有訊號只作閱讀示範。",
        id: "mock-boundary-confirmation",
        label: "邊界",
        title: "先確認資料限制",
        tone: "blocked"
      }
    ],
    boundaryCards: [
      {
        body: "可用來練習閱讀市場狀態、警示原因、資料覆蓋與下一步觀察。",
        id: "usable-now",
        label: "現在可用",
        title: "公開 Beta 閱讀閉環",
        tone: "active"
      },
      {
        body: "來源權利、覆蓋率、品質檢查、回讀與揭露 gate 通過前，不宣稱完整或真實資料。",
        id: "not-yet-real",
        label: "尚未開放",
        title: "真實資料升級",
        tone: "readying"
      },
      {
        body: "不提供買賣建議、不排名推薦、不承諾即時，不把 mock 分數當交易依據。",
        id: "never-advice",
        label: "硬邊界",
        title: "非投資建議",
        tone: "blocked"
      }
    ],
    context,
    contextLine,
    headline: "公開 Beta 可用閉環",
    stopLine:
      "目前仍維持示範資料與示範分數；未授權前不連接正式資料、不寫入資料庫、不切換正式分數。",
    summary:
      "這個閉環的目標不是先變成即時行情站，而是讓一般投資者能在 30 秒讀懂市場氛圍，3 分鐘內知道下一步要觀察什麼。"
  };
}
