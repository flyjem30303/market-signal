# TWII Decision Intake Recorder Mock Gate Preflight

Status: `twii_decision_intake_recorder_mock_gate_preflight_ready_no_execution`

Accepted output: `decision_intake_recorder_mock_ready_execution_still_blocked`

Owner: PM mainline

Support lanes: A1 recorder contract review and A2 copy guard

## Purpose

This gate converts the synthetic `accepted`, `rejected`, and `repair_required` dry-run cases into mock decision recorder records. It proves that a future decision recorder can validate record shape and audit fields before any real decision value is read, recorded, or executed.

## Inputs

- Source dry-run gate: `data/source-gates/twii-real-decision-acceptance-dry-run-gate-preflight.json`
- Source dry-run fixtures: `data/source-gates/twii-real-decision-acceptance-dry-run-fixtures.json`
- Mock records: `data/source-gates/twii-decision-intake-recorder-mock-records.json`
- Gate: `data/source-gates/twii-decision-intake-recorder-mock-gate-preflight.json`

## Fixed Safety State

- `recorderGateMode=decision_intake_recorder_mock_fail_closed_no_execution`
- `dryRunOnly=true`
- `mockRecorderOnly=true`
- `acceptedRecordMockPrepared=true`
- `rejectedRecordMockPrepared=true`
- `repairRequiredRecordMockPrepared=true`
- `recordsDerivedFromSyntheticFixtures=true`
- `realDecisionValueReadNow=false`
- `realDecisionValueRecordedNow=false`
- `mockRecordAcceptedAsReal=false`
- `acceptedDecisionRecordedNow=false`
- `rejectedDecisionRecordedNow=false`
- `repairRequiredDecisionRecordedNow=false`
- `runnerExecutableNow=false`
- `executionAllowedNow=false`
- `implementationAllowedNow=false`
- `publicDataSource=mock`
- `scoreSource=mock`
- `sqlExecuted=false`
- `supabaseClientImported=false`
- `supabaseConnectionAttempted=false`
- `dailyPricesMutated=false`
- `candidateRowsAccepted=false`

## Mock Record Coverage

- `mock-record-accepted-fixture-only` maps to `mock_recorder_acceptance_record_valid_execution_still_blocked`.
- `mock-record-rejected-fixture-only` maps to `mock_recorder_rejection_record_valid_execution_still_blocked`.
- `mock-record-repair-required-fixture-only` maps to `mock_recorder_repair_required_record_valid_execution_still_blocked`.

## Stop Lines

This slice does not accept a real authorization, does not record a real decision, does not execute a runner, does not connect to Supabase, does not write `daily_prices`, does not read row payloads, and does not promote `publicDataSource` or `scoreSource`.
