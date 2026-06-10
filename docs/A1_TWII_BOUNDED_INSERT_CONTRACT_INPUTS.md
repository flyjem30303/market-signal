# A1 TWII Bounded Insert Contract Inputs

Status: `a1_twii_bounded_insert_contract_inputs_ready_local_only`

Date: 2026-06-11

Owner lane: A1 Data / Supabase / Market Evidence

Purpose: local-only input consolidation for a future TWII bounded insert missing-only contract. This document carries safe contract inputs only. It does not edit PM mainline bounded insert contract gate files, does not execute SQL, does not connect to Supabase, does not write Supabase, and does not fetch, import, store, commit, read, or output raw market data.

Primary upstream handoff:

- `docs/A1_TWII_NEXT_EXECUTION_INPUTS_HANDOFF.md`

This file is safe to use as A1 background preparation for PM review. It is not an execution packet, authorization packet, credential gate, execute-switch gate, readback proof, post-run review, row coverage scoring gate, or promotion gate.

## Contract Target Scope

| Field | Required safe input |
| --- | --- |
| Lane | `TWII` |
| Asset type | `index` |
| Symbol | `TWII` |
| Target table | `daily_prices` |
| Target scope | `twii_index_daily_prices_missing_rows` |
| Insert mode | `missing_only` |
| Duplicate policy | `reject_duplicates` |
| Candidate artifact path | `data/candidates/twii-sanitized-candidate.json` |
| Source lane reference | `official-exchange-index` |
| Field contract version | `twii-v1` |
| Runtime boundary | `publicDataSource=mock` |
| Scoring boundary | `scoreSource=mock` |

The target scope must stay limited to TWII index daily price missing rows. It must not expand to other symbols, ETFs, equity rows, staging tables, raw source tables, or unrelated `daily_prices` ranges.

## 60-Row Upper Bound

| Field | Required value |
| --- | --- |
| `maxRows` | `60` |
| `expectedRows` | `60` |
| `coverageWindowSessions` | `60` |
| `alreadyObservedRows` | `0` |
| `candidateMissingRows` | `60` |

The future contract must fail closed if the candidate artifact, runner input, or review packet asks for more than 60 rows. The 60-row bound is an upper bound, not a target that can be exceeded by retries, overlap repair, backfill expansion, or row coverage scoring.

## Missing-Only And Duplicate Semantics

Required semantics for a future bounded insert contract:

| Semantic | Required behavior |
| --- | --- |
| Missing-only | Insert attempts are limited to rows absent from the accepted target scope. |
| Skip existing | Existing target rows must not be overwritten, updated, deleted, or reinserted. |
| Reject duplicates | Duplicate candidate keys must be rejected before any insert attempt. |
| No partial expansion | Rejected or duplicate rows must not trigger replacement rows outside the 60-row scope. |
| No scoring side effect | Insert acceptance must not automatically award row coverage points. |
| No promotion side effect | Insert acceptance must not change `publicDataSource` or `scoreSource`. |

Duplicate and missing-only review must be aggregate-only. Safe output may include duplicate counts and rejected counts. It must not include row bodies, trade-date lists, source values, stock id payloads, or raw market values.

## Aggregate-Only Readback Fields

If a later PM gate explicitly authorizes a bounded insert attempt, the readback contract should allow only these sanitized aggregate fields:

- `attempt_id`
- `authorization_id`
- `target_lane`
- `target_scope`
- `target_table`
- `max_rows`
- `attempted_row_count`
- `inserted_row_count`
- `rejected_row_count`
- `duplicate_row_count`
- `missing_candidate_row_count`
- `already_existing_row_count`
- `post_write_max_trade_date`
- `rollback_scope_status`
- `readback_status`
- `sanitized_error_code`
- `sanitized_error_category`
- `promotion_allowed`
- `row_coverage_scoring_allowed`
- `publicDataSource`
- `scoreSource`

Readback must stay separate from row coverage scoring. A passing aggregate readback does not prove public launch readiness, source promotion, real scoring readiness, or Level 1 closure.

## Post-Run Review Aggregate Fields

If a later PM gate explicitly authorizes execution, the immediate post-run review should include only these aggregate field groups:

| Field group | Required aggregate-only fields |
| --- | --- |
| Run identity | `attempt_id`, `authorization_id`, named runner or command reference, post-run review path |
| Scope | `target_lane=TWII`, `target_scope=twii_index_daily_prices_missing_rows`, `target_table=daily_prices`, `maxRows=60` |
| Candidate reference | `candidateArtifactPath=data/candidates/twii-sanitized-candidate.json`, `artifactId=twii-sanitized-candidate-20260609` |
| Gate outcome | accepted, blocked, failed closed, or not executed |
| Mutation summary | attempted, inserted, rejected, duplicate, missing-candidate, already-existing counts only |
| Rollback readiness | rollback dry-run required, rollback dry-run status, rollback scope status, stop-line result |
| Readback summary | aggregate readback status and counts only |
| Safety flags | SQL executed, Supabase connection attempted, Supabase writes enabled, market data fetched, market data ingested, raw payload output, row payload output, stock id payload output, secrets output |
| Promotion locks | `promotionAllowed=false`, `rowCoverageScoringAllowed=false`, `publicDataSource=mock`, `scoreSource=mock` |
| Follow-up route | accept aggregate review, repair bounded gate, or keep blocked |

The post-run review must not include raw source payloads, source response bodies, source values, row values, per-date market values, credential-derived URLs, private dashboard links, copied source terms text, or secrets.

