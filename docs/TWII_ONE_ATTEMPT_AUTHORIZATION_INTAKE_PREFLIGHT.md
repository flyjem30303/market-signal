# TWII One-Attempt Authorization Intake Preflight

Status: `twii_one_attempt_authorization_intake_preflight_ready_no_execution`

Accepted outcome: `one_attempt_authorization_intake_ready_execution_still_blocked`

Gate: `data/source-gates/twii-one-attempt-authorization-intake-preflight.json`

## Purpose

This slice converts the accepted TWII final execution packet preflight into a CEO/PM authorization intake surface. It prepares the exact decision vocabulary and requirement names needed for a later bounded one-attempt review, without reading authorization values and without allowing execution.

This gate references `sourceFinalPacketGatePath=data/source-gates/twii-final-execution-packet-preflight.json`.

## Scope Lock

| Field | Value |
| --- | --- |
| targetTable | `daily_prices` |
| targetLane | `TWII` |
| targetScope | `twii_index_daily_prices_missing_rows` |
| maxRows | `60` |
| candidateArtifactPath | `data/candidates/twii-sanitized-candidate.json` |

The candidate artifact is reference-only. `candidateArtifactPath=data/candidates/twii-sanitized-candidate.json` is recorded, but candidate rows are not read.

## Prepared Intake

- `intakeMode=one_attempt_authorization_intake_preflight_no_execution`
- `authorizationIntakePrepared=true`
- `finalPacketReferenced=true`
- `operatorDecisionVocabularyPrepared=true`
- `executeSwitchRequirementReferenced=true`
- `confirmationPhraseRequirementReferenced=true`
- `requiredExecuteSwitchName=TWII_ONE_ATTEMPT_EXECUTE`
- `requiredConfirmationPhraseName=TWII_ONE_ATTEMPT_CONFIRMATION_PHRASE`
- `operatorDecisionVocabulary=[accepted,rejected,repair_required,expired_or_not_current]`

## Explicit Stop Lines

- `authorizationValuesRead=false`
- `executeSwitchValueRead=false`
- `confirmationPhraseValueRead=false`
- `candidateArtifactReferenceOnly=true`
- `candidateArtifactRowsRead=false`
- `rowPayloadRead=false`
- `rawPayloadRead=false`
- `authorizationAcceptedNow=false`
- `finalExecutionAllowedNow=false`
- `implementationAllowedNow=false`
- `sqlExecuted=false`
- `supabaseClientImported=false`
- `supabaseConnectionAttempted=false`
- `supabaseWritesEnabled=false`
- `supabaseReadsEnabled=false`
- `dailyPricesMutated=false`
- `candidateRowsAccepted=false`
- `runnerExecutableNow=false`
- `executionAllowedNow=false`
- `writeGateExecutableNow=false`

This preflight does not authorize SQL, Supabase connection, Supabase write, staging row creation, `daily_prices` mutation, candidate row acceptance, row coverage scoring, public source promotion, or real score promotion.

## Decision Meaning

`accepted` means the operator accepts the authorization intake shape for the next review step only. It does not execute the write attempt.

`rejected` means the final execution packet or authorization intake must be repaired.

`repair_required` means PM may continue local repairs without any runtime execution.

`expired_or_not_current` means PM must refresh the final execution packet preflight before any future execution path.

## Next Route

If accepted, the next local route is `prepare_bounded_one_attempt_execution_review_without_connecting_supabase`.

If rejected, the route is `repair_final_execution_packet_or_authorization_intake`.

If expired, the route is `refresh_final_execution_packet_preflight_before_any_execution`.
