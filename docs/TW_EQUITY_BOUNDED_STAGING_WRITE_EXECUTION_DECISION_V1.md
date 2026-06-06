# TW Equity Bounded Staging Write Execution Decision V1

Updated: 2026-06-06

Status: `tw_equity_bounded_staging_write_execution_decision_v1_ready_not_executed`.

## Purpose

This packet is the bounded staging write authorization packet v2 execution decision for the TW equity lane. It inherits `docs/TW_EQUITY_STAGING_WRITE_AUTHORIZATION_READINESS_V2.md` and turns that readiness packet into a next-stage decision without running the write.

This packet originally stopped before runner creation. The later execution GOAL may create a fail-closed runner skeleton, but still must not execute the write runner, run SQL, connect to Supabase, write Supabase, create staging rows, mutate production `daily_prices`, fetch market data, ingest market data, store source-derived rows, print secrets, print source payloads, promote public Supabase data-source mode, award row coverage points, or set `scoreSource=real`.

## Source / Legal Classification Carried Forward

The current classification set remains recorded in `data/source-gates/tw-equity-provider-specific-terms-review-outcomes.json`.

| id | classification | execution-decision meaning |
| --- | --- | --- |
| `permitted-use` | `accepted_for_derived_metrics_only` | Internal derived-metric planning may continue. |
| `attribution` | `accepted_for_delayed_public_display` | Attribution copy may be prepared for delayed public display after later gates. |
| `delay-incompleteness-public-display` | `accepted_for_delayed_public_display` | Delay and incompleteness disclosure copy may be prepared after later gates. |
| `derived-score-use` | `accepted_for_derived_metrics_only` | Derived signal planning may continue; real scoring remains blocked. |
| `retention` | `accepted_for_internal_only` | Internal retention planning may continue; production retention remains separately authorized. |
| `redistribution` | `unknown_keep_blocked` | Public redistribution, download, export, API reuse, and downstream copies remain blocked. |
| `rate-limit-and-outage` | `accepted_for_internal_only` | Internal rate-limit and outage planning may continue. |

`redistribution=unknown_keep_blocked` remains binding. Public redistribution, download, export, API reuse, downstream copies, bulk access, and public source-value redistribution remain blocked.

## CEO Execution Decision

CEO decision: internal-only staging write may proceed to the next authorization-design stage, not to execution.

This means PM may prepare the exact bounded staging write authorization packet and fail-closed runner design. PM must still stop before any real write, SQL, Supabase connection, staging row creation, production `daily_prices` mutation, market-data fetch, public source promotion, row coverage points, or real score-source promotion.

The actual bounded staging write remains a separate next GOAL.

## Required Authorization Packet Fields

The first bounded staging write authorization packet must include every field below before any executable write-capable runner can be created or run:

- authorization id;
- exact command;
- lane: `tw-equity`;
- symbols: `2330`, `2382`, `2308`;
- sessions: `60`;
- target relation set: `staging_twse_stock_day_runs`, `staging_twse_stock_day_prices`;
- max rows: `180`;
- source classification reference: `data/source-gates/tw-equity-provider-specific-terms-review-outcomes.json`;
- service-role posture;
- RLS posture;
- rollback owner;
- rollback dry-run posture;
- retention window;
- post-run review artifact: `docs/reviews/TW_EQUITY_STAGING_FIRST_WRITE_POST_RUN_REVIEW_<DATE>.md`;
- no retry;
- no public redistribution;
- no public promotion;
- no row coverage points;
- no score-source promotion.

## Future Command Contract

The future command shape remains:

```powershell
node scripts/run-tw-equity-staging-write-once.mjs --authorization-id "<AUTHORIZATION_ID>" --lane "tw-equity" --symbols "2330,2382,2308" --sessions 60 --target "staging_twse_stock_day_runs,staging_twse_stock_day_prices" --max-rows 180 --post-run-review "docs/reviews/TW_EQUITY_STAGING_FIRST_WRITE_POST_RUN_REVIEW_<DATE>.md"
```

The command is a contract only. It must not be executed by this packet.

## Required Next Gate

Before actual bounded staging write execution, a separate GOAL must authorize:

- the named authorization id;
- one exact command;
- service-role handling without printing secrets;
- RLS posture;
- rollback owner and rollback dry-run posture;
- retention window;
- immediate post-run review;
- no retry;
- no public redistribution;
- no public promotion;
- no row coverage points from the attempt alone;
- no score-source promotion from the attempt alone.

Until that next GOAL exists, this packet is ready but not executed.
