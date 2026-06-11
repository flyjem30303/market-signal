# A1 Accepted Decision Record Intake Prerequisites

Status: `a1_accepted_decision_record_intake_prerequisites_ready_reference_only_no_execution`

Outcome: `accepted_decision_record_intake_gate_preflight_supported_execution_still_blocked`

Owner: A1 support line

PM mainline target: `TWII accepted decision record intake gate preflight`

Mode: `reference_only_no_execution`

This A1 support note prepares the reference-only prerequisites for PM to review whether an accepted decision record can be safely routed into an intake gate. It does not execute SQL, connect to Supabase, import a Supabase client, inspect env or secret values, read authorization or confirmation values, read decision values, read row payloads, read raw payloads, fetch market data, write `daily_prices`, create staging rows, promote `publicDataSource=supabase`, or promote `scoreSource=real`.

## Scope Boundary

- supportRole=A1
- packetUse=pm_reference_input_only
- targetLane=TWII
- targetTable=daily_prices
- decisionGateMode=accepted_decision_record_intake_gate_preflight
- executionMode=reference_only_no_execution
- sqlExecutionAllowed=false
- supabaseClientImportAllowed=false
- supabaseConnectionAllowed=false
- envSecretReadAllowed=false
- authorizationValueReadAllowed=false
- confirmationPhraseReadAllowed=false
- decisionValueReadAllowed=false
- stockIdPayloadReadAllowed=false
- rowPayloadReadAllowed=false
- rawPayloadReadAllowed=false
- marketDataFetchAllowed=false
- dailyPricesWriteAllowed=false
- stagingRowsAllowed=false
- publicDataSourceSupabaseAllowed=false
- scoreSourceRealAllowed=false

The boundary above is an intake readiness checklist only. If PM needs any forbidden access to complete the gate, the gate is incomplete and must fail closed.

## Intake Prerequisites

The PM intake gate is review-ready only if the accepted, rejected, and repair-required routes are all bounded before any decision record is handled.

### Accepted Intake Prerequisites

- acceptedLabelMeaningBounded=true
- acceptedMeansRecordIntakeEligibleOnly=true
- acceptedDoesNotMeanExecutionAllowed=true
- acceptedDoesNotMeanRunnerExecutable=true
- acceptedDoesNotMeanDailyPricesWriteAllowed=true
- acceptedDoesNotMeanSupabaseConnectionAllowed=true
- acceptedDoesNotMeanPublicPromotionAllowed=true
- acceptedDoesNotMeanRealScoreAllowed=true
- acceptedRecordSourceIsReferenceOnly=true
- acceptedRecordFieldsAreAllowlisted=true
- acceptedRecordContainsNoSecretValues=true
- acceptedRecordContainsNoAuthorizationValues=true
- acceptedRecordContainsNoConfirmationPhraseValues=true
- acceptedRecordContainsNoDecisionValues=true
- acceptedRecordContainsNoRowPayloads=true
- acceptedRecordContainsNoRawPayloads=true
- acceptedRecordContainsNoStockIdPayloads=true
- acceptedRecordCanBeReviewedWithoutRuntimeData=true

### Rejected Intake Prerequisites

- rejectedLabelMeaningBounded=true
- rejectedRouteKeepsRuntimeBlocked=true
- rejectedRouteDoesNotTriggerRepairExecution=true
- rejectedRouteDoesNotTriggerDataFetch=true
- rejectedRouteDoesNotTriggerSupabaseRead=true
- rejectedRouteDoesNotTriggerSupabaseWrite=true
- rejectedRouteRequiresReferenceOnlyReason=true
- rejectedRouteReasonContainsNoForbiddenValues=true
- rejectedRoutePreservesPromotionLocks=true
- rejectedRouteCanBeReviewedWithoutRuntimeData=true

### Repair-Required Intake Prerequisites

- repairRequiredLabelMeaningBounded=true
- repairRequiredRouteMeansDocumentOrGateRepairOnly=true
- repairRequiredDoesNotMeanRuntimeRepairAllowed=true
- repairRequiredDoesNotAuthorizeSQL=true
- repairRequiredDoesNotAuthorizeSupabase=true
- repairRequiredDoesNotAuthorizeMarketDataFetch=true
- repairRequiredDoesNotAuthorizeDailyPricesMutation=true
- repairRequiredDoesNotAuthorizeStagingRows=true
- repairRequiredReasonIsReferenceOnly=true
- repairRequiredReasonContainsNoForbiddenValues=true
- repairRequiredRoutePreservesFailClosedDefault=true

