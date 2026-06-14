# Phase 1 UI/UX Style Direction

Date: 2026-06-14

Status: `phase_1_ui_ux_style_direction_ready`

Owner: CEO / PM mainline

Decision: `LIGHT_FINANCIAL_DASHBOARD_WITH_FOCUSED_STATUS_EMPHASIS`

## Purpose

This document translates the `ui-ux-pro-max` evaluation into the Phase 1 style direction for the public free index-lighting website.

The goal is not a broad redesign. It is a constrained UI/UX direction for the final Phase 1 polish pass, so the site can feel more like a trustworthy market-status dashboard without becoming a professional trading terminal.

## CEO Skill Responsibility Split

CEO accepts the chairman's split between `ui-ux-pro-max` and `frontend-design`.

`ui-ux-pro-max` owns the product UX structure:

- information architecture;
- user flows;
- component layout;
- CTA design;
- form flow.

`frontend-design` owns the visual expression layer:

- visual style;
- color;
- cards;
- icons;
- typography;
- animation.

PM integration rule: use `ui-ux-pro-max` first when a change affects what users see first, what path they follow, what action they can take, or how a form is completed. Use `frontend-design` after the UX structure is stable, or when the slice is explicitly about visual identity, palette, card treatment, icon system, type hierarchy, or motion.

Conflict rule: if the two skills disagree, Phase 1 follows user comprehension and launch safety first. Visual polish must not hide source/update-time limits, non-investment-advice boundaries, or the mock/real data boundary.

## Skill Evaluation Input

The `ui-ux-pro-max` design-system search matched this product to:

- pattern: `Real-Time Monitoring`;
- product type: fintech / investment dashboard / market signal;
- recommended mood: financial, trustworthy, professional, serious;
- recommended chart direction: line chart or area chart for trend-over-time views;
- required UX safeguards: visible loading/error states, color not as the only signal, readable contrast, keyboard and mobile accessibility.

The raw recommendation leaned toward an OLED dark-mode monitoring style. CEO rejects full dark-mode adoption for Phase 1 because the BRIEF targets ordinary investors, not professional traders. A dark trading-terminal look would increase distance and may make the product feel more complex than the first-phase promise.

## Adopted Style Position

Phase 1 should use:

`clean light financial dashboard + focused status emphasis + restrained trust accents`

This means:

- keep the current light background and calm reading surface;
- make market status, risk, update time, and data boundary visually easier to scan;
- use red / amber / green as status language, but always pair color with text labels and explanations;
- use a limited dark trust accent only for brand marks, key headers, or high-emphasis summary areas;
- avoid decorative hero imagery, oversized marketing sections, and full visual rebranding before Phase 1 acceptance.

## Visual Principles

### 1. First Screen Must Behave Like A Dashboard

The first screen should answer, in order:

1. What is the current market state?
2. Why is it in this state?
3. What should I observe next?
4. How fresh or limited is the data?
5. Why is this not investment advice?

The first screen should not read like an internal readiness packet, a project status page, or a documentation page.

### 2. Status Must Not Rely On Color Alone

Every red / amber / green state must include:

- a readable label;
- a short explanation;
- a next observation or risk note when the state affects user action;
- enough contrast for light-mode reading.

### 3. Cards Should Be Calm, Dense, And Scannable

Cards may remain 8px radius or less. They should feel like repeated data objects, not decorative marketing blocks.

Good card use:

- market signal;
- risk reason;
- update-time / data status;
- next observation;
- watchlist or membership preview.

Avoid:

- nested cards inside cards;
- decorative cards that only repeat explanatory text;
- large empty panels that reduce scan speed.

### 4. Typography Should Stay Reader-Friendly

Phase 1 keeps the current Chinese-friendly system font stack unless a later dedicated typography pass is approved.

Priority:

- strong headings;
- compact labels;
- readable body text;
- no negative letter spacing;
- no viewport-width font scaling;
- long Chinese labels must wrap cleanly on mobile.

### 5. Charts Are Later, But Their Direction Is Fixed

When charts enter Phase 1 or Phase 2, default to:

- line chart for trend over time;
- area chart only when cumulative trend needs emphasis;
- color plus line pattern or label for accessibility;
- hover details only when they do not block mobile reading.

Do not introduce pie, gauge, radar, decorative 3D, or animation-heavy charts for the first market-status experience.

## Allowed Phase 1 Polish

The final Phase 1 UI/UX pass may change:

- homepage first-screen hierarchy;
- signal card emphasis;
- risk and update-time grouping;
- mobile stacking and spacing;
- card density and labels;
- CTA/link hierarchy for briefing, methodology, membership preview, and risk disclosure;
- copy placement when a user needs trust or boundary context near a signal.

## Deferred Work

Do not use this style direction to start:

- full dark-mode redesign;
- full brand redesign;
- decorative image or illustration system;
- motion design;
- member dashboard UI;
- login, payment, persisted watchlist, personalized alert, or member-only gates;
- real-data promotion;
- Supabase write, SQL, ingestion, backfill, or `daily_prices` mutation.

## Route-Level Priorities

| Route | Phase 1 UI/UX focus | Not Now |
| --- | --- | --- |
| `/` | First-screen dashboard clarity, market state, reason, next observation, data boundary. | Decorative landing redesign. |
| `/stocks/[symbol]` | Symbol state, reason, risk score context, update time, market comparison. | Full professional quote terminal. |
| `/briefing` | Morning-read flow, alert list, 30-second / 3-minute decision path. | Long-form research report UI. |
| `/weekly` | Weekly status and observation recap. | Newsletter product redesign. |
| `/membership` | Phase 2 preview and free-vs-member boundary. | Login, billing, gated content. |
| `/methodology` | Explain how to read lights and boundaries. | Technical model whitepaper visual system. |
| legal routes | Trust, non-advice, data limitation clarity. | Legal microsite redesign. |

## Acceptance Criteria

The final UI/UX polish pass should be considered successful when:

- ordinary users can identify market or symbol state from the first screen;
- the next observation is visible before secondary details;
- mock / data limitation / non-investment-advice boundaries remain visible but not visually dominant;
- no developer-process wording appears in public routes;
- no route has mobile horizontal overflow;
- status color is backed by text;
- cards and panels are consistent enough to feel like one product;
- Phase 2 membership remains preview-only.

## Recommended Next Slice

PM should start with a bounded homepage and stock-page visual hierarchy pass:

1. strengthen homepage first-screen dashboard composition;
2. make signal / reason / next observation / update-time hierarchy clearer;
3. apply the same hierarchy to `/stocks/TWII`, `/stocks/2330`, and `/stocks/0050`;
4. run local route, residue, visible-language, mobile overflow, and browser checks.

Do not begin with global CSS redesign. Touch only the smallest set of components needed to improve Phase 1 comprehension.
