import type { Metadata } from "next";
import type { ReactNode } from "react";
import { SiteNav } from "@/components/site-nav";
import { TrackedLink } from "@/components/tracked-link";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: {
    default: "指數燈號 | 台股決策輔助",
    template: "%s | 指數燈號"
  },
  description:
    "指數燈號是台股與 ETF 的示範資料決策輔助 Beta，提供市場閱讀、資料新鮮度、覆蓋率與非投資建議揭露。"
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
              目前是示範資料公開 Beta：資料來源與分數來源都尚未切換為正式市場資料。內容用於市場閱讀與產品流程展示，
              可能有覆蓋率不足、資料缺漏或延遲、模型限制，且不構成投資建議。
            </p>
            <div className="site-footer-trust" aria-label="信任與法務連結">
              <span>資料來源：示範資料</span>
              <span>分數來源：示範分數</span>
              <span>風險揭露</span>
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
