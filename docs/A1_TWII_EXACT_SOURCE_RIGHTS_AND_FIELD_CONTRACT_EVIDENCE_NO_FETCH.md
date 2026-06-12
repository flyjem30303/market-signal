# A1 TWII Exact Source Rights And Field Contract Evidence No-Fetch

Status: `a1_twii_exact_source_rights_and_field_contract_evidence_ready_no_fetch`

Date: 2026-06-13

Owner: A1 Data / Source / Coverage support lane

Integration owner: PM mainline

Runtime posture:

- `publicDataSource=mock`
- `scoreSource=mock`

## Purpose

This packet records exact-source evidence for the TWII daily index baseline route before any future bounded readonly attempt is considered.

It uses only official metadata and field-contract information from public dataset pages. It does not call a data endpoint, read row payloads, store market data, connect to Supabase, write SQL, or promote public runtime data.

## Evidence Scope

| Evidence item | Evidence value | PM classification |
| --- | --- | --- |
| Primary TWII dataset | `Weighted Stock Price Index Historical Data` | `candidate_for_future_readonly_review` |
| Dataset URL | `https://data.gov.tw/en/datasets/11755` | `official_metadata_reference` |
| Agency | `Securities and Futures Bureau, Financial Supervisory Commission, Executive Yuan, R.O.C.` | `official_agency_metadata` |
| Update frequency | `Every day` | `supports_daily_after_close_candidate` |
| License | `Open Government Data License, version 1.0` | `license_reference_found_not_legal_approval` |
| Charge | `free` | `free_candidate_reference_found` |
| OAS / OpenAPI reference | `https://openapi.twse.com.tw/v1/swagger.json` | `api_reference_found_not_endpoint_called` |
| Dataset updated time observed | `2026-06-01 12:06` | `metadata_timestamp_only` |

Secondary context:

| Evidence item | Evidence value | PM classification |
| --- | --- | --- |
| Cross-market index dataset | `Taiwan Cross-Market Index Historical Data of the Taiwan Stock Price Index` | `secondary_index_context` |
| Cross-market dataset URL | `https://data.gov.tw/en/datasets/11669` | `official_metadata_reference` |
| Cross-market update frequency | `Every day` | `supports_daily_candidate_context` |
| Cross-market license | `Open Government Data License, version 1.0` | `license_reference_found_not_legal_approval` |
| Cross-market charge | `free` | `free_candidate_reference_found` |
| Listed-equity daily close context | `https://data.gov.tw/dataset/11548` | `separate_listed_equity_context_not_twii_baseline` |

## Field Contract Evidence

Minimum PM field contract for the TWII index baseline:

| App normalized field | Candidate source evidence | Current PM use |
| --- | --- | --- |
| `trade_date` | Dataset keyword / data field includes date concept. | Candidate source field for market session date. |
| `close_value` | Dataset keyword includes closing index. | Candidate source field for daily close level. |
| `instrument_code` | App-level alias `TWII`; not claimed as source-provided official code. | Internal routing/display alias only. |
| `instrument_name` | `Weighted Stock Price Index Historical Data` / Taiwan Stock Exchange Weighted Index. | Public display name candidate. |
| `source_url_label` | Dataset page URL and OpenAPI swagger URL. | Public source reference candidate, pending A2 wording. |
| `source_updated_at` | Dataset metadata updated time. | Metadata timestamp candidate, not row freshness proof. |

Fields not accepted for this first TWII baseline packet:

- intraday values,
- second-level freshness,
- full historical backfill coverage,
- trading volume,
- turnover,
- high / low / open values,
- revision replacement behavior,
- official endorsement wording,
- redistribution or resale rights,
- row-level source payload output.

## PM Classification

The evidence is strong enough for:

- planning a future bounded readonly review,
- explaining why TWII is the first index baseline candidate,
- keeping the public runtime in mock mode while showing source-readiness progress,
- preparing a future operator decision packet.

The evidence is not enough for:

- executing a readonly attempt now,
- connecting to Supabase,
- writing staging rows,
- mutating `daily_prices`,
- awarding row coverage points,
- claiming source-rights approval,
- claiming complete coverage,
- switching `publicDataSource=supabase`,
- switching `scoreSource=real`.

PM-safe classification:

`twii_exact_source_rights_and_field_contract_evidence_ready_for_pm_review_not_execution`

## PM Intake Route

PM-safe intake route:

`accept_twii_exact_source_rights_and_field_contract_evidence_no_fetch`

Next PM route:

`review_exact_twii_evidence_then_prepare_operator_readonly_decision_packet_or_repair`

Next A1 route:

`prepare_twii_operator_readonly_decision_packet_no_execution_if_pm_accepts_evidence`

Next A2 route:

`prepare_twii_source_attribution_cadence_phrase_set_patch_if_pm_requests`

## Hard Stop Lines

This packet does not authorize:

- SQL execution,
- Supabase connection,
- Supabase reads,
- Supabase writes,
- staging rows,
- `daily_prices` mutation,
- endpoint probe,
- OpenAPI call,
- CSV download,
- market-data fetch,
- market-data ingest,
- market-data storage,
- market-data commit,
- runner creation,
- parser implementation,
- candidate market-row artifact generation,
- raw payload output,
- row payload output,
- stock-id row-list output,
- secret output,
- row coverage points,
- public source promotion,
- `publicDataSource=supabase`,
- `scoreSource=real`,
- real-time market-data claims,
- official endorsement claims,
- investment advice claims.

## Evidence References

References used for this no-fetch packet:

1. `https://data.gov.tw/en/datasets/11755`
2. `https://data.gov.tw/en/datasets/11669`
3. `https://data.gov.tw/dataset/11548`
4. `https://openapi.twse.com.tw/`

These are metadata references only. No row payload, CSV, endpoint response, API response, or raw market data is included.

## Completion Definition

This packet is complete when:

- exact metadata references are named;
- TWII minimum field contract is named;
- PM classification is named;
- PM, A1, and A2 next routes are named;
- no-fetch and no-execution stop lines are explicit;
- the checker is registered in `package.json` and `scripts/check-review-gates.mjs`.
