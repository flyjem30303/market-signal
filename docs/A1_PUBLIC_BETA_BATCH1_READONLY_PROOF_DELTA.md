# A1 Public Beta Batch 1 Readonly Proof Delta

Status: `a1_public_beta_batch1_readonly_proof_delta_ready_local_only`

Date: 2026-06-12

Owner lane: A1 Data / Supabase / Market Evidence

Runtime posture:

- `publicDataSource=mock`
- `scoreSource=mock`

## Purpose

This local-only delta defines the prerequisites and aggregate-only proof shape for a future bounded readonly review of Batch 1 TWII plus core ETF readiness.

This document is a prerequisite and PM review artifact only. It does not authorize SQL, Supabase connection, Supabase read, Supabase write, staging rows, `daily_prices` mutation, market-data fetch, market-data ingest, market-data storage, raw market-data commit, candidate row acceptance, secret access, authorization phrase handling, real decision values, public real-data promotion, `publicDataSource=supabase`, or `scoreSource=real`.

Batch 1 scope remains limited to TWII plus core ETF readiness. It does not include individual stocks, sectors, industries, holdings, NAV, premium/discount, portfolio composition, intraday data, advice signals, or real scoring.

## 1. Current Mock Boundary

Current public beta Batch 1 remains mock-only.

Allowed now:

- local documentation that describes a future bounded readonly proof route;
- PM-facing readiness labels that preserve `publicDataSource=mock` and `scoreSource=mock`;
- TWII and core ETF mock shell placement;
- aggregate-only readiness or blocker summaries;
- local-only prerequisite review by PM, A1, and A2.

Not allowed from this packet:

- real TWII values;
- real ETF prices;
- raw or row-level market payloads;
- Supabase-backed public routes;
- Supabase connection or readback;
- `daily_prices` inserts, updates, merges, deletes, or backfills;
- staging rows;
- candidate row acceptance;
- real scoring or real decision values.

Safe PM statement: Batch 1 may continue to show a mock TWII plus core ETF shell while A1 documents the bounded readonly proof prerequisites. Real-data display, readback, write/backfill, row coverage scoring, and real scoring remain blocked until separate accepted gates authorize them.

## 2. Bounded Readonly Purpose For TWII + Core ETF

A future bounded readonly attempt, if separately accepted by PM, may have only this purpose:

- confirm aggregate readiness for the Batch 1 TWII lane and core ETF lane;
- verify that the proposed readonly scope is bounded, no-secret, and aggregate-only;
- confirm that proof output can be reviewed without raw payloads, row payloads, stock-id payloads, secrets, credentials, authorization phrases, confirmation phrases, or real decision values;
- provide PM with a pass/block/repair decision surface for whether a later readonly execution packet can be considered.

Readonly purpose exclusions:

- it must not prove real public display readiness;
- it must not award row coverage points;
- it must not authorize writes, backfills, staging rows, or `daily_prices` mutation;
- it must not accept candidate rows;
- it must not switch runtime source to Supabase;
- it must not enable real scoring;
- it must not expand beyond TWII plus core ETF Batch 1 readiness.

Minimum bounded scope fields for a later PM packet:

| Field | Required bounded value |
| --- | --- |
| `batchScope` | `public_beta_batch1_twii_core_etf` |
| `targetLanes` | `TWII`, `core_etf` |
| `attemptMode` | `bounded_readonly_prerequisite_review` |
| `executionAuthorizedByThisFile` | `false` |
| `writeAuthorized` | `false` |
| `dailyPricesMutationAuthorized` | `false` |
| `publicDataSource` | `mock` |
| `scoreSource` | `mock` |

## 3. Allowed Aggregate-Only Proof Fields

A later accepted readonly proof packet may allow only aggregate fields like these:

