# TW Equity Source-Rights Packet

Updated: 2026-06-06

Status: `tw_equity_source_rights_packet_ready_local_review_not_source_approved`.

Trigger: `docs/TW_EQUITY_REPORT_ONLY_DRY_RUN_PACKET.md`.

## Purpose

This packet defines the source-rights, attribution, retention, redistribution, and field-use boundary for the TW equity lane before any executable dry-run, TWSE fetch, market-data ingestion, staging-row creation, Supabase write, SQL execution, production `daily_prices` mutation, public source promotion, row coverage points, or `scoreSource=real` can be considered.

It covers only the TW equity lane symbols `2330`, `2382`, and `2308`.

## Current Decision

- Decision status: local review ready.
- Source approval status: not source approved.
- Provider terms status: external provider terms pending.
- Redistribution status: not approved.
- Retention status: not approved.
- Public attribution status: draft copy only.
- Runtime posture: `publicDataSource mock`.
- Score posture: `scoreSource mock`.
- Production `daily_prices` blocked.

This packet does not assert that TWSE or any other provider has approved use, redistribution, retention, public display, or derived scoring.

## Source Candidate Boundary

The current candidate family is TWSE STOCK_DAY design references. The packet may cite prior local design artifacts but must not convert them into execution approval:

- `docs/CP3_TWSE_STOCK_DAY_SOURCE_DEPTH_SMOKE_DESIGN_2026-05-29.md`.
- `docs/CP3_TWSE_STOCK_DAY_DRY_RUN_REPORTER_DESIGN_2026-05-29.md`.
- `docs/CP3_TWSE_STOCK_DAY_CONTROLLED_INGESTION_DESIGN_2026-05-29.md`.
- `docs/CP3_TWSE_STOCK_DAY_STAGING_BOUNDARY_DESIGN_2026-05-29.md`.
- `docs/CP3_TWSE_STOCK_DAY_STAGING_POST_MIGRATION_VALIDATION_ROLLBACK_PLAN_2026-05-29.md`.

The candidate source remains unpromoted until a later provider-specific terms review accepts:

- source identity;
- permitted use;
- attribution wording;
- redistribution limits;
- retention limits;
- rate limits;
- outage handling;
- delay and incompleteness wording;
- field coverage;
- public display scope;
- derived-score use limits.

## Field-Use Boundary

The TW equity lane may only plan for these fields:

- trade date.
- symbol.
- open.
- high.
- low.
- close.
- volume.
- source timestamp.
- source label.
- validation status.

Fields must remain source-attributed, delay-aware, and validation-gated. Missing fields must be counted. missing sessions must be counted, not filled.

## Public Copy Boundary

Any public copy derived from this lane must remain conservative until a later accepted source-approval packet exists:

- data may be delayed;
- data may be incomplete;
- source rights are under review;
- public runtime remains mock-only;
- no investment advice;
- no ranking;
- no recommendation;
- no model confidence;
- no performance claim;
- no professional indicator claim.

The public page may explain that real-data preparation is in progress, but it must not imply real-data availability or source approval.

## Retention And Redistribution Boundary

Before any stored source-derived row exists, a later accepted packet must define:

- retention window;
- retention owner;
- storage table posture;
- rollback owner;
- deletion / cleanup posture;
- redistribution allowance;
- public display allowance;
- internal-only allowance;
- audit evidence format.

Until then, retention status is not approved and redistribution status is not approved.

## Stop Lines

This packet does not approve:

- SQL.
- Supabase writes.
- staging rows.
- production `daily_prices` mutation.
- TWSE fetch.
- market-data ingestion.
- source-derived row storage.
- source payload commit.
- source payload printing.
- secret printing.
- public source promotion.
- `scoreSource=real`.
- row coverage points.
- investment advice, ranking, recommendation, model confidence, professional indicator claims, or performance claims.

## Acceptance Criteria

This packet can be accepted for local planning only when:

- the lane symbols are `2330`, `2382`, and `2308`;
- the source approval status remains not source approved;
- external provider terms remain pending;
- redistribution status remains not approved;
- retention status remains not approved;
- public attribution remains draft copy only;
- `publicDataSource mock` remains true;
- `scoreSource mock` remains true;
- production `daily_prices` remains blocked;
- the report-only dry-run packet remains the triggering packet;
- no execution permission is introduced.

## CEO Next Step

Next safe slice: prepare a local report-only runner design with sample output only. That runner design must consume this source-rights packet and the TW equity report-only dry-run packet, but still must not fetch, ingest, write, store source-derived rows, run SQL, promote public source, award row coverage points, or set `scoreSource=real`.
