import type { Metadata } from "next";
import { buildWebsiteJsonLd, seoDefaultImagePath, seoSiteDescription } from "@/lib/seo";
import type { ReactNode } from "react";
import { SiteFooter } from "@/components/site-footer";
import { SiteLogo } from "@/components/site-logo";
import { SiteNav } from "@/components/site-nav";
import { siteConfig } from "@/lib/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  alternates: {
    canonical: "/"
  },
  applicationName: siteConfig.name,
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`
  },
  description: seoSiteDescription,
  openGraph: {
    description: seoSiteDescription,
    images: [
      {
        alt: "指數燈號 Market Signal",
        height: 630,
        url: seoDefaultImagePath,
        width: 1200
      }
    ],
    locale: "zh_TW",
    siteName: siteConfig.name,
    title: siteConfig.name,
    type: "website",
    url: "/"
  },
  twitter: {
    card: "summary_large_image",
    description: seoSiteDescription,
    images: [seoDefaultImagePath],
    title: siteConfig.name
  }
};

export default function RootLayout({ children }: { children: ReactNode }) {
  const websiteJsonLd = buildWebsiteJsonLd();

  return (
    <html lang="zh-Hant">
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd).replace(/</g, "\\u003c") }}
        />
        <header className="site-header">
          <SiteLogo />
          <SiteNav />
        </header>
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
