# A2 Operator Values Shape Recheck Copy Guard

Status: `a2_operator_values_shape_recheck_copy_guard_ready`
Updated: 2026-06-11
Owner lane: A2 Frontend / UX Readability / Public Trust Copy
Integration owner: PM mainline
PM mainline target: `TWII operator values shape recheck gate`
Mode: `local_only_copy_guard / shape_recheck_only / no_execution`

## Purpose

This document defines UI, report, and internal operator wording guardrails for the TWII operator values shape recheck gate.

The gate may describe whether copy, labels, status fields, report rows, and handoff text still preserve the expected shape of a future value-hidden operator review surface. It must not imply that real operator values, authorization values, confirmation phrases, market data, Supabase state, `daily_prices` rows, candidate rows, legal approval, public launch approval, or investment guidance have been provided or verified.

Core interpretation:

- `shape recheck` means a copy and field-shape review only.
- `operator values` means schema-level value slots or value classes only, not value bodies.
- `recheck ready` means A2 copy-guard readiness only, not PM acceptance, operator authorization, execution approval, write readiness, source promotion, legal approval, launch readiness, or investment advice.
- `gate` means a review boundary for wording and status shape. It is not a runtime runner, SQL operation, Supabase operation, market-data process, write path, approval packet, or public product launch.

## Non-Executable Boundary

This A2 task is copy-only, shape-only, and local-only.

Do not:

- run SQL;
- connect to Supabase;
- read Supabase;
- write Supabase;
- import or initialize a Supabase client;
- read, infer, fill, summarize, validate, compare, accept, display, or store any real decision value;
- read env values, secrets, authorization values, confirmation phrases, credentials, raw payloads, row payloads, stock-id payloads, source bodies, provider bodies, or market-data rows;
- fetch, ingest, store, print, summarize, refresh, verify, transform, or derive market data;
- touch, repair, insert, update, delete, merge, upsert, validate, or mutate `daily_prices`;
- read, accept, repair, promote, or create candidate rows or staging rows;
- set, request, or imply `publicDataSource=supabase`;
- set, request, or imply `scoreSource=real`;
- claim source-rights approval, legal approval, public redistribution approval, live data readiness, production write readiness, real scoring readiness, coverage completion, launch approval, or investment-advice approval.

## Safe Wording

Use wording that keeps the gate clearly shape-only, copy-only, value-hidden, mock-source, mock-score, non-executing, and non-advisory:

- `operator values shape recheck gate`
- `shape recheck copy ready`
- `value-slot shape reviewed`
- `schema-level wording reviewed`
- `value-hidden shape recheck`
- `copy guard ready`
- `PM review required`
- `real values not requested`
- `real values not read`
- `real values not filled`
- `real values not accepted`
- `authorization values not read`
- `confirmation phrases not read`
- `shape only; no value body`
- `execution remains blocked`
- `no SQL executed`
- `no Supabase connection`
- `no Supabase write`
- `no daily_prices mutation`
- `candidate rows not accepted`
- `publicDataSource remains mock`
- `scoreSource remains mock`
- `not investment advice`

Preferred UI/report sentence:

> The TWII operator values shape recheck gate is ready for local-only copy review. It checks value-slot wording and report shape only; no real decision values, authorization values, confirmation phrases, Supabase activity, `daily_prices` mutation, candidate-row acceptance, public data promotion, real scoring, legal approval, production launch, or investment advice is included.

Preferred compact badge set:

- `Shape recheck`
- `Copy guard`
- `Value-hidden`
- `Local-only`
- `Execution blocked`
- `Mock source`
- `Mock score`
- `Not investment advice`

Safe action labels:

- `Review shape copy`
- `Send shape recheck to PM`
- `Mark copy guard ready`
- `Flag value-claim wording`
- `Request wording repair`

Safe status labels:

- `a2_operator_values_shape_recheck_copy_guard_ready`
- `copy_guard_ready`
- `shape_recheck_only`
- `pm_review_required`
- `repair_required`
- `blocked_value_claim`
- `blocked_authorization_claim`
- `blocked_write_claim`
- `blocked_promotion_claim`
- `blocked_legal_claim`
- `blocked_advice_claim`

## Forbidden Wording

Do not use wording that makes a shape recheck or copy guard look like real value intake, real authorization, real writing, public launch, legal approval, or investment guidance.

Forbidden phrases or equivalent meanings:

- `operator values received`
- `operator values collected`
- `operator values accepted`
- `operator values validated`
- `real values entered`
- `real values confirmed`
- `real decision values recorded`
- `decision values approved`
- `value recheck passed`
- `real values rechecked`
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
- `Real Values Rechecked`
- `Real Values Accepted`
- `Authorization Complete`
- `Execution Ready`
- `Supabase Write Ready`
- `TWII Live Data Ready`
- `Production Launch Ready`
- `Legal Clearance Complete`
- `Real Score Active`
- `Investment Signal Ready`

Use shape-scoped alternatives instead:

- `Shape recheck copy ready`
- `Value-hidden shape reviewed`
- `Operator value-slot wording needs PM review`
- `Execution remains blocked`
- `Real values remain out of scope`

## Public Copy Rule

