# Phase 2A Global Index FRED Rights Decision Packet

Status: `phase_2a_global_index_fred_rights_decision_packet_ready_no_fetch`

Date: 2026-06-20

CEO recommendation: `a2_continue_phase_2a_global_index_lane`

## Purpose

This packet converts the FRED candidate route into a PM/Legal decision package.

It does not approve ingestion. It does not fetch FRED observations. It does not store market data. It exists so PM/Legal can decide whether the FRED route may later become an `accepted` source for a bounded packet.

## Scope

Candidate symbols:

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

Target decision:

```text
accepted / conditional / rejected / unresolved
```

## Known Evidence

FRED provides an API and series pages for the four candidate symbols:

| symbol | sourceUrl |
|---|---|
| SP500 | https://fred.stlouisfed.org/series/SP500 |
| NASDAQCOM | https://fred.stlouisfed.org/series/NASDAQCOM |
| DJIA | https://fred.stlouisfed.org/series/DJIA |
| NIKKEI225 | https://fred.stlouisfed.org/series/NIKKEI225 |

FRED terms and legal pages relevant to the decision:

```text
https://fred.stlouisfed.org/docs/api/terms_of_use.html
https://fred.stlouisfed.org/legal/
https://fred.stlouisfed.org/docs/api/fred/
```

Current A2 interpretation:

FRED is a credible candidate route for reference-index daily close series, but FRED terms do not automatically grant all third-party index rights. A2 keeps FRED as `conditional` until PM/Legal confirms the exact storage, attribution, derivation, and public display rights.

## PM/Legal Decision Questions

| question | required decision |
|---|---|
| Does FRED API access allow our planned automated cadence? | accepted / conditional / rejected / unresolved |
| Does the FRED API key/account policy allow this product use? | accepted / conditional / rejected / unresolved |
| Are SP500, NASDAQCOM, DJIA, and NIKKEI225 third-party rights cleared for our use? | accepted / conditional / rejected / unresolved |
| May we store daily close values in our DB? | accepted / conditional / rejected / unresolved |
| May we derive and display change and changePercent? | accepted / conditional / rejected / unresolved |
| May we publicly display daily close and derived changes with attribution? | accepted / conditional / rejected / unresolved |
| Does public display count as redistribution under source-owner terms? | accepted / conditional / rejected / unresolved |
| Does any anti-cache, archive, database, or bulk-download restriction block this route? | accepted / conditional / rejected / unresolved |
| What exact attribution text and source URL are required? | text required |
| Is commercial/public product use allowed? | accepted / conditional / rejected / unresolved |

## Decision Outcomes

### Outcome A: Accepted

PM/Legal may mark one or more FRED symbols as `accepted` only if:

```text
automationAllowed=true
storageAllowed=true
publicDisplayAllowed=true
derivedFieldsAllowed=true
redistributionAllowed=true or not_applicable_with_evidence
commercialUseAllowed=true
attributionTextApproved=true
sourceOwnerRestrictionCleared=true
```

If accepted, the next A2 slice may update the disabled bounded packet eligibility for only the accepted symbols. It still must not execute fetch or write without a separate PM mainline execution approval.

### Outcome B: Conditional

Keep symbols `conditional` if:

```text
FRED API access appears viable
but source-owner rights, storage, redistribution, commercial use, or attribution remain unclear
```

Recommended action:

Continue source-rights evidence work. Do not fetch. Do not write.

### Outcome C: Rejected

Mark symbols `rejected` if:

```text
FRED or source-owner terms block storage, public display, redistribution, commercial use, or derived-data display
```

Recommended action:

Use licensed vendor search or defer these indices.

### Outcome D: Unresolved

Keep symbols `unresolved` if:

```text
PM/Legal cannot make a decision from current evidence
```

Recommended action:

Escalate to source owner, legal counsel, or licensed data vendor evaluation.

## Current A2 Recommendation

A2 recommendation:

```text
Keep FRED route conditional.
Proceed with PM/Legal rights review.
Do not enable bounded fetch.
Do not write Supabase.
Do not promote publicDataSource or scoreSource.
```

Why:

The FRED API route is technically plausible, but the product risk is legal/source-rights ambiguity, not engineering difficulty.

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

## Requires PM Mainline Integration

Requires PM integration: yes.

PM mainline should decide whether this packet is sufficient for Legal review, or whether A2 should next prepare an external source-owner question template.

## Next Step

Recommended next A2 slice:

```text
phase_2a_global_index_external_source_owner_question_template
```

That slice should produce a no-fetch template for asking FRED/source owners or licensed vendors about automation, storage, public display, redistribution, derived fields, attribution, and commercial use.

