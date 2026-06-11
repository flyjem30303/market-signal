# TWII Real Decision Acceptance Dry Run Gate Preflight

Status: `twii_real_decision_acceptance_dry_run_gate_preflight_ready_no_execution`

Accepted output: `real_decision_acceptance_dry_run_ready_execution_still_blocked`

Owner: PM mainline

Support lanes: A1 contract review and A2 copy guard

## Purpose

This gate validates the shape of future decision intake outcomes with synthetic fixtures only. It proves that `accepted`, `rejected`, and `repair_required` decision packets can be checked locally before any real decision value is read or recorded.

## Inputs

- Source template gate: `data/source-gates/twii-real-decision-intake-packet-template-gate-preflight.json`
- Blank template: `data/source-gates/twii-real-decision-intake-packet-template.blank.json`
- Dry-run fixtures: `data/source-gates/twii-real-decision-acceptance-dry-run-fixtures.json`
- Gate: `data/source-gates/twii-real-decision-acceptance-dry-run-gate-preflight.json`

## Fixed Safety State

- `dryRunGateMode=real_decision_acceptance_dry_run_fail_closed_no_execution`
- `dryRunOnly=true`
- `syntheticFixtureOnly=true`
- `acceptedPathDryRunPrepared=true`
- `rejectedPathDryRunPrepared=true`
- `repairRequiredPathDryRunPrepared=true`
- `realDecisionValueReadNow=false`
- `realDecisionValueRecordedNow=false`
- `fixtureDecisionAcceptedAsReal=false`
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

## Dry-Run Case Coverage

- `accepted_fixture_only` maps to `dry_run_acceptance_packet_valid_execution_still_blocked`.
- `rejected_fixture_only` maps to `dry_run_rejection_packet_valid_execution_still_blocked`.
- `repair_required_fixture_only` maps to `dry_run_repair_required_packet_valid_execution_still_blocked`.

## Stop Lines

This slice does not accept a real authorization, does not execute a runner, does not connect to Supabase, does not write `daily_prices`, does not read row payloads, and does not promote `publicDataSource` or `scoreSource`.
