# 專案交接文件

更新日期：2026-05-28

## 一句話定位

台股投資人每天打開的市場狀態儀表：提供常見股市資料，並用多頭健康度、回檔風險、新聞信心與資料品質，協助判斷投資節奏。

## 最新專案位置

```text
C:\Users\C0298\Documents\指數燈號
```

使用者希望之後搬到：

```text
D:\指數燈號
```

目前 Codex 對 D 槽可讀但不可寫，所以最新可編輯版本仍在 Documents。

## 目前產品定位

CEO 已定調：本網站不是只做「多標的健康度與回檔風險燈號」，也不是複製大型股市網站。

正確定位是：

- 基礎股市資料：信任基礎。
- 健康度 / 回檔風險 / 新聞信心：差異化。
- 晨報與週報：長期回訪入口。

## 目前已完成

- Next.js App Router 專案已建立。
- npm dependencies 已安裝，已有 `package-lock.json`。
- 首頁 dashboard。
- `/briefing` 台股每日晨報。
- `/stocks/[symbol]` 股票頁。
- `/weekly` 週報頁。
- `/methodology` 評分方法論。
- `/disclaimer` 投資免責聲明。
- `/privacy` 隱私權政策草案。
- `/terms` 使用條款草案。
- `sitemap.xml`、`robots.txt`。
- 股票頁 canonical、OpenGraph、JSON-LD。
- A/B/C/D/E/F 角色協作模式。
- 股票頁行情摘要。
- 股票頁頁籤：總覽、走勢、技術、成交量、股利 / 基本、新聞、燈號模型。
- 新聞信心儀表。
- 商業合作預留區與聯盟揭露格式。
- Supabase schema migration 草案。
- 股票 seed JSON / SQL。
- Repository 抽象層。

## 目前資料狀態

目前 UI 使用 mock repository 與 mock quote：

- `src/lib/repositories/mock-market-signal-repository.ts`
- `src/lib/market-data.ts`
- `src/lib/signal-model.ts`

尚未接真實 TWSE / Supabase 市場資料。

## 啟動方式

在新電腦專案資料夾內執行：

```powershell
npm install
npm run dev
```

開啟：

```text
http://localhost:3000
```

建議檢查頁面：

```text
http://localhost:3000/briefing
http://localhost:3000/stocks/2330
http://localhost:3000/weekly
http://localhost:3000/methodology
http://localhost:3000/sitemap.xml
```

## 可執行檢查

```powershell
npm run check:json
npm run check:env
npm run lint
npx tsc --noEmit
```

在目前 Codex 沙盒中，`lint` / `tsc` / `next build` 可能遇到：

```text
EPERM: operation not permitted, lstat 'C:\Users\C0298'
```

這是目前沙盒權限問題。請在一般 PowerShell 執行比較準。

## Git 狀態

Git 先暫停，不阻塞開發。

原因：

- 使用者 PowerShell 原本找不到 Git。
- Visual Studio 內建 Git 可用，但 repository ownership / safe.directory 有問題。
- 之後換電腦後建議重新整理 Git 環境，再建立正式 repo。

## 重要角色

- A：PM + 開發者
- B：行銷企劃
- C：專業投資顧問
- D：法務顧問
- E：CEO
- F：產品設計 / UIUX 設計
- 使用者：董事長

主要協作文件：

```text
docs/AB_COLLABORATION.md
docs/E_CEO_STRATEGY.md
docs/F_DESIGN_STRATEGY.md
```

## 下次開工優先順序

1. 建立正式 Git repo。
2. 匯入完整上市股票主檔。
3. 建立每日價格更新腳本。
4. 建立真實分數計算流程。
5. 將 repository 從 mock 切到 Supabase。
6. ETF 專用頁籤：成分股、配息、折溢價。
7. 規劃會員雲端收藏與 Email 晨報。

## 不要搬的資料

```text
node_modules/
.next/
dist/
build/
*.log
.env
.env.local
```

## 最重要提醒

目前頁面看起來已像可用產品，但分數、行情、新聞與回測仍是 mock / synthetic data。正式上線前必須接真實資料、補資料品質揭露，並完成基本回測驗證。
