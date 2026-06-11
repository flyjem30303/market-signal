# A1 Operator Values Intake Readiness Surface Contract Review

Status: `a1_operator_values_intake_readiness_surface_contract_review_ready`

Date: 2026-06-11

Owner lane: A1 Data / Operator Values Intake Contract Line

Scope: `contract-only / readiness-surface-only / no-execution`

Purpose: review the PM mainline contract for the future `TWII operator values intake readiness surface gate`. This document defines which value classes the surface may name, which values remain external-only, which safe metadata may be PM-refreshable, which values must never be stored, and how the gate must fail closed before any future separately authorized real intake route.

This review does not execute SQL, connect to Supabase, import `@supabase/supabase-js`, create a Supabase client, call `.from`, `.insert`, `.update`, `.delete`, or `.upsert`, read env values, read secrets, read authorization values, read confirmation phrases, read real decision values, fill real decision values, fetch market data, read raw payloads, read row payloads, read stock-id payloads, create staging rows, mutate `daily_prices`, accept candidate rows, set `publicDataSource=supabase`, set `scoreSource=real`, or authorize execution.

## Required Input Classes

The PM readiness surface gate may describe these input classes by label, field name, and readiness state only:

| Input class | Required contract handling | Value access allowed |
| --- | --- | --- |
| `operator_intake_surface_metadata` | Surface id, version label, owner lane, contract status, and review timestamp label. | `false` for hidden/runtime values |
| `operator_visible_value_slots` | Schema-level names for future operator-provided values. Must remain absent, external-only, placeholder-only, or withheld. | `false` |
| `operator_review_state` | Safe status labels such as pending, blocked, repair required, or ready for future review only. | `false` |
| `blocked_reason_codes` | Enumerated reasons for why intake cannot proceed now. | `false` |
| `next_route` | Safe routing label for PM integration. Must not be an execution command. | `false` |
| `safety_flags` | Boolean stop-line fields proving no SQL, Supabase, market-data, payload, secret, candidate-row, or real-score path is active. | `false` |
| `mock_source_posture` | Required `publicDataSource=mock` and `scoreSource=mock` posture. | `false` |

Any field that requires reading hidden values, real decision values, operator authorization, confirmation phrases, env, secrets, raw payloads, row payloads, stock-id payloads, candidate rows, market data, Supabase responses, or `daily_prices` contents is outside this review and must fail closed.

## External-Only Values

The readiness surface may acknowledge that these values exist outside this contract, but it must not read, store, echo, infer, validate, hash, compare, or transform them:

| External-only value class | Surface behavior |
| --- | --- |
| `operator_decision_value` | Represent only as `external_only_not_read`. |
| `operator_authorization_value` | Represent only as `external_only_not_read`. |
| `operator_confirmation_phrase` | Represent only as `external_only_not_read`. |
| `operator_identity_or_attestation_secret` | Represent only as `external_only_not_read`. |
| `runtime_env_value` | Represent only as `external_only_not_read`. |
| `credential_or_secret_value` | Represent only as `external_only_not_read`. |
| `source_or_market_payload_value` | Represent only as `external_only_not_read`. |
| `candidate_or_row_value` | Represent only as `external_only_not_read`. |

External-only values must remain outside local artifacts, logs, reports, check output, fixture files, screenshots, comments, and PM handoff summaries.

## PM-Refreshable Values

PM may refresh only safe metadata that does not require forbidden value access:

| PM-refreshable value | Allowed refresh rule |
| --- | --- |
| `surfaceContractVersion` | PM may update the label when the surface contract changes. |
| `surfaceReviewStatus` | PM may set an allowed readiness status from this document. |
| `blockedReasons` | PM may add or remove safe blocked reason codes. |
| `nextRoute` | PM may choose an allowed next route label. |
| `ownerLane` | PM may correct role or lane labels only. |
| `reviewTimestampLabel` | PM may update a non-secret review timestamp label. |
| `sourcePosture` | Must remain `publicDataSource=mock` and `scoreSource=mock`. |
| `safetyFlags` | PM may refresh false/true booleans only when they preserve the hard stop-lines below. |

PM-refreshable metadata must not contain real decision values, authorization values, confirmation phrase text, env values, secrets, raw payloads, row payloads, stock-id payloads, candidate rows, market values, SQL output, Supabase response bodies, or `daily_prices` contents.

## Never-Store Values

The surface contract must reject or require repair if any of these appear as stored values, output values, fixture values, log values, or report values:

- real operator decision values
- operator authorization values
- confirmation phrase values
- env values
- secrets, credentials, tokens, keys, or connection strings
- Supabase URLs, keys, response bodies, or write/read results
- raw market-data payloads
- source response bodies
- row payloads
- stock-id payloads
- candidate row contents
- `daily_prices` row contents or mutation results
- SQL bodies intended for execution
- real score values or real source-promotion evidence

Field names may be documented at schema level. Value bodies must remain absent.

## Allowed Readiness Statuses

The readiness surface should accept exactly these statuses:

| Status | Meaning | Execution meaning |
| --- | --- | --- |
| `blocked_external_values_required` | One or more required operator values are external-only, missing, or withheld. | None. |
| `blocked_pending_pm_refresh` | PM must refresh safe metadata such as status, blocked reasons, or next route. | None. |
| `blocked_repair_required` | The surface shape is incomplete, stale, inconsistent, or missing required schema-level metadata. | None. |
| `ready_for_future_operator_review_only` | The surface is safe for a future separately authorized operator review path. | None now. |

Any alternate pass, execution, write, launch, candidate-acceptance, Supabase, real-score, or real-source status must fail closed unless PM creates a later reviewed contract.

## Blocked Reasons

The gate should use stable blocked reason codes that explain the stop condition without exposing values:

| Blocked reason | Required route |
| --- | --- |
| `missing_external_operator_decision_value` | `blocked_external_values_required` |
| `missing_external_authorization_value` | `blocked_external_values_required` |
| `missing_external_confirmation_phrase` | `blocked_external_values_required` |
| `external_value_access_requested` | `blocked_external_values_required` |
| `pm_refresh_required` | `blocked_pending_pm_refresh` |
| `unsupported_status_label` | `blocked_repair_required` |
| `missing_next_route` | `blocked_repair_required` |
| `missing_publicDataSource_mock` | `blocked_repair_required` |
| `missing_scoreSource_mock` | `blocked_repair_required` |
| `forbidden_supabase_or_sql_surface` | `blocked_repair_required` |
| `forbidden_market_payload_or_candidate_surface` | `blocked_repair_required` |
| `forbidden_real_source_or_real_score_surface` | `blocked_repair_required` |

Blocked reasons must not include the value that caused the block. They may name only field labels, contract labels, and safe stop-line categories.

## Next Route

Allowed `nextRoute` values:

| Route | Meaning |
| --- | --- |
| `pm_refresh_surface_metadata` | PM refreshes safe labels, status, blocked reasons, and next route only. |
| `repair_surface_contract_shape` | PM or A1 repairs schema-level fields, vocabulary, or safety flags only. |
| `future_operator_review_packet_required` | A future separately authorized packet is required before any real intake review. |
| `remain_blocked_no_value_access` | Gate remains blocked because external-only values cannot be read or stored here. |

Forbidden `nextRoute` meanings:

- run SQL
- connect to Supabase
- fetch market data
- inspect payloads or row bodies
- accept candidate rows
- mutate `daily_prices`
- fill operator values
- set `publicDataSource=supabase`
- set `scoreSource=real`
- execute a runner or write path

## Fail-Closed Rules

The readiness surface must fail closed when any of the following appears or is implied:

- SQL execution, SQL preparation for execution, or database mutation is requested.
- Supabase import, client creation, connection, read, write, or response inspection is requested.
- env, secret, authorization, confirmation phrase, credential, token, or key access is requested.
- real decision values are requested, filled, inferred, compared, hashed, logged, or stored.
- market data is fetched, ingested, stored, transformed, or used as proof.
- raw payloads, row payloads, stock-id payloads, source bodies, candidate rows, or row contents are requested.
- `daily_prices` is read as value evidence, written, repaired, mutated, or used for row acceptance.
- `publicDataSource=supabase` appears.
- `scoreSource=real` appears.
- a status or next route implies execution, source promotion, candidate-row acceptance, or public launch readiness.

Required fail-closed safety flags:

- `contractOnly=true`
- `readinessSurfaceOnly=true`
- `localOnly=true`
- `noExecution=true`
- `externalOnlyValuesNotRead=true`
- `externalOnlyValuesStored=false`
- `pmRefreshableMetadataOnly=true`
- `realDecisionValueRead=false`
- `realDecisionValueStored=false`
- `authorizationValueRead=false`
- `confirmationPhraseRead=false`
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

If any required safety flag is missing, unknown, or conflicting, the route must be `repair_surface_contract_shape` or `remain_blocked_no_value_access`.

## PM Integration Notes

- PM owns the mainline readiness surface gate and may integrate this review as the A1 contract boundary.
- PM should treat the surface as a pre-intake safety surface, not as a filled operator intake packet.
- PM may refresh safe metadata only; PM must not ask A1 to fill, verify, or recover operator values in this document.
- PM should keep `publicDataSource=mock` and `scoreSource=mock` fixed until a separate promotion gate is reviewed and accepted.
- PM should display external-only value slots as missing, withheld, pending, or future-authorized only.
- PM should preserve blocked reasons as codes, not value-bearing explanations.
- PM should route any value-bearing request to a future separately authorized operator review packet, not to this readiness surface.
- PM should keep any future check/report output aggregate-only and no-secret.
- PM must not treat `ready_for_future_operator_review_only` as execution approval, candidate-row acceptance, source promotion, real scoring, or public launch readiness.

## Final A1 Posture

The PM mainline `TWII operator values intake readiness surface gate` is contract-reviewable only if it keeps value classes external-only, limits PM refreshes to safe metadata, never stores forbidden values, preserves explicit blocked reasons, routes only to non-execution next steps, and fails closed on all SQL, Supabase, secret, payload, market-data, candidate-row, `daily_prices`, real-source, and real-score paths.
