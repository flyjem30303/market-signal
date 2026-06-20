"use client";

import { useEffect, useState } from "react";
import {
  maxWatchlistItems,
  readWatchlist,
  watchlistChangedEvent,
  writeWatchlist,
  type WatchlistChangeDetail
} from "@/lib/watchlist-storage";

export function StockFollowButton({ symbol }: { symbol: string }) {
  const normalizedSymbol = symbol.toUpperCase();
  const [favorites, setFavorites] = useState<string[]>([]);
  const isFollowing = favorites.includes(normalizedSymbol);
  const isFull = favorites.length >= maxWatchlistItems && !isFollowing;

  useEffect(() => {
    setFavorites(readWatchlist());

    function handleWatchlistChanged(event: Event) {
      const detail = (event as CustomEvent<WatchlistChangeDetail>).detail;
      setFavorites(Array.isArray(detail?.favorites) ? detail.favorites : readWatchlist());
    }

    window.addEventListener(watchlistChangedEvent, handleWatchlistChanged);
    window.addEventListener("storage", handleWatchlistChanged);
    return () => {
      window.removeEventListener(watchlistChangedEvent, handleWatchlistChanged);
      window.removeEventListener("storage", handleWatchlistChanged);
    };
  }, []);

  function toggleFollow() {
    if (isFollowing) {
      setFavorites(writeWatchlist(favorites.filter((item) => item !== normalizedSymbol), normalizedSymbol));
      return;
    }
    if (isFull) return;
    setFavorites(writeWatchlist([...favorites, normalizedSymbol], normalizedSymbol));
  }

  return (
    <button
      aria-pressed={isFollowing}
      className="stock-quote-follow"
      disabled={isFull}
      onClick={toggleFollow}
      title={isFull ? "最多追蹤 5 個標的，請先移除一個。" : undefined}
      type="button"
    >
      {isFollowing ? "已追蹤" : "+ 追蹤"}
    </button>
  );
}
