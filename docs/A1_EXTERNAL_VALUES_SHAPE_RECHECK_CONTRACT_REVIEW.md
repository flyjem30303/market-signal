# A1 External Values Shape Recheck Contract Review

Status: `a1_external_values_shape_recheck_contract_review_ready`

Date: 2026-06-11

Owner lane: A1 Data / External Values Shape Contract Review

Scope: `local-only / contract-only / shape-recheck-only / field-name-only / presence-only / no-execution`

Purpose: provide PM mainline with a local-only contract review for the `TWII external values shape recheck preparation gate`. This document defines safe field names, placeholder classes, presence-only checks, fail-closed behavior, and PM integration notes for a future external-values shape recheck. It does not read, infer, validate, store, echo, compare, hash, or transform any real external values.

This A1 review does not execute SQL, connect to Supabase, import `@supabase/supabase-js`, create a Supabase client, call `.from`, `.insert`, `.update`, `.delete`, or `.upsert`, read secrets, read env values, read authorization values, read confirmation phrases, read execute switch values, read credential values, read real decision values, fetch market data, inspect raw payloads, inspect row payloads, inspect stock-id payloads, inspect candidate rows, touch `daily_prices`, create staging rows, change `publicDataSource`, change `scoreSource`, authorize execution, or produce a real go/no-go decision.

## Bounded Target Scope

The PM gate must remain bounded to the following target shape:

| Target field | Required bounded value |
| --- | --- |
| `targetLane` | `TWII` |
| `targetTable` | `daily_prices` |
| `targetMaxRows` | `60` |
| `targetScopeMode` | `bounded_external_values_shape_recheck_only` |
| `targetMutationAllowed` | `false` |
| `targetReadAllowedFromThisReview` | `false` |

The bounded scope is a field-name and shape target only. It is not authorization to read `daily_prices`, write `daily_prices`, inspect candidate rows, verify row payloads, score coverage, or execute any runtime path.

## Value Class Shape Rules

PM may classify external-value slots only by safe value class labels:

| Value class | Allowed shape meaning | Value access allowed |
| --- | --- | --- |
| `operator_decision_value` | External go/no-go/repair decision slot exists as a field name only. | `false` |
| `operator_authorization_presence` | Authorization presence slot exists as a field name only. | `false` |
| `execute_switch_presence` | Execute switch presence slot exists as a field name only. | `false` |
| `confirmation_phrase_presence` | Confirmation phrase presence slot exists as a field name only. | `false` |
| `server_only_credential_presence` | Server-only credential presence slot exists as a field name only. | `false` |
| `rollback_shape_proof` | Rollback-readiness proof slot exists as a field name only. | `false` |
| `readback_shape_proof` | Aggregate readback proof slot exists as a field name only. | `false` |
| `post_run_shape_proof` | Post-run review proof slot exists as a field name only. | `false` |
| `duplicate_proof_shape` | Duplicate-prevention proof slot exists as a field name only. | `false` |

Value class labels must not contain value bodies, partial values, masked values, hashes, lengths, prefixes, suffixes, examples, SQL output, Supabase response bodies, row contents, candidate-row contents, market values, credential values, env values, secrets, authorization text, confirmation phrase text, or real decision values.

## Field-Name-Only Contract

The PM shape recheck may require these field names at schema level only:

| Field name | Required shape | Value access allowed |
| --- | --- | --- |
| `externalValuesShapeRecheckId` | Stable local identifier that does not encode hidden values. | `false` |
| `shapeContractVersion` | Safe contract version label. | `false` |
| `targetLane` | Must be `TWII`. | `false` |
| `targetTable` | Must be `daily_prices`. | `false` |
| `targetMaxRows` | Must be `60`. | `false` |
| `decisionShapePlaceholder` | Must use one of `go`, `no_go`, or `repair_required` as shape vocabulary only. | `false` |
| `authorizationPresenceShape` | Presence-only authorization slot. | `false` |
| `executeSwitchPresenceShape` | Presence-only execute-switch slot. | `false` |
| `confirmationPhrasePresenceShape` | Presence-only confirmation phrase slot. | `false` |
| `serverOnlyCredentialPresenceShape` | Presence-only server credential slot. | `false` |
| `rollbackShapePlaceholder` | Rollback readiness placeholder only. | `false` |
| `readbackShapePlaceholder` | Aggregate readback placeholder only. | `false` |
| `postRunShapePlaceholder` | Post-run review placeholder only. | `false` |
| `duplicateProofShapePlaceholder` | Duplicate-proof placeholder only. | `false` |
| `blockedReasons` | Stable code-only blocked reasons. | `false` |
| `nextRoute` | Safe next route label. | `false` |
| `publicDataSource` | Must remain `mock`. | `false` |
| `scoreSource` | Must remain `mock`. | `false` |
| `safetyFlags` | Required fail-closed booleans. | `false` |

Any extra field that requires real value access, credential access, env access, SQL/Supabase access, market-data access, row-level access, candidate-row access, `daily_prices` read/write access, or source-promotion access is outside this contract and must fail closed.

## Presence-Only Checks

Allowed presence states:

| Presence state | Meaning |
| --- | --- |
| `present_external_not_read` | A required external value is represented as externally present, but it was not read, copied, stored, hashed, compared, printed, or transformed locally. |
| `missing_external` | A required external value is not available to the shape recheck. |
| `withheld_external` | A required external value is intentionally withheld from local artifacts. |
| `not_applicable_for_this_gate` | The field is not required for this local-only preparation gate. |
| `unknown_fail_closed` | The shape cannot be safely established without forbidden access, so the route blocks. |

Presence-only checks may confirm that a field label exists and that a safe presence state is selected. They must not open, read, copy, print, compare, derive, hash, validate, store, or infer the underlying value.

## Allowed Placeholder Classes

Allowed placeholder classes:

- `external_decision_value_not_read`
- `external_authorization_presence_not_read`
- `external_execute_switch_presence_not_read`
- `external_confirmation_phrase_presence_not_read`
- `server_only_credential_presence_not_read`
- `rollback_readiness_shape_pending`
- `aggregate_readback_shape_pending`
- `post_run_review_shape_pending`
- `duplicate_proof_shape_pending`
- `bounded_target_scope_twii_daily_prices_60_rows`
- `future_pm_review_required`
- `withheld_no_secret_value_access`
- `withheld_no_real_decision_value_access`
- `withheld_no_payload_or_row_access`

Placeholders are schema-level labels only. They are not acceptance, authorization, execution permission, rollback proof, readback proof, post-run proof, duplicate proof, data-quality proof, source-rights proof, row-coverage proof, launch readiness, or investment advice.

## Forbidden Value Surfaces

The PM gate and any downstream integration must not expose or request:

- SQL bodies, SQL results, query output, or migration output.
- Supabase URLs, keys, clients, response bodies, dashboard data, or API payloads.
- Env values, secrets, credentials, authorization text, execute switch values, confirmation phrase text, or real decision values.
- Raw source payloads, market data payloads, row payloads, stock-id payloads, trade-date lists, per-date market values, or candidate rows.
- `daily_prices` row contents, row diffs, inserted rows, updated rows, deleted rows, duplicate rows, or row acceptance evidence.
- `publicDataSource=supabase`, `scoreSource=real`, real scoring evidence, source-promotion evidence, or launch-readiness claims.

If any forbidden value surface appears, the route must become `no_go` or `repair_required` at shape level and must not proceed to execution.

## Decision Shape Placeholders

Allowed decision shape placeholders:

| Placeholder | Meaning for this contract |
| --- | --- |
| `go` | Shape-only vocabulary indicating that required safe fields could be complete in a future PM gate. It is not execution approval. |
| `no_go` | Shape-only vocabulary indicating the gate remains blocked. |
| `repair_required` | Shape-only vocabulary indicating field names, presence states, placeholders, or safety flags need repair. |

These placeholders must not carry real operator decisions. `go` must not be treated as authorization to execute SQL, connect to Supabase, read credentials, read confirmation phrases, write `daily_prices`, accept rows, enable real scoring, or promote public data.

