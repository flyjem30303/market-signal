# Phase 2B SEO Rollup for PM Integration

Owner: A3 Phase 2B SEO 基礎線  
Governance: CEO 主導推進，遵守 karpathy-guidelines  
Status: Rollup summary only, not a PM mainline file edit

## Purpose

這份 rollup 給 PM/CEO 主線整合參考，整理 A3 Phase 2B SEO 基礎線目前已完成的 coherent slices、剩餘 gate、平台整合需求與不可跨越邊界。  
本文件不修改 `docs/PHASE_2_MAINLINE_INTEGRATION_STATUS.md`，不操作 GSC，不修改 DNS，不修改 Vercel，不改資料來源，不改 Supabase，不執行 SQL，不抓取市場資料。

## Completed A3 SEO Slices

| slice | status | PM integration |
|---|---|---|
| SEO Foundation P0 | completed | yes |
| Structured Data Baseline P1 | completed | no |
| WebPage/Breadcrumb Structured Data Baseline P1 | completed | no |
| GSC Readiness Checklist P1 | completed | yes |
| SEO Index Gate Report P1 | completed | yes |
| GSC Post-submit Observation Checklist P1 | completed | yes |
| Stock First-batch Candidate Rule P1 | completed | yes |
| Custom Domain Preflight Checklist P1 | completed | yes |
| GSC Result Intake Template P1 | completed | yes |
| SEO Warning Closeout Checklist P1 | completed | yes |

## Current Technical State

- Core route metadata: implemented.
- Canonical baseline: implemented.
- Open Graph / Twitter baseline: implemented.
- WebSite JSON-LD: implemented.
- WebPage / Breadcrumb JSON-LD: implemented for core public routes.
- Robots guard: implemented.
- Sitemap guard: implemented.
- Stock sitemap cap: guarded by CEO policy at `100`.
- Eligible stock routes under local mock gate: `0`.
- GSC readiness checklist: prepared.
- GSC post-submit observation checklist: prepared.
- GSC result intake template: prepared.
- Custom domain preflight checklist: prepared.
- Warning closeout checklist: prepared.

## Current Known WARNs

`cmd /c npm run check:phase-2b-seo-foundation` is expected to pass with WARNs until PM/CEO platform gates are addressed:

- `layout.siteUrl`
  - `metadataBase` fallback still includes localhost.
- `env.NEXT_PUBLIC_SITE_URL`
  - local/deployment env still needs public host configuration before GSC.
- `stocks.volume`
  - stock universe is about `1086`, above first-batch sitemap cap `100`; this is intentional until mainline approval.

Closeout criteria are documented in:

- `docs/PHASE_2B_SEO_WARNING_CLOSEOUT_CHECKLIST.md`

## PM/CEO Integration Needs

- Decide and set deployment `NEXT_PUBLIC_SITE_URL`.
  - Temporary phase recommended value: `https://market-signal-two.vercel.app`
- Decide when to create GSC property.
- Decide when to submit sitemap.
- Decide custom domain timing.
- Confirm whether/when source / score / data-quality gates are ready for stock first-batch evaluation.
- Do not treat `eligible stock routes now: 0` as a bug while runtime remains mock/fail-closed.

## A3 Handoff Files

- `docs/PHASE_2B_SEO_HANDOFF_STATUS.md`
- `docs/PHASE_2B_SEO_FOUNDATION_PLAN.md`
- `docs/PHASE_2B_SEO_ROUTE_INVENTORY.md`
- `docs/PHASE_2B_GSC_READINESS_CHECKLIST.md`
- `docs/PHASE_2B_GSC_POST_SUBMIT_OBSERVATION_CHECKLIST.md`
- `docs/PHASE_2B_GSC_RESULT_INTAKE_TEMPLATE.md`
- `docs/PHASE_2B_STOCK_FIRST_BATCH_CANDIDATE_RULE.md`
- `docs/PHASE_2B_CUSTOM_DOMAIN_PREFLIGHT_CHECKLIST.md`
- `docs/PHASE_2B_SEO_WARNING_CLOSEOUT_CHECKLIST.md`
- `docs/PHASE_2B_SEO_ROLLUP_FOR_PM_INTEGRATION.md`

## Recommended PM Mainline Summary

PM may integrate the following summary manually:

```text
A3 Phase 2B SEO foundation is technically ready at P0/P1 baseline. Core metadata, canonical, OG/Twitter, sitemap/robots guard, WebSite/WebPage/Breadcrumb structured data, stock noindex gate, sitemap stock cap, GSC readiness, GSC observation, result intake, custom domain preflight, and warning closeout criteria are prepared. Current stock eligible routes remain 0 under local mock/fail-closed gate by design. PM/CEO still need to set NEXT_PUBLIC_SITE_URL, decide GSC property/sitemap submission timing, and keep custom domain plus stock first-batch opening as mainline decisions.
```

## A3 Boundary

- A3 must not modify `docs/PHASE_2_MAINLINE_INTEGRATION_STATUS.md` unless CEO explicitly asks.
- A3 must not change DNS.
- A3 must not change Vercel project settings.
- A3 must not submit GSC sitemap.
- A3 must not change Supabase.
- No SQL.
- A3 must not fetch or ingest market data.
- A3 must not open `/stocks/*` indexing without CEO/PM mainline approval.

## Requires PM Integration

Requires PM integration: Yes

Reason:
- This rollup exists for PM/CEO mainline synthesis.
- A3 provides the summary and technical gates, but does not directly edit the PM mainline integration file.

