# TWII Supabase Write Gate Packet Template

Updated: 2026-06-10

Status: `twii_supabase_write_gate_packet_template_ready_local_only`

## Purpose

This template defines the separate explicit packet required before any future TWII Supabase write gate can be considered.

It is a fillable template and validator target only. It does not authorize execution, SQL, Supabase connection, Supabase write, market-data fetch, `daily_prices` mutation, candidate row acceptance, row coverage scoring, public source promotion, or `scoreSource=real`.

## Template Shape

```json
{
  "packetKind": "twii_supabase_write_gate_packet",
  "authorizationId": "twii-write-gate-YYYYMMDD-a",
  "chairmanDecision": "accepted",
  "ceoDecision": "accepted",
  "pmOwner": "PM",
  "candidateArtifactPath": "data/candidates/twii-sanitized-candidate.json",
  "sourceRightsDecisionReference": "accepted-source-rights-reference",
  "fieldContractReference": "accepted-field-contract-reference",
  "assetMappingReference": "accepted-asset-mapping-reference",
  "targetTable": "daily_prices",
  "targetLane": "TWII",
  "targetScope": "twii_index_daily_prices_missing_rows",
  "maxRows": 60,
  "writeMode": "bounded_insert_missing_only",
  "duplicatePolicy": "reject_duplicates",
  "rollbackPlan": {
    "required": true,
    "scope": "authorizationId",
    "noWriteStopLine": true
  },
  "postWriteReadbackPlan": {
    "aggregateOnly": true,
    "requiredFields": [
      "attempted_row_count",
      "inserted_row_count",
      "rejected_row_count",
      "duplicate_row_count",
      "target_scope",
      "target_table",
      "post_write_max_trade_date"
    ]
  },
  "postWriteReviewCommand": "cmd.exe /c npm run report:twii-post-write-review -- --summary-path <SUMMARY_JSON>",
  "promotionAllowed": false,
  "rowCoverageScoringAllowed": false,
  "scoreSourceRealAllowed": false,
  "safety": {
    "publicDataSource": "mock",
    "scoreSource": "mock",
    "rawPayloadOutputAllowed": false,
    "rowPayloadOutputAllowed": false,
    "stockIdPayloadOutputAllowed": false,
    "secretOutputAllowed": false
  }
}
```

## Validation Meaning

Accepted validation means only that the packet shape is complete enough for a later separate write-gate authorization review.

It does not make the write gate executable. A later explicit chairman/CEO/PM authorization, runner boundary check, credential handling check, rollback dry run, post-write readback gate, and post-write review gate are still required.

## Stop Line

Stop before any write if any packet field is missing, any reference is unresolved, `maxRows` exceeds 60, duplicate policy is not `reject_duplicates`, rollback or readback plan is missing, promotion/scoring is requested, payload/secret output is allowed, or `publicDataSource` / `scoreSource` is not `mock`.

