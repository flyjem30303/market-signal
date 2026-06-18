import type { Metadata } from "next";
import type { ReactNode } from "react";
import { SiteNav } from "@/components/site-nav";
import { TrackedLink } from "@/components/tracked-link";
import { siteConfig } from "@/lib/site";
import "./globals.css";

const copy = {
  marketOverview: "市場總覽",
  siteSubtitle: "市場狀態與風險觀察",
  footerNavAria: "頁尾導覽",
  footerBody: "本站整理市場狀態、風險提示與資料更新時間；內容僅供資訊參考，不構成投資建議。"
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`
  },
  description: "指數燈號用紅黃綠狀態整理市場風險、趨勢強弱與觀察重點，協助使用者建立市場閱讀順序。"
};

const footerNavLinks = [
  { href: "/", label: copy.marketOverview },
  { href: "/briefing", label: "今日簡報" },
  { href: "/methodology", label: "方法說明" },
  { href: "/disclaimer", label: "風險聲明" },
  { href: "/privacy", label: "隱私權" },
  { href: "/terms", label: "使用條款" }
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
            label={`${siteConfig.name}${copy.marketOverview}`}
            payload={{ area: "logo" }}
          >
            <span className="logo-mark">MS</span>
            <span>
              {siteConfig.name}
              <small>{copy.siteSubtitle}</small>
            </span>
          </TrackedLink>
          <SiteNav />
        </header>
        {children}
        <footer className="site-footer">
          <div>
            <strong>{siteConfig.name}</strong>
            <p>{copy.footerBody}</p>
          </div>
          <nav aria-label={copy.footerNavAria}>
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
