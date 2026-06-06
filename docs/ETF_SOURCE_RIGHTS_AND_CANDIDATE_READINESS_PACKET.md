# ETF Source-Rights And Candidate Readiness Packet

Status: `etf_source_rights_and_candidate_readiness_packet_ready_local_only_not_executable`

Date: 2026-06-07

## Purpose

This A1 packet prepares the ETF source-rights outcome intake and sanitized candidate artifact readiness shape for PM review. It follows the existing ETF daily prices coverage completion route and does not create a new governance path.

This packet is local-only. It does not approve source use, candidate generation, SQL, Supabase access, staging rows, `daily_prices` mutation, raw market-data handling, row coverage points, public source promotion, or real scoring.

## Current ETF Coverage Evidence

Current Level 1 MVP ETF coverage remains incomplete:

- Target symbols: `0050`, `006208`.
- Expected sessions per symbol: `60`.
- Expected ETF rows: `120`.
- Current observed ETF rows: `2/120`.
- Missing ETF rows: `118`.
- `0050`: `1/60`, missing `59`.
- `006208`: `1/60`, missing `59`.
- Current ETF route status: `etf_daily_prices_coverage_completion_route_ready_source_rights_blocked`.
- Current source-rights blocker: `legal_and_redistribution_terms_unapproved`.

Evidence anchors:

- `docs/ETF_DAILY_PRICES_COVERAGE_COMPLETION_ROUTE.md`.
- `src/lib/etf-source-rights-review-packet.ts`.
- `docs/A1_NEXT_DATA_COVERAGE_HANDOFF.md`.

## Source-Rights Outcome Intake

PM can treat this packet as ready for a later source-rights outcome decision only when the following conditions are explicitly accepted:

| Intake item | Required accepted outcome |
| --- | --- |
| Source lane | One approved lane is named from `twse-mis-etf-surface`, `issuer-official-pages`, or `licensed-vendor`, or PM records a different lane in a separate gate. |
| Storage rights | Internal storage of source-derived ETF market price rows is explicitly permitted. |
| Retention rights | Retention period and deletion obligations are documented. |
| Redistribution limits | Public display, sharing, export, and cached-value restrictions are documented. |
| Attribution wording | Required provider, exchange, issuer, or vendor attribution is documented. |
| Derived analysis | Derived metrics and row coverage scoring use are explicitly allowed or kept blocked. |
| Delay / incompleteness | Public and internal wording for delayed, missing, partial, or unavailable ETF data is accepted. |
| Rate limits | Request limits, retry behavior, and outage handling are accepted before any future remote fetch. |
| Field contract | `daily_prices` field scope is accepted, including what ETF-specific fields are excluded. |
| Post-run review | Future execution must require sanitized aggregate-only post-run review. |

Still blocked in this packet:

- `legal_and_redistribution_terms_unapproved`.
- ETF market-data fetch.
- ETF ingestion.
- ETF candidate artifact generation from remote/source data.
- Source-derived row storage.
- Redistribution approval.
- Public ETF source claims.
- Row coverage points.
- `publicDataSource=supabase`.
- `scoreSource=real`.

## ETF daily_prices Field Contract

The ETF coverage task is limited to market-price daily coverage for the MVP row coverage denominator.

Allowed `daily_prices` coverage fields for a future accepted ETF candidate artifact:

- `symbol`;
- `trade_date`;
- `open`;
- `high`;
- `low`;
- `close`;
- `volume`;
- `turnover`;
- `source_label`;
- `source_rights_status`;
- `validation_status`;
- `batch_id`;
- aggregate-only `expected_rows`, `observed_rows`, `missing_rows`, and `rejected_rows` in review output.

Market price vs ETF-specific boundary:

- Market price OHLCV and turnover may be prepared for `daily_prices` only after source-rights acceptance.
- NAV is out of scope for this MVP row coverage candidate unless PM opens a separate ETF NAV field contract.
- Premium / discount is out of scope unless PM opens a separate ETF premium-discount gate.
- Holdings data is out of scope unless PM opens a separate ETF holdings source-rights and field contract.
- Expense ratio, issuer metadata, tracking index, creation/redemption data, and intraday indicative value are out of scope for this packet.
- Public copy must not imply NAV, premium / discount, or holdings coverage when only market-price daily rows are being evaluated.

## Sanitized Candidate Artifact Shape

This packet defines the candidate artifact shape only. It does not produce candidate rows, fetch market data, store source-derived values, or output row payloads.

Future sanitized candidate artifact metadata:

| Field | Meaning |
| --- | --- |
| `artifact_id` | PM-approved identifier for the candidate packet. |
| `scope` | Expected value: `etf_daily_prices_missing_rows`. |
| `symbols` | Aggregate list limited to `0050` and `006208`. |
| `coverage_window` | Expected `60` sessions per symbol unless PM changes the route. |
| `expected_rows` | Expected aggregate count, currently `120`. |
| `already_observed_rows` | Aggregate count already observed, currently `2`. |
| `candidate_missing_rows` | Aggregate missing count, currently `118`. |
| `per_symbol_expected_rows` | Aggregate per-symbol count: `60`. |
| `per_symbol_observed_rows` | Aggregate per-symbol counts: `0050` has `1`, `006208` has `1`. |
| `per_symbol_missing_rows` | Aggregate per-symbol counts: `0050` has `59`, `006208` has `59`. |
| `source_lane` | Source lane accepted in a separate source-rights outcome. |
| `source_rights_status` | Must remain blocked until accepted by PM/CEO gate. |
| `field_contract_version` | PM-approved field contract reference. |
| `batch_id` | Future bounded execution partition id. |
| `review_output_policy` | Must be `aggregate_only_no_raw_or_row_payloads`. |

Forbidden candidate contents:

- raw payload;
- row payload;
- stock id payload;
- secrets;
- source response bodies;
- per-row source values;
- full source-derived candidate data;
- committed market-data files.

## Execution-Readiness Criteria

Future staging/write/readback work is not executable from this packet. PM must open a separate gate before any action beyond local planning.

Minimum future gates:

1. ETF source-rights outcome gate: accepts one source lane and records storage, retention, redistribution, attribution, derived-analysis, and delay/incompleteness rules.
2. ETF sanitized candidate artifact gate: validates aggregate counts and shape without raw payload, row payload, stock id payload, or secrets.
3. ETF staging/write authorization gate: names the exact command, exact scope, max attempts, allowed target, rollback/stop conditions, and confirmation token.
4. ETF bounded runner implementation checker or reuse decision: proves the runner fails closed and cannot drift into broader symbols or broader fields.
5. ETF post-run review template: requires sanitized aggregate-only review immediately after any future execution.
6. ETF readback gate: verifies accepted rows, missing rows, duplicate rows, rejected rows, and source-rights status by aggregate symbol counts.
7. ETF row coverage scoring gate update: considers row coverage points only after source-rights, write, readback, and post-run review pass.

Exact command requirement for a future gate:

- The future gate must contain one exact command string.
- The exact command must include a PM-approved authorization id and confirmation token.
- The exact command must be checked by a dedicated checker before execution.
- Any command drift must stop execution.
- No exact executable command is provided by this packet.

Post-run review requirement for a future gate:

- The review must be created immediately after the future attempt.
- The review must report aggregate counts only.
- The review must include `sqlExecuted=false`, `connectionAttempted` or write-attempt status, `supabaseWritesEnabled` or write scope status, `rowPayloadsPrinted=false`, `stockIdPayloadsPrinted=false`, `secretsPrinted=false`, `publicDataSource=mock`, and `scoreSource=mock`.
- The review must not award row coverage points by itself.

## Hard Stop

This packet:

- does not run SQL;
- does not connect to Supabase;
- does not write Supabase;
- does not create staging rows;
- does not modify `daily_prices`;
- does not fetch raw market data;
- does not ingest raw market data;
- does not store raw market data;
- does not commit raw market data;
- does not output secrets;
- does not output raw payload;
- does not output row payload;
- does not output stock id payload;
- does not generate ETF candidates from remote/source data;
- does not give row coverage points;
- does not promote `publicDataSource=supabase`;
- does not set `scoreSource=real`.

Current runtime and scoring boundaries remain:

- `publicDataSource=mock`;
- `scoreSource=mock`.

## PM Intake Checklist

PM can use this packet to decide whether to open a future gate when:

- `npm run check:etf-source-rights-and-candidate-readiness-packet` passes.
- `npm run check:etf-daily-prices-coverage-completion-route` still confirms ETF `2/120` and missing `118`.
- `npm run check:etf-source-rights-review-packet` still confirms source-rights review packet status and blockers.
- `npm run check:a1-next-data-coverage-handoff` still confirms ETF as the smallest next A1 route.
- PM names whether `twse-mis-etf-surface`, `issuer-official-pages`, or `licensed-vendor` is ready for a source-rights outcome decision.
- PM keeps this packet local-only unless CEO/PM separately opens an execution gate.
