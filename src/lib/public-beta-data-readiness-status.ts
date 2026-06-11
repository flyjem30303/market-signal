export type PublicBetaDataReadinessLane = {
  id: string;
  label: string;
  status: "accepted" | "readying" | "blocked";
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
    acceptedSlots: number;
    totalSlots: number;
    nextOwner: string;
    nextAction: string;
  };
  lanes: PublicBetaDataReadinessLane[];
  stopLine: string;
};

export function getPublicBetaDataReadinessStatus(): PublicBetaDataReadinessStatus {
  return {
    headline: "資料真實化正在補齊，公開頁仍維持示範模式",
    summary:
      "目前已完成一批彙總證據與資料結構檢查，可用來說明市場狀態頁的方向；但正式資料覆蓋率、來源深度與寫入覆核尚未完成，因此公開頁仍以示範資料呈現。",
    publicDataSource: "mock",
    scoreSource: "mock",
    rowCoverage: {
      acceptedRows: 182,
      targetRows: 360,
      label: "已觀察 182/360 筆彙總證據"
    },
    twiiPrerequisites: {
      acceptedSlots: 6,
      totalSlots: 6,
      nextOwner: "產品與資料團隊",
      nextAction:
        "下一步是把已接受的來源、欄位、覆蓋率與回讀條件整理成可執行檢查包；通過前不開放正式資料寫入或分數升級。"
    },
    lanes: [
      {
        id: "tw-equity",
        label: "台股個股示範組",
        status: "accepted",
        summary: "2330、2382、2308 已可支撐示範閱讀流程，但仍不是完整上市櫃覆蓋。"
      },
      {
        id: "twii",
        label: "大盤基準",
        status: "readying",
        summary:
          "TWII 已有一次安全範圍內的彙總證據，可作為下一步資料真實化檢查基準；公開頁仍維持示範狀態。"
      },
      {
        id: "etf",
        label: "核心 ETF",
        status: "blocked",
        summary: "0050 與 006208 目前只支撐示範狀態，還需要來源、覆蓋率與回讀證據補齊後才能升級。"
      }
    ],
    stopLine:
      "在來源權利、覆蓋率、品質檢查、回讀與回退條件都完成前，不執行正式資料寫入、不宣稱即時真實資料，也不把分數來源升級為 real。"
  };
}
