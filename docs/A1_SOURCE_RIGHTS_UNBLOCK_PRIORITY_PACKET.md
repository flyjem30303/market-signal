# A1 Source-Rights Unblock Priority Packet

Status: `a1_source_rights_unblock_priority_packet_ready_local_only_not_executable`

Date: 2026-06-15

Owner: A1 Data / Supabase / Market Evidence

Integration owner: PM mainline

## CEO Decision

CEO decision: `prioritize_etf_source_rights_unblock_while_twii_waits_at_final_operator_stopline`.

TWII has advanced past the older source-rights / field-contract ambiguity and now waits at the final authorization stopline. PM must not route A1 back to a TWII source-rights unblock task unless a regression occurs.

ETF is now the next source-rights unblock lane because it represents the larger remaining Phase 1 Level 1 coverage gap: `118` rows across `0050` and `006208`.

This packet is local-only. It does not approve source rights, field contracts, candidate generation, parser work, remote probing, SQL, Supabase access, staging rows, `daily_prices` mutation, row coverage points, public source promotion, or real scoring.

Current route: `etf_source_rights_unblock_first_twii_operator_stopline_parallel`.

Current outcome: `source_rights_priority_ready_execution_blocked`.

## Source Inputs

This priority packet is grounded in:

- `docs/A1_MVP_COVERAGE_CLOSURE_ROUTE_SUPPORT.md`
- `docs/TWII_FINAL_AUTHORIZATION_STOPLINE_GO_NO_GO_GATE.md`
- `docs/PHASE_1_DATA_ONLINE_EXECUTION_SELECTOR.md`
- `docs/ETF_SOURCE_RIGHTS_AND_CANDIDATE_READINESS_PACKET.md`
- `docs/A1_ETF_SOURCE_RIGHTS_OUTCOME_DECISION_SUPPORT.md`
- `docs/ETF_DAILY_PRICES_COVERAGE_COMPLETION_ROUTE.md`
- `docs/RUNTIME_SUMMARY_ALIGNMENT_FROM_FIRST_CLOSED_LOOP.md`
- `docs/LAUNCH_ENGINEERING_WORKSTREAM_BOARD.md`

Current accepted baseline:

- Full Level 1 MVP coverage is `182/360`.
- Remaining missing rows are `178`.
- TW equity is accepted at `180/180`.
- TWII is `0/60`, missing `60`, but it is waiting at `twii_final_authorization_stopline_go_no_go_gate`.
- ETF is `2/120`, missing `118`.
- Runtime remains `publicDataSource=mock`.
- Score remains `scoreSource=mock`.

## Priority Decision

| Lane | Missing rows | Current route | Rights / stopline state | Priority |
| --- | --- | --- | --- | --- |
| TWII | `60` | `twii_final_authorization_stopline_go_no_go_gate` | `waiting_external_operator_values_no_execution` | `operator_stopline_waiting_not_a1_source_rights_task` |
| ETF | `118` | `0050` / `006208` market-price daily coverage | `legal_and_redistribution_terms_unapproved` | `priority_1_source_rights_unblock` |

PM should keep TWII at the stopline and assign A1 to ETF source-rights evidence only. A1 must not fetch, probe, ingest, store, print, or commit raw market data.

## ETF Unblock Criteria

ETF may move from blocked planning to a later accepted source-rights outcome only if PM/CEO can record all of these safe non-secret conclusions:

1. one source lane is named from `twse-mis-etf-surface`, `issuer-official-pages`, `licensed-vendor`, or another separately reviewed lane;
2. source owner and access method are identifiable;
3. internal storage rights are documented;
4. retention, deletion, cache, rollback, and audit posture are documented;
5. redistribution, public display, export, screenshot, API reuse, and downstream-copy limits are documented;
6. attribution, delay, missing-data, stale-data, and source-gap wording are accepted;
7. derived analysis, QA summaries, row coverage scoring, and internal decision-support use are permitted or explicitly blocked;
8. rate limits, retry policy, outage behavior, and fair-use posture are documented;
9. ETF market-price `daily_prices` fields are accepted separately from NAV, holdings, premium-discount, issuer factsheet text, and intraday iNAV;
10. aggregate-only review policy excludes raw payload, row payload, stock id payload, and secrets.

Until those are accepted, ETF remains `legal_and_redistribution_terms_unapproved`.

## PM Integration Rule

PM may integrate A1 output only as one of:

- `accepted_for_rights_decision_only`;
- `rejected_for_execution_pending_rights`;
- `needs_bounded_repair`;
- `blocked_external_rights_pending`.

Any A1 output that includes raw payload, row payload, stock id payload, secret, remote fetch result, source-derived candidate data, SQL, Supabase write instruction, or real-promotion wording must be rejected.

## A1 Next Assignment

A1 next assignment: `prepare_etf_source_rights_acceptance_evidence_without_market_row_fetch`.

A1 should prepare a no-secret ETF source-rights evidence candidate for `0050` and `006208`, covering the ETF unblock criteria above.

TWII remains a PM/operator stopline lane. A1 should not reopen TWII source-rights work unless PM records a regression.

## A2 Coordination

A2 remains assigned to public trust and disclosure support.

A2 should keep ETF public copy mock-only, non-advice, and clear that ETF real data is not live. A2 cannot change the ETF data decision.

## Hard Stops

This packet does not authorize:

- SQL execution;
- Supabase connection;
- Supabase write;
- staging row creation;
- `daily_prices` mutation;
- raw market-data fetch;
- raw market-data ingest;
- raw market-data storage;
- raw market-data commit;
- raw payload output;
- row payload output;
- stock id payload output;
- secret output;
- TWII candidate generation;
- ETF candidate generation;
- external endpoint probe;
- source-rights approval;
- field-contract approval;
- row coverage points;
- public source promotion;
- `publicDataSource=supabase`;
- real score promotion;
- `scoreSource=real`;
- investment advice claim;
- public launch completion claim.

## Next Route

The next route is `prepare_etf_source_rights_acceptance_evidence_without_market_row_fetch`, not execution.

If no ETF source-rights evidence can be accepted, PM should keep ETF blocked and continue TWII only when the separate operator stopline receives external values outside the repository.

## Verification

Focused verification:

- `cmd.exe /c npm run check:a1-source-rights-unblock-priority-packet`
- `cmd.exe /c npm run check:phase-1-data-online-execution-selector`
- `cmd.exe /c npm run check:phase-1-etf-parallel-coverage-repair-selector`
- `cmd.exe /c npm run check:etf-source-rights-outcome-decision-gate`
