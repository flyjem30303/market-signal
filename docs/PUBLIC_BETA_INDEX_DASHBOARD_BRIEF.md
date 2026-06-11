# Public Beta Index Dashboard Brief

## 1. Goal

Build a public Beta "index status dashboard" for general investors.

The product should let a user understand the market mood within 30 seconds and decide within 3 minutes whether to:

- follow the market more closely,
- increase observation,
- reduce risk.

Business goals:

- improve daily return visits,
- reduce the time needed to read market information,
- create durable content-entry points for articles, reports, subscriptions, and sharing.

## 2. Background

Market information about indexes, capital flow, volatility, sector breadth, ETF context, and market risk is fragmented and fast-moving. Users may have data but still fail to form a structured decision.

The product already uses traffic-light style signals to lower the reading barrier. The next step is to make the interface explain:

- why the state is green, yellow, or red,
- whether the signal is short-, medium-, or long-term,
- what can be reviewed later,
- what data is still mock, incomplete, delayed, or not yet approved.

The product direction is therefore not only indicator display. It is a decision-support reading interface.

## 3. Materials

Market materials:

- indexes,
- ETFs,
- sectors,
- industries,
- volatility,
- net fund flow,
- distance from moving averages,
- moving averages,
- momentum.

Visual materials:

- red/yellow/green status palette,
- chart style rules,
- trend arrows,
- alert icons,
- cards and table modules.

Copy materials:

- one-sentence explanation for each indicator,
- risk reminder,
- next-step suggestion such as follow, verify, wait, or reduce risk.

Product materials:

- neutral and steady brand voice,
- non-investment-advice posture,
- page priority,
- conversion targets such as favorite, subscribe, and share.

Legal and trust materials:

- information disclosure,
- risk statement,
- data freshness statement,
- copyright and source attribution.

Technical materials:

- API and update cadence,
- cache policy,
- error handling and fallback states,
- event tracking such as clicks, dwell time, expansions, and alert-card interaction.

## 4. Boundaries

The site focuses on information organization and risk identification.

It must not:

- provide individual buy or sell recommendations,
- promise returns,
- execute trades,
- publish unverified or stale data as current truth,
- claim second-level real-time precision before an update cadence is defined,
- use fear-based alert copy,
- let a single threshold create a hard conclusion without condition and context.

Current implementation boundaries:

- publicDataSource remains `mock` until source rights, coverage, quality, rollback, and runtime gates pass,
- scoreSource remains `mock` until model credibility and real-score promotion gates pass,
- no SQL or Supabase write should happen from public-readability slices,
- no raw market payloads, secrets, row payloads, or stock-id payloads should be exposed in public pages.

## 5. Definition Of Done

Phase 1 public Beta delivery:

- Home includes three layers: full-market overview, core indicator panel, alert list.
- Briefing includes market summary, risk context, data boundary, and alert list.
- Each alert includes status, cause, update time, impact level, and next step.

Content delivery:

- key indicators include a 30-second explanation,
- key indicators include a risk note under 100 Chinese characters when surfaced to general users,
- beginner and advanced reading paths are separable.

Experience delivery:

- responsive layout works across desktop and mobile,
- text contrast, font size, and heading hierarchy remain readable,
- loading or data errors show fallback information instead of blocking the page.

Product delivery:

- data source, timestamp, cache status, and fallback behavior are visible enough for trust,
- core tracking events cover clicks, return paths, dwell time, and alert-card interactions.

Acceptance:

- one data-update simulation passes,
- one high-traffic page experience check passes,
- core pages load within the expected local performance envelope,
- no blocking runtime error remains on public Beta routes.

## Current CEO Priority

Keep the mainline focused on the public Beta usable loop:

1. Data trust and source boundaries stay visible.
2. Market mood is readable in 30 seconds.
3. Risk action is understandable in 3 minutes.
4. Real-data promotion waits for source, coverage, quality, rollback, and runtime gates.
5. UI polish and visual styling are important, but they should not delay the data and decision-support foundation.
