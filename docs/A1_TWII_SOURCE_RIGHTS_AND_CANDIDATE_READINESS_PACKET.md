# A1 TWII Source-Rights And Candidate Readiness Packet

Status: `a1_twii_source_rights_and_candidate_readiness_packet_ready_local_only_not_executable`

Date: 2026-06-07

## Purpose

This A1 Data / Supabase / Market Evidence packet prepares a local-only TWII source-rights and candidate readiness branch for PM intake. It is an alternative data route because ETF coverage is currently blocked by `legal_and_redistribution_terms_unapproved`.

This packet does not approve source rights, candidate generation, parser work, remote probing, SQL, Supabase access, staging rows, `daily_prices` mutation, row coverage points, public source promotion, or real scoring.

## Current Coverage Evidence

Level 1 MVP row coverage remains incomplete:

- Full MVP row coverage: `182/360`.
- Missing rows: `178`.
- Full-scope status: `blocked_incomplete`.
- TW equity sub-scope: `180/180`.
- ETF sub-scope: `2/120`.
- ETF blocker: `legal_and_redistribution_terms_unapproved`.
- `TWII`: `0/60`.
- `0050`: `1/60`.
- `006208`: `1/60`.

TWII is therefore a local-only alternative branch for PM review while ETF source rights remain blocked.

Evidence anchors:

- `docs/TW_EQUITY_ROW_COVERAGE_SCORING_GATE.md`.
- `docs/ETF_DAILY_PRICES_COVERAGE_COMPLETION_ROUTE.md`.
- `docs/reviews/TWII_SOURCE_SELECTION_ACCEPTANCE_GATE_2026-06-01.md`.
- `docs/reviews/TWII_SOURCE_RIGHTS_FIELD_CONTRACT_REVIEW_PACKET_2026-06-01.md`.
- `src/lib/twii-source-selection-packet.ts`.

## TWII Source-Rights Intake

Existing TWII source selection status:

- Target symbol: `TWII`.
- Observed rows: `0`.
- Selected first candidate: `official-exchange-index`.
- Selection status: `accepted_for_rights_and_field_contract_review_only`.
- Review state: `not_approved_for_probe_or_ingestion`.
- Fallback candidates: `licensed-market-data-vendor`, `internal-approved-feed`.

PM/CEO must accept the following before TWII can move beyond local readiness:

| Intake item | Required accepted evidence | Current state |
| --- | --- | --- |
| Source authority | Official or licensed authority for TWII historical index values. | unresolved |
| Automated access permission | Terms allow the exact future access method. | unresolved |
| Internal storage | Internal storage of TWII source-derived values is allowed. | unresolved |
| Retention and audit trail | Retention period, deletion duties, audit trail, and cache limits are documented. | unresolved |
| Redistribution and display limits | Public display, export, sharing, and cached-value rules are documented. | unresolved |
| Attribution wording | Required source, delay, official-value, and incompleteness wording is accepted. | unresolved |
| Derived analysis | Derived metrics, row coverage scoring, QA summaries, and internal decision-support use are allowed or explicitly blocked. | unresolved |
| Rate limits and fair use | Request limits, retry behavior, outage handling, and fair-use posture are accepted. | unresolved |
| Commercial use constraints | Any product, paid-use, or redistribution constraints are documented. | unresolved |
| Fallback route | Rejection path to `licensed-market-data-vendor` or `internal-approved-feed` is accepted. | unresolved |

If any item remains unresolved, TWII stays `not_approved_for_probe_or_ingestion`.

## Index daily_prices Field Contract

TWII is an index lane, not an equity or ETF lane. Any future `daily_prices` mapping must preserve this distinction.

Allowed future field contract shape for TWII index daily coverage:

| Field | Meaning |
| --- | --- |
| `symbol` | Expected value: `TWII`. |
| `asset_type` | Expected value: `index`. |
| `trade_date` | Taiwan market session date. |
| `index_close` | Official end-of-day index value, if accepted by source-rights and field review. |
| `index_open` | Optional only if the accepted source provides official open value. |
| `index_high` | Optional only if the accepted source provides official high value. |
| `index_low` | Optional only if the accepted source provides official low value. |
| `turnover` | Optional only if official market turnover/value contract is accepted. |
| `source_label` | Accepted source lane and attribution label. |
| `source_rights_status` | Must remain blocked or pending until PM/CEO accepts rights. |
| `validation_status` | Aggregate validation state for future review output. |
| `batch_id` | Future bounded execution partition id. |

Field boundaries:

- `daily_prices` mapping for TWII must not imply individual stock OHLCV coverage.
- Index value fields must not be mixed with ETF NAV, ETF premium/discount, ETF holdings, equity price rows, or intraday signals.
- Holiday and missing-session behavior must distinguish market calendar gaps from source gaps.
- Numeric precision and rounding must be accepted before any future candidate generation.
- TWII mapping to an internal stock id or market asset id remains unresolved and must not produce stock id payload.

## Sanitized Candidate Artifact Shape

This packet defines shape only. It does not generate TWII candidates.

Future sanitized TWII candidate artifact metadata:

| Field | Meaning |
| --- | --- |
| `artifact_id` | PM-approved identifier for the future candidate packet. |
| `scope` | Expected value: `twii_index_daily_prices_missing_rows`. |
| `symbol` | Expected value: `TWII`. |
| `coverage_window` | Expected `60` sessions unless PM changes the route. |
| `expected_rows` | Expected aggregate count, currently `60`. |
| `already_observed_rows` | Aggregate count already observed, currently `0`. |
| `candidate_missing_rows` | Aggregate missing count, currently `60`. |
| `source_lane` | `official-exchange-index`, `licensed-market-data-vendor`, or `internal-approved-feed` after PM/CEO source-rights intake. |
| `source_rights_status` | Must remain `not_approved_for_probe_or_ingestion` until accepted in a separate gate. |
| `field_contract_version` | PM-approved field contract reference. |
| `batch_id` | Future bounded execution partition id. |
| `review_output_policy` | Must be `aggregate_only_no_raw_or_row_payloads_no_stock_id_payloads`. |

Forbidden candidate contents:

- raw payload;
- row payload;
- stock id payload;
- secrets;
- source response bodies;
- per-row source values;
- source-derived candidate data;
- committed market-data files.

## Future Execution Readiness Criteria

Future TWII staging/write/readback work is not executable from this packet. PM must open a separate gate before any action beyond local planning.

Minimum future gates:

1. TWII source-rights outcome gate: accepts source authority, automated access, internal storage, retention, redistribution, attribution, derived analysis, rate limits, and delayed/missing wording.
2. TWII index field contract gate: accepts field mapping, calendar basis, end-of-day meaning, precision, timezone, and missing-session behavior.
3. TWII sanitized candidate artifact gate: validates aggregate counts and shape without raw payload, row payload, stock id payload, or secrets.
4. TWII staging/write authorization gate: names the exact command, exact scope, max attempts, allowed target, rollback/stop conditions, and confirmation token.
5. TWII bounded runner implementation checker or reuse decision: proves fail-closed behavior and prevents broader symbols, broader fields, or direct promotion.
6. TWII post-run review template: requires sanitized aggregate-only review immediately after any future execution.
7. TWII readback gate: verifies accepted rows, missing rows, duplicate rows, rejected rows, and source-rights status by aggregate counts.
8. Level 1 row coverage scoring gate update: considers row coverage points only after source-rights, execution, readback, and post-run review pass.

Exact command requirement for a future gate:

- A future execution gate must contain one exact command string.
- The exact command must include a PM-approved authorization id and confirmation token.
- The exact command must be checked by a dedicated checker before execution.
- Any command drift must stop execution.
- No exact executable command is provided by this packet.

Post-run review requirement for a future gate:

- The review must be created immediately after the future attempt.
- The review must report aggregate counts only.
- The review must include `sqlExecuted=false`, `rowPayloadsPrinted=false`, `stockIdPayloadsPrinted=false`, `secretsPrinted=false`, `publicDataSource=mock`, and `scoreSource=mock`.
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
- does not generate TWII candidates;
- does not probe an external endpoint;
- does not approve source rights;
- does not give row coverage points;
- does not promote `publicDataSource=supabase`;
- does not set `scoreSource=real`.

Current runtime and scoring boundaries remain:

- `publicDataSource=mock`;
- `scoreSource=mock`.

## PM Intake Checklist

PM can use this packet when:

- `npm run check:a1-twii-source-rights-and-candidate-readiness-packet` passes.
- `npm run check:twii-source-selection-packet` still confirms TWII source selection is local-only.
- `npm run check:twii-source-rights-field-contract-review-packet` still confirms TWII rights and field questions are unresolved and not executable.
- `npm run check:tw-equity-row-coverage-scoring-gate` still confirms Level 1 `182/360` and `TWII` `0/60`.
- `npm run check:etf-daily-prices-coverage-completion-route` still confirms ETF is blocked by `legal_and_redistribution_terms_unapproved`.
- PM keeps this packet as a local-only handoff unless CEO/PM separately opens a TWII source-rights outcome or execution gate.
