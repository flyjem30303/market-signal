const slots = [
  {
    slotId: "source-rights-decision",
    owner: "A1/D",
    requiredReplyFields: [
      "sourceReferenceLabel",
      "sourceLane",
      "storageAllowed",
      "retentionPolicy",
      "redistributionSummary",
      "attributionSummary",
      "commercialUseSummary",
      "remainingRisk"
    ],
    acceptedIf: "no-secret evidence supports internal storage and bounded aggregate use",
    rejectedIf: "copied terms, private links, unclear storage rights, or redistribution conflict",
    stopLine: "no_source_probing_or_ingestion"
  },
  {
    slotId: "field-contract-decision",
    owner: "A1",
    requiredReplyFields: [
      "fieldNames",
      "fieldMeanings",
      "dateConvention",
      "numericPrecision",
      "nullablePolicy",
      "duplicatePolicy",
      "rejectedFieldList"
    ],
    acceptedIf: "fields are complete enough for sanitized aggregate-only candidate review",
    rejectedIf: "raw/row payload needed, unclear date, unclear precision, or duplicate policy missing",
    stopLine: "no_row_payload_output"
  },
  {
    slotId: "asset-mapping-decision",
    owner: "A1",
    requiredReplyFields: [
      "lane",
      "symbol",
      "assetType",
      "targetTable",
      "targetScope",
      "mappingSummary",
      "stockIdPayloadIncluded"
    ],
    acceptedIf: "TWII maps to index lane and daily_prices scope without stock-id payload output",
    rejectedIf: "stock-id payload required, table/scope mismatch, or lane unclear",
    stopLine: "no_stock_id_payload_output"
  },
  {
    slotId: "rollback-dry-run-plan",
    owner: "A1/PM",
    requiredReplyFields: [
      "authorizationScope",
      "dryRunCountFields",
      "duplicatePolicy",
      "rollbackScope",
      "destructiveRollbackAllowed"
    ],
    acceptedIf: "aggregate-only no-mutation rollback count proof is defined",
    rejectedIf: "destructive rollback required or row-level output needed",
    stopLine: "no_destructive_rollback"
  },
  {
    slotId: "post-write-readback-plan",
    owner: "A1/PM",
    requiredReplyFields: [
      "attemptedCountField",
      "insertedCountField",
      "rejectedCountField",
      "duplicateCountField",
      "maxDateField",
      "aggregateOnly"
    ],
    acceptedIf: "readback is aggregate-only and names required fields",
    rejectedIf: "raw/row payload or stock id output required",
    stopLine: "no_row_payload_output"
  },
  {
    slotId: "post-write-review-plan",
    owner: "PM",
    requiredReplyFields: [
      "summaryInputPath",
      "reviewCommand",
      "acceptedSummaryFields",
      "rejectedSummaryFields",
      "promotionSameRunAllowed"
    ],
    acceptedIf: "review accepts only aggregate summary and keeps promotion/scoring blocked",
    rejectedIf: "review needs raw rows, secrets, or same-run promotion",
    stopLine: "no_promotion_in_same_run"
  }
];

const report = {
  status: "twii_a1_d_write_prerequisite_dispatch_packet_ready_local_only",
  outcome: "a1_d_prerequisite_reply_contract_ready_no_execution",
  mode: "twii_a1_d_write_prerequisite_dispatch_packet",
  owner: "CEO/PM",
  slotCount: slots.length,
  a1SlotCount: slots.filter((slot) => slot.owner.includes("A1")).length,
  dSlotCount: slots.filter((slot) => slot.owner.includes("D")).length,
  pmSlotCount: slots.filter((slot) => slot.owner.includes("PM")).length,
  slots,
  pmClassificationValues: ["accepted", "needs_bounded_repair", "blocked", "rejected"],
  implementationAllowedNow: false,
  nextAction:
    "Send this packet to A1/D, then PM records accepted/rejected intake outcomes before any future implementation upgrade candidate gate.",
  safety: {
    publicDataSource: "mock",
    scoreSource: "mock",
    sqlExecuted: false,
    supabaseClientImported: false,
    supabaseConnectionAttempted: false,
    supabaseReadsEnabled: false,
    supabaseWritesEnabled: false,
    credentialValuesRead: false,
    marketDataFetched: false,
    marketDataIngested: false,
    candidateRowsAccepted: false,
    dailyPricesMutated: false,
    stagingRowsCreated: false,
    rowCoverageScoringAllowed: false,
    rawPayloadOutput: false,
    rowPayloadOutput: false,
    stockIdPayloadOutput: false,
    secretsOutput: false,
    publicPromotionAllowed: false,
    scoreSourceRealAllowed: false
  }
};

console.log(JSON.stringify(report, null, 2));

