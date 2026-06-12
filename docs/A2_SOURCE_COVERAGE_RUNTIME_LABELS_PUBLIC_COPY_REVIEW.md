# A2 Source/Coverage Runtime Labels Public Copy Review

Status: `a2_source_coverage_runtime_labels_public_copy_review_accepted_after_pm_copy_repair`
Date: 2026-06-12
Owner lane: A2 Public Copy / Product Safety
Mode: `bounded_local_only_document_review`

## Scope

This review checks the newly added source / coverage runtime labels against the public Beta index-status dashboard BRIEF:

- A general investor should understand the source and coverage state within 30 seconds.
- Public copy should explain what is usable demo data, what is still being checked, and what remains blocked.
- The surface must preserve mock-only and non-investment-advice boundaries.
- This review does not change runtime behavior, code, package scripts, or review gates.

## Evidence Reviewed

- `src/lib/public-beta-source-coverage-runtime-labels.ts`
- `src/components/public-beta-source-coverage-runtime-labels-panel.tsx`
- `scripts/check-public-beta-source-coverage-runtime-labels.mjs`
- `src/components/dashboard-shell.tsx`
- `src/app/briefing/page.tsx`
- `docs/A2_PUBLIC_COPY_UX_SAFETY_QA_HANDOFF_2026_06_12.md`
- `docs/A2_PUBLIC_DATA_TRUST_COPY_HANDOFF.md`

## Boundary Held

- No SQL was run.
- No Supabase connection or write was attempted.
- No market-data fetch, ingest, raw payload readout, or secret readout was performed.
- No program files, package files, or review-gate files were modified.
- The reviewed runtime object keeps `publicDataSource=mock` and `scoreSource=mock`.
- This document does not authorize real-data promotion, source-rights approval, real scoring, trading instructions, or investment advice.

## 30-Second Investor Readability

Current status after PM repair: acceptable for public Beta readability as a bounded source/coverage label surface.

The new label surface is structurally useful because it appears on home, briefing, and stock contexts, separates three coverage layers, and exposes the two key technical flags near the labels. That is the right product shape for the BRIEF.

PM follow-up note: A2's first read saw mojibake from the worker-side display path. PM rechecked the current route output through the UTF-8 route checker and public visible language checker, then still accepted the product-copy recommendation to simplify the public labels.

PM copy repair applied:

- headline changed to `資料來源與覆蓋狀態`;
- summary now explains that public Beta uses simulated data while formal data, source rights, coverage quality, and update cadence are still being checked;
- state chips changed to `展示可用`, `檢查中`, and `暫停公開`;
- listed equity layer changed to `上市個股批次`;
- exact mock flags remain visible near the boundary.

Recommended A2 classification: `accepted_after_bounded_copy_repair`.

## Development-Process Strings

Current status: partially acceptable, but needs public translation beside technical terms.

Acceptable technical strings:

- `Source & Coverage`
- `publicDataSource=mock`
- `scoreSource=mock`
- source, coverage, mock-only, Beta, demo data, not real-time data, not investment advice

Potentially confusing process strings:

- `runtime`
- technical flag names without plain-language meaning
- internal lane or workflow concepts such as A1, A2, PM, packet, gate, preflight, post-run, candidate, staging, authorization, runbook
- database or implementation terms shown as public status instead of audit detail

The current component exposes `Source & Coverage` and technical flags, which is acceptable only if the surrounding Chinese copy explains them in investor language. The module/checker also contains corrupted strings, so future checker expectations should be updated together with any copy repair.

## Mock-Only / Non-Advice Safety

Current status after PM repair: boundary is held and the visible text is readable enough for public Beta source/coverage context.

Positive signals:

- The runtime state remains mock-only.
- The score state remains mock-only.
- The checker excludes obvious non-mock runtime phrases from the module/component/dashboard/briefing surfaces.
- Prior A2 BRIEF handoffs already require mock labels close to signal cards and prohibit buy/sell/hold, target-price, guaranteed-return, and personalized-advice wording.

Remaining public-copy risk:

- A2 should continue watching whether source/coverage labels crowd the first screen on small devices.
- A2 should keep preventing future edits from replacing reader-facing labels with internal workflow labels.

## Words To Keep

Keep these terms because they support the BRIEF and product-safety posture:

- `Public Beta`
- `mock-only`
- `demo data`
- `simulated data`
- `not real-time market data`
- `source status`
- `coverage status`
- `coverage is still being checked`
- `partial coverage`
- `blocked`
- `checking`
- `usable demo`
- `not investment advice`
- `not a buy/sell/hold signal`
- `publicDataSource=mock`
- `scoreSource=mock`

Chinese-facing examples to preserve or use after PM review:

- `公開 Beta 目前使用模擬資料`
- `資料來源仍未切換為正式市場資料`
- `覆蓋狀態仍在檢查`
- `部分指數、ETF、股票或日期區間可能缺漏`
- `這不是即時行情`
- `這不是買進、賣出、持有或個人化投資建議`

## Words To Avoid

Avoid these words or claims on public surfaces until the relevant PM/A1/legal/investment gates explicitly accept them:

- live
- real-time
- official live feed
- fully covered
- complete Taiwan-market coverage
- approved real data
- approved real score
- source rights approved for all uses
- unrestricted redistribution
- production database ready
- database write approved
- guaranteed return
- target price
- buy now
- sell now
- hold recommendation
- personalized investment advice
- latest, unless the same sentence clearly says the data is mock/demo/local sample

Also avoid presenting implementation words as user-facing status: SQL, database writes, raw market data, ingestion, staging rows, preflight, runbook, gate packet, operator authorization, runtime promotion.

## Bounded Public-Copy Recommendations

If PM asks A2 to repair this surface, keep the slice bounded to copy-only changes in the existing labels module/component/checker.

Suggested reader-facing replacement shape:

1. Headline: `資料來源與覆蓋狀態`
2. Summary: `公開 Beta 目前使用模擬資料，讓使用者先理解指數狀態儀表站的閱讀方式。正式市場資料、來源權利、覆蓋品質與更新節奏仍在檢查。`
3. User meaning: `一般投資者可以把這一區當成資料可信度標籤：哪些只是展示可用、哪些還在檢查、哪些暫時不能當作完整市場覆蓋。`
4. Layer labels: `大盤基準`, `核心 ETF`, `上市個股批次`
5. State chips: `展示可用`, `檢查中`, `暫停公開`
6. Stop line: `目前仍為 mock-only；畫面不是即時行情，不代表完整覆蓋，也不提供買賣或持有建議。`

Placement guidance:

- Put the plain-language summary before the technical flags.
- Keep exact mock flags visible in the technical detail area.
- Keep the non-advice sentence near any score, alert, market-pressure, or next-step copy.
- Keep internal process terms below public explanation, or remove them from public-facing cards.
- Update checker expected strings only after PM approves the final phrase set.

## A2 Decision

A2 accepts the source / coverage runtime labels after PM's bounded copy repair. The shared source/coverage label surface with explicit mock flags is the right BRIEF-aligned pattern. Next A2 work should stay bounded to public-language regression checks, small wording repairs, and mobile readability notes; it must not approve real-data promotion.
