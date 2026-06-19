import fs from "node:fs";

const requiredFiles = [
  "src/components/stock-follow-button.tsx",
  "src/lib/watchlist-storage.ts",
  "src/components/market-watchlist-panel.tsx",
  "src/components/dashboard-shell.tsx"
];

const missingFiles = requiredFiles.filter((file) => !fs.existsSync(file));
if (missingFiles.length) {
  console.error(JSON.stringify({ status: "error", missingFiles }, null, 2));
  process.exit(1);
}

const followButton = fs.readFileSync("src/components/stock-follow-button.tsx", "utf8");
const storage = fs.readFileSync("src/lib/watchlist-storage.ts", "utf8");
const panel = fs.readFileSync("src/components/market-watchlist-panel.tsx", "utf8");
const shell = fs.readFileSync("src/components/dashboard-shell.tsx", "utf8");

const checks = [
  {
    name: "shared_storage_key_exported",
    pass: /export const watchlistStorageKey = "market-signal:favorites:v1"/.test(storage)
  },
  {
    name: "shared_max_watchlist_exported",
    pass: /export const maxWatchlistItems = 5/.test(storage)
  },
  {
    name: "same_tab_event_exported",
    pass: /export const watchlistChangedEvent = "market-signal:watchlist-changed"/.test(storage)
  },
  {
    name: "hero_button_dispatches_watchlist_event",
    pass:
      /writeWatchlist\(\[\.{3}favorites, normalizedSymbol\], normalizedSymbol\)/.test(followButton) &&
      /window\.dispatchEvent\(new CustomEvent<WatchlistChangeDetail>\(watchlistChangedEvent/.test(storage)
  },
  {
    name: "search_panel_listens_to_watchlist_event",
    pass: /addEventListener\(watchlistChangedEvent/.test(panel)
  },
  {
    name: "stock_quote_uses_follow_button",
    pass: /<StockFollowButton\s+symbol=\{snapshot\.asset\.symbol\}/.test(shell)
  },
  {
    name: "hero_button_not_disabled_placeholder",
    pass: !/追蹤功能準備中/.test(shell)
  }
];

const failed = checks.filter((check) => !check.pass);

console.log(
  JSON.stringify(
    {
      status: failed.length ? "error" : "ok",
      checks
    },
    null,
    2
  )
);

if (failed.length) process.exit(1);
