# TWII Operator Values Shape Recheck Gate Preflight

Status: `twii_operator_values_shape_recheck_gate_preflight_ready_no_execution`

Accepted output: `operator_values_shape_recheck_ready_execution_still_blocked`

Owner: PM mainline

Support lanes: A1 shape contract review, A2 shape recheck copy guard

## Purpose

This gate prepares the future shape recheck for externally supplied TWII operator values. It only validates the expected field shape, presence semantics, placeholder rules, and next review-only route.

It does not collect values, read values, store values, execute SQL, connect to Supabase, mutate `daily_prices`, accept candidate rows, promote public data, enable real scoring, approve legal terms, or provide investment advice.

## Required State

- `operatorValuesShapeRecheckMode=operator_values_shape_recheck_fail_closed_no_execution`
- `operatorValuesShapeRecheckGatePrepared=true`
- `presenceOnly=true`
- `shapeOnly=true`
- `localOnly=true`
- `externalValuePlaceholdersOnly=true`
- `requiredShapeFieldsPrepared=true`
- `externalValuePlaceholderRulesPrepared=true`
- `blockedReasonsPrepared=true`
- `nextRoutePrepared=true`
- `currentRecheckStatus=shape_recheck_ready_waiting_external_values`
- `nextReviewOnlyRoute=external_values_shape_recheck_then_pre_execution_readiness_recheck`
- `allowedNextCommandCategory=review_only_shape_presence_recheck`
- `realValuesProvidedNow=false`
- `realValuesReadNow=false`
- `realDecisionValueReadNow=false`
- `realDecisionValueRecordedNow=false`
- `externalOnlyValuesProvidedNow=false`
- `executeSwitchProvided=false`
- `confirmationPhraseProvided=false`
- `confirmationPhraseMatched=false`
- `serverOnlyCredentialCheckPassed=false`
- `credentialValuesRead=false`
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

## Shape Fields

Each future external value placeholder must include:

- `fieldId`
- `label`
- `inputClass`
- `required`
- `providedNow`
- `valueReadNow`
- `storageAllowedInRepo`
- `shapeCheckOnly`

All current placeholders must keep `providedNow=false`, `valueReadNow=false`, `storageAllowedInRepo=false`, and `shapeCheckOnly=true`.

## PM Route

The next review-only route is:

`external_values_shape_recheck_then_pre_execution_readiness_recheck`

PM can use this gate to prepare the future shape recheck. PM cannot use this gate to collect, record, validate, or execute real values.

## Stop Lines

- Do not collect or store external values in Git.
- Do not read or echo secrets, env values, authorization values, confirmation phrases, execute switch values, real decision values, raw payloads, row payloads, stock-id payloads, source payloads, candidate rows, or market rows.
- Do not connect to Supabase.
- Do not run SQL.
- Do not mutate `daily_prices`.
- Do not accept candidate rows.
- Do not treat shape recheck readiness as legal approval, source-rights approval, production launch, or investment advice.
- Do not set `publicDataSource=supabase`.
- Do not set `scoreSource=real`.
