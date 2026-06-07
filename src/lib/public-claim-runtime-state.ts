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
        body: "使用者可以閱讀示範訊號、產品流程與本地準備度，但不能把它視為即時市場證據。",
        label: "目前可見",
        tone: "active",
        value: "資料來源：示範資料"
      },
      {
        body: "正式公開資料、SQL 分數、真實市場資料匯入與投資建議宣稱仍被阻擋。",
        label: "尚未上線",
        tone: "blocked",
        value: "分數來源：示範分數"
      },
      {
        body: "任何公開狀態升級前，CEO 必須另行指定範圍明確的唯讀檢查點。",
        label: "下一個檢查點",
        tone: "readying",
        value: "公開宣稱尚未核准"
      }
    ],
    stopLine:
      "不得從此狀態升級公開資料來源、正式分數文字、市場資料覆蓋或投資建議宣稱。",
    summary:
      "所有公開頁面在未來切換正式資料前，都使用同一組狀態快讀。"
  };
}
