# TW Equity Supabase Staging Write Repair Evidence Record

Date: 2026-06-06

Status: `tw_equity_supabase_staging_write_repair_evidence_record_local_mismatch_found_no_remote_action`.

Decision: `LOCAL_PAYLOAD_CONTRACT_REPAIR_REQUIRED_BEFORE_ANY_REMOTE_REPAIR_OR_THIRD_ATTEMPT`

## Purpose

This record fills the repair evidence checklist using repository-local evidence only. It does not connect to Supabase, run SQL, execute a migration, attempt a write, fetch market data, print secrets, print row payloads, promote public data, award row coverage points, or set `scoreSource=real`.

## Evidence Sources

- `supabase/migrations/0003_twse_stock_day_staging.sql`
- `scripts/run-tw-equity-staging-write-once.mjs`
- `data/candidates/tw-equity-staging-candidate.json`
- `docs/TW_EQUITY_PGRST205_ROOT_CAUSE_GATE.md`
- `docs/reviews/TW_EQUITY_STAGING_SECOND_WRITE_RETRY_POST_RUN_REVIEW_2026-06-06.md`
- `docs/TW_EQUITY_SUPABASE_STAGING_WRITE_REPAIR_EVIDENCE_CHECKLIST.md`

## Filled Checklist

### C1 REST Insert Schema Exposure

Local evidence: unresolved.

Reason: repository files cannot prove whether the live Supabase API schema currently exposes `staging_twse_stock_day_runs` and `staging_twse_stock_day_prices` for insert metadata.

Route: keep C1 pending dashboard/API metadata evidence. Do not run a remote diagnostic from this record.

### C2 PostgREST Schema Cache

Local evidence: unresolved.

Reason: repository files cannot prove whether the live PostgREST schema cache is stale.

Route: keep C2 pending dashboard/manual schema cache evidence. Do not refresh schema cache from this record.

### C3 Object And Schema Name Match

Local evidence: accepted.

Findings:

- local migration declares `public.staging_twse_stock_day_runs`;
- local migration declares `public.staging_twse_stock_day_prices`;
- runner target is `staging_twse_stock_day_runs,staging_twse_stock_day_prices`;
- accepted candidate artifact target relation is `staging_twse_stock_day_runs,staging_twse_stock_day_prices`.

Classification: local target relation naming matches the canonical staging objects. This is not the current local repair priority.

### C4 RLS And Policy Posture

Local evidence: partially accepted.

Findings:

- local migration enables row level security on both staging relations;
- the recorded `PGRST205` failures indicate the current observed failure happens at object/schema metadata discovery, before a policy-specific error can be proven;
- repository files do not prove the live policy posture.

Classification: keep RLS/policy as pending remote/dashboard evidence, but do not prioritize it ahead of C6 because a local payload contract mismatch is already visible.

### C5 Read-Only Versus Insert Path Match

Local evidence: partially accepted.

Findings:

- read-only diagnostics and write runner both reference the canonical table names;
- both use the same project credential presence pattern without printing secrets;
- repository evidence still cannot prove live API schema cache parity between read and insert metadata.

Classification: local target path matches, but live metadata parity remains unresolved.

### C6 Insert Payload And Column Contract

Local evidence: mismatch found.

Findings:

- migration declares `staging_twse_stock_day_runs.run_id` as `uuid primary key`;
- migration declares `staging_twse_stock_day_prices.run_id` as `uuid` foreign key to the run table;
- current candidate artifact uses `candidateRun.run_id=tw-equity-staging-candidate-2026-06-06`, which is not UUID-shaped;
- current runner validator only requires `run_id` to be a non-empty string and therefore accepts a candidate that does not satisfy the local SQL contract.

Classification: `local_payload_contract_mismatch_run_id_not_uuid`.

Impact: after any future metadata/cache repair, the next write attempt is likely to fail on column type or foreign-key contract unless the candidate artifact and validator are repaired first.

## CEO Verdict

Do not perform a third bounded write attempt. Do not spend the next slice on dashboard/schema-cache repair yet. The highest-value next step is a local runner and candidate contract repair gate:

- require UUID-shaped `candidateRun.run_id`;
- require every `candidatePrices[*].run_id` to match that UUID-shaped run id;
- update synthetic and generated candidate paths so the accepted artifact uses a UUID-shaped run id;
- keep all checks mock-only before any remote attempt.

## PM Next Action

Create `TW_EQUITY_RUN_ID_UUID_CONTRACT_REPAIR_GATE` and update local validator/generator behavior in a separate slice. No SQL, no Supabase write, no remote diagnostic, and no third attempt should occur before that local repair passes.

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
