# TW Equity Staging-First Authorization Packet

Updated: 2026-06-06

Status: `tw_equity_staging_first_authorization_packet_ready_not_executable`.

Trigger: `docs/DATA_REALIFICATION_ACCELERATION_GATE.md`.

## Purpose

This packet is the first accelerated data-realification packet for the TW equity lane. It converts the aggregate-incomplete readonly finding into a staging-first future authorization boundary.

It does not approve execution. It does not run SQL, connect to Supabase, write Supabase, create staging rows, modify production `daily_prices`, fetch market data, ingest market data, store source-derived rows, print secrets, print source payloads, promote public Supabase data-source mode, award row coverage points, or set `scoreSource=real`.

## Lane Scope

- Lane id: `tw-equity`.
- Symbols: `2330`, `2382`, `2308`.
- Symbol count: `3`.
- Expected trading sessions: `60`.
- Expected lane rows: `180`.
- Latest sanitized readonly aggregate evidence: observed `3` rows.
- Latest sanitized readonly aggregate evidence: missing `177` rows.
- Source review state: waiting for specific human source/legal classification.
- Runtime state: public data source remains mock.
- Score state: score source remains mock.

## Target Boundary

Future posture: staging first.

Proposed future staging target name: `tw_equity_daily_prices_staging`.

Production `daily_prices` remains blocked until a later promotion packet proves:

- staging validation passed;
- duplicate handling is accepted;
- rollback scope is accepted;
- retention scope is accepted;
- row coverage threshold is accepted;
- public source and score promotion gates are separately accepted.

This packet does not create the staging table and does not generate SQL.

## Future Authorization Must Name

Any later write-capable authorization must name all of the following in one packet:

- authorization id;
- exact command;
- exact source lane;
- exact symbols;
- exact expected session window;
- exact target relation;
- maximum rows allowed;
- service-role posture;
- RLS posture;
- rollback owner;
- rollback command posture;
- retention window;
- post-run review artifact path;
- no public promotion by itself;
- no score-source promotion by itself.

Missing any field stops execution.

## Report-Only Preflight Output Contract

Before any staging write, a report-only preflight must emit only:

- lane id;
- symbols;
- expected sessions;
- expected rows;
- latest observed rows;
- latest missing rows;
- source classification status;
- target relation proposal;
- validation rules summary;
- rollback posture;
- retention posture;
- files written: false;
- mutations: false;
- SQL executed: false;
- Supabase writes: false;
- market data fetched: false;
- source payloads printed: false;
- secrets printed: false;
- public source promotion: false;
- score source real: false.

## Acceptance Fields For Post-Run Review

Any future authorized run must immediately record:

- authorization id;
- exact command;
- execution count;
- target relation;
- source lane;
- symbols;
- sessions requested;
- rows proposed;
- rows written;
- rows rejected;
- validation status;
- duplicate handling result;
- rollback status;
- retention status;
- files written;
- mutations;
- SQL execution status;
- Supabase write status;
- source payload output status;
- secret output status;
- public runtime state;
- score runtime state;
- whether any promotion was attempted.

## CEO / PM Decision

CEO accepts this as the next acceleration packet, not as execution approval. PM should use this packet to request the next specific authorization only after source/legal classification and report-only preflight readiness are aligned.

A1 should continue preparing source/legal classification inputs. A2 should keep public copy mock-only and incomplete-data safe. Mainline should keep runtime stable and avoid visual polish that does not unblock data-realification.

## Stop Lines

Stop before:

- SQL;
- new Supabase remote attempt;
- Supabase write;
- staging row creation;
- production `daily_prices` mutation;
- market-data fetch;
- market-data ingestion;
- source-derived row storage;
- source payload printing;
- secret printing;
- public source promotion;
- row coverage point award;
- real score-source activation;
- investment advice, recommendation, ranking, professional indicator, model-confidence, or performance claim.
