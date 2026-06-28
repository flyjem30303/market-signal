"use client";

import { usePathname } from "next/navigation";
import { DEFAULT_LOCALE, SECONDARY_LOCALE, type SupportedLocale } from "@/lib/i18n/config";
import { getLocalizedPath, type I18nRouteKey } from "@/lib/i18n/routes";
import { siteConfig } from "@/lib/site";
import { TrackedLink } from "@/components/tracked-link";

const footerCopy = {
  [DEFAULT_LOCALE]: {
    body: "指數燈號整理市場資訊、燈號狀態與風險脈絡，協助使用者建立固定的市場觀察流程。",
    disclosure: "內容僅供資訊參考，不構成投資建議。請搭配資料日期、引用來源與自身風險承受度使用。",
    navAria: "頁尾導覽",
    groups: [
      {
        label: "主要閱讀",
        links: [
          { label: "市場總覽", routeKey: "home" },
          { label: "市場入口", routeKey: "markets" },
          { label: "週報", routeKey: "weekly" },
          { label: "標的觀察", routeKey: "stocks" }
        ]
      },
      {
        label: "信任與規範",
        links: [
          { label: "方法說明", routeKey: "methodology" },
          { label: "風險提示", routeKey: "disclaimer" },
          { label: "隱私權", routeKey: "privacy" },
          { label: "使用條款", routeKey: "terms" }
        ]
      }
    ]
  },
  [SECONDARY_LOCALE]: {
    body: "Market Signal organizes market status, signal context, and risk cues so readers can build a repeatable market review flow.",
    disclosure: "Information only. This site does not provide investment advice. Check the data date, cited sources, and your own risk tolerance.",
    navAria: "Footer navigation",
    groups: [
      {
        label: "Main Reading",
        links: [
          { label: "Overview", routeKey: "home" },
          { label: "Markets", routeKey: "markets" },
          { label: "Weekly", routeKey: "weekly" },
          { label: "Targets", routeKey: "stocks" }
        ]
      },
      {
        label: "Trust & Rules",
        links: [
          { label: "Methodology", routeKey: "methodology" },
          { label: "Risk Notice", routeKey: "disclaimer" },
          { label: "Privacy", routeKey: "privacy" },
          { label: "Terms", routeKey: "terms" }
        ]
      }
    ]
  }
} satisfies Record<
  SupportedLocale,
  {
    body: string;
    disclosure: string;
    groups: Array<{ label: string; links: Array<{ label: string; routeKey: I18nRouteKey }> }>;
    navAria: string;
  }
>;

export function SiteFooter() {
  const pathname = usePathname();
  const locale = pathname === "/en" || pathname.startsWith("/en/") ? SECONDARY_LOCALE : DEFAULT_LOCALE;
  const copy = footerCopy[locale];

  return (
    <footer className="site-footer">
      <div className="site-footer__brand">
        <strong>{siteConfig.name}</strong>
        <p>{copy.body}</p>
        <small>{copy.disclosure}</small>
      </div>
      <nav aria-label={copy.navAria}>
        {copy.groups.map((group) => (
          <section aria-label={group.label} key={group.label}>
            <h2>{group.label}</h2>
            <div>
              {group.links.map((link) => (
                <TrackedLink
                  eventName="site_chrome_link_clicked"
                  href={getLocalizedPath(link.routeKey, locale)}
                  key={link.routeKey}
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
  );
}
