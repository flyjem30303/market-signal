export const DEFAULT_LOCALE = "zh-Hant-TW";
export const SECONDARY_LOCALE = "en";
export const LOCALE_COOKIE_NAME = "market_signal_locale";

export const SUPPORTED_LOCALES = [DEFAULT_LOCALE, SECONDARY_LOCALE] as const;

export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];

export function isSupportedLocale(locale: string): locale is SupportedLocale {
  return SUPPORTED_LOCALES.includes(locale as SupportedLocale);
}
