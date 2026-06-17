import type { Metadata } from "next";
import type { ReactNode } from "react";
import { SiteNav } from "@/components/site-nav";
import { TrackedLink } from "@/components/tracked-link";
import { siteConfig } from "@/lib/site";
import "./globals.css";

const copy = {
  marketOverview: "\u5e02\u5834\u7e3d\u89bd",
  siteSubtitle: "\u5e02\u5834\u72c0\u614b\u8207\u98a8\u96aa\u89c0\u5bdf",
  footerTrustAria: "\u4fe1\u4efb\u8207\u98a8\u96aa\u9023\u7d50",
  footerNavAria: "\u9801\u5c3e\u5c0e\u89bd",
  footerBody:
    "\u672c\u7db2\u7ad9\u6574\u7406\u5e02\u5834\u72c0\u614b\u3001\u98a8\u96aa\u63d0\u793a\u8207\u8cc7\u6599\u66f4\u65b0\u6642\u9593\uff0c\u5354\u52a9\u4f7f\u7528\u8005\u5efa\u7acb\u89c0\u5bdf\u6d41\u7a0b\u3002\u6240\u6709\u5167\u5bb9\u50c5\u4f9b\u8cc7\u8a0a\u53c3\u8003\uff0c\u4e0d\u69cb\u6210\u6295\u8cc7\u5efa\u8b70\u3001\u5831\u916c\u627f\u8afe\u6216\u8cb7\u8ce3\u63a8\u85a6\u3002"
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`
  },
  description:
    "\u6307\u6578\u71c8\u865f\u7528\u7d05\u9ec3\u7da0\u72c0\u614b\u6574\u7406\u5e02\u5834\u98a8\u96aa\u3001\u8da8\u52e2\u5f37\u5f31\u8207\u89c0\u5bdf\u91cd\u9ede\uff0c\u5354\u52a9\u4f7f\u7528\u8005\u5efa\u7acb\u5e02\u5834\u95b1\u8b80\u9806\u5e8f\u3002"
};

const footerTrustLinks = [
  { href: "/methodology", label: "\u65b9\u6cd5\u8aaa\u660e" },
  { href: "/disclaimer", label: "\u98a8\u96aa\u8072\u660e" },
  { href: "/privacy", label: "\u96b1\u79c1\u6b0a" },
  { href: "/terms", label: "\u4f7f\u7528\u689d\u6b3e" }
];

const footerNavLinks = [
  { href: "/", label: copy.marketOverview },
  { href: "/briefing", label: "\u4eca\u65e5\u7c21\u5831" },
  { href: "/weekly", label: "\u9031\u5831" },
  { href: "/stocks/2330", label: "\u6a19\u7684\u71c8\u865f" }
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
            <div className="site-footer-trust" aria-label={copy.footerTrustAria}>
              <span>\u516c\u958b\u514d\u8cbb\u7248</span>
              <span>\u8cc7\u6599\u6642\u9593\u6e05\u695a\u6a19\u793a</span>
              <span>\u975e\u6295\u8cc7\u5efa\u8b70</span>
              <span>\u8cc7\u6599\u7570\u5e38\u6642\u6703\u4fdd\u5b88\u964d\u7d1a</span>
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
