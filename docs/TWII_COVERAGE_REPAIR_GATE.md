# TWII Coverage Repair Gate

Updated: 2026-06-12

Status: `twii_coverage_repair_gate_ready_design_only_not_executable`

Owner: CEO/PM mainline

Decision route: `prepare_twii_coverage_repair_gate`

Primary support lanes:

- A1: `docs/A1_TWII_COVERAGE_REPAIR_GATE_PREREQ_CHECKLIST.md`
- A2: `docs/A2_TWII_COVERAGE_REPAIR_GATE_PUBLIC_COPY_GUARD.md`

## Purpose

This packet converts the Batch 1 route decision into a single PM-controlled local gate for TWII coverage repair.

It defines the exact future authorization shape that must exist before any later write or acceptance attempt can be proposed. It is not an execution packet and does not authorize SQL, Supabase connection, Supabase write, staging-row creation, `daily_prices` mutation, market-data fetch, market-data ingestion, candidate-row acceptance, row coverage scoring, public data-source promotion, or real score promotion.

## Current Route Facts

- routeDecisionReference=`docs/BATCH1_DATA_COVERAGE_ROUTE_DECISION_2026-06-12.md`
- decisionId=`batch1_route_decision_twii_first`
- targetSymbol=TWII
- targetLane=TWII
- targetRelation=daily_prices
- targetScope=twii_index_daily_prices_missing_rows
- currentObservedRows=0
- currentExpectedRows=60
- expectedMissingRows=60
- batchObservedRows=182
- batchExpectedRows=360
- batchMissingRows=178
- publicDataSource=mock
- scoreSource=mock
- executionAllowedNow=false
- sqlExecuted=false
- supabaseWriteAllowedNow=false
- dailyPricesMutationAllowedNow=false

These facts are aggregate-only planning values. They are not raw market data, candidate row payloads, source payloads, `stock_id` values, secrets, source-rights approval, field-contract approval, or write authorization.

## Gate Inputs

PM may keep this gate as ready for the next authorization-preparation slice only while all support inputs remain local-only and safe.

| Input | Required state | Current PM disposition |
| --- | --- | --- |
| Route decision | TWII first, bounded to 60 missing Batch 1 rows. | `accepted_for_gate_preparation` |
| A1 prerequisite checklist | Source-rights, field-contract, sanitized candidate artifact, target-table boundary, rollback/readback/post-run review prerequisites are named. | `accepted_as_local_support` |
| A2 public copy guard | Public wording keeps TWII in mock-facing coverage-repair language. | `accepted_as_local_support` |
| Existing insert contract | Future write mode remains bounded insert missing-only, max 60, no execution. | `reference_only` |
| Existing readback contract | Future review stays aggregate-only. | `reference_only` |

## Required Future Authorization

Any later execution or one-shot gate must be a separate, explicitly named packet. This document does not grant that authority.

The later packet must include all of these fields:

- `authorizationId`
- `operatorDecision`
- `targetSymbol=TWII`
- `targetRelation=daily_prices`
- `targetScope=twii_index_daily_prices_missing_rows`
- `maxRows=60`
- `writeMode=bounded_insert_missing_only`
- `duplicatePolicy=reject_duplicates`
- `sourceRightsDecisionReference`
- `fieldContractReference`
- `sanitizedCandidateArtifactReference`
- `rollbackOrDisablePlan`
- `aggregateReadbackPlan`
- `postRunReviewPlan`
- `oneAttemptMaximumRequired=true`
- `exactFutureAuthorizationRequired=true`
- `publicDataSource=mock`
- `scoreSource=mock`

The later packet must still fail closed if source-rights acceptance, field-contract acceptance, sanitized candidate artifact acceptance, target-table boundary, rollback readiness, aggregate readback, or post-run review is missing.

## Required Prerequisites

- sourceRightsPrerequisiteRequired=true
- fieldContractPrerequisiteRequired=true
- sanitizedCandidateArtifactRequired=true
- targetTableBoundaryRequired=true
- rollbackRetentionRequired=true
- postRunReviewRequired=true
- exactFutureAuthorizationRequired=true
- oneAttemptMaximumRequired=true

The sanitized candidate artifact may be referenced only as a local aggregate-only artifact. PM may review manifest/count/checksum/status fields, but this gate must not print row-level market values, raw source responses, copied source terms, source payloads, row payloads, row identifiers, `stock_id` values, tokens, cookies, or environment values.

## Stop Lines

Reject this gate or any derivative packet if it includes or implies:

- SQL execution or SQL text;
- Supabase connection, read, write, dashboard mutation, or schema mutation;
- staging-row creation;
- insert, update, delete, merge, upsert, backfill, or repair execution;
- `daily_prices` mutation;
- raw market-data fetch, ingestion, storage, commit, or source probing;
- candidate row acceptance;
- row coverage scoring;
- raw payloads, row payloads, source payloads, copied terms, `stock_id` values, secrets, env values, tokens, cookies, confirmation phrases, or operator values;
- `publicDataSource=supabase`;
- `scoreSource=real`;
- public launch, real-data, live-data, official-feed, investment-advice, forecast, return, timing, buy, sell, or hold claims.

## Public Copy Boundary

Public copy may say that TWII coverage repair is being prepared. It must not say that TWII coverage is complete, live data is enabled, Supabase-backed public data is active, real scoring is active, or `daily_prices` has been repaired.

Homepage and `/briefing` copy should stay close to this meaning:

> Public Beta remains in mock mode while TWII coverage repair is prepared. Live TWII data and real scoring are not enabled yet. Signals are reading aids only, not investment advice.

## PM Acceptance

PM accepts this packet only as a local, non-executing coverage repair gate:

- A1 prerequisite support is present.
- A2 public copy guard is present.
- TWII remains `0/60`.
- The target relation remains `daily_prices`.
- The target scope remains `twii_index_daily_prices_missing_rows`.
- The future row bound remains `60`.
- Public runtime remains `publicDataSource=mock`.
- Scoring remains `scoreSource=mock`.
- No SQL, Supabase action, staging row, `daily_prices` mutation, market-data fetch/ingest/store/commit, candidate-row acceptance, row coverage scoring, public source promotion, or real score promotion is authorized.

## Next Route

If this gate passes local checks, the next PM mainline route is:

`prepare_twii_one_shot_authorization_packet_without_execution`

That next route may prepare a future authorization packet, but it still must not execute SQL, connect to Supabase, write Supabase, create staging rows, modify `daily_prices`, fetch or ingest market data, print secrets, accept candidate rows, score row coverage, promote public source, or set real score unless a later explicit authorization and post-run review gate separately permits it.
