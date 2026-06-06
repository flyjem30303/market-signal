# Taiwan All-Listed Universe Manifest Packet

Status: `taiwan_all_listed_universe_manifest_packet_ready_level_2_preexecution`

Date: 2026-06-07

## Purpose

This packet prepares the Level 2 Taiwan all-listed common-stock universe manifest for PM review. It is a local-only preexecution package, not a data file, not an ingestion run, and not a source-rights approval.

Level 2 is not the current MVP GOAL completion condition. The current MVP GOAL remains Level 1 row coverage at `360/360` for `TWII`, `0050`, `006208`, `2330`, `2382`, and `2308`. Level 2 is the next expansion stage after MVP row coverage proves the bounded pipeline, readback pattern, data-quality checks, and scoring gate.

## Existing Repo Evidence

The existing repo evidence says the stock master seed has been expanded to `1086` listed-stock records. This packet records that denominator evidence only as a planning input.

This packet does not generate the actual all-listed universe list, does not enumerate the `1086` records, and does not store stock-level row payloads. PM must treat the eventual manifest as a separately reviewed artifact.

Evidence anchors:

- `docs/COVERAGE_UNIVERSE_ROADMAP.md` records Level 2 as Taiwan listed company coverage after Level 1 MVP row coverage.
- `docs/COVERAGE_UNIVERSE_ROADMAP.md` records stock master seed evidence of `1086` listed-stock records.
- `PROJECT_STATUS.md` records that the listed common-stock master seed was expanded to `1086` records.

## Manifest Contract

The Level 2 manifest should be a sanitized denominator artifact with one row per eligible listed common stock. Required fields:

| Field | Required meaning |
| --- | --- |
| `stock_id` | Internal stable identifier for the stock master row. |
| `symbol` | Exchange-facing Taiwan stock symbol. |
| `name` | Company display name from the approved stock master source. |
| `market` | Country or market scope, expected `TW`. |
| `exchange` | Exchange venue, expected `TWSE` for this Level 2 packet. |
| `security_type` | Security class; Level 2 expects listed common stocks only. |
| `is_active` | Boolean active-listing flag used for denominator inclusion. |
| `listed_date` | Listing date when available and source-rights approved for use. |
| `delisted_date` | Delisting date or null; populated only when source and contract allow it. |
| `coverage_window` | Target trading-session window, initially `60` sessions unless PM changes the denominator policy. |
| `session_count` | Number of expected trading sessions in the selected coverage window for this security. |
| `expected_rows` | Expected `daily_prices` rows for this security after execution; normally equals `session_count`. |
| `source_rights_status` | Rights state such as `blocked_source_rights_unapproved`, `review_pending`, or `approved_for_named_execution_gate`. |
| `batch_id` | Deterministic batch identifier used for execution partitioning and readback reporting. |

Optional PM-owned fields may include industry, sector, calendar id, source label, source terms reference, exclusion reason, or quality downgrade class, but those are not required for this preexecution packet.

## Denominator Policy

Level 2 denominator policy is `active TWSE listed common stocks x coverage_window`.

Initial planning denominator:

- Seed evidence: `1086` listed-stock records.
- Default coverage window: `60` sessions.
- Planning formula: `1086 x 60 = 65160` expected rows before eligibility exclusions.

The formula is planning-only. The final denominator must be recalculated from the approved manifest after eligibility filters, source-rights state, calendar policy, active listing status, and delisting rules are reviewed.

Level 2 must not reuse the MVP `360` denominator. Level 1 and Level 2 are separate universes with separate completion criteria.

## Batch Strategy

The manifest should assign every eligible security to exactly one `batch_id`.

Recommended local planning rules:

- Use deterministic sorted batches by `exchange`, `security_type`, and `symbol`.
- Keep batch size small enough for bounded execution, readback, and rollback review.
- Produce batch-level denominators before any execution: symbols, session count, expected rows, source-rights status, and exclusion count.
- Do not mix securities with different source-rights states in the same executable batch.
- Treat each batch as independently reviewable: preflight, execution approval, write path, readback, scoring, and post-run review.
- Do not award full-universe coverage credit until all accepted batches pass readback and scoring gates.

Suggested batch states:

