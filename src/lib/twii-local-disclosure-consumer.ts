import type { TwiiParserConsumerAdapterOutput } from "./twii-parser-consumer-adapter";

export type TwiiLocalDisclosureStatus =
  | "mock_ready_for_review"
  | "mock_waiting_for_rights"
  | "mock_waiting_for_staging_schema"
  | "mock_blocked_by_parser_contract"
  | "mock_not_runtime_ready";

export type TwiiLocalDisclosureConsumerInput = {
  adapterOutput: TwiiParserConsumerAdapterOutput;
};

export type TwiiLocalDisclosureConsumerOutput = {
  canClaimTwiiCoverage: false;
  canShowRealScore: false;
  canUseSupabaseRuntime: false;
  disclosureStatus: TwiiLocalDisclosureStatus;
  publicDataSource: "mock";
  safeSummary: string;
  scoreSource: "mock";
};

export function getTwiiLocalDisclosureConsumerOutput(input: TwiiLocalDisclosureConsumerInput): TwiiLocalDisclosureConsumerOutput {
  const disclosureStatus = pickDisclosureStatus(input.adapterOutput);

  return {
    canClaimTwiiCoverage: false,
    canShowRealScore: false,
    canUseSupabaseRuntime: false,
    disclosureStatus,
    publicDataSource: "mock",
    safeSummary: pickSafeSummary(disclosureStatus),
    scoreSource: "mock"
  };
}

function pickDisclosureStatus(adapterOutput: TwiiParserConsumerAdapterOutput): TwiiLocalDisclosureStatus {
  if (adapterOutput.blockingReason === "none") return "mock_ready_for_review";
  if (adapterOutput.blockingReason === "rights_decision_required") return "mock_waiting_for_rights";
  if (adapterOutput.blockingReason === "staging_schema_decision_required") return "mock_waiting_for_staging_schema";
  if (
    adapterOutput.blockingReason === "field_mismatch" ||
    adapterOutput.blockingReason === "duplicate_trade_dates" ||
    adapterOutput.blockingReason === "no_rows"
  ) {
    return "mock_blocked_by_parser_contract";
  }

  return "mock_not_runtime_ready";
}

function pickSafeSummary(status: TwiiLocalDisclosureStatus): string {
  if (status === "mock_ready_for_review") return "TWII 示範資料已可供頁面閱讀，但仍需來源權利與資料品質審核。";
  if (status === "mock_waiting_for_rights") return "TWII 等待資料來源權利確認，頁面只能呈現示範讀法。";
  if (status === "mock_waiting_for_staging_schema") return "TWII 等待資料表與欄位契約確認，不能宣稱正式資料。";
  if (status === "mock_blocked_by_parser_contract") return "TWII parser 契約尚未通過，必須維持示範模式。";

  return "TWII 目前仍在資料真實化流程中，不能當成即時或完整市場資料。";
}
