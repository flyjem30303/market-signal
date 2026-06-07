# A2 Route-Level Launch Copy Audit

Status: `a2_route_level_launch_copy_audit_ready`
Updated: 2026-06-07
Owner lane: A2 Frontend / UX Readability / Public Copy QA
Integration owner: PM mainline
Mode: `bounded_local_only_copy_audit`

## Boundary

This is an audit only. It does not redesign UI, change route behavior, touch data evidence, connect to Supabase, run SQL, fetch/ingest market data, print payloads, or change runtime toggles.

- Keep `publicDataSource=mock`.
- Keep `scoreSource=mock`.
- Do not set `publicDataSource=supabase`.
- Do not set `scoreSource=real`.
- Do not use real-source wording.
- Do not claim real market data, complete coverage, real score, or investment advice.
- Do not touch PM mainline files, review gate files, GOAL files, `PROJECT_STATUS.md`, or `LAUNCH_ENGINEERING_WORKSTREAM_BOARD.md`.
- Do not touch A1 data evidence.
- Do not change runtime toggles.

## Audit Legend

- `satisfies_now`: Current route/surface has enough launch trust copy for the criteria, assuming PM accepts the current phrase set.
- `needs_small_copy_patch`: Current route/surface has the structure, but visible copy still needs a bounded copy-only patch before launch.
- `wait_for_phrase_set`: Current route/surface should wait until PM approves shared wording before implementation.
- `lower_priority_visual_polish`: Current route/surface is readable enough; remaining work is presentation polish, not launch-blocking copy.

## Route Audit Matrix

| Route / surface | Classification | Current evidence | Required trust copy coverage | PM / A2 next action |
|---|---|---|---|---|
| `/` home first screen | `satisfies_now` | Home/dashboard copy states mock-only reading mode; `HomeRuntimeStatusPanel` explains mock-only, not-live-yet, freshness metadata, partial coverage/readiness, missing/delayed data, model limitation, and non-investment-advice. | Preserves `publicDataSource=mock`, `scoreSource=mock`, mock-only, data freshness limitation, partial coverage, missing/delayed data, model limitation, and non-investment-advice. | Keep as current baseline; PM can later approve phrase tightening. |
| `/stocks/[symbol]` stock first screen and details | `satisfies_now` | Stock metadata and `StockRuntimeAtAGlance` state mock-only runtime, not real market data, not complete coverage, not formal model conclusion, and not personalized investment advice. | Preserves `publicDataSource=mock`, `scoreSource=mock`, freshness metadata, partial coverage/readiness, missing rows, model limitation, and non-investment-advice. | Keep as current baseline; later phrase harmonization can follow PM approval. |
| `/briefing` | `needs_small_copy_patch` | Briefing includes `PublicRuntimeStateStrip`, `DataFreshnessStrip`, `RuntimeReadinessPanel`, row coverage, and non-advice copy, but several hero/nav/section strings still appear mojibake or too internal. | Trust topics are structurally present, but launch readability is not consistent enough across first screen and follow-up sections. | A2 should run a bounded briefing copy-only pass after PM approves route-level priority. |
| `/weekly` | `needs_small_copy_patch` | Weekly includes `TrustRuntimeBoundaryNotice`, `DataFreshnessStrip`, weekly row coverage, and non-advice copy, but hero/nav/section strings still include mojibake and cadence copy needs reader-facing cleanup. | Mock-only, data freshness limitation, partial coverage/readiness, and non-advice are present through shared components, but first-screen copy still needs cleanup. | A2 should run a bounded weekly copy-only pass, keeping cadence and trust language explicit. |
| `/disclaimer` | `needs_small_copy_patch` | `TrustRuntimeBoundaryNotice` now covers mock-only, data freshness limitation, risk, partial coverage, missing/delayed data, model limitation, and non-investment-advice. Surrounding hero/legal quick-read copy still contains mojibake. | Required trust copy is present through shared notice, but route-local legal copy is not fully launch-readable. | Patch route-local legal copy only; do not change legal meaning or source approvals. |
| `/terms` | `needs_small_copy_patch` | Terms page includes non-investment-advice and mock-boundary concepts plus shared trust notice. Some local wording should be normalized to the PM phrase set. | Meets core boundary through shared notice; route-local copy needs clean terms wording for launch confidence. | Patch terms copy after PM confirms exact legal phrase set. |
| `/privacy` | `needs_small_copy_patch` | Privacy page includes no-investment-advice and mock-boundary concepts plus shared trust notice. It should clarify data freshness and no raw data line in route-local wording. | Meets core boundary through shared notice; route-local privacy copy should be tightened for launch. | Patch privacy copy after PM confirms legal/privacy phrase set. |
| `/methodology` | `needs_small_copy_patch` | Methodology includes model limitation and no investment advice, plus shared trust notice. It still needs route-local consistency around mock model, real-data promotion, and score limitation. | Core trust topics are present, but methodology is where model limitation must be the clearest. | A2 should patch methodology wording after PM approves model limitation phrase set. |
| Shared runtime boundary | `satisfies_now` | `public-runtime-boundary-copy.ts`, `PublicRuntimeStateStrip`, and `TrustRuntimeBoundaryNotice` preserve exact stop lines and explain mock-only, not-live-yet, freshness metadata, missing/delayed data, model limits, and non-advice. | Preserves `publicDataSource=mock`, `scoreSource=mock`, mock-only, data freshness limitation, partial coverage, missing/delayed data, model limitation, and non-investment-advice. | Keep as reusable source of truth; PM can freeze phrase set later. |
| Empty / error / unavailable states | `wait_for_phrase_set` | Current UI has missing/stale/unavailable concepts in stock modules and freshness components, but there is no single approved empty/error copy pattern for all routes. | Needs explicit mock-only, missing/delayed data, partial coverage, downgraded confidence, risk, model limitation, and non-advice pattern. | Wait for PM phrase set, then add a copy-only audit or small patch for empty/error states. |
| Footer / site-wide legal copy | `needs_small_copy_patch` | `src/app/layout.tsx` includes a site-wide mock reading and non-advice line. Footer/legal route wording should still be harmonized with shared trust copy. | Core boundary exists but should use the same mock/real, freshness, coverage, and model limitation language as route-level notices. | Patch footer/legal copy after PM freezes shared phrase set. |
| Visual polish across routes | `lower_priority_visual_polish` | Current task is copy placement audit only; visual hierarchy can wait because launch-blocking copy gaps are identifiable without redesign. | Not a trust-copy blocker if text remains readable and stop lines remain visible. | Defer typography, spacing, icons, tooltip density, and screenshot annotation work. |

