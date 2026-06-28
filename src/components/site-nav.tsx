"use client";

import { usePathname } from "next/navigation";
import { DEFAULT_LOCALE, LOCALE_COOKIE_NAME, SECONDARY_LOCALE, type SupportedLocale } from "@/lib/i18n/config";
import { getI18nRouteKeyForPath, getLocalizedPath, type I18nRouteKey } from "@/lib/i18n/routes";
import { trackEvent } from "@/lib/tracking";

const navItems = [
  { labels: { [DEFAULT_LOCALE]: "市場總覽", [SECONDARY_LOCALE]: "Overview" }, routeKey: "home" },
  { labels: { [DEFAULT_LOCALE]: "市場入口", [SECONDARY_LOCALE]: "Markets" }, routeKey: "markets" },
  { labels: { [DEFAULT_LOCALE]: "標的觀察", [SECONDARY_LOCALE]: "Targets" }, routeKey: "stocks" },
  { labels: { [DEFAULT_LOCALE]: "週報", [SECONDARY_LOCALE]: "Weekly" }, routeKey: "weekly" },
  { labels: { [DEFAULT_LOCALE]: "方法說明", [SECONDARY_LOCALE]: "Methodology" }, routeKey: "methodology" }
] satisfies Array<{
  labels: Record<SupportedLocale, string>;
  routeKey: I18nRouteKey;
}>;

export function SiteNav() {
  const pathname = usePathname();
  const locale = pathname === "/en" || pathname.startsWith("/en/") ? SECONDARY_LOCALE : DEFAULT_LOCALE;
  const routeKey = getI18nRouteKeyForPath(pathname);
  const languagePaths = getLanguagePathsForPath(pathname, routeKey);
  const navAria = locale === SECONDARY_LOCALE ? "Primary navigation" : "主要導覽";

  return (
    <nav aria-label={navAria}>
      {navItems.map((item) => {
        const href = getLocalizedPath(item.routeKey, locale);
        const label = item.labels[locale];
        const isHome = item.routeKey === "home";
        const isActive = pathname === href || (!isHome && pathname.startsWith(`${href}/`));

        return (
          <a
            aria-current={isActive ? "page" : undefined}
            className={isActive ? "active" : undefined}
            href={href}
            key={item.routeKey}
            onClick={() => trackEvent("nav_link_clicked", { from: pathname, href, label })}
          >
            {label}
          </a>
        );
      })}
      {languagePaths ? <LanguageSwitcher languagePaths={languagePaths} pathname={pathname} /> : null}
    </nav>
  );
}

type LanguageSwitcherProps = {
  languagePaths: Record<SupportedLocale, string>;
  pathname: string;
};

function LanguageSwitcher({ languagePaths, pathname }: LanguageSwitcherProps) {
  const defaultPath = languagePaths[DEFAULT_LOCALE];
  const englishPath = languagePaths[SECONDARY_LOCALE];
  const normalizedPathname = normalizePathname(pathname);
  const isEnglish = normalizedPathname === normalizePathname(englishPath);
  const currentLanguageLabel = isEnglish ? "EN" : "繁中";
  const switcherAria = isEnglish ? "Language switcher" : "語言切換";
  const defaultLabel = isEnglish ? "Traditional Chinese" : "繁體中文";

  return (
    <details className="site-language-switcher">
      <summary aria-label={switcherAria}>
        <GlobeIcon />
        <span>{currentLanguageLabel}</span>
      </summary>
      <div className="site-language-menu" role="menu">
        <a
          aria-current={pathname === defaultPath ? "page" : undefined}
          className={pathname === defaultPath ? "active" : undefined}
          href={defaultPath}
          onClick={() => handleLanguageSelect(pathname, DEFAULT_LOCALE)}
          role="menuitem"
        >
          {defaultLabel}
        </a>
        <a
          aria-current={pathname === englishPath ? "page" : undefined}
          className={pathname === englishPath ? "active" : undefined}
          href={englishPath}
          onClick={() => handleLanguageSelect(pathname, SECONDARY_LOCALE)}
          role="menuitem"
        >
          English
        </a>
      </div>
    </details>
  );
}

function getLanguagePathsForPath(pathname: string, routeKey: I18nRouteKey | null): Record<SupportedLocale, string> | null {
  if (routeKey) {
    return {
      [DEFAULT_LOCALE]: getLocalizedPath(routeKey, DEFAULT_LOCALE),
      [SECONDARY_LOCALE]: getLocalizedPath(routeKey, SECONDARY_LOCALE)
    };
  }

  const normalizedPathname = normalizePathname(pathname);
  const englishMarketMatch = normalizedPathname.match(/^\/en\/markets\/([^/]+)$/u);
  if (englishMarketMatch?.[1]) {
    return {
      [DEFAULT_LOCALE]: `/markets/${englishMarketMatch[1]}`,
      [SECONDARY_LOCALE]: `/en/markets/${englishMarketMatch[1]}`
    };
  }

  const defaultMarketMatch = normalizedPathname.match(/^\/markets\/([^/]+)$/u);
  if (defaultMarketMatch?.[1]) {
    return {
      [DEFAULT_LOCALE]: `/markets/${defaultMarketMatch[1]}`,
      [SECONDARY_LOCALE]: `/en/markets/${defaultMarketMatch[1]}`
    };
  }

  return null;
}

function normalizePathname(pathname: string) {
  if (pathname === "/") return pathname;
  return pathname.replace(/\/+$/u, "");
}

function handleLanguageSelect(pathname: string, locale: SupportedLocale) {
  persistLocalePreference(locale);
  trackEvent("language_switcher_clicked", { from: pathname, locale });
}

function persistLocalePreference(locale: SupportedLocale) {
  const maxAge = 60 * 60 * 24 * 365;
  document.cookie = `${LOCALE_COOKIE_NAME}=${encodeURIComponent(locale)}; Path=/; Max-Age=${maxAge}; SameSite=Lax`;
}

function GlobeIcon() {
  return (
    <svg aria-hidden="true" className="site-language-icon" fill="none" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="8.25" />
      <path d="M3.75 12h16.5" />
      <path d="M12 3.75c2.15 2.2 3.22 4.95 3.22 8.25S14.15 18.05 12 20.25" />
      <path d="M12 3.75C9.85 5.95 8.78 8.7 8.78 12S9.85 18.05 12 20.25" />
    </svg>
  );
}
