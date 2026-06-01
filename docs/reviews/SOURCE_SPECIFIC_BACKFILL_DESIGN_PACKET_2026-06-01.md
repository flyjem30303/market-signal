# Source-Specific Backfill Design Packet

Status: `source_specific_backfill_design_packet_recorded`

Date: 2026-06-01

## Trigger

`POST_READONLY_DATA_POPULATION_DECISION_MAP_2026-06-01.md` concluded that row coverage is blocked by insufficient `daily_prices` population after a safe bounded readonly attempt.

## Latest Coverage Evidence

```text
target_relation: daily_prices
expected_total_rows: 360
observed_total_rows: 5
missing_rows: 355
twii_observed_rows: 0
etf_0050_observed_rows: 1
etf_006208_observed_rows: 1
equity_2330_observed_rows: 1
equity_2382_observed_rows: 1
equity_2308_observed_rows: 1
publicDataSource: mock
scoreSource: mock
```

## Packet Purpose

This packet defines the source-specific design work required before any backfill, ingestion, SQL, Supabase mutation, staging write, or `daily_prices` write can be proposed.

## Lane A: TWII Index

```text
lane_id: twii-index
scope: TWII
owner: Data
current_gap: observed rows are zero
source_packet: twii_source_selection_packet_prepared
recommended_next_decision: select_one_twii_source_candidate_for_rights_review
preferred_route: source selection first, parser design second, report-only dry-run third
write_authorization: not_authorized
```

TWII is the first priority because it has no observed rows. The source must prove authority, retention rights, attribution rules, historical field coverage, and missing-session behavior before any parser or write path is designed.

## Lane B: Taiwan ETF

```text
lane_id: tw-etf
scope: 0050, 006208
owner: Legal
current_gap: one observed row per ETF
source_packet: etf_source_rights_review_packet_prepared
recommended_next_decision: resolve_etf_source_rights_and_field_coverage
preferred_route: legal review first, adapter design second, report-only dry-run third
write_authorization: not_authorized
```

ETF work remains rights-led. The project must confirm storage, display, redistribution, derived-score use, attribution, and ETF-specific field coverage before any adapter or dry-run implementation.

## Lane C: Taiwan Equity

```text
lane_id: tw-equity
scope: 2330, 2382, 2308
owner: Engineering
current_gap: one observed row per equity symbol
source_packet: equity_report_only_dry_run_packet_prepared
recommended_next_decision: prepare_equity_report_only_backfill_dry_run_design
preferred_route: reuse_twse_stock_day_evidence_for_report_only_backfill_design
write_authorization: not_authorized
```

Equity is the most implementation-ready lane because TWSE STOCK_DAY report-only evidence is already clean for the selected sample. The next equity step should still be a report-only backfill design, not a write runner.

## Lane D: Storage Boundary

```text
lane_id: storage-boundary
scope: daily_prices and optional staging-first path
owner: Engineering
current_state: write path not authorized
recommended_next_decision: choose_staging_first_unless_ceo_accepts_direct_write_risk
preferred_route: staging-first
write_authorization: not_authorized
```

Staging-first remains the preferred route because it allows duplicate handling, calendar checks, row-count reconciliation, and rollback review before touching production `daily_prices`.

## Lane E: QA And Acceptance

```text
lane_id: qa-acceptance
scope: post-run review and row coverage criteria
owner: QA
current_state: coverage blocked
recommended_next_decision: define_acceptance_thresholds_before_any_point_award
preferred_route: aggregate-only validation, sanitized post-run review, separate row coverage acceptance gate
write_authorization: not_authorized
```

QA must define acceptance thresholds for expected sessions, missing rows, duplicate dates, mapping misses, rollback evidence, and post-run review before any row coverage credit can be proposed.

## Cross-Lane Requirements

1. Every lane must keep `publicDataSource=mock` and `scoreSource=mock`.
2. Every future execution must have a separate one-attempt gate.
3. Every future write path must have a rollback and retention plan.
4. Every future report must be sanitized and aggregate-only.
5. Any source-specific legal uncertainty blocks ingestion for that lane.
6. Any row coverage point award requires a later post-run review and acceptance gate.

## Explicit Non-Authorization

- This packet does not run SQL.
- This packet does not connect to Supabase.
- This packet does not write Supabase.
- This packet does not create staging rows.
- This packet does not modify `daily_prices`.
- This packet does not fetch or ingest raw market data.
- This packet does not print secrets.
- This packet does not print row payloads.
- This packet does not print stock_id payloads.
- This packet does not commit raw market data.
- This packet does not award row coverage points.
- This packet does not promote `publicDataSource=supabase`.
- This packet does not set `scoreSource=real`.
- This packet does not promote CP3 readiness.
- This packet does not approve public coverage claims.

## CEO/PM Decision

```text
PREPARE_TWII_SOURCE_SELECTION_AS_NEXT_SAFE_BACKFILL_SLICE
```

CEO recommends starting with TWII source selection because it is the only lane with zero observed rows. Equity backfill design can proceed in parallel later, but TWII is the clearest blocker for row coverage completeness.
