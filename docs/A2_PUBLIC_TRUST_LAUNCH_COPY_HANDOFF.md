# A2 Public Trust Launch Copy Handoff

Status: `a2_public_trust_launch_copy_handoff_ready`
Updated: 2026-06-07
Owner lane: A2 Frontend / UX Readability / Public Copy QA
Integration owner: PM mainline
Mode: `bounded_local_only_copy_inventory`

## Boundary

This handoff is a copy and UI wording inventory for launch readiness. It does not change UI implementation, runtime state, data evidence, source approval, scoring, or deployment.

- Keep `publicDataSource=mock`.
- Keep `scoreSource=mock`.
- Do not run SQL.
- Do not connect to Supabase.
- Do not write Supabase.
- Do not fetch, store, ingest, or commit raw market data.
- Do not print secrets, raw payloads, row payloads, or stock id payloads.
- Do not set `publicDataSource=supabase`.
- Do not set `scoreSource=real`.

## Source Documents Referenced

- `docs/MVP_LAUNCH_PRD.md`: launch-ready requires local 200s, readable mock-only public copy, visible and technical preservation of `publicDataSource=mock` and `scoreSource=mock`, language checks, full review gate, and no hidden mock-only boundary.
- `docs/PUBLIC_TRUST_AND_DISCLOSURE_COPY_WORKLIST.md`: defines the public trust items needed before promotion: mock/real status, freshness, data source, coverage, non-investment-advice notice, risk, missing/delayed data, model/score limits, and runtime promotion state.
- `docs/CP3_PUBLIC_CLAIM_APPROVAL_CHECKLIST_2026-05-29.md`: public claims for real scores, validation, freshness, market coverage, and investment usefulness remain draft/not approved until role sign-off.
- `docs/CP3_UI_STATE_DISCLOSURE_PLACEMENT_PLAN_2026-05-29.md`: disclosure placement requires non-advisory wording near score areas, source attribution near freshness/methodology, missing-data state before score explanation, and mock state above the fold when mock score is shown.
- `docs/reviews/SOURCE_RIGHTS_DISCLOSURE_ACCEPTANCE_GATE_2026-06-02.md`: source-rights disclosure is accepted only as a local review packet; external provider terms, redistribution, public real-data claims, and `scoreSource=real` remain blocked.
- `src/lib/public-claim-runtime-state.ts`: current shared public state preserves `claimApprovalState: "not_approved"`, `publicDataSource: "mock"`, `scoreSource: "mock"`, and blocks public source, real-score wording, market-data coverage, and investment-advice claims.
- `src/lib/public-runtime-boundary-copy.ts`, `src/components/public-runtime-state-strip.tsx`, `src/components/trust-runtime-boundary-notice.tsx`, `src/components/home-runtime-status-panel.tsx`, and `src/components/stock-runtime-at-a-glance.tsx`: current public surfaces already contain runtime boundary structures but still need readable launch copy review.

## Already Present Public Trust Copy

- Shared public runtime state exists through `PublicRuntimeStateStrip` and `getPublicClaimRuntimeState()`, including a visible now / not live yet / next gate structure.
- Home and stock runtime panels already state that mock signals can be read today and that Supabase-backed public data plus `scoreSource=real` require separate accepted gates.
- MVP launch PRD already forbids public claims about buy/sell/hold, real freshness, provider rights, row coverage points, and `scoreSource=real`.
- Source-rights disclosure has a local review acceptance gate covering attribution, redistribution/retention boundaries, delay, missing fields, partial coverage, source outage, freshness state, non-advisory wording, and score limitation placement.
- Trust/legal surfaces have a dedicated boundary notice component and are wired to the shared public runtime state strip.
- The public trust worklist already names required disclosure topics and separates now / after promotion / final polish work.

## Gaps

Launch-ready copy gaps that PM should intake before public release:

1. Some trust/runtime boundary source strings still appear visually corrupted or not reader-facing enough; PM should prioritize readable Chinese replacement before launch.
2. The public site has structures for runtime state, but not every trust statement is consistently written in plain launch copy across home, stock, briefing, weekly, methodology, terms, privacy, and disclaimer.
3. Mock/real language exists, but PM still needs a single approved phrase set for "mock-only today", "not live real data", "after runtime promotion", and "blocked until accepted gates".
4. Freshness copy needs a launch-safe distinction between metadata/readiness and live market-data freshness.
5. Coverage copy needs a launch-safe distinction between readiness/row-coverage evidence and public completeness claims.
6. Source-rights copy needs PM/legal acceptance before naming providers, retention, redistribution, or source-specific rights in public wording.
7. Score/model copy needs a consistent non-advisory limitation near every score, signal, risk, action summary, and methodology explanation.
8. Empty, stale, unavailable, partial, and delayed-data states need one approved wording pattern so the UI does not silently imply confidence.
9. Public pages should avoid leading with internal workflow terms such as gate, runtime, row coverage, Supabase, and readiness unless an adjacent reader-facing explanation is present.

## Launch-Blocking Copy

PM should treat these as launch blockers for public release:

- Any visible page hides or weakens the mock-only boundary.
- Any public copy implies real market data is live before `publicDataSource=supabase` is separately authorized.
- Any public copy implies real scoring, forecast confidence, backtested validation, or production model approval before `scoreSource=real` is separately authorized.
- Any score or action-summary area lacks nearby non-investment-advice and model/score limitation language.
- Any freshness, source, or coverage area implies complete, current, provider-approved, or redistribution-approved data without accepted evidence and source-rights wording.
- Any trust/legal page contains mojibake, unreadable strings, or raw internal tokens as the primary explanation.
- Any public output prints secrets, raw payloads, row payloads, stock id payloads, SQL text, or raw market data.

## Non-Blocking UI Polish

These are useful but should not block PM from integrating launch-critical copy:

- Tighten spacing, hierarchy, and disclosure density after wording is accepted.
- Convert repeated trust copy into reusable components after PM freezes the phrase set.
- Add tooltip-level clarifications for dense terms only after first-screen copy is understandable.
- Harmonize label style across home, stock, briefing, weekly, and legal pages.
- Do screenshot-driven polish after language checks and local route health are stable.

## Mock / Real Promotion Copy Rules

Before promotion:

- Use "mock signal", "sample signal", "product-flow example", or "not live market-data evidence".
- Use exact stop lines `publicDataSource=mock` and `scoreSource=mock` in explicit disclosure or technical detail areas.
- Do not say real source, live market data, complete coverage, validated score, forecast, or recommendation.
- Explain that source-rights, coverage, freshness, model, and release gates remain separate.

After PM accepts runtime promotion gates:

- Replace mock-only wording only from an approved phrase set.
- Publish source names or provider-specific wording only after source-rights acceptance.
- Publish freshness timestamps only after PM accepts the freshness source and stale behavior.
- Publish coverage numbers only after A1/PM accepts coverage evidence and downgrade rules.
- Keep non-investment-advice, risk, delayed/missing-data, and model-limitation disclosures visible even after promotion.

## A2 Next Recommended Task

Run a copy-only pass that replaces corrupted or internal-facing trust/runtime boundary strings with approved reader-facing Chinese on the highest-trust surfaces first:

1. `src/lib/public-runtime-boundary-copy.ts`
2. `src/components/trust-runtime-boundary-notice.tsx`
3. `src/components/home-runtime-status-panel.tsx`
4. `src/components/stock-runtime-at-a-glance.tsx`
5. legal pages using `TrustRuntimeBoundaryNotice`

This next task should remain copy-only and should update the relevant public language checker in the same slice.

## PM Intake Checklist

- Confirm this handoff remains bounded local-only and did not touch data evidence, Supabase, raw market data, runtime toggles, or mainline GOAL/status files.
- Decide which launch-blocking copy gaps PM wants A2 to fix first.
- Approve a shared phrase set for mock-only, not-live-yet, freshness metadata, partial coverage, missing/delayed data, and non-advisory score limitations.
- Confirm source-rights copy is still local-review-only until external rights are accepted.
- Confirm `publicDataSource=mock` and `scoreSource=mock` remain visible and technically preserved.
- Route any real-source, coverage percentage, freshness timestamp, or real-score wording through PM/A1/legal/investment gates before public use.
- Run public visible language quality, route health, and review gates after integrating any public copy changes.
