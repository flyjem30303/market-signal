# A1 Decision Intake Recorder Mock Contract Review

Status: `a1_decision_intake_recorder_mock_contract_review_ready`

Date: 2026-06-11

Owner lane: A1 Data / Recorder Contract Support Line

Scope: `contract-only / mock-recorder-only / no-execution`

Purpose: review the field contract for the PM mainline `TWII decision intake recorder mock gate`. This document covers only the local mock-recorder contract expected to reference `data/source-gates/twii-real-decision-acceptance-dry-run-gate-preflight.json` and `data/source-gates/twii-real-decision-acceptance-dry-run-fixtures.json`.

This review does not execute SQL, connect to Supabase, import `@supabase/supabase-js`, create a Supabase client, call `.from`, `.insert`, `.update`, `.delete`, or `.upsert`, read env values, read secrets, read authorization values, read confirmation phrases, read real decision values, fetch market data, read raw payloads, read row payloads, read stock-id payloads, create staging rows, mutate `daily_prices`, accept candidate rows, set `publicDataSource=supabase`, set `scoreSource=real`, or authorize execution.

## Contract Inputs

The PM recorder mock gate may reference these inputs by path and schema only:

| Input | A1 review posture | Value access allowed |
| --- | --- | --- |
| `data/source-gates/twii-real-decision-acceptance-dry-run-gate-preflight.json` | Source gate for local dry-run acceptance, rejection, and repair-required routing. | `false` |
| `data/source-gates/twii-real-decision-acceptance-dry-run-fixtures.json` | Synthetic fixture source for recorder mock cases. | `false` |

Any next step that requires reading hidden values, row contents, source payloads, raw payloads, stock-id payloads, env, secrets, authorization, confirmation phrases, or real decision values is outside this review and must fail closed.

## Required Recorder Fields

The recorder mock should accept only allowlisted metadata fields that can be populated without forbidden value access.

| Field | Required contract state |
| --- | --- |
| `recordId` | Stable local mock record identifier. Must not encode a hidden value or row key. |
| `sourceCaseId` | Reference to the synthetic fixture case or dry-run case label only. |
| `decisionStatus` | Must be exactly one of `accepted`, `rejected`, or `repair_required`. |
| `recordMode` | Must state `mock_recorder_only`, `dry_run_only`, or equivalent non-executing local mode. |
| `auditRole` | Role label only, such as `PM` or `A1`; no credential, account, token, or personal authorization value. |
| `auditTimestampLabel` | Review label or mock timestamp label only; no secret-bearing runtime timestamp source. |
| `decisionReasonSummary` | Sanitized schema-level summary only; no real decision value, authorization value, phrase, row payload, raw payload, stock-id payload, or market value. |
| `repairRequiredSummary` | Required when `decisionStatus=repair_required`; sanitized schema-level repair note only. Empty or omitted for valid `accepted` and `rejected` records unless PM wants a fixed blank label. |
| `publicDataSource` | Must remain `mock`. |
| `scoreSource` | Must remain `mock`. |
| `dryRunOnly` | Must be `true`. |
| `recordedAsReal` | Must be `false`. |

Recommended supporting safety fields:

- `fixtureOnly=true`
- `syntheticFixtureOnly=true`
- `executionAllowedNow=false`
- `runnerExecutableNow=false`
- `sqlExecuted=false`
- `supabaseClientImported=false`
- `supabaseConnectionAttempted=false`
- `supabaseWritesEnabled=false`
- `supabaseReadsEnabled=false`
- `marketDataFetched=false`
- `marketDataIngested=false`
- `dailyPricesMutated=false`
- `stagingRowsCreated=false`
- `candidateRowsAccepted=false`
- `rawPayloadOutput=false`
- `rowPayloadOutput=false`
- `stockIdPayloadOutput=false`
- `secretsOutput=false`
- `envValueOutput=false`
- `realDecisionValueReadNow=false`
- `realDecisionValueRecordedNow=false`

Allowed fields do not imply that all values may be read. If a field cannot be populated without forbidden access, the recorder mock must mark the case `repair_required` or `rejected` rather than trying to inspect the value.

## Status Transition Rules

The recorder mock has exactly three status routes. All routes preserve `publicDataSource=mock`, `scoreSource=mock`, `dryRunOnly=true`, and `recordedAsReal=false`.

### `accepted`

The recorder mock may transition a synthetic fixture case to `accepted` only when the record is complete, allowlisted, no-secret, no-payload, mock-only, and non-executing.

Required semantics:

- `decisionStatus=accepted`
- `recordMode` remains mock-recorder or dry-run only.
- `decisionReasonSummary` is sanitized and schema-level only.
- all execution, Supabase, write, payload, secret, env, row-read, market-data, candidate-row, and real-decision-value flags remain false.
- `accepted` means the mock record shape is acceptable for PM review only.

Forbidden meaning:

- `accepted` must not mean candidate rows are accepted.
- `accepted` must not mean real decision values were read or recorded.
- `accepted` must not authorize execution, runner enablement, Supabase connection, `daily_prices` mutation, source promotion, public launch, or `scoreSource=real`.

Forbidden fields:

- `decisionValue`
- `realDecisionValue`
- `authorizationValue`
- `confirmationPhraseValue`
- `credentialValue`
- `envValue`
- `secretValue`
- `sourcePayload`
- `rawPayload`
- `rowPayload`
- `stockIdPayload`
- `rowBody`
- `tradeDateList`
- `marketValue`
- `sql`
- `supabaseUrl`
- `supabaseKey`
- `writeResult`
- `stagingRowBody`
- `dailyPricesRowBody`

### `rejected`

The recorder mock must transition a synthetic fixture case to `rejected` when forbidden content, unsafe promotion intent, malformed status, or execution/write/runtime intent appears.

Required semantics:

- `decisionStatus=rejected`
- rejection can be decided from field presence, unsafe labels, conflicting flags, unknown status, or forbidden intent.
- rejection must not require reading real decision values, secrets, authorization, confirmation phrases, row payloads, raw payloads, stock-id payloads, market values, SQL bodies, or Supabase state.
- `decisionReasonSummary` states the stop condition at a safe summary level.

Forbidden fields:

- all value and payload fields forbidden in the `accepted` route.
- any field that claims `publicDataSource=supabase`, `scoreSource=real`, `dryRunOnly=false`, `recordedAsReal=true`, `candidateRowsAccepted=true`, `dailyPricesMutated=true`, `stagingRowsCreated=true`, `supabaseConnectionAttempted=true`, or `sqlExecuted=true`.
- any field that treats rejection as a repair execution instruction, runtime probe instruction, data-fetch request, row acceptance path, write attempt, rollback execution, or promotion route.

### `repair_required`

The recorder mock may transition a synthetic fixture case to `repair_required` when the record is safe to describe but incomplete, inconsistent, stale, or missing required schema-level metadata.

Required semantics:

- `decisionStatus=repair_required`
- `repairRequiredSummary` is present and sanitized.
- repair is document, fixture, or gate-shape repair only.
- repair must not ask A1, PM, or a runner to inspect forbidden values, fetch market data, create staging rows, mutate `daily_prices`, connect to Supabase, or fill a real decision value.

Valid repair reasons:

- missing `recordId`
- missing `sourceCaseId`
- missing or unsupported `decisionStatus`
- missing `recordMode`
- missing `auditRole`
- missing `auditTimestampLabel`
- missing `decisionReasonSummary`
- missing `repairRequiredSummary` for a repair-required case
- missing `publicDataSource=mock`
- missing `scoreSource=mock`
- missing `dryRunOnly=true`
- missing `recordedAsReal=false`
- conflicting safety booleans
- stale or mismatched dry-run gate path reference

Forbidden fields:

- all value and payload fields forbidden in the `accepted` route.
- any repair instruction that requires runtime reads, row inspection, payload inspection, source fetch, SQL, Supabase, staging row creation, `daily_prices` mutation, candidate row acceptance, or public/real-source promotion.

## Fail-Closed Stop Conditions

The recorder mock gate must stop and return `rejected` or `repair_required` when any condition below is true, unclear, stale, or required to proceed:

- SQL execution, SQL preparation, or SQL body review is requested.
- Supabase import, client creation, connection, read, write, or query-chain usage is requested.
- `.from`, `.insert`, `.update`, `.delete`, or `.upsert` usage is requested.
- Env, secret, credential, authorization, confirmation phrase, execute-switch, or real decision values must be read, printed, copied, compared, derived, or stored.
- Candidate rows, raw payloads, row payloads, source payloads, stock-id payloads, trade-date lists, per-date values, or market values must be read or output.
- Market data must be fetched, imported, ingested, transformed, refreshed, stored, or committed.
- Staging rows must be created, accepted, repaired, or used as proof.
- `daily_prices` must be inserted, updated, deleted, merged, upserted, repaired, or otherwise mutated.
- Candidate rows are treated as accepted.
- `publicDataSource=supabase` or `scoreSource=real` appears, is requested, or is implied.
- `dryRunOnly=false` appears.
- `recordedAsReal=true` appears.
- `accepted` is treated as real execution approval, final authorization, write readiness, launch readiness, public promotion, source promotion, or real-score activation.
- A record includes forbidden fields, unknown payload containers, encoded or obfuscated content, external URLs requiring access, multiple conflicting status labels, or non-allowlisted decision statuses.

Fail-closed output is a blocked mock-recorder status, not a retry instruction, repair execution instruction, runtime probe, source fetch, staging route, write attempt, rollback execution, or promotion route.

## PM Integration Notes

- PM can use this file as the A1 contract checklist for a local-only recorder mock gate.
- The recorder mock should validate the three routes from the dry-run fixtures: `accepted`, `rejected`, and `repair_required`.
- The gate should treat the dry-run preflight and fixture files as schema references only.
- The mock recorder should emit or store only sanitized metadata fields.
- The mock recorder should keep `publicDataSource=mock`, `scoreSource=mock`, `dryRunOnly=true`, and `recordedAsReal=false` on every route.
- The mock recorder should fail closed if a required field is missing, if a forbidden field appears, or if deciding the route would require forbidden access.
- `accepted` is PM-review readiness for the mock record shape only; it is not candidate-row acceptance, real decision recording, execution authorization, write readiness, or public promotion.
- Any future real recorder, real decision intake, Supabase write path, `daily_prices` mutation, or real-source promotion must be handled by a separate explicitly authorized contract outside this mock gate.

