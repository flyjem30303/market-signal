# TWII Operator Values Intake Readiness Surface Gate Preflight

Status: `twii_operator_values_intake_readiness_surface_gate_preflight_ready_no_execution`

Accepted output: `operator_values_intake_surface_ready_execution_still_blocked`

Owner: PM mainline

Support lanes: A1 intake contract review, A2 intake copy guard

## Purpose

This gate gives PM the shortest safe input surface after the TWII next execution route gate. It separates the remaining operator inputs into three classes: external-only values, PM-refreshable values, and never-store values.

It is a local-only readiness surface. It does not collect values, read values, accept values, execute SQL, connect to Supabase, mutate `daily_prices`, accept candidate rows, promote public data, enable real scoring, approve legal terms, or provide investment advice.

## Required State

- `operatorValuesIntakeSurfaceMode=operator_values_intake_readiness_surface_fail_closed_no_execution`
- `operatorValuesIntakeSurfaceGatePrepared=true`
- `surfaceReviewOnly=true`
- `localOnly=true`
- `inputClassesPrepared=true`
- `externalOnlyValuesPrepared=true`
- `pmRefreshableValuesPrepared=true`
- `neverStoreValuesPrepared=true`
- `blockedReasonsPrepared=true`
- `nextRoutePrepared=true`
- `currentIntakeStatus=blocked_waiting_external_operator_values`
- `nextReviewOnlyRoute=operator_supplies_external_values_then_pm_runs_pre_execution_readiness_recheck`
- `allowedNextCommandCategory=review_only_operator_values_shape_recheck`
- `externalOnlyValuesProvidedNow=false`
- `realValuesProvidedNow=false`
- `realDecisionValueReadNow=false`
- `realDecisionValueRecordedNow=false`
- `executeSwitchProvided=false`
- `confirmationPhraseProvided=false`
- `confirmationPhraseMatched=false`
- `serverOnlyCredentialCheckPassed=false`
- `credentialValuesRead=false`
- `rollbackDryRunPassed=false`
- `aggregateReadbackPassed=false`
- `postWriteReviewPassed=false`
- `candidateDuplicateRejectionProofPassed=false`
- `runnerExecutableNow=false`
- `executionAllowedNow=false`
- `writeGateExecutableNow=false`
- `finalExecutionAllowedNow=false`
- `implementationAllowedNow=false`
- `publicDataSource=mock`
- `scoreSource=mock`
- `sqlExecuted=false`
- `supabaseClientImported=false`
- `supabaseConnectionAttempted=false`
- `dailyPricesMutated=false`
- `candidateRowsAccepted=false`

## Input Classes

External-only values:

- real operator decision status
- real operator attestation
- explicit execute switch value
- explicit confirmation phrase value
- server-only credential presence result

PM-refreshable values:

- git status
- git commit id
- local review gate status
- beta runtime fast health status
- TypeScript status
- mock runtime boundary status

Never-store values:

- credentials
- secrets
- env values
- authorization values
- confirmation phrase values
- execute switch values
- real decision values
- row bodies
- trade date lists
- market values
- source payloads
- raw payloads
- stock-id payloads

## PM Route

The next review-only route is:

`operator_supplies_external_values_then_pm_runs_pre_execution_readiness_recheck`

PM can use this surface to ask for the missing external-only values outside the repo. PM cannot store those values here, and PM cannot run a real execution from this gate.

## Stop Lines

- Do not collect or store external-only values in Git.
- Do not read or echo secrets, env values, authorization values, confirmation phrases, execute switch values, real decision values, raw payloads, row payloads, stock-id payloads, source payloads, candidate rows, or market rows.
- Do not connect to Supabase.
- Do not run SQL.
- Do not mutate `daily_prices`.
- Do not accept candidate rows.
- Do not treat readiness as legal approval, source-rights approval, production launch, or investment advice.
- Do not set `publicDataSource=supabase`.
- Do not set `scoreSource=real`.
