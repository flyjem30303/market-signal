# A1 TWII Exact Command Preparation Prerequisites

Status: `a1_twii_exact_command_preparation_prerequisites_ready_reference_only`

Date: 2026-06-11

Owner: A1 support line

PM mainline target: `TWII exact runtime execution command preparation gate preflight`

Mode: `reference_only_no_execution`

This A1 support note lists the exact command preparation prerequisites, operator stop conditions, pre-command checklist, and post-command-preparation non-execution boundary for the PM mainline `TWII exact runtime execution command preparation gate preflight`. It is a reference-only document. It does not prepare a runnable command value, does not invoke a runner, and does not inspect runtime data.

## Scope Boundary

- supportRole=A1
- packetUse=pm_reference_input_only
- targetLane=TWII
- targetTable=daily_prices
- targetScope=twii_index_daily_prices_missing_rows
- maxRows=60
- commandPreparationGateMode=exact_runtime_execution_command_preparation_preflight
- executionMode=reference_only_no_execution
- sqlExecutionAllowed=false
- supabaseConnectionAllowed=false
- envSecretReadAllowed=false
- authorizationValueReadAllowed=false
- candidateRowsReadAllowed=false
- rowPayloadReadAllowed=false
- rawPayloadReadAllowed=false
- marketDataFetchAllowed=false
- dailyPricesWriteAllowed=false
- publicDataSourcePromotionAllowed=false
- realScorePromotionAllowed=false

The scope above is a command-preparation support boundary only. It does not create permission to run SQL, connect to Supabase, read env or secret values, read authorization values, read candidate rows, read raw payloads, read row payloads, fetch market data, write `daily_prices`, promote `publicDataSource=supabase`, or promote `scoreSource=real`.

## Exact Command Preparation Prerequisites

The PM command preparation gate should be considered review-ready only when all prerequisites below are present as reference-only, no-execution signals.

- pmMainlineCommandPreparationSurfacePresent=true
- exactCommandPurposeNamed=true
- commandIsRepresentedAsInertTextOnly=true
- commandExecutionExplicitlyDisallowed=true
- targetTableLockedToDailyPrices=true
- targetLaneLockedToTWII=true
- targetScopeLockedToTWIIIndexMissingRows=true
- maxRowsBoundDeclared=true
- candidateArtifactPathMayBeReferenced=true
- candidateArtifactRowsRead=false
- serverOnlyBoundaryReferenced=true
- failClosedDefaultDeclared=true
- operatorStopConditionsDeclared=true
- noSecretsBoundaryDeclared=true
- noAuthorizationValueReadBoundaryDeclared=true
- noCandidateRowReadBoundaryDeclared=true
- noRawPayloadBoundaryDeclared=true
- noRowPayloadBoundaryDeclared=true
- noMarketDataFetchBoundaryDeclared=true
- noRuntimeMutationBoundaryDeclared=true
- noPromotionBoundaryDeclared=true
- postCommandPreparationNonExecutionBoundaryDeclared=true
- postRunReviewRequirementReferencedForAnyFutureSeparateAttempt=true
- aggregateReadbackRequirementReferencedForAnyFutureSeparateAttempt=true
- rollbackReadinessRequirementReferencedForAnyFutureSeparateAttempt=true
- publicDataSourceMockLockDeclared=true
- scoreSourceMockLockDeclared=true

Review-ready means the PM has enough sanitized, reference-only structure to decide whether an exact command preparation packet can be reviewed. It does not mean the command exists as an executable instruction, does not mean the runner is executable, and does not mean a runtime attempt is authorized.

## Allowed Preparation Output Shape

Any PM-facing command preparation output should stay inside this safe shape:

- commandPreparationStatus=`reference_ready_execution_blocked`
- commandTextMode=`inert_text_or_placeholder_only`
- commandRunnableNow=false
- commandCopiedToShell=false
- commandSubmittedToProcess=false
- runnerExecutableNow=false
- executionAllowedNow=false
- writeGateExecutableNow=false
- candidateArtifactReferenceOnly=true
- publicDataSource=mock
- scoreSource=mock

The A1 support line may describe required command-preparation controls, checklist fields, and stop conditions. It must not produce or validate secrets, env values, authorization values, SQL text, runtime query text, candidate row payloads, raw payloads, row payloads, source payloads, stock-id payloads, or credential-derived connection details.

