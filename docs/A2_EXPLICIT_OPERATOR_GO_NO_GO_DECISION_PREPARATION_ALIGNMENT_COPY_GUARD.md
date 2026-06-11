# A2 Explicit Operator Go/No-Go Decision Preparation Alignment Copy Guard

Status: a2_explicit_operator_go_no_go_decision_preparation_alignment_copy_guard_ready

## Scope

This A2 support note defines the copy guard for the PM mainline `TWII explicit operator go/no-go decision preparation alignment gate`.

The copy target is preparation-only. It may describe required decision surfaces, missing operator inputs, blocked execution state, and mock-boundary preservation. It must not imply authorization, execution, Supabase mutation, legal approval, investment advice, or tradable output.

## safe wording

- Use `explicit operator go/no-go decision preparation alignment` only as a preparation, alignment, or review gate.
- Say the system is waiting for explicit external operator values and future review proof.
- Say the gate preserves `publicDataSource=mock` and `scoreSource=mock`.
- Say the current state is local-only, fail-closed, and no-execution.
- Say future operator action requires separate approval, server-only credential handling, bounded target scope, rollback proof, readback proof, post-run review proof, and duplicate rejection proof.
- Say public-facing UI remains informational and non-investment-advice.

## forbidden wording

Do not use wording that directly or indirectly implies any of the following:

- 已授權
- 已收到真值
- 已 Go
- 已執行
- Supabase 已寫入
- 資料已真實上線
- 法務核准
- 投資建議
- 可交易訊號

Also avoid English equivalents such as `authorized`, `real values received`, `go approved`, `executed`, `Supabase write completed`, `real data online`, `legal approved`, `investment advice`, or `tradable signal`, unless the wording explicitly says these are forbidden or not yet true.

## public copy rule

Public copy may only say that the TWII data path is being prepared and reviewed under strict controls. It must preserve the current runtime posture:

- `publicDataSource=mock`
- `scoreSource=mock`
- no real-data promotion
- no investment recommendation
- no tradable signal
- no claim that market data is complete, current, or production-backed

## internal operator copy rule

Internal operator copy may list the fields and evidence required before any later decision. It must keep all values as placeholders and must not record, echo, or infer any secret, env value, authorization phrase, confirmation phrase, or real decision value.

Allowed internal wording:

- operator decision placeholder is required
- go/no-go field presence is required
- confirmation phrase placeholder is required
- server-only credential presence must be checked outside public artifacts
- bounded target scope remains TWII / `daily_prices` / 60 rows
- execution remains blocked until all downstream proof gates pass

## hard boundaries

- Do not execute SQL.
- Do not connect to Supabase.
- Do not read secret, env, authorization, confirmation phrase, or real decision values.
- Do not fill in real values.
- Do not fetch market data.
- Do not read raw payload, row payload, or stock-id payload.
- Do not create staging rows.
- Do not modify `daily_prices`.
- Do not accept candidate rows.
- Do not do row coverage scoring.
- Do not set `publicDataSource=supabase`.
- Do not set `scoreSource=real`.

## PM integration notes

- PM may cite this file as the A2 copy guard for the `TWII explicit operator go/no-go decision preparation alignment gate`.
- PM should treat this guard as wording control only, not as execution authorization.
- PM should keep the mainline gate blocked until explicit external operator inputs, server-only checks, rollback proof, aggregate readback proof, post-run review proof, and duplicate rejection proof are separately reviewed.
- Any public or operator-facing copy derived from this gate should state preparation status without implying execution readiness.
