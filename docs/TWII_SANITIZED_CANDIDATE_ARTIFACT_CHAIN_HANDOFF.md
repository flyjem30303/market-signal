# TWII Sanitized Candidate Artifact Chain Handoff

Updated: 2026-06-09

Status: `twii_sanitized_candidate_artifact_chain_handoff_ready`

## Purpose

This handoff gate connects A1/D's future sanitized TWII candidate artifact to the packet-driven no-write chain.

It does not create candidate data. It only verifies that an existing local artifact is safe enough to be referenced by a CEO/PM named attempt packet.

## Command

Default path:

```powershell
cmd.exe /c npm run report:twii-sanitized-candidate-artifact-chain-handoff
```

Explicit local path:

```powershell
cmd.exe /c npm run report:twii-sanitized-candidate-artifact-chain-handoff -- --candidate-artifact-path <LOCAL_JSON_PATH>
```

## Accepted Output

The report may return `twii_sanitized_candidate_artifact_chain_handoff_ready_for_named_packet` and `accepted_for_named_attempt_packet_no_write_only` only when the existing local artifact passes the TWII candidate artifact validator:

- lane is `TWII`;
- symbol is `TWII`;
- scope is `twii_index_daily_prices_missing_rows`;
- source lane is approved for review;
- source-rights gate status references the TWII source-rights outcome gate;
- expected TWII window is `60`;
- review output policy is aggregate-only;
- raw payload flag is false;
- row payload flag is false;
- stock id payload flag is false;
- secrets flag is false;
- forbidden raw/source/row/secret keys are absent.

## Next Use

When this gate is accepted, PM may reference the artifact path in:

```json
{
  "candidateArtifactPath": "<LOCAL_JSON_PATH>",
  "mode": "no-write-preview",
  "targetLane": "TWII",
  "targetScope": "twii_index_daily_prices_missing_rows"
}
```

The next local command remains:

```powershell
cmd.exe /c npm run run:twii-bounded-data-acceptance-packet-driven-chain -- --packet-path <LOCAL_PACKET_JSON>
```

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
