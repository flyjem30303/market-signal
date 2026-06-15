# Phase 1 Data Online A1/A2 Handoff Packet

Status: `phase_1_data_online_a1_a2_handoff_packet_ready_no_execution`

Owner: CEO/PM

Decision: `KEEP_A1_A2_PARALLEL_DATA_ONLINE_UNBLOCK_ACTIVE`

Purpose: turn the Phase 1 data-online parallel selector into concrete A1/A2 deliverables that PM can accept, reject, or send back for repair without pausing the mainline. This packet is a no-execution handoff standard. It does not fetch market data, store operator values, approve source rights, connect to Supabase, write rows, or promote public runtime data.

## Current Data-Online State

- Phase 1 data-online decision: `PUBLIC_RUNTIME_READY_BUT_DATA_ONLINE_NO_GO`
- Full Level 1 coverage: `182/360`, missing `178`
- TW equity coverage: `180/180`
- TWII missing rows: `60`
- ETF missing rows: `118`
- Runtime boundary: `publicDataSource=mock`
- Score boundary: `scoreSource=mock`

## Workstream Outputs

PM mainline:

- route: `integrate_only_accepted_aggregate_safe_outputs`
- accept only outputs that are aggregate-safe, no-secret, no-raw-payload, and aligned with the current mock boundary;
- keep `/`, `/briefing`, and `/stocks/[symbol]` truthful for public users while data remains `NO_GO`;
- do not convert this packet into execution, write, readback, or promotion approval.

A1 TWII:

- route: `submit_twii_operator_presence_shape_outcome_no_values`
- A1 TWII must not provide value bodies;
- provide only presence/shape status for operator decision, attestation, execute switch, confirmation phrase, and server-only credential presence;
- allowed statuses: `accepted`, `rejected`, `repair_required`, `deferred`;
- include only a sanitized one-sentence reason with no value bodies, secrets, payloads, market rows, trade-date lists, hashes, or credential content.

A1 ETF:

- route: `submit_etf_source_rights_acceptance_evidence_no_market_rows`
- A1 ETF must not provide market rows;
- classify source-rights acceptance evidence for the ETF lane without fetching, storing, summarizing, or committing source-derived ETF market rows;
- allowed statuses: `accepted`, `rejected`, `repair_required`, `deferred`;
- keep candidate artifact work schema-only until rights, field contract, coverage, write/readback, and promotion gates pass separately.

A2 trust/public copy:

- route: `submit_twii_etf_public_copy_guard_outcome`
- A2 must reject copy that implies real-time, complete coverage, official endorsement, or investment advice;
- review TWII and ETF labels, route copy, tooltip copy, disclosure copy, and status chips for mock-mode clarity;
- allowed statuses: `accepted`, `rejected`, `repair_required`, `deferred`;
- keep public language focused on market-state reading aid, data readiness, missing-data handling, delayed daily-after-close direction, and non-investment-advice boundaries.

## PM Acceptance Rules

PM may only integrate aggregate-safe accepted outcomes.

An outcome is acceptable only when it:

1. uses one of `accepted`, `rejected`, `repair_required`, or `deferred`;
2. includes no secrets, no raw payload, no endpoint response body, no operator value body, no row payload, no stock-id payload, and no market-row body;
3. does not claim source-rights approval unless the evidence says so in a separate accepted outcome;
4. does not award row coverage points;
5. does not change `publicDataSource=mock` or `scoreSource=mock`;
6. does not authorize SQL execution, Supabase read/write, staging rows, `daily_prices` mutation, ingestion, readback, or runtime promotion.

First executable lane still requires a separate authorization gate before any write, readback, promotion, or public real-data claim.

## Hard Boundaries

This packet does not authorize:

- SQL execution;
- Supabase connection, read, or write;
- staging-row creation;
- `daily_prices` mutation;
- TWII or ETF market-row fetch, ingestion, storage, output, or commit;
- raw payload output;
- endpoint response output;
- operator value storage;
- candidate row acceptance;
- row coverage points;
- `publicDataSource=supabase`;
- `scoreSource=real`;
- real-time market-data claims;
- official endorsement claims;
- investment advice.

## Completion Evidence

This packet is ready when its checker proves:

1. current data-online status remains `PUBLIC_RUNTIME_READY_BUT_DATA_ONLINE_NO_GO`;
2. coverage remains `182/360`, missing `178`;
3. TWII remains a `60`-row gap and ETF remains a `118`-row gap;
4. PM, A1 TWII, A1 ETF, and A2 output routes are explicit;
5. only `accepted`, `rejected`, `repair_required`, and `deferred` outcomes are allowed;
6. all no-secret, no-raw, no-fetch, no-write, no-promotion boundaries are present;
7. `publicDataSource=mock` and `scoreSource=mock` remain unchanged.
