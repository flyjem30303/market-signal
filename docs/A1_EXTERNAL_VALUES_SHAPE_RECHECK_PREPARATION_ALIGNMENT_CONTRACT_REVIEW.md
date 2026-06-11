# A1 External Values Shape Recheck Preparation Alignment Contract Review

Status: a1_external_values_shape_recheck_preparation_alignment_contract_review_ready

Date: 2026-06-11

Owner lane: A1 Data / Contract

Scope: `local-only / review-only / shape-only / presence-only / field-name-only / no-execution`

Purpose: review the TWII `external values shape contract` alignment for the PM preparation gate after the `operator value intake stopline preparation alignment handoff`. This document is only a shape, presence, and field-name-only review. It does not read true values, accept true values, validate true values, infer true values, store true values, execute any command, connect to Supabase, run SQL, fetch market data, or write rows.

## Review Target

This review checks whether a future preparation gate can name the fields and placeholder classes needed for a bounded TWII external values shape recheck.

| Alignment item | Required local-only posture |
| --- | --- |
| Target lane | `TWII` |
| Target table label | `daily_prices` |
| Target bounded row label | `60 rows` |
| Public source posture | `publicDataSource=mock` |
| Score source posture | `scoreSource=mock` |
| Review mode | `shape/presence/field-name-only` |
| Execution mode | `no_execution_allowed` |

The `daily_prices` and `60 rows` references are labels for the external values shape contract only. They are not permission to read, write, compare, accept, reject, stage, upsert, delete, backfill, score, or inspect any row.

## Value Class Rules

`value class rules` for this preparation alignment review are limited to safe class labels:

| Value class | Allowed review meaning | Value access allowed |
| --- | --- | --- |
| `decision_placeholder` | A decision field name may exist as a shape placeholder. | `false` |
| `authorization_presence_placeholder` | An authorization presence field name may exist. | `false` |
| `execute_switch_placeholder` | An execute switch field name may exist. | `false` |
| `confirmation_phrase_placeholder` | A confirmation phrase field name may exist. | `false` |
| `server_only_credential_presence_placeholder` | A server-only credential presence field name may exist. | `false` |
| `rollback_dry_run_proof_placeholder` | A rollback dry-run proof field name may exist. | `false` |
| `aggregate_readback_proof_placeholder` | An aggregate readback proof field name may exist. | `false` |
| `post_run_review_proof_placeholder` | A post-run review proof field name may exist. | `false` |
| `duplicate_rejection_proof_placeholder` | A duplicate rejection proof field name may exist. | `false` |

These value class rules do not allow masked values, partial values, hashes, lengths, examples, payload snippets, credentials, authorization text, confirmation phrase text, real decision values, SQL output, Supabase responses, market values, candidate rows, or `daily_prices` contents.

## Field-Name-Only Placeholders

`field-name-only placeholders` allowed for this preparation alignment contract:

| Placeholder phrase | Field-name-only alignment |
| --- | --- |
| `decision placeholder` | May name a future decision slot; must not contain or imply a real decision. |
| `authorization presence placeholder` | May name a future authorization presence slot; must not contain authorization content. |
| `execute switch placeholder` | May name a future execute switch slot; must not contain an execute switch value. |
| `confirmation phrase placeholder` | May name a future confirmation phrase slot; must not contain phrase text. |
| `server-only credential presence placeholder` | May name a future credential presence slot; must not contain credential, env, key, token, URL, or secret content. |
| `rollback dry-run proof placeholder` | May name a future rollback proof slot; must not claim rollback proof passed. |
| `aggregate readback proof placeholder` | May name a future aggregate readback proof slot; must not perform or claim readback. |
| `post-run review proof placeholder` | May name a future post-run review proof slot; must not perform or claim post-run review. |
| `duplicate rejection proof placeholder` | May name a future duplicate rejection proof slot; must not inspect candidate rows or `daily_prices` duplicates. |

All placeholders are contract labels only. They are not operator decisions, authorization, execution switches, confirmation phrases, credentials, rollback proof, readback proof, post-run proof, duplicate proof, row acceptance, source promotion, or launch readiness.

## Presence-Only Checks

`presence-only checks` may inspect only whether a safe field name and safe presence label are represented in a local review artifact.

Allowed presence labels:

- `present_external_not_read`
- `missing_external`
- `withheld_external`
- `not_applicable_for_this_review`
- `unknown_fail_closed`

Presence-only checks must not open, read, copy, print, hash, compare, transform, derive, validate, normalize, classify, accept, reject, or store the underlying external value.

## Allowed Placeholder Classes

`allowed placeholder classes` for this review:

- `external_decision_value_not_read`
- `external_authorization_presence_not_read`
- `external_execute_switch_presence_not_read`
- `external_confirmation_phrase_presence_not_read`
- `server_only_credential_presence_not_read`
- `rollback_dry_run_proof_not_run`
- `aggregate_readback_proof_not_run`
- `post_run_review_proof_not_run`
- `duplicate_rejection_proof_not_run`
- `bounded_twii_daily_prices_60_rows_shape_label_only`
- `publicDataSource=mock`
- `scoreSource=mock`

These placeholder classes may be used only to prepare a future PM review shape. They do not approve execution and do not permit real value intake.

## Forbidden Value Surfaces

`forbidden value surfaces` for this contract include:

- SQL text, SQL execution, SQL results, migration output, query plans, or database diagnostics.
- Supabase URLs, keys, clients, dashboard details, API responses, `.from` chains, inserts, updates, deletes, upserts, or readbacks.
- Secrets, env values, credentials, authorization values, execute switch values, confirmation phrase values, server-only configuration values, or real decision values.
- Raw market data, source payloads, row payloads, stock-id payloads, candidate rows, per-date values, trade-date lists, or row-level values.
- `daily_prices` reads, writes, staging rows, accepted rows, rejected rows, duplicate rows, row diffs, coverage scoring, or mutation proof.
- `publicDataSource=supabase`, `scoreSource=real`, source promotion, real scoring, launch readiness, or operational go-live claims.

If any forbidden value surface is requested or appears in a proposed artifact, the review must fail closed.

## Blocked Reasons

`blocked reasons` must be code-only and must never include the blocked value.

Allowed blocked reason codes:

- `missing_twii_shape_label`
- `missing_daily_prices_shape_label`
- `missing_60_rows_shape_label`
- `missing_publicDataSource_mock_posture`
- `missing_scoreSource_mock_posture`
- `missing_field_name_only_placeholder`
- `missing_presence_only_check`
- `unsupported_placeholder_class`
- `forbidden_value_surface_requested`
- `real_value_intake_requested`
- `sql_or_supabase_requested`
- `daily_prices_read_or_write_requested`
- `candidate_rows_acceptance_requested`
- `execution_requested`
- `source_promotion_requested`

## Next Route

`next route` for PM integration:

| Route | Meaning |
| --- | --- |
| `pm_integrate_preparation_alignment_contract_review` | PM may use this file as a local-only alignment note for field names and placeholder classes. |
| `repair_preparation_alignment_contract_shape` | Repair only field names, presence labels, placeholder classes, blocked reasons, or fail-closed flags. |
| `external_values_remain_out_of_repo` | External values remain outside repo artifacts and are not read. |
| `future_separately_authorized_execution_packet_required` | Any execution would require a separate reviewed packet outside this contract. |
| `remain_blocked_no_value_access` | The route remains blocked because progress would require forbidden value access. |

No next route in this document authorizes SQL, Supabase, secret reads, env reads, authorization reads, confirmation phrase reads, market-data fetches, `daily_prices` mutation, candidate row acceptance, source promotion, `publicDataSource=supabase`, or `scoreSource=real`.

## Fail-Closed Rules

`fail-closed rules`:

- If real values are supplied, requested, copied, masked, hashed, summarized, compared, inferred, accepted, or stored, fail closed.
- If authorization, execute switch, confirmation phrase, server-only credential, env, secret, or real decision values are requested or exposed, fail closed.
- If SQL or Supabase access is requested or implied, fail closed.
- If market data, raw payloads, row payloads, stock-id payloads, candidate rows, or `daily_prices` row contents are requested, fail closed.
- If staging rows, `daily_prices` writes, row acceptance, duplicate checks, aggregate readback execution, rollback dry-run execution, or post-run execution are requested, fail closed.
- If `publicDataSource=supabase` or `scoreSource=real` is requested, fail closed.
- If a placeholder is treated as approval, authorization, proof, source promotion, or launch readiness, fail closed.

Required safety posture:

- `localOnly=true`
- `reviewOnly=true`
- `shapeOnly=true`
- `presenceOnly=true`
- `fieldNameOnly=true`
- `noExecution=true`
- `realValuesRead=false`
- `realValuesAccepted=false`
- `authorizationValuesRead=false`
- `executeSwitchValuesRead=false`
- `confirmationPhraseValuesRead=false`
- `serverOnlyCredentialValuesRead=false`
- `envValuesRead=false`
- `secretsRead=false`
- `sqlExecuted=false`
- `supabaseConnected=false`
- `marketDataFetched=false`
- `dailyPricesRead=false`
- `dailyPricesWritten=false`
- `stagingRowsCreated=false`
- `candidateRowsAccepted=false`
- `publicDataSource=mock`
- `scoreSource=mock`

## PM Integration Notes

`PM integration notes`:

1. PM may reference this review as local-only preparation alignment for the TWII external values shape contract.
2. PM may copy the field names, presence labels, allowed placeholder classes, blocked reasons, next route labels, and fail-closed rules into a future preparation gate.
3. PM must keep external values outside this repo and outside this artifact.
4. PM must treat `decision placeholder`, `authorization presence placeholder`, `execute switch placeholder`, `confirmation phrase placeholder`, and `server-only credential presence placeholder` as field-name-only labels, not values.
5. PM must treat `rollback dry-run proof placeholder`, `aggregate readback proof placeholder`, `post-run review proof placeholder`, and `duplicate rejection proof placeholder` as future proof-shape labels, not completed proof.
6. PM must preserve `publicDataSource=mock` and `scoreSource=mock`.
7. PM must not route this review into runtime execution, SQL, Supabase, market-data fetch, `daily_prices` mutation, staging rows, candidate rows, source promotion, or real scoring.

## Review Outcome

`external values shape contract` preparation alignment is ready for PM review as a local-only, shape-only, presence-only, field-name-only contract note.

Execution remains blocked. Real value intake remains blocked. Authorization value intake remains blocked. Confirmation phrase intake remains blocked. Server-only credential inspection remains blocked. Supabase access remains blocked. SQL remains blocked. Market-data fetch remains blocked. `daily_prices` read/write remains blocked. Candidate row acceptance remains blocked. Source promotion remains blocked.
