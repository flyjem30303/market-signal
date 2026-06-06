# TW Equity Provider-Specific Terms Apply Runbook Role Review

Date: 2026-06-06

Status: TW equity provider-specific terms apply runbook role review recorded.

Reviewed artifacts:

- `docs/TW_EQUITY_PROVIDER_SPECIFIC_TERMS_APPLY_RUNBOOK.md`.
- `docs/reviews/TW_EQUITY_PROVIDER_SPECIFIC_TERMS_REVIEW_OUTCOME_TOOL_ROLE_REVIEW_2026-06-06.md`.
- `scripts/record-tw-equity-provider-specific-terms-review-outcome.mjs`.
- `scripts/check-tw-equity-provider-specific-terms-apply-runbook.mjs`.
- `scripts/check-record-tw-equity-provider-specific-terms-review-outcome.mjs`.
- `scripts/check-tw-equity-provider-specific-terms-review-outcome-ledger.mjs`.

## CEO Decision

```text
ACCEPT AS LOCAL-ONLY APPLY RUNBOOK
```

This role review accepts the apply runbook as the operating procedure for a future single human-supplied TW equity provider terms classification. It does not execute the runbook, does not run the recorder, does not record any outcome, does not approve source use, does not approve provider terms, and does not promote runtime state.

## Role Review

### CEO

CEO accepts the runbook because it makes the future apply path explicit: inspect ledger, dry-run first, apply only after dry-run passes, then run post-apply checks.

```text
accepted as local-only apply runbook
does not execute the runbook
does not record any outcome
does not promote runtime state
```

### PM

PM accepts the runbook because it requires a specific human classification before any apply command and blocks inference when fields are missing.

```text
requires specific human classification
requires id
requires classification
requires recordedBy
requires recordedAt
requires note
do not infer a favorable classification
```

### Legal

Legal accepts the runbook because it blocks copying provider terms or source payloads into the repo and keeps unclear answers blocked.

```text
do not copy provider terms
do not copy source payloads
unknown_keep_blocked remains blocked
rejected remains blocked
source license approval remains blocked
provider terms approval remains blocked
```

### Data / A1

Data accepts the runbook because it does not fetch, ingest, store, validate, or score market rows.

```text
does not fetch market data
does not ingest market data
does not store source-derived rows
does not write staging rows
does not write daily_prices
does not award row coverage points
```

### Engineering

Engineering accepts the runbook because it uses the existing local recorder and post-apply checks without adding Supabase, SQL, environment secret, or runtime paths.

```text
uses existing local recorder
uses post-apply checks
no Supabase client
no SQL path
no environment secret access
no runtime wiring
```

### QA

QA accepts the runbook because it requires post-apply checks and has a dedicated checker in the review gate.

```text
apply runbook checker passes
recorder checker passes
outcome ledger checker passes
readable status checker passes
JSON checker passes
review gate passes
```

## Accepted Scope

This role review accepts:

- the apply runbook as a future operating procedure;
- the required human input fields;
- the required dry-run-before-apply sequence;
- the requirement to run post-apply checks;
- the stop lines for missing fields, unclear classifications, source payload copying, SQL, Supabase, market-data actions, public source promotion, row coverage points, and `scoreSource=real`.

## Not Accepted Scope

This role review does not accept:

- executing `--dry-run`;
- executing `--apply`;
- recording any classification;
- source approval;
- provider terms approval;
- source license approval;
- redistribution approval;
- retention approval;
- public display approval;
- derived-score use approval;
- SQL execution;
- Supabase connection;
- Supabase reads;
- Supabase writes;
- staging rows;
- production `daily_prices` mutation;
- TWSE source retrieval;
- market-data ingestion;
- source-derived row storage;
- public source promotion;
- row coverage points;
- `scoreSource=real`;
- investment advice, ranking, recommendation, model confidence, professional indicator claims, or performance claims.

## CEO Recommendation

The next safe slice is to wait for a specific human classification. If a classification is supplied, execute exactly one dry-run for that one item. If dry-run passes and the classification is still intended, execute exactly one apply for that one item, then run post-apply checks.
