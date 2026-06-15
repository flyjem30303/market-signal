import type { Metadata } from "next";
import type { ReactNode } from "react";
import { SiteNav } from "@/components/site-nav";
import { TrackedLink } from "@/components/tracked-link";
import { siteConfig } from "@/lib/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`
  },
  description: "用紅黃綠燈號、核心指標與風險提示，協助一般投資者快速理解台股市場狀態。"
};

const footerTrustLinks = [
  { href: "/methodology", label: "方法說明" },
  { href: "/disclaimer", label: "風險聲明" },
  { href: "/privacy", label: "隱私政策" },
  { href: "/terms", label: "使用條款" }
];

const footerNavLinks = [
  { href: "/", label: "首頁" },
  { href: "/briefing", label: "市場簡報" },
  { href: "/weekly", label: "每週觀察" },
  { href: "/stocks/2330", label: "標的燈號" }
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
            label="指數燈號首頁"
            payload={{ area: "logo" }}
          >
            <span className="logo-mark">MS</span>
            <span>
              指數燈號
              <small>市場狀態與風險觀察儀表站</small>
            </span>
          </TrackedLink>
          <SiteNav />
        </header>
        {children}
        <footer className="site-footer">
          <div>
            <strong>指數燈號</strong>
            <p>
              本網站提供市場資訊整理與風險觀察，不構成投資建議。公開 Beta 階段仍以示範資料與資料品質檢查為主，
              正式資料啟用前會清楚標示來源、更新時間與延遲狀態。
            </p>
            <div className="site-footer-trust" aria-label="信任與風險資訊">
              <span>公開 Beta</span>
              <span>示範資料</span>
              <span>非投資建議</span>
              <span>資料更新狀態透明</span>
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
