# A1 Next Data Coverage Handoff

Status: `a1_next_data_coverage_handoff_ready_local_only_pm_intake`

Date: 2026-06-07

## Purpose

This is an A1 Data / Supabase / Market Evidence handoff for PM integration. It summarizes the current Level 1 MVP row coverage gap and names the smallest next local-only data task using the repo's existing coverage gates.

This handoff is not a new governance system. It references the existing row coverage scoring gate, ETF coverage route, coverage universe roadmap, and data-goal readiness reports.

## Current Evidence

Current Level 1 MVP row coverage remains incomplete:

- Full MVP universe: `182/360`.
- Missing rows: `178`.
- Full-scope status: `blocked_incomplete`.
- TW equity sub-scope: `180/180`, accepted complete for `2330`, `2382`, and `2308`.
- ETF sub-scope: `2/120`.
- Remaining ETF rows: `118`.
- `TWII`: `0/60`.
- `0050`: `1/60`.
- `006208`: `1/60`.

Evidence sources:

- `docs/TW_EQUITY_ROW_COVERAGE_SCORING_GATE.md` records `tw_equity_row_coverage_subscope_accepted_overall_coverage_blocked`.
- `docs/ETF_DAILY_PRICES_COVERAGE_COMPLETION_ROUTE.md` records `etf_daily_prices_coverage_completion_route_ready_source_rights_blocked`.
- `docs/COVERAGE_UNIVERSE_ROADMAP.md` keeps Level 1 MVP completion separate from Level 2 all-listed expansion.
- `scripts/report-data-goal-readiness.mjs` reports `bounded_readonly_attempt_reviewed_aggregate_incomplete`.

## Missing Lanes

Level 1 still needs coverage for three blocked lanes:

| Lane | Current evidence | Missing rows | Current blocker |
| --- | ---: | ---: | --- |
| `TWII` index daily coverage | `0/60` | `60` | Needs source-specific route and accepted execution gate before any remote action. |
| `0050` ETF daily coverage | `1/60` | `59` | ETF source-rights and redistribution terms remain unapproved. |
| `006208` ETF daily coverage | `1/60` | `59` | ETF source-rights and redistribution terms remain unapproved. |

The existing ETF route already selects the ETF lane as the next data-coverage completion route after TW equity reached `180/180`. A1 should not reopen the route decision unless PM changes the priority.

## Allowed Next Local-Only Actions

A1 may do these actions without crossing the current boundary:

- Consolidate the ETF source-rights outcome intake requirements for `0050` and `006208`.
- Draft an ETF field contract for `daily_prices` coverage, limited to the fields already expected by the existing route.
- Define the sanitized ETF candidate artifact shape for the `118` missing ETF rows without generating candidates from remote or raw source data.
- Define execution-readiness criteria for a future ETF staging/write packet.
- Confirm which existing checker should be used by PM before any remote or write step.
- Keep the current runtime state at `publicDataSource=mock`.
- Keep the current scoring state at `scoreSource=mock`.

These actions may reference aggregate counts and existing status strings only. They must not print secrets, raw payload, row payload, or stock id payload.

## Actions Requiring A Separate CEO / PM Gate

The following remain blocked unless CEO / PM opens a separately named gate with explicit scope, command, post-run review, and stop conditions:

- SQL execution.
- Supabase connection.
- Supabase writes.
- Staging row creation.
- `daily_prices` mutation.
- Raw market data fetch.
- Raw market data ingestion.
- Raw market data storage.
- Raw market data commit.
- ETF candidate artifact generation from remote/source data.
- TWII source probing or execution.
- Row payload output.
- Stock id payload output.
- Secret output.
- Row coverage points.
- Public source promotion.
- `publicDataSource=supabase`.
- `scoreSource=real`.

## A1 Recommended Next Task

Recommended next smallest A1 task:

Create an ETF source-rights outcome and candidate artifact readiness packet for `0050` and `006208`.

The packet should combine, in one local-only slice:

- source-rights outcome intake;
- ETF `daily_prices` field contract;
- sanitized candidate artifact shape for the remaining `118` ETF rows;
- execution-readiness criteria;
- explicit stop line before any remote fetch, ingestion, SQL, Supabase write, staging row creation, `daily_prices` mutation, row coverage points, public source promotion, or real score promotion.

Why this is smallest:

- TW equity is already accepted complete at `180/180`.
- ETF coverage is the existing selected next route.
- ETF missing coverage is `118` rows, which is smaller than solving ETF and TWII together.
- The existing ETF route already says the next slice should combine source-rights outcome intake, field contract, candidate artifact shape, and execution-readiness criteria.

The recommended task remains local-only. It should stop before candidate generation from remote/source data.

## PM Intake Checklist

PM can integrate this handoff when:

- `npm run check:a1-next-data-coverage-handoff` passes.
- `npm run check:tw-equity-row-coverage-scoring-gate` still confirms `182/360` and `178` missing rows.
- `npm run check:etf-daily-prices-coverage-completion-route` still confirms ETF `2/120` with `118` missing rows.
- `npm run check:coverage-universe-roadmap` still keeps Level 1 MVP separate from Level 2 all-listed expansion.
- PM accepts ETF as the next route or explicitly overrides the route to TWII in a separate decision.
- PM keeps `publicDataSource=mock` and `scoreSource=mock`.

## Boundary

This handoff:

- does not run SQL;
- does not connect to Supabase;
- does not write Supabase;
- does not create staging rows;
- does not modify `daily_prices`;
- does not fetch raw market data;
- does not ingest raw market data;
- does not store raw market data;
- does not commit raw market data;
- does not output secrets;
- does not output raw payload;
- does not output row payload;
- does not output stock id payload;
- does not generate ETF candidates from remote/source data;
- does not award row coverage points;
- does not promote `publicDataSource=supabase`;
- does not set `scoreSource=real`.
