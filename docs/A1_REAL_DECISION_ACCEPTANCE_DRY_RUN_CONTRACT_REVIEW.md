# A1 Real Decision Acceptance Dry-Run Contract Review

Status: `a1_real_decision_acceptance_dry_run_contract_review_ready`

Date: 2026-06-11

Owner lane: A1 Data / Gate Contract Support Line

Scope: `contract-only / no-execution`

Purpose: review the field contract for the PM mainline `TWII real decision intake acceptance dry-run gate`. This document defines the safe fixture shape, allowed status labels, placeholder/value boundary, stop lines, and fail-closed readiness requirements for a local-only dry run that references `data/source-gates/twii-real-decision-intake-packet-template-gate-preflight.json` and `data/source-gates/twii-real-decision-intake-packet-template.blank.json`.

This review does not execute SQL, connect to Supabase, import `@supabase/supabase-js`, create a Supabase client, call `.from`, `.insert`, `.update`, `.delete`, or `.upsert`, read env values, read secrets, read authorization values, read confirmation phrases, read real decision values, fetch market data, read raw payloads, read row payloads, read stock-id payloads, create staging rows, mutate `daily_prices`, accept candidate rows, set `publicDataSource=supabase`, set `scoreSource=real`, or authorize execution.

## Contract Inputs Reviewed

The PM dry-run gate may reference these inputs by path and schema only:

| Input | A1 review posture | Value access allowed |
| --- | --- | --- |
| `data/source-gates/twii-real-decision-intake-packet-template-gate-preflight.json` | Source contract for allowed fields, disallowed fields, status labels, and safety booleans. | `false` |
| `data/source-gates/twii-real-decision-intake-packet-template.blank.json` | Blank placeholder template for dry-run fixture construction. | `false` |
| `data/candidates/twii-sanitized-candidate.json` | Path-label reference only when needed by PM. Candidate rows must not be read. | `false` |

Any next step that requires reading hidden values, row contents, source payloads, raw payloads, stock-id payloads, env, secrets, authorization, confirmation phrases, or real decision values is outside this review and must fail closed.

## Required Input Fields

The dry-run fixture should include these schema-level fields. Values may be placeholders, safe fixed labels, aggregate booleans, or mock-only safety labels only.

| Field | Required contract state |
| --- | --- |
| `fixtureKind` | Identifies the fixture as a local-only TWII real decision acceptance dry-run fixture. |
| `fixtureId` | Stable local dry-run fixture identifier. |
| `fixtureMode` | Must state `dry_run_only_no_execution` or equivalent non-executing mode. |
| `gateKind` | References `twii_real_decision_intake_acceptance_dry_run_gate` or PM's exact dry-run gate label. |
| `sourcePreflightPath` | Path-label reference to `data/source-gates/twii-real-decision-intake-packet-template-gate-preflight.json`. |
| `blankTemplatePath` | Path-label reference to `data/source-gates/twii-real-decision-intake-packet-template.blank.json`. |
| `targetLane` | `TWII` as a lane label only. |
| `targetTable` | `daily_prices` as a name-only reference; no row body or write permission. |
| `targetScope` | Scope label only, such as `twii_index_daily_prices_missing_rows`. |
| `decisionStatus` | One of `accepted`, `rejected`, or `repair_required`; no other status should pass. |
| `decisionRecordedByRole` | Role label only; no identity credential or authorization value. |
| `decisionRecordedAtLabel` | Review label or placeholder only; no secret-bearing timestamp source. |
| `decisionReasonSummary` | Sanitized summary only; no real decision value, row value, payload, secret, phrase, or authorization content. |
| `repairRequiredSummary` | Empty or sanitized repair summary only. Required when status is `repair_required`. |
| `publicDataSource` | Must remain `mock`. |
| `scoreSource` | Must remain `mock`. |
| `valuesFilledNow` | Must remain `false` unless PM uses the alternative `dryRunOnly=true` guard. |
| `dryRunOnly` | Recommended as `true` for the PM dry-run gate. |
| `candidateArtifactReferenceOnly` | Must be `true` if a candidate artifact path is referenced. |
| `candidateArtifactRowsRead` | Must be `false`. |
| `realDecisionValueReadNow` | Must be `false`. |
| `realDecisionValueRecordedNow` | Must be `false`. |
| `sqlExecuted` | Must be `false`. |
| `supabaseClientImported` | Must be `false`. |
| `supabaseConnectionAttempted` | Must be `false`. |
| `supabaseWritesEnabled` | Must be `false`. |
| `supabaseReadsEnabled` | Must be `false`. |
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

