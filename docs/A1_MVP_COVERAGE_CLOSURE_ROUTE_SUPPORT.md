# A1 MVP Coverage Closure Route Support

Status: `a1_mvp_coverage_closure_route_support_ready_local_only_not_executable`

Date: 2026-06-07

## Purpose

This A1 Data / Supabase / Market Evidence support packet summarizes the shortest local-only route from current Level 1 MVP coverage `182/360` to target `360/360`. It is for PM integration planning only.

This packet does not execute coverage work. It does not approve source rights, field contracts, candidate artifacts, bounded execution, post-run review, readback, scoring updates, public source promotion, or real scoring.

## Current Coverage State

Current Level 1 MVP coverage evidence:

- Target: `360/360`.
- Current observed coverage: `182/360`.
- Missing rows: `178`.
- Full-scope status: `blocked_incomplete`.
- TW equity sub-scope: `180/180`, accepted complete.
- Remaining TWII lane: `TWII` is `0/60`, missing `60`.
- Remaining ETF lane: `0050` is `1/60`, missing `59`.
- Remaining ETF lane: `006208` is `1/60`, missing `59`.
- Combined ETF sub-scope: `2/120`, missing `118`.

Evidence anchors:

- `docs/TW_EQUITY_ROW_COVERAGE_SCORING_GATE.md`.
- `docs/ETF_DAILY_PRICES_COVERAGE_COMPLETION_ROUTE.md`.
- `docs/A1_TWII_SOURCE_RIGHTS_AND_CANDIDATE_READINESS_PACKET.md`.
- `docs/A1_TWII_INDEX_FIELD_CONTRACT_DECISION_SUPPORT.md`.
- `docs/ETF_SOURCE_RIGHTS_AND_CANDIDATE_READINESS_PACKET.md`.
- `docs/A1_ETF_SOURCE_RIGHTS_OUTCOME_DECISION_SUPPORT.md`.

## Shortest Closure Route

The shortest closure route is not a single execution step. It is the smallest ordered set of source-specific gates that can close the `178` missing rows while keeping current boundaries intact.

Recommended PM planning order:

1. Decide whether TWII or ETF can clear source-rights first.
2. If TWII source-rights and field-contract evidence can be accepted first, pursue `TWII` `0/60` to close `60` rows.
3. If ETF source-rights evidence can be accepted first, pursue `0050` and `006208` together from `2/120` to `120/120` to close `118` rows.
4. Complete the other remaining lane.
5. Run row coverage scoring only after source-rights, field-contract, candidate artifact, bounded execution, post-run review, and readback gates pass for accepted rows.

The route reaches `360/360` only when:

- TW equity remains accepted at `180/180`;
- TWII reaches accepted `60/60`;
- ETF reaches accepted `120/120`;
- scoring gate accepts full Level 1 coverage;
- public and scoring promotion remain separate decisions.

## TWII Closure Preconditions

TWII current state:

- `TWII`: `0/60`.
- Missing rows: `60`.
- Selected first candidate: `official-exchange-index`.
- Selection status: `accepted_for_rights_and_field_contract_review_only`.
- Review state: `not_approved_for_probe_or_ingestion`.

TWII source-rights prerequisites:

- Source authority accepted.
- Automated access permission accepted.
- Internal storage accepted.
- Retention and audit trail accepted.
- Redistribution and display limits accepted.
- Attribution wording accepted.
- Derived analysis and row coverage scoring use accepted or explicitly blocked.
- Rate limits and fair-use posture accepted.
- Delayed, missing, partial, and source-gap wording accepted.

TWII field-contract prerequisites:

- `trade_date` maps to Taiwan market session date.
- `index_close` is accepted as the minimum required daily index value.
- `index_open`, `index_high`, `index_low`, and `turnover` are accepted or explicitly out of scope.
- Calendar/session rules distinguish holiday, closure, expected session, missing session, and source gap.
- Timezone is `Asia/Taipei`.
- Precision, rounding, revisions, and corrections are accepted.
- `daily_prices` mapping keeps TWII as an index lane.
- Internal asset mapping is resolved without stock id payload output.

TWII candidate artifact prerequisites:

- Sanitized artifact shape is accepted.
- Expected rows are aggregate-only: `60`.
- Observed rows are aggregate-only: `0`.
- Candidate missing rows are aggregate-only: `60`.
- Review output policy is aggregate-only with no raw payload, row payload, or stock id payload.
- No TWII candidates are generated until PM opens a separate gate.

TWII bounded execution prerequisites:

- Separate PM/CEO gate names one exact command.
- Exact command includes authorization id, confirmation token, scope, max attempts, target, rollback/stop conditions, and post-run review path.
- Dedicated checker validates command drift before execution.
- Runner implementation or reuse decision proves fail-closed behavior.
- No exact executable command is provided by this packet.

TWII post-run review, readback, and scoring prerequisites:

- Post-run review is immediate and aggregate-only.
- Readback reports accepted rows, missing rows, duplicate rows, rejected rows, and source-rights status.
- Scoring gate updates Level 1 coverage only after accepted readback.
- Row coverage points remain blocked until scoring gate acceptance.

TWII stop line:

