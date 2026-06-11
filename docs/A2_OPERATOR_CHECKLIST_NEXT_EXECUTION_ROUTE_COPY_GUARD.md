# A2 Operator Checklist Next Execution Route Copy Guard

Status: `a2_operator_checklist_next_execution_route_copy_guard_ready`
Updated: 2026-06-11
Owner lane: A2 Frontend / UX Readability / Public Trust Copy
Integration owner: PM mainline
PM mainline target: `TWII operator checklist next execution route gate`
Mode: `local_only_next_execution_route_copy_guard`

## Purpose

This document defines the UI, report, public copy, and internal operator wording guardrails for the TWII operator checklist next execution route gate.

The route gate may describe a future review path, routing state, or handoff destination for the next checklist execution review. It must not imply that a real operator authorization, real decision value, Supabase write, `daily_prices` mutation, public data promotion, legal approval, production launch, or investment recommendation has occurred.

Core interpretation:

- `next execution route` means the next local-only review route for checklist handling, not approval to execute a real run.
- `route selected` means copy/workflow routing is ready for PM or operator review, not that a real runtime path is authorized.
- `operator route` means an internal review lane, not a real operator authorization phrase, confirmation phrase, or signed decision.
- `execution still blocked` means no SQL, Supabase connection, Supabase read/write, market-data fetch, staging row creation, `daily_prices` mutation, `publicDataSource=supabase`, or `scoreSource=real` is approved.
- `not investment advice` must remain visible anywhere TWII status, checklist progress, route labels, score language, pressure language, or report summaries could be interpreted as market guidance.

## Non-Executable Boundary

This copy guard is a wording guard only.

Do not:

- run SQL;
- connect to Supabase;
- read Supabase;
- write Supabase;
- import or initialize a Supabase client;
- read, infer, fill, summarize, validate, or display secrets, env values, authorization values, confirmation phrases, real decision values, raw payloads, row payloads, stock-id payloads, source bodies, provider bodies, or market-data rows;
- fetch, ingest, store, print, summarize, refresh, or verify market data;
- create staging rows;
- modify, repair, upsert, insert, update, delete, merge, or validate `daily_prices`;
- accept candidate rows;
- set, request, or imply `publicDataSource=supabase`;
- set, request, or imply `scoreSource=real`;
- claim legal approval, source-rights approval, public redistribution approval, live data readiness, production write readiness, real scoring readiness, coverage completion, or investment-advice approval.

## Safe Wording

Use wording that keeps the route clearly local-only, review-only, non-executing, mock-source, and non-advisory:

- `operator checklist next execution route gate`
- `local-only route review`
- `next review route`
- `route copy reviewed`
- `workflow route selected for review`
- `PM review route`
- `operator review lane`
- `route handoff ready`
- `execution route is review-only`
- `real authorization not collected`
- `real decision values not used`
- `execution still blocked`
- `no SQL executed`
- `no Supabase connection`
- `no Supabase write`
- `no daily_prices mutation`
- `publicDataSource remains mock`
- `scoreSource remains mock`
- `not investment advice`

Preferred UI/report sentence:

> The TWII operator checklist next execution route gate is ready for local-only copy and workflow review. The route identifies a review path only; no real authorization, real decision value, Supabase activity, `daily_prices` mutation, public data promotion, real scoring, legal approval, production launch, or investment advice is included.

Preferred compact badge set:

- `Review route`
- `Local-only`
- `Execution blocked`
- `Mock source`
- `Mock score`
- `Not investment advice`

Safe action labels:

- `Review route`
- `Mark route copy reviewed`
- `Send route to PM review`
- `Prepare route handoff`
- `Flag ambiguous route wording`

## Forbidden Wording

Do not use wording that makes a review route look like real authorization, real writing, legal clearance, public launch, source promotion, real scoring, or investment guidance.

Forbidden phrases or equivalent meanings:

