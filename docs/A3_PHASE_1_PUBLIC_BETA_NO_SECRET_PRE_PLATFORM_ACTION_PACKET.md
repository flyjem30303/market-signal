# A3 Phase 1 Public Beta No-Secret Pre-Platform Action Packet

Updated: 2026-06-13

Status: `a3_phase_1_public_beta_no_secret_pre_platform_action_packet_ready`

Owner: A3 Launch / Production Engineering

CEO decision: `READY_FOR_NO_SECRET_OPERATOR_PRE_PLATFORM_ACTION`

## Purpose

This packet is the one-page operator entrypoint before any future Phase 1 public Beta platform movement.

It compresses the current evidence chain into a no-secret handoff so the operator does not need to search across many docs before opening Vercel or an equivalent hosting platform.

This packet does not deploy, change DNS, mutate production environment variables, run SQL, read or write Supabase, create staging rows, modify `daily_prices`, fetch raw market data, print secrets, promote real data, promote real scores, or implement Phase 2 membership.

## Operator May Proceed Only If

- chairman/operator decision is `GO` or `GO_WITH_DEFERRALS`;
- chairman visual acceptance record is `phase_1_public_beta_chairman_visual_acceptance_recorded`;
- final public readiness scan is `phase_1_public_beta_candidate_final_public_readiness_scan_ready`;
- human/browser visual review is `phase_1_public_beta_human_visual_review_ready`;
- A3 manual platform action checklist is `a3_phase_1_public_beta_manual_platform_action_checklist_ready`;
- A3 post-platform action report template is `a3_phase_1_public_beta_post_platform_action_report_template_ready`;
- TypeScript passes;
- build passes if a real platform action will be triggered;
- public pages remain mock-only and do not claim live official data.

## Evidence Paths

| Evidence | Path |
| --- | --- |
| Chairman visual acceptance record | `docs/PHASE_1_PUBLIC_BETA_CHAIRMAN_VISUAL_ACCEPTANCE_RECORD.md` |
| Visual acceptance / A3 handoff | `docs/PHASE_1_PUBLIC_BETA_VISUAL_ACCEPTANCE_AND_A3_HANDOFF.md` |
| Final public readiness scan | `docs/PHASE_1_PUBLIC_BETA_CANDIDATE_FINAL_PUBLIC_READINESS_SCAN.md` |
| Human/browser visual review | `docs/PHASE_1_PUBLIC_BETA_HUMAN_VISUAL_REVIEW.md` |
| A3 manual platform checklist | `docs/A3_PHASE_1_PUBLIC_BETA_MANUAL_PLATFORM_ACTION_CHECKLIST.md` |
| A3 no-secret env and rollback checklist | `docs/A3_NO_SECRET_PRODUCTION_ENV_AND_ROLLBACK_CHECKLIST.md` |
| A3 post-platform report template | `docs/A3_PHASE_1_PUBLIC_BETA_POST_PLATFORM_ACTION_REPORT_TEMPLATE.md` |

## Required Local Commands Before Operator Action

Run these immediately before any real platform movement:

1. `cmd.exe /c npm run check:phase-1-public-beta-chairman-visual-acceptance-record`
2. `cmd.exe /c npm run check:phase-1-public-beta-visual-acceptance-and-a3-handoff`
3. `cmd.exe /c npm run check:phase-1-public-beta-candidate-final-public-readiness-scan`
4. `cmd.exe /c npm run check:phase-1-public-beta-human-visual-review`
5. `cmd.exe /c npm run check:a3-phase-1-public-beta-manual-platform-action-checklist`
6. `cmd.exe /c npm run check:a3-phase-1-public-beta-post-platform-action-report-template`
7. `cmd.exe /c npm run check:a3-phase-1-public-beta-no-secret-pre-platform-action-packet`
8. `cmd.exe /c npm run check:pm-brief-runtime-mainline-goal-and-workstreams`
9. `cmd.exe /c npx tsc --noEmit`
10. `cmd.exe /c npm run build`

## No-Secret Platform Action Summary

Operator may open Vercel or an equivalent host and verify only:

- project/repository matches the intended public Beta project;
- framework is Next.js;
- root directory is correct;
- build command is compatible with `npm run build`;
- deploy branch is intended;
- required environment names are present where needed, without recording values;
- `NEXT_PUBLIC_SITE_URL` matches the public canonical URL before production launch;
- `NEXT_PUBLIC_DATA_SOURCE` remains mock-compatible;
- rollback path is visible;
- public URL is HTTPS and contains no secret query string.

## Operator Safe Reply Shape

After platform review or action, operator replies with only no-secret values:

| Field | Allowed value |
| --- | --- |
| `actionTaken` | `none`, `preview_deploy`, `production_deploy`, or `rollback` |
| `publicUrl` | HTTPS public URL or `pending`; no dashboard URL, token, or secret query |
| `deploymentLabel` | non-secret deployment label or `pending` |
| `envNamesPresent` | names only; no values |
| `routeSmoke` | pass/fail per public route |
| `claimSmoke` | pass/fail for no secret, no internal residue, no live-data claim, no investment advice |
| `rollbackReady` | `yes`, `no`, or `not_checked` |
| `nextRoute` | `fill_post_platform_report`, `repair_then_recheck`, or `no_action` |

## Required Post-Action Route

After any platform movement, PM/A3 must use:

`docs/A3_PHASE_1_PUBLIC_BETA_POST_PLATFORM_ACTION_REPORT_TEMPLATE.md`

The post-platform report must record route smoke, claim smoke, rollback readiness, final status, accepted deferrals, and remaining blockers without secrets.

## Accepted Deferrals

- real-data promotion;
- full Taiwan all-listed-equity coverage;
- global market expansion;
- custom domain;
- paid monitoring vendor wiring;
- paid analytics vendor wiring;
- Phase 2 member registration/login;
- Phase 2 watchlist persistence;
- Phase 2 custom alert execution;
- Phase 2 member-only daily three-layer interpretation;
- Phase 2 post-market review archive;
- payment/subscription flow.

## Stop Lines

- No SQL.
- No Supabase write.
- No Supabase read without a separate explicit read-only gate.
- No staging rows.
- No `daily_prices` mutation.
- No raw market data fetch, store, or commit.
- No secrets or raw payload output.
- No platform env value output.
- No private dashboard URL output.
- No `publicDataSource=supabase`.
- No `scoreSource=real`.
- No official endorsement claim.
- No complete Taiwan coverage claim.
- No real-time precision claim.
- No guaranteed return claim.
- No investment advice claim.
- No Phase 2 membership implementation as a Phase 1 blocker.

## Next PM/A3 Route

`phase_1_public_beta_operator_action_or_no_action_safe_reply`

CEO recommendation:

- If the chairman wants to move platform state, use this packet as the operator entrypoint.
- If not, keep deployment deferred and continue only concrete public comprehension, trust copy, source/coverage, route-health, or A1 data-readiness work.
