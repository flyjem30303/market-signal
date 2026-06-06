# ETF Source-Rights Outcome Decision Gate

Status: `etf_source_rights_outcome_decision_gate_blocked_external_rights_pending`

Date: 2026-06-07

Owner: PM mainline

Support lane: A1 Data / Supabase / Market Evidence

## CEO Decision

CEO opens the ETF source-rights outcome decision gate as the next PM mainline data route.

This gate does not approve any ETF source lane yet. It converts the current ETF blocker into an explicit decision surface so PM can either accept a future source-rights outcome, keep ETF blocked, or switch the next coverage route to TWII.

Current outcome:

`rejected_for_execution_pending_external_rights`

The ETF route remains blocked by `legal_and_redistribution_terms_unapproved`.

## Current Evidence

Current accepted local evidence:

- ETF route status: `etf_daily_prices_coverage_completion_route_ready_source_rights_blocked`.
- ETF readiness packet status: `etf_source_rights_and_candidate_readiness_packet_ready_local_only_not_executable`.
- ETF review packet status: `etf_source_rights_review_packet_prepared`.
- Target symbols: `0050`, `006208`.
- Combined ETF coverage: `2/120`.
- Missing ETF rows: `118`.
- `0050`: `1/60`, missing `59`.
- `006208`: `1/60`, missing `59`.
- Current blocker: `legal_and_redistribution_terms_unapproved`.
- Runtime boundary remains `publicDataSource=mock`.
- Scoring boundary remains `scoreSource=mock`.

Candidate source lanes already named by local evidence:

| Source lane | Current posture | Gate treatment |
| --- | --- | --- |
| `twse-mis-etf-surface` | `blocked_for_ingestion` | Rejected for execution until rights, fair-use, rate, redistribution, storage, and derived-analysis terms are accepted. |
| `issuer-official-pages` | `candidate_requires_review` | Requires external terms and field-stability review before PM can accept it into any candidate gate. |
| `licensed-vendor` | `candidate_requires_review` | Requires contract scope, storage, display, redistribution, derived-score, Taiwan/global coverage, and operational-limit review. |

No lane is accepted by this gate.

## Narrow Decision Question

Which source lane, if any, can PM/CEO accept for internal storage and derived validation of ETF market-price daily rows for `0050` and `006208`, under documented storage, retention, redistribution, attribution, rate limits, and delayed/missing data wording?

Until that question has an accepted answer, PM must keep ETF coverage blocked and must not create ETF candidate rows from source data.

## Required Acceptance Evidence

PM/CEO may later accept a source lane only if the decision record names all of these items:

| Required item | Acceptance requirement |
| --- | --- |
| Source lane | Exactly one lane is named and its source owner is identifiable. |
| Internal storage | Internal storage of ETF market-price rows or source-derived values is explicitly permitted. |
| Retention | Retention period, cache limits, deletion duties, rollback posture, and audit expectations are documented. |
| Redistribution | Public display, export, screenshots, API reuse, cached-value sharing, and downstream-copy limits are documented. |
| Attribution | Exchange, issuer, vendor, delay, and source wording is accepted. |
| Derived analysis | Row coverage scoring, QA summaries, derived metrics, and internal decision-support use are permitted or kept blocked. |
| Rate limits | Request limits, retry policy, outage behavior, and fair-use constraints are accepted before any later remote fetch. |
| Delayed / missing wording | User-facing and internal wording is accepted for delayed, partial, unavailable, stale, or missing ETF data. |
| Aggregate-only review | Future reports preserve sanitized aggregate output and exclude raw payload, row payload, stock id payload, and secrets. |

ETF `daily_prices` market-price OHLCV/turnover coverage remains separate from NAV, premium/discount, holdings, issuer metadata, tracking index metadata, and intraday indicative value.

## Execution Decision

This gate decides that no ETF execution is currently allowed.

PM must not proceed to:

- ETF candidate generation;
- remote ETF source probe;
- market-data fetch;
- source-data ingestion;
- SQL;
- Supabase connection;
- Supabase write;
- staging row creation;
- `daily_prices` mutation;
- row coverage point award;
- `publicDataSource=supabase`;
- `scoreSource=real`.

## If A Source Lane Is Accepted Later

A later accepted source-rights outcome should open a separate named gate, not reuse this blocked gate as execution authority.

The next route after accepted source rights should be:

1. ETF source-rights accepted outcome ledger.
2. ETF sanitized candidate artifact gate for the remaining `118` missing rows.
3. ETF staging/write authorization gate with one exact command string.
4. Immediate post-run review and bounded aggregate readback.
5. Separate row coverage scoring gate.

## If ETF Remains Blocked

If no source lane can be accepted, PM should keep this gate blocked and reassign A1 to one of these local-only tasks:

1. Blocked-route alternative map comparing ETF, TWII, and launch/runtime non-data routes.
2. TWII source-rights and candidate readiness branch for `TWII` `0/60`.
3. Taiwan all-listed universe manifest refinement as Level 2 planning evidence only.

CEO preference: if ETF rights remain unresolved, switch PM execution toward TWII readiness or launch engineering tasks that do not require ETF rights.

## PM Intake Of A1/A2 Parallel Work

A1 output can support this gate only if it keeps `legal_and_redistribution_terms_unapproved` unchanged unless external authorization evidence exists.

A2 output can support public trust copy, but cannot change this data decision and cannot publish real ETF source claims.

PM remains the only integration owner and must classify lane outputs as `accepted`, `rejected`, `needs_bounded_repair`, or `blocked` before they affect mainline routing.

## Hard Stop

This gate:

- does not run SQL;
- does not connect to Supabase;
- does not write Supabase;
- does not create staging rows;
- does not modify `daily_prices`;
- does not fetch raw market data;
- does not ingest raw market data;
- does not store raw market data;
- does not commit raw market data;
- does not produce ETF candidates;
- does not output secrets;
- does not output raw payload;
- does not output row payload;
- does not output stock id payload;
- does not give row coverage points;
- does not promote `publicDataSource=supabase`;
- does not set `scoreSource=real`.

## Verification

Use:

- `node scripts/check-etf-source-rights-outcome-decision-gate.mjs`
- `cmd.exe /c npm run check:etf-source-rights-outcome-decision-gate`

This checker intentionally reports status `blocked` when the gate is correct, because execution is blocked until external source-rights evidence is accepted.
