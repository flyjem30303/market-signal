export const watchlistStorageKey = "market-signal:favorites:v1";
export const watchlistChangedEvent = "market-signal:watchlist-changed";
export const maxWatchlistItems = 5;

export type WatchlistChangeDetail = {
  favorites: string[];
  symbol?: string;
};

export function normalizeWatchlist(input: unknown, allowedSymbols?: Set<string>) {
  if (!Array.isArray(input)) return [];

  const result: string[] = [];
  for (const item of input) {
    if (typeof item !== "string") continue;
    const symbol = item.trim().toUpperCase();
    if (!symbol || result.includes(symbol)) continue;
    if (allowedSymbols && !allowedSymbols.has(symbol)) continue;
    result.push(symbol);
    if (result.length >= maxWatchlistItems) break;
  }
  return result;
}

export function readWatchlist(allowedSymbols?: Set<string>) {
  try {
    return normalizeWatchlist(JSON.parse(window.localStorage.getItem(watchlistStorageKey) ?? "[]"), allowedSymbols);
  } catch {
    return [];
  }
}

export function writeWatchlist(favorites: string[], symbol?: string) {
  const normalized = normalizeWatchlist(favorites);
  window.localStorage.setItem(watchlistStorageKey, JSON.stringify(normalized));
  window.dispatchEvent(new CustomEvent<WatchlistChangeDetail>(watchlistChangedEvent, { detail: { favorites: normalized, symbol } }));
  return normalized;
}
