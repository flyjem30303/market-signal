# TWII Bounded Data Acceptance Authorization Packet

Updated: 2026-06-09

Status: `twii_bounded_data_acceptance_authorization_packet_ready_local_only`

## Purpose

This packet defines what CEO/PM must explicitly name before any future TWII bounded data acceptance attempt.

It is still local-only. It does not authorize execution by itself.

## Required Authorization Fields

A future attempt must name:

- `attemptId`;
- `candidateArtifactPath`;
- `acceptanceMode=bounded_data_acceptance_attempt`;
- `maxCandidateRows=60`;
- `targetLane=TWII`;
- `targetScope=twii_index_daily_prices_missing_rows`;
- `sourceRightsGateReference`;
- `postRunReviewCommand`;
- `rollbackOrNoWriteStopLine`;
- `rowCoverageScoringAllowed=false`;
- `publicPromotionAllowed=false`;
- `scoreSourceRealAllowed=false`.

## Stop Line

No remote TWII probe, market-data retrieval, market-data ingestion, Supabase connection/read/write, SQL, staging row creation, production `daily_prices` mutation, candidate row acceptance, source payload output, secret output, row coverage point award, public source promotion, or `scoreSource=real` occurred.
