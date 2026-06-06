# TW Equity Third Bounded Staging Write Decision

Date: 2026-06-07

Status: `tw_equity_third_bounded_staging_write_decision_ready_not_executed`.

## CEO Decision

Decision id: `THIRD_WRITE_DECISION_AUTH_003_READY`.

CEO authorizes exactly one future bounded TW equity staging write attempt after the post-migration readonly and OpenAPI exposure gates both passed. This decision does not execute the write.

## Preconditions

- Post-migration readonly verification: `tw_equity_post_migration_readonly_verification_tables_reachable_no_write`.
- Post-migration OpenAPI exposure confirmation: `tw_equity_post_migration_openapi_exposure_confirmation_schema_exposure_complete_write_path_ready_for_decision`.
- Candidate artifact: `data/candidates/tw-equity-staging-candidate.json`.
- Candidate accepted row shape: 1 run row and 180 price rows.
- UUID contract: runner and candidate artifact must require UUID-shaped `run_id`.
- Runner contract: `AUTH-003` must be accepted in local mock mode before the real attempt.

## Authorization Contract

- Authorization id: `TW-EQUITY-STAGING-WRITE-2026-06-07-AUTH-003`.
- Confirmation env value: `CEO_APPROVED_TW_EQUITY_THIRD_BOUNDED_STAGING_WRITE_ONCE`.
- Lane: `tw-equity`.
- Symbols: `2330,2382,2308`.
- Sessions: `60`.
- Target: `staging_twse_stock_day_runs,staging_twse_stock_day_prices`.
- Max rows: `180`.
- Candidate input: `data/candidates/tw-equity-staging-candidate.json`.
- Post-run review: `docs/reviews/TW_EQUITY_STAGING_THIRD_WRITE_POST_RUN_REVIEW_2026-06-07.md`.
- Retry policy: `no_retry_in_same_slice`.

## Exact Future Command

```powershell
$env:TW_EQUITY_STAGING_WRITE_CONFIRMATION='CEO_APPROVED_TW_EQUITY_THIRD_BOUNDED_STAGING_WRITE_ONCE'
node scripts/run-tw-equity-staging-write-once.mjs --authorization-id "TW-EQUITY-STAGING-WRITE-2026-06-07-AUTH-003" --lane "tw-equity" --symbols "2330,2382,2308" --sessions 60 --target "staging_twse_stock_day_runs,staging_twse_stock_day_prices" --max-rows 180 --post-run-review "docs/reviews/TW_EQUITY_STAGING_THIRD_WRITE_POST_RUN_REVIEW_2026-06-07.md" --candidate-input "data/candidates/tw-equity-staging-candidate.json" --rollback-dry-run --execute
```

## Safety Boundary

- No SQL is authorized by this decision.
- No `daily_prices` mutation is authorized.
- No public source promotion is authorized.
- No row coverage points are awarded by this decision.
- No `scoreSource=real` promotion is authorized.
- No raw market payload, row payload, source URL payload, or secret may be printed or stored.
- `publicDataSource=mock` and `scoreSource=mock` must remain unchanged after this decision.

## Next Slice

- Run the local checker for this decision.
- If it passes, execute the exact future command once as a separate bounded staging write execution slice.
- Immediately create the third write post-run review whether the attempt succeeds or fails closed.
