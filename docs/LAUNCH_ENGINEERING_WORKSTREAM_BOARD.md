# Launch Engineering Workstream Board

Status: `launch_engineering_workstream_board_ready`

Date: 2026-06-07

Owner: PM mainline

Support lanes: A1 Data / Supabase / Market Evidence, A2 Frontend / UX Readability / Public Copy QA

## CEO Decision

CEO keeps the active GOAL pointed at public Beta readiness plus the first usable data-realification closed loop, not a single sequential data task.

PM should run the mainline while A1 and A2 remove future blockers in parallel. PM remains the only integration owner. A1 and A2 may prepare local-only handoff packets and checkers, but PM decides whether the output is accepted, rejected, repaired, or integrated.

## Current Launch Engineering State

This board uses the current project state as the baseline:

- MVP row coverage target: `360/360`.
- Latest accepted aggregate row coverage evidence: `182/360`.
- Completed TW equity sub-scope: `2330`, `2382`, and `2308` at `180/180`.
- Remaining TWII index sub-scope: `0/60`.
- Remaining ETF sub-scope: `0050` and `006208` at `2/120`, with `118` missing.
- Public runtime boundary remains `publicDataSource=mock`.
- Score boundary remains `scoreSource=mock`.
- Public source promotion and real-score promotion remain blocked until separate promotion gates pass.

This board does not claim launch completion, data-source promotion, row coverage points, or real score readiness.

## PM Mainline Route

PM owns the launch path and should keep moving without waiting for A1/A2 when a safe mainline task is available.

Current PM route:

1. Keep Level 1 MVP coverage moving toward `360/360`.
2. Maintain the runtime promotion gate so mock-to-real decisions remain explicit.
3. Keep ingestion/backfill, write/readback, rollback, and retention rules visible before any production data movement.
4. Prepare launch readiness across environment variables, deployment health, monitoring, rollback, DNS/SSL, and secret handling.
5. Integrate A1/A2 handoffs only after the relevant local checker passes.
6. Preserve `publicDataSource=mock` and `scoreSource=mock` until a separate promotion gate accepts the change.

Latest PM mainline completion review:

- `docs/FORMAL_LAUNCH_DEPLOYMENT_READINESS_GATE.md` is `accepted` as PM mainline deployment preflight.
- `docs/PUBLIC_BETA_READINESS_GATE.md` is `accepted` as PM mainline Beta preflight.
- `docs/BETA_LAUNCH_PREFLIGHT_PACKET.md` is `accepted` as PM mainline Beta launch preflight.
- `docs/BETA_RELEASE_RUNBOOK_DRAFT.md` is `accepted` as PM mainline draft runbook before any deploy.
- `docs/FUTURE_DEPLOYMENT_EXECUTION_GATE.md` is `accepted` as PM mainline deployment execution gate preparation.
- `docs/TWII_SOURCE_RIGHTS_OUTCOME_GATE.md` is `blocked` as a PM mainline data gate because TWII source rights and field contract remain unresolved.
- The formal launch deployment readiness gate is `formal_launch_deployment_readiness_gate_ready_not_deployed`.
- The public Beta readiness gate is `public_beta_readiness_gate_ready_local_beta_allowed_real_promotion_blocked`.
- The Beta launch preflight packet is `beta_launch_preflight_packet_ready_not_deployed`.
- The Beta release runbook draft is `beta_release_runbook_draft_ready_before_any_deploy`.
- The future deployment execution gate is `future_deployment_execution_gate_ready_not_executed`.
- Current public Beta outcome is `ready_for_local_public_beta_preflight_not_production_deployed`.
- The TWII source-rights outcome gate is `twii_source_rights_outcome_gate_blocked_external_rights_pending`.
- Current TWII outcome is `rejected_for_execution_pending_external_rights_and_field_contract`.
- TWII remains `not_approved_for_probe_or_ingestion`.
- PM selected this route because ETF source rights are blocked and launch deployment preconditions can progress without source promotion.
- PM selected the Beta route because TW equity has a verified first `daily_prices` closed loop, public surfaces can continue as mock-visible Beta, and real promotion can remain blocked until coverage and source-rights gates pass.
- PM selected the next route `beta_release_runbook_draft_before_any_deploy` so deployment ordering, secret input, post-deploy health, rollback, legal/source-rights, and mock/real boundaries are explicit before any production action.
- PM accepts CEO decision `draft_beta_release_runbook_before_any_deploy`; the next deployment-facing action must be a separate future deployment execution gate after deployment target decision, not an automatic deploy.
- PM accepts CEO decision `prepare_future_deployment_execution_gate_not_deploying_now`; first public Beta target posture is `vercel_or_equivalent_managed_nextjs_host`, while deployment, DNS/SSL, platform env mutation, secret upload, public source promotion, and real score promotion remain separate future actions.
- The gate covers environment variables, platform posture, local and future production health checks, monitoring, rollback, DNS/SSL, secret handling, and launch checklist.
- It does not deploy production, run SQL, connect to Supabase, write Supabase, create staging rows, modify `daily_prices`, fetch market data, award row coverage points, promote `publicDataSource=supabase`, or set `scoreSource=real`.

