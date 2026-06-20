# Phase 2B SEO Handoff Status

Owner: A3 Phase 2B SEO support lane

Governance: CEO-led, PM-integrated, karpathy-guidelines

Last updated: 2026-06-21

Status: `phase_2b_seo_handoff_status_current`

## Current Slice

Slice: `phase_2b_gsc_post_submit_observation_t1`

Status: Completed

CEO recommendation:

```text
gsc_t1_sitemap_success_page_indexing_processing
```

Current domain structure decision:

```text
parentBrandUrl=https://opensignallab.com/
marketSignalProductUrl=https://market-signal.opensignallab.com/
```

## Completed Slices

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
| SEO Rollup for PM Integration P1 | completed | yes |
| GSC Platform Execution Packet P1 | prepared | yes |
| Domain Usage Decision Record P1 | completed | yes |
| Parent Brand / Product Path Decision P1 | completed | yes |
| Custom Domain Product Subdomain Execution Preflight P1 | prepared | yes |
| Custom Domain Runtime Readiness Inventory P1 | completed | yes |
| Runtime Migration Patch Plan P1 | planned | yes |
| Runtime Migration Minimal Patch P1 | implemented | yes |
| Runtime Migration URL Contract Checker P1 | implemented | yes |
| Product Subdomain Strategy Decision P1 | completed | yes |
| Runtime Canonical OG Public HTML Patch P1 | implemented; redeploy observation required | yes |
| Route-level Public Head Metadata Patch P1 | completed | yes |
| Runtime Canonical OG Public HTML Observation P1 | completed; ready for PM/CEO GSC submission decision | yes |
| GSC HTML Verification File P1 | completed; PM/CEO manual verification completed | yes |
| GSC Sitemap Submission Record P1 | completed | yes |
| GSC Post-submit Observation T1 P1 | completed; sitemap success; page indexing processing | yes |

## Current Deliverables

- `docs/PHASE_2B_SEO_FOUNDATION_PLAN.md`
- `docs/PHASE_2B_SEO_ROUTE_INVENTORY.md`
- `docs/PHASE_2B_GSC_READINESS_CHECKLIST.md`
- `docs/PHASE_2B_GSC_POST_SUBMIT_OBSERVATION_CHECKLIST.md`
- `docs/PHASE_2B_STOCK_FIRST_BATCH_CANDIDATE_RULE.md`
- `docs/PHASE_2B_CUSTOM_DOMAIN_PREFLIGHT_CHECKLIST.md`
- `docs/PHASE_2B_GSC_RESULT_INTAKE_TEMPLATE.md`
- `docs/PHASE_2B_SEO_WARNING_CLOSEOUT_CHECKLIST.md`
- `docs/PHASE_2B_SEO_ROLLUP_FOR_PM_INTEGRATION.md`
- `docs/PHASE_2B_GSC_PLATFORM_EXECUTION_PACKET.md`
- `docs/PHASE_2B_DOMAIN_USAGE_DECISION_RECORD.md`
- `docs/PHASE_2B_CUSTOM_DOMAIN_PRODUCT_SUBPATH_EXECUTION_PREFLIGHT.md`
- `docs/PHASE_2B_CUSTOM_DOMAIN_RUNTIME_READINESS_INVENTORY.md`
- `docs/PHASE_2B_RUNTIME_MIGRATION_PATCH_PLAN.md`
- `docs/PHASE_2B_RUNTIME_MIGRATION_MINIMAL_PATCH.md`
- `docs/PHASE_2B_RUNTIME_MIGRATION_URL_CONTRACT_CHECKER.md`
- `docs/PHASE_2B_PRODUCT_SUBDOMAIN_STRATEGY_DECISION.md`
- `docs/PHASE_2B_RUNTIME_CANONICAL_OG_PUBLIC_HTML_PATCH.md`
- `docs/PHASE_2B_SEO_HANDOFF_STATUS.md`
- `src/lib/seo.ts`
- `src/components/seo-json-ld.tsx`
- `scripts/check-phase-2b-seo-foundation.mjs`
- `scripts/report-phase-2b-seo-index-gate.mjs`
- `scripts/check-phase-2b-gsc-platform-execution-packet.mjs`
- `scripts/check-phase-2b-domain-usage-decision-record.mjs`
- `scripts/check-phase-2b-custom-domain-product-subpath-execution-preflight.mjs`
- `scripts/check-phase-2b-custom-domain-runtime-readiness-inventory.mjs`
- `scripts/check-phase-2b-runtime-migration-patch-plan.mjs`
- `scripts/check-phase-2b-runtime-migration-minimal-patch.mjs`
- `scripts/check-phase-2b-runtime-migration-url-contract.mjs`
- `scripts/check-phase-2b-product-subdomain-strategy-decision.mjs`
- `scripts/check-phase-2b-runtime-canonical-og-public-html-patch.mjs`
- `scripts/check-phase-2b-gsc-post-submit-observation-checklist.mjs`
- `scripts/check-phase-2b-stock-first-batch-candidate-rule.mjs`
- `scripts/check-phase-2b-custom-domain-preflight-checklist.mjs`
- `scripts/check-phase-2b-gsc-result-intake-template.mjs`
- `scripts/check-phase-2b-seo-warning-closeout-checklist.mjs`
- `scripts/check-phase-2b-seo-rollup-for-pm-integration.mjs`
- `scripts/check-phase-2b-seo-handoff-status.mjs`

