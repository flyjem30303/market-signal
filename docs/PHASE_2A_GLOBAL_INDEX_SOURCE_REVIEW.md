# Phase 2A Global Index Source Review

Status: `phase_2a_global_index_source_review_ready_report_only`

Date: 2026-06-20

Owner: A2 Phase 2A global index data lane

## Boundary

This review is source-rights planning only.

- No Supabase read or write.
- No SQL execution.
- No market data fetch.
- No raw market payload stored, printed, transformed, or committed.
- No publicDataSource or scoreSource promotion.
- No UI change.

## Review Standard

Source classification:

| status | meaning |
|---|---|
| accepted | Terms clearly allow automated retrieval, storage, attribution, and public display for the intended product use. |
| conditional | Source may be usable only after a narrowed usage pattern, source owner permission, API-key policy, attribution policy, or no-storage display policy is approved. |
| rejected | Source terms do not permit the intended automated/public/storage use, or terms are too unclear for responsible use. |
| unresolved | PM/CEO/legal decision is needed before engineering can proceed. |

Minimum legal questions for every source:

| question | required answer before execution |
|---|---|
| Automation | Is automated API retrieval allowed? |
| Storage | Can we store daily close/change data in our DB? |
| Public display | Can we display values publicly outside the source website? |
| Redistribution | Are we redistributing exchange/index data by showing it? |
| Attribution | What exact attribution and source URL are required? |
| Commercial use | Is free use limited to personal/non-commercial/internal use? |
| Rate limit | What schedule and request cap are allowed? |

Source review field contract:

Every candidate must map to `source`, `sourceUrl`, `updateFrequency`, and `legalUsageStatus` before any bounded fetch/write packet can be proposed.

## Candidate Review

| index | proposed symbol | candidate source | source URL | field fit | legal status | decision |
|---|---:|---|---|---|---|---|
| S&P 500 | SP500 | FRED API / FRED series | https://fred.stlouisfed.org/series/SP500 | Daily close only. Change and changePercent can be derived from adjacent closes if storage/derivation is approved. | conditional | Good first US reference candidate, but not accepted for DB storage/public redistribution until FRED and S&P/Dow Jones rights are cleared. |
| NASDAQ Composite | NASDAQCOM | FRED API / FRED series | https://fred.stlouisfed.org/series/NASDAQCOM | Daily close only. Change and changePercent can be derived if approved. | conditional | Good first US reference candidate, same FRED third-party rights caveat. |
| Dow Jones Industrial Average | DJIA | FRED API / FRED series | https://fred.stlouisfed.org/series/DJIA | Daily close only. Change and changePercent can be derived if approved. | conditional | Good first US reference candidate, same FRED third-party rights caveat. |
| Nikkei 225 | NIKKEI225 | FRED API / FRED series, original source Nikkei | https://fred.stlouisfed.org/series/NIKKEI225 | Daily close only. Change and changePercent can be derived if approved. | conditional | Good Japan reference candidate only after Nikkei/FRED rights review. |
| KOSPI | KOSPI | KRX information/data services or KRX Open API route | https://data.krx.co.kr/contents/MDC/MAIN/main/index.cmd?locale=en | Likely can cover index value and date through official KRX data services, but automation/storage/public display terms need Korean-language terms review and API-key approval. | unresolved | Do not implement until PM/legal confirms KRX API license, redistribution, storage, and attribution terms. |
| Hang Seng Index | HSI | HKEX / Hang Seng Indexes data products | https://www.hkex.com.hk/Services/Market-Data-Services/Real-Time-Data-Services/Data-Licensing/HKEX-IS?sc_lang=en | Field coverage exists through licensed market data products, but not free/open for our intended public display. | rejected | Do not scrape HKEX or Hang Seng pages. Use only licensed vendor path or defer. |
| STOXX Europe 600 | SXXP | STOXX website / licensed STOXX data | https://www.stoxx.com/license-agreement-form | Field coverage likely exists only under license for historical values and index data. | rejected | Not a free automatable source for our intended usage. Use licensed route or defer. |
| DAX | DAX / GDAXI | STOXX / Deutsche Boerse market data | https://stoxx.com/legal/stoxx-conditions-of-use/ | Field coverage likely exists only under license for historical values and index data. | rejected | Prefer STOXX 600 or DAX only after paid/licensed data path. |
| SSE Composite | SSECOMP | Shanghai Stock Exchange / CIIS data services | https://english.sse.com.cn/markets/dataservice/products/ | Official public website shows market overview, but redistribution and automated use require vendor/license review. | unresolved | Do not scrape. CEO/PM must choose license/vendor or defer China index lane. |
| CSI 300 | CSI300 | China Securities Index / SSE data services | https://english.sse.com.cn/markets/dataservice/products/ | Field coverage likely exists through official/licensed data products. | unresolved | Treat as China lane requiring source-owner or licensed-vendor decision. |

