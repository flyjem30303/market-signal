# Project Status

更新日期：2026-05-28

## 目前版本

靜態 HTML 原型 + Next.js 專案骨架。

## 目前最新版所在位置

```text
C:\Users\C0298\Documents\指數燈號
```

## 使用者搬移後偏好位置

```text
D:\指數燈號
```

目前執行環境可以讀取 D 槽資料夾，但寫入 D 槽時被拒絕。

## 已完成

- 多標的選擇。
- 愛心收藏。
- 四大頁籤。
- 雙分數模型。
- 2000 年起的模型資料。
- 初步 PM 文件。
- 資料庫 schema 草案。
- Sitemap 草案。
- MVP 任務清單。
- 換電腦檢查清單。
- Next.js App Router 骨架。
- React dashboard shell 雛形。
- 股票 SEO route `/stocks/[symbol]` 雛形。
- 週報頁 `/weekly` 雛形。
- Next.js 首頁、股票頁、週報頁已在 localhost 驗證。
- Next.js 版愛心收藏已支援 localStorage。
- Next.js 版標的搜尋已可用。
- Next.js 版四大頁籤已完成：今日燈號、區間變化、新聞信心、回測驗證。
- 已修正日期序列時區偏移。
- 已新增 repository 抽象層，UI 目前透過 mock repository 取資料。
- 已建立 Supabase repository 佔位。
- 已建立 Supabase client helpers 與 `.env.example`。
- Supabase 初始 schema migration。
- 股票 seed JSON 與 seed SQL。
- npm dependencies 已安裝，產生 package-lock.json。
- 已建立 A/B/C/D/E/F 協作模式：A = PM+開發者，B = 行銷企劃，C = 專業投資顧問，D = 法務顧問，E = CEO，F = 產品設計 / UIUX 設計。
- B 已提出第一批需求：股票頁 SEO 內容區塊、週報文章模板、追蹤事件規格。
- 已完成 B Request 001：股票頁 SEO 內容區塊與個股頁 metadata。
- 已完成 B Request 002：週報文章模板。
- 已完成 B Request 003：基礎追蹤事件規格與 `trackEvent()` helper。
- C 已提出第一批需求：評分方法論頁、模型資料品質欄位。
- D 已提出第一批風險提醒：免責聲明頁、聯盟揭露、新聞著作權。
- 已完成 C Request 001：評分方法論頁 `/methodology`。
- 已完成 C Request 002：模型資料品質欄位與今日燈號資料品質顯示。
- 已完成 D Review 001：免責聲明頁 `/disclaimer`。
- 已建立 SEO 技術基礎：`sitemap.xml`、`robots.txt`、個股頁 canonical / OpenGraph / JSON-LD。
- 已完成 D Review 004：隱私權政策 `/privacy` 與使用條款 `/terms` 草案。
- 已完成 D Review 002：廣告與聯盟行銷揭露格式，並建立商業合作預留區。
- E 已提出產品主軸：專案必須成為會讓人長期使用的工具，而不只是一次性股票查詢頁。
- 已完成 E Request 001：每日晨報 `/briefing`。
- 已完成 E Request 002：股票頁加入基礎行情層，定位為股市資料頁 + 智能解讀頁。
- 已完成股票頁第二階段：技術、成交量、股利 / 基本資料頁籤。
- 已完成股票頁新聞分頁與投資信心評論合併，加入新聞信心儀表。
- F 已提出設計主軸：專案需要更像成熟金融工具，提升信任感、資訊層級與長期使用舒適度。
- 已完成 F Request 001：設計系統基礎、Header 升級與晨報第一屏視覺升級。

## 下一次開工建議

1. Git 先暫停，不阻塞開發。
2. 執行 `npm install`。
3. 執行 `npm run dev`。
4. 將靜態原型功能逐步搬到 React 元件。
5. 建立 Supabase 專案。
6. 匯入股票主檔。
7. 建立每日資料更新流程。
8. 將 Supabase repository 改成真實查詢。
9. 匯入完整上市股票主檔。
10. 建立每日資料更新流程。
11. 規劃會員雲端收藏與 Email 晨報。

## 環境狀態

- Node.js：可用。
- npm：可用。
- Git：目前未安裝或不在 PATH。
- Git：使用 Visual Studio 內建 git 可執行，但目前因 ownership / safe.directory 設定暫停。
- npm dependencies：已安裝。
- Codex 沙盒限制：在沙盒內執行 `next build` / require node_modules 會遇到 `EPERM lstat C:\Users\C0298`，建議用一般 PowerShell 跑 Next.js。
- Supabase：尚未建立遠端專案。

## 重要決策

- 不先做會員，先做資料可信度與 SEO。
- 不先買新聞 API，先用官方資料與週報內容。
- 不先重度投放廣告，避免破壞金融工具信任感。
