# A2 Route-Local Trust Copy Route Health

Status: `a2_route_local_trust_copy_route_health_ready`
Updated: 2026-06-07
Owner lane: A2 Frontend / UX Readability / Public Copy QA
Integration owner: PM mainline
Mode: `bounded_local_route_health`

## CEO Decision

CEO decision: `verify_route_local_trust_copy_health_before_returning_to_data_coverage`.

PM route: `route_health_for_weekly_methodology_legal_pages_then_data_coverage_source_rights_unblock`.

The bounded route-local trust copy patch is accepted, but the formal launch path needs a repeatable route-health check before PM shifts the mainline back to data coverage and source-rights unblock work.

## Route Scope

This health gate covers only the public pages changed by the route-local trust copy patch:

- `/weekly`
- `/methodology`
- `/disclaimer`
- `/terms`
- `/privacy`

## Required Runtime / Trust Evidence

Each route must return HTTP `200` and include its route-local trust-copy token:

- `/weekly`: `Weekly Reading Boundary`
- `/methodology`: `Model Boundary`
- `/disclaimer`: `Disclosure Summary`
- `/terms`: `Terms Summary`
- `/privacy`: `Privacy Boundary`

Each route must also preserve the shared stop lines and public Beta trust boundaries:

- `publicDataSource=mock`
- `scoreSource=mock`
- `mock-only`
- No internal server error text.
- No `publicDataSource: supabase`.
- No `scoreSource: real`.

## Boundary

- No SQL.
- No Supabase connection or write.
- No staging rows.
- No `daily_prices` mutation.
- No raw market-data fetch, ingest, store, or commit.
- No row payload, stock id payload, raw source payload, or secret output.
- No public source promotion.
- No `scoreSource=real`.
- No deployment, DNS/SSL change, or platform env mutation.
- No visual-polish-only scope.

## Acceptance

This route-health gate is accepted when:

- `cmd.exe /c npm run check:a2-route-local-trust-copy-route-health` passes.
- The checker can validate an already running localhost server or start a temporary local server on a non-default port.
- `cmd.exe /c npm run check:a2-bounded-route-local-trust-copy-patch` still passes.
- `cmd.exe /c npm run check:a2-route-local-legal-weekly-methodology-copy-regression-gate` still passes.

## PM Result

- Execution result: `accepted`.
- Mock/real state: `publicDataSource=mock`; `scoreSource=mock`.
- Supabase / coverage impact: none.
- Formal launch impact: confirms route-local trust-copy pages are reachable and mock-boundary-readable after the bounded patch.
- Next route: `data_coverage_source_rights_unblock_after_route_health_green`.
