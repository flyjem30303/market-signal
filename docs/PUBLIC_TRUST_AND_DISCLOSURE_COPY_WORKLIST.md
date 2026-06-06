# Public Trust And Disclosure Copy Worklist

Status: `pre_runtime_promotion_public_trust_copy_prepared`

Updated: 2026-06-07
Owner lane: A2 Frontend / UX Readability / Public Copy QA
Integration owner: PM mainline
Mode: `local_only_no_data_line_touched`

## Purpose

This worklist prepares the public trust and legal disclosure copy needed before runtime promotion. It does not redesign the UI, implement investment indicators, change runtime state, run data evidence, or promote any source.

The copy must be clear enough for a normal investor to understand what is test-facing, what is real-data-backed, what is incomplete, and what remains blocked. Public wording should reduce confusion without exposing internal process details as the main message.

The current public boundary remains:

- `publicDataSource=mock`
- `scoreSource=mock`
- Public source status: `mock_only_public_copy_ready`
- Real source status: `real_source_disclosure_waiting_for_runtime_promotion_gate`

## Hard Boundaries

This package is copy and QA guidance only.

- Do not execute SQL.
- Do not connect to Supabase.
- Do not write Supabase.
- Do not fetch, ingest, store, or commit raw market data.
- Do not edit Supabase/data evidence scripts.
- Do not edit A1 packets or raw market evidence.
- Do not change runtime promotion toggles.
- Do not set `publicDataSource=supabase`.
- Do not set `scoreSource=real`.
- Do not make investment recommendations or imply personalized advice.

## Public Trust Items Required Before Launch

Every public page that presents signals, scores, freshness, source status, or model output should make these items understandable in reader-facing Chinese:

1. Mock / real status: explain whether the visible signal is mock-facing, real-data-backed, or waiting for promotion. Today it must say the public experience is still mock-only where relevant.
2. Data freshness: show the latest known update or explain that freshness is not yet live for public decisions. Avoid implying live market freshness before promotion.
3. Data sources: name source categories only after PM accepts the source-rights wording. Before promotion, say the data-source approval path is not yet public-real.
4. Coverage rate: disclose whether market / ETF / stock coverage is complete, partial, delayed, or unavailable. Before the gate, coverage claims should be treated as readiness language, not production claims.
5. Non-investment-advice notice: say the site provides informational signal reading and product testing context, not personalized trading instructions.
6. Risk disclosure: explain that market movement, liquidity, concentration, model error, source delay, and incomplete data can materially affect interpretation.
7. Missing / delayed data: explain how the page behaves when values are missing, delayed, stale, or not validated, including downgrade language rather than silent confidence.
8. Model / score limitations: explain that scores are simplified indicators, may be wrong, depend on source quality, and should not be treated as forecasts or guarantees.
9. Runtime promotion state: explain when public claims are blocked by the runtime promotion gate, without exposing raw internal workflow unless it is inside an explicit technical detail section.

## Now: Can Do Before Runtime Promotion Gate

These are safe A2/PM copy tasks while the data line remains mock-only:

- Draft public copy blocks for mock/real status, freshness meaning, source status, coverage status, missing-data behavior, and model limitations.
- Add or revise disclosure acceptance criteria for home, stock, briefing, weekly, and shared runtime boundary surfaces.
- Keep reader-facing wording in Chinese while allowing exact machine stop lines such as `publicDataSource=mock` and `scoreSource=mock` inside explicit disclosure or technical-detail sections.
- Define copy placement rules: first-screen summary, near score/signal widgets, source/freshness panels, footer/legal disclosure, and error or unavailable states.
- Prepare PM integration notes for how to map A1 data-quality, source-rights, row-coverage, and model-credibility outcomes into public copy after approval.
- Check that public text does not claim live real data, production source approval, complete coverage, or investment advice.

Reader-facing Chinese draft direction:

「目前網站仍在資料真實化與覆蓋率補齊階段，公開畫面保留測試/示範性質。頁面中的分數與訊號不是個人化投資建議，也不保證報酬；資料可能延遲、缺漏或尚未通過正式來源與覆蓋率審核。」

Acceptance criteria for this phase:

- Public copy states the product is still mock-facing where real data is not approved.
- Disclosure copy can be reviewed without Supabase access, raw market payloads, SQL, or data evidence scripts.
- Work remains local-only and PM-owned for integration.
- The checker for this document returns `ok`.

## Later: After Runtime Promotion Gate

These items must wait until PM confirms the runtime promotion gate and the source/score boundaries are explicitly changed:

- Replace mock-only status copy with approved real-source status copy.
- Publish real freshness timestamps only after the live freshness source is accepted.
- Publish source names, attribution, rights notes, and provider-specific copy only after source-rights approval.
- Publish coverage percentages only after A1/PM accepted coverage evidence and downgrade rules.
- Replace readiness wording with production state wording only after `publicDataSource=supabase` is explicitly authorized by PM.
- Replace mock score wording only after `scoreSource=real` is explicitly authorized by PM.
- Update copy around missing, stale, partial, and delayed values using the approved runtime state mapping.

Promotion-gated copy must still keep non-investment-advice, risk, delay, missing-data, and model-limitation disclosures visible.

## Final Visual Polish

These tasks are deliberately after copy acceptance and runtime promotion clarity:

- Tune typography hierarchy, spacing, labels, icons, and disclosure density.
- Move repeated disclosure copy into reusable visual components if PM accepts the wording.
- Tighten mobile placement so trust copy is visible without crowding first-screen decisions.
- Harmonize footer, detail panel, tooltip, and empty-state disclosure language.
- Remove redundant technical detail only after PM confirms the public copy still preserves the legal and trust meaning.

No large UI redesign is part of this work package.

## Public Copy Placement Checklist

- Home first screen: one plain-language state line for mock/real status and non-advice boundary.
- Stock page score/signal area: nearby score-source limitation and missing/delayed data wording.
- Briefing page: executive-readable source/freshness/coverage summary that avoids raw machine tokens in the first paragraph.
- Weekly page: cadence and freshness wording that does not imply live market coverage before promotion.
- Shared runtime boundary notice: exact stop lines for `publicDataSource=mock` and `scoreSource=mock`, plus reader-facing explanation.
- Footer/legal area: non-investment-advice, risk disclosure, data-delay, model-limitation, and source-rights summary.
- Empty/error states: missing data, delayed data, stale data, unavailable coverage, and downgraded confidence copy.

## PM Integration Notes

PM should integrate this package with:

- A1 data-quality evidence only after sanitized PM approval.
- Source-rights acceptance before naming providers or redistribution terms publicly.
- Runtime promotion decision before changing public source or score state.
- Existing public-visible language checkers before route health or launch readiness review.
- I launch-readiness review before any production deployment or public environment change.

The intended integration result is a public site that tells users what is mock, what is real, how fresh and complete the information is, why it may be missing or delayed, and why the output is informational rather than investment advice.

PM should use this worklist to fix comprehension blockers first. Visual polish and annotation-heavy design review should remain later-stage work unless the wording is unreadable or legally unclear.
