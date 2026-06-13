import type { Metadata } from "next";
import type { ReactNode } from "react";
import { SiteNav } from "@/components/site-nav";
import { TrackedLink } from "@/components/tracked-link";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: {
    default: "指數燈號",
    template: "%s | 指數燈號"
  },
  description:
    "指數燈號以紅黃綠狀態、核心指標與風險提示，協助一般投資者快速理解市場氣氛。本網站為資訊整理工具，不提供買賣建議。"
};

const footerTrustLinks = [
  { href: "/methodology", label: "燈號方法" },
  { href: "/disclaimer", label: "風險聲明" },
  { href: "/privacy", label: "隱私說明" },
  { href: "/terms", label: "使用條款" }
];

const footerNavLinks = [
  { href: "/", label: "首頁" },
  { href: "/briefing", label: "市場簡報" },
  { href: "/weekly", label: "市場週報" },
  { href: "/stocks/2330", label: "個股/ETF" },
  { href: "/membership", label: "會員預覽" },
  { href: "/methodology", label: "方法說明" },
  { href: "/privacy", label: "隱私" },
  { href: "/terms", label: "條款" },
  { href: "/disclaimer", label: "聲明" }
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
              <small>市場狀態、風險提示與資料更新時間</small>
            </span>
          </TrackedLink>
          <SiteNav />
        </header>
        {children}
        <footer className="site-footer">
          <div>
            <strong>指數燈號</strong>
            <p>
              本站整理市場指標、燈號狀態與風險提醒，協助使用者建立觀察流程。內容不是投資建議，不保證報酬，也不代替使用者做投資決策。
            </p>
            <div className="site-footer-trust" aria-label="信任與風險說明">
              <span>公開 Beta</span>
              <span>示範資料邊界</span>
              <span>非投資建議</span>
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