- Stop before source-rights outcome, candidate generation, external probe, raw market fetch, SQL, Supabase connection, Supabase write, staging rows, `daily_prices` mutation, row payload output, stock id payload output, row coverage points, `publicDataSource=supabase`, or `scoreSource=real`.

## ETF Closure Preconditions

ETF current state:

- `0050`: `1/60`, missing `59`.
- `006208`: `1/60`, missing `59`.
- Combined ETF coverage: `2/120`.
- Combined ETF missing rows: `118`.
- Current rights blocker: `legal_and_redistribution_terms_unapproved`.

ETF source-rights prerequisites:

- One source lane is accepted from `twse-mis-etf-surface`, `issuer-official-pages`, or `licensed-vendor`, or a separately named lane is accepted by PM/CEO.
- Internal storage accepted.
- Retention accepted.
- Redistribution accepted or explicitly limited.
- Attribution wording accepted.
- Derived analysis and row coverage scoring use accepted or explicitly blocked.
- Rate limits and fair-use posture accepted.
- Delayed, missing, partial, and unavailable ETF data wording accepted.

ETF field-contract prerequisites:

- Market-price `daily_prices` OHLCV and turnover scope is accepted.
- NAV is explicitly in scope or out of scope.
- Premium / discount is explicitly in scope or out of scope.
- Holdings data is explicitly out of scope unless a separate gate accepts it.
- Public wording must not imply NAV, premium / discount, or holdings coverage when only market-price daily rows are being evaluated.

ETF candidate artifact prerequisites:

- Sanitized artifact shape is accepted.
- Expected rows are aggregate-only: `120`.
- Observed rows are aggregate-only: `2`.
- Candidate missing rows are aggregate-only: `118`.
- Per-symbol missing rows are aggregate-only: `0050` missing `59`, `006208` missing `59`.
- Review output policy is aggregate-only with no raw payload, row payload, or stock id payload.
- No ETF candidates are generated until PM opens a separate gate.

ETF bounded execution prerequisites:

- Separate PM/CEO gate names one exact command.
- Exact command includes authorization id, confirmation token, scope, max attempts, target, rollback/stop conditions, and post-run review path.
- Dedicated checker validates command drift before execution.
- Runner implementation or reuse decision proves fail-closed behavior and cannot drift into broader symbols or broader fields.
- No exact executable command is provided by this packet.

ETF post-run review, readback, and scoring prerequisites:

- Post-run review is immediate and aggregate-only.
- Readback reports accepted rows, missing rows, duplicate rows, rejected rows, and source-rights status by aggregate symbol counts.
- Scoring gate updates ETF and Level 1 coverage only after accepted readback.
- Row coverage points remain blocked until scoring gate acceptance.

ETF stop line:

- Stop before source-rights outcome, candidate generation, raw market fetch, ingestion, SQL, Supabase connection, Supabase write, staging rows, `daily_prices` mutation, row payload output, stock id payload output, row coverage points, `publicDataSource=supabase`, or `scoreSource=real`.

## Cross-Lane Gate Order

PM should keep both remaining lanes behind the same gate sequence:

| Gate | TWII | ETF |
| --- | --- | --- |
| Source-rights | Required; currently `not_approved_for_probe_or_ingestion`. | Required; currently `legal_and_redistribution_terms_unapproved`. |
| Field-contract | Required for index value mapping. | Required for market-price ETF `daily_prices` scope. |
| Candidate artifact | Shape only now; future aggregate-only artifact requires separate gate. | Shape only now; future aggregate-only artifact requires separate gate. |
| Bounded execution | Future exact-command gate only. | Future exact-command gate only. |
| Post-run review | Immediate aggregate-only review required. | Immediate aggregate-only review required. |
| Readback | Aggregate accepted/missing/duplicate/rejected rows. | Aggregate accepted/missing/duplicate/rejected rows by symbol. |
| Scoring gate | Updates Level 1 only after accepted readback. | Updates ETF and Level 1 only after accepted readback. |

## Global Stop Lines

This packet:

- does not run SQL;
- does not connect to Supabase;
- does not write Supabase;
- does not create staging rows;
- does not modify `daily_prices`;
- does not fetch raw market data;
- does not ingest raw market data;
- does not store raw market data;
- does not output secrets;
- does not output raw payload;
- does not output row payload;
- does not output stock id payload;
- does not generate TWII candidates;
- does not generate ETF candidates;
- does not give row coverage points;
- does not promote `publicDataSource=supabase`;
- does not set `scoreSource=real`.

Current runtime and scoring boundaries remain:

- `publicDataSource=mock`;
- `scoreSource=mock`.

## PM Intake Checklist

PM can use this support packet when:

- `npm run check:a1-mvp-coverage-closure-route-support` passes.
- `npm run check:tw-equity-row-coverage-scoring-gate` still confirms `182/360`, TW equity `180/180`, TWII `0/60`, `0050` `1/60`, and `006208` `1/60`.
- `npm run check:a1-twii-source-rights-and-candidate-readiness-packet` still confirms TWII local-only readiness.
- `npm run check:a1-twii-index-field-contract-decision-support` still confirms TWII field-contract decision support.
- `npm run check:etf-source-rights-and-candidate-readiness-packet` still confirms ETF `2/120` and missing `118`.
- `npm run check:a1-etf-source-rights-outcome-decision-support` still confirms ETF source-rights remain blocked/pending without external authorization evidence.
