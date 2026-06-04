import type { Metadata } from "next";
import type { ReactNode } from "react";
import { SiteNav } from "@/components/site-nav";
import { TrackedLink } from "@/components/tracked-link";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: {
    default: "台股健康度與回檔風險燈號",
    template: "%s | 台股健康度與回檔風險燈號"
  },
  description: "用多頭健康度、回檔風險度、新聞信心與回測摘要追蹤台股標的。"
};

const footerTrustLinks = [
  { href: "/methodology", label: "方法論" },
  { href: "/disclaimer", label: "免責聲明" },
  { href: "/privacy", label: "隱私權" },
  { href: "/terms", label: "使用條款" }
];

const footerNavLinks = [
  { href: "/", label: "首頁" },
  { href: "/briefing", label: "每日晨報" },
  { href: "/weekly", label: "週報" },
  { href: "/stocks/2330", label: "個股" },
  { href: "/methodology", label: "方法論" },
  { href: "/privacy", label: "隱私權" },
  { href: "/terms", label: "使用條款" },
  { href: "/disclaimer", label: "免責聲明" }
];

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="zh-Hant">
      <body>
        <header className="site-header">
          <TrackedLink
            className="site-logo"
            eventName="site_chrome_link_clicked"
            href="/"
            label="台股燈號"
            payload={{ area: "logo" }}
          >
            <span className="logo-mark">MS</span>
            <span>
              台股燈號
              <small>Market Signal</small>
            </span>
          </TrackedLink>
          <SiteNav />
        </header>
        {children}
        <footer className="site-footer">
          <div>
            <strong>台股燈號</strong>
            <p>這個網站目前仍是 mock 閱讀體驗，用來驗證市場健康度、風險提示與閱讀流程，不構成投資建議。</p>
            <div className="site-footer-trust" aria-label="全站資料與責任邊界">
              <span>資料來源：mock</span>
              <span>分數來源：模擬評分</span>
              {footerTrustLinks.map((link) => (
                <TrackedLink
                  eventName="site_chrome_link_clicked"
                  href={link.href}
                  key={link.href}
                  label={link.label}
                  payload={{ area: "footer_trust" }}
                >
                  {link.label}
                </TrackedLink>
              ))}
            </div>
          </div>
          <nav aria-label="頁尾導覽">
            {footerNavLinks.map((link) => (
              <TrackedLink
                eventName="site_chrome_link_clicked"
                href={link.href}
                key={link.href}
                label={link.label}
                payload={{ area: "footer_nav" }}
              >
                {link.label}
              </TrackedLink>
            ))}
          </nav>
        </footer>
      </body>
    </html>
  );
}
