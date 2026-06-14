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
    "指數燈號是面向一般投資者的市場風險與趨勢儀表站，協助使用者快速理解燈號、資料狀態與下一步觀察方向。"
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
              本網站協助整理市場燈號、風險提示與資料更新狀態。正式市場資料尚未啟用前，公開頁仍以示範資料呈現產品流程；
              燈號不提供個股買賣建議，也不能當成即時交易指令。
            </p>
            <div className="site-footer-trust" aria-label="公開信任連結">
              <span>公開 Beta</span>
              <span>示範資料</span>
              <span>非投資建議</span>
              <span>資料來源與更新時間需複核</span>
              <span>使用者自行承擔風險</span>
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
