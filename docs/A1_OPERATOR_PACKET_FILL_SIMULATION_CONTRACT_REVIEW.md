# A1 Operator Packet Fill Simulation Contract Review

Status: `a1_operator_packet_fill_simulation_contract_review_ready`

Date: 2026-06-11

Owner lane: A1 Data / Fill Simulation Contract Line

Scope: `contract-only / placeholder-only / no-execution`

Purpose: review the placeholder-only field contract for the PM mainline `TWII operator packet fill simulation gate`. This document covers only the local fill simulation shape expected to sit after `data/source-gates/twii-operator-visible-decision-packet-readiness-gate-preflight.json` and `data/source-gates/twii-operator-visible-decision-packet-readiness-fixtures.json`.

This review does not execute SQL, connect to Supabase, import `@supabase/supabase-js`, create a Supabase client, call `.from`, `.insert`, `.update`, `.delete`, or `.upsert`, read env values, read secrets, read authorization values, read confirmation phrases, read real decision values, fetch market data, read raw payloads, read row payloads, read stock-id payloads, create staging rows, mutate `daily_prices`, accept candidate rows, set `publicDataSource=supabase`, set `scoreSource=real`, or authorize execution.

## Contract Inputs

The PM fill simulation gate may reference these inputs by path and contract role only:

| Input | A1 review posture | Value access allowed |
| --- | --- | --- |
| `data/source-gates/twii-operator-visible-decision-packet-readiness-gate-preflight.json` | Source gate for operator-visible packet readiness fields and stop lines. | `false` |
| `data/source-gates/twii-operator-visible-decision-packet-readiness-fixtures.json` | Synthetic operator packet fixture source for simulation cases. | `false` |

Any next step that requires reading hidden values, row contents, source payloads, raw payloads, stock-id payloads, env, secrets, authorization, confirmation phrases, market values, candidate rows, or real decision values is outside this review and must fail closed.

## Required Simulation Fields

The fill simulation should expose only allowlisted placeholder metadata fields that can be populated without forbidden value access.

| Field | Required contract state |
| --- | --- |
| `simulationId` | Stable local simulation identifier. Must not encode a hidden value, row key, credential, authorization value, confirmation phrase, stock id payload, or real decision value. |
| `sourcePacketId` | Reference to the operator-visible packet label only. It must not require reading packet bodies, raw payloads, row payloads, candidate rows, or market data. |
| `decisionStatus` | Safe status label carried from the source packet at summary level only. It must not contain or imply a real decision value. |
| `simulatedReviewStatus` | Must be exactly one of the allowed labels listed in this document. |
| `simulatedRecordedBy` | Placeholder label only. It must not contain a real person authorization value, credential, account secret, confirmation phrase, or identity proof. |
| `simulatedRecordedAt` | Placeholder timestamp label only. It must not depend on secret-bearing runtime state or real execution evidence. |
| `simulatedReasonSummary` | Sanitized placeholder summary only. It must not include real decision values, authorization values, confirmation phrases, row payloads, raw payloads, stock-id payloads, candidate rows, or market values. |
| `simulatedRepairSummary` | Required when `simulatedReviewStatus=simulated_repair_required_before_real_intake`; placeholder summary only. Empty or omitted for accepted and rejected simulation cases unless PM wants a fixed blank placeholder. |
| `placeholdersStillSynthetic` | Must be `true`. This is the main assertion that no placeholder was replaced by a real value. |
| `publicDataSource` | Must remain `mock`. |
| `scoreSource` | Must remain `mock`. |
| `executionAllowedNow` | Must be `false`. |
| `recordedAsReal` | Must be `false`. |

Recommended supporting safety fields:

- `contractOnly=true`
- `localOnly=true`
- `placeholderOnly=true`
- `fillSimulationOnly=true`
- `operatorPacketOnly=true`
- `sourcePacketReferencedByPathOnly=true`
- `sourcePacketValuesRead=false`
- `realDecisionValueReadNow=false`
- `realDecisionValueFilledNow=false`
- `realDecisionValueRecordedNow=false`
- `authorizationValuesRead=false`
- `confirmationPhraseValueRead=false`
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

If any required simulation field cannot be populated without forbidden access, the fill simulation gate must keep the field as an explicit placeholder and route the case to `simulated_repair_required_before_real_intake` or `simulated_rejected_for_future_real_intake`. It must not inspect the forbidden value to complete the simulation.

## Allowed Simulated Review Statuses

The fill simulation gate should accept exactly these simulated review statuses:

| Status | Meaning | Execution meaning |
| --- | --- | --- |
| `simulated_accepted_for_future_real_intake` | The placeholder-filled packet shape is acceptable for a future separately authorized real-intake workflow. | None now. It does not accept candidate rows, fill real values, write rows, or set real sources. |
| `simulated_rejected_for_future_real_intake` | The placeholder-filled packet shape is rejected or contains a stop-line conflict. | None. It blocks the simulated path. |
| `simulated_repair_required_before_real_intake` | The placeholder-filled packet is safe to describe but incomplete, stale, inconsistent, or missing required schema-level metadata. | None. Repair is document, fixture, or contract-shape repair only. |

Any alternate label, promotion label, execution label, write label, launch label, pass label, real-source label, or row-acceptance label must fail closed unless PM creates a separate reviewed contract.

## Placeholder-Only Rules

The fill simulation exists only to test that future operator packet fields can be represented without filling real values.

Allowed placeholder patterns:

- `__SIMULATED_RECORDED_BY_PLACEHOLDER__`
- `__SIMULATED_RECORDED_AT_PLACEHOLDER__`
- `__SIMULATED_REASON_SUMMARY_PLACEHOLDER__`
- `__SIMULATED_REPAIR_SUMMARY_PLACEHOLDER__`
- `not_filled_in_local_contract_review`
- `future_authorized_intake_required`
- `withheld_no_secret_value_access`
- `withheld_no_real_decision_value_access`
- `withheld_no_payload_access`

Placeholder requirements:

- Placeholders must be explicit, stable, and operator-visible.
- Placeholders must state why a value is absent at a schema level only.
- `placeholdersStillSynthetic` must remain `true` for every simulated status route.
- `simulatedRecordedBy` and `simulatedRecordedAt` must remain placeholders, not real authorization or execution evidence.
- `simulatedReasonSummary` and `simulatedRepairSummary` must remain sanitized summaries, not values or payload containers.
- Placeholders must not contain real decision values, env values, secrets, authorization values, confirmation phrases, row bodies, raw payloads, stock-id payloads, candidate row contents, market data, SQL bodies, Supabase URLs, Supabase keys, or write results.
- A placeholder cannot be treated as acceptance, execution permission, staging proof, row proof, real-data proof, source-rights proof, public-source proof, or score-source proof.
- A missing required value must route to `simulated_repair_required_before_real_intake` unless the absence is expected and represented by a safe placeholder in an otherwise complete simulation case.

## Status Transition Rules

All simulated status routes preserve `publicDataSource=mock`, `scoreSource=mock`, `executionAllowedNow=false`, `recordedAsReal=false`, and `placeholdersStillSynthetic=true`.

### `simulated_accepted_for_future_real_intake`

Allowed when:

- all required simulation fields are present and allowlisted.
- all simulated fill values are placeholders only.
- the source packet is referenced by path or safe label only.
- `simulatedReasonSummary` is sanitized and schema-level only.
- all execution, Supabase, write, payload, secret, env, row-read, market-data, candidate-row, and real-decision-value flags remain false.

Forbidden meaning:

- It must not mean a real decision value was read, filled, accepted, or recorded.
- It must not accept candidate rows or staging rows.
- It must not set `publicDataSource=supabase` or `scoreSource=real`.
- It must not authorize SQL, Supabase connection, runner execution, market-data fetch, or `daily_prices` mutation.

### `simulated_rejected_for_future_real_intake`

Required when:

- forbidden fields or forbidden intent appear.
- an unknown simulated review status appears.
- `publicDataSource=supabase`, `scoreSource=real`, `executionAllowedNow=true`, `recordedAsReal=true`, or `placeholdersStillSynthetic=false` appears or is implied.
- the simulation asks for SQL, Supabase, env, secrets, authorization, confirmation phrases, raw payloads, row payloads, stock-id payloads, market data, staging rows, candidate-row acceptance, or `daily_prices` mutation.
- the simulation cannot be reviewed without reading forbidden values.

Required semantics:

- rejection is decided from field names, labels, flags, path posture, and safe summary-level contract conflicts only.
- rejection must not require reading the underlying forbidden value.
- `simulatedReasonSummary` may name the stop condition at a safe summary level.

### `simulated_repair_required_before_real_intake`

Allowed when:

- the simulation is safe to describe but incomplete, stale, inconsistent, or missing schema-level metadata.
- repair can be completed by adjusting contract fields, placeholders, labels, or documentation without forbidden access.

Valid repair reasons:

- missing `simulationId`
- missing `sourcePacketId`
- missing `decisionStatus`
- missing or unsupported `simulatedReviewStatus`
- missing `simulatedRecordedBy`
- missing `simulatedRecordedAt`
- missing `simulatedReasonSummary`
- missing `simulatedRepairSummary` for a repair-required simulation case
- missing `placeholdersStillSynthetic=true`
- missing `publicDataSource=mock`
- missing `scoreSource=mock`
- missing `executionAllowedNow=false`
- missing `recordedAsReal=false`
- conflicting safety booleans
- stale or mismatched source gate path reference

