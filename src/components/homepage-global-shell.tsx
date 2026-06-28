import { HomeSearchEntry as FunctionalHomeSearchEntry } from "@/components/home-search-entry";
import { DraggableScrollRail } from "@/components/draggable-scroll-rail";
import { TrackedLink } from "@/components/tracked-link";

type TaiwanMarketSummary = {
  compositeDelta: number | null;
  compositeScore: number;
  date: string;
  previousDate: string | null;
  riskDelta: number | null;
  riskScore: number;
  signalTitle: string;
  sourceLabel: string;
};

type HomepageTodaySummary = {
  globalComposite: number | null;
  globalCompositeStatus: "available" | "requires_two_or_more_production_markets";
  marketsDecreasingRisk: number;
  marketsIncreasingRisk: number;
  marketsUpdated: number;
  primaryAvailableMarket: TaiwanMarketSummary | null;
  productionMarketCount: number;
  scope: "global";
  topChange: TaiwanMarketSummary | null;
};

type HomepageGlobalShellProps = {
  locale?: "en" | "zh";
  todaySummary: HomepageTodaySummary;
};

const homepageCopy = {
  en: {
    heroAria: "Primary homepage paths",
    heroBody:
      "Use market signals to understand risk temperature first, then move into a single market or target detail. Taiwan is the only production-backed market today; other markets remain behind source and methodology gates.",
    heroMarketCta: "View markets",
    heroSearchCta: "Search targets",
    heroTitle: "Global Market Risk Compass",
    marketMapBody:
      "The homepage is the global overview and entry point. Open a market page for risk context, or a target page for a single index, ETF, or stock.",
    marketMapTitle: "Market Entry",
    nextMethodology: "How scores are formed",
    nextMethodologyTitle: "Methodology",
    nextMarkets: "Choose a market and inspect its risk context",
    nextMarketsTitle: "Market Entry",
    nextStocks: "Search indices, ETFs, or stocks",
    nextStocksTitle: "Target Observation",
    nextTitle: "What to read next",
    planned: "Planned",
    plannedBody: "Waiting for legal data source and methodology gates. Mock scores are not shown.",
    searchBody: "Enter ticker or name to jump to target observation.",
    searchCta: "Open target observation",
    searchDescription: "Use the homepage search to locate a target quickly.",
    searchTitle: "Quick target search",
    comingSoonBody: "Global Composite will activate only after two or more markets pass production data and methodology gates.",
    taiwanMarket: "Taiwan market",
    taiwanIndex: "Taiwan Weighted Index",
    production: "Production",
    marketDetail: "Market detail",
    targetPage: "Target page",
    updated: "Updated",
    composite: "Composite",
    risk: "Risk",
    summaryMarketsUpdated: "Production markets",
    summaryGlobalComposite: "Global Composite",
    summaryRiskChange: "Risk change",
    summaryRiskAccumulating: "Data accumulating",
    summaryRiskDown: "Risk decreased",
    summaryRiskFlat: "Risk unchanged",
    summaryRiskUp: "Risk increased",
    summaryNotEnabled: "Not enabled",
    todayChangeTitle: "Today's Market Summary",
    todayMetricsAria: "Global market summary"
  },
  zh: {
    heroAria: "首頁主要動線",
    heroBody:
      "先用市場燈號掌握風險溫度，再進入單一市場或標的細節。目前只有台灣市場使用正式資料，其他市場仍在資料來源與方法論 gate 內規劃。",
    heroMarketCta: "查看市場入口",
    heroSearchCta: "搜尋標的",
    heroTitle: "全球市場風險指南針",
    marketMapBody: "首頁只做市場總覽與入口選擇。進入市場頁看風險脈絡，進入標的頁看單一指數、ETF 或股票。",
    marketMapTitle: "市場入口",
    nextMethodology: "理解分數如何形成",
    nextMethodologyTitle: "方法說明",
    nextMarkets: "選擇市場，再看市場風險脈絡",
    nextMarketsTitle: "市場入口",
    nextStocks: "搜尋指數、ETF 或股票",
    nextStocksTitle: "標的觀察",
    nextTitle: "接下來可以看什麼",
    planned: "規劃中",
    plannedBody: "等待合法資料來源與方法論 gate，不顯示 mock 分數。",
    searchBody: "輸入代號或名稱，快速前往標的觀察頁。",
    searchDescription: "首頁搜尋只用來快速找到標的。",
    searchTitle: "快速搜尋標的",
    comingSoonBody: "當兩個以上市場完成正式資料與方法論 gate 後，才會啟用全球綜合分數。",
    taiwanMarket: "台灣市場",
    taiwanIndex: "台灣加權指數",
    production: "正式",
    marketDetail: "市場詳情",
    targetPage: "標的頁",
    updated: "更新",
    composite: "綜合",
    risk: "風險",
    summaryMarketsUpdated: "正式市場",
    summaryGlobalComposite: "全球綜合",
    summaryRiskChange: "風險變化",
    summaryRiskAccumulating: "資料累積中",
    summaryRiskDown: "風險下降",
    summaryRiskFlat: "風險持平",
    summaryRiskUp: "風險上升",
    summaryNotEnabled: "尚未啟用",
    todayChangeTitle: "今日市場摘要",
    todayMetricsAria: "全球市場摘要"
  }
} as const;

