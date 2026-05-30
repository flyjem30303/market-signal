# CP3 Source-Depth Evidence Owner-Action Acceptance Criteria

Checkpoint: CP3 Model Credibility
Date: 2026-05-30
Trigger: CP3 non-runtime readiness gap owner-action matrix recorded

Status: CP3 source-depth evidence owner-action acceptance criteria recorded

## CEO Decision

```text
PROCEED
```

This document defines local-only acceptance criteria for OWNER-ACTION-001
source-depth evidence. It gives CEO and Investment a concrete decision-quality
standard for judging whether future evidence work is sufficiently scoped before
any real-data, external-system, authorization, runtime, or public-claim step is
considered.

This document does not approve authorization, does not schedule a formal
meeting, does not create an authorization packet, does not create a real request
packet, does not create real evidence artifact files, does not connect to
Supabase, does not run SQL, does not fetch market data, does not parse market
rows, does not write Supabase, does not write staging rows, does not write
daily_prices, does not create seed SQL, does not wire runtime code, does not set
scoreSource=real, does not clear source-depth not_ready, and does not make
public claims.

## Scope

```text
SCOPE-IN-001 define evidence completeness questions
SCOPE-IN-002 define source credibility questions
SCOPE-IN-003 define field-level sufficiency questions
SCOPE-IN-004 define data freshness and coverage questions
SCOPE-IN-005 define rejection conditions for weak evidence
SCOPE-IN-006 define static checker expectations for this document

SCOPE-OUT-001 no real evidence artifact files
SCOPE-OUT-002 no market data fetch
SCOPE-OUT-003 no market row parsing
SCOPE-OUT-004 no Supabase connection
SCOPE-OUT-005 no SQL execution
SCOPE-OUT-006 no staging or daily_prices writes
SCOPE-OUT-007 no scoreSource=real transition
SCOPE-OUT-008 no source-depth not_ready clearance
```

## Acceptance Criteria

```text
AC-SOURCE-DEPTH-001 source identity must be named before any evidence is accepted
AC-SOURCE-DEPTH-002 source ownership and officialness must be classifiable
AC-SOURCE-DEPTH-003 source endpoint or access path must be described without executing it
AC-SOURCE-DEPTH-004 source rights and redistribution questions must be listed for Legal
AC-SOURCE-DEPTH-005 field list must include date, symbol, open, high, low, close, volume, and adjustment notes when applicable
AC-SOURCE-DEPTH-006 field completeness must identify required, optional, missing, and unknown fields
AC-SOURCE-DEPTH-007 coverage period expectations must be stated without fetching data
AC-SOURCE-DEPTH-008 freshness expectations must be stated without polling or validating live data
AC-SOURCE-DEPTH-009 failure modes must include missing fields, stale data, schema drift, non-official source, rate limit, and rights uncertainty
AC-SOURCE-DEPTH-010 acceptance must remain local-only until Chairman and CEO approve a specific external-system or real-data action
AC-SOURCE-DEPTH-011 evidence cannot support public claims until Legal, Investment, and CEO approve wording
AC-SOURCE-DEPTH-012 source-depth production gate must remain not_ready after this criteria document
```

## Owner Responsibilities

```text
OWNER-RESPONSIBILITY-001 CEO confirms whether the evidence question is narrow enough
OWNER-RESPONSIBILITY-002 CEO confirms whether the next action remains local-only
OWNER-RESPONSIBILITY-003 Investment defines credibility and sufficiency questions
OWNER-RESPONSIBILITY-004 Investment identifies whether fields are enough for model credibility review
OWNER-RESPONSIBILITY-005 Legal must review source rights before redistribution or public claims
OWNER-RESPONSIBILITY-006 Engineering must reject any request that would fetch, parse, write, or connect externally
OWNER-RESPONSIBILITY-007 QA must preserve static gate expectations and blocked-state wording
OWNER-RESPONSIBILITY-008 Chairman approval is required before any real-data validation or Supabase action
```

## Rejection Conditions

