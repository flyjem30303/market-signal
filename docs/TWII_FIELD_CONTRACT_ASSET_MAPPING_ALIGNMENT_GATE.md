# TWII Field Contract Asset Mapping Alignment Gate

Status: `twii_field_contract_asset_mapping_aligned_for_sanitized_candidate_gate_no_execution`

Date: 2026-06-15

Owner: PM mainline

Support lanes: A1 Data / Supabase / Market Evidence, A2 Runtime / Launch Trust

## CEO Decision

Decision: `align_twii_field_contract_and_asset_mapping_for_sanitized_candidate_gate_only`

CEO/PM aligns the newer source-rights acceptance gate with the existing TWII write prerequisite ledger and write-readiness consolidation packet. The practical outcome is that the minimum TWII field contract and safe index asset mapping may be carried into the next sanitized candidate artifact readiness gate.

This alignment does not authorize source fetch, candidate row generation, SQL, Supabase connection, Supabase write, `daily_prices` mutation, row coverage scoring, public source promotion, or real scoring.

Minimum accepted field contract: `trade_date + index_close + source_label + source_rights_status + validation_status`

Accepted asset lane: `TWII:index`

Target table remains `daily_prices`

Target scope remains `twii_index_daily_prices_missing_rows`

Next PM route: `twii_sanitized_candidate_artifact_readiness_gate`

publicDataSource remains `mock`

scoreSource remains `mock`

TWII execution remains `false`

## Why This Gate Exists

The project had two valid but differently timed records:

- Older A1 planning packets still described field-contract and asset-mapping questions as unresolved.
- Newer PM intake records already accepted `source-rights-decision`, `field-contract-decision`, and `asset-mapping-decision` for future candidate-gate preparation only.

This gate resolves that sequencing ambiguity. PM should no longer re-open the old unresolved wording as the active blocker. The active blocker now moves forward to sanitized candidate artifact readiness, while all execution boundaries remain closed.

## Accepted Alignment

Accepted for sanitized candidate-gate preparation only:

- `source-rights-decision`;
- `field-contract-decision`;
- `asset-mapping-decision`;
- `TWII:index` as the safe index asset lane;
- `daily_prices` as the future bounded target table;
- `twii_index_daily_prices_missing_rows` as the future bounded target scope;
- `trade_date`, `index_close`, `source_label`, `source_rights_status`, and `validation_status` as the minimum field contract.

Still separate or blocked:

- optional `index_open`, `index_high`, `index_low`, and `turnover`;
- source-derived candidate row generation;
- market endpoint fetch;
- SQL;
- Supabase read or write;
- staging rows;
- `daily_prices` mutation;
- readback against real rows;
- Level 1 row coverage scoring;
- runtime promotion.

## Evidence Basis

This alignment is grounded in local no-secret evidence only:

- `data/source-gates/twii-source-rights-outcome-acceptance.json` records `twii_source_rights_outcome_accepted_for_next_gate_only_no_execution`.
- `data/source-gates/twii-write-prerequisite-intake-ledger.json` records six accepted prerequisite rows, including source-rights, field-contract, and asset-mapping decisions.
- `cmd.exe /c npm run check:twii-write-readiness-packet-consolidation` reports `twii_write_readiness_packet_consolidation_prerequisites_accepted_future_gate_ready`.
- `docs/TWII_WRITE_READINESS_PACKET_CONSOLIDATION.md` keeps implementation and execution blocked while allowing the future candidate gate to be prepared.

## Next Gate

The next PM route is `twii_sanitized_candidate_artifact_readiness_gate`.

That next gate must verify only aggregate/sanitized artifact readiness:

- candidate artifact path;
- artifact id;
- scope;
- expected rows;
- candidate missing rows;
- duplicate/rejected/missing aggregate counts;
- source-rights and field-contract references;
- stop lines for raw payload, row payload, stock id payload, secrets, SQL, Supabase, and runtime promotion.

It still must not fetch, ingest, write, score, or promote.

## Hard Stop

This gate does not authorize:

- SQL;
- Supabase connection;
- Supabase read;
- Supabase write;
- staging row creation;
- `daily_prices` mutation;
- market-data fetch;
- source-derived candidate row generation;
- candidate row acceptance;
- readback against real rows;
- row coverage scoring;
- public source promotion;
- `scoreSource=real`;
- raw payload output;
- row payload output;
- stock id payload output;
- secret output.

## Verification

Focused verification:

- `cmd.exe /c npm run check:twii-field-contract-asset-mapping-alignment-gate`

Milestone verification:

- `cmd.exe /c npx tsc --noEmit`
- `cmd.exe /c npm run check:review-gates`
