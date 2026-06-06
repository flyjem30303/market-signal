# TW Equity Source-Approval Decision Packet

Updated: 2026-06-06

Status: `tw_equity_source_approval_decision_packet_ready_for_review_not_approved`.

Trigger: `docs/reviews/TW_EQUITY_LOCAL_REPORT_ONLY_RUNNER_POST_RUN_REVIEW_2026-06-06.md`.

Related artifacts:

- `docs/TW_EQUITY_SOURCE_RIGHTS_PACKET.md`.
- `docs/TW_EQUITY_REPORT_ONLY_DRY_RUN_PACKET.md`.
- `docs/TW_EQUITY_LOCAL_REPORT_ONLY_RUNNER_DESIGN.md`.
- `docs/TW_EQUITY_LOCAL_REPORT_ONLY_RUNNER_IMPLEMENTATION_GATE.md`.
- `scripts/report-tw-equity-local-report-only-dry-run.mjs`.
- `scripts/check-tw-equity-local-report-only-runner.mjs`.

## Purpose

This packet prepares the decision to enter source-approval review for the TW equity lane. It does not approve the source.

The packet is for CEO/chairman review of whether to spend attention on provider terms, attribution, redistribution, retention, public display, and derived-score limits for TW equity symbols `2330`, `2382`, and `2308`.

## Current Evidence

- Local source-rights packet exists.
- Local report-only dry-run packet exists.
- Local runner implementation gate exists.
- Local stdout-only runner exists.
- Local post-run review is accepted for local evidence only.
- Latest local runner status is `blocked_until_source_approval`.
- Latest local runner validation status is `local_packet_consistency_only`.
- Source-rights status remains `not_source_approved`.
- Provider terms status remains `external_provider_terms_pending`.
- Redistribution status remains `not_approved`.
- Retention status remains `not_approved`.
- Public runtime remains `publicDataSource mock`.
- Score runtime remains `scoreSource mock`.

## Decision Options

### Option A: Enter Source-Approval Review

Recommended.

This option allows A1/PM to prepare provider-specific terms review material for TW equity without fetching, ingesting, storing, or publishing source-derived rows.

Allowed under Option A:

- identify provider terms that must be reviewed;
- draft attribution wording;
- map redistribution limits;
- map retention limits;
- map rate limits;
- map outage handling;
- map delay and incompleteness wording;
- map public display scope;
- map derived-score use limits;
- prepare a later source-approval review packet.

Still blocked under Option A:

- SQL;
- Supabase connection;
- Supabase writes;
- staging rows;
- production `daily_prices` mutation;
- TWSE source retrieval;
- market-data ingestion;
- source-derived row storage;
- public source promotion;
- row coverage points;
- `scoreSource=real`.

### Option B: Keep Source Approval Deferred

This option keeps all TW equity real-data source work deferred and leaves the current local runner as blocked evidence only.

Allowed under Option B:

- keep mock MVP posture;
- continue public blocked-state copy;
- keep local packet consistency checks.

Blocked under Option B:

- provider terms review;
- source approval review;
- real-data route planning beyond current local packet evidence.

### Option C: Reject TW Equity Source Lane For Now

This option rejects the current TW equity source lane and requires a new data-source candidate before further work.

Allowed under Option C:

- create a replacement source-candidate worklist;
- keep current artifacts as historical local evidence.

Blocked under Option C:

- TW equity source approval review;
- runner promotion;
- source promotion.

## CEO Recommendation

CEO recommends Option A: enter source-approval review.

Reason: the local runner and post-run review are now safely bounded, so the next bottleneck is not engineering mechanics. The bottleneck is whether source terms, attribution, retention, redistribution, public display, and derived-score use can be reviewed without creating legal or product risk.

## Acceptance Criteria For Option A

If accepted, the next slice may create a TW equity provider-specific terms review packet. That next packet must remain local-only and must not fetch, ingest, store, or publish market data.

Required next packet fields:

- source candidate identity;
- terms review owner;
- permitted-use question;
- attribution question;
- redistribution question;
- retention question;
- rate-limit question;
- outage handling question;
- delay and incompleteness question;
- public display question;
- derived-score use question;
- no-execution stop lines.

## Stop Lines

This packet does not approve:

- source use;
- provider terms;
- redistribution;
- retention;
- public display;
- derived-score use;
- SQL;
- Supabase connection;
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

## Next Step

If Option A is accepted, prepare the TW equity provider-specific terms review packet as local-only review material.
