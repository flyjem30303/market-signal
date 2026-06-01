# TWII Source Selection Acceptance Gate

Status: `twii_source_selection_acceptance_gate_recorded`

Date: 2026-06-01

## Trigger

`SOURCE_SPECIFIC_BACKFILL_DESIGN_PACKET_2026-06-01.md` recommended TWII source selection as the next safe backfill slice because TWII has zero observed rows in the latest bounded readonly row coverage result.

## Selected Candidate For Review

```text
target_symbol: TWII
observed_rows: 0
selected_candidate: official-exchange-index
candidate_label: Official exchange index history
selection_status: accepted_for_rights_and_field_contract_review_only
publicDataSource: mock
scoreSource: mock
```

## Why This Candidate Is First

1. TWII is the only tracked lane with zero observed rows.
2. The official exchange index route is the most natural first candidate for authority and field lineage review.
3. This selection keeps parser, fetcher, SQL, Supabase, staging, and `daily_prices` work blocked until rights and field contract review are accepted.
4. Vendor and internal feed routes remain fallback candidates if official terms, fields, retention, or operational limits are not acceptable.

## Required Review Before Any Implementation

```text
REVIEW-001 source authority
REVIEW-002 license and storage rights
REVIEW-003 attribution and redistribution limits
REVIEW-004 historical date coverage
REVIEW-005 index value field contract
REVIEW-006 missing-session and holiday behavior
REVIEW-007 rate-limit and fair-use posture
REVIEW-008 retention and audit trail
REVIEW-009 sanitized report-only output contract
REVIEW-010 separate one-attempt gate before any remote probe
```

## Fallback Candidates

```text
fallback_candidate_1: licensed-market-data-vendor
fallback_candidate_2: internal-approved-feed
fallback_trigger: official-exchange-index rejected or insufficient for storage, derived use, historical coverage, attribution, or operational stability
```

## Explicit Non-Authorization

- This gate does not run SQL.
- This gate does not connect to Supabase.
- This gate does not write Supabase.
- This gate does not create staging rows.
- This gate does not modify `daily_prices`.
- This gate does not fetch or ingest raw market data.
- This gate does not probe an external endpoint.
- This gate does not print secrets.
- This gate does not print row payloads.
- This gate does not print stock_id payloads.
- This gate does not commit raw market data.
- This gate does not award row coverage points.
- This gate does not promote `publicDataSource=supabase`.
- This gate does not set `scoreSource=real`.
- This gate does not promote CP3 readiness.
- This gate does not approve public coverage claims.

## CEO/PM Decision

```text
ACCEPT_OFFICIAL_EXCHANGE_INDEX_FOR_TWII_REVIEW_ONLY
```

CEO accepts the official exchange index route as the first TWII source candidate for rights and field-contract review only. The next safe slice is a TWII source rights and field contract review packet, not a parser, fetcher, remote probe, SQL script, or Supabase write path.
