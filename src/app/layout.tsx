import type { Metadata } from "next";
import type { ReactNode } from "react";
import { SiteNav } from "@/components/site-nav";
import { TrackedLink } from "@/components/tracked-link";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: {
    default: "指數燈號 | Taiwan Market Signal",
    template: "%s | 指數燈號"
  },
  description:
    "指數燈號是 Taiwan Market Signal 的公開 Beta 介面，協助使用者閱讀台股、ETF、族群與風險狀態；目前維持 mock-only、非投資建議，正式資料與分數仍需 promotion gate。"
};

const footerTrustLinks = [
  { href: "/methodology", label: "方法說明" },
  { href: "/disclaimer", label: "風險揭露" },
  { href: "/privacy", label: "隱私權" },
  { href: "/terms", label: "使用條款" }
];

const footerNavLinks = [
  { href: "/", label: "首頁" },
  { href: "/briefing", label: "今日簡報" },
  { href: "/weekly", label: "週報" },
  { href: "/stocks/2330", label: "個股" },
  { href: "/methodology", label: "方法說明" },
  { href: "/privacy", label: "隱私權" },
  { href: "/terms", label: "使用條款" },
  { href: "/disclaimer", label: "風險揭露" }
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
              <small>Market Signal</small>
            </span>
          </TrackedLink>
          <SiteNav />
        </header>
        {children}
        <footer className="site-footer">
          <div>
            <strong>指數燈號</strong>
            <p>
              目前是公開 Beta 的 mock-only 閱讀介面；資料新鮮度、覆蓋率與模型分數仍在驗證中，不構成投資建議。
              資料來源狀態與分數來源狀態都仍是 mock-only Beta，正式市場資料與真實分數需通過獨立正式上線審核。
            </p>
            <div className="site-footer-trust" aria-label="信任與風險連結">
              <span>資料來源：mock-only Beta</span>
              <span>分數來源：mock-only Beta</span>
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
