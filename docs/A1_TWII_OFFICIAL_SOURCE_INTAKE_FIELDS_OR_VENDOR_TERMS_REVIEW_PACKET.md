# A1 TWII Official Source Intake Fields Or Vendor Terms Review Packet

Status: `a1_twii_official_source_intake_fields_or_vendor_terms_review_packet_filled_official_001_012_no_execution`

Date: 2026-06-07

Owner: A1 Data / Supabase / Market Evidence

Integration owner: PM mainline

## CEO Decision

CEO moves the TWII data-coverage unblock route from decision support into a fillable, no-secret intake packet.

Decision route: `twii_official_source_intake_fields_or_vendor_terms_review_packet`.

Current outcome: `official_open_data_intake_filled_execution_still_blocked`.

This packet is now filled for `OFFICIAL-001` through `OFFICIAL-012` under the `official_open_data_api` candidate route. It does not contain provider secrets, source payloads, market-data rows, endpoint results, row payloads, stock id payloads, or credentials.

## Current Baseline

Accepted local baseline:

- Level 1 MVP coverage: `182/360`.
- Missing rows: `178`.
- TW equity sub-scope: `180/180`.
- TWII sub-scope: `0/60`, missing `60`.
- ETF sub-scope: `2/120`, missing `118`.
- First TWII candidate: `official-exchange-index`.
- Fallback candidate 1: `licensed-market-data-vendor`.
- Fallback candidate 2: `internal-approved-feed`.
- Current TWII state: `not_approved_for_probe_or_ingestion`.
- Runtime remains `publicDataSource=mock`.
- Score remains `scoreSource=mock`.

Evidence anchors:

- `docs/A1_TWII_SOURCE_RIGHTS_EVIDENCE_INTAKE_OR_VENDOR_FALLBACK_DECISION_SUPPORT.md`.
- `docs/A1_TWII_SOURCE_RIGHTS_UNBLOCK_DECISION_RECORD_CANDIDATE.md`.
- `docs/TWII_SOURCE_RIGHTS_OUTCOME_GATE.md`.
- `docs/A1_TWII_INDEX_FIELD_CONTRACT_DECISION_SUPPORT.md`.
- `src/lib/twii-source-selection-packet.ts`.

## Official Source Intake Fields

Fill these fields only with safe non-secret conclusions, citations, or internal references. Do not paste raw terms, credentials, source payloads, or market-data values into this repo.