## Authorization And Credential Shape Placeholders

Required external-value presence placeholder fields:

| Placeholder field | Allowed placeholder class | Required default |
| --- | --- | --- |
| `authorizationPresenceShape` | `external_authorization_presence_not_read` | `unknown_fail_closed` |
| `executeSwitchPresenceShape` | `external_execute_switch_presence_not_read` | `unknown_fail_closed` |
| `confirmationPhrasePresenceShape` | `external_confirmation_phrase_presence_not_read` | `unknown_fail_closed` |
| `serverOnlyCredentialPresenceShape` | `server_only_credential_presence_not_read` | `unknown_fail_closed` |

These fields may record only safe presence states. They must not record, mask, compare, validate, or derive the authorization value, execute switch value, confirmation phrase, credential value, env value, secret value, URL, key, token, or server-only configuration content.

## Rollback Readback Post-Run Duplicate Proof Shape Placeholders

Required proof-shape placeholders:

| Placeholder field | Allowed placeholder class | Required default |
| --- | --- | --- |
| `rollbackShapePlaceholder` | `rollback_readiness_shape_pending` | `repair_required` |
| `readbackShapePlaceholder` | `aggregate_readback_shape_pending` | `repair_required` |
| `postRunShapePlaceholder` | `post_run_review_shape_pending` | `repair_required` |
| `duplicateProofShapePlaceholder` | `duplicate_proof_shape_pending` | `repair_required` |

These placeholders may state that a proof shape is expected in a future separately reviewed gate. They must not execute rollback, perform aggregate readback, inspect row-level data, run post-run review, check duplicates against `daily_prices`, or claim proof completion.

## Blocked Reasons

Allowed blocked reason codes:

| Blocked reason | Required next route |
| --- | --- |
| `missing_target_lane_twii` | `repair_external_values_shape_recheck_contract` |
| `missing_target_table_daily_prices` | `repair_external_values_shape_recheck_contract` |
| `missing_target_max_rows_60` | `repair_external_values_shape_recheck_contract` |
| `unsupported_decision_shape_placeholder` | `repair_external_values_shape_recheck_contract` |
| `missing_authorization_presence_shape` | `repair_external_values_shape_recheck_contract` |
| `missing_execute_switch_presence_shape` | `repair_external_values_shape_recheck_contract` |
| `missing_confirmation_phrase_presence_shape` | `repair_external_values_shape_recheck_contract` |
| `missing_server_only_credential_presence_shape` | `repair_external_values_shape_recheck_contract` |
| `missing_rollback_shape_placeholder` | `repair_external_values_shape_recheck_contract` |
| `missing_readback_shape_placeholder` | `repair_external_values_shape_recheck_contract` |
| `missing_post_run_shape_placeholder` | `repair_external_values_shape_recheck_contract` |
| `missing_duplicate_proof_shape_placeholder` | `repair_external_values_shape_recheck_contract` |
| `external_value_access_requested` | `remain_blocked_no_value_access` |
| `forbidden_value_surface_present` | `remain_blocked_no_value_access` |
| `daily_prices_read_or_write_requested` | `remain_blocked_no_value_access` |
| `sql_or_supabase_path_requested` | `remain_blocked_no_value_access` |
| `public_or_score_source_promotion_requested` | `remain_blocked_no_value_access` |
| `execution_route_requested` | `remain_blocked_no_value_access` |

Blocked reasons must be code-only. They must not include the value that caused the block.

## Next Route

Allowed next route labels:

| Next route | Meaning |
| --- | --- |
| `pm_integrate_external_values_shape_recheck_preparation_gate` | PM may wire this A1 contract into the preparation gate as field-name-only guidance. |
| `repair_external_values_shape_recheck_contract` | PM or A1 repairs safe field names, presence vocabulary, placeholders, blocked reasons, or safety flags only. |
| `external_values_presence_remains_out_of_repo` | External values remain outside repo artifacts and only presence state may be represented. |
| `future_separately_authorized_execution_packet_required` | Any later execution requires a separate reviewed packet outside this contract. |
| `remain_blocked_no_value_access` | The gate remains blocked because progress would require forbidden value access. |

