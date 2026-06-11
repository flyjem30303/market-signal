# A1 Batch 1 Coverage Gap Repair Checklist

Updated: 2026-06-12

Status: `a1_batch1_coverage_gap_repair_checklist_prepared_local_only`

Owner: A1 Data / Supabase / Market Evidence

Source review: `docs/reviews/BATCH1_ROW_COVERAGE_READONLY_POST_RUN_REVIEW_2026-06-12.md`

## Purpose

This checklist converts the accepted Batch 1 readonly post-run review into a local-only PM route decision aid for the coverage gaps in `TWII`, `0050`, and `006208`.

It is documentation only. It does not run SQL, connect to Supabase, write Supabase, create staging rows, mutate `daily_prices`, fetch market data, ingest market data, store market data, commit market data, print secrets, print row payloads, print `stock_id` values, promote `publicDataSource=supabase`, set `scoreSource=real`, award row coverage points, or authorize any write/backfill attempt.

## Current Aggregate-Only Batch 1 State

The latest readonly post-run review recorded a sanitized aggregate coverage result:

| Aggregate field | Value |
| --- | --- |
| Expected symbols | `6` |
| Required trading sessions per symbol | `60` |
| Expected total rows | `360` |
| Observed total rows | `182` |
| Missing total rows | `178` |
| Coverage status | `blocked` |
| Public data source | `mock` |
| Score source | `mock` |

Three symbols were complete in the review (`2330`, `2382`, `2308`, each `60` observed rows). This checklist covers only the incomplete symbols.

## Gap Symbols

| Symbol | Aggregate-only status | Observed rows | Expected rows | Missing rows | A1 repair posture |
| --- | --- | ---: | ---: | ---: | --- |
| `TWII` | No Batch 1 coverage rows observed. | `0` | `60` | `60` | Blocked for PM route decision; needs source, field, session, cadence, and bounded repair evidence before any write/backfill gate can be proposed. |
| `0050` | Only one aggregate coverage row observed. | `1` | `60` | `59` | Blocked for PM route decision; needs core ETF repair evidence and overlap/uniqueness policy before any missing-row action can be proposed. |
| `006208` | Only one aggregate coverage row observed. | `1` | `60` | `59` | Blocked for PM route decision; needs core ETF repair evidence and overlap/uniqueness policy before any missing-row action can be proposed. |

These counts are aggregate diagnostics only. They are not row payloads, not source payloads, not market values, not source-rights approval, not data-quality approval, and not promotion evidence.

## Evidence Types Needed

PM can use this section to decide which repair route should be prepared next. Evidence remains no-secret, aggregate-only, and local-documentation-first unless a separate explicit gate authorizes a different action.

| Evidence type | `TWII` needed | `0050` needed | `006208` needed | Acceptance shape |
| --- | --- | --- | --- | --- |
| Source-rights outcome | Accepted source lane for index level, public display boundary, storage/retention boundary, attribution, automated access terms, and correction/delay wording. | Accepted source lane for ETF close price, public display boundary, storage/retention boundary, attribution, automated access terms, and ETF scope exclusions. | Same as `0050`. | Safe summary or accepted decision record only; no copied raw terms, credentials, source payloads, or row values. |
| Field mapping | Accepted index close/level field, precision, date/session mapping, timezone, and optional-field exclusions. | Accepted ETF close field, precision, date/session mapping, timezone, and exclusions for NAV, premium/discount, holdings, and product advice. | Same as `0050`. | PM-readable contract labels and boolean acceptance states; no raw market values. |
| Session window | Accepted 60-session Batch 1 window and holiday/closure handling. | Accepted 60-session Batch 1 window and exchange-session handling. | Same as `0050`. | Aggregate expected count and session policy only; no per-date row listing unless a later gate explicitly permits a sanitized date-window artifact. |
| Missing-session classification | Separate calendar gaps, source gaps, delayed publication, corrections, and unavailable sessions. | Separate calendar gaps, source gaps, suspended sessions, delayed publication, corrections, and unavailable sessions. | Same as `0050`. | Count-level or category-level summary only. |
| Existing-row overlap policy | Target uniqueness and conflict behavior for index rows if a future gate proposes repair. | Existing one-row overlap classification and conflict behavior for missing-only repair if a future gate proposes repair. | Same as `0050`. | Aggregate overlap count and policy label only; no row identifiers or payloads. |
| Candidate artifact readiness | Sanitized candidate shape, max row count, source/field/session contract references, and self-check status. | Sanitized candidate shape, max row count, source/field/session contract references, and self-check status. | Same as `0050`. | Manifest/checksum/counts/contracts only; no raw candidate rows in PM route docs. |
| Readback proof route | Bounded aggregate readback route for post-repair verification, if a repair is later authorized. | Same. | Same. | Exactly named aggregate fields; preserves `publicDataSource=mock` and `scoreSource=mock`. |
| Rollback/disable plan | Clear stop/disable route for any later repair path. | Same. | Same. | Local runbook labels and owner decision states only. |

