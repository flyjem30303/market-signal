# A2 Pre-Execution Readiness Recheck Copy Guard

Status: `a2_pre_execution_readiness_recheck_copy_guard_ready`

Date: 2026-06-11

Owner lane: A2 Copy Guard Support Line

Purpose: copy guard for TWII pre-execution readiness recheck gate UI, report, and internal operator wording. This document only defines safe wording boundaries. It does not authorize execution, prove readiness, validate real values, approve public launch, provide legal approval, or provide investment advice.

This A2 file does not execute SQL, connect to Supabase, import `@supabase/supabase-js`, read env values, read secret values, read authorization values, read confirmation phrase values, read or fill real decision values, fetch market data, read raw payloads, read row payloads, read stock-id payloads, create staging rows, mutate `daily_prices`, accept candidate rows, set `publicDataSource=supabase`, set `scoreSource=real`, or authorize execution.

All examples below are wording controls only. They must not be treated as evidence that operator authorization exists, real values were provided, write execution occurred, launch readiness is closed, legal review is complete, or an investment recommendation is being made.

## Safe Wording

Use wording that keeps the gate value-hidden, mock-bound, and non-executing.

| Surface | Safe wording |
| --- | --- |
| UI state label | `Pre-execution readiness recheck: documentation review only` |
| UI helper text | `This check reviews whether required reference-only readiness labels are present. It does not read credentials, authorization values, confirmation phrases, rows, payloads, or market data.` |
| Report result | `Readiness recheck copy posture: safe for PM review; execution remains blocked.` |
| Report boundary | `No SQL, Supabase connection, market-data fetch, candidate-row acceptance, daily_prices mutation, public source promotion, or real scoring occurred.` |
| Operator note | `Proceed only with PM-controlled document review. Do not run commands, read protected values, accept candidate rows, or change runtime/source settings from this gate.` |
| Status explanation | `Ready means copy-guard ready, not execution-ready, launch-ready, legally approved, or investment-grade.` |

Safe copy should prefer these terms:

- `reference-only`
- `value-hidden`
- `copy-guard ready`
- `PM review`
- `execution remains blocked`
- `mock runtime remains active`
- `publicDataSource=mock`
- `scoreSource=mock`
- `no investment advice`

## Forbidden Wording

Block or rewrite wording that implies real authorization, real values, real writes, public launch, legal approval, or investment advice.

| Forbidden wording pattern | Why it is unsafe | Required rewrite direction |
| --- | --- | --- |
| `Authorized`, `approved to execute`, `go for execution`, or `operator confirmed` | Implies real authorization or confirmation phrase success. | Say `ready for PM document review` or `execution remains blocked`. |
| `Values received`, `real decision values provided`, or `candidate rows accepted` | Implies prohibited value or row intake. | Say `no decision values or candidate rows were read or accepted`. |
| `Write completed`, `daily_prices updated`, `staging accepted`, or `Supabase write ready` | Implies true write execution or write authorization. | Say `no write occurred and no write is authorized by this gate`. |
| `Live data enabled`, `publicDataSource=supabase`, or `scoreSource=real` | Implies public source promotion or real scoring. | Say `publicDataSource=mock and scoreSource=mock remain locked`. |
| `Launch-ready`, `production-ready`, or `public-ready` | Implies real go-live closure. | Say `copy wording is ready for PM review only`. |
| `Legally cleared`, `license approved`, or `compliance approved` | Implies legal or source-rights approval. | Say `legal/source-rights approval is out of scope unless separately recorded by its owner lane`. |
| `Buy`, `sell`, `hold`, `entry point`, `target`, or `market signal` | Creates investment-advice risk. | Say `no investment advice; this is an operational readiness copy guard`. |

If any forbidden pattern appears in UI, report, API response text, checklist text, toast text, logs intended for operators, or PM notes, the integration should fail closed until the wording is corrected.

## Public Copy Rule

Public-facing copy must be shorter and stricter than internal copy. It must never imply that the system has real data, has executed writes, is connected to Supabase, is live, is legally approved, or is making investment recommendations.

Required public copy posture:

- State only that the item is under `reference-only readiness review`.
- State that displayed readiness does not mean execution approval.
- Preserve `publicDataSource=mock` and `scoreSource=mock` when those labels are exposed.
- Include a no-investment-advice boundary when the surface is visible outside the operator/PM workflow.
- Avoid operational details that point to secrets, authorization phrases, protected values, candidate rows, row payloads, or market-data retrieval.

Approved public copy template:

```text
TWII readiness is under reference-only review. This status does not approve execution, confirm real data, update daily_prices, enable a live data source, or provide investment advice.
```

Public copy must not mention any secret name, env key, authorization value, confirmation phrase value, row count from real payloads, candidate-row content, source payload, or market-data value.

## Internal Operator Copy Rule

Internal operator copy may name the gate and the blocked actions, but it must remain value-hidden and non-executing. It must direct operators toward PM review, not toward command execution.

Required internal operator copy posture:

- Use `pre-execution readiness recheck` as a document/control label only.
- Say `executionAllowed=false` or equivalent blocked posture when a boolean is needed.
- Say `candidateRowsAccepted=false`, `dailyPricesMutated=false`, `sqlExecuted=false`, `supabaseConnected=false`, `marketDataFetched=false`, `publicDataSourceSupabaseSet=false`, and `scoreSourceRealSet=false` only as aggregate safety flags.
- Never ask the operator to paste, reveal, compare, print, or confirm env values, secrets, authorization values, confirmation phrase values, candidate rows, row payloads, stock-id payloads, or market data.
- Never instruct the operator to run SQL, connect Supabase, fetch market data, accept candidate rows, mutate `daily_prices`, promote public source, set real scoring, or launch.

Approved internal operator copy template:

```text
Pre-execution readiness recheck is copy-guard ready for PM review. Execution remains blocked. Do not read protected values, accept candidate rows, connect Supabase, run SQL, fetch market data, mutate daily_prices, set publicDataSource=supabase, or set scoreSource=real from this gate.
```

## PM Integration Notes

- PM may integrate this file as the copy guard for the TWII pre-execution readiness recheck gate only after confirming the consuming UI/report/operator surfaces use safe wording and reject forbidden wording.
- The integration status to record from this file is `a2_pre_execution_readiness_recheck_copy_guard_ready`.
- This status means the copy guard is ready; it does not mean the readiness gate is accepted, execution is authorized, values are provided, rows are accepted, writes are safe, public launch is approved, legal review is complete, or investment advice is allowed.
- PM should keep this guard separate from any source-rights, field-contract, operator-authorization, candidate-artifact, rollback, post-run-review, launch-readiness, legal, or investment-disclosure decision.
- Any request to run SQL, connect Supabase, read env/secrets/authorization/confirmation phrase values, read or fill real decision values, fetch market data, touch `daily_prices`, accept candidate rows, set `publicDataSource=supabase`, or set `scoreSource=real` is outside this A2 lane and must fail closed.
- If UI/report text cannot clearly separate copy readiness from execution readiness, PM should mark the integration as repair required rather than accepted.
- If public copy cannot avoid investment-advice language, PM should block public exposure until a separate disclosure/legal owner lane resolves it.

## Final Boundary

This copy guard is ready only as a wording control. It creates no permission to execute, connect, read protected values, ingest data, accept candidate rows, mutate `daily_prices`, promote public data source, enable real scoring, close launch readiness, claim legal approval, or provide investment advice.
