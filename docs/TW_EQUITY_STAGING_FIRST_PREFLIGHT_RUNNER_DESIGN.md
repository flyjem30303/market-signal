# TW Equity Staging-First Preflight Runner Design

Updated: 2026-06-06

Status: `tw_equity_staging_first_preflight_runner_design_ready_no_execution`.

Trigger: `docs/TW_EQUITY_STAGING_FIRST_AUTHORIZATION_PACKET.md`.

## Purpose

This design defines a stdout-only staging-first preflight runner for the TW equity lane. It prepares the exact report shape needed before any future staging write authorization.

It does not approve execution. It does not run SQL, connect to Supabase, write Supabase, create staging rows, modify production `daily_prices`, fetch market data, ingest market data, store source-derived rows, print secrets, print source payloads, promote public Supabase data-source mode, award row coverage points, or set `scoreSource=real`.

## Runner Path

Future local runner path: `scripts/report-tw-equity-staging-first-preflight.mjs`.

The runner must be:

- stdout-only;
- no-network;
- no-Supabase;
- no-SQL;
- no-file-write;
- sample / packet-consistency only;
- deterministic from local packet constants.

## Input Packets

The runner may read only local packet text:

- `docs/DATA_REALIFICATION_ACCELERATION_GATE.md`;
- `docs/TW_EQUITY_STAGING_FIRST_AUTHORIZATION_PACKET.md`;
- `docs/TW_EQUITY_SOURCE_REVIEW_READINESS_SUMMARY.md`;
- `docs/TW_EQUITY_REPORT_ONLY_DRY_RUN_PACKET.md`.

## Output Contract

The runner must emit JSON with:

- `status`: `blocked_until_source_classification_and_write_authorization`;
- `laneId`: `tw-equity`;
- `symbols`: `2330`, `2382`, `2308`;
- `expectedTradingSessions`: `60`;
- `expectedRows`: `180`;
- `latestObservedRows`: `3`;
- `latestMissingRows`: `177`;
- `sourceClassificationStatus`: `waiting_human_source_legal_classification`;
- `targetRelationProposal`: `tw_equity_daily_prices_staging`;
- `productionDailyPricesBlocked`: `true`;
- `requiredAuthorizationMissing`: authorization id, exact command, target relation, maximum rows allowed, service-role posture, RLS posture, rollback owner, retention window, and post-run review artifact path;
- `validationRulesSummary`;
- `rollbackPosture`: `required_not_authorized`;
- `retentionPosture`: `required_not_authorized`;
- `postRunReviewReadiness`: `template_fields_defined_not_executable`;
- `filesWritten`: `false`;
- `mutations`: `false`;
- `sqlExecuted`: `false`;
- `supabaseConnectionAttempted`: `false`;
- `supabaseWrites`: `false`;
- `marketDataFetched`: `false`;
- `marketDataIngested`: `false`;
- `sourcePayloadsPrinted`: `false`;
- `secretsPrinted`: `false`;
- `publicDataSource`: `mock`;
- `scoreSource`: `mock`.

## CEO / PM Decision

CEO approves implementing this stdout-only preflight runner as the next safe acceleration slice. PM must keep it local-only and must not combine it with source retrieval, SQL, Supabase access, staging writes, or runtime promotion.

## Stop Lines

Stop before:

- SQL;
- Supabase connection;
- Supabase write;
- staging row creation;
- production `daily_prices` mutation;
- market-data fetch;
- market-data ingestion;
- source-derived row storage;
- source payload printing;
- secret printing;
- public source promotion;
- real score-source activation.
