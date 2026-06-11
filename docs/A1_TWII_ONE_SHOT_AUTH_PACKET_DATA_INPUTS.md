# A1 TWII One-Shot Auth Packet Data Inputs

Updated: 2026-06-12

Status: `a1_twii_one_shot_auth_packet_data_inputs_ready_local_only`

Owner: A1 Data / Supabase / Market Evidence

Mainline route supported: `prepare_twii_one_shot_authorization_packet_without_execution`

## Purpose

This file gives PM the local-only data and contract input checklist for a future TWII one-shot authorization packet without execution.

It is not an execution packet. It does not run SQL, connect to Supabase, write Supabase, create staging rows, mutate `daily_prices`, fetch market data, ingest market data, store market data, commit market data, print secrets, rerun readonly, accept candidate rows, award row coverage points, promote `publicDataSource=supabase`, or set `scoreSource=real`.

## Fixed Target Inputs

| Field | Required value |
| --- | --- |
| Lane | `TWII` |
| Symbol | `TWII` |
| Target relation | `daily_prices` |
| Target scope | `twii_index_daily_prices_missing_rows` |
| Max rows | `maxRows=60` |
| Write mode for later packet | `bounded_insert_missing_only` |
| Duplicate policy | `reject_duplicates` |
| Current TWII observed rows | `0` |
| Expected TWII rows | `60` |
| Candidate missing rows | `60` |
| Public data source | `publicDataSource=mock` |
| Score source | `scoreSource=mock` |
| Execution allowed now | `false` |

These values are aggregate-only planning inputs. They are not raw market data, row payloads, source payloads, `stock_id` payloads, secrets, write authorization, or production readiness evidence.

## Required References For PM Packet

The one-shot authorization packet may be prepared only as a future packet if it carries references to all required evidence below.

| Input | Required reference | Current A1 classification |
| --- | --- | --- |
| Route gate | `docs/TWII_COVERAGE_REPAIR_GATE.md` | `available_for_pm_packet_draft` |
| A1 repair prereq checklist | `docs/A1_TWII_COVERAGE_REPAIR_GATE_PREREQ_CHECKLIST.md` | `available_for_pm_packet_draft` |
| Source-rights reference | `data/source-gates/a1-exact-source-rights-evidence-intake-outcomes.json` entries `vendor-terms-evidence` and `internal-feed-owner-evidence` | `accepted_for_opening_next_gate_only` |
| Field-contract reference | `data/source-gates/a1-exact-source-rights-evidence-intake-outcomes.json` entry `field-contract-evidence` | `accepted_for_gate_planning_only` |
| Asset-mapping reference | `data/source-gates/a1-exact-source-rights-evidence-intake-outcomes.json` entry `asset-mapping-evidence` | `accepted_for_gate_planning_only` |
| Sanitized candidate artifact reference | `data/candidates/twii-sanitized-candidate.json` | `pending_pm_review` |
| Public copy guard | `docs/A2_TWII_COVERAGE_REPAIR_GATE_PUBLIC_COPY_GUARD.md` | `available_for_public_boundary_review` |

The references above may be used only as safe labels and paths. They must not be expanded into copied terms, raw source responses, row payloads, row-level market values, `stock_id` values, credentials, tokens, cookies, environment values, operator confirmation phrases, or SQL.

## Sanitized Candidate Artifact Inputs

The candidate artifact reference is safe for PM planning only if it keeps this shape:

| Artifact input | Required value |
| --- | --- |
| `artifactId` | `twii-sanitized-candidate-20260609` |
| `lane` | `TWII` |
| `symbol` | `TWII` |
| `scope` | `twii_index_daily_prices_missing_rows` |
| `sourceLane` | `official-exchange-index` |
| `coverageWindowSessions` | `60` |
| `alreadyObservedRows` | `0` |
| `candidateMissingRows` | `60` |
| `expectedRows` | `60` |
| `aggregateValidation.expectedRows` | `60` |
| `aggregateValidation.candidateRows` | `60` |
| `aggregateValidation.duplicateRows` | `0` |
| `aggregateValidation.rejectedRows` | `0` |
| `aggregateValidation.missingRows` | `0` |
| `aggregateValidation.validationStatus` | `pending_pm_review` |
| `sanitizedAggregateOnly` | `true` |
| `rawPayloadIncluded` | `false` |
| `rowPayloadIncluded` | `false` |
| `stockIdPayloadIncluded` | `false` |
| `secretsIncluded` | `false` |

Allowed field labels for planning are `trade_date`, `index_close`, and `source_row_hash`. The packet must not print row values for those fields.

## One-Shot Packet Data Contract Checklist

