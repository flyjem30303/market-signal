export type MarketId = "tw" | "sp500" | "nasdaq100" | "nikkei225" | "hang-seng" | "kospi" | "stoxx-europe-600";

export type MarketRouteStatus = "production-current" | "planned" | "private-lab";
export type MarketDataStatus = "production-current" | "mock-only" | "planned";
export type MarketSeoStatus = "indexable-current" | "held" | "private-noindex";
export type MarketPublicAvailability = "public-current" | "planned" | "private-only";

export type MarketRegistryEntry = {
  id: MarketId;
  label: string;
  nativeLabel: string;
  locale: string;
  currency: string;
  timezone: string;
  routeStatus: MarketRouteStatus;
  dataStatus: MarketDataStatus;
  seoStatus: MarketSeoStatus;
  publicAvailability: MarketPublicAvailability;
  canonicalMarketRoute: string;
  shortcutRoutes: string[];
  notes: string;
};

export const productionCurrentMarketId = "tw" as const;

export const plannedMarketIds = ["sp500", "nasdaq100", "nikkei225", "hang-seng", "kospi", "stoxx-europe-600"] as const satisfies readonly MarketId[];

export const marketRegistry = [
  {
    id: "tw",
    label: "Taiwan Weighted Index",
    nativeLabel: "台灣加權指數",
    locale: "zh-TW",
    currency: "TWD",
    timezone: "Asia/Taipei",
    routeStatus: "production-current",
    dataStatus: "production-current",
    seoStatus: "indexable-current",
    publicAvailability: "public-current",
    canonicalMarketRoute: "/markets/tw",
    shortcutRoutes: ["/stocks/[symbol]"],
    notes: "Current production market. /stocks/[symbol] remains the Taiwan shortcut until a later route migration gate."
  },
  {
    id: "sp500",
    label: "S&P 500",
    nativeLabel: "S&P 500",
    locale: "en-US",
    currency: "USD",
    timezone: "America/New_York",
    routeStatus: "private-lab",
    dataStatus: "mock-only",
    seoStatus: "private-noindex",
    publicAvailability: "private-only",
    canonicalMarketRoute: "/markets/sp500",
    shortcutRoutes: [],
    notes: "First non-Taiwan reference index uses /markets/sp500. Route remains private mock/noindex until vendor, source-rights, sitemap, and navigation gates pass."
  },
  {
    id: "nasdaq100",
    label: "NASDAQ 100",
    nativeLabel: "NASDAQ 100",
    locale: "en-US",
    currency: "USD",
    timezone: "America/New_York",
    routeStatus: "planned",
    dataStatus: "mock-only",
    seoStatus: "held",
    publicAvailability: "planned",
    canonicalMarketRoute: "/markets/nasdaq100",
    shortcutRoutes: [],
    notes: "Planned market-index route. Public route and data-source promotion remain gated."
  },
  {
    id: "nikkei225",
    label: "Nikkei 225",
    nativeLabel: "Nikkei 225",
    locale: "ja-JP",
    currency: "JPY",
    timezone: "Asia/Tokyo",
    routeStatus: "private-lab",
    dataStatus: "mock-only",
    seoStatus: "private-noindex",
    publicAvailability: "private-only",
    canonicalMarketRoute: "/markets/nikkei225",
    shortcutRoutes: [],
    notes: "Private mock reference index. Route remains private/noindex until vendor, source-rights, sitemap, and navigation gates pass."
  },
  {
    id: "hang-seng",
    label: "Hang Seng Index",
    nativeLabel: "Hang Seng Index",
    locale: "zh-HK",
    currency: "HKD",
    timezone: "Asia/Hong_Kong",
    routeStatus: "private-lab",
    dataStatus: "mock-only",
    seoStatus: "private-noindex",
    publicAvailability: "private-only",
    canonicalMarketRoute: "/markets/hang-seng",
    shortcutRoutes: [],
    notes: "Private mock reference index. Route remains private/noindex until vendor, source-rights, sitemap, and navigation gates pass."
  },
  {
    id: "kospi",
    label: "KOSPI",
    nativeLabel: "KOSPI",
    locale: "ko-KR",
    currency: "KRW",
    timezone: "Asia/Seoul",
    routeStatus: "planned",
    dataStatus: "mock-only",
    seoStatus: "held",
    publicAvailability: "planned",
    canonicalMarketRoute: "/markets/kospi",
    shortcutRoutes: [],
    notes: "Planned market-index route. Public route and data-source promotion remain gated."
  },
  {
    id: "stoxx-europe-600",
    label: "STOXX Europe 600",
    nativeLabel: "STOXX Europe 600",
    locale: "en-GB",
    currency: "EUR",
    timezone: "Europe/Brussels",
    routeStatus: "planned",
    dataStatus: "mock-only",
    seoStatus: "held",
    publicAvailability: "planned",
    canonicalMarketRoute: "/markets/stoxx-europe-600",
    shortcutRoutes: [],
    notes: "Planned market-index route. Public route and data-source promotion remain gated."
  }
] as const satisfies readonly MarketRegistryEntry[];

const marketIds = new Set<MarketId>(marketRegistry.map((market) => market.id));

export function isMarketId(value: string): value is MarketId {
  return marketIds.has(value as MarketId);
}

export function getMarketRegistry(): readonly MarketRegistryEntry[] {
  return marketRegistry;
}

export function getMarketById(id: MarketId): MarketRegistryEntry {
  return marketRegistry.find((market) => market.id === id) as MarketRegistryEntry;
}