## Decision Intake Allowed Fields

The intake record should be treated as valid only when it can be represented using allowlisted metadata fields. Field values must remain sanitized and must not include env values, secrets, authorization values, confirmation phrase values, decision values, raw payloads, row payloads, stock-id payloads, market data, or row-level evidence.

- intakeRecordId
- sourceGateId
- targetLane
- targetScope
- targetTable
- decisionLabel
- decisionTimestampReference
- decisionOwnerRole
- decisionRoute
- referenceArtifactPaths
- prerequisiteChecklistStatus
- aggregateReadbackStatus
- rollbackReadinessStatus
- postRunReviewStatus
- failClosedStatus
- operatorStopConditionStatus
- promotionLockStatus
- blockedItems
- reviewNotesReferenceOnly

Allowed fields do not imply that all field values may be read. If a field would require a forbidden value or forbidden payload to populate, that field must be marked unavailable and the intake gate must fail closed.

## Decision Value Stop Lines

Decision intake must stop before value inspection. PM may review whether the record uses the bounded decision vocabulary, but this A1 support line must not read, print, infer, validate, or store operator-provided decision values.

- decisionValueRead=false
- decisionValuePrinted=false
- decisionValueStored=false
- decisionValueInferred=false
- confirmationPhraseValueRead=false
- authorizationValueRead=false
- envSecretValueRead=false
- credentialValueRead=false
- rawPayloadRead=false
- rowPayloadRead=false
- stockIdPayloadRead=false
- marketDataRead=false

Stop immediately if the intake flow asks for a hidden value, compares a hidden value, requires row-level evidence, requires payload evidence, or attempts to promote a runtime state.

## Aggregate Readback Readiness

Aggregate readback readiness is required for any future execution review, but this file does not perform readback.

- aggregateReadbackRequired=true
- aggregateReadbackPerformedHere=false
- aggregateReadbackMustBeAggregateOnly=true
- aggregateReadbackMustExposeNoRows=true
- aggregateReadbackMustExposeNoRawPayloads=true
- aggregateReadbackMustExposeNoStockIdPayloads=true
- aggregateReadbackMustExposeNoSecrets=true
- aggregateReadbackMustNotConnectToSupabase=true
- aggregateReadbackMustNotWriteDailyPrices=true
- aggregateReadbackMissingOrAmbiguous=fail_closed

The intake gate can only reference aggregate readback readiness as a documented status. It cannot create, repair, or validate aggregate readback by querying runtime data.

## Rollback Readiness

Rollback readiness is a prerequisite for any later execution path, but no rollback action is executed here.

- rollbackReadinessRequired=true
- rollbackExecutedHere=false
- rollbackPlanReferenceOnly=true
- rollbackRequiresNoSQLHere=true
- rollbackRequiresNoSupabaseHere=true
- rollbackRequiresNoDailyPricesMutationHere=true
- rollbackOwnerNamed=true
- rollbackTriggerConditionsDocumented=true
- rollbackVerificationAggregateOnly=true
- rollbackReadinessMissingOrAmbiguous=fail_closed

If rollback readiness cannot be established from existing reference artifacts, PM should treat the intake gate as blocked rather than asking A1 to inspect runtime state.

## Operator Stop Conditions

The operator must stop the intake flow before any execution path if any condition below is true or unknown.

- sqlWouldExecute=true
- supabaseClientWouldImport=true
- supabaseConnectionWouldOpen=true
- supabaseReadWouldRun=true
- supabaseWriteWouldRun=true
- envOrSecretWouldBeRead=true
- authorizationValueWouldBeRead=true
- confirmationPhraseValueWouldBeRead=true
- decisionValueWouldBeRead=true
- rawPayloadWouldBeRead=true
- rowPayloadWouldBeRead=true
- stockIdPayloadWouldBeRead=true
- marketDataWouldBeFetched=true
- dailyPricesWouldMutate=true
- stagingRowsWouldBeCreated=true
- rollbackWouldExecute=true
- aggregateReadbackWouldExposeRows=true
- postRunReviewWouldRequireRowLevelEvidence=true
- publicDataSourceWouldBecomeSupabase=true
- scoreSourceWouldBecomeReal=true
- acceptedDecisionWouldBeTreatedAsRuntimeAuthorization=true
- runnerWouldProceedWithoutSeparateExplicitPMAuthorization=true

