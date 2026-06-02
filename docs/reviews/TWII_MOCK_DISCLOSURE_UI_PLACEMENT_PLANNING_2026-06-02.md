# TWII Mock Disclosure UI Placement Planning

Status: `twii_mock_disclosure_ui_placement_planning_recorded`

Date: 2026-06-02

## Purpose

Plan where the mock-only TWII disclosure consumer may appear in the product UI without implying real TWII data activation, row coverage, Supabase runtime, or `scoreSource=real`.

## Current Inputs

```text
consumer_module: src/lib/twii-local-disclosure-consumer.ts
consumer_helper: getTwiiLocalDisclosureConsumerOutput
implementation_review: TWII_LOCAL_DISCLOSURE_CONSUMER_IMPLEMENTATION_REVIEW_2026-06-02.md
placement_type: mock_only_status_disclosure
fixture_policy: synthetic_rows_only
publicDataSource: mock
scoreSource: mock
runtime_activation_authorized: false
```

## Placement Decision

```text
PLACEMENT-001 stock page internal status area is allowed for TWII mock disclosure
PLACEMENT-002 briefing internal readiness area is allowed for TWII mock disclosure
PLACEMENT-003 homepage placement is deferred until public copy is reviewed
PLACEMENT-004 trust/methodology pages may reference the status only after role review
PLACEMENT-005 do not place mock TWII disclosure inside score cards or signal cards
PLACEMENT-006 do not place mock TWII disclosure near buy/sell/health interpretation copy
```

## UI Copy Rules

```text
COPY-001 disclosure must say mock-only or not activated
COPY-002 disclosure must not claim TWII data coverage
COPY-003 disclosure must not claim real score or real market data
COPY-004 disclosure must not mention row counts or parsed rows
COPY-005 disclosure must not mention Supabase as active
COPY-006 disclosure must use restrained internal-status wording, not marketing wording
```

## Runtime Boundary

```text
BOUNDARY-001 no runtime activation from UI placement
BOUNDARY-002 no Supabase read or write from UI placement
BOUNDARY-003 no SQL command from UI placement
BOUNDARY-004 no staging row creation from UI placement
BOUNDARY-005 no daily_prices mapping from UI placement
BOUNDARY-006 no row coverage credit from UI placement
BOUNDARY-007 no scoreSource real from UI placement
BOUNDARY-008 no publicDataSource supabase from UI placement
BOUNDARY-009 no remote TWII probe rerun from UI placement
BOUNDARY-010 no raw market payload, row payload, parsed count, or credential exposure from UI placement
```

## Implementation Readiness Criteria

```text
CRITERIA-001 disclosure consumer implementation review accepted
CRITERIA-002 first UI implementation should be a small internal status component
CRITERIA-003 component must consume safe disclosure output only
CRITERIA-004 component must not import parser, adapter, Supabase, HTTP, SQL, or data repositories
CRITERIA-005 component must render mock-only status and safeSummary only
CRITERIA-006 component must not render rows, parsed counts, stock payloads, or real data claims
CRITERIA-007 component checker and full review gate must pass before any broader UI placement
```

## Role Review

```text
CEO-FINDING-001 UI placement should move forward but remain narrow and internal-status oriented
CEO-FINDING-002 first implementation should target a reusable mock-only status component, not homepage prominence
PM-FINDING-001 this keeps progress visible while reducing public misunderstanding risk
ENGINEERING-FINDING-001 UI component may accept TwiiLocalDisclosureConsumerOutput as props
ENGINEERING-FINDING-002 UI component must not compute parser state or run data access
DATA-FINDING-001 UI placement cannot grant coverage or completeness claims
LEGAL-FINDING-001 public-facing copy must not imply source rights or real TWII activation
QA-FINDING-001 checker must block remote, SQL, Supabase, storage, daily_prices, row payload, parsed count, and scoreSource real patterns
```

## Explicit Non-Authorization

- This UI placement plan does not run SQL.
- This UI placement plan does not connect to Supabase.
- This UI placement plan does not write Supabase.
- This UI placement plan does not create staging rows.
- This UI placement plan does not modify `daily_prices`.
- This UI placement plan does not fetch or ingest raw market data.
- This UI placement plan does not probe an external endpoint.
- This UI placement plan does not print secrets.
- This UI placement plan does not print row payloads.
- This UI placement plan does not print stock_id payloads.
- This UI placement plan does not commit raw market data.
- This UI placement plan does not approve source rights.
- This UI placement plan does not approve parser ingestion.
- This UI placement plan does not approve ingestion.
- This UI placement plan does not award row coverage points.
- This UI placement plan does not promote `publicDataSource=supabase`.
- This UI placement plan does not set `scoreSource=real`.
- This UI placement plan does not promote CP3 readiness.
- This UI placement plan does not approve public coverage claims.

## CEO/PM Decision

```text
READY_FOR_TWII_MOCK_DISCLOSURE_STATUS_COMPONENT_DRAFT
```

CEO recommendation: next safe slice may implement a small reusable mock-only status component that accepts safe disclosure output as props. Do not wire live runtime activation, Supabase access, SQL, staging writes, daily_prices mapping, row coverage credit, public real-data claims, or another remote probe.
