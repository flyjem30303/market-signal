# Project Review Checkpoints

## CEO Decision

The project will no longer move as a continuous stream of implementation tasks.
At defined checkpoints, development pauses and all roles review the project
together before the next build cycle starts.

The purpose is not to slow development. The purpose is to prevent the product
from drifting into a technically working but strategically weak direction.

## Review Principle

Each checkpoint must answer three questions:

1. Are we still building the right product?
2. Are the latest engineering choices increasing or reducing future optionality?
3. What must be adjusted before the next implementation slice?

CEO owns the final synthesis. A resumes implementation only after CEO converts
the discussion into concrete project adjustments.

## Checkpoint Types

### CP0: Handoff / Context Check

Trigger:

- New machine.
- New thread.
- Long pause.
- Major project context transfer.

Required review:

- A confirms files, commands, Git, and environment.
- E confirms current strategy and next priority.
- B/C/D/F confirm whether their previous requirements are still valid.

Exit criteria:

- Project can run locally.
- Current strategy is restated.
- Next slice is explicitly chosen.

### CP1: Data Trust Checkpoint

Trigger:

- New market data source.
- New database schema.
- New ingestion script.
- Repository switches from mock to real data.

Role discussion:

- A: Is the data pipeline repeatable, documented, and versioned?
- B: Can this data support SEO and user-facing content?
- C: Are source attribution, freshness, missing data, and model assumptions clear?
- D: Does the UI risk presenting incomplete data as investment advice?
- E: Does this increase trust and long-term usage enough to justify the complexity?
- F: How should data quality and freshness appear without cluttering the tool?

CEO synthesis must decide:

- Proceed.
- Revise before proceeding.
- Defer or remove.

### CP2: Product Experience Checkpoint

Trigger:

- New page.
- Major page redesign.
- New dashboard component.
- New mobile workflow.

Role discussion:

- A: Is the implementation maintainable and accessible?
- B: Does the page have search intent, internal links, and conversion logic?
- C: Are investment claims appropriately bounded?
- D: Are disclosures visible enough without harming usability?
- E: Does the workflow make users return daily or weekly?
- F: Does the UI feel like a professional financial tool?

CEO synthesis must decide:

- What stays.
- What gets simplified.
- What is delayed.

### CP3: Model Credibility Checkpoint

Trigger:

- New score formula.
- New model module.
- New backtest.
- New market or asset class calibration.

Role discussion:

- A: Can the model be calculated reliably from available data?
- B: Can the model be explained in user language without overclaiming?
- C: Are indicators, weights, samples, and assumptions defensible?
- D: Does the language avoid personalized investment advice?
- E: Is the score useful enough to become a habit?
- F: Are score, confidence, and caveats visually understandable?

CEO synthesis must decide:

- Model version name.
- Required disclosures.
- Required test / backtest evidence.
- Whether the score can be shown publicly.

### CP4: Globalization Checkpoint

Trigger:

- New country.
- New exchange.
- New currency.
- New language.
- New route structure for global markets.

Role discussion:

- A: Does the schema support country / exchange / currency / timezone / asset type?
- B: Is there a clear audience and SEO wedge for this market?
- C: Are model assumptions market-specific?
- D: Are disclosures and commercial offers suitable for the region?
- E: Is this real expansion or just more shallow pages?
- F: Can users switch markets and languages without interface noise?

CEO synthesis must decide:

- Whether the market is active, reference-only, or placeholder.
- Whether pages can be indexed.
- Whether scoring is enabled.
- Which language and region rules apply.

### CP5: Commercialization Checkpoint

Trigger:

- Ads.
- Affiliate placements.
- Membership.
- Email alerts.
- Paid features.

Role discussion:

- A: Is the feature technically stable and measurable?
- B: Does it support monetization without harming trust?
- C: Could financial interpretation be distorted by incentives?
- D: Are disclosures, consent, privacy, and regional rules sufficient?
- E: Is the timing right, or are we monetizing before trust exists?
- F: Does the commercial surface feel separated from the tool's core judgment?

CEO synthesis must decide:

- Approved placements.
- Forbidden placements.
- Required copy and disclosure.
- Metrics to monitor after launch.

### CP6: Release / Deployment Checkpoint

Trigger:

- First public deployment.
- Major release.
- Switching real users to real data.

Role discussion:

- A: Build, env, deployment, monitoring, rollback.
- B: SEO readiness, launch pages, tracking.
- C: Data quality and model caveats.
- D: Terms, privacy, disclaimer, affiliate disclosure.
- E: Release scope and success metrics.
- F: Desktop / mobile readiness and trust impression.

CEO synthesis must decide:

- Ship.
- Ship as private beta.
- Hold release.

## Standard Review Output

Every checkpoint should produce a short written review using this structure:

```text
Checkpoint:
Date:
Trigger:

A / PM+Dev:
B / Marketing:
C / Investment:
D / Legal:
E / CEO:
F / Design:

Conflicts:
CEO synthesis:
Decision:
Required adjustments:
Next implementation slice:
```

## Decision Labels

Use one of these labels:

```text
PROCEED
REVISE
DEFER
STOP
```

- `PROCEED`: Continue with the next implementation slice.
- `REVISE`: Fix required issues before continuing.
- `DEFER`: Valid idea, wrong timing.
- `STOP`: Direction conflicts with product strategy or trust.

