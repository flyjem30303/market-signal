# Phase 2A Global Index Source Rights Evidence Worksheet

Status: `phase_2a_global_index_source_rights_evidence_worksheet_ready_no_fetch`

Date: 2026-06-20

CEO recommendation: `a2_continue_phase_2a_global_index_lane`

## Purpose

This worksheet is the next A2 coherent slice after the disabled bounded packet design.

It captures the evidence required to upgrade any global index source from `conditional` or `unresolved` to `accepted`. It does not fetch market data, store market data, execute SQL, write Supabase, or change public UI.

## Acceptance Rule

No source may be upgraded to `accepted` unless every required evidence field is filled and reviewed by PM/Legal.

Required evidence fields:

| field | required evidence |
|---|---|
| sourceOwner | Legal owner or authoritative provider of the index data. |
| sourceUrl | Official terms, API, or license URL. |
| automationAllowed | Whether automated retrieval is explicitly allowed. |
| storageAllowed | Whether our product may store close values and derived changes. |
| publicDisplayAllowed | Whether public display outside the source site is allowed. |
| redistributionAllowed | Whether public display counts as redistribution and whether it is allowed. |
| derivedFieldsAllowed | Whether change and changePercent may be derived and shown. |
| attributionRequired | Exact attribution requirement. |
| commercialUseAllowed | Whether commercial/public product use is allowed. |
| rateLimitPolicy | Documented request limit or cadence. |
| pmLegalDecision | accepted / conditional / rejected / unresolved. |
| decisionOwner | CEO/PM/Legal owner for final classification. |

## Evidence Targets

### FRED Candidate Route

Applies to:

```text
SP500
NASDAQCOM
DJIA
NIKKEI225
```

Current status:

```text
conditional
```

Evidence still needed:

| evidence item | status |
|---|---|
| FRED API terms allow the intended automated access pattern | needs review |
| Third-party index owner permission or allowed-use evidence | needs review |
| DB storage of daily close values | needs review |
| Derived change and changePercent display | needs review |
| Public display with attribution | needs review |
| Commercial/public product use | needs review |
| Anti-cache/archive/database restriction review | needs review |

Decision rule:

FRED remains `conditional` until PM/Legal confirms that both FRED terms and the underlying index owner terms allow the exact intended usage.

### KRX Candidate Route

Applies to:

```text
KOSPI
```

Current status:

```text
unresolved
```

Evidence still needed:

| evidence item | status |
|---|---|
| Official KRX API or data service endpoint terms | needs review |
| Account/API-key requirements | needs review |
| Automated retrieval permission | needs review |
| Storage and public display permission | needs review |
| Redistribution restriction review | needs review |
| Required attribution | needs review |
| Commercial/public product use | needs review |

Decision rule:

KOSPI remains `unresolved` until official KRX terms are reviewed by PM/Legal. No scrape route is allowed.

### Licensed Vendor Route

Applies to:

```text
HSI
SXXP
DAX
SSECOMP
CSI300
```

Current status:

```text
HSI, SXXP, DAX = rejected for free path
SSECOMP, CSI300 = unresolved
```

Evidence still needed:

| evidence item | status |
|---|---|
| Licensed data provider selected | needs CEO/PM decision |
| License permits storage | needs review |
| License permits public display | needs review |
| License permits derived fields | needs review |
| Attribution and disclaimer obligations | needs review |
| Fees and usage limits | needs CEO/PM decision |

Decision rule:

These indices cannot enter ingestion planning until CEO/PM selects a licensed route or formally defers them.

## Source Decision Matrix

| symbol | currentStatus | required next decision | can enter disabled packet | can fetch now | can write now |
|---|---|---|---|---|---|
| SP500 | conditional | FRED plus source-owner rights review | yes | no | no |
| NASDAQCOM | conditional | FRED plus source-owner rights review | yes | no | no |
| DJIA | conditional | FRED plus source-owner rights review | yes | no | no |
| NIKKEI225 | conditional | FRED plus Nikkei rights review | yes | no | no |
| KOSPI | unresolved | KRX terms review | no | no | no |
| HSI | rejected | licensed vendor decision | no | no | no |
| SXXP | rejected | licensed vendor decision | no | no | no |
| DAX | rejected | licensed vendor decision | no | no | no |
| SSECOMP | unresolved | official/license route decision | no | no | no |
| CSI300 | unresolved | official/license route decision | no | no | no |

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
phase_2a_global_index_fred_rights_decision_packet
```

That slice should convert the FRED evidence questions into a PM/Legal decision packet. It should remain no-fetch and no-write.

