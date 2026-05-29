# CP3 Source-Depth Evidence Template Usage Guide Role Review

Checkpoint: CP3 Model Credibility
Date: 2026-05-29
Trigger: CP3 source-depth evidence template usage guide recorded

Status: CP3 source-depth evidence template usage guide role review recorded

## CEO Decision

```text
REVISE
```

The usage guide is accepted as a local-only governance guide. It clarifies how a
future reviewer may duplicate the blank template, but it does not approve
creating real evidence artifact files, filling template values, creating the
future evidence checker, creating JSON sample artifacts, creating JSON or CSV
market data, historical ingestion, remote validation, Supabase reads, SQL
execution, runtime repository work, public UI wiring, production
`scoreSource=real`, source-depth approval, or public claims.

```text
accepted as a local-only governance guide
does not approve creating real evidence artifact files, filling template values, creating the future evidence checker
source-depth approval, or public claims
```

## Evidence

```text
docs/CP3_SOURCE_DEPTH_EVIDENCE_TEMPLATE_USAGE_GUIDE_2026-05-29.md
scripts/check-cp3-source-depth-evidence-template-usage-guide.mjs
docs/reviews/CP3_SOURCE_DEPTH_EVIDENCE_BLANK_TEMPLATE_ROLE_REVIEW_2026-05-29.md
scripts/check-cp3-tw-stock-source-depth.mjs remains not_ready as expected
```

## Verification

```text
scripts/check-cp3-source-depth-evidence-template-usage-guide.mjs passes
scripts/check-cp3-source-depth-evidence-blank-template-role-review.mjs passes
scripts/check-cp3-runtime-policy-draft.mjs passes
scripts/check-cp3-ui-copy-tokens-draft.mjs passes
TypeScript noEmit passes via node node_modules/typescript/bin/tsc --noEmit
review gates pass
```

## Role Review

A / PM+Dev:

```text
Engineering accepts the usage guide because it defines a controlled future
workflow without creating a real evidence file. The Windows-safe naming rule and
SAFE_CATEGORY rule reduce future file-system ambiguity.
```

```text
controlled future workflow
Windows-safe naming rule
SAFE_CATEGORY rule
```

B / Marketing:

```text
Marketing accepts the guide because it preserves Public-Claim Boundary and says
public claims still require separate CEO synthesis. Marketing does not approve
SEO copy claims, model quality claims, or public backtest claims from this guide.
```

```text
does not approve SEO copy claims, model quality claims, or public backtest claims
```

C / Investment:

```text
Investment accepts the guide because it says never fabricate dates, trading date
counts, or field coverage, and it keeps copied artifacts at not_ready until CEO
synthesis.
```

```text
never fabricate dates, trading date counts, or field coverage
not_ready until CEO synthesis
```

D / Legal:

```text
Legal accepts the guide because it preserves Source-Rights Boundary and forbids
Supabase reads, SQL execution, raw market rows, CSV market data, JSON market
data, and source-rights approval by implication.
```

```text
forbids Supabase reads, SQL execution, raw market rows, CSV market data, JSON market data
```

E / CEO:

```text
Proceed with a local-only CP3 source-depth evidence artifact approval gate plan.
The next slice may define when a future real evidence artifact is allowed to be
created, but it must not create real evidence artifact files, fill template
values, create the future evidence checker, fetch market data, parse market
rows, connect to Supabase, run SQL, or clear source-depth not_ready.
```

F / Design:

```text
Design accepts the guide because it preserves Display-State Boundary and keeps
the work non-runtime. No UI component wiring, public page copy, or public state
badge change is approved.
```

```text
No UI component wiring, public page copy, or public state badge change is approved
```

## Conflicts

```text
PM wants an approval gate before any template copy
Marketing wants public-claim denial preserved
Investment wants no fabricated evidence summaries
Legal wants source-rights approval blocked
Design wants no runtime display changes
CEO selects local-only source-depth evidence artifact approval gate plan
```

## CEO Synthesis

```text
The usage guide is accepted, but it is still not evidence and still does not make
source_depth_state reviewable. The next safe slice is a local-only approval gate
plan that defines the conditions required before any real source-depth evidence
artifact may be created from the template.
```

```text
not evidence
does not make source_depth_state reviewable
approval gate plan
before any real source-depth evidence artifact may be created
```

## Non-Negotiable Guardrails

```text
role review only
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
draft CP3 source-depth evidence artifact approval gate plan
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
