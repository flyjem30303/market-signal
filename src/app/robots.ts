import type { MetadataRoute } from "next";

import { absoluteUrl, siteConfig } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/internal", "/api/internal", "/membership", "/watchlist"]
    },
    sitemap: absoluteUrl("/sitemap.xml"),
    host: siteConfig.url
  };
}
