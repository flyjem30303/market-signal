"use client";

import { useMemo, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import type { MarketWatchlistItem } from "@/lib/market-watchlist-search";

type HomeSearchEntryLocale = "en" | "zh";

type HomeSearchEntryProps = {
  homePrefix: string;
  locale: HomeSearchEntryLocale;
};

const copy = {
  en: {
    fetchFailed: "Search is temporarily unavailable. Open target observation to continue.",
    inputLabel: "Search ticker or name",
    noMatch: "No exact match yet. Open target observation for the full list.",
    placeholder: "For example 2330, 0050, or TSMC",
    search: "Search",
    suggestionsLabel: "Search suggestions"
  },
  zh: {
    fetchFailed: "搜尋暫時無法使用，請前往標的觀察繼續查找。",
    inputLabel: "搜尋股票代號或名稱",
    noMatch: "目前沒有精確符合的標的，請前往標的觀察查看完整清單。",
    placeholder: "例如 2330、0050 或台積電",
    search: "搜尋",
    suggestionsLabel: "搜尋建議"
  }
} as const;

export function HomeSearchEntry({ homePrefix, locale }: HomeSearchEntryProps) {
  const router = useRouter();
  const text = copy[locale];
  const [items, setItems] = useState<MarketWatchlistItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [message, setMessage] = useState("");
  const stockSearchPath = homePrefix === "/en" ? "/en/stocks" : "/stocks";

  const matches = useMemo(() => {
    const normalized = normalize(query);
    if (!normalized || !items.length) return [];

    return items
      .filter((item) => {
        const symbol = normalize(item.asset.symbol);
        const name = normalize(item.asset.name);
        return symbol.includes(normalized) || name.includes(normalized);
      })
      .slice(0, 4);
  }, [items, query]);

  async function ensureItemsLoaded() {
    if (isLoaded || isLoading) return;
    setIsLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/watchlist/search-items", { cache: "force-cache" });
      if (!response.ok) throw new Error("home_search_items_fetch_failed");
      const payload = (await response.json()) as { items?: MarketWatchlistItem[] };
      setItems(Array.isArray(payload.items) ? payload.items : []);
      setIsLoaded(true);
    } catch {
      setMessage(text.fetchFailed);
    } finally {
      setIsLoading(false);
    }
  }

  function navigateToItem(item: MarketWatchlistItem) {
    router.push(`/stocks/${encodeURIComponent(item.asset.symbol)}`);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const normalized = normalize(query);

    if (!normalized) {
      router.push(stockSearchPath);
      return;
    }

    const exactMatch =
      matches.find((item) => normalize(item.asset.symbol) === normalized) ??
      matches.find((item) => normalize(item.asset.name) === normalized);

    const target = exactMatch ?? matches[0];
    if (target) {
      navigateToItem(target);
      return;
    }

    setMessage(text.noMatch);
  }

  return (
    <div className="home-search-entry">
      <form className="home-search-entry__field" onSubmit={handleSubmit}>
        <label htmlFor="home-target-search">{text.inputLabel}</label>
        <div className="home-search-entry__control">
          <input
            autoComplete="off"
            id="home-target-search"
            onChange={(event) => {
              setQuery(event.target.value);
              void ensureItemsLoaded();
            }}
            onFocus={() => {
              void ensureItemsLoaded();
            }}
            placeholder={text.placeholder}
            type="search"
            value={query}
          />
          <button disabled={isLoading} type="submit">
            {isLoading ? "..." : text.search}
          </button>
        </div>
        {matches.length > 0 ? (
          <div className="home-search-entry__results" aria-label={text.suggestionsLabel}>
            {matches.map((item) => (
              <button key={item.asset.id} onClick={() => navigateToItem(item)} type="button">
                <span className="home-search-entry__result-main">
                  <strong>{item.asset.symbol}</strong>
                  <span>{item.asset.name}</span>
                </span>
                <span className="home-search-entry__result-meta">
                  <span>{getAssetDescriptor(item, locale)}</span>
                  <span>{locale === "en" ? "Taiwan" : "台灣"}</span>
                </span>
              </button>
            ))}
          </div>
        ) : null}
        {message ? <p className="home-search-entry__message">{message}</p> : null}
      </form>
    </div>
  );
}

function normalize(value: string) {
  return value.trim().toLowerCase();
}

function getAssetDescriptor(item: MarketWatchlistItem, locale: HomeSearchEntryLocale) {
  if (item.asset.symbol === "TWII") return locale === "en" ? "Index" : "指數";
  if (item.asset.symbol.startsWith("00")) return "ETF";
  return locale === "en" ? "Stock" : "股票";
}