- `operator authorized`
- `authorization completed`
- `real authorization confirmed`
- `operator signed off`
- `execution approved`
- `execution route approved`
- `runner approved`
- `run authorized`
- `route authorized for execution`
- `real decision completed`
- `real decision recorded`
- `real decision value accepted`
- `decision written`
- `write completed`
- `Supabase write completed`
- `stored in Supabase`
- `entered Supabase`
- `daily_prices updated`
- `daily_prices repaired`
- `staging rows created`
- `candidate rows accepted`
- `source rights approved`
- `legal approved`
- `public redistribution approved`
- `live TWII data is active`
- `production route active`
- `production data enabled`
- `public launch approved`
- `coverage complete`
- `publicDataSource=supabase`
- `scoreSource=real`
- `real scoring enabled`
- `investment signal approved`
- `buy`, `sell`, `hold`, `rebalance`, `market timing`, or equivalent advisory language

Avoid status headlines such as:

- `Next Execution Approved`
- `Execution Route Ready`
- `Operator Route Authorized`
- `Authorization Complete`
- `TWII Real Data Ready`
- `Supabase Write Ready`
- `Real Score Active`
- `Legal Clearance Complete`
- `Public Launch Ready`
- `Investment Signal Ready`

Use route-scoped alternatives instead:

- `Next review route ready`
- `Route copy reviewed`
- `Checklist route ready for PM review`
- `Review lane selected`
- `Execution remains blocked`

## Public Copy Rule

Public copy must be conservative, non-advisory, and explicit that this is an internal review route, not a live TWII data, real execution, or scoring feature.

Safe public beta wording:

> Internal next-route copy was added to make future operator review easier to inspect. Public beta remains mock-only; no real authorization, real decision value, Supabase write, market-data mutation, public data promotion, real scoring, legal approval, production launch, or investment advice is included.

Public copy must:

- say `review-only`, `internal`, `local-only`, or `mock-only` near any route or next-execution claim;
- preserve `execution still blocked`;
- preserve `publicDataSource remains mock`;
- preserve `scoreSource remains mock`;
- include `not investment advice` wherever TWII status, score, signal, pressure, route, or checklist wording could be interpreted as guidance;
- avoid implying complete TWII coverage, live market-data reliance, source-rights completion, public redistribution approval, legal clearance, production readiness, or launch readiness.

Public copy must not:

- invite users to rely on the route as a buy, sell, hold, allocation, rebalance, timing, expected-return, profit, or loss-avoidance signal;
- say or imply that a real operator authorized a run;
- say or imply that a real decision value was accepted or recorded;
- say or imply that rows were written, repaired, accepted, or promoted;
- say or imply that Supabase-backed public data or real scoring is active;
- expose raw payloads, row-level records, stock-id payloads, secrets, env values, authorization values, confirmation phrases, real decision values, candidate rows, or market-data rows.

If a public sentence can be read as live-data, legal, production, launch, or investment readiness, fail closed and route the wording back to PM review.

## Internal Operator Copy Rule

Internal operator copy may be direct about routing, but it must still distinguish the next review route from real authorization or execution.

Safe internal wording:

- `Review the next execution route wording for workflow shape only.`
- `Confirm that the route remains local-only and non-executing.`
- `Confirm that no real authorization phrase, confirmation phrase, or decision value is collected.`
- `Confirm that the route does not connect to Supabase or write any row.`
- `Confirm that execution, public data promotion, and real scoring remain blocked.`
- `Escalate to PM if any copy implies legal approval, source-rights approval, real write readiness, production launch, or investment advice.`

Allowed internal labels:

- `operator_checklist_next_execution_route`
- `next_review_route_only`
- `local_only_route_review`
- `workflow_route_reviewed`
- `execution_blocked_verified`
- `mock_source_preserved`
- `mock_score_preserved`
- `pm_review_required_before_real_authorization`

Forbidden internal labels:

- `operator_authorized`
- `real_authorization_complete`
- `real_decision_complete`
- `execution_ready`
- `execution_route_approved`
- `runner_ready`
- `production_route_ready`
- `production_write_ready`
- `supabase_write_ready`
- `daily_prices_ready`
- `publicDataSource_supabase_enabled`
- `scoreSource_real_enabled`
- `legal_approved`
- `public_launch_ready`
- `investment_advice_ready`

