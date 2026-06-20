# Phase 2A Global Index Disabled Bounded Packet Design

Status: `phase_2a_global_index_disabled_bounded_packet_design_ready`

Date: 2026-06-20

CEO recommendation: `a2_continue_phase_2a_global_index_lane`

## Purpose

This slice converts the CEO-led Phase 2A source registry into a disabled bounded packet design.

The packet is a future execution shape only. It is intentionally disabled because no global index source is currently `accepted` for production ingestion, storage, and public display.

Packet file:

```text
src/lib/global-index-disabled-bounded-packet.ts
```

## Packet Contract

```text
packetName=phase_2a_global_index_bounded_fetch_candidate
enabled=false
writeEnabled=false
fetchExecuted=false
requiresLegalUsageStatus=accepted
maxRowsPerSymbol=2
requiresSourceAttribution=true
requiresNoSecretsInOutput=true
```

## Candidate Symbols

The disabled packet may list only current `conditional` source-review candidates:

```text
SP500
NASDAQCOM
DJIA
NIKKEI225
```

Rejected or unresolved symbols must not enter the first disabled packet:

```text
HSI
SXXP
DAX
KOSPI
SSECOMP
CSI300
```

## Allowed Future Fields

These fields describe the maximum future fetch contract after legal acceptance:

```text
symbol
close
tradeDate
source
sourceUrl
```

Derived fields after approval:

```text
change
changePercent
```

## Hard Stop

The packet must stay disabled until all are true:

```text
legalUsageStatus=accepted
source-rights evidence attached
attribution copy approved
bounded maxRowsPerSymbol approved
PM mainline integration accepted
```

## Runtime Boundary

| area | impact |
|---|---|
| runtime behavior | none |
| public UI | none |
| Supabase read | none |
| Supabase write | none |
| SQL execution | none |
| market data fetch | none |
| raw payload storage | none |
| publicDataSource | unchanged, remains mock |
| scoreSource | unchanged, remains mock |

## Next Step

Recommended next A2 slice:

```text
phase_2a_global_index_source_rights_evidence_worksheet
```

This should collect source-rights evidence fields for FRED/FRED third-party owners and KRX without fetching market data.

