# TW Equity Staging-First Write Authorization Packet V1

Updated: 2026-06-06

Status: `tw_equity_staging_first_write_authorization_packet_v1_ready_not_authorized`.

Trigger: `scripts/report-tw-equity-staging-first-preflight.mjs`.

## Purpose

This packet defines the minimum future authorization shape for a TW equity staging-first write. It is designed so CEO/PM can later request one exact, reviewable action instead of reopening broad governance.

This packet is not execution approval. It does not run SQL, connect to Supabase, write Supabase, create staging rows, mutate production `daily_prices`, fetch market data, ingest market data, store source-derived rows, print secrets, print source payloads, promote public Supabase data-source mode, award row coverage points, or set `scoreSource=real`.

## Current Preflight Evidence

- Preflight runner: `scripts/report-tw-equity-staging-first-preflight.mjs`.
- Current preflight status: `blocked_until_source_classification_and_write_authorization`.
- Lane id: `tw-equity`.
- Symbols: `2330`, `2382`, `2308`.
- Expected trading sessions: `60`.
- Expected rows: `180`.
- Latest observed rows: `3`.
- Latest missing rows: `177`.
- Source classification status: `waiting_human_source_legal_classification`.
- Target relation proposal: `tw_equity_daily_prices_staging`.
- Post-run review readiness: `template_fields_defined_not_executable`.

## Future Exact Command Shape

The later executable command must be named in a separate approval and must use this exact shape:

```powershell
node scripts/run-tw-equity-staging-write-once.mjs --authorization-id "<AUTHORIZATION_ID>" --lane "tw-equity" --symbols "2330,2382,2308" --sessions 60 --target "tw_equity_daily_prices_staging" --max-rows 180 --post-run-review "docs/reviews/TW_EQUITY_STAGING_FIRST_WRITE_POST_RUN_REVIEW_<DATE>.md"
```

This command does not exist yet and must not be created or executed from this packet.

## Required Authorization Fields

Before a future write-capable runner may be created or run, the CEO/chairman approval must state all fields below:

- authorization id;
- exact command;
- lane: `tw-equity`;
- symbols: `2330`, `2382`, `2308`;
- sessions: `60`;
- target relation: `tw_equity_daily_prices_staging`;
- maximum rows allowed: `180`;
- source classification reference;
- service-role posture;
- RLS posture;
- rollback owner;
- rollback dry-run command posture;
- retention window;
- post-run review artifact path;
- no retry without a new approval;
- no public promotion by itself;
- no score-source promotion by itself.

Missing any field blocks execution.

## Required Pre-Execution Checks

Run all of these before any future write-capable command:

```powershell
node scripts/check-data-realification-acceleration-gate.mjs
node scripts/check-tw-equity-staging-first-authorization-packet.mjs
node scripts/check-tw-equity-staging-first-preflight-runner.mjs
node scripts/report-tw-equity-staging-first-preflight.mjs
node scripts/check-review-gates.mjs
```

All checks must pass. The preflight report must still show no files written, no mutations, no SQL, no Supabase connection, no Supabase writes, no market-data fetch, no ingestion, no source payload output, no secrets, public data source mock, and score source mock.

## Rollback Contract

Rollback must be scoped by `authorization id` and target relation.

Rollback must:

- start as dry-run only;
- report affected row counts before any destructive cleanup exists;
- never touch production `daily_prices` from this packet;
- require a separate cleanup approval if staging rows are actually written later.

## Retention Contract

Retention must be named before storing any source-derived row.

The first staging write authorization must state:

- staging retention window;
- whether source-derived rows may be retained after validation;
- cleanup owner;
- cleanup timing;
- whether rejected rows are retained or discarded.

If retention is missing, execution is blocked.

## Post-Run Review Acceptance Fields

The immediate post-run review must record:

- authorization id;
- exact command;
- execution count;
- target relation;
- lane;
- symbols;
- sessions requested;
- max rows allowed;
- rows proposed;
- rows written;
- rows rejected;
- duplicate handling result;
- validation status;
- rollback status;
- retention status;
- files written;
- mutations;
- SQL execution status;
- Supabase connection status;
- Supabase write status;
- market-data fetch status;
- ingestion status;
- source payload output status;
- secret output status;
- public runtime state;
- score runtime state;
- promotion attempted: false.

## Stop Lines

Stop before:

- creating the write-capable runner;
- running SQL;
- connecting to Supabase;
- writing Supabase;
- creating staging rows;
- mutating production `daily_prices`;
- fetching market data;
- ingesting market data;
- storing source-derived rows;
- printing source payloads;
- printing secrets;
- promoting public source;
- awarding row coverage points;
- activating real score source.

## CEO Recommendation

CEO recommends this packet as the next compressed authorization surface. The next safe implementation slice is a local-only checker and optional post-run review template. Do not create the future write runner until source classification and explicit write authorization are present.
