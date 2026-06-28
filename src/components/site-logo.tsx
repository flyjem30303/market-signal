"use client";

import { usePathname } from "next/navigation";
import { TrackedLink } from "@/components/tracked-link";
import { siteConfig } from "@/lib/site";

export function SiteLogo() {
  const pathname = usePathname();
  const isEnglish = pathname === "/en" || pathname.startsWith("/en/");
  const href = isEnglish ? "/en" : "/";
  const subtitle = isEnglish ? "Market signals and risk compass" : "市場燈號與風險觀察";
  const label = isEnglish ? `${siteConfig.name} Overview` : `${siteConfig.name}市場總覽`;

  return (
    <TrackedLink className="site-logo" eventName="site_chrome_link_clicked" href={href} label={label} payload={{ area: "logo" }}>
      <span className="logo-mark">MS</span>
      <span>
        {siteConfig.name}
        <small>{subtitle}</small>
      </span>
    </TrackedLink>
  );
}
