# Data Authorization Entry Gate

Updated: 2026-06-06

## Purpose

This is the single CEO/PM entry point after the accepted mock MVP baseline and F/UI minimal closeout.

Current decision: `entry_ready_local_only`.

This is not execution approval. It does not authorize remote access, SQL, writes, ingestion, public source promotion, or real scoring.

## Accepted Inputs

- `docs/MOCK_MVP_CHAIRMAN_REVIEW.md`: mock MVP chairman review accepted the baseline as review-ready while keeping real-data promotion separate.
- `docs/MOCK_MVP_F_UI_CLOSEOUT.md`: F/UI minimal closeout accepted the current visual structure and deferred broad polish.
- Accepted bounded Supabase readonly post-run review exists as sanitized aggregate-only evidence.
- Row coverage remains aggregate incomplete, so the data path is not promotion-ready.

## Allowed Now

- Prepare local authorization packets, checklists, and command maps.
- Run local static checks and review gates.
- Inspect already recorded sanitized aggregate evidence.
- Update local docs and checkers that preserve context after compaction.
- Ask or record an explicit CEO/chairman decision for one bounded readonly attempt.

## Not Allowed Now

- SQL execution.
- Supabase writes.
- Create staging rows.
- Modify daily_prices.
- Fetch, ingest, store, or commit raw market data.
- Print secrets or raw payloads.
- Promote `publicDataSource=supabase`.
- Set `scoreSource=real`.
- Make investment advice, recommendation, ranking, model-confidence, or performance claims.

## One-Attempt Readonly Rule

A bounded readonly attempt can happen only after a separately named CEO/chairman decision states all of the following:

- one bounded readonly attempt;
- exact command;
- readonly only;
- sanitized aggregate output only;
- no retry unless a new explicit decision is recorded;
- immediate post-run review;
- no promotion by itself.

If any item is missing, the attempt remains blocked.

## Promotion Thresholds

Public source promotion or real scoring remains blocked until all of these are accepted:

- source rights accepted;
- row coverage aggregate is complete enough for the named launch scope;
- data-quality score threshold accepted;
- model credibility accepted for the displayed claim level;
- Legal public claim accepted;
- post-run review accepted.

## CEO Recommendation

Next slice: create or refresh the authorization decision packet for exactly one bounded readonly attempt, then review it before remote execution.

Do not execute the remote attempt from this gate alone.
