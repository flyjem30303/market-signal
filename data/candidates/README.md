# Candidate Artifact Intake Folder

This folder is the default PM intake location for A1 sanitized candidate artifacts.

Current committed artifacts:

```text
data/candidates/tw-equity-staging-candidate.json
data/candidates/twii-sanitized-candidate.json
data/candidates/phase-1-etf-sanitized-candidate.json
```

Current Phase 1 data-online blocker:

- `twii-sanitized-candidate.json` is aggregate-only: `rowPayloadIncluded=false`.
- `phase-1-etf-sanitized-candidate.json` is aggregate-only: `rowPayloadIncluded=false`.
- Neither file can feed the Phase 1 write runner.

Required next artifact path:

```text
<non-committed sanitized row-payload candidate artifact path>
```

It must pass:

```powershell
cmd.exe /c npm run validate:phase-1-sanitized-row-payload-candidate-artifact -- --candidate-artifact <LOCAL_JSON_PATH>
cmd.exe /c npm run run:phase-1-write-runner-implementation-candidate -- --candidate-artifact <LOCAL_JSON_PATH>
```

Required aggregate shape:

- `scope=twii_and_etf_phase_1_missing_row_closure_only`
- `sanitizedRowPayloadIncluded=true`
- `rawPayloadIncluded=false`
- `stockIdPayloadIncluded=false`
- `secretsIncluded=false`
- `expectedRows=178`
- rows cover only `TWII`, `0050`, and `006208`

Do not commit a filled row-payload candidate artifact here unless CEO separately approves committing sanitized candidate data.

Safety: this folder does not authorize market-data fetch, market-data ingestion, Supabase connection, SQL, Supabase write, staging row creation, production `daily_prices` mutation, public source promotion, row coverage points, or `scoreSource=real`.