## Prohibited Items

The PM route decision must reject any repair packet or evidence packet that includes or implies:

- SQL execution, SQL text, SQL result rows, query text, query parameters, or database-console output.
- Supabase writes, staging rows, inserts, updates, deletes, merges, upserts, migrations, or dashboard mutations.
- Any `daily_prices` mutation or mutation proof.
- Raw market-data fetch, raw market-data ingest, raw market-data storage, raw market-data commit, or copied source payloads.
- Row payloads, candidate row bodies, row identifiers, `stock_id` values, row-level dates, OHLC values, prices, volumes, or per-row market values.
- Supabase URL, dashboard URL, project URL, anon key, service-role key, bearer token, authorization header, cookie, `.env.local` value, secret, or confirmation phrase.
- Public promotion to `publicDataSource=supabase`.
- Score promotion to `scoreSource=real`.
- Row coverage points, candidate acceptance, production readiness, launch readiness, investment claims, or public real-data claims.
- Retry of the readonly attempt or any repair execution from this checklist alone.

## PM Route Decision Acceptance Checklist

PM may treat this checklist as usable for the next route decision only when all items below remain true:

- [ ] The route decision names only the incomplete symbols: `TWII`, `0050`, and `006208`.
- [ ] The route decision preserves the aggregate counts from the post-run review: `TWII=0/60`, `0050=1/60`, `006208=1/60`, total `182/360`.
- [ ] The route decision classifies the current state as `blocked`, not repaired, complete, promoted, or score-ready.
- [ ] The route decision keeps `publicDataSource=mock`.
- [ ] The route decision keeps `scoreSource=mock`.
- [ ] The route decision does not award row coverage points.
- [ ] The route decision does not authorize SQL, Supabase write, staging rows, `daily_prices` mutation, market-data fetch/ingest/store/commit, or raw payload output.
- [ ] Required evidence is limited to no-secret summaries, accepted decision records, aggregate counts, contract labels, and safe owner/PM states.
- [ ] TWII and core ETF repair paths are separated if their source-rights, field, cadence, or session contracts differ.
- [ ] ETF scope explicitly excludes NAV, premium/discount, holdings, portfolio composition, issuer metadata beyond the accepted display label, and product advice.
- [ ] Any future readonly/readback route is separately bounded and aggregate-only.
- [ ] Any future write/backfill route is separately blocked until an explicit write/backfill gate is accepted.
- [ ] The route decision records who owns source-rights, field/session/cadence, candidate artifact, repair authorization, post-run review, and rollback decisions.

## Non-Secret Information Needed Before A Future Write/Backfill Gate

Before PM can even propose a write/backfill gate, the next packet must provide the following non-secret information. This information must be summary-level unless a separate approved packet allows a more specific sanitized artifact.

| Information needed | Why PM needs it | Safe shape |
| --- | --- | --- |
| Exact repair scope | Prevents broad or accidental data mutation. | Symbols, expected aggregate row counts, and bounded Batch 1 label only. |
| Accepted source-rights references | Confirms the fields may be used for the proposed storage/display purpose. | Decision record paths, owner states, and accepted/rejected labels. |
| Field/session/cadence contract references | Confirms rows would mean the same thing across symbols. | Contract paths, field labels, timezone/session rule, cadence/delay rule, and optional-field exclusions. |
| Missing-session policy | Prevents filling calendar gaps incorrectly. | Category labels and aggregate counts; no raw row payloads. |
| Existing-row overlap and uniqueness policy | Prevents duplicate or destructive writes. | Target uniqueness label, conflict policy, and aggregate overlap counts. |
| Candidate artifact contract | Confirms any candidate repair input is sanitized and bounded. | Manifest path, checksum/hash, max row count, symbol counts, and self-check status; no row bodies. |
| Write/backfill command boundary | Prevents accidental execution from a planning packet. | Proposed command label and fail-closed preflight names only; no command that can run from this checklist. |
| Post-run review template | Ensures output remains sanitized after any later authorized attempt. | Accepted aggregate-only fields and forbidden-output assertions. |
| Rollback/disable route | Confirms PM has a stop path if evidence is wrong. | Owner, local runbook path, disable condition labels, and readback proof labels. |
| Operator authorization boundary | Confirms no execution occurs without a separate decision. | One-attempt authorization packet path, decision owner, date, and explicit go/no-go state. |

Until every item above is accepted in a separate packet, the correct A1 status is:

- `TWII`: `coverage_gap_blocked_pending_route_decision`
- `0050`: `coverage_gap_blocked_pending_route_decision`
- `006208`: `coverage_gap_blocked_pending_route_decision`
- Batch 1 row coverage: `blocked`
- public data source: `mock`
- score source: `mock`

## A1 Conclusion

The Batch 1 coverage gap repair checklist is ready for PM route decision support.

This file closes only the local documentation support slice. It does not close row coverage, data quality, source rights, readonly/readback, write/backfill, Supabase readiness, public real-data promotion, or real-score gates.
