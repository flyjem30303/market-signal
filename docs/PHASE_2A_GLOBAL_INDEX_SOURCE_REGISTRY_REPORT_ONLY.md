# Phase 2A Global Index Source Registry Report Only

Status: `phase_2a_global_index_source_registry_report_only_ready`

Date: 2026-06-20

CEO decision: `proceed_with_phase_2a_global_index_source_registry_first`

## Purpose

This is the first CEO-led Phase 2A engineering slice.

The registry converts the Phase 2A source review into code-owned metadata only. It does not contain market values and does not enable ingestion.

Registry file:

```text
src/lib/global-index-source-registry.ts
```

## Allowed Fields

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

## Forbidden Until Source Acceptance

```text
close
change
changePercent
tradeDate row payloads
open
high
low
volume
turnover
raw source response
```

## Current Registry Status

| status | symbols |
|---|---|
| conditional | SP500, NASDAQCOM, DJIA, NIKKEI225 |
| rejected | HSI, SXXP, DAX |
| unresolved | KOSPI, SSECOMP, CSI300 |
| accepted | none |

## Runtime Boundary

- `publicDataSource=mock`
- `scoreSource=mock`
- `marketDataFetchAllowed=false`
- `supabaseWriteAllowed=false`
- `sqlAllowed=false`
- `uiChangeAllowed=false`

## Next Step

Next CEO-led Phase 2A slice:

```text
phase_2a_global_index_disabled_bounded_packet_design
```

That slice may define a packet shape, but it must remain disabled until at least one source has `legalUsageStatus=accepted` with source-rights evidence.

