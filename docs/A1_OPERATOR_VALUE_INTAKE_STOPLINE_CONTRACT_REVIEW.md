# A1 Operator Value Intake Stopline Contract Review

Status: a1_operator_value_intake_stopline_contract_review_ready

## Scope

This A1 review covers the TWII operator value intake stopline preparation gate.
It is a local-only, contract-level review for the future bounded write attempt.
It does not authorize execution, does not collect real values, and does not
change runtime promotion state.

Bounded target scope:

- Symbol: TWII
- Target table: daily_prices
- Intended candidate window: 60 rows
- Candidate state: not accepted
- Runtime state: publicDataSource=mock, scoreSource=mock

## Value Classes

### External-Only Values

These values must be provided outside the repository and must never be inferred,
stored, printed, or committed by PM or A1:

- Operator authorization decision value
- Final go / no_go / repair_required decision value
- Confirmation phrase value
- Server-only credential value
- Any Supabase secret, service role key, database URL, token, or session secret
- Any real execution switch value that can trigger a write

Contract rule: the repository may contain field names, placeholders, and
presence checks only. It must not contain the actual values.

### PM-Refreshable Values

These values may be refreshed by PM as local, non-secret, non-payload metadata
when they do not disclose real credentials, raw market payloads, row payloads, or
stock-id payloads:

- Gate status labels
- Placeholder field names
- Bounded scope labels
- Review-only route names
- Blocked reason labels
- Aggregate-only readiness summaries
- Local checker output status
- Documentation references

Contract rule: PM-refreshable values must remain descriptive and aggregate-only.
They must not become executable inputs.

### Never-Store Values

These values must not be written to repo files, logs, reports, gate JSON, docs,
or committed artifacts:

- Secrets or environment values
- Authorization phrase or confirmation phrase
- Raw market payloads
- Row-level market payloads
- Stock-id payloads
- Real operator decision values
- Supabase write response payloads
- Any data that would allow reconstruction of raw source rows

Contract rule: if any never-store value is detected, the intake gate must fail
closed and stop before execution.

## Decision Options Placeholders

The future operator decision package may expose placeholders for exactly these
decision options:

- go
- no_go
- repair_required

These are placeholder labels only. The actual decision value must be supplied
outside the repository at the final authorized execution boundary.

## Required Presence Checks

The future operator value intake stopline must remain presence-only and
fail-closed unless all required presence checks are satisfied by an external
operator flow:

- Authorization presence
- Execute switch presence
- Confirmation phrase presence
- Server-only credential presence
- Rollback dry-run placeholder presence
- Aggregate readback placeholder presence
- Post-run review placeholder presence
- Duplicate rejection proof placeholder presence

Presence checks must verify that required surfaces exist. They must not print,
persist, compare, or expose actual values.

## Rollback / Readback / Post-Run / Duplicate Placeholders

The future execution attempt must not proceed unless the decision package keeps
separate placeholders for:

- Rollback dry-run plan
- Aggregate readback plan
- Post-run review plan
- Duplicate rejection proof

These placeholders define the required evidence shape after a future authorized
attempt. They do not authorize the attempt and do not accept candidate rows.

## Blocked Reasons

The gate must remain blocked when any of the following is true:

- External operator decision is missing
- Authorization presence is missing
- Execute switch presence is missing
- Confirmation phrase presence is missing
- Server-only credential presence is missing
- Rollback dry-run placeholder is missing
- Aggregate readback placeholder is missing
- Post-run review placeholder is missing
- Duplicate rejection proof placeholder is missing
- Candidate rows have not passed PM review
- Any raw payload, row payload, stock-id payload, secret, phrase, or real
  decision value is present in repo-visible artifacts
- publicDataSource would change from mock
- scoreSource would change from mock
- Any SQL, Supabase connection, or daily_prices mutation would occur from this
  preparation gate

## Next Route

Next review-only route:

- operator_value_intake_stopline_review_then_pm_integration_gate

This route is documentation and checker preparation only. It does not execute
SQL, connect to Supabase, accept candidate rows, or promote runtime data source.

## Fail-Closed Rules

The operator value intake stopline must fail closed when:

- Any required presence check is absent
- Any never-store value appears in a repo-visible artifact
- Any action would read secrets, env values, authorization values, confirmation
  phrase values, or real decision values
- Any action would fetch market data or read raw, row, or stock-id payloads
- Any action would mutate daily_prices or create staging rows
- Any action would set publicDataSource=supabase
- Any action would set scoreSource=real

Fail-closed means the only permitted output is a local blocked report and PM
integration notes.

## PM Integration Notes

- PM may use this file as the A1 contract input for the mainline
  operator-value-intake stopline preparation gate.
- PM should keep the mainline gate placeholder-only and presence-only.
- PM should verify that A1 and A2 reviews are referenced by path, not copied
  into executable command surfaces.
- PM should keep TWII, daily_prices, and 60 rows as bounded scope labels only
  until a separate authorized execution attempt is explicitly approved.
- PM must not treat this A1 review as authorization to execute.

## Hard Boundaries

- Do not run SQL.
- Do not connect to Supabase.
- Do not read secrets, env values, authorization values, confirmation phrases,
  or real decision values.
- Do not fetch market data.
- Do not read raw payloads, row payloads, or stock-id payloads.
- Do not modify daily_prices.
- Do not accept candidate rows.
- Do not set publicDataSource=supabase.
- Do not set scoreSource=real.
