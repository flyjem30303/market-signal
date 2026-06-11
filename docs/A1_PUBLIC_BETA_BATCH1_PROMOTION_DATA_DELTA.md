# A1 Public Beta Batch 1 Promotion Data Delta

Status: `a1_public_beta_batch1_promotion_data_delta_ready_local_only`

Date: 2026-06-11

Owner lane: A1 Data / Supabase / Market Evidence

Runtime posture:

- `publicDataSource=mock`
- `scoreSource=mock`

## Purpose

This local-only delta documents what still separates the Batch 1 TWII + core ETF promotion packet from any real-data promotion path.

It is a planning and PM acceptance artifact only. It does not authorize SQL, Supabase access, Supabase reads, Supabase writes, staging rows, `daily_prices` mutation, raw market-data fetch, raw market-data storage, market-data ingest, candidate row acceptance, public real-data promotion, secret access, authorization phrase handling, or `scoreSource=real`.

Batch 1 scope remains limited to TWII plus core ETF display/readiness surfaces. It does not add individual stocks, sectors, industries, holdings, NAV, premium/discount, portfolio composition, intraday data, advice signals, or real scoring.

## 1. Current Mock Boundary

Current public beta Batch 1 may expose only mock or simulated TWII + core ETF shells.

Allowed now:

- public or PM-facing readiness labels that state the lane is mock-only;
- TWII/core ETF panel placement and UI integration using simulated values;
- readiness badges such as `mock_ready`, `source_rights_needed`, `field_session_cadence_contract_needed`, and `real_promotion_blocked`;
- aggregate-only gap summaries;
- local documentation and local checker/report planning.

Not allowed from this packet:

- real TWII values;
- real ETF prices;
- source-derived values;
- raw or row-level payloads;
- Supabase-backed public routes;
- `daily_prices` inserts, updates, merges, or backfills;
- candidate row acceptance;
- real scoring or public decision values.

The safe PM statement is: Batch 1 has a mock display shell and a documented data delta; real-data promotion remains blocked until separate accepted gates close the rights, field, session, cadence, readonly, write/backfill, and post-run proof gaps.

## 2. Source-Rights Delta Still Needed

Batch 1 still needs accepted source-rights outcomes for each lane before any real value can be displayed, stored, backfilled, or treated as market evidence.

| Lane | Source-rights delta still needed | Current promotion effect |
| --- | --- | --- |
| TWII | Accepted authority for the selected source lane, public display rights, redistribution boundary, attribution wording, delayed/corrected value wording, internal storage permission, retention/cache limits, derived-analysis permission, and automated access terms. | Real TWII display remains blocked. |
| core ETF | Accepted market-price source rights, exchange/vendor attribution, redistribution boundary, public display permission, cadence terms, and explicit exclusion wording for holdings, NAV, premium/discount, and product advice. | Real ETF display remains blocked. |

Source-rights evidence must be no-secret and PM-reviewable. It must not include credentials, authorization phrases, raw source payloads, row payloads, stock-id payloads, or copied terms beyond safe summaries.

No inference from "not explicitly prohibited" is enough for Batch 1 promotion unless a separately accepted PM/D decision record says that exact posture is allowed for the exact field and display use.

## 3. Field / Session / Cadence Delta Still Needed

Batch 1 still needs accepted field, session, and cadence contracts before any row, UI value, report value, or public label can be treated as real.

| Delta area | TWII still needed | core ETF still needed |
| --- | --- | --- |
| Identifier | Accepted TWII identifier and asset-lane mapping without exposing stock-id payloads. | Accepted ETF universe, symbol mapping, and listing venue labels. |
| Date/session | `session_date` or `trade_date` mapped to Taiwan trading session date, not ingestion timestamp. | ETF trading-session date mapped to exchange session date. |
| Value field | Accepted `index_close_or_level` / `index_close` definition and precision. | Accepted `close` price definition and precision. |
| Change fields | Accepted source-vs-derived rule for point change and percent change. | Accepted source-vs-derived rule for price change and percent change. |
| Timezone | Explicit `Asia/Taipei` session interpretation or accepted per-lane timezone rule. | Explicit market/session timezone rule. |
| Missing sessions | Calendar gaps, holidays, closures, delayed publication, source gaps, and corrections classified separately. | Holidays, suspended sessions, source gaps, delayed values, and corrections classified separately. |
| Cadence | Accepted update cadence, delay label, correction policy, and non-live wording. | Accepted per-symbol cadence, delay label, correction policy, and non-live wording. |
| Status fields | `source_status`, `rights_status`, `missing_session_status`, and `mock_or_real_status` populated without ambiguity. | Same status fields populated without ambiguity. |

Optional fields must remain out of promotion scope until separately accepted. For TWII this includes open/high/low/turnover. For core ETF this includes holdings, NAV, premium/discount, issuer metadata, and portfolio composition.

## 4. Readonly Attempt Prerequisites

Readonly attempt status: not authorized by this delta.

