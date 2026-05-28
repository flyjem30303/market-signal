# CP1 Follow-up: Mixed Adapter Preview

Date: 2026-05-29

Trigger:

- Raw Supabase market read contract exists.
- Raw market smoke test exists.
- Next.js server loader exists.
- Internal diagnostics route exists and is disabled by default.
- Mixed adapter now separates real raw market data from mock score output.

## A / PM + Developer

The technical boundary is healthy enough for a non-public preview:

- Raw market data is separate from mock signal scoring.
- Internal diagnostics are disabled by default.
- The app still does not use `NEXT_PUBLIC_DATA_SOURCE=supabase`.
- The mixed adapter explicitly marks `rawDataSource` and `scoreSource`.

A recommends a preview page only if it remains non-public, noindex,
token-protected, disabled by default, and clearly labeled as internal
diagnostics.

## B / Marketing

B does not want this preview indexed or used for SEO. It is useful only for
internal inspection.

B requires no sitemap link, no navigation link, and no broad symbol expansion
from this page.

## C / Investment Advisor

C supports an internal preview because it helps inspect the mismatch between
real raw market data and mock model interpretation.

C requires the score source to remain visibly mock and warnings to include
`score-is-mock`.

## D / Legal

D approves only an internal diagnostic page. Public exposure would increase risk
because real market data beside mock interpretation can be misunderstood.

D requires noindex, token protection, no commercial placement, and no investment
call-to-action.

## F / Product Design / UIUX

F recommends a plain diagnostic layout, not a polished product page. It should
look like an internal inspection tool, not a user-facing experience.

F requires clear labels for real raw data, mock score, and warnings.

## E / CEO Synthesis

CEO approves a narrow internal preview page because it improves development
confidence without changing public product behavior.

Decision:

```text
PROCEED
```

This does not approve public UI use. It only approves a disabled-by-default,
token-protected, noindex internal preview page.

## Required Adjustments

1. Add an internal preview page under an internal route.
2. Keep it disabled unless `INTERNAL_DIAGNOSTICS_ENABLED=true`.
3. Require `INTERNAL_DIAGNOSTICS_TOKEN` when present.
4. Add `noindex`.
5. Show raw data source and score source separately.
6. Keep `NEXT_PUBLIC_DATA_SOURCE=mock`.

## Next Implementation Slice

Approved next slice:

```text
Create internal mixed market preview page.
```

Implementation note:

- Completed: internal mixed market preview page.
- Completed: mixed data quality summary and caveat copy.
- Still pending: CEO review before true data quality scoring work.

Not approved yet:

```text
Public mixed-data stock UI.
Switch NEXT_PUBLIC_DATA_SOURCE=supabase.
Show real model scores.
Index broad real stock pages.
```
