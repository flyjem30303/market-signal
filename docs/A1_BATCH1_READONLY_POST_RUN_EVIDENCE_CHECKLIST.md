# A1 Batch1 Readonly Post-Run Evidence Checklist

Updated: 2026-06-12

Status: `a1_batch1_readonly_post_run_evidence_checklist_prepared_no_execution`

Owner: A1 Data / Supabase / Market Evidence

## Purpose

This checklist defines how PM should accept or block evidence after the next exactly-one bounded readonly attempt.

It is preparation only. This file does not execute SQL, connect to Supabase, write Supabase, create staging rows, mutate `daily_prices`, fetch market data, store market data, commit market data, print secrets, record authorization values, promote `publicDataSource=supabase`, or set `scoreSource=real`.

## Accepted Aggregate-Only Output Fields

PM may accept only sanitized, aggregate-only fields from the post-run evidence packet:

| Field | Accepted shape | Acceptance note |
| --- | --- | --- |
| `attemptId` | Non-secret local attempt label | Must not include credentials, URLs, authorization text, or real decision values. |
| `attemptScope` | Bounded readonly scope label | Must identify the approved slice only, not a broad data dump. |
| `executionCount` | Integer | Must equal `1`. |
| `status` | `ok`, `blocked`, or `preflight_blocked` | Classification rules are below. |
| `outcome` | Sanitized outcome label | Must describe aggregate outcome only. |
| `readonlyAttempted` | Boolean | `true` only when the single bounded readonly attempt actually ran. |
| `connectionAttempted` | Boolean | Allowed only as a yes/no safety assertion. |
| `readAttempted` | Boolean | Allowed only as a yes/no safety assertion. |
| `aggregateStatusOnly` | Boolean | Must be `true`. |
| `boundedObjectLabels` | Approved table or route labels only | May name the bounded objects reviewed, but must not include row data or stock-id payloads. |
| `expectedAggregateRows` | Count or `null` | Aggregate count only; no row identities. |
| `observedAggregateRows` | Count or `null` | Aggregate count only; no row identities. |
| `missingAggregateRows` | Count or `null` | Aggregate count only; no row identities. |
| `sanitizedErrorCode` | Short code or `null` | No URL, credential, header, SQL text, or payload excerpt. |
| `blockedReason` | Sanitized reason label or short summary | Must be safe to paste in PM docs. |
| `safety` | Boolean assertions | All prohibited-action flags must remain false. |
| `outputPolicy` | Boolean assertions | All forbidden-output flags must remain false. |
| `publicDataSource` | `mock` | Any `supabase` value is not accepted. |
| `scoreSource` | `mock` | Any `real` value is not accepted. |
| `nextRecommendedSlice` | Local governance label | Must not authorize retry, write, ingestion, scoring, or promotion by itself. |

## Prohibited Fields

The post-run evidence packet is not acceptable if it includes any of the following:

- SQL text, SQL result rows, query text, query parameters, or database console output.
- Supabase URL, dashboard URL, project URL, anon key, service-role key, bearer token, authorization header, cookie, credential, env value, or confirmation phrase.
- Raw market data, raw source payloads, copied vendor text, copied contract text, row payloads, stock-id payloads, row identifiers, row-level dates, OHLC values, prices, volumes, or per-symbol values.
- Any staging row body, candidate row body, insert/update/delete/merge payload, or `daily_prices` mutation proof.
- `publicDataSource=supabase`, `scoreSource=real`, row coverage points awarded, real public-data promotion, investment decision values, or production readiness claims.
- Any retry output from a second attempt in the same authorization window.

## Classification Rules

Use exactly one classification.