- `manifest_ready_not_executable`
- `blocked_source_rights_unapproved`
- `blocked_gap_strategy_incomplete`
- `approved_for_separately_named_execution_gate`
- `executed_pending_readback`
- `readback_passed_scoring_pending`
- `scoring_passed_batch_accepted`
- `batch_rejected_requires_retry_or_exclusion`

## Gap Strategy

The manifest must make gaps visible before any ingestion or write path is proposed.

Required gap classes:

- `missing_from_manifest`: stock master says active but no manifest row exists.
- `inactive_or_delisted`: record excluded because active listing state is false or delisted before the coverage window.
- `source_rights_blocked`: source license, retention, redistribution, field use, or derived analysis rights are not approved.
- `calendar_mismatch`: selected sessions do not align with the Taiwan trading calendar.
- `partial_window`: listed date, suspension, or data availability makes the full window unavailable.
- `field_contract_missing`: required OHLCV, turnover, date, symbol, or source-label fields are not approved.
- `readback_mismatch`: execution output does not match expected rows or keys.
- `quality_downgraded`: data exists but does not meet field-validity or scoring acceptance thresholds.

Gap handling rules:

- Missing sessions must be counted, not silently filled.
- Partial coverage must remain visible at security, batch, and full-universe levels.
- A gap may reduce accepted coverage; it must not be converted into row coverage points without PM acceptance.
- Exclusions require an explicit reason and must not shrink the denominator silently.
- Retry batches require a new batch review and must not overwrite the original evidence.

## Readback And Scoring Gate

Readback is required before any Level 2 row coverage claim.

Minimum readback checks:

- Manifest row count equals the approved denominator for the selected batch.
- Each `symbol` and `trade_date` key is unique in the accepted output.
- `session_count` and `expected_rows` match the approved `coverage_window`.
- Missing rows and duplicate rows are reported by symbol and batch.
- Source labels and source-rights states are preserved in aggregate review output.
- No secrets, raw payloads, or row payloads are printed in reports.

Minimum scoring gate:

- Batch-level observed rows, expected rows, missing rows, duplicate rows, and rejected rows are reported.
- Full Level 2 coverage is calculated from accepted batches only.
- Row coverage points remain blocked until PM accepts the readback and scoring output.
- `publicDataSource=mock` remains unchanged.
- `scoreSource=mock` remains unchanged.
- `publicDataSource=supabase` remains blocked.
- `scoreSource=real` remains blocked.

## Source-Rights Blockers

Level 2 is blocked unless source-rights review explicitly approves the named use case.

Required source-rights approvals before execution:

- historical daily OHLCV and turnover use;
- storage and retention of source-derived values;
- redistribution or public display limits;
- attribution wording;
- delay, incompleteness, and outage wording;
- derived analysis and scoring use;
- batch execution and retry policy;
- public-copy limits for real-data claims.

Blocked source-rights state:

`blocked_source_rights_unapproved`

If any required approval is missing, the manifest can remain a planning artifact only. It must not authorize execution, ingestion, storage, redistribution, public source promotion, row coverage points, or real scoring.

## Explicit Non-Executable Boundary

This Level 2 manifest packet:

- does not execute SQL;
- does not connect to Supabase;
- does not write Supabase;
- does not create staging rows;
- does not modify `daily_prices`;
- does not fetch raw market data;
- does not ingest raw market data;
- does not store raw market data;
- does not commit raw market data;
- does not output secrets;
- does not output raw payload;
- does not output row payload;
- does not generate the full `1086`-record universe list;
- does not approve source rights;
- does not approve redistribution;
- does not award row coverage points;
- does not promote `publicDataSource=supabase`;
- does not set `scoreSource=real`.

Current runtime boundaries remain:

- `publicDataSource=mock`
- `scoreSource=mock`

## PM Integration Checklist

PM should integrate this packet only as Level 2 preexecution planning evidence.

PM-owned next steps:

1. Decide the final Level 2 eligibility filter for active TWSE listed common stocks.
2. Produce or approve a sanitized all-listed manifest artifact in a separate gate.
3. Attach source-rights approvals or keep `blocked_source_rights_unapproved`.
4. Choose batch size, retry policy, and exclusion policy.
5. Register a readback checker and scoring gate before any execution.
6. Keep MVP Level 1 `360/360` completion separate from Level 2 all-listed progress.
