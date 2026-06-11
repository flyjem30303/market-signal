# PM Public Beta Batch 1 Bounded Readonly Decision Packet

Status: `pm_public_beta_batch1_bounded_readonly_decision_packet_ready_not_executed`

Date: 2026-06-12

Owner: PM mainline

Scope: Public Beta Index Status Dashboard, Batch 1 TWII + core ETF bounded readonly readiness

## 1. CEO Direction

The next useful move is not another broad governance map. The project should prepare the exact bounded readonly gate that would let PM/CEO decide whether to run one future aggregate-only readonly attempt.

This packet is a decision packet, not an execution packet.

It does not execute SQL, connect to Supabase, read Supabase, write Supabase, create staging rows, mutate `daily_prices`, fetch market data, store market data, print secrets, print raw payloads, accept candidate rows, award row coverage, promote `publicDataSource=supabase`, or set `scoreSource=real`.

## 2. Current Runtime Boundary

Current public and runtime posture remains:

- `publicDataSource=mock`
- `scoreSource=mock`
- public pages may describe Batch 1 as a readiness lane only
- no public real-data claim
- no real score claim
- no investment advice, trade instruction, or performance promise

## 3. Bounded Readonly Purpose

The only allowed future purpose is:

> Verify, in one separately authorized bounded readonly attempt, whether Batch 1 TWII + core ETF aggregate readiness can be observed without exposing row payloads, raw source payloads, protected identifiers, secrets, SQL text, or real decision values.

Allowed scope for a future attempt:

- aggregate availability status;
- aggregate row-count status;
- aggregate missing-session status;
- aggregate blocker reason;
- aggregate mock/real boundary flags;
- aggregate safety flags.

Not allowed:

- individual row values;
- exact market values;
- raw source payloads;
- row payloads;
- stock-id payloads or internal identifier lists;
- Supabase URL or keys;
- service role key, anon key, auth headers, env values;
- SQL text;
- candidate row bodies;
- writes, mutations, merges, deletes, staging rows, or backfill.

## 4. Preconditions Before Any Future Attempt

PM may present a future execution request only if all of these are true:

| Precondition | Required state before attempt |
| --- | --- |
| CEO-named attempt | CEO explicitly names one bounded readonly attempt for Batch 1. |
| Single-attempt limit | Attempt count is one; no retry in the same slice. |
| Preflight pass | Local preflight passes before any remote access is attempted. |
| Aggregate-only proof | Output contract allows only aggregate status and count fields. |
| No-write proof | Packet states no SQL, no writes, no staging rows, no `daily_prices` mutation. |
| Secret safety | Packet rejects secrets, env values, auth headers, raw payloads, row payloads, and protected identifiers. |
| Immediate post-run review | Sanitized post-run review must be recorded before any data-quality, coverage, source, score, or runtime decision. |
| Runtime lock | `publicDataSource=mock` and `scoreSource=mock` remain unchanged after the attempt. |

## 5. Allowed Aggregate Proof Fields

A future post-run review may include only these sanitized aggregate fields:

- `attemptStatus`
- `preflightStatus`
- `aggregateTargetLabel`
- `observedAggregateCount`
- `expectedAggregateCount`
- `missingAggregateCount`
- `duplicateAggregateCount`
- `rejectedAggregateCount`
- `sanitizedBlockerReason`
- `sourceRightsGateStatus`
- `fieldContractGateStatus`
- `cadenceMissingSessionGateStatus`
- `readonlySafetyFlags`
- `publicDataSource=mock`
- `scoreSource=mock`

The review must not include exact row contents, exact market values, source response bodies, raw payloads, credential material, SQL text, or reusable connection details.

## 6. Fail-Closed Conditions

The future attempt must stop before any remote access if:

- local preflight fails;
- the exact bounded purpose is missing;
- the attempt scope expands beyond Batch 1 TWII + core ETF aggregate proof;
- output contract requests row-level or raw-payload fields;
- any value would reveal secrets, env values, auth headers, or protected identifiers;
- any command implies SQL execution or mutation;
- any command implies staging rows or `daily_prices` changes;
- any command implies market-data fetch, ingestion, or storage;
- any result would be treated as runtime promotion;
- any result would set `publicDataSource=supabase` or `scoreSource=real`.

## 7. Post-Run Review Contract

If a future authorized attempt runs, PM must immediately record:

| Field | Required meaning |
| --- | --- |
| `attemptRecorded` | exactly one attempt was considered; `false` if preflight blocked |
| `remoteConnectionAttempted` | aggregate yes/no only |
| `sqlExecuted` | must be `false` |
| `supabaseWriteAttempted` | must be `false` |
| `dailyPricesMutated` | must be `false` |
| `rawPayloadPrinted` | must be `false` |
| `rowPayloadPrinted` | must be `false` |
| `secretsPrinted` | must be `false` |
| `publicDataSource` | must remain `mock` |
| `scoreSource` | must remain `mock` |
| `nextDecision` | `record_only`, `repair_blocker`, or `prepare_separate_write_gate` |

Readonly success is evidence for review only. It does not close source rights, field contract, cadence, write/backfill, public promotion, legal disclosure, row coverage, or real scoring.

## 8. A1 / A2 Work Assignment

| Lane | Assignment | PM expected intake |
| --- | --- | --- |
| A1 | Produce Batch 1 readonly proof delta with aggregate-only fields, prohibited fields, fail-closed preflight, and post-run review fields. | Use as the data proof appendix for this packet. |
| A2 | Produce public/briefing copy guard for the bounded readonly stage. | Use to keep public copy user-readable and keep technical gate language in `/briefing`. |

## 9. A1 / A2 Intake

PM has received and accepted these local-only support artifacts as inputs to this packet:

| Lane | Artifact | Intake result | PM use |
| --- | --- | --- | --- |
| A1 | `docs/A1_PUBLIC_BETA_BATCH1_READONLY_PROOF_DELTA.md` | `accepted_for_pm_readonly_packet_input` | Defines aggregate-only proof fields, prohibited fields, fail-closed preflight, post-run review fields, and acceptance checklist. |
| A2 | `docs/A2_PUBLIC_BETA_READONLY_COPY_GUARD.md` | `accepted_for_pm_readonly_packet_input` | Defines what public pages may say before/after readonly, what they must not say, and which technical terms belong only in `/briefing`. |

PM interpretation:

- A1 closes the local proof-shape gap only; it does not authorize or execute a readonly attempt.
- A2 keeps homepage copy user-readable and prevents a future readonly result from being overstated as real-data launch.
- Both artifacts preserve `publicDataSource=mock` and `scoreSource=mock`.

## 10. PM Decision

Decision: `ready_to_present_not_execute`

Reason:

- The bounded readonly gate is now named and constrained.
- The packet describes what a future attempt may prove and what it must never expose.
- The runtime boundary remains mock.
- The next step can be a CEO/Chairman explicit execution request, or continued local readiness/UI cleanup if execution is not desired yet.

## 11. Next Step

Recommended next mainline slice:

`public_beta_batch1_bounded_readonly_operator_decision`

Expected work:

- if CEO/Chairman wants to proceed, explicitly name exactly one bounded readonly attempt;
- run immediate local preflight before any remote access;
- capture aggregate-only proof and immediately record post-run review;
- stop after one attempt regardless of outcome;
- if no execution authorization is desired, keep moving on public copy cleanup and data contract closure;
- keep homepage user-readable and keep technical detail in `/briefing`;
- run TypeScript, public visible language quality, route health, and review gate;
- commit after passing checks.