## Current Checkpoint Policy

As of 2026-05-28, the project is paused for governance setup.

Before continuing implementation, CEO requires:

1. Review checkpoint system documented.
2. Current project state summarized under the new process.
3. Next implementation slice chosen only after CEO synthesis.

Current expected next checkpoint:

```text
CP1: Data Trust Checkpoint
```

Reason:

- The project just added TWSE stock master data.
- It added latest market data SQL.
- It added global-ready market metadata.
- The next likely work is Supabase repository or live database setup.

Latest follow-up:

```text
docs/reviews/CP1_FRESHNESS_SOURCE_2026-05-28.md
docs/reviews/CP1_MIXED_ADAPTER_PREVIEW_2026-05-29.md
docs/reviews/CP1_DATA_QUALITY_SCORING_2026-05-29.md
docs/reviews/SUPABASE_BOOTSTRAP_VALIDATION_2026-05-29.md
docs/reviews/CP1_SUPABASE_READINESS_2026-05-29.md
docs/reviews/CP1_SUPABASE_MARKET_TRUST_REVIEW_2026-05-29.md
docs/reviews/CP1_PUBLIC_RELEASE_GATE_2026-05-29.md
docs/reviews/CP1_ETF_DATA_MODEL_2026-05-29.md
docs/reviews/CP1_ETF_SCHEMA_2026-05-29.md
docs/reviews/CP1_ETF_SCHEMA_ROLLOUT_GUARD_2026-05-29.md
docs/reviews/CP1_ETF_SOURCE_SELECTION_GATE_2026-05-29.md
docs/reviews/CP1_ETF_SOURCE_RESEARCH_2026-05-29.md
docs/reviews/CP1_ETF_SOURCE_READINESS_SCORE_2026-05-29.md
docs/reviews/CP1_ETF_SOURCE_DUE_DILIGENCE_2026-05-29.md
docs/reviews/CP1_ETF_SOURCE_REPORTING_2026-05-29.md
docs/reviews/CP1_ETF_SOURCE_INTERNAL_VIEW_2026-05-29.md
docs/reviews/CP1_INTERNAL_DIAGNOSTICS_CONSOLE_2026-05-29.md
docs/reviews/CP1_INTERNAL_ROUTE_EXPOSURE_GUARD_2026-05-29.md
docs/reviews/CP1_REVIEW_GATE_AGGREGATOR_2026-05-29.md
docs/reviews/CP1_CHECKPOINT_SNAPSHOT_2026-05-29.md
docs/reviews/CP1_TO_CP2_RELEASE_CHECKLIST_2026-05-29.md
docs/reviews/CP1_REMOTE_ETF_SCHEMA_VALIDATION_2026-05-29.md
docs/reviews/CP1_ETF_ENDPOINT_RESEARCH_2026-05-29.md
docs/reviews/CP1_ETF_JSON_URL_DISCOVERY_2026-05-29.md
docs/reviews/CP1_ETF_MIS_NAV_DISCLOSURE_2026-05-29.md
docs/reviews/CP1_ETF_MIS_VALIDATION_PLAN_2026-05-29.md
docs/reviews/CP1_ETF_MIS_SMOKE_REPORTER_2026-05-29.md
docs/reviews/CP1_ETF_MIS_LEGAL_FAIR_USE_2026-05-29.md
docs/reviews/CP1_SCORE_SOURCE_FRESHNESS_STRIP_2026-05-29.md
docs/reviews/CP1_SCORE_AREA_MODEL_STATUS_2026-05-29.md
docs/reviews/CP1_SCORE_SOURCE_UI_GUARD_2026-05-29.md
docs/reviews/CP1_FRESHNESS_STATE_COPY_2026-05-29.md
docs/reviews/CP3_MODEL_CREDIBILITY_PATH_2026-05-29.md
docs/reviews/CP3_TW_STOCK_MODEL_CANDIDATES_2026-05-29.md
docs/reviews/CP3_TW_STOCK_BACKTEST_METHOD_2026-05-29.md
docs/reviews/CP3_TW_STOCK_INPUT_READINESS_2026-05-29.md
docs/reviews/CP3_TW_STOCK_DRY_RUN_CONTRACT_2026-05-29.md
docs/reviews/CP3_TW_STOCK_DRY_RUN_REPORTER_2026-05-29.md
docs/reviews/CP3_TW_STOCK_DRY_RUN_INTERNAL_VIEW_2026-05-29.md
docs/reviews/CP3_TW_STOCK_SOURCE_DEPTH_2026-05-29.md
docs/reviews/CP3_TW_STOCK_HISTORICAL_DATA_PLAN_2026-05-29.md
docs/CP3_TW_STOCK_HISTORICAL_SOURCE_RESEARCH_2026-05-29.md
docs/CP3_TW_STOCK_ENDPOINT_CONTRACT_MATRIX_2026-05-29.md
docs/reviews/CP3_TW_STOCK_ENDPOINT_METADATA_PROBE_2026-05-29.md
docs/reviews/CP3_TW_STOCK_LEGAL_FIELD_CONTRACT_REVIEW_2026-05-29.md
```

CEO approved proceeding only to internal raw market preview and diagnostics.
Full UI repository switching remains unapproved.

Current snapshot:

```text
docs/reviews/CP1_CHECKPOINT_SNAPSHOT_2026-05-29.md
```
