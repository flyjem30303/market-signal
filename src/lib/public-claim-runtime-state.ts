export type PublicClaimRuntimeState = {
  claimApprovalState: "not_approved";
  headline: string;
  publicDataSource: "mock";
  scoreSource: "mock";
  states: Array<{
    body: string;
    label: string;
    tone: "active" | "readying" | "blocked";
    value: string;
  }>;
  stopLine: string;
  summary: string;
};

export function getPublicClaimRuntimeState(): PublicClaimRuntimeState {
  return {
    claimApprovalState: "not_approved",
    headline: "公開狀態快讀：示範資料",
    publicDataSource: "mock",
    scoreSource: "mock",
    states: [
      {
        body: "使用者可以閱讀示範訊號、產品流程與資料限制說明，但不能把它視為即時市場證據。",
        label: "目前可見",
        tone: "active",
        value: "資料來源：示範資料"
      },
      {
        body: "正式公開資料、正式分數、完整覆蓋率與買賣建議都尚未啟用。",
        label: "尚未上線",
        tone: "blocked",
        value: "分數來源：示範分數"
      },
      {
        body: "資料流程需要補齊合法來源、欄位定義、覆蓋率、品質與回退條件，才會進入下一段升級討論。",
        label: "下一步",
        tone: "readying",
        value: "等待資料升級條件"
      }
    ],
    stopLine: "不要把示範資料解讀成即時行情、正式投資模型、完整覆蓋或個別買賣建議。",
    summary: "所有公開頁面在未來切換正式資料前，都使用同一組狀態快讀。"
  };
}
