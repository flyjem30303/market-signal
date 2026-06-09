# TWII Supabase Write Gate Preauthorization

Updated: 2026-06-09

Status: `twii_supabase_write_gate_preauth_ready_for_chairman_authorization`

## Purpose

This preauthorization gate converts the accepted TWII local no-write chain into the final checklist required before any future Supabase write gate may be opened.

It does not execute the write gate. It does not run SQL, connect to Supabase, fetch market data, mutate `daily_prices`, accept candidate rows, score row coverage, promote public data source, or set `scoreSource=real`.

## Required Future Authorization Packet

A future write gate must be a separate CEO/PM-named packet and must include all fields below:

- `authorizationId`;
- `chairmanDecision=accepted`;
- `ceoDecision=accepted`;
- `pmOwner`;
- `candidateArtifactPath`;
- `sourceRightsDecisionReference`;
- `fieldContractReference`;
- `assetMappingReference`;
- `targetTable=daily_prices`;
- `targetLane=TWII`;
- `targetScope=twii_index_daily_prices_missing_rows`;
- `maxRows=60`;
- `writeMode=bounded_insert_missing_only`;
- `duplicatePolicy=reject_duplicates`;
- `rollbackPlan`;
- `postWriteReadbackPlan`;
- `postWriteReviewCommand`;
- `promotionAllowed=false`;
- `rowCoverageScoringAllowed=false`;
- `scoreSourceRealAllowed=false`.

## Rollback / No-Write Stop Line

The future gate must stop before write execution if any condition below is not explicitly accepted:

- source rights, field contract, or asset mapping is unresolved;
- candidate artifact is not sanitized aggregate/row-contract reviewed;
- target scope is not TWII index missing daily rows;
- target row count exceeds 60;
- duplicate row detection is not zero;
- rollback plan is missing;
- post-write aggregate readback plan is missing;
- secret handling plan is missing;
- public promotion or real score is requested in the same packet.

## Post-Write Readback Plan

If a later separate write gate is authorized, the readback must verify only aggregate outcomes:

- attempted row count;
- inserted row count;
- rejected row count;
- duplicate row count;
- target scope;
- target table;
- post-write max trade date;
- source-rights decision reference;
- field-contract reference;
- asset mapping reference.

Raw source payloads, row payloads, stock-id payloads, and secrets must not be printed in the readback.

## Current Decision

Current output is only `preauth_ready_for_chairman_authorization`. A future explicit chairman/CEO/PM packet is still required before any write, readback, scoring, promotion, or real-source change.