const marketTabs = {
  en: ["US", "Europe", "Asia", "Latin America", "Currencies", "Crypto", "Futures"],
  zh: ["美國", "歐洲", "亞洲", "拉丁美洲", "貨幣", "加密貨幣", "期貨"]
} as const;

const plannedIndexCards = [
  { indexName: "S&P 500", marketName: { en: "US market", zh: "美國市場" }, route: "/markets/sp500" },
  { indexName: "日經平均指數", marketName: { en: "Japan market", zh: "日本市場" }, route: "/markets/nikkei225" },
  { indexName: "恒生指數", marketName: { en: "Hong Kong market", zh: "香港市場" }, route: "/markets/hang-seng" },
  { indexName: "NASDAQ 100", marketName: { en: "US market", zh: "美國市場" }, route: "/markets/nasdaq100" },
  { indexName: "KOSPI", marketName: { en: "Korea market", zh: "韓國市場" }, route: "/markets/kospi" }
] as const;

export function HomepageGlobalShell({ locale = "zh", todaySummary }: HomepageGlobalShellProps) {
  const copy = homepageCopy[locale];
  const homePrefix = locale === "en" ? "/en" : "";
  const taiwan = todaySummary.primaryAvailableMarket;
  const signalTitle = taiwan ? (locale === "en" ? translateSignalTitle(taiwan.signalTitle) : taiwan.signalTitle) : copy.summaryNotEnabled;

  return (
    <main className="page-shell homepage-global-shell">
      <section className="global-home-hero" aria-labelledby="global-home-title">
        <div className="global-home-hero__copy">
          <p className="eyebrow">Global Market Signal</p>
          <h1 id="global-home-title">{copy.heroTitle}</h1>
          <p>{copy.heroBody}</p>
          <div className="hero-cta-row" aria-label={copy.heroAria}>
            <TrackedLink eventName="home_cta_clicked" href={`${homePrefix}/markets`} label={copy.heroMarketCta} payload={{ area: "hero" }}>
              {copy.heroMarketCta}
            </TrackedLink>
            <TrackedLink eventName="home_cta_clicked" href={`${homePrefix}/stocks`} label={copy.heroSearchCta} payload={{ area: "hero" }}>
              {copy.heroSearchCta}
            </TrackedLink>
          </div>
        </div>

        <aside className="global-composite-hold" aria-label="Global Composite status">
          <span>Global Composite</span>
          <strong>Coming Soon</strong>
          <p>{copy.comingSoonBody}</p>
        </aside>
      </section>

      <section className="global-daily-change" aria-labelledby="global-daily-change-title">
        <div>
          <p className="eyebrow">Global Market Summary</p>
          <h2 id="global-daily-change-title">{copy.todayChangeTitle}</h2>
          <p>{buildTodaySummaryLine(todaySummary, locale)}</p>
        </div>
        <div className="global-daily-change__metrics" aria-label={copy.todayMetricsAria}>
          <article>
            <span>{copy.summaryMarketsUpdated}</span>
            <strong>{todaySummary.productionMarketCount}</strong>
            <p>{taiwan ? `${copy.taiwanMarket}: ${signalTitle}` : copy.summaryNotEnabled}</p>
          </article>
          <article>
            <span>{copy.summaryGlobalComposite}</span>
            <strong>{formatGlobalComposite(todaySummary, locale)}</strong>
            <p>{describeGlobalCompositeGate(todaySummary, locale)}</p>
          </article>
          <article>
            <span>{copy.summaryRiskChange}</span>
            <strong>{formatRiskMarketCount(todaySummary, locale)}</strong>
            <p>{describeSummaryRiskChange(todaySummary, locale)}</p>
          </article>
        </div>
      </section>

      <section id="market-map" className="global-market-map global-market-map--featured" aria-labelledby="market-map-title">
        <div className="section-heading-row">
          <div>
            <p className="eyebrow">Featured Markets</p>
            <h2 id="market-map-title">{copy.marketMapTitle}</h2>
          </div>
          <p>{copy.marketMapBody}</p>
        </div>

        <DraggableScrollRail
          aria-label={locale === "en" ? "Featured market entries" : "Featured market entries"}
          className="global-market-entry-grid global-market-entry-grid--featured"
        >
          <article className="global-market-entry-card global-market-entry-card--live">
            <div className="global-market-entry-card__top">
              <strong>{copy.taiwanIndex}</strong>
              <b>{copy.production}</b>
            </div>
            <span>{copy.taiwanMarket}</span>
            <p>{taiwan ? `${copy.updated} ${taiwan.date} · ${signalTitle}` : copy.summaryNotEnabled}</p>
            <div className="global-market-card__actions">
              <TrackedLink
                eventName="home_cta_clicked"
                href="/markets/tw"
                label={copy.marketDetail}
                payload={{ area: "global-home-index-card", market: "tw", target: "market" }}
              >
                {copy.marketDetail}
              </TrackedLink>
            </div>
          </article>

          {plannedIndexCards.slice(0, 3).map((card) => (
            <article className="global-market-entry-card global-market-entry-card--planned" key={card.indexName}>
              <div className="global-market-entry-card__top">
                <strong title={card.indexName}>{card.indexName}</strong>
                <b>{copy.planned}</b>
              </div>
              <span>{card.marketName[locale]}</span>
              <p>{copy.plannedBody}</p>
              <div className="global-market-card__actions global-market-card__actions--disabled">
                <span>{copy.marketDetail}</span>
              </div>
            </article>
          ))}
        </DraggableScrollRail>
        <div className="global-market-map__footer">
          <TrackedLink eventName="home_cta_clicked" href={`${homePrefix}/markets`} label={copy.heroMarketCta} payload={{ area: "featured-markets" }}>
            {copy.heroMarketCta}
          </TrackedLink>
        </div>
      </section>

      <section id="tw-search" className="global-home-search" aria-labelledby="tw-search-title">
        <div className="section-heading-row">
          <div>
            <h2 id="tw-search-title">{copy.searchTitle}</h2>
          </div>
          <div className="global-home-search__intro">
            <p>{copy.searchBody}</p>
            <TrackedLink
              eventName="home_cta_clicked"
              href={`${homePrefix}/stocks`}
              label={locale === "en" ? "Open target observation" : "前往標的觀察"}
              payload={{ area: "home-search-heading" }}
            >
              {locale === "en" ? "Open target observation" : "前往標的觀察"}
            </TrackedLink>
          </div>
        </div>
        <FunctionalHomeSearchEntry homePrefix={homePrefix} locale={locale} />
      </section>

      <section className="global-home-next" aria-labelledby="global-home-next-title">
        <p className="eyebrow">Next Reading</p>
        <h2 id="global-home-next-title">{copy.nextTitle}</h2>
        <div className="global-home-next__grid">
          <TrackedLink eventName="home_cta_clicked" href={`${homePrefix}/markets`} label={copy.nextMarketsTitle} payload={{ area: "global-home-next" }}>
            <span>{copy.nextMarketsTitle}</span>
            <strong>{copy.nextMarkets}</strong>
          </TrackedLink>
          <TrackedLink eventName="home_cta_clicked" href={`${homePrefix}/stocks`} label={copy.nextStocksTitle} payload={{ area: "global-home-next" }}>
            <span>{copy.nextStocksTitle}</span>
            <strong>{copy.nextStocks}</strong>
          </TrackedLink>
          <TrackedLink eventName="home_cta_clicked" href={`${homePrefix}/methodology`} label={copy.nextMethodologyTitle} payload={{ area: "global-home-next" }}>
            <span>{copy.nextMethodologyTitle}</span>
            <strong>{copy.nextMethodology}</strong>
          </TrackedLink>
        </div>
      </section>
    </main>
  );
}