## A1 Active Assignment

A1 owns the data coverage and evidence support lane.

Latest PM completion review:

- `docs/A1_NEXT_DATA_COVERAGE_HANDOFF.md` is `accepted` for PM mainline review.
- `docs/ETF_SOURCE_RIGHTS_AND_CANDIDATE_READINESS_PACKET.md` is `accepted` for PM mainline review.
- `docs/A1_ETF_SOURCE_RIGHTS_OUTCOME_DECISION_SUPPORT.md` is `accepted` for PM mainline review.
- `docs/A1_TWII_SOURCE_RIGHTS_AND_CANDIDATE_READINESS_PACKET.md` is `accepted` for PM mainline review.
- `docs/A1_TWII_INDEX_FIELD_CONTRACT_DECISION_SUPPORT.md` is `accepted` for PM mainline review.
- `docs/A1_MVP_COVERAGE_CLOSURE_ROUTE_SUPPORT.md` is `accepted` for PM mainline review.
- The handoff stayed bounded and local-only.
- The checker `cmd.exe /c npm run check:a1-next-data-coverage-handoff` passed.
- The checker `cmd.exe /c npm run check:etf-source-rights-and-candidate-readiness-packet` passed.
- The checker `cmd.exe /c npm run check:a1-etf-source-rights-outcome-decision-support` passed.
- The checker `cmd.exe /c npm run check:a1-twii-source-rights-and-candidate-readiness-packet` passed.
- The checker `cmd.exe /c npm run check:a1-twii-index-field-contract-decision-support` passed.
- The checker `cmd.exe /c npm run check:a1-mvp-coverage-closure-route-support` passed.
- PM accepts ETF as the current data-coverage route because `docs/ETF_DAILY_PRICES_COVERAGE_COMPLETION_ROUTE.md` selects ETF as the next completion route while source rights remain blocked.
- `docs/ETF_SOURCE_RIGHTS_OUTCOME_DECISION_GATE.md` is `blocked` as a PM mainline execution gate because no ETF source lane is accepted for storage, redistribution, derived analysis, candidate generation, or write execution.
- PM acceptance means the handoff and ETF readiness packet can guide a later source-rights or execution decision; it does not authorize ETF candidate generation, remote fetch, Supabase connection, Supabase write, `daily_prices` mutation, row coverage points, public source promotion, or real score promotion.

Active assignment:

- ETF source-rights outcome decision is open and currently blocked at `rejected_for_execution_pending_external_rights`.
- TWII source-rights and candidate readiness is accepted as the next alternative data branch while ETF remains blocked.
- PM accepts A1's TWII field-contract decision support as local-only planning evidence.
- PM accepts A1's MVP coverage closure route support as the current coverage-route map from `182/360` to `360/360`.
- PM assigns A1 next to `source_rights_evidence_intake_for_tWII_and_etf` as a local-only unblocker for TWII `0/60` and ETF `2/120`.
- PM should reassign A1 next to a TWII sanitized candidate artifact readiness gate only after source rights and field contract are accepted.
- If TWII and ETF source rights remain unresolved, PM should reassign A1 to source-rights evidence intake, vendor/internal-feed decision support, or a blocked-route alternative map.
- Any next data action must stop before remote fetch, candidate generation from source data, SQL, Supabase connection, Supabase write, staging row creation, `daily_prices` mutation, row coverage points, public source promotion, or real score promotion.

Completed first assignment:

- Produce `docs/A1_NEXT_DATA_COVERAGE_HANDOFF.md`.
- The handoff should identify the current `360/360` gap, source-specific lanes, allowed local-only next actions, and remote/write gates that require PM/CEO approval.
- The handoff must not execute SQL, connect to Supabase, write Supabase, create staging rows, modify `daily_prices`, fetch raw market data, output row payloads, output stock id payloads, output secrets, promote public data source, or set real score source.

Completed second assignment:

- Produce `docs/ETF_SOURCE_RIGHTS_AND_CANDIDATE_READINESS_PACKET.md`.
- Define source-rights outcome intake, ETF `daily_prices` field contract, sanitized candidate artifact shape, and execution-readiness criteria for `0050` and `006208`.
- Stop before any remote fetch, candidate generation from source data, SQL, Supabase connection, Supabase write, staging row creation, `daily_prices` mutation, row coverage points, public source promotion, or real score promotion.

Completed third assignment:

- Produce `docs/A1_ETF_SOURCE_RIGHTS_OUTCOME_DECISION_SUPPORT.md`.
- Confirm no ETF source lane is accepted by current local evidence.
- Recommend keeping `legal_and_redistribution_terms_unapproved` until external source-rights evidence is accepted.
- Identify the next safe data-lane options as a blocked-route alternative map or TWII readiness branch.
- Preserve `publicDataSource=mock` and `scoreSource=mock`.

Completed fourth assignment:

- Produce `docs/A1_TWII_SOURCE_RIGHTS_AND_CANDIDATE_READINESS_PACKET.md`.
- Record TWII as `0/60` and Level 1 MVP coverage as `182/360`.
- Preserve ETF blocker `legal_and_redistribution_terms_unapproved`.
- Define TWII source-rights intake, index `daily_prices` field contract, sanitized candidate artifact shape, and future execution-readiness criteria.
- Keep TWII `not_approved_for_probe_or_ingestion` until a separate PM/CEO gate accepts source rights and field contract.

Completed fifth assignment:

- Produce `docs/A1_TWII_INDEX_FIELD_CONTRACT_DECISION_SUPPORT.md`.
- Keep the output local-only and not executable.
- Define TWII daily index field-contract questions for `trade_date`, `index_close`, optional OHLC/turnover fields, calendar/session rules, timezone, precision, missing-session vs source-gap classification, and safe asset-id mapping.
- Preserve TWII `0/60`, `publicDataSource=mock`, `scoreSource=mock`, no source-rights approval, no parser approval, no probe approval, no candidate generation, no Supabase write, and no row coverage points.

Completed sixth assignment:

- Produce `docs/A1_MVP_COVERAGE_CLOSURE_ROUTE_SUPPORT.md`.
- Map the shortest local-only coverage closure route from current Level 1 MVP coverage `182/360` to target `360/360`.
- Keep TW equity accepted at `180/180`, TWII blocked at `0/60`, ETF blocked at `2/120`, and full coverage blocked until source-rights, field-contract, candidate artifact, bounded execution, post-run review, readback, and scoring gates pass.
- Preserve `publicDataSource=mock`, `scoreSource=mock`, no SQL, no Supabase connection, no write, no staging rows, no `daily_prices` mutation, no market-data fetch, no row payload, no stock id payload, no row coverage points, and no real promotion.

PM intake criteria for A1:

- Current evidence is sanitized and aggregate-only.
- Missing rows are grouped by lane.
- The next data action is bounded and names the stop line.
- Any remote/read/write action is marked as a future gate, not as executed work.
- The checker passes before PM accepts the handoff.

Next A1 task when PM reopens the data lane:

- If ETF source-rights can be decided locally, prepare an ETF source-rights outcome decision packet.
- If TWII source-rights can be decided locally, prepare a TWII source-rights outcome decision packet.
- If both source-rights lanes remain blocked, prepare a source-rights evidence intake checklist that names the exact external evidence needed for TWII and ETF.
- If TWII source-rights and field contract are accepted later, prepare a TWII sanitized candidate artifact readiness gate.
- If both execution lanes are blocked, update the Taiwan all-listed universe manifest as Level 2 planning evidence only.

## A2 Active Assignment

A2 owns the public trust, UX readability, and launch copy support lane.

Latest PM completion review:

- `docs/A2_PUBLIC_TRUST_LAUNCH_COPY_HANDOFF.md` is `accepted` for PM mainline review.
- `docs/A2_ROUTE_LEVEL_LAUNCH_COPY_PLACEMENT_CRITERIA.md` is `accepted` for PM mainline review.
- `docs/A2_ROUTE_LEVEL_LAUNCH_COPY_AUDIT.md` is `accepted` for PM mainline review.
- A2 copy-only launch-blocking wording pass is `accepted` for PM mainline review.
- `docs/A2 briefing copy-only patch` is `accepted` for PM mainline review.
- `docs/A2_PUBLIC_BETA_TRUST_COPY_READINESS.md` is `accepted` for PM mainline review.
- The handoff stayed bounded and local-only.
- The checker `cmd.exe /c npm run check:a2-public-trust-launch-copy-handoff` passed.
- The checker `cmd.exe /c npm run check:a2-route-level-launch-copy-placement-criteria` passed.
- The checker `cmd.exe /c npm run check:a2-route-level-launch-copy-audit` passed.
- The copy pass checkers passed: `check:runtime-mock-disclosure-readability`, `check:trust-runtime-boundary-notice`, `check:home-runtime-status-panel`, `check:stock-runtime-at-a-glance`, `check:public-runtime-boundary-coverage`, and `check:public-visible-language-quality`.
- The briefing copy patch checker `cmd.exe /c npm run check:a2-briefing-copy-patch` passed.
- The checker `cmd.exe /c npm run check:a2-public-beta-trust-copy-readiness` passed.
- PM acceptance means the handoff can guide launch-copy integration; it does not authorize runtime promotion, real-source wording, or visual polish.

Active assignment:

- Route-level launch copy placement criteria are accepted as a local-only criteria packet.
- Route-level launch copy audit is accepted as a local-only audit packet.
- PM should reassign A2 next to a bounded `/briefing` copy-only patch or a launch-visible language regression checker when mainline needs public trust support.
- PM accepts the bounded `/briefing` copy-only patch and should reassign A2 next to `/weekly` or footer/legal launch-copy risk after PM finishes this integration.
- PM accepts A2's public Beta trust-copy readiness support and should prioritize shared trust surfaces, footer/legal, home/stocks, briefing, weekly, and empty/error state copy before visual polish.
- PM assigns A2 next to `beta_phrase_set_and_shared_trust_surface_patch_scope` to keep public Beta language ready without delaying data and runtime foundations.
- Any next A2 task must preserve `publicDataSource=mock`, `scoreSource=mock`, non-investment-advice wording, data freshness limitations, missing/delayed data wording, partial coverage wording, and score/model limitations.

Completed first assignment:

- Produce `docs/A2_PUBLIC_TRUST_LAUNCH_COPY_HANDOFF.md`.
- The handoff should identify launch-blocking public copy, mock/real wording rules, coverage and freshness disclosure gaps, non-investment-advice wording, and UI polish that should wait until later.
- The handoff must not edit data evidence, Supabase logic, source promotion toggles, score-source promotion, or raw market artifacts.

Completed second assignment:

- Run a copy-only launch-blocking wording pass on the highest-trust public surfaces.
- Update public boundary copy and trust/runtime notice wording for public trust readability, mock-only state, data freshness, partial coverage, missing/delayed data, non-investment-advice, and score/model limitations.
- Keep exact stop lines `publicDataSource=mock` and `scoreSource=mock`.
- Update public language and boundary checkers so they validate readable launch copy instead of stale wording tokens.

Completed third assignment:

- Produce `docs/A2_ROUTE_LEVEL_LAUNCH_COPY_PLACEMENT_CRITERIA.md`.
- Define required launch trust copy by route or surface: home, stock detail, briefing, weekly, shared runtime boundary, footer/legal, and empty/error states.
- Split launch-blocking copy from non-blocking visual polish.
- Preserve mock-only, non-investment-advice, partial coverage, freshness limitation, missing/delayed data, and score/model limitation wording.

Completed fourth assignment:

- Produce `docs/A2_ROUTE_LEVEL_LAUNCH_COPY_AUDIT.md`.
- Classify public routes and surfaces as `satisfies_now`, `needs_small_copy_patch`, `wait_for_phrase_set`, or `lower_priority_visual_polish`.
- Identify `/briefing`, `/weekly`, legal route-local copy, footer/legal copy, and empty/error/unavailable copy as the next copy-risk areas.
- Keep home, stock detail, and shared runtime boundary as current `satisfies_now` baselines.

