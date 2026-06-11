# A1 Decision Value Fixture Validator Prerequisites

Updated: 2026-06-11

Status: `a1_decision_value_fixture_validator_prerequisites_reference_only_no_execution`

## Purpose

This reference-only checklist prepares PM's future `TWII decision value fixture intake validator gate`.

It defines what a safe fixture intake validator must require, accept, reject, or route to repair before any later PM gate treats a fixture as reviewable.

This document is not an execution packet. It does not validate real values, read fixture payloads, fetch market data, run SQL, connect to Supabase, write staging rows, mutate `daily_prices`, promote `publicDataSource=supabase`, or set `scoreSource=real`.

## Scope

Allowed scope:

- define prerequisite checks for a future fixture intake validator;
- define accepted, rejected, and repair-required fixture classes;
- define allowed and disallowed field categories;
- define fail-closed malformed fixture cases;
- define aggregate readback readiness expectations;
- define rollback readiness expectations;
- define operator stop conditions.

Out of scope:

- executing the validator;
- reading real decision values;
- reading raw payload, row payload, stock-id payload, secrets, env, authorization text, or confirmation phrases;
- creating, importing, or normalizing market-data rows;
- writing any database table;
- changing runtime source flags.

## Fixture Intake Validation Prerequisites

Before PM can use a TWII decision value fixture intake validator gate, the following prerequisites must be true:

| Prerequisite | Required state |
| --- | --- |
| Gate purpose | Validator is limited to intake classification and fail-closed reporting. |
| Data posture | Fixture review remains aggregate-only and no-secret. |
| Source posture | No market-data retrieval, raw source fetch, or source-derived row construction occurs. |
| Runtime posture | `publicDataSource=mock` and `scoreSource=mock` remain unchanged. |
| Write posture | No staging rows, `daily_prices` writes, production writes, or merge actions occur. |
| Payload posture | Raw payload, row payload, stock-id payload, env, secrets, authorization text, confirmation phrases, and real decision values are not read. |
| Output posture | Output may contain only fixture classification, schema-level field names, aggregate counts, and stop-condition labels. |
| PM review posture | Accepted means "safe for PM review", not "data accepted", "coverage scored", or "runtime promoted". |
| Failure posture | Any ambiguity, malformed shape, forbidden field, or forbidden runtime/write signal fails closed. |

## Fixture Case Classification

The validator should classify every intake fixture into exactly one of these result classes.

| Class | Meaning | PM action |
| --- | --- | --- |
| `accepted` | Fixture shape is complete, aggregate-only, no-secret, and contains only allowed fields. | PM may review the aggregate fixture summary in a later non-executing gate. |
| `repair_required` | Fixture is non-dangerous but incomplete, inconsistent, or missing required metadata. | PM/A1 may request a corrected fixture shape without reading forbidden values. |
| `rejected` | Fixture includes forbidden fields, executable/write intent, raw or row-level payload indicators, real-value exposure, or unsafe runtime promotion signals. | Stop and do not route the fixture to PM review. |
| `malformed_fail_closed` | Fixture cannot be parsed or cannot be safely classified without inspecting forbidden content. | Stop and treat as blocked until a safe aggregate-only fixture is supplied. |

## Accepted Fixture Cases

A fixture may be classified as `accepted` only when all of the following are true:

- contains a PM-recognizable fixture id or gate id;
- identifies lane as `TWII` and fixture purpose as decision-value intake validation;
- includes schema-level field names but no real field values;
- includes aggregate counts only, such as expected fixture count, accepted count, rejected count, and repair-required count;
- states `sanitizedAggregateOnly=true`;
- states raw payload, row payload, stock-id payload, secrets, env, authorization text, confirmation phrase, and real decision values are absent;
- states no SQL, no Supabase connection, no staging rows, no `daily_prices` writes, and no runtime promotion occurred;
- preserves `publicDataSource=mock`;
- preserves `scoreSource=mock`;
- includes an operator-visible stop-condition status.

## Repair-Required Fixture Cases

A fixture should be classified as `repair_required` when it is safe to describe but not ready for PM review.

Examples:

- missing fixture id or gate id;
- missing lane label;
- missing aggregate count fields;
- count totals do not reconcile at the aggregate level;
- missing no-secret declaration;
- missing aggregate-only declaration;
- missing explicit `publicDataSource=mock` or `scoreSource=mock` posture;
- missing stop-condition status;
- missing rollback-readiness status;
- uses an outdated gate status label but contains no forbidden payload indicators.

Repair-required classification must not require reading real decision values or row-level content.

## Rejected Fixture Cases

A fixture must be classified as `rejected` when any of the following are present:

- real decision values;
- raw payload;
- row payload;
- stock-id payload;
- env, secrets, service-role keys, tokens, credentials, authorization phrases, or confirmation phrases;
- SQL intended for execution;
- Supabase client import or connection intent, including `@supabase/supabase-js`;
- market-data fetch, ingest, store, normalize, or commit intent;
- staging row creation intent;
- `daily_prices` write, merge, upsert, delete, or repair intent;
- `publicDataSource=supabase`;
- `scoreSource=real`;
- row coverage scoring claim;
- public launch completion claim;
- any source redistribution or source-rights acceptance claim not already approved by PM/CEO.

