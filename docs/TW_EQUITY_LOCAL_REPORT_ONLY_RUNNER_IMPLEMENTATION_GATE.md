# TW Equity Local Report-Only Runner Implementation Gate

Updated: 2026-06-06

Status: `tw_equity_local_report_only_runner_implementation_gate_ready_not_executed`.

Trigger: `docs/TW_EQUITY_LOCAL_REPORT_ONLY_RUNNER_DESIGN.md`.

Required inputs:

- `docs/TW_EQUITY_REPORT_ONLY_DRY_RUN_PACKET.md`.
- `docs/TW_EQUITY_SOURCE_RIGHTS_PACKET.md`.

## Purpose

This gate defines the narrow implementation boundary for a future local report-only TW equity runner.

It permits planning for a future local script only. It does not create that script, execute that script, connect to any remote service, read market sources, write files, write Supabase, run SQL, create staging rows, mutate production `daily_prices`, promote public source, award row coverage points, or set `scoreSource=real`.

## Allowed Future Implementation Scope

A later accepted implementation may create only this local script path:

- `scripts/report-tw-equity-local-report-only-dry-run.mjs`.

That future script may only:

- read local packet files;
- validate packet consistency;
- build one sanitized sample object;
- print JSON to stdout;
- exit with status `0` when local packet consistency passes;
- exit non-zero when local packet consistency fails.

That future script must be no-network, no-Supabase, no-SQL, no-file-write except stdout, and no market-data fetch/ingestion.

## Required Output Schema

The future local script must print exactly one JSON object with these fields:

- `status`.
- `laneId`.
- `symbols`.
- `expectedTradingSessions`.
- `expectedRows`.
- `latestObservedRows`.
- `latestMissingRows`.
- `sourceRightsStatus`.
- `providerTermsStatus`.
- `redistributionStatus`.
- `retentionStatus`.
- `targetTablePosture`.
- `productionDailyPricesBlocked`.
- `validationStatus`.
- `filesWritten`.
- `mutations`.
- `sqlExecuted`.
- `supabaseConnectionAttempted`.
- `supabaseWrites`.
- `marketFetchAttempted`.
- `marketIngestionAttempted`.
- `secretsPrinted`.
- `sourcePayloadsPrinted`.
- `sourceDerivedRowsStored`.
- `publicDataSource`.
- `scoreSource`.

Required sample values:

```json
{
  "status": "blocked_until_source_approval",
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
  "validationStatus": "local_packet_consistency_only",
  "filesWritten": false,
  "mutations": false,
  "sqlExecuted": false,
  "supabaseConnectionAttempted": false,
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

## Required Implementation Checker

The future implementation must include a checker that proves:

- the local script exists at the exact path;
- the local script contains no remote-network API usage;
- the local script contains no Supabase client import;
- the local script contains no environment-secret reads;
- the local script contains no database write API;
- the local script contains no filesystem write API;
- the output schema includes all required fields;
- the sample values remain mock-only;
- `publicDataSource` is `mock`;
- `scoreSource` is `mock`;
- `supabaseConnectionAttempted` is `false`;
- `supabaseWrites` is `false`;
- `sqlExecuted` is `false`;
- `marketFetchAttempted` is `false`;
- `marketIngestionAttempted` is `false`;
- `sourceDerivedRowsStored` is `false`.

## Stop Lines

This gate does not approve:

- SQL.
- Supabase connection.
- Supabase writes.
- staging rows.
- production `daily_prices` mutation.
- TWSE source retrieval.
- market-data ingestion.
- source-derived row storage.
- source payload commit.
- source payload printing.
- secret printing.
- public source promotion.
- `scoreSource=real`.
- row coverage points.
- investment advice, ranking, recommendation, model confidence, professional indicator claims, or performance claims.

## Acceptance Criteria

This gate is accepted for future local implementation only when:

- the design packet remains `tw_equity_local_report_only_runner_design_ready_not_executable`;
- the source-rights packet remains not source approved;
- external provider terms remain pending;
- redistribution remains not approved;
- retention remains not approved;
- the output schema is sanitized;
- all future implementation constraints are no-network, no-Supabase, no-SQL, stdout-only, and mock-only.

## CEO Next Step

Next safe slice: implement `scripts/report-tw-equity-local-report-only-dry-run.mjs` and a matching checker under this gate. The implementation must print the sanitized sample object only and must keep all stop lines false.
