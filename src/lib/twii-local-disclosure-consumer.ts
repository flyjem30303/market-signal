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
  if (status === "mock_ready_for_review") return "TWII parser adapter is ready for internal review, but real data activation remains off.";
  if (status === "mock_waiting_for_rights") return "TWII disclosure is waiting for source-rights approval before any real data claim.";
  if (status === "mock_waiting_for_staging_schema") return "TWII disclosure is waiting for staging schema approval before storage or mapping.";
  if (status === "mock_blocked_by_parser_contract") return "TWII disclosure is blocked by parser-contract validation and remains mock-only.";

  return "TWII disclosure is not runtime-ready and remains mock-only.";
}
