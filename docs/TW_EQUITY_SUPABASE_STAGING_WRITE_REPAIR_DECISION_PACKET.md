# TW Equity Supabase Staging Write Repair Decision Packet

Date: 2026-06-06

Status: `tw_equity_supabase_staging_write_repair_decision_packet_ready_no_repair_executed`.

Decision: `REPAIR_PACKET_READY_STOP_RETRY_UNTIL_CAUSE_ISOLATED`

## Why This Packet Exists

Two bounded TW equity staging write attempts reached the guarded Supabase write path and failed closed at the run insert step with sanitized problem code `run_insert_failed_PGRST205`. Both attempts recorded `mutations=false`, `writtenRunRows=0`, and `writtenPriceRows=0`.

The follow-up root-cause gate showed canonical staging objects were readable through bounded read-only diagnostics. That means the project should stop write retries and isolate why the read path can see the objects while the insert path still returns `PGRST205`.

## Accepted Evidence

- EVIDENCE-001 `docs/reviews/TW_EQUITY_STAGING_FIRST_WRITE_POST_RUN_REVIEW_2026-06-06.md` recorded the first bounded write attempt as `tw_equity_staging_first_write_attempt_blocked_pgrst205_no_mutation`.
- EVIDENCE-002 `docs/TW_EQUITY_PGRST205_ROOT_CAUSE_GATE.md` recorded canonical object reachability as `tw_equity_pgrst205_root_cause_gate_canonical_objects_readable_no_write_retry`.
- EVIDENCE-003 `docs/TW_EQUITY_SECOND_WRITE_RUNNER_CONTRACT_ALIGNMENT.md` confirmed the second retry runner contract in local mock mode.
- EVIDENCE-004 `docs/reviews/TW_EQUITY_STAGING_SECOND_WRITE_RETRY_POST_RUN_REVIEW_2026-06-06.md` recorded the second bounded retry as `tw_equity_staging_second_write_retry_blocked_pgrst205_no_mutation`.

## Repair Questions To Isolate

- REPAIR-Q001 REST insert schema exposure: are `staging_twse_stock_day_runs` and `staging_twse_stock_day_prices` exposed to the API schema used by the server-side client for insert operations?
- REPAIR-Q002 PostgREST schema cache: did the API schema cache refresh after the staging objects were created or modified?
- REPAIR-Q003 table object existence in exposed schema: do the exact target relation names exist in the exposed schema used by the write path, not only in local docs or read-only diagnostics?
- REPAIR-Q004 RLS and policy posture: does the service-role write path bypass or satisfy policies for the target staging objects, and does the failure occur before policy evaluation?
- REPAIR-Q005 hidden target mismatch: does the read-only diagnostic path query the same schema, relation names, and client configuration as the insert path?
- REPAIR-Q006 insert payload and column contract: do run and price candidate records reference columns that exist in the target relation cache, without requiring non-null fields that the runner does not provide?

## Allowed Next Work

- ALLOW-001 local-only schema and runner contract audit against existing repository files.
- ALLOW-002 local-only repair evidence checklist or dashboard operator checklist.
- ALLOW-003 non-mutating read-only diagnostic design, but execution requires a separate accepted decision packet.
- ALLOW-004 draft a repair SQL or migration review packet for human review, but do not execute it.
- ALLOW-005 create a third-attempt readiness packet only after repair evidence is accepted; the packet may not execute the attempt by itself.

## Forbidden Work

- FORBID-001 no third write retry.
- FORBID-002 no SQL execution.
- FORBID-003 no migration execution.
- FORBID-004 no insert, update, upsert, or delete operation.
- FORBID-005 no Supabase staging rows may be created.
- FORBID-006 no production `daily_prices` mutation.
- FORBID-007 no market-data fetch or ingestion.
- FORBID-008 no raw market-data payload, row payload, or secret output.
- FORBID-009 no public data source promotion.
- FORBID-010 no row coverage points.
- FORBID-011 no `scoreSource=real`.

## CEO Route

CEO recommendation: create a repair evidence collection checklist next. The checklist should let PM classify whether the fix is dashboard schema cache refresh, exposed schema/table configuration, RLS/policy posture, or runner target/column mismatch. After that, CEO may decide whether to request a dashboard/manual repair, a migration repair packet, or a separately named bounded read-only diagnostic.

PM execution boundary: do not retry. Do not repair remotely in this slice. Preserve `publicDataSource=mock` and `scoreSource=mock`.

## Role Review

CEO: Accepted as the repair decision packet before any future retry. The project should accelerate by avoiding more governance around the already-known failure and focusing on the concrete repair evidence checklist.

PM: This packet closes the open question after the second failed retry and gives the next owner a bounded route. The next slice should be larger than a micro-gate: one checklist that covers schema exposure, cache, object, policy, target, and payload contract.

Engineering: The likely issue remains in the Supabase REST insert route, not candidate artifact generation or runner argument matching. Repair should compare exact relation names, schema exposure, cache, and write client behavior.

Data: Candidate artifact remains accepted at 1 run row and 180 price rows, but row coverage remains unchanged because no staging rows were created.

Security: Keep secrets out of logs and keep service-role use behind exact command gates. No remote mutation is allowed from this packet.

Investment: No signal quality, coverage, real-data, public source, or score-source claim may be upgraded.

## Next Slice

NEXT-SLICE-001 create `TW_EQUITY_SUPABASE_STAGING_WRITE_REPAIR_EVIDENCE_CHECKLIST`.

NEXT-SLICE-002 the checklist must identify the minimum evidence required before any dashboard repair, SQL/migration repair packet, read-only diagnostic, or third write attempt.

NEXT-SLICE-003 keep the runtime public posture mock-only until staging rows exist and a separate promotion packet is accepted.
