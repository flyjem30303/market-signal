# Data Quality Field Validity Acceptance Gate

Date: 2026-06-02

Status: `data quality field validity acceptance gate recorded`

Decision: `ACCEPT_FIELD_VALIDITY_AS_LOCAL_QA_REVIEWED_SPEC_ONLY`

## Scope

This gate accepts the field-validity and downgrade-rule contract as local QA-reviewed specification only. It does not approve data-quality score points, row coverage points, Supabase reads, Supabase writes, SQL execution, market-data ingestion, public source promotion, public claims, or `scoreSource=real`.

## Reviewed Inputs

- `scripts/report-data-quality-field-validity.mjs`
- `scripts/report-data-quality-field-validity-qa-review.mjs`
- `scripts/check-data-quality-field-validity.mjs`
- `scripts/check-data-quality-field-validity-qa-review.mjs`
- `scripts/check-data-quality-score-contract.mjs`

## Accepted Local Evidence

- `QA-FIELD-001` required identity, date, price, volume, and source-quality fields have local invalid-state rules.
- `QA-FIELD-002` critical close-price and source-quality failures block real scoring rather than degrading silently.
- `QA-DOWNGRADE-001` unavailable, stale, and partial runtime states have score caps and public-claim limits.
- `QA-BOUNDARY-001` the contract keeps `publicDataSource` and `scoreSource` mock and awards no data-quality points.

## Still Blocked

- Data-quality score increase remains blocked.
- Row coverage evidence acceptance for runtime promotion remains blocked.
- Source-rights approval remains blocked.
- Public claim approval remains blocked.
- Supabase readonly execution remains a separate gate.
- SQL execution remains blocked.
- Supabase writes remain blocked.
- Market-data ingestion remains blocked.
- Public data source remains mock.
- `scoreSource=real` remains blocked.
- CP3 readiness remains `not_ready`.

## CEO Synthesis

The project can now treat field validity and downgrade behavior as QA-reviewed local specification. This reduces ambiguity in the Data lane, but it does not move the product to real data or real scoring. The next highest-value blocker work is to connect this accepted local spec to row coverage evidence and source-rights review, still without changing runtime public claims.

## Verification Expectations

- Field validity checker passes.
- Field validity QA review checker passes.
- Data-quality score contract checker passes.
- This acceptance gate checker passes.
- Review gates pass.
- TypeScript check passes.
