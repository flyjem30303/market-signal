# TWII Adapter Local Integration Planning

Status: `twii_adapter_local_integration_planning_recorded`

Date: 2026-06-02

## Purpose

Plan where `getTwiiParserConsumerAdapterOutput` may be consumed locally before any real TWII runtime activation. This planning keeps adapter output useful for disclosure and internal review while preserving mock-only public data boundaries.

## Current Inputs

```text
adapter_module: src/lib/twii-parser-consumer-adapter.ts
adapter_helper: getTwiiParserConsumerAdapterOutput
implementation_review: TWII_PARSER_CONSUMER_ADAPTER_IMPLEMENTATION_REVIEW_2026-06-02.md
integration_type: local_disclosure_and_internal_review_only
fixture_policy: synthetic_rows_only
publicDataSource: mock
scoreSource: mock
runtime_activation_authorized: false
```

## Allowed Local Consumption

```text
ALLOWED-001 internal review documents may reference adapter reviewState and blockingReason labels
ALLOWED-002 local runtime disclosure copy may describe adapter status as not activated
ALLOWED-003 local UI state may display mock-only readiness blockers if no real data claim is made
ALLOWED-004 local checks may assert that row coverage and daily_prices mapping remain false
ALLOWED-005 local checks may assert parsedRowCount is a review metric only
```

## Disallowed Integration

```text
DISALLOWED-001 no runtime activation from adapter output
DISALLOWED-002 no Supabase read or write from adapter output
DISALLOWED-003 no SQL command from adapter output
DISALLOWED-004 no staging row creation from adapter output
DISALLOWED-005 no daily_prices mapping from adapter output
DISALLOWED-006 no row coverage credit from adapter output
DISALLOWED-007 no scoreSource real from adapter output
DISALLOWED-008 no publicDataSource supabase from adapter output
DISALLOWED-009 no remote TWII probe rerun from adapter output
DISALLOWED-010 no raw market payload, row payload, or credential exposure from adapter output
```

## Integration Readiness Criteria

```text
CRITERIA-001 adapter implementation review accepted
CRITERIA-002 local disclosure consumer must keep publicDataSource mock
CRITERIA-003 local disclosure consumer must keep scoreSource mock
CRITERIA-004 local disclosure consumer must show not activated or blocked state
CRITERIA-005 local disclosure consumer must not claim TWII coverage
CRITERIA-006 local disclosure consumer must not expose parsed rows
CRITERIA-007 full review gate must pass after any consumer implementation
```

## Role Review

```text
CEO-FINDING-001 integration planning should move next toward a small mock-only disclosure consumer, not another broad governance packet
PM-FINDING-001 this reduces ambiguity for future UI/runtime hardening while preserving speed
ENGINEERING-FINDING-001 next implementation may create a pure local disclosure helper or component contract
ENGINEERING-FINDING-002 implementation must not import Supabase, use HTTP, read credentials, write files, or touch storage
DATA-FINDING-001 parsedRowCount remains an internal review metric and not a coverage metric
DATA-FINDING-002 canonical price mapping remains blocked until separate approvals
LEGAL-FINDING-001 disclosure must not imply source rights, real TWII activation, or market-data redistribution
QA-FINDING-001 checker must block remote, SQL, Supabase, storage, daily_prices, row payload, and scoreSource real patterns
```

## Explicit Non-Authorization

- This integration plan does not run SQL.
- This integration plan does not connect to Supabase.
- This integration plan does not write Supabase.
- This integration plan does not create staging rows.
- This integration plan does not modify `daily_prices`.
- This integration plan does not fetch or ingest raw market data.
- This integration plan does not probe an external endpoint.
- This integration plan does not print secrets.
- This integration plan does not print row payloads.
- This integration plan does not print stock_id payloads.
- This integration plan does not commit raw market data.
- This integration plan does not approve source rights.
- This integration plan does not approve parser ingestion.
- This integration plan does not approve ingestion.
- This integration plan does not award row coverage points.
- This integration plan does not promote `publicDataSource=supabase`.
- This integration plan does not set `scoreSource=real`.
- This integration plan does not promote CP3 readiness.
- This integration plan does not approve public coverage claims.

## CEO/PM Decision

```text
READY_FOR_TWII_LOCAL_DISCLOSURE_CONSUMER_DRAFT_MOCK_ONLY
```

CEO recommendation: next safe slice may draft a local-only disclosure consumer for adapter output. It must remain mock-only, fail-closed, and unable to activate runtime, Supabase, SQL, staging writes, daily_prices mapping, row coverage credit, or another remote probe.
