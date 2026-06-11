# A2 Operator Values Intake Readiness Surface Copy Guard

Status: `a2_operator_values_intake_readiness_surface_copy_guard_ready`
Updated: 2026-06-11
Owner lane: A2 Frontend / UX Readability / Public Trust Copy
Integration owner: PM mainline
PM mainline target: `TWII operator values intake readiness surface gate`
Mode: `local_only_surface_copy_guard`

## Purpose

This document defines UI, report, and internal operator wording guardrails for the TWII operator values intake readiness surface gate.

The surface gate may describe whether future operator-value intake surfaces are understandable, bounded, and ready for PM review. It must not imply that real decision values were requested, read, filled, accepted, validated, authorized, written, promoted, legally approved, launched, or turned into investment advice.

Core interpretation:

- `operator values intake readiness` means the intake surface copy and review posture are ready for PM inspection only.
- `values intake surface` means UI/report/operator wording around a future intake checkpoint, not a live form for collecting real values.
- `ready` means wording-ready or review-ready only, not execution-ready, write-ready, launch-ready, legal-ready, or investment-ready.
- `operator` means an internal review role or lane, not proof that an authorization value, confirmation phrase, credential, or real decision value has been provided.
- `surface` means visible copy, labels, badges, report rows, warnings, and handoff text only. It is not a runtime runner, write path, data-source switch, legal signoff, or investment signal.

## Non-Executable Boundary

This A2 task is copy-only and surface-only.

Do not:

- run SQL;
- connect to Supabase;
- read Supabase;
- write Supabase;
- import or initialize a Supabase client;
- read, infer, fill, summarize, validate, compare, accept, display, or store real decision values;
- read env values, secrets, authorization values, confirmation phrases, credentials, raw payloads, row payloads, stock-id payloads, source bodies, provider bodies, or market-data rows;
- fetch, ingest, store, print, summarize, refresh, verify, or transform market data;
- touch, repair, insert, update, delete, merge, upsert, validate, or mutate `daily_prices`;
- read, accept, repair, promote, or create candidate rows or staging rows;
- set, request, or imply `publicDataSource=supabase`;
- set, request, or imply `scoreSource=real`;
- claim source-rights approval, legal approval, public redistribution approval, live data readiness, production write readiness, real scoring readiness, coverage completion, launch approval, or investment-advice approval.

## Safe Wording

Use wording that keeps the gate clearly local-only, review-only, value-hidden, mock-source, mock-score, and non-advisory:

- `operator values intake readiness surface gate`
- `values intake copy reviewed`
- `values intake surface ready for PM review`
- `review-only intake surface`
- `value-hidden intake wording`
- `future intake checkpoint`
- `operator review surface`
- `PM review required`
- `real values not requested`
- `real values not read`
- `real values not filled`
- `real values not accepted`
- `authorization values not read`
- `confirmation phrases not read`
- `execution remains blocked`
- `no SQL executed`
- `no Supabase connection`
- `no Supabase write`
- `no daily_prices mutation`
- `publicDataSource remains mock`
- `scoreSource remains mock`
- `not investment advice`

Preferred UI/report sentence:

> The TWII operator values intake readiness surface is ready for local-only copy review. It describes a future value-hidden intake checkpoint only; no real decision values, authorization values, confirmation phrases, Supabase activity, `daily_prices` mutation, public data promotion, real scoring, legal approval, production launch, or investment advice is included.

Preferred compact badge set:

- `Copy review`
- `Value-hidden`
- `Local-only`
- `Execution blocked`
- `Mock source`
- `Mock score`
- `Not investment advice`

Safe action labels:

- `Review intake copy`
- `Send surface to PM review`
- `Mark copy reviewed`
- `Flag value-risk wording`
- `Request wording repair`

Safe status labels:

- `copy_review_ready`
- `pm_review_required`
- `repair_required`
- `blocked_value_claim`
- `blocked_authorization_claim`
- `blocked_execution_claim`
- `blocked_promotion_claim`
- `blocked_advice_claim`

## Forbidden Wording

Do not use wording that makes a surface-copy gate look like real value intake, real authorization, real writing, public launch, legal approval, or investment guidance.

Forbidden phrases or equivalent meanings:

- `operator values received`
- `operator values collected`
- `operator values accepted`
- `operator values validated`
- `real values entered`
- `real values confirmed`
- `real decision values recorded`
- `decision values approved`
- `operator authorized`
- `authorization completed`
- `confirmation phrase verified`
- `operator signed off`
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
- `production data enabled`
- `public launch approved`
- `coverage complete`
- `publicDataSource=supabase`
- `scoreSource=real`
- `real scoring enabled`
- `investment signal approved`
- `buy`, `sell`, `hold`, `rebalance`, `market timing`, expected return, profit, loss-avoidance, or equivalent advisory language

Avoid status headlines such as:

- `Operator Values Ready`
- `Real Values Accepted`
- `Authorization Complete`
- `Execution Ready`
- `Supabase Write Ready`
- `TWII Live Data Ready`
- `Production Launch Ready`
- `Legal Clearance Complete`
- `Real Score Active`
- `Investment Signal Ready`

