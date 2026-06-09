# TWII Bounded Readonly Preflight Open One Remote Readonly Execution Path

Updated: 2026-06-09

Status: `twii_bounded_readonly_preflight_open_one_remote_readonly_execution_path_ready`

Accepted output: `accepted_one_sanitized_remote_readonly_probe_path`

## CEO Decision

Open exactly one remote Supabase readonly path for the named TWII bounded readonly preflight attempt.

This is not row acceptance, not row coverage scoring, not `daily_prices` mutation, not source promotion, and not `scoreSource=real`.

## Named Attempt

```text
attemptId: twii-bounded-readonly-preflight-20260609-a
candidateArtifactPath: data\candidates\twii-sanitized-candidate.json
mode: aggregate-only-readonly
confirmationToken: CEO_APPROVED_TWII_BOUNDED_READONLY_PREFLIGHT_ONCE
authorizationPhrase: CEO_AUTHORIZES_ONE_TWII_BOUNDED_READONLY_PREFLIGHT_ATTEMPT_20260609_A
outDir: tmp\twii-bounded-readonly-preflight-20260609-a
```

## Execution Command

```text
cmd.exe /c npm run run:twii-bounded-readonly-preflight-remote-readonly-once -- --attempt-id twii-bounded-readonly-preflight-20260609-a --candidate-artifact-path data\candidates\twii-sanitized-candidate.json --mode aggregate-only-readonly --confirm CEO_APPROVED_TWII_BOUNDED_READONLY_PREFLIGHT_ONCE --execute-readonly --authorization-phrase CEO_AUTHORIZES_ONE_TWII_BOUNDED_READONLY_PREFLIGHT_ATTEMPT_20260609_A --out-dir tmp\twii-bounded-readonly-preflight-20260609-a
```

## Review Command

```text
cmd.exe /c npm run report:twii-bounded-readonly-preflight-remote-readonly-post-run-review -- --summary-path tmp\twii-bounded-readonly-preflight-20260609-a\twii-bounded-readonly-preflight-remote-readonly-twii-bounded-readonly-preflight-20260609-a.json
```

## Probe Contract

The runner may only perform Supabase head/count readonly probes against:

- `stocks`
- `daily_prices`

Allowed output:

- table label;
- reachability label;
- count status;
- aggregate count if returned by Supabase;
- sanitized error category;
- sanitized error code.

Disallowed output:

- raw payload;
- row payload;
- stock id payload;
- Supabase URL;
- secret;
- SQL text.

## Stop Line

No SQL.

No Supabase write.

No market-data fetch.

No market-data ingestion.

No `daily_prices` mutation.

No daily_prices mutation.

No staging rows.

No candidate row acceptance.

No row coverage scoring.

No raw payload output.

No row payload output.

No stock id payload output.

No secret output.

No public source promotion.

No real-score promotion.

Runtime remains `publicDataSource=mock`.

Score remains `scoreSource=mock`.
