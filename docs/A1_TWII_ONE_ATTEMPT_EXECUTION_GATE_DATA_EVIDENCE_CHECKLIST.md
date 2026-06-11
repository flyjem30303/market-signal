# A1 TWII One-Attempt Execution Gate Data Evidence Checklist

Updated: 2026-06-12

Status: `a1_twii_one_attempt_execution_gate_data_evidence_checklist_ready_no_execution`

Owner: A1 Data / rollback evidence support lane

Source alignment: `docs/TWII_PM_AUTHORIZATION_REVIEW_DECISION_ALIGNMENT.md`

Mainline route supported: `prepare_one_attempt_runner_execution_gate_no_execution`

## Purpose

This local-only checklist gives PM the data and rollback evidence prerequisites for preparing a future TWII one-attempt runner execution gate without execution.

It supports gate preparation only. It is not execution authorization and it performs no database action. It does not authorize SQL, Supabase connection, Supabase read, Supabase write, staging-row creation, `daily_prices` mutation, market-data fetch, market-data ingestion, raw market-data storage, candidate-row acceptance, row coverage scoring, public data-source promotion, or real score promotion.

## Fixed Scope

- targetLane=TWII
- targetRelation=daily_prices
- targetScope=twii_index_daily_prices_missing_rows
- maxRows=60
- writeMode=bounded_insert_missing_only
- duplicatePolicy=reject_duplicates
- gateMode=preparation_only_no_execution
- publicDataSource=mock
- scoreSource=mock
- executionAllowedNow=false
- writeGateExecutableNow=false
- sqlExecuted=false
- supabaseConnectionAttempted=false
- supabaseWriteAllowedNow=false
- stagingRowsCreated=false
- dailyPricesMutationAllowedNow=false
- marketDataFetched=false
- marketDataIngested=false
- secretsPrinted=false
- readonlyRerunAllowed=false

## Future One-Attempt Data Prerequisites

Before PM can prepare a final one-attempt operator gate, the evidence packet must trace all prerequisites below by safe reference only:

| Prerequisite | Required evidence | Acceptance shape |
| --- | --- | --- |
| Sanitized candidate artifact | Artifact id or local safe path only. | Artifact is sanitized, aggregate-only, and contains no raw payload, row payload, stock-id payload, secrets, or source body. |
| Row count summary | Expected, candidate, rejected, duplicate, and missing counts. | Counts are aggregate only; expected row cap remains `60`; duplicates and rejected rows are explicitly counted or classified as zero. |
| `source_row_hash` | Field presence or hash-policy evidence. | Hash is used only as validation metadata; no raw source row or source-derived row values are exposed. |
| Field contract | TWII-to-`daily_prices` field contract reference. | Contract names target fields, calendar/session behavior, timezone, precision, and missing-session rules without granting write authorization. |
| Source-rights slot | Source-rights outcome or slot reference. | Slot is accepted for the intended TWII missing-row repair use case or clearly marked needs-repair/rejected. |
| Operator phrase | Required future operator phrase shape, not the phrase value. | Phrase value remains absent until a separate PM/operator gate; no confirmation phrase is printed here. |
| Readback route | Aggregate readback route reference. | Readback is bounded and aggregate-only; no raw rows, secrets, SQL, or Supabase credentials are included. |
| Rollback route | Rollback or disable route reference. | Route describes fail-closed rollback review and does not execute rollback, writes, deletes, updates, or schema changes. |
| Post-run review artifact | Post-run review template or artifact reference. | Review must record accepted, rejected, or needs-repair after a future attempt before any promotion or coverage scoring. |

## Accepted Criteria

PM may classify this A1 evidence checklist as `accepted` only if all of the following are true:

- source alignment remains `docs/TWII_PM_AUTHORIZATION_REVIEW_DECISION_ALIGNMENT.md`;
- the PM route remains `prepare_one_attempt_runner_execution_gate_no_execution`;
- sanitized candidate artifact is present by safe path or artifact id;
- candidate artifact is aggregate-only and sanitized;
- row count evidence names expected, candidate, rejected, duplicate, and missing counts;
- expected row count does not exceed `60`;
- duplicate policy remains `reject_duplicates`;
- `source_row_hash` or equivalent row-hash policy is present as metadata only;
- field contract is traceable for TWII, `daily_prices`, and `twii_index_daily_prices_missing_rows`;
- source-rights slot is accepted for the intended use case;
- operator phrase is required only by shape and is not printed;
- readback route is aggregate-only and ready by reference;
- rollback route is ready by reference;
- post-run review artifact is ready by reference;
- public runtime remains `publicDataSource=mock`;
- scoring remains `scoreSource=mock`;
- no SQL, Supabase action, staging rows, `daily_prices` mutation, market-data fetch, readonly rerun, secrets, raw payload, row payload, stock-id payload, public source promotion, or real score promotion is included or implied.

Accepted means PM can prepare the final one-attempt operator gate with execution still blocked. It does not mean the attempt may run.

## Rejected Criteria

PM should classify this checklist as `rejected` if any of the following are true:

- the packet asks to execute SQL or includes executable SQL;
- the packet connects to, reads from, or writes to Supabase;
- the packet creates staging rows or mutates `daily_prices`;
- the packet fetches, ingests, stores, commits, or prints raw market data;
- the sanitized candidate artifact is missing or includes raw payload, row payload, stock-id payload, secrets, or source body;
- candidate scope is not TWII-only;
- target relation is not `daily_prices`;
- target scope is not `twii_index_daily_prices_missing_rows`;
- expected row count exceeds `60`;
- row count evidence omits candidate, rejected, duplicate, or missing counts;
- duplicate policy is broader than `reject_duplicates`;
- field contract conflicts with `daily_prices` or lacks the TWII target mapping;
- source-rights slot is rejected for the intended use case;
- operator phrase value, credentials, env values, tokens, cookies, or secrets are printed;
- readback, rollback, or post-run review route is missing;
- the packet implies `publicDataSource=supabase`, `scoreSource=real`, row coverage scoring, public launch completion, real-data availability, or investment advice.

Rejected means PM must stop gate preparation and route to repair inputs only.

## Needs-Repair Criteria

PM should classify this checklist as `needs-repair` if the packet is directionally aligned but incomplete in a non-executing way:

- sanitized candidate artifact is referenced but artifact id or safe path is ambiguous;
- row count summary is present but one count bucket is not classified;
- `source_row_hash` field or hash-policy evidence is not yet traceable;
- field contract exists but lacks an accepted PM reference;
- source-rights slot exists but is still pending classification;
- operator phrase shape is not specified;
- readback route exists but does not clearly state aggregate-only output;
- rollback route exists but lacks fail-closed review handling;
- post-run review artifact exists but does not record accepted/rejected/needs-repair outcomes;
- missing evidence classification is not explicit;
- next data route is not named.

Needs-repair means PM may repair evidence references and checklist wording only. It does not open an execution route.

## Missing Evidence Classification

| Evidence item | Missing classification | PM effect |
| --- | --- | --- |
| Sanitized candidate artifact | `needs_repair_if_missing_safe_reference` | Do not prepare final operator gate until a safe artifact id or path exists. |
| Expected row count | `needs_repair_if_missing_or_above_60` | Repair aggregate count evidence only. |
| Candidate row count | `needs_repair_if_missing` | Repair aggregate count evidence only. |
| Rejected row count | `needs_repair_if_missing_bucket` | Add a rejected-count bucket or explicit zero classification. |
| Duplicate row count | `needs_repair_if_missing_bucket` | Add a duplicate-count bucket or explicit zero classification. |
| Missing row count | `needs_repair_if_missing` | Repair aggregate count evidence only. |
| `source_row_hash` | `needs_repair_if_untraceable` | Add hash-policy evidence without exposing row values. |
| Field contract | `needs_repair_or_rejected_if_conflicting` | Repair reference if incomplete; reject if it conflicts with `daily_prices`. |
| Source-rights slot | `needs_repair_or_rejected_if_not_accepted` | Repair pending slot evidence or reject if use rights fail. |
| Operator phrase | `missing_by_design_until_operator_gate` | Phrase value must stay absent here. |
| Readback route | `needs_repair_if_missing` | Prepare aggregate-only readback route before final gate. |
| Rollback route | `needs_repair_if_missing` | Prepare rollback or disable route before final gate. |
| Post-run review artifact | `needs_repair_if_missing` | Prepare post-run review artifact before final gate. |
| Supabase execution evidence | `missing_by_design_no_execution` | Absence is required; execution evidence would reject this checklist. |
| Raw market data | `missing_by_design_forbidden` | Absence is required; raw market data would reject this checklist. |

## Next Data Route

If all required evidence is accepted:

`accepted -> PM can prepare final one-attempt operator gate no execution`

If any blocking evidence is rejected:

`rejected -> repair inputs only`

If evidence is incomplete but repairable without execution:

`needs-repair -> repair inputs only`

No route from this checklist permits SQL execution, Supabase connection, Supabase write, staging-row creation, `daily_prices` mutation, raw market-data fetch or ingestion, readonly rerun, secret output, public source promotion, or real score promotion.

## Stop Lines

- This document is not an execution authorization.
- This document performs no database action.
- This document does not create, accept, modify, or write candidate rows.
- This document does not modify `daily_prices`.
- This document does not fetch, store, or commit raw market data.
- This document does not print secrets, credentials, env values, tokens, cookies, operator phrase values, raw payloads, row payloads, source payloads, or stock-id payloads.
- This document does not rerun readonly.
- This document does not set `publicDataSource=supabase`.
- This document does not set `scoreSource=real`.

## Verification

Manual local-only review:

- confirm this file references `docs/TWII_PM_AUTHORIZATION_REVIEW_DECISION_ALIGNMENT.md`;
- confirm status id is `a1_twii_one_attempt_execution_gate_data_evidence_checklist_ready_no_execution`;
- confirm accepted, rejected, and needs-repair criteria are present;
- confirm missing evidence classification is present;
- confirm next data route keeps accepted as PM preparation only and rejected/needs-repair as input repair only;
- confirm all hard stop lines remain non-executing.
