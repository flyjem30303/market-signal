# A1 Official Open Free Source Terms and Coverage Matrix No-Fetch

Updated: 2026-06-12

Status: `a1_official_open_free_source_terms_and_coverage_matrix_ready_local_only`

Owner: A1 Data / Source / Coverage

Scope: `legal_free_automatable_source_terms_and_coverage_matrix_no_fetch`

## 1. Local-Only Boundary

This artifact is a source-terms and coverage planning matrix only. It does not authorize runtime data promotion or any market-row operation.

- no-fetch: do not retrieve market rows from any source.
- no-SQL: do not run SQL.
- no-Supabase: do not connect to Supabase and do not write Supabase.
- no-raw-data: do not fetch, store, commit, print, or transform source row bodies, response bodies, stock-id row lists, or market samples.
- Do not create staging rows.
- Do not modify `daily_prices`.
- Keep `publicDataSource=mock`.
- Keep `scoreSource=mock`.
- Do not claim source rights are accepted until PM/CEO records a separate decision.

## 2. PM Summary

Recommended PM posture:

1. Treat TWSE OpenAPI and other official public lanes as candidates, not approved ingestion routes.
2. Use this matrix to decide which source lane deserves legal/terms confirmation first.
3. Keep mock consumers limited to lane labels, coverage categories, and synthetic fixtures.
4. Require a later bounded authorization packet before any real row retrieval, SQL, Supabase connection, staging work, or `daily_prices` change.

Next PM decision:

`accept_a1_official_open_free_source_terms_and_coverage_matrix_no_fetch_for_review`

Meaning: PM may absorb this as the current local-only source review matrix and choose the next lane for formal terms confirmation. This decision does not approve data access, persistence, redistribution, or runtime promotion.

## 3. Candidate Source Terms and Coverage Matrix

| Candidate source | Automation signal | Free signal | Terms / license items still to confirm | Daily close | Volume | Date | Symbol | ETF | Index | Stock | Cannot use or unconfirmed items | Next PM decision |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| TWSE OpenAPI / official public data candidate | Likely automatable if the official API endpoint and fair-use rules permit scheduled access; no endpoint call is made here | Candidate free/open because it is presented as official public/open data; exact reuse condition still pending | Terms page/version, API use rules, attribution, fair-use/rate limit, public display, redistribution, retention, revision handling | Candidate yes for listed-stock daily market routes when endpoint contract is accepted | Candidate yes where daily trading fields are included | Candidate yes | Candidate yes | Possible for listed ETFs if the endpoint covers ETF instruments and ETF terms are accepted | Possible for official index routes only if endpoint contract confirms index fields | Candidate yes for listed stocks | Not accepted for ingestion; no unattended automation, display, redistribution, row retention, or `daily_prices` mapping until PM/CEO accepts terms | Prioritize formal TWSE terms and endpoint contract review |
| TWSE official downloadable / public page route | Automation unclear; may be page/download oriented and unsuitable for unattended use without explicit confirmation | Candidate free for public viewing, but automated reuse is unconfirmed | Page terms, download rules, anti-automation limits, attribution, delayed-data rules, reuse/display limits | Candidate yes if daily close table is covered by terms | Candidate yes if table includes volume | Candidate yes | Candidate yes | Possible, source-specific | Possible, source-specific | Candidate yes, source-specific | Do not scrape, parse, or schedule downloads until automation and reuse terms are accepted | Keep as fallback after TWSE OpenAPI review |
| TWSE official index / statistics route | Candidate automatable only if official route and terms allow scheduled access | Candidate free/open pending official terms evidence | Index-specific terms, field definitions, calendar/timezone, revision policy, attribution, public chart/display rights | Candidate yes for index close if field contract is accepted | Usually not price-volume equivalent; confirm turnover/value semantics separately | Candidate yes | Index code or label candidate, not stock symbol | No, unless ETF-specific route exists | Candidate yes for TWII and other official indices | No | TWII cannot proceed to real row operation from this matrix alone; index volume semantics remain unconfirmed | Make TWII the first index-lane terms decision |
| TPEX official public data route | Candidate automatable if TPEX route and fair-use terms permit scheduled access | Candidate free/open pending TPEX terms evidence | TPEX-specific terms, public display, redistribution, attribution, rate limits, field contract, OTC universe definition | Candidate yes for OTC securities if accepted | Candidate yes where field exists | Candidate yes | Candidate yes | Possible for OTC ETFs only after ETF/TPEX terms review | Possible for OTC index/statistics if route exists | Candidate yes for OTC stocks | Do not assume TWSE terms cover TPEX; no OTC runtime claim yet | Defer until TWSE listed-stock and TWII decisions are clearer |
| Financial Supervisory Commission / official open-data metadata | Candidate automatable for metadata datasets if official open-data terms allow API/file access | Candidate free/open for selected metadata datasets, dataset-specific | Dataset license, attribution, update cadence, redistribution, whether metadata can define coverage universe | No | No | Candidate for metadata effective dates only | Candidate for issuer/security identifiers if dataset supports it | Possible universe metadata only | No market index row coverage | Possible universe metadata only | Not a market-price source; cannot fill daily close or volume gaps | Use only for universe cross-check decisions |
| ETF issuer / fund company official public pages | Automation unclear; many pages are display-oriented and provider-specific | Candidate public viewing, not confirmed free automated reuse | Provider terms, NAV/market-price distinction, attribution, public redistribution, historical retention, automation restrictions | Candidate only if market close source and terms are accepted | Candidate only if market trading volume appears and terms allow use | Candidate yes if historical table exists | ETF code candidate | Candidate yes, provider-specific | No | No, except ETF instrument metadata | Do not mix NAV with exchange market close; no provider-specific use until terms are accepted | Use as ETF fallback for 0050/006208 only after TWSE/TPEX review |
| Paid vendor / licensed data feed | Automatable if contract permits | Not free | Contract scope, cost, redistribution, attribution, retention, SLA, audit obligations | Likely yes under contract | Likely yes under contract | Likely yes | Likely yes | Likely yes | Likely yes | Likely yes | Outside current free-source mandate | Do not pursue in this local-only branch |

