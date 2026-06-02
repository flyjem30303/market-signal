import type { TwiiParserContractResult } from "./twii-parser-contract";

export type TwiiParserConsumerReviewState =
  | "parser_contract_ready_for_review"
  | "parser_contract_blocked_by_field_mismatch"
  | "parser_contract_blocked_by_duplicate_dates"
  | "parser_contract_blocked_by_no_rows"
  | "parser_contract_waiting_for_rights_decision"
  | "parser_contract_waiting_for_staging_schema"
  | "parser_contract_not_runtime_ready";

export type TwiiParserConsumerStateInput = {
  parserResult: TwiiParserContractResult;
  rightsApproved: boolean;
  stagingSchemaApproved: boolean;
};

export type TwiiParserConsumerState = {
  canAwardRowCoverageCredit: false;
  canMapToDailyPrices: false;
  canSetScoreSourceReal: false;
  isRuntimeReady: false;
  publicDataSource: "mock";
  reviewState: TwiiParserConsumerReviewState;
  scoreSource: "mock";
};

export function getTwiiParserConsumerState(input: TwiiParserConsumerStateInput): TwiiParserConsumerState {
  return {
    canAwardRowCoverageCredit: false,
    canMapToDailyPrices: false,
    canSetScoreSourceReal: false,
    isRuntimeReady: false,
    publicDataSource: "mock",
    reviewState: pickReviewState(input),
    scoreSource: "mock"
  };
}

function pickReviewState(input: TwiiParserConsumerStateInput): TwiiParserConsumerReviewState {
  if (input.parserResult.failureClass === "field_mismatch") return "parser_contract_blocked_by_field_mismatch";
  if (input.parserResult.failureClass === "duplicate_dates") return "parser_contract_blocked_by_duplicate_dates";
  if (input.parserResult.failureClass === "no_rows") return "parser_contract_blocked_by_no_rows";
  if (!input.rightsApproved) return "parser_contract_waiting_for_rights_decision";
  if (!input.stagingSchemaApproved) return "parser_contract_waiting_for_staging_schema";
  if (input.parserResult.failureClass === "none") return "parser_contract_ready_for_review";

  return "parser_contract_not_runtime_ready";
}
