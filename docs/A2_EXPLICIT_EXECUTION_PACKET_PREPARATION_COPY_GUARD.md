# A2 Explicit Execution Packet Preparation Copy Guard

Status: a2_explicit_execution_packet_preparation_copy_guard_ready

## Purpose

本文件是 A2 Runtime / Operator Copy Guard 支線輸出，用來防止 TWII explicit execution packet preparation gate 被誤解為真執行授權、真資料寫入、真上線、法務核准或投資建議。

這個 gate 的正確定位是：只準備 explicit execution packet 的文字、欄位、邊界與 fail-closed 檢查語意；不代表可以執行 SQL、不代表可以連 Supabase、不代表可以寫入 `daily_prices`，也不代表 candidate rows 已被接受。

## Safe Wording

- 可以說：目前已完成 TWII explicit execution packet preparation gate 的 copy guard。
- 可以說：這是 execution packet 的 preparation surface，不是 execution surface。
- 可以說：目前只允許檢查 packet shape、presence-only semantics、blocked reasons、next review-only route 與 fail-closed wording。
- 可以說：目前仍維持 `publicDataSource=mock` 與 `scoreSource=mock`。
- 可以說：所有真實執行前條件仍必須經過後續 server-only gate、operator authorization、rollback/readback/postrun/duplicate proof review。
- 可以說：本文件只保護操作者文案與 public/internal copy，不提供法律意見、投資建議或資料來源授權結論。

## Forbidden Wording

- 不可說：TWII explicit execution packet 已授權真執行。
- 不可說：已可寫入 Supabase 或 `daily_prices`。
- 不可說：candidate rows 已 accepted。
- 不可說：真實市場資料已上線。
- 不可說：`publicDataSource=supabase` 或 `scoreSource=real` 已可設定。
- 不可說：來源條款、法務揭露或資料授權已正式核准。
- 不可說：本網站已提供投資建議、買賣建議、報酬承諾或適合性判斷。
- 不可說：操作者已提供、系統已讀取或系統已儲存 secrets/env/authorization/confirmation phrase/decision value。

## Public Copy Rule

公開頁面只能描述目前是 mock-boundary / preparation 狀態。若需要說明資料真實化進度，只能使用「準備中」、「尚未切換為正式資料源」、「目前不構成投資建議」等語句。

公開頁面不得顯示任何 execution packet 欄位、operator authorization 欄位、confirmation phrase、execute switch、credential presence、rollback/readback/postrun 細節或任何可能讓使用者誤認為真實資料已上線的語句。

## Internal Operator Copy Rule

內部操作者介面可以顯示 explicit execution packet preparation gate 的狀態，但必須同時顯示以下邊界：

- `executionAllowedNow=false`
- `writeGateExecutableNow=false`
- `finalExecutionAllowedNow=false`
- `sqlExecuted=false`
- `supabaseConnectionAttempted=false`
- `dailyPricesMutated=false`
- `candidateRowsAccepted=false`
- `publicDataSource=mock`
- `scoreSource=mock`

任何 operator-facing copy 都必須以 presence-only 語意描述欄位是否具備形狀，不得讀取、顯示、保存或推導真實 secrets/env/authorization/confirmation phrase/decision value。

## PM Integration Notes

- PM 主線若接入此 copy guard，應把它視為 explicit execution packet preparation gate 的誤解防線。
- A2 不授權執行 SQL、不連 Supabase、不讀 secrets/env/authorization/confirmation phrase。
- A2 不讀或填真實 decision value。
- A2 不抓市場資料、不碰 `daily_prices`、不接受 candidate rows。
- A2 不允許設定 `publicDataSource=supabase` 或 `scoreSource=real`。
- 後續若要從 preparation gate 推進到可執行 gate，PM 必須另開 server-only execution readiness review，且由 CEO 明確定義授權邊界。
