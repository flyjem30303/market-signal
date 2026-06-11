# A1 Operator Checklist Completion Simulator Contract Review

Status: `a1_operator_checklist_completion_simulator_contract_review_ready`

Date: 2026-06-11

Owner lane: A1 Data / Operator Checklist Completion Simulator Contract Line

Scope: `contract-only / simulated-completion-only / no-execution`

Purpose: review the field contract, completion criteria, status transition, and fail-closed stop lines for the planned PM mainline `TWII operator checklist completion simulator gate`. This document is for PM-readable contract review only. It does not complete a real checklist, accept real decision values, authorize execution, or promote any simulated result into a real accepted state.

This review does not execute SQL, connect to Supabase, import `@supabase/supabase-js`, create a Supabase client, call `.from`, `.insert`, `.update`, `.delete`, or `.upsert`, read env values, read secrets, read authorization values, read confirmation phrases, read real decision values, fetch market data, read raw payloads, read row payloads, read stock-id payloads, create staging rows, mutate `daily_prices`, accept candidate rows, set `publicDataSource=supabase`, set `scoreSource=real`, or authorize execution.

## Contract Inputs

The simulator gate may reference upstream checklist artifacts by path label, gate label, or schema role only. It must not read hidden values, row bodies, source payloads, raw payloads, stock-id payloads, candidate rows, market values, authorization values, confirmation phrases, secrets, or env values.

Allowed input posture:

| Input class | A1 review posture | Value access allowed |
| --- | --- | --- |
| Operator checklist schema | Schema-level reference only. Used to confirm required field names and safe status labels. | `false` |
| Operator checklist preflight output | Summary-level status reference only. Used to confirm whether required declarations exist. | `false` |
| Synthetic simulator fixture | Placeholder-only local fixture. Used to test simulator behavior without real values. | `false` |
| PM integration label | Path, gate name, or role label only. Used for routing future PM review. | `false` |

Any next step that requires value access is outside this review and must fail closed.

## Required Fields

The simulator gate should require these fields before it may emit `simulated_complete_for_future_review_only`.

| Field | Required contract state |
| --- | --- |
| `simulatorId` | Stable local simulator identifier. Must not encode hidden values, credentials, row keys, stock-id payloads, authorization values, confirmation phrases, or real decision values. |
| `gateKind` | Must identify the planned `twii_operator_checklist_completion_simulator_gate` or PM's exact gate label. |
| `sourceChecklistReference` | Path-label or checklist-label reference only. Must not require reading checklist bodies, payloads, candidate rows, or market data. |
| `sourceChecklistStatus` | Safe upstream status label only, expected to include `blocked_missing_real_values` for this transition review. |
| `targetSimulatorStatus` | Must use an allowlisted simulator status. For the reviewed completion route, the value is `simulated_complete_for_future_review_only`. |
| `completionMode` | Must state `simulated_completion_only` or an equivalent non-executing mode. |
| `completionCriteriaVersion` | Stable criteria version label so PM can tell which simulated completion contract was applied. |
| `requiredFieldsPresent` | Aggregate boolean only. It confirms contract fields exist; it must not prove real value presence. |
| `missingRealValuesStillMissing` | Must be `true` for this simulator route. The simulator must preserve the fact that real values remain missing. |
| `simulatedCompletionReasonSummary` | Sanitized schema-level explanation only. No values, payloads, row bodies, market data, secrets, authorization content, or confirmation phrases. |
| `simulatedCompletionReviewScope` | Must state `future_review_only`. |
| `pmReviewRequired` | Must be `true`. |
| `realAcceptanceRequiredSeparately` | Must be `true`. |
| `publicDataSource` | Must remain `mock`. |
| `scoreSource` | Must remain `mock`. |
| `executionAllowedNow` | Must be `false`. |
| `recordedAsReal` | Must be `false`. |
| `simulatedCompletionAcceptedAsReal` | Must be `false`. |
| `sqlExecuted` | Must be `false`. |
| `supabaseConnectionAttempted` | Must be `false`. |
| `supabaseReadsEnabled` | Must be `false`. |
| `supabaseWritesEnabled` | Must be `false`. |
| `marketDataFetched` | Must be `false`. |
| `marketDataIngested` | Must be `false`. |
| `dailyPricesMutated` | Must be `false`. |
| `stagingRowsCreated` | Must be `false`. |
| `candidateRowsAccepted` | Must be `false`. |
| `rawPayloadOutput` | Must be `false`. |
| `rowPayloadOutput` | Must be `false`. |
| `stockIdPayloadOutput` | Must be `false`. |
| `secretsOutput` | Must be `false`. |
| `envValueOutput` | Must be `false`. |

Recommended supporting safety fields:

- `contractOnly=true`
- `localOnly=true`
- `simulatorOnly=true`
- `placeholderOnly=true`
- `futureReviewOnly=true`
- `realValuesReadNow=false`
- `realValuesFilledNow=false`
- `realValuesAcceptedNow=false`
- `authorizationValuesRead=false`
- `confirmationPhraseValueRead=false`
- `sourcePayloadRead=false`
- `candidateRowsRead=false`
- `realRunAuthorized=false`

## Completion Criteria

The simulator may mark a checklist as `simulated_complete_for_future_review_only` only when all conditions below are true:

- All required simulator fields are present.
- `sourceChecklistStatus` is `blocked_missing_real_values`.
- `targetSimulatorStatus` is `simulated_complete_for_future_review_only`.
- `completionMode` is simulated-only and non-executing.
- `missingRealValuesStillMissing=true`.
- `pmReviewRequired=true`.
- `realAcceptanceRequiredSeparately=true`.
- `publicDataSource=mock`.
- `scoreSource=mock`.
- `executionAllowedNow=false`.
- `recordedAsReal=false`.
- `simulatedCompletionAcceptedAsReal=false`.
- All SQL, Supabase, write, payload, secret, env, market-data, staging-row, candidate-row, and `daily_prices` mutation flags remain false.
- The simulator can decide completion from field names, status labels, booleans, and sanitized schema-level summaries only.
- The simulator does not read, infer, derive, compare, fill, or validate any real decision value.

Completion criteria must be interpreted as checklist-shape completion only. They do not mean the underlying real decision inputs are complete.

## Status Transition

Reviewed transition:

| From status | To status | Allowed meaning |
| --- | --- | --- |
| `blocked_missing_real_values` | `simulated_complete_for_future_review_only` | The checklist has enough contract fields, declarations, and stop-line flags for PM to review the future real-intake workflow shape. Real values are still missing and no execution is authorized. |

Required transition semantics:

- The transition is allowed only inside the simulator gate.
- The transition must preserve `missingRealValuesStillMissing=true`.
- The transition must preserve `publicDataSource=mock` and `scoreSource=mock`.
- The transition must preserve `executionAllowedNow=false`, `recordedAsReal=false`, and `simulatedCompletionAcceptedAsReal=false`.
- The transition must not fill missing real values.
- The transition must not read hidden values to prove completion.
- The transition must not accept candidate rows, create staging rows, mutate `daily_prices`, or produce row bodies.
- The transition must not become an input that a later gate treats as `accepted`, `real_accepted`, `completed_for_execution`, `ready_to_write`, or `launch_ready`.

If any required guard is absent or contradictory, the simulator must stay blocked or route to a repair status such as `simulated_repair_required_before_future_review`.

## Fail-Closed Stop Lines

The simulator gate must fail closed if any of these conditions appear:

- The output claims, maps, aliases, or implies `simulated_complete_for_future_review_only` equals `accepted`, `real_accepted`, `operator_accepted`, `ready_to_write`, `ready_to_execute`, `launch_ready`, or any real completion label.
- `missingRealValuesStillMissing` is absent or not `true`.
- `simulatedCompletionAcceptedAsReal=true`.
- `recordedAsReal=true`.
- `executionAllowedNow=true`.
- `publicDataSource=supabase`.
- `scoreSource=real`.
- SQL execution, Supabase connection, Supabase reads, or Supabase writes are requested or implied.
- The simulator asks to read or fill real decision values, authorization values, confirmation phrases, env values, secrets, raw payloads, row payloads, stock-id payloads, candidate rows, source payloads, market data, or row bodies.
- The simulator asks to fetch or ingest market data.
- The simulator asks to create staging rows, accept candidate rows, mutate `daily_prices`, or emit write results.
- The simulator emits raw payload output, row payload output, stock-id payload output, env output, or secret output.
- A completion reason requires inspecting forbidden values.
- A downstream integration treats the simulated completion as evidence of real acceptance.

These stop lines are hard blockers. They must not be bypassed by renaming fields, moving values into summaries, putting values into nested objects, or describing real values as placeholders.

## Simulated Completion Is Not Real Acceptance

`simulated_complete_for_future_review_only` is a review-routing label. It is not a real decision state.

It must not be used as:

- acceptance of real decision values.
- authorization to execute a runner.
- permission to connect to Supabase.
- proof that missing real values were supplied.
- proof that source rights, data coverage, row coverage, or market values are sufficient.
- permission to write or mutate `daily_prices`.
- permission to create staging rows.
- permission to accept candidate rows.
- permission to set `publicDataSource=supabase`.
- permission to set `scoreSource=real`.
- launch readiness evidence.

Any PM or automation handoff should display the label with the full wording `simulated_complete_for_future_review_only` and should keep the explanatory note: "future review only; not real accepted."

## PM Integration Notes

- PM may use this simulator result to check whether the operator checklist flow is understandable and ready for a future real-review conversation.
- PM must keep this result separate from real intake acceptance, real source approval, write readiness, launch readiness, and execution authorization.
- PM should require a separate real-acceptance gate before any real value is filled, accepted, or recorded.
- PM should require a separate authorization gate before any SQL, Supabase connection, market-data fetch, candidate-row acceptance, staging-row creation, or `daily_prices` mutation.
- PM-facing dashboards or review packets should show both `sourceChecklistStatus=blocked_missing_real_values` and `targetSimulatorStatus=simulated_complete_for_future_review_only` so the remaining real-value blocker is visible.
- If the PM workflow needs a shorter display label, it may use "simulated complete" only when the adjacent machine-readable status remains `simulated_complete_for_future_review_only` and the UI also states "future review only; not real accepted."
- Any downstream gate consuming this status must re-check the stop-line booleans and must fail closed if the status is promoted, aliased, or treated as real acceptance.

## A1 Review Outcome

A1 contract review outcome: `ready_for_pm_integration_as_simulator_contract_only`.

The planned gate may implement the reviewed transition from `blocked_missing_real_values` to `simulated_complete_for_future_review_only` only under the required fields, completion criteria, and fail-closed stop lines above. This outcome does not authorize SQL, Supabase, real data access, market-data access, `daily_prices` mutation, candidate-row acceptance, real scoring, or real decision acceptance.
