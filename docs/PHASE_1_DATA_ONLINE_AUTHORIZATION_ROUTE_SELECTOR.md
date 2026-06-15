# Phase 1 Data Online Authorization Route Selector

Status: `phase_1_data_online_authorization_route_selector_ready_no_execution`

Owner: CEO/PM

Purpose: select exactly one PM route after the A1/A2 outcome aggregation gate. This document prevents Phase 1 data-online work from scattering into multiple authorization packets once required outcomes become accepted.

## Current Route

Current selected route:

`keep_mock_runtime_and_wait_for_required_a1_a2_outcomes`

Reason:

- `a1_twii_operator_presence_shape_outcome` is not accepted yet.
- `a1_etf_source_rights_acceptance_evidence_outcome` is not accepted yet.
- `a2_twii_etf_public_copy_guard_outcome` is not accepted yet.

The current aggregation decision remains `OUTCOME_AGGREGATION_PENDING_KEEP_DATA_ONLINE_NO_GO`, so Phase 1 public runtime must remain truthful and mock-visible.

## All-Accepted Route

When all three required outcomes become accepted, PM should open this route:

`open_phase_1_data_online_single_authorization_packet_review_only`

Accepted outcomes only allow PM to open one review-only authorization packet. The selector does not execute the authorization packet.

The packet must still require a separate explicit operator decision before any write, readback, source promotion, score promotion, or public real-data claim.

## Required Authorization Packet Shape

The single review-only authorization packet must name:

1. Scope: TWII and ETF Phase 1 missing-row closure only.
2. Allowed action: one bounded reviewed path after A1/A2 outcomes are accepted.
3. Disallowed action: broad backfill, raw payload storage, unrestricted remote fetch, or production mutation outside the packet.
4. Data status before execution: `publicDataSource=mock` and `scoreSource=mock`.
5. Rollback posture: fail closed to mock runtime if any check fails.
6. Post-run review: sanitized aggregate output only, with no secrets, raw payloads, endpoint responses, or market rows printed.

## Route Rules

Pending, deferred, repair-required, or rejected outcome:

- Keep route: `keep_mock_runtime_and_wait_for_required_a1_a2_outcomes`
- Keep data-online `NO_GO`.
- Return the lane to A1/A2 if repair or rejection is present.

All required outcomes accepted:

- Open route: `open_phase_1_data_online_single_authorization_packet_review_only`
- Do not execute.
- Do not promote.
- Do not award row coverage.
- Do not change runtime source flags.

## Hard Boundaries

- No SQL.
- No Supabase read or write.
- No staging rows.
- No `daily_prices` mutation.
- No market-row fetch.
- No raw payload output.
- No endpoint response output.
- No operator value storage.
- No candidate row acceptance.
- No row coverage award.
- No source promotion.
- No score promotion.
- No public real-data claim.
- No real-time claim.
- No official endorsement claim.
- No investment advice.

## Completion Evidence

This selector is ready when the checker proves:

1. the aggregation gate is currently pending and keeps data-online `NO_GO`;
2. the current route is `keep_mock_runtime_and_wait_for_required_a1_a2_outcomes`;
3. the all-accepted next route is `open_phase_1_data_online_single_authorization_packet_review_only`;
4. the route selector is registered in package scripts and review gates;
5. `publicDataSource=mock` and `scoreSource=mock` remain unchanged;
6. no execution, write, readback, row coverage, source promotion, score promotion, or public real-data claim is authorized.
