import { DEFAULT_LOCALE, SECONDARY_LOCALE, type SupportedLocale } from "@/lib/i18n/config";
import { getLocalizedPath, type I18nRouteKey } from "@/lib/i18n/routes";
import { absoluteUrl } from "@/lib/site";

export function buildI18nAlternates(routeKey: I18nRouteKey, canonicalLocale: SupportedLocale = DEFAULT_LOCALE) {
  return {
    canonical: getLocalizedPath(routeKey, canonicalLocale),
    languages: {
      [DEFAULT_LOCALE]: absoluteUrl(getLocalizedPath(routeKey, DEFAULT_LOCALE)),
      [SECONDARY_LOCALE]: absoluteUrl(getLocalizedPath(routeKey, SECONDARY_LOCALE)),
      "x-default": absoluteUrl(getLocalizedPath(routeKey, DEFAULT_LOCALE))
    } satisfies Record<SupportedLocale | "x-default", string>
  };
}
