import type { Metadata } from "next";
import type { ReactNode } from "react";
import { SiteNav } from "@/components/site-nav";
import { TrackedLink } from "@/components/tracked-link";
import { siteConfig } from "@/lib/site";
import "./globals.css";

const copy = {
  marketOverview: "市場總覽",
  siteSubtitle: "台股燈號與風險觀察",
  footerNavAria: "頁尾導覽",
  footerBody:
    "指數燈號整理公開市場資訊、燈號狀態與風險提醒，協助使用者快速判讀市場狀態。內容僅供資訊參考，不構成投資建議。",
  footerDisclosure: "資料可能延遲或調整，請以引用來源與自身風險承受度判讀。"
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`
  },
  description: "以台股市場燈號、資料日期、來源揭露與風險提示，協助投資人快速掌握市場狀態。"
};

const footerLinkGroups = [
  {
    label: "主要閱讀",
    links: [
      { href: "/", label: copy.marketOverview },
      { href: "/briefing", label: "市場快報" },
      { href: "/weekly", label: "週報" },
      { href: "/stocks/2330", label: "標的觀察" }
    ]
  },
  {
    label: "信任與規範",
    links: [
      { href: "/methodology", label: "方法說明" },
      { href: "/disclaimer", label: "風險提示" },
      { href: "/privacy", label: "隱私權" },
      { href: "/terms", label: "使用條款" }
    ]
  }
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
          <div className="site-footer__brand">
            <strong>{siteConfig.name}</strong>
            <p>{copy.footerBody}</p>
            <small>{copy.footerDisclosure}</small>
          </div>
          <nav aria-label={copy.footerNavAria}>
            {footerLinkGroups.map((group) => (
              <section aria-label={group.label} key={group.label}>
                <h2>{group.label}</h2>
                <div>
                  {group.links.map((link) => (
                    <TrackedLink
                      eventName="site_chrome_link_clicked"
                      href={link.href}
                      key={link.href}
                      label={link.label}
                      payload={{ area: "footer_nav", group: group.label }}
                    >
                      {link.label}
                    </TrackedLink>
                  ))}
                </div>
              </section>
            ))}
          </nav>
        </footer>
      </body>
    </html>
  );
}
