# GOAL Parallel Workstream Adjustment

Status: `goal_launch_engineering_parallel_workstreams_ready`

Date: 2026-06-08

Owner: CEO / PM mainline

Support lanes: A1 Data / Supabase / Market Evidence, A2 Frontend / UX Readability / Public Copy QA, I Launch / Ops

## CEO Decision

CEO keeps the active GOAL pointed at `pre_launch_executable_state`, but trims the execution style to delivery-first work. The project should not reopen broad governance unless it directly unlocks a public Beta blocker.

The project runs as a formal launch-engineering program with parallel lanes:

1. PM owns the mainline, integration, runtime, launch engineering, and acceptance decisions.
2. A1 owns the data / Supabase / market evidence support lane.
3. A2 owns the public trust / UX readability / disclosure support lane.
4. I stays as launch / ops guard for deployment, environment, credentials, DNS, monitoring, rollback, and account risks.
5. PM must assign new A1/A2 tasks whenever their current background tasks finish.
6. The GOAL should move toward formal launch engineering, including data realification, Supabase closed loop, coverage closure, runtime promotion readiness, public Beta readiness, and launch preflight.

This avoids the previous bottleneck where row coverage, runtime readiness, public trust copy, and Beta deployment preparation were treated as one slow sequential lane.

## Current GOAL Definition

Use this as the durable GOAL prompt if the active goal must be recreated:

```text
Push the project to a public Beta pre-launch executable state.

Completion state:
1. BETA_HOSTING_PROJECT_NAME and BETA_TEMPORARY_URL are collected and shape-validated, but real values are not written to the repo or printed in public docs.
2. The packet-window proof map can run locally and produce a no-secret artifact outcome for PM review.
3. A1 TWII four-slot no-secret evidence is PM-classifiable, or the exact remaining external blocker is recorded.
4. Runtime core routes are healthy, publicDataSource=mock and scoreSource=mock boundaries are clear, and public trust pages are readable.
5. A2 has no launch-blocking public-copy, mojibake, first-screen confusion, or legal-disclosure blocker.

Execution rules:
1. CEO chooses only the highest-value blocker-removal slice.
2. PM immediately executes local-only slices that do not trigger permission prompts.
3. A1/A2/I are support lanes; PM is the only integration owner.
4. PM uses one-command runners when they already wrap the required local safety checks.
5. Each slice records only completed work, remaining hard blockers, and minimal checks.
6. Governance, role review, and UI micro-polish are deferred unless they directly remove a blocker.

Forbidden boundaries:
- No deployment, DNS, hosting, env, or secret mutation.
- No SQL, Supabase write, staging rows, or daily_prices mutation.
- No raw market-data fetch, storage, or commit.
- No secrets, raw payloads, row payloads, or stock id payloads printed.
- No publicDataSource=supabase or scoreSource=real.
- No Git add, commit, or push unless the chairman explicitly asks.

Verification:
- Small slices run focused checkers.
- Runtime or public-copy changes run route health, public visible language, and TypeScript.
- A1/A2 integrations run lane checkers.
- Full review gate is reserved for milestone integration, promotion, or deployment packet work.

If blocked:
- If the same external missing value or permission blocker repeats three times and no safe local work remains, PM pauses and reports to CEO.
- If safe blocker-removal work remains, continue instead of stopping only to report.
```
## Delivery-First GOAL Trim

The active execution contract is intentionally narrower than the original launch-engineering expansion. PM should not reopen broad requirement discovery, role-review packets, visual micro-polish, or full review-gate loops unless they directly unblock one of the current public Beta hard blockers.

## CEO Velocity Rewrite

Use this shorter GOAL wording for active execution when progress starts feeling slow:

```text
Move the project toward public Beta executable readiness with the shortest safe path.

Primary completion chain:
1. Platform: collect and shape-validate BETA_HOSTING_PROJECT_NAME and BETA_TEMPORARY_URL without printing or storing real values in repo docs.
2. Packet: run the no-secret packet-window proof chain to PM-reviewed artifact readiness.
3. Data: move A1 TWII no-secret source-rights evidence to PM-classifiable state, or record the exact external blocker.
4. Runtime: keep /, /briefing, and stock routes healthy, readable, and explicitly mock-only.

Execution style:
1. Prefer one coherent blocker-removal slice over many micro-governance slices.
2. Use one-command runners when available.
3. Run only the smallest checker set that proves the slice.
4. Defer UI micro-polish, broad role review, and full review gate unless they unlock the active chain.
5. If a safe local next step exists, execute it instead of stopping at another recommendation.

Stop lines:
No deploy, SQL, Supabase write, raw market-data fetch/store, secret output, publicDataSource=supabase, scoreSource=real, or Git add/commit/push without explicit separate authorization.
```

