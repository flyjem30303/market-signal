# A1 Official Open Source Coverage No-Fetch Handoff

Updated: 2026-06-12

Status: `a1_official_open_source_coverage_no_fetch_handoff_ready_local_only`

Owner: A1 Data / Source Coverage

Scope: `official_open_free_source_coverage_path_without_market_row_fetch`

## 1. PM Summary

This handoff keeps data realification moving at the source-coverage and rights-review layer only. It does not fetch, store, commit, print, or transform market rows.

Recommended PM posture:

1. Treat official open/free source lanes as candidate coverage paths, not accepted ingestion sources.
2. Let mock consumers prepare against metadata-only source labels, field names, and coverage categories.
3. Keep runtime posture unchanged: `publicDataSource=mock` and `scoreSource=mock`.
4. Ask PM/CEO to confirm rights before any future packet proposes row retrieval, persistence, or `daily_prices` mutation.

Decision PM can integrate now:

`accept_a1_official_open_source_coverage_no_fetch_handoff`

Meaning: PM accepts this as the local-only path map and may ask A1 for the next no-fetch evidence matrix. It does not authorize market-row access, SQL, Supabase connection, staging rows, or production data mutation.

## 2. Hard Boundary

- No-fetch: do not retrieve market rows from any source.
- No-SQL: do not run SQL.
- No-write: do not write Supabase.
- Do not connect to Supabase.
- Do not create staging rows.
- Do not modify `daily_prices`.
- Do not store or commit market rows.
- Do not print secrets, env values, row bodies, source response bodies, or stock-id row lists.
- Keep `publicDataSource=mock`.
- Keep `scoreSource=mock`.
- Do not claim any source-rights route is accepted until PM/CEO records that decision.

## 3. Official Open/Free Candidate Lanes

| Candidate lane | Coverage purpose | Free/open automation candidate | Current handoff posture | Mock-consumer use allowed now |
| --- | --- | --- | --- | --- |
| `TWSE OpenAPI / official public route` | Listed-stock daily close and daily trading summary fields; possible index-adjacent metadata depending on accepted endpoint contract | Candidate yes, pending terms and endpoint contract evidence | Not accepted for ingestion. Needs terms location, automation allowance, redistribution/display boundary, attribution, rate/fair-use, and field contract review | Yes, metadata-only lane label and synthetic fixture fields |
| `TWSE official public download/page route` | Fallback for listed-stock or exchange summary coverage when OpenAPI contract is incomplete | Candidate unclear until automation and reuse terms are accepted | Not accepted. UI/download oriented routes need separate unattended-automation and redistribution confirmation | Yes, route category only |
| `TWSE official index/statistics route` | TWII and exchange-level index coverage where official route exists | Candidate yes if terms and field contract are accepted | Not accepted. Keep TWII as first index coverage repair lane, but do not retrieve rows in this handoff | Yes, synthetic TWII consumer contract |
| `TPEX official public route` | OTC securities and OTC market summary coverage | Candidate yes, pending TPEX-specific evidence | Not accepted. Must stay separate from TWSE listed-stock source rights | Yes, metadata-only OTC lane label |
| `Financial Supervisory Commission / official open-data metadata` | Regulator-level issuer, market, or classification metadata that may support universe definitions | Candidate yes for metadata, pending dataset-specific terms | Not a price-row source. Useful for coverage universe cross-checks only after terms review | Yes, universe metadata shape only |
| `Issuer/ETF official public information pages` | ETF source-rights fallback for 0050, 006208, and future ETF coverage | Candidate unclear; often display-oriented and provider-specific | Not accepted. Needs ETF-specific source owner, redistribution, and market-price field contract review | Yes, ETF lane label and synthetic fixture shape |

## 4. Coverage Gaps PM Should Track

