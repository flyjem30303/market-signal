# A1 TWII + ETF Coverage PM Handoff Summary

Updated: 2026-06-12

Status: `a1_twii_etf_coverage_pm_handoff_summary_ready_local_only`

Owner: A1 Data / Supabase / Market Evidence

## 1. 現況（來源自 latest readonly/coverage）

- Full MVP: `182/360`，總缺口 `178`
- `TWII`: `0/60`
- `0050`: `1/60`
- `006208`: `1/60`
- runtime 邊界：`publicDataSource=mock`、`scoreSource=mock`
- 目前僅為規劃切片：`A1_NO_FETCH_CANDIDATE_ARTIFACT_CONTRACT` 與 `A1_COVERAGE_GAP_NEXT_EXECUTION_ROADMAP`

## 2. 下一個最適合開的 PM gate（建議）

建議次序：

1. `prepare_twii_coverage_repair_gate`
2. `prepare_twii_one_shot_authorization_packet_without_execution`
3. `prepare_twii_one_attempt`（待前述授權確認）
4. `0050` / `006208` 作為 `parallel fallback`

理由：
- 先補 `TWII` 小缺口可把 MVP from `182/360` 提升到 `242/360`
- ETF 現況 `1/60` 每檔，先壓縮 TWII 失敗面可更快完成最小可驗證區塊

## 3. 執行前置 gate（TWII / 0050 / 006208）

### TWII

- Source-rights：需 PM + Chairman 接受後，才可進入下一個可授權 packet
- 欄位契約：需接受 `trade_date`、`close`、時區/欄位缺值邏輯
- 候選檔：維持 aggregate-only 的 planning artifact（不得輸出候選 rows）
- rollback/readback：需先定義 aggregate readback 與 rollback 套件

### ETF 0050 / 006208

- Source-rights：目前 blocked，需先完成授權邏輯
- 欄位契約：需明確接受 ETF 欄位範圍與排除欄位（如未核可）
- lane 分離：需維持與 TWII 的 scope 分離證明

## 4. 目前是否可做 real fetch / SQL / Supabase write

- `canDoRealFetch`: `false`
- `canDoSQL`: `false`
- `canDoSupabaseWrite`: `false`
- `canMutateDailyPrices`: `false`
- `canPromotePublicSource`: `false`（不得 `publicDataSource=supabase`）
- `canPromoteRealScore`: `false`（不得 `scoreSource=real`）

缺 gate：

- TWII source-rights 還未可授權
- TWII 欄位契約尚未 PM 接受
- ETF source-rights + ETF 欄位契約與 TWII lane separation 尚未確認
- rollback/readback/post-run review 三件組尚未形成可執行前置

## 5. PM 可直接核對的 evidence 路徑

- `docs/A1_COVERAGE_GAP_NEXT_EXECUTION_ROADMAP.md`
- `docs/A1_NO_FETCH_CANDIDATE_ARTIFACT_CONTRACT.md`
- `docs/A1_TWII_SOURCE_RIGHTS_AND_CANDIDATE_READINESS_PACKET.md`
- `docs/TWSE_OPENAPI_FIELD_CONTRACT_ROADMAP.md`
- `docs/TWSE_OPENAPI_RUNTIME_CONSUMER_ADAPTER_SYNTHETIC_CASE_NOTES.md`
- `docs/TWSE_OPENAPI_COVERAGE_UNIVERSE_AND_BACKFILL_READINESS.md`

## 6. Hard Stops（本次資料線切片）

- 不抓取任何市場 endpoint
- 不執行 SQL
- 不連線/寫入 Supabase
- 不建立 staging rows
- 不修改 `daily_prices`
- 不輸出 raw payload / row payload / stock id list
- 不宣告 `publicDataSource=supabase` / `scoreSource=real`
- 不宣告 coverage 已完成
- 不主張可直接公開使用真實資料
