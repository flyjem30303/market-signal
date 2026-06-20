# Phase 2A Global Index FRED Outreach Draft

Status: `phase_2a_global_index_fred_outreach_draft_ready_no_fetch`

Date: 2026-06-20

CEO recommendation: `a2_continue_phase_2a_global_index_lane`

## Purpose

This is a no-fetch outreach draft for PM/Legal to use when asking FRED, FRED-related third-party source owners, or index rights contacts about Phase 2A global index usage.

It is not sent by A2. It is not legal approval. It does not approve ingestion, fetch, Supabase write, SQL execution, runtime promotion, or public UI changes.

## Target Route

Primary target:

```text
FRED candidate route
```

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

## Draft Message

Subject:

```text
Question about permitted use of FRED daily index series in a public investor information dashboard
```

Message:

```text
Hello,

We are evaluating whether our public investor information dashboard may use selected daily index series available through FRED, including:

- SP500
- NASDAQCOM
- DJIA
- NIKKEI225

Our intended use is delayed daily reference information only. We do not need real-time quotes.

Before implementing anything, we need to confirm the permitted usage boundary for:

1. Automated retrieval through an approved FRED API or documented access path.
2. Internal storage of daily close values in our database.
3. Public display of delayed daily close values.
4. Deriving and displaying daily point change and percentage change from close values.
5. Whether public display or derived fields count as redistribution.
6. Whether commercial/public product use is allowed, including possible future paid memberships.
7. Required attribution text, source links, disclaimers, logos, or usage notices.
8. Any caching, archiving, database, bulk download, or rate-limit restrictions.
9. Whether separate permission is required from the underlying third-party index owners.

Could you confirm whether this usage is allowed, allowed with conditions, requires a paid license, or is not allowed?

If FRED cannot grant permission for third-party index-owner rights, could you point us to the correct source-owner or licensing contact for these series?

We will not fetch, store, or display the data until this permission boundary is clear.

Thank you.
```

## Required Reply Classification

PM/Legal should classify any reply using:

```text
allowed
allowed_with_conditions
not_allowed
not_applicable
needs_paid_license
needs_more_review
```

Any reply other than fully `allowed` for automation, storage, public display, derived fields, commercial use, and attribution keeps the FRED route out of ingestion.

## A2 Handling Rule

A2 may record the reply in the PM/Legal intake template, but must not change source status.

Required post-reply state:

```text
replyRecorded=true
sourceStatusChanged=false
ingestionApproved=false
fetchApproved=false
writeApproved=false
requiresPmMainlineClassification=true
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

## Requires PM Mainline Integration

Requires PM integration: yes.

PM/Legal owns whether to send this outreach and how to classify any reply.

## Next Step

Recommended next A2 slice:

```text
phase_2a_global_index_krx_terms_review_question_draft
```

That slice should draft a no-fetch KRX terms-review question set for KOSPI, while keeping KOSPI `unresolved`.

