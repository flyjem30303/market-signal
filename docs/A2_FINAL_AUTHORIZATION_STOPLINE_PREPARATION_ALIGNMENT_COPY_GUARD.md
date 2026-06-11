# A2 Final Authorization Stopline Preparation Alignment Copy Guard

Status: a2_final_authorization_stopline_preparation_alignment_copy_guard_ready

## Scope

This A2 support note provides copy guard rules for PM integration into the `TWII final authorization stopline preparation alignment gate`.

This is a local-only, wording-only guard. It does not authorize execution, does not supply real values, and does not change runtime data source posture.

## safe wording

- Use `final authorization stopline preparation alignment` to describe a preparation and review boundary only.
- Use `prepared`, `aligned`, `waiting for explicit authorization`, and `blocked until external authorization values are supplied through the approved path`.
- State that `publicDataSource=mock` remains unchanged.
- State that `scoreSource=mock` remains unchanged.
- State that TWII / `daily_prices` / target row counts are bounded target references, not proof of write execution.
- State that PM can integrate this copy guard only as a fail-closed communication layer.

## forbidden wording

Do not use wording that implies any of the following:

- 已授權
- 已收到真值
- 已 Go
- 已執行
- Supabase 已寫入
- 資料已真實上線
- 法務核准
- 投資建議
- 可交易訊號
- real data is live
- market data has been ingested
- candidate rows have been accepted
- `daily_prices` has been modified
- `publicDataSource=supabase`
- `scoreSource=real`

## public copy rule

Public-facing copy must say only that the site is operating in mock/simulation mode while the final authorization stopline preparation alignment remains under internal review.

Public copy must not mention credentials, authorization phrases, real decision values, raw payloads, row payloads, stock identifiers from candidate payloads, or any operational instruction that would let a user infer execution readiness.

Public copy must keep `publicDataSource=mock` and `scoreSource=mock` visible where runtime state is discussed.

## internal operator copy rule

Internal operator copy may describe the existence of a final authorization stopline preparation alignment gate, but only as a checklist boundary.

Internal copy may reference required placeholders, blocked reasons, rollback/readback/post-run review proof placeholders, and next-route review language. It must not include real authorization values, confirmation phrase content, environment values, secrets, or real decision values.

Internal copy must preserve the distinction between:

- preparation alignment
- explicit authorization
- execution attempt
- post-run review

No copy may collapse those stages into a single implied Go decision.

## hard boundaries

- 不執行 SQL
- 不連 Supabase
- 不讀 secret/env/authorization/confirmation phrase/real decision values
- 不填入真值
- 不抓市場資料
- 不讀 raw/row/stock-id payload
- 不建立 staging rows
- 不修改 `daily_prices`
- 不接受 candidate rows
- 不做 row coverage scoring
- 不設定 `publicDataSource=supabase`
- 不設定 `scoreSource=real`

## PM integration notes

PM can integrate this file as the A2 copy guard input for the TWII final authorization stopline preparation alignment gate.

The PM mainline should use this guard to reject any UI text, report text, status text, or operator note that makes the preparation gate sound like authorization, execution, Supabase write completion, legal approval, investment advice, or a tradable signal.

Recommended PM acceptance wording:

`A2 copy guard accepted: final authorization stopline preparation alignment wording remains fail-closed; publicDataSource=mock and scoreSource=mock are preserved; no authorization, execution, Supabase write, legal approval, investment advice, or tradable signal is implied.`
