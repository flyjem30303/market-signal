# Phase 2A Global Index PM Mainline Integration Waiting Room

Status: `phase_2a_global_index_pm_mainline_integration_waiting_room_ready`

Date: 2026-06-20

CEO recommendation: `a2_continue_phase_2a_global_index_lane`

## Purpose

This is an A2-owned waiting-room note for PM mainline integration.

A2 has completed the no-fetch source planning, registry, decision packet, external question template, intake template, checker design, sample record, and rollup. The next blocking decision belongs to PM mainline and Legal.

This document does not modify PM mainline files. It does not approve ingestion, fetch, write, SQL, runtime promotion, or public UI changes.

## Waiting On PM Mainline

PM mainline decisions needed:

| decision | owner | current status |
|---|---|---|
| Accept A2 rollup as ready for PM/Legal review | PM mainline | waiting |
| Choose first legal review target: FRED route or KRX route | PM/CEO | waiting |
| Decide whether licensed vendor evaluation starts now | PM/CEO | waiting |
| Assign Legal reviewer or source-owner outreach owner | PM/CEO | waiting |
| Decide whether A2 should continue no-fetch tooling or pause | PM/CEO | waiting |

## A2 Current Recommendation

```text
Prioritize FRED rights review first.
Keep FRED route conditional.
Do not fetch.
Do not write.
Do not promote publicDataSource or scoreSource.
Use A2 templates for source-owner or vendor questions.
Use A2 intake template for replies.
Require PM mainline classification before source status changes.
```

## Current Source Status

| status | symbols |
|---|---|
| accepted | none |
| conditional | SP500, NASDAQCOM, DJIA, NIKKEI225 |
| rejected | HSI, SXXP, DAX |
| unresolved | KOSPI, SSECOMP, CSI300 |

## PM Integration Guardrail

PM mainline may integrate this workstream as:

```text
Phase 2A A2 global-index lane is ready for PM/Legal source-rights review. No source is accepted for ingestion. Runtime remains mock. The next action is PM/Legal classification, likely starting with the FRED route.
```

PM mainline should not integrate it as:

```text
global index ingestion approved
FRED accepted
bounded fetch enabled
Supabase write approved
public real-data display approved
scoreSource real
publicDataSource supabase
```

## Runtime Boundary

| area | impact |
|---|---|
| runtime behavior | none |
| public UI | none |
| Supabase read | none |
| Supabase write | none |
| SQL execution | none |
| market data fetch | none |
| raw payload storage | none |
| publicDataSource | unchanged, remains mock |
| scoreSource | unchanged, remains mock |

## Next Step

Recommended next A2 action:

```text
wait_for_pm_mainline_integration_or_continue_no_fetch_source_rights_support
```

If CEO asks A2 to continue before PM integration, the next no-fetch support slice should be:

```text
phase_2a_global_index_fred_outreach_draft
```

That slice should draft a no-fetch FRED/source-owner outreach message using the existing question template.

