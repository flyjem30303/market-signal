# A1 TWII PM Authorization Review Data Evidence Checklist

Updated: 2026-06-12

Status: `a1_twii_pm_auth_review_data_evidence_checklist_ready_local_only`

Owner: A1 Data / Supabase / Market Evidence support lane

Mainline packet: `docs/TWII_PM_AUTHORIZATION_REVIEW_DECISION_PACKET.md`

Alignment packet: `docs/TWII_ONE_SHOT_AUTHORIZATION_PACKET_ALIGNMENT.md`

## Purpose

This checklist gives PM the data-evidence basis for reviewing the TWII one-shot authorization packet without execution.

It is local-only. It does not authorize SQL, Supabase connection, Supabase write, staging-row creation, `daily_prices` mutation, market-data fetch, market-data ingestion, raw market-data storage, candidate-row acceptance, row coverage scoring, public data-source promotion, or real score promotion.

## Fixed Review Scope

- reviewRoute=prepare_pm_review_decision_for_twii_future_one_time_authorization_packet_without_execution
- targetSymbol=TWII
- targetLane=TWII
- targetRelation=daily_prices
- targetScope=twii_index_daily_prices_missing_rows
- maxRows=60
- writeMode=bounded_insert_missing_only
- duplicatePolicy=reject_duplicates
- currentObservedRows=0
- currentExpectedRows=60
- expectedMissingRows=60
- publicDataSource=mock
- scoreSource=mock
- executionAllowedNow=false
- writeGateExecutableNow=false
- sqlExecuted=false
- supabaseConnectionAttempted=false
- supabaseWriteAllowedNow=false
- stagingRowsCreated=false
- dailyPricesMutationAllowedNow=false
- marketDataFetched=false
- marketDataIngested=false
- candidateRowsAccepted=false
- rowCoverageScoringAllowed=false

## Accepted Decision Data Criteria

PM may record `accepted_for_future_execution_gate_preparation_only` only if all data-evidence checks below are true:

- source-rights evidence is accepted for the intended TWII index daily-price repair use case.
- field-contract evidence is accepted for writing the bounded TWII fields into `daily_prices`.
- sanitized candidate artifact is accepted by reference only.
- sanitized candidate artifact remains aggregate-only or safe file-reference only.
- raw payload is not included.
- row payload is not included.
- stock-id payload is not included.
- secrets are not included.
- candidate scope matches `TWII`, `daily_prices`, and `twii_index_daily_prices_missing_rows`.
- maximum candidate row count is exactly `60`.
- duplicate policy remains `reject_duplicates`.
- write mode remains `bounded_insert_missing_only`.
- rollback or disable route is documented before execution.
- readback plan is aggregate-only and documented before execution.
- post-run review plan is documented before execution.
- public runtime remains `publicDataSource=mock`.
- scoring remains `scoreSource=mock`.

Accepted means the packet family may advance to a later execution-gate preparation step. It does not mean the one-shot attempt may run.

## Rejected Decision Data Criteria

PM should record `rejected` if any of the following are true:

- source-rights evidence is rejected or unavailable for the intended use case.
- field-contract evidence conflicts with `daily_prices`.
- sanitized candidate artifact is missing.
- candidate scope is not TWII-only.
- target relation is not `daily_prices`.
- target scope is not `twii_index_daily_prices_missing_rows`.
- candidate row cap is greater than `60`.
- duplicate policy is missing or not `reject_duplicates`.
- write mode is broader than bounded missing-only insert.
- raw payload, row payload, stock-id payload, or secrets are present.
- rollback route is missing.
- readback route is missing.
- post-run review route is missing.
- any current packet implies SQL execution, Supabase write, staging-row creation, `daily_prices` mutation, market-data fetch, market-data ingestion, public source promotion, or real score promotion.

Rejected means the packet must return to repair before any later gate can be prepared.

## Needs-Repair Decision Data Criteria

PM should record `needs-repair` if the packet is directionally correct but one or more non-executing evidence items are incomplete:

- source-rights evidence exists but has not been classified as accepted.
- field-contract evidence exists but lacks PM acceptance.
- sanitized candidate artifact is referenced but lacks an explicit artifact id or safe path.
- rollback, readback, or post-run review exists but is too vague for operator use.
- missing evidence classification is not explicit.
- next data route is not named.
- public copy guard exists but does not clearly preserve mock/real boundaries.

Needs-repair means the next route is evidence completion, not execution.

## Source-Rights Checklist

- sourceRightsEvidenceRequired=true
- sourceRightsDecisionMustBeAcceptedBeforeExecutionGate=true
- sourceRightsUseCase=twii_index_daily_prices_missing_rows
- sourceRightsMustNotIncludeSecrets=true
- sourceRightsMustNotIncludeRawPayload=true
- sourceRightsStatusForPMReview=must_be_accepted_or_needs_repair

PM data note: source-rights acceptance is a prerequisite for a later execution gate, not proof that public runtime can show real data.

## Field-Contract Checklist

- fieldContractEvidenceRequired=true
- targetRelation=daily_prices
- targetSymbol=TWII
- targetFieldsMustBeBounded=true
- targetScope=twii_index_daily_prices_missing_rows
- maxRows=60
- duplicatePolicy=reject_duplicates
- fieldContractStatusForPMReview=must_be_accepted_or_needs_repair

PM data note: field-contract acceptance only validates the expected structure. It does not approve insertion.

## Sanitized Candidate Artifact Checklist

- sanitizedCandidateArtifactRequired=true
- candidateArtifactMustBeReferencedByPathOrId=true
- candidateArtifactMustBeAggregateOrSanitizedOnly=true
- rawPayloadIncluded=false
- rowPayloadIncluded=false
- stockIdPayloadIncluded=false
- secretsIncluded=false
- candidateRowsAccepted=false

PM data note: candidate artifact readiness supports later operator packet preparation. It does not accept rows into the product dataset.

## Rollback, Readback, And Post-Run Review Checklist

- rollbackOrDisableRouteRequired=true
- aggregateReadbackRequired=true
- postRunReviewRequired=true
- readbackMustAvoidRawRows=true
- reviewMustRecordAcceptedRejectedNeedsRepair=true
- reviewMustNotAwardCoveragePointsWithoutSeparatePromotionGate=true

The later execution gate must define how PM will confirm success, partial success, or rollback need after one bounded attempt.

## Missing Evidence Classification

Current classification for PM review:

- sourceRightsClassification=pending_pm_review_or_accepted_reference_required
- fieldContractClassification=pending_pm_review_or_accepted_reference_required
- sanitizedCandidateArtifactClassification=pending_pm_review_or_accepted_reference_required
- rollbackReadbackPostRunClassification=must_be_ready_before_execution_gate
- operatorExecutionValuesClassification=not_required_for_this_review_step
- SupabaseWriteClassification=not_allowed_in_this_review_step

If any required evidence is absent, the decision should be `needs-repair` rather than accepted.

## Next Data Route

If PM records accepted:

`prepare_one_attempt_runner_execution_gate_no_execution`

If PM records rejected:

`repair_authorization_packet_or_proof_bundle`

If PM records needs-repair:

`complete_twii_pm_auth_review_missing_data_evidence_without_execution`

The next route must stay non-executing until a separate PM/operator gate names a future bounded attempt, execution switch, confirmation phrase, credential handling rule, rollback plan, readback plan, and post-run review plan.

## Stop Lines

- sqlExecuted=false
- supabaseConnectionAttempted=false
- supabaseWriteAllowedNow=false
- stagingRowsCreated=false
- dailyPricesMutationAllowedNow=false
- marketDataFetched=false
- marketDataIngested=false
- rawMarketDataStored=false
- rawMarketDataCommitted=false
- secretsPrinted=false
- readonlyRerunAllowed=false
- publicDataSource=mock
- scoreSource=mock

This checklist is evidence support only. It must not be used as an execution instruction.