## Required Decision Vocabulary

The PM command preparation gate should use a bounded vocabulary so that no label can be mistaken for execution.

- readyLabel=`ready_for_exact_command_preparation_review_only`
- rejectedLabel=`rejected`
- repairLabel=`repair_required`
- expiredLabel=`expired_or_not_current`
- failedClosedLabel=`failed_closed`

`ready_for_exact_command_preparation_review_only` may only mean that PM can continue reviewing an inert command-preparation packet. It must not mean `executionAllowedNow=true`, `runnerExecutableNow=true`, `dailyPricesWriteAllowed=true`, `publicDataSource=supabase`, or `scoreSource=real`.

## Operator Stop Conditions

The operator should stop the command preparation flow before any command is treated as executable if any condition below is true or unknown.

- commandWouldBeExecuted=true
- commandWouldBeCopiedToShellForExecution=true
- commandWouldSpawnProcess=true
- sqlWouldExecute=true
- sqlTextWouldBeGeneratedForExecution=true
- supabaseClientWouldImport=true
- supabaseConnectionWouldOpen=true
- supabaseReadWouldRun=true
- supabaseWriteWouldRun=true
- envOrSecretWouldBeRead=true
- authorizationValueWouldBeRead=true
- credentialValueWouldBeRead=true
- candidateRowsWouldBeRead=true
- candidateRowsWouldBeAccepted=true
- rawPayloadWouldBeRead=true
- rawPayloadWouldBeOutput=true
- rowPayloadWouldBeRead=true
- rowPayloadWouldBeOutput=true
- stockIdPayloadWouldBeReadOrOutput=true
- marketDataWouldBeFetched=true
- marketDataWouldBeImported=true
- marketDataWouldBeIngested=true
- stagingRowsWouldBeCreated=true
- dailyPricesWouldMutate=true
- rollbackWouldExecute=true
- aggregateReadbackWouldExposeRows=true
- postRunReviewWouldRequireRowLevelEvidence=true
- rowCoverageScoringWouldRun=true
- publicDataSourceWouldBecomeSupabase=true
- scoreSourceWouldBecomeReal=true
- commandPreparationWouldModifyPMMainlineFiles=true
- commandPreparationWouldModifyPackageOrReviewGateScripts=true
- commandPreparationWouldModifyProjectStatus=true
- commandPreparationWouldModifySourceGates=true

If a stop condition is true or cannot be determined without forbidden access, the command preparation gate should fail closed with `executionAllowedNow=false` and `commandRunnableNow=false`.

## Pre-Command Checklist

Before PM records or reviews any exact command preparation label, the packet should confirm the following reference-only checklist.

- checklistMode=reference_only_no_execution
- commandPreparationOnly=true
- commandExecutionRequested=false
- commandSubmittedToProcess=false
- shellInvocationPerformed=false
- processSpawned=false
- targetScopeMatchesTWIIIndexMissingRows=true
- maxRowsDoesNotExceedDeclaredBound=true
- candidateArtifactPathMayBeReferenced=true
- candidateArtifactRowsRead=false
- rawPayloadRead=false
- rowPayloadRead=false
- stockIdPayloadRead=false
- envSecretRead=false
- authorizationValuesRead=false
- credentialValuesRead=false
- sqlExecuted=false
- supabaseClientImported=false
- supabaseConnectionAttempted=false
- supabaseReadAttempted=false
- supabaseWriteAttempted=false
- marketDataFetched=false
- marketDataImported=false
- marketDataIngested=false
- stagingRowsCreated=false
- dailyPricesMutated=false
- candidateRowsAccepted=false
- rollbackExecuted=false
- rowCoverageScoringAllowed=false
- promotionAllowed=false
- publicDataSource=mock
- scoreSource=mock
- publicDataSourceSupabaseAllowed=false
- scoreSourceRealAllowed=false
- failClosedDefault=true
- operatorStopConditionsConfirmed=true
- postCommandPreparationBoundaryConfirmed=true
- separateExplicitAuthorizationStillRequired=true
- separateRuntimeExecutionGateStillRequired=true
- aggregateOnlyPostRunReviewRequiredForAnyFutureSeparateAttempt=true
- aggregateOnlyReadbackRequiredForAnyFutureSeparateAttempt=true
- rollbackReadinessRequiredForAnyFutureSeparateAttempt=true

