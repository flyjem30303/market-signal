# A1 Operator Values Shape Recheck Contract Review

Status: `a1_operator_values_shape_recheck_contract_review_ready`

Date: 2026-06-11

Owner lane: A1 Data / Operator Values Shape Contract Line

Scope: `contract-only / shape-recheck-only / review-only / no-execution`

Purpose: review the PM mainline contract for the upcoming `TWII operator values shape recheck gate`. This document defines the safe shape that PM may check after external operator values are supplied outside this repo. The recheck may confirm that required fields are present as labels, placeholders, or safe presence flags only. It must not read, fill, echo, compare, hash, infer, validate, store, or transform real operator values.

This review does not execute SQL, connect to Supabase, import `@supabase/supabase-js`, create a Supabase client, call `.from`, `.insert`, `.update`, `.delete`, or `.upsert`, read env values, read secrets, read authorization values, read confirmation phrases, read real decision values, fill real decision values, fetch market data, read raw payloads, read row payloads, read stock-id payloads, create staging rows, mutate `daily_prices`, accept candidate rows, set `publicDataSource=supabase`, set `scoreSource=real`, or authorize execution.

## Required Shape Fields

The PM shape recheck gate may require these fields at schema level only:

| Field | Required shape state | Value access allowed |
| --- | --- | --- |
| `shapeRecheckId` | Stable local recheck identifier. Must not encode hidden values, credentials, authorization, confirmation phrase text, row keys, market values, or real decision values. | `false` |
| `shapeContractVersion` | Safe version label for this contract. | `false` |
| `ownerLane` | Role or lane label such as `PM` or `A1`. | `false` |
| `operatorDecisionValuePresence` | Presence-only field for the external operator decision value. Allowed values: `present_external_not_read`, `missing_external`, `withheld_external`, or `unknown_fail_closed`. | `false` |
| `operatorAuthorizationPresence` | Presence-only field for the external authorization or attestation value. Same allowed values as above. | `false` |
| `operatorConfirmationPhrasePresence` | Presence-only field for the external confirmation phrase. Same allowed values as above. | `false` |
| `executeSwitchPresence` | Presence-only field for any external execute-switch value. Same allowed values as above. It must not imply execution. | `false` |
| `serverOnlyCredentialPresence` | Presence-only field for server-only credential availability. It may represent only presence state, never credential contents. | `false` |
| `externalValuePlaceholders` | Explicit placeholder list for values that remain outside local artifacts. | `false` |
| `blockedReasons` | Safe reason-code list explaining why the shape cannot advance. | `false` |
| `nextReviewOnlyRoute` | Safe next route label. Must be review-only and non-execution. | `false` |
| `publicDataSource` | Must be exactly `mock`. | `false` |
| `scoreSource` | Must be exactly `mock`. | `false` |
| `safetyFlags` | Required fail-closed booleans listed in this review. | `false` |

Any additional field that requires reading real decision values, authorization values, confirmation phrases, execute-switch values, credential contents, env, secrets, raw payloads, row payloads, stock-id payloads, candidate rows, market data, SQL output, Supabase responses, or `daily_prices` contents is outside this contract and must fail closed.

## Presence-Only Semantics

The shape recheck is allowed to answer only whether an external slot has a safe presence state. It must not inspect the value behind that state.

Allowed presence states:

| Presence state | Meaning |
| --- | --- |
| `present_external_not_read` | PM or the operator indicates that an external value exists outside the repo, but the value was not read, copied, stored, hashed, compared, or printed here. |
| `missing_external` | The required external value is not available to the shape recheck. |
| `withheld_external` | The required external value is intentionally withheld from local artifacts and remains outside this contract. |
| `unknown_fail_closed` | The shape recheck cannot establish a safe presence state without forbidden access, so it blocks. |

Presence-only fields must never carry value bodies, partial values, derived values, hashes, lengths, examples, masked strings, prefixes, suffixes, source payload snippets, row contents, market values, secrets, env-derived values, SQL output, Supabase response bodies, or candidate-row details.

## External Value Placeholder Rules

`externalValuePlaceholders` is required whenever the PM recheck would otherwise need an external value to look complete.

