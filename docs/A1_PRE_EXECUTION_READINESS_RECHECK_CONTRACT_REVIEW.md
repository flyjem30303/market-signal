# A1 Pre-Execution Readiness Recheck Contract Review

Status: `a1_pre_execution_readiness_recheck_contract_review_ready`

Date: 2026-06-11

Owner lane: A1 Data / TWII Pre-Execution Readiness Contract Review

Scope: `contract-only / readiness-recheck-only / review-only / no-execution`

Purpose: review the PM mainline contract for the upcoming `TWII pre-execution readiness recheck gate`. This document defines the minimum safe contract shape for a recheck that can confirm prerequisite readiness labels, placeholders, and fail-closed safety flags before any future separately authorized execution path. It must not execute, connect, read secrets, read real decision values, accept rows, or promote runtime sources.

This review does not execute SQL, connect to Supabase, import `@supabase/supabase-js`, create a Supabase client, call `.from`, `.insert`, `.update`, `.delete`, or `.upsert`, read env values, read secrets, read authorization values, read confirmation phrases, read or fill real decision values, fetch market data, inspect raw payloads, inspect row payloads, inspect stock-id payloads, create staging rows, mutate or read `daily_prices` as proof, accept candidate rows, set `publicDataSource=supabase`, set `scoreSource=real`, or authorize execution.

## Required Readiness Checks

The PM recheck gate may require these readiness checks at schema and status-label level only:

| Check | Required state | Value access allowed |
| --- | --- | --- |
| `sourceRightsReadiness` | Safe label indicating source-rights review status is present or blocked. | `false` |
| `candidateArtifactReadiness` | Safe label indicating candidate artifact review status is present or blocked. Must not accept candidate rows. | `false` |
| `operatorDecisionPresence` | Presence-only state for an external operator decision slot. | `false` |
| `authorizationPresence` | Presence-only state for external authorization. | `false` |
| `confirmationPhrasePresence` | Presence-only state for an external confirmation phrase. | `false` |
| `executeSwitchPresence` | Presence-only state for an external execute switch. | `false` |
| `serverOnlyCredentialPresence` | Presence-only credential state. Must never include credential values, env values, masked strings, hashes, lengths, prefixes, or suffixes. | `false` |
| `rollbackProofPlaceholder` | Placeholder proving rollback evidence is still required or externally deferred. | `false` |
| `aggregateReadbackProofPlaceholder` | Placeholder proving aggregate readback evidence is still required or externally deferred. | `false` |
| `postRunReviewPlaceholder` | Placeholder proving post-run review remains required after any future separate attempt. | `false` |
| `duplicateRejectionProofPlaceholder` | Placeholder proving duplicate rejection evidence remains required. Must not read or accept rows. | `false` |
| `blockedReasons` | Code-only blocked reasons for any missing, stale, unsafe, or forbidden readiness state. | `false` |
| `nextReviewOnlyRoute` | Review-only route label. Must not imply execution, write, source promotion, or real scoring. | `false` |
| `publicDataSource` | Must be exactly `mock`. | `false` |
| `scoreSource` | Must be exactly `mock`. | `false` |
| `safetyFlags` | Required fail-closed booleans listed in this review. | `false` |

Any check that requires SQL output, Supabase response bodies, env values, secrets, credential values, authorization values, confirmation phrase text, execute-switch values, real decision values, market data, raw payloads, row payloads, stock-id payloads, candidate-row contents, `daily_prices` contents, staging rows, or real score output is outside this contract and must fail closed.

## Presence-Only Credential Semantics

Credential-adjacent fields are allowed only as presence state. The recheck may record whether a required credential slot has a safe presence label, but it must not read, print, copy, hash, compare, validate, transform, mask, store, or connect with the credential value.

Allowed presence states:

| Presence state | Meaning |
| --- | --- |
| `present_external_not_read` | An external operator or server-only process indicates the slot exists, but the value was not accessed here. |
| `missing_external` | The required slot is not available to the recheck. |
| `withheld_external` | The required slot is intentionally withheld from local artifacts. |
| `unknown_fail_closed` | The recheck cannot establish safe presence without forbidden access, so it blocks. |

Presence-only fields must never include real values, partial values, masked values, hashes, lengths, examples, prefixes, suffixes, env contents, secret contents, SQL output, Supabase responses, market values, row contents, payload snippets, candidate-row details, or `daily_prices` evidence.

## Proof Placeholders

The PM recheck contract should include explicit placeholders for proof categories that are required before any future separately authorized attempt but are not allowed to be produced by this review.

Required placeholder names:

