# A1 Source-Rights Unblock Priority Packet

Status: `a1_source_rights_unblock_priority_packet_ready_local_only_not_executable`

Date: 2026-06-07

Owner: A1 Data / Supabase / Market Evidence

Integration owner: PM mainline

## CEO Decision

CEO decision: `prioritize_twii_source_rights_unblock_before_etf_while_preserving_etf_parallel_option`.

Runtime summary is now aligned with accepted first closed-loop evidence at `182/360`, so the next data-lane bottleneck is source-rights unblock. PM should prioritize TWII first because TWII has a narrower `60`-row lane, a selected first candidate of `official-exchange-index`, and an existing source-rights outcome gate. ETF remains a parallel option because it closes the larger `118`-row gap, but it is blocked by `legal_and_redistribution_terms_unapproved`.

This packet is local-only. It does not approve source rights, field contracts, candidate generation, parser work, remote probing, SQL, Supabase access, staging rows, `daily_prices` mutation, row coverage points, public source promotion, or real scoring.

Current route: `twii_source_rights_unblock_first_etf_parallel_rights_option`.

Current outcome: `source_rights_priority_ready_execution_blocked`.

## Source Inputs

This priority packet is grounded in:

- `docs/A1_MVP_COVERAGE_CLOSURE_ROUTE_SUPPORT.md`
- `docs/A1_TWII_SOURCE_RIGHTS_AND_CANDIDATE_READINESS_PACKET.md`
- `docs/TWII_SOURCE_RIGHTS_OUTCOME_GATE.md`
- `docs/A1_TWII_INDEX_FIELD_CONTRACT_DECISION_SUPPORT.md`
- `docs/ETF_SOURCE_RIGHTS_AND_CANDIDATE_READINESS_PACKET.md`
- `docs/A1_ETF_SOURCE_RIGHTS_OUTCOME_DECISION_SUPPORT.md`
- `docs/ETF_DAILY_PRICES_COVERAGE_COMPLETION_ROUTE.md`
- `docs/RUNTIME_SUMMARY_ALIGNMENT_FROM_FIRST_CLOSED_LOOP.md`
- `docs/LAUNCH_ENGINEERING_WORKSTREAM_BOARD.md`

Current accepted baseline:

- Full Level 1 MVP coverage is `182/360`.
- Remaining missing rows are `178`.
- TW equity is accepted at `180/180`.
- TWII is `0/60`, missing `60`.
- ETF is `2/120`, missing `118`.
- Runtime remains `publicDataSource=mock`.
- Score remains `scoreSource=mock`.

## Priority Decision

| Lane | Missing rows | Current route | Rights state | Priority |
| --- | --- | --- | --- | --- |
| TWII | `60` | `official-exchange-index` first, fallback `licensed-market-data-vendor` or `internal-approved-feed` | `not_approved_for_probe_or_ingestion` | `priority_1_narrowest_unblock` |
| ETF | `118` | `twse-mis-etf-surface`, `issuer-official-pages`, `licensed-vendor`, or separately accepted lane | `legal_and_redistribution_terms_unapproved` | `priority_2_larger_gap_parallel_option` |

PM should work TWII first unless ETF source-rights evidence becomes available sooner and can be accepted without remote probing or raw market-data handling.

## TWII Unblock Criteria

TWII may move from blocked planning to a later accepted source-rights outcome only if PM/CEO can record all of these safe non-secret conclusions:

1. source authority for TWII historical index values;
2. permitted future access method;
3. internal storage permission;
4. retention, deletion, cache, rollback, and audit posture;
5. redistribution, public display, export, screenshot, API reuse, and downstream-copy limits;
6. attribution, delay, official-value, incompleteness, and source-gap wording;
7. derived analysis, QA summary, and row coverage scoring permission or explicit block;
8. rate limits, retry policy, outage behavior, and fair-use posture;
9. product/commercial/global-use constraints;
10. index field contract basis for `trade_date`, `index_close`, optional OHLC/turnover, timezone, precision, rounding, revisions, corrections, and missing-session behavior;
11. aggregate-only review policy with no raw payload, row payload, stock id payload, or secrets.

Until those are accepted, TWII remains `not_approved_for_probe_or_ingestion`.

## ETF Parallel Option Criteria

ETF may jump ahead only if PM/CEO can accept a source lane without broad ambiguity:

1. one source lane is accepted from `twse-mis-etf-surface`, `issuer-official-pages`, `licensed-vendor`, or a separately named lane;
2. storage rights, retention rights, redistribution limits, and attribution wording are documented;
3. market-price `daily_prices` scope is accepted;
4. NAV, premium/discount, holdings, issuer metadata, and intraday indicative value are explicitly out of scope unless separate gates accept them;
5. derived analysis and row coverage scoring use are accepted or explicitly blocked;
6. delay, missing, partial, and unavailable ETF data wording is accepted;
7. aggregate-only candidate and review output policy is accepted.

Until those are accepted, ETF remains `legal_and_redistribution_terms_unapproved`.

## PM Integration Rule

PM may integrate A1 output only as one of:

- `accepted_for_rights_decision_only`;
- `rejected_for_execution_pending_rights`;
- `needs_bounded_repair`;
- `blocked_external_rights_pending`.

Any A1 output that includes raw payload, row payload, stock id payload, secret, remote fetch result, source-derived candidate data, SQL, Supabase write instruction, or real-promotion wording must be rejected.

## A1 Next Assignment

A1 next assignment: `twii_source_rights_unblock_decision_record_candidate`.

A1 should prepare a no-secret decision record candidate for TWII with fields for authority, access, storage, retention, redistribution, attribution, derived use, rate limits, commercial constraints, field-contract basis, and aggregate-only review policy.

A1 must not fetch, probe, ingest, store, print, or commit raw market data.

ETF remains a parallel watch lane. A1 should only switch ETF ahead of TWII if a safe source-rights evidence packet appears.

## A2 Coordination

A2 remains assigned to public trust and disclosure support.

A2 should not change visuals for this packet. If source-rights wording becomes accepted later, A2 may prepare route-level disclosure copy that preserves mock-only runtime, partial coverage, missing/delayed data, model limitation, risk disclosure, and non-investment-advice wording.

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

The next route is `twii_source_rights_unblock_decision_record_candidate`, not execution.

If no TWII source-rights evidence can be accepted, PM should either keep TWII blocked and prepare a licensed-vendor/internal-feed decision support packet, or switch to ETF only if ETF rights evidence becomes clearer.

## Verification

Focused verification:

- `node scripts/check-a1-source-rights-unblock-priority-packet.mjs`
- `cmd.exe /c npm run check:a1-source-rights-unblock-priority-packet`
- `cmd.exe /c npm run check:a1-mvp-coverage-closure-route-support`
- `cmd.exe /c npm run check:twii-source-rights-outcome-gate`
- `node scripts/check-review-gates.mjs`
