# A1 TWII One-Attempt Authorization Intake Inputs

Status: `a1_twii_one_attempt_authorization_intake_inputs_ready_reference_only`

Date: 2026-06-11

Owner lane: A1 Data / Supabase / Market Evidence

Purpose: no-secret/reference-only input consolidation for the PM mainline `TWII one-attempt authorization intake preflight` after the final execution packet. This document only lists safe intake inputs and authorization decision vocabulary. It does not authorize execution.

This A1 document does not read env values, read phrase values, read candidate rows, connect to Supabase, import `@supabase/supabase-js`, execute SQL, create staging rows, write `daily_prices`, accept rows, perform row coverage scoring, fetch market data, import market data, ingest market data, output secrets, output env values, output raw payloads, output row payloads, output stock-id payloads, change `publicDataSource`, change `scoreSource`, or edit any PM mainline gate/checker/status/board/package file.

明確邊界：這份 A1 文件不讀 env 值、不讀 phrase value、不讀候選 rows、不接 Supabase、不寫 `daily_prices`。

## Fixed Intake Inputs

| Field | Required safe input |
| --- | --- |
| `sourceFinalPacketGatePath` | `data/source-gates/twii-final-execution-packet-preflight.json` |
| `targetTable` | `daily_prices` |
| `targetLane` | `TWII` |
| `targetScope` | `twii_index_daily_prices_missing_rows` |
| `maxRows` | `60` |
| `candidateArtifactPath` | `data/candidates/twii-sanitized-candidate.json` |
| `candidateArtifactPolicy` | `reference_only_no_candidate_rows_read` |
| `requiredExecuteSwitchName` | `TWII_ONE_ATTEMPT_EXECUTE` |
| `requiredConfirmationPhraseName` | `TWII_ONE_ATTEMPT_CONFIRMATION_PHRASE` |
| `requiredConfirmationPhraseReference` | `CEO_AUTHORIZES_ONE_TWII_WRITE_ATTEMPT_20260610_A` |

The candidate artifact path is reference-only. This intake file may name `data/candidates/twii-sanitized-candidate.json`, but it must not read, print, copy, transform, validate, accept, or regenerate candidate rows or row payloads.

## Authorization Decision Vocabulary

The PM mainline authorization intake preflight may use only these authorization decision values:

| Decision value | Meaning for this intake |
| --- | --- |
| `accepted` | The named final packet gate and one-attempt authorization references are accepted for PM mainline processing, without exposing secrets or row payloads. |
| `rejected` | The authorization intake is denied and must not proceed to an execution attempt. |
| `repair_required` | The intake is incomplete or inconsistent and requires bounded repair before any later decision. |
| `expired_or_not_current` | The referenced final packet gate, candidate artifact reference, execute-switch requirement, confirmation phrase reference, or decision context is no longer current. |

No other decision vocabulary is introduced by this A1 file.

## Required No-Secret Requirement References

The authorization intake may name requirement names and the fixed confirmation phrase reference only:

| Requirement | Allowed reference |
| --- | --- |
| Execute switch requirement name | `TWII_ONE_ATTEMPT_EXECUTE` |
| Confirmation phrase requirement name | `TWII_ONE_ATTEMPT_CONFIRMATION_PHRASE` |
| Confirmation phrase reference label | `CEO_AUTHORIZES_ONE_TWII_WRITE_ATTEMPT_20260610_A` |

This document must not request, read, print, store, derive, validate, or compare the execute switch value or confirmation phrase value. It must not read `.env`, process env, credential files, local secrets, Supabase URLs, Supabase keys, dashboard links, or credential-derived strings.

## Boundary Locks

The authorization intake preflight remains bounded to `targetLane=TWII`, `targetScope=twii_index_daily_prices_missing_rows`, `targetTable=daily_prices`, and `maxRows=60`. It must not expand to ETFs, Taiwan equity symbols, other index lanes, unrelated `daily_prices` ranges, staging tables, source promotion, public data source switching, real scoring, row coverage scoring, launch readiness, rollback execution, or post-run review execution.

Hard stop-lines for this A1 task:

- SQL execution is not allowed.
- Supabase connection, Supabase read, Supabase write, and Supabase client import are not allowed.
- `@supabase/supabase-js` import is not allowed.
- Secrets, env values, raw payloads, row payloads, stock-id payloads, candidate rows, and market-source payloads must not be read or output.
- Market data fetch, import, ingest, storage, or refresh is not allowed.
- Staging rows must not be created.
- `daily_prices` must not be modified.
- Candidate rows must not be accepted.
- Row coverage scoring must not be performed.
- `publicDataSource` and `scoreSource` must not be changed.
- PM mainline gate/checker/status/board/package files must not be modified.

## Safe Output Shape

This A1 file supports a future PM mainline intake checker by providing only:

- the final packet gate reference path,
- fixed target table/lane/scope/max-row inputs,
- the candidate artifact path as reference-only,
- execute-switch and confirmation-phrase requirement names,
- the fixed confirmation phrase reference label,
- the accepted authorization decision vocabulary,
- explicit no-secret/no-Supabase/no-write/no-row-payload boundaries.

Any later execution attempt requires a separate PM mainline authorization flow outside this A1 reference-only document.
