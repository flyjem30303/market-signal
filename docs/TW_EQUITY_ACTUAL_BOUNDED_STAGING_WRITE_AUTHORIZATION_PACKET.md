# TW Equity Actual Bounded Staging Write Authorization Packet

Updated: 2026-06-06

Status: `tw_equity_actual_bounded_staging_write_authorization_packet_ready_not_executed`.

## Purpose

This packet prepares the actual bounded staging write authorization for the TW equity lane. It inherits `docs/TW_EQUITY_BOUNDED_STAGING_WRITE_EXECUTION_DECISION_V1.md` and `docs/TW_EQUITY_WRITE_RUNNER_FAIL_CLOSED_DESIGN.md`.

This packet is authorization-ready but not execution-complete. It does not run SQL, connect to Supabase, write Supabase, create staging rows, mutate production `daily_prices`, fetch market data, ingest market data, store source-derived rows, print secrets, print source payloads, promote public source, award row coverage points, or set `scoreSource=real`.

## Authorization Fields

| field | value |
| --- | --- |
| authorization id | `TW-EQUITY-STAGING-WRITE-2026-06-06-AUTH-001` |
| exact command | `node scripts/run-tw-equity-staging-write-once.mjs --authorization-id "TW-EQUITY-STAGING-WRITE-2026-06-06-AUTH-001" --lane "tw-equity" --symbols "2330,2382,2308" --sessions 60 --target "tw_equity_daily_prices_staging" --max-rows 180 --post-run-review "docs/reviews/TW_EQUITY_STAGING_FIRST_WRITE_POST_RUN_REVIEW_2026-06-06.md"` |
| lane | `tw-equity` |
| symbols | `2330`, `2382`, `2308` |
| sessions | `60` |
| target relation | `tw_equity_daily_prices_staging` |
| max rows | `180` |
| source classification reference | `data/source-gates/tw-equity-provider-specific-terms-review-outcomes.json` |
| service-role posture | `required_for_future_execution_but_not_loaded_or_printed_by_this_packet` |
| RLS posture | `staging_relation_write_requires_explicit_service_role_or_policy_review` |
| rollback owner | `PM` |
| rollback dry-run posture | `required_before_actual_execution_not_run_by_this_packet` |
| retention window | `internal_staging_validation_window_7_days_then_review_or_purge` |
| post-run review artifact | `docs/reviews/TW_EQUITY_STAGING_FIRST_WRITE_POST_RUN_REVIEW_2026-06-06.md` |
| no retry | `true` |
| no public redistribution | `true` |
| no public promotion | `true` |
| no row coverage points | `true` |
| no score-source promotion | `true` |

## Source / Legal Carry-Forward

The classification reference remains `data/source-gates/tw-equity-provider-specific-terms-review-outcomes.json`.

| id | classification |
| --- | --- |
| `permitted-use` | `accepted_for_derived_metrics_only` |
| `attribution` | `accepted_for_delayed_public_display` |
| `delay-incompleteness-public-display` | `accepted_for_delayed_public_display` |
| `derived-score-use` | `accepted_for_derived_metrics_only` |
| `retention` | `accepted_for_internal_only` |
| `redistribution` | `unknown_keep_blocked` |
| `rate-limit-and-outage` | `accepted_for_internal_only` |

`redistribution=unknown_keep_blocked` remains active. Public redistribution, download, export, API reuse, downstream copies, public source-value redistribution, and bulk access remain blocked.

## CEO Authorization Decision

CEO decision: the packet is ready for a one-attempt bounded staging write execution gate, but the current GOAL does not execute the write.

The current stage creates a fail-closed runner skeleton at `scripts/run-tw-equity-staging-write-once.mjs`. The skeleton remains inert, prints sanitized JSON only, and refuses execution while target relation reconciliation is blocked.

## Execution Preconditions

Before any actual execution, the next execution gate must prove:

- the exact command matches this packet;
- the authorization id matches this packet;
- the runner safety checker passes;
- service-role handling is explicit and does not print secrets;
- RLS posture is acknowledged;
- rollback owner is present;
- rollback dry-run posture is accepted;
- retention window is accepted;
- immediate post-run review artifact path is ready;
- no retry is accepted;
- public redistribution remains blocked;
- public promotion remains blocked;
- row coverage points remain blocked from this attempt alone;
- score-source promotion remains blocked from this attempt alone.

## Current Stop Line

This packet makes the project ready to decide on one actual bounded staging write execution. It does not perform that execution.
