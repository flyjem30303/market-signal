# CP1 Follow-up: CP1 to CP2 Release Checklist

Date: 2026-05-29

Trigger:

- CP1 checkpoint snapshot exists.
- The project needs an explicit boundary before CP2 opens.

## Implemented

- Added:

```text
docs/CP1_TO_CP2_RELEASE_CHECKLIST.md
```

- Added:

```text
npm run check:cp1-to-cp2
```

Current expected status:

```text
not_ready
```

## A / PM + Developer

A confirms CP2 should not open until public Supabase repository, real scoring
model, and data quality rules are approved.

## B / Marketing

B confirms SEO expansion should wait for public data and legal review.

## C / Investment Advisor

C confirms real scoring and ETF scoring are not approved.

## D / Legal

D confirms source licensing and public disclosure remain required.

## F / Product Design / UIUX

F confirms public UI states for real data, stale data, and partial data still
need approval.

## E / CEO Synthesis

CEO decision:

```text
NOT_READY
```

CP1 remains internal-only. CP2 is not open.

## Not Approved

```text
Opening CP2
NEXT_PUBLIC_DATA_SOURCE=supabase
ETF ingestion
Real model score claims
```
