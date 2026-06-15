# TWII Operator No-Secret Intake Instructions

Status: `twii_operator_no_secret_intake_instructions_ready_no_execution`

Owner: CEO / PM mainline

Purpose: give the future TWII operator a short no-secret instruction sheet for the next external-value step. This document is an instruction surface only. It does not collect values, store values, execute SQL, connect to Supabase, mutate `daily_prices`, accept candidate rows, promote public data, enable real scoring, approve legal terms, or provide investment advice.

## Current Position

The TWII data-online path is ready up to final stopline and server-only pre-execution preparation, but it is still blocked waiting for external operator values.

Current verified gates:

- `twii_operator_values_intake_readiness_surface_gate_preflight_ready_no_execution`
- `twii_operator_values_shape_recheck_gate_preflight_ready_no_execution`
- `twii_final_authorization_stopline_go_no_go_gate_ready_no_execution`
- `twii_server_only_pre_execution_integration_gate_ready_no_execution`

Current runtime boundary:

- `publicDataSource=mock`
- `scoreSource=mock`
- `runnerExecutableNow=false`
- `executionAllowedNow=false`
- `writeGateExecutableNow=false`

## External-Only Values

The operator must handle these outside Git, logs, screenshots, comments, local artifacts, and status documents:

1. real operator decision status;
2. real operator attestation;
3. explicit execute switch value;
4. explicit confirmation phrase value;
5. server-only credential presence result.

PM may only record presence/shape outcomes such as `provided`, `missing`, `rejected`, `repair_required`, or `deferred`. PM must not record the value bodies.

## PM-Refreshable Values

PM may refresh these local-safe facts before the operator review:

1. git status;
2. git commit id;
3. focused local gate status;
4. beta runtime fast health status;
5. TypeScript status;
6. mock runtime boundary status.

These facts are not execution approval. They are only current-state checks that help the operator decide whether to proceed, defer, reject, or request repair.

## Never-Store Values

The following must never be stored, echoed, compared, hashed, committed, pasted into files, or printed in command output:

- credentials;
- secrets;
- env values;
- authorization values;
- confirmation phrase values;
- execute switch values;
- real decision values;
- row bodies;
- trade date lists;
- market values;
- source payloads;
- raw payloads;
- stock-id payloads;
- candidate rows;
- Supabase responses that include protected values.

## Operator Reply Shape

The operator reply should be kept outside this repository. If PM later records an outcome, record only this shape:

- `decisionPresence`: `provided | missing | rejected | repair_required | deferred`
- `attestationPresence`: `provided | missing | rejected | repair_required | deferred`
- `executeSwitchPresence`: `provided | missing | rejected | repair_required | deferred`
- `confirmationPhrasePresence`: `provided | missing | rejected | repair_required | deferred`
- `serverOnlyCredentialPresence`: `provided | missing | rejected | repair_required | deferred`
- `safeOutcomeSummary`: sanitized one-sentence reason, no values

Only after a separate PM review accepts this presence/shape outcome may PM run the next shape recheck route:

`operator_supplies_external_values_then_pm_runs_pre_execution_readiness_recheck`

## Stop Lines

Do not proceed if any of these would be required:

- print or store external value bodies;
- read or echo secrets;
- run SQL;
- connect to Supabase;
- write Supabase;
- create staging rows;
- mutate `daily_prices`;
- fetch or ingest market data;
- accept candidate rows as real data;
- award row coverage points;
- set `publicDataSource=supabase`;
- set `scoreSource=real`;
- claim real-time precision, complete production data, investment advice, or guaranteed outcome.

## Next PM Action

When the operator is ready, PM should run the existing no-execution readiness checks first:

- `cmd.exe /c npm run check:twii-operator-values-intake-readiness-surface-gate-preflight`
- `cmd.exe /c npm run check:twii-operator-values-shape-recheck-gate-preflight`
- `cmd.exe /c npm run check:twii-final-authorization-stopline-go-no-go-gate`
- `cmd.exe /c npm run check:twii-server-only-pre-execution-integration-gate`

If those checks remain green, PM may ask the operator for the external-only values outside the repo. PM must not paste those values back into tracked files.
