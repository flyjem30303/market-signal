"use client";

import { usePathname } from "next/navigation";
import { trackEvent } from "@/lib/tracking";

const navItems = [
  { href: "/", label: "\u5e02\u5834\u7e3d\u89bd" },
  { href: "/briefing", label: "\u4eca\u65e5\u7c21\u5831" },
  { href: "/weekly", label: "\u9031\u5831" },
  { activePrefix: "/stocks", href: "/stocks/2330", label: "\u6a19\u7684\u71c8\u865f" },
  { href: "/methodology", label: "\u65b9\u6cd5\u8aaa\u660e" },
  { href: "/privacy", label: "\u96b1\u79c1\u6b0a" },
  { href: "/terms", label: "\u4f7f\u7528\u689d\u6b3e" },
  { href: "/disclaimer", label: "\u98a8\u96aa\u8072\u660e" }
];

export function SiteNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="\u4e3b\u8981\u5c0e\u89bd">
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