## Rollback Readiness Fields

A future bounded insert contract should be considered incomplete unless these rollback readiness inputs are named before execution:

| Field | Required safe input |
| --- | --- |
| `rollbackDryRunRequired` | `true` |
| `rollbackDryRunPassed` | Must be recorded by a separate accepted future pre-run gate before execution. |
| `rollbackScope` | Same bounded target scope: `twii_index_daily_prices_missing_rows`. |
| `rollbackMaxRows` | No greater than `60`. |
| `rollbackOutputPolicy` | Aggregate-only; counts and status only. |
| `rollbackStopLine` | Stop if rollback scope is missing, expands beyond TWII, exceeds 60 rows, requires raw row output, or is not aggregate-only. |
| `destructiveRollbackAllowed` | `false` unless a later explicit PM gate separately authorizes and reviews it. |

Rollback readiness is a prerequisite input, not a rollback execution. This document does not approve deletion, update, truncation, destructive cleanup, SQL, Supabase connection, or Supabase write.

## Source-Rights And Candidate Artifact References

Safe references for future PM review:

| Reference | Safe use |
| --- | --- |
| `docs/A1_TWII_NEXT_EXECUTION_INPUTS_HANDOFF.md` | Upstream local-only input handoff. |
| `docs/TWII_SOURCE_RIGHTS_OUTCOME_GATE.md` | Source-rights outcome candidate review context only. |
| `docs/A1_TWII_SANITIZED_CANDIDATE_ARTIFACT_READINESS_GATE.md` | Aggregate-only artifact contract and sequence guard. |
| `docs/A1_TWII_CANDIDATE_ARTIFACT_DELIVERY_SPEC.md` | Candidate artifact field expectations and safe delivery shape. |
| `data/candidates/twii-sanitized-candidate.json` | Sanitized aggregate-only candidate artifact reference only. |
| `data/source-gates/a1-exact-source-rights-evidence-intake-outcomes.json` | Accepted no-secret source-rights evidence slots for review only. |
| `data/source-gates/twii-write-prerequisite-intake-ledger.json` | Plan-only prerequisites for source-rights, field-contract, asset-mapping, rollback, and readback. |
| `data/source-gates/twii-write-implementation-candidate-gate-packet.json` | Non-executable candidate gate packet with implementation still blocked. |
| `data/source-gates/twii-no-secret-execution-readiness-review.json` | No-secret readiness review showing execution remains blocked. |
| `data/source-gates/twii-real-write-runner-implementation-review-gate.json` | Implementation review showing runner execution and Supabase implementation remain blocked. |

Safe candidate artifact aggregate identifiers:

| Field | Expected value |
| --- | --- |
| `artifactId` | `twii-sanitized-candidate-20260609` |
| `lane` | `TWII` |
| `assetType` | `index` |
| `symbol` | `TWII` |
| `scope` | `twii_index_daily_prices_missing_rows` |
| `sourceLane` | `official-exchange-index` |
| `sourceRightsGateStatus` | `twii_source_rights_outcome_gate_candidate_ready_for_pm_review` |
| `reviewOutputPolicy` | `aggregate_only_no_raw_or_row_payloads_no_stock_id_payloads` |
| `sanitizedAggregateOnly` | `true` |
| `rawPayloadIncluded` | `false` |
| `rowPayloadIncluded` | `false` |
| `stockIdPayloadIncluded` | `false` |
| `secretsIncluded` | `false` |

The accepted evidence slots remain preparation and review inputs only:

- `vendor-terms-evidence`
- `internal-feed-owner-evidence`
- `field-contract-evidence`
- `asset-mapping-evidence`

## Non-Executable Boundaries

This local-only background file does not authorize and did not perform:

- PM mainline bounded insert contract gate edits;
- PM credential gate edits;
- PM execute-switch gate edits;
- execute switch provision;
- confirmation phrase provision;
- SQL execution;
- Supabase connection;
- Supabase read;
- Supabase write;
- Supabase client import for execution;
- credential presence check execution;
- credential value read;
- secret output;
- external endpoint probe;
- market-data fetch;
- market-data import;
- market-data ingestion;
- market-data storage;
- market-data commit;
- source-derived candidate row generation;
- candidate row acceptance;
- raw source payload handling;
- row payload handling;
- stock id payload handling;
- staging row creation;
- `daily_prices` mutation;
- rollback execution;
- aggregate readback execution;
- post-run review execution;
- row coverage scoring;
- row coverage point award;
- public source promotion;
- source response body output;
- source URL output with tokens or credentials;
- copied source terms text output;
- private dashboard link output;
- `publicDataSource=supabase`;
- `scoreSource=real`;
- public launch completion claim.

Current runtime boundary remains `publicDataSource=mock`.

Current scoring boundary remains `scoreSource=mock`.

## Ready-To-Hand-Off Summary

The safe bounded insert missing-only contract inputs are:

1. Scope is `TWII` / `index` / `daily_prices` / `twii_index_daily_prices_missing_rows`.
2. Upper bound is 60 rows, with `expectedRows=60`, `alreadyObservedRows=0`, and `candidateMissingRows=60`.
3. Semantics are missing-only, skip-existing, and reject-duplicates.
4. Readback and post-run review are aggregate-only and must not expose row values or raw payloads.
5. Rollback readiness must be named and accepted before any future execution.
6. Source-rights and candidate references are safe only as review inputs.
7. PM mainline execution, credentials, Supabase, SQL, raw market data, `daily_prices` mutation, promotion, and real scoring remain blocked unless a later explicit gate changes them.