## Current SEO Gate Status

| item | status |
|---|---|
| Core route metadata | implemented |
| Canonical baseline | implemented |
| WebSite JSON-LD | implemented |
| WebPage/Breadcrumb JSON-LD | implemented for core routes |
| Robots / sitemap guard | implemented |
| Stock sitemap cap | guarded by CEO policy at 100 |
| SEO index gate report | implemented as local report |
| Eligible stock routes under local mock gate | `0` |
| GSC readiness checklist | prepared |
| GSC post-submit observation checklist | T1 observed; sitemap success; discoveredUrls=15; page indexing processing |
| GSC result intake template | prepared |
| Custom domain preflight checklist | prepared |
| SEO warning closeout checklist | prepared |
| SEO rollup for PM integration | prepared |
| GSC platform execution packet | prepared |
| Domain usage decision | `opensignallab.com` selected as parent brand domain |
| Market Signal product URL decision | `https://market-signal.opensignallab.com/` selected as future product entry |
| Custom domain product subdomain execution preflight | prepared |
| Custom domain runtime readiness inventory | completed; direct `/market-signal/` migration is not runtime-ready yet |
| Runtime migration patch plan | planned; recommends Next.js `basePath disabled for subdomain production` plus explicit URL helper contract |
| Runtime migration minimal patch | implemented; supports `NEXT_PUBLIC_SITE_BASE_PATH` but does not switch platform |
| Runtime migration URL contract checker | implemented; validates Vercel root mode and product-subdomain root mode |
| Product subdomain strategy decision | completed; `/market-signal/` product-subpath strategy is superseded |
| Runtime canonical / OG public HTML patch | observed pass |
| Route-level public head metadata patch | completed for core public routes |
| Public canonical / OG observation | passed on core public routes; no old Vercel URL or product-subpath canonical detected |
| Custom domain execution | not executed |
| GSC property / sitemap submission | submitted by PM/CEO; sitemap success; discoveredUrls=15; page indexing processing; submissionDate=2026-06-21 |

## Checks Run

```text
cmd /c npm run check:phase-2b-seo-foundation
cmd /c npm run report:phase-2b-seo-index-gate
cmd /c npm run check:phase-2b-gsc-platform-execution-packet
cmd /c npm run check:phase-2b-domain-usage-decision-record
cmd /c npm run check:phase-2b-custom-domain-product-subpath-execution-preflight
cmd /c npm run check:phase-2b-custom-domain-runtime-readiness-inventory
cmd /c npm run check:phase-2b-runtime-migration-patch-plan
cmd /c npm run check:phase-2b-runtime-migration-minimal-patch
cmd /c npm run check:phase-2b-runtime-migration-url-contract
cmd /c npm run check:phase-2b-product-subdomain-strategy-decision
cmd /c npm run check:phase-2b-runtime-canonical-og-public-html-patch
cmd /c npm run check:phase-2b-gsc-post-submit-observation-checklist
cmd /c npm run check:phase-2b-stock-first-batch-candidate-rule
cmd /c npm run check:phase-2b-custom-domain-preflight-checklist
cmd /c npm run check:phase-2b-gsc-result-intake-template
cmd /c npm run check:phase-2b-seo-warning-closeout-checklist
cmd /c npm run check:phase-2b-seo-rollup-for-pm-integration
cmd /c npm run check:phase-2b-seo-handoff-status
cmd /c npm run build
```

Latest expected result:

```text
status=ok
FAIL=0
eligible stock routes now: 0
stock universe: 1086
```

Known warnings:

- `NEXT_PUBLIC_SITE_URL` may be unset in local development; production should use `https://market-signal-two.vercel.app` until the `opensignallab.com` / `https://market-signal.opensignallab.com/` migration is separately approved.
- `opensignallab.com` is selected for parent-brand strategy, and `https://market-signal.opensignallab.com/` is selected for this project, but DNS, Vercel, GSC, sitemap, and canonical migration remain deferred until PM/CEO approves execution timing.
- Product subdomain strategy supersedes the `/market-signal/` product-subpath strategy for production canonical planning.
- Production env should use `NEXT_PUBLIC_SITE_URL=https://market-signal.opensignallab.com` and keep `NEXT_PUBLIC_SITE_BASE_PATH` unset or empty after PM/CEO platform approval.
- The product subdomain preflight is prepared, but does not approve Vercel production env changes, GSC, sitemap submission, redirect policy, or canonical migration by A3.
- Runtime migration patch plan is prepared but not executed; it recommends coordinating Next.js `basePath`, `src/lib/site.ts` URL composition, sitemap, robots, canonical, OG, Twitter, and JSON-LD in one future patch.
- Runtime migration minimal patch is implemented, but production platform migration remains blocked; default base path is empty unless `NEXT_PUBLIC_SITE_BASE_PATH` is explicitly set.
- Runtime migration URL contract checker now guards root mode and product-subdomain mode; `https://opensignallab.com/briefing` is treated as a bad Market Signal product URL.
- Runtime canonical / OG patch implemented after production observation found robots/sitemap correct but public HTML missing canonical and `og:url`; route-level metadata is now wired to `buildRouteMetadata(...)` for core public routes; PM/CEO redeploy observation is required before GSC submission.
- Stock universe exceeds the first-batch sitemap cap, so stock indexing remains intentionally gated.
- Warning closeout criteria are documented in `docs/PHASE_2B_SEO_WARNING_CLOSEOUT_CHECKLIST.md`; A3 should not close these by changing PM platform settings or opening stock indexing.

## Runtime / Public UI / Supabase / SQL / Data Fetch Impact

| area | impact |
|---|---|
| runtime metadata | yes, SEO metadata and JSON-LD only |
| public UI layout | none |
| Supabase schema / write | none |
| SQL execution | none |
| market data fetch | none |
| raw payload storage | none |
| stock index gate | unchanged |
| sitemap stock cap | unchanged |

Current execution boundary:

```text
noDnsChange=true
noVercelSettingsChange=true
noGscOperation=true
gscSubmittedByPmCeo=true
runtimePatchImplemented=true
routeLevelMetadataPatchImplemented=true
noPlatformMigration=true
noCanonicalHostMigration=true
noProductSubpathMigration=true
noSql=true
noSupabaseWrite=true
noMarketDataFetch=true
noStockIndexGateOpenWithoutPmApproval=true
```

## Next Step Recommendation

Recommended next A3 slice:

```text
phase_2b_gsc_post_submit_observation_t2_t3
```

Recommended scope:

- A3 treats `opensignallab.com` as the selected parent-brand domain.
- A3 treats `https://market-signal.opensignallab.com/` as the selected future Market Signal product URL.
- PM/CEO separately decides when to switch canonical host, update production `NEXT_PUBLIC_SITE_URL`, clear production `NEXT_PUBLIC_SITE_BASE_PATH`, create GSC property, and submit the custom-domain sitemap.
- A3 should next observe the redeployed public HTML and confirm canonical / `og:url` before GSC submission.
- A3 should not change DNS, Vercel settings, GSC, production env values, redirect policy, or stock indexing gates.
- A3 waits for PM/CEO custom-domain execution timing, GSC result intake, or next SEO slice before changing SEO runtime again.
- Keep DNS, Vercel settings, GSC execution, and stock first-batch opening as PM/CEO platform decisions.

## PM Mainline Integration Needed

Requires PM integration: Yes.

Reason:

- SEO touches public route discoverability, canonical host policy, sitemap policy, and external platform timing.
- A3 can prepare checks and templates, but PM/CEO must decide domain/GSC execution timing.



## Latest Coherent Slice: phase_2b_route_level_public_head_metadata_patch

1. Completed what:

- Wired core public routes to `buildRouteMetadata(...)` so canonical and `og:url` can be emitted from route-level metadata.
- Covered `/`, `/briefing`, `/weekly`, `/methodology`, `/disclaimer`, `/privacy`, and `/terms`.
- Kept stock route indexing gated and did not change sitemap stock cap.

2. Modified files:

- `src/app/page.tsx`
- `src/app/briefing/page.tsx`
- `src/app/weekly/page.tsx`
- `src/app/methodology/page.tsx`
- `src/app/disclaimer/page.tsx`
- `src/app/privacy/page.tsx`
- `src/app/terms/page.tsx`
- `docs/PHASE_2B_RUNTIME_CANONICAL_OG_PUBLIC_HTML_PATCH.md`
- `docs/PHASE_2B_SEO_HANDOFF_STATUS.md`
- `scripts/check-phase-2b-runtime-canonical-og-public-html-patch.mjs`
- `scripts/check-phase-2b-seo-handoff-status.mjs`

