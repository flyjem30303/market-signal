# A1 Public Beta Batch 1 TWII Core ETF Data Contract

Status: a1_public_beta_batch1_twii_core_etf_data_contract_ready

Runtime posture:

- `publicDataSource=mock`
- `scoreSource=mock`

## Purpose

This local-only A1 Data / Supabase / Market Evidence packet defines the Batch 1 real-data prerequisite contract for TWII plus core ETF coverage.

This document is a readiness and integration contract only. It does not authorize SQL, Supabase access, Supabase writes, staging rows, `daily_prices` mutation, raw payload handling, secret access, market-data fetch, market-data ingest, candidate row acceptance, public real-data promotion, or `scoreSource=real`.

PM may use this document to expose Batch 1 readiness states on public pages while the runtime remains mock-only.

## Batch 1 Scope

Batch 1 scope is limited to:

- TWII
- core ETF

Batch 1 is the first proposed real-data candidate lane because it gives public beta users a broad Taiwan market reference point plus a small investable-proxy comparison layer. The lane remains blocked for real public display until source rights, field mapping, session rules, Supabase readiness, ingestion/backfill readiness, and explicit gates are accepted in separate packets.

Batch 1 does not include individual stocks, sectors, industries, volatility, capital flow, moving average, momentum, holdings, NAV, premium discount, portfolio composition, advice signals, or real scoring.

## Minimum Field Contract

### TWII Minimum Fields

| Field | Required meaning | Current Batch 1 contract status |
| --- | --- | --- |
| `symbol` | Stable TWII identifier used by UI and any future storage contract. | Required before real display. |
| `market` | Market label, expected to identify the Taiwan index lane without implying stock-level coverage. | Required before real display. |
| `session_date` | Trading session date for the index value. | Required before real display. |
| `index_close_or_level` | Index close or official level selected by the accepted field mapping. | Required before real display. |
| `change` | Session change in index points, using the accepted source definition. | Required before real display. |
| `change_percent` | Session percentage change, using the accepted source definition and precision rule. | Required before real display. |
| `source_status` | Source-rights and source-availability state for the row or display value. | Required before real display. |
| `rights_status` | Public display and redistribution permission state. | Required before real display. |
| `update_cadence` | Expected refresh cadence, such as daily after official session close, if accepted. | Required before real display. |
| `timezone` | Timezone used for session interpretation and display. | Required before real display. |
| `missing_session_status` | Missing-session, holiday, delayed, correction, or no-trading classification. | Required before real display. |
| `mock_or_real_status` | Explicit status separating simulated values from accepted real values. | Required on every public surface. |

### ETF Minimum Fields

| Field | Required meaning | Current Batch 1 contract status |
| --- | --- | --- |
| `symbol` | Stable ETF identifier used by UI and any future storage contract. | Required before real display. |
| `name` | Human-readable ETF name approved for display. | Required before real display. |
| `exchange` | Listing exchange or market venue label. | Required before real display. |
| `session_date` | Trading session date for the ETF market price. | Required before real display. |
| `close` | ETF market close price selected by the accepted field mapping. | Required before real display. |
| `change` | Session price change, using the accepted source definition. | Required before real display. |
| `change_percent` | Session percentage change, using the accepted source definition and precision rule. | Required before real display. |
| `source_status` | Source-rights and source-availability state for the row or display value. | Required before real display. |
| `rights_status` | Public display and redistribution permission state. | Required before real display. |
| `update_cadence` | Expected refresh cadence, such as daily after official session close, if accepted. | Required before real display. |
| `timezone` | Timezone used for session interpretation and display. | Required before real display. |
| `missing_session_status` | Missing-session, holiday, delayed, correction, or no-trading classification. | Required before real display. |
| `mock_or_real_status` | Explicit status separating simulated values from accepted real values. | Required on every public surface. |

ETF exclusions:

- holdings are excluded unless a separate source-rights and field contract accepts them.
- NAV is excluded unless a separate source-rights and field contract accepts it.
- premium discount is excluded unless a separate source-rights and field contract accepts it.
- ETF comparison copy must not imply product recommendation, portfolio advice, or full fund-data coverage.

