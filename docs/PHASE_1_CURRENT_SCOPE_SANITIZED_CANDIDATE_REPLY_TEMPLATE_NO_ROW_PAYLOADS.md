# Phase 1 Current-Scope Sanitized Candidate Reply Template

Updated: 2026-06-17

Status: `phase_1_current_scope_sanitized_candidate_reply_template_no_row_payloads_ready`

Decision: `ready_for_current_scope_sanitized_aggregate_reply`

## Purpose

This template defines how A1 or PM may reply with a current Phase 1 sanitized candidate artifact path without exposing market rows.

The current Phase 1 universe is `twii_plus_listed_stock_daily_close`.

The old ETF symbols `0050` and `006208` are deferred to Phase 1.1 and must not be included as current-scope requirements.

## Required Reply Fields

Future replies must include only no-secret aggregate metadata:

- `candidateArtifactPath`
- `artifactId`
- `phase1Universe`
- `scope`
- `sourceLane`
- `coverageWindowSessions`
- `aggregateRowCount`
- `symbolsCoveredCount`
- `dateBounds`
- `duplicateCount`
- `rejectedCount`
- `missingRequiredFieldCount`
- `forbiddenFieldCount`
- `sanitizedAggregateOnly`
- `rawPayloadIncluded`
- `rowPayloadIncluded`
- `stockIdPayloadIncluded`
- `secretsIncluded`
- `safetyFlags`

Required values:

- `phase1Universe=twii_plus_listed_stock_daily_close`
- `scope=twii_plus_listed_stock_daily_close`
- `sanitizedAggregateOnly=true`
- `rawPayloadIncluded=false`
- `rowPayloadIncluded=false`
- `stockIdPayloadIncluded=false`
- `secretsIncluded=false`

## Copy/Paste Reply Shape

```text
candidateArtifactPath: <local-or-external-path>
artifactId: <artifact-id>
phase1Universe: twii_plus_listed_stock_daily_close
scope: twii_plus_listed_stock_daily_close
sourceLane: <official-open-data-lane>
coverageWindowSessions: <number-or-range>
aggregateRowCount: <aggregate-count-only>
symbolsCoveredCount: <aggregate-count-only>
dateBounds: <min-date>..<max-date>
duplicateCount: <number>
rejectedCount: <number>
missingRequiredFieldCount: <number>
forbiddenFieldCount: <number>
sanitizedAggregateOnly: true
rawPayloadIncluded: false
rowPayloadIncluded: false
stockIdPayloadIncluded: false
secretsIncluded: false
safetyFlags: no raw payload, no row payload, no stock-id payload, no secrets, no SQL, no Supabase write
```

## Hard Boundaries

- No raw market data
- No row payload
- No stock-id payload
- No secret
- No SQL
- No Supabase read/write
- No `daily_prices` mutation
- No committed market row payloads
- No public real-data promotion
- No `publicDataSource=supabase`
- No `scoreSource=real`
- No investment advice

## Next Route

`future_reply_then_pm_current_scope_candidate_path_intake_no_row_payloads`
