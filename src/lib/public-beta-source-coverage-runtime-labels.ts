import { getTwseOpenApiIndexBaselineMockRuntimeHandoff } from "@/lib/twse-openapi-index-baseline-mock-runtime-handoff";

export type PublicBetaSourceCoverageContext = "home" | "briefing" | "stock";

export type PublicBetaSourceCoverageLayer = {
  detail: string;
  id: string;
  label: string;
  next: string;
  state: "usable_demo" | "checking" | "blocked";
};

export type PublicBetaFieldContractStatus = {
  detail: string;
  id: string;
  label: string;
  status: string;
};

export type PublicBetaIndexBaselineRuntimeCheck = {
  detail: string;
  id: string;
  label: string;
  status: "可示範" | "暫停公開" | "政策待確認";
};

export type PublicBetaBatch1PolicyLabel = {
  detail: string;
  id: string;
  label: string;
  status: "展示可用" | "不可宣稱" | "範圍切開";
};

export type PublicBetaSourceCoverageAction = {
  body: string;
  id: string;
  label: string;
  title: string;
};

export type PublicBetaSourceCoverageRuntimeLabels = {
  batch1PolicyLabels: PublicBetaBatch1PolicyLabel[];
  boundary: {
    publicDataSource: "mock";
    scoreSource: "mock";
    stopLine: string;
  };
  fieldContracts: PublicBetaFieldContractStatus[];
  headline: string;
  indexBaselineChecks: PublicBetaIndexBaselineRuntimeCheck[];
  layers: PublicBetaSourceCoverageLayer[];
  readingActions: PublicBetaSourceCoverageAction[];
  summary: string;
  userMeaning: string;
};

export function getPublicBetaSourceCoverageRuntimeLabels(
  context: PublicBetaSourceCoverageContext,
  stockSymbol = "2330"
): PublicBetaSourceCoverageRuntimeLabels {
  const indexBaselineHandoff = getTwseOpenApiIndexBaselineMockRuntimeHandoff();
  const contextLine =
    context === "stock"
      ? `${stockSymbol} 仍以示範資料說明標的狀態，來源與覆蓋率升級前不能視為正式行情。`
      : "目前公開 Beta 先讓使用者看懂市場狀態；資料來源與覆蓋率仍以候選路線呈現。";

  return {
    batch1PolicyLabels: [
      {
        detail: "2330、2382、2308 只作為第一批上市個股 mock 示範錨點，用來驗證閱讀流程，不代表正式資料覆蓋。",
        id: "batch1-demo-anchors",
        label: "第一批示範標的",
        status: "展示可用"
      },
      {
        detail: "目前不公開完整上市公司清單、不輸出原始股票代碼列、不展示候選資料列，避免使用者誤認已完成全市場覆蓋。",
        id: "batch1-no-row-list",
        label: "不是完整上市股票覆蓋",
        status: "不可宣稱"
      },
      {
        detail: "上市個股、ETF、指數與 OTC 需要分開確認來源、欄位與覆蓋規則；0050、006208 與 TWII 不併入這一批。",
        id: "batch1-instrument-scope",
        label: "上市個股與 ETF/指數分開",
        status: "範圍切開"
      }
    ],
    boundary: {
      publicDataSource: "mock",
      scoreSource: "mock",
      stopLine: "正式資料上線前，不宣稱即時真實資料、不宣稱完整覆蓋，也不提供買賣建議。"
    },
    fieldContracts: [
      {
        detail: "日期、收盤值與缺漏交易日規則仍在確認；正式資料上線前只做示範閱讀。",
        id: "index-baseline-field-contract",
        label: "大盤欄位對照",
        status: "欄位對照仍在檢查"
      },
      {
        detail: "標的代碼、標的名稱、收盤價、成交量與成交金額仍在確認，不代表全上市股票已覆蓋。",
        id: "listed-equity-batch1-field-contract",
        label: "上市個股欄位對照",
        status: "欄位對照仍在檢查"
      }
    ],
    headline: "資料來源與覆蓋狀態",
    indexBaselineChecks: indexBaselineHandoff.caseSummaries.map((item) => ({
      detail: toPublicIndexBaselineCheckDetail(item.caseId),
      id: item.caseId,
      label: item.label,
      status: item.status
    })),
    layers: [
      {
        detail: "支援 30 秒市場氛圍與晨報入口，但目前仍是示範訊號。",
        id: "index-baseline",
        label: "大盤基準",
        next: "確認官方候選來源條款、日期欄位、收盤值欄位與缺漏交易日規則。",
        state: "checking"
      },
      {
        detail: "支援 0050、006208 等核心 ETF 的產品閱讀路徑，尚未完成正式覆蓋。",
        id: "core-etf",
        label: "核心 ETF",
        next: "補 ETF 專屬來源、欄位對照、延遲揭露與公開展示條件。",
        state: "blocked"
      },
      {
        detail: "2330、2382、2308 可支援示範閱讀流程，但不是全市場覆蓋。",
        id: "listed-equity-batch1",
        label: "上市個股批次",
        next: "建立批次規則，再逐步擴大上市股票 universe。",
        state: "usable_demo"
      }
    ],
    readingActions: [
      {
        body: "先確認這個頁面目前只是示範資料，避免把燈號誤解成正式行情。",
        id: "check-boundary",
        label: "1",
        title: "先看資料狀態"
      },
      {
        body: "再看大盤、ETF、上市個股哪一層仍在檢查或暫停公開。",
        id: "check-coverage",
        label: "2",
        title: "再看覆蓋缺口"
      },
      {
        body: "最後回到晨報或標的頁，只把它當成下一步觀察線索，不當成交易指令。",
        id: "choose-next-observation",
        label: "3",
        title: "最後決定觀察方向"
      }
    ],
    summary:
      "公開 Beta 目前使用模擬資料，讓使用者先理解指數狀態儀表站的閱讀方式；正式市場資料、來源權利、覆蓋品質與更新節奏仍在檢查。",
    userMeaning: `${contextLine} 一般投資者可以把這一區當成資料可信度標籤：哪些只是展示可用、哪些還在檢查、哪些暫時不能當作完整市場覆蓋。`
  };
}

function toPublicIndexBaselineCheckDetail(caseId: string): string {
  switch (caseId) {
    case "index_valid_date_close":
      return "日期與收盤值可形成示範閱讀點，但仍不是正式行情。";
    case "index_missing_close":
      return "缺少收盤值時必須暫停公開，避免使用者看到不完整市場狀態。";
    case "index_duplicate_trade_date":
      return "同一交易日重複時必須暫停公開，避免市場氛圍被重複資料扭曲。";
    case "index_missing_optional_fields":
      return "延伸欄位缺漏時仍可示範閱讀，但成交量、成交金額等解釋要保守。";
    case "index_revision_warning":
      return "來源修正規則尚未確認前，只能標示政策待確認，不能覆蓋歷史。";
    case "index_timezone_session_gap":
      return "交易日缺口需要交易日曆規則確認，不能直接當作市場異常。";
    default:
      return "這個檢查仍維持示範閱讀，不代表正式資料上線。";
  }
}
