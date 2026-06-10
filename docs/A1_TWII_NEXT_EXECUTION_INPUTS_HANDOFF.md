# A1 TWII Next Execution Inputs Handoff

Status: `a1_twii_next_execution_inputs_handoff_ready_local_only_background`

Date: 2026-06-10

Owner lane: A1 Data / Supabase / Market Evidence

Purpose: local-only handoff for TWII inputs that A1 can prepare between credential-presence review and the next bounded write gate. This file is an input inventory only. It does not modify PM mainline credential or execute-switch gates, does not execute a write gate, and does not authorize implementation or execution.

## Current Position

This handoff continues from `docs/A1_DATA_COVERAGE_NEXT_BATCH_HANDOFF.md`.

Current TWII lane state:

- Lane: `TWII`.
- Asset type: `index`.
- Target table for a future gate: `daily_prices`.
- Target scope: `twii_index_daily_prices_missing_rows`.
- Expected rows: `60`.
- Already observed rows: `0`.
- Candidate missing rows: `60`.
- Current runtime boundary: `publicDataSource=mock`.
- Current scoring boundary: `scoreSource=mock`.
- Current execution posture: blocked until a separate future bounded write gate is explicitly accepted.

This file may be used to reduce PM/A1 review friction, but it is not a PM decision record, credential check, execute-switch packet, write authorization, readback proof, coverage scoring gate, or promotion gate.

## Prepared Input 1: Sanitized Candidate Artifact Path

Canonical local candidate artifact path:

- `data/candidates/twii-sanitized-candidate.json`

Expected safe artifact identifiers and aggregate values:

| Field | Expected value |
| --- | --- |
| `artifactId` | `twii-sanitized-candidate-20260609` |
| `lane` | `TWII` |
| `assetType` | `index` |
| `symbol` | `TWII` |
| `scope` | `twii_index_daily_prices_missing_rows` |
| `sourceLane` | `official-exchange-index` |
| `sourceRightsGateStatus` | `twii_source_rights_outcome_gate_candidate_ready_for_pm_review` |
| `fieldContractVersion` | `twii-v1` |
| `coverageWindowSessions` | `60` |
| `alreadyObservedRows` | `0` |
| `candidateMissingRows` | `60` |
| `expectedRows` | `60` |
| `reviewOutputPolicy` | `aggregate_only_no_raw_or_row_payloads_no_stock_id_payloads` |
| `sanitizedAggregateOnly` | `true` |
| `rawPayloadIncluded` | `false` |
| `rowPayloadIncluded` | `false` |
| `stockIdPayloadIncluded` | `false` |
| `secretsIncluded` | `false` |

A1 may prepare references to this path and these aggregate fields. A1 must not expand this handoff with raw source values, source response bodies, per-row market values, credential-derived URLs, stock id payloads, or secrets.

## Prepared Input 2: Source-Rights Evidence References

Safe source-rights references that can be named before a bounded write gate:

| Reference | Safe use before bounded write gate |
| --- | --- |
| `docs/TWII_SOURCE_RIGHTS_OUTCOME_GATE.md` | Source-rights outcome candidate review context only. |
| `docs/A1_TWII_SANITIZED_CANDIDATE_ARTIFACT_READINESS_GATE.md` | Aggregate-only artifact contract and sequence guard. |
| `data/source-gates/a1-exact-source-rights-evidence-intake-outcomes.json` | Four TWII no-secret evidence slots accepted for the next source-rights gate only. |
| `data/source-gates/twii-write-prerequisite-intake-ledger.json#source-rights-decision` | Plan-only source-rights prerequisite for future candidate-gate preparation. |
| `data/source-gates/twii-write-prerequisite-intake-ledger.json#field-contract-decision` | Plan-only field-contract prerequisite for future candidate-gate preparation. |
| `data/source-gates/twii-write-prerequisite-intake-ledger.json#asset-mapping-decision` | Plan-only asset-mapping prerequisite for future candidate-gate preparation. |
| `data/source-gates/twii-write-implementation-candidate-gate-packet.json` | Non-executable candidate gate packet with `implementationAllowedNow=false`. |
| `data/source-gates/twii-no-secret-execution-readiness-review.json` | No-secret readiness review showing execution remains blocked. |
| `data/source-gates/twii-real-write-runner-implementation-review-gate.json` | Implementation review showing runner execution and Supabase implementation remain blocked. |

The accepted TWII evidence slots are:

- `vendor-terms-evidence`;
- `internal-feed-owner-evidence`;
- `field-contract-evidence`;
- `asset-mapping-evidence`.

These slots are accepted for preparation and review only. They do not approve probing, fetching, ingestion, candidate row acceptance, SQL, Supabase, `daily_prices` mutation, row coverage scoring, public source promotion, or `scoreSource=real`.

## Prepared Input 3: Aggregate-Only QA Checklist

A1 can prepare the following local-only checklist for PM review before any later bounded write gate:

| Check | Required aggregate-only condition |
| --- | --- |
| Artifact path exists | The referenced path is `data/candidates/twii-sanitized-candidate.json`. |
| Scope is bounded | `lane=TWII`, `targetScope=twii_index_daily_prices_missing_rows`, `maxRows=60`. |
| Candidate counts are bounded | `expectedRows=60`, `candidateMissingRows=60`, `alreadyObservedRows=0`. |
| Output policy is safe | `reviewOutputPolicy=aggregate_only_no_raw_or_row_payloads_no_stock_id_payloads`. |
| Payload flags are safe | Raw payload, row payload, stock id payload, and secrets flags are all `false`. |
| Source lane is review-only | `sourceLane=official-exchange-index` remains source-rights / field-contract review context only. |
| Duplicate policy is named | Future candidate gate should keep duplicate rejection explicit before any insert attempt. |
| Rollback dry-run is required | Future packet must stop if rollback scope is missing or not aggregate-only. |
| Readback plan is required | Future packet must name aggregate readback fields before execution. |
| Post-run review is required | Future packet must name the post-run review artifact before execution. |
| Promotion remains blocked | `publicDataSource=mock`, `scoreSource=mock`, row coverage scoring blocked. |

This checklist is a preparation aid. Passing it locally must not be treated as execution readiness, row acceptance, write authorization, or coverage completion.

## Prepared Input 4: Expected Aggregate Readback Fields

If a future PM gate later authorizes a bounded write attempt, the post-run readback should report only sanitized aggregate fields.

Expected readback fields:

- `attempt_id`;
- `authorization_id`;
- `target_lane`;
- `target_scope`;
- `target_table`;
- `max_rows`;
- `attempted_row_count`;
- `inserted_row_count`;
- `rejected_row_count`;
- `duplicate_row_count`;
- `post_write_max_trade_date`;
- `rollback_scope_status`;
- `readback_status`;
- `sanitized_error_code`;
- `sanitized_error_category`;
- `promotion_allowed`;
- `row_coverage_scoring_allowed`;
- `publicDataSource`;
- `scoreSource`.

Readback must not print source values, row values, market-data payloads, raw responses, credentials, private URLs, SQL results with row bodies, stock id payloads, or secrets.

## Prepared Input 5: Expected Post-Run Review Fields

If a future PM gate later authorizes a bounded write attempt, the immediate post-run review should contain only safe aggregate and decision fields:

| Field group | Expected aggregate-only content |
| --- | --- |
| Run identity | `attempt_id`, `authorization_id`, named runner or command reference, post-run review path. |
| Scope | `target_lane=TWII`, `target_scope=twii_index_daily_prices_missing_rows`, `target_table=daily_prices`, `maxRows=60`. |
| Candidate reference | `candidateArtifactPath=data/candidates/twii-sanitized-candidate.json`. |
| Gate status | Whether the gate was accepted, blocked, failed closed, or not executed. |
| Mutation summary | Attempted, inserted, rejected, duplicate counts only. |
| Rollback readiness | Aggregate rollback dry-run status and stop-line result only. |
| Readback summary | Aggregate readback status and counts only. |
| Safety flags | SQL executed, Supabase connection attempted, Supabase writes enabled, market data fetched, market data ingested, raw payload output, row payload output, stock id payload output, secrets output. |
| Promotion locks | `promotionAllowed=false`, `rowCoverageScoringAllowed=false`, `publicDataSource=mock`, `scoreSource=mock` unless a later separate promotion gate changes them. |
| Follow-up route | Next PM action: accept aggregate review, repair bounded gate, or keep blocked. |

The post-run review alone must not award row coverage points, claim Level 1 closure, promote public source status, or set real scoring.

## Non-Executable Boundaries

This handoff does not authorize and did not perform:

- SQL execution;
- Supabase connection;
- Supabase read;
- Supabase write;
- Supabase client import for execution;
- credential presence check execution;
- credential value read;
- secret output;
- PM credential gate edit;
- PM execute-switch gate edit;
- execute switch provision;
- confirmation phrase provision;
- runner execution;
- external endpoint probe;
- market-data fetch;
- market-data ingestion;
- market-data storage;
- market-data commit;
- source-derived candidate row generation;
- candidate row acceptance;
- staging row creation;
- `daily_prices` mutation;
- rollback execution;
- aggregate readback execution;
- post-run review execution;
- row coverage scoring;
- row coverage point award;
- public source promotion;
- raw payload output;
- source response body output;
- row payload output;
- stock id payload output;
- source URL output with tokens or credentials;
- copied source terms text output;
- private dashboard link output;
- `publicDataSource=supabase`;
- `scoreSource=real`;
- public launch completion claim.

Current runtime boundary remains `publicDataSource=mock`.

Current scoring boundary remains `scoreSource=mock`.

## Suggested Next Local-Only A1 Preparation

1. Keep this file as the TWII input index for PM/A1 review.
2. If requested later, prepare a separate no-execution review template that references only the aggregate fields above.
3. Do not touch PM credential or execute-switch gate files unless PM explicitly opens that mainline task.
4. Do not run any command that connects to Supabase, checks credential presence, executes SQL, probes an external source, fetches market data, writes market data, mutates `daily_prices`, or prints secrets.

