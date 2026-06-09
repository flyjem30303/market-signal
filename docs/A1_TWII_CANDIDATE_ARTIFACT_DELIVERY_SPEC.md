# A1 TWII Candidate Artifact Delivery Spec

Updated: 2026-06-09

Status: `a1_twii_candidate_artifact_delivery_spec_ready_no_candidate_data`

## Purpose

This spec tells A1 how to hand a future sanitized TWII candidate artifact to PM without guessing the contract.

It does not create a candidate artifact, retrieve market data, store source payloads, connect to Supabase, run SQL, write staging rows, mutate `daily_prices`, promote public data source, award row coverage points, or set `scoreSource=real`.

## Delivery Path

Default PM intake path:

```text
data/candidates/twii-sanitized-candidate.json
```

Alternate local path:

```text
A1_TWII_CANDIDATE_ARTIFACT_PATH=<local-json-path>
```

The default path is intentionally empty until A1 supplies a real sanitized aggregate-only artifact. Do not commit a filled artifact unless CEO separately approves committing sanitized candidate data.

## Required Top-Level Fields

The artifact must be JSON and must include:

- `artifactId`;
- `lane=TWII`;
- `assetType=index`;
- `symbol=TWII`;
- `scope=twii_index_daily_prices_missing_rows`;
- `sourceLane` as one of `official-exchange-index`, `licensed-market-data-vendor`, or `internal-approved-feed`;
- `sourceRightsGateStatus=twii_source_rights_outcome_gate_candidate_ready_for_pm_review` or a later accepted source-rights status;
- `fieldContractVersion`;
- `coverageWindowSessions=60`;
- `alreadyObservedRows=0`;
- `candidateMissingRows=60`;
- `expectedRows=60`;
- `reviewOutputPolicy=aggregate_only_no_raw_or_row_payloads_no_stock_id_payloads`;
- `sanitizedAggregateOnly=true`;
- `rawPayloadIncluded=false`;
- `rowPayloadIncluded=false`;
- `stockIdPayloadIncluded=false`;
- `secretsIncluded=false`;
- `aggregateValidation`.

## Required Aggregate Validation Fields

`aggregateValidation` must include aggregate counts only:

- `expectedRows`;
- `candidateRows`;
- `duplicateRows`;
- `rejectedRows`;
- `missingRows`;
- `fieldNames`;
- `validationStatus` as `draft` or `pending_pm_review`.

It must not include per-row source values, per-date rows, stock id payloads, raw source rows, source response bodies, secrets, credentials, SQL execution snippets, or public redistribution claims.

## Forbidden Content

The artifact must not include:

- `rawPayload`;
- `rawSourcePayload`;
- `sourcePayload`;
- `sourceRows`;
- `rawRows`;
- `rowPayload`;
- `stockIdPayload`;
- `sourceUrlPayload`;
- `html`;
- `csv`;
- `secret`;
- `secrets`;
- service-role key material;
- row-level source output printed to console;
- public redistribution claims.

## PM Intake Commands

Default path:

```powershell
cmd.exe /c npm run report:a1-twii-candidate-artifact-self-check
cmd.exe /c npm run check:a1-twii-candidate-artifact-self-check
cmd.exe /c npm run report:pm-twii-candidate-intake-review
cmd.exe /c npm run check:pm-twii-candidate-intake-review
```

Alternate path:

```powershell
set A1_TWII_CANDIDATE_ARTIFACT_PATH=<local-json-path>
cmd.exe /c npm run report:a1-twii-candidate-artifact-self-check
cmd.exe /c npm run check:a1-twii-candidate-artifact-self-check
cmd.exe /c npm run report:pm-twii-candidate-intake-review
cmd.exe /c npm run check:pm-twii-candidate-intake-review
```

Passing intake only means PM may prepare the next local report-only dry-run decision gate. It does not execute a probe, parser, SQL, Supabase operation, write, readback, or row coverage scoring.

## Stop Line

No candidate artifact is created in this slice.

No market-data retrieval, market-data ingestion, Supabase connection, SQL, Supabase write, staging row creation, production `daily_prices` mutation, source payload output, secret output, public source promotion, row coverage point award, or `scoreSource=real` occurred.
