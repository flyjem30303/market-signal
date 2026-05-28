# 換電腦檢查清單

## 搬移前

- [ ] 複製整個資料夾：`C:\Users\C0298\Documents\指數燈號`
- [ ] 確認有 `package.json` 與 `package-lock.json`。
- [ ] 確認有 `src/`、`docs/`、`supabase/`、`data/`、`scripts/`。
- [ ] 不需要複製 `node_modules/`。
- [ ] 不需要複製 `.next/`。
- [ ] 若有 `.env.local`，另外安全備份，不要公開分享。

## 新電腦安裝

- [ ] 安裝 Node.js LTS。
- [ ] 安裝 Git。
- [ ] 安裝 VS Code 或慣用編輯器。
- [ ] 複製專案到新電腦，例如：`D:\指數燈號`。
- [ ] 用 PowerShell 進入專案資料夾。

```powershell
cd D:\指數燈號
npm install
npm run dev
```

## 新電腦驗證

- [ ] 開啟 `http://localhost:3000`
- [ ] 開啟 `http://localhost:3000/briefing`
- [ ] 開啟 `http://localhost:3000/stocks/2330`
- [ ] 開啟 `http://localhost:3000/weekly`
- [ ] 開啟 `http://localhost:3000/methodology`
- [ ] 開啟 `http://localhost:3000/sitemap.xml`

## 指令檢查

```powershell
npm run check:json
npm run check:env
npx tsc --noEmit
npm run lint
```

若 `lint` 顯示 Next.js lint 指令問題，之後可以再調整 ESLint 設定；目前不阻塞功能開發。

## Git 建議

新電腦先確認 Git：

```powershell
git --version
```

再初始化或接 GitHub：

```powershell
git init
git add .
git commit -m "Initial project handoff"
```

若遇到 safe.directory / ownership 問題，再依 Git 提示加入 safe directory。

## 帳號準備

- [ ] GitHub
- [ ] Vercel
- [ ] Supabase
- [ ] Google Search Console
- [ ] Google AdSense
- [ ] 網域 DNS 管理帳號

## 新電腦第一個開工目標

建議先做：

1. 建立正式 Git repo。
2. 建立 Supabase 專案。
3. 匯入完整上市股票主檔。
4. 把 mock repository 逐步換成真實資料查詢。