Internal notes must not include secrets, env values, authorization phrases, confirmation phrases, raw payloads, row payloads, stock-id payloads, source payloads, provider terms text, real decision values, candidate rows, market-data rows, SQL bodies, Supabase response bodies, or write results.

## UI And Report Semantics

Recommended UI labels:

- Page title: `Operator Checklist Next Execution Route`
- Primary status: `Next review route`
- Scope status: `Local-only review`
- Execution status: `Execution still blocked`
- Source status: `publicDataSource remains mock`
- Score status: `scoreSource remains mock`
- Advisory status: `Not investment advice`
- Review action: `Review route`
- PM action: `Send route to PM review`

Avoid UI labels:

- `Authorize`
- `Execute`
- `Run`
- `Write`
- `Commit`
- `Submit real decision`
- `Record authorization`
- `Promote source`
- `Enable real scoring`
- `Publish live data`
- `Launch production`

Buttons should use review verbs, not execution verbs:

- Safe: `Review route`, `Mark route reviewed`, `Request PM wording review`
- Forbidden: `Authorize`, `Execute`, `Write`, `Commit`, `Promote real`, `Enable Supabase`, `Enable real score`, `Launch live`

Safe report wording:

> The operator checklist next execution route gate is ready as a local-only copy and workflow-route review. The route identifies a future review lane only. No SQL, Supabase connection, Supabase write, market-data fetch, `daily_prices` mutation, real authorization, real decision value, public data promotion, real scoring, legal approval, production launch, or investment advice occurred.

Forbidden report wording:

> The next execution route is approved and execution may proceed.

> TWII real scoring is ready because the operator route is selected.

> The route confirms legal approval, public launch readiness, and live-data execution.

## PM Integration Notes

PM can integrate this guard with the `TWII operator checklist next execution route gate` as copy validation criteria:

- Require the status string `a2_operator_checklist_next_execution_route_copy_guard_ready` before using next execution route wording in UI, reports, public beta copy, operator notes, support copy, release notes, status boards, or handoff summaries.
- Treat `next execution route` as a local-only review route only. It must not mean real authorization, real execution, real write readiness, source-rights approval, legal approval, public launch, row coverage completion, or real scoring.
- Gate output should explicitly include `next review route`, `local-only`, `execution still blocked`, `publicDataSource remains mock`, `scoreSource remains mock`, and `not investment advice`.
- Gate output should reject or flag copy that says authorized, execution approved, written, recorded, Supabase entered, `daily_prices` updated, legal approved, live data active, public launch ready, `publicDataSource=supabase`, `scoreSource=real`, real scoring enabled, or investment signal ready.
- Report fields should prefer names around `nextReviewRoute`, `routeReviewOnly`, `localOnly`, `executionBlocked`, `mockSourcePreserved`, `mockScorePreserved`, and `notInvestmentAdvice`.
- Public copy must remain beta-safe and must not convert a review route into a product claim about live TWII data, full coverage, source-rights clearance, legal approval, production readiness, launch readiness, or investment usefulness.
- Internal operator copy should instruct reviewers to check copy and workflow route shape only, not real values, authorization phrases, confirmation phrases, raw payloads, row payloads, source bodies, market-data rows, or Supabase responses.
- Any future transition from route review to real operator authorization, real execution, Supabase activity, `daily_prices` mutation, public source promotion, production launch, or real scoring must require a separate explicitly approved PM/operator gate outside this document.
- If any UI or report copy is ambiguous about whether the route is review-only or real execution-ready, fail closed and route the wording back to PM.

## Hard Boundary Reminder

This file does not execute SQL, connect to Supabase, read or fill real decision values, fetch market data, inspect raw payloads, create staging rows, mutate `daily_prices`, accept candidate rows, set `publicDataSource=supabase`, set `scoreSource=real`, approve legal commitments, approve production launch, or create investment advice.
