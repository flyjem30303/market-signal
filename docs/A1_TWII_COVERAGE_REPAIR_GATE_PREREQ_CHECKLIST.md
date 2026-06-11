# A1 TWII Coverage Repair Gate Prereq Checklist

Updated: 2026-06-12

Status: `a1_twii_coverage_repair_gate_prereq_checklist_prepared_local_only`

Owner: A1 Data / Supabase / Market Evidence

PM route decision: `batch1_route_decision_twii_first`

## Purpose

This local-only support file defines the prerequisites PM must see before any later TWII coverage repair gate can be considered.

It is documentation only. It does not run SQL, connect to Supabase, write Supabase, create staging rows, mutate `daily_prices`, fetch market data, ingest market data, store market data, commit market data, print secrets, print row payloads, print `stock_id` values, promote `publicDataSource=supabase`, set `scoreSource=real`, award row coverage points, accept candidate rows, or authorize a write/backfill attempt.

## Current Batch 1 Route State

| Field | Current value |
| --- | --- |
| Route priority | `TWII first` |
| Target lane | `TWII` |
| Target table | `daily_prices` |
| Batch 1 expected TWII rows | `60` |
| Batch 1 observed TWII rows | `0` |
| Batch 1 missing TWII rows | `60` |
| Current coverage state | `TWII 0/60` |
| Public data source | `publicDataSource=mock` |
| Score source | `scoreSource=mock` |
| A1 posture | `blocked_pending_prerequisite_acceptance` |

These values are aggregate-only route facts. They are not row payloads, not source payloads, not market values, not source-rights approval, not data-quality approval, not write authorization, and not promotion evidence.

## Required Prerequisites

PM can treat the TWII coverage repair gate as eligible for later packet preparation only when every prerequisite below has an accepted, no-secret, aggregate-only evidence reference.

| Prerequisite | Required safe evidence | Acceptance condition |
| --- | --- | --- |
| Source-rights | Accepted source lane for TWII index values, automated access method, internal storage rights, public display boundary, redistribution/export boundary, attribution, correction/delay wording, and derived-analysis boundary. | PM has an accepted source-rights decision record or explicit allowed/rejected labels. No copied terms, raw source response, credentials, or source payloads appear. |
| Field contract | Accepted mapping for `trade_date`, TWII close/index level field, timezone, trading-session rule, precision, rounding, revision/correction handling, missing-session handling, and excluded optional fields. | Field names and rules are contract labels only. No raw market values, row bodies, or per-date payloads appear. |
| Sanitized candidate artifact | Bounded TWII candidate artifact manifest for exactly the missing Batch 1 scope, including lane, target table, expected row count, missing row count, source-rights reference, field-contract reference, checksum or stable manifest id, and self-check status. | Artifact is sanitized and aggregate-only. PM sees manifest/counts/contracts only, not candidate row bodies or raw market data. |
| Target-table boundary | Explicit boundary that the only possible future target is `daily_prices`, for TWII missing Batch 1 rows only, with no broad table access and no staging rows from this checklist. | Any later packet must name `daily_prices`, `TWII`, `60` expected rows, `60` missing rows, and missing-only behavior. |
| Readback plan | Aggregate-only readback fields for later verification, such as expected count, observed count, missing count, target lane, target table, mutation flag, public source state, and score source state. | Readback proves only aggregate state and safety flags. It does not print row payloads, `stock_id` values, raw dates, prices, source payloads, or secrets. |
| Rollback / disable plan | Named rollback or disable owner, stop conditions, fail-closed behavior, and post-disable aggregate readback labels. | Rollback readiness is documented before any later execution packet. This file itself does not execute rollback. |
| Post-run review | PM-readable review template that checks aggregate counts, no forbidden output, no secret output, no public-source promotion, no real-score promotion, and no row coverage points unless separately accepted. | Post-run review must be required after any later authorized attempt, before any coverage status or public claim changes. |

## Source-Rights Acceptance Shape

A source-rights acceptance reference must answer all of the following without exposing source text, credentials, raw data, row values, or legal-advice claims:

- [ ] The allowed source lane is named, for example official exchange index source, licensed vendor, or internally approved feed.
- [ ] Automated access is accepted or explicitly blocked.
- [ ] Internal storage in a future `daily_prices` repair path is accepted or explicitly blocked.
- [ ] Public display and public-copy boundaries are accepted or explicitly blocked.
- [ ] Redistribution, export, screenshot, API reuse, and downstream-copy limits are accepted or explicitly blocked.
- [ ] Attribution and delay/correction wording are accepted or explicitly blocked.
- [ ] Derived analysis, QA summary, row coverage scoring, and decision-support use are accepted or explicitly blocked.
- [ ] Remaining risk is stated as a safe summary, not copied source terms.

If any item remains blocked or unknown, TWII repair gate preparation remains blocked.

## Field-Contract Acceptance Shape

A field-contract acceptance reference must answer all of the following without exposing row-level market values:

- [ ] `trade_date` meaning, timezone, and trading-session boundary are accepted.
- [ ] TWII index close/level field is accepted.
- [ ] Precision, rounding, null handling, and correction/revision handling are accepted.
- [ ] Missing-session policy separates holidays, closures, delayed publication, unavailable source data, and true repair gaps.
- [ ] Target uniqueness and conflict behavior for a later missing-only repair are accepted.
- [ ] Optional OHLC, turnover, volume, or other source fields are either explicitly excluded or separately accepted.
- [ ] Asset mapping is safe for an internal TWII index asset without printing `stock_id` values.