## Source Findings

### FRED

Relevant pages:

- FRED API terms: https://fred.stlouisfed.org/docs/api/terms_of_use.html
- FRED legal notices: https://fred.stlouisfed.org/legal/
- FRED API overview: https://fred.stlouisfed.org/docs/api/fred/
- S&P 500 series: https://fred.stlouisfed.org/series/SP500

Finding:

FRED is automatable through an API, but FRED states that data series can be owned by third parties and subject to third-party copyright restrictions. FRED also requires proper attribution and does not grant permission for use beyond the data owner's requirements. For Phase 2A, FRED is therefore `conditional`, not `accepted`, for any source that will be stored in our DB and displayed publicly.

Recommended allowed planning use:

- Use FRED as a candidate source registry entry.
- Use FRED for source-rights evidence review.
- Do not execute ingestion, storage, or public-data promotion until PM/legal approves the exact series usage.

### KRX

Relevant page:

- KRX Data Marketplace: https://data.krx.co.kr/contents/MDC/MAIN/main/index.cmd?locale=en

Finding:

KRX has official data services, but Phase 2A still needs explicit confirmation for API account/key requirements, automated retrieval, storage, public display, and redistribution. KRX is `unresolved` until the Korean source terms are reviewed and accepted.

### HKEX / Hang Seng

Relevant pages:

- HKEX Terms of Use: https://www.hkex.com.hk/Global/Exchange/Terms-of-Use?sc_lang=en
- HKEX Data Licensing: https://www.hkex.com.hk/Services/Market-Data-Services/Real-Time-Data-Services/Data-Licensing/HKEX-IS?sc_lang=en

Finding:

HKEX provides market data through license programs and restricts unapproved website/information use. Hang Seng Index usage is proprietary/licensed. Free scraping or automated reuse is not acceptable for our intended product. HSI is `rejected` unless PM chooses a licensed vendor path.

### STOXX / DAX

Relevant pages:

- STOXX license agreement form: https://www.stoxx.com/license-agreement-form
- STOXX conditions of use: https://stoxx.com/legal/stoxx-conditions-of-use/

Finding:

STOXX states that historical index values and related index data can be restricted data requiring a valid license agreement. STOXX 600 and DAX should be treated as `rejected` for free automated ingestion/public display until a license is secured.

### SSE / CSI

Relevant pages:

- SSE English homepage market overview: https://english.sse.com.cn/
- SSE market data products: https://english.sse.com.cn/markets/dataservice/products/

Finding:

SSE has official market data products and indicates that qualified vendors are authorized to redistribute/use data. China indices should remain `unresolved` until PM/CEO selects either an official license route, a permitted vendor, or a deferral.

## Rejected Sources

| source | reason |
|---|---|
| Yahoo Finance website/download routes | Not official exchange/index-source open data for our product; terms and redistribution rights are not clear enough for automated ingestion/public display. |
| Investing.com pages | Not official open data; automated scraping and redistribution risk is high. |
| MarketWatch / WSJ / similar quote pages | Editorial/quote portals, not approved data sources for automated public product reuse. |
| Generic browser scraping of exchange pages | Violates the source-rights standard unless the source terms explicitly permit automated retrieval and redistribution. |
| Unofficial GitHub/CSV mirrors | Not source-owner authorized for public market data redistribution. |

## Source Status Summary

| status | indices |
|---|---|
| accepted | None for production DB storage/public display yet. |
| conditional | S&P 500, NASDAQ Composite, Dow Jones, Nikkei 225 through FRED candidate route. |
| rejected | Hang Seng, STOXX 600, DAX for free automated path; unofficial quote portals. |
| unresolved | KOSPI, SSE Composite, CSI 300. |

## CEO/PM Decisions Needed

1. Approve whether FRED conditional sources can be used only as reference display without DB storage, or require source-owner permission before any implementation.
2. Decide whether Phase 2A should buy/license an index data vendor for Hong Kong, Europe, and China.
3. Decide if the first engineering slice should be metadata-only and source-review-only while real market data remains blocked.
4. Confirm whether global index values may be displayed as delayed/reference information, or only as derived scores after source rights are approved.
