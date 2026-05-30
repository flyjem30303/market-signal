# CP3 Mock-Only Runtime State Implementation Planning

Checkpoint: CP3 Model Credibility
Date: 2026-05-30
Trigger: CEO directed continuation until before runtime implementation

Status: CP3 mock-only runtime state implementation planning recorded

## CEO Decision

```text
PROCEED_TO_PLANNING_ONLY
```

This document plans a future mock-only runtime state implementation slice
without implementing runtime behavior. It defines what must be known before any
app runtime file is edited, any public UI is wired, any state names are imported
into components, or any runtime state packet is read.

This planning document does not approve authorization, does not schedule a
formal meeting, does not create an authorization packet, does not create a real
request packet, does not create real evidence artifact files, does not connect
to Supabase, does not run SQL, does not fetch market data, does not parse market
rows, does not write Supabase, does not write staging rows, does not write
daily_prices, does not create seed SQL, does not wire runtime code, does not
implement runtime state naming, does not import state names into public UI, does
not read runtime state packets, does not set scoreSource=real, does not clear
source-depth not_ready, and does not make public claims.

## Planning Scope

```text
PLANNING-SCOPE-001 identify future implementation objective as mock-only state display
PLANNING-SCOPE-002 identify required app file discovery before implementation
PLANNING-SCOPE-003 identify copy approval needs before public UI wiring
PLANNING-SCOPE-004 identify QA verification expectations before implementation
PLANNING-SCOPE-005 identify Engineering stop conditions before runtime edits
PLANNING-SCOPE-006 identify Legal and Design review triggers before user-facing wording
PLANNING-SCOPE-007 identify PM slice boundaries for a future mock-only implementation
PLANNING-SCOPE-008 identify CEO approval requirement before implementation starts
```

## Future Implementation Objective

```text
FUTURE-OBJECTIVE-001 future implementation may display mock-only runtime state status
FUTURE-OBJECTIVE-002 future implementation may use mock, blocked, stale, partial, unavailable, unknown, and internal_review wording only after approval
FUTURE-OBJECTIVE-003 future implementation must keep public data source mock
FUTURE-OBJECTIVE-004 future implementation must not use scoreSource=real
FUTURE-OBJECTIVE-005 future implementation must not claim approved real data
FUTURE-OBJECTIVE-006 future implementation must not clear source-depth not_ready
FUTURE-OBJECTIVE-007 future implementation must not connect to Supabase
FUTURE-OBJECTIVE-008 future implementation must not fetch or parse market data
```

## Required Pre-Implementation Discovery

```text
DISCOVERY-001 identify stock detail route files before implementation
DISCOVERY-002 identify briefing route files before implementation if shared state copy is reused
DISCOVERY-003 identify existing scoreSource UI guard files before implementation
DISCOVERY-004 identify existing freshness state UI files before implementation
DISCOVERY-005 identify existing stock decision compass files before implementation
DISCOVERY-006 identify copy token or disclosure files before implementation
DISCOVERY-007 identify test or checker files that must run after implementation
DISCOVERY-008 identify browser verification pages before implementation
```

## Required Approval Before Runtime Implementation

```text
APPROVAL-BEFORE-RUNTIME-001 CEO must approve exact implementation slice
APPROVAL-BEFORE-RUNTIME-002 PM must confirm the implementation is mock-only
APPROVAL-BEFORE-RUNTIME-003 Engineering must confirm no Supabase, SQL, network, or market data dependency
APPROVAL-BEFORE-RUNTIME-004 QA must confirm local verification steps
APPROVAL-BEFORE-RUNTIME-005 Design must confirm user-facing state wording if public UI copy changes
APPROVAL-BEFORE-RUNTIME-006 Legal must review wording if it could imply reliability, officialness, advice, or public claim
APPROVAL-BEFORE-RUNTIME-007 CEO must confirm source-depth not_ready remains unchanged
APPROVAL-BEFORE-RUNTIME-008 CEO must confirm scoreSource=real remains blocked
```

## Mock-Only Runtime Stop Conditions

```text
MOCK-RUNTIME-STOP-001 stop before editing runtime files in this planning slice
MOCK-RUNTIME-STOP-002 stop before importing allowed state names into public components
MOCK-RUNTIME-STOP-003 stop before adding user-facing copy
MOCK-RUNTIME-STOP-004 stop before reading state packet files
MOCK-RUNTIME-STOP-005 stop before connecting to Supabase
MOCK-RUNTIME-STOP-006 stop before running SQL
MOCK-RUNTIME-STOP-007 stop before fetching market data
MOCK-RUNTIME-STOP-008 stop before parsing market rows
MOCK-RUNTIME-STOP-009 stop before setting scoreSource=real
MOCK-RUNTIME-STOP-010 stop before clearing source-depth not_ready
MOCK-RUNTIME-STOP-011 stop before making public claims
MOCK-RUNTIME-STOP-012 stop before calling the implementation production-ready
```

## Future Verification Expectations

```text
FUTURE-VERIFY-001 run TypeScript noEmit after any future implementation
FUTURE-VERIFY-002 run review gates after any future implementation
FUTURE-VERIFY-003 run relevant local checker scripts after any future implementation
FUTURE-VERIFY-004 verify stock detail route in browser after UI implementation
FUTURE-VERIFY-005 verify briefing route in browser if shared copy changes
FUTURE-VERIFY-006 verify no scoreSource=real appears in runtime output
FUTURE-VERIFY-007 verify public data source remains mock
FUTURE-VERIFY-008 verify source-depth production gate remains not_ready
```

## CEO Stage Direction

```text
CEO stage direction: continue one more local-only slice to record exact pre-runtime implementation stop gate
CEO stage direction: do not implement runtime in this stage
CEO stage direction: after the stop gate is recorded, report stage work items
CEO stage direction: next report should ask whether to approve mock-only runtime implementation planning-to-execution transition
```

## Next Safe Slice Recommendation

```text
Next safe slice: prepare CP3 mock-only runtime implementation stop gate
Alternative next safe slice: prepare role review only if CEO wants additional scrutiny
CEO recommendation: prepare CP3 mock-only runtime implementation stop gate
The next safe slice must remain local-only
The next safe slice must not edit app runtime files
The next safe slice must not wire UI
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
scripts/check-cp3-mock-only-runtime-state-implementation-planning.mjs passes
scripts/check-cp3-runtime-state-naming-pre-implementation-boundary-checklist.mjs passes
scripts/check-review-gates.mjs passes
TypeScript noEmit passes
public data source remains mock
CP3 source-depth production gate remains not_ready
scoreSource=real remains blocked
Supabase and SQL execution remain blocked
```
