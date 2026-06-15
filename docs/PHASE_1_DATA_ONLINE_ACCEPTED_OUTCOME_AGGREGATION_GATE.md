# Phase 1 Data Online Accepted Outcome Aggregation Gate

Status: `phase_1_data_online_accepted_outcome_aggregation_gate_ready_no_go`

Owner: CEO/PM

Purpose: aggregate the local A1/A2 outcome ledger into a deterministic PM route. This gate tells PM whether the project can open a separate authorization gate, must return a lane to repair, or must keep Phase 1 data-online as `NO_GO`.

## Current Decision

Current decision:

`OUTCOME_AGGREGATION_PENDING_KEEP_DATA_ONLINE_NO_GO`

Current route:

`keep_data_online_no_go_until_required_outcomes_are_accepted`

Current blockers:

- `a1_twii_operator_presence_shape_outcome`
- `a1_etf_source_rights_acceptance_evidence_outcome`
- `a2_twii_etf_public_copy_guard_outcome`

All three outcomes are currently pending, so the aggregation gate keeps data-online blocked.

## Route Rules

All required outcomes accepted:

- Decision: `ALL_REQUIRED_OUTCOMES_ACCEPTED_OPEN_SEPARATE_AUTHORIZATION_GATE`
- Route: `open_separate_lane_authorization_gate_before_any_write_or_promotion`
- All accepted does not execute anything.
- A separate authorization gate remains required before any write, readback, promotion, or public real-data claim.

Any outcome rejected:

- Decision: `OUTCOME_REJECTED_REPAIR_BEFORE_DATA_ONLINE`
- Route: `return_rejected_lanes_to_repair_and_keep_data_online_no_go`
- Rejected lanes must be repaired or replaced before the data-online path can proceed.

Any outcome repair-required:

- Decision: `OUTCOME_REPAIR_REQUIRED_BEFORE_DATA_ONLINE`
- Route: `return_repair_required_lanes_to_a1_a2_and_keep_data_online_no_go`
- Repair-required lanes return to A1/A2 with the missing fields or unsafe claims named.

Any outcome pending or deferred:

- Decision: `OUTCOME_AGGREGATION_PENDING_KEEP_DATA_ONLINE_NO_GO`
- Route: `keep_data_online_no_go_until_required_outcomes_are_accepted`
- Pending or deferred outcomes keep public runtime truthful and mock-only.

## Safety Rules

Aggregation never awards row coverage points.

Aggregation never changes `publicDataSource=mock` or `scoreSource=mock`.

Aggregation never treats accepted outcomes as source promotion, row acceptance, write approval, readback proof, launch approval, or investment advice.

## Hard Boundaries

This gate does not authorize:

- SQL execution;
- Supabase connection, read, or write;
- staging-row creation;
- `daily_prices` mutation;
- TWII or ETF market-row fetch, ingestion, storage, output, or commit;
- raw payload output;
- endpoint response output;
- operator value storage;
- candidate row acceptance;
- row coverage points;
- `publicDataSource=supabase`;
- `scoreSource=real`;
- real-time market-data claims;
- official endorsement claims;
- investment advice.

## Completion Evidence

This gate is ready when its checker proves:

1. the current ledger has three pending outcomes;
2. the current route is `keep_data_online_no_go_until_required_outcomes_are_accepted`;
3. the current decision is `OUTCOME_AGGREGATION_PENDING_KEEP_DATA_ONLINE_NO_GO`;
4. a hypothetical all-accepted state would only open `open_separate_lane_authorization_gate_before_any_write_or_promotion`;
5. `publicDataSource=mock` and `scoreSource=mock` remain unchanged;
6. no execution, write, readback, row coverage, promotion, or public real-data claim is authorized.
