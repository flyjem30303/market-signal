# Route Local Public Copy Alignment

Status: `route_local_public_copy_alignment_ready_mock_boundary_preserved`

CEO decision: `align_route_level_public_copy_to_mapping_without_broad_page_rewrite`

PM route: `route_local_public_copy_alignment`

This slice verifies that route-level public pages inherit the accepted runtime policy public-surface mapping through shared runtime, trust, freshness, and post-readonly components. It intentionally avoids a broad rewrite of large route files; the checked public routes already render shared boundary components and pass visible-language route checks.

## Source Inputs

- `docs/RUNTIME_POLICY_PUBLIC_SURFACE_MAPPING.md`
- `docs/BOUNDED_PUBLIC_SURFACE_COPY_PATCH_FROM_MAPPING.md`
- `src/lib/public-runtime-boundary-copy.ts`
- `src/components/home-runtime-status-panel.tsx`
- `src/components/stock-runtime-at-a-glance.tsx`
- `src/components/trust-runtime-boundary-notice.tsx`
- `src/components/data-freshness-strip.tsx`
- `src/components/post-readonly-product-status.tsx`
- `src/components/public-runtime-state-strip.tsx`

## Route Alignment

| Route | Alignment mechanism | Required public boundary |
| --- | --- | --- |
| `/` | `DashboardShell` renders `DataFreshnessStrip` and `HomeRuntimeStatusPanel`; `HomeRuntimeStatusPanel` renders `getPublicRuntimeBoundaryCopy("home")`, `PublicRuntimeStateStrip`, and `PostReadonlyProductStatus`. | `publicDataSource=mock`, `scoreSource=mock`, first closed-loop evidence only as limited Beta context, partial coverage, missing/delayed data, non-investment advice. |
| `/stocks/[symbol]` | `DashboardShell` renders stock mode with `DataFreshnessStrip` and `StockRuntimeAtAGlance`; `StockRuntimeAtAGlance` renders `getPublicRuntimeBoundaryCopy("stock")`, `PublicRuntimeStateStrip`, and `PostReadonlyProductStatus`. | Stock scores remain mock, no buy/sell/hold advice, accepted closed-loop evidence applies only to limited TW equity sub-scope, blocked symbols remain incomplete. |
| `/briefing` | Route renders `DataFreshnessStrip`, `PublicRuntimeStateStrip`, `PostReadonlyProductStatus`, `RuntimeReadinessPanel`, and row coverage status. | Must keep full MVP blocked context, runtime/score mock boundary, partial coverage, and no investment advice visible. |
| `/weekly` | Route renders `DataFreshnessStrip`, `TrustRuntimeBoundaryNotice context="weekly"`, and `WeeklyRowCoverageStatus`. | Weekly copy must not claim live market data, complete row coverage, real score approval, or investment advice. |
| `/methodology` | Route renders `DataFreshnessStrip` and `TrustRuntimeBoundaryNotice context="methodology"`. | Methodology must state mock scores are not formal model conclusions and promotion requires separate gates. |
| `/disclaimer` | Route renders `TrustRuntimeBoundaryNotice context="disclaimer"`. | Legal copy must state the product is mock-only and not investment advice. |
| `/terms` | Route renders `TrustRuntimeBoundaryNotice context="terms"`. | Terms copy must state public information remains mock-only and can be stale, incomplete, delayed, unavailable, or wrong. |
| `/privacy` | Route renders `TrustRuntimeBoundaryNotice context="privacy"`. | Privacy copy must state mock display does not enable real data and raw market/row payloads are not public. |

## Execution Decision

CEO decision is to align and verify route-level public copy through shared components and focused route checkers first. A broad route text rewrite is deferred because current visible pages already pass readability and boundary checks, and broad route edits would add avoidable risk before Beta deployment closure.

## Still Blocked

- runtime promotion
- score promotion
- full MVP row coverage claim
- public real-data claim
- investment advice claim
- public launch completion claim
- `publicDataSource=supabase`
- `scoreSource=real`

## Hard Stops

This alignment does not authorize:

- SQL execution
- Supabase write
- staging row creation
- `daily_prices` mutation
- raw market-data fetch
- raw market-data ingest
- raw market-data storage
- raw market-data commit
- raw payload output
- row payload output
- stock id payload output
- secret output
- additional row coverage points
- full MVP coverage claim
- public source promotion
- `publicDataSource=supabase`
- real score promotion
- `scoreSource=real`
- investment advice claim
- public launch completion claim

## A1 / A2 Routing

- A1 support lane: continue `twii_etf_blocked_universe_candidate_and_rights_path`.
- A2 support lane: monitor public-copy readability and keep route-local copy suggestions bounded.
- PM mainline: continue toward `beta_deployment_operator_values_or_blocked_universe_candidate_path` after route-level alignment passes.

## No-Action Confirmation

This slice does not run SQL, does not write Supabase, does not create staging rows, does not mutate `daily_prices`, does not fetch or ingest market data, does not output raw payloads, row payloads, stock id payloads, or secrets, does not award additional row coverage points, and does not claim public launch completion.

## Verification

Required checks:

- `npm run check:route-local-public-copy-alignment`
- `npm run check:bounded-public-surface-copy-patch-from-mapping`
- `npm run check:public-runtime-boundary-coverage`
- `npm run check:public-visible-language-quality`
- `npm run check:public-route-loop`
- `npx tsc --noEmit`
- `node scripts/check-review-gates.mjs`

The next route is `beta_deployment_operator_values_or_blocked_universe_candidate_path`.
