# A2 Bounded Route-Local Trust Copy Patch

Status: `a2_bounded_route_local_trust_copy_patch_applied_mock_boundary_preserved`
Updated: 2026-06-07
Owner lane: A2 Frontend / UX Readability / Public Copy QA
Integration owner: PM mainline
Mode: `bounded_local_only_copy_patch`

## CEO Decision

CEO decision: `apply_route_local_trust_copy_patch_before_visual_polish`.

PM route: `bounded_weekly_methodology_legal_copy_patch_then_route_health`.

The patch adds a shared route-local trust copy panel to the route surfaces that were already classified as copy risks. It does not replace the full page copy or redesign the UI; it inserts a readable launch-boundary block that can carry the public Beta trust message until each route receives a deeper copy pass.

## Changed Public Surfaces

- `src/components/route-local-trust-copy-panel.tsx`
- `src/app/weekly/page.tsx`
- `src/app/methodology/page.tsx`
- `src/app/disclaimer/page.tsx`
- `src/app/terms/page.tsx`
- `src/app/privacy/page.tsx`
- `src/app/globals.css`

## Copy Coverage

The shared panel covers:

- `publicDataSource=mock`
- `scoreSource=mock`
- mock-only Beta state
- data freshness as metadata / readiness
- partial coverage / readiness
- missing or delayed data
- model limitation
- non-investment advice
- risk disclosure
- source rights and real promotion as separate gates
- no secret or raw payload exposure on public pages

## Boundary

- No SQL.
- No Supabase connection or write.
- No staging rows.
- No `daily_prices` mutation.
- No raw market-data fetch, ingest, store, or commit.
- No row payload, stock id payload, raw source payload, or secret output.
- No public source promotion.
- No `scoreSource=real`.
- No production deployment, preview deployment, DNS/SSL change, or platform env mutation.
- No visual-polish-only scope.

## Acceptance

This patch is accepted when:

- `cmd.exe /c npm run check:a2-bounded-route-local-trust-copy-patch` passes.
- `cmd.exe /c npm run check:a2-route-local-legal-weekly-methodology-copy-regression-gate` passes.
- TypeScript passes after route integration.
- Route-level public trust copy still preserves mock/real stop lines.

## PM Result

- Execution result: `accepted`.
- Mock/real state: `publicDataSource=mock`; `scoreSource=mock`.
- Supabase / coverage impact: none.
- Formal launch impact: improves public Beta trust readability on weekly, methodology, disclaimer, terms, and privacy routes while preserving real-promotion blockers.
- Next route: `route_health_for_weekly_methodology_legal_pages_or_data_coverage_source_rights_unblock`.
