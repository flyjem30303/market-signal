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
      ? `${stockSymbol} 頁面用同一套閱讀順序呈現：狀態、原因、風險、資料時間與下一步觀察。`
      : context === "briefing"
        ? "晨報頁用市場狀態、警示清單與資料邊界，協助使用者快速建立今日觀察重點。"
        : "首頁先回答目前市場氣氛，再引導使用者複核風險、資料時間與資料邊界。";

  return {
    actionCards: [
      {
        body: "先看市場或標的目前偏多、觀望或偏警戒，建立第一層判讀。",
        id: "thirty-second-market-mood",
        label: "30 秒",
        title: "看懂市場氣氛",
        tone: "active"
      },
      {
        body: "再檢查風險熱度、成因、資料時間與是否有缺口，避免只看單一分數。",
        id: "three-minute-action-judgement",
        label: "3 分鐘",
        title: "複核風險與原因",
        tone: "readying"
      },
      {
        body: "最後確認正式資料是否已啟用、是否有延遲或缺漏，再決定關注、加強觀察或等待。",
        id: "source-boundary-confirmation",
        label: "資料邊界",
        title: "確認能不能解讀",
        tone: "blocked"
      }
    ],
    boundaryCards: [
      {
        body: "公開 Beta 目前可以用來理解閱讀流程與市場狀態呈現方式。",
        id: "usable-now",
        label: "目前可用",
        title: "公開 Beta 可用閉環",
        tone: "active"
      },
      {
        body: "正式市場資料與真實分數尚未切換，頁面會持續標示資料來源與覆蓋率狀態。",
        id: "not-yet-real",
        label: "資料狀態",
        title: "正式資料尚未啟用",
        tone: "readying"
      },
      {
        body: "本站不提供買進、賣出、持有、目標價或個人化投資建議。",
        id: "never-advice",
        label: "使用邊界",
        title: "非投資建議",
        tone: "blocked"
      }
    ],
    context,
    contextLine,
    headline: "公開 Beta 可用閉環",
    stopLine: "若資料時間延遲、來源狀態未確認或風險提示異常，請先暫緩解讀並等待下一次更新。",
    summary: "用 30 秒看懂市場氛圍，再用 3 分鐘複核成因、風險、更新時間與下一步觀察。"
  };
}
