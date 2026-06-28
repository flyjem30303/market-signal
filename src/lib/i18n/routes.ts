import { DEFAULT_LOCALE, SECONDARY_LOCALE, type SupportedLocale } from "@/lib/i18n/config";

export const I18N_ROUTE_KEYS = [
  "home",
  "markets",
  "stocks",
  "weekly",
  "methodology",
  "disclaimer",
  "terms",
  "privacy"
] as const;

export type I18nRouteKey = (typeof I18N_ROUTE_KEYS)[number];

export const I18N_ROUTES: Record<I18nRouteKey, Record<SupportedLocale, string>> = {
  disclaimer: {
    [DEFAULT_LOCALE]: "/disclaimer",
    [SECONDARY_LOCALE]: "/en/disclaimer"
  },
  home: {
    [DEFAULT_LOCALE]: "/",
    [SECONDARY_LOCALE]: "/en"
  },
  markets: {
    [DEFAULT_LOCALE]: "/markets",
    [SECONDARY_LOCALE]: "/en/markets"
  },
  methodology: {
    [DEFAULT_LOCALE]: "/methodology",
    [SECONDARY_LOCALE]: "/en/methodology"
  },
  privacy: {
    [DEFAULT_LOCALE]: "/privacy",
    [SECONDARY_LOCALE]: "/en/privacy"
  },
  terms: {
    [DEFAULT_LOCALE]: "/terms",
    [SECONDARY_LOCALE]: "/en/terms"
  },
  stocks: {
    [DEFAULT_LOCALE]: "/stocks",
    [SECONDARY_LOCALE]: "/en/stocks"
  },
  weekly: {
    [DEFAULT_LOCALE]: "/weekly",
    [SECONDARY_LOCALE]: "/en/weekly"
  }
};

export function getLocalizedPath(routeKey: I18nRouteKey, locale: SupportedLocale) {
  return I18N_ROUTES[routeKey][locale];
}

export function getI18nRouteKeyForPath(pathname: string): I18nRouteKey | null {
  const normalizedPath = normalizePathname(pathname);

  for (const routeKey of I18N_ROUTE_KEYS) {
    const paths = I18N_ROUTES[routeKey];
    if (Object.values(paths).some((path) => normalizePathname(path) === normalizedPath)) {
      return routeKey;
    }
  }

  return null;
}

function normalizePathname(pathname: string) {
  if (pathname === "/") return pathname;
  return pathname.replace(/\/+$/u, "");
}
