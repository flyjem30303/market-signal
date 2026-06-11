# A1 Real Operator Intake Checklist Packet Contract Review

Status: `a1_real_operator_intake_checklist_packet_contract_review_ready`

Date: 2026-06-11

Owner lane: A1 Data / Checklist Contract

Scope: `contract-only / checklist-packet-only / no-execution`

Purpose: define the A1 contract review for the PM mainline `TWII real operator intake checklist packet gate`. This document covers checklist field shape, required safe values, current blocker handling, completion criteria, and fail-closed stop lines for a local-only checklist packet gate that references:

- `data/source-gates/twii-real-operator-packet-intake-blocker-gate-preflight.json`
- `data/source-gates/twii-real-operator-packet-intake-blocker-requirements.json`

This review does not execute SQL, connect to Supabase, import `@supabase/supabase-js`, create a Supabase client, call `.from`, `.insert`, `.update`, `.delete`, or `.upsert`, read env values, read secrets, read authorization values, read confirmation phrases, read real decision values, fill real decision values, fetch market data, read raw payloads, read row payloads, read stock-id payloads, create staging rows, mutate `daily_prices`, accept candidate rows, set `publicDataSource=supabase`, set `scoreSource=real`, or authorize execution.

## Contract Inputs

The checklist packet gate may reference these inputs by path and contract role only:

| Input | A1 review posture | Value access allowed |
| --- | --- | --- |
| `data/source-gates/twii-real-operator-packet-intake-blocker-gate-preflight.json` | Source blocker preflight contract for required field names, blocker statuses, current blockers, promotion locks, and safety flags. | `false` |
| `data/source-gates/twii-real-operator-packet-intake-blocker-requirements.json` | Source requirements contract for checklist-required fields, blocker statuses, missing-value placeholders, and disallowed requirement fields. | `false` |

The checklist packet gate must treat both files as contract-shape inputs. It may preserve paths, field names, status labels, and boolean safety expectations. It must not copy, infer, request, or fill hidden operator values or real decision values.

## Required Checklist Item Fields

Each checklist item in the PM gate should include these schema-level fields:

| Field | Required value contract |
| --- | --- |
| `checklistItemId` | Stable local identifier for the checklist item. It must not encode a secret, credential, authorization value, confirmation phrase, row id payload, stock id payload, or real decision value. |
| `checklistItemLabel` | Human-readable local label for the item. It may name the contract field being checked but must not expose or request the underlying real value. |
| `sourceContractPath` | One of the two approved source-gate paths listed above. Path reference only. |
| `sourceContractField` | Schema-level field name from the source contract, such as `requiredRealIntakeFields`, `blockerStatuses`, `currentBlockers`, `promotionLocks`, or a safety boolean. |
| `requiredValueState` | One of `must_be_present`, `must_be_false`, `must_be_mock`, `must_be_placeholder_or_missing`, `must_be_path_only`, or `must_be_blocked`. |
| `observedValueState` | Safe state label only. Allowed labels are `present`, `false`, `mock`, `placeholder_or_missing`, `path_only`, `blocked`, `pending`, or `repair_required`. No real value may be recorded here. |
| `blockerStatus` | One of `blocked_missing_real_values`, `blocked_pending_operator_review`, `blocked_repair_required`, or `ready_for_future_intake_review_only`. |
| `blockerReason` | Sanitized schema-level reason. It may name missing fields or contract conflicts but must not include real values, payloads, env, secrets, authorization values, confirmation phrases, SQL, Supabase data, candidate rows, or market data. |
| `completionEvidence` | Contract-only evidence such as `field_present`, `flag_false`, `source_path_referenced`, `mock_source_confirmed`, or `placeholder_only_confirmed`. |
| `failClosedIfMissing` | Must be `true` for every required checklist item. |
| `allowsExecution` | Must be `false`. |
| `allowsWrite` | Must be `false`. |
| `allowsPromotion` | Must be `false`. |
| `notes` | Optional sanitized notes for PM integration. Notes must remain checklist-packet-only and no-execution. |

Recommended packet-level fields:

- `gateKind`
- `gateId`
- `checklistPacketMode`
- `sourcePreflightPath`
- `sourceRequirementsPath`
- `targetLane`
- `targetScope`
- `contractOnly=true`
- `checklistPacketOnly=true`
- `localOnly=true`
- `noExecution=true`
- `realValuesProvidedNow=false`
- `realDecisionValueReadNow=false`
- `realDecisionValueRecordedNow=false`
- `authorizationValuesRead=false`
- `executeSwitchValueRead=false`
- `confirmationPhraseValueRead=false`
- `credentialValuesRead=false`
- `rowPayloadRead=false`
- `rawPayloadRead=false`
- `sourcePayloadRead=false`
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
- `promotionAllowed=false`
- `scoreSourceRealAllowed=false`
- `publicDataSource=mock`
- `scoreSource=mock`

## Required Values

The checklist packet must require these contract values before it can be marked ready for future intake review only:

| Contract area | Required value |
| --- | --- |
| Scope | `contract-only / checklist-packet-only / no-execution` |
| Source preflight path | `data/source-gates/twii-real-operator-packet-intake-blocker-gate-preflight.json` |
| Source requirements path | `data/source-gates/twii-real-operator-packet-intake-blocker-requirements.json` |
| Source handling | path-only reference, no value access |
| Missing real values | explicit blocker state, not repaired by value lookup |
| Operator review | explicit pending or blocked state until separately authorized |
| Repair route | schema-level repair only |
| SQL and Supabase flags | all false |
| Payload and secret flags | all false |
| Market data and write flags | all false |
| Candidate-row handling | `candidateRowsAccepted=false` |
| Promotion | `promotionAllowed=false` |
| Public data source | `mock` |
| Score source | `mock` |

Any required value that cannot be checked without forbidden access must remain incomplete and must route to a blocker status. Absence, placeholder-only status, or withheld-value status is not a reason to read the hidden value.

## Current Blocker Handling

The checklist packet should preserve the source blocker posture as checklist items:

| Current blocker class | Checklist handling |
| --- | --- |
| Missing real values | Represent as `blocked_missing_real_values`. The checklist may name the missing field at schema level only. |
| Pending operator review | Represent as `blocked_pending_operator_review`. Pending review, attestation, acknowledgement, or authorization cannot be converted into approval by A1. |
| Repair required | Represent as `blocked_repair_required`. Repair is limited to field names, labels, placeholders, status vocabulary, paths, and boolean safety flags. |
| Future review readiness | Represent only as `ready_for_future_intake_review_only`. This is not approval, execution permission, source promotion, row acceptance, or real scoring. |

If multiple blockers exist, the checklist packet should keep all current blockers visible. A harder fail-closed stop condition overrides any softer ready label.

## Completion Criteria

The A1 checklist packet contract review is complete only when all criteria below are true:

- every checklist item has the required fields listed in this document.
- each checklist item maps to one approved source path and one schema-level source field.
- all required real intake fields are represented as missing, placeholder-only, pending, blocked, or future-review-only without exposing real values.
- current blockers are represented with approved blocker statuses.
- missing real values remain blocked and are not requested, inferred, filled, copied, or recorded.
- operator review remains pending or blocked unless a separate future authorized intake review exists outside this checklist packet.
- repair instructions are limited to local contract shape repair.
- all SQL, Supabase, write, payload, secret, env, market-data, staging-row, candidate-row, and real-decision-value flags are false.
- `publicDataSource=mock`.
- `scoreSource=mock`.
- no checklist item authorizes execution, write access, candidate row acceptance, source promotion, real scoring, market fetch, or `daily_prices` mutation.

The only allowed ready posture is `ready_for_future_intake_review_only`, and it must mean the checklist shape is ready for PM review, not that real intake can proceed now.

## Fail-Closed Stop Conditions

The checklist packet gate must fail closed if any of these conditions appear:

- a checklist item lacks `failClosedIfMissing=true`.
- a required checklist item is missing or maps to an unapproved source path.
- a status outside `blocked_missing_real_values`, `blocked_pending_operator_review`, `blocked_repair_required`, or `ready_for_future_intake_review_only` is used.
- any field contains, requests, infers, copies, or records a real decision value.
- any field contains or requests secrets, env values, authorization values, confirmation phrases, credentials, raw payloads, row payloads, stock-id payloads, candidate row contents, source payloads, market values, SQL bodies, Supabase URLs, Supabase keys, or write results.
- SQL is executed.
- Supabase is connected, imported, or queried.
- `@supabase/supabase-js` is imported.
- `createClient` is used.
- `.from`, `.insert`, `.update`, `.delete`, or `.upsert` is called.
- market data is fetched, ingested, transformed as real evidence, or used to complete a checklist item.
- staging rows are created.
- `daily_prices` is modified.
- candidate rows are accepted.
- `publicDataSource=supabase` is set or implied.
- `scoreSource=real` is set or implied.
- execution, write gate, final execution, implementation, source promotion, or real scoring is allowed.

When any stop condition is present, the only valid output is a blocked checklist packet with sanitized schema-level blocker reasons.

## PM Integration Notes

- PM should treat this A1 review as a checklist field contract, not as an execution review.
- PM may use this document to shape a local-only checklist packet gate that consumes the two approved source-gate paths by reference.
- PM should keep all real operator values outside the checklist packet until a separate future intake review is explicitly authorized.
- PM should preserve the source blocker statuses and make blocker reasons operator-visible without exposing hidden values.
- PM should require `publicDataSource=mock` and `scoreSource=mock` in this packet.
- PM should make every checklist item fail closed by default.
- PM should route incomplete fields to blocker statuses instead of asking A1 to fill real values.
- PM should reject any checklist packet that turns a missing, pending, or repair-required item into execution permission.

## A1 Review Outcome

A1 contract outcome: `a1_real_operator_intake_checklist_packet_contract_review_ready`.

The checklist packet contract is ready for PM integration as a local-only, no-execution gate shape. It remains blocked against real value intake, SQL, Supabase, market data, payload reads, staging rows, `daily_prices` mutation, candidate row acceptance, public source promotion, and real scoring.
