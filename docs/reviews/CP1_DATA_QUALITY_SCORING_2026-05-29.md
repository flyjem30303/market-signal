# CP1 Follow-up: Data Quality Scoring

Date: 2026-05-29

Trigger:

- Mixed market adapter exists.
- Internal mixed preview exists.
- Caveat copy maps warnings to severity and legal language.
- Next likely work is true data quality scoring.

## A / PM + Developer

A recommends starting with a pure data quality scoring spec and helper, not a UI
switch. The helper should evaluate raw market snapshot availability, latest
price availability, latest fundamentals availability, score source type, and
caveat severity.

The implementation should remain independent from Supabase so it can be tested
with mock objects before the database is available.

## B / Marketing

B does not want a data quality score shown publicly yet. It can become useful
later for trust, but public labels need careful copy.

B recommends keeping it internal-only and avoiding SEO claims such as complete
coverage.

## C / Investment Advisor

C supports designing the quality score before real model scoring. It gives the
future model a gate: real scores should not display unless raw data and model
inputs meet a minimum threshold.

C requires:

- mock scores always fail public display eligibility
- missing price is critical
- missing fundamentals is partial, not complete
- quality scoring must not imply investment accuracy

## D / Legal

D approves internal scoring only. Public exposure would need disclaimers and
careful wording.

D requires public eligibility to remain false while score source is mock.

## F / Product Design / UIUX

F recommends compact internal labels:

- `blocked`
- `review`
- `internal-only`

For public UI later, this should become a simple state label, not a numeric
badge that users overinterpret.

## E / CEO Synthesis

CEO approves a narrow next slice:

```text
PROCEED
```

Implement a pure data quality scoring helper and surface it only inside the
internal preview. Do not use it on public pages.

## Required Adjustments

1. Add a pure data quality scoring helper.
2. Keep public eligibility false while score source is mock.
3. Add deterministic labels for internal diagnostics.
4. Show the quality score only on the internal preview page.
5. Keep `NEXT_PUBLIC_DATA_SOURCE=mock`.

## Next Implementation Slice

Approved next slice:

```text
Add internal data quality scoring helper.
```

Implementation note:

- Completed: internal-only mixed data quality score helper.
- Completed: internal preview displays quality score and public eligibility.
- Public eligibility remains false while score source is mock.

Not approved yet:

```text
Public quality badge.
Real model score display.
Switch NEXT_PUBLIC_DATA_SOURCE=supabase.
SEO expansion based on quality score.
```