function buildTodaySummaryLine(summary: HomepageTodaySummary, locale: "en" | "zh") {
  if (summary.productionMarketCount === 0) {
    return locale === "en"
      ? "No market has passed the production data gate yet. Global Composite remains disabled."
      : "目前尚無市場通過正式資料 gate，全球綜合分數尚未啟用。";
  }

  if (summary.productionMarketCount === 1 && summary.primaryAvailableMarket) {
    return locale === "en"
      ? "Only Taiwan has passed the production data gate. Global Composite will activate after at least two production markets are available."
      : "目前只有台灣市場通過正式資料 gate。全球綜合分數將在至少 2 個正式市場上線後啟用。";
  }

  return locale === "en"
    ? `${summary.productionMarketCount} production markets are available. Global summary uses production markets only.`
    : `目前已有 ${summary.productionMarketCount} 個正式市場資料，全球摘要只使用正式市場。`;
}

function formatGlobalComposite(summary: HomepageTodaySummary, locale: "en" | "zh") {
  if (summary.globalCompositeStatus !== "available" || summary.globalComposite === null) {
    return locale === "en" ? "Not enabled" : "尚未啟用";
  }
  return String(summary.globalComposite);
}

function describeGlobalCompositeGate(summary: HomepageTodaySummary, locale: "en" | "zh") {
  if (summary.globalCompositeStatus === "available") {
    return locale === "en" ? "Production markets only" : "僅納入正式市場";
  }
  return locale === "en" ? "Requires at least 2 production markets" : "需至少 2 個正式市場";
}

