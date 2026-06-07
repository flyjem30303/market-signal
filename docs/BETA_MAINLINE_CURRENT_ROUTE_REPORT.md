# Beta Mainline Current Route Report

Status: `beta_mainline_current_route_report_ready`

Owner: PM mainline

Support lanes: A1 Data / Supabase / Market Evidence, A2 Public Copy / Trust / Legal / UX Readiness

## CEO Decision

CEO decision: `keep_beta_mainline_moving_with_a1_a2_parallel_routes`

PM should use one current-route report before choosing the next Beta launch slice. The report keeps the mainline focused on Beta launch readiness while A1 and A2 continue in parallel. It does not replace the individual reports; it summarizes them into the next route.

## Command

```powershell
cmd.exe /c npm run report:beta-mainline-current-route
cmd.exe /c npm run check:beta-mainline-current-route
```

## Route Logic

The report reads:

- `report:beta-platform-unblock-kit`
- `report:a1-source-rights-next-action`
- `report:a1-source-rights-readiness-summary`
- `report:a2-public-copy-readability-candidates`

If an accepted reviewed artifact exists, PM routes to `render:beta-pre-execution-packet-candidate`.

If the two platform values validate, PM routes to `run:beta-packet-window-proof-map`.

If platform values are missing, PM waits only for:

- `BETA_HOSTING_PROJECT_NAME`
- `BETA_TEMPORARY_URL`

While those two values are missing, the report now returns `pmDefaultWhenBlocked.active=true`.
That default route prevents repeated governance expansion:

- Refresh focused local runtime proof only when runtime code or route health changes.
- Keep A1 on exact TWII/ETF source-rights evidence intake.
- Keep A2 on urgent public-copy regression repairs only.
- Do not reopen broad deployment governance.
- Do not expand A2 visual polish before platform values arrive.
- Do not create a packet-window artifact before both platform values validate.

A1 remains on exact TWII/ETF source-rights evidence intake until the exact ledger can open a separate TWII or ETF source-rights outcome gate.
Its immediate command is `cmd.exe /c npm run report:a1-exact-source-rights-evidence-worksheet`.
The mainline report also surfaces `parallelRoutes.a1.readiness`, including ready lanes, blocked lanes, TWII pending count, ETF pending count, and the A1 readiness next command.
The mainline report also surfaces `parallelRoutes.a1.priorityDecision`, keeping TWII first through `twii_source_rights_unblock_first_etf_parallel_rights_option`, preserving ETF as a parallel option, and marking the priority decision as non-executable.

A2 remains on public Beta trust copy, legal disclosure, first-screen readability, and user-understanding checks. If urgent first-screen blockers are zero, A2 should patch only launch-blocking public-copy regressions.
The mainline report surfaces `parallelRoutes.a2.decisionSupport`, so PM can see the next A2 maintenance slice without reading the full public-copy scanner output. While urgent first-screen candidates are zero, that route stays on `a2-checker-hardening`.

## Safety Boundary

This report is a local route report only.

- `publicDataSource=mock`
- `scoreSource=mock`
- No deployment is authorized.
- No hosting resource is created or mutated.
- No platform environment value is printed.
- No SQL is executed.
- No Supabase connection, read, or write is executed.
- No staging rows or `daily_prices` rows are created or modified.
- No raw market data is fetched, stored, ingested, or committed.
- No secrets, raw payloads, row payloads, or stock id payloads are printed.

## PM Usage

Use this report when the next action is unclear after A1 or A2 changes. It should prevent repeated broad governance by giving PM one consolidated route:

1. Continue Beta platform value / packet work when safe.
2. Keep A1 source-rights and coverage evidence moving in parallel through `report:a1-source-rights-readiness-summary` and `report:a1-exact-source-rights-evidence-worksheet`.
3. Keep A2 public trust and first-screen readiness stable.
4. Do not promote real data or real scores until a separate promotion gate passes.
