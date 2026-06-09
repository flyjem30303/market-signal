# Public Beta Readiness Gate

Status: `public_beta_readiness_gate_ready_local_beta_allowed_real_promotion_blocked`

Date: 2026-06-07

Owner: PM mainline

Support lanes: A1 Data / Supabase / Market Evidence, A2 Frontend / UX Readability / Public Copy QA, I Launch / Ops

## CEO Decision

CEO upgrades the active GOAL from broad formal launch engineering into a sharper Beta objective:

`public_beta_ready_if_mock_boundary_visible_and_real_promotion_blocked`

This gate allows PM to push toward public Beta readiness while keeping the real-data promotion gates explicit.

This gate does not claim formal production launch completion, does not promote `publicDataSource=supabase`, and does not set `scoreSource=real`.

## PM Selected Route

PM selects public Beta readiness as the mainline route because the product now has a usable mock/public surface and the TW equity data-realification path has reached a verified first closed loop, while full MVP coverage and real score promotion remain incomplete.

This route advances the active GOAL by separating two decisions:

1. Public Beta can move forward if route health, trust copy, and mock/real boundaries are acceptable.
2. Real-data promotion must remain blocked until coverage, source-rights, runtime, and score gates are accepted.

## Current Evidence

Accepted evidence:

- TW equity production `daily_prices` insert-missing merge completed with final target rows `180`.
- TW equity sub-scope is accepted at `180/180`.
- Full Level 1 MVP row coverage remains `182/360`.
- Remaining TWII sub-scope remains `0/60`.
- Remaining ETF sub-scope remains `2/120`, with `0050` `1/60` and `006208` `1/60`.
- TWII source-rights outcome gate is `twii_source_rights_outcome_gate_candidate_ready_for_pm_review`, but TWII execution and real promotion remain blocked.
- ETF source-rights outcome remains blocked by `legal_and_redistribution_terms_unapproved`.
- Public runtime boundary remains `publicDataSource=mock`.
- Score boundary remains `scoreSource=mock`.
- Formal deployment readiness is `formal_launch_deployment_readiness_gate_ready_not_deployed`.
- `/briefing` copy patch is accepted for mock-only, partial coverage, missing/delayed data, freshness, model-limit, and non-investment-advice readability.

Evidence anchors:

- `PROJECT_STATUS.md`.
- `docs/TW_EQUITY_ROW_COVERAGE_SCORING_GATE.md`.
- `docs/reviews/TW_EQUITY_DAILY_PRICES_INSERT_MISSING_MERGE_POST_RUN_REVIEW_2026-06-07.md`.
- `docs/TWII_SOURCE_RIGHTS_OUTCOME_GATE.md`.
- `docs/ETF_SOURCE_RIGHTS_OUTCOME_DECISION_GATE.md`.
- `docs/FORMAL_LAUNCH_DEPLOYMENT_READINESS_GATE.md`.
- `docs/LAUNCH_ENGINEERING_WORKSTREAM_BOARD.md`.
- `scripts/check-localhost-full-health.mjs`.
- `scripts/check-public-route-loop.mjs`.

## Beta Decision

Current Beta decision:

`ready_for_local_public_beta_preflight_not_production_deployed`

Meaning:

- PM may continue preparing public Beta release artifacts.
- PM may run local route health, TypeScript, JSON, public route loop, and public trust checkers.
- PM may update public copy and gate docs needed for Beta readiness.
- PM may prepare deployment/env/monitoring/DNS/rollback checklists.
- PM must not publish a production deployment from this gate.
- PM must not claim real data coverage is complete.
- PM must not promote public source or score source.

## Beta Acceptance Criteria

Public Beta readiness requires these criteria to be accepted:

| Area | Required proof | Current state |
| --- | --- | --- |
| Public route health | Home, stock detail, briefing, weekly, methodology, disclaimer, terms, and privacy routes pass local health checks. | `local_preflight_required` |
| Trust copy | Mock-only, partial coverage, missing/delayed data, freshness, model limitation, and non-investment-advice copy is visible on public surfaces. | `prepared_needs_beta_review` |
| Data boundary | TW equity real `daily_prices` closed loop is recorded, while TWII/ETF gaps remain visible. | `tw_equity_closed_loop_partial_coverage` |
| Runtime boundary | `publicDataSource=mock` remains visible until promotion gate passes. | `mock_required` |
| Score boundary | `scoreSource=mock` remains visible until score-source gate passes. | `mock_required` |
| Deployment preflight | Env, build, health, monitoring, rollback, DNS/SSL, and secret handling checklist exists. | `preflight_ready_not_deployed` |
| Incident readiness | Error log, uptime target, rollback owner, and triage route are named before production exposure. | `needs_beta_launch_packet` |
| External dependencies | Source-rights, secret input, DNS/account/payment/OTP, and external legal authorization stay outside autonomous execution. | `human_or_external_required` |

## Real Promotion Blockers

Real public data and real score remain blocked by these items:

- Full MVP row coverage is still `182/360`, not `360/360`.
- TWII remains `not_approved_for_probe_or_ingestion` for execution even though the source-rights outcome gate candidate is ready for PM/CEO review.
- ETF source rights remain `legal_and_redistribution_terms_unapproved`.
- Runtime promotion gate has not accepted `publicDataSource=supabase`.
- Score-source promotion gate has not accepted `scoreSource=real`.
- Public copy must continue to describe partial coverage and missing/delayed data.
- Production deployment has not been executed by this gate.

## PM / A1 / A2 Next Assignments

PM mainline next task:

- Prepare a Beta launch preflight packet that joins local route health, env posture, trust copy, deployment checklist, monitoring, rollback, DNS/SSL, and secret-handling status.

A1 next task:

- Prepare MVP coverage closure route support for TWII and ETF, with candidate artifact and source-rights prerequisites separated from execution.

A2 next task:

- Prepare public Beta trust-copy readiness support across home, stocks, briefing, weekly, disclaimer, terms, privacy, and shared trust surfaces.

PM must integrate A1/A2 only after their lane checkers pass.

## Hard Stop

This gate:

- does not deploy production;
- does not run SQL;
- does not connect to Supabase;
- does not write Supabase;
- does not create staging rows;
- does not modify `daily_prices`;
- does not fetch raw market data;
- does not ingest raw market data;
- does not store raw market data;
- does not commit raw market data;
- does not output secrets;
- does not output raw payload;
- does not output row payload;
- does not output stock id payload;
- does not give row coverage points;
- does not promote `publicDataSource=supabase`;
- does not set `scoreSource=real`;
- does not claim formal launch completion;
- does not claim full MVP coverage completion.

## Verification

Use:

- `node scripts/check-public-beta-readiness-gate.mjs`
- `cmd.exe /c npm run check:public-beta-readiness-gate`

Focused Beta preflight should also run:

- `cmd.exe /c npm run check:json`
- `cmd.exe /c npm run check:public-route-loop`
- `node scripts/check-localhost-full-health.mjs`
- `git diff --check`

Milestone integration should run:

- `node scripts/check-launch-engineering-workstream-board.mjs`
- `node scripts/check-review-gates.mjs`
