# TWII Bounded Data Acceptance Named Attempt Packet Gate

Updated: 2026-06-09

Status: `twii_bounded_data_acceptance_named_attempt_packet_gate_ready`

## Purpose

This gate validates a CEO/PM named attempt packet before the TWII bounded dry-run review chain is used.

It prevents an unscoped or unclear candidate artifact from entering the one-command chain.

## Packet Contract

The local packet JSON must include:

```json
{
  "packetKind": "twii_bounded_data_acceptance_named_attempt_packet",
  "attemptId": "twii-example-attempt",
  "candidateArtifactPath": "tmp/example-candidate-artifact.json",
  "mode": "no-write-preview",
  "targetLane": "TWII",
  "targetScope": "twii_index_daily_prices_missing_rows",
  "decisionReference": {
    "decisionId": "pm-ceo-decision-id",
    "owner": "CEO/PM",
    "decisionStatus": "accepted_for_no_write_dry_run_chain",
    "summary": "Short no-secret decision summary."
  },
  "commands": {
    "chainCommand": "cmd.exe /c npm run run:twii-bounded-data-acceptance-dry-run-review-chain -- --attempt-id <ATTEMPT_ID> --candidate-artifact-path <LOCAL_JSON_PATH> --mode no-write-preview",
    "postRunReviewCommand": "cmd.exe /c npm run report:twii-bounded-data-acceptance-post-run-review -- --summary-path <SUMMARY_JSON_PATH>"
  },
  "safety": {
    "publicDataSource": "mock",
    "scoreSource": "mock",
    "sqlAllowed": false,
    "supabaseAllowed": false,
    "marketDataFetchAllowed": false,
    "marketDataIngestAllowed": false,
    "dailyPricesMutationAllowed": false,
    "stagingRowsAllowed": false,
    "candidateRowsAcceptanceAllowed": false,
    "rowCoverageScoringAllowed": false,
    "sourcePayloadOutputAllowed": false,
    "secretOutputAllowed": false,
    "publicPromotionAllowed": false,
    "scoreSourceRealAllowed": false
  }
}
```

## Command

```powershell
cmd.exe /c npm run report:twii-bounded-data-acceptance-named-attempt-packet -- --packet-path <LOCAL_PACKET_JSON>
```

## Accepted Output

The gate may return `twii_bounded_data_acceptance_named_attempt_packet_accepted_for_no_write_chain` only when:

- `attemptId` is present and safe;
- `candidateArtifactPath` points to an existing local file;
- `mode=no-write-preview`;
- `targetLane=TWII`;
- `targetScope=twii_index_daily_prices_missing_rows`;
- `decisionReference.decisionStatus=accepted_for_no_write_dry_run_chain`;
- command references point to the dry-run review chain and post-run review gate;
- `publicDataSource=mock`;
- `scoreSource=mock`;
- all write, fetch, acceptance, scoring, payload-output, and promotion permissions are false.

## Stop Line

Accepted packet means the next allowed local step is only the no-write chain.

No SQL.

No Supabase.

No daily_prices mutation.

No market-data fetch or ingestion.

No staging rows.

No candidate row acceptance.

No row coverage scoring.

No public source or real-score promotion.