CEO ruling: this rewrite supersedes the longer GOAL wording for day-to-day execution. The longer wording remains reference material for milestone reviews, but PM should use this velocity rewrite as the operational default.

## Historical Operational GOAL v2 - Superseded

This section is retained only as history. Do not use it as the current day-to-day GOAL wording.

```text
Push the project to public Beta pre-launch executable readiness by removing only the real hard blockers.

Current hard blockers:
1. BETA_HOSTING_PROJECT_NAME is missing.
2. BETA_TEMPORARY_URL is missing.
3. A1 TWII four-slot no-secret source-rights evidence is missing.

Execution rule:
1. Do the largest safe local slice that moves one blocker, route, or public trust boundary forward.
2. Prefer an existing one-runner over manually splitting commands.
3. Do not open a new governance packet, role review, visual polish loop, or broad audit unless it directly unlocks the current chain.
4. If the next step needs external values, make the request surface clearer and keep local route health ready.
5. If the next step is local-only and inside stop lines, execute it before reporting.

Verification rule:
Run only the smallest checks that prove the slice. Add TypeScript or route health only when source/runtime code changed. Reserve full review gate for promotion, packet milestone, deployment readiness, or large integration.

Stop lines:
No deployment, SQL, Supabase write, staging rows, daily_prices mutation, raw market-data fetch/store/commit, secret or raw payload output, publicDataSource=supabase, scoreSource=real, or Git add/commit/push unless separately authorized.
```

Historical ruling: Operational GOAL v2 was the prior fast-track wording. Operational GOAL v3 below supersedes v2 for routine execution.

Current hard blockers:

1. Missing `BETA_HOSTING_PROJECT_NAME`.
2. Missing `BETA_TEMPORARY_URL`.
3. Missing A1 TWII four-slot no-secret source-rights evidence.

Everything else should support one of those blockers, keep core routes healthy, or preserve the mock/real trust boundary.

Retained launch-engineering anchors:

- `Supabase write/readback/post-run review/rollback` remains a future named-gate requirement, not an action authorized by this trimmed GOAL.
- `Coverage Universe Roadmap` remains the coverage planning baseline, while current public Beta work stays focused on blocker removal and mock-visible launch readiness.

## Operational GOAL v3 - Execution First

CEO ruling: use this as the active day-to-day wording. It supersedes v2 for routine execution because the project was losing speed to repeated governance, review wording, and UI polish slices.

```text
Push the project to public Beta pre-launch executable readiness by closing only the active external blocker chain.

Current completion chain:
1. Platform values: collect and shape-validate BETA_HOSTING_PROJECT_NAME and BETA_TEMPORARY_URL without writing or printing real values.
2. Packet proof: run response-readiness and the combined post-reply one-runner; keep reviewed-artifact recording dry-run unless PM explicitly applies an accepted outcome.
3. A1 evidence: collect the four TWII no-secret source-rights evidence slots and move them to PM-classifiable state.
4. Runtime: keep core routes healthy and preserve mock-only public boundaries.

Execution rule:
1. Do the largest safe local slice that directly advances platform values, packet proof, A1 evidence classification, or runtime route health.
2. Prefer a one-runner over split diagnostic commands.
3. Do not create new governance packets, role-review loops, visual polish slices, or broad audits unless they unblock the current chain.
4. If no external value is available, improve the one-screen request, after-reply route, fail-closed guard, or focused checker that will be used immediately after the value arrives.
5. Report only: completed work, remaining hard blockers, and checks run.

Verification rule:
Run focused checks only. Add TypeScript or route health when source/runtime changed. Reserve full review gate for packet milestone, promotion, deployment readiness, or large integration.

Stop lines:
No deployment, SQL, Supabase write, staging rows, daily_prices mutation, raw market-data fetch/store/commit, secret or raw payload output, publicDataSource=supabase, scoreSource=real, or Git add/commit/push unless separately authorized.
```

PM should treat everything outside this v3 chain as milestone-review material, not day-to-day progress work.

## Execution Ratio

CEO sets the default execution ratio as a rolling baseline, not a fixed rule:

| Lane | Default ratio | Current route | PM adjustment rule |
| --- | ---: | --- | --- |
| PM mainline | 70% | Runtime, launch engineering, integration, focused gates, local health | Raise to 85% when A1/A2 are externally blocked |
| A1 | 25% | Coverage, source rights, Supabase/data evidence, sanitized artifacts | Raise when a bounded data/readback step is explicitly ready |
| A2 | 5% | Launch-blocking trust copy and public readability | Raise only when public comprehension or legal trust is blocked |

Visual polish and design micro-tuning remain after runtime, data, and launch-readiness foundations unless the issue blocks comprehension, legal clarity, or route usability.

