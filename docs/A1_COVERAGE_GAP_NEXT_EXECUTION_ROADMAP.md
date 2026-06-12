# A1 Coverage Gap Next Execution Roadmap

Updated: 2026-06-12

Status: `a1_coverage_gap_next_execution_roadmap_ready_local_only`

Runtime boundaries:
- `publicDataSource = "mock"`
- `scoreSource = "mock"`
- `fixturePolicy = "synthetic_or_contract_only"`
- `rawMarketDataFetch = false`
- `sqlExecution = false`
- `supabaseWrite = false`
- `stagingWriteEnabled = false`
- `daily_prices` 不可變更

## 1. 目前 coverage 現況

- TWSE equity 子範圍：已完成 `180/180`
- MVP Level 1：`182/360`
- `TWII`: `0/60`
- `0050`: `1/60`
- `006208`: `1/60`
- 總缺口：`178` rows
- 目前 aggregate-only 狀態：`blocked_incomplete`

## 2. TWII / ETF 覆蓋缺口下一步路線圖（no-fetch, no-write）

### 2.1 共通邊界

本切片只做文件/規格；不可：
- 呼叫市場 endpoint
- SQL
- Supabase 連線/寫入
- 建立 staging rows
- 修改 `daily_prices`
- 輸出 raw payload / row payload / stock id list
- 設 `publicDataSource=supabase`
- 設 `scoreSource=real`

### 2.2 每個 lane 需要門檻

| lane | gate | gate 類型 | 目前狀態 | 下一步可執行條件 |
|---|---|---|---|---|
| TWII | `twii_coverage_repair_gate` | PM 決策 | 已有設計文件與現況；仍 blocked | 由 PM 驗證並開 gate；需 A1 提供 source-rights / field-contract 狀態與候選檔案形狀 |
| TWII | Source-rights 決策 | Chairman 授權 + PM 會同 | 仍待明確授權 | PM 接受後可進 `ready_for_twii_candidate_ready_for_pm_review` |
| TWII | 欄位契約鎖定 | A1 本地準備 + PM 決策 | 尚待路徑化與欄位收斂確認 | 需 A1 提供 `trade_date`, `close`, 時區/session 條件，PM 接受後標 `field-contract accepted` |
| TWII | 候選 artifact 準備 | A1 本地準備 | 規格化草案待對齊 | 依 `A1_NO_FETCH_CANDIDATE_ARTIFACT_CONTRACT.md` 準備，仍保持 `candidateArtifactCreated=false` |
| TWII | rollback/readback 套件 | A1 + PM 共同 | 尚未組成完整三件組 | 完成 readback contract、rollback trigger、post-run review template |
| 0050 | Source-rights 決策 | Chairman 授權 + PM 會同 | blocked | 需 ETF 權利明確且可被 PM 分離化 |
| 0050 | 欄位契約鎖定 | A1 本地準備 + PM 決策 | 尚未完成 | 需 A1 提供欄位可接受/不可用欄位清單與來源映射 |
| 0050 | 候選 artifact 準備 | A1 本地準備 | 待權利與欄位門檻 | 待 PM 同意 TWII 後可走 parallel fallback 前置；仍 no-fetch、aggregate-only |
| 006208 | Source-rights 決策 | Chairman 授權 + PM 會同 | blocked | 需同 0050 的 source-rights outcome |
| 006208 | 欄位契約鎖定 | A1 本地準備 + PM 決策 | 尚未完成 | 需 A1 錄入 `close` 及可選欄位、欄位缺失容忍條件 |
| 006208 | 候選 artifact 準備 | A1 本地準備 | 待權利與欄位門檻 | 待 PM 對 lane 分離確認後，可走 fallback 預備 |

## 3. 下一個 PM 最適合開 gate 的順序

建議順序：

1. `TWII`（先行）
   - 由 `0/60` 補到 `60/60`，可將 MVP Level 1 先推到 `242/360`（增加 `60`）
   - 小缺口、失敗半徑小、可回退快
2. `0050` / `006208`
   - 視為 parallel fallback
   - 但 `0050`/`006208` 仍須先落實 ETF source-rights 與 field-contract 再授權執行規劃

## 4. Coverage Gap Execution Packet Design（planning-only, no-execution）

### Packet A：`TWII`

- `lane`: `TWII`
- `currentRows`: `0`
- `expectedRows`: `60`
- `missingRows`: `60`
- `sourceCandidate`: `official_open_data_api`
- `sourceRightsStatus`: `pending_pm_or_chairman`
- `fieldContractStatus`: `pending_pm_confirmation`
- `candidateArtifactRequirement`: `a1_no_fetch_candidate_artifact_contract`
- `duplicateRejectionRule`: `reject_duplicates`
- `rollbackRequirement`: `required`
  - `rollbackOwner`: `PM`
  - `rollbackCondition`: `packet_outcome != ok`
  - `rollbackAction`: disable mutation path and keep no-write boundary
