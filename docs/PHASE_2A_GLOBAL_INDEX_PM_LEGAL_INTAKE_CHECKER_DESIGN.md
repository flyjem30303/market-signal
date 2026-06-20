# Phase 2A Global Index PM Legal Intake Checker Design

Status: `phase_2a_global_index_pm_legal_intake_checker_design_ready_report_only`

Date: 2026-06-20

CEO recommendation: `a2_continue_phase_2a_global_index_lane`

## Purpose

This design defines a report-only checker for future filled PM/Legal or source-owner reply records.

The checker must validate intake completeness and fail closed when a reply tries to approve ingestion, fetch, write, SQL, runtime promotion, or source status changes without PM mainline classification.

## Checker Scope

Allowed:

```text
read a local intake record
check required fields
check allowed enum values
report proposedClassification
report whether PM mainline classification is still required
```

Forbidden:

```text
fetch external market data
call source APIs
write Supabase
run SQL
change legalUsageStatus
change publicDataSource
change scoreSource
modify UI
```

## Required Intake Fields

The checker should require:

```text
intakeId
receivedDate
receivedFrom
organization
relatedSymbols
sourceRoute
replyType
automationAllowed
storageAllowed
publicDisplayAllowed
derivedFieldsAllowed
redistributionAllowed
commercialUseAllowed
attributionRequired
paidLicenseRequired
agreementRequiredBeforeUse
openQuestions
proposedClassification
replyRecorded=true
sourceStatusChanged=false
ingestionApproved=false
fetchApproved=false
writeApproved=false
requiresPmMainlineClassification=true
```

## Allowed Values

Allowed reply answers:

```text
allowed
allowed_with_conditions
not_allowed
not_applicable
needs_paid_license
needs_more_review
```

Allowed proposed classifications:

```text
conditional
rejected
unresolved
accepted_candidate_pending_pm_mainline
```

Forbidden proposed classification:

```text
accepted
```

## Fail-Closed Rules

The checker must return `blocked` if any future intake record contains:

```text
sourceStatusChanged=true
ingestionApproved=true
fetchApproved=true
writeApproved=true
requiresPmMainlineClassification=false
proposedClassification=accepted
legalUsageStatus=accepted
publicDataSource=supabase
scoreSource=real
```

The checker must also return `blocked` if a record omits attribution or agreement fields while proposing `accepted_candidate_pending_pm_mainline`.

## Output Shape

Expected report-only output:

```json
{
  "status": "ok_or_blocked",
  "mode": "phase_2a_global_index_pm_legal_intake_checker_report_only",
  "replyRecorded": true,
  "sourceStatusChanged": false,
  "ingestionApproved": false,
  "fetchApproved": false,
  "writeApproved": false,
  "requiresPmMainlineClassification": true,
  "requiresPmIntegration": true
}
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

## Requires PM Mainline Integration

Requires PM integration: yes.

PM mainline owns final source classification and any later execution approval. A2 checker output is evidence only.

## Next Step

Recommended next A2 slice:

```text
phase_2a_global_index_pm_legal_intake_sample_record
```

That slice should create a blank/sample local intake record that satisfies this design without changing source status.

