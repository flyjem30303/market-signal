"use client";

import { useEffect, useMemo, useRef, useState, type PointerEvent } from "react";
import { TrackedLink } from "@/components/tracked-link";
import type { MarketWatchlistItem } from "@/lib/market-watchlist-search";
import {
  maxWatchlistItems,
  readWatchlist,
  watchlistChangedEvent,
  writeWatchlist
} from "@/lib/watchlist-storage";

type ResultSort = {
  direction: "asc" | "desc";
  key: "compositeScore" | "riskScore";
};

type MarketWatchlistPanelVariant = "default" | "compact-stock";
type MarketWatchlistPanelLocale = "en" | "zh";

const watchlistCopy = {
  en: {
    add: "Track",
    addAria: "Track",
    added: "Added to watchlist.",
    alreadyTracked: "Already tracked.",
    collapse: "Collapse",
    composite: "Score",
    compositeScore: "Composite score",
    defaultDescription: "Track up to 5 targets. Strength and risk rankings prioritize your watchlist first.",
    defaultEyebrow: "Tracked targets",
    defaultHeading: "Search targets and build a watchlist",
    emptyFavorites: "No tracked targets yet. Try 2330, 0050, or TWII.",
    expand: "Expand",
    favoriteLabel: "Tracked targets",
    favoriteList: "Watchlist",
    fetchFailed: "The search list could not fully load. Showing current targets first.",
    full: "Track up to 5 targets. Remove one before adding another.",
    leftResults: "Scroll search results left",
    remove: "Remove",
    removed: "Removed from watchlist.",
    resultControls: "Search result scroll controls",
    results: "Search results",
    risk: "Risk",
    riskScore: "Risk score",
    rightResults: "Scroll search results right",
    scoreSummary: "score summary",
    searchAria: "Search and tracked targets",
    searchField: "Search ticker or name",
    searchPlaceholder: "For example 2330, 0050, or TSMC",
    sortBy: "Sort by",
    sortHighToLow: "high to low",
    sortLowToHigh: "low to high",
    sortResults: "Sort search results",
    strongDescriptionTracked: "Ranked by your watchlist. Start with targets that currently have stronger scores.",
    strongDescriptionDefault: "No watchlist yet. Showing common targets first.",
    strongTitleTracked: "Tracked strength ranking",
    strongTitleDefault: "Market strength ranking",
    tracked: "Tracked",
    trackingCount: "Currently tracking",
    untrackedTitle: "Common targets",
    view: "View",
    viewAria: "View",
    weakDescriptionTracked: "Ranked by your watchlist. Find targets that may need closer risk attention.",
    weakDescriptionDefault: "No watchlist yet. Showing common targets first.",
    weakTitleTracked: "Tracked risk ranking",
    weakTitleDefault: "Market risk ranking"
  },
  zh: {
    add: "加入追蹤",
    addAria: "加入追蹤",
    added: "已加入追蹤。",
    alreadyTracked: "已在追蹤清單中。",
    collapse: "收合",
    composite: "綜合",
    compositeScore: "綜合分數",
    defaultDescription: "最多追蹤 5 檔；強勢與風險排行會優先依追蹤清單排序。",
    defaultEyebrow: "追蹤標的",
    defaultHeading: "搜尋股票，建立觀察清單",
    emptyFavorites: "尚未加入追蹤。你可以先搜尋 2330、0050 或 TWII。",
    expand: "展開",
    favoriteLabel: "已追蹤標的",
    favoriteList: "追蹤清單",
    fetchFailed: "搜尋清單暫時無法完整載入，先顯示目前標的。",
    full: "最多追蹤 5 個標的，請先移除一個。",
    leftResults: "向左切換搜尋結果",
    remove: "移除",
    removed: "已移除追蹤。",
    resultControls: "搜尋結果左右切換",
    results: "搜尋結果",
    risk: "風險",
    riskScore: "風險分數",
    rightResults: "向右切換搜尋結果",
    scoreSummary: "分數摘要",
    searchAria: "搜尋與追蹤標的",
    searchField: "搜尋股票代號或名稱",
    searchPlaceholder: "例如 2330、0050 或台積電",
    sortBy: "依",
    sortHighToLow: "高到低",
    sortLowToHigh: "低到高",
    sortResults: "搜尋結果排序",
    strongDescriptionTracked: "依追蹤清單排序，先看目前分數較強的標的。",
    strongDescriptionDefault: "尚未建立追蹤清單，先顯示常用標的。",
    strongTitleTracked: "追蹤強勢排行",
    strongTitleDefault: "市場強勢排行",
    tracked: "已追蹤",
    trackingCount: "目前追蹤",
    untrackedTitle: "常用觀察標的",
    view: "查看",
    viewAria: "查看",
    weakDescriptionTracked: "依追蹤清單排序，找出需要優先留意波動的標的。",
    weakDescriptionDefault: "尚未建立追蹤清單，先顯示常用標的。",
    weakTitleTracked: "追蹤風險排行",
    weakTitleDefault: "市場風險排行"
  }
} satisfies Record<MarketWatchlistPanelLocale, Record<string, string>>;

