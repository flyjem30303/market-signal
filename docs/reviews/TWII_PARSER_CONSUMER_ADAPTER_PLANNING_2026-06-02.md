# TWII Parser Consumer Adapter Planning

Status: `twii_parser_consumer_adapter_planning_recorded`

Date: 2026-06-02

## Purpose

Plan the local-only adapter boundary between the TWII parser contract and a future staging-first runtime consumer. This is planning only; it does not activate ingestion, does not read a remote source, and does not map parser output into storage.

## Current Inputs

```text
parser_contract_module: src/lib/twii-parser-contract.ts
consumer_state_module: src/lib/twii-parser-consumer-state.ts
parser_result_type: TwiiParserContractResult
consumer_state_helper: getTwiiParserConsumerState
fixture_policy: synthetic_rows_only
publicDataSource: mock
scoreSource: mock
```

## Future Adapter Shape

```text
ADAPTER-SHAPE-001 input must be an already-produced TwiiParserContractResult
ADAPTER-SHAPE-002 input may include rightsApproved and stagingSchemaApproved booleans
ADAPTER-SHAPE-003 adapter may call getTwiiParserConsumerState
ADAPTER-SHAPE-004 adapter may return reviewState and blocking reason labels
ADAPTER-SHAPE-005 adapter must not fetch, parse remote payloads, or read credentials
ADAPTER-SHAPE-006 adapter must not write staging rows
ADAPTER-SHAPE-007 adapter must not map normalized rows into daily_prices
ADAPTER-SHAPE-008 adapter must not award row coverage credit
ADAPTER-SHAPE-009 adapter must not set scoreSource real
ADAPTER-SHAPE-010 adapter must not promote publicDataSource supabase
```

## Required Approvals Before Runtime Use

```text
APPROVAL-001 source-rights decision accepted
APPROVAL-002 staging schema decision accepted
APPROVAL-003 parser output field contract accepted against sanitized aggregate evidence
APPROVAL-004 adapter implementation review accepted
APPROVAL-005 one-attempt execution decision accepted if any future remote attempt is needed
APPROVAL-006 post-run review accepted before any row coverage credit
APPROVAL-007 separate storage decision accepted before any staging write
APPROVAL-008 separate daily_prices mapping decision accepted before canonical price mapping
```

## Blocked Runtime Behaviors

```text
BLOCKED-RUNTIME-001 no SQL
BLOCKED-RUNTIME-002 no Supabase write
BLOCKED-RUNTIME-003 no staging row creation
BLOCKED-RUNTIME-004 no daily_prices modification
BLOCKED-RUNTIME-005 no remote TWII probe rerun
BLOCKED-RUNTIME-006 no raw market data fetch
BLOCKED-RUNTIME-007 no raw payload fixture
BLOCKED-RUNTIME-008 no secrets printing
BLOCKED-RUNTIME-009 no scoreSource real
BLOCKED-RUNTIME-010 no publicDataSource supabase
```

## Role Review

```text
CEO-FINDING-001 adapter planning should keep momentum toward runtime without crossing activation boundaries
PM-FINDING-001 this slice increases implementation readiness while Git backup remains deferred
ENGINEERING-FINDING-001 future adapter should be a pure function over parser result plus approval flags
ENGINEERING-FINDING-002 future adapter should remain testable with synthetic rows only
DATA-FINDING-001 parser result reviewState is not enough to claim historical coverage
DATA-FINDING-002 row coverage requires accepted post-run evidence and storage decisions
LEGAL-FINDING-001 rights approval remains external to parser or adapter correctness
QA-FINDING-001 checker must block remote, SQL, Supabase, storage, credential, and scoreSource real patterns
```

## Explicit Non-Authorization

- This adapter plan does not run SQL.
- This adapter plan does not connect to Supabase.
- This adapter plan does not write Supabase.
- This adapter plan does not create staging rows.
- This adapter plan does not modify `daily_prices`.
- This adapter plan does not fetch or ingest raw market data.
- This adapter plan does not probe an external endpoint.
- This adapter plan does not print secrets.
- This adapter plan does not print row payloads.
- This adapter plan does not print stock_id payloads.
- This adapter plan does not commit raw market data.
- This adapter plan does not approve source rights.
- This adapter plan does not approve parser ingestion.
- This adapter plan does not approve ingestion.
- This adapter plan does not award row coverage points.
- This adapter plan does not promote `publicDataSource=supabase`.
- This adapter plan does not set `scoreSource=real`.
- This adapter plan does not promote CP3 readiness.
- This adapter plan does not approve public coverage claims.

## CEO/PM Decision

```text
READY_FOR_TWII_PARSER_CONSUMER_ADAPTER_ROLE_REVIEW_LOCAL_ONLY
```

CEO recommendation: next safe slice is a role review of this adapter plan. Keep the work local-only and do not implement runtime activation, Supabase access, SQL, staging writes, daily_prices mapping, or another remote probe.
