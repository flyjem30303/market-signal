# A2 Public Beta Trust Copy Readiness

Status: `a2_public_beta_trust_copy_readiness_ready`
Updated: 2026-06-07
Owner lane: A2 Frontend / UX Readability / Public Copy QA
Integration owner: PM mainline
Mode: `bounded_local_only_copy_readiness_support`

## Boundary

This support package is documentation and checker work only. It does not change page code, redesign UI, run SQL, connect to Supabase, write Supabase, fetch/ingest/store raw market data, print secrets, print raw payloads, print row payloads, print stock id payloads, change runtime toggles, or promote public data/source state.

- Keep `publicDataSource=mock`.
- Keep `scoreSource=mock`.
- Do not set `publicDataSource=supabase`.
- Do not set `scoreSource=real`.
- Do not claim real-source wording before PM/runtime promotion approval.
- Do not claim complete coverage before PM/A1 accepts coverage evidence and downgrade rules.
- Do not claim investment advice, buy/sell/hold instructions, guaranteed returns, validated forecasts, or real-score evidence.
- Do not touch data evidence, Supabase, runtime toggles, PM mainline files, review gate files, `PROJECT_STATUS.md`, `LAUNCH_ENGINEERING_WORKSTREAM_BOARD.md`, or GOAL files.

## Source Documents Referenced

- `docs/A2_PUBLIC_TRUST_LAUNCH_COPY_HANDOFF.md`
- `docs/A2_ROUTE_LEVEL_LAUNCH_COPY_PLACEMENT_CRITERIA.md`
- `docs/A2_ROUTE_LEVEL_LAUNCH_COPY_AUDIT.md`
- `src/lib/public-runtime-boundary-copy.ts`
- `src/components/public-runtime-state-strip.tsx`
- `src/components/trust-runtime-boundary-notice.tsx`
- `src/components/home-runtime-status-panel.tsx`
- `src/components/stock-runtime-at-a-glance.tsx`
- `src/components/data-freshness-strip.tsx`
- `src/app/layout.tsx`
- `src/app/briefing/page.tsx`
- `src/app/weekly/page.tsx`
- `src/app/disclaimer/page.tsx`

## Beta Readiness Legend

- `beta_ready_shared_surface`: The shared surface carries the required trust topic, but PM should still review visible wording density.
- `beta_copy_risk_needs_patch`: The route/surface has trust structures, but visible route-local copy includes mojibake, overly internal wording, or unclear public phrasing.
- `beta_wait_for_pm_phrase_set`: The route/surface needs PM-approved phrase rules before A2 should patch.
- `beta_post_beta_visual_polish`: The issue is presentation only; trust copy is not blocked if text remains readable.

## Required Beta Trust Topics

Every public Beta route or shared trust surface that shows signals, scores, freshness, coverage, methodology, legal copy, or action summaries must keep these topics visible and understandable:

- `mock-only`: The public experience is still a mock-facing product-flow and market-reading experience.
- `publicDataSource=mock`: This exact stop line must remain visible in shared trust or technical-detail copy.
- `scoreSource=mock`: This exact stop line must remain visible in shared trust or technical-detail copy.
- `partial coverage`: Coverage must be described as partial coverage/readiness until evidence and downgrade rules are accepted.
- `missing/delayed data`: Missing, stale, delayed, unavailable, or unvalidated data must reduce reading confidence.
- `data freshness`: Freshness is metadata/readiness context unless PM approves live market freshness wording.
- `model limitation`: Scores are simplified mock/model outputs, not forecasts, guarantees, or real model conclusions.
- `non-investment advice`: Signals, scores, rankings, watchlists, and action summaries are not investment advice.

## Route Readiness Matrix