3. Checks run:

- `cmd /c npm run check:phase-2b-runtime-canonical-og-public-html-patch`
- `cmd /c npm run check:phase-2b-seo-handoff-status`

4. Runtime / public UI / Supabase / SQL / data fetch impact:

- Runtime metadata impact: yes, route-level SEO metadata only.
- Public UI layout impact: none.
- Supabase impact: none.
- SQL impact: none.
- Market data fetch impact: none.
- Stock indexing impact: unchanged; full stock routes indexing remains closed.

5. Next recommendation:

- PM/CEO merge and redeploy production.
- A3 then observes public HTML for canonical and `og:url` before any GSC sitemap submission.

6. PM mainline integration:

- PM integration required: yes.
- Reason: this affects public canonical/OG readiness and GSC submission timing, but A3 does not execute GSC/DNS/Vercel platform operations.


## Latest Coherent Slice: phase_2b_gsc_post_submit_observation_t1

1. Completed what:

- Observed production public routes after redeploy.
- Confirmed core routes expose canonical and `og:url` on `https://market-signal.opensignallab.com`.
- Confirmed `/market-signal` returns 404, matching product-subdomain strategy.
- Confirmed no old Vercel canonical URL and no `/market-signal` subpath canonical were found in observed HTML.

2. Modified files:

- `docs/PHASE_2B_RUNTIME_CANONICAL_OG_PUBLIC_HTML_PATCH.md`
- `docs/PHASE_2B_SEO_HANDOFF_STATUS.md`
- `scripts/check-phase-2b-runtime-canonical-og-public-html-patch.mjs`
- `scripts/check-phase-2b-seo-handoff-status.mjs`

3. Checks run:

- `curl.exe -I https://market-signal.opensignallab.com/`
- `curl.exe -I https://market-signal.opensignallab.com/briefing`
- `curl.exe -I https://market-signal.opensignallab.com/robots.txt`
- `curl.exe -I https://market-signal.opensignallab.com/sitemap.xml`
- `curl.exe -I https://market-signal.opensignallab.com/market-signal`
- Public HTML metadata observation for `/`, `/briefing`, `/weekly`, `/methodology`, `/disclaimer`, `/privacy`, and `/terms`.
- `cmd /c npm run check:phase-2b-runtime-canonical-og-public-html-patch`
- `cmd /c npm run check:phase-2b-seo-handoff-status`

4. Runtime / public UI / Supabase / SQL / data fetch impact:

- Runtime metadata impact: observation only in this slice.
- Public UI layout impact: none.
- Supabase impact: none.
- SQL impact: none.
- Market data fetch impact: none.
- Stock indexing impact: unchanged; full stock routes indexing remains closed.

5. Next recommendation:

- PM/CEO can proceed with manual GSC property verification and sitemap submission for `https://market-signal.opensignallab.com/sitemap.xml`.
- A3 should wait for PM/CEO to complete GSC platform steps, then record GSC result intake.

6. PM mainline integration:

- PM integration required: yes.
- Reason: GSC submission is a platform/SEO launch milestone and must be recorded by PM/CEO.


Next platform slice: `phase_2b_gsc_manual_submission`


## Latest Coherent Slice: phase_2b_gsc_html_verification_file_prepared

1. Completed what:

- Added Google Search Console HTML verification file for the URL-prefix property verification flow.
- Prepared expected public URL: `https://market-signal.opensignallab.com/google7e70e6b598ce7064.html`.
- A3 did not click GSC verification and did not perform DNS, Vercel settings, or GSC platform operations.

2. Modified files:

- `public/google7e70e6b598ce7064.html`
- `docs/PHASE_2B_SEO_HANDOFF_STATUS.md`

3. Checks run:

- Not run yet in production; requires PM/CEO merge and Vercel redeploy first.

4. Runtime / public UI / Supabase / SQL / data fetch impact:

- Runtime static asset impact: yes, one public Google verification HTML file.
- Public UI layout impact: none.
- Supabase impact: none.
- SQL impact: none.
- Market data fetch impact: none.
- Stock indexing impact: unchanged; full stock routes indexing remains closed.

5. Next recommendation:

- PM/CEO merge and redeploy production.
- A3 can then confirm the verification file returns 200.
- PM/CEO then clicks Verify in Google Search Console and submits `https://market-signal.opensignallab.com/sitemap.xml`.

6. PM mainline integration:

- PM integration required: yes.
- Reason: GSC ownership verification is an external platform operation and should be recorded by PM/CEO.


A3 did not perform GSC platform operations.



T1 note: indexed/not-indexed counts remain pending until GSC Pages report finishes processing.
