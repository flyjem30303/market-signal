# CP3 Source-Depth Evidence Local-Only Question Template

Checkpoint: CP3 Model Credibility
Date: 2026-05-30
Trigger: CP3 source-depth evidence owner-action acceptance criteria recorded

Status: CP3 source-depth evidence local-only question template recorded

## CEO Decision

```text
PROCEED
```

This template turns the source-depth evidence acceptance criteria into a
repeatable local-only question format. It is used to prepare future source
review conversations without creating real evidence artifacts, fetching market
data, parsing market rows, connecting to Supabase, running SQL, wiring runtime
code, changing scoreSource, clearing source-depth not_ready, or making public
claims.

This template does not approve authorization, does not schedule a formal
meeting, does not create an authorization packet, does not create a real request
packet, does not create real evidence artifact files, does not connect to
Supabase, does not run SQL, does not fetch market data, does not parse market
rows, does not write Supabase, does not write staging rows, does not write
daily_prices, does not create seed SQL, does not wire runtime code, does not set
scoreSource=real, does not clear source-depth not_ready, and does not make
public claims.

## Template Usage Rules

```text
TEMPLATE-USAGE-001 use this template only for local-only readiness questions
TEMPLATE-USAGE-002 keep every answer as unanswered, needs_review, blocked, or locally_ready_for_review
TEMPLATE-USAGE-003 do not attach real evidence files to this template
TEMPLATE-USAGE-004 do not paste raw market data into this template
TEMPLATE-USAGE-005 do not paste Supabase output into this template
TEMPLATE-USAGE-006 do not treat locally_ready_for_review as production-ready
TEMPLATE-USAGE-007 do not treat this template as authorization approval
TEMPLATE-USAGE-008 do not use this template to clear source-depth not_ready
```

## Question Template

```text
QUESTION-TEMPLATE-001 source identity
Question: What source is being proposed for review?
Reviewer owner: CEO
Expected answer type: source name, source category, and unresolved identity notes
Allowed status: unanswered, needs_review, blocked, locally_ready_for_review
Blocked boundary note: do not verify by fetching or connecting externally

QUESTION-TEMPLATE-002 source officialness
Question: Is the source official, exchange-operated, vendor-operated, or unofficial?
Reviewer owner: Investment
Expected answer type: classification and uncertainty note
Allowed status: unanswered, needs_review, blocked, locally_ready_for_review
Blocked boundary note: do not use this classification as public-source approval

QUESTION-TEMPLATE-003 source rights
Question: What rights, licensing, redistribution, caching, or display questions must Legal answer?
Reviewer owner: Legal
Expected answer type: legal question list and unresolved rights notes
Allowed status: unanswered, needs_review, blocked, locally_ready_for_review
Blocked boundary note: do not approve redistribution or public claims here

QUESTION-TEMPLATE-004 access path
Question: What endpoint, file path, API page, or access path is being described without executing it?
Reviewer owner: Engineering
Expected answer type: non-executed access description and known constraints
Allowed status: unanswered, needs_review, blocked, locally_ready_for_review
Blocked boundary note: do not fetch, parse, connect, or run SQL

QUESTION-TEMPLATE-005 field completeness
Question: Are date, symbol, open, high, low, close, volume, and adjustment notes covered or explicitly unknown?
Reviewer owner: Investment and QA
Expected answer type: required, optional, missing, and unknown field list
Allowed status: unanswered, needs_review, blocked, locally_ready_for_review
Blocked boundary note: do not inspect live rows to answer this template

QUESTION-TEMPLATE-006 coverage period
Question: What coverage period is expected and what remains unknown?
Reviewer owner: Investment
Expected answer type: period expectation and unknown coverage notes
Allowed status: unanswered, needs_review, blocked, locally_ready_for_review
Blocked boundary note: do not validate coverage by downloading market data

QUESTION-TEMPLATE-007 freshness expectation
Question: What freshness expectation is required for model credibility review?
Reviewer owner: CEO and QA
Expected answer type: expected update cadence and stale-data risk note
Allowed status: unanswered, needs_review, blocked, locally_ready_for_review
Blocked boundary note: do not poll live data or execute validators

QUESTION-TEMPLATE-008 failure modes
Question: Which failure modes must be handled before this source can support future review?
Reviewer owner: QA and Engineering
Expected answer type: missing fields, stale data, schema drift, non-official source, rate limit, and rights uncertainty notes
Allowed status: unanswered, needs_review, blocked, locally_ready_for_review
Blocked boundary note: do not convert failure-mode notes into runtime behavior

QUESTION-TEMPLATE-009 public claim dependency
Question: Which future public claims would depend on this source, and what approvals would be required?
Reviewer owner: CEO, Legal, Investment, Marketing
Expected answer type: claim category, evidence dependency, and approval dependency
Allowed status: unanswered, needs_review, blocked, locally_ready_for_review
Blocked boundary note: do not approve or publish public claims

QUESTION-TEMPLATE-010 authorization dependency
Question: What future external-system or real-data action would require Chairman and CEO approval?
Reviewer owner: Chairman and CEO
Expected answer type: narrow approval question and blocked execution boundary
Allowed status: unanswered, needs_review, blocked, locally_ready_for_review
Blocked boundary note: do not schedule meeting, create packet, or execute authorization
```

