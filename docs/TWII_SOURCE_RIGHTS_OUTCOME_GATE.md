# TWII Source-Rights Outcome Gate

Status: `twii_source_rights_outcome_gate_candidate_ready_for_pm_review`

Date: 2026-06-07

Owner: PM mainline

Support lane: A1 Data / Supabase / Market Evidence

## CEO Decision

CEO opens the TWII source-rights outcome gate candidate as the next PM mainline data route after D/A1 no-secret evidence was accepted into the exact and bridge ledgers.

This gate does not approve TWII source rights, probing, candidate generation, ingestion, staging, `daily_prices` mutation, row coverage scoring, public source promotion, or real scoring.

Current candidate outcome:

`candidate_ready_no_execution_authority`

The TWII route remains `not_approved_for_probe_or_ingestion`; this gate is ready for PM/CEO review only.

## PM Selected Route

PM selects TWII because Level 1 MVP row coverage remains `182/360`, TWII is `0/60`, and ETF remains blocked by `legal_and_redistribution_terms_unapproved`.

The selected first TWII source candidate remains `official-exchange-index`, but only for rights and field-contract review.

## Current Evidence

Current accepted local evidence:

- D/A1 exact evidence intake: `4/4` TWII slots accepted.
- TWII bridge ledger: `4/4` evidence outcomes accepted for a separate source-rights outcome gate only.
- Accepted slots: `vendor-terms-evidence`, `internal-feed-owner-evidence`, `field-contract-evidence`, `asset-mapping-evidence`.
- Level 1 MVP row coverage: `182/360`.
- Remaining Level 1 missing rows: `178`.
- TW equity sub-scope: `180/180`.
- TWII sub-scope: `0/60`.
- ETF sub-scope: `2/120`.
- ETF blocker: `legal_and_redistribution_terms_unapproved`.
- TWII selected first candidate: `official-exchange-index`.
- TWII selection status: `accepted_for_rights_and_field_contract_review_only`.
- TWII review state: `candidate_ready_no_execution_authority`.
- TWII fallback candidates: `licensed-market-data-vendor`, `internal-approved-feed`.
- Runtime boundary remains `publicDataSource=mock`.
- Score boundary remains `scoreSource=mock`.

Evidence anchors:

- `docs/A1_TWII_SOURCE_RIGHTS_AND_CANDIDATE_READINESS_PACKET.md`.
- `data/source-gates/a1-exact-source-rights-evidence-intake-outcomes.json`.
- `data/source-gates/twii-vendor-internal-evidence-outcomes.json`.
- `docs/TWII_SOURCE_RIGHTS_OUTCOME_GATE_BRIDGE.md`.
- `docs/reviews/TWII_SOURCE_SELECTION_ACCEPTANCE_GATE_2026-06-01.md`.
- `docs/reviews/TWII_SOURCE_RIGHTS_FIELD_CONTRACT_REVIEW_PACKET_2026-06-01.md`.
- `src/lib/twii-source-selection-packet.ts`.
- `docs/TW_EQUITY_ROW_COVERAGE_SCORING_GATE.md`.
- `docs/ETF_SOURCE_RIGHTS_OUTCOME_DECISION_GATE.md`.

## Narrow Decision Question

Can PM/CEO accept `official-exchange-index` as a source lane for internal storage and derived validation of TWII daily index values, under documented authority, access method, storage, retention, redistribution, attribution, derived analysis, rate limits, commercial use, and delayed/missing data wording?

Current answer:

`candidate_ready_for_pm_ceo_source_rights_review_only`

PM may review this outcome gate candidate, but PM must not create TWII candidates from source data until a later execution/candidate gate explicitly permits it.

## Required Acceptance Evidence

PM/CEO may later accept a TWII source lane only if the decision record names all of these items:

| Required item | Acceptance requirement | Current state |
| --- | --- | --- |
| Source authority | Official or licensed authority for TWII historical index values is documented. | accepted_for_candidate_review_only |
| Automated access permission | The exact future access method is permitted. | accepted_for_candidate_review_only |
| Internal storage | Internal storage of TWII source-derived values is permitted. | accepted_for_candidate_review_only |
| Retention and audit trail | Retention period, deletion duties, audit trail, cache limits, and rollback posture are documented. | accepted_for_candidate_review_only |
| Redistribution and display limits | Public display, export, API reuse, screenshots, cached values, and downstream-copy limits are documented. | accepted_for_candidate_review_only |
| Attribution wording | Source, delay, official-value, and incompleteness wording is accepted. | accepted_for_candidate_review_only |
| Derived analysis | Derived metrics, row coverage scoring, QA summaries, and internal decision-support use are permitted or explicitly blocked. | accepted_for_candidate_review_only |
| Rate limits and fair use | Request limits, retry policy, outage handling, and fair-use posture are accepted. | accepted_for_candidate_review_only |
| Commercial use constraints | Product, paid-use, redistribution, and global/Taiwan scope constraints are documented. | accepted_for_candidate_review_only |
| Field contract readiness | Calendar/session, timezone, precision/rounding, missing-session behavior, and daily_prices mapping are accepted. | accepted_for_candidate_review_only |
| Aggregate-only review | Future reports preserve sanitized aggregate output and exclude raw payload, row payload, stock id payload, and secrets. | accepted_for_candidate_review_only |

All items are accepted only for this candidate review. No item grants execution authority.

## Execution Decision

This gate decides that TWII source-rights review may proceed to the next local candidate-preparation step, but no TWII execution is currently allowed.

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

## Next Gate After Candidate Review

The next route after this candidate review should be:

1. TWII sanitized candidate artifact readiness gate for the missing `60` rows.
2. TWII report-only dry-run gate with sanitized aggregate output only.
3. TWII staging/write authorization gate with one exact command string.
4. Immediate post-run review and bounded aggregate readback.
5. Level 1 row coverage scoring gate update.

## If TWII Remains Blocked

If no TWII source lane can be accepted, PM should keep this gate blocked and route work to one of these local-only tasks:

1. A1 blocked-route alternative map comparing TWII, ETF, and deployment/runtime readiness routes.
2. A1 licensed-vendor / internal-approved-feed decision support, still no probing or source fetch.
3. A2 public copy patching for launch-blocking pages while data rights remain unresolved.
4. PM deployment readiness or runtime promotion readiness gates that do not require source-rights acceptance.

CEO preference: keep TWII as the next data route, but do not execute until the later candidate, dry-run, write authorization, readback, and coverage gates pass.

## A1 / A2 Coordination

A1 may prepare TWII sanitized candidate artifact readiness support, but cannot fetch source data or produce source-derived candidates.

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

This checker reports status `ok` when the gate is ready for PM/CEO candidate review while execution remains blocked.
