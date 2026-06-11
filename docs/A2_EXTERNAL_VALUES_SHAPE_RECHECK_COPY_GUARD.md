# A2 External Values Shape Recheck Copy Guard

Status: a2_external_values_shape_recheck_copy_guard_ready
Updated: 2026-06-11
Owner lane: A2 Frontend / UX Readability / Public Trust Copy
Integration owner: PM mainline
PM mainline target: `TWII external values shape recheck preparation gate`
Mode: `local_only_copy_guard / shape_recheck_preparation_only / no_execution`

## Purpose

This document defines wording guardrails for PM mainline preparation of the `TWII external values shape recheck preparation gate`.

The gate may describe only copy readiness for a future shape recheck of external-value slots, labels, status fields, and handoff text. It must not imply that real external values have been received, read, accepted, compared, validated, shape-rechecked, approved, executed, written, promoted, legally cleared, or made available as investment guidance.

Core interpretation:

- `external values` means protected value slots or value classes only, not value bodies.
- `shape recheck preparation` means wording and field-shape preparation for PM review only.
- `ready` means this A2 copy guard is ready, not that PM accepted the gate, the shape recheck passed, execution is allowed, real values exist, Supabase has been used, legal approval exists, or trading reliance is allowed.
- `publicDataSource=mock` and `scoreSource=mock` remain explicitly preserved.

## Hard Boundaries

This A2 task is copy-only, local-only, and non-executing.

Do not:

- run SQL;
- connect to Supabase;
- read Supabase;
- write Supabase;
- import or initialize a Supabase client;
- read env values, secrets, authorization values, confirmation phrases, credentials, raw payloads, row payloads, stock-id payloads, source bodies, provider bodies, or real decision values;
- read, request, infer, fill, summarize, validate, compare, accept, display, store, or recheck any real external value;
- fetch, ingest, store, print, summarize, refresh, verify, transform, or derive market data;
- touch, repair, insert, update, delete, merge, upsert, validate, or mutate `daily_prices`;
- read, accept, repair, promote, or create candidate rows or staging rows;
- set, request, or imply `publicDataSource=supabase`;
- set, request, or imply `scoreSource=real`;
- claim source-rights approval, legal approval, public redistribution approval, live data readiness, production write readiness, real scoring readiness, coverage completion, launch approval, or investment-advice approval.

Required retained posture:

- `publicDataSource=mock`
- `scoreSource=mock`

## Safe Wording

Use wording that keeps the gate clearly preparation-only, shape-only, value-hidden, mock-source, mock-score, non-executing, and non-advisory:

- `external values shape recheck preparation gate`
- `shape recheck preparation copy ready`
- `external-value slot wording reviewed`
- `schema-level wording prepared`
- `value-hidden shape preparation`
- `copy guard ready for PM review`
- `PM review required`
- `real external values not requested`
- `real external values not received`
- `real external values not read`
- `real external values not accepted`
- `shape recheck not passed by this guard`
- `execution remains blocked`
- `no SQL executed`
- `no Supabase connection`
- `no Supabase write`
- `no daily_prices mutation`
- `publicDataSource=mock`
- `scoreSource=mock`
- `not investment advice`

Preferred UI/report sentence:

> The TWII external values shape recheck preparation copy guard is ready for PM review only. It prepares value-hidden wording and field-shape labels; no real external values, authorization values, confirmation phrases, Supabase activity, `daily_prices` mutation, public data promotion, real scoring, legal approval, execution approval, launch approval, or investment advice is included.

Preferred compact badge set:

- `Preparation only`
- `Shape copy guard`
- `Value-hidden`
- `Local-only`
- `Execution blocked`
- `Mock source`
- `Mock score`
- `Not investment advice`

Safe status labels:

- `a2_external_values_shape_recheck_copy_guard_ready`
- `copy_guard_ready`
- `shape_recheck_preparation_only`
- `pm_review_required`
- `repair_required`
- `blocked_external_value_claim`
- `blocked_shape_pass_claim`
- `blocked_execution_claim`
- `blocked_write_claim`
- `blocked_promotion_claim`
- `blocked_legal_claim`
- `blocked_advice_claim`

## Forbidden Wording

Do not use wording that makes a preparation/copy guard look like real external-value intake, completed shape recheck, operator authorization, execution, Supabase writing, public launch, legal approval, or investment guidance.

Forbidden phrases or equivalent meanings:

- `external values received`
- `external values collected`
- `external values accepted`
- `external values validated`
- `real external values entered`
- `real external values confirmed`
- `real decision values recorded`
- `shape recheck passed`
- `external shape recheck complete`
- `ready to go`
- `go approved`
- `executed`
- `execution approved`
- `runner approved`
- `run authorized`
- `write approved`
- `write completed`
- `Supabase connected`
- `Supabase write completed`
- `stored in Supabase`
- `daily_prices updated`
- `daily_prices repaired`
- `candidate rows accepted`
- `staging rows created`
- `source rights approved`
- `legal approved`
- `public redistribution approved`
- `live TWII data active`
- `real data online`
- `production data enabled`
- `public launch approved`
- `coverage complete`
- `publicDataSource=supabase`
- `scoreSource=real`
- `real scoring enabled`
- `investment signal approved`
- `buy`, `sell`, `hold`, `rebalance`, `market timing`, expected return, profit, loss-avoidance, or equivalent advisory language

Avoid status headlines such as:

- `External Values Ready`
- `Real Values Received`
- `Shape Recheck Passed`
- `Go for Execution`
- `Execution Complete`
- `Supabase Write Ready`
- `TWII Live Data Ready`
- `Production Launch Ready`
- `Legal Clearance Complete`
- `Real Score Active`
- `Investment Signal Ready`

Use preparation-scoped alternatives instead:

- `Shape recheck preparation copy ready`
- `External-value slot wording prepared`
- `External values remain value-hidden`
- `PM review required`
- `Execution remains blocked`
- `publicDataSource=mock and scoreSource=mock remain locked`

## Public Copy Rule

Public copy must describe only user-facing transparency or beta trust wording. It must not expose internal operator mechanics or imply that real external values, market data, candidate rows, Supabase state, legal approval, execution approval, or launch approval have been provided.

Safe public copy:

> We prepared clearer wording for a future value-hidden TWII external-values shape review. The beta remains mock-only and informational; no real external values, Supabase writes, market-data mutation, public data promotion, real scoring, legal approval, execution approval, production launch, or investment advice is included.

Public copy must:

- state or preserve that the product remains beta, informational, mock-only, local-only, or under review when shown near TWII status, pressure, score, report, or readiness language;
- describe wording and field-shape preparation only, not real external-value receipt or real-value verification;
- preserve `publicDataSource=mock` and never imply Supabase-backed or live public data;
- preserve `scoreSource=mock` and never imply real scoring;
- avoid wording that says or implies external values were received, accepted, verified, shape-rechecked as passed, used, or written;
- avoid source-rights-clearance, legal-clearance, public-redistribution, production-launch, coverage-complete, investor-ready, Go, or execution claims;
- preserve visible non-advice language anywhere TWII status, scoring, pressure, route, or readiness language could be interpreted as guidance.

Public copy must not:

- name, request, hint at, or summarize any external value, authorization value, confirmation phrase, secret, env value, credential, row value, market value, candidate row, or payload;
- invite users to trade, rebalance, time the market, rely on a score, or treat the gate as a recommendation;
- turn internal copy readiness into a public claim that real TWII data, real scoring, Supabase writes, legal approval, or execution approval is active.

## Internal Operator Copy Rule

Internal operator copy may name blocked prerequisites, but it must remain value-hidden and non-executing.

Safe internal operator copy:

> External values shape recheck preparation copy is ready for PM review only. This confirms wording guardrails for value-hidden field shape, not real value receipt or a passed shape recheck. Real external values, authorization values, confirmation phrases, SQL, Supabase connection/read/write, `daily_prices` mutation, candidate-row acceptance, public data promotion, real scoring, legal approval, execution approval, production launch, and investment advice remain blocked. `publicDataSource=mock` and `scoreSource=mock` remain locked.

Internal operator copy must:

- label the gate as `preparation`, `shape`, `copy`, `guard`, `review`, or `PM review` only;
- make clear that no real external value body is requested, read, received, filled, accepted, derived, printed, verified, rechecked, or stored;
- use sanitized blocker categories such as `missing_pm_review`, `value_hidden_required`, `shape_recheck_not_passed`, `execution_blocked`, `write_blocked`, `promotion_blocked`, `legal_blocked`, or `advice_blocked`;
- preserve `publicDataSource=mock` and `scoreSource=mock` in summaries, badges, tables, reports, and handoffs;
- fail closed when wording is ambiguous between copy preparation and real external-value acceptance or passed shape recheck;
- route any stronger claim to PM/legal/operator review without changing runtime state.

Internal operator copy must not:

- ask for real external values, authorization values, confirmation phrase contents, env values, secrets, credentials, row payloads, candidate rows, or market data;
- say an operator has approved, signed, accepted, confirmed, shape-rechecked, authorized, executed, or written anything unless a separate approved gate explicitly owns that claim;
- turn a copy-preparation status into a command, runbook step, SQL instruction, Supabase operation, data-source switch, legal signoff, Go decision, or launch approval;
- display or imply row counts, row bodies, market values, write results, source payloads, candidate rows, Supabase evidence, or real scoring evidence.

## PM Integration Notes

PM may use this document as the wording guard for the `TWII external values shape recheck preparation gate`.

Integration requirements:

- Keep this guard attached to UI labels, report rows, status summaries, release-note snippets, operator handoff copy, and internal checklist copy for the external-values shape recheck preparation gate.
- Treat `a2_external_values_shape_recheck_copy_guard_ready` as copy-guard readiness only, not PM approval, shape recheck pass, legal approval, operator authorization, real-value receipt, real-value acceptance, execution readiness, write readiness, candidate-row acceptance, source promotion, real scoring, Go decision, launch readiness, or investment advice.
- If PM needs a pass/fail field, use `copyGuardStatus` with `accepted_for_copy_review`, `repair_required`, or `rejected_for_overclaim`; do not use `accepted`, `passed`, `go`, or `executed` without a separate owner-approved gate.
- If any surface says or implies real external values were received, external values were verified, shape recheck passed, execution occurred, Supabase was connected or written, `daily_prices` changed, candidate rows were accepted, `publicDataSource=supabase`, `scoreSource=real`, legal approval, public launch, Go decision, or investment advice, PM must mark it `rejected_for_overclaim` or `repair_required`.
- PM integration may repair wording, labels, badges, and summaries only. It must not execute SQL, connect to Supabase, read secrets/env/authorization/confirmation phrase values, read or write real decision values, fetch market data, touch `daily_prices`, accept candidate rows, or change `publicDataSource` or `scoreSource`.
- Downstream status boards should show this as `shape recheck preparation copy guard ready / execution blocked / publicDataSource=mock / scoreSource=mock / not investment advice`.
- Any future real external-value intake, shape recheck pass, operator authorization, write execution, Supabase usage, candidate-row acceptance, public data promotion, real scoring, legal approval, Go decision, or launch decision requires a separate explicitly authorized PM-owned gate.

## Final Surface Rule

Every UI, report, and operator-facing sentence about this gate must pass this test:

> Could a reader reasonably think real external values were received or verified, the shape recheck passed, execution happened, Supabase was written, production data is live, legal approved the workflow, or the text is investment advice?

If yes, the wording fails this guard and must be replaced with preparation-only, shape-only, review-only, value-hidden, mock-source, mock-score, non-executing, non-advisory language.
