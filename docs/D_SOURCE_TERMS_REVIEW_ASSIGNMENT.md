# D Source Terms Review Assignment

Status: `d_source_terms_review_assigned`

Date: 2026-06-09

Owner: D Legal / Source Rights Review

Integrator: PM mainline

Related lane: A1 Data / Supabase / Market Evidence

## CEO Assignment

CEO assigns D to confirm the source/provider terms and internal authorization path that currently block TWII source-rights promotion.

This assignment is intentionally narrow. D is not asked to approve real-data runtime, execute SQL, connect to Supabase, fetch market data, or write evidence directly. D only returns no-secret legal/source-rights conclusions that PM can classify.

## Questions D Must Answer

D should answer these four questions in the A1 evidence shape:

| Evidence slot | D question | Current PM state | Required D output |
| --- | --- | --- | --- |
| `vendor-terms-evidence` | Do the reviewed terms allow the intended internal evaluation, storage, derived display, public Beta wording, attribution, retention, and commercial/internal use path? | `blocked` | no-secret terms label, safe summary, remaining legal/source-rights risk |
| `internal-feed-owner-evidence` | If any internal feed is used, who owns it and who can authorize this project to use it? | `blocked` | no-secret owner/approval-path label, safe summary, remaining owner-risk |
| `field-contract-evidence` | Are the minimum TWII fields legally and operationally safe to map for the intended model contract? | `needs_bounded_repair` | no-secret field-contract label, safe summary, remaining field/unit/timezone/depth risk |
| `asset-mapping-evidence` | Is the TWII index identifier and internal mapping path safe to use for coverage rows and scoring recognition? | `needs_bounded_repair` | no-secret mapping label, safe summary, remaining alias/continuity risk |

## Output Shape

D must return only this shape for each slot:

```text
evidenceSlotId: <one of the four slot ids>
sourceReferenceLabel: <no-secret reviewed terms / owner / field / mapping label>
safeEvidenceSummary: <one to three sentences; no copied contract text, no credentials, no private links, no raw payloads>
remainingRisk: <one to two sentences; state whether execution, redistribution, display, retention, owner approval, field mapping, or asset mapping risk remains>
```

## Classification Guidance For PM

After D returns the no-secret summaries, PM classifies each slot:

- `accepted`: the answer resolves the exact slot question and leaves no hidden blocker for a later source-rights outcome gate.
- `needs_bounded_repair`: a narrow missing detail remains and D/A1 can repair it without reopening broad research.
- `blocked`: terms, owner authority, field contract, or asset mapping cannot support the intended path yet.
- `rejected`: the reply is unsafe, copied from terms, includes private links/secrets, or does not answer the slot.

All four TWII slots must be `accepted` before PM may consider a separate TWII source-rights outcome gate. This document itself does not open that gate.

## D Must Not Include

- copied provider terms text;
- screenshots of private dashboards;
- credential values, API keys, tokens, passwords, or private URLs;
- raw market data;
- row payloads;
- stock id payloads;
- SQL;
- Supabase URLs or service-role details;
- legal conclusions that claim public launch or real-data promotion is already approved.

## Still Not Authorized

This assignment does not authorize:

- source-rights approval;
- market-data fetch;
- market-data ingestion;
- raw market-data storage;
- candidate artifact generation;
- SQL execution;
- Supabase read/write;
- staging rows;
- `daily_prices` mutation;
- row coverage points;
- `publicDataSource=supabase`;
- `scoreSource=real`;
- public real-data claim;
- investment advice claim.

## PM Next Commands After D Reply

PM should use the existing A1/PM local-only review path:

```powershell
cmd.exe /c npm run report:a1-twii-pm-intake-decision-summary
cmd.exe /c npm run check:a1-twii-evidence-response-shape
cmd.exe /c npm run run:a1-twii-post-reply-pm-classification-once
cmd.exe /c npm run report:a1-source-rights-readiness-summary
```

Use `--apply` recording only after PM explicitly accepts a no-secret slot classification.

## CEO Decision

Proceed with D review now, in parallel with Public Beta mock-only readiness. Do not wait for D to continue runtime/mock route health work, but do not promote TWII source rights, Supabase real source, or real scoring until D's accepted evidence is integrated and PM opens a separate source-rights outcome gate.
