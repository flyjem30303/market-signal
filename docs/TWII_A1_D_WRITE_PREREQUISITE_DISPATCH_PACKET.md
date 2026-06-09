# TWII A1/D Write Prerequisite Dispatch Packet

Updated: 2026-06-10

Status: `twii_a1_d_write_prerequisite_dispatch_packet_ready_local_only`

## Purpose

This dispatch packet turns the six blocked TWII write readiness prerequisites into A1/D work items that PM can intake without reopening the same planning discussion.

It is a local-only instruction and reply contract. It does not authorize SQL, Supabase connection, Supabase write, credential value access, market-data fetch, market-data ingestion, `daily_prices` mutation, candidate row acceptance, row coverage scoring, public data-source promotion, or `scoreSource=real`.

## CEO Decision

CEO assigns the next prerequisite closure work as follows:

- A1 owns technical/data evidence for field-contract, asset-mapping, rollback dry-run shape, and post-write aggregate readback shape.
- D owns source-rights/legal/redistribution evidence.
- PM owns classification, integration, and the future post-write review command shape.

PM should accept or reject each slot independently. A partially accepted packet does not authorize implementation.

## Dispatch Slots

| Slot | Owner | Required reply fields | Accepted if | Rejected if | Stop line |
|---|---|---|---|---|---|
| `source-rights-decision` | A1 / D | sourceReferenceLabel, sourceLane, storageAllowed, retentionPolicy, redistributionSummary, attributionSummary, commercialUseSummary, remainingRisk | no-secret evidence supports internal storage and bounded aggregate use | copied terms, private links, unclear storage rights, or redistribution conflict | no source probing or ingestion |
| `field-contract-decision` | A1 | fieldNames, fieldMeanings, dateConvention, numericPrecision, nullablePolicy, duplicatePolicy, rejectedFieldList | fields are complete enough for sanitized aggregate-only candidate review | raw/row payload needed, unclear date, unclear precision, or duplicate policy missing | no row payload output |
| `asset-mapping-decision` | A1 | lane, symbol, assetType, targetTable, targetScope, mappingSummary, stockIdPayloadIncluded | `TWII` maps to index lane and `daily_prices` scope without stock-id payload output | stock-id payload required, table/scope mismatch, or lane unclear | no stock-id payload output |
| `rollback-dry-run-plan` | A1 / PM | authorizationScope, dryRunCountFields, duplicatePolicy, rollbackScope, destructiveRollbackAllowed | aggregate-only no-mutation rollback count proof is defined | destructive rollback required or row-level output needed | no destructive rollback |
| `post-write-readback-plan` | A1 / PM | attemptedCountField, insertedCountField, rejectedCountField, duplicateCountField, maxDateField, aggregateOnly | readback is aggregate-only and names required fields | raw/row payload or stock id output required | no row payload output |
| `post-write-review-plan` | PM | summaryInputPath, reviewCommand, acceptedSummaryFields, rejectedSummaryFields, promotionSameRunAllowed | review accepts only aggregate summary and keeps promotion/scoring blocked | review needs raw rows, secrets, or same-run promotion | no promotion in same run |

## A1 Reply Shape

A1 should return only no-secret values:

```text
A1 TWII write prerequisite reply
slotId: field-contract-decision | asset-mapping-decision | rollback-dry-run-plan | post-write-readback-plan
classificationRequest: accepted | needs_bounded_repair | blocked | rejected
safeEvidenceSummary: <1-3 sentences, aggregate-only>
requiredReplyFieldsComplete: true | false
rawPayloadIncluded: false
rowPayloadIncluded: false
stockIdPayloadIncluded: false
secretsIncluded: false
copiedTermsTextIncluded: false
nextPMAction: classify_slot | ask_one_bounded_repair_question | keep_blocked
```

## D Reply Shape

D should return only no-secret source-rights evidence:

```text
D TWII source-rights prerequisite reply
slotId: source-rights-decision
classificationRequest: accepted | needs_bounded_repair | blocked | rejected
sourceReferenceLabel: <NO_SECRET_LABEL>
safeEvidenceSummary: <1-3 sentences, no copied terms text>
remainingRisk: <1-2 sentences>
storageAllowed: accepted | blocked | unclear
redistributionSummary: accepted | blocked | unclear
commercialUseSummary: accepted | blocked | unclear
rawPayloadIncluded: false
rowPayloadIncluded: false
stockIdPayloadIncluded: false
secretsIncluded: false
copiedTermsTextIncluded: false
privateDashboardLinksIncluded: false
```

## PM Intake Rule

PM may mark an individual slot:

- `accepted`: required fields are complete, no forbidden output appears, and the evidence can support a future local-only review gate.
- `needs_bounded_repair`: exactly one narrow safe field is missing.
- `blocked`: the evidence is not enough to proceed.
- `rejected`: the evidence is unsafe, contradictory, or outside the required lane.

All six slots must be `accepted` before any later implementation-review upgrade can become a candidate. This packet alone cannot authorize implementation, SQL, Supabase connection, Supabase write, `daily_prices` mutation, row acceptance, scoring, public source promotion, or real score.

## PM Next Action After Replies

After A1/D replies, PM should create a separate accepted/rejected intake record. If all six slots are accepted, PM may open a later `TWII write implementation upgrade candidate` gate. If any slot is blocked or rejected, PM keeps the write runner implementation blocked and sends exactly one bounded repair question per `needs_bounded_repair` slot.

## Stop Line

Do not add Supabase client code, read credentials, run SQL, connect to Supabase, write Supabase, fetch market data, ingest market data, mutate `daily_prices`, accept candidate rows, award row coverage points, output raw/row/stock-id payloads, print secrets, promote public source, or set `scoreSource=real` from this packet.

