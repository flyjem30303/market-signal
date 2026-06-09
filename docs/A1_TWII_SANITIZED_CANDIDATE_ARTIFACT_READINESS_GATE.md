# A1 TWII Sanitized Candidate Artifact Readiness Gate

Updated: 2026-06-09

Status: `a1_twii_sanitized_candidate_artifact_readiness_gate_ready_no_candidate_data`

## Purpose

This gate tells A1 and PM what must exist before a future TWII sanitized candidate artifact can be produced and reviewed.

It is intentionally a readiness gate, not a candidate generator. It does not create source-derived candidate data, fetch market data, run SQL, connect to Supabase, write Supabase, mutate `daily_prices`, award row coverage points, promote `publicDataSource=supabase`, or set `scoreSource=real`.

## Current Input Context

The previous TWII source-rights gate is now candidate-ready for PM/CEO review:

- `docs/TWII_SOURCE_RIGHTS_OUTCOME_GATE.md`
- `twii_source_rights_outcome_gate_candidate_ready_for_pm_review`
- D/A1 exact evidence intake: `4/4` TWII slots accepted.
- TWII bridge ledger: `4/4` evidence outcomes accepted for a separate source-rights outcome gate only.
- Accepted slots: `vendor-terms-evidence`, `internal-feed-owner-evidence`, `field-contract-evidence`, `asset-mapping-evidence`.

Coverage context:

- Level 1 MVP row coverage remains `182/360`.
- TW equity sub-scope remains `180/180`.
- TWII sub-scope remains `0/60`.
- ETF sub-scope remains `2/120`.
- TWII target candidate coverage window remains `60` sessions.

Runtime context:

- `publicDataSource=mock`
- `scoreSource=mock`

## Required Future Artifact Contract

A future TWII sanitized candidate artifact must be a local JSON artifact with metadata and aggregate counts only.

Required top-level fields:

| Field | Required value or rule |
| --- | --- |
| `artifactId` | PM-approved identifier, for example `twii-sanitized-candidate-YYYYMMDD`. |
| `lane` | `TWII`. |
| `assetType` | `index`. |
| `symbol` | `TWII`. |
| `scope` | `twii_index_daily_prices_missing_rows`. |
| `sourceLane` | One accepted lane from `official-exchange-index`, `licensed-market-data-vendor`, or `internal-approved-feed`. |
| `sourceRightsGateStatus` | Must reference `twii_source_rights_outcome_gate_candidate_ready_for_pm_review` or later accepted gate status. |
| `fieldContractVersion` | PM-approved TWII index field contract reference. |
| `coverageWindowSessions` | `60` unless PM changes the route in a later gate. |
| `alreadyObservedRows` | `0` for the current TWII lane. |
| `candidateMissingRows` | `60` for the current TWII lane. |
| `expectedRows` | `60` for the current TWII lane. |
| `reviewOutputPolicy` | `aggregate_only_no_raw_or_row_payloads_no_stock_id_payloads`. |
| `sanitizedAggregateOnly` | `true`. |
| `rawPayloadIncluded` | `false`. |
| `rowPayloadIncluded` | `false`. |
| `stockIdPayloadIncluded` | `false`. |
| `secretsIncluded` | `false`. |

## Sanitized Aggregate Rules

The future artifact may include only:

- aggregate expected row counts;
- aggregate candidate row counts;
- aggregate missing/rejected/duplicate counts;
- field names, not field values;
- source lane labels, not source bodies;
- PM-approved authorization and gate ids;
- validation status labels;
- no-secret risk labels.

The future artifact must not include:

- raw payload;
- source response body;
- source URL with tokens or query credentials;
- row payload;
- per-row source values;
- stock id payload;
- source-derived real candidate rows;
- secrets;
- service role keys;
- SQL snippets for execution;
- public redistribution claims;
- committed market-data files.

## Required Future Sequence

Before any future TWII candidate artifact is accepted by PM, the following sequence must pass:

1. `source_rights_candidate_review_passed`: PM/CEO accepts the TWII source-rights outcome gate candidate.
2. `field_contract_reference_attached`: PM attaches a TWII index field-contract reference for calendar, session, timezone, precision, missing-session behavior, and `daily_prices` mapping.
3. `artifact_contract_confirmed`: A1 confirms the artifact matches the required top-level fields above.
4. `sanitized_aggregate_policy_confirmed`: A1 confirms aggregate-only output and all forbidden payload flags are false.
5. `post_run_review_template_ready`: PM has a post-run review template ready before any later attempt.
6. `readback_gate_ready`: PM has a bounded aggregate readback gate ready before any later write/readback attempt.

## Next Allowed Step

The next allowed step after this gate is a future local-only TWII candidate artifact contract or self-check gate.

This readiness gate does not authorize A1 to produce a filled source-derived artifact. A later explicit candidate artifact gate must decide whether a filled artifact may be generated, validated, or handed to PM.

## Hard Stop

This gate:

- does not run SQL;
- does not connect to Supabase;
- does not read Supabase;
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
- does not output stock id payload;
- does not create a filled TWII candidate artifact;
- does not generate source-derived TWII candidate rows;
- does not approve a TWII probe;
- does not award row coverage points;
- does not promote `publicDataSource=supabase`;
- does not set `scoreSource=real`;
- does not claim public launch completion.

## Verification

Use:

```powershell
cmd.exe /c npm run report:a1-twii-sanitized-candidate-artifact-readiness-gate
cmd.exe /c npm run check:a1-twii-sanitized-candidate-artifact-readiness-gate
```
