"use client";

import { useEffect, useMemo, useState } from "react";
import { TrackedLink } from "@/components/tracked-link";
import type { SignalSnapshot } from "@/lib/signal-model";

const storageKey = "market-signal:favorites:v1";
const maxFavorites = 5;

export function MarketWatchlistPanel({ snapshots }: { snapshots: SignalSnapshot[] }) {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [query, setQuery] = useState("");
  const [message, setMessage] = useState("");

  const bySymbol = useMemo(() => new Map(snapshots.map((snapshot) => [snapshot.asset.symbol, snapshot])), [snapshots]);

  useEffect(() => {
    try {
      const saved = JSON.parse(window.localStorage.getItem(storageKey) ?? "[]");
      setFavorites(Array.isArray(saved) ? saved.filter((symbol) => bySymbol.has(symbol)).slice(0, maxFavorites) : []);
    } catch {
      setFavorites([]);
    }
    setHydrated(true);
  }, [bySymbol]);

  useEffect(() => {
    if (hydrated) window.localStorage.setItem(storageKey, JSON.stringify(favorites));
  }, [favorites, hydrated]);

  const favoriteSnapshots = favorites.map((symbol) => bySymbol.get(symbol)).filter((item): item is SignalSnapshot => Boolean(item));
  const base = favoriteSnapshots.length ? favoriteSnapshots : snapshots;
  const searchResults = filterSnapshots(snapshots, query);
  const strongList = rankBy(base, "compositeScore");
  const riskList = rankBy(base, "riskScore");
  const hasFavorites = favoriteSnapshots.length > 0;

  function addFavorite(symbol: string) {
    if (favorites.includes(symbol)) return setMessage("已在常看標的中。");
    if (favorites.length >= maxFavorites) return setMessage("最多追蹤 5 個常看標的，請先移除一個。");
    setFavorites([...favorites, symbol]);
    setMessage("已加入常看標的。");
  }

  return (
    <section className="market-watchlist-panel" aria-label="常看標的">
      <div className="watchlist-search-card">
        <div>
          <p className="eyebrow">常看標的</p>
          <h2>搜尋股票代號，建立自己的觀察清單</h2>
          <p>最多追蹤 5 個標的。加入後，下方強勢觀察與風險觀察會優先依你的清單整理。</p>
        </div>
        <label className="watchlist-search-field">
          <span>輸入股票代號或名稱</span>
          <input
            aria-label="搜尋股票代號或名稱"
            onChange={(event) => {
              setQuery(event.target.value);
              setMessage("");
            }}
            placeholder="例如 2330 或 台積電"
            type="search"
            value={query}
          />
        </label>
        {message && <p className="watchlist-message" role="status">{message}</p>}
      </div>

      <div className="favorite-row watchlist-favorites" aria-label="我的最愛">
        {hasFavorites ? (
          favoriteSnapshots.map((snapshot) => (
            <span className="favorite-chip" key={snapshot.asset.symbol}>
              <StockLink area="watchlist_favorite" snapshot={snapshot} />
              <button onClick={() => setFavorites(favorites.filter((symbol) => symbol !== snapshot.asset.symbol))} type="button">
                移除
              </button>
            </span>
          ))
        ) : (
          <span className="muted-chip">尚未加入常看標的，先從搜尋結果加入。</span>
        )}
      </div>

      <div className="watchlist-search-results" aria-label="搜尋結果">
        {searchResults.map((snapshot) => {
          const isFavorite = favorites.includes(snapshot.asset.symbol);
          const isFull = favorites.length >= maxFavorites && !isFavorite;

          return (
            <article className="watchlist-result-row" key={snapshot.asset.symbol}>
              <div>
                <strong>{snapshot.asset.symbol}</strong>
                <span>{snapshot.asset.name}</span>
                <small>{snapshot.signal.title} / 綜合 {snapshot.compositeScore} / 風險 {snapshot.riskScore}</small>
              </div>
              <TrackedLink
                eventName="stock_link_clicked"
                href={`/stocks/${snapshot.asset.symbol}`}
                label={`查看 ${snapshot.asset.symbol}`}
                payload={{ area: "watchlist_search" }}
              >
                查看
              </TrackedLink>
              <button disabled={isFavorite || isFull} onClick={() => addFavorite(snapshot.asset.symbol)} type="button">
                {isFavorite ? "已加入" : "加入"}
              </button>
            </article>
          );
        })}
      </div>

      <section className="weekly-grid watchlist-observation-grid" aria-label="常看標的觀察">
        <ScoreList
          description={hasFavorites ? "依你的常看標的排序，快速看出目前相對強勢者。" : "尚未加入常看標的，暫以預設市場清單呈現。"}
          items={strongList}
          title={hasFavorites ? "我的強勢觀察" : "市場強勢觀察"}
          valueKey="compositeScore"
        />
        <ScoreList
          description={hasFavorites ? "依你的常看標的排序，優先提醒需要留意波動的標的。" : "尚未加入常看標的，暫以預設市場清單呈現。"}
          items={riskList}
          title={hasFavorites ? "我的風險觀察" : "市場風險觀察"}
          valueKey="riskScore"
        />
      </section>
    </section>
  );
}

function StockLink({ area, snapshot }: { area: string; snapshot: SignalSnapshot }) {
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
  valueKey
}: {
  description: string;
  items: SignalSnapshot[];
  title: string;
  valueKey: "compositeScore" | "riskScore";
}) {
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

function filterSnapshots(snapshots: SignalSnapshot[], query: string) {
  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) return snapshots.slice(0, 6);
  return snapshots
    .filter((snapshot) => {
      const symbol = snapshot.asset.symbol.toLowerCase();
      const name = snapshot.asset.name.toLowerCase();
      return symbol.includes(normalizedQuery) || name.includes(normalizedQuery);
    })
    .slice(0, 8);
}

function rankBy(snapshots: SignalSnapshot[], key: "compositeScore" | "riskScore") {
  return snapshots.slice().sort((a, b) => b[key] - a[key]).slice(0, 4);
}
