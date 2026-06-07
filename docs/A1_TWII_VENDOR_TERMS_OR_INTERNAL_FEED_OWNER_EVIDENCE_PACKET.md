# A1 TWII Vendor Terms Or Internal Feed Owner Evidence Packet

Status: `a1_twii_vendor_terms_or_internal_feed_owner_evidence_packet_ready_not_filled`

Date: 2026-06-07

Owner: A1 Data / Supabase / Market Evidence

Integration owner: PM mainline

## CEO Decision

CEO decision: `prepare_twii_vendor_internal_feed_evidence_packet_after_official_lane_block`.

The official TWII lane remains blocked by unresolved source rights, field contract, and asset mapping. A1 should now prepare a fillable no-secret evidence packet for the two fallback lanes: `licensed-market-data-vendor` and `internal-approved-feed`.

Current route: `twii_vendor_terms_or_internal_feed_owner_evidence_packet`.

Current outcome: `fillable_vendor_internal_evidence_ready_not_filled`.

This packet does not approve vendor terms, internal feed ownership, source rights, executable source-lane selection, candidate generation, parser work, TWII probe execution, ETF fetch, SQL, Supabase connection, Supabase write, staging row creation, `daily_prices` mutation, row coverage points, public source promotion, or real scoring.

## Current Baseline

Accepted local evidence:

- Level 1 MVP coverage remains `182/360`.
- TW equity first closed loop remains accepted at `180/180`.
- TWII remains `0/60`, missing `60` rows.
- ETF remains `2/120`, missing `118` rows.
- Official TWII lane remains `blocked_external_evidence_pending`.
- Vendor fallback lane is `selected_for_A1_terms_evidence_intake`.
- Internal feed fallback lane is `selected_for_A1_owner_evidence_intake`.
- ETF fallback lane remains `kept_as_parallel_backup_data_lane`.
- Runtime remains `publicDataSource=mock`.
- Score remains `scoreSource=mock`.

Evidence anchors:

- `docs/TWII_VENDOR_INTERNAL_OR_ETF_FALLBACK_SELECTION.md`
- `docs/TWII_SOURCE_RIGHTS_FIELD_CONTRACT_ACCEPTANCE_OR_BLOCKED_RECORD.md`
- `docs/A1_TWII_OFFICIAL_SOURCE_INTAKE_FIELDS_OR_VENDOR_TERMS_REVIEW_PACKET.md`
- `docs/A1_TWII_SOURCE_RIGHTS_EVIDENCE_INTAKE_OR_VENDOR_FALLBACK_DECISION_SUPPORT.md`
- `docs/ETF_SOURCE_RIGHTS_OUTCOME_DECISION_GATE.md`

## Vendor Terms Evidence Fields

Fill these fields only with safe non-secret conclusions, references, or internal owner labels. Do not paste contract text, account details, pricing details, credentials, source payloads, market-data rows, endpoint responses, or personal data into this repo.

| Field id | Field | Fill state | Required safe value |
| --- | --- | --- | --- |
| `VENDOR-TWII-001` | Vendor label | `TBD_VENDOR_LABEL_ONLY` | Safe vendor label or internal procurement reference, no account or contract secret. |
| `VENDOR-TWII-002` | Contract scope | `TBD_ACCEPTED_REJECTED_OR_BLOCKED` | TWII index scope, history window, refresh rights, geography, and commercial use constraints. |
| `VENDOR-TWII-003` | Internal storage | `TBD_ACCEPTED_REJECTED_OR_BLOCKED` | Storage, retention, deletion, cache, rollback, and audit posture. |
| `VENDOR-TWII-004` | Derived analysis | `TBD_ACCEPTED_REJECTED_OR_BLOCKED` | QA summaries, derived metrics, decision support, and row coverage scoring rights. |
| `VENDOR-TWII-005` | Public display | `TBD_ACCEPTED_REJECTED_OR_BLOCKED` | Display, screenshots, export, API reuse, redistribution, delay, and attribution limits. |
| `VENDOR-TWII-006` | Operational SLA | `TBD_SAFE_NON_SECRET_REFERENCE` | Refresh SLA, outage handling, retry limits, support route, and termination posture. |
| `VENDOR-TWII-007` | Field contract | `TBD_ACCEPTED_REJECTED_OR_BLOCKED` | `trade_date`, `index_close`, optional OHLC/turnover, timezone, precision, revision, and missing-session rules. |
| `VENDOR-TWII-008` | Asset mapping | `TBD_ACCEPTED_REJECTED_OR_BLOCKED` | Safe TWII index asset mapping without stock id payload exposure. |
| `VENDOR-TWII-009` | Cost/governance owner | `TBD_OWNER_LABEL_ONLY` | Internal owner role for cost, renewals, compliance, and incident escalation. |
| `VENDOR-TWII-010` | Aggregate-only review | `TBD_ACCEPTED_REJECTED_OR_BLOCKED` | Future reports exclude raw payload, row payload, stock id payload, response body, and secrets. |

