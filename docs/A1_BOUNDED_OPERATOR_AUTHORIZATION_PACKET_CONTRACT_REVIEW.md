# A1 Bounded Operator Authorization Packet Contract Review

Status: a1_bounded_operator_authorization_packet_contract_review_ready

## Review Scope

本文件由 A1 Data / Authorization Packet Contract 支線提供，目的在於檢查 PM 即將建立的 TWII bounded operator authorization packet gate 契約是否具備可審核、可追溯、fail-closed 的前置結構。

本文件只描述契約與檢查要求，不執行任何資料庫、Supabase、市場資料、寫入或候選資料接受動作。

## Required Authorization Fields

bounded operator authorization packet 至少需要定義下列欄位，但只能檢查欄位存在與形狀，不得讀取、填入、儲存或輸出真實值：

- `operatorDecisionStatus`: 操作者/CEO 的決策狀態欄位，僅允許 presence-only / shape-only 檢查。
- `operatorAttestation`: 操作者確認已閱讀邊界與風險的聲明欄位，僅允許 presence-only / shape-only 檢查。
- `executeSwitch`: 明確執行開關欄位，僅允許 presence-only / shape-only 檢查。
- `confirmationPhrase`: 二次確認 phrase 欄位，僅允許 presence-only / shape-only 檢查。
- `serverOnlyCredentialPresence`: server-only credential presence 欄位，僅允許 presence-only 檢查，不得讀取 credential 值。
- `targetLane`: 目標 lane，預期為 `TWII`。
- `targetScope`: 目標 scope，預期為 TWII bounded missing-only path。
- `maxRows`: bounded 上限欄位，必須保持受限，不得擴大為全量寫入。
- `rollbackPlanRef`: rollback dry-run / rollback readiness contract 的引用。
- `aggregateReadbackPlanRef`: aggregate readback contract 的引用。
- `postRunReviewPlanRef`: post-run review contract 的引用。
- `duplicateProofRef`: duplicate rejection proof / missing-only proof 的引用。

## Presence-Only Value Semantics

所有授權欄位必須採用 presence-only value semantics：

- 可以檢查欄位是否存在。
- 可以檢查欄位名稱、型別、required flag、placeholder 狀態。
- 可以檢查欄位是否宣告為 external-only。
- 不可以讀取真實 authorization value。
- 不可以讀取真實 decision value。
- 不可以讀取 confirmation phrase。
- 不可以讀取 execute switch 的真實值。
- 不可以把任何真實值寫入 repo、文件、log、artifact 或 report。

若任一欄位需要真實值才能判斷，gate 必須停在 blocked / waiting external operator values 狀態，不得推進成 execution allowed。

## Server-Only Credential Presence

server-only credential presence 只允許檢查「是否具備可由 server-only runtime 檢查的 presence 機制」，不得讀取任何 env、secret、service role key、token、authorization header 或 Supabase 連線值。

合格契約應明確區分：

- `credentialPresenceCheckPrepared=true`
- `credentialValueRead=false`
- `secretValueRead=false`
- `envValueRead=false`
- `supabaseConnectionAttempted=false`
- `serverOnlyCredentialPresencePassed=false`

在尚未進入授權後的 server-only runtime 前，presence check 只能是 contract-ready，不得宣告 pass。

## Execute Switch / Confirmation Phrase Presence

execute switch 與 confirmation phrase 只能建立 presence semantics：

- `executeSwitchPresencePrepared=true`
- `confirmationPhrasePresencePrepared=true`
- `executeSwitchValueRead=false`
- `confirmationPhraseValueRead=false`
- `executeSwitchMatched=false`
- `confirmationPhraseMatched=false`
- `executionAllowedNow=false`

任何需要比對 phrase、讀取 switch、或確認真實授權內容的動作，都屬於下一階段授權後才能進行的 runtime/server-only 動作。

## Required Placeholders

bounded operator authorization packet gate 必須保留下列 placeholders，且不得把 placeholder 誤判為實際通過：

