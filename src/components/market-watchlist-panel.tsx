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

export function MarketWatchlistPanel({
  description = "最多追蹤 5 檔；強勢與風險排行會優先依追蹤清單排序。",
  eyebrow = "追蹤標的",
  heading = "搜尋股票，建立觀察清單",
  items,
  variant = "compact-stock"
}: {
  description?: string;
  eyebrow?: string;
  heading?: string;
  items: MarketWatchlistItem[];
  variant?: MarketWatchlistPanelVariant;
}) {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isDraggingResults, setIsDraggingResults] = useState(false);
  const [query, setQuery] = useState("");
  const [message, setMessage] = useState("");
  const [rankingCollapsed, setRankingCollapsed] = useState(variant === "compact-stock");
  const [resultSort, setResultSort] = useState<ResultSort>({ direction: "desc", key: "compositeScore" });
  const resultsRef = useRef<HTMLDivElement>(null);
  const isDraggingResultsRef = useRef(false);
  const dragRef = useRef({ left: 0, startX: 0 });

  const bySymbol = useMemo(() => new Map(items.map((item) => [item.asset.symbol, item])), [items]);

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
  const base = favoriteSnapshots.length ? favoriteSnapshots : items;
  const searchResults = sortItems(filterItems(items, query), resultSort);
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
    if (resultSort.key !== key) return `依${label}排序`;
    return resultSort.direction === "desc" ? `${label}高到低` : `${label}低到高`;
  }

  function addFavorite(symbol: string) {
    if (favorites.includes(symbol)) {
      setMessage("已在追蹤清單中。");
      return;
    }
    if (favorites.length >= maxWatchlistItems) {
      setMessage("最多追蹤 5 個標的，請先移除一個。");
      return;
    }
    setFavorites(writeWatchlist([...favorites, symbol], symbol));
    setMessage("已加入追蹤。");
  }

  function removeFavorite(symbol: string) {
    setFavorites(writeWatchlist(favorites.filter((item) => item !== symbol), symbol));
    setMessage("已移除追蹤。");
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
    <section className={`market-watchlist-panel market-watchlist-panel--${variant}`} aria-label="搜尋與追蹤標的">
      <div className="watchlist-search-card">
        <label className="watchlist-search-field">
          <span>搜尋股票代號或名稱</span>
          {isCompactStock && (
            <span className="watchlist-count" aria-label={`目前追蹤 ${favorites.length} 個，最多 ${maxWatchlistItems} 個`}>
              {favorites.length}/{maxWatchlistItems}
            </span>
          )}
          <input
            aria-label="搜尋股票代號或名稱"
            onChange={(event) => {
              setQuery(event.target.value);
              setMessage("");
            }}
            placeholder="例如 2330、0050 或台積電"
            type="search"
            value={query}
          />
        </label>

        <div className="watchlist-search-copy">
          {!isCompactStock && <p className="eyebrow">{eyebrow}</p>}
          <h2>{heading}</h2>
          <p>{description}</p>
        </div>

        <div className="watchlist-tracking-box" aria-live="polite">
          <div className="watchlist-tracking-box__header">
            {(message || !isCompactStock) && <strong>{message || "追蹤清單"}</strong>}
            {!isCompactStock && <span>{favorites.length}/{maxWatchlistItems}</span>}
          </div>
          <div className="favorite-row watchlist-favorites" aria-label="已追蹤標的">
            {hasFavorites ? (
              favoriteSnapshots.map((snapshot) => (
                <span className="favorite-chip" key={snapshot.asset.symbol}>
                  <StockLink area="watchlist_favorite" snapshot={snapshot} />
                  <button onClick={() => removeFavorite(snapshot.asset.symbol)} type="button">
                    移除
                  </button>
                </span>
              ))
            ) : (
              <span className="muted-chip">尚未加入追蹤。你可以先搜尋 2330、0050 或 TWII。</span>
            )}
          </div>
        </div>
      </div>

      <div className="watchlist-results-shell" aria-label="搜尋結果">
        <div className="watchlist-results-header">
          {!isCompactStock && <span>{query ? "搜尋結果" : "常用觀察標的"}</span>}
          <div className="watchlist-results-toolbar">
            <div className="watchlist-sort-controls" aria-label="搜尋結果排序">
              <button
                aria-label={getSortLabel("compositeScore", "綜合分數")}
                aria-pressed={resultSort.key === "compositeScore"}
                onClick={() => toggleResultSort("compositeScore")}
                title={getSortLabel("compositeScore", "綜合分數")}
                type="button"
              >
                <span aria-hidden="true">{getSortIcon("compositeScore")}</span>
              </button>
              <button
                aria-label={getSortLabel("riskScore", "風險分數")}
                aria-pressed={resultSort.key === "riskScore"}
                onClick={() => toggleResultSort("riskScore")}
                title={getSortLabel("riskScore", "風險分數")}
                type="button"
              >
                <span aria-hidden="true">{getSortIcon("riskScore")}</span>
              </button>
            </div>
          </div>
        </div>

        <div className="watchlist-results-controls" aria-label="搜尋結果左右切換">
          <button className="watchlist-scroll-button watchlist-scroll-button--prev" aria-label="向左切換搜尋結果" onClick={() => scrollResults(-1)} type="button">
            <span aria-hidden="true" />
          </button>
          <button className="watchlist-scroll-button watchlist-scroll-button--next" aria-label="向右切換搜尋結果" onClick={() => scrollResults(1)} type="button">
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
                  <span>{snapshot.asset.name}</span>
                  <small>{snapshot.signal.title}</small>
                  {snapshot.quote && (
                    <div className={`watchlist-quote-mini ${quoteTone}`}>
                      <b>{formatQuoteClose(snapshot.quote.close)}</b>
                      <em>{formatQuotePercent(snapshot.quote.changePercent)}</em>
                    </div>
                  )}
                </div>
                <div className="watchlist-result-side">
                  <div className="watchlist-score-strip" aria-label={`${snapshot.asset.symbol} 分數摘要`}>
                    <span className={resultSort.key === "compositeScore" ? "is-active" : undefined}>
                      綜合 {snapshot.compositeScore}
                    </span>
                    <span className={resultSort.key === "riskScore" ? "is-active" : undefined}>風險 {snapshot.riskScore}</span>
                  </div>
                  <div className="watchlist-result-actions">
                    <TrackedLink
                      className="watchlist-icon-action watchlist-icon-action--view"
                      eventName="stock_link_clicked"
                      href={`/stocks/${snapshot.asset.symbol}`}
                      label={`查看 ${snapshot.asset.symbol}`}
                      payload={{ area: "watchlist_search" }}
                    >
                      <svg
                        aria-hidden="true"
                        className="watchlist-action-svg"
                        fill="none"
                        height="15"
                        viewBox="0 0 24 24"
                        width="15"
                      >
                        <circle cx="10.5" cy="10.5" r="5.5" stroke="currentColor" strokeWidth="2.6" />
                        <path d="M15 15l4.5 4.5" stroke="currentColor" strokeLinecap="round" strokeWidth="2.8" />
                      </svg>
                      <span className="watchlist-action-label">查看</span>
                    </TrackedLink>
                    <button
                      aria-label={isFavorite ? `${snapshot.asset.symbol} 已追蹤` : `加入追蹤 ${snapshot.asset.symbol}`}
                      className={`watchlist-icon-action watchlist-icon-action--favorite${isFavorite ? " is-tracked" : ""}`}
                      disabled={isFavorite || isFull}
                      onClick={() => addFavorite(snapshot.asset.symbol)}
                      title={isFavorite ? "已追蹤" : "加入追蹤"}
                      type="button"
                    >
                      <span
                        aria-hidden="true"
                        className={`watchlist-action-icon ${
                          isFavorite ? "watchlist-action-icon--tracked" : "watchlist-action-icon--add"
                        }`}
                      />
                      <span className="watchlist-action-label">{isFavorite ? "已追蹤" : "加入追蹤"}</span>
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      <section className="weekly-grid watchlist-observation-grid" aria-label="追蹤觀察排行">
        <ScoreList
          description={hasFavorites ? "依追蹤清單排序，先看目前分數較強的標的。" : "尚未建立追蹤清單，先顯示常用標的。"}
          items={strongList}
          title={hasFavorites ? "追蹤強勢排行" : "市場強勢排行"}
          valueKey="compositeScore"
          collapsible={isCompactStock}
          collapsed={rankingCollapsed}
          onToggle={() => setRankingCollapsed((current) => !current)}
        />
        <ScoreList
          description={hasFavorites ? "依追蹤清單排序，找出需要優先留意波動的標的。" : "尚未建立追蹤清單，先顯示常用標的。"}
          items={riskList}
          title={hasFavorites ? "追蹤風險排行" : "市場風險排行"}
          valueKey="riskScore"
          collapsible={isCompactStock}
          collapsed={rankingCollapsed}
          onToggle={() => setRankingCollapsed((current) => !current)}
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
  onToggle
}: {
  collapsible?: boolean;
  collapsed?: boolean;
  description: string;
  items: MarketWatchlistItem[];
  onToggle?: () => void;
  title: string;
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
          {collapsed ? "展開" : "收合"}
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

function getQuoteTone(changePercent: number) {
  if (changePercent > 0) return "up";
  if (changePercent < 0) return "down";
  return "flat";
}