| Field id | Field | Fill state | Required safe value |
| --- | --- | --- | --- |
| `OFFICIAL-001` | Source authority | `ACCEPTED_SAFE_PUBLIC_REFERENCE_OPEN_DATA_ROUTE_SEPARATE` | Taiwan Stock Exchange Corporation (`TWSE`) remains the official public authority/source surface for TAIEX/TWII index series and TAIEX historical index values. The current automatable candidate route is `official_open_data_api` via data.gov open-data references and TWSE OpenAPI; this does not approve TWSE website crawling, storage, redistribution, derived analysis, candidate generation, or execution. |
| `OFFICIAL-002` | Terms location | `TERMS_LOCATION_IDENTIFIED_OPEN_DATA_AND_TWSE_BOUNDARY_REFERENCE` | Primary terms locations for the no-cost automatable route are data.gov Open Government Data License, relevant data.gov TWSE dataset pages, and TWSE OpenAPI swagger. TWSE website Terms of Use and TWSE Trading Information use / contracts / fee standards pages remain boundary references for non-open-data website automation and paid/contracted routes. |
| `OFFICIAL-003` | Automated access | `BLOCKED_UNCONSENTED_WEBSITE_AUTOMATION_OPENAPI_ROUTE_SEPARATE` | Unconsented TWSE website download / crawler / scraper / extraction access remains blocked. The separate candidate route is machine access through data.gov-referenced TWSE OpenAPI endpoints, pending bounded metadata / terms / field-contract validation; this still does not approve parser implementation, market-data fetch, storage, Supabase write, public promotion, or real scoring. |
| `OFFICIAL-004` | Internal storage | `ACCEPTED_OPEN_DATA_INTERNAL_STORAGE_WITH_ATTRIBUTION_AND_AUDIT` | Under the data.gov Open Government Data License route, internal storage for normalized daily close / trading-information records is accepted for bounded validation, cache, QA, rollback, and future Supabase design, provided attribution, source URL, update date, and audit metadata are retained. This does not authorize production writes yet. |
| `OFFICIAL-005` | Retention/deletion | `ACCEPTED_INTERNAL_RETENTION_WITH_CORRECTION_AND_WITHDRAWAL_CONTROLS` | Retention is accepted for project-owned normalized records and derived summaries, with correction, deletion, rollback, and source-withdrawal controls. The project must be able to mark stale/withdrawn data, stop public display if source/license status changes, and rebuild from source metadata. |
| `OFFICIAL-006` | Redistribution/display | `ACCEPTED_PUBLIC_DISPLAY_WITH_ATTRIBUTION_DELAY_AND_NO_RAW_PAYLOAD_REPUBLICATION` | Public display is accepted for normalized daily close, trading summaries, and derived dashboard signals under the open-data route with attribution, update timestamp, non-investment-advice copy, and no raw payload republication or unofficial real-time claim. API resale/downstream bulk redistribution is not accepted. |
| `OFFICIAL-007` | Attribution wording | `ACCEPTED_SAFE_COPY_REFERENCE_OPEN_GOVERNMENT_DATA_LICENSE` | Required public copy must cite data source and license: `資料來源：臺灣證券交易所 OpenAPI / 政府資料開放平臺，依政府資料開放授權條款第1版使用；資料可能延遲或調整，本網站非投資建議。` Route-level wording may add update time and source-gap notes. |
| `OFFICIAL-008` | Derived analysis | `ACCEPTED_DERIVED_ANALYSIS_WITH_NO_INVESTMENT_ADVICE_AND_TRACEABLE_INPUTS` | Derived QA summaries, trend indicators, decision-support labels, row coverage scoring, and red/yellow/green dashboard signals are accepted under the open-data route if inputs remain traceable, source/update metadata is retained, and output avoids investment advice, guaranteed returns, or official real-time claims. |
| `OFFICIAL-009` | Rate limits/fair use | `ACCEPTED_INTERNAL_CONSERVATIVE_DAILY_BATCH_POLICY_PENDING_PROVIDER_LIMIT_DISCOVERY` | Until provider-specific limits are confirmed, use an internal conservative policy: daily batch after market close, one request per required endpoint per run where possible, no parallel hammering, exponential backoff, cache reuse, outage fail-closed, and no user-triggered high-frequency refresh. |
| `OFFICIAL-010` | Commercial/global use | `ACCEPTED_OPEN_DATA_PRODUCT_USE_WITH_ATTRIBUTION_AND_NO_OFFICIAL_ENDORSEMENT` | Open-data based product use is accepted for public Beta and future commercial/global access only with attribution, no official endorsement implication, no resale of bulk raw data, no real-time trading-data claim, and continued compliance with source/license withdrawal or update notices. |
| `OFFICIAL-011` | Field contract | `ACCEPTED_METADATA_FIELD_CONTRACT_FOR_DAILY_CLOSE_AND_TRADING_INFO` | Swagger metadata accepts bounded field contracts for TWII index close and listed-stock daily close/trading information: `Date`, `ClosingIndex`, `OpeningIndex`, `HighestIndex`, `LowestIndex`, `Code`, `Name`, `ClosingPrice`, `MonthlyAveragePrice`, `TradeVolume`, `TradeValue`, `OpeningPrice`, `HighestPrice`, `LowestPrice`, `Change`, and `Transaction`. Normalization must map dates to Asia/Taipei trading date and keep source strings until parsed validation passes. |
| `OFFICIAL-012` | Aggregate-only review | `ACCEPTED_AGGREGATE_ONLY_REVIEW_NO_RAW_PAYLOAD_OR_SECRET_OUTPUT` | Future review, reports, commits, and public surfaces must exclude raw response bodies, raw row payloads, stock-id payload dumps, credentials, env values, and secrets. Allowed outputs are aggregate counts, schema names, field-contract summaries, validation status, source labels, and no-secret attribution text. |

