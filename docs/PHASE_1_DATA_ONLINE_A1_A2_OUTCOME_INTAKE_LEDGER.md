# Phase 1 Data Online A1/A2 Outcome Intake Ledger

Status: `phase_1_data_online_a1_a2_outcome_intake_ledger_ready_pending`

Owner: CEO/PM

Decision: `RECORD_A1_A2_OUTCOMES_AS_PENDING_UNTIL_REVIEWED`

Purpose: create the no-secret intake ledger for A1/A2 handoff outcomes. This makes future A1 TWII, A1 ETF, and A2 public-copy responses recordable without treating them as execution approval, source promotion, row coverage, Supabase write, or investment advice.

## Local Ledger File

Ledger path:

- `data/source-gates/phase-1-data-online-a1-a2-handoff-outcomes.json`

Current runtime state:

- Phase 1 data-online decision: `PUBLIC_RUNTIME_READY_BUT_DATA_ONLINE_NO_GO`
- Runtime boundary: `publicDataSource=mock`
- Score boundary: `scoreSource=mock`

## Recordable Outcome Slots

A1 TWII:

- `a1_twii_operator_presence_shape_outcome`
- Expected route: `submit_twii_operator_presence_shape_outcome_no_values`
- Meaning: PM may record whether the TWII operator presence/shape response is `pending`, `accepted`, `rejected`, `repair_required`, or `deferred`.
- accepted means eligible for PM receiver routing only.
- pending means no PM integration yet.

A1 ETF:

- `a1_etf_source_rights_acceptance_evidence_outcome`
- Expected route: `submit_etf_source_rights_acceptance_evidence_no_market_rows`
- Meaning: PM may record whether the ETF source-rights acceptance evidence is `pending`, `accepted`, `rejected`, `repair_required`, or `deferred`.
- accepted means eligible for PM receiver routing only.
- pending means no PM integration yet.

A2 public copy:

- `a2_twii_etf_public_copy_guard_outcome`
- Expected route: `submit_twii_etf_public_copy_guard_outcome`
- Meaning: PM may record whether the A2 TWII/ETF public-copy guard is `pending`, `accepted`, `rejected`, `repair_required`, or `deferred`.
- accepted means eligible for PM receiver routing only.
- pending means no PM integration yet.

## Allowed Statuses

- `pending`
- `accepted`
- `rejected`
- `repair_required`
- `deferred`

`accepted` is not execution approval. It only means PM may pass that lane into the PM handoff receiver router. The router may then open a separate authorization gate if every required lane is accepted.

## Dry-Run Recorder

Status: `phase_1_data_online_a1_a2_outcome_dry_run_recorder_ready_no_apply`

Dry-run recording does not modify the ledger.

Command:

```powershell
cmd.exe /c npm run record:phase-1-data-online-a1-a2-outcome-dry-run -- --dry-run --id a1_etf_source_rights_acceptance_evidence_outcome --status accepted --recordedBy PM --safe-summary "No-secret summary only." --source-reference-label "internal-review-label" --remaining-risk "No execution yet."
```

Routing preview:

- `accepted` routes to `open_separate_lane_authorization_gate_before_any_write_or_promotion`.
- `rejected` routes to `return_rejected_lane_to_repair_without_runtime_promotion`.
- `repair_required` routes to `return_lane_to_a1_a2_repair_with_missing_fields_only`.
- `deferred` routes to `keep_data_online_no_go_and_continue_mock_runtime_truthfulness`.

The dry-run recorder rejects `--apply`, secrets, raw payload labels, row payload labels, stock-id payload labels, source payload labels, Supabase keys, Supabase URLs, and buy/sell/hold language.

## Reviewed Apply Gate

Status: `phase_1_data_online_a1_a2_outcome_reviewed_apply_gate_ready_no_remote`

Reviewed apply updates only the local outcome ledger.

Reviewed apply requires a prior dry-run preview.

Reviewed apply still does not authorize SQL, Supabase, market-row fetch, row coverage, or runtime promotion.

Command:

```powershell
cmd.exe /c npm run record:phase-1-data-online-a1-a2-outcome-reviewed-apply -- --dry-run --id a2_twii_etf_public_copy_guard_outcome --status deferred --recordedBy PM --safe-summary "No-secret summary only." --source-reference-label "internal-review-label" --remaining-risk "No execution yet." --reviewed-by PM --reviewed-note "Reviewed dry-run route only."
```

`--apply` is allowed only in a reviewed slice after the dry-run preview is accepted. Even then it only updates `data/source-gates/phase-1-data-online-a1-a2-handoff-outcomes.json`.

## PM Safety Rules

No row coverage points may be awarded from this ledger.

No runtime promotion may happen from this ledger.

First executable action still requires a separate authorization gate.

Every ledger entry must remain no-secret and no-raw:

1. no credential values;
2. no operator value bodies;
3. no confirmation phrase values;
4. no endpoint response bodies;
5. no row payload;
6. no stock-id payload;
7. no market-row body;
8. no raw payload;
9. no source payload;
10. no source terms copied verbatim beyond safe labels.

## Hard Boundaries

This ledger does not authorize:

- SQL execution;
- Supabase connection, read, or write;
- staging-row creation;
- `daily_prices` mutation;
- TWII or ETF market-row fetch, ingestion, storage, output, or commit;
- raw payload output;
- endpoint response output;
- operator value storage;
- candidate row acceptance;
- row coverage points;
- `publicDataSource=supabase`;
- `scoreSource=real`;
- real-time market-data claims;
- official endorsement claims;
- investment advice.

## Completion Evidence

This ledger is ready when its checker proves:

1. the ledger has exactly three pending outcome slots;
2. every slot maps to the A1/A2 handoff routes;
3. every pending slot uses `pending_no_pm_integration`;
4. execution, Supabase write, and row coverage award flags are false;
5. the current data-online decision remains `PUBLIC_RUNTIME_READY_BUT_DATA_ONLINE_NO_GO`;
6. `publicDataSource=mock` and `scoreSource=mock` remain unchanged.
