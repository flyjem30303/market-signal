# A1 TWII Source-Rights Unblock Decision Record Candidate

Status: `a1_twii_source_rights_unblock_decision_record_candidate_ready_local_only_not_approved`

Date: 2026-06-07

Owner: A1 Data / Supabase / Market Evidence

Integration owner: PM mainline

## CEO Decision

CEO keeps TWII as the priority 1 data-coverage unblock lane after the source-rights priority packet.

Decision route: `twii_source_rights_unblock_decision_record_candidate`.

Current outcome: `decision_record_candidate_ready_rights_still_blocked`.

This record is a no-secret decision candidate. It gives PM and CEO a single place to classify TWII source-rights evidence as `accepted`, `rejected`, `needs_bounded_repair`, or `blocked`, but it does not approve source rights, field contract, candidate generation, endpoint probing, parser work, SQL, Supabase access, staging rows, `daily_prices` mutation, row coverage points, public source promotion, or real scoring.

## Current Baseline

Accepted local evidence:

- Level 1 MVP coverage: `182/360`.
- Missing rows: `178`.
- TW equity sub-scope: `180/180`.
- TWII sub-scope: `0/60`, missing `60`.
- ETF sub-scope: `2/120`, missing `118`.
- TWII first source candidate: `official-exchange-index`.
- TWII fallback candidates: `licensed-market-data-vendor`, `internal-approved-feed`.
- TWII selection status: `accepted_for_rights_and_field_contract_review_only`.
- TWII review state: `not_approved_for_probe_or_ingestion`.
- Runtime remains `publicDataSource=mock`.
- Score remains `scoreSource=mock`.

This candidate is grounded in:

- `docs/A1_SOURCE_RIGHTS_UNBLOCK_PRIORITY_PACKET.md`.
- `docs/A1_TWII_SOURCE_RIGHTS_AND_CANDIDATE_READINESS_PACKET.md`.
- `docs/TWII_SOURCE_RIGHTS_OUTCOME_GATE.md`.
- `docs/A1_TWII_INDEX_FIELD_CONTRACT_DECISION_SUPPORT.md`.
- `docs/reviews/TWII_SOURCE_SELECTION_ACCEPTANCE_GATE_2026-06-01.md`.
- `docs/reviews/TWII_SOURCE_RIGHTS_FIELD_CONTRACT_REVIEW_PACKET_2026-06-01.md`.
- `src/lib/twii-source-selection-packet.ts`.

## Decision Record Candidate

PM should treat every item as unresolved until a later accepted review updates it.

| Decision item | Candidate classification | Required safe evidence before acceptance | Current decision |
| --- | --- | --- | --- |
| Source authority | `blocked` | Official or licensed authority for TWII historical index values is documented. | `unresolved` |
| Future access method | `blocked` | The exact future access method is allowed by source terms or license. | `unresolved` |
| Internal storage | `blocked` | Internal storage of TWII source-derived values is permitted. | `unresolved` |
| Retention and deletion | `blocked` | Retention period, deletion duties, cache limits, rollback, and audit trail are documented. | `unresolved` |
| Redistribution limits | `blocked` | Public display, export, API reuse, screenshots, cached values, and downstream-copy limits are documented. | `unresolved` |
| Attribution wording | `blocked` | Required source, delay, official-value, incomplete-data, and source-gap wording is accepted. | `unresolved` |
| Derived analysis use | `blocked` | Derived metrics, QA summaries, row coverage scoring, and internal decision-support use are allowed or explicitly blocked. | `unresolved` |
| Rate limits and fair use | `blocked` | Request limit, retry policy, outage behavior, and fair-use posture are accepted. | `unresolved` |
| Commercial and global use | `blocked` | Product, paid-use, Taiwan/global user, redistribution, and vendor restrictions are documented. | `unresolved` |
| Field-contract basis | `blocked` | `trade_date`, `index_close`, optional OHLC/turnover, calendar, timezone, precision, rounding, revisions, and missing-session behavior are accepted. | `unresolved` |
| Aggregate-only review | `blocked` | Future reports exclude raw payload, row payload, stock id payload, source response body, and secrets. | `unresolved` |

Current record decision:

`rejected_for_execution_pending_source_rights_decision_record_acceptance`

Current source-rights state:

`not_approved_for_probe_or_ingestion`

## Acceptance Threshold

The TWII source lane may move to a later accepted source-rights outcome only if PM/CEO can record all of these without secrets or raw market data:

1. accepted source authority;
2. accepted future access method;
3. accepted storage and retention posture;
4. accepted redistribution and display limits;
5. accepted attribution and missing/delayed wording;
6. accepted or explicitly blocked derived analysis and row coverage scoring use;
7. accepted rate-limit, retry, outage, and fair-use posture;
8. accepted commercial and global-use constraints;
9. accepted field-contract basis for `TWII` index daily coverage;
10. accepted aggregate-only output policy.

If any item remains unresolved, this decision record remains blocked and cannot authorize a probe, candidate, write, readback, scoring, or promotion step.

## PM Classification Rule

PM may classify a future update to this record as:

- `accepted_for_source_rights_outcome_gate_only`;
- `rejected_for_execution_pending_source_rights`;
- `needs_bounded_repair`;
- `blocked_external_rights_pending`.

Only `accepted_for_source_rights_outcome_gate_only` may open the next separate gate:

`twii_index_field_contract_acceptance_or_sanitized_candidate_artifact_gate`.

Even then, the next gate is not execution by itself.

## A1 / A2 Assignment Update

A1 next assignment:

`twii_source_rights_evidence_intake_or_vendor_fallback_decision_support`.

A1 should prepare either safe evidence intake fields for `official-exchange-index` or a fallback comparison for `licensed-market-data-vendor` and `internal-approved-feed`. A1 must not fetch, probe, ingest, store, print, or commit raw market data.

A2 next assignment:

`twii_rights_pending_public_copy_guardrail`.

A2 may prepare wording for source-rights-pending public disclosure only after PM accepts the boundary. A2 must not imply TWII coverage is complete or official real data is public.

## Hard Stops

This decision record candidate does not authorize:

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
- field-contract approval;
- row coverage points;
- public source promotion;
- `publicDataSource=supabase`;
- real score promotion;
- `scoreSource=real`;
- investment advice claim;
- public launch completion claim.

## Next Route

The next route is `twii_source_rights_evidence_intake_or_vendor_fallback_decision_support`.

PM should continue with `official-exchange-index` only if a safe no-secret evidence intake can be prepared. If the official lane remains too ambiguous, PM should move A1 to a licensed-vendor/internal-feed fallback comparison before any runtime or Supabase execution work.

## Verification

Focused verification:

- `node scripts/check-a1-twii-source-rights-unblock-decision-record-candidate.mjs`
- `cmd.exe /c npm run check:a1-twii-source-rights-unblock-decision-record-candidate`
- `cmd.exe /c npm run check:a1-source-rights-unblock-priority-packet`
- `cmd.exe /c npm run check:twii-source-rights-outcome-gate`
- `node scripts/check-review-gates.mjs`