Vendor evidence status:

`not_filled_vendor_twii_terms_pending`

## Internal Feed Owner Evidence Fields

Use this section only if an internal approved feed can certify rights and operational ownership.

| Field id | Field | Fill state | Required safe value |
| --- | --- | --- | --- |
| `INTERNAL-TWII-001` | Feed owner | `TBD_OWNER_LABEL_ONLY` | Internal role/team owner, no personal secret or credential. |
| `INTERNAL-TWII-002` | Source lineage | `TBD_ACCEPTED_REJECTED_OR_BLOCKED` | Source lineage, original provider constraints, and rights basis. |
| `INTERNAL-TWII-003` | Refresh SLA | `TBD_ACCEPTED_REJECTED_OR_BLOCKED` | Refresh frequency, stale-data handling, outage behavior, and recovery owner. |
| `INTERNAL-TWII-004` | Access control | `TBD_ACCEPTED_REJECTED_OR_BLOCKED` | Read/write/operator access, audit trail, and approval path. |
| `INTERNAL-TWII-005` | Retention and rollback | `TBD_ACCEPTED_REJECTED_OR_BLOCKED` | Retention, deletion, rollback, correction, and historical replay posture. |
| `INTERNAL-TWII-006` | Public display limits | `TBD_ACCEPTED_REJECTED_OR_BLOCKED` | Public copy, attribution, delay, redistribution, screenshot, export, and API reuse constraints. |
| `INTERNAL-TWII-007` | Field contract | `TBD_ACCEPTED_REJECTED_OR_BLOCKED` | Daily index field mapping, timezone, precision, revision, and missing-session behavior. |
| `INTERNAL-TWII-008` | Asset mapping | `TBD_ACCEPTED_REJECTED_OR_BLOCKED` | Safe TWII index asset mapping without exposing stock id payload. |
| `INTERNAL-TWII-009` | Aggregate-only review | `TBD_ACCEPTED_REJECTED_OR_BLOCKED` | Future review output stays sanitized and aggregate-only. |

Internal feed evidence status:

`not_filled_internal_twii_feed_owner_pending`

## PM Classification Rule

PM may classify a filled packet as:

- `accepted_for_twii_source_rights_outcome_gate_only`;
- `rejected_vendor_lane_switch_to_internal_feed_review`;
- `rejected_internal_feed_lane_switch_to_vendor_or_etf`;
- `blocked_external_vendor_or_internal_owner_pending`;
- `needs_bounded_repair`.

Only `accepted_for_twii_source_rights_outcome_gate_only` may open a later source-rights outcome gate. That later gate still must separately handle field contract, asset mapping, candidate artifact, rollback, post-run review, readback, and row coverage scoring before any real execution or promotion.

## A1 / PM / A2 Routing

A1 route:

- Fill safe vendor/internal evidence when external reviewers provide it.
- If no evidence is available, keep `blocked_external_vendor_or_internal_owner_pending`.
- Keep ETF source-rights fallback support available.

PM route:

- Continue launch/runtime engineering while this packet is not filled.
- Do not spend engineering effort on parser/runtime/Supabase execution from this packet.

A2 route:

- Keep user-facing copy in mock/partial-coverage language.
- Do not imply vendor/internal feed acceptance.

## Hard Stops

This packet does not authorize:

- SQL execution;
- Supabase connection;
- Supabase write;
- staging row creation;
- `daily_prices` mutation;
- TWII probe execution;
- ETF fetch or ingestion;
- source-derived candidate generation;
- parser implementation;
- raw market-data fetch, ingest, storage, or commit;
- raw payload, row payload, stock id payload, or secret output;
- source-rights approval;
- field-contract approval;
- asset-mapping approval;
- row coverage points;
- `publicDataSource=supabase`;
- `scoreSource=real`;
- public launch completion claim.

## Next Route

If this packet is filled and accepted later:

`twii_source_rights_outcome_gate_after_vendor_or_internal_evidence_acceptance`

If this packet remains unfilled:

`continue_executable_packet_candidate_after_platform_project_and_beta_url`

If both TWII and ETF data lanes remain blocked:

`launch_runtime_mainline_until_external_source_rights_change`

## Verification

Focused verification:

- `node scripts/check-a1-twii-vendor-terms-or-internal-feed-owner-evidence-packet.mjs`
- `cmd.exe /c npm run check:a1-twii-vendor-terms-or-internal-feed-owner-evidence-packet`
- `cmd.exe /c npm run check:twii-vendor-internal-or-etf-fallback-selection`
- `cmd.exe /c npm run check:a1-twii-official-source-intake-fields-or-vendor-terms-review-packet`

Milestone integration:

- `cmd.exe /c npm run check:review-gates`
