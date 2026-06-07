# A1 TWII Index Field-Contract Decision Support

Status: `a1_twii_index_field_contract_decision_support_ready_local_only_not_executable`

Date: 2026-06-07

## Purpose

This A1 Data / Supabase / Market Evidence packet supports PM source-rights and field-contract gate planning for the TWII index lane. It focuses on field-contract questions only: which index fields may map to future `daily_prices` coverage, what remains unresolved, and what must stay blocked before any source-rights, candidate, probe, staging, write, readback, or scoring work.

This packet does not approve source rights, does not approve a parser, does not approve a report-only probe, and does not generate TWII candidates.

## Current Repo Evidence

Current Level 1 MVP row coverage:

- Level 1 MVP overall: `182/360`.
- Full-scope status: `blocked_incomplete`.
- `TWII`: `0/60`.
- `0050`: `1/60`.
- `006208`: `1/60`.
- TW equity sub-scope: `180/180`.

Current TWII source-selection evidence:

- Target symbol: `TWII`.
- Selected first candidate: `official-exchange-index`.
- Selection status: `accepted_for_rights_and_field_contract_review_only`.
- Review state: `not_approved_for_probe_or_ingestion`.
- Observed rows: `0`.
- `publicDataSource=mock`.
- `scoreSource=mock`.

Evidence anchors:

- `docs/TW_EQUITY_ROW_COVERAGE_SCORING_GATE.md`.
- `docs/reviews/TWII_SOURCE_SELECTION_ACCEPTANCE_GATE_2026-06-01.md`.
- `docs/reviews/TWII_SOURCE_RIGHTS_FIELD_CONTRACT_REVIEW_PACKET_2026-06-01.md`.
- `docs/A1_TWII_SOURCE_RIGHTS_AND_CANDIDATE_READINESS_PACKET.md`.
- `src/lib/twii-source-selection-packet.ts`.

## Field-Contract Decision Questions

The existing TWII rights and field-contract review packet records all field questions as unresolved. PM should keep TWII at `not_approved_for_probe_or_ingestion` until the following field decisions are accepted.

| Field-contract item | Decision support | Current state |
| --- | --- | --- |
| `trade_date` | Must map to the official Taiwan market session date. Calendar basis must distinguish trading sessions, holidays, typhoon closures, and source outages. | unresolved |
| `index_close` | Required for the minimum TWII index daily coverage contract if the accepted source provides official end-of-day index value. | unresolved |
| `index_open` | Optional. Include only if the accepted source provides an official open value with stable definition. | unresolved |
| `index_high` | Optional. Include only if the accepted source provides official high value and intraday meaning is documented. | unresolved |
| `index_low` | Optional. Include only if the accepted source provides official low value and intraday meaning is documented. | unresolved |
| `turnover` | Optional. Include only if official market turnover or value field definition is accepted and not confused with constituent stock volume. | unresolved |
| `source_label` | Required for any future candidate/readback artifact. Attribution wording must be accepted by PM/CEO. | unresolved |
| `source_rights_status` | Required. Must remain blocked or pending until PM/CEO accepts rights in a separate gate. | unresolved |
| `validation_status` | Required for aggregate review output; must not expose raw row payload. | unresolved |
| `batch_id` | Required only for future bounded execution partitioning after a separate gate. | unresolved |

Minimum viable field contract:

- `symbol=TWII`;
- `asset_type=index`;
- `trade_date`;
- `index_close`;
- `source_label`;
- `source_rights_status`;
- `validation_status`;
- aggregate-only `expected_rows`, `observed_rows`, `missing_rows`, and `rejected_rows` in review output.

Optional fields must not block the minimum contract unless PM decides TWII coverage requires them:

- `index_open`;
- `index_high`;
- `index_low`;
- `turnover`.

## Calendar And Session Rules

PM should require a calendar/session decision before any future TWII candidate gate:

- `coverage_window` remains `60` sessions unless PM changes Level 1 denominator policy.
- Expected TWII rows remain `60`.
- Observed TWII rows remain `0`.
- Missing TWII rows remain `60`.
- Taiwan session calendar must be explicit before candidate generation.
- Holiday and closure handling must be explicit before candidate generation.
- Missing session must mean the trading session is expected but absent from source-derived coverage.
- Source gap must mean the source failed, omitted, revised, or withheld an expected session.
- Calendar gap and source gap must be reported separately in aggregate-only review output.

