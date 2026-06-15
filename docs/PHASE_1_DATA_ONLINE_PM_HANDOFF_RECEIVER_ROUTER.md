# Phase 1 Data Online PM Handoff Receiver Router

Status: `phase_1_data_online_pm_handoff_receiver_router_ready_no_execution`

Owner: CEO/PM

Decision: `PM_RECEIVES_A1_A2_OUTCOMES_AND_ROUTES_WITHOUT_EXECUTION`

Purpose: define how PM handles A1/A2 outcomes after the Phase 1 data-online handoff packet. This router keeps the mainline moving without turning any accepted packet into data execution, Supabase write, readback, row-coverage award, or runtime promotion.

## Current Data-Online State

- Phase 1 data-online decision: `PUBLIC_RUNTIME_READY_BUT_DATA_ONLINE_NO_GO`
- Full Level 1 coverage: `182/360`, missing `178`
- TWII missing rows: `60`
- ETF missing rows: `118`
- Runtime boundary: `publicDataSource=mock`
- Score boundary: `scoreSource=mock`

## Accepted Outcome Vocabulary

PM receives A1/A2 outputs only as:

- `accepted`
- `rejected`
- `repair_required`
- `deferred`

Any output outside these statuses is treated as `repair_required` until it is resubmitted in the handoff packet shape.

## Routing Rules

All-accepted route:

`open_separate_lane_authorization_gate_before_any_write_or_promotion`

All-accepted does not execute anything by itself. It only means the relevant lane may open a separate authorization gate for the next action. That later gate must still prove source rights, field contract, data quality, rollback, timestamp, readback, public copy, and non-investment-advice boundaries before any write or promotion.

Any-rejected route:

`return_rejected_lane_to_repair_without_runtime_promotion`

Rejected lanes return to repair and do not block unrelated accepted aggregate-safe PM integration. Rejection must preserve the current `NO_GO` decision and mock runtime truthfulness.

Any-repair-required route:

`return_lane_to_a1_a2_repair_with_missing_fields_only`

Repair-required lanes go back to A1/A2 with only the missing fields, unsafe claims, or boundary violations named. Rejected or repair-required outcomes do not reset already accepted lanes.

Any-deferred route:

`keep_data_online_no_go_and_continue_mock_runtime_truthfulness`

Deferred outcomes preserve `NO_GO` without creating fake progress. PM may continue public-runtime comprehension and non-execution data preparation while the lane waits.

Mixed-outcome route:

`integrate_only_accepted_aggregate_safe_outputs_and_keep_remaining_lanes_blocked`

Mixed outcomes must not block accepted aggregate-safe PM integration. Accepted lanes can be recorded as ready for the next separate gate; rejected, repair-required, or deferred lanes remain blocked.

## PM Receiver Checklist

Before PM records a received outcome:

1. Confirm the output matches the A1/A2 handoff packet route.
2. Confirm it uses only `accepted`, `rejected`, `repair_required`, or `deferred`.
3. Confirm it includes no secrets, raw payload, endpoint response body, operator value body, row payload, stock-id payload, or market-row body.
4. Confirm it does not claim row coverage points.
5. Confirm it does not change `publicDataSource=mock` or `scoreSource=mock`.
6. Confirm it does not authorize SQL execution, Supabase read/write, staging rows, `daily_prices` mutation, ingestion, readback, runtime promotion, real-time claims, official endorsement, or investment advice.

First executable action still requires a separate authorization gate.

## Hard Boundaries

This router does not authorize:

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

This router is ready when its checker proves:

1. the A1/A2 handoff packet is green;
2. the Phase 1 data-online selector remains green and honest `NO_GO`;
3. coverage remains `182/360`, missing `178`;
4. every outcome status has a deterministic PM route;
5. mixed outcomes can still advance accepted aggregate-safe work without pretending all lanes are complete;
6. `publicDataSource=mock` and `scoreSource=mock` remain unchanged.
