# A1 Real Operator Packet Intake Blocker Contract Review

Status: `a1_real_operator_packet_intake_blocker_contract_review_ready`

Date: 2026-06-11

Owner lane: A1 Data / Intake Blocker Contract Line

Scope: `contract-only / blocker-only / no-execution`

Purpose: review the field contract for the PM mainline `TWII real operator packet intake blocker gate`. This document covers only the local intake blocker shape expected to sit after `data/source-gates/twii-operator-packet-fill-simulation-gate-preflight.json` and `data/source-gates/twii-operator-packet-fill-simulation-fixtures.json`.

This review does not execute SQL, connect to Supabase, import `@supabase/supabase-js`, create a Supabase client, call `.from`, `.insert`, `.update`, `.delete`, or `.upsert`, read env values, read secrets, read authorization values, read confirmation phrases, read real decision values, fill real decision values, fetch market data, read raw payloads, read row payloads, read stock-id payloads, create staging rows, mutate `daily_prices`, accept candidate rows, set `publicDataSource=supabase`, set `scoreSource=real`, or authorize execution.

## Contract Inputs

The PM intake blocker gate may reference these inputs by path and contract role only:

| Input | A1 review posture | Value access allowed |
| --- | --- | --- |
| `data/source-gates/twii-operator-packet-fill-simulation-gate-preflight.json` | Source gate for placeholder-only operator packet fill simulation fields and stop lines. | `false` |
| `data/source-gates/twii-operator-packet-fill-simulation-fixtures.json` | Placeholder-only simulation fixture source for future real operator packet intake blocker checks. | `false` |

Any next step that requires reading hidden values, row contents, source payloads, raw payloads, stock-id payloads, env, secrets, authorization, confirmation phrases, market values, candidate rows, packet bodies, or real decision values is outside this review and must fail closed.

## Required Real Intake Fields

The intake blocker gate should require these real-intake field names as schema-level placeholders or absent-value checks only. Their presence in the contract does not authorize filling real values.

| Field | Required blocker contract state |
| --- | --- |
| `realDecisionStatus` | Required status field for future real intake review. In this blocker gate it must be absent, placeholder-only, or safely classified as missing; it must not contain a real decision value. |
| `realDecisionRecordedBy` | Required recorder field for future real intake review. In this blocker gate it must not contain a real identity proof, credential, authorization value, confirmation phrase, or account secret. |
| `realDecisionRecordedAt` | Required recorded-at field for future real intake review. In this blocker gate it must be a placeholder or missing-value label only, not runtime or execution evidence. |
| `realDecisionReasonSummary` | Required reason summary field for future real intake review. It must remain sanitized and schema-level only; it must not include real decision values, authorization values, confirmation phrases, row payloads, raw payloads, stock-id payloads, candidate rows, or market values. |
| `realRepairRequiredSummary` | Required when blocker status is `blocked_repair_required`. It must describe contract-shape repair only and must not instruct value recovery, payload inspection, market fetch, SQL, Supabase usage, staging-row creation, or `daily_prices` mutation. |
| `operatorReviewStatus` | Required operator review field. It must be present as a safe status label and must not be mapped to execution permission, candidate-row acceptance, source promotion, or real scoring. |
| `operatorAttestation` | Required attestation field for future operator review. In this blocker gate it must be missing, placeholder-only, or explicitly pending; it must not include authorization values, confirmation phrases, secrets, credentials, or real decision values. |
| `executionAcknowledgement` | Required acknowledgement field. In this blocker gate it must remain absent, placeholder-only, or blocked; it must not authorize execution, writes, market-data fetch, runner use, or source promotion. |
| `publicDataSource` | Must remain `mock`. |
| `scoreSource` | Must remain `mock`. |

Recommended supporting safety fields:

- `contractOnly=true`
- `blockerOnly=true`
- `localOnly=true`
- `noExecution=true`
- `sourceSimulationGateReferencedByPathOnly=true`
- `sourceSimulationFixturesReferencedByPathOnly=true`
- `sourceSimulationValuesRead=false`
- `realDecisionValueReadNow=false`
- `realDecisionValueFilledNow=false`
- `realDecisionValueRecordedNow=false`
- `operatorAttestationValueRead=false`
- `executionAcknowledgementValueRead=false`
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
- `publicDataSource=mock`
- `scoreSource=mock`

If any required real intake field cannot be verified as present, placeholder-only, or safely pending without forbidden access, the intake blocker gate must keep the field blocked and route to `blocked_missing_real_values`, `blocked_pending_operator_review`, or `blocked_repair_required`. It must not inspect the forbidden value to complete the packet.

## Blocker Status Vocabulary

The intake blocker gate should accept exactly these blocker statuses:

| Status | Meaning | Execution meaning |
| --- | --- | --- |
| `blocked_missing_real_values` | One or more required real intake fields are absent, placeholder-only, or intentionally withheld. | None. It blocks real intake and does not request the missing value. |
| `blocked_pending_operator_review` | Required operator-facing review, attestation, or acknowledgement remains pending. | None. It does not authorize execution or imply approval. |
| `blocked_repair_required` | The packet shape is safe to describe but incomplete, stale, inconsistent, or missing required schema-level metadata. | None. Repair is contract, placeholder, or documentation repair only. |
| `ready_for_future_intake_review_only` | The blocker contract shape is complete enough for a future separately authorized intake review. | None now. It does not accept rows, fill real values, write rows, or set real sources. |

Any alternate label, pass label, promotion label, execution label, write label, launch label, real-source label, row-acceptance label, or scoring label must fail closed unless PM creates a separate reviewed contract.

## Missing Value Blocking Rules

The blocker gate exists to stop real intake until future real operator packet values are present through a separately authorized, no-secret, no-payload review path.

Allowed missing-value patterns:

- `not_filled_in_local_contract_review`
- `future_authorized_intake_required`
- `withheld_no_secret_value_access`
- `withheld_no_real_decision_value_access`
- `withheld_no_payload_access`
- `operator_review_pending`
- `operator_attestation_pending`
- `execution_acknowledgement_blocked`

Blocking requirements:

- Missing values must be explicit, stable, and operator-visible.
- Missing values must state why a value is absent at a schema level only.
- Missing values must not contain real decision values, env values, secrets, authorization values, confirmation phrases, row bodies, raw payloads, stock-id payloads, candidate row contents, market data, SQL bodies, Supabase URLs, Supabase keys, or write results.
- A missing-value placeholder cannot be treated as acceptance, execution permission, staging proof, row proof, real-data proof, source-rights proof, public-source proof, or score-source proof.
- A required real intake value that is absent or placeholder-only must route to `blocked_missing_real_values` unless the only blocker is pending operator review or contract-shape repair.
- A pending `operatorReviewStatus`, `operatorAttestation`, or `executionAcknowledgement` must route to `blocked_pending_operator_review` unless the packet also contains a harder fail-closed conflict.

## Status-Specific Contract

### `blocked_missing_real_values`

Required when:

- `realDecisionStatus` is absent, placeholder-only, or withheld.
- `realDecisionRecordedBy` is absent, placeholder-only, or withheld.
- `realDecisionRecordedAt` is absent, placeholder-only, or withheld.
- `realDecisionReasonSummary` is absent, placeholder-only, or withheld.
- a required real intake field would require reading real decision values, authorization, confirmation phrase, env, secrets, payloads, market values, candidate rows, or row contents to complete.

Required semantics:

- The status blocks intake without requesting or exposing the missing value.
- The gate may name the missing field at schema level only.
- `publicDataSource=mock` and `scoreSource=mock` remain fixed.

### `blocked_pending_operator_review`

Required when:

- `operatorReviewStatus` is absent, pending, unknown, or not explicitly compatible with future intake review.
- `operatorAttestation` is absent, placeholder-only, pending, unknown, or value-bearing.
- `executionAcknowledgement` is absent, placeholder-only, pending, unknown, or value-bearing.
- operator-facing review is needed before any future real intake review can proceed.

Required semantics:

- Pending review is not authorization.
- Pending attestation or acknowledgement must not be repaired by reading authorization values, confirmation phrases, credentials, env values, secrets, or hidden operator values.
- The blocker must not promote to execution, source promotion, candidate acceptance, or real scoring.

### `blocked_repair_required`

Allowed when:

- the packet is safe to describe but incomplete, stale, inconsistent, or missing schema-level metadata.
- repair can be completed by adjusting contract fields, placeholders, labels, status vocabulary, or documentation without forbidden access.

Valid repair reasons:

- missing or unsupported blocker status
- missing `realDecisionStatus`
- missing `realDecisionRecordedBy`
- missing `realDecisionRecordedAt`
- missing `realDecisionReasonSummary`
- missing `realRepairRequiredSummary` for a repair-required route
- missing `operatorReviewStatus`
- missing `operatorAttestation`
- missing `executionAcknowledgement`
- missing `publicDataSource=mock`
- missing `scoreSource=mock`
- conflicting safety booleans
- stale or mismatched source gate path reference
- source simulation path treated as value evidence instead of path label

Forbidden repair instructions:

- read, infer, derive, compare, or fill real decision values.
- fetch or inspect market data.
- read raw payloads, row payloads, stock-id payloads, candidate rows, packet bodies, or record bodies.
- run SQL, connect to Supabase, create a client, or call query-chain methods.
- create staging rows, mutate `daily_prices`, accept candidate rows, set `publicDataSource=supabase`, or set `scoreSource=real`.

### `ready_for_future_intake_review_only`

Allowed only when:

- all required real intake field names are present as safe schema-level fields or explicitly represented by future-intake placeholders.
- all operator review, attestation, and acknowledgement fields are safe labels only.
- `realDecisionReasonSummary` and `realRepairRequiredSummary` are sanitized and schema-level only.
- `publicDataSource=mock`.
- `scoreSource=mock`.
- all SQL, Supabase, write, payload, secret, env, market-data, staging-row, candidate-row, and real-decision-value flags remain false.

