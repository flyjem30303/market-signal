# TWII Scaffold To Packet-Driven Chain Smoke Proof

Updated: 2026-06-09

Status: `twii_scaffold_to_packet_driven_chain_smoke_proof_ready`

## Purpose

This smoke proof verifies the local no-write TWII flow from sanitized artifact handoff through packet scaffold and packet-driven chain.

It proves that these local pieces connect:

1. sanitized candidate artifact handoff;
2. named packet scaffold renderer;
3. named attempt packet gate;
4. dry-run wrapper;
5. post-run review gate;
6. packet-driven chain summary.

## Command

```powershell
cmd.exe /c npm run run:twii-scaffold-to-packet-driven-chain-smoke-proof -- --candidate-artifact-path <LOCAL_JSON_PATH> --attempt-id <ATTEMPT_ID> --decision-id <DECISION_ID> --decision-summary "<NO_SECRET_SUMMARY>"
```

Optional output directory:

```powershell
cmd.exe /c npm run run:twii-scaffold-to-packet-driven-chain-smoke-proof -- --candidate-artifact-path <LOCAL_JSON_PATH> --attempt-id <ATTEMPT_ID> --decision-id <DECISION_ID> --decision-summary "<NO_SECRET_SUMMARY>" --out-dir tmp
```

## Accepted Output

The smoke proof may return `twii_scaffold_to_packet_driven_chain_smoke_proof_completed_no_write` and `accepted_no_write_smoke_proof` only when:

- packet scaffold renderer returns `twii_bounded_named_packet_scaffold_rendered_for_no_write_chain`;
- packet-driven chain returns `twii_bounded_data_acceptance_packet_driven_chain_completed_no_write`;
- `publicDataSource=mock`;
- `scoreSource=mock`.

## Stop Line

No SQL.

No Supabase.

No daily_prices mutation.

No market-data fetch or ingestion.

No staging rows.

No candidate row acceptance.

No row coverage scoring.

No source payload output.

No row payload output.

No stock id payload output.

No secret output.

No public source or real-score promotion.
