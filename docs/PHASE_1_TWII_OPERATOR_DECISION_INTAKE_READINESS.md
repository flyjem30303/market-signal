# Phase 1 TWII Operator Decision Intake Readiness

Status: `phase_1_twii_operator_decision_intake_readiness_ready_no_execution`

Owner: CEO/PM

Purpose: consolidate the current TWII operator decision intake chain into one Phase 1 checkpoint before any real write is considered. This is a readiness surface only. It does not execute SQL, connect to Supabase, read secrets, read candidate rows, write `daily_prices`, create staging rows, promote real public data, or promote real score source.

## CEO Decision

TWII remains the smallest bounded data-online closure lane because it can close `60` missing Level 1 rows if and only if the operator decision intake and later pre-execution gates are accepted.

The current PM route is:

1. Keep public runtime on mock data.
2. Confirm the operator decision packet can be reviewed without exposing values.
3. Confirm the blank decision template, dry-run acceptance, mock recorder, and accepted-decision intake gates all fail closed.
4. Stop before real values, execution switch, confirmation phrase, server-only credential check, Supabase write, aggregate readback, rollback, and runtime promotion.

## Current Decision State

- data-online decision: `PUBLIC_RUNTIME_READY_BUT_DATA_ONLINE_NO_GO`
- target lane: `TWII`
- target table: `daily_prices`
- target scope: `twii_index_daily_prices_missing_rows`
- max rows: `60`
- candidate artifact reference: `data/candidates/twii-sanitized-candidate.json`
- candidate artifact rows read now: `false`
- real decision value read now: `false`
- real decision value recorded now: `false`
- accepted decision recorded now: `false`
- runner executable now: `false`
- execution allowed now: `false`
- public data source: `mock`
- score source: `mock`

## Intake Chain That Must Stay Green

The Phase 1 TWII intake readiness gate depends on these no-execution checks:

- `check:phase-1-twii-bounded-write-operator-decision-quickstart`
- `report:twii-real-decision-intake-packet-template-gate-preflight`
- `report:twii-real-decision-acceptance-dry-run-gate-preflight`
- `report:twii-decision-intake-recorder-mock-gate-preflight`
- `report:twii-accepted-decision-record-intake-gate-preflight`
- `report:twii-operator-checklist-next-execution-route-gate-preflight`

These prove the chain can describe an accepted, rejected, repair-required, or deferred operator decision without reading or recording a real operator value.

## Allowed Next Inputs

Only the next separate operator packet may provide:

- `decisionStatus`
- `decisionRecordedByRole`
- `decisionRecordedAtLabel`
- `decisionReasonSummary`
- `repairRequiredSummary`

Allowed decision vocabulary:

- `accepted`
- `rejected`
- `repair_required`
- `deferred_or_expired`

## Not Allowed In This Readiness Slice

This readiness slice must not:

- fill the blank decision template with real values;
- record a real accepted decision;
- read execute switch values;
- read confirmation phrase values;
- read credentials;
- read candidate row bodies;
- read trade-date lists;
- fetch market data;
- connect to Supabase;
- write `daily_prices`;
- create staging rows;
- run rollback;
- run aggregate readback;
- run post-write review;
- promote the public data source to Supabase;
- promote the score source to real;
- claim real-data launch readiness.

## Stop Lines

Stop immediately if any of these become true or unknown:

- a value-bearing field appears in a public document or report;
- `publicDataSource` is not `mock`;
- `scoreSource` is not `mock`;
- `sqlExecuted` is not `false`;
- `supabaseConnectionAttempted` is not `false`;
- `supabaseWritesEnabled` is not `false`;
- `dailyPricesMutated` is not `false`;
- `candidateArtifactRowsRead` is not `false`;
- `realDecisionValueRecordedNow` is not `false`;
- `runnerExecutableNow` is not `false`;
- `executionAllowedNow` is not `false`.

## Next Route

If this readiness gate passes, the CEO/PM next decision is:

`operator_supplies_or_rejects_twii_decision_packet_in_separate_step`

If the operator packet is accepted later, the route can proceed to pre-execution checks. If it is rejected, repair-required, or deferred, TWII write remains blocked and PM should move to ETF coverage closure or public runtime comprehension work.
