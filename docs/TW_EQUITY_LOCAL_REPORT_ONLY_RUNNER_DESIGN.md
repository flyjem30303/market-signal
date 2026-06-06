# TW Equity Local Report-Only Runner Design

Updated: 2026-06-06

Status: `tw_equity_local_report_only_runner_design_ready_not_executable`.

Trigger: `docs/TW_EQUITY_SOURCE_RIGHTS_PACKET.md`.

Companion packet: `docs/TW_EQUITY_REPORT_ONLY_DRY_RUN_PACKET.md`.

## Purpose

This design defines a local report-only runner contract for the TW equity lane. It is a design packet only and does not create an executable runner.

The design consumes the TW equity report-only dry-run packet and the TW equity source-rights packet. It must preserve both packets' boundaries before any future implementation is considered.

## Lane Scope

- Lane id: `tw-equity`.
- Symbols: `2330`, `2382`, `2308`.
- Expected trading sessions: `60`.
- Expected rows: `180`.
- Latest observed rows: `3`.
- Latest missing rows: `177`.
- Source approval status: not source approved.
- Provider terms status: external provider terms pending.
- Redistribution status: not approved.
- Retention status: not approved.
- Target table posture: `staging_first`.
- Production `daily_prices` blocked.
- Public runtime boundary: `publicDataSource mock`.
- Score runtime boundary: `scoreSource mock`.

## Future Local Runner Shape

A later implementation may only produce a local sanitized report object. It must not read from a remote market source, connect to Supabase, run SQL, write files containing source-derived rows, or mutate any database.

The future local report-only runner shape is:

```json
{
  "laneId": "tw-equity",
  "symbols": ["2330", "2382", "2308"],
  "expectedTradingSessions": 60,
  "expectedRows": 180,
  "latestObservedRows": 3,
  "latestMissingRows": 177,
  "sourceRightsStatus": "not_source_approved",
  "providerTermsStatus": "external_provider_terms_pending",
  "redistributionStatus": "not_approved",
  "retentionStatus": "not_approved",
  "targetTablePosture": "staging_first",
  "productionDailyPricesBlocked": true,
  "validationStatus": "blocked_until_source_approval_and_report_only_implementation",
  "filesWritten": false,
  "mutations": false,
  "sqlExecuted": false,
  "supabaseWrites": false,
  "marketFetchAttempted": false,
  "marketIngestionAttempted": false,
  "secretsPrinted": false,
  "sourcePayloadsPrinted": false,
  "sourceDerivedRowsStored": false,
  "publicDataSource": "mock",
  "scoreSource": "mock"
}
```

The sample output is a contract sample only. It is not runtime evidence.

## Validation Contract

The future local report-only runner implementation must validate only local configuration and packet consistency:

- source-rights packet exists;
- report-only dry-run packet exists;
- lane id is `tw-equity`;
- symbol list is exactly `2330`, `2382`, `2308`;
- expected trading sessions is `60`;
- expected rows is `180`;
- latest observed rows is `3`;
- latest missing rows is `177`;
- source approval remains not source approved;
- external provider terms remain pending;
- redistribution remains not approved;
- retention remains not approved;
- target table posture remains `staging_first`;
- production `daily_prices` remains blocked;
- `publicDataSource mock` remains true;
- `scoreSource mock` remains true.

## Stop Lines

This design does not approve:

- SQL.
- Supabase connection.
- Supabase writes.
- staging rows.
- production `daily_prices` mutation.
- TWSE fetch.
- market-data ingestion.
- source-derived row storage.
- source payload commit.
- source payload printing.
- secret printing.
- public source promotion.
- `scoreSource=real`.
- row coverage points.
- investment advice, ranking, recommendation, model confidence, professional indicator claims, or performance claims.

## Implementation Gate

A future implementation requires a separate accepted implementation gate that names:

- exact local script path;
- exact output schema;
- exact no-network expectation;
- exact no-file-write expectation except stdout;
- exact post-run review requirement;
- exact failure behavior;
- exact checker to prove no forbidden imports or write APIs.

Without that separate implementation gate, this design remains `tw_equity_local_report_only_runner_design_ready_not_executable`.

## CEO Next Step

Next safe slice: prepare the local report-only runner implementation gate. It should permit only a no-network, no-Supabase, no-SQL local script that prints the sanitized sample object and exits.
