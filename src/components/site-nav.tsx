"use client";

import { usePathname } from "next/navigation";
import { trackEvent } from "@/lib/tracking";

const navItems = [
  { href: "/", label: "市場總覽" },
  { href: "/briefing", label: "市場快報" },
  { href: "/weekly", label: "週報" },
  { activePrefix: "/stocks", href: "/stocks/2330", label: "標的觀察" },
  { href: "/methodology", label: "方法說明" }
];

export function SiteNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="主要導覽">
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
