# A2 Route-Local Legal Weekly Methodology Copy Regression Gate

Status: `a2_route_local_legal_weekly_methodology_copy_regression_gate_ready`
Updated: 2026-06-07
Owner lane: A2 Frontend / UX Readability / Public Copy QA
Integration owner: PM mainline
Mode: `bounded_local_only_route_copy_regression`

## CEO Decision

CEO decision: `promote_route_local_trust_copy_regression_before_visual_polish`.

The next public-Beta readiness risk is not visual polish. It is route-local trust copy drifting away from the accepted mock/real boundary on `/weekly`, `/methodology`, `/disclaimer`, `/terms`, `/privacy`, and footer/legal shared chrome.

PM route: `route_local_legal_weekly_methodology_copy_regression_gate_then_bounded_copy_patches`.

## Boundary

This gate is local-only and copy-regression-only.

- Keep `publicDataSource=mock`.
- Keep `scoreSource=mock`.
- Do not set `publicDataSource=supabase`.
- Do not set `scoreSource=real`.
- Do not run SQL.
- Do not connect to Supabase.
- Do not write Supabase.
- Do not create staging rows.
- Do not modify `daily_prices`.
- Do not fetch, ingest, store, or commit raw market data.
- Do not print secrets, row payloads, stock id payloads, or raw source payloads.
- Do not claim live market data, complete coverage, real score approval, validated forecasts, provider redistribution approval, or investment advice.
- Do not make typography, spacing, icon, screenshot, or visual-polish-only work part of this gate.

## Regression Scope

This gate covers the route-local and shared public trust surfaces that A2 already classified as copy risks:

| Surface | Required regression coverage | Reason |
|---|---|---|
| `/weekly` | Weekly cadence must stay framed as product-flow reading, not live or complete market data. | Weekly summaries can look like actionable market commentary if the boundary disappears. |
| `/methodology` | Model scores must stay framed as simplified mock indicators, not formal conclusions, forecasts, guarantees, or advice. | Methodology is where model credibility and limits must be clearest. |
| `/disclaimer` | Legal page must preserve non-investment-advice, risk, source/data limitation, partial coverage, and mock-only boundary. | Disclaimer is the strongest trust stop line before public Beta. |
| `/terms` | Terms page must preserve informational mock Beta usage, stale/incomplete/delayed data limits, and no real-score promise. | Terms cannot imply provider rights, complete data, or production-grade market advice. |
| `/privacy` | Privacy page must preserve no-secret, no raw payload, local/browser-data, and mock display boundaries. | Privacy copy must not imply public pages expose source payloads or secrets. |
| Footer/legal shared chrome | Footer/legal navigation must keep visible links to methodology, disclaimer, privacy, and terms. | Users need a stable trust path from every page. |

## Required Public Trust Topics

The route-local surfaces must preserve these topics either directly or through shared trust components:

- Mock-only / sample signal state.
- Exact stop lines `publicDataSource=mock` and `scoreSource=mock`.
- Data freshness as metadata/readiness, not live freshness.
- Partial coverage and missing/delayed data limitations.
- Model limitation and no guarantee of score quality.
- Risk disclosure and non-investment-advice boundary.
- Source-rights and real promotion remain separate gates.

## Accepted Evidence

This gate is accepted when:

- `scripts/check-a2-route-local-legal-weekly-methodology-copy-regression-gate.mjs` passes.
- `package.json` exposes `check:a2-route-local-legal-weekly-methodology-copy-regression-gate`.
- `scripts/check-review-gates.mjs` registers the checker in the core review set.
- The checker verifies the expected route files, shared trust notice, footer/legal chrome, A2 placement criteria, A2 route audit, and this document.
- The checker blocks forbidden real-data, complete-coverage, real-score, investment-advice, SQL/Supabase-write, raw-market-data, and secret-output claims.

## A2 Next Assignment

After PM accepts this regression gate, A2 should patch route-local copy in this order:

1. `/weekly`: cadence and market-summary wording.
2. `/methodology`: model limitation and score interpretation wording.
3. `/disclaimer`, `/terms`, `/privacy`: legal quick-read and route-local page summaries.
4. Footer/legal shared chrome: only if a route-local patch changes shared phrase requirements.

Each patch must remain bounded, copy-only, and focused on public trust readability. Visual polish stays lower priority unless text comprehension or legal clarity is blocked.

## PM Record

- Execution result: `accepted`.
- Mock/real state: `publicDataSource=mock`; `scoreSource=mock`.
- Supabase / coverage impact: none in this slice.
- Formal launch impact: improves public Beta trust-copy regression protection and reduces the risk that route-local pages drift into real-data or advice claims before promotion.
- Next route: `bounded_weekly_methodology_legal_copy_patch_or_data_coverage_source_rights_unblock`.
