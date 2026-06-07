# TWII Vendor/Internal Evidence Outcome Ledger

Status: `twii_vendor_internal_evidence_outcome_ledger_ready_pending_evidence`

Date: 2026-06-07

Owner: PM mainline

Support lane: A1 Data / Supabase / Market Evidence

## CEO Decision

CEO decision: `make_twii_vendor_internal_evidence_outcomes_recordable_without_execution`.

The current TWII source-rights route is blocked because source rights, field contract, and asset mapping remain unresolved. The A1 packet is fillable, but PM needs a no-secret outcome ledger so later vendor/internal evidence can be classified without reopening a broad governance loop.

Current route: `twii_vendor_internal_evidence_outcome_ledger`.

Current outcome: `pending_evidence_no_source_rights_acceptance`.

This ledger does not approve vendor terms, internal feed ownership, source rights, field contract, asset mapping, candidate generation, parser work, TWII probe execution, SQL, Supabase connection, Supabase write, staging row creation, `daily_prices` mutation, row coverage points, public source promotion, or real scoring.

## Ledger Data

Outcome data:

- `data/source-gates/twii-vendor-internal-evidence-outcomes.json`

Report command:

- `cmd.exe /c npm run report:twii-vendor-internal-evidence-outcome-ledger`

Record command:

- `cmd.exe /c npm run record:twii-vendor-internal-evidence-outcome -- --dry-run --id vendor-terms-evidence --classification blocked_external_vendor_or_internal_owner_pending --recordedBy PM --note "PM dry-run keeps TWII vendor/internal evidence blocked until safe evidence is filled."`

The recorder supports `--apply`, but only for no-secret classification updates to the local JSON ledger.

## Outcome IDs

| id | Lane | Default state | Purpose |
| --- | --- | --- | --- |
| `vendor-terms-evidence` | `licensed-market-data-vendor` | `pending` | Vendor terms, source-rights, redistribution, commercial/global use, and operational constraints. |
| `internal-feed-owner-evidence` | `internal-approved-feed` | `pending` | Internal owner, source lineage, access control, retention, rollback, audit, and refresh SLA. |
| `field-contract-evidence` | `shared-twii-field-contract` | `pending` | `trade_date`, `index_close`, optional OHLC/turnover, timezone, precision, revision, and missing-session rules. |
| `asset-mapping-evidence` | `shared-twii-asset-mapping` | `pending` | Safe TWII index asset mapping without stock id payload output. |

## Allowed Classifications

- `pending`
- `accepted_for_source_rights_outcome_gate_only`
- `rejected`
- `needs_bounded_repair`
- `blocked_external_vendor_or_internal_owner_pending`

Only `accepted_for_source_rights_outcome_gate_only` for all required items may route PM to a later TWII source-rights outcome gate. This ledger alone still does not authorize TWII candidate generation, write execution, row coverage points, runtime promotion, or public real-data claims.

## Safety Rules

The ledger may record safe conclusions, references, role labels, and bounded notes. It must not record:

- contract body text;
- account ids;
- pricing details;
- credentials;
- tokens;
- private URLs;
- source payloads;
- market-data rows;
- stock id payloads;
- endpoint responses;
- personal data.

## PM / A1 Routing

A1 route:

- Fill safe evidence outside this ledger first.
- Use the recorder only after evidence can be summarized without secrets or raw market data.
- Keep ETF fallback support available.

PM route:

- If all ledger items remain `pending`, continue Beta/platform-value work.
- If any item is `rejected` or `blocked_external_vendor_or_internal_owner_pending`, keep TWII execution blocked and route A1 to repair or fallback.
- If all required items are `accepted_for_source_rights_outcome_gate_only`, open a separate TWII source-rights outcome gate.

## Hard Stops

This ledger does not authorize:

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

Current runtime and score boundaries remain:

- `publicDataSource=mock`;
- `scoreSource=mock`.

## Verification

Focused verification:

- `cmd.exe /c npm run check:twii-vendor-internal-evidence-outcome-ledger`

Milestone integration:

- `cmd.exe /c npm run check:review-gates`
