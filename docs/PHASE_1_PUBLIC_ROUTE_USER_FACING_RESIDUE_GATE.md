# Phase 1 Public Route User-Facing Residue Gate

Status: `phase_1_public_route_user_facing_residue_gate_ready`

Gate decision: `public_routes_must_not_show_internal_project_process_copy`

## Scope

This gate protects the Phase 1 public user experience before a release candidate.

Target routes:

- `/`
- `/briefing`
- `/stocks/[symbol]`

Route surface files:

- `src/app/page.tsx`
- `src/app/briefing/page.tsx`
- `src/app/stocks/[symbol]/page.tsx`
- `src/components/dashboard-shell.tsx`
- `src/components/public-beta-data-readiness-status.tsx`
- `src/components/public-beta-source-coverage-bridge.tsx`
- `src/components/public-beta-usable-loop-panel.tsx`
- `src/components/public-data-source-boundary-notice.tsx`
- `src/components/stock-runtime-at-a-glance.tsx`
- `src/components/trust-runtime-boundary-notice.tsx`

## Public Residue Rule

Public pages must not show internal project process copy, developer workflow commands, operator packets, source-gate labels, or team-lane labels that are only useful to CEO/PM/A1/A2/A3/A4.

Internal-only components must not be imported or rendered by the Phase 1 public route surface:

- `PublicBetaLaunchReadinessPanel`
- `BriefingPublicBetaGateSummary`
- `BlockerReadinessPanel`
- `SourceDepthBlockerPanel`

Examples blocked from the public route surface:

- `PUBLIC BETA READINESS`
- `PRE-LAUNCH EXECUTABLE`
- `CURRENT HARD BLOCKERS`
- `REMAINING HARD BLOCKERS`
- `EXTERNAL REPLY DRY-RUN INTAKE`
- `REQUEST BLOCKS`
- `BETA_HOSTING_PROJECT_NAME`
- `BETA_TEMPORARY_URL`
- `PUBLIC_BETA_EXTERNAL_REPLY_PATH`
- `cmd.exe /c npm`
- `npm run check:`
- `phase_1_`
- `commit <hash>`
- `hard blocker`
- `blocker group`
- `workflow proof`
- `dry-run intake`
- `packet proof`
- `PM worktree`
- `A1 evidence`
- `A1 TWII`

## Boundary

- No SQL.
- No Supabase write.
- No market-data fetch.
- No raw payload or row payload output.
- No public real-data promotion.
- `publicDataSource=mock`
- `scoreSource=mock`

## Next Route

`repair_any_public_route_residue_before_phase_1_release_candidate`

If this gate fails, repair the public copy or move internal panels behind an internal route before any Phase 1 release candidate review.
