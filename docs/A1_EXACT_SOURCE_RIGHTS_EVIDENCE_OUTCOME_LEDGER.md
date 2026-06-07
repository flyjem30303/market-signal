# A1 Exact Source-Rights Evidence Outcome Ledger

Status: `a1_exact_source_rights_evidence_outcome_ledger_ready_pending_evidence`

Date: 2026-06-07

Owner: A1 Data / Supabase / Market Evidence

Integrator: PM mainline

## CEO Decision

CEO makes the A1 exact source-rights evidence intake recordable without opening remote execution. This ledger is the recording layer for `docs/A1_EXACT_SOURCE_RIGHTS_EVIDENCE_INTAKE_COMMAND_MAP.md`.

The ledger lets A1 or PM record each TWII/ETF evidence slot as `accepted`, `rejected`, `needs_bounded_repair`, `blocked`, `unavailable`, or `pending` after evidence is reviewed. It does not approve source rights, generate candidate artifacts, fetch market data, connect to Supabase, mutate `daily_prices`, award row coverage points, or promote runtime source/score.

## Local Data File

Outcome file:

- `data/source-gates/a1-exact-source-rights-evidence-intake-outcomes.json`

Initial state:

- Status: `a1_exact_source_rights_evidence_outcome_ledger_ready_pending_evidence`
- TWII slots: `4/4` pending.
- ETF slots: `6/6` pending.
- Outcome gate route: `blocked`.
- Runtime boundary: `publicDataSource=mock`.
- Score boundary: `scoreSource=mock`.

## Recordable Slots

TWII:

- `vendor-terms-evidence`
- `internal-feed-owner-evidence`
- `field-contract-evidence`
- `asset-mapping-evidence`

ETF:

- `etf-legal-use-evidence`
- `etf-redistribution-evidence`
- `etf-attribution-retention-evidence`
- `etf-derived-analysis-rate-limit-evidence`
- `etf-field-contract-evidence`
- `etf-source-comparison-evidence`

## Allowed Classifications

- `pending`
- `accepted`
- `rejected`
- `needs_bounded_repair`
- `blocked`
- `unavailable`

An `accepted` classification means only that PM can consider the next named source-rights outcome gate. It is not execution, ingestion, public display, row coverage, runtime promotion, or an external rights clearance.

## Commands

Report current ledger state:

```powershell
cmd.exe /c npm run report:a1-exact-source-rights-evidence-outcome-ledger
```

List dry-run recording command templates for every pending slot:

```powershell
cmd.exe /c npm run report:a1-exact-source-rights-evidence-recording-commands
```

The command helper emits placeholders only. Replace `REPLACE_WITH_NO_SECRET_SUMMARY` and `REPLACE_WITH_NO_SECRET_REMAINING_RISK` after A1 has reviewed no-secret evidence. Keep the generated command in `--dry-run` until PM/CEO accepts the evidence summary.

Dry-run one classification:

```powershell
cmd.exe /c npm run record:a1-exact-source-rights-evidence-outcome -- --dry-run --id vendor-terms-evidence --classification blocked --recordedBy PM --safe-summary "No-secret summary only." --source-reference-label "internal-review-label" --remaining-risk "Rights still blocked." --next-gate-candidate blocked
```

Apply one classification only after the reviewed evidence is safe:

```powershell
cmd.exe /c npm run record:a1-exact-source-rights-evidence-outcome -- --apply --id vendor-terms-evidence --classification accepted --recordedBy PM --pm-question-resolved true --safe-summary "No-secret summary only." --source-reference-label "internal-review-label" --remaining-risk "No execution yet." --next-gate-candidate twii_source_rights_outcome_gate
```

## PM Outcome Routing

- If all four TWII slots are `accepted`, PM may open a separate `twii_source_rights_outcome_gate`.
- If all six ETF slots are `accepted`, PM may open a separate `etf_source_rights_outcome_gate`.
- If any slot is `rejected`, `blocked`, `unavailable`, or `needs_bounded_repair`, PM should keep that lane blocked or assign the smallest repair.
- If both lanes remain pending/blocked, PM should route to `continue_public_beta_runtime_mainline_mock_visible`.

## Hard Stops

This ledger and recorder do not allow:

- remote source probing;
- market-data fetch;
- market-data ingestion;
- raw market-data storage;
- candidate artifact generation from source data;
- SQL execution;
- Supabase connection;
- Supabase read;
- Supabase write;
- staging row creation;
- `daily_prices` mutation;
- row payload output;
- stock id payload output;
- secret output;
- row coverage point award;
- source-rights approval claim;
- `publicDataSource=supabase`;
- `scoreSource=real`;
- public real-data claim.

## Verification

Use:

- `cmd.exe /c npm run report:a1-exact-source-rights-evidence-outcome-ledger`
- `cmd.exe /c npm run report:a1-exact-source-rights-evidence-recording-commands`
- `cmd.exe /c npm run check:a1-exact-source-rights-evidence-outcome-ledger`
- `cmd.exe /c npm run check:a1-exact-source-rights-evidence-recording-commands`

The checker verifies that the ledger starts fail-closed, the recorder defaults to dry-run, and all outputs preserve the mock/mock runtime boundary.
