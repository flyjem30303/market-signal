# TWII Bounded Readonly Preflight Candidate Design

Updated: 2026-06-09

Status: `twii_bounded_readonly_preflight_candidate_design_ready`

## Purpose

This design defines the next candidate command contract for a future bounded Supabase readonly preflight after the TWII no-write proof post-review gate.

It is design-only. It does not connect to Supabase, execute SQL, read table rows, write data, mutate `daily_prices`, accept rows, score row coverage, promote public data source, or set real score.

## Upstream Gate

The upstream gate must remain accepted:

- `docs/TWII_NO_WRITE_PROOF_POST_REVIEW_READINESS_GATE.md`
- `twii_no_write_proof_post_review_readiness_gate_ready`
- `ready_for_bounded_supabase_readonly_preflight_candidate_write_preflight_blocked`

## Future Command Contract

A later GOAL may implement a runner with this contract only after CEO names exactly one bounded readonly attempt.

```powershell
cmd.exe /c npm run run:twii-bounded-readonly-preflight-once -- --attempt-id <NO_SECRET_ATTEMPT_ID> --candidate-artifact-path data\candidates\twii-sanitized-candidate.json --mode aggregate-only-readonly --confirm <CEO_APPROVED_CONFIRMATION>
cmd.exe /c npm run report:twii-bounded-readonly-preflight-post-run-review -- --summary-path <SANITIZED_SUMMARY_JSON>
```

The command must fail closed unless:

- `attempt-id` is safe and no-secret;
- `candidate-artifact-path` points to the accepted sanitized aggregate-only TWII artifact;
- `mode=aggregate-only-readonly`;
- explicit one-attempt confirmation is present;
- output path is local and under `tmp/`;
- timeout is bounded;
- post-run review command is declared.

## Future Readonly Scope

The future readonly runner may report only aggregate metadata:

- table reachability status;
- required table names as labels only;
- required column labels only;
- aggregate count status;
- missing/extra column labels;
- fail-closed reason code;
- elapsed time and timeout status;
- no-secret attempt id;
- mock runtime boundary.

It must not print row payloads, source payloads, stock id payloads, secrets, private dashboard links, connection strings, raw API responses, or SQL statements.

## Candidate Artifact Inputs

The future runner may reference only this A1 artifact path:

- `data/candidates/twii-sanitized-candidate.json`

Required aggregate facts:

- `lane=TWII`
- `symbol=TWII`
- `scope=twii_index_daily_prices_missing_rows`
- `sourceLane=official-exchange-index`
- `expectedRows=60`
- `candidateRows=60`
- `duplicateRows=0`
- `rejectedRows=0`
- `missingRows=0`
- `sanitizedAggregateOnly=true`
- `rawPayloadIncluded=false`
- `rowPayloadIncluded=false`
- `stockIdPayloadIncluded=false`
- `secretsIncluded=false`

## Readonly Candidate Acceptance

This design is accepted when:

- upstream post-review readiness gate is accepted;
- A1 artifact remains accepted by the sanitized artifact handoff gate;
- PM named no-write proof remains accepted;
- D four evidence slots remain accepted;
- future command contract is aggregate-only and fail-closed;
- write preflight remains blocked.

## Still Blocked

- SQL execution.
- Supabase connection in this design slice.
- Supabase write.
- Staging rows.
- `daily_prices` mutation.
- Candidate row acceptance.
- Row coverage scoring.
- Market-data fetch or ingestion.
- Raw payload output.
- Row payload output.
- Stock id payload output.
- Secret output.
- Public source promotion.
- `scoreSource=real`.

## Next Recommended Slice

CEO recommends the next GOAL should be:

`TWII bounded readonly preflight runner stub`

That slice should implement a local fail-closed runner stub that refuses to run without explicit confirmation and still does not connect to Supabase unless a later user message separately authorizes exactly one bounded readonly attempt.

## Stop Line

No SQL.

No Supabase connection in this design.

No Supabase write.

No daily_prices mutation.

No market-data fetch or ingestion.

No staging rows.

No candidate row acceptance.

No row coverage scoring.

No raw payload output.

No row payload output.

No stock id payload output.

No secret output.

No public source or real-score promotion.

Runtime remains `publicDataSource=mock`.

Score remains `scoreSource=mock`.