export function MarketWatchlistPanel({
  description,
  eyebrow,
  heading,
  items,
  loadItemsEndpoint,
  locale = "zh",
  variant = "compact-stock"
}: {
  description?: string;
  eyebrow?: string;
  heading?: string;
  items: MarketWatchlistItem[];
  loadItemsEndpoint?: string;
  locale?: MarketWatchlistPanelLocale;
  variant?: MarketWatchlistPanelVariant;
}) {
  const copy = watchlistCopy[locale];
  const panelDescription = description ?? copy.defaultDescription;
  const panelEyebrow = eyebrow ?? copy.defaultEyebrow;
  const panelHeading = heading ?? copy.defaultHeading;
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isDraggingResults, setIsDraggingResults] = useState(false);
  const [loadedItems, setLoadedItems] = useState(items);
  const [query, setQuery] = useState("");
  const [message, setMessage] = useState("");
  const [rankingCollapsed, setRankingCollapsed] = useState(variant === "compact-stock");
  const [resultSort, setResultSort] = useState<ResultSort>({ direction: "desc", key: "compositeScore" });
  const resultsRef = useRef<HTMLDivElement>(null);
  const isDraggingResultsRef = useRef(false);
  const dragRef = useRef({ left: 0, startX: 0 });

  useEffect(() => {
    setLoadedItems(items);
  }, [items]);

  useEffect(() => {
    if (!loadItemsEndpoint) return;
    let isActive = true;

    fetch(loadItemsEndpoint)
      .then((response) => (response.ok ? response.json() : Promise.reject(new Error("watchlist_items_fetch_failed"))))
      .then((payload: { items?: MarketWatchlistItem[] }) => {
        if (isActive && Array.isArray(payload.items) && payload.items.length > 0) setLoadedItems(payload.items);
      })
      .catch(() => {
        if (isActive) setMessage(copy.fetchFailed);
      });

    return () => {
      isActive = false;
    };
  }, [loadItemsEndpoint]);

  const panelItems = loadedItems;
  const bySymbol = useMemo(() => new Map(panelItems.map((item) => [item.asset.symbol, item])), [panelItems]);

  useEffect(() => {
    setFavorites(readWatchlist(new Set(bySymbol.keys())));

    function handleWatchlistChanged() {
      setFavorites(readWatchlist(new Set(bySymbol.keys())));
    }

    window.addEventListener(watchlistChangedEvent, handleWatchlistChanged);
    window.addEventListener("storage", handleWatchlistChanged);

    return () => {
      window.removeEventListener(watchlistChangedEvent, handleWatchlistChanged);
      window.removeEventListener("storage", handleWatchlistChanged);
    };
  }, [bySymbol]);

  const favoriteSnapshots = favorites.map((symbol) => bySymbol.get(symbol)).filter((item): item is MarketWatchlistItem => Boolean(item));
  const base = favoriteSnapshots.length ? favoriteSnapshots : panelItems;
  const searchResults = sortItems(filterItems(panelItems, query), resultSort);
  const strongList = rankBy(base, "compositeScore");
  const riskList = rankBy(base, "riskScore");
  const hasFavorites = favoriteSnapshots.length > 0;
  const isCompactStock = variant === "compact-stock";

  function toggleResultSort(key: ResultSort["key"]) {
    setResultSort((current) => ({
      key,
      direction: current.key === key && current.direction === "desc" ? "asc" : "desc"
    }));
    resultsRef.current?.scrollTo({ behavior: "smooth", left: 0 });
  }

  function getSortIcon(key: ResultSort["key"]) {
    if (resultSort.key !== key) return "⇅";
    return resultSort.direction === "desc" ? "↓" : "↑";
  }

  function getSortLabel(key: ResultSort["key"], label: string) {
    if (resultSort.key !== key) return locale === "en" ? `${copy.sortBy} ${label}` : `${copy.sortBy}${label}排序`;
    return locale === "en" ? `${label} ${copy[`sort${resultSort.direction === "desc" ? "HighToLow" : "LowToHigh"}`]}` : `${label}${copy[`sort${resultSort.direction === "desc" ? "HighToLow" : "LowToHigh"}`]}`;
  }

  function addFavorite(symbol: string) {
    if (favorites.includes(symbol)) {
      setMessage(copy.alreadyTracked);
      return;
    }
    if (favorites.length >= maxWatchlistItems) {
      setMessage(copy.full);
      return;
    }
    setFavorites(writeWatchlist([...favorites, symbol], symbol));
    setMessage(copy.added);
  }

  function removeFavorite(symbol: string) {
    setFavorites(writeWatchlist(favorites.filter((item) => item !== symbol), symbol));
    setMessage(copy.removed);
  }

  function scrollResults(direction: -1 | 1) {
    const container = resultsRef.current;
    if (!container) return;
    const card = container.querySelector<HTMLElement>(".watchlist-result-row");
    const cardWidth = card?.getBoundingClientRect().width ?? 260;
    container.scrollBy({ left: direction * (cardWidth * 2 + 24), behavior: "smooth" });
  }

  function startDragResults(event: PointerEvent<HTMLDivElement>) {
    const target = event.target as HTMLElement;
    if (target.closest("a, button")) return;
    const container = resultsRef.current;
    if (!container) return;
    dragRef.current = { left: container.scrollLeft, startX: event.clientX };
    isDraggingResultsRef.current = true;
    setIsDraggingResults(true);
    container.setPointerCapture(event.pointerId);
  }

  function dragResults(event: PointerEvent<HTMLDivElement>) {
    const container = resultsRef.current;
    if (!container || !isDraggingResultsRef.current) return;
    const distance = event.clientX - dragRef.current.startX;
    container.scrollLeft = dragRef.current.left - distance;
  }

  function stopDragResults(event: PointerEvent<HTMLDivElement>) {
    const container = resultsRef.current;
    if (!container) return;
    if (container.hasPointerCapture(event.pointerId)) container.releasePointerCapture(event.pointerId);
    isDraggingResultsRef.current = false;
    setIsDraggingResults(false);
  }

  return (
    <section className={`market-watchlist-panel market-watchlist-panel--${variant}`} aria-label={copy.searchAria}>
      <div className="watchlist-search-card">
        <label className="watchlist-search-field">
          <span>{copy.searchField}</span>
          {isCompactStock && (
            <span className="watchlist-count" aria-label={`${copy.trackingCount} ${favorites.length}, max ${maxWatchlistItems}`}>
              {favorites.length}/{maxWatchlistItems}
            </span>
          )}
          <input
            aria-label={copy.searchField}
            onChange={(event) => {
              setQuery(event.target.value);
              setMessage("");
            }}
            placeholder={copy.searchPlaceholder}
            type="search"
            value={query}
          />
        </label>

        <div className="watchlist-search-copy">
          {!isCompactStock && <p className="eyebrow">{panelEyebrow}</p>}
          <h2>{panelHeading}</h2>
          <p>{panelDescription}</p>
        </div>

        <div className="watchlist-tracking-box" aria-live="polite">
          <div className="watchlist-tracking-box__header">
            {(message || !isCompactStock) && <strong>{message || copy.favoriteList}</strong>}
            {!isCompactStock && <span>{favorites.length}/{maxWatchlistItems}</span>}
          </div>
          <div className="favorite-row watchlist-favorites" aria-label={copy.favoriteLabel}>
            {hasFavorites ? (
              favoriteSnapshots.map((snapshot) => (
                <span className="favorite-chip" key={snapshot.asset.symbol}>
                  <StockLink area="watchlist_favorite" snapshot={snapshot} />
                  <button onClick={() => removeFavorite(snapshot.asset.symbol)} type="button">
                    {copy.remove}
                  </button>
                </span>
              ))
            ) : (
              <span className="muted-chip">{copy.emptyFavorites}</span>
            )}
          </div>
        </div>
      </div>

      <div className="watchlist-results-shell" aria-label={copy.results}>
        <div className="watchlist-results-header">
          {!isCompactStock && <span>{query ? copy.results : copy.untrackedTitle}</span>}
          <div className="watchlist-results-toolbar">
            <div className="watchlist-sort-controls" aria-label={copy.sortResults}>
              <button
                aria-label={getSortLabel("compositeScore", copy.compositeScore)}
                aria-pressed={resultSort.key === "compositeScore"}
                onClick={() => toggleResultSort("compositeScore")}
                title={getSortLabel("compositeScore", copy.compositeScore)}
                type="button"
              >
                <span aria-hidden="true">{getSortIcon("compositeScore")}</span>
              </button>
              <button
                aria-label={getSortLabel("riskScore", copy.riskScore)}
                aria-pressed={resultSort.key === "riskScore"}
                onClick={() => toggleResultSort("riskScore")}
                title={getSortLabel("riskScore", copy.riskScore)}
                type="button"
              >
                <span aria-hidden="true">{getSortIcon("riskScore")}</span>
              </button>
            </div>
          </div>
        </div>

        <div className="watchlist-results-controls" aria-label={copy.resultControls}>
          <button className="watchlist-scroll-button watchlist-scroll-button--prev" aria-label={copy.leftResults} onClick={() => scrollResults(-1)} type="button">
            <span aria-hidden="true" />
          </button>
          <button className="watchlist-scroll-button watchlist-scroll-button--next" aria-label={copy.rightResults} onClick={() => scrollResults(1)} type="button">
            <span aria-hidden="true" />
          </button>
        </div>

        <div
          className={`watchlist-search-results${isDraggingResults ? " is-dragging" : ""}`}
          onPointerCancel={stopDragResults}
          onPointerDown={startDragResults}
          onPointerLeave={stopDragResults}
          onPointerMove={dragResults}
          onPointerUp={stopDragResults}
          ref={resultsRef}
          tabIndex={0}
        >
          {searchResults.map((snapshot) => {
            const isFavorite = favorites.includes(snapshot.asset.symbol);
            const isFull = favorites.length >= maxWatchlistItems && !isFavorite;
            const quoteTone = snapshot.quote ? getQuoteTone(snapshot.quote.changePercent) : null;

            return (
              <article className="watchlist-result-row" key={snapshot.asset.symbol}>
                <div className="watchlist-result-main">
                  <strong>{snapshot.asset.symbol}</strong>
                  <span className="watchlist-asset-name" title={snapshot.asset.name}>
                    {snapshot.asset.name}
                  </span>
                  <div className="watchlist-card-market-foot">
                    <small>{formatSignalTitle(snapshot.signal.title, locale)}</small>
                    {snapshot.quote && (
                      <div className={`watchlist-quote-mini ${quoteTone}`}>
                        <b>{formatQuoteClose(snapshot.quote.close)}</b>
                        <em>{formatQuotePercent(snapshot.quote.changePercent)}</em>
                      </div>
                    )}
                  </div>
                </div>
                <div className="watchlist-result-side">
                  <div className="watchlist-score-strip" aria-label={`${snapshot.asset.symbol} ${copy.scoreSummary}`}>
                    <span className={resultSort.key === "compositeScore" ? "is-active" : undefined}>
                      {copy.composite} {snapshot.compositeScore}
                    </span>
                    <span className={resultSort.key === "riskScore" ? "is-active" : undefined}>{copy.risk} {snapshot.riskScore}</span>
                  </div>
                  <div className="watchlist-result-actions">
                    <TrackedLink
                      className="watchlist-icon-action watchlist-icon-action--view"
                      eventName="stock_link_clicked"
                      href={`/stocks/${snapshot.asset.symbol}`}
                      label={`${copy.viewAria} ${snapshot.asset.symbol}`}
                      payload={{ area: "watchlist_search" }}
                    >
                      <svg
                        aria-hidden="true"
                        className="watchlist-action-svg"
                        fill="none"
                        height="17"
                        viewBox="0 0 24 24"
                        width="17"
                      >
                        <circle cx="10.5" cy="10.5" r="5.5" stroke="currentColor" strokeWidth="2.6" />
                        <path d="M15 15l4.5 4.5" stroke="currentColor" strokeLinecap="round" strokeWidth="2.8" />
                      </svg>
                      <span className="watchlist-action-label">{copy.view}</span>
                    </TrackedLink>
                    <button
                      aria-label={isFavorite ? `${snapshot.asset.symbol} ${copy.tracked}` : `${copy.addAria} ${snapshot.asset.symbol}`}
                      className={`watchlist-icon-action watchlist-icon-action--favorite${isFavorite ? " is-tracked" : ""}`}
                      disabled={isFavorite || isFull}
                      onClick={() => addFavorite(snapshot.asset.symbol)}
                      title={isFavorite ? copy.tracked : copy.add}
                      type="button"
                    >
                      <span
                        aria-hidden="true"
                        className={`watchlist-action-icon ${
                          isFavorite ? "watchlist-action-icon--tracked" : "watchlist-action-icon--add"
                        }`}
                      />
                      <span className="watchlist-action-label">{isFavorite ? copy.tracked : copy.add}</span>
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      <section className="weekly-grid watchlist-observation-grid" aria-label={locale === "en" ? "Watchlist observation rankings" : "追蹤觀察排行"}>
        <ScoreList
          description={hasFavorites ? copy.strongDescriptionTracked : copy.strongDescriptionDefault}
          items={strongList}
          title={hasFavorites ? copy.strongTitleTracked : copy.strongTitleDefault}
          valueKey="compositeScore"
          collapsible={isCompactStock}
          collapsed={rankingCollapsed}
          onToggle={() => setRankingCollapsed((current) => !current)}
          toggleCollapseLabel={copy.collapse}
          toggleExpandLabel={copy.expand}
        />
        <ScoreList
          description={hasFavorites ? copy.weakDescriptionTracked : copy.weakDescriptionDefault}
          items={riskList}
          title={hasFavorites ? copy.weakTitleTracked : copy.weakTitleDefault}
          valueKey="riskScore"
          collapsible={isCompactStock}
          collapsed={rankingCollapsed}
          onToggle={() => setRankingCollapsed((current) => !current)}
          toggleCollapseLabel={copy.collapse}
          toggleExpandLabel={copy.expand}
        />
      </section>
    </section>
  );
}

function StockLink({ area, snapshot }: { area: string; snapshot: MarketWatchlistItem }) {
  return (
    <TrackedLink
      eventName="stock_link_clicked"
      href={`/stocks/${snapshot.asset.symbol}`}
      label={`${snapshot.asset.symbol} ${snapshot.asset.name}`}
      payload={{ area }}
    >
      {snapshot.asset.symbol} {snapshot.asset.name}
    </TrackedLink>
  );
}

function ScoreList({
  description,
  items,
  title,
  valueKey,
  collapsible = false,
  collapsed = false,
  onToggle,
  toggleCollapseLabel = "收合",
  toggleExpandLabel = "展開"
}: {
  collapsible?: boolean;
  collapsed?: boolean;
  description: string;
  items: MarketWatchlistItem[];
  onToggle?: () => void;
  title: string;
  toggleCollapseLabel?: string;
  toggleExpandLabel?: string;
  valueKey: "compositeScore" | "riskScore";
}) {
  if (!collapsible) {
    return (
      <article className="panel briefing-article">
        <p className="eyebrow">{title}</p>
        <h2>{title}</h2>
        <p>{description}</p>
        <div className="rank-list">
          {items.map((item) => (
            <TrackedLink
              className="rank-row"
              eventName="stock_link_clicked"
              href={`/stocks/${item.asset.symbol}`}
              key={item.asset.id}
              label={`${item.asset.symbol} ${item.asset.name}`}
              payload={{ area: title, symbol: item.asset.symbol }}
            >
              <strong>{item.asset.symbol}</strong>
              <span>{item.asset.name}</span>
              <b>{item[valueKey]}</b>
            </TrackedLink>
          ))}
        </div>
      </article>
    );
  }

  return (
    <article className="panel briefing-article">
      <div className="rank-panel-header">
        <div>
          <h2>{title}</h2>
        </div>
        <button aria-expanded={!collapsed} onClick={onToggle} type="button">
          {collapsed ? toggleExpandLabel : toggleCollapseLabel}
        </button>
      </div>
      {!collapsed && (
        <>
          <p>{description}</p>
          <div className="rank-list">
            {items.map((item) => (
              <TrackedLink
                className="rank-row"
                eventName="stock_link_clicked"
                href={`/stocks/${item.asset.symbol}`}
                key={item.asset.id}
                label={`${item.asset.symbol} ${item.asset.name}`}
                payload={{ area: title, symbol: item.asset.symbol }}
              >
                <strong>{item.asset.symbol}</strong>
                <span>{item.asset.name}</span>
                <b>{item[valueKey]}</b>
              </TrackedLink>
            ))}
          </div>
        </>
      )}
    </article>
  );
}

function filterItems(items: MarketWatchlistItem[], query: string) {
  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) return items.slice(0, 8);
  return items
    .filter((item) => {
      const symbol = item.asset.symbol.toLowerCase();
      const name = item.asset.name.toLowerCase();
      return symbol.includes(normalizedQuery) || name.includes(normalizedQuery);
    })
    .slice(0, 12);
}

function sortItems(items: MarketWatchlistItem[], sort: ResultSort) {
  return items.slice().sort((a, b) => {
    const value = a[sort.key] - b[sort.key];
    return sort.direction === "asc" ? value : -value;
  });
}

function rankBy(items: MarketWatchlistItem[], key: "compositeScore" | "riskScore") {
  return items.slice().sort((a, b) => b[key] - a[key]).slice(0, 4);
}

function formatQuoteClose(value: number) {
  return value.toLocaleString("zh-TW", { maximumFractionDigits: 2, minimumFractionDigits: 2 });
}

function formatQuotePercent(value: number) {
  const prefix = value > 0 ? "+" : "";
  return `${prefix}${value.toLocaleString("zh-TW", { maximumFractionDigits: 2, minimumFractionDigits: 2 })}%`;
}

function formatSignalTitle(title: string, locale: MarketWatchlistPanelLocale) {
  if (locale === "zh") return title;
  if (title.includes("高風險")) return "High risk";
  if (title.includes("警戒")) return "Alert";
  if (title.includes("轉弱")) return "Weakening";
  if (title.includes("觀望")) return "Watch";
  if (title.includes("偏強")) return "Stronger";
  return title;
}

function getQuoteTone(changePercent: number) {
  if (changePercent > 0) return "up";
  if (changePercent < 0) return "down";
  return "flat";
}
