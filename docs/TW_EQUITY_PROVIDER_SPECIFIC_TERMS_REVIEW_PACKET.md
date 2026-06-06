# TW Equity Provider-Specific Terms Review Packet

Updated: 2026-06-06

Status: `tw_equity_provider_specific_terms_review_packet_ready_not_approved`.

Trigger: `docs/TW_EQUITY_SOURCE_APPROVAL_DECISION_PACKET.md`.

Related artifacts:

- `docs/TW_EQUITY_SOURCE_RIGHTS_PACKET.md`.
- `docs/TW_EQUITY_REPORT_ONLY_DRY_RUN_PACKET.md`.
- `docs/TW_EQUITY_LOCAL_REPORT_ONLY_RUNNER_DESIGN.md`.
- `docs/TW_EQUITY_LOCAL_REPORT_ONLY_RUNNER_IMPLEMENTATION_GATE.md`.
- `docs/reviews/TW_EQUITY_LOCAL_REPORT_ONLY_RUNNER_POST_RUN_REVIEW_2026-06-06.md`.
- `scripts/report-tw-equity-local-report-only-dry-run.mjs`.

## Purpose

This packet prepares the provider-specific terms review questions for the TW equity lane after CEO accepted Option A to enter source-approval review. It does not approve the source, provider terms, redistribution, retention, public display, derived-score use, SQL, Supabase execution, market-data ingestion, public source promotion, row coverage points, or `scoreSource=real`.

The packet is for local planning and human review only. It covers TW equity symbols `2330`, `2382`, and `2308`.

## Source Candidate Identity

- Candidate family: TWSE STOCK_DAY design references.
- Candidate lane: TW equity daily price preparation.
- Candidate symbols: `2330`, `2382`, and `2308`.
- Current execution posture: local report-only runner blocked until source approval.
- Current validation posture: `local_packet_consistency_only`.
- Current source approval status: `not_source_approved`.
- Current provider terms status: `external_provider_terms_pending`.
- Current runtime posture: `publicDataSource mock`.
- Current score posture: `scoreSource mock`.

This packet may cite local design artifacts, but it does not copy provider terms into the repo and does not assert provider approval.

## Terms Review Owner

- Primary owner: Legal / source-rights reviewer.
- Integration owner: PM.
- Final posture owner: CEO.
- Data support lane: A1.
- Runtime integration lane: mainline CEO/PM.

## Review Questions

### Permitted-Use Question

Can the candidate source be used for local planning, internal validation, public display, derived metrics, or production runtime? The review must classify each allowed use separately and keep unclassified uses blocked.

### Attribution Question

What attribution wording is required on public pages, internal diagnostics, generated reports, API responses, downloads, screenshots, and error/fallback states?

### Redistribution Question

Are raw values, transformed rows, derived metrics, screenshots, exports, cached responses, and downstream copies allowed to be redistributed? If any item is unclear, that item remains blocked.

### Retention Question

What retention window, deletion posture, audit trail, cache policy, and rollback owner are required before any source-derived row may be stored?

### Rate-Limit Question

What request rate, retry policy, scheduling window, and outage backoff are permitted if a later remote read is approved?

### Outage Handling Question

What should the product show when the provider is unavailable, partial, delayed, schema-changed, or missing expected fields?

### Delay And Incompleteness Question

What delay wording, freshness wording, partial-coverage wording, missing-session handling, and stale-state handling are required before public display?

### Public Display Question

Which fields may appear publicly, which must stay internal-only, and which require aggregation, delay, masking, attribution, or suppression?

### Derived-Score Use Question

Can source-derived values influence market signal scores, trend indicators, confidence copy, ranking, user-facing summaries, or decision-assist text? Any unclear answer keeps `scoreSource=mock`.

## Required Classification Output

The human review should classify each item as one of:

- `accepted_for_local_planning_only`;
- `accepted_for_internal_only`;
- `accepted_for_delayed_public_display`;
- `accepted_for_derived_metrics_only`;
- `rejected`;
- `unknown_keep_blocked`.

The review must not classify the source as globally approved. A later source approval packet is required before promotion.

## No-Execution Stop Lines

This packet does not approve:

- source use;
- provider terms;
- source license;
- redistribution;
- retention;
- public display;
- derived-score use;
- SQL;
- Supabase connection;
- Supabase reads;
- Supabase writes;
- staging rows;
- production `daily_prices` mutation;
- TWSE source retrieval;
- market-data ingestion;
- source-derived row storage;
- source payload commit;
- source payload printing;
- secret printing;
- public source promotion;
- row coverage points;
- `scoreSource=real`;
- investment advice, ranking, recommendation, model confidence, professional indicator claims, or performance claims.

## Acceptance Criteria

This packet is ready for review when:

- the trigger remains `docs/TW_EQUITY_SOURCE_APPROVAL_DECISION_PACKET.md`;
- the symbols remain `2330`, `2382`, and `2308`;
- the source approval status remains `not_source_approved`;
- provider terms remain `external_provider_terms_pending`;
- public runtime remains `publicDataSource mock`;
- score runtime remains `scoreSource mock`;
- all required review questions are present;
- classification output remains bounded;
- stop lines keep SQL, Supabase, market-data retrieval, ingestion, storage, public source promotion, row coverage points, and `scoreSource=real` blocked.

## CEO Recommendation

CEO recommends using this packet as the next human review input. After review, record only a local accepted or rejected planning outcome. Do not promote the runtime, do not fetch market data, do not run SQL, do not connect to Supabase, and do not set `scoreSource=real`.

## Next Step

After this packet passes local checks, the next safe slice is a TW equity provider-specific terms review role review or outcome ledger entry, still local-only and still not source approved.
