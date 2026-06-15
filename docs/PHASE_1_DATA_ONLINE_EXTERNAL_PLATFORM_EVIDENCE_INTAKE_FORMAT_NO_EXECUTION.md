# Phase 1 Data Online External Platform Evidence Intake Format - No Execution

## Status

`phase_1_data_online_external_platform_evidence_intake_format_no_execution_ready`

Packet mode: `external_platform_evidence_intake_format_no_execution`

`intake_format_ready`

This format defines how to record external platform evidence safely. It does not authorize Supabase connection, Supabase read/write, SQL, market-row fetch, source promotion, score promotion, or public real-data claims.

## Allowed Evidence Fields

`allowed_evidence_fields`

Use only these non-secret fields when later recording platform evidence:

- `evidenceItem`
- `observedState`
- `observedAtLocal`
- `operatorInitials`
- `nonSecretSummary`
- `riskDisposition`
- `followUpRequired`

Allowed examples are short non-secret summaries such as "schema cache visible in dashboard", "API exposure still blocked", or "PGRST205 not observed in bounded check". Do not include raw responses.

## Forbidden Evidence Fields

`forbidden_evidence_fields`

Do not record, paste, commit, print, or store these fields:

- `secretValue`
- `rawPayload`
- `rowPayload`
- `endpointResponseBody`
- `serviceRoleKey`
- `sqlStatement`

Any evidence packet containing those fields must be rejected before it reaches docs, logs, commits, or UI.

## Pending Evidence Items

These platform evidence items are still pending:

- `schema_cache_evidence_pending`
- `dashboard_api_exposure_evidence_pending`
- `pgrst205_regression_evidence_pending`
- `metadata_readiness_evidence_pending`
- `write_path_exposure_evidence_pending`

## Current Executable State

- `writeGateExecutableNow=false`
- `PUBLIC_RUNTIME_READY_BUT_DATA_ONLINE_NO_GO`
- `publicDataSource=mock`
- `scoreSource=mock`

This intake format is a recording structure only. It is not proof that evidence exists, and it does not make the write gate executable.

## Hard Boundaries

- No SQL
- No Supabase read or write
- No staging rows
- No `daily_prices` mutation
- No market-row fetch
- No raw payload output
- No source promotion
- No score promotion
- No public real-data claim
- No investment advice

## CEO Decision

Prepare a no-secret intake format because the platform evidence runner now reports all platform evidence as pending. The next high-value step is to ensure any later platform observation can be recorded without leaking secrets or raw payloads.

## PM Execution Record

This slice adds a document, checker, package script, and review-gate registration.

It does not include credential values, operator values, SQL, Supabase commands, endpoint responses, row payloads, raw market data, source promotion, score promotion, or public real-data claims.

## Next Route

Prepare an intake validator that can reject unsafe evidence packets locally before any evidence packet is accepted into status or docs.
