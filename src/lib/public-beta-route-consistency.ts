export type PublicBetaRouteConsistencyContext = "home" | "briefing" | "stock";

export type PublicBetaRouteStep = {
  href: string;
  label: string;
  purpose: string;
  title: string;
};

export type PublicBetaRouteConsistency = {
  boundary: {
    publicDataSource: "mock";
    scoreSource: "mock";
    stopLine: string;
  };
  headline: string;
  nextDataGate: string;
  primaryMessage: string;
  routeSteps: PublicBetaRouteStep[];
  sourceCoverageState: string;
  subhead: string;
};

export function getPublicBetaRouteConsistency(
  context: PublicBetaRouteConsistencyContext,
  stockSymbol = "2330"
): PublicBetaRouteConsistency {
  const stockHref = `/stocks/${stockSymbol}`;

  return {
    boundary: {
      publicDataSource: "mock",
      scoreSource: "mock",
      stopLine: "目前仍是 mock-only 公開 Beta，不宣稱即時真實資料、不宣稱完整覆蓋，也不提供買賣建議。"
    },
    headline: context === "stock" ? "從市場到標的，保持同一條閱讀路徑" : "首頁、晨報、標的頁共用同一套判讀順序",
    nextDataGate:
      "下一步只會先補官方候選來源的條款位置、欄位對照與覆蓋範圍；正式資料上線仍需另外通過來源、品質、回讀與揭露 gate。",
    primaryMessage:
      "使用者先在首頁看市場氛圍，再進晨報拆成因與警示，最後到標的頁確認單一標的狀態、資料品質與下一步觀察。",
    routeSteps: [
      {
        href: "/",
        label: "1",
        purpose: "30 秒看懂市場氛圍、核心指標與警示清單。",
        title: "首頁：市場總覽"
      },
      {
        href: "/briefing",
        label: "2",
        purpose: "3 分鐘拆成因、更新時間、影響級別與下一步。",
        title: "晨報：行動判斷"
      },
      {
        href: stockHref,
        label: "3",
        purpose: "確認單一標的狀態、資料限制與 mock 邊界。",
        title: `${stockSymbol}：標的確認`
      }
    ],
    sourceCoverageState:
      "資料來源與覆蓋率仍在候選確認階段；公開頁只顯示示範可讀、檢查中或暫停公開，不把 mock 結果包裝成正式市場訊號。",
    subhead: "每個路由都先說現在能看什麼、為什麼要看、下一步該看哪裡，避免使用者只看單一數字。"
  };
}