- `rollback_proof_required_not_executed`
- `aggregate_readback_required_not_run`
- `post_run_review_required_after_future_attempt`
- `duplicate_rejection_proof_required_no_row_access`
- `credential_presence_required_value_not_read`
- `authorization_presence_required_value_not_read`
- `confirmation_phrase_presence_required_value_not_read`
- `execute_switch_presence_required_value_not_read`
- `candidate_artifact_review_required_no_candidate_rows_accepted`

Placeholder rules:

- Placeholders are schema-level only.
- Placeholders are not evidence that a proof passed.
- Placeholders are not authorization to execute, connect, write, accept rows, promote sources, or enable real scoring.
- Placeholders must not contain real decision values, authorization values, confirmation phrases, execute-switch values, credential values, env values, secrets, market data, payload contents, row contents, candidate-row bodies, SQL bodies, Supabase responses, or `daily_prices` contents.
- A missing placeholder keeps the route blocked until the PM contract is repaired.

## Blocked Reasons

The PM gate should use stable blocked reason codes that identify stop conditions without exposing values:

| Blocked reason | Required route |
| --- | --- |
| `missing_source_rights_readiness` | `repair_pre_execution_readiness_recheck_contract` |
| `missing_candidate_artifact_readiness` | `repair_pre_execution_readiness_recheck_contract` |
| `missing_operator_decision_presence` | `repair_pre_execution_readiness_recheck_contract` |
| `missing_authorization_presence` | `repair_pre_execution_readiness_recheck_contract` |
| `missing_confirmation_phrase_presence` | `repair_pre_execution_readiness_recheck_contract` |
| `missing_execute_switch_presence` | `repair_pre_execution_readiness_recheck_contract` |
| `missing_server_only_credential_presence` | `repair_pre_execution_readiness_recheck_contract` |
| `missing_rollback_placeholder` | `repair_pre_execution_readiness_recheck_contract` |
| `missing_readback_placeholder` | `repair_pre_execution_readiness_recheck_contract` |
| `missing_postrun_placeholder` | `repair_pre_execution_readiness_recheck_contract` |
| `missing_duplicate_proof_placeholder` | `repair_pre_execution_readiness_recheck_contract` |
| `unsupported_presence_state` | `repair_pre_execution_readiness_recheck_contract` |
| `forbidden_value_access_requested` | `remain_blocked_no_value_access` |
| `forbidden_sql_or_supabase_path` | `remain_blocked_no_value_access` |
| `forbidden_market_payload_or_row_path` | `remain_blocked_no_value_access` |
| `forbidden_daily_prices_or_candidate_acceptance_path` | `remain_blocked_no_value_access` |
| `forbidden_real_source_or_real_score_path` | `remain_blocked_no_value_access` |
| `execution_route_requested` | `remain_blocked_no_execution` |

Blocked reasons must be code-only. They may name field labels, proof categories, route labels, and stop-line classes, but must not include the values that caused the block.

## Next Review-Only Route

Allowed next routes:

| Route | Meaning |
| --- | --- |
| `pm_refresh_pre_execution_readiness_recheck_metadata` | PM refreshes labels, version, status, placeholders, blocked reasons, and safety flags only. |
| `repair_pre_execution_readiness_recheck_contract` | PM or A1 repairs schema-level fields, presence vocabulary, placeholder coverage, or fail-closed flags. |
| `pre_execution_readiness_recheck_remains_blocked` | The recheck is complete enough to show what remains blocked, but not enough to proceed. |
| `future_separately_authorized_execution_packet_required` | A separate future packet is required before any execution, write, real intake, or source promotion. |
| `remain_blocked_no_value_access` | The gate remains blocked because proceeding would require forbidden value access. |
| `remain_blocked_no_execution` | The gate remains blocked because the requested route implies execution. |

Forbidden route meanings:

- run SQL
- connect to Supabase
- read env, secrets, authorization values, confirmation phrases, execute-switch values, credential values, or real decision values
- fetch, inspect, transform, ingest, or store market data
- inspect raw payloads, row payloads, stock-id payloads, source bodies, candidate rows, or row contents
- mutate, repair, read as proof, or accept anything in `daily_prices`
- accept candidate rows
- set `publicDataSource=supabase`
- set `scoreSource=real`
- execute a runner, write path, real intake path, launch path, source-promotion path, or public real-data route

## Fail-Closed Rules

The PM readiness recheck gate must fail closed when any of the following appears, is implied, or is required to proceed:

- SQL execution, SQL preparation for execution, SQL body review, or SQL result review is requested.
- Supabase import, client creation, connection, read, write, query-chain usage, or response inspection is requested.
- `.from`, `.insert`, `.update`, `.delete`, or `.upsert` usage is requested.
- Env, secret, credential, authorization, confirmation phrase, execute-switch, or real decision values must be read, printed, copied, compared, derived, hashed, filled, stored, or validated.
- Presence-only fields contain value bodies, partial values, masked values, hashes, lengths, examples, prefixes, suffixes, or derived indicators.
- Raw payloads, row payloads, stock-id payloads, source bodies, candidate rows, trade-date lists, per-date values, market values, or row contents must be read or output.
- Market data must be fetched, imported, ingested, transformed, refreshed, stored, or committed.
- `daily_prices` must be read as evidence, inserted, updated, deleted, merged, upserted, repaired, mutated, or used for row acceptance.
- Candidate rows are accepted, counted as accepted, or treated as acceptance-ready.
- `publicDataSource=supabase` appears, is requested, or is implied.
- `scoreSource=real` appears, is requested, or is implied.
- `executionAllowedNow=true`, `writeGateExecutableNow=true`, `runnerExecutableNow=true`, or `finalExecutionAllowedNow=true` appears, is requested, or is implied.
- A next route implies execution, write readiness, source promotion, candidate-row acceptance, real scoring, public launch readiness, or real data availability.

Required fail-closed safety flags:

- `contractOnly=true`
- `readinessRecheckOnly=true`
- `reviewOnly=true`
- `localOnly=true`
- `noExecution=true`
- `presenceOnlySemantics=true`
- `credentialPresenceOnly=true`
- `credentialValuesRead=false`
- `envValueRead=false`
- `secretValueRead=false`
- `authorizationValueRead=false`
- `confirmationPhraseRead=false`
- `executeSwitchValueRead=false`
- `realDecisionValueRead=false`
- `realDecisionValueFilled=false`
- `sqlExecuted=false`
- `supabaseClientImported=false`
- `supabaseConnectionAttempted=false`
- `supabaseReadsEnabled=false`
- `supabaseWritesEnabled=false`
- `marketDataFetched=false`
- `marketDataIngested=false`
- `rawPayloadOutput=false`
- `rowPayloadOutput=false`
- `stockIdPayloadOutput=false`
- `dailyPricesReadAsEvidence=false`
- `dailyPricesMutated=false`
- `candidateRowsAccepted=false`
- `rollbackProofPassed=false`
- `aggregateReadbackPassed=false`
- `postRunReviewPassed=false`
- `duplicateRejectionProofPassed=false`
- `publicDataSource=mock`
- `scoreSource=mock`

If any required safety flag is missing, stale, unknown, overloaded, or conflicting, the route must be `repair_pre_execution_readiness_recheck_contract`, `remain_blocked_no_value_access`, or `remain_blocked_no_execution`.

## PM Integration Notes

- PM owns the mainline `TWII pre-execution readiness recheck gate`; A1 owns this contract boundary review.
- PM may integrate this file as the A1 contract review for readiness recheck shape only.
- PM should place this recheck before any future separately authorized execution packet and after any upstream safe metadata-only readiness inputs.
- PM may check readiness labels, placeholder presence, blocked reason codes, and fail-closed safety flags only.
- PM must keep external decision, authorization, confirmation phrase, execute-switch, credential, env, and secret values outside Git, local artifacts, logs, reports, screenshots, comments, and handoff summaries.
- PM should preserve `publicDataSource=mock` and `scoreSource=mock` on every route.
- PM should treat rollback, readback, post-run review, and duplicate proof entries as placeholders until a separate future authorized path produces actual evidence.
- PM must not treat any placeholder as passed proof, source-rights approval, legal approval, row acceptance, write approval, real-data approval, public-launch readiness, or investment advice.
- PM must not treat `present_external_not_read` as authorization to execute, write, accept candidate rows, mutate `daily_prices`, promote sources, enable real scoring, or launch public real data.
- PM should route unknown presence states, missing placeholders, conflicting safety flags, or forbidden fields to repair or remain-blocked routes.

## Final A1 Posture

The PM mainline `TWII pre-execution readiness recheck gate` is contract-reviewable only if it remains review-only, presence-only, and fail-closed; readiness checks stay at safe label level; credential semantics never expose values; rollback, aggregate readback, post-run review, and duplicate proof remain explicit placeholders; blocked reasons are code-only; next routes are review-only; `publicDataSource=mock` and `scoreSource=mock` remain fixed; and every SQL, Supabase, env, secret, authorization, confirmation phrase, real decision value, market-data, payload, row, candidate-row, `daily_prices`, execution, write, source-promotion, and real-score path fails closed.
