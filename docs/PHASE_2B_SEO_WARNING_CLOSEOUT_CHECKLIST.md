# Phase 2B SEO Warning Closeout Checklist

Owner: A3 Phase 2B SEO 基礎線  
Governance: CEO 主導推進，遵守 karpathy-guidelines  
Status: Warning closeout criteria only, not an execution approval

## Purpose

這份文件定義 `cmd /c npm run check:phase-2b-seo-foundation` 目前剩餘 WARN 的關閉條件。  
本文件不修改部署環境，不修改 DNS，不修改 Vercel，不提交 GSC sitemap，不改資料來源，不改 Supabase，不執行 SQL，不抓取市場資料。

## Current Expected WARNs

目前 Phase 2B SEO foundation checker 可能保留以下 WARN：

- `layout.siteUrl`
  - Reason: `metadataBase` fallback 仍包含 localhost。
- `env.NEXT_PUBLIC_SITE_URL`
  - Reason: 本機或部署環境尚未設定正式公開 URL。
- `stocks.volume`
  - Reason: stock universe 約 1086 筆，高於 CEO 決議第一批 sitemap 上限 `100`。

## Closeout Criteria

### WARN: `layout.siteUrl`

Close only when:

- PM/CEO 已決定目前 canonical host。
- 部署環境已設定 `NEXT_PUBLIC_SITE_URL`。
- `cmd /c npm run check:phase-2b-seo-foundation` 不再提示 site URL fallback 為主要風險。

Do not close by:

- 移除 fallback 而沒有部署環境設定。
- 硬編 custom domain。
- 直接切換正式網域。

### WARN: `env.NEXT_PUBLIC_SITE_URL`

Close only when:

- Temporary Vercel phase:
  - `NEXT_PUBLIC_SITE_URL=https://market-signal-two.vercel.app`
- Custom domain phase:
  - `NEXT_PUBLIC_SITE_URL=https://<custom-domain>`
- 設定後重新跑：
  - `cmd /c npm run check:phase-2b-seo-foundation`
  - `cmd /c npm run report:phase-2b-seo-index-gate`

Do not close by:

- 在程式碼中偽造 env pass。
- 將 localhost 視為可提交 GSC 的 canonical host。

### WARN: `stocks.volume`

Close only when:

- CEO/PM 主線已確認 source / score / data-quality gate。
- `/stocks/*` 第一批 candidate 規則已被 PM/CEO 接受。
- sitemap 仍維持第一批上限 `100`。
- `cmd /c npm run report:phase-2b-seo-index-gate` 顯示沒有全量股票頁進 sitemap。

Do not close by:

- 將 1086 筆全量加入 sitemap。
- 放寬 noindex gate。
- 用 mock / fallback / insufficient data 頁面填滿 100。

## PM Integration

Requires PM integration: Yes

Reason:
- `NEXT_PUBLIC_SITE_URL`、GSC property、custom domain、stock first-batch approval 都屬 PM/CEO 主線整合。
- A3 可以提供 warning closeout criteria 與檢查器，但不應單獨改部署環境或放量股票頁。

## A3 Boundary

- A3 must not modify `docs/PHASE_2_MAINLINE_INTEGRATION_STATUS.md` unless CEO explicitly asks.
- A3 must not change DNS.
- A3 must not change Vercel project settings.
- A3 must not submit GSC sitemap.
- A3 must not change Supabase.
- No SQL.
- A3 must not fetch or ingest market data.
- A3 must not open `/stocks/*` indexing without CEO/PM mainline approval.

