# TW Equity Table API Visibility Permission Diagnostic Decision Packet

Date: 2026-06-06

Status: `tw_equity_table_api_visibility_permission_diagnostic_decision_packet_ready_not_executed`.

Decision: `READY_FOR_SEPARATE_TABLE_LEVEL_DATA_API_VISIBILITY_PERMISSION_DIAGNOSTIC`.

## Purpose

This packet is the next CEO/PM decision after the accepted non-data-changing schema exposure/cache repair and the bounded PostgREST OpenAPI probe rerun.

The post-repair probe reached and parsed OpenAPI, but `staging_twse_stock_day_runs` and `staging_twse_stock_day_prices` are still not exposed in the OpenAPI schema. Therefore the current blocker is no longer a generic "retry later" issue. The next diagnostic must classify table-level Data API visibility and permission posture before any third bounded staging write decision.

This packet does not execute the diagnostic. It does not connect to Supabase, run SQL, execute a migration, write staging rows, fetch market data, print secrets, print raw OpenAPI, print row payloads, promote public data, award row coverage points, or set `scoreSource=real`.

## Accepted Evidence

- EVID-001 schema exposure/cache repair outcome is recorded as `accepted`.
- EVID-002 accepted note says Data API public schema was confirmed and `NOTIFY pgrst reload schema` was executed with no data write.
- EVID-003 exactly one bounded PostgREST OpenAPI schema exposure probe rerun was attempted after acceptance.
- EVID-004 OpenAPI endpoint was reachable and parsed.
- EVID-005 `staging_twse_stock_day_runs` is still not exposed in OpenAPI.
- EVID-006 `staging_twse_stock_day_prices` is still not exposed in OpenAPI.
- EVID-007 third bounded staging write remains blocked.

## Diagnostic Questions

- Q001 Are the canonical staging tables enabled for Data API exposure at the table/object level?
- Q002 Are the canonical staging tables in an exposed schema but hidden by table-level permissions, grants, policy posture, or API visibility settings?
- Q003 Is the Dashboard/API schema exposure confirmation insufficient because relation-level visibility is still disabled or unsupported for these objects?
- Q004 Is the table exposure mismatch specific to OpenAPI metadata while a direct relation endpoint remains reachable, or are both relation endpoints hidden?
- Q005 Does the next repair require dashboard-only table API visibility adjustment, SQL/grant review, migration/schema repair, or a new staging table route?

## Allowed Future Diagnostic Scope

Allowed only in a separate authorized execution slice:

- DIAG-001 inspect Supabase Dashboard table/API visibility settings for `staging_twse_stock_day_runs` and `staging_twse_stock_day_prices`.
- DIAG-002 run one bounded read-only table-level Data API visibility diagnostic if explicitly authorized.
- DIAG-003 target only the two canonical staging tables.
- DIAG-004 collect only sanitized aggregate evidence: exposed/not exposed, reachable/not reachable, sanitized error code/category, and no raw payload.
- DIAG-005 write a post-run review immediately after execution.

Blocked by this packet:

- BLOCK-001 no third bounded staging write attempt.
- BLOCK-002 no SQL execution.
- BLOCK-003 no migration execution.
- BLOCK-004 no insert/update/upsert/delete operation.
- BLOCK-005 no staging row creation.
- BLOCK-006 no production `daily_prices` mutation.
- BLOCK-007 no market-data fetch or ingestion.
- BLOCK-008 no raw OpenAPI output, raw row payload, raw market-data payload, SQL text, Supabase URL, key prefix, key suffix, key length, or secret output.
- BLOCK-009 no public data source promotion.
- BLOCK-010 no row coverage points.
- BLOCK-011 no `scoreSource=real`.

## Expected Classifications

- `table_api_visibility_not_exposed`: table-level Data API visibility is still disabled or absent for one or both staging tables.
- `table_permission_or_policy_visibility_blocked`: table is in an exposed schema but access/permission/policy posture prevents metadata or relation visibility.
- `openapi_metadata_lag_or_cache_incomplete`: direct relation reachability differs from OpenAPI exposure, pointing back to schema cache or metadata lag.
- `table_object_missing_or_mismatched`: table identity differs from the canonical relation names expected by the write runner.
- `diagnostic_environment_blocked`: credentials, network, or environment prevents safe classification.

## CEO Verdict

Proceed with this table-level diagnostic decision before any third bounded staging write. The fastest safe route is not another write attempt; it is to classify table visibility/permission precisely enough to choose a repair route.

## PM Next Action

Create or choose the next separate diagnostic slice from this packet. The preferred next slice is a local-only command map and checker for one bounded table-level Data API visibility diagnostic. If the operator can provide Dashboard screenshots or a verbal accepted/rejected table visibility outcome, record that outcome before any remote diagnostic or write decision.

## Safety Confirmation

- no remote Supabase connection;
- no SQL execution;
- no migration execution;
- no write attempt;
- no staging rows created;
- no `daily_prices` mutation;
- no market-data fetch or ingestion;
- no raw OpenAPI printed;
- no raw payloads printed;
- no row payloads printed;
- no secrets printed;
- `publicDataSource=mock`;
- `scoreSource=mock`.