## Allowed Statuses

The dry-run fixture should accept exactly three status labels:

| Status | Meaning in dry run | Execution meaning |
| --- | --- | --- |
| `accepted` | Fixture shape is complete, no-secret, no-payload, mock-only, and safe for PM review. | None. It does not accept candidate rows, approve writes, or authorize a real run. |
| `rejected` | Fixture contains stop-line content or unsafe promotion/write/runtime intent. | None. It blocks the fixture. |
| `repair_required` | Fixture is safe to describe but incomplete, inconsistent, stale, or missing required schema-level metadata. | None. It requests a corrected fixture shape only. |

Any alternate label, pass label, launch label, write label, promotion label, row-coverage label, or real-run approval label must fail closed unless PM explicitly adds it to a separate reviewed contract.

## Fixture Case Contracts

### `accepted`

Required fields:

- `fixtureKind`
- `fixtureId`
- `fixtureMode`
- `gateKind`
- `sourcePreflightPath`
- `blankTemplatePath`
- `targetLane`
- `targetTable`
- `targetScope`
- `decisionStatus`
- `decisionRecordedByRole`
- `decisionRecordedAtLabel`
- `decisionReasonSummary`
- `publicDataSource`
- `scoreSource`
- `valuesFilledNow` or `dryRunOnly`
- all relevant safety booleans showing no execution, no Supabase, no write, no payload, no secret, no env, no row read, no market-data fetch, and no real decision value access

Required values or semantics:

- `decisionStatus="accepted"`
- `publicDataSource="mock"`
- `scoreSource="mock"`
- `valuesFilledNow=false` or `dryRunOnly=true`
- `candidateArtifactReferenceOnly=true` when the candidate artifact path is named
- `candidateArtifactRowsRead=false`
- `realDecisionValueReadNow=false`
- `realDecisionValueRecordedNow=false`
- `sqlExecuted=false`
- `supabaseClientImported=false`
- `supabaseConnectionAttempted=false`
- `dailyPricesMutated=false`
- `stagingRowsCreated=false`
- `candidateRowsAccepted=false`

Forbidden fields:

- `decisionSecretValue`
- `decisionValue`
- `authorizationValue`
- `confirmationPhraseValue`
- `executeSwitchValue`
- `credentialValue`
- `envValue`
- `rowBody`
- `tradeDateList`
- `sourcePayload`
- `rawPayload`
- `rowPayload`
- `stockIdPayload`
- `sql`
- `supabaseUrl`
- `supabaseKey`
- `writeResult`
- `personalizedAdvice`
- `buySellHoldSignal`

### `rejected`

Required fields:

- `fixtureKind`
- `fixtureId`
- `gateKind`
- `decisionStatus`
- `rejectionReasonCode`
- `stopConditionTriggered`
- `publicDataSource`
- `scoreSource`
- `valuesFilledNow` or `dryRunOnly`
- safety booleans sufficient to show the fixture was blocked without reading forbidden content

Required values or semantics:

- `decisionStatus="rejected"`
- `stopConditionTriggered=true`
- `publicDataSource="mock"`
- `scoreSource="mock"`
- `valuesFilledNow=false` or `dryRunOnly=true`
- rejection must be based on field presence, unsafe intent, malformed structure, missing required declarations, or forbidden status labels; it must not require reading a real decision value

