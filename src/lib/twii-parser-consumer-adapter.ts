import type { TwiiParserContractResult } from "./twii-parser-contract";
import { getTwiiParserConsumerState, type TwiiParserConsumerReviewState } from "./twii-parser-consumer-state";

export type TwiiParserConsumerAdapterInput = {
  parserResult: TwiiParserContractResult;
  rightsApproved: boolean;
  stagingSchemaApproved: boolean;
};

export type TwiiParserConsumerAdapterBlockingReason =
  | "none"
  | "field_mismatch"
  | "duplicate_trade_dates"
  | "no_rows"
  | "rights_decision_required"
  | "staging_schema_decision_required"
  | "runtime_activation_not_authorized";

export type TwiiParserConsumerAdapterOutput = {
  blockingReason: TwiiParserConsumerAdapterBlockingReason;
  canAwardRowCoverageCredit: false;
  canMapToDailyPrices: false;
  canSetScoreSourceReal: false;
  isRuntimeReady: false;
  parsedRowCount: number;
  publicDataSource: "mock";
  reviewState: TwiiParserConsumerReviewState;
  scoreSource: "mock";
};

export function getTwiiParserConsumerAdapterOutput(input: TwiiParserConsumerAdapterInput): TwiiParserConsumerAdapterOutput {
  const consumerState = getTwiiParserConsumerState(input);

  return {
    blockingReason: pickBlockingReason(consumerState.reviewState),
    canAwardRowCoverageCredit: false,
    canMapToDailyPrices: false,
    canSetScoreSourceReal: false,
    isRuntimeReady: false,
    parsedRowCount: input.parserResult.rows.length,
    publicDataSource: "mock",
    reviewState: consumerState.reviewState,
    scoreSource: "mock"
  };
}

function pickBlockingReason(reviewState: TwiiParserConsumerReviewState): TwiiParserConsumerAdapterBlockingReason {
  if (reviewState === "parser_contract_ready_for_review") return "none";
  if (reviewState === "parser_contract_blocked_by_field_mismatch") return "field_mismatch";
  if (reviewState === "parser_contract_blocked_by_duplicate_dates") return "duplicate_trade_dates";
  if (reviewState === "parser_contract_blocked_by_no_rows") return "no_rows";
  if (reviewState === "parser_contract_waiting_for_rights_decision") return "rights_decision_required";
  if (reviewState === "parser_contract_waiting_for_staging_schema") return "staging_schema_decision_required";

  return "runtime_activation_not_authorized";
}
