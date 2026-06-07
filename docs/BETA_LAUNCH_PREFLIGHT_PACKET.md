# Beta Launch Preflight Packet

Status: `beta_launch_preflight_packet_ready_not_deployed`

Date: 2026-06-07

Owner: PM mainline

Support lanes: A1 Data / Supabase / Market Evidence, A2 Frontend / UX Readability / Public Copy QA, I Launch / Ops

## CEO Decision

CEO decision: `prepare_public_beta_preflight_without_deploying_production`.

PM should connect the accepted public Beta readiness gate and the formal launch deployment readiness gate into one operational preflight packet. This packet is meant to make the next launch slice executable and auditable. It does not deploy production, does not promote real public data, and does not convert the public score source.

Referenced gates:

- `docs/PUBLIC_BETA_READINESS_GATE.md`
- `docs/FORMAL_LAUNCH_DEPLOYMENT_READINESS_GATE.md`
- `docs/A1_MVP_COVERAGE_CLOSURE_ROUTE_SUPPORT.md`
- `docs/A2_PUBLIC_BETA_TRUST_COPY_READINESS.md`
- `docs/LAUNCH_ENGINEERING_WORKSTREAM_BOARD.md`

## Current Evidence

Current accepted state before any public deployment:

- Public Beta readiness is `public_beta_readiness_gate_ready_local_beta_allowed_real_promotion_blocked`.
- Public Beta outcome is `ready_for_local_public_beta_preflight_not_production_deployed`.
- Formal deployment readiness is `formal_launch_deployment_readiness_gate_ready_not_deployed`.
- Formal deployment outcome is `ready_for_deployment_preflight_review_not_deployed`.
- Local route health is accepted through `check:localhost-full-health`.
- Public route loop is expected to cover `/`, `/briefing`, `/weekly`, `/stocks/[symbol]`, `/methodology`, `/disclaimer`, `/terms`, and `/privacy`.
- TW equity has the first verified production `daily_prices` closed loop with final target rows `180`.
- Full Level 1 MVP coverage remains `182/360`.
- TW equity sub-scope is accepted at `180/180`.
- TWII remains `0/60`.
- ETF remains `2/120`.
- ETF detail remains `0050` `1/60` and `006208` `1/60`.
- Public runtime boundary remains `publicDataSource=mock`.
- Score boundary remains `scoreSource=mock`.

## Preflight Checklist

| Area | Current proof | Beta state | Stop line |
| --- | --- | --- | --- |
| Product route health | `check:localhost-full-health` and `check:public-route-loop` | `accepted_local` | Production route health still needs post-deploy proof |
| Public trust copy | `docs/A2_PUBLIC_BETA_TRUST_COPY_READINESS.md` | `ready_for_beta_with_known_copy_followups` | No real-source wording, no complete-coverage claim, no investment advice |
| Runtime/data boundary | `docs/PUBLIC_BETA_READINESS_GATE.md` | `mock_required` | Do not set `publicDataSource=supabase` |
| Score boundary | `docs/PUBLIC_BETA_READINESS_GATE.md` | `mock_required` | Do not set `scoreSource=real` |
| Data closure evidence | `docs/TW_EQUITY_ROW_COVERAGE_SCORING_GATE.md` | `tw_equity_closed_loop_partial_coverage` | Full coverage still blocked at `182/360` |
| Deployment env | `docs/FORMAL_LAUNCH_DEPLOYMENT_READINESS_GATE.md` | `checklist_ready_external_values_required` | No secret output and no platform env mutation in this packet |
| Monitoring and health | Formal launch deployment readiness gate | `local_ok_prod_pending` | Production monitoring requires deployed target |
| Rollback | Formal launch deployment readiness gate and local recovery checks | `local_recovery_ready_prod_rollback_plan_pending` | No production rollback claim before deployment |
| DNS/SSL | Formal launch deployment readiness gate | `human_or_platform_required` | No DNS or SSL action in this packet |
| Secrets | `.env.example` posture and deployment gate | `human_input_required_no_secret_output` | Never print or commit secret values |
| Legal/source rights | A1 and A2 readiness packets | `disclosure_ready_source_rights_blocked` | TWII/ETF rights remain external blockers |
| Incident triage | Workstream board owner map | `owner_named_runbook_needed` | No public incident SLA claim yet |
| Deployment action | This packet | `not_executed` | No production deployment from this slice |

## PM Selected Route

PM selected route: `beta_release_runbook_draft_before_any_deploy`.

The next mainline slice should draft a Beta release runbook that turns this checklist into ordered steps for:

1. Local preflight proof collection.
2. Production deployment target decision.
3. Secret and env input handling.
4. Post-deploy route health verification.
5. Monitoring and rollback confirmation.
6. Public copy and legal disclosure spot check.
7. Explicit decision to keep `publicDataSource=mock` and `scoreSource=mock` unless later promotion gates pass.

## A1 Assignment

A1 next assignment: `source_rights_evidence_intake_for_tWII_and_etf`.

A1 should prepare a local-only source-rights evidence intake checklist for TWII and ETF. It should name the exact external evidence needed to unblock TWII `0/60` and ETF `2/120`, including source rights, redistribution terms, field contract, candidate artifact, bounded execution, post-run review, readback, and scoring gates.

A1 must stop before remote fetch, candidate generation from source data, SQL, Supabase connection, Supabase write, staging rows, `daily_prices` mutation, row coverage points, public source promotion, or real score promotion.

## A2 Assignment

A2 next assignment: `beta_phrase_set_and_shared_trust_surface_patch_scope`.

A2 should prepare the final Beta phrase set for mock-only state, data freshness metadata, partial coverage, missing/delayed data, model limitation, risk, and non-investment-advice. If PM chooses implementation next, A2 may scope a bounded shared trust-surface copy patch, with visual polish kept after launch-blocking copy clarity.

A2 must preserve `publicDataSource=mock`, `scoreSource=mock`, non-investment-advice wording, data freshness limitations, missing/delayed data wording, partial coverage wording, and score/model limitations.

## Hard Stops

This packet does not authorize:

- production deployment;
- Vercel production deployment;
- DNS change;
- SSL configuration change;
- production env mutation;
- secret output;
- SQL execution;
- Supabase write;
- staging row creation;
- `daily_prices` mutation;
- raw market-data fetch;
- raw market-data ingest;
- raw market-data storage;
- raw market-data commit;
- raw payload output;
- row payload output;
- stock id payload output;
- row coverage points;
- complete MVP coverage claim;
- public source promotion;
- `publicDataSource=supabase`;
- real score promotion;
- `scoreSource=real`;
- investment advice claim.

Any later remote/read/write/deploy step must have its own named gate, exact command, precheck, post-run review, sanitized aggregate evidence, and stop line.

## Verification

Focused verification:

- `node scripts/check-beta-launch-preflight-packet.mjs`
- `cmd.exe /c npm run check:beta-launch-preflight-packet`
- `node scripts/check-launch-engineering-workstream-board.mjs`
- `node scripts/check-review-gates.mjs`

Milestone verification should also run route health, public route loop, JSON validation, TypeScript, and `git diff --check`.