Forbidden fields:

- any real decision value, authorization value, confirmation phrase, credential, env value, secret, raw payload, row payload, stock-id payload, source payload, market value, trade-date list, SQL body, Supabase client config, staging row body, `daily_prices` row body, write result body, or promotion value
- any field that claims `publicDataSource=supabase`, `scoreSource=real`, row coverage scoring, candidate row acceptance, write readiness, final execution readiness, or launch completion

### `repair_required`

Required fields:

- `fixtureKind`
- `fixtureId`
- `gateKind`
- `decisionStatus`
- `repairRequiredSummary`
- `missingOrInconsistentFields`
- `publicDataSource`
- `scoreSource`
- `valuesFilledNow` or `dryRunOnly`
- no-secret/no-payload/no-write/no-runtime-promotion declarations

Required values or semantics:

- `decisionStatus="repair_required"`
- `repairRequiredSummary` is sanitized and schema-level only
- `publicDataSource="mock"`
- `scoreSource="mock"`
- `valuesFilledNow=false` or `dryRunOnly=true`
- repair can be requested for missing fixture id, missing gate label, missing path references, missing status, missing safety booleans, unreconciled aggregate counts, stale gate label, or absent mock/mock declaration
- repair must not require reading rows, payloads, secrets, authorization, confirmation phrases, env, real decision values, SQL, or Supabase state

Forbidden fields:

- same forbidden value and payload fields as `accepted`
- any repair instruction that asks A1 or PM to fill a real decision value, validate hidden values, inspect candidate rows, generate row bodies, connect to Supabase, mutate `daily_prices`, or switch runtime/scoring source

## Placeholder and Value Boundary

The dry-run fixture may contain placeholders only when they are visibly non-executable and do not encode hidden values.

Allowed placeholder examples:

- `__DECISION_STATUS__`
- `__DECISION_RECORDED_BY_ROLE__`
- `__DECISION_RECORDED_AT_LABEL__`
- `__DECISION_REASON_SUMMARY__`
- `__REPAIR_REQUIRED_SUMMARY_OR_EMPTY__`
- `<PM_TO_FILL>`
- `<REFERENCE_ONLY>`
- `<VALUE_HIDDEN>`
- `<DECISION_VALUE_WITHHELD>`
- `<AUTHORIZATION_VALUE_WITHHELD>`
- `<CONFIRMATION_PHRASE_WITHHELD>`
- `<AGGREGATE_ONLY>`
- `<FAIL_CLOSED>`

Allowed fixed boundary labels:

- `publicDataSource=mock`
- `scoreSource=mock`
- `valuesFilledNow=false`
- `dryRunOnly=true`
- `promotionAllowed=false`
- `rowCoverageScoringAllowed=false`
- `executionAllowed=false`

Disallowed value boundary crossings:

- replacing a placeholder with a real decision value;
- printing, copying, comparing, deriving, or storing authorization or confirmation phrase values;
- reading env values, secret values, credentials, tokens, service-role keys, private URLs, or dashboard values;
- reading candidate rows, raw payloads, row payloads, source payloads, stock-id payloads, trade-date lists, per-date values, or market values;
- adding SQL, Supabase client configuration, write results, staging row bodies, or `daily_prices` row bodies;
- treating `accepted` as candidate-row acceptance, real-run authorization, row-coverage scoring, source promotion, or public launch readiness.

## Fail-Closed Stop Conditions

The dry-run gate must stop and return `rejected` or `repair_required` when any condition below is true, unclear, stale, or required to proceed:

