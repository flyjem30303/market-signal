# TWII Source-Rights Outcome Gate Bridge

Status: `twii_source_rights_outcome_gate_bridge_ready_evidence_pending`

Date: 2026-06-07

CEO decision: `bridge_twii_vendor_internal_evidence_ledger_to_source_rights_outcome_gate_without_execution`.

PM route: `twii_vendor_internal_evidence_outcome_to_source_rights_outcome_gate`.

Current outcome: `blocked_waiting_twii_vendor_internal_evidence`.

This bridge connects the accepted TWII vendor/internal evidence outcome ledger to the next source-rights outcome gate. It exists so PM can tell, with one local report, whether A1 evidence is strong enough to open the next review gate or whether mainline should continue Beta/platform work while external evidence remains pending.

The bridge is intentionally non-executable. It does not approve source rights, field contract, asset mapping, candidate artifact generation, TWII probe execution, SQL, Supabase access, staging rows, `daily_prices` mutation, row coverage points, public source promotion, or real score promotion.

Runtime boundary remains `publicDataSource=mock` and `scoreSource=mock` while this bridge is blocked or ready-for-review-only.

## Input

- Ledger: `data/source-gates/twii-vendor-internal-evidence-outcomes.json`
- Ledger report: `cmd.exe /c npm run report:twii-vendor-internal-evidence-outcome-ledger`
- Ledger checker: `cmd.exe /c npm run check:twii-vendor-internal-evidence-outcome-ledger`

Required ledger decisions before this bridge can open the next gate:

| Evidence item | Required state |
| --- | --- |
| `vendor-terms-evidence` | `accepted_for_source_rights_outcome_gate_only` |
| `internal-feed-owner-evidence` | `accepted_for_source_rights_outcome_gate_only` |
| `field-contract-evidence` | `accepted_for_source_rights_outcome_gate_only` |
| `asset-mapping-evidence` | `accepted_for_source_rights_outcome_gate_only` |

If any item is `pending`, `rejected`, `needs_bounded_repair`, or `blocked_external_vendor_or_internal_owner_pending`, the next source-rights outcome gate stays closed.

## Bridge Output

Command:

- `cmd.exe /c npm run report:twii-source-rights-outcome-gate-bridge`

Expected current report state:

- `status`: `blocked_waiting_twii_vendor_internal_evidence`
- `canOpenTwiiSourceRightsOutcomeGate`: `false`
- `runtimeBoundary.publicDataSource`: `mock`
- `runtimeBoundary.scoreSource`: `mock`
- `nextPMAction`: `Keep TWII source-rights gate closed; assign A1 to evidence collection/classification or continue Beta platform work.`

Future accepted report state, only if all four required ledger items are accepted:

- `status`: `ready_for_twii_source_rights_outcome_gate_only`
- `canOpenTwiiSourceRightsOutcomeGate`: `true`
- `nextPMAction`: `Open a separate TWII source-rights outcome gate; do not execute candidate generation or Supabase work from this bridge.`

## Role Assignments

PM mainline:

- Use this bridge report before deciding whether TWII can move from evidence collection to source-rights outcome review.
- If the bridge remains blocked, keep runtime/Beta promotion work moving and avoid repeated manual interpretation of the same pending evidence.
- If the bridge becomes ready, create or run the separate TWII source-rights outcome gate only after verifying the report and ledger checker.

A1 Data / Supabase / Market Evidence:

- Fill or classify safe evidence in the ledger using `record:twii-vendor-internal-evidence-outcome`.
- Do not include secrets, raw payloads, row payloads, stock id payloads, SQL snippets, Supabase URLs, or market-data source rows in notes.
- If an item is not safely accepted, classify it as `rejected`, `needs_bounded_repair`, or `blocked_external_vendor_or_internal_owner_pending`.

A2 Runtime / Launch Trust:

- Keep public copy aligned to partial coverage and mock/mock runtime state while the bridge is blocked.
- Do not add public copy that implies complete TWII coverage, official source approval, production source promotion, or real score readiness.

## Hard Stops

This bridge does not authorize:

- SQL execution;
- Supabase connection;
- Supabase read;
- Supabase write;
- staging row creation;
- `daily_prices` mutation;
- market-data fetch;
- market-data ingestion;
- raw market-data storage;
- raw market-data commit;
- raw payload output;
- row payload output;
- stock id payload output;
- secret output;
- source-rights approval;
- field-contract approval;
- asset-mapping approval;
- TWII candidate generation;
- TWII probe execution;
- row coverage points;
- public source promotion;
- `publicDataSource=supabase`;
- `scoreSource=real`;
- public launch claim.

## Verification

- `cmd.exe /c npm run check:twii-source-rights-outcome-gate-bridge`
- `cmd.exe /c npm run check:twii-vendor-internal-evidence-outcome-ledger`
- `cmd.exe /c npm run check:review-gates`
- `git diff --check`