Use surface-scoped alternatives instead:

- `Intake copy ready for review`
- `Value-hidden surface reviewed`
- `Operator intake surface needs PM review`
- `Execution remains blocked`
- `Real values remain out of scope`

## Public Copy Rule

Public copy must describe only user-facing transparency or beta trust wording. It must not expose internal operator mechanics or imply that real operator values have been collected.

Safe public copy:

> We added clearer review wording for a future operator intake checkpoint. The beta remains mock-only and informational; no real decision values, authorization values, Supabase writes, market-data mutation, public data promotion, real scoring, legal approval, production launch, or investment advice is included.

Public copy must:

- state or preserve that the product remains beta, informational, or under review when shown near TWII status, pressure, score, or report language;
- keep `publicDataSource` effectively described as mock/local/pending review, never Supabase-backed or live;
- keep `scoreSource` effectively described as mock/pending review, never real scoring;
- avoid wording that says or implies operator values were received, accepted, verified, or used;
- avoid legal-clearance, source-rights-clearance, public-redistribution, production-launch, coverage-complete, or investor-ready claims;
- preserve visible non-advice language anywhere TWII status, scoring, pressure, route, or readiness language could be interpreted as guidance.

Public copy must not:

- name, request, hint at, or summarize any authorization value, confirmation phrase, secret, env value, credential, row value, market value, candidate row, or payload;
- invite users to trade, rebalance, time the market, rely on a score, or treat the gate as a recommendation;
- turn internal readiness into a public claim that real TWII data or real scoring is active.

## Internal Operator Copy Rule

Internal operator copy may be more explicit about blocked prerequisites, but it must remain value-hidden and non-executing.

Safe internal operator copy:

> Operator values intake readiness surface copy is ready for PM review only. Real decision values, authorization values, confirmation phrases, SQL, Supabase connection/read/write, `daily_prices` mutation, candidate-row acceptance, public data promotion, real scoring, legal approval, production launch, and investment advice remain blocked.

Internal operator copy must:

- label the gate as `surface`, `copy`, `readiness`, `review`, or `PM review` only;
- make clear that no value body is requested, read, filled, accepted, derived, printed, or stored;
- use sanitized blocker categories such as `missing_pm_review`, `value_hidden_required`, `authorization_separate`, `execution_blocked`, `promotion_blocked`, or `advice_blocked`;
- preserve `publicDataSource=mock` and `scoreSource=mock` in summaries, badges, tables, reports, and handoffs;
- fail closed when wording is ambiguous between copy readiness and real acceptance;
- route any stronger claim to PM/legal/operator review without changing runtime state.

Internal operator copy must not:

- ask for real values, authorization values, confirmation phrase contents, env values, secrets, credentials, row payloads, candidate rows, or market data;
- say an operator has approved, signed, accepted, confirmed, or executed anything unless a separate approved gate explicitly owns that claim;
- turn a copy-review status into a command, runbook step, SQL instruction, Supabase operation, or data-source switch;
- display or imply row counts, row bodies, market values, write results, source payloads, or Supabase evidence.

## PM Integration Notes

PM may use this document as the wording guard for the `TWII operator values intake readiness surface gate`.

Integration requirements:

- Keep this guard attached to UI labels, report rows, status summaries, release-note snippets, operator handoff copy, and internal checklist copy for the values-intake surface.
- Treat `a2_operator_values_intake_readiness_surface_copy_guard_ready` as copy-guard readiness only, not PM approval, legal approval, operator authorization, real-value acceptance, execution readiness, or launch readiness.
- If PM needs a pass/fail field, use `copyGuardStatus` with `accepted_for_copy_review`, `repair_required`, or `rejected_for_overclaim`; do not use `accepted` without the `for_copy_review` qualifier.
- If any surface says or implies real values were collected, authorization was completed, Supabase was connected or written, `daily_prices` changed, candidate rows were accepted, `publicDataSource=supabase`, `scoreSource=real`, legal approval, public launch, or investment advice, PM must mark it `rejected_for_overclaim` or `repair_required`.
- PM integration may repair wording, labels, badges, and summaries only. It must not execute SQL, connect to Supabase, read or write data, inspect values, fetch market data, touch `daily_prices`, accept candidate rows, or change source/scoring switches.
- Downstream status boards should show this as `copy guard ready / execution blocked / mock source / mock score / not investment advice`.
- Any future real operator intake, real authorization, write execution, Supabase usage, public data promotion, real scoring, legal approval, or launch decision requires a separate explicitly authorized PM-owned gate.

## Final Surface Rule

Every UI, report, and operator-facing sentence about this gate must pass this test:

> Could a reader reasonably think real values were collected, real authorization was granted, data was written, production data is live, legal approved the workflow, or the text is investment advice?

If yes, the wording fails this guard and must be replaced with review-only, value-hidden, mock/local, non-executing, non-advisory language.