Official source fill status:

`filled_official_001_012_for_official_open_data_api_candidate_no_execution`

### OFFICIAL-001 Evidence Note

PM records `TWSE` as the safe public source authority for the TWII/TAIEX index lane because TWSE identifies the Taiwan Stock Exchange Capitalization Weighted Stock Index (`TAIEX`) as a TWSE self-compiled index and provides public index-history surfaces.

PM also reconciles this field with `docs/OPEN_FREE_AUTO_DATA_SOURCE_GATE.md`: the current low-cost automatable candidate is not TWSE website crawling. It is `official_open_data_api` through data.gov open-data references and TWSE OpenAPI.

This note is intentionally narrow:

- accepted: source authority / official public source surface;
- accepted: `official_open_data_api` as the current candidate route for later bounded validation;
- not accepted: automated access method;
- not accepted: internal storage;
- not accepted: retention / deletion;
- not accepted: redistribution / public display;
- not accepted: attribution wording;
- not accepted: derived analysis or row coverage scoring;
- not accepted: commercial/global use;
- not accepted: field-contract approval;
- not accepted: TWSE website crawling, candidate generation, parser work, market-data fetch, SQL, Supabase, `daily_prices` mutation, public source promotion, or real scoring.

### OFFICIAL-002 Evidence Note

PM records the safe public terms-location references for TWII/TAIEX source-rights review. The primary terms-location route for the no-cost automatable strategy is now the data.gov open-data route plus TWSE OpenAPI metadata:

- Data.gov Open Government Data License: `https://data.gov.tw/license`.
- Data.gov TWSE dataset reference: `https://data.gov.tw/dataset/11669`.
- Data.gov TWSE dataset reference: `https://data.gov.tw/dataset/11548`.
- Data.gov TWSE dataset reference: `https://data.gov.tw/dataset/11549`.
- TWSE OpenAPI swagger: `https://openapi.twse.com.tw/v1/swagger.json`.

TWSE website and trading-information pages remain boundary references:

- TWSE Terms of Use: `https://www.twse.com.tw/zh/terms/use.html`.
- TWSE English Terms of Use: `https://www.twse.com.tw/en/terms/use.html`.
- TWSE Trading Information use / contracts / fee standards page: `https://www.twse.com.tw/zh/products/information/use.html`.
- TWSE English Trading Information use / contracts / fee standards page: `https://www.twse.com.tw/en/products/information/use.html`.

The terms-location review also records two important stop-lines from those references:

- Data.gov license and dataset references identify the primary low-cost open-data terms location for the `official_open_data_api` candidate.
- TWSE Terms of Use identifies download / automated-tool restrictions and intellectual-property boundaries for non-open-data website access.
- TWSE Trading Information use pages identify the management rules / contract / fee-standard route for applicants using trading information.

This note is intentionally narrow:

- accepted: safe public terms-location references for the open-data candidate and website/contract boundary review;
- not accepted: interpretation that the terms permit automated download;
- not accepted: internal storage;
- not accepted: redistribution / public display;
- not accepted: commercial/global use;
- not accepted: source-rights approval, field-contract approval, candidate generation, parser work, market-data fetch, SQL, Supabase, `daily_prices` mutation, public source promotion, or real scoring.

### OFFICIAL-003 Evidence Note

PM records the automated-access posture for the TWII/TAIEX source-rights review. This field now separates blocked website automation from the newer `official_open_data_api` candidate route:

- Data.gov Open Government Data License: `https://data.gov.tw/license`.
- TWSE OpenAPI swagger: `https://openapi.twse.com.tw/v1/swagger.json`.
- TWSE Terms of Use: `https://www.twse.com.tw/zh/terms/use.html`.
- TWSE English Terms of Use: `https://www.twse.com.tw/en/terms/use.html`.
- TWSE Trading Information use / contracts / fee standards page: `https://www.twse.com.tw/zh/products/information/use.html`.
- TWSE English Trading Information use / contracts / fee standards page: `https://www.twse.com.tw/en/products/information/use.html`.

The automated-access review records these stop-lines:

- unconsented automated download, crawler, scraper, script, automated program, or extraction-tool access is not accepted;
- TWSE website automation remains blocked;
- data.gov-referenced TWSE OpenAPI machine access is a separate candidate route for bounded metadata / terms / field-contract validation;
- automated access can move forward only through the open-data API route after validation, a TWSE-agreed method, prior consent, contracted trading-information route, or separately approved internal feed/vendor route;
- this field does not choose the final source lane; it only blocks unconsented official-site automation from becoming the default.

This note is intentionally narrow:

- accepted: unconsented TWSE website automation is blocked;
- accepted: data.gov-referenced TWSE OpenAPI is a separate automatable candidate for the next bounded validation gate;
- not accepted: parser implementation, probe, endpoint test, market-data fetch, raw payload capture, candidate generation, SQL, Supabase, `daily_prices` mutation, public source promotion, or real scoring;
- not accepted: treating this packet as legal advice or final contractual approval.

### OFFICIAL-004 Evidence Note

PM accepts internal storage only for the `official_open_data_api` route and only after later bounded validation. The basis is the data.gov Open Government Data License location plus the project source gate in `docs/OPEN_FREE_AUTO_DATA_SOURCE_GATE.md`.

This note is intentionally narrow:

- accepted: internal storage design for normalized daily close / trading-information records;
- accepted: retaining source URL, source dataset label, license label, update date, and run/audit metadata;
- not accepted: production Supabase write now;
- not accepted: `daily_prices` mutation now;
- not accepted: raw payload storage, raw row dumps, or public real-data promotion.

### OFFICIAL-005 Evidence Note

PM accepts retention only with operational controls:

- retain normalized records and derived summaries only when source/license status remains usable;
- keep correction, deletion, rollback, stale-data, and source-withdrawal controls;
- if a data source is withdrawn, materially changed, or no longer usable, stop affected public display and mark the data stale until repaired.

This note is intentionally narrow:

- accepted: retention/deletion policy design;
- not accepted: indefinite raw payload archives;
- not accepted: ignoring source changes, corrections, or withdrawal notices.

### OFFICIAL-006 Evidence Note

PM accepts public display for the open-data route only in product-safe form:

- normalized daily close and trading summaries may support public dashboard display after validation;
- derived red/yellow/green states may be shown with source/update metadata;
- public copy must include attribution, update time, and non-investment-advice wording;
- raw payload republication, bulk downstream API resale, and official real-time claims are not accepted.

This note is intentionally narrow:

- accepted: public dashboard display after later data-quality and runtime gates;
- not accepted: raw payload republication;
- not accepted: user-facing claim that the site is official, real-time, complete, or trading advice.

### OFFICIAL-007 Evidence Note

PM accepts this safe attribution baseline:

`資料來源：臺灣證券交易所 OpenAPI / 政府資料開放平臺，依政府資料開放授權條款第1版使用；資料可能延遲或調整，本網站非投資建議。`

Route-level copy may add:

- last updated time;
- source gap or outage note;
- partial coverage note;
- derived-signal explanation.

This note is intentionally narrow:

- accepted: attribution and disclosure copy baseline;
- not accepted: official endorsement implication;
- not accepted: hiding delay, missing data, or derived-signal limitations.

### OFFICIAL-008 Evidence Note

PM accepts derived analysis under the open-data route only when source traceability remains intact.

Allowed derived outputs:

- QA summaries;
- missing-row and row-coverage scoring;
- trend, risk, and dashboard state labels;
- 30-second market mood and 3-minute action support copy;
- public Beta red/yellow/green indicators.

This note is intentionally narrow:

- accepted: decision-support interface and derived summaries;
- not accepted: buy/sell/hold instruction;
- not accepted: guaranteed-return wording;
- not accepted: opaque derived outputs that cannot be traced back to source/update metadata.

### OFFICIAL-009 Evidence Note

No provider-specific rate limit is accepted from this packet alone. PM therefore sets a conservative internal policy before any future implementation:

- daily batch after market close;
- one request per required endpoint per run where possible;
- no parallel hammering;
- exponential backoff and retry cap;
- cache reuse;
- outage fail-closed;
- no user-triggered high-frequency refresh;
- no intraday polling unless a later gate explicitly validates it.

This note is intentionally narrow:

- accepted: conservative internal fair-use policy for future design;
- not accepted: high-frequency refresh, scraping behavior, or load-heavy probing.

### OFFICIAL-010 Evidence Note

PM accepts open-data product use only with guardrails:

- attribution remains visible enough for users;
- no official endorsement implication;
- no resale of bulk raw data;
- no real-time trading-data claim;
- public Beta and future commercial/global access remain subject to source/license changes.

This note is intentionally narrow:

- accepted: public Beta / product use design under open-data route;
- not accepted: paid vendor replacement claims;
- not accepted: sublicensing raw data as a standalone product.

### OFFICIAL-011 Evidence Note

PM records swagger metadata only. No market rows were fetched, stored, or printed.

Accepted metadata paths:

- `/indicesReport/MI_5MINS_HIST`: `Date`, `OpeningIndex`, `HighestIndex`, `LowestIndex`, `ClosingIndex`;
- `/exchangeReport/STOCK_DAY_AVG_ALL`: `Date`, `Code`, `Name`, `ClosingPrice`, `MonthlyAveragePrice`;
- `/exchangeReport/STOCK_DAY_ALL`: `Date`, `Code`, `Name`, `TradeVolume`, `TradeValue`, `OpeningPrice`, `HighestPrice`, `LowestPrice`, `ClosingPrice`, `Change`, `Transaction`;
- `/exchangeReport/MI_INDEX`: `日期`, `指數`, `收盤指數`, `漲跌`, `漲跌點數`, `漲跌百分比`, `特殊處理註記`.

This note is intentionally narrow:

- accepted: bounded metadata field contract for daily close and trading information;
- accepted: Asia/Taipei trading-date normalization requirement;
- accepted: source strings must remain untrusted until parsed validation passes;
- not accepted: parser implementation now;
- not accepted: raw market-data fetch or row payload storage now.

### OFFICIAL-012 Evidence Note

PM accepts aggregate-only review as a hard output policy:

- allowed: aggregate counts, schema names, field-contract summaries, validation status, source labels, attribution text, and no-secret route decisions;
- forbidden: raw response bodies, raw row payloads, stock-id payload dumps, source response archives, credentials, env values, service keys, and secrets.

This note is intentionally narrow:

- accepted: aggregate-only review output for future gates;
- not accepted: committing raw market data or printing secrets;
- not accepted: using aggregate-only review as approval to write Supabase or promote real scoring.

## Vendor Terms Review Fields

Use this section if the official lane remains unresolved or rejected.

| Field id | Field | Fill state | Required safe value |
| --- | --- | --- | --- |
| `VENDOR-001` | Vendor identity | `TBD_VENDOR_LABEL_ONLY` | Record a safe vendor label, not account details or secrets. |
| `VENDOR-002` | Contract scope | `TBD_ACCEPTED_REJECTED_OR_BLOCKED` | Confirm TWII symbol/index scope, historical window, refresh rights, and geography. |
| `VENDOR-003` | Storage rights | `TBD_ACCEPTED_REJECTED_OR_BLOCKED` | Confirm internal storage, retention, audit, deletion, and cache rules. |
| `VENDOR-004` | Derived use | `TBD_ACCEPTED_REJECTED_OR_BLOCKED` | Confirm derived metrics, scoring, QA summaries, and decision-support use. |
| `VENDOR-005` | Public display | `TBD_ACCEPTED_REJECTED_OR_BLOCKED` | Confirm public display, delayed display, attribution, screenshot, export, and API reuse terms. |
| `VENDOR-006` | Operational SLA | `TBD_SAFE_NON_SECRET_REFERENCE` | Confirm refresh SLA, outage behavior, retry limits, support, and termination handling. |
| `VENDOR-007` | Cost/governance owner | `TBD_OWNER_LABEL_ONLY` | Name the internal owner role, not payment details or account secrets. |

