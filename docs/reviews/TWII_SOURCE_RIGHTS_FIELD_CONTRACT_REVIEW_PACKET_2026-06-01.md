# TWII Source Rights And Field Contract Review Packet

Status: `twii_source_rights_field_contract_review_packet_recorded`

Date: 2026-06-01

## Trigger

`TWII_SOURCE_SELECTION_ACCEPTANCE_GATE_2026-06-01.md` accepted `official-exchange-index` as the first TWII source candidate for rights and field-contract review only.

## Review State

```text
target_symbol: TWII
selected_candidate: official-exchange-index
candidate_label: Official exchange index history
review_state: not_approved_for_probe_or_ingestion
observed_rows: 0
publicDataSource: mock
scoreSource: mock
```

## Rights Review Questions

```text
RIGHTS-001 source authority: unresolved
RIGHTS-002 automated access permission: unresolved
RIGHTS-003 storage permission: unresolved
RIGHTS-004 derived score use: unresolved
RIGHTS-005 redistribution and display limits: unresolved
RIGHTS-006 attribution wording: unresolved
RIGHTS-007 retention and audit trail: unresolved
RIGHTS-008 rate-limit and fair-use posture: unresolved
RIGHTS-009 commercial use constraints: unresolved
RIGHTS-010 fallback route if official source is rejected: licensed-market-data-vendor or internal-approved-feed
```

## Field Contract Questions

```text
FIELD-001 date field and calendar basis: unresolved
FIELD-002 index close value or official index value: unresolved
FIELD-003 intraday versus end-of-day meaning: unresolved
FIELD-004 holiday and missing-session behavior: unresolved
FIELD-005 revision or correction behavior: unresolved
FIELD-006 numeric precision and rounding: unresolved
FIELD-007 source timezone: Asia/Taipei expected, unresolved until source review
FIELD-008 field mapping to daily_prices: unresolved
FIELD-009 TWII mapping to internal stock_id or market asset id: unresolved
FIELD-010 sanitized report-only output contract: required before any probe
```

## Acceptance Criteria

1. Legal accepts storage, derived-use, attribution, and redistribution constraints.
2. Data accepts historical date coverage, missing-session behavior, and official value meaning.
3. Engineering accepts a field contract that can map into a staging-first design without raw payload commits.
4. QA accepts aggregate-only validation and post-run review criteria.
5. CEO accepts a separate one-attempt report-only probe gate after Legal, Data, Engineering, and QA findings are recorded.

## Rejection Criteria

- Source terms prohibit automated access, storage, derived use, or required attribution.
- Historical coverage is too shallow for row coverage goals.
- Field contract cannot distinguish source gaps from market calendar gaps.
- The route requires raw payload storage or raw market data commits.
- The route requires direct `daily_prices` writes before staging-first validation.
- The route implies `publicDataSource=supabase` or `scoreSource=real` before post-run review.

## Explicit Non-Authorization

- This packet does not run SQL.
- This packet does not connect to Supabase.
- This packet does not write Supabase.
- This packet does not create staging rows.
- This packet does not modify `daily_prices`.
- This packet does not fetch or ingest raw market data.
- This packet does not probe an external endpoint.
- This packet does not print secrets.
- This packet does not print row payloads.
- This packet does not print stock_id payloads.
- This packet does not commit raw market data.
- This packet does not approve source rights.
- This packet does not approve a parser.
- This packet does not approve a report-only probe.
- This packet does not award row coverage points.
- This packet does not promote `publicDataSource=supabase`.
- This packet does not set `scoreSource=real`.
- This packet does not promote CP3 readiness.
- This packet does not approve public coverage claims.

## CEO/PM Decision

```text
PREPARE_TWII_RIGHTS_AND_FIELD_REVIEW_ROLE_FINDINGS
```

CEO recommends the next slice collect role findings for this packet. Do not probe any TWII endpoint until rights and field-contract findings are accepted and a separate one-attempt report-only probe gate is recorded.