## Cross-Route Required Copy Status

- `publicDataSource=mock`: `satisfies_now` through shared runtime state, public runtime boundary copy, home, stock, and legal/trust notice.
- `scoreSource=mock`: `satisfies_now` through shared runtime state, public runtime boundary copy, home, stock, and legal/trust notice.
- Non-investment-advice: `satisfies_now` on home, stock, shared boundary, and legal notice; `needs_small_copy_patch` on route-local briefing/weekly/legal copy with mojibake.
- Data freshness limitation: `satisfies_now` through `DataFreshnessStrip`, shared boundary, home, stock, and trust notice; `needs_small_copy_patch` where briefing/weekly route-local first-screen copy is not readable.
- Partial coverage: `satisfies_now` in home/stock row coverage language and shared criteria; `needs_small_copy_patch` for briefing/weekly route-local explanation.
- Missing/delayed data: `satisfies_now` in home/stock/shared boundary; `wait_for_phrase_set` for reusable empty/error/unavailable wording.
- Model limitation: `satisfies_now` in stock/shared boundary/legal notice; `needs_small_copy_patch` for methodology route-local wording consistency.

## Do Not Claim Before Promotion

- Do not claim `real market data`.
- Do not claim `complete coverage`.
- Do not claim `scoreSource=real`.
- Do not claim `investment advice`.
- Do not claim live data freshness, real-source approval, provider redistribution approval, validated forecast, or guaranteed model performance.

## PM Intake Checklist

- Confirm this audit is local-only and did not touch UI, Supabase, data evidence, raw market data, runtime toggles, review gates, GOAL files, `PROJECT_STATUS.md`, or `LAUNCH_ENGINEERING_WORKSTREAM_BOARD.md`.
- Decide whether A2 should patch `/briefing`, `/weekly`, or legal route-local copy first.
- Approve a shared phrase set for mock-only, data freshness limitation, partial coverage, missing/delayed data, model limitation, risk, and non-investment-advice.
- Keep shared runtime boundary as the source of truth until PM approves phrase changes.
- Defer visual polish until route-local mojibake and launch-blocking copy gaps are closed.
- Run route health and public visible language checks after any future copy-only patches.

## Suggested Next A2 Task

Run a bounded copy-only patch for `/briefing` first because it is a high-trust public route and still has multiple mojibake/internal-facing visible strings while already carrying the required runtime/trust components. Keep the patch limited to public copy and update only focused language checkers if needed.