- SQL execution or SQL preparation is requested.
- Supabase import, client creation, connection, read, write, or query-chain usage is requested.
- `.from`, `.insert`, `.update`, `.delete`, or `.upsert` usage is requested.
- Env, secret, credential, authorization, confirmation phrase, execute-switch, or real decision values must be read, printed, copied, compared, derived, or stored.
- Candidate rows, raw payloads, row payloads, source payloads, stock-id payloads, trade-date lists, per-date values, or market values must be read or output.
- Market data must be fetched, imported, ingested, transformed, refreshed, stored, or committed.
- Staging rows must be created, accepted, repaired, or used as proof.
- `daily_prices` must be inserted, updated, deleted, merged, upserted, repaired, or otherwise mutated.
- Candidate rows are treated as accepted.
- `publicDataSource=supabase` or `scoreSource=real` appears, is requested, or is implied.
- `valuesFilledNow=true` appears without a separate PM-reviewed real-value authorization gate.
- `dryRunOnly=false` appears in the dry-run fixture.
- A fixture includes forbidden fields, unknown payload containers, encoded/obfuscated content, external URLs requiring access, or multiple conflicting status labels.
- A pass/accepted label appears while required no-secret, no-payload, no-write, no-Supabase, no-market-fetch, mock-source, or dry-run-only declarations are missing.

Default posture: fail closed. Ambiguous fixtures are not accepted by default.

## Fail-Closed Readiness Checklist

| Check | Required answer |
| --- | --- |
| Contract scope remains local dry run only | `true` |
| Accepted statuses are limited to three labels | `accepted`, `rejected`, `repair_required` |
| Blank template values remain unfilled | `valuesFilledNow=false` or `dryRunOnly=true` |
| Public source remains mock | `publicDataSource=mock` |
| Score source remains mock | `scoreSource=mock` |
| Candidate artifact remains reference-only | `candidateArtifactReferenceOnly=true` when named |
| Candidate rows remain unread | `candidateArtifactRowsRead=false` |
| Real decision values remain unread and unrecorded | `realDecisionValueReadNow=false`, `realDecisionValueRecordedNow=false` |
| SQL remains absent | `sqlExecuted=false` |
| Supabase remains absent | no import, no client, no connection, no read, no write |
| Payloads remain absent | no raw, row, source, stock-id, or market payload output |
| Writes remain absent | no staging rows, no `daily_prices` mutation, no candidate row acceptance |
| Promotion remains locked | no `publicDataSource=supabase`, no `scoreSource=real`, no row coverage scoring |
| Failure mode remains closed | unsafe, malformed, incomplete, or expanded-scope fixtures are blocked or routed to repair |

## PM Integration Notes

- PM can use this A1 review as the field-contract checklist for a local-only dry-run gate.
- PM should keep the dry-run gate downstream of the existing template preflight and blank template references.
- PM should treat `accepted` as "fixture contract accepted for PM review only", not as data acceptance, write approval, source promotion, row coverage scoring, final execution approval, or launch readiness.
- PM should preserve `publicDataSource=mock`, `scoreSource=mock`, and `valuesFilledNow=false` or `dryRunOnly=true` in every dry-run fixture case.
- PM should keep all forbidden value fields absent rather than blank whenever possible; if a field must exist for schema reasons, it must use a value-hidden placeholder and remain non-executable.
- PM should route safe-but-incomplete fixtures to `repair_required`, unsafe fixtures to `rejected`, and only complete mock-only/no-secret/no-payload/no-write fixtures to `accepted`.
- PM should require a separate reviewed execution gate before any future real decision value, authorization value, Supabase connection, market-data operation, staging row, `daily_prices` mutation, candidate row acceptance, `publicDataSource=supabase`, or `scoreSource=real` action.

## A1 Review Result

`a1_real_decision_acceptance_dry_run_contract_review_ready`

The contract is ready for PM integration as a local-only, no-execution dry-run review artifact if PM preserves the required field set, the three allowed status labels, the placeholder/value boundary, the mock/mock posture, the `valuesFilledNow=false` or `dryRunOnly=true` guard, and the fail-closed stop conditions above.
