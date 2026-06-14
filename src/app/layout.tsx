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
    "指數燈號把市場資料整理成可閱讀的燈號、風險提示與觀察流程，協助一般投資者快速理解市場狀態。"
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
  { href: "/weekly", label: "週報" },
  { href: "/stocks/2330", label: "標的" },
  { href: "/membership", label: "會員規劃" },
  { href: "/methodology", label: "方法說明" },
  { href: "/privacy", label: "隱私政策" },
  { href: "/terms", label: "使用條款" },
  { href: "/disclaimer", label: "風險聲明" }
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
              <small>市場風險與趨勢儀表站</small>
            </span>
          </TrackedLink>
          <SiteNav />
        </header>
        {children}
        <footer className="site-footer">
          <div>
            <strong>指數燈號</strong>
            <p>
              以市場燈號、風險提示與資料更新時間協助你建立固定觀察流程。本站內容僅供資訊整理與風險辨識，屬於非投資建議。
            </p>
            <div className="site-footer-trust" aria-label="信任與使用邊界">
              <span>公開 Beta</span>
              <span>資料狀態清楚標示</span>
              <span>非投資建議</span>
              <span>正式資料尚未啟用</span>
              <span>請搭配自行判斷</span>
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