Public copy must describe only user-facing transparency or beta trust wording. It must not expose internal operator mechanics or imply that real operator values, authorization values, market data, candidate rows, legal approval, or launch approval have been provided.

Safe public copy:

> We added clearer review wording for a future operator value-slot shape check. The beta remains mock-only and informational; no real decision values, authorization values, Supabase writes, market-data mutation, candidate-row acceptance, public data promotion, real scoring, legal approval, production launch, or investment advice is included.

Public copy must:

- state or preserve that the product remains beta, informational, mock-only, local-only, or under review when shown near TWII status, pressure, score, report, or readiness language;
- describe shape and wording improvements only, not real value intake or real-value verification;
- keep `publicDataSource` effectively described as mock/local/pending review, never Supabase-backed or live;
- keep `scoreSource` effectively described as mock/pending review, never real scoring;
- avoid wording that says or implies operator values were received, accepted, verified, rechecked as true, or used;
- avoid legal-clearance, source-rights-clearance, public-redistribution, production-launch, coverage-complete, or investor-ready claims;
- preserve visible non-advice language anywhere TWII status, scoring, pressure, route, or readiness language could be interpreted as guidance.

Public copy must not:

- name, request, hint at, or summarize any authorization value, confirmation phrase, secret, env value, credential, row value, market value, candidate row, or payload;
- invite users to trade, rebalance, time the market, rely on a score, or treat the gate as a recommendation;
- turn internal shape readiness into a public claim that real TWII data or real scoring is active.

## Internal Operator Copy Rule

Internal operator copy may be more explicit about blocked prerequisites, but it must remain value-hidden and non-executing.

Safe internal operator copy:

> Operator values shape recheck copy is ready for PM review only. The recheck confirms wording and status-shape guardrails, not value truth. Real decision values, authorization values, confirmation phrases, SQL, Supabase connection/read/write, `daily_prices` mutation, candidate-row acceptance, public data promotion, real scoring, legal approval, production launch, and investment advice remain blocked.

Internal operator copy must:

- label the gate as `shape`, `copy`, `recheck`, `guard`, `review`, or `PM review` only;
- make clear that no value body is requested, read, filled, accepted, derived, printed, verified, or stored;
- use sanitized blocker categories such as `missing_pm_review`, `value_hidden_required`, `authorization_separate`, `execution_blocked`, `write_blocked`, `promotion_blocked`, `legal_blocked`, or `advice_blocked`;
- preserve `publicDataSource=mock` and `scoreSource=mock` in summaries, badges, tables, reports, and handoffs;
- fail closed when wording is ambiguous between shape readiness and real value acceptance;
- route any stronger claim to PM/legal/operator review without changing runtime state.

Internal operator copy must not:

- ask for real values, authorization values, confirmation phrase contents, env values, secrets, credentials, row payloads, candidate rows, or market data;
- say an operator has approved, signed, accepted, confirmed, rechecked, verified, or executed anything unless a separate approved gate explicitly owns that claim;
- turn a copy-recheck status into a command, runbook step, SQL instruction, Supabase operation, data-source switch, legal signoff, or launch approval;
- display or imply row counts, row bodies, market values, write results, source payloads, candidate rows, or Supabase evidence.

## PM Integration Notes

PM may use this document as the wording guard for the `TWII operator values shape recheck gate`.

Integration requirements:

- Keep this guard attached to UI labels, report rows, status summaries, release-note snippets, operator handoff copy, and internal checklist copy for the values-shape recheck gate.
- Treat `a2_operator_values_shape_recheck_copy_guard_ready` as copy-guard readiness only, not PM approval, legal approval, operator authorization, real-value acceptance, execution readiness, write readiness, candidate-row acceptance, source promotion, real scoring, or launch readiness.
- If PM needs a pass/fail field, use `copyGuardStatus` with `accepted_for_copy_review`, `repair_required`, or `rejected_for_overclaim`; do not use `accepted` without the `for_copy_review` qualifier.
- If any surface says or implies real values were collected, values were verified, authorization was completed, Supabase was connected or written, `daily_prices` changed, candidate rows were accepted, `publicDataSource=supabase`, `scoreSource=real`, legal approval, public launch, or investment advice, PM must mark it `rejected_for_overclaim` or `repair_required`.
- PM integration may repair wording, labels, badges, and summaries only. It must not execute SQL, connect to Supabase, read or write data, inspect values, fetch market data, touch `daily_prices`, accept candidate rows, or change source/scoring switches.
- Downstream status boards should show this as `shape recheck copy guard ready / execution blocked / mock source / mock score / not investment advice`.
- Any future real operator intake, real authorization, write execution, Supabase usage, candidate-row acceptance, public data promotion, real scoring, legal approval, or launch decision requires a separate explicitly authorized PM-owned gate.

## Final Surface Rule

Every UI, report, and operator-facing sentence about this gate must pass this test:

> Could a reader reasonably think real values were provided or verified, real authorization was granted, data was written, production data is live, legal approved the workflow, or the text is investment advice?

If yes, the wording fails this guard and must be replaced with shape-only, review-only, value-hidden, mock/local, non-executing, non-advisory language.
