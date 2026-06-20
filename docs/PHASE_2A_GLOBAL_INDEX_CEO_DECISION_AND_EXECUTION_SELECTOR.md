# Phase 2A Global Index CEO Decision and Execution Selector

Status: `phase_2a_global_index_ceo_decision_ready_report_only`

Date: 2026-06-20

Owner: CEO / PM mainline, prepared by A2 Phase 2A global index data lane

## CEO Decision

CEO decision: `proceed_with_phase_2a_global_index_source_registry_first`

Phase 2A will move forward under CEO leadership, but the first executable lane is not live market data ingestion. The approved first lane is source registry, source-rights evidence, and bounded packet design.

This keeps Phase 2A moving while preserving the product's current runtime boundary:

- `publicDataSource=mock`
- `scoreSource=mock`
- no Supabase write
- no SQL execution
- no raw market data fetch
- no UI change

## Decision Rationale

The CEO goal for Phase 2 is to run `2A global indices` and `2B SEO foundation` in parallel. For 2A, the biggest blocker is not schema syntax or fetch code. The real blocker is source rights.

Current source review shows:

| status | indices |
|---|---|
| conditional | S&P 500, NASDAQ Composite, Dow Jones, Nikkei 225 through FRED candidate route |
| rejected for free path | Hang Seng, STOXX 600, DAX |
| unresolved | KOSPI, SSE Composite, CSI 300 |
| accepted for production ingestion | none |

Therefore, CEO approves forward motion on governance and engineering preparation, while keeping data execution blocked until a source becomes legally accepted.

## Approved Phase 2A First Scope

Approved now:

| item | approval |
|---|---|
| Global index candidate list | approved |
| Source status classification | approved |
| Minimum field contract | approved |
| Separate planning schema: global_indices / global_index_prices / global_index_scores | approved for design, not DB execution |
| Report-only checker | approved |
| Bounded future packet shape | approved for design only |
| FRED route | approved for legal evidence review only |
| KRX route | approved for terms review only |

Not approved yet:

| item | status |
|---|---|
| Fetching real global index rows | blocked |
| Writing global index rows to Supabase | blocked |
| Running SQL migrations | blocked |
| Publicly displaying real global index values | blocked |
| Promoting publicDataSource or scoreSource | blocked |
| Scraping HKEX, Hang Seng, STOXX, DAX, SSE, CSI, Yahoo, Investing.com, MarketWatch, or WSJ | rejected |

## Execution Selector

Current selector outcome:

```text
currentPhase=phase_2a_global_index
currentLane=source_registry_and_rights_evidence
executionMode=report_only
executionAllowedNow=true
marketDataFetchAllowed=false
supabaseWriteAllowed=false
sqlAllowed=false
uiChangeAllowed=false
nextEngineeringSlice=phase_2a_global_index_source_registry_report_only
```

## Next PM/CEO Work Queue

1. Accept `docs/PHASE_2A_GLOBAL_INDEX_DATA_PLAN.md` as the Phase 2A planning baseline.
2. Accept `docs/PHASE_2A_GLOBAL_INDEX_SOURCE_REVIEW.md` as the current source-rights status ledger.
3. Assign source-rights evidence owners:
   - FRED / S&P / Nasdaq / Dow Jones / Nikkei rights review.
   - KRX terms review for KOSPI.
   - Vendor/license decision for HKEX/Hang Seng, STOXX/DAX, SSE/CSI.
4. Prepare a disabled bounded fetch packet for `SP500`, `NASDAQCOM`, `DJIA`, and `NIKKEI225`.
5. Keep the packet disabled until legalUsageStatus is upgraded to `accepted`.

## Engineering Next Slice

Recommended next A2 engineering slice:

```text
phase_2a_global_index_source_registry_report_only
```

Deliverables:

| deliverable | note |
|---|---|
| Static source registry object | Metadata only; no market values. |
| Source-rights status checker | Must fail closed when a source is incorrectly promoted. |
| Bounded packet template | Disabled by default; no fetch and no write. |
| PM decision ledger | Records whether each source is accepted, conditional, rejected, or unresolved. |

Allowed fields in metadata-only registry:

```text
symbol
displayName
country
market
source
sourceUrl
updateFrequency
legalUsageStatus
sourceDecisionOwner
nextDecisionNeeded
```

Forbidden fields until source acceptance:

```text
close
change
changePercent
tradeDate row payloads
raw source response
```

## CEO Go / No-Go

Go:

- Proceed with Phase 2A source registry and legal evidence work.
- Proceed with report-only guardrails.
- Proceed with schema planning.
- Proceed with disabled bounded packet design.

No-Go:

- No real global index ingestion.
- No Supabase or SQL execution.
- No public real-data display.
- No source promotion from `conditional` to `accepted` without source-rights evidence.

## Mainline Handoff

PM/CEO mainline can integrate this as:

```text
Phase 2A is officially open, but only the source-registry and rights-evidence lane is executable now. The first engineering step is not ingestion; it is the metadata registry, fail-closed checker, and disabled bounded packet template.
```

