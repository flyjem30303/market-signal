# A1 Exact Source-Rights Evidence Worksheet

Status: `a1_exact_source_rights_evidence_worksheet_ready_pending_fill`

Date: 2026-06-07

Owner: A1 Data / Supabase / Market Evidence

Integrator: PM mainline

## CEO Decision

CEO turns the existing exact source-rights evidence ledger into a fillable no-secret worksheet so A1 can move faster without reopening broad governance.

This worksheet does not approve source rights. It gives A1 a precise format for evidence summaries that PM can later classify with `record:a1-exact-source-rights-evidence-outcome`.

## How A1 Should Fill Each Slot

For each pending slot, A1 should provide only these four fields:

1. Evidence slot id.
2. Source reference label: a short no-secret label, not a URL with tokens and not copied source text.
3. Safe evidence summary: one to three sentences describing what was confirmed.
4. Remaining risk: one to two sentences describing what still blocks execution, ingestion, display, or promotion.

A1 should not paste raw source text, contract text, price payloads, row payloads, stock ids, credentials, API keys, dashboard URLs with tokens, or any content that cannot be committed safely.

## PM Acceptance Rule

PM may classify a slot as `accepted` only when:

- the source reference label is specific enough to re-locate the reviewed evidence without exposing secrets;
- the safe summary answers the exact slot question;
- the remaining risk does not hide an execution, redistribution, field-contract, attribution, retention, rate-limit, asset-mapping, or public-display blocker;
- the evidence is enough for a separate source-rights outcome gate candidate, not direct execution.

PM should classify a slot as `blocked`, `rejected`, `unavailable`, or `needs_bounded_repair` when any required answer is missing, ambiguous, unsafe to record, or outside the lane's scope.

## TWII Worksheet

| Slot | Exact Question | Acceptable No-Secret Evidence | PM Next Gate Candidate |
| --- | --- | --- | --- |
| `vendor-terms-evidence` | Is there reviewed evidence that the TWII source terms allow the intended internal use and derived display path? | Name the reviewed source/contract label, permitted use boundary, redistribution/display limitation, and any attribution or retention condition. | `twii_source_rights_outcome_gate` |
| `internal-feed-owner-evidence` | If using an internal feed, who owns the feed and who can authorize project use? | Name the internal owner role/team label, authorization path, and unresolved owner approval gap. | `twii_source_rights_outcome_gate` |
| `field-contract-evidence` | Are the TWII fields needed by the model contract approved and stable enough to map? | List approved field labels and any missing field, unit, timezone, adjustment, or historical-depth uncertainty. | `twii_source_rights_outcome_gate` |
| `asset-mapping-evidence` | Is the index symbol/asset mapping approved for TWII coverage rows? | State the approved symbol, market, asset type, mapping owner, and any unresolved alias or historical continuity risk. | `twii_source_rights_outcome_gate` |

## ETF Worksheet

| Slot | Exact Question | Acceptable No-Secret Evidence | PM Next Gate Candidate |
| --- | --- | --- | --- |
| `etf-legal-use-evidence` | Is the ETF source legally usable for the intended Beta analysis scope? | Name the reviewed source label, permitted use boundary, and unresolved legal-use caveat. | `etf_source_rights_outcome_gate` |
| `etf-redistribution-evidence` | Are redistribution and public display boundaries understood? | State whether display, derived metrics, screenshots, caching, or public quote-like output are allowed or blocked. | `etf_source_rights_outcome_gate` |
| `etf-attribution-retention-evidence` | Are attribution and retention obligations understood? | State attribution wording, retention period, deletion requirement, and unresolved audit requirement. | `etf_source_rights_outcome_gate` |
| `etf-derived-analysis-rate-limit-evidence` | Are derived analysis and rate-limit constraints understood? | State derived-analysis permission, fetch or refresh limits, and any manual review requirement. | `etf_source_rights_outcome_gate` |
| `etf-field-contract-evidence` | Are ETF fields approved and stable enough to map? | List approved field labels and any missing unit, dividend, split, NAV, component, or timezone risk. | `etf_source_rights_outcome_gate` |
| `etf-source-comparison-evidence` | Which ETF source lane is preferred among official disclosures, issuer pages, and paid vendor routes? | Compare source labels, rights confidence, coverage, operational cost, and why one lane is preferred or still blocked. | `etf_source_rights_outcome_gate` |

## Recording Flow

1. A1 fills one slot using this worksheet.
2. PM reviews the no-secret summary and remaining risk.
3. PM uses dry-run first:

```powershell
cmd.exe /c npm run record:a1-exact-source-rights-evidence-outcome -- --dry-run --id vendor-terms-evidence --classification accepted --recordedBy PM --pm-question-resolved true --safe-summary "No-secret summary only." --source-reference-label "internal-review-label" --remaining-risk "No execution yet." --next-gate-candidate twii_source_rights_outcome_gate
```

4. PM changes `--dry-run` to `--apply` only after the reviewed evidence is safe and accepted.
5. PM reruns:

```powershell
cmd.exe /c npm run report:a1-source-rights-next-action
```

## Current Routing

- TWII remains `4/4` pending until all TWII slots are accepted.
- ETF remains `6/6` pending until all ETF slots are accepted.
- If neither lane has all required slots accepted, PM continues the Beta mainline with mock-visible runtime.
- `publicDataSource=mock` remains unchanged.
- `scoreSource=mock` remains unchanged.

## Hard Stops

This worksheet does not authorize:

- source-rights approval;
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
- raw payload output;
- row payload output;
- stock id payload output;
- secret output;
- row coverage point award;
- `publicDataSource=supabase`;
- `scoreSource=real`;
- public real-data claim;
- investment advice claim.

## Verification

Use:

```powershell
cmd.exe /c npm run check:a1-exact-source-rights-evidence-worksheet
cmd.exe /c npm run report:a1-source-rights-next-action
cmd.exe /c npm run report:a1-exact-source-rights-evidence-recording-commands
```
