# Phase 1 TWII + ETF Missing Rows Backfill Readiness

Status: `phase_1_twii_etf_missing_rows_backfill_readiness_ready_not_executable`

Date: 2026-06-15

## CEO Decision

The row coverage readonly result is accepted as aggregate-only evidence. Phase 1 data online still remains blocked because Level 1 coverage is `182/360`, with `178` missing rows.

CEO route:

1. Prioritize TWII first because TWII `0/60` has a sanitized aggregate-only candidate artifact already present.
2. Keep ETF parallel but blocked because ETF `2/120` still lacks accepted source-rights and field-contract evidence.
3. Hold TW equity because `2330`, `2382`, and `2308` each have `60/60` rows.

Recommendation: `prioritize_twii_no_write_candidate_review_before_etf`

## Lane Readiness

| Lane | Current coverage | Missing rows | State | Next route |
| --- | ---: | ---: | --- | --- |
| TWII | `0/60` | `60` | Candidate present, pending PM review | `twii_no_write_candidate_review_then_write_gate_preflight` |
| ETF | `2/120` | `118` | Source rights blocked | `etf_source_rights_and_field_contract_resolution` |
| TW equity | `180/180` | `0` | No missing-row backfill needed | `hold_no_backfill_needed` |

## Required Before Any Write

- `sourceRightsAccepted`
- `targetTableBoundaryAccepted`
- `dryRunReportAccepted`
- `rollbackRetentionAccepted`
- `postRunReviewAccepted`

## Workstream Assignment

- PM mainline: open TWII no-write candidate review and write-gate preflight without executing writes.
- A1 data line: continue ETF rights and field-contract resolution; do not generate ETF candidates until one source lane is accepted.
- A2 public copy: keep public wording aligned with mock state, missing data, delayed data, and non-investment-advice boundaries.

## Boundary

Runtime remains `publicDataSource=mock`.

Score remains `scoreSource=mock`.

No SQL.

No Supabase write.

No staging rows.

No `daily_prices` mutation.

No market-data fetch or ingestion.

No raw payload output.

No row payload output.

No stock-id payload output.

No secret output.

No row coverage points.

No public real-data promotion.

No real score promotion.

No investment advice claim.

## Evidence

- `data/evidence-intake/phase-1-bounded-readonly-attempt-result-20260615-a.json`
- `data/evidence-intake/phase-1-row-coverage-readonly-result-20260615-a.json`
- `data/candidates/twii-sanitized-candidate.json`
- `docs/A1_ETF_SOURCE_RIGHTS_OUTCOME_DECISION_SUPPORT.md`

## Next Route

PM should continue with the TWII no-write candidate review route. A1 should keep resolving ETF source rights in parallel. The public runtime must stay mock until write/backfill, coverage, quality, rollback, freshness, and public disclosure gates pass.
