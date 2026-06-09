# TWII Real Handoff Intake Checklist

Updated: 2026-06-09

Status: `twii_real_handoff_intake_checklist_ready`

## Purpose

This checklist defines what A1, D, and PM must provide before a real TWII sanitized candidate artifact can be routed into the existing no-write packet-driven chain.

It is an intake checklist only. It does not create candidate data, fetch market data, write Supabase, mutate `daily_prices`, accept rows, score row coverage, promote source, or set real score.

## A1 Data Handoff

A1 must provide:

- `candidateArtifactPath`: local JSON path only.
- `artifactId`: no-secret artifact identifier.
- `lane=TWII`.
- `symbol=TWII`.
- `scope=twii_index_daily_prices_missing_rows`.
- `sourceLane`: one of `official-exchange-index`, `licensed-market-data-vendor`, or `internal-approved-feed`.
- `aggregateValidation`: aggregate counts only.
- `sanitizedAggregateOnly=true`.
- `rawPayloadIncluded=false`.
- `rowPayloadIncluded=false`.
- `stockIdPayloadIncluded=false`.
- `secretsIncluded=false`.

A1 must run:

```powershell
cmd.exe /c npm run report:twii-sanitized-candidate-artifact-chain-handoff -- --candidate-artifact-path <LOCAL_JSON_PATH>
cmd.exe /c npm run check:twii-sanitized-candidate-artifact-chain-handoff
```

## D Source Rights Handoff

D must provide no-secret confirmation for:

- `vendor-terms-evidence`;
- `internal-feed-owner-evidence`;
- `field-contract-evidence`;
- `asset-mapping-evidence`.

Each D reply must include:

- no-secret source/reference label;
- safe summary;
- remaining risk;
- no copied terms text;
- no private dashboard links;
- no credentials;
- no raw market data;
- no row payloads;
- no stock id payloads.

## PM Integration Handoff

PM must confirm:

- artifact handoff report is accepted;
- D four-slot source-rights/field/mapping evidence is accepted or explicitly routed as blocked;
- no-secret `attemptId` is safe;
- no-secret `decisionId` is present;
- no-secret `decisionSummary` is present;
- named packet scaffold renders successfully;
- named attempt packet gate accepts the rendered scaffold;
- packet-driven no-write chain smoke proof passes.

PM commands:

```powershell
cmd.exe /c npm run render:twii-bounded-data-acceptance-named-packet-scaffold -- --candidate-artifact-path <LOCAL_JSON_PATH> --attempt-id <ATTEMPT_ID> --decision-id <DECISION_ID> --decision-summary "<NO_SECRET_SUMMARY>"
cmd.exe /c npm run report:twii-bounded-data-acceptance-named-attempt-packet -- --packet-path <LOCAL_PACKET_JSON>
cmd.exe /c npm run run:twii-scaffold-to-packet-driven-chain-smoke-proof -- --candidate-artifact-path <LOCAL_JSON_PATH> --attempt-id <ATTEMPT_ID> --decision-id <DECISION_ID> --decision-summary "<NO_SECRET_SUMMARY>"
```

## Acceptance Meaning

Passing this checklist means only that the local no-write handoff path is operationally ready.

It does not approve production data movement, public real-data promotion, row coverage scoring, or real-score display.

## Stop Line

No SQL.

No Supabase.

No daily_prices mutation.

No market-data fetch or ingestion.

No staging rows.

No candidate row acceptance.

No row coverage scoring.

No raw payload output.

No row payload output.

No stock id payload output.

No secret output.

No public source or real-score promotion.

Runtime remains `publicDataSource=mock`.

Score remains `scoreSource=mock`.