- `readbackProofRequirement`: `required`
  - `aggregateOnly`: true
  - `requiredReadbackFields`: `lane`, `expectedRows`, `observedRows`, `missingRows`, `publicDataSource`, `scoreSource`, `mutationEnabled`
- `promotionBoundary`: `must_keep_mock_source`
  - `publicDataSource`: `mock`
  - `scoreSource`: `mock`
  - `mutationEnabled`: false

### Packet B：`0050`

- `lane`: `0050`
- `currentRows`: `1`
- `expectedRows`: `60`
- `missingRows`: `59`
- `sourceCandidate`: `official_open_data_api_for_etf`（待 ETF source-rights 接受）
- `sourceRightsStatus`: `pending_chairman_authorization`
- `fieldContractStatus`: `pending_field_contract_acceptance`
- `candidateArtifactRequirement`: `a1_no_fetch_candidate_artifact_contract`
- `duplicateRejectionRule`: `reject_duplicates`
- `rollbackRequirement`: `required`
  - `rollbackOwner`: `PM`
  - `rollbackCondition`: `source_rights_or_field_contract_revoked`
- `readbackProofRequirement`: `required`
  - `aggregateOnly`: true
  - `requiredReadbackFields`: `lane`, `expectedRows`, `observedRows`, `missingRows`, `sourceRightsState`, `fieldContractState`, `mutationEnabled`
- `promotionBoundary`: `blocked_until_twii_and_source_rights_ready`
  - `publicDataSource`: `mock`
  - `scoreSource`: `mock`
  - `mutationEnabled`: false

### Packet C：`006208`

- `lane`: `006208`
- `currentRows`: `1`
- `expectedRows`: `60`
- `missingRows`: `59`
- `sourceCandidate`: `official_open_data_api_for_etf`（待 ETF source-rights 接受）
- `sourceRightsStatus`: `pending_chairman_authorization`
- `fieldContractStatus`: `pending_field_contract_acceptance`
- `candidateArtifactRequirement`: `a1_no_fetch_candidate_artifact_contract`
- `duplicateRejectionRule`: `reject_duplicates`
- `rollbackRequirement`: `required`
  - `rollbackOwner`: `PM`
  - `rollbackCondition`: `source_rights_or_field_contract_revoked`
- `readbackProofRequirement`: `required`
  - `aggregateOnly`: true
  - `requiredReadbackFields`: `lane`, `expectedRows`, `observedRows`, `missingRows`, `sourceRightsState`, `fieldContractState`, `mutationEnabled`
- `promotionBoundary`: `blocked_until_etf_lane_separation_clear`
  - `publicDataSource`: `mock`
  - `scoreSource`: `mock`
  - `mutationEnabled`: false

## 5. 依賴資料線（不重做，僅引用）

- `docs/TWSE_OPENAPI_RUNTIME_CONSUMER_ADAPTER_SYNTHETIC_CASE_NOTES.md`
- `docs/TWSE_OPENAPI_FIELD_CONTRACT_ROADMAP.md`
- `docs/TWSE_OPENAPI_COVERAGE_UNIVERSE_AND_BACKFILL_READINESS.md`
- `docs/A1_TWII_COVERAGE_REPAIR_GATE_PREREQ_CHECKLIST.md`
- `docs/A1_TWII_SOURCE_RIGHTS_AND_CANDIDATE_READINESS_PACKET.md`
- `docs/ETF_SOURCE_RIGHTS_AND_CANDIDATE_READINESS_PACKET.md`

## 6. Backfill / ingestion readiness（future, planning only）

- 目前 `readiness` 僅作為 packet 設計輸入，不含任何實際 ingest。
- 未來候選命令需為 bounded one-attempt, missing-only, maxRows 限制與 `reject_duplicates`。
- 需先完成 readback + rollback + source-rights + field-contract 門檻後，PM 才可啟動可執行 packet。

## 7. PM 交付摘要（可直接開 gate）

- 首開建議：`twii_coverage_repair_gate`
- 依據：`TWII 0/60`，先補 `60` 行可最快提升 coverage；ETF 保留為後續 parallel fallback。
- 目前 real fetch / SQL / Supabase write 狀態：
  - `canDoRealFetch`: `false`
  - `canDoSQL`: `false`
  - `canDoSupabaseWrite`: `false`
  - `canMutateDailyPrices`: `false`
  - `canPromotePublicSource`: `false`（不得 `publicDataSource=supabase`）
  - `canPromoteRealScore`: `false`（不得 `scoreSource=real`）
- 缺 gate 一覽：
  - TWII source-rights + field-contract 尚未授權
  - rollback/readback/post-run review 套件未形成可執行前置
  - 候選 artifact 仍為 planning-only（不得真實執行）

## 8. PM Integration Command Map

```text
cmd.exe /c npm run check:a1-coverage-gap-next-execution-roadmap
cmd.exe /c npm run check:twii-coverage-repair-gate
cmd.exe /c npm run check:a1-mvp-coverage-closure-route-support
```

All checks remain local-only and mock-first.
