# TWII Bounded Data Acceptance Packet-Driven Chain

Updated: 2026-06-09

Status: `twii_bounded_data_acceptance_packet_driven_chain_ready`

## Purpose

This command runs the TWII bounded no-write flow from a single named attempt packet.

It first validates the packet through the named attempt packet gate. Only after that gate is accepted does it execute the dry-run review chain.

## Command

```powershell
cmd.exe /c npm run run:twii-bounded-data-acceptance-packet-driven-chain -- --packet-path <LOCAL_PACKET_JSON>
```

Optional output directory:

```powershell
cmd.exe /c npm run run:twii-bounded-data-acceptance-packet-driven-chain -- --packet-path <LOCAL_PACKET_JSON> --out-dir tmp
```

## Chain Steps

1. Read the local named attempt packet.
2. Run `report:twii-bounded-data-acceptance-named-attempt-packet`.
3. If the packet is accepted, read `attemptId`, `candidateArtifactPath`, and `mode` from the packet.
4. Run `run:twii-bounded-data-acceptance-dry-run-review-chain`.
5. Write a sanitized packet-driven summary.

## Accepted Output

The command may return `twii_bounded_data_acceptance_packet_driven_chain_completed_no_write` and `accepted_no_write_packet_driven_chain` only when:

- named attempt packet gate is accepted;
- dry-run review chain completes no-write;
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

No public source or real-score promotion.
