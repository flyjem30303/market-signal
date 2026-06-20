export type GlobalIndexLegalUsageStatus = "conditional" | "rejected" | "unresolved";

export type GlobalIndexSourceRegistryEntry = {
  symbol: string;
  displayName: string;
  country: string;
  market: string;
  source: string;
  sourceUrl: string;
  updateFrequency: "daily-after-close";
  legalUsageStatus: GlobalIndexLegalUsageStatus;
  sourceDecisionOwner: "CEO/PM" | "Legal" | "A2";
  nextDecisionNeeded: string;
};

export const globalIndexSourceRegistryStatus =
  "phase_2a_global_index_source_registry_report_only" as const;

export const globalIndexSourceRegistry: GlobalIndexSourceRegistryEntry[] = [
  {
    symbol: "SP500",
    displayName: "S&P 500",
    country: "US",
    market: "INDEX_US",
    source: "FRED candidate route",
    sourceUrl: "https://fred.stlouisfed.org/series/SP500",
    updateFrequency: "daily-after-close",
    legalUsageStatus: "conditional",
    sourceDecisionOwner: "CEO/PM",
    nextDecisionNeeded: "Confirm FRED and index-owner rights for storage, derived changes, attribution, and public display."
  },
  {
    symbol: "NASDAQCOM",
    displayName: "NASDAQ Composite",
    country: "US",
    market: "INDEX_US",
    source: "FRED candidate route",
    sourceUrl: "https://fred.stlouisfed.org/series/NASDAQCOM",
    updateFrequency: "daily-after-close",
    legalUsageStatus: "conditional",
    sourceDecisionOwner: "CEO/PM",
    nextDecisionNeeded: "Confirm FRED and index-owner rights for storage, derived changes, attribution, and public display."
  },
  {
    symbol: "DJIA",
    displayName: "Dow Jones Industrial Average",
    country: "US",
    market: "INDEX_US",
    source: "FRED candidate route",
    sourceUrl: "https://fred.stlouisfed.org/series/DJIA",
    updateFrequency: "daily-after-close",
    legalUsageStatus: "conditional",
    sourceDecisionOwner: "CEO/PM",
    nextDecisionNeeded: "Confirm FRED and index-owner rights for storage, derived changes, attribution, and public display."
  },
  {
    symbol: "NIKKEI225",
    displayName: "Nikkei 225",
    country: "JP",
    market: "INDEX_JP",
    source: "FRED candidate route",
    sourceUrl: "https://fred.stlouisfed.org/series/NIKKEI225",
    updateFrequency: "daily-after-close",
    legalUsageStatus: "conditional",
    sourceDecisionOwner: "CEO/PM",
    nextDecisionNeeded: "Confirm FRED and Nikkei rights for storage, derived changes, attribution, and public display."
  },
  {
    symbol: "KOSPI",
    displayName: "KOSPI",
    country: "KR",
    market: "INDEX_KR",
    source: "KRX official data services candidate route",
    sourceUrl: "https://data.krx.co.kr/contents/MDC/MAIN/main/index.cmd?locale=en",
    updateFrequency: "daily-after-close",
    legalUsageStatus: "unresolved",
    sourceDecisionOwner: "Legal",
    nextDecisionNeeded: "Review KRX API/account terms for automation, storage, attribution, and redistribution."
  },
  {
    symbol: "HSI",
    displayName: "Hang Seng Index",
    country: "HK",
    market: "INDEX_HK",
    source: "HKEX / Hang Seng licensed data route",
    sourceUrl: "https://www.hkex.com.hk/Services/Market-Data-Services/Real-Time-Data-Services/Data-Licensing/HKEX-IS?sc_lang=en",
    updateFrequency: "daily-after-close",
    legalUsageStatus: "rejected",
    sourceDecisionOwner: "CEO/PM",
    nextDecisionNeeded: "Choose licensed vendor route or defer Hong Kong index coverage."
  },
  {
    symbol: "SXXP",
    displayName: "STOXX Europe 600",
    country: "EU",
    market: "INDEX_EU",
    source: "STOXX licensed data route",
    sourceUrl: "https://www.stoxx.com/license-agreement-form",
    updateFrequency: "daily-after-close",
    legalUsageStatus: "rejected",
    sourceDecisionOwner: "CEO/PM",
    nextDecisionNeeded: "Choose licensed vendor route or defer Europe index coverage."
  },
  {
    symbol: "DAX",
    displayName: "DAX",
    country: "DE",
    market: "INDEX_DE",
    source: "STOXX / Deutsche Boerse licensed data route",
    sourceUrl: "https://stoxx.com/legal/stoxx-conditions-of-use/",
    updateFrequency: "daily-after-close",
    legalUsageStatus: "rejected",
    sourceDecisionOwner: "CEO/PM",
    nextDecisionNeeded: "Choose licensed vendor route or defer Germany index coverage."
  },
  {
    symbol: "SSECOMP",
    displayName: "SSE Composite Index",
    country: "CN",
    market: "INDEX_CN",
    source: "Shanghai Stock Exchange official data services candidate route",
    sourceUrl: "https://english.sse.com.cn/markets/dataservice/products/",
    updateFrequency: "daily-after-close",
    legalUsageStatus: "unresolved",
    sourceDecisionOwner: "Legal",
    nextDecisionNeeded: "Review official license/vendor path for automation, storage, attribution, and redistribution."
  },
  {
    symbol: "CSI300",
    displayName: "CSI 300",
    country: "CN",
    market: "INDEX_CN",
    source: "China Securities Index / SSE data services candidate route",
    sourceUrl: "https://english.sse.com.cn/markets/dataservice/products/",
    updateFrequency: "daily-after-close",
    legalUsageStatus: "unresolved",
    sourceDecisionOwner: "Legal",
    nextDecisionNeeded: "Review official license/vendor path for automation, storage, attribution, and redistribution."
  }
];

export function getGlobalIndexSourceRegistry() {
  return globalIndexSourceRegistry;
}
