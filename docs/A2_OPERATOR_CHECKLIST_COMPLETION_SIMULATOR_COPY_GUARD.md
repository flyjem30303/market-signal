# A2 Operator Checklist Completion Simulator Copy Guard

Status: `a2_operator_checklist_completion_simulator_copy_guard_ready`
Updated: 2026-06-11
Owner lane: A2 Frontend / UX Readability / Public Trust Copy
Integration owner: PM mainline
PM mainline target: `TWII operator checklist completion simulator gate`
Mode: `local_only_completion_simulator_copy_guard`

## Purpose

This document defines the UI, report, public beta, and internal operator wording guardrails for the TWII operator checklist completion simulator gate.

The simulator may show that a future operator checklist can be completed in a safe review flow. It must not imply that a real operator authorization, real decision value, Supabase write, `daily_prices` mutation, legal approval, public data promotion, or real scoring has occurred.

Core interpretation:

- `completion simulator` means a local-only wording and workflow simulation, not a completed real operational gate.
- `checklist completed` may describe simulator checklist fields only, not execution approval, row acceptance, source-rights approval, or production readiness.
- `operator-reviewed` may describe copy-review visibility only, not a real authorization phrase, real confirmation phrase, or signed execution decision.
- `execution still blocked` means no SQL, Supabase connection, Supabase read/write, market-data fetch, staging row creation, `daily_prices` mutation, `publicDataSource=supabase`, or `scoreSource=real` is approved.
- `not investment advice` must remain visible anywhere checklist status, TWII wording, scores, pressure labels, or beta summaries could be interpreted as market guidance.

## Non-Executable Boundary

This copy guard is a wording guard only.

Do not:

- run SQL;
- connect to Supabase;
- read Supabase;
- write Supabase;
- import or initialize a Supabase client;
- read, infer, fill, summarize, or validate secrets, env values, authorization values, confirmation phrases, real decision values, raw payloads, row payloads, stock-id payloads, source bodies, provider bodies, or market-data rows;
- fetch, ingest, store, print, summarize, refresh, or verify market data;
- create staging rows;
- modify, repair, upsert, insert, update, delete, merge, or validate `daily_prices`;
- accept candidate rows;
- set, request, or imply `publicDataSource=supabase`;
- set, request, or imply `scoreSource=real`;
- claim legal approval, source-rights approval, public redistribution approval, live data readiness, production write readiness, real scoring readiness, coverage completion, or investment-advice approval.

## Safe Wording

Use wording that keeps the gate clearly simulated, local-only, non-executing, mock-source, and non-advisory:

- `operator checklist completion simulator`
- `local-only completion simulation`
- `simulated checklist completion`
- `checklist workflow rehearsal`
- `copy and workflow shape reviewed`
- `simulator fields completed`
- `completion status is simulated only`
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

> The TWII operator checklist completion simulator is ready for local-only copy and workflow review. Completion is simulated only; no real authorization, real decision value, Supabase activity, `daily_prices` mutation, real scoring, legal approval, or investment advice is included.

Preferred compact badge set:

- `Simulated completion`
- `Local-only`
- `Execution blocked`
- `Mock source`
- `Mock score`
- `Not investment advice`

## Forbidden Wording

Do not use wording that makes simulated completion look like real authorization, real writing, legal clearance, public launch, source promotion, real scoring, or investment guidance.

Forbidden phrases or equivalent meanings:

- `operator authorized`
- `authorization completed`
- `real authorization confirmed`
- `operator signed off`
- `execution approved`
- `runner approved`
- `run authorized`
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
- `production data enabled`
- `coverage complete`
- `publicDataSource=supabase`
- `scoreSource=real`
- `real scoring enabled`
- `investment signal approved`
- `buy`, `sell`, `hold`, `rebalance`, `market timing`, or equivalent advisory language

Avoid status headlines such as:

- `Operator Checklist Complete`
- `Authorization Complete`
- `Execution Ready`
- `TWII Real Data Ready`
- `Supabase Write Ready`
- `Real Score Active`
- `Legal Clearance Complete`
- `Investment Signal Ready`

Use simulator-scoped alternatives instead:

- `Simulator checklist complete`
- `Simulated completion reviewed`
- `Checklist workflow rehearsal ready`
- `Completion copy ready for PM review`
- `Execution remains blocked`

## Public Copy Rule

Public copy must be conservative, non-advisory, and explicit that this is an internal simulator, not a live TWII data or scoring feature.

Safe public beta wording:

> Internal checklist completion simulation was added to strengthen future operator review. Public beta remains mock-only; no real authorization, real decision value, Supabase write, market-data mutation, real scoring, legal approval, or investment advice is included.

Public copy must:

- say `simulated`, `internal`, `local-only`, or `review-only` near any completion claim;
- preserve `execution still blocked`;
- preserve `publicDataSource remains mock`;
- preserve `scoreSource remains mock`;
- include `not investment advice` wherever TWII status, score, signal, pressure, ranking, or checklist wording could be interpreted as guidance;
- avoid implying complete TWII coverage, live market-data reliance, source-rights completion, public redistribution approval, legal clearance, or production readiness.

Public copy must not:

- invite users to rely on the simulator as a buy, sell, hold, allocation, rebalance, timing, expected-return, profit, or loss-avoidance signal;
- say or imply that a real operator authorized a run;
- say or imply that a real decision value was accepted or recorded;
- say or imply that rows were written, repaired, accepted, or promoted;
- say or imply that Supabase-backed public data or real scoring is active;
- expose raw payloads, row-level records, stock-id payloads, secrets, env values, authorization values, confirmation phrases, real decision values, candidate rows, or market-data rows.

If a public sentence can be read as live-data, legal, or investment readiness, fail closed and route the wording back to PM review.

## Internal Operator Copy Rule

Internal operator copy may be direct, but it must still distinguish simulated checklist completion from real authorization or execution.

Safe internal wording:

- `Review the simulated checklist completion for workflow shape only.`
- `Confirm that all completion indicators remain simulator-only and non-executing.`
- `Confirm that no real authorization phrase, confirmation phrase, or decision value is collected.`
- `Confirm that the simulator does not connect to Supabase or write any row.`
- `Confirm that execution, public data promotion, and real scoring remain blocked.`
- `Escalate to PM if any copy implies legal approval, source-rights approval, real write readiness, or investment advice.`

Allowed internal labels:

- `operator_checklist_completion_simulator`
- `simulated_completion_only`
- `local_only_checklist_rehearsal`
- `workflow_shape_reviewed`
- `execution_blocked_verified`
- `mock_source_preserved`
- `mock_score_preserved`
- `pm_review_required_before_real_authorization`

Forbidden internal labels:

- `operator_authorized`
- `real_authorization_complete`
- `real_decision_complete`
- `execution_ready`
- `runner_ready`
- `production_write_ready`
- `supabase_write_ready`
- `daily_prices_ready`
- `publicDataSource_supabase_enabled`
- `scoreSource_real_enabled`
- `legal_approved`
- `investment_advice_ready`

Internal notes must not include secrets, env values, authorization phrases, confirmation phrases, raw payloads, row payloads, stock-id payloads, source payloads, provider terms text, real decision values, candidate rows, market-data rows, SQL bodies, Supabase response bodies, or write results.

## UI And Report Semantics

Recommended UI labels:

- Page title: `Operator Checklist Completion Simulator`
- Primary status: `Simulated checklist completion`
- Scope status: `Local-only review`
- Execution status: `Execution still blocked`
- Source status: `publicDataSource remains mock`
- Score status: `scoreSource remains mock`
- Advisory status: `Not investment advice`
- Review action: `Review simulator`
- PM action: `Send wording to PM review`

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

Buttons should use review verbs, not execution verbs:

- Safe: `Review simulator`, `Mark simulation reviewed`, `Request PM wording review`
- Forbidden: `Authorize`, `Execute`, `Write`, `Commit`, `Promote real`, `Enable Supabase`, `Enable real score`

Safe report wording:

> The operator checklist completion simulator is ready as a local-only copy and workflow-shape review. Simulator fields can be marked complete for rehearsal purposes only. No SQL, Supabase connection, Supabase write, market-data fetch, `daily_prices` mutation, real authorization, real decision value, public data promotion, real scoring, legal approval, or investment advice occurred.

Forbidden report wording:

> The operator completed the authorization checklist and execution may proceed.

> TWII real scoring is ready because the checklist is complete.

> The operator checklist confirms legal approval and public live-data readiness.

## PM Integration Notes

PM can integrate this guard with the `TWII operator checklist completion simulator gate` as copy validation criteria:

- Require the status string `a2_operator_checklist_completion_simulator_copy_guard_ready` before using simulator completion wording in UI, reports, public beta copy, operator notes, support copy, release notes, or status boards.
- Treat `completion` as simulator-field completion only. It must not mean real authorization, real execution, real write readiness, source-rights approval, legal approval, public launch, row coverage completion, or real scoring.
- Gate output should explicitly include `simulated checklist completion`, `local-only`, `execution still blocked`, `publicDataSource remains mock`, `scoreSource remains mock`, and `not investment advice`.
- Gate output should reject or flag copy that says authorized, execution approved, written, recorded, Supabase entered, `daily_prices` updated, legal approved, live data active, `publicDataSource=supabase`, `scoreSource=real`, real scoring enabled, or investment signal ready.
- Report fields should prefer names around `completionSimulator`, `simulatedCompletionOnly`, `localOnly`, `executionBlocked`, `mockSourcePreserved`, `mockScorePreserved`, and `notInvestmentAdvice`.
- Public copy must remain beta-safe and must not convert simulator completion into a product claim about live TWII data, full coverage, source-rights clearance, legal approval, or investment usefulness.
- Internal operator copy should instruct reviewers to check copy and workflow shape only, not real values, authorization phrases, confirmation phrases, raw payloads, row payloads, source bodies, market-data rows, or Supabase responses.
- Any future transition from completion simulation to real operator authorization, real execution, Supabase activity, `daily_prices` mutation, public source promotion, or real scoring must require a separate explicitly approved PM/operator gate outside this document.
- If any UI or report copy is ambiguous about whether completion is simulated or real, fail closed and route the wording back to PM.

## Hard Boundary Reminder

This file does not execute SQL, connect to Supabase, read or fill real decision values, fetch market data, inspect raw payloads, create staging rows, mutate `daily_prices`, set `publicDataSource=supabase`, set `scoreSource=real`, approve legal commitments, or create investment advice.

