# Phase 1 TWII Operator Decision Packet Request

Status: `phase_1_twii_operator_decision_packet_request_ready_no_execution`

Owner: CEO/PM

Purpose: define the single operator-facing request surface for the next TWII decision step. This packet request is the bridge between local readiness and a future separate operator decision. It does not fill real values, accept real values, record a decision, execute a runner, connect to Supabase, or write `daily_prices`.

## CEO Decision

TWII can be the first data-online closure lane only after a real operator packet is reviewed in a separate step. This document makes the request explicit and prevents the team from treating synthetic packet readiness as real execution authorization.

## Packet Scope

- attempt id: `twii-one-attempt-runner-20260610-a`
- lane: `TWII`
- table: `daily_prices`
- scope: `twii_index_daily_prices_missing_rows`
- max rows: `60`
- candidate artifact reference: `data/candidates/twii-sanitized-candidate.json`
- public data source: `mock`
- score source: `mock`
- current execution state: `blocked_waiting_real_operator_and_pre_execution_values`

## Operator May Choose One Status

The future operator packet may choose exactly one of:

- `accepted`
- `rejected`
- `repair_required`
- `deferred_or_expired`

Decision meaning:

- `accepted`: PM may continue to the next pre-execution review path, but this still does not execute the write.
- `rejected`: TWII write remains blocked; PM should repair the packet or shift to ETF coverage closure.
- `repair_required`: TWII write remains blocked until the repair summary is resolved and rechecked.
- `deferred_or_expired`: TWII write remains blocked; PM must refresh the packet before any future decision.

## Operator Packet Fields

Only these value-bearing fields belong in the future separate operator packet:

- `decisionStatus`
- `decisionRecordedByRole`
- `decisionRecordedAtLabel`
- `decisionReasonSummary`
- `repairRequiredSummary`

These values are not stored or read in this readiness slice.

## Current Proven Readiness Chain

The request is supported by:

- `phase_1_twii_operator_decision_intake_readiness_ready_no_execution`
- `twii_operator_visible_decision_packet_readiness_gate_preflight_ready_no_execution`
- `twii_operator_packet_fill_simulation_gate_preflight_ready_no_execution`
- `twii_real_operator_packet_intake_blocker_gate_preflight_ready_no_execution`
- `twii_operator_checklist_next_execution_route_gate_preflight_ready_no_execution`

The current blocker is expected and correct:

`wait_for_real_operator_values_execute_switch_confirmation_credentials_and_pre_execution_checks`

## Not Allowed In This Slice

This slice must not:

- fill operator packet values;
- read or store authorization values;
- read execute switch values;
- read confirmation phrase values;
- read credentials;
- read candidate row bodies;
- fetch or store market data;
- connect to Supabase;
- write `daily_prices`;
- create staging rows;
- run rollback;
- run aggregate readback;
- run post-write review;
- promote public runtime data source;
- promote scoring source;
- claim real-data launch readiness.

## Stop Lines

Stop immediately if any of these are not false:

- `realDecisionValueReadNow`
- `realDecisionValueRecordedNow`
- `realOperatorPacketAcceptedNow`
- `acceptedDecisionRecordedNow`
- `runnerExecutableNow`
- `executionAllowedNow`
- `sqlExecuted`
- `supabaseConnectionAttempted`
- `supabaseWritesEnabled`
- `dailyPricesMutated`
- `candidateArtifactRowsRead`
- `secretsOutput`

## Next Route

If the operator is ready to proceed, the next separate step is:

`operator_submits_one_twii_decision_packet_for_pm_intake_review`

If not, continue ETF coverage closure or public runtime comprehension work while TWII stays blocked.
