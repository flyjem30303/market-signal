# TWII Bounded Data Acceptance Named Packet Scaffold

Updated: 2026-06-09

Status: `twii_bounded_data_acceptance_named_packet_scaffold_ready`

## Purpose

This renderer turns a validated TWII sanitized candidate artifact path into a no-secret named attempt packet scaffold for the packet-driven no-write chain.

It exists to reduce manual packet JSON mistakes. It does not create candidate data, fetch market data, write Supabase, mutate `daily_prices`, accept rows, score coverage, promote source, or set real score.

## Command

```powershell
cmd.exe /c npm run render:twii-bounded-data-acceptance-named-packet-scaffold -- --candidate-artifact-path <LOCAL_JSON_PATH> --attempt-id <ATTEMPT_ID> --decision-id <DECISION_ID> --decision-summary "<NO_SECRET_SUMMARY>" --out tmp/twii-bounded-named-attempt-packet-<ATTEMPT_ID>.json
```

## Required Inputs

- `candidate-artifact-path`: existing local sanitized aggregate-only TWII candidate artifact.
- `attempt-id`: safe identifier for the no-write attempt.
- `decision-id`: PM/CEO decision reference.
- `decision-summary`: short no-secret decision summary.
- optional `owner`, default `CEO/PM`.
- optional `out`, default under `tmp`.

## Rendered Packet Status

The renderer may return `twii_bounded_named_packet_scaffold_rendered_for_no_write_chain` only after:

- `report:twii-sanitized-candidate-artifact-chain-handoff` accepts the candidate artifact path;
- packet scaffold contains `mode=no-write-preview`;
- packet scaffold contains `decisionStatus=accepted_for_no_write_dry_run_chain`;
- packet scaffold contains the dry-run chain command and post-run review command;
- `publicDataSource=mock`;
- `scoreSource=mock`.

The rendered packet must then pass:

```powershell
cmd.exe /c npm run report:twii-bounded-data-acceptance-named-attempt-packet -- --packet-path <LOCAL_PACKET_JSON>
```

## Next Use

After the scaffold passes the named packet gate, the next command remains:

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

No source payload output.

No secret output.

No public source or real-score promotion.

Runtime remains `publicDataSource=mock`.

Score remains `scoreSource=mock`.
