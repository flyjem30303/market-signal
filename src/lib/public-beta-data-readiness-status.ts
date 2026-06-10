export type PublicBetaDataReadinessLane = {
  id: string;
  label: string;
  status: "accepted" | "pending" | "blocked";
  summary: string;
};

export type PublicBetaDataReadinessStatus = {
  headline: string;
  summary: string;
  publicDataSource: "mock";
  scoreSource: "mock";
  rowCoverage: {
    acceptedRows: number;
    targetRows: number;
    label: string;
  };
  twiiPrerequisites: {
    pendingSlots: number;
    totalSlots: number;
    nextOwner: string;
    nextAction: string;
  };
  lanes: PublicBetaDataReadinessLane[];
  stopLine: string;
};

export function getPublicBetaDataReadinessStatus(): PublicBetaDataReadinessStatus {
  return {
    headline: "資料真實化進度可見，但仍維持 mock",
    summary:
      "目前已建立 TWII 寫入前的 A1/D 補件與 PM intake ledger；6 個 prerequisite 仍待回覆，所以公開 Beta 可以展示進度，但不能宣稱真實資料完成。",
    publicDataSource: "mock",
    scoreSource: "mock",
    rowCoverage: {
      acceptedRows: 182,
      targetRows: 360,
      label: "182/360 accepted evidence"
    },
    twiiPrerequisites: {
      pendingSlots: 6,
      totalSlots: 6,
      nextOwner: "A1 / D / PM",
      nextAction: "A1/D 回覆 6 個 prerequisite slot，PM 再做 accepted/rejected intake。"
    },
    lanes: [
      {
        id: "tw-equity",
        label: "TW equity",
        status: "accepted",
        summary: "2330、2382、2308 已完成第一階段 evidence coverage。"
      },
      {
        id: "twii",
        label: "TWII",
        status: "pending",
        summary: "等待 source-rights、field-contract、asset-mapping、rollback/readback/review 6 格補件。"
      },
      {
        id: "etf",
        label: "ETF",
        status: "blocked",
        summary: "0050、006208 仍受來源權利與覆蓋率缺口限制。"
      }
    ],
    stopLine:
      "不執行 SQL、不寫 Supabase、不匯入市場資料、不接受 rows、不給 row coverage points、不設定 scoreSource=real。"
  };
}

