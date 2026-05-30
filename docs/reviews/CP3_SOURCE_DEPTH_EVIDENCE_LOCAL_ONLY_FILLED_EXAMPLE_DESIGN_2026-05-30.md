# CP3 Source-Depth Evidence Local-Only Filled-Example Design

Checkpoint: CP3 Model Credibility
Date: 2026-05-30
Trigger: CP3 source-depth evidence local-only question template recorded

Status: CP3 source-depth evidence local-only filled-example design recorded

## CEO Decision

```text
PROCEED
```

This filled-example design shows how the local-only question template should be
completed by future reviewers. The example uses fictional placeholder content
only. It is not a real evidence artifact, not a source approval, not a legal
approval, not an authorization request, not a market-data result, not a
Supabase result, not a runtime implementation plan, and not a public claim.

This design does not approve authorization, does not schedule a formal meeting,
does not create an authorization packet, does not create a real request packet,
does not create real evidence artifact files, does not connect to Supabase, does
not run SQL, does not fetch market data, does not parse market rows, does not
write Supabase, does not write staging rows, does not write daily_prices, does
not create seed SQL, does not wire runtime code, does not set scoreSource=real,
does not clear source-depth not_ready, and does not make public claims.

## Fictional Placeholder Source

```text
PLACEHOLDER-SOURCE-001 source name: Fictional Exchange Daily Bars Sandbox Source
PLACEHOLDER-SOURCE-002 source category: fictional placeholder exchange-operated source
PLACEHOLDER-SOURCE-003 source officialness: locally_ready_for_review as placeholder wording only
PLACEHOLDER-SOURCE-004 source rights: needs_review by Legal
PLACEHOLDER-SOURCE-005 access path: described as non-executed placeholder documentation path
PLACEHOLDER-SOURCE-006 data rows: no rows included
PLACEHOLDER-SOURCE-007 market values: no prices, volumes, dates, or symbols included
PLACEHOLDER-SOURCE-008 Supabase output: no Supabase output included
PLACEHOLDER-SOURCE-009 public claim status: blocked
PLACEHOLDER-SOURCE-010 scoreSource status: blocked
```

## Filled Example

```text
QUESTION-TEMPLATE-001 source identity
Example answer: Fictional Exchange Daily Bars Sandbox Source is proposed only as a placeholder source identity for reviewing template structure.
Reviewer owner: CEO
Status: locally_ready_for_review
Blocked boundary note: do not verify by fetching or connecting externally

QUESTION-TEMPLATE-002 source officialness
Example answer: The placeholder is treated as exchange-operated for example-format purposes only; actual officialness remains unanswered for real sources.
Reviewer owner: Investment
Status: locally_ready_for_review
Blocked boundary note: do not use this classification as public-source approval

QUESTION-TEMPLATE-003 source rights
Example answer: Legal must answer licensing, redistribution, caching, display, retention, and user-facing attribution questions before any real source is used.
Reviewer owner: Legal
Status: needs_review
Blocked boundary note: do not approve redistribution or public claims here

QUESTION-TEMPLATE-004 access path
Example answer: The placeholder access path is described as a non-executed documentation page; no URL is opened, no endpoint is called, and no SQL is run.
Reviewer owner: Engineering
Status: locally_ready_for_review
Blocked boundary note: do not fetch, parse, connect, or run SQL

QUESTION-TEMPLATE-005 field completeness
Example answer: The expected field checklist includes date, symbol, open, high, low, close, volume, and adjustment notes; no real row is inspected.
Reviewer owner: Investment and QA
Status: locally_ready_for_review
Blocked boundary note: do not inspect live rows to answer this template

QUESTION-TEMPLATE-006 coverage period
Example answer: Coverage should be described as a future review question; no start date, end date, row count, or market calendar is validated here.
Reviewer owner: Investment
Status: needs_review
Blocked boundary note: do not validate coverage by downloading market data

QUESTION-TEMPLATE-007 freshness expectation
Example answer: Freshness should be stated as a future model credibility requirement; no live polling, validator run, or data-source check is performed.
Reviewer owner: CEO and QA
Status: needs_review
Blocked boundary note: do not poll live data or execute validators

QUESTION-TEMPLATE-008 failure modes
Example answer: Reviewers must consider missing fields, stale data, schema drift, non-official source, rate limit, rights uncertainty, and attribution ambiguity.
Reviewer owner: QA and Engineering
Status: locally_ready_for_review
Blocked boundary note: do not convert failure-mode notes into runtime behavior

QUESTION-TEMPLATE-009 public claim dependency
Example answer: Any future public statement about source reliability, coverage, freshness, or officialness requires Legal, Investment, Marketing, and CEO approval.
Reviewer owner: CEO, Legal, Investment, Marketing
Status: blocked
Blocked boundary note: do not approve or publish public claims

QUESTION-TEMPLATE-010 authorization dependency
Example answer: Any future real-data validation, Supabase read, SQL execution, staging write, or scoreSource transition requires a separate Chairman and CEO approval question.
Reviewer owner: Chairman and CEO
Status: blocked
Blocked boundary note: do not schedule meeting, create packet, or execute authorization
```

