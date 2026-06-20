# Phase 2A Global Index External Source Owner Question Template

Status: `phase_2a_global_index_external_source_owner_question_template_ready_no_fetch`

Date: 2026-06-20

CEO recommendation: `a2_continue_phase_2a_global_index_lane`

## Purpose

This template gives PM/Legal a no-fetch question set for external source owners, FRED-related rights contacts, or licensed market-data vendors.

It does not approve ingestion. It does not fetch market data. It does not write Supabase. It does not execute SQL. It does not change public UI.

## Target Sources

Use this template for:

```text
FRED / FRED third-party source owners
S&P / Dow Jones / Nasdaq index rights contacts
Nikkei index rights contacts
KRX official data service contacts
HKEX / Hang Seng licensed data contacts
STOXX / Deutsche Boerse licensed data contacts
SSE / CSI licensed or official data contacts
```

## Product Usage Summary To Send

```text
We are building a public investor information dashboard that may show delayed daily global index close values and derived daily change fields. We do not need real-time quotes. We need to understand whether automated retrieval, internal storage, public display, derived fields, attribution, and commercial/public product use are permitted for the listed indices.
```

## Candidate Symbols

```text
SP500
NASDAQCOM
DJIA
NIKKEI225
KOSPI
HSI
SXXP
DAX
SSECOMP
CSI300
```

## Questions

| topic | question |
|---|---|
| Authority | Are you the rights owner or authorized distributor for the index data listed above? |
| Automation | May our service retrieve delayed daily close values through an API or approved file endpoint on a scheduled basis? |
| Storage | May our service store daily close values in our database for product display and historical reference? |
| Public display | May our public website display delayed daily close values to users? |
| Derived fields | May our service derive and display point change and percentage change from stored close values? |
| Redistribution | Does public display of delayed daily close and derived fields count as redistribution under your terms? |
| Commercial use | Is the use allowed for a commercial or public product, including future paid memberships? |
| Attribution | What exact attribution text, logo rule, disclaimer, and source URL are required? |
| Delay requirement | Is there a minimum delay requirement before public display? |
| Data limits | Are there request limits, row limits, caching limits, archive limits, or database limits? |
| Geography | Are there country or user-location limits for public display? |
| Fees | Are fees required for this usage pattern? |
| Prohibited use | Are there prohibited uses such as ranking, scoring, derived analysis, alerts, or charting? |
| Approval process | What agreement, license, or written approval is required before implementation? |

## Required Reply Format

Please answer each field with one of:

```text
allowed
allowed_with_conditions
not_allowed
not_applicable
needs_paid_license
needs_more_review
```

Required details:

| field | reply |
|---|---|
| automationAllowed |  |
| storageAllowed |  |
| publicDisplayAllowed |  |
| derivedFieldsAllowed |  |
| redistributionAllowed |  |
| commercialUseAllowed |  |
| attributionRequired |  |
| requiredAttributionText |  |
| minimumDelay |  |
| rateLimitPolicy |  |
| cacheArchiveDatabaseLimit |  |
| paidLicenseRequired |  |
| agreementRequiredBeforeUse |  |
| contactForApproval |  |

## A2 Classification Rule

A2 may classify a source as `accepted` only after PM/Legal confirms:

```text
automationAllowed=allowed
storageAllowed=allowed
publicDisplayAllowed=allowed
derivedFieldsAllowed=allowed
commercialUseAllowed=allowed
attributionRequired answered
agreementRequiredBeforeUse satisfied or not_applicable
```

Any answer of `allowed_with_conditions`, `needs_paid_license`, `needs_more_review`, or blank keeps the source out of ingestion execution.

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
phase_2a_global_index_pm_legal_reply_intake_template
```

That slice should define how A2 will record PM/Legal or source-owner replies without changing source status automatically.