Vendor review status:

`not_filled_vendor_terms_pending`

## Internal Feed Owner Review Fields

Use this section if an internal feed is safer than official or vendor routes.

| Field id | Field | Fill state | Required safe value |
| --- | --- | --- | --- |
| `INTERNAL-001` | Feed owner | `TBD_OWNER_LABEL_ONLY` | Name an internal role/team owner, not a personal secret or credential. |
| `INTERNAL-002` | Source lineage | `TBD_ACCEPTED_REJECTED_OR_BLOCKED` | Confirm source lineage, rights basis, and original provider constraints. |
| `INTERNAL-003` | Refresh SLA | `TBD_ACCEPTED_REJECTED_OR_BLOCKED` | Confirm refresh frequency, stale-data behavior, and downtime handling. |
| `INTERNAL-004` | Access control | `TBD_ACCEPTED_REJECTED_OR_BLOCKED` | Confirm who can read/write/operate the feed and how audit works. |
| `INTERNAL-005` | Retention/rollback | `TBD_ACCEPTED_REJECTED_OR_BLOCKED` | Confirm retention, rollback, deletion, and correction policy. |
| `INTERNAL-006` | Public display limits | `TBD_ACCEPTED_REJECTED_OR_BLOCKED` | Confirm public copy, attribution, delay, and redistribution constraints. |

Internal feed review status:

`not_filled_internal_feed_owner_pending`

## PM Acceptance Rule

PM may classify the filled packet as:

- `accepted_for_twii_source_rights_outcome_gate_only`;
- `rejected_official_lane_switch_to_vendor_review`;
- `rejected_vendor_lane_switch_to_internal_feed_review`;
- `blocked_external_rights_pending`;
- `needs_bounded_repair`.

Only `accepted_for_twii_source_rights_outcome_gate_only` may open a later source-rights outcome gate. That later gate still must not execute any probe, fetch, SQL, Supabase write, staging row creation, `daily_prices` mutation, row coverage scoring, public data promotion, or real score promotion by itself.

## Hard Stops

This packet does not authorize:

- SQL execution;
- Supabase connection;
- Supabase write;
- staging row creation;
- `daily_prices` mutation;
- raw market-data fetch;
- raw market-data ingest;
- raw market-data storage;
- raw market-data commit;
- raw payload output;
- row payload output;
- stock id payload output;
- secret output;
- TWII candidate generation;
- parser implementation;
- external endpoint probe;
- source-rights approval;
- executable source-lane selection;
- field-contract approval;
- row coverage points;
- public source promotion;
- `publicDataSource=supabase`;
- real score promotion;
- `scoreSource=real`;
- investment advice claim;
- public launch completion claim.

## Next Route

The next route is `twii_filled_source_rights_intake_review_or_blocked_fallback_selection`.

If this packet remains unfilled, PM should keep TWII blocked and continue parallel launch/runtime work or ETF source-rights preparation. If the official route is rejected, PM should switch to vendor/internal owner review before engineering parser/runtime/Supabase work.

## Verification

Focused verification:

- `node scripts/check-a1-twii-official-source-intake-fields-or-vendor-terms-review-packet.mjs`
- `cmd.exe /c npm run check:a1-twii-official-source-intake-fields-or-vendor-terms-review-packet`
- `cmd.exe /c npm run check:a1-twii-source-rights-evidence-intake-or-vendor-fallback-decision-support`
- `cmd.exe /c npm run check:twii-source-rights-outcome-gate`
- `node scripts/check-review-gates.mjs`