Forbidden repair instructions:

- read, infer, derive, compare, or fill real decision values.
- fetch or inspect market data.
- read raw payloads, row payloads, stock-id payloads, candidate rows, or packet bodies.
- run SQL, connect to Supabase, create a client, or call query-chain methods.
- create staging rows, mutate `daily_prices`, accept candidate rows, or enable real scoring.

## Forbidden Fields

The fill simulation gate must reject or require repair if any of these fields appear as value-bearing fields:

- `decisionValue`
- `realDecisionValue`
- `filledDecisionValue`
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
- `packetBody`
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

The PM fill simulation gate must stop and return `simulated_rejected_for_future_real_intake` or `simulated_repair_required_before_real_intake` when any condition below is true, unclear, stale, or required to proceed:

- SQL execution, SQL preparation, SQL body review, or SQL result review is requested.
- Supabase import, client creation, connection, read, write, or query-chain usage is requested.
- `.from`, `.insert`, `.update`, `.delete`, or `.upsert` usage is requested.
- Env, secret, credential, authorization, confirmation phrase, execute-switch, or real decision values must be read, printed, copied, compared, derived, filled, or stored.
- Candidate rows, raw payloads, row payloads, source payloads, stock-id payloads, packet bodies, record bodies, trade-date lists, per-date values, or market values must be read or output.
- Market data must be fetched, imported, ingested, transformed, refreshed, stored, or committed.
- Staging rows must be created, accepted, repaired, or used as proof.
- `daily_prices` must be inserted, updated, deleted, merged, upserted, repaired, or otherwise mutated.
- Candidate rows are treated as accepted.
- `publicDataSource=supabase` appears, is requested, or is implied.
- `scoreSource=real` appears, is requested, or is implied.
- `executionAllowedNow=true` appears, is requested, or is implied.
- `recordedAsReal=true` appears, is requested, or is implied.
- `placeholdersStillSynthetic=false` appears, is requested, or is implied.
- `simulatedReviewStatus` is absent, unknown, overloaded, or mapped to execution permission.
- `simulated_accepted_for_future_real_intake` is treated as present authorization rather than future-shape acceptance.
- A placeholder is replaced with a real value inside this local contract review.
- The simulation requires reading `data/source-gates/twii-operator-visible-decision-packet-readiness-fixtures.json` contents as value-bearing evidence rather than referencing its path and schema role.

Fail-closed output is a blocked simulated status, not a retry instruction, repair execution instruction, runtime probe, source fetch, staging route, write attempt, rollback execution, or promotion route.

## PM Integration Notes

PM can integrate this A1 review as the fill simulation contract companion to the local-only operator packet fill simulation gate.

Recommended PM gate behavior:

- Validate fill simulation shape after operator-visible packet readiness and before any future real-intake discussion.
- Treat `simulatedReviewStatus` as a simulation route only, distinct from source packet `decisionStatus` and operator-facing `operatorReviewStatus`.
- Require `simulationId`, `sourcePacketId`, `decisionStatus`, `simulatedReviewStatus`, `simulatedRecordedBy`, `simulatedRecordedAt`, `simulatedReasonSummary`, `placeholdersStillSynthetic`, `publicDataSource`, `scoreSource`, `executionAllowedNow`, and `recordedAsReal` on every route.
- Require `simulatedRepairSummary` when the route is `simulated_repair_required_before_real_intake`.
- Enforce `publicDataSource=mock`, `scoreSource=mock`, `executionAllowedNow=false`, `recordedAsReal=false`, and `placeholdersStillSynthetic=true` on every route.
- Keep the source preflight and fixture file references as path labels unless a separate reviewed task explicitly allows value access.
- Fail closed on unknown fields, unknown statuses, conflicting safety booleans, missing placeholders, or any promotion/write/runtime intent.
- Do not treat this file as SQL authorization, Supabase authorization, source promotion, real-intake approval, candidate-row acceptance, real value fill approval, or `daily_prices` mutation approval.

PM handoff summary:

- A1 status is `a1_operator_packet_fill_simulation_contract_review_ready`.
- A1 scope is `contract-only / placeholder-only / no-execution`.
- The allowed simulated review statuses are fixed to `simulated_accepted_for_future_real_intake`, `simulated_rejected_for_future_real_intake`, and `simulated_repair_required_before_real_intake`.
- The fill simulation remains mock-only, placeholder-only, and non-executing until a separate, explicit, reviewed, no-secret real-intake authorization path exists.