| Gap | Why it matters | Current safe evidence level | Next no-fetch move |
| --- | --- | --- | --- |
| `TWII` daily index coverage | Highest MVP signal impact and smallest explainable first repair lane | Aggregate-only prior planning says the lane is incomplete; no row values are carried here | Prepare official index/source terms and field-contract evidence matrix |
| `0050` and `006208` ETF daily market-price coverage | Public beta users expect core ETF context next to index signal | ETF lanes remain source-rights blocked | Prepare ETF source-owner and field-contract comparison without retrieving values |
| Listed-stock Batch 1 | Product needs a credible initial equity universe before broad launch claims | Selection rules can be discussed without stock row bodies | Define batch selection policy and official lane mapping only |
| Full listed-stock universe | Needed before any broad "Taiwan market coverage" claim | Not ready; universe definition and source rights are separate blockers | Create universe partition plan based on metadata only |
| OTC universe | Important for complete Taiwan market posture but lower immediate MVP priority | No accepted TPEX route in this handoff | Keep after TWSE listed-stock and ETF rights review |

## 5. Items Mock Consumers Can Prepare Now

These can be wired locally without real data:

- Source lane enum values: `twse_openapi_official_candidate`, `twse_public_download_candidate`, `twse_index_official_candidate`, `tpex_official_candidate`, `fsc_open_data_metadata_candidate`, `etf_issuer_public_candidate`.
- Field-contract placeholders: `trade_date`, `close`, `volume`, `turnover`, `source_lane`, `source_terms_status`, `field_contract_status`, `coverage_scope`.
- Status values: `candidate`, `terms_review_required`, `field_contract_required`, `pm_rights_confirmation_required`, `blocked_for_runtime`.
- UI/report copy that says official-source review is pending and runtime remains mock.
- Synthetic fixtures that contain no real market row values.

Mock consumers must not infer source acceptance from these labels.

## 6. PM/CEO Rights Confirmations Needed

PM/CEO should confirm these before A1 proposes any future row operation:

| Confirmation | Required answer | Owner |
| --- | --- | --- |
| Official terms location | Which official terms page, dataset notice, or contract label governs each source lane? | PM / Legal / CEO |
| Automated access | Is scheduled automated retrieval allowed for the intended internal product operation? | PM / Legal / CEO |
| Public display and redistribution | Can derived values, charts, or delayed values be shown publicly, and under what limits? | PM / Legal / CEO |
| Attribution wording | What exact source attribution must appear in UI, reports, and handoffs? | PM / Legal |
| Rate and fair-use boundary | What request cadence or use limit is acceptable? | PM / Engineering |
| Retention and audit | May normalized rows be retained later, and what evidence must be kept? | PM / Legal / A1 |
| Field contract | Which fields map to runtime concepts, and how are holidays, revisions, and missing sessions handled? | A1 / PM |

Until those answers are accepted, the only approved source work is metadata-level planning and sanitized aggregate-only documentation.

## 7. Next Data-Line Task

Recommended next task:

`prepare_official_open_free_source_terms_and_coverage_matrix_no_fetch`

Expected output:

- `docs/A1_OFFICIAL_OPEN_FREE_SOURCE_TERMS_AND_COVERAGE_MATRIX_NO_FETCH.md`
- optional checker `scripts/check-a1-official-open-free-source-terms-and-coverage-matrix-no-fetch.mjs`

Task requirements:

- Use official terms/docs links and metadata summaries only.
- Do not retrieve market rows.
- Do not run SQL.
- Do not connect to or write Supabase.
- Do not create staging rows.
- Do not modify `daily_prices`.
- Preserve `publicDataSource=mock` and `scoreSource=mock`.
- Record each lane as `candidate`, `blocked`, `needs_pm_ceo_rights_confirmation`, or `ready_for_mock_consumer_only`.

## 8. PM Integration Notes

PM can integrate this handoff as a source-coverage planning artifact. It is safe to attach to the mock consumer track because it contains no row data and keeps runtime source/scoring mocked.

The highest-value sequence is:

1. Accept this no-fetch route map.
2. Request the official open/free source terms and coverage matrix.
3. Decide whether TWII official index coverage can proceed to a future bounded authorization packet.
4. Only after separate PM/CEO rights acceptance, consider a future one-attempt packet that remains bounded and reviewed before any runtime promotion.