## Source-Rights Need

Batch 1 cannot move from mock to real until each lane has accepted source-rights evidence:

| Lane | Source-rights need | Required acceptance before real display |
| --- | --- | --- |
| TWII | Official or licensed source permission for index level, change, change percent, attribution, cadence, public display, and redistribution boundary. | Accepted source-rights outcome plus accepted attribution wording. |
| core ETF | Official exchange, licensed vendor, or otherwise accepted source permission for ETF market price fields, public display, attribution, cadence, and redistribution boundary. | Accepted source-rights outcome plus explicit exclusion wording for holdings, NAV, and premium discount. |

No source-rights inference from "not explicitly prohibited" is sufficient for public real display in this Batch 1 contract unless a separate accepted decision record says so.

## Field Mapping Need

Field mapping must be accepted before any row, UI value, report value, or public label is treated as real:

| Mapping area | TWII requirement | core ETF requirement |
| --- | --- | --- |
| Identifier | Map `symbol` to the accepted index identifier. | Map `symbol` to the accepted ETF identifier and listing. |
| Date | Map `session_date` to the accepted trading-session field. | Map `session_date` to the accepted trading-session field. |
| Value | Map `index_close_or_level` to the accepted close or official level. | Map `close` to the accepted market close field. |
| Change | Define whether `change` is source-provided or locally derived after acceptance. | Define whether `change` is source-provided or locally derived after acceptance. |
| Percent | Define precision, rounding, sign, and source-vs-derived rule for `change_percent`. | Define precision, rounding, sign, and source-vs-derived rule for `change_percent`. |
| Status | Populate `source_status`, `rights_status`, `missing_session_status`, and `mock_or_real_status` without ambiguity. | Populate `source_status`, `rights_status`, `missing_session_status`, and `mock_or_real_status` without ambiguity. |

## Timezone And Session Rules

Batch 1 needs a written timezone/session rule before real display:

- `timezone` must be explicit for every TWII and ETF row or display state.
- `session_date` must refer to the trading session, not the ingestion timestamp.
- Holidays, non-trading days, suspended sessions, delayed publication, partial sessions, and corrections must have explicit `missing_session_status` values.
- Public UI must not show stale data as current market evidence.
- Any date displayed publicly must be paired with `mock_or_real_status` and a source/readiness label.

## Update Cadence

Batch 1 needs an accepted cadence rule before real display:

| Lane | Cadence requirement | Blocked states |
| --- | --- | --- |
| TWII | Define whether updates are daily after official close, delayed, manual, or another accepted cadence. | Unknown cadence, source unavailable, delayed without label, or correction policy missing. |
| core ETF | Define whether ETF close values update daily after exchange close, delayed, manual, or another accepted cadence. | Unknown cadence, mixed ETF cadence without per-symbol label, delayed without label, or correction policy missing. |

Cadence labels must be public-safe and must not imply live data unless a future accepted contract explicitly allows live data.

## Missing Row Rules

Batch 1 needs missing-row rules before any backfill or real public route:

- Missing sessions must be classified, not silently filled.
- Holiday and no-trading rows must not be treated as data gaps.
- Delayed source rows must remain visibly delayed or blocked.
- Correction/revision handling must define whether public values can be replaced and how the change is disclosed.
- Any future backfill must prove row coverage by lane and symbol without exposing raw payloads.
- No row can be promoted from mock to real unless `source_status`, `rights_status`, `missing_session_status`, and `mock_or_real_status` are populated.

## Supabase Readiness

Supabase readiness is not accepted by this document.

Required before any real public route:

- accepted table or view target
- accepted read path
- accepted write path, if writing is ever proposed
- accepted row uniqueness and idempotency contract
- accepted metadata/schema exposure check
- accepted readback proof
- accepted rollback or disable plan
- accepted PM/operator go/no-go record

Until those separate gates exist and pass, Batch 1 remains `publicDataSource=mock` and `scoreSource=mock`.

