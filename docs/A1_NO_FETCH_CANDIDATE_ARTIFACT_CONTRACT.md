# A1 No-Fetch Candidate Artifact Contract

Updated: 2026-06-12

Status: `a1_no_fetch_candidate_artifact_contract_ready_local_only`

Purpose:
- Define the next planning-only candidate artifact shape for the TWII / ETF gap packet.
- No market rows are fetched, no raw payload is emitted, and no mutation is performed.

## 1. Shared Boundary

- `publicDataSource = "mock"`
- `scoreSource = "mock"`
- `fixturePolicy = "synthetic_or_contract_only"`
- `rawMarketDataFetch = false`
- `sqlExecution = false`
- `supabaseWrite = false`
- No staging rows
- No `daily_prices` mutation
- No endpoint calls and no data ingest/store/commit in this packet

## 2. Candidate Manifest Envelope

### Envelope 01: TWII

```text
lane: TWII
scope: twii_index_daily_prices_missing_rows
targetTable: daily_prices
coverageWindowSessions: 60
expectedRows: 60
currentRows: 0
missingRows: 60
duplicatePolicy: reject_duplicates
candidateArtifactScopePolicy: missing_rows_only
sourceCandidate: official_open_data_api
essentialAggregateKeys:
  - lane
  - scope
  - expectedRows
  - currentRows
  - missingRows
  - duplicateRejectionRule
aggregateOutputOnly: true
```

### Envelope 02: 0050

```text
lane: 0050
scope: etf_core_daily_prices_missing_rows
targetTable: daily_prices
coverageWindowSessions: 60
expectedRows: 60
currentRows: 1
missingRows: 59
duplicatePolicy: reject_duplicates
candidateArtifactScopePolicy: missing_rows_only
sourceCandidate: ETF official/public source path (pending source-rights)
essentialAggregateKeys:
  - lane
  - scope
  - expectedRows
  - currentRows
  - missingRows
  - duplicateRejectionRule
aggregateOutputOnly: true
```

### Envelope 03: 006208

```text
lane: 006208
scope: etf_core_daily_prices_missing_rows
targetTable: daily_prices
coverageWindowSessions: 60
expectedRows: 60
currentRows: 1
missingRows: 59
duplicatePolicy: reject_duplicates
candidateArtifactScopePolicy: missing_rows_only
sourceCandidate: ETF official/public source path (pending source-rights)
essentialAggregateKeys:
  - lane
  - scope
  - expectedRows
  - currentRows
  - missingRows
  - duplicateRejectionRule
aggregateOutputOnly: true
```

## 3. Candidate Packet Contract Fields

- `lane`: `TWII` / `0050` / `006208`
- `currentRows`
- `expectedRows`
- `missingRows`
- `sourceCandidate`
- `sourceRightsStatus`
- `fieldContractStatus`
- `candidateArtifactRequirement`
- `duplicateRejectionRule`
- `rollbackRequirement`
- `readbackRequirement`
- `promotionBoundary`
- `aggregateValidation`
  - `expectedRows`
  - `candidateRows`
  - `duplicateRows`
  - `rejectedRows`
  - `missingRows`
  - `fieldNames`
  - `validationStatus`

## 4. Hard Shape Rules (must remain in this lane)

- `candidateArtifactCreated` must remain `false`
- `rowPayloadIncluded` must remain `false`
- `rawPayloadIncluded` must remain `false`
- `stockIdPayloadIncluded` must remain `false`
- `secretsIncluded` must remain `false`
- `rowPayloadsPrinted` must remain `false`
- `stockIdPayloadsPrinted` must remain `false`
- `secretsPrinted` must remain `false`
- `coverageChecksum` is placeholder only (no real rows)

## 5. No-Fetch Output Policy

PM-facing output must be aggregate-only and include only:
- `lane`
- `expectedRows`
- `currentRows`
- `missingRows`
- `sourceRightsStatus`
- `fieldContractStatus`
- `coverageWindowSessions`
- `duplicateRejectionRule`
- `readbackRequirement`
- `promotionBoundary`
- `publicDataSource`
- `scoreSource`

PM-facing output must NOT include:
- row-level dates, close/high/low/open/volume/trade metrics
- raw source rows / raw payload / source response body
- csv / html / json row payload / source row list
- service role / anon / publishable keys
- SQL text

## 6. No-write / no-fetch execution boundary

This contract is planning-only. Any later execution packet must be a separate authorization artifact and remain:
- `publicDataSource = "mock"`
- `scoreSource = "mock"`
- `no market endpoint fetch`
- `no SQL`
- `no Supabase write`
- `no staging rows`
- `no daily_prices mutation`
- `no secrets`