## 4. Coverage Interpretation

Coverage labels in the table mean planning coverage only:

- `Candidate yes`: the lane may cover this category after terms and field contracts are accepted.
- `Possible`: the lane might cover this category, but instrument scope or field semantics need source-specific confirmation.
- `No`: the lane should not be used for that category.
- No label in this document means data is accepted for ingestion.

Priority coverage order for PM absorption:

1. TWII index daily close: smallest first repair lane with high public beta value.
2. TWSE listed-stock daily close and volume: core future equity coverage lane.
3. 0050 and 006208 ETF market close and volume: ETF-specific terms need separate confirmation.
4. TPEX OTC securities: keep separate after listed-stock and index rights are clearer.
5. FSC/open-data metadata: support universe definitions, not price rows.

## 5. Terms Checklist For Each Candidate

Before any future packet can move beyond mock/source planning, PM/CEO should require:

| Terms area | Required confirmation |
| --- | --- |
| Official terms source | Exact governing terms, dataset notice, API notice, or license label |
| Automated access | Whether scheduled machine access is allowed for this product use |
| Free use | Whether the intended internal and public-display use has no fee or contract requirement |
| Public display | Whether delayed values, charts, summaries, or derived indicators may be shown publicly |
| Redistribution | Whether normalized values may be retained, republished, exported, or cached |
| Attribution | Exact source wording and placement required in UI, reports, and docs |
| Rate / fair use | Request cadence, daily limits, retry policy, and backoff expectations |
| Field contract | Field names, date timezone, close definition, volume unit, symbol format, corrections, holidays, missing sessions |
| Audit evidence | What no-secret proof PM wants preserved before any future execution request |

## 6. Mock-Only Preparation Allowed Now

Allowed:

- Add or reuse source lane enum labels for official candidates.
- Build synthetic fixtures with no real market values.
- Draft UI copy that says official-source terms review is pending.
- Draft PM questions for legal/free/automation confirmation.
- Build local checkers that inspect documents and scripts only.

Blocked:

- Any market row retrieval.
- Any SQL.
- Any Supabase read/write connection.
- Any staging-row creation.
- Any `daily_prices` mutation.
- Any raw market data storage, commit, or logging.
- Any runtime switch away from `publicDataSource=mock` or `scoreSource=mock`.

## 7. Next PM Decision

Recommended PM decision:

`select_first_terms_review_lane_twse_openapi_or_twii_index`

PM should choose one of these next routes:

| Option | What A1 can do next | What remains blocked |
| --- | --- | --- |
| `twse_openapi_terms_first` | Prepare a no-fetch terms evidence packet for TWSE OpenAPI and listed-stock endpoint contract | Row retrieval, runtime promotion, Supabase connection, and `daily_prices` work |
| `twii_index_terms_first` | Prepare a no-fetch terms and field-contract packet for TWII official index coverage | Real TWII values, persistence, and public real-score claims |
| `etf_terms_first` | Prepare ETF-specific source-owner questions for 0050 and 006208 | Treating ETF market close as accepted from generic TWSE terms |
| `defer_free_source_path` | Keep runtime mock-only and document that free official route is not yet approved | Any public real-data coverage claim |

Recommended A1 next task after PM selection:

`prepare_selected_official_source_terms_evidence_packet_no_fetch`