```text
REJECT-SOURCE-DEPTH-001 reject if the source is unnamed
REJECT-SOURCE-DEPTH-002 reject if officialness is unknown and no review question is recorded
REJECT-SOURCE-DEPTH-003 reject if rights or redistribution questions are absent
REJECT-SOURCE-DEPTH-004 reject if required fields are not listed
REJECT-SOURCE-DEPTH-005 reject if freshness expectations are absent
REJECT-SOURCE-DEPTH-006 reject if failure modes are absent
REJECT-SOURCE-DEPTH-007 reject if the action requires market data fetch
REJECT-SOURCE-DEPTH-008 reject if the action requires market row parsing
REJECT-SOURCE-DEPTH-009 reject if the action requires Supabase connection or SQL execution
REJECT-SOURCE-DEPTH-010 reject if the action implies scoreSource=real
REJECT-SOURCE-DEPTH-011 reject if the action implies source-depth not_ready can be cleared
REJECT-SOURCE-DEPTH-012 reject if the action implies public claims are ready
```

## Non-Runtime Output Format

```text
OUTPUT-FORMAT-001 source identity question
OUTPUT-FORMAT-002 source officialness question
OUTPUT-FORMAT-003 source rights question
OUTPUT-FORMAT-004 field completeness question
OUTPUT-FORMAT-005 coverage period question
OUTPUT-FORMAT-006 freshness question
OUTPUT-FORMAT-007 failure mode question
OUTPUT-FORMAT-008 reviewer owner
OUTPUT-FORMAT-009 current status: unanswered, needs_review, blocked, or locally_ready_for_review
OUTPUT-FORMAT-010 blocked boundary note
```

## Stop Conditions

```text
STOP-SOURCE-DEPTH-001 stop before creating real evidence artifact files
STOP-SOURCE-DEPTH-002 stop before fetching market data
STOP-SOURCE-DEPTH-003 stop before parsing market rows
STOP-SOURCE-DEPTH-004 stop before connecting to Supabase
STOP-SOURCE-DEPTH-005 stop before running SQL
STOP-SOURCE-DEPTH-006 stop before writing staging rows
STOP-SOURCE-DEPTH-007 stop before writing daily_prices
STOP-SOURCE-DEPTH-008 stop before creating seed SQL
STOP-SOURCE-DEPTH-009 stop before setting scoreSource=real
STOP-SOURCE-DEPTH-010 stop before clearing source-depth not_ready
STOP-SOURCE-DEPTH-011 stop before making public claims
STOP-SOURCE-DEPTH-012 stop before scheduling a formal authorization meeting
```

## CEO Pace Assessment

```text
CEO pace assessment: this is the right level of detail for a high-leverage source-depth prerequisite
CEO pace assessment: continue faster than prior governance loops by turning this criteria into a reusable local-only question template next
CEO pace assessment: do not expand into packet creation or authorization scheduling yet
CEO pace assessment: source-depth evidence remains the highest-priority prerequisite for future real-data trust
```

## Next Safe Slice Recommendation

```text
Next safe slice: prepare CP3 source-depth evidence local-only question template
Alternative next safe slice: prepare runtime state naming acceptance criteria
CEO recommendation: prepare CP3 source-depth evidence local-only question template
The next safe slice must remain local-only
The next safe slice must not create real evidence artifact files
The next safe slice must not fetch market data
The next safe slice must not parse market rows
The next safe slice must not connect to Supabase
The next safe slice must not run SQL
The next safe slice must not set scoreSource=real
The next safe slice must not clear source-depth not_ready
The next safe slice must not make public claims
```

## Verification Expectations

```text
scripts/check-cp3-source-depth-evidence-owner-action-acceptance-criteria.mjs passes
scripts/check-cp3-non-runtime-readiness-gap-owner-action-matrix.mjs passes
scripts/check-review-gates.mjs passes
TypeScript noEmit passes
public data source remains mock
CP3 source-depth production gate remains not_ready
scoreSource=real remains blocked
Supabase and SQL execution remain blocked
```