| Route / surface | Beta readiness | Current support | Beta gap | PM / A2 intake |
|---|---|---|---|---|
| Home `/` | `beta_copy_risk_needs_patch` | Home renders `DashboardShell`, `DataFreshnessStrip`, `HomeRuntimeStatusPanel`, `PublicRuntimeStateStrip`, and runtime detail cards with mock/source/freshness/coverage concepts. | First-screen and some route-local dashboard strings still appear mojibake or internal-facing. Shared concepts exist, but visible Beta copy is not consistently readable. | PM should assign a bounded home copy-only cleanup after shared phrase set is accepted. |
| Stocks `/stocks/[symbol]` | `beta_copy_risk_needs_patch` | Stock metadata is clear about mock-only and no investment advice; stock route renders `StockRuntimeAtAGlance`, `DataFreshnessStrip`, `PublicRuntimeStateStrip`, runtime details, and score/freshness stop lines. | Several visible stock-page labels/details still contain mojibake or internal workflow terms. The trust structure exists, but the page is not fully public-readable. | Patch stock route/shared component visible copy without changing data, scores, or runtime state. |
| Briefing `/briefing` | `beta_copy_risk_needs_patch` | Briefing includes shared runtime, freshness, row coverage, blocker, model boundary, and non-advice concepts. | Current route-local copy still contains mojibake and internal-facing strings across hero, nav, model boundary, cards, and disclaimer areas. | This remains a high-priority A2 copy patch candidate before Beta. |
| Weekly `/weekly` | `beta_copy_risk_needs_patch` | Weekly includes `TrustRuntimeBoundaryNotice`, `DataFreshnessStrip`, weekly row coverage, action summary, and disclaimer structures. | Route-local cadence, hero, bridge, ranking, and disclaimer copy still contain mojibake; weekly cadence must not imply live or complete coverage. | Patch weekly copy after PM confirms phrase set for cadence/freshness/coverage. |
| Disclaimer `/disclaimer` | `beta_copy_risk_needs_patch` | Legal route includes `TrustRuntimeBoundaryNotice` and route-local legal quick-read sections. | Legal hero and quick-read text still include mojibake; legal meaning must be readable before Beta. | PM/legal should approve exact non-investment-advice, risk, data freshness, partial coverage, and model limitation wording. |
| Footer/legal shared chrome | `beta_copy_risk_needs_patch` | Footer links to methodology, disclaimer, privacy, and terms; footer includes a mock/non-advice concept. | Footer labels and trust line are not consistently readable and should not be the primary legal explanation until patched. | Patch footer copy only after PM approves concise shared footer phrase set. |
| Shared runtime boundary surfaces | `beta_copy_risk_needs_patch` | Shared surfaces preserve source/score stop lines and centralize mock/runtime/freshness concepts. | `TrustRuntimeBoundaryNotice` and `public-runtime-boundary-copy.ts` still include mojibake in visible titles/summaries, so they are not yet Beta-readable. | Treat shared runtime boundary as the highest leverage patch after PM phrase approval. |
| Data freshness strip | `beta_ready_shared_surface` | It explicitly states freshness metadata, source/as-of fields, score source, and that metadata does not approve investment claims or real score source. | Some local labels are still mojibake, but the English trust stop lines are understandable. | Keep as current Beta baseline; later patch label readability. |
| Empty/error/unavailable states | `beta_wait_for_pm_phrase_set` | Missing/stale/unavailable concepts exist in data modules and freshness-related components. | There is no single approved empty/error phrase set for missing/delayed data, partial coverage, and downgraded confidence. | PM should approve reusable copy before A2 patches empty/error states. |
| Visual polish | `beta_post_beta_visual_polish` | Copy risks can be identified without UI redesign. | Typography, iconography, spacing, and tooltip density are not the current blocker. | Defer until public wording is readable and approved. |

## Launch-Blocking Beta Copy Risks

These items should block public Beta copy readiness if visible on a public route:

- Mojibake or unreadable text in primary route-local copy, legal copy, footer copy, or shared trust copy.
- Any copy that hides `mock-only`, `publicDataSource=mock`, or `scoreSource=mock`.
- Any copy that implies real market data is live before promotion.
- Any copy that implies complete coverage before evidence and downgrade rules are accepted.
- Any copy that implies `scoreSource=real`, real score-source evidence, or validated forecasts.
- Any copy that frames scores, rankings, watchlists, action summaries, or signals as investment advice.
- Any freshness copy that reads like live market freshness instead of metadata/readiness.
- Any coverage or unavailable-state copy that omits partial coverage or missing/delayed data limitations.
- Any legal/methodology copy that omits risk disclosure, model limitation, or non-investment-advice.

## Beta Copy Rules Before Runtime Promotion

Before runtime promotion:

- Use "mock-only", "mock signal", "product-flow signal", "freshness metadata", "readiness", "partial coverage", and "missing/delayed data".
- Keep `publicDataSource=mock` and `scoreSource=mock` in shared trust or detail copy.
- Say scores are model-limited and may be wrong, stale, incomplete, delayed, or unavailable.
- Say signals, scores, rankings, and action summaries are not investment advice.
- Do not use real-source wording.
- Do not say `publicDataSource=supabase` is approved.
- Do not say `scoreSource=real` is approved.
- Do not say real market data is live.
- Do not say complete coverage is approved.
- Do not say the model provides buy/sell/hold advice, personal recommendations, guaranteed returns, or validated forecasts.

## PM Intake Checklist

- Confirm this support package is local-only documentation/checker work and did not change page code.
- Confirm no SQL, Supabase connection/write, raw market data fetch/ingest/store, runtime toggle change, or PM mainline file edit occurred.
- Decide whether shared runtime boundary copy or route-local legal copy is the first Beta blocker to patch.
- Approve one Beta phrase set for mock-only, data freshness metadata, partial coverage, missing/delayed data, model limitation, risk, and non-investment-advice.
- Decide whether Beta can tolerate remaining internal readiness cards if the first-screen and legal/footer copy are cleaned.
- Schedule focused A2 copy-only patches for shared runtime boundary, footer/legal, home/stocks, briefing, weekly, and empty/error states.
- Keep visual polish separate from launch-blocking copy readiness.

## Suggested Next A2 Task

Run a bounded copy-only patch for the shared trust surfaces first: `src/lib/public-runtime-boundary-copy.ts`, `src/components/trust-runtime-boundary-notice.tsx`, footer/legal copy in `src/app/layout.tsx`, and only the focused checker needed to keep `publicDataSource=mock`, `scoreSource=mock`, mock-only, data freshness metadata, partial coverage, missing/delayed data, model limitation, and non-investment-advice visible.
