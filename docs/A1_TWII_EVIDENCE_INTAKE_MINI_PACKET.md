# A1 TWII Evidence Intake Mini Packet

Status: `a1_twii_evidence_intake_mini_packet_ready_pending_fill`

Date: 2026-06-08

Owner: A1 Data / Supabase / Market Evidence

Integrator: PM mainline

## Purpose

This mini packet reduces the current TWII source-rights work to one four-slot handoff. It does not approve source rights, fetch market data, generate candidate artifacts, connect to Supabase, run SQL, write Supabase, mutate `daily_prices`, award row coverage points, or promote runtime source/score.

## Fill Only These Four TWII Slots

For each slot, A1 should return only:

1. `evidenceSlotId`
2. `sourceReferenceLabel`
3. `safeEvidenceSummary`
4. `remainingRisk`

| Slot | Question A1 must answer | PM next gate candidate |
| --- | --- | --- |
| `vendor-terms-evidence` | Do reviewed terms allow the intended internal use and derived display path? | `twii_source_rights_outcome_gate` |
| `internal-feed-owner-evidence` | If using an internal feed, who owns it and who can authorize project use? | `twii_source_rights_outcome_gate` |
| `field-contract-evidence` | Are the TWII fields required by the model contract approved and stable enough to map? | `twii_source_rights_outcome_gate` |
| `asset-mapping-evidence` | Is the TWII index symbol/asset mapping approved for coverage rows? | `twii_source_rights_outcome_gate` |

## Copyable Fill Template

```text
evidenceSlotId: vendor-terms-evidence
sourceReferenceLabel: <no-secret reviewed source label>
safeEvidenceSummary: <one to three sentences; no copied contract text>
remainingRisk: <one to two sentences; say what still blocks execution>

evidenceSlotId: internal-feed-owner-evidence
sourceReferenceLabel: <no-secret owner or approval path label>
safeEvidenceSummary: <one to three sentences; no credentials or private links>
remainingRisk: <one to two sentences; say what still blocks execution>

evidenceSlotId: field-contract-evidence
sourceReferenceLabel: <no-secret field contract label>
safeEvidenceSummary: <one to three sentences; field labels only, no raw payload>
remainingRisk: <one to two sentences; say what field/unit/timezone/depth risk remains>

evidenceSlotId: asset-mapping-evidence
sourceReferenceLabel: <no-secret asset mapping label>
safeEvidenceSummary: <one to three sentences; symbol and asset type only>
remainingRisk: <one to two sentences; say what alias or continuity risk remains>
```

## PM Review Flow

## 90-Second PM Intake

When A1 returns evidence, PM only checks this shape:

```text
evidenceSlotId: <one of the four TWII slot ids>
sourceReferenceLabel: <no-secret reviewed source label>
safeEvidenceSummary: <one to three sentences; no copied contract text, credentials, private links, or source extracts>
remainingRisk: <one to two sentences; say what still blocks execution>
```

PM accepts a slot only if:

- `evidenceSlotId` is one of the four TWII slot ids in this packet;
- `sourceReferenceLabel` is a safe label, not a URL with private token and not copied contract text;
- `safeEvidenceSummary` answers the exact slot question without secrets or market-data extracts;
- `remainingRisk` explicitly says whether execution, redistribution, field mapping, public display, or retention risk remains.

Then PM runs the dry-run recorder for the matching slot, applies only after review, and reruns:

```powershell
cmd.exe /c npm run report:a1-source-rights-readiness-summary
cmd.exe /c npm run report:a1-source-rights-next-action
```

## Safe Example And Repair Example

Acceptable shape example:

```text
evidenceSlotId: vendor-terms-evidence
sourceReferenceLabel: reviewed-terms-summary-label
safeEvidenceSummary: Reviewed source-rights notes indicate the intended internal evaluation path can be assessed, but no contract text or private URL is copied here.
remainingRisk: Execution remains blocked until PM accepts all four TWII slots and opens a separate outcome gate.
```

Needs bounded repair example:

```text
evidenceSlotId: field-contract-evidence
sourceReferenceLabel: field-contract-review-label
safeEvidenceSummary: The answer says fields look fine, but it does not name whether unit, timezone, symbol mapping, and close-level depth were reviewed.
remainingRisk: PM should classify this as needs_bounded_repair until the missing field-contract details are answered.
```

Local shape guard:

```powershell
cmd.exe /c npm run check:a1-twii-evidence-response-shape
```

This guard dry-runs the recorder for each TWII slot with safe sample text. It does not apply outcomes or modify the ledger.

1. Run the current worksheet:

```powershell
cmd.exe /c npm run report:a1-exact-source-rights-evidence-worksheet
```

2. For each filled slot, run the recorder in dry-run first. Example:

```powershell
cmd.exe /c npm run record:a1-exact-source-rights-evidence-outcome -- --dry-run --id vendor-terms-evidence --classification accepted --recordedBy PM --pm-question-resolved true --safe-summary "No-secret summary only." --source-reference-label "internal-review-label" --remaining-risk "No execution yet." --next-gate-candidate twii_source_rights_outcome_gate
```

3. Use `--apply` only after PM accepts that the evidence is safe to record.
4. Rerun:

```powershell
cmd.exe /c npm run report:a1-source-rights-readiness-summary
cmd.exe /c npm run report:a1-source-rights-next-action
```

## PM Acceptance

PM may classify a slot as `accepted` only when the four returned fields answer the exact question, stay no-secret, and leave no hidden execution, redistribution, field-contract, public-display, asset-mapping, or retention blocker.

If the answer is incomplete or unsafe, classify it as `blocked`, `rejected`, `unavailable`, or `needs_bounded_repair`.

All four TWII slots must be accepted before PM may open a separate `twii_source_rights_outcome_gate`.

## Hard Stops

This mini packet does not authorize:

- source-rights approval claim;
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
- `publicDataSource=supabase`;
- `scoreSource=real`;
- public real-data claim;
- investment advice claim.

## Verification

```powershell
cmd.exe /c npm run check:a1-twii-evidence-intake-mini-packet
cmd.exe /c npm run report:a1-exact-source-rights-evidence-worksheet
cmd.exe /c npm run report:a1-source-rights-readiness-summary
```