## Timezone And Timestamp Rules

TWII field contract should preserve Taiwan market time:

- Expected timezone: `Asia/Taipei`.
- `trade_date` must be interpreted as Taiwan market session date, not UTC date.
- Future source timestamp, if any, must be aggregate-review metadata only unless a separate gate accepts it.
- Intraday timestamp semantics are out of scope for this Level 1 daily coverage packet.

## Precision And Rounding Rules

PM should decide these before any future candidate artifact:

- Decimal precision for `index_close`.
- Decimal precision for optional `index_open`, `index_high`, and `index_low`.
- Rounding policy for display and storage.
- Whether source revisions or corrections replace prior values, create rejected rows, or require a separate correction gate.
- Whether values must be non-negative numbers and whether zero is valid only for missing/rejected status, not for accepted index value.

## daily_prices Mapping

TWII mapping to `daily_prices` remains a field-contract question, not an approved implementation.

Mapping constraints:

- TWII must remain an `index` asset lane.
- TWII field names should not be treated as individual stock OHLCV.
- `index_close` may map to the daily index value only after source-rights and field-contract acceptance.
- Optional `index_open`, `index_high`, `index_low`, and `turnover` require explicit source field acceptance.
- Mapping to an internal stock id or market asset id remains unresolved.
- Stock id payload is forbidden in this decision support packet and in any sanitized review output unless PM opens a separate safe identifier mapping gate.
- This packet does not modify `daily_prices`.

## Missing-Session Vs Source-Gap Decision

PM should require future gates to classify gaps before scoring:

| Gap class | Meaning | Allowed use now |
| --- | --- | --- |
| `calendar_gap` | No Taiwan market trading session was expected. | Planning only. |
| `source_gap` | A session was expected, but the source did not provide an accepted value. | Planning only. |
| `field_contract_gap` | Source provides data, but field meaning, precision, timezone, or mapping is unresolved. | Planning only. |
| `rights_gap` | Source provides data, but storage, attribution, redistribution, or derived use is not accepted. | Planning only. |
| `validation_gap` | Future aggregate validation rejects an otherwise available session. | Planning only. |

No gap class awards row coverage points from this packet.

## Future Gate Support

This packet may support a future PM source-rights/field-contract gate if PM wants to proceed. That future gate must still be separate and must:

1. Accept or reject `official-exchange-index` for field-contract review beyond local planning.
2. Decide whether `index_close` alone is the minimum Level 1 contract.
3. Decide whether `index_open`, `index_high`, `index_low`, and `turnover` are in scope.
4. Record calendar/session rules.
5. Record `Asia/Taipei` timezone handling.
6. Record precision, rounding, revision, and correction handling.
7. Record missing-session vs source-gap classification.
8. Record safe asset-id mapping without exposing stock id payload.
9. Keep any future exact command, candidate generation, probe, staging/write, readback, and scoring gate separate.

## Hard Stop

This packet:

- does not run SQL;
- does not connect to Supabase;
- does not write Supabase;
- does not create staging rows;
- does not modify `daily_prices`;
- does not fetch raw market data;
- does not ingest raw market data;
- does not store raw market data;
- does not output secrets;
- does not output raw payload;
- does not output row payload;
- does not output stock id payload;
- does not produce TWII candidates;
- does not probe external endpoint;
- does not give row coverage points;
- does not promote `publicDataSource=supabase`;
- does not set `scoreSource=real`.

Current runtime and scoring boundaries remain:

- `publicDataSource=mock`;
- `scoreSource=mock`.

## PM Intake Checklist

PM can use this decision support when:

- `npm run check:a1-twii-index-field-contract-decision-support` passes.
- `npm run check:a1-twii-source-rights-and-candidate-readiness-packet` still confirms TWII `0/60` and local-only posture.
- `npm run check:twii-source-selection-packet` still confirms `official-exchange-index` as review-only first candidate.
- `npm run check:twii-source-rights-field-contract-review-packet` still confirms `not_approved_for_probe_or_ingestion`.
- `npm run check:tw-equity-row-coverage-scoring-gate` still confirms Level 1 MVP `182/360`.
