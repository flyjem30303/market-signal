export type PublicBetaDataReadinessLane = {
  id: string;
  label: string;
  status: "accepted" | "readying" | "blocked";
  summary: string;
};

export type PublicBetaSourceTrustItem = {
  id: string;
  label: string;
  status: "candidate" | "reviewing" | "blocked";
  summary: string;
  nextStep: string;
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
  sourceTrust: PublicBetaSourceTrustItem[];
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
    sourceTrust: [
      {
        id: "twse-openapi",
        label: "TWSE OpenAPI 候選",
        status: "reviewing",
        summary: "A1 已把官方公開資料列為優先候選，但目前只完成 no-fetch 來源與覆蓋矩陣，尚未取得正式使用條件確認。",
        nextStep: "先做 terms / automation / free-use review，不抓資料列。"
      },
      {
        id: "twii-index",
        label: "TWII 大盤基準",
        status: "candidate",
        summary: "可作為第一個市場氣氛基準候選，適合先確認每日收盤價、日期、欄位語意與公開展示條件。",
        nextStep: "準備 no-fetch 欄位合約與來源條款證據包。"
      },
      {
        id: "etf-source",
        label: "核心 ETF 來源",
        status: "blocked",
        summary: "0050、006208 不能直接套用大盤或個股條款；ETF market close、NAV 與成交量來源仍需分開確認。",
        nextStep: "等 TWSE/TWII 條款路線收斂後，再做 ETF-specific review。"
      }
    ],
    stopLine:
      "在來源權利、覆蓋率、品質檢查、回讀與回退條件都完成前，不執行正式資料寫入、不宣稱即時真實資料，也不把分數來源升級為 real。"
  };
}
