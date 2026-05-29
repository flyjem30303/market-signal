# CP3 Source-Depth Evidence Template Usage Guide

Checkpoint: CP3 Model Credibility
Date: 2026-05-29
Owner: E / CEO
Status: local-only usage guide recorded

## CEO Decision

```text
REVISE
```

This local-only usage guide explains how future reviewers may use the blank
source-depth evidence template. It does not approve creating real evidence
artifact files, filling template values, creating the future evidence checker,
creating JSON sample artifacts, creating JSON or CSV market data, historical
ingestion, remote validation, Supabase reads, SQL execution, runtime repository
work, public UI wiring, production `scoreSource=real`, source-depth approval,
or public claims.

```text
local-only usage guide
does not approve creating real evidence artifact files, filling template values, creating the future evidence checker
source-depth approval, or public claims
```

## Evidence

```text
docs/evidence/CP3_SOURCE_DEPTH_CATEGORY_EVIDENCE_TEMPLATE.md
scripts/check-cp3-source-depth-evidence-blank-template.mjs
docs/reviews/CP3_SOURCE_DEPTH_EVIDENCE_BLANK_TEMPLATE_ROLE_REVIEW_2026-05-29.md
scripts/check-cp3-tw-stock-source-depth.mjs remains not_ready as expected
```

## Allowed Future Workflow

Future source-depth evidence work may start from the blank template only after a
separate CEO approval. The safe workflow is:

```text
start from the blank template
choose one evidence category
duplicate only after separate CEO approval
copied artifact starts as not_ready
keep Public-Claim Boundary
keep Source-Rights Boundary
keep Display-State Boundary
never paste raw rows or market data
```

The copied artifact must remain a local-only review artifact until a later role
review explicitly approves the content and the associated checker.

## Windows-Safe Future Artifact Naming

The current blank template file is:

```text
docs/evidence/CP3_SOURCE_DEPTH_CATEGORY_EVIDENCE_TEMPLATE.md
```

Future artifact names should use this Windows-safe future artifact naming
pattern only after a separate approval:

```text
docs/evidence/CP3_SOURCE_DEPTH_<SAFE_CATEGORY>_EVIDENCE_YYYY-MM-DD.md
```

```text
SAFE_CATEGORY must use uppercase letters, numbers, and underscores only
```

The `<CATEGORY>` placeholder may appear inside document text, but it must not be
used directly in a Windows file name.

## Fill Rules

```text
replace TODO only with documented summaries after separate approval
never fabricate dates, trading date counts, or field coverage
Approval Status remains not_ready until CEO synthesis
no raw market rows
no CSV market data
no JSON market data
no Supabase reads
no SQL execution
```

Evidence summaries must be derived from an approved local-only review process.
They must not come from live Supabase queries, ad hoc market-data fetching, or
unstaged private files.

## Required Review Before Any Real Evidence File

```text
PM+Dev owner review required
Investment owner review required
Legal source-rights and public-claim check required
Design display-state boundary review required
CEO synthesis required
```

No copied evidence artifact may become an approval source until the above review
is complete and a separate checker is added.

## CEO Synthesis

```text
This usage guide makes the future evidence creation process explicit, but it
still does not create evidence artifacts, does not fill template values, does
not create the future evidence checker, and does not make source_depth_state
reviewable.
```

```text
does not create evidence artifacts
does not fill template values
does not create the future evidence checker
does not make source_depth_state reviewable
```

The next safe slice is a role review for this usage guide before any real
evidence artifact approval gate.

## Non-Negotiable Guardrails

```text
usage guide only
do not create real evidence artifact files
do not fill template values
do not create future evidence checker
do not create JSON sample artifacts
do not create JSON market data
do not create CSV market data
do not fetch market data
do not parse market rows
do not run source-depth validator against Supabase
do not import copy tokens into public pages
do not import copy tokens into public components
do not import policy into public pages
do not import policy into public components
do not wire policy into data fetching
do not implement runtime repository
do not read remote data
do not run validator
do not connect to Supabase
do not run SQL
do not write Supabase
do not write staging rows
do not write daily_prices
do not create seed SQL
do not store raw market rows
do not commit CSV / JSON market data files
do not set scoreSource=real
do not make public backtest claims
do not clear source-depth not_ready
CP3 source-depth production gate remains not_ready
Keep public data source mock
```

## Next Implementation Slice

```text
record CP3 source-depth evidence template usage guide role review
do not create real evidence artifact files
do not fill template values
do not create future evidence checker
do not run validator
do not connect to Supabase
do not run SQL
do not write Supabase
do not create seed SQL
do not commit raw market data
keep public data source mock
```