## Allowed Field Checklist

The future validator may inspect or report these field categories only:

- fixture id;
- gate id;
- fixture version;
- lane label;
- asset type label;
- symbol label;
- validator status label;
- aggregate expected fixture count;
- aggregate accepted fixture count;
- aggregate rejected fixture count;
- aggregate repair-required fixture count;
- aggregate malformed count;
- schema-level field-name list;
- allowed-field checklist status;
- disallowed-field checklist status;
- sanitized aggregate-only status;
- no-secret status;
- no-raw-payload status;
- no-row-payload status;
- no-stock-id-payload status;
- no-real-decision-values status;
- no-SQL status;
- no-Supabase status;
- no-write status;
- mock runtime posture status;
- aggregate readback readiness status;
- rollback readiness status;
- operator stop-condition status.

## Disallowed Field Checklist

The future validator must fail closed if it sees or needs any of these field categories:

- real decision value;
- raw source body;
- raw market-data response;
- row-level market-data values;
- stock id payload;
- source URL containing credentials or query tokens;
- env var names or values used for access;
- secrets, keys, tokens, cookies, or credentials;
- authorization phrase;
- confirmation phrase;
- SQL body intended for execution;
- Supabase URL, key, client config, or imported client module;
- staging row body;
- `daily_prices` row body;
- write result body;
- rollback execution credential;
- operator identity credential;
- production promotion flag beyond mock posture.

## Fail-Closed Malformed Fixture Cases

The validator must return `malformed_fail_closed` when a fixture:

- is empty;
- is not parseable by the expected fixture parser;
- has multiple incompatible top-level fixture shapes;
- has duplicate status fields with conflicting values;
- has aggregate counts that cannot be reconciled;
- contains unknown top-level payload containers;
- uses encoded, compressed, encrypted, or obfuscated content;
- references external files or URLs that would need to be opened;
- requires network access to classify;
- requires database access to classify;
- requires reading hidden fields, env, secrets, raw values, or real decision values to classify;
- includes a pass label while any required no-secret, no-raw, no-row, no-stock-id, no-write, or mock-runtime declaration is missing.

Malformed fixtures are blocked by default. The safe next action is to request a replacement aggregate-only fixture shape.

## Aggregate Readback Readiness

The validator gate is readback-ready only when it can produce a PM-readable aggregate summary with:

- total fixtures reviewed;
- accepted fixture count;
- rejected fixture count;
- repair-required fixture count;
- malformed fail-closed count;
- allowed-field checklist pass/fail;
- disallowed-field checklist pass/fail;
- no-secret/no-payload posture;
- no-write/no-runtime-promotion posture;
- operator stop-condition status.

Aggregate readback readiness does not mean:

- source data is accepted;
- row coverage is scored;
- TWII rows are ready for write;
- `daily_prices` is ready for mutation;
- runtime source is promoted;
- public copy may claim real data.

## Rollback Readiness

Rollback readiness for this reference-only validator means the system can abandon or replace the fixture without persistent side effects.

Required rollback posture:

- no database write occurred;
- no staging row was created;
- no `daily_prices` row was inserted, updated, deleted, or merged;
- no source file with raw or row-level values was committed;
- no env, secret, authorization text, or confirmation phrase was read or persisted;
- no runtime flag was changed;
- no PM acceptance state was advanced beyond fixture-shape review;
- rejected or malformed fixture summaries can be archived as labels and aggregate counts only.

Because this gate is no-execution and no-write, rollback should be a documentation/state reset, not a data repair operation.

## Operator Stop Conditions

The operator must stop immediately if any of the following conditions appear:

- a step would run SQL;
- a step would connect to Supabase;
- a step would import `@supabase/supabase-js`;
- a step would read env, secrets, authorization text, confirmation phrase, or real decision values;
- a step would read raw payload, row payload, or stock-id payload;
- a step would fetch market data;
- a step would write, merge, repair, or delete `daily_prices`;
- a step would create staging rows;
- a step would set `publicDataSource=supabase`;
- a step would set `scoreSource=real`;
- a fixture cannot be classified without forbidden inspection;
- an accepted result would be interpreted as production data acceptance, coverage scoring, runtime promotion, or public launch completion.

## Reference-Only Hard Stop

This document:

- does not execute a validator;
- does not run SQL;
- does not connect to Supabase;
- does not import `@supabase/supabase-js`;
- does not read env, secrets, authorization text, confirmation phrases, or real decision values;
- does not read raw payload, row payload, or stock-id payload;
- does not fetch market data;
- does not write `daily_prices`;
- does not create staging rows;
- does not set `publicDataSource=supabase`;
- does not set `scoreSource=real`;
- does not authorize a bounded write attempt;
- does not approve production promotion.