Forbidden meaning:

- It must not mean real intake is approved now.
- It must not mean a real decision value was read, filled, accepted, or recorded.
- It must not accept candidate rows or staging rows.
- It must not set `publicDataSource=supabase` or `scoreSource=real`.
- It must not authorize SQL, Supabase connection, runner execution, market-data fetch, or `daily_prices` mutation.

## Forbidden Fields

The intake blocker gate must reject or require repair if any of these fields appear as value-bearing fields:

- `decisionValue`
- `realDecisionValue`
- `filledDecisionValue`
- `authorizationValue`
- `confirmationPhraseValue`
- `executeSwitchValue`
- `credentialValue`
- `operatorSecret`
- `operatorCredential`
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

The PM intake blocker gate must stop and return `blocked_missing_real_values`, `blocked_pending_operator_review`, or `blocked_repair_required` when any condition below is true, unclear, stale, or required to proceed:

- SQL execution, SQL preparation, SQL body review, or SQL result review is requested.
- Supabase import, client creation, connection, read, write, or query-chain usage is requested.
- `.from`, `.insert`, `.update`, `.delete`, or `.upsert` usage is requested.
- Env, secret, credential, authorization, confirmation phrase, execute-switch, operator attestation value, execution acknowledgement value, or real decision values must be read, printed, copied, compared, derived, filled, or stored.
- Candidate rows, raw payloads, row payloads, source payloads, stock-id payloads, packet bodies, record bodies, trade-date lists, per-date values, or market values must be read or output.
- Market data must be fetched, imported, ingested, transformed, refreshed, stored, or committed.
- Staging rows must be created, accepted, repaired, or used as proof.
- `daily_prices` must be inserted, updated, deleted, merged, upserted, repaired, or otherwise mutated.
- Candidate rows are treated as accepted.
- `publicDataSource=supabase` appears, is requested, or is implied.
- `scoreSource=real` appears, is requested, or is implied.
- `executionAllowedNow=true` appears, is requested, or is implied.
- `recordedAsReal=true` appears, is requested, or is implied.
- `realDecisionValueReadNow=true`, `realDecisionValueFilledNow=true`, or `realDecisionValueRecordedNow=true` appears, is requested, or is implied.
- `operatorReviewStatus`, `operatorAttestation`, or `executionAcknowledgement` is absent, unknown, overloaded, value-bearing, or mapped to execution permission.
- `ready_for_future_intake_review_only` is treated as present authorization rather than future review readiness.
- A placeholder or missing-value marker is replaced with a real value inside this local contract review.
- The gate requires reading `data/source-gates/twii-operator-packet-fill-simulation-fixtures.json` contents as value-bearing evidence rather than referencing its path and schema role.

Fail-closed output is a blocker status, not a retry instruction, repair execution instruction, runtime probe, source fetch, staging route, write attempt, rollback execution, candidate acceptance, source promotion, or real-scoring route.

## PM Integration Notes

PM can integrate this A1 review as the real operator packet intake blocker companion to the local-only intake blocker gate.

Recommended PM gate behavior:

- Validate real intake field names after operator packet fill simulation and before any future real-intake review path.
- Treat blocker status as a stop-line route, distinct from simulation `simulatedReviewStatus`, source `decisionStatus`, and operator-facing `operatorReviewStatus`.
- Require `realDecisionStatus`, `realDecisionRecordedBy`, `realDecisionRecordedAt`, `realDecisionReasonSummary`, `operatorReviewStatus`, `operatorAttestation`, `executionAcknowledgement`, `publicDataSource`, and `scoreSource` on every reviewed shape.
- Require `realRepairRequiredSummary` when the route is `blocked_repair_required`.
- Enforce `publicDataSource=mock`, `scoreSource=mock`, `executionAllowedNow=false`, and real-decision-value flags as false on every route.
- Keep the source preflight and fixture file references as path labels unless a separate reviewed task explicitly allows value access.
- Fail closed on unknown fields, unknown statuses, conflicting safety booleans, missing placeholders, pending operator review, missing real intake fields, or any promotion/write/runtime intent.
- Do not treat this file as SQL authorization, Supabase authorization, source promotion, real-intake approval, candidate-row acceptance, operator attestation approval, execution acknowledgement approval, real value fill approval, or `daily_prices` mutation approval.

PM handoff summary:

- A1 status is `a1_real_operator_packet_intake_blocker_contract_review_ready`.
- A1 scope is `contract-only / blocker-only / no-execution`.
- The allowed blocker statuses are fixed to `blocked_missing_real_values`, `blocked_pending_operator_review`, `blocked_repair_required`, and `ready_for_future_intake_review_only`.
- The intake blocker remains mock-only, fail-closed, and non-executing until a separate, explicit, reviewed, no-secret real-intake authorization path exists.
