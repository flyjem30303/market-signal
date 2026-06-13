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
    "指數燈號是面向一般投資者的市場狀態儀表站，用紅黃綠燈號、核心指標、風險提示與資料更新時間，協助使用者快速理解市場氛圍。"
};

const footerTrustLinks = [
  { href: "/methodology", label: "方法說明" },
  { href: "/disclaimer", label: "免責聲明" },
  { href: "/privacy", label: "隱私權" },
  { href: "/terms", label: "使用條款" }
];

const footerNavLinks = [
  { href: "/", label: "首頁" },
  { href: "/briefing", label: "市場簡報" },
  { href: "/weekly", label: "週報" },
  { href: "/stocks/2330", label: "個股" },
  { href: "/membership", label: "會員" },
  { href: "/methodology", label: "方法說明" },
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
            label="指數燈號"
            payload={{ area: "logo" }}
          >
            <span className="logo-mark">MS</span>
            <span>
              指數燈號
              <small>市場風險與趨勢狀態儀表站</small>
            </span>
          </TrackedLink>
          <SiteNav />
        </header>
        {children}
        <footer className="site-footer">
          <div>
            <strong>指數燈號</strong>
            <p>
              本站提供市場資訊整理、風險辨識與觀察輔助。資料來源、更新時間與可能延遲會在頁面中揭露；內容不構成投資建議，
              也不提供個股買賣建議或保證報酬承諾。
            </p>
            <div className="site-footer-trust" aria-label="信任與法務連結">
              <span>資料來源：頁面揭露</span>
              <span>資料狀態：示範或正式會明確標示</span>
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