## Status Semantics

```text
STATUS-SEMANTIC-001 unanswered means the question has not been reviewed
STATUS-SEMANTIC-002 needs_review means an owner must review the question text or criteria
STATUS-SEMANTIC-003 blocked means the question cannot advance without authorization, external data, legal answer, or role decision
STATUS-SEMANTIC-004 locally_ready_for_review means the local wording is ready for human review only
STATUS-SEMANTIC-005 locally_ready_for_review does not mean production-ready
STATUS-SEMANTIC-006 locally_ready_for_review does not mean source-depth not_ready can be cleared
STATUS-SEMANTIC-007 locally_ready_for_review does not mean scoreSource=real is allowed
STATUS-SEMANTIC-008 locally_ready_for_review does not mean public claims are approved
```

## Rejection Rules

```text
REJECT-TEMPLATE-001 reject a filled template if it contains raw market data
REJECT-TEMPLATE-002 reject a filled template if it contains Supabase query output
REJECT-TEMPLATE-003 reject a filled template if it implies authorization approval
REJECT-TEMPLATE-004 reject a filled template if it implies real evidence files exist
REJECT-TEMPLATE-005 reject a filled template if it implies market data was fetched
REJECT-TEMPLATE-006 reject a filled template if it implies market rows were parsed
REJECT-TEMPLATE-007 reject a filled template if it implies SQL was executed
REJECT-TEMPLATE-008 reject a filled template if it implies scoreSource=real is approved
REJECT-TEMPLATE-009 reject a filled template if it implies source-depth not_ready is cleared
REJECT-TEMPLATE-010 reject a filled template if it implies public claims are approved
```

## CEO Pace Assessment

```text
CEO pace assessment: this template is fast-lane enough because it converts criteria into reusable execution shape
CEO pace assessment: do not add role review unless the template changes boundary meaning
CEO pace assessment: the next useful step is a local-only filled-example design using fictional placeholder content only
CEO pace assessment: remain blocked on real evidence, Supabase, SQL, market data, scoreSource=real, and public claims
```

## Next Safe Slice Recommendation

```text
Next safe slice: prepare CP3 source-depth evidence local-only filled-example design
Alternative next safe slice: prepare runtime state naming acceptance criteria
CEO recommendation: prepare CP3 source-depth evidence local-only filled-example design with fictional placeholder content only
The next safe slice must remain local-only
The next safe slice must not contain raw market data
The next safe slice must not contain Supabase output
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
scripts/check-cp3-source-depth-evidence-local-only-question-template.mjs passes
scripts/check-cp3-source-depth-evidence-owner-action-acceptance-criteria.mjs passes
scripts/check-review-gates.mjs passes
TypeScript noEmit passes
public data source remains mock
CP3 source-depth production gate remains not_ready
scoreSource=real remains blocked
Supabase and SQL execution remain blocked
```
