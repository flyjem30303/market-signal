"use client";

import { usePathname } from "next/navigation";
import { trackEvent } from "@/lib/tracking";

const navItems = [
  { href: "/", label: "總覽" },
  { href: "/briefing", label: "市場快報" },
  { href: "/weekly", label: "市場週報" },
  { activePrefix: "/stocks", href: "/stocks/2330", label: "個股燈號" },
  { href: "/methodology", label: "方法說明" },
  { href: "/privacy", label: "隱私政策" },
  { href: "/terms", label: "使用條款" },
  { href: "/disclaimer", label: "免責聲明" }
];

export function SiteNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="主選單">
      {navItems.map((item) => {
        const activePath = item.activePrefix ?? item.href;
        const isActive = pathname === activePath || pathname.startsWith(`${activePath}/`);

        return (
          <a
            aria-current={isActive ? "page" : undefined}
            className={isActive ? "active" : undefined}
            href={item.href}
            key={item.href}
            onClick={() => trackEvent("nav_link_clicked", { from: pathname, href: item.href, label: item.label })}
          >
            {item.label}
          </a>
        );
      })}
    </nav>
  );
}
