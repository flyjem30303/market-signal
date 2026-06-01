# TWII Report-Only Probe Decision Packet

Status: `twii_report_only_probe_decision_packet_prepared`

Date: 2026-06-01

## Trigger

`TWII_RIGHTS_FIELD_REVIEW_ROLE_FINDINGS_2026-06-01.md` recommended preparing a one-attempt TWII report-only probe decision packet after role findings were recorded.

## Decision State

```text
target_symbol: TWII
selected_candidate: official-exchange-index
decision_status: pending_explicit_acceptance
probe_state: not_authorized
attempt_limit: exactly_one_after_acceptance
output_contract: sanitized_aggregate_only
observed_rows_before_probe: 0
publicDataSource: mock
scoreSource: mock
```

## Probe Purpose

The proposed future probe would answer only whether the selected official exchange index source can return TWII historical index records in a field shape suitable for a staging-first design.

It must not attempt to prove production readiness, score readiness, CP3 readiness, source rights approval, or public claim readiness.

## Allowed Only If Accepted

If this decision packet is explicitly accepted later, the future probe may do exactly one report-only external source attempt for TWII. The command must run in a bounded mode and may only return sanitized aggregate evidence.

The future attempt may report:

```text
remoteAttempted
connectionAttempted
target_symbol
selected_candidate
http_status_group
parsed_row_count
date_range_start
date_range_end
missing_session_count
duplicate_trade_date_count
field_parse_failure_count
calendar_gap_count
parser_flag_count
failure_class
```

The future attempt must not report raw payloads, raw rows, raw endpoint parameters, secrets, credential metadata, stock_id payloads, or market-data records.

## Required Guardrails For Future Attempt

```text
GUARD-001 exact one-attempt limit is required
GUARD-002 explicit acceptance is required before endpoint contact
GUARD-003 sanitized aggregate-only output is required
GUARD-004 no SQL is allowed
GUARD-005 no Supabase write is allowed
GUARD-006 no staging rows are allowed
GUARD-007 no daily_prices modification is allowed
GUARD-008 no raw market data file is allowed
GUARD-009 no raw payload logging is allowed
GUARD-010 no source promotion is allowed
GUARD-011 no scoreSource=real is allowed
GUARD-012 no row coverage points are allowed
GUARD-013 post-run review is required immediately after execution
GUARD-014 failure must remain a review artifact, not a retry loop
GUARD-015 publicDataSource must remain mock
```

## Acceptance Criteria

1. CEO accepts that TWII is the narrowest useful source-depth blocker to test next.
2. Legal accepts that a one-attempt report-only probe may be used for rights and feasibility discovery without storage or redistribution.
3. Data accepts the sanitized aggregate fields as enough to judge whether the source merits parser design.
4. Engineering accepts that the attempt does not create a parser approval, ingestion approval, or schema change.
5. QA accepts the failure classes and requires a post-run review before any next step.

## Rejection Criteria

- The source terms appear to prohibit automated access, even for report-only feasibility discovery.
- The future probe cannot avoid raw payload output.
- The future probe cannot avoid raw market data files.
- The future probe would need SQL, Supabase writes, staging writes, or `daily_prices` writes.
- The future probe would require `publicDataSource=supabase` or `scoreSource=real`.
- The future probe would create retry pressure instead of a single bounded evidence point.

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
- This packet does not approve ingestion.
- This packet does not award row coverage points.
- This packet does not promote `publicDataSource=supabase`.
- This packet does not set `scoreSource=real`.
- This packet does not promote CP3 readiness.
- This packet does not approve public coverage claims.

## CEO/PM Decision Request

```text
REQUEST_ACCEPT_OR_REJECT_TWII_REPORT_ONLY_PROBE_ONE_ATTEMPT
```

CEO recommendation: prepare this packet now, then wait for explicit accepted/rejected recording before any TWII endpoint is contacted. If accepted later, the next slice should be a guarded one-attempt runner or command map plus immediate post-run review template.