| Classification | Meaning | Required conditions |
| --- | --- | --- |
| `ok` | The exactly-one bounded readonly attempt ran and returned accepted aggregate-only evidence. | `executionCount=1`; readonly/read assertions are true; all write, SQL, ingestion, raw-output, secret-output, promotion, and real-score assertions are false; output contains only accepted aggregate fields; no retry occurred. |
| `blocked` | The exactly-one bounded readonly attempt ran, but the aggregate evidence does not clear the data gate. | `executionCount=1`; the packet remains sanitized and aggregate-only; failure, incomplete count, unreachable object, denied access, stale object, or insufficient aggregate coverage is recorded without forbidden fields. |
| `preflight_blocked` | No readonly attempt should be treated as executed. | Preconditions, authorization shape, command boundary, credential-presence posture, output policy, or safety assertions were missing or unsafe before the attempt. `readonlyAttempted` must be `false`. |

If any prohibited field appears after an attempted run, PM should classify the packet as `blocked` for safety review, reject the evidence for acceptance, and require a new PM decision before any future attempt. A safety-blocked packet never authorizes retry from this same attempt window.

## Post-Run Review Required Assertions

PM acceptance requires every assertion below to be explicitly present in the post-run review:

- Exactly one bounded readonly attempt was reviewed.
- No retry was executed.
- No SQL was executed.
- No Supabase write was attempted.
- No staging rows were created.
- No `daily_prices` rows were inserted, updated, deleted, merged, or otherwise mutated.
- No market data was fetched, ingested, stored, or committed by this attempt.
- No raw payload, row payload, stock-id payload, row-level value, or copied source text was printed.
- No secrets, env values, credentials, URLs with secrets, authorization headers, confirmation phrases, or real decision values were printed.
- Runtime remained `publicDataSource=mock`.
- Score source remained `scoreSource=mock`.
- Row coverage points were not awarded.
- Candidate rows were not accepted.
- Public source promotion was not performed.
- Any error or blocked reason was sanitized to a short label or safe summary.
- The packet states whether the result is `ok`, `blocked`, or `preflight_blocked`.
- The packet states what remains blocked after the attempt.

## What Remains Blocked After Attempt

Even if the post-run evidence is classified `ok`, the following remain blocked until a separate PM/CEO-approved gate explicitly changes them:

- Supabase writes.
- SQL execution.
- staging row creation.
- `daily_prices` mutation.
- market-data fetch, ingest, storage, or commit.
- raw payload, row payload, stock-id payload, and row-level value output.
- candidate row acceptance.
- row coverage scoring or point awards.
- source-rights approval beyond the evidence already accepted.
- public runtime promotion to `publicDataSource=supabase`.
- score promotion to `scoreSource=real`.
- production, investment, or launch-readiness claims based only on this attempt.
- retry of the readonly attempt without a new bounded decision.

If the result is `blocked`, PM may accept only that a compliant exactly-one readonly attempt happened and produced sanitized aggregate evidence. PM must not treat `blocked` as permission to repair by writing, fetching, retrying, or promoting.

If the result is `preflight_blocked`, PM should treat the attempt as not consumed only if no remote connection or readonly query occurred. PM must still require a fresh bounded decision before any later execution path.

## PM Acceptance Checklist

PM should accept the post-run evidence only when all items are checked:

- [ ] Evidence packet path and attempt label match the approved Batch1 bounded readonly scope.
- [ ] `executionCount` is `1`, or classification is `preflight_blocked` with `readonlyAttempted=false`.
- [ ] Classification is one of `ok`, `blocked`, or `preflight_blocked`.
- [ ] Output fields are limited to the accepted aggregate-only fields above.
- [ ] No prohibited field appears in the packet, logs, copied summary, or linked local artifact.
- [ ] All prohibited-action assertions are false.
- [ ] Runtime remains `publicDataSource=mock`.
- [ ] Score source remains `scoreSource=mock`.
- [ ] No retry was executed or implied.
- [ ] The review states the exact remaining blockers after the attempt.
- [ ] PM next step is a local governance route, not a write, retry, ingestion, score, or public promotion.
- [ ] A1 and PM both understand that this checklist prepares acceptance review only; it is not authorization to run the attempt.

## Stop Line

This document is local documentation only. It does not run the bounded readonly attempt and does not authorize anyone to bypass the exactly-one attempt boundary.
