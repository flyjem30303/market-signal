export type DataQualityFieldRule = {
  field: string;
  category: "identity" | "price" | "volume" | "date" | "quality";
  invalidWhen: string[];
  downgradeBehavior: "exclude_row" | "mark_stale" | "mark_partial" | "block_real_score";
  owner: "Data" | "QA";
};

export type DataQualityDowngradeRule = {
  trigger: string;
  runtimeState: "partial" | "stale" | "unavailable";
  publicClaimLimit: string;
  maxDataQualityScore: number;
  owner: "Data" | "Investment" | "Legal" | "QA";
};

export type DataQualityFieldValidityContract = {
  approvalState: "local_qa_reviewed";
  canAwardDataQualityPoints: true;
  fieldRules: DataQualityFieldRule[];
  downgradeRules: DataQualityDowngradeRule[];
  publicDataSource: "mock";
  scoreSource: "mock";
  stopLine: string;
};

export function buildDataQualityFieldValidityContract(): DataQualityFieldValidityContract {
  return {
    approvalState: "local_qa_reviewed",
    canAwardDataQualityPoints: true,
    fieldRules: [
      {
        category: "identity",
        downgradeBehavior: "exclude_row",
        field: "symbol",
        invalidWhen: ["missing", "not normalized to market symbol policy", "does not map to approved universe"],
        owner: "Data"
      },
      {
        category: "date",
        downgradeBehavior: "mark_stale",
        field: "trade_date",
        invalidWhen: ["missing", "future date", "older than approved coverage window", "not aligned to market calendar policy"],
        owner: "Data"
      },
      {
        category: "price",
        downgradeBehavior: "block_real_score",
        field: "close",
        invalidWhen: ["missing", "not numeric", "less than or equal to zero", "split or adjustment conflict unresolved"],
        owner: "QA"
      },
      {
        category: "price",
        downgradeBehavior: "mark_partial",
        field: "open_high_low",
        invalidWhen: ["any price is missing", "high is lower than low", "open is outside high low range"],
        owner: "QA"
      },
      {
        category: "volume",
        downgradeBehavior: "mark_partial",
        field: "volume",
        invalidWhen: ["missing", "negative", "zero without halt or market-calendar explanation"],
        owner: "Data"
      },
      {
        category: "quality",
        downgradeBehavior: "block_real_score",
        field: "source_quality_flags",
        invalidWhen: ["source rights unclear", "schema mismatch", "provider outage", "manual override requested"],
        owner: "QA"
      }
    ],
    downgradeRules: [
      {
        maxDataQualityScore: 0,
        owner: "Data",
        publicClaimLimit: "no score claim",
        runtimeState: "unavailable",
        trigger: "critical price field invalid or missing"
      },
      {
        maxDataQualityScore: 49,
        owner: "QA",
        publicClaimLimit: "freshness note only",
        runtimeState: "stale",
        trigger: "trade date stale or outside approved coverage window"
      },
      {
        maxDataQualityScore: 79,
        owner: "Investment",
        publicClaimLimit: "internal review only",
        runtimeState: "partial",
        trigger: "non-critical module missing or partially valid"
      },
      {
        maxDataQualityScore: 0,
        owner: "Legal",
        publicClaimLimit: "no source-backed claim",
        runtimeState: "unavailable",
        trigger: "source rights unclear or redistribution not approved"
      }
    ],
    publicDataSource: "mock",
    scoreSource: "mock",
    stopLine:
      "Field validity is accepted for local Phase 1 quality scoring only; do not ingest data, write Supabase, promote public source, or set scoreSource=real."
  };
}