If any item remains blocked or unknown, TWII repair gate preparation remains blocked.

## Sanitized Candidate Artifact Boundary

A future candidate artifact may support PM review only if it remains sanitized:

| Artifact field | Required safe shape |
| --- | --- |
| `lane` | `TWII` |
| `targetTable` | `daily_prices` |
| `targetScope` | `twii_index_daily_prices_missing_rows` |
| `expectedRows` | `60` |
| `observedRowsBeforeRepair` | `0` |
| `missingRows` | `60` |
| `sourceRightsReference` | Accepted decision record path or safe label only. |
| `fieldContractReference` | Accepted contract path or safe label only. |
| `candidateRowsVisibleToPM` | `false` |
| `rawMarketDataIncluded` | `false` |
| `rowPayloadsIncluded` | `false` |
| `secretsIncluded` | `false` |
| `publicDataSource` | `mock` |
| `scoreSource` | `mock` |

The artifact must not contain raw market data, source response bodies, copied terms, per-row dates, prices, OHLC values, volumes, row identifiers, `stock_id` values, credentials, tokens, or executable write instructions.

## Target-Table Boundary

The only future table boundary PM may discuss from this checklist is:

- target table: `daily_prices`;
- target lane: `TWII`;
- target scope: `twii_index_daily_prices_missing_rows`;
- expected missing-only row count: `60`;
- current observed TWII coverage: `0/60`;
- runtime posture: `publicDataSource=mock`;
- scoring posture: `scoreSource=mock`.

This checklist does not authorize any `daily_prices` insert, update, delete, merge, upsert, migration, dashboard mutation, staging-row creation, or repair execution.

## Rollback, Readback, And Post-Run Review Prerequisites

Before any separate future packet can request execution, PM must have these prerequisites accepted:

| Area | Required before execution can be requested |
| --- | --- |
| Rollback / disable | Named owner, stop conditions, disable route, fail-closed default, and aggregate post-disable readback labels. |
| Readback | Aggregate-only readback shape that confirms target lane, target table, expected rows, observed rows, missing rows, mutation flags, secret-output flags, public source state, and score source state. |
| Post-run review | Review template requiring PM to confirm no forbidden outputs, no unapproved row coverage points, no public-source promotion, no real-score promotion, and no launch/readiness claims. |

If any of these are missing, PM should keep the TWII coverage repair gate at `blocked_pending_prerequisite_acceptance`.

## Prohibited Items

Any packet, checklist, artifact, route decision, or review that includes or implies the following must be rejected:

- SQL execution, SQL text, SQL result rows, query text, query parameters, migrations, database-console output, or readonly/run attempts.
- Supabase connection, Supabase write, Supabase dashboard mutation, Supabase client creation, Supabase URL output, project URL output, or remote probing.
- Staging rows, inserts, updates, deletes, merges, upserts, backfills, repair execution, or candidate-row acceptance.
- Any `daily_prices` mutation or mutation proof.
- Raw market-data fetch, ingest, storage, commit, copied source payloads, source response bodies, or source-derived row bodies.
- Row payloads, candidate row bodies, row identifiers, `stock_id` values, row-level dates, prices, OHLC values, volumes, or per-row market values.
- Supabase anon key, service-role key, bearer token, authorization header, cookie, `.env.local` value, secret, operator confirmation phrase, or authorization value.
- `publicDataSource=supabase`.
- `scoreSource=real`.
- Row coverage points, production readiness, launch readiness, public real-data claims, investment advice, or public display claims based on unaccepted TWII data.

## PM Acceptance Checklist

PM may mark this prerequisite checklist usable for the next route decision only when all items remain true:

- [ ] The route decision is TWII first and does not mix ETF repair into the same gate.
- [ ] The route decision preserves `TWII 0/60`, `60` expected rows, and `60` missing rows.
- [ ] The route decision names `daily_prices` only as a future target-table boundary, not as an authorized mutation target.
- [ ] Source-rights acceptance is documented or the route stays blocked.
- [ ] Field-contract acceptance is documented or the route stays blocked.
- [ ] Sanitized candidate artifact readiness is documented with manifest/counts/contracts only.
- [ ] Candidate rows, raw market data, source payloads, row payloads, `stock_id` values, secrets, and confirmation values are absent.
- [ ] Readback prerequisites are aggregate-only and preserve forbidden-output checks.
- [ ] Rollback or disable prerequisites are named before any later execution packet is proposed.
- [ ] Post-run review is required before any row coverage points, readiness claims, public-source changes, or score-source changes.
- [ ] `publicDataSource` remains `mock`.
- [ ] `scoreSource` remains `mock`.
- [ ] No SQL, Supabase connection, Supabase write, staging rows, `daily_prices` mutation, raw market-data fetch/ingest/store/commit, or source probing is authorized.
- [ ] Any later write/backfill path is routed to a separate explicit authorization packet and remains blocked until PM accepts it.

## A1 Conclusion

The TWII coverage repair gate prerequisite checklist is ready for PM route decision support.

Current A1 status remains `blocked_pending_prerequisite_acceptance`: TWII is first, TWII is `0/60`, target table boundary is `daily_prices`, missing rows remain `60`, public data source remains `mock`, and score source remains `mock`.

This file closes only the local documentation support slice. It does not close row coverage, data quality, source rights, field contract, candidate artifact acceptance, readback, rollback, post-run review, Supabase readiness, public real-data promotion, or real-score gates.
