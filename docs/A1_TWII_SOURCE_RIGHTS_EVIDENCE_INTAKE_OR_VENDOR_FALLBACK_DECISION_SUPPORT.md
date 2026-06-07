# A1 TWII Source-Rights Evidence Intake Or Vendor Fallback Decision Support

Status: `a1_twii_source_rights_evidence_intake_or_vendor_fallback_decision_support_ready_local_only_not_executable`

Date: 2026-06-07

Owner: A1 Data / Supabase / Market Evidence

Integration owner: PM mainline

## CEO Decision

CEO keeps TWII as the priority 1 source-rights unblock lane, but PM should not over-invest in the official source if its terms remain ambiguous.

Decision route: `twii_source_rights_evidence_intake_or_vendor_fallback_decision_support`.

Current outcome: `official_lane_intake_ready_fallback_route_prepared_rights_still_blocked`.

This packet is local-only decision support. It prepares a no-secret evidence intake form for `official-exchange-index` and a fallback comparison for `licensed-market-data-vendor` and `internal-approved-feed`. It does not approve source rights, select an executable source lane, implement a parser, probe an endpoint, fetch market data, run SQL, connect to Supabase, create staging rows, mutate `daily_prices`, award row coverage points, promote public data source, or set real scoring.

## Current Baseline

Accepted local evidence:

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

- `docs/A1_TWII_SOURCE_RIGHTS_UNBLOCK_DECISION_RECORD_CANDIDATE.md`.
- `docs/A1_TWII_SOURCE_RIGHTS_AND_CANDIDATE_READINESS_PACKET.md`.
- `docs/TWII_SOURCE_RIGHTS_OUTCOME_GATE.md`.
- `docs/A1_TWII_INDEX_FIELD_CONTRACT_DECISION_SUPPORT.md`.
- `docs/reviews/TWII_SOURCE_SELECTION_ACCEPTANCE_GATE_2026-06-01.md`.
- `docs/reviews/TWII_SOURCE_RIGHTS_FIELD_CONTRACT_REVIEW_PACKET_2026-06-01.md`.
- `src/lib/twii-source-selection-packet.ts`.

## Official Source Evidence Intake

PM may continue the official route only if the evidence intake can be completed without secrets, raw market data, raw payloads, row payloads, stock id payloads, or source response bodies.

| Intake field | Required safe evidence | Current state |
| --- | --- | --- |
| Source authority | Named official or licensed authority for TWII historical index values. | `unresolved` |
| Access method | Terms allow the exact future access method, including automation and retry posture. | `unresolved` |
| Historical coverage | Source can cover the required `60` Taiwan market sessions or clearly identify unavailable sessions. | `unresolved` |
| Field meaning | Official daily `index_close` meaning and optional OHLC/turnover meanings are documented. | `unresolved` |
| Calendar basis | Taiwan trading calendar, holidays, closures, missing-session, and source-gap rules are documented. | `unresolved` |
| Storage rights | Internal storage and audit retention of TWII source-derived values are permitted. | `unresolved` |
| Retention limits | Retention, deletion, cache, rollback, and audit limits are documented. | `unresolved` |
| Redistribution limits | Public display, screenshots, export, API reuse, cached values, and downstream-copy limits are documented. | `unresolved` |
| Attribution wording | Source, delay, official-value, incompleteness, and source-gap wording are documented. | `unresolved` |
| Derived use | Internal QA, decision support, derived metrics, and row coverage scoring are permitted or explicitly blocked. | `unresolved` |
| Commercial/global use | Product, paid-use, Taiwan user, global user, and redistribution constraints are documented. | `unresolved` |
| Aggregate-only review | Future review output remains aggregate-only and excludes raw values and source response bodies. | `unresolved` |

Official route classification:

`blocked_official_source_evidence_pending`

## Fallback Comparison

PM should switch from official-source intake to fallback decision support if the official lane stays unresolved after the intake packet is reviewed or if any hard rejection appears.

| Source lane | Advantage | Required acceptance evidence | Current decision |
| --- | --- | --- | --- |
| `official-exchange-index` | Best authority and field lineage if terms permit storage and derived use. | Terms, storage, attribution, redistribution, automation, retention, and field contract. | `blocked_official_source_evidence_pending` |
| `licensed-market-data-vendor` | Best contractual clarity if the vendor license includes storage, derived analysis, public display, redistribution, audit, and Taiwan/global product use. | Contract scope, symbols, history window, derived-score use, public display, redistribution, API reuse, SLA, cost, audit, and termination rights. | `fallback_candidate_ready_for_vendor_terms_review` |
| `internal-approved-feed` | Fastest operational route if an internal owner can certify lineage, rights, refresh SLA, access control, retention, rollback, and audit trail. | Owner, source lineage, rights basis, freshness SLA, access control, data retention, rollback plan, audit trail, and downstream display constraints. | `fallback_candidate_ready_for_internal_owner_review` |

Fallback trigger:

`official_lane_rejected_or_unresolved_after_evidence_intake`

## PM Routing Rule

PM may classify the next source-rights move as:

- `continue_official_intake`;
- `switch_to_licensed_vendor_terms_review`;
- `switch_to_internal_feed_owner_review`;
- `keep_twii_blocked_and_move_to_etf_or_launch_ops`;
- `needs_bounded_repair`.

Recommended route now:

`continue_official_intake_with_fallback_ready`.

If official-source evidence remains ambiguous, CEO recommends switching to `licensed-market-data-vendor` before spending more engineering effort on parser/runtime work.

## A1 / A2 Assignment Update

A1 next assignment:

`twii_official_source_intake_fields_or_vendor_terms_review_packet`.

A1 should prepare a fillable no-secret intake packet for the official route and a short vendor/internal-feed terms review map. A1 must not fetch, probe, ingest, store, print, or commit raw market data.

A2 next assignment:

`source_rights_pending_public_language_guardrail`.

A2 may keep public copy aligned with source-rights pending status, partial coverage, mock runtime, data gaps, and non-investment-advice wording. A2 must not imply TWII real data is live.

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

The next route is `twii_official_source_intake_fields_or_vendor_terms_review_packet`.

This route should produce a fillable no-secret packet, not an execution gate. If the official intake cannot produce accept/reject evidence, PM should switch to vendor/internal owner terms review before any parser, runtime, Supabase, or scoring work.

## Verification

Focused verification:

- `node scripts/check-a1-twii-source-rights-evidence-intake-or-vendor-fallback-decision-support.mjs`
- `cmd.exe /c npm run check:a1-twii-source-rights-evidence-intake-or-vendor-fallback-decision-support`
- `cmd.exe /c npm run check:a1-twii-source-rights-unblock-decision-record-candidate`
- `cmd.exe /c npm run check:twii-source-rights-outcome-gate`
- `node scripts/check-review-gates.mjs`
