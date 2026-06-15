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
  description:
    "指數燈號是市場狀態儀表站，協助一般投資者用市場燈號、資料更新時間、風險提示與非投資建議邊界，快速理解目前市場氣氛。"
};

const footerTrustLinks = [
  { href: "/methodology", label: "方法說明" },
  { href: "/disclaimer", label: "免責聲明" },
  { href: "/privacy", label: "隱私政策" },
  { href: "/terms", label: "使用條款" }
];

const footerNavLinks = [
  { href: "/", label: "總覽" },
  { href: "/briefing", label: "市場快報" },
  { href: "/weekly", label: "市場週報" },
  { href: "/stocks/2330", label: "個股燈號" }
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
            label="指數燈號總覽"
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
              指數燈號整理市場資訊、風險提示與資料更新時間，協助使用者建立固定觀察流程。
              目前公開版仍使用示範資料與示範分數；所有內容僅供資訊整理，不構成投資建議或買賣建議。
            </p>
            <div className="site-footer-trust" aria-label="信任與風險連結">
              <span>Phase 1 公開版</span>
              <span>示範資料</span>
              <span>非投資建議</span>
              <span>資料更新時間需明確標示</span>
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