## Ingestion And Backfill Readiness

Ingestion/backfill readiness is not accepted by this document.

Required before any ingestion/backfill attempt:

- accepted source-rights outcome for the exact TWII and ETF fields
- accepted field mapping contract
- accepted timezone/session contract
- accepted cadence contract
- accepted missing-row and correction policy
- accepted candidate artifact shape, if a candidate artifact is proposed
- accepted local-only validation route
- accepted readonly gate, if remote readback is proposed
- accepted write gate, if any write is proposed

This document creates no staging rows, no candidate rows, no acceptance rows, and no candidate row acceptance.

## Readonly Gate

Readonly gate status: not authorized here.

A future readonly gate must be explicit, bounded, no-secret, and separately accepted. It must state exactly what can be read, why the read is needed, what proof can be returned, and how raw payloads and secrets remain excluded.

This document must not be used as authorization to connect to Supabase, inspect env, read secrets, run SQL, or fetch market data.

## Write Gate

Write gate status: blocked.

A future write gate requires a separate explicit operator authorization packet. It must include target table or view, idempotency, conflict policy, rollback, row count, row shape, source-rights proof, field mapping proof, readonly/readback proof, and post-run review requirements.

Until that separate write gate is accepted:

- no Supabase writes
- no staging rows
- no `daily_prices` mutation
- no candidate row acceptance
- no public real-data promotion

## Hard Blockers

Batch 1 real display is blocked until all of these are resolved:

| Blocker | Current status | Why it blocks |
| --- | --- | --- |
| Source rights | Needed | Public real display requires accepted display and redistribution rights. |
| Field mapping | Needed | UI and storage cannot treat fields as real until source fields and derived fields are unambiguous. |
| Timezone/session rules | Needed | Dates and missing sessions can mislead users if session semantics are unclear. |
| Update cadence | Needed | Public labels must not imply live or current data without accepted cadence. |
| Missing row rules | Needed | Coverage gaps, holidays, and delayed rows must be distinguishable. |
| Supabase readiness | Needed | Public real data needs accepted read/write/readback/rollback posture before runtime use. |
| Ingestion/backfill readiness | Needed | No pipeline or candidate acceptance can proceed from this document alone. |
| Readonly gate | Needed if remote readback is proposed | Remote evidence needs separate bounded authorization. |
| Write gate | Blocked | Writes require separate explicit operator authorization and post-run proof. |

## Forbidden Zones

This Batch 1 contract preserves the following hard stop lines:

- no SQL
- no Supabase connection
- no Supabase writes
- no staging rows
- no `daily_prices` mutation
- no raw payload
- no secrets
- no market data fetch
- no market data ingest
- no candidate row acceptance
- no publicDataSource=supabase
- no scoreSource=real

## PM Integration Notes

The three Batch 1 readiness statuses best suited for the public page first are:

| Public-page priority | Batch 1 readiness status | User-facing meaning |
| --- | --- | --- |
| 1 | `batch_1_twii_core_etf_mock_shell_ready` | The public page can show TWII and core ETF panels as simulated/mock examples while preserving `publicDataSource=mock` and `scoreSource=mock`. |
| 2 | `batch_1_source_rights_needed` | Real TWII and ETF values are blocked until source display and redistribution rights are accepted. |
| 3 | `batch_1_field_session_cadence_contract_needed` | Even after rights review, real display still needs accepted field mapping, timezone/session rules, update cadence, and missing-row policy. |

PM should avoid readiness labels that imply the values are live, delayed, official, accepted, sourced, Supabase-backed, or score-producing. The safest public wording is a visible mock shell plus transparent blockers.

## A1 Support Conclusion

Batch 1 TWII + core ETF data contract is ready as a local-only prerequisite artifact.

The current runtime posture remains `publicDataSource=mock` and `scoreSource=mock`. Real TWII or ETF display, Supabase-backed public routes, ingestion/backfill, `daily_prices` mutation, candidate row acceptance, or real-score promotion require separate accepted gates.
