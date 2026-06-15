# TWII Exact Execution Preflight Repair Selector

Status: `twii_exact_execution_preflight_repair_selector_ready_no_execution`

Date: 2026-06-15

Owner: CEO / PM mainline

Support lanes: A1 Data / Source / Coverage, A2 Public Copy / Product Safety, A3 Launch / Production Engineering

## Purpose

This selector narrows the selected Phase 1 data-online route:

`twii_first_level_1_closure_exact_execution_gate_or_repair`

It answers what PM should repair or open next before a TWII bounded execution can even be considered.

This selector does not authorize execution. It does not run SQL, connect to Supabase, write `daily_prices`, read candidate rows, fetch market data, output secrets, award row coverage points, or promote runtime source.

## Current TWII Execution Readiness Evidence

Current prepared but blocked evidence:

- `report-twii-final-execution-packet-preflight` reports `twii_final_execution_packet_preflight_ready_no_execution`;
- `report-twii-final-runtime-execution-gate-preflight` reports `twii_final_runtime_execution_gate_preflight_ready_no_execution`;
- `report-twii-final-operator-authorization-packet-preflight` reports `twii_final_operator_authorization_packet_preflight_ready_no_execution`;
- `report-twii-source-rights-outcome-gate-bridge` reports `ready_for_twii_source_rights_outcome_gate_only`;
- candidate artifact path is reference-only: `data/candidates/twii-sanitized-candidate.json`;
- target table is `daily_prices`;
- target lane is `TWII`;
- target scope is `twii_index_daily_prices_missing_rows`;
- max rows is `60`;
- public runtime source remains `publicDataSource=mock`;
- score source remains `scoreSource=mock`.

## CEO Decision

The blocker is not runner implementation.

The former source-rights and field-contract blockers are now resolved for the next gate only. TWII still cannot execute, but PM should stop looping back to the older source-rights route.

Therefore, the selected next route is:

`twii_sanitized_candidate_artifact_readiness_gate`

## Repair / Advancement Queue

### Route 1 - TWII Sanitized Candidate Artifact Readiness Gate

Route id: `twii_sanitized_candidate_artifact_readiness_gate`

selected next route: `twii_sanitized_candidate_artifact_readiness_gate`

Current posture: `selected_next_no_execution`

Evidence:

- local ledger classifications are accepted for source-rights gate only;
- `acceptedForSourceRightsOutcomeGateOnly=4`;
- `required=4`;
- `missingRequiredIds=0`;
- source-rights outcome is accepted for the next gate only;
- field-contract and asset-mapping alignment is accepted for sanitized candidate-gate preparation only.

PM action:

1. verify the existing sanitized candidate artifact path and aggregate-only shape;
2. confirm expected rows, missing rows, duplicate rows, rejected rows, and missing rows are aggregate-only;
3. keep all evidence aggregate-only and no-secret;
4. do not read raw rows, row payloads, stock id payloads, credentials, or secrets.

### Route 2 - Operator Packet Intake Review

Route id: `twii_operator_packet_intake_review`

Current posture: `blocked_until_route_1_acceptance`

PM action:

1. review exactly one operator packet;
2. allow only `decisionStatus`, `decisionRecordedByRole`, `decisionRecordedAtLabel`, `decisionReasonSummary`, and `repairRequiredSummary`;
3. do not read execute-switch values, confirmation phrase values, credentials, or secrets;
4. do not infer execution authorization from a packet marked accepted.

### Route 3 - Exact Bounded Execution Gate Preparation

Route id: `twii_exact_bounded_execution_gate_prepare_only`

Current posture: `blocked_until_operator_packet_acceptance`

PM action:

1. prepare a later exact command packet only after Routes 1 and 2 are accepted;
2. require server-only credential checks, execute-switch confirmation, confirmation phrase, rollback readiness, post-run review, and aggregate readback;
3. keep `runnerExecutableNow=false`, `executionAllowedNow=false`, and `writeGateExecutableNow=false` until the separate final gate accepts.

### Resolved Route - TWII Source-Rights Outcome Gate

Route id: `twii_source_rights_outcome_gate_acceptance`

Current posture: `resolved_next_gate_only_no_execution`

### Resolved Route - TWII Field-Contract And Asset-Mapping Acceptance

Route id: `twii_field_contract_asset_mapping_acceptance`

Current posture: `resolved_for_sanitized_candidate_gate_only`

## Stop Lines

All of these must remain false in this selector:

- `sqlExecuted`;
- `supabaseConnectionAttempted`;
- `supabaseReadsEnabled`;
- `supabaseWritesEnabled`;
- `dailyPricesMutated`;
- `stagingRowsCreated`;
- `marketDataFetched`;
- `marketDataIngested`;
- `candidateArtifactRowsRead`;
- `candidateRowsAccepted`;
- `rowCoverageScoringAllowed`;
- `rawPayloadOutput`;
- `rowPayloadOutput`;
- `stockIdPayloadOutput`;
- `secretsOutput`;
- `authorizationDecisionAcceptedNow`;
- `authorizationValuesRead`;
- `executeSwitchValueRead`;
- `confirmationPhraseValueRead`;
- `credentialValuesRead`;
- `publicPromotionAllowed`;
- `scoreSourceRealAllowed`.

## PM Routing Rule

PM should apply this rule:

1. If source-rights or field-contract alignment regresses, repair that gate before continuing.
2. If the sanitized candidate artifact readiness gate is not accepted, open Route 1 next.
3. If candidate readiness is accepted but the operator packet is missing, open Route 2.
4. If candidate readiness and operator packet review are complete, open Route 3 as a new no-execution exact bounded execution gate.
5. If any route requires raw payloads, row payloads, SQL, Supabase write, or secrets, stop and create a separate CEO/operator decision packet.

## Acceptance Criteria

This selector is accepted when:

1. it identifies the next selected route as `twii_sanitized_candidate_artifact_readiness_gate`;
2. it records TWII packet/runtime/operator reports as prepared but still no-execution;
3. it records source-rights bridge as ready to open the separate outcome gate only;
4. it keeps `targetTable=daily_prices`, `targetLane=TWII`, `targetScope=twii_index_daily_prices_missing_rows`, and `maxRows=60`;
5. it keeps `publicDataSource=mock`;
6. it keeps `scoreSource=mock`;
7. it keeps `runnerExecutableNow=false`, `executionAllowedNow=false`, and `writeGateExecutableNow=false`;
8. it records source-rights and field-contract alignment as resolved for the next gate only, while keeping candidate readiness and operator-packet acceptance as explicit prerequisites;
9. it does not authorize SQL, Supabase read/write, staging rows, `daily_prices` mutation, market-data fetch, row payload output, raw payload output, row coverage scoring, public source promotion, score promotion, or investment advice.

## Next PM Route

Next route: `twii_sanitized_candidate_artifact_readiness_gate`.

If that route is rejected or repair-required, PM should repair TWII candidate artifact evidence or shift to `etf_source_rights_field_contract_parallel_repair` from the Phase 1 data-online execution selector.
