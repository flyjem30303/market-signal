# ETF Daily Prices Coverage Completion Route

Status: `etf_daily_prices_coverage_completion_route_ready_source_rights_blocked`

Date: 2026-06-07

## CEO Decision

CEO selects the ETF lane as the next data-coverage completion route after TW equity production coverage reached `180/180`.

This route is a planning and gate alignment slice only. It does not approve ETF market-data fetch, ETF candidate artifact generation, Supabase writes, SQL, `daily_prices` mutation, public source promotion, row coverage points, or real score source promotion.

## Current Coverage Evidence

Latest accepted post-merge row coverage readback:

- full MVP expected rows: `360`;
- full MVP observed rows: `182`;
- full MVP missing rows: `178`;
- TW equity sub-scope: `180/180`;
- ETF sub-scope: `2/120`;
- remaining ETF rows: `118`;
- `0050`: `1/60`;
- `006208`: `1/60`;
- `TWII`: `0/60`.

## Target Scope

ETF coverage completion target:

- symbols: `0050`, `006208`;
- expected sessions per symbol: `60`;
- expected total ETF rows: `120`;
- current observed ETF rows: `2`;
- target missing ETF rows: `118`;
- intended production target: `daily_prices`;
- staging-first posture: required unless a later packet explicitly proves a safer direct path.

## Source-Rights Blocker

ETF source-rights remain blocked by the existing ETF source-rights review packet:

- status: `etf_source_rights_review_packet_prepared`;
- blocker: `legal_and_redistribution_terms_unapproved`;
- target symbols: `0050`, `006208`;
- candidate lanes: TWSE MIS ETF surface, issuer official pages, licensed vendor.

The ETF coverage route may not proceed to candidate generation or write execution until a source-rights decision accepts at least one route for internal storage and derived analysis.

## Required Next Artifacts

Before any ETF row can be added to production coverage, PM must produce or accept:

1. ETF source-rights decision outcome.
2. ETF field contract for `daily_prices` coverage, limited to OHLCV/turnover if ETF-specific NAV fields are out of scope for this coverage step.
3. Sanitized ETF candidate artifact with exactly `118` missing candidate rows or a documented reason for a different count.
4. ETF staging/write authorization packet.
5. ETF bounded write runner or explicit reuse decision for an existing safe runner.
6. ETF post-run review.
7. ETF post-write row coverage readback.
8. Row coverage scoring gate update.

## Acceleration Rule

To avoid over-governance, the next ETF slice should combine source-rights outcome intake, field contract, candidate artifact shape, and execution-readiness criteria into one packet.

The slice must stop before any remote fetch, ingestion, SQL, Supabase write, or `daily_prices` mutation.

## Boundary

Still blocked:

- ETF market-data fetch;
- ETF ingestion;
- ETF candidate artifact generation from remote/source data;
- SQL execution;
- Supabase write;
- `daily_prices` mutation;
- row payload output;
- secret output;
- public source promotion;
- row coverage points;
- real score source promotion.

## CEO Recommendation

Next route: create an ETF source-rights outcome and candidate artifact readiness packet for `0050` and `006208`, using the latest `2/120` ETF coverage state and requiring the packet to decide whether TWSE MIS, issuer pages, or licensed vendor is the approved source lane.
