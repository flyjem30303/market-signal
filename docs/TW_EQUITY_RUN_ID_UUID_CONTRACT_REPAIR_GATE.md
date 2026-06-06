# TW Equity Run ID UUID Contract Repair Gate

Date: 2026-06-06

Status: `tw_equity_run_id_uuid_contract_repair_gate_complete_mock_only`.

Decision: `LOCAL_UUID_CONTRACT_REPAIRED_BEFORE_REMOTE_REPAIR_OR_THIRD_ATTEMPT`

## Purpose

This gate repairs the local payload contract mismatch found by the Supabase staging write repair evidence record. The staging migration declares `run_id` as `uuid`, so the runner validator, sanitized candidate generator, and accepted sanitized candidate artifact must all use UUID-shaped run ids before any dashboard repair, remote diagnostic, or third bounded write attempt.

This slice does not connect to Supabase, run SQL, execute a migration, write staging rows, fetch market data, print secrets, print row payloads, promote public data, award row coverage points, or set `scoreSource=real`.

## Local Repairs

- REPAIR-001 `scripts/run-tw-equity-staging-write-once.mjs` now rejects non-UUID `candidateRun.run_id` values with `candidate_run_run_id_must_be_uuid`.
- REPAIR-002 `scripts/run-tw-equity-staging-write-once.mjs` now rejects non-UUID `candidatePrices[*].run_id` values with `candidate_price_<index>_run_id_must_be_uuid`.
- REPAIR-003 `scripts/generate-tw-equity-sanitized-candidate-artifact.mjs` now creates UUID-shaped run ids using `crypto.randomUUID()`.
- REPAIR-004 `data/candidates/tw-equity-staging-candidate.json` now uses one UUID-shaped run id for the candidate run row and all 180 candidate price rows.
- REPAIR-005 `docs/TW_EQUITY_SANITIZED_CANDIDATE_INPUT_VALIDATOR.md` now states the UUID-shaped run-id contract.

## Verification Expectations

- candidate run id is UUID-shaped;
- all candidate price row ids match the candidate run id;
- all candidate price row ids are UUID-shaped;
- candidate artifact remains sanitized with no raw source payloads and no secrets;
- runner mock path accepts the repaired artifact without remote connection;
- historical evidence record still preserves the prior mismatch finding without requiring the current artifact to remain broken.

## CEO Verdict

Accepted as a local-only contract repair. This removes a known blocker that would likely have surfaced immediately after Supabase metadata/cache repair.

The next CEO route is to return to Supabase repair classification:

1. if dashboard metadata/cache evidence is available, prepare a dashboard/manual schema cache repair record;
2. if not, prepare a bounded read-only metadata diagnostic decision packet;
3. do not run a third write attempt until metadata/cache exposure and UUID contract are both accepted.

## Safety Confirmation

- no remote Supabase connection;
- no SQL execution;
- no migration execution;
- no write attempt;
- no staging rows created;
- no `daily_prices` mutation;
- no market-data fetch or ingestion;
- no raw payloads printed;
- no row payloads printed;
- no secrets printed;
- `publicDataSource=mock`;
- `scoreSource=mock`.