No next route may imply SQL execution, Supabase connection, credential read, confirmation phrase read, real decision intake, market-data fetch, `daily_prices` mutation, candidate-row acceptance, real scoring, public source promotion, rollback execution, readback execution, post-run execution, or launch readiness.

## Fail-Closed Rules

The PM gate must fail closed if any of the following appears, is implied, or is required:

- SQL execution, SQL preparation, SQL body review, or SQL result review.
- Supabase import, client creation, connection, read, write, query-chain usage, or response inspection.
- Env, secret, credential, authorization, execute switch, confirmation phrase, or real decision value access.
- Presence fields containing value bodies, masked values, partial values, hashes, lengths, prefixes, suffixes, examples, or derived values.
- Raw payload, row payload, stock-id payload, candidate-row, market-data, per-date, trade-date, or source-body access.
- `daily_prices` read, insert, update, delete, merge, upsert, mutation, row proof, duplicate check, or row acceptance.
- `publicDataSource=supabase`, `scoreSource=real`, source promotion, real scoring, row coverage scoring, or public launch readiness.
- A decision shape that treats `go` as execution approval.
- Missing, stale, overloaded, conflicting, or unknown required safety flags.

Required safety flags:

- `contractOnly=true`
- `localOnly=true`
- `shapeRecheckOnly=true`
- `fieldNameOnly=true`
- `presenceOnly=true`
- `noExecution=true`
- `externalValuesNotRead=true`
- `realDecisionValuesRead=false`
- `authorizationValueRead=false`
- `executeSwitchValueRead=false`
- `confirmationPhraseValueRead=false`
- `serverOnlyCredentialValueRead=false`
- `envValueRead=false`
- `secretValueRead=false`
- `sqlExecuted=false`
- `supabaseClientImported=false`
- `supabaseConnectionAttempted=false`
- `supabaseReadsEnabled=false`
- `supabaseWritesEnabled=false`
- `marketDataFetched=false`
- `rawPayloadRead=false`
- `rowPayloadRead=false`
- `stockIdPayloadRead=false`
- `candidateRowsRead=false`
- `dailyPricesRead=false`
- `dailyPricesMutated=false`
- `rollbackExecuted=false`
- `aggregateReadbackExecuted=false`
- `postRunReviewExecuted=false`
- `duplicateProofExecuted=false`
- `publicDataSource=mock`
- `scoreSource=mock`

If any required flag is missing or contradicted, the decision shape must be `repair_required` or `no_go`.

## PM Integration Notes

- PM owns the mainline `TWII external values shape recheck preparation gate`; A1 owns this local-only contract review.
- PM may integrate this file as a preparation-gate contract for field names, presence states, placeholder classes, blocked reasons, and fail-closed behavior only.
- PM must keep the target scope bounded to `TWII`, `daily_prices`, and `60 rows`.
- PM must keep external values outside Git, logs, local reports, screenshots, comments, status boards, and handoff summaries.
- PM may check field-name presence and placeholder completeness only; PM must not request or validate value bodies.
- PM must keep `publicDataSource=mock` and `scoreSource=mock`.
- PM must treat `go`, `no_go`, and `repair_required` as shape placeholders, not real decision values.
- PM must not treat this review as SQL authorization, Supabase authorization, credential-read approval, confirmation-phrase approval, source-rights approval, legal approval, real-data intake approval, `daily_prices` write approval, rollback approval, readback proof, post-run proof, duplicate proof, launch readiness, or investment advice.

## Final A1 Posture

The PM mainline `TWII external values shape recheck preparation gate` is contract-review-ready only as a local-only, field-name-only, presence-only, fail-closed preparation gate. It may name the bounded target scope `TWII / daily_prices / 60 rows`, define allowed placeholder classes, and prepare decision shape placeholders, but it must not access real external values, secrets, credentials, confirmation phrases, SQL, Supabase, market data, row payloads, candidate rows, or `daily_prices` contents.
