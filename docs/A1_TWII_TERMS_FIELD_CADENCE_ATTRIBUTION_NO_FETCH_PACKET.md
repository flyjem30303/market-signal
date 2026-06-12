# A1 TWII Terms Field Cadence Attribution No-Fetch Packet

Status: `a1_twii_terms_field_cadence_attribution_no_fetch_packet_ready_pm_intake`

Date: 2026-06-12

Owner: A1 Data / Source / Coverage support lane

Integration owner: PM mainline

Runtime posture:

- `publicDataSource=mock`
- `scoreSource=mock`

## Purpose

This packet narrows the TWII data line from a broad source-rights matrix into the next PM-usable no-fetch gate.

It prepares the terms, field, cadence, and attribution decisions that must be clean before PM can consider any later bounded readonly or execution packet.

This packet does not execute, probe, fetch, ingest, store, transform, or commit market data.

## Source Route Context

| Item | Current PM-safe value | Meaning |
| --- | --- | --- |
| Target lane | `TWII` / `index_baseline` | First index baseline candidate for 30-second market atmosphere. |
| Candidate source route | `official_open_data_api` | Data.gov-referenced TWSE OpenAPI candidate route, not TWSE website crawling. |
| Current source status | `terms_field_cadence_attribution_review_required` | Candidate can inform planning, not real public display. |
| Current runtime status | `mock_runtime_only` | Public page may explain readiness but must not show accepted real values. |
| Current next PM route | `twii_terms_field_cadence_attribution_review_then_bounded_readonly_gate_decision` | PM may decide whether a later bounded readonly gate is worth opening. |

## Terms Review Packet

| Terms field | Current local conclusion | Still needed before any executable gate |
| --- | --- | --- |
| Governing terms location | Data.gov Open Government Data License, data.gov TWSE dataset pages, TWSE OpenAPI swagger, TWSE website terms, and TWSE trading-information use / fee pages are known reference locations. | Confirm which terms control the exact TWII endpoint used for daily close / index baseline. |
| Automated access | Unconsented TWSE website automation remains blocked. Data.gov-referenced TWSE OpenAPI is the only current free automatable candidate route. | Confirm the endpoint can be accessed by scheduled server-side automation under the chosen terms and fair-use policy. |
| Internal storage | Normalized records may be planned only after source terms and later execution gates accept storage. | Confirm storage, retention, correction, withdrawal, and audit metadata requirements. |
| Public display | Public display of normalized daily index values may be planned only after source terms, attribution, delay/update copy, and promotion gates pass. | Confirm display wording, update timestamp wording, and whether derived states may cite the source. |
| Redistribution | Raw payload republication, bulk resale, and downstream raw-data API redistribution are not accepted by this packet. | Confirm no future public feature accidentally exposes raw data or source rows. |

PM-safe label:

`source_terms_status=terms_field_cadence_attribution_review_required`

## Field Contract Packet

| Normalized field | Candidate TWII meaning | Required decision before executable parser |
| --- | --- | --- |
| `trade_date` | Taiwan market session date for the index value. | Date format, timezone, holiday calendar, missing session, and correction handling. |
| `close_value` | TWII / TAIEX close or daily index baseline value. | Exact source field, precision, comma parsing, dash/null behavior, and close semantics. |
| `instrument_code` | Internal display code such as `TWII`, not necessarily a source-provided official code. | Whether PM can display `TWII` as an app-level alias while retaining source attribution. |
| `instrument_name` | Public display name for TAIEX / Taiwan weighted index. | Accepted Chinese/English display label and attribution wording. |
| `source_url_label` | Safe source label or URL reference, not raw payload. | Whether the public page should show source name, source URL, license URL, or both. |
| `source_updated_at` | Source update or dataset refresh label. | Whether source provides update timestamp and how to fail closed if unavailable. |

Optional fields remain out of scope until a later packet:

- `open_value`
- `high_value`
- `low_value`
- `volume`
- `turnover`
- `change_value`
- `change_percent`

PM-safe label:

`field_contract_status=twii_minimum_fields_review_required`

## Cadence Packet

| Cadence item | Conservative local policy | Still needed |
| --- | --- | --- |
| Update frequency | Daily batch after market close only. | Confirm exact schedule window and source refresh timing. |
| User-triggered refresh | Not allowed. | Confirm no public UI can trigger source calls. |
| Retry behavior | Exponential backoff, retry cap, cache reuse, and outage fail-closed. | Define max retry count and operator-visible failure message. |
| Missing session | Fail closed until calendar and missing-session policy are accepted. | Distinguish holiday / non-trading day from source gap. |
| Revision handling | Do not overwrite accepted records without correction policy and audit trail. | Define replacement, append, quarantine, and rollback behavior. |

PM-safe label:

`cadence_status=daily_after_close_candidate_fail_closed`

## Attribution Packet

Public attribution must be finalized by PM/A2 before any real display.

Planning placeholders:

| Attribution surface | Placeholder | Stop line |
| --- | --- | --- |
| Source label | `Data source candidate: TWSE OpenAPI / open data route` | Do not imply official endorsement. |
| License label | `License / terms review required` | Do not claim final redistribution rights until accepted. |
| Update label | `Updated after source refresh; current runtime is mock` | Do not claim real-time or minute-level freshness. |
| Boundary copy | `Information and risk-identification only; not investment advice` | Do not provide buy/sell/hold guidance. |

PM-safe label:

`attribution_status=public_copy_required_before_real_display`

## PM Intake Decision

PM can accept this packet only for no-fetch planning when:

1. `npm run check:a1-twii-terms-field-cadence-attribution-no-fetch-packet` passes.
2. The packet remains field-name-only and aggregate-only.
3. Public runtime stays `publicDataSource=mock`.
4. Score runtime stays `scoreSource=mock`.
5. No endpoint call, SQL, Supabase connection, Supabase write, staging row, `daily_prices` mutation, raw payload, row payload, stock-id row list, or secret output occurs.

PM-safe intake route:

`accept_twii_terms_field_cadence_attribution_no_fetch_packet_for_runtime_readiness_copy`

Next PM route:

`wire_twii_terms_field_cadence_attribution_status_into_runtime_readiness_copy`

Next A1 route:

`prepare_twii_bounded_readonly_gate_candidate_requirements_no_execution`

Next A2 route:

`review_twii_source_attribution_and_cadence_public_copy_guard`

## Hard Stop Lines

This packet does not authorize:

- SQL execution,
- Supabase connection,
- Supabase writes,
- staging rows,
- `daily_prices` mutation,
- endpoint probe,
- market-data fetch,
- market-data ingest,
- market-data storage,
- market-data commit,
- parser implementation,
- candidate artifact generation,
- raw payload output,
- row payload output,
- stock-id row-list output,
- secret output,
- row coverage points,
- public source promotion,
- `publicDataSource=supabase`,
- `scoreSource=real`,
- real-time market-data claims,
- investment advice claims.

## Completion Definition

This packet is complete when:

- terms, field, cadence, and attribution sections are present;
- PM-safe labels are named;
- no-fetch and no-write stop lines are explicit;
- PM, A1, and A2 next routes are named;
- the checker is registered in `package.json` and `scripts/check-review-gates.mjs`.
