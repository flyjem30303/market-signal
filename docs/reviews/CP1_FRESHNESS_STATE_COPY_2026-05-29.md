# CP1 Follow-up: Freshness State Copy

Checkpoint: CP1 Data Trust Checkpoint
Date: 2026-05-29
Trigger: CP1-to-CP2 checklist requires approved public UI states for stale,
partial, and unavailable data.

## A / PM+Dev

A added a state description to the freshness snapshot and renders it in the
freshness strip. The copy is data-driven and shared by briefing and stock pages.
`check:freshness-state-ui` protects the requirement.

## B / Marketing

B approves concise state copy because it improves trust without turning the page
into a warning wall.

## C / Investment

C approves because partial, stale, mock, and unavailable states now explicitly
tell users to interpret scores conservatively.

## D / Legal

D approves because the UI no longer hides uncertainty when data is simulated,
partial, delayed, or unavailable.

## E / CEO

This completes the CP1 public UI state requirement for data freshness, while
CP2 remains closed due to real-score and source-approval blockers.

## F / Design

F approves the compact inline placement. The description can wrap on mobile
without resizing score cards or quote cards.

## Conflicts

```text
None.
```

## CEO Synthesis

Freshness state is now understandable enough for public-page trust review. This
does not approve real data or real scores.

## Decision

```text
PROCEED
```

## Required Adjustments

```text
Keep freshness descriptions visible on market-aware public pages.
Keep check:freshness-state-ui in review gates.
Review translations before multi-language launch.
```

## Next Implementation Slice

Continue CP1-to-CP2 readiness by documenting the CP3 model credibility path or
by preparing public real-data disclosure copy.