PM should require the future one-shot authorization packet to include every item below before any execution can even be requested.

- [ ] `authorizationId` is explicitly named and unique.
- [ ] `operatorDecision` is explicitly named and separate from this A1 support file.
- [ ] `targetSymbol=TWII`.
- [ ] `targetRelation=daily_prices`.
- [ ] `targetScope=twii_index_daily_prices_missing_rows`.
- [ ] `maxRows=60`.
- [ ] `writeMode=bounded_insert_missing_only`.
- [ ] `duplicatePolicy=reject_duplicates`.
- [ ] Source-rights reference is present and classified as accepted only for the next gate, not direct execution.
- [ ] Field-contract reference is present and classified as accepted only for gate planning.
- [ ] Sanitized candidate artifact reference is present and still `pending_pm_review` unless PM separately accepts it.
- [ ] Candidate artifact remains aggregate-only and does not expose row payloads or raw source payloads.
- [ ] Target-table boundary confirms no broad `daily_prices` operation and no ETF rows.
- [ ] Rollback or disable plan is named before any future write.
- [ ] Aggregate readback plan is named before any future write.
- [ ] Post-run review plan is mandatory after any future attempt.
- [ ] `publicDataSource=mock` remains unchanged.
- [ ] `scoreSource=mock` remains unchanged.
- [ ] No row coverage points are awarded by preparation alone.

## Rollback, Readback, And Post-Run Review Prerequisites

The future PM packet must remain blocked unless these prerequisites are present:

| Area | Minimum required input |
| --- | --- |
| Rollback / disable | Named owner, fail-closed default, stop condition labels, disable route label, and aggregate post-disable readback shape. |
| Readback | Aggregate-only count check for TWII, target relation, target scope, expected rows, observed rows, missing rows, duplicate count, rejected count, mutation flag, public source state, and score source state. |
| Post-run review | PM review template confirming no secrets, no raw payloads, no row payloads, no `stock_id` payloads, no unapproved row coverage points, no `publicDataSource=supabase`, no `scoreSource=real`, and no public real-data claim. |

Any missing prerequisite keeps the route at `blocked_pending_packet_inputs`.

## Missing Evidence Classification

| Evidence item | Current classification | Effect on PM packet |
| --- | --- | --- |
| Source-rights reference | `accepted_for_opening_next_gate_only` | Usable as a reference, but not enough for execution by itself. |
| Field-contract reference | `accepted_for_gate_planning_only` | Usable as a reference, but not enough for execution by itself. |
| Asset mapping reference | `accepted_for_gate_planning_only` | Usable as a reference, but must not expose `stock_id` values. |
| Sanitized candidate artifact | `pending_pm_review` | Packet may reference it, but execution stays blocked until PM accepts artifact safety and contract fit. |
| Target-table boundary | `prepared_local_only` | Packet must restate `daily_prices`, `TWII`, `maxRows=60`, `bounded_insert_missing_only`, and `reject_duplicates`. |
| Rollback/readback/post-run review | `required_before_execution_request` | Future packet must include these before any attempt can be proposed. |
| Operator authorization value | `missing_by_design` | Must be supplied only in a later explicit authorization flow; this file must not contain it. |
| Execute switch | `missing_by_design` | Must remain absent from this A1 input file. |

## Stop Lines

Reject this file as an input source if it is later changed to include or imply any of the following:

- SQL text, SQL execution, SQL output, query parameters, migrations, database console results, or readonly reruns.
- Supabase connection, Supabase write, Supabase dashboard mutation, Supabase schema mutation, Supabase URL output, or credential presence details.
- Staging-row creation.
- Insert, update, delete, merge, upsert, repair, backfill, write-runner execution, or `daily_prices` mutation.
- Raw market-data fetch, ingestion, storage, commit, source probing, raw payloads, source payloads, row payloads, copied source terms, or source response bodies.
- Row-level market values, per-date rows, row identifiers, or `stock_id` values.
- Secrets, tokens, cookies, authorization headers, `.env.local` values, service-role keys, anon keys, or operator confirmation phrases.
- `publicDataSource=supabase`.
- `scoreSource=real`.
- Public live-data, official-feed, production-ready, investment-advice, buy, sell, hold, return, or timing claims.

## A1 Conclusion

A1 data inputs are ready for PM to draft `prepare_twii_one_shot_authorization_packet_without_execution`.

This closes only the local support input slice. The route remains blocked for execution until PM separately accepts source-rights carry-forward, field-contract carry-forward, sanitized candidate artifact safety, target-table boundary, rollback/readback/post-run review prerequisites, exact operator authorization, and one-attempt execution controls.