function formatRiskMarketCount(summary: HomepageTodaySummary, locale: "en" | "zh") {
  const changedMarkets = summary.marketsIncreasingRisk + summary.marketsDecreasingRisk;
  if (changedMarkets === 0) return locale === "en" ? "Accumulating" : "累積中";
  if (summary.marketsIncreasingRisk > summary.marketsDecreasingRisk) {
    return locale === "en" ? `${summary.marketsIncreasingRisk} up` : `${summary.marketsIncreasingRisk} 個上升`;
  }
  if (summary.marketsDecreasingRisk > summary.marketsIncreasingRisk) {
    return locale === "en" ? `${summary.marketsDecreasingRisk} down` : `${summary.marketsDecreasingRisk} 個下降`;
  }
  return locale === "en" ? "Mixed" : "分歧";
}

function describeSummaryRiskChange(summary: HomepageTodaySummary, locale: "en" | "zh") {
  const changedMarkets = summary.marketsIncreasingRisk + summary.marketsDecreasingRisk;
  if (changedMarkets === 0) {
    return locale === "en" ? "No market-level comparison yet" : "尚未形成市場比較";
  }
  return locale === "en"
    ? `${summary.marketsIncreasingRisk} increasing, ${summary.marketsDecreasingRisk} decreasing`
    : `${summary.marketsIncreasingRisk} 個上升，${summary.marketsDecreasingRisk} 個下降`;
}

function translateSignalTitle(signalTitle: string) {
  if (signalTitle.includes("轉弱")) return "Weakening";
  if (signalTitle.includes("偏多")) return "Constructive";
  if (signalTitle.includes("警戒")) return "Caution";
  if (signalTitle.includes("高風險")) return "High risk";
  if (signalTitle.includes("觀望")) return "Watch";
  return "Watch";
}
