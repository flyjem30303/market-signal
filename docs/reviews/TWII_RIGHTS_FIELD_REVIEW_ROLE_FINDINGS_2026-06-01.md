# TWII Rights And Field Review Role Findings

Status: `twii_rights_field_review_role_findings_recorded`

Date: 2026-06-01

## Trigger

`TWII_SOURCE_RIGHTS_FIELD_CONTRACT_REVIEW_PACKET_2026-06-01.md` recorded the TWII official exchange index candidate as not approved for probe or ingestion, pending role findings.

## Scope

```text
target_symbol: TWII
selected_candidate: official-exchange-index
review_state_before_findings: not_approved_for_probe_or_ingestion
observed_rows: 0
publicDataSource: mock
scoreSource: mock
```

## Legal Findings

```text
LEGAL-FINDING-001 source rights are not approved by this role finding
LEGAL-FINDING-002 automated access permission remains unresolved
LEGAL-FINDING-003 storage permission remains unresolved
LEGAL-FINDING-004 derived score use remains unresolved
LEGAL-FINDING-005 redistribution and display limits remain unresolved
LEGAL-FINDING-006 attribution wording must be drafted before any public or internal report surface
LEGAL-FINDING-007 official exchange route may proceed only to a separate report-only probe gate if output remains sanitized and no raw payload is stored
LEGAL-FINDING-008 licensed-market-data-vendor and internal-approved-feed remain fallback routes
```

## Data Findings

```text
DATA-FINDING-001 TWII remains the highest row coverage gap because observed rows are zero
DATA-FINDING-002 historical date coverage must distinguish market holidays, source gaps, and parser gaps
DATA-FINDING-003 index value meaning must be defined before mapping to daily_prices
DATA-FINDING-004 source timezone is expected to be Asia/Taipei but remains unverified
DATA-FINDING-005 missing-session behavior must be part of the output contract
DATA-FINDING-006 no row coverage points can be awarded from this role finding
```

## Engineering Findings

```text
ENGINEERING-FINDING-001 no parser is approved by this role finding
ENGINEERING-FINDING-002 no endpoint probe is approved by this role finding
ENGINEERING-FINDING-003 future TWII probe must be report-only and one-attempt gated
ENGINEERING-FINDING-004 future output must be aggregate-only and must not persist raw payloads
ENGINEERING-FINDING-005 TWII mapping to internal stock_id or market asset id remains unresolved
ENGINEERING-FINDING-006 staging-first remains preferred before any production daily_prices write path
```

## QA Findings

```text
QA-FINDING-001 any future probe must have a sanitized post-run review before readiness changes
QA-FINDING-002 acceptance criteria must include observed sessions, missing sessions, duplicate dates, field parse failures, and calendar behavior
QA-FINDING-003 failure classes must distinguish source unavailable, license rejected, field mismatch, parser failure, and no rows
QA-FINDING-004 rollback and retention evidence must exist before any mutation gate
QA-FINDING-005 publicDataSource and scoreSource must remain mock
```

## CEO Synthesis

```text
CEO-SYNTHESIS-001 role findings support preparing a TWII report-only probe gate
CEO-SYNTHESIS-002 role findings do not approve the probe itself
CEO-SYNTHESIS-003 source rights remain unresolved until a post-probe and legal review path confirms terms
CEO-SYNTHESIS-004 TWII remains first priority because it is the only zero-row coverage lane
CEO-SYNTHESIS-005 next safe slice is a TWII report-only probe decision packet with explicit one-attempt limit
```

## Explicit Non-Authorization

- This role finding does not run SQL.
- This role finding does not connect to Supabase.
- This role finding does not write Supabase.
- This role finding does not create staging rows.
- This role finding does not modify `daily_prices`.
- This role finding does not fetch or ingest raw market data.
- This role finding does not probe an external endpoint.
- This role finding does not print secrets.
- This role finding does not print row payloads.
- This role finding does not print stock_id payloads.
- This role finding does not commit raw market data.
- This role finding does not approve source rights.
- This role finding does not approve a parser.
- This role finding does not approve a report-only probe.
- This role finding does not award row coverage points.
- This role finding does not promote `publicDataSource=supabase`.
- This role finding does not set `scoreSource=real`.
- This role finding does not promote CP3 readiness.
- This role finding does not approve public coverage claims.

## CEO/PM Decision

```text
PREPARE_TWII_REPORT_ONLY_PROBE_DECISION_PACKET
```

The next useful slice is a decision packet for one bounded TWII report-only probe. That packet must still require explicit acceptance before any endpoint is contacted.
