# A1 ETF Source-Rights Outcome Decision Support

Status: `a1_etf_source_rights_outcome_decision_support_ready_blocked_pending`

Date: 2026-06-07

## Purpose

This A1 Data / Supabase / Market Evidence packet supports PM/CEO decision-making for ETF source-rights outcome intake. It does not approve source rights and does not move ETF coverage into candidate generation, remote fetch, staging, write, readback, or scoring.

If PM/CEO does not have external authorization evidence for the chosen source lane, A1 recommendation is to keep ETF source rights blocked as `legal_and_redistribution_terms_unapproved`.

## Current ETF Coverage

Current Level 1 ETF row coverage evidence:

- Target ETFs: `0050`, `006208`.
- Combined ETF coverage: `2/120`.
- Missing ETF rows: `118`.
- `0050`: `1/60`, missing `59`.
- `006208`: `1/60`, missing `59`.
- Current route status: `etf_daily_prices_coverage_completion_route_ready_source_rights_blocked`.
- Current rights blocker: `legal_and_redistribution_terms_unapproved`.
- Runtime boundary remains `publicDataSource=mock`.
- Scoring boundary remains `scoreSource=mock`.

Evidence anchors:

- `docs/ETF_DAILY_PRICES_COVERAGE_COMPLETION_ROUTE.md`.
- `docs/ETF_SOURCE_RIGHTS_AND_CANDIDATE_READINESS_PACKET.md`.
- `src/lib/etf-source-rights-review-packet.ts`.
- `docs/A1_NEXT_DATA_COVERAGE_HANDOFF.md`.

## Candidate Source Lanes

The existing ETF source-rights packet identifies three candidate source lanes:

| Source lane | Current posture | A1 decision-support note |
| --- | --- | --- |
| `twse-mis-etf-surface` | `blocked_for_ingestion` | Do not use for automated fetch, storage, or candidate generation unless PM/CEO accepts terms, fair use, rate limits, redistribution, field stability, and derived-analysis rights. |
| `issuer-official-pages` | `candidate_requires_review` | Requires issuer terms, field coverage, format stability, normalization cost, update cadence, attribution, retention, and redistribution review. |
| `licensed-vendor` | `candidate_requires_review` | Requires contract scope, storage rights, display rights, redistribution rights, derived-score rights, global/Taiwan coverage, and operational limits. |

No lane is accepted by this packet.

## Rights Conditions PM/CEO Must Accept

For any lane to advance into the next gate, PM/CEO must accept evidence for all of these rights conditions:

| Condition | Acceptance question | If not accepted |
| --- | --- | --- |
| Internal storage | Does the source allow internal storage of ETF market-price rows or source-derived values for `0050` and `006208`? | Keep `legal_and_redistribution_terms_unapproved`. |
| Retention | Are retention period, deletion duties, cache limits, and audit expectations documented? | Keep `legal_and_redistribution_terms_unapproved`. |
| Redistribution | Are public display, sharing, export, screenshot, API, and cached-value restrictions documented? | Keep `legal_and_redistribution_terms_unapproved`. |
| Attribution | Is required exchange, issuer, vendor, delay, and source attribution wording accepted? | Keep `legal_and_redistribution_terms_unapproved`. |
| Derived analysis | Are row coverage scoring, derived metrics, QA summaries, and internal decision-support use permitted? | Keep `legal_and_redistribution_terms_unapproved`. |
| Rate limits | Are request limits, retry policy, outage handling, and fair-use constraints accepted before any future remote fetch? | Keep `legal_and_redistribution_terms_unapproved`. |
| Delayed / missing wording | Is user-facing and internal wording accepted for delayed, partial, unavailable, or missing ETF data? | Keep `legal_and_redistribution_terms_unapproved`. |

The source-rights outcome must also preserve the field boundary from the readiness packet: market-price `daily_prices` OHLCV/turnover coverage is separate from NAV, premium/discount, holdings, issuer metadata, tracking index metadata, and intraday indicative value.

## Current Recommendation

A1 recommendation:

- Maintain `legal_and_redistribution_terms_unapproved` unless PM/CEO provides external authorization evidence for one named source lane.
- Do not enter ETF candidate generation.
- Do not run a remote source probe or market-data fetch.
- Do not create source-derived candidate rows.
- Do not open a staging/write gate from this packet.
- Keep ETF row coverage points blocked.
- Keep `publicDataSource=mock`.
- Keep `scoreSource=mock`.

Decision posture:

`blocked_pending_external_rights_evidence`

This is the safest current decision because the repo evidence names source-rights and redistribution terms as unapproved, while the ETF route requires accepted source-rights outcome before candidate generation or write execution.

## Next Safe A1 Task

If PM/CEO cannot accept source rights now, the next safe A1 task should avoid ETF candidate generation and remote work.

Recommended options:

1. Create a blocked-route alternative map: compare ETF blocked route, TWII readiness branch, and continued mock-only runtime posture using only existing local evidence.
2. Start a TWII readiness branch: prepare a local-only TWII source-rights and field-contract readiness packet for `TWII` `0/60`, without probing or fetching data.

A1 recommendation is option 1 first if PM needs a route decision, or option 2 first if PM has already decided ETF rights are blocked and wants to keep Level 1 progress moving through another lane.

## Decision Outcomes PM May Record Later

This packet supports these possible future PM/CEO outcomes:

- `blocked_pending_external_rights_evidence`: no lane has enough rights evidence; no candidate generation or remote action.
- `candidate_lane_needs_legal_review`: one lane is promising but not accepted.
- `source_lane_accepted_for_next_gate_only`: one lane is accepted only for a separately named candidate-readiness or execution-prep gate.
- `source_lane_rejected`: one lane is rejected because storage, retention, redistribution, attribution, derived analysis, rate limits, or delayed/missing wording cannot be accepted.

Only a later PM/CEO outcome may change the blocker. This packet itself leaves the blocker at `legal_and_redistribution_terms_unapproved`.

## Hard Stop

This packet:

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

## PM Intake Checklist

PM can use this decision support packet when:

- `npm run check:a1-etf-source-rights-outcome-decision-support` passes.
- `npm run check:etf-source-rights-and-candidate-readiness-packet` still confirms readiness is local-only and not executable.
- `npm run check:etf-source-rights-review-packet` still confirms the three source lanes and the current blocker.
- `npm run check:etf-daily-prices-coverage-completion-route` still confirms ETF `2/120` and missing `118`.
- PM/CEO has reviewed whether external authorization evidence exists for internal storage, retention, redistribution, attribution, derived analysis, rate limits, and delayed/missing wording.
