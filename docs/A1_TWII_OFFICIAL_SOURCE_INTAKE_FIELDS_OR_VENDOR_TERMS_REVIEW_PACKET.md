# A1 TWII Official Source Intake Fields Or Vendor Terms Review Packet

Status: `a1_twii_official_source_intake_fields_or_vendor_terms_review_packet_ready_not_filled`

Date: 2026-06-07

Owner: A1 Data / Supabase / Market Evidence

Integration owner: PM mainline

## CEO Decision

CEO moves the TWII data-coverage unblock route from decision support into a fillable, no-secret intake packet.

Decision route: `twii_official_source_intake_fields_or_vendor_terms_review_packet`.

Current outcome: `fillable_intake_ready_rights_evidence_not_filled`.

This packet is designed for PM/CEO/Legal/Data to fill later. It does not contain provider secrets, source payloads, market-data rows, endpoint results, row payloads, stock id payloads, or credentials.

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
| `OFFICIAL-001` | Source authority | `ACCEPTED_SAFE_PUBLIC_REFERENCE` | Taiwan Stock Exchange Corporation (`TWSE`) is the official public authority/source surface for TAIEX/TWII index series and TAIEX historical index values. This accepts source identity only; it does not approve automated access, storage, redistribution, derived analysis, candidate generation, or execution. |
| `OFFICIAL-002` | Terms location | `TERMS_LOCATION_IDENTIFIED_SAFE_PUBLIC_REFERENCE` | Safe public reference locations are TWSE website Terms of Use and TWSE Regulations Governing the Use of Trading Information / contracts / fee standards pages. This identifies where rights review must occur; it does not approve automated access, internal storage, redistribution, commercial use, or public real-data display. |
| `OFFICIAL-003` | Automated access | `TBD_ACCEPTED_REJECTED_OR_BLOCKED` | State whether the exact future access method is allowed. |
| `OFFICIAL-004` | Internal storage | `TBD_ACCEPTED_REJECTED_OR_BLOCKED` | State whether internal storage of source-derived TWII values is allowed. |
| `OFFICIAL-005` | Retention/deletion | `TBD_ACCEPTED_REJECTED_OR_BLOCKED` | State retention window, deletion duty, cache limits, rollback, and audit posture. |
| `OFFICIAL-006` | Redistribution/display | `TBD_ACCEPTED_REJECTED_OR_BLOCKED` | State public display, screenshots, export, API reuse, and downstream-copy limits. |
| `OFFICIAL-007` | Attribution wording | `TBD_SAFE_COPY_REFERENCE` | State required source, delay, official-value, incomplete-data, and source-gap wording. |
| `OFFICIAL-008` | Derived analysis | `TBD_ACCEPTED_REJECTED_OR_BLOCKED` | State whether QA summaries, derived metrics, decision support, and row coverage scoring are allowed. |
| `OFFICIAL-009` | Rate limits/fair use | `TBD_SAFE_NON_SECRET_REFERENCE` | State request limits, retry policy, outage behavior, and fair-use constraints. |
| `OFFICIAL-010` | Commercial/global use | `TBD_ACCEPTED_REJECTED_OR_BLOCKED` | State paid-product, Taiwan user, global user, redistribution, and vendor restriction posture. |
| `OFFICIAL-011` | Field contract | `TBD_ACCEPTED_REJECTED_OR_BLOCKED` | State whether `trade_date`, `index_close`, optional OHLC/turnover, timezone, precision, rounding, and revision rules are accepted. |
| `OFFICIAL-012` | Aggregate-only review | `TBD_ACCEPTED_REJECTED_OR_BLOCKED` | Confirm future output excludes raw payload, row payload, stock id payload, source response body, and secrets. |

Official source fill status:

`partially_filled_official_001_002_source_authority_and_terms_location_only`

### OFFICIAL-001 Evidence Note

PM records `TWSE` as the safe public source authority for the TWII/TAIEX index lane because TWSE identifies the Taiwan Stock Exchange Capitalization Weighted Stock Index (`TAIEX`) as a TWSE self-compiled index and provides a public TAIEX Total Index Historical Data surface.

This note is intentionally narrow:

- accepted: source authority / official public source surface;
- not accepted: automated access method;
- not accepted: internal storage;
- not accepted: retention / deletion;
- not accepted: redistribution / public display;
- not accepted: attribution wording;
- not accepted: derived analysis or row coverage scoring;
- not accepted: commercial/global use;
- not accepted: field-contract approval;
- not accepted: candidate generation, parser work, market-data fetch, SQL, Supabase, `daily_prices` mutation, public source promotion, or real scoring.

### OFFICIAL-002 Evidence Note

PM records the safe public terms-location references for TWII/TAIEX source-rights review:

- TWSE Terms of Use: `https://www.twse.com.tw/zh/terms/use.html`.
- TWSE English Terms of Use: `https://www.twse.com.tw/en/terms/use.html`.
- TWSE Trading Information use / contracts / fee standards page: `https://www.twse.com.tw/zh/products/information/use.html`.
- TWSE English Trading Information use / contracts / fee standards page: `https://www.twse.com.tw/en/products/information/use.html`.

The terms-location review also records two important stop-lines from those references:

- TWSE Terms of Use identifies download / automated-tool restrictions and intellectual-property boundaries that require separate acceptance before any automated access or reuse.
- TWSE Trading Information use pages identify the management rules / contract / fee-standard route for applicants using trading information.

This note is intentionally narrow:

- accepted: safe public terms-location references for review;
- not accepted: interpretation that the terms permit automated download;
- not accepted: internal storage;
- not accepted: redistribution / public display;
- not accepted: commercial/global use;
- not accepted: source-rights approval, field-contract approval, candidate generation, parser work, market-data fetch, SQL, Supabase, `daily_prices` mutation, public source promotion, or real scoring.

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
