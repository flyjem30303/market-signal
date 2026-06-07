# A1 TWII / ETF Source-Rights Evidence Intake Packet

Status: `a1_twii_etf_source_rights_evidence_intake_packet_ready_local_only_not_filled`

Date: 2026-06-07

Owner: A1 Data / Supabase / Market Evidence

Integrator: PM mainline

## CEO Decision

CEO assigns A1 to one shared evidence-intake packet for the two remaining Level 1 MVP coverage lanes: `TWII` and ETF (`0050`, `006208`).

This packet exists because TW equity is already accepted at `180/180`, while the remaining MVP coverage is split between:

- `TWII`: `0/60`, missing `60` rows;
- ETF: `2/120`, missing `118` rows.

The goal is to prevent PM from waiting on scattered source-rights notes. A1 should collect only no-secret, no-payload, decision-ready evidence that lets PM classify each lane as `accepted`, `rejected`, `needs_bounded_repair`, or `blocked`.

## Current Coverage Baseline

- MVP target: `360/360`.
- Accepted current total: `182/360`.
- Missing rows: `178`.
- TW equity sub-scope: `2330`, `2382`, `2308` accepted at `180/180`.
- TWII sub-scope: `TWII` remains `0/60`.
- ETF sub-scope: `0050` and `006208` remain `2/120`.
- Runtime boundary: `publicDataSource=mock`.
- Score boundary: `scoreSource=mock`.

## Intake Outcomes

A1 may prepare evidence, but PM must classify the outcome before it affects the mainline.

| Lane | Current state | A1 evidence target | PM classification before execution |
| --- | --- | --- | --- |
| `TWII` | `not_approved_for_probe_or_ingestion` | source authority, internal storage, retention, attribution, delayed/missing wording, derived validation, field contract, asset mapping | `accepted`, `rejected`, `needs_bounded_repair`, or `blocked` |
| `ETF` | `legal_and_redistribution_terms_unapproved` | source owner, market-price scope, internal storage, redistribution, retention, attribution, delayed/missing wording, rate limits, derived validation | `accepted`, `rejected`, `needs_bounded_repair`, or `blocked` |

## TWII Evidence Fields

A1 should fill or mark unavailable for the `official-exchange-index`, `licensed-market-data-vendor`, or `internal-approved-feed` lane:

- source owner and source lane;
- whether internal storage of index daily values is allowed;
- whether derived validation and row coverage scoring are allowed;
- retention window and deletion duty;
- attribution text and delay wording;
- rate limit and outage posture;
- allowed OHLC fields;
- nullable policy for volume and turnover;
- calendar/session policy for the `60` target sessions;
- asset mapping policy without stock id payload output;
- evidence link or no-secret reference label.

## ETF Evidence Fields

A1 should fill or mark unavailable for `twse-mis-etf-surface`, `issuer-official-pages`, or `licensed-vendor`:

- source owner and source lane;
- whether internal storage of ETF market-price rows is allowed;
- whether redistribution, screenshots, export, API reuse, and downstream copies are allowed or blocked;
- retention window and deletion duty;
- attribution text and delay wording;
- rate limit and outage posture;
- market-price OHLCV/turnover scope;
- NAV, premium/discount, holdings, and issuer metadata scope as explicit in or out;
- derived validation and row coverage scoring permission;
- evidence link or no-secret reference label.

## PM Acceptance Rule

PM may accept a lane for the next candidate-artifact gate only when all of these are true:

1. the source lane is named exactly once;
2. internal storage is accepted or explicitly scoped;
3. retention and deletion duties are known;
4. attribution and delayed/missing wording are accepted;
5. derived validation and row coverage scoring use are accepted or explicitly blocked with a safe fallback;
6. redistribution/display limits are known;
7. rate limits and outage behavior are known;
8. field contract is clear enough to build a sanitized candidate artifact;
9. the evidence excludes secrets, raw payloads, row payloads, stock id payloads, and service-role material.

If any required item is missing, PM must classify the lane as `blocked` or `needs_bounded_repair`, not as execution-ready.

## Route Selection Rule

CEO/PM should prefer the first lane that reaches accepted evidence:

1. If `TWII` is accepted first, open a `TWII` sanitized candidate artifact readiness gate for `60` rows.
2. If ETF is accepted first, open an ETF sanitized candidate artifact readiness gate for `118` missing rows.
3. If both remain blocked, keep public Beta/runtime mainline moving with mock-visible disclosures and do not spend more governance time on execution packets.

## What This Packet Allows

This packet allows:

- no-secret source-rights evidence intake;
- local-only comparison of TWII and ETF blockers;
- PM classification of evidence as `accepted`, `rejected`, `needs_bounded_repair`, or `blocked`;
- preparation of a later candidate-artifact readiness gate after PM acceptance.

## Hard Stop

This packet does not allow:

- remote source probing;
- market-data fetch;
- market-data ingestion;
- raw market-data storage;
- candidate artifact generation from source data;
- SQL execution;
- Supabase connection;
- Supabase write;
- staging row creation;
- `daily_prices` mutation;
- row payload output;
- stock id payload output;
- secret output;
- row coverage point award;
- `publicDataSource=supabase`;
- `scoreSource=real`;
- public real-data claims.

## PM / A1 / A2 Recording

- CEO decision: `assign_a1_shared_twii_etf_source_rights_evidence_intake`.
- PM route: `remaining_coverage_source_rights_intake_before_candidate_artifacts`.
- A1 task: collect no-secret TWII and ETF source-rights evidence in this packet.
- A2 task: keep public copy aligned to mock / incomplete coverage wording; do not claim real ETF or TWII coverage.
- Current accepted state: TW equity `180/180`, full MVP `182/360`, remaining `178`.
- Next route: `twii_or_etf_candidate_artifact_gate_after_pm_acceptance`, otherwise `continue_public_beta_runtime_mainline_mock_visible`.

## Verification

Use:

- `cmd.exe /c npm run check:a1-twii-etf-source-rights-evidence-intake-packet`

This checker must pass while proving the packet remains local-only and not executable.
