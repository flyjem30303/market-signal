# CP3 Freshness Reachability To Action Gate

Status: `CP3 freshness reachability to action gate recorded`

Decision: `ALLOW_BOUNDED_FRESHNESS_STATE_CONSUMPTION_KEEP_REAL_SCORE_BLOCKED`

Trigger: `CP3 freshness revised runner second attempt post-run review recorded`

## Scope

This CEO slice converts the successful read-only runtime reachability result into bounded next actions. It does not run another remote attempt, does not connect to Supabase, does not run SQL, does not write Supabase, does not create staging rows, does not write `daily_prices`, does not fetch or ingest market data, does not commit raw market data, does not print secrets, does not modify `.env.local`, does not change the public data source away from mock, does not set `scoreSource=real`, does not approve public claims, and does not promote CP3 readiness.

## Evidence Accepted

Accepted evidence: `freshness_metadata_reachable`.

Sanitized runtime evidence:

- `status=ok`
- `remoteAttempted=true`
- `state=complete`
- `market=TWSE`
- `sourceName=TWSE OpenAPI`
- `asOfDate=2026-05-27`
- `isMock=false`
- `scoreSource=mock`

This evidence proves only that the app can read Supabase-backed freshness metadata through the guarded runtime path.

## Allowed Next Actions

- ALLOW-001 display the freshness state in an internal or public UI as freshness metadata.
- ALLOW-002 consume `state`, `market`, `sourceName`, `asOfDate`, and `isMock` for status labeling.
- ALLOW-003 keep `scoreSource=mock` visible when needed.
- ALLOW-004 keep `NEXT_PUBLIC_DATA_SOURCE=mock`.
- ALLOW-005 add local-only UI copy or runtime mapping that explains freshness metadata without market-data claims.
- ALLOW-006 add static checkers that enforce the separation between freshness metadata reachability and market-data quality.

## Blocked Actions

- BLOCK-001 do not set `scoreSource=real`.
- BLOCK-002 do not switch public data source away from mock.
- BLOCK-003 do not claim market-data correctness, completeness, or timeliness beyond the freshness metadata fields.
- BLOCK-004 do not claim model credibility or investment-grade readiness.
- BLOCK-005 do not approve public marketing claims.
- BLOCK-006 do not write Supabase.
- BLOCK-007 do not run SQL.
- BLOCK-008 do not fetch or ingest market data.
- BLOCK-009 do not create staging rows or write `daily_prices`.
- BLOCK-010 do not run another freshness remote attempt unless a new material boundary changes and a new CEO gate is recorded.

## Recommended Route

CEO selected route: `UI_RUNTIME_FRESHNESS_DISCLOSURE_WITH_MOCK_SCORE_SOURCE`.

Rationale: The project now has real freshness metadata reachability, so the next useful product move is to surface this safely. The UI can show freshness status as metadata while keeping the signal score itself mock. This is faster and more useful than more generic planning, and safer than promoting real score or market-data claims.

## Acceptance Criteria For Next Slice

- NEXT-AC-001 UI/runtime text must not say data quality is approved.
- NEXT-AC-002 UI/runtime text must not say `scoreSource=real`.
- NEXT-AC-003 UI/runtime text must not imply investment advice, production readiness, or complete market coverage.
- NEXT-AC-004 UI/runtime behavior must keep public source mock.
- NEXT-AC-005 UI/runtime behavior may label freshness metadata as read from Supabase only when the existing runtime path supplies `isMock=false`.
- NEXT-AC-006 add or update a checker to guard the copy and state separation.

## Role Review

CEO finding: This is the right place to accelerate into visible product value. Freshness reachability can be shown, but only as metadata.

PM finding: The next slice should be implementation-oriented: wire or refine UI/runtime disclosure for freshness state, not run more remote checks.

Engineering finding: The runtime path already returns the needed fields. The implementation should avoid new Supabase calls and consume existing freshness abstractions.

QA finding: The main risk is semantic overclaiming. The next checker should guard against real-score and data-quality language.

Security finding: No additional secret or credential surface is needed for the UI disclosure slice.

Data finding: This gate keeps the evidence boundary precise: freshness metadata reachability is not market-data validation.

## CEO Verdict

Accepted. Move next to bounded UI/runtime freshness disclosure while keeping `scoreSource=mock`, public data source mock, and all write/SQL/ingestion paths blocked.

## Next Slice

NEXT-SLICE-001 inspect existing freshness UI/runtime usage.
NEXT-SLICE-002 implement a bounded freshness disclosure improvement if needed.
NEXT-SLICE-003 add or update a checker for freshness reachability versus real-score/data-quality separation.
NEXT-SLICE-004 run review gate, TypeScript, and build.