- `rollbackDryRunPlaceholder`: 指向 rollback readiness / rollback dry-run 檢查，但目前不得執行 rollback。
- `aggregateReadbackPlaceholder`: 指向 aggregate readback 檢查，但目前不得連 Supabase 讀資料。
- `postRunReviewPlaceholder`: 指向 post-run review checklist，但目前不得宣告 post-run 已完成。
- `duplicateProofPlaceholder`: 指向 duplicate rejection proof / missing-only proof，但目前不得接受 candidate rows。
- `mockBoundaryPlaceholder`: 確認 `publicDataSource=mock`、`scoreSource=mock` 邊界仍保留。

所有 placeholder 的 `passedNow` 必須維持 `false`，直到授權後有明確 runtime evidence。

## Blocked Reasons

在尚未取得董事長/CEO 授權後的真實執行值與 server-only runtime proof 前，gate 必須列出 blocked reasons：

- `externalOnlyValuesProvidedNow=false`
- `operatorDecisionValueReadNow=false`
- `executeSwitchValueRead=false`
- `confirmationPhraseValueRead=false`
- `serverOnlyCredentialPresencePassed=false`
- `rollbackDryRunPassed=false`
- `aggregateReadbackPassed=false`
- `postRunReviewPassed=false`
- `candidateDuplicateRejectionProofPassed=false`
- `runnerExecutableNow=false`
- `writeGateExecutableNow=false`
- `executionAllowedNow=false`
- `finalExecutionAllowedNow=false`

## Next Review-Only Route

建議 PM 將下一個 review-only route 命名為：

`bounded_operator_authorization_packet_review_then_server_only_execution_readiness`

此 route 的定位是把 operator authorization packet 從 contract-ready 推進到「可交由授權者審核是否進入 server-only execution readiness」；它仍不是資料寫入、不是 Supabase 執行、不是 candidate rows 接受。

## Fail-Closed Rules

bounded operator authorization packet gate 必須符合下列 fail-closed rules：

- 任何 required authorization field 缺失，結果必須 blocked。
- 任何真實值被讀取、輸出、寫入 repo、寫入 log，結果必須 blocked。
- 任何 Supabase connection attempt，結果必須 blocked。
- 任何 SQL execution，結果必須 blocked。
- 任何 `daily_prices` mutation，結果必須 blocked。
- 任何 candidate rows accepted，結果必須 blocked。
- 任何 `publicDataSource=supabase` 或 `scoreSource=real`，結果必須 blocked。
- 任何 raw payload、row payload、stock id payload、secret payload 出現，結果必須 blocked。

## PM Integration Notes

PM 主線建立 TWII bounded operator authorization packet gate 時，建議整合本文件作為 A1 contract review evidence：

- 在 PM gate report 中引用本文件路徑。
- 在 checker 中檢查狀態字串 `a1_bounded_operator_authorization_packet_contract_review_ready`。
- 在 review gate 中確認 required authorization fields、presence-only value semantics、server-only credential presence、execute switch/confirmation phrase presence、rollback/readback/postrun/duplicate proof placeholders、blocked reasons、next review-only route、fail-closed rules 均有覆蓋。
- 在 PROJECT_STATUS 與 LAUNCH_ENGINEERING_WORKSTREAM_BOARD 中只描述 contract-ready，不描述 execution-ready。
- 後續若董事長授權進入真實執行，仍應另開 server-only runtime execution gate，不能由本文件直接推導為可寫入。

## Hard Boundaries

本文件確認以下硬邊界仍然成立：

- `sqlExecuted=false`
- `supabaseConnectionAttempted=false`
- `envValueRead=false`
- `secretValueRead=false`
- `authorizationValueRead=false`
- `confirmationPhraseValueRead=false`
- `realDecisionValueRead=false`
- `marketDataFetched=false`
- `dailyPricesMutated=false`
- `candidateRowsAccepted=false`
- `publicDataSource=mock`
- `scoreSource=mock`
