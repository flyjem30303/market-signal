import type { Metadata } from "next";
import type { ReactNode } from "react";
import { SiteNav } from "@/components/site-nav";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: {
    default: "台股健康度與回檔風險燈號",
    template: "%s | 台股健康度與回檔風險燈號"
  },
  description: "用多頭健康度、回檔風險度、新聞信心與回測摘要追蹤台股標的。"
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="zh-Hant">
      <body>
        <header className="site-header">
          <a className="site-logo" href="/">
            <span className="logo-mark">MS</span>
            <span>
              台股燈號
              <small>Market Signal</small>
            </span>
          </a>
          <SiteNav />
        </header>
        {children}
        <footer className="site-footer">
          <div>
            <strong>台股燈號</strong>
            <p>目前為 mock 研究體驗，用來驗證市場健康度、風險提示與閱讀流程，不構成投資建議。</p>
          </div>
          <nav aria-label="頁尾導覽">
            <a href="/briefing">每日晨報</a>
            <a href="/weekly">週報</a>
            <a href="/stocks/2330">個股</a>
            <a href="/methodology">方法論</a>
            <a href="/privacy">隱私權</a>
            <a href="/terms">使用條款</a>
            <a href="/disclaimer">免責聲明</a>
          </nav>
        </footer>
      </body>
    </html>
  );
}