Completed fifth assignment:

- Apply a bounded `/briefing` copy-only patch.
- Make briefing copy more readable about mock-only state, `publicDataSource=mock`, `scoreSource=mock`, partial coverage, missing/delayed data, data freshness, model limitation, and non-investment-advice.
- Keep the patch out of Supabase, data evidence, source promotion toggles, score-source promotion, raw market artifacts, and visual-polish-only scope.

Completed sixth assignment:

- Produce `docs/A2_PUBLIC_BETA_TRUST_COPY_READINESS.md`.
- Classify public Beta trust-copy readiness across home, stocks, briefing, weekly, disclaimer, footer/legal shared chrome, shared runtime boundary surfaces, data freshness strip, empty/error/unavailable states, and visual polish.
- Mark shared trust/copy risks as Beta blockers when visible text hides mock-only, partial coverage, missing/delayed data, data freshness, model limitation, or non-investment-advice.
- Keep visual polish after launch-blocking copy readability and preserve `publicDataSource=mock`, `scoreSource=mock`, no real-source wording, no complete-coverage claim, no investment advice, and no runtime toggle changes.

PM intake criteria for A2:

- Copy gaps are split into launch-blocking and non-blocking polish.
- Mock-only state stays visible until promotion gates pass.
- Real-source and real-score wording is conditional, not prematurely published.
- Non-investment-advice, risk, source freshness, coverage, missing-data, and model-limitation wording are covered.
- The checker passes before PM accepts the handoff.

Next A2 task when PM reopens the copy lane:

- Prepare a bounded shared trust-surface copy patch for `src/lib/public-runtime-boundary-copy.ts`, `src/components/trust-runtime-boundary-notice.tsx`, and footer/legal copy if PM chooses UI implementation next.
- If PM keeps A2 document-only, prepare a Beta phrase set for mock-only, data freshness metadata, partial coverage, missing/delayed data, model limitation, risk, and non-investment-advice.
- If copy placement is already covered, prepare a launch-visible language regression checker.
- Visual polish remains lower priority unless comprehension or legal clarity is blocked.

## PM Integration Loop

When A1 or A2 completes a task, PM must do this loop:

1. Review the changed files and checker output.
2. Classify the handoff as `accepted`, `rejected`, `needs_bounded_repair`, or `blocked`.
3. If accepted, integrate it into the PM mainline only after local checks pass.
4. If rejected or repair is needed, assign the bounded fix back to the same lane.
5. Immediately assign the next highest-value lane task when useful work remains.
6. Record the new task or accepted result in project status when it changes launch direction.

PM should not let A1 or A2 idle after a completed task unless no safe lane-specific work remains.

## Launch Gate Map

Formal launch engineering requires these gates to move from blocked to accepted:

| Gate | Current state | PM action |
| --- | --- | --- |
| MVP row coverage | `182/360`, incomplete | Drive remaining TWII/ETF lanes through source-specific gates |
| Ingestion / backfill | Partially designed, not launch-complete | Require candidate artifact, write/readback, post-run review, rollback, retention |
| Runtime promotion | Mock-only public boundary | Keep promotion gate explicit before source or score switch |
| Investment indicators | Launch-safe direction exists, full real-data implementation waits | Do not implement real decision scoring before data and promotion gates |
| Public trust / legal copy | Prepared but needs route-level launch handoff | Accept A2 copy handoff and wire only launch-blocking wording first |
| Deployment readiness | `formal_launch_deployment_readiness_gate_ready_not_deployed` | Prepare env, health, monitoring, rollback, DNS/SSL, and secret checklist before production |

## Safety Boundaries

This board does not authorize:

- SQL execution;
- Supabase write;
- staging row creation;
- `daily_prices` mutation;
- raw market-data fetch, ingest, storage, or commit;
- raw payload, row payload, stock id payload, or secret output;
- `publicDataSource=supabase`;
- `scoreSource=real`;
- production launch claims.

Any later remote/read/write step must have its own named gate, exact command, post-run review, sanitized aggregate evidence, and stop line.

## Verification

Small updates to this board should run:

- `node scripts/check-launch-engineering-workstream-board.mjs`
- `git diff --check`

Milestone integration should also run the related lane checker and review gate.