If a stop condition is true, or cannot be resolved without forbidden access, the only safe output is `executionAllowedNow=false` and `intakeGateStatus=failed_closed`.

## Fail-Closed Checklist

- missingPMDecisionSurface=fail_closed
- missingAcceptedRoutePrerequisites=fail_closed
- missingRejectedRoutePrerequisites=fail_closed
- missingRepairRequiredRoutePrerequisites=fail_closed
- ambiguousDecisionVocabulary=fail_closed
- nonAllowlistedDecisionField=fail_closed
- forbiddenValueRequiredToDecide=fail_closed
- rowPayloadRequiredToDecide=fail_closed
- rawPayloadRequiredToDecide=fail_closed
- stockIdPayloadRequiredToDecide=fail_closed
- envSecretRequiredToDecide=fail_closed
- authorizationValueRequiredToDecide=fail_closed
- confirmationPhraseRequiredToDecide=fail_closed
- marketDataFetchRequiredToDecide=fail_closed
- sqlRequiredToDecide=fail_closed
- supabaseRequiredToDecide=fail_closed
- dailyPricesWriteRequiredToDecide=fail_closed
- stagingRowsRequiredToDecide=fail_closed
- aggregateReadbackMissing=fail_closed
- rollbackReadinessMissing=fail_closed
- postRunReviewMissing=fail_closed
- publicDataSourceSupabaseRequiredToDecide=fail_closed
- scoreSourceRealRequiredToDecide=fail_closed

Fail-closed output is a blocked reference status, not a retry instruction, repair execution instruction, runtime probe, source fetch, staging route, write attempt, or promotion route.

## Post-Run Review Readiness

Post-run review readiness is required before any future execution can be considered, but this file does not perform or simulate a post-run review.

- postRunReviewRequired=true
- postRunReviewPerformedHere=false
- postRunReviewMustBeNoSecret=true
- postRunReviewMustBeAggregateOnly=true
- postRunReviewMustNotRequireRowPayloads=true
- postRunReviewMustNotRequireRawPayloads=true
- postRunReviewMustNotRequireStockIdPayloads=true
- postRunReviewMustNotExposeDecisionValues=true
- postRunReviewMustPreservePromotionLocks=true
- postRunReviewMissingOrAmbiguous=fail_closed

The accepted decision record intake gate should only proceed when post-run review requirements are already documented as reference-only prerequisites for a separate future execution lane.

## Still Blocked Before Real Execution

Even if PM marks the intake gate as accepted, the following remain blocked before any real execution.

- executionAllowedNow=false
- runnerExecutableNow=false
- writeGateExecutableNow=false
- finalExecutionAllowedNow=false
- sqlExecutionAllowed=false
- supabaseClientImportAllowed=false
- supabaseConnectionAllowed=false
- envSecretReadAllowed=false
- authorizationValueReadAllowed=false
- confirmationPhraseReadAllowed=false
- decisionValueReadAllowed=false
- rawPayloadReadAllowed=false
- rowPayloadReadAllowed=false
- stockIdPayloadReadAllowed=false
- marketDataFetchAllowed=false
- dailyPricesWriteAllowed=false
- stagingRowsAllowed=false
- publicDataSource=mock
- scoreSource=mock
- separateExplicitPMAuthorizationStillRequired=true
- separateOperatorConfirmationStillRequired=true
- separateServerOnlyRuntimeGateStillRequired=true
- separateFailClosedRunnerStillRequired=true
- separateAggregateReadbackStillRequired=true
- separateRollbackReadinessStillRequired=true
- separatePostRunReviewStillRequired=true
- legalAndDisclosureReviewStillRequired=true
- promotionGateStillRequired=true

## A1 Support Conclusion

The A1 accepted decision record intake prerequisites are ready as a reference-only, no-execution input for the PM `TWII accepted decision record intake gate preflight`. The checklist defines bounded accepted, rejected, and repair-required intake routes; allowlisted decision intake fields; decision value stop lines; aggregate readback readiness; rollback readiness; operator stop conditions; fail-closed behavior; post-run review readiness; and the items that remain blocked before real execution.
