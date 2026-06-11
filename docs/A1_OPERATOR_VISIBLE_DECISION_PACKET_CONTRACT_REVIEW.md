# A1 Operator-Visible Decision Packet Contract Review

Status: `a1_operator_visible_decision_packet_contract_review_ready`

Date: 2026-06-11

Owner lane: A1 Data / Operator Packet Contract Line

Scope: `contract-only / operator-packet-only / no-execution`

Purpose: review the field contract for the PM mainline `TWII operator-visible decision packet readiness gate`. This document covers only the local operator-visible packet shape expected to reference `data/source-gates/twii-decision-intake-recorder-mock-gate-preflight.json` and `data/source-gates/twii-decision-intake-recorder-mock-records.json` by path and schema label.

This review does not execute SQL, connect to Supabase, import `@supabase/supabase-js`, create a Supabase client, call `.from`, `.insert`, `.update`, `.delete`, or `.upsert`, read env values, read secrets, read authorization values, read confirmation phrases, read real decision values, fetch market data, read raw payloads, read row payloads, read stock-id payloads, create staging rows, mutate `daily_prices`, accept candidate rows, set `publicDataSource=supabase`, set `scoreSource=real`, or authorize execution.

## Contract Inputs

The PM readiness gate may reference these inputs by path and contract role only:

| Input | A1 review posture | Value access allowed |
| --- | --- | --- |
| `data/source-gates/twii-decision-intake-recorder-mock-gate-preflight.json` | Source gate for the mock recorder contract and readiness stop lines. | `false` |
| `data/source-gates/twii-decision-intake-recorder-mock-records.json` | Mock-record packet source for operator-visible readiness review. | `false` |

Any next step that requires reading hidden values, row contents, source payloads, raw payloads, stock-id payloads, env, secrets, authorization, confirmation phrases, market values, or real decision values is outside this review and must fail closed.

## Required Packet Fields

The operator-visible packet should expose only allowlisted metadata fields that can be populated without forbidden value access.

| Field | Required contract state |
| --- | --- |
| `packetId` | Stable local packet identifier. Must not encode a hidden value, row key, credential, authorization value, confirmation phrase, stock id payload, or real decision value. |
| `sourceRecordId` | Reference to the mock recorder record label only. It must not require reading the record body, raw payload, row payload, or market data. |
| `decisionStatus` | Safe status label carried from the recorder contract at summary level only. It must not contain or imply a real decision value. |
| `operatorActionRequired` | Boolean or enum indicating whether the operator must review, accept for future intake, reject, or request repair. It must not instruct execution. |
| `operatorVisibleSummary` | Sanitized schema-level summary suitable for operator review. It must not include secrets, env values, authorization, confirmation phrase, raw payload, row payload, stock-id payload, market values, candidate rows, or real decision values. |
| `operatorReviewStatus` | Must be exactly one of the allowed labels listed in this document. |
| `missingValuePlaceholders` | Explicit placeholder list for values not filled in this local review. Placeholders must remain labels only and must not be replaced with real values. |
| `auditRole` | Role label only, such as `PM`, `A1`, or `Operator`. No credential, identity secret, token, or authorization value. |
| `auditTimestampLabel` | Review timestamp label or placeholder only. It must not depend on secret-bearing runtime state. |
| `publicDataSource` | Must remain `mock`. |
| `scoreSource` | Must remain `mock`. |
| `executionAllowedNow` | Must be `false`. |
| `recordedAsReal` | Must be `false`. |

Recommended supporting safety fields:

- `operatorPacketOnly=true`
- `contractOnly=true`
- `localOnly=true`
- `mockRecorderOnly=true`
- `sourceRecordsReferencedByPathOnly=true`
- `sourceRecordValuesRead=false`
- `realDecisionValueReadNow=false`
- `realDecisionValueRecordedNow=false`
- `sqlExecuted=false`
- `supabaseClientImported=false`
- `supabaseConnectionAttempted=false`
- `supabaseReadsEnabled=false`
- `supabaseWritesEnabled=false`
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

If any required packet field cannot be populated without forbidden access, the readiness gate must preserve the missing field as a placeholder and route the packet to `repair_required_before_real_intake` or `rejected_for_future_real_intake`. It must not inspect the forbidden value to complete the packet.

## Allowed Operator Review Statuses

The operator-visible packet should accept exactly these review statuses:

| Status | Meaning | Execution meaning |
| --- | --- | --- |
| `pending_operator_review` | Packet is safely shaped and awaits operator review. | None. It does not authorize reads, writes, real intake, or runner execution. |
| `accepted_for_future_real_intake` | Operator accepts the packet shape for a future separately authorized real-intake path. | None now. It does not accept candidate rows, fill values, write rows, or set real sources. |
| `rejected_for_future_real_intake` | Operator rejects the packet shape or identifies a stop-line conflict. | None. It blocks the packet. |
| `repair_required_before_real_intake` | Packet is safe to describe but incomplete, stale, inconsistent, or missing required schema-level metadata. | None. Repair is document or contract-shape repair only. |

Any alternate label, promotion label, execution label, write label, launch label, pass label, real-source label, or row-acceptance label must fail closed unless PM creates a separate reviewed contract.

## Missing-Value Placeholder Rules

`missingValuePlaceholders` is required whenever the operator-visible packet would otherwise need a forbidden value to look complete.

Allowed placeholder patterns:

- `not_filled_in_local_contract_review`
- `operator_to_review_outside_this_packet`
- `future_authorized_intake_required`
- `withheld_no_secret_value_access`
- `withheld_no_real_decision_value_access`
- `withheld_no_payload_access`

Placeholder requirements:

- Placeholders must be explicit, stable, and operator-visible.
- Placeholders must state why a value is absent at a schema level only.
- Placeholders must not contain real decision values, env values, secrets, authorization values, confirmation phrases, row bodies, raw payloads, stock-id payloads, candidate row contents, market data, SQL bodies, Supabase URLs, Supabase keys, or write results.
- A placeholder cannot be treated as acceptance, execution permission, staging proof, row proof, real-data proof, or public-source proof.
- A missing required value must route to `pending_operator_review` only when the omission is expected and clearly represented by a safe placeholder; otherwise it must route to `repair_required_before_real_intake` or `rejected_for_future_real_intake`.

## Audit Field Rules

Audit fields are for traceability of the review packet only.

Required audit posture:

- `auditRole` is a lane or role label only.
- `auditTimestampLabel` is a label or placeholder only.
- Audit fields must not include personal authorization values, confirmation phrase values, credential material, env-derived values, secrets, runtime tokens, IP-bound evidence, database response bodies, or source payloads.
- Audit fields must not imply that the operator approved a real run, accepted rows, or authorized writes.
- Audit fields must preserve `publicDataSource=mock`, `scoreSource=mock`, `executionAllowedNow=false`, and `recordedAsReal=false`.

## Status-Specific Contract

### `pending_operator_review`

Allowed when:

- all required packet fields are present or safely represented by explicit missing-value placeholders.
- `operatorVisibleSummary` is sanitized and schema-level only.
- `publicDataSource=mock`.
- `scoreSource=mock`.
- `executionAllowedNow=false`.
- `recordedAsReal=false`.
- all Supabase, SQL, write, payload, secret, env, market-data, staging-row, candidate-row, and real-decision-value flags remain false.

Forbidden meaning:

- It does not mean the packet is accepted for real intake.
- It does not authorize execution, writes, reads, source promotion, real scoring, market-data fetch, candidate-row acceptance, or `daily_prices` mutation.

### `accepted_for_future_real_intake`

Allowed when:

- the operator-visible packet shape is complete, sanitized, no-secret, no-payload, mock-only, and contract-ready for a future separately authorized real-intake workflow.
- acceptance is limited to packet-shape readiness.
- `executionAllowedNow=false` and `recordedAsReal=false` remain unchanged.

Forbidden meaning:

- It must not mean a real decision value was read, filled, accepted, or recorded.
- It must not accept candidate rows or staging rows.
- It must not set `publicDataSource=supabase` or `scoreSource=real`.
- It must not authorize SQL, Supabase connection, runner execution, market-data fetch, or `daily_prices` mutation.

### `rejected_for_future_real_intake`

Required when:

- forbidden fields or forbidden intent appear.
- an unknown review status appears.
- `publicDataSource=supabase`, `scoreSource=real`, `executionAllowedNow=true`, or `recordedAsReal=true` appears or is implied.
- the packet asks for SQL, Supabase, env, secrets, authorization, confirmation phrases, raw payloads, row payloads, stock-id payloads, market data, staging rows, candidate-row acceptance, or `daily_prices` mutation.
- the packet cannot be reviewed without reading forbidden values.

Required semantics:

- rejection is decided from field names, labels, flags, path posture, and safe summary-level contract conflicts only.
- rejection must not require reading the underlying forbidden value.
- `operatorVisibleSummary` may name the stop condition at a safe summary level.

### `repair_required_before_real_intake`

Allowed when:

- the packet is safe to describe but incomplete, stale, inconsistent, or missing schema-level metadata.
- repair can be completed by adjusting contract fields, placeholders, labels, or documentation without forbidden access.

Valid repair reasons:

- missing `packetId`
- missing `sourceRecordId`
- missing `decisionStatus`
- missing `operatorActionRequired`
- missing `operatorVisibleSummary`
- missing or unsupported `operatorReviewStatus`
- missing `missingValuePlaceholders` when a value is intentionally absent
- missing `auditRole`
- missing `auditTimestampLabel`
- missing `publicDataSource=mock`
- missing `scoreSource=mock`
- missing `executionAllowedNow=false`
- missing `recordedAsReal=false`
- conflicting safety booleans
- stale or mismatched source gate path reference

Forbidden repair instructions:

- read or infer real decision values.
- fetch or inspect market data.
- read raw payloads, row payloads, stock-id payloads, candidate rows, or record bodies.
- run SQL, connect to Supabase, create a client, or call query-chain methods.
- create staging rows, mutate `daily_prices`, accept candidate rows, or enable real scoring.

## Forbidden Fields

The operator-visible packet must reject or require repair if any of these fields appear as value-bearing fields:

- `decisionValue`
- `realDecisionValue`
- `authorizationValue`
- `confirmationPhraseValue`
- `executeSwitchValue`
- `credentialValue`
- `envValue`
- `secretValue`
- `sourcePayload`
- `rawPayload`
- `rowPayload`
- `stockIdPayload`
- `rowBody`
- `recordBody`
- `candidateRowBody`
- `stagingRowBody`
- `dailyPricesRowBody`
- `tradeDateList`
- `marketValue`
- `sql`
- `supabaseUrl`
- `supabaseKey`
- `writeResult`

Safe path labels may be referenced only when they do not require reading the value-bearing contents.

## Fail-Closed Stop Conditions

The PM readiness gate must stop and return `rejected_for_future_real_intake` or `repair_required_before_real_intake` when any condition below is true, unclear, stale, or required to proceed:

- SQL execution, SQL preparation, SQL body review, or SQL result review is requested.
- Supabase import, client creation, connection, read, write, or query-chain usage is requested.
- `.from`, `.insert`, `.update`, `.delete`, or `.upsert` usage is requested.
- Env, secret, credential, authorization, confirmation phrase, execute-switch, or real decision values must be read, printed, copied, compared, derived, filled, or stored.
- Candidate rows, raw payloads, row payloads, source payloads, stock-id payloads, record bodies, trade-date lists, per-date values, or market values must be read or output.
- Market data must be fetched, imported, ingested, transformed, refreshed, stored, or committed.
- Staging rows must be created, accepted, repaired, or used as proof.
- `daily_prices` must be inserted, updated, deleted, merged, upserted, repaired, or otherwise mutated.
- Candidate rows are treated as accepted.
- `publicDataSource=supabase` appears, is requested, or is implied.
- `scoreSource=real` appears, is requested, or is implied.
- `executionAllowedNow=true` appears, is requested, or is implied.
- `recordedAsReal=true` appears, is requested, or is implied.
- `operatorReviewStatus` is absent, unknown, overloaded, or mapped to execution permission.
- `accepted_for_future_real_intake` is treated as present authorization rather than future-shape acceptance.
- A missing-value placeholder is replaced with a real value inside this local contract review.
- The packet requires reading `data/source-gates/twii-decision-intake-recorder-mock-records.json` contents rather than referencing its path and schema role.

## PM Integration Notes

PM can integrate this A1 review as the operator-visible contract companion to the local-only readiness gate.

Recommended PM gate behavior:

- Validate packet shape before showing the packet to an operator.
- Treat `operatorReviewStatus` as the operator-facing review route and keep it distinct from recorder-level `decisionStatus`.
- Require `missingValuePlaceholders` for all intentionally absent values.
- Display `operatorVisibleSummary` only after confirming it contains no forbidden values or payloads.
- Enforce `publicDataSource=mock`, `scoreSource=mock`, `executionAllowedNow=false`, and `recordedAsReal=false` on every route.
- Keep the source-gate and mock-record file references as path labels unless a separate reviewed task explicitly allows value access.
- Fail closed on unknown fields, unknown statuses, conflicting safety booleans, or any promotion/write/runtime intent.
- Do not treat this file as SQL authorization, Supabase authorization, source promotion, real-intake approval, candidate-row acceptance, or `daily_prices` mutation approval.

PM handoff summary:

- A1 status is `a1_operator_visible_decision_packet_contract_review_ready`.
- A1 scope is `contract-only / operator-packet-only / no-execution`.
- The allowed operator review statuses are fixed to `pending_operator_review`, `accepted_for_future_real_intake`, `rejected_for_future_real_intake`, and `repair_required_before_real_intake`.
- The packet remains mock-only and operator-visible only until a separate, explicit, reviewed, no-secret real-intake authorization path exists.
