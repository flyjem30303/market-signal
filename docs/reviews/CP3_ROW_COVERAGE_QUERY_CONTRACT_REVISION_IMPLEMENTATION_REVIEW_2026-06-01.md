# CP3 Row Coverage Query Contract Revision Implementation Review

Status: `CP3 row coverage query contract revision implementation review recorded`

Decision: `LOCAL_QUERY_CONTRACT_FIX_ACCEPTED_SECOND_REMOTE_ATTEMPT_STILL_BLOCKED`

Trigger: `CP3 row coverage count_unavailable local diagnostic plan recorded`

## Scope

This review records the local runner query-contract fix for the `count_unavailable` diagnosis. It does not run a second remote attempt, does not connect to Supabase in this slice, does not run SQL, does not write Supabase, does not write staging rows, does not write `daily_prices`, does not modify `.env.local`, does not fetch or ingest market data, does not print secrets, does not output row payloads, does not print `stock_id` values, does not set `scoreSource=real`, does not award row coverage points, does not approve public claims, and does not promote CP3 readiness.

## Implemented Local Changes

```text
IMPLEMENTED-001 runner no longer counts daily_prices by symbol
IMPLEMENTED-002 runner no longer filters daily_prices with .eq("symbol", symbol)
IMPLEMENTED-003 runner resolves stocks.id from stocks.symbol before counting daily_prices
IMPLEMENTED-004 runner queries stocks with .select("id, symbol")
IMPLEMENTED-005 runner filters stocks with .in("symbol", ALLOWED_SYMBOLS)
IMPLEMENTED-006 runner stores stock ids internally in stockIdBySymbol
IMPLEMENTED-007 runner does not print stock_id values
IMPLEMENTED-008 runner counts daily_prices with .select("stock_id", { count: "exact", head: true })
IMPLEMENTED-009 runner filters daily_prices with .eq("stock_id", stockId)
IMPLEMENTED-010 runner reports stock_mapping_unavailable if stocks lookup fails
IMPLEMENTED-011 runner reports stock_mapping_missing if a symbol has no stock id
IMPLEMENTED-012 runner keeps sanitized symbolsChecked with symbol and observedRows only
IMPLEMENTED-013 static checker rejects the old daily_prices.symbol count path
IMPLEMENTED-014 static checker requires stock_id counting
```

## Safety Confirmation

```text
SAFETY-001 no second remote attempt was executed
SAFETY-002 no SQL was executed
SAFETY-003 no Supabase write was performed
SAFETY-004 no staging rows were written
SAFETY-005 no daily_prices rows were written
SAFETY-006 no market data was fetched or ingested
SAFETY-007 no secrets were printed
SAFETY-008 no key prefixes, suffixes, or lengths were printed
SAFETY-009 no row payloads were printed
SAFETY-010 no stock_id values were printed
SAFETY-011 publicDataSource remains mock
SAFETY-012 scoreSource remains mock
SAFETY-013 canAwardRowCoveragePoints remains false
SAFETY-014 canSetScoreSourceReal remains false
SAFETY-015 CP3 remains not_ready
SAFETY-016 public claims remain blocked
```

## Role Review

```text
CEO-FINDING-001 the likely query-shape mismatch has been fixed locally
CEO-FINDING-002 a second remote attempt should still require a new one-attempt gate
PM-FINDING-001 this is the correct acceleration move after the blocked first attempt
PM-FINDING-002 local checks must pass before preparing any second attempt
ENGINEERING-FINDING-001 runner now aligns with local schema evidence: stocks.symbol maps to stocks.id, daily_prices counts by stock_id
ENGINEERING-FINDING-002 checker now rejects returning to the old daily_prices.symbol path
DATA-FINDING-001 missing stock mapping is now separated from missing price rows
DATA-FINDING-002 row coverage points remain unawarded until a sanitized post-run review accepts evidence
SECURITY-FINDING-001 stock ids are internal lookup values and remain hidden from output
LEGAL-PUBLIC-CLAIMS-FINDING-001 no public claim may be based on this local implementation alone
LEGAL-PUBLIC-CLAIMS-FINDING-002 scoreSource=real remains blocked
```

## Decision

```text
DECISION-001 local query-contract fix is accepted
DECISION-002 first attempt remains blocked
DECISION-003 no second remote attempt is approved by this review
DECISION-004 row coverage evidence is not accepted yet
DECISION-005 row coverage points remain unawarded
DECISION-006 scoreSource remains mock
DECISION-007 CP3 remains not_ready
DECISION-008 public claims remain blocked
```

## Next Slice Recommendation

```text
NEXT-SLICE-001 create a second one-attempt execution decision gate only after local checks pass
NEXT-SLICE-002 do not execute the second attempt without explicit approval
NEXT-SLICE-003 if approved later, run exactly once and immediately create post-run review
NEXT-SLICE-004 keep public data source mock
NEXT-SLICE-005 keep scoreSource mock
NEXT-SLICE-006 keep row coverage points unawarded
NEXT-SLICE-007 keep CP3 not_ready
```

## Verification Expectations

```text
scripts/check-row-coverage-query-contract-revision-implementation-review.mjs passes
scripts/check-row-coverage-readonly-guarded-runner.mjs passes
scripts/check-row-coverage-count-unavailable-local-diagnostic-plan.mjs passes
scripts/check-review-gates.mjs passes
TypeScript noEmit passes
Next build passes
localhost health passes
no second remote attempt occurs
SQL execution remains blocked
Supabase writes remain blocked
public claims remain blocked
```
