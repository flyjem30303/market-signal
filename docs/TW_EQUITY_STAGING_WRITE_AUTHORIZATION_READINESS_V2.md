# TW Equity Staging Write Authorization Readiness V2

Updated: 2026-06-06

Status: `tw_equity_staging_write_authorization_readiness_v2_complete_not_executable`.

## Purpose

This readiness packet lets CEO/PM decide whether the project is ready to open a separate bounded staging write authorization slice for the TW equity lane. It is the last local-only engineering readiness step before a future write-capable runner decision.

This packet does not authorize execution. It does not create a write runner, run SQL, connect to Supabase, write Supabase, create staging rows, mutate production `daily_prices`, fetch market data, ingest market data, store source-derived rows, print secrets, print source payloads, promote public Supabase data-source mode, award row coverage points, or set `scoreSource=real`.

## Current Source / Legal Classification

The current classification set is recorded in `data/source-gates/tw-equity-provider-specific-terms-review-outcomes.json` and reported by `scripts/report-tw-equity-provider-specific-terms-review-outcome-ledger.mjs`.

| id | classification | readiness meaning |
| --- | --- | --- |
| `permitted-use` | `accepted_for_derived_metrics_only` | Can prepare derived-metric planning only; not a public source or write approval. |
| `attribution` | `accepted_for_delayed_public_display` | Attribution copy may be prepared for delayed public display after later gates. |
| `delay-incompleteness-public-display` | `accepted_for_delayed_public_display` | Delay / incompleteness disclosure copy may be prepared after later gates. |
| `derived-score-use` | `accepted_for_derived_metrics_only` | Derived signal planning may continue; public scoring and real score source remain blocked. |
| `retention` | `accepted_for_internal_only` | Internal retention planning may continue; production retention remains separately authorized. |
| `redistribution` | `unknown_keep_blocked` | Public redistribution, downloads, exports, API reuse, and downstream copies remain blocked. |
| `rate-limit-and-outage` | `accepted_for_internal_only` | Internal rate-limit and outage handling may be planned; remote read scheduling remains separately authorized. |

## Redistribution Stop Line

Because `redistribution` remains `unknown_keep_blocked`, the following remain blocked:

- public redistribution;
- download;
- export;
- API reuse;
- downstream copies;
- bulk access;
- public raw-value source redistribution.

This blocker does not prevent preparing an internal-only staging write authorization packet, but it prevents treating staging rows as public, downloadable, redistributable, or production-ready.

## Internal-Only Staging Write Preparation Decision

CEO decision: internal-only staging write preparation is allowed as a local readiness path.

Meaning:

- PM may prepare a future bounded staging write authorization packet.
- PM may define exact command shape, fields, rollback posture, retention posture, and post-run review requirements.
- PM may keep target relation proposal as `tw_equity_daily_prices_staging`.
- PM may keep symbols as `2330`, `2382`, and `2308`.
- PM may keep bounded session count as `60` and max rows as `180`.

Still not allowed from this packet:

- creating `scripts/run-tw-equity-staging-write-once.mjs`;
- executing any write-capable command;
- SQL;
- Supabase connection or writes;
- staging row creation;
- production `daily_prices` mutation;
- market-data fetch or ingestion;
- public source promotion;
- row coverage points;
- `scoreSource=real`.

## Required Fields For The Next Bounded Staging Write Authorization

The next authorization slice must provide all fields below before any write runner can be created or executed:

- authorization id;
- exact command;
- lane: `tw-equity`;
- symbols: `2330`, `2382`, `2308`;
- sessions: `60`;
- target relation: `tw_equity_daily_prices_staging`;
- max rows: `180`;
- source classification reference: `data/source-gates/tw-equity-provider-specific-terms-review-outcomes.json`;
- service-role posture;
- RLS posture;
- rollback owner;
- rollback dry-run command posture;
- retention window;
- post-run review artifact: `docs/reviews/TW_EQUITY_STAGING_FIRST_WRITE_POST_RUN_REVIEW_<DATE>.md`;
- no retry without a new approval;
- no public redistribution;
- no public source promotion by itself;
- no row coverage points by itself;
- no score-source promotion by itself.

Missing any field blocks the next authorization slice.

## Future Command Shape

The future command shape remains:

```powershell
node scripts/run-tw-equity-staging-write-once.mjs --authorization-id "<AUTHORIZATION_ID>" --lane "tw-equity" --symbols "2330,2382,2308" --sessions 60 --target "tw_equity_daily_prices_staging" --max-rows 180 --post-run-review "docs/reviews/TW_EQUITY_STAGING_FIRST_WRITE_POST_RUN_REVIEW_<DATE>.md"
```

The command is named here only for authorization readiness. It does not exist yet and must not be created or executed by this V2 packet.

## Required Checks Before Opening The Next Authorization Slice

Run:

```powershell
node scripts/check-tw-equity-provider-specific-terms-review-outcome-ledger.mjs
node scripts/check-tw-equity-source-review-readiness-summary.mjs
node scripts/check-tw-equity-staging-first-preflight-runner.mjs
node scripts/check-tw-equity-staging-first-write-authorization-packet-v1.mjs
node scripts/check-tw-equity-staging-first-write-post-run-review-template-v1.mjs
node scripts/check-review-gates.mjs
```

All checks must pass before a future bounded staging write authorization slice can be opened.

## CEO Recommendation

CEO recommends moving next to a separate "bounded staging write authorization packet v2 execution decision" slice. That next slice may decide whether to create a write-capable runner, but this packet itself must stop before runner creation, SQL, Supabase connection, Supabase writes, staging rows, market-data fetch, public promotion, row coverage points, and real score source.