## Mainline PM Route

PM should move the mainline in this order when safe work is available:

1. Keep core public pages browsable and free of Internal Server Error.
2. Keep runtime state readable: `publicDataSource=mock`, `scoreSource=mock`, coverage state, freshness limits, and promotion blockers.
3. Keep the two-value platform route ready while waiting for operator values.
4. After platform or A1 values arrive, run `report:public-beta-external-input-response-readiness`, then `run:public-beta-post-reply-route-once`; do not manually split validator, packet proof-map, or A1 classification commands unless debugging a failed runner.
5. Turn accepted A1 data evidence into promotion-gate inputs without promoting public source or score.
6. Prepare executable Beta launch packets only after safe non-secret operator values are available and the one-command proof runner reaches PM review.
7. Run focused local checks for small slices and review gate only for milestone integration.
8. Record every route decision in project files when it changes launch direction.

Current PM next route: `external_input_response_readiness_then_platform_two_value_one_runner_or_a1_evidence_classification`.

## A1 Support Lane

A1 owns Data / Supabase / Market Evidence.

Current A1 route:

- TWII four-slot no-secret source-rights evidence.
- ETF source-rights outcome support only after TWII route is no longer the immediate blocker.
- TW equity candidate artifact hygiene when PM asks for data-readiness proof.
- Coverage closure support from `182/360` toward `360/360`.

A1 must stop before SQL execution, Supabase writes, staging row creation, broad `daily_prices` mutation, raw market-data fetch/ingestion/storage, secret output, row payload output, stock id payload output, public source promotion, or `scoreSource=real`.

## A2 Support Lane

A2 owns Frontend / UX Readability / Public Copy QA.

Current A2 route:

- Keep public trust copy understandable for mock-only, partial coverage, missing/delayed data, model limits, freshness limits, and non-investment-advice wording.
- Repair only launch-blocking public copy regressions.
- Defer visual polish unless comprehension or legal clarity is blocked.

A2 must stop before data evidence edits, Supabase logic, source promotion toggles, score-source promotion, raw market evidence, or visual-only redesign.

## Dynamic Reassignment Rule

When A1 or A2 completes a task:

1. PM reviews the output and checker result.
2. PM records `accepted`, `rejected`, `needs_bounded_repair`, or `blocked`.
3. PM integrates accepted output only after the relevant local checker passes.
4. PM immediately assigns the next highest-value side-lane task when useful work remains.
5. PM continues mainline work without waiting when safe.

## Verification Policy

To keep velocity:

- local document/checker slices may run only their own checker plus `git diff --check`;
- JSON or package script edits should run `check:json` only when JSON shape is affected;
- A1/A2 output integration should run that lane checker before PM accepts it;
- Runtime / launch / data milestones should run focused checks first;
- bounded remote attempts or write/readback slices must run their specific precheck, exact one-attempt command, post-run review, and aggregate readback verification;
- full review gate is reserved for milestone integration, not every wording or status note.

## Current Accepted Baseline

- Public runtime boundary remains `publicDataSource=mock`.
- Score boundary remains `scoreSource=mock`.
- Current Level 1 MVP row coverage is `182/360`.
- TW equity first closed loop is accepted at `180/180`.
- TWII remains `0/60` and not approved for probe or ingestion.
- ETF remains `2/120`, with `118` missing rows.
- Public Beta can continue as mock-visible local Beta preparation.
- Real data and real score promotion remain blocked until separate gates pass.

## Hard Stops

This GOAL adjustment does not authorize:

- SQL execution;
- Supabase write;
- staging row creation;
- broad `daily_prices` mutation;
- raw market-data fetch, ingest, storage, or commit;
- secret output;
- raw payload, row payload, or stock id payload output;
- `publicDataSource=supabase`;
- `scoreSource=real`;
- deployment, DNS, SSL, platform env, or hosting project mutation;
- public launch completion claim.

Any later remote/read/write/deploy step must have its own named gate, exact command, post-run review, sanitized aggregate evidence, rollback path, and stop line.

## CEO Recommendation

Continue under this GOAL with larger coherent slices. Do not spend more time on broad governance unless it unlocks a concrete execution step. The next best mainline slice is `runtime_local_route_health_refresh_before_executable_packet_or_data_gate`, while A1 keeps the TWII four-slot no-secret evidence path warm and A2 handles only launch-blocking public trust readability.

## Verification

Focused verification:

- `node scripts/check-goal-parallel-workstream-adjustment.mjs`
- `cmd.exe /c npm run check:goal-parallel-workstream-adjustment`
- `git diff --check`

Milestone integration:

- `cmd.exe /c npm run check:review-gates`