- `proofId`
- `reviewPacketId`
- `batchScope`
- `targetLanes`
- `targetLaneCount`
- `readonlyPurposeAccepted`
- `scopeLocked`
- `scopeExpansionDetected`
- `preflightStatus`
- `attemptStatus`
- `twiiAggregateStatus`
- `coreEtfAggregateStatus`
- `twiiExpectedScopeLabel`
- `coreEtfExpectedScopeLabel`
- `twiiCoverageStatus`
- `coreEtfCoverageStatus`
- `twiiRightsStatus`
- `coreEtfRightsStatus`
- `twiiFieldContractStatus`
- `coreEtfFieldContractStatus`
- `sessionCadenceContractStatus`
- `readonlyTargetAccepted`
- `readonlyReadAttempted`
- `readonlyProofReturned`
- `aggregateCountsOnly`
- `rowPayloadOutput`
- `rawPayloadOutput`
- `stockIdPayloadOutput`
- `secretsOutput`
- `authorizationPhraseOutput`
- `confirmationPhraseOutput`
- `realDecisionValueOutput`
- `sanitizedErrorCode`
- `sanitizedErrorCategory`
- `followUpRoute`

Allowed aggregate counts must stay at count/status level only. Acceptable examples include lane count, expected scope count, aggregate pass/block counts, missing aggregate bucket count, sanitized error category count, and boolean lock flags.

The proof output must preserve these locks:

| Lock field | Required value |
| --- | --- |
| `sqlExecuted` | `false` |
| `supabaseWritesEnabled` | `false` |
| `stagingRowsCreated` | `false` |
| `dailyPricesMutated` | `false` |
| `candidateRowsAccepted` | `false` |
| `publicPromotionAllowed` | `false` |
| `rowCoverageScoringAllowed` | `false` |
| `publicDataSource` | `mock` |
| `scoreSource` | `mock` |

## 4. Prohibited Proof Fields

The readonly proof, review output, PM handoff, or A2 copy surface must not include:

- raw source payloads;
- source response bodies;
- raw market values;
- TWII index levels;
- ETF close prices;
- full row bodies;
- candidate row payloads;
- row-level `daily_prices` payloads;
- stock-id payloads;
- symbol-level row lists derived from private or credentialed sources;
- trade-date lists;
- per-date market values;
- source values;
- credential values;
- secret names paired with values;
- authorization phrases;
- confirmation phrases;
- real decision values;
- credential-derived URLs;
- private dashboard links;
- copied source terms text beyond safe summaries;
- SQL text;
- SQL query results;
- Supabase connection strings;
- Supabase access tokens;
- Supabase project identifiers derived from credentials;
- source URLs containing tokens or credentials.

Any request for a prohibited field makes the attempt fail closed and returns only a sanitized blocked status.

## 5. Fail-Closed Preflight Checklist

A future bounded readonly attempt must fail closed unless every checklist item is true:

| Checklist item | Required state |
| --- | --- |
| PM names the exact bounded readonly purpose for TWII plus core ETF Batch 1. | Required before any attempt. |
| PM names the exact target surface or aggregate proof surface. | Required before any attempt. |
| The packet states that SQL is not authorized. | Required before any attempt. |
| The packet states that writes, staging rows, and `daily_prices` mutation are not authorized. | Required before any attempt. |
| The packet states that proof output is aggregate-only. | Required before any attempt. |
| The packet excludes raw payloads, row payloads, stock-id payloads, secrets, env values, authorization phrases, confirmation phrases, and real decision values. | Required before any attempt. |
| The packet preserves `publicDataSource=mock`. | Required before any attempt. |
| The packet preserves `scoreSource=mock`. | Required before any attempt. |
| The packet has a post-run review template with aggregate-only fields. | Required before any attempt. |
| The packet has a repair route for missing rights, field contract, session/cadence, readonly target, or proof-shape acceptance. | Required before any attempt. |
| The packet has no executable command embedded in PM-facing acceptance text. | Required before any attempt. |

Automatic fail-closed triggers:

- scope expands beyond TWII plus core ETF;
- any step requires SQL;
- any step requires Supabase writes;
- any step requires staging rows;
- any step requires `daily_prices` mutation;
- any step requires raw market-data fetch, ingest, storage, or commit;
- any step requires raw payload, row payload, stock-id payload, secret, authorization phrase, confirmation phrase, or real decision value output;
- any result would set `publicDataSource=supabase`;
- any result would set `scoreSource=real`.

## 6. Post-Run Review Fields

If a later PM gate separately authorizes a bounded readonly attempt, post-run review must remain aggregate-only and may contain only these field groups:

| Field group | Allowed fields |
| --- | --- |
| Review identity | `proofId`, `reviewPacketId`, `attemptId`, `reviewedAt`, `reviewOutcome` |
| Scope | `batchScope`, `targetLanes`, `targetLaneCount`, `scopeLocked`, `scopeExpansionDetected` |
| Readonly status | `readonlyPurposeAccepted`, `readonlyTargetAccepted`, `readonlyReadAttempted`, `readonlyProofReturned`, `preflightStatus`, `attemptStatus` |
| Lane readiness | `twiiAggregateStatus`, `coreEtfAggregateStatus`, `twiiCoverageStatus`, `coreEtfCoverageStatus`, `twiiRightsStatus`, `coreEtfRightsStatus`, `twiiFieldContractStatus`, `coreEtfFieldContractStatus`, `sessionCadenceContractStatus` |
| Safety flags | `sqlExecuted`, `supabaseConnectionAttempted`, `supabaseReadsEnabled`, `supabaseWritesEnabled`, `marketDataFetched`, `marketDataIngested`, `dailyPricesMutated`, `stagingRowsCreated`, `candidateRowsAccepted` |
| Output policy | `aggregateCountsOnly`, `rawPayloadOutput`, `rowPayloadOutput`, `stockIdPayloadOutput`, `secretsOutput`, `authorizationPhraseOutput`, `confirmationPhraseOutput`, `realDecisionValueOutput` |
| Promotion locks | `publicPromotionAllowed`, `rowCoverageScoringAllowed`, `publicDataSource`, `scoreSource` |
| Error and route | `sanitizedErrorCode`, `sanitizedErrorCategory`, `followUpRoute` |

Allowed `reviewOutcome` values:

- `accepted`
- `blocked`
- `failed_closed`
- `repair_required`
- `not_executed`

`accepted` means only that the aggregate-only readonly proof shape is acceptable for PM review. It does not mean Supabase was read, rows were written, data was promoted, coverage points were awarded, or real scoring was enabled.

## 7. PM-Ready Acceptance Checklist

PM can treat this delta as ready when all checklist items below are true:

| Checklist item | Acceptance state |
| --- | --- |
| Document preserves current mock boundary: `publicDataSource=mock` and `scoreSource=mock`. | Ready in this delta. |
| Document defines a bounded readonly purpose for TWII plus core ETF Batch 1. | Ready in this delta. |
| Document says this file does not authorize execution, SQL, Supabase connection, Supabase read, Supabase write, staging rows, `daily_prices` mutation, market-data fetch, raw data storage, or real-data promotion. | Ready in this delta. |
| Allowed proof fields are aggregate-only and status/count based. | Ready in this delta. |
| Prohibited proof fields include raw payloads, row payloads, stock-id payloads, secrets/env, authorization phrases, confirmation phrases, and real decision values. | Ready in this delta. |
| Fail-closed checklist blocks scope expansion, writes, raw data, secrets, real decision values, `publicDataSource=supabase`, and `scoreSource=real`. | Ready in this delta. |
| Post-run review fields are aggregate-only and include safety flags plus promotion locks. | Ready in this delta. |
| The packet is usable by PM and A2 without exposing real values or public-copy claims. | Ready in this delta. |

## A1 Conclusion

Batch 1 bounded readonly proof delta is ready as a local-only PM prerequisite packet.

This file closes only the documentation delta for proof-shape review. It does not close source rights, field/session/cadence, Supabase readiness, readonly authorization, readback proof, write/backfill, row coverage, public real-data promotion, or real-score gates.