The checklist should be completed from document-state and packet-state references only. If completing it requires SQL, Supabase, env or secret values, authorization values, credential values, candidate rows, raw payloads, row payloads, market-data fetches, or `daily_prices` mutation, the checklist is incomplete and the gate must remain blocked.

## Post-Command-Preparation Non-Execution Boundary

After any exact command preparation packet is recorded, this A1 support boundary remains non-executing.

- commandPreparedDoesNotExecuteRunner=true
- commandPreparedDoesNotAuthorizeWrite=true
- commandPreparedDoesNotAuthorizeSupabaseConnection=true
- commandPreparedDoesNotAuthorizeSQL=true
- commandPreparedDoesNotAuthorizeMarketDataFetch=true
- commandPreparedDoesNotAuthorizeCandidateRowRead=true
- commandPreparedDoesNotAuthorizeRawPayloadRead=true
- commandPreparedDoesNotAuthorizeRowPayloadRead=true
- commandPreparedDoesNotAuthorizeDailyPricesMutation=true
- commandPreparedDoesNotAuthorizeRollback=true
- commandPreparedDoesNotAuthorizeRowCoverageScoring=true
- commandPreparedDoesNotPromotePublicDataSource=true
- commandPreparedDoesNotPromoteScoreSource=true
- commandPreparedDoesNotSatisfyOperatorConfirmation=true
- commandPreparedDoesNotReadOperatorValues=true
- commandPreparedDoesNotBypassSeparatePMAuthorization=true
- separateExplicitAuthorizationStillRequired=true
- separateOperatorConfirmationStillRequired=true
- separateServerOnlyExecutionBoundaryStillRequired=true
- separateRuntimeExecutionGateStillRequired=true
- postRunReviewStillRequiredForAnyFutureAttempt=true
- aggregateReadbackStillAggregateOnly=true
- rollbackReadinessStillReviewOnly=true
- publicDataSourceRemainsMock=true
- scoreSourceRemainsMock=true

Even if PM marks the command preparation gate as ready for review, the next state is still non-execution. Any future runtime attempt would require a separate explicit authorization packet, separate operator confirmation, server-only execution boundary, fail-closed runner behavior, aggregate-only post-run review, aggregate-only readback, rollback readiness, and continued promotion locks until PM explicitly changes them in a permitted lane.

## Fail-Closed Rules

- missingPMCommandPreparationSurface=fail_closed
- missingBoundedScope=fail_closed
- missingMaxRowsBound=fail_closed
- missingInertCommandBoundary=fail_closed
- missingNoExecutionBoundary=fail_closed
- missingFailClosedDefault=fail_closed
- missingOperatorStopConditions=fail_closed
- missingPreCommandChecklist=fail_closed
- missingPostCommandPreparationBoundary=fail_closed
- ambiguousDecisionVocabulary=fail_closed
- commandExecutionRequiredToPrepare=fail_closed
- sqlRequiredToPrepare=fail_closed
- supabaseRequiredToPrepare=fail_closed
- envSecretRequiredToPrepare=fail_closed
- authorizationValueRequiredToPrepare=fail_closed
- credentialValueRequiredToPrepare=fail_closed
- candidateRowsRequiredToPrepare=fail_closed
- rawPayloadRequiredToPrepare=fail_closed
- rowPayloadRequiredToPrepare=fail_closed
- stockIdPayloadRequiredToPrepare=fail_closed
- marketDataFetchRequiredToPrepare=fail_closed
- dailyPricesWriteRequiredToPrepare=fail_closed
- publicDataSourceSupabaseRequiredToPrepare=fail_closed
- scoreSourceRealRequiredToPrepare=fail_closed

Fail-closed output is a blocked reference status, not a repair execution, retry instruction, data fetch instruction, command execution instruction, or write attempt instruction.

## A1 Support Conclusion

The A1 support prerequisites are ready for the PM `TWII exact runtime execution command preparation gate preflight` as a reference-only, no-execution input. The document defines exact command preparation prerequisites, operator stop conditions, a pre-command checklist, and a post-command-preparation non-execution boundary while preserving no-SQL, no-Supabase, no-env, no-secret, no-authorization-value, no-candidate-row, no-raw-payload, no-row-payload, no-market-fetch, no-`daily_prices`-write, no-`publicDataSource=supabase`, and no-`scoreSource=real` stop lines.