Allowed placeholder patterns:

- `external_operator_decision_value_not_read`
- `external_authorization_value_not_read`
- `external_confirmation_phrase_not_read`
- `external_execute_switch_not_read`
- `server_only_credential_presence_not_read`
- `future_authorized_review_required`
- `withheld_no_secret_value_access`
- `withheld_no_real_decision_value_access`
- `withheld_no_payload_or_row_access`

Placeholder requirements:

- Placeholders must be explicit, stable, and schema-level only.
- Placeholders must explain absence or externality without revealing value contents.
- Placeholders must not contain real decision values, authorization values, confirmation phrases, execute-switch values, credential values, env values, secrets, raw payloads, row payloads, stock-id payloads, candidate-row contents, market data, SQL bodies, Supabase URLs, Supabase keys, Supabase responses, or `daily_prices` row contents.
- Placeholders cannot be treated as acceptance, authorization, execution permission, staging proof, row proof, source-rights proof, real-data proof, or public-source proof.
- A missing or withheld external value must keep the route review-only and blocked unless a separate future reviewed contract authorizes a different path.

## Blocked Reasons

The PM gate should use stable blocked reason codes that name stop conditions without exposing values:

| Blocked reason | Required route |
| --- | --- |
| `missing_operator_decision_presence` | `repair_operator_values_shape_recheck_contract` |
| `missing_authorization_presence` | `repair_operator_values_shape_recheck_contract` |
| `missing_confirmation_phrase_presence` | `repair_operator_values_shape_recheck_contract` |
| `missing_execute_switch_presence` | `repair_operator_values_shape_recheck_contract` |
| `missing_server_only_credential_presence` | `repair_operator_values_shape_recheck_contract` |
| `external_value_access_requested` | `remain_blocked_no_value_access` |
| `real_value_body_present` | `remain_blocked_no_value_access` |
| `placeholder_missing_for_external_value` | `repair_operator_values_shape_recheck_contract` |
| `unsupported_presence_state` | `repair_operator_values_shape_recheck_contract` |
| `missing_publicDataSource_mock` | `repair_operator_values_shape_recheck_contract` |
| `missing_scoreSource_mock` | `repair_operator_values_shape_recheck_contract` |
| `forbidden_supabase_or_sql_path` | `remain_blocked_no_value_access` |
| `forbidden_market_payload_or_candidate_path` | `remain_blocked_no_value_access` |
| `forbidden_daily_prices_or_real_score_path` | `remain_blocked_no_value_access` |
| `execution_route_requested` | `remain_blocked_no_value_access` |

Blocked reasons must not include the value that caused the block. They may name only field labels, contract labels, presence states, and safe stop-line categories.

## Next Review-Only Route

The only allowed next review-only routes are:

| Route | Meaning |
| --- | --- |
| `pm_refresh_operator_values_shape_metadata` | PM refreshes safe labels, version, status, blocked reasons, placeholders, and route only. |
| `repair_operator_values_shape_recheck_contract` | PM or A1 repairs schema-level fields, presence-state vocabulary, placeholders, or safety flags only. |
| `operator_values_presence_review_remains_external` | The external operator values remain outside the repo and the gate records only presence state. |
| `future_separately_authorized_execution_packet_required` | A future separately authorized packet is required before any execution, write, real intake, or source promotion. |
| `remain_blocked_no_value_access` | The gate remains blocked because value access would violate this contract. |

Forbidden route meanings:

- run SQL
- connect to Supabase
- read env, secrets, authorization values, or confirmation phrases
- read or fill real decision values
- fetch, inspect, transform, or store market data
- inspect raw payloads, row payloads, stock-id payloads, source bodies, candidate rows, or row contents
- mutate, repair, read as proof, or accept anything in `daily_prices`
- accept candidate rows
- set `publicDataSource=supabase`
- set `scoreSource=real`
- execute a runner, write path, real intake path, launch path, or source-promotion path

## Fail-Closed Rules

The PM shape recheck gate must fail closed when any of the following appears, is implied, or is required to proceed:

- SQL execution, SQL preparation for execution, SQL body review, or SQL result review is requested.
- Supabase import, client creation, connection, read, write, query-chain usage, or response inspection is requested.
- `.from`, `.insert`, `.update`, `.delete`, or `.upsert` usage is requested.
- Env, secret, credential, authorization, confirmation phrase, execute-switch, or real decision values must be read, printed, copied, compared, derived, hashed, filled, or stored.
- Presence-only fields contain value bodies, partial values, masked values, hashes, lengths, examples, prefixes, or suffixes.
- Raw payloads, row payloads, stock-id payloads, source bodies, candidate rows, trade-date lists, per-date values, market values, or row contents must be read or output.
- Market data must be fetched, imported, ingested, transformed, refreshed, stored, or committed.
- `daily_prices` must be read as evidence, inserted, updated, deleted, merged, upserted, repaired, mutated, or used for row acceptance.
- Candidate rows are accepted or treated as acceptance-ready.
- `publicDataSource=supabase` appears, is requested, or is implied.
- `scoreSource=real` appears, is requested, or is implied.
- `executionAllowedNow=true`, `writeGateExecutableNow=true`, or `finalExecutionAllowedNow=true` appears, is requested, or is implied.
- A next route implies execution, write readiness, source promotion, candidate-row acceptance, real scoring, or public launch readiness.

Required fail-closed safety flags:

- `contractOnly=true`
- `shapeRecheckOnly=true`
- `reviewOnly=true`
- `localOnly=true`
- `noExecution=true`
- `presenceOnlySemantics=true`
- `externalValuesNotRead=true`
- `externalValueBodiesStored=false`
- `realDecisionValueRead=false`
- `realDecisionValueFilled=false`
- `authorizationValueRead=false`
- `confirmationPhraseRead=false`
- `executeSwitchValueRead=false`
- `credentialValueRead=false`
- `envValueRead=false`
- `secretValueRead=false`
- `sqlExecuted=false`
- `supabaseClientImported=false`
- `supabaseConnectionAttempted=false`
- `supabaseReadsEnabled=false`
- `supabaseWritesEnabled=false`
- `marketDataFetched=false`
- `marketDataIngested=false`
- `dailyPricesReadAsEvidence=false`
- `dailyPricesMutated=false`
- `candidateRowsAccepted=false`
- `rawPayloadOutput=false`
- `rowPayloadOutput=false`
- `stockIdPayloadOutput=false`
- `publicDataSource=mock`
- `scoreSource=mock`

If any required safety flag is missing, unknown, stale, overloaded, or conflicting, the route must be `repair_operator_values_shape_recheck_contract` or `remain_blocked_no_value_access`.

## PM Integration Notes

- PM owns the mainline `TWII operator values shape recheck gate`; A1 owns this contract boundary review.
- PM may integrate this file as the A1 readiness contract for shape checking only.
- PM should keep the gate after external operator value supply and before any separate future execution packet.
- PM may check field presence and placeholder completeness only; PM must not ask this gate to read or fill value bodies.
- PM should keep all external operator values outside Git, local artifacts, logs, reports, screenshots, comments, and handoff summaries.
- PM should preserve `publicDataSource=mock` and `scoreSource=mock` on every route.
- PM should represent blocked outcomes with reason codes, not value-bearing explanations.
- PM should route unknown presence states, missing placeholders, conflicting safety flags, or forbidden fields to repair or remain-blocked routes.
- PM must not treat `present_external_not_read` as authorization to execute, write, accept candidate rows, mutate `daily_prices`, promote sources, enable real scoring, or launch public real data.
- PM must not treat this review as SQL authorization, Supabase authorization, source-rights approval, legal approval, real-intake approval, candidate acceptance, write approval, production launch readiness, or investment advice.

## Final A1 Posture

The PM mainline `TWII operator values shape recheck gate` is contract-reviewable only if it remains presence-only, external-value bodies remain outside the repo, required shape fields and placeholders are explicit, blocked reasons are code-only, next routes are review-only, `publicDataSource=mock` and `scoreSource=mock` remain fixed, and every SQL, Supabase, env, secret, authorization, confirmation phrase, real decision value, market-data, payload, candidate-row, `daily_prices`, execution, write, source-promotion, and real-score path fails closed.
