# Phase 2A Global Index PM Legal Reply Intake Template

Status: `phase_2a_global_index_pm_legal_reply_intake_template_ready_no_fetch`

Date: 2026-06-20

CEO recommendation: `a2_continue_phase_2a_global_index_lane`

## Purpose

This template defines how A2 records PM/Legal, source-owner, or licensed-vendor replies for Phase 2A global index source rights.

It is an intake record only. It does not automatically upgrade any source status. It does not approve ingestion. It does not fetch market data, write Supabase, execute SQL, or change public UI.

## Intake Rule

A reply can be recorded only as evidence. A2 must not change `legalUsageStatus` to `accepted` unless PM mainline explicitly approves the classification after Legal review.

Required status after intake:

```text
replyRecorded=true
sourceStatusChanged=false
ingestionApproved=false
fetchApproved=false
writeApproved=false
requiresPmMainlineClassification=true
```

## Reply Record Fields

| field | required |
|---|---|
| intakeId | yes |
| receivedDate | yes |
| receivedFrom | yes |
| organization | yes |
| relatedSymbols | yes |
| sourceRoute | yes |
| replyType | yes |
| automationAllowed | yes |
| storageAllowed | yes |
| publicDisplayAllowed | yes |
| derivedFieldsAllowed | yes |
| redistributionAllowed | yes |
| commercialUseAllowed | yes |
| attributionRequired | yes |
| requiredAttributionText | conditional |
| minimumDelay | conditional |
| rateLimitPolicy | conditional |
| cacheArchiveDatabaseLimit | conditional |
| paidLicenseRequired | yes |
| agreementRequiredBeforeUse | yes |
| openQuestions | yes |
| proposedClassification | yes |
| pmMainlineClassification | no, PM-owned |
| legalReviewer | conditional |
| notes | optional |

Allowed `replyType` values:

```text
source_owner_reply
vendor_reply
pm_interpretation
legal_interpretation
internal_followup_needed
```

Allowed `proposedClassification` values:

```text
conditional
rejected
unresolved
accepted_candidate_pending_pm_mainline
```

Forbidden A2-only classification:

```text
accepted
```

## Blank Template

```text
intakeId:
receivedDate:
receivedFrom:
organization:
relatedSymbols:
sourceRoute:
replyType:

automationAllowed:
storageAllowed:
publicDisplayAllowed:
derivedFieldsAllowed:
redistributionAllowed:
commercialUseAllowed:
attributionRequired:
requiredAttributionText:
minimumDelay:
rateLimitPolicy:
cacheArchiveDatabaseLimit:
paidLicenseRequired:
agreementRequiredBeforeUse:

openQuestions:
proposedClassification:
pmMainlineClassification: PM-owned, not set by A2
legalReviewer:
notes:

replyRecorded=true
sourceStatusChanged=false
ingestionApproved=false
fetchApproved=false
writeApproved=false
requiresPmMainlineClassification=true
```

## Classification Guidance

| reply pattern | proposedClassification |
|---|---|
| Any required field is blank or unclear | unresolved |
| Allowed only after contract/payment/license | conditional |
| Explicitly blocks storage, display, derived fields, or commercial use | rejected |
| Appears fully allowed but needs PM/Legal final decision | accepted_candidate_pending_pm_mainline |

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

## Requires PM Mainline Integration

Requires PM integration: yes.

PM mainline owns the final source classification. A2 may prepare evidence and proposed classification only.

## Next Step

Recommended next A2 slice:

```text
phase_2a_global_index_pm_legal_intake_checker_design
```

That slice should define a report-only checker for filled reply records, while still blocking source status changes without PM mainline classification.