## Filled Example Rules

```text
FILLED-EXAMPLE-RULE-001 every example answer must remain fictional placeholder content
FILLED-EXAMPLE-RULE-002 every example answer must avoid raw market data
FILLED-EXAMPLE-RULE-003 every example answer must avoid Supabase output
FILLED-EXAMPLE-RULE-004 every example answer must avoid real source approval
FILLED-EXAMPLE-RULE-005 every example answer must avoid public claim approval
FILLED-EXAMPLE-RULE-006 every example answer must avoid scoreSource=real approval
FILLED-EXAMPLE-RULE-007 every example answer must avoid source-depth not_ready clearance
FILLED-EXAMPLE-RULE-008 every example answer must preserve local-only review semantics
```

## Rejection Rules

```text
REJECT-FILLED-EXAMPLE-001 reject if the example contains a real market symbol
REJECT-FILLED-EXAMPLE-002 reject if the example contains raw price, volume, or OHLC rows
REJECT-FILLED-EXAMPLE-003 reject if the example contains Supabase query output
REJECT-FILLED-EXAMPLE-004 reject if the example contains SQL result output
REJECT-FILLED-EXAMPLE-005 reject if the example implies authorization approval
REJECT-FILLED-EXAMPLE-006 reject if the example implies source-rights approval
REJECT-FILLED-EXAMPLE-007 reject if the example implies public claims are approved for release
REJECT-FILLED-EXAMPLE-008 reject if the example implies scoreSource=real is approved
REJECT-FILLED-EXAMPLE-009 reject if the example implies source-depth not_ready is cleared
REJECT-FILLED-EXAMPLE-010 reject if the example implies runtime implementation can begin
```

## CEO Pace Assessment

```text
CEO pace assessment: this is a useful fast-lane slice because it makes the template operational without crossing execution boundaries
CEO pace assessment: do not add role review because boundary meaning did not change
CEO pace assessment: the next useful step is runtime state naming acceptance criteria, unless CEO wants another source-depth template refinement
CEO pace assessment: source-depth evidence remains blocked for real execution until explicit authorization
```

## Next Safe Slice Recommendation

```text
Next safe slice: prepare CP3 runtime state naming acceptance criteria
Alternative next safe slice: prepare source-depth filled-example static rejection checklist
CEO recommendation: prepare CP3 runtime state naming acceptance criteria
The next safe slice must remain local-only
The next safe slice must not implement runtime data state naming
The next safe slice must not connect to Supabase
The next safe slice must not run SQL
The next safe slice must not fetch market data
The next safe slice must not parse market rows
The next safe slice must not set scoreSource=real
The next safe slice must not clear source-depth not_ready
The next safe slice must not make public claims
```

## Verification Expectations

```text
scripts/check-cp3-source-depth-evidence-local-only-filled-example-design.mjs passes
scripts/check-cp3-source-depth-evidence-local-only-question-template.mjs passes
scripts/check-review-gates.mjs passes
TypeScript noEmit passes
public data source remains mock
CP3 source-depth production gate remains not_ready
scoreSource=real remains blocked
Supabase and SQL execution remain blocked
```
