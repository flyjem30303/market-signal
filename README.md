# 多標的健康度與回檔風險燈號

這是一個台股投資決策輔助平台。現階段已從純 HTML 原型推進到 Next.js 產品骨架，用來驗證資訊架構、評分模型、SEO、晨報、股票頁與長期使用場景。

## 目前狀態

- 前端原型：保留純靜態 HTML/CSS/JS。
- 正式網站骨架：已建立 Next.js App Router 專案。
- npm dependencies：已安裝，已有 `package-lock.json`。
- 起始資料期間：2000-01-01 至 2026-05-28。
- 已有主要頁面：
  - `/`
  - `/briefing`
  - `/stocks/[symbol]`
  - `/weekly`
  - `/methodology`
  - `/disclaimer`
  - `/privacy`
  - `/terms`
- 已有功能：
  - 多標的切換
  - 愛心收藏，存在瀏覽器 localStorage
  - 股票頁行情摘要
  - 技術、成交量、股利 / 基本、新聞、燈號模型頁籤
  - 多頭健康度 / 回檔風險度雙分數
  - 綜合燈號
  - 時間區間滑桿
  - 新聞信心儀表
  - 模擬回測摘要

## 如何打開

### 靜態原型

直接用瀏覽器開啟：

```text
index.html
```

### Next.js 版本

在專案資料夾執行：

```bash
npm install
npm run dev
```

目前已產生 `package-lock.json`。若 Codex 沙盒內執行 `next build` 遇到 `EPERM lstat C:\Users\C0298`，請改在一般 PowerShell 視窗中執行 `npm run dev` 或 `npm run build`。

## 重要提醒

目前所有行情、分數、新聞與回測都還是 mock / synthetic data，不是真實市場資料。下一階段要把它改成正式網站時，需要接入真實資料源與資料庫。

換電腦請先看：

```text
docs/HANDOFF.md
docs/MIGRATION_CHECKLIST.md
docs/FILE_MANIFEST.md
PROJECT_STATUS.md
```

## 專案目標

長期目標是做成：

- 儀表板
- 股票 SEO 頁
- 週報文章
- 會員功能
- 廣告收入
- 聯盟行銷

建議開發順序：

1. 資料可信度
2. SEO 股票頁
3. 穩定流量
4. 廣告
5. 會員
6. 聯盟行銷

## 檔案說明

```text
index.html       靜態頁面結構
styles.css       頁面樣式
script.js        模型資料、互動邏輯、圖表與評分
package.json     Next.js 專案設定
package-lock.json npm 安裝鎖定檔
src/             Next.js App Router 與 React 元件
supabase/        PostgreSQL migration 與 seed SQL
data/            初始資料與未來匯入資料
scripts/         資料處理腳本
docs/            專案文件與轉移資料
```

## Git 狀態

目前 Git 初始化與提交先暫停，原因是 Windows 權限與 ownership 設定造成 CLI 操作不順。這不影響目前開發；之後可在環境整理好後再建立正式 repo。

## 下階段建議技術

- 前端：Next.js
- 資料庫：Supabase PostgreSQL
- 部署：Vercel
- 排程：GitHub Actions 或 Supabase Edge Functions
- 初期資料更新：每日批次腳本
