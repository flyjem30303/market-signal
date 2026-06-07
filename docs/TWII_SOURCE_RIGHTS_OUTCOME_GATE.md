# TWII Source-Rights Outcome Gate

Status: `twii_source_rights_outcome_gate_blocked_external_rights_pending`

Date: 2026-06-07

Owner: PM mainline

Support lane: A1 Data / Supabase / Market Evidence

## CEO Decision

CEO opens the TWII source-rights outcome gate as the next PM mainline data route after accepting the A1 TWII readiness packet.

This gate does not approve TWII source rights, probing, candidate generation, ingestion, staging, `daily_prices` mutation, row coverage scoring, public source promotion, or real scoring.

Current outcome:

`rejected_for_execution_pending_external_rights_and_field_contract`

The TWII route remains `not_approved_for_probe_or_ingestion`.

## PM Selected Route

PM selects TWII because Level 1 MVP row coverage remains `182/360`, TWII is `0/60`, and ETF remains blocked by `legal_and_redistribution_terms_unapproved`.

The selected first TWII source candidate remains `official-exchange-index`, but only for rights and field-contract review.

## Current Evidence

Current accepted local evidence:

- Level 1 MVP row coverage: `182/360`.
- Remaining Level 1 missing rows: `178`.
- TW equity sub-scope: `180/180`.
- TWII sub-scope: `0/60`.
- ETF sub-scope: `2/120`.
- ETF blocker: `legal_and_redistribution_terms_unapproved`.
- TWII selected first candidate: `official-exchange-index`.
- TWII selection status: `accepted_for_rights_and_field_contract_review_only`.
- TWII review state: `not_approved_for_probe_or_ingestion`.
- TWII fallback candidates: `licensed-market-data-vendor`, `internal-approved-feed`.
- Runtime boundary remains `publicDataSource=mock`.
- Score boundary remains `scoreSource=mock`.

Evidence anchors:

- `docs/A1_TWII_SOURCE_RIGHTS_AND_CANDIDATE_READINESS_PACKET.md`.
- `docs/reviews/TWII_SOURCE_SELECTION_ACCEPTANCE_GATE_2026-06-01.md`.
- `docs/reviews/TWII_SOURCE_RIGHTS_FIELD_CONTRACT_REVIEW_PACKET_2026-06-01.md`.
- `src/lib/twii-source-selection-packet.ts`.
- `docs/TW_EQUITY_ROW_COVERAGE_SCORING_GATE.md`.
- `docs/ETF_SOURCE_RIGHTS_OUTCOME_DECISION_GATE.md`.

## Narrow Decision Question

Can PM/CEO accept `official-exchange-index` as a source lane for internal storage and derived validation of TWII daily index values, under documented authority, access method, storage, retention, redistribution, attribution, derived analysis, rate limits, commercial use, and delayed/missing data wording?

Current answer:

`no_current_execution_acceptance`

Until the answer changes in a later accepted outcome, PM must keep TWII blocked and must not create TWII candidates from source data.

## Required Acceptance Evidence

PM/CEO may later accept a TWII source lane only if the decision record names all of these items:

| Required item | Acceptance requirement | Current state |
| --- | --- | --- |
| Source authority | Official or licensed authority for TWII historical index values is documented. | unresolved |
| Automated access permission | The exact future access method is permitted. | unresolved |
| Internal storage | Internal storage of TWII source-derived values is permitted. | unresolved |
| Retention and audit trail | Retention period, deletion duties, audit trail, cache limits, and rollback posture are documented. | unresolved |
| Redistribution and display limits | Public display, export, API reuse, screenshots, cached values, and downstream-copy limits are documented. | unresolved |
| Attribution wording | Source, delay, official-value, and incompleteness wording is accepted. | unresolved |
| Derived analysis | Derived metrics, row coverage scoring, QA summaries, and internal decision-support use are permitted or explicitly blocked. | unresolved |
| Rate limits and fair use | Request limits, retry policy, outage handling, and fair-use posture are accepted. | unresolved |
| Commercial use constraints | Product, paid-use, redistribution, and global/Taiwan scope constraints are documented. | unresolved |
| Field contract readiness | Calendar/session, timezone, precision/rounding, missing-session behavior, and daily_prices mapping are accepted. | unresolved |
| Aggregate-only review | Future reports preserve sanitized aggregate output and exclude raw payload, row payload, stock id payload, and secrets. | unresolved |

No item is accepted by this gate.

## Execution Decision

This gate decides that no TWII execution is currently allowed.

PM must not proceed to:

- external TWII endpoint probe;
- TWII parser or fetcher implementation;
- source-derived TWII candidate generation;
- market-data fetch;
- ingestion;
- SQL;
- Supabase connection;
- Supabase write;
- staging row creation;
- `daily_prices` mutation;
- row coverage point award;
- `publicDataSource=supabase`;
- `scoreSource=real`.

## If TWII Source Rights Are Accepted Later

A later accepted outcome should open a separate named gate, not reuse this blocked gate as execution authority.

The next route after accepted TWII source rights should be:

1. TWII index field-contract decision gate.
2. TWII sanitized candidate artifact gate for the missing `60` rows.
3. TWII report-only or staging/write authorization gate with one exact command string.
4. Immediate post-run review and bounded aggregate readback.
5. Level 1 row coverage scoring gate update.

## If TWII Remains Blocked

If no TWII source lane can be accepted, PM should keep this gate blocked and route work to one of these local-only tasks:

1. A1 blocked-route alternative map comparing TWII, ETF, and deployment/runtime readiness routes.
2. A1 licensed-vendor / internal-approved-feed decision support, still no probing or source fetch.
3. A2 public copy patching for launch-blocking pages while data rights remain unresolved.
4. PM deployment readiness or runtime promotion readiness gates that do not require source-rights acceptance.

CEO preference: keep TWII as the next data route, but do not execute until the rights and field-contract evidence changes from unresolved to accepted.

## A1 / A2 Coordination

A1 may prepare TWII index field-contract decision support, but cannot accept source rights or produce candidates.

A2 may improve briefing or legal copy, but cannot publish real TWII source claims or imply TWII coverage is complete.

PM remains the only integration owner and must classify lane outputs as `accepted`, `rejected`, `needs_bounded_repair`, or `blocked` before they affect mainline routing.

## Hard Stop

This gate:

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
- does not approve field contract;
- does not give row coverage points;
- does not promote `publicDataSource=supabase`;
- does not set `scoreSource=real`.

## Verification

Use:

- `node scripts/check-twii-source-rights-outcome-gate.mjs`
- `cmd.exe /c npm run check:twii-source-rights-outcome-gate`

This checker intentionally reports status `blocked` when the gate is correct, because execution is blocked until external source-rights and field-contract evidence is accepted.