A future readonly attempt must be separately accepted and must meet all of the following before any remote read, Supabase read, schema inspection, or readback proof:

- PM names the exact bounded readonly purpose.
- PM names the exact allowed target, such as table, view, or aggregate report surface.
- The packet states that no SQL, write, mutation, staging, or backfill is authorized.
- The packet states what aggregate proof may be returned.
- Raw payloads, row payloads, stock-id payloads, source response bodies, secrets, env values, and authorization phrases remain excluded.
- The attempt has a fail-closed local preflight.
- The attempt has a post-run review template with aggregate-only fields.
- The attempt preserves `publicDataSource=mock` and `scoreSource=mock`.

Readonly proof, even if later accepted, would only support evidence review. It would not authorize public real-data display, writes, backfill, candidate row acceptance, row coverage points, or real scoring.

## 5. Write / Backfill Prerequisites

Write/backfill status: blocked.

A future write or backfill route must be a separate explicit operator authorization packet. It must be accepted after source-rights, field/session/cadence, readonly/readback, and rollback prerequisites are complete.

Minimum prerequisites before any future write/backfill can even be proposed:

- accepted source-rights outcome for the exact TWII and ETF fields;
- accepted field mapping contract;
- accepted timezone/session contract;
- accepted cadence and delay-label contract;
- accepted missing-session and correction policy;
- accepted target table/view and row uniqueness contract;
- accepted idempotency and conflict policy;
- accepted rollback or disable plan;
- accepted readonly/readback proof route;
- accepted max row count and bounded scope;
- accepted sanitized candidate artifact shape, if candidates are used;
- accepted post-run review fields;
- explicit operator authorization for one bounded attempt.

Until those prerequisites exist, Batch 1 must not create staging rows, mutate `daily_prices`, insert missing rows, merge candidate rows, accept candidate rows, or promote a real public data source.

## 6. Promotion-Blocking Hard Stops

Batch 1 promotion remains blocked if any of the following are true:

- source-rights evidence is pending, rejected, missing, unavailable, or needs bounded repair;
- field mapping is unresolved for any displayed real value;
- `session_date` / `trade_date` semantics are unresolved;
- timezone, precision, rounding, revision, or correction rules are unresolved;
- cadence or delayed-data wording is unresolved;
- missing-session rules do not separate calendar gaps from source gaps;
- public attribution wording is missing or not accepted;
- ETF exclusions for holdings, NAV, premium/discount, and product advice are not explicit;
- Supabase readonly route is not separately accepted when remote evidence is proposed;
- write/backfill route is not separately accepted when storage mutation is proposed;
- post-run review would expose raw payloads, row payloads, stock-id payloads, secrets, env values, authorization phrases, or real decision values;
- any route would set `publicDataSource=supabase`;
- any route would set `scoreSource=real`;
- any route would modify `daily_prices` without a separate accepted operator authorization packet.

Hard stop-line preserved by this delta:

- no SQL
- no Supabase connection
- no Supabase read
- no Supabase write
- no staging rows
- no `daily_prices` mutation
- no raw market-data fetch
- no raw market-data ingest
- no raw market-data storage
- no raw market-data commit
- no secrets/env output
- no authorization phrase output
- no confirmation phrase output
- no real decision values
- no candidate row acceptance
- no `publicDataSource=supabase`
- no `scoreSource=real`

## 7. PM-Ready Acceptance Checklist

PM can treat this delta as ready when all checklist items below are true:

| Checklist item | Acceptance state |
| --- | --- |
| Document preserves current mock boundary: `publicDataSource=mock` and `scoreSource=mock`. | Ready in this delta. |
| Document clearly separates mock shell readiness from real-data promotion. | Ready in this delta. |
| TWII source-rights delta is listed without claiming approval. | Ready in this delta. |
| core ETF source-rights delta is listed without claiming approval. | Ready in this delta. |
| Field/session/cadence deltas are listed for TWII and core ETF. | Ready in this delta. |
| Readonly prerequisites are bounded, no-secret, aggregate-only, and explicitly not authorized here. | Ready in this delta. |
| Write/backfill prerequisites are blocked pending separate explicit authorization. | Ready in this delta. |
| Promotion-blocking hard stops include SQL, Supabase, staging rows, `daily_prices`, raw market data, secrets/env, authorization phrases, real decision values, `publicDataSource=supabase`, and `scoreSource=real`. | Ready in this delta. |
| No raw payloads, row payloads, stock-id payloads, secrets, env values, authorization phrases, confirmation phrases, or real decision values are included. | Ready in this delta. |
| The packet is usable by PM/A2 to keep public copy honest while Batch 1 remains mock-only. | Ready in this delta. |

## A1 Conclusion

Batch 1 TWII + core ETF promotion data delta is ready as a local-only PM packet.

This file closes only the documentation delta. It does not close source rights, field/session/cadence, readonly, write/backfill, row coverage, Supabase readiness, public real-data promotion, or real-score gates.
