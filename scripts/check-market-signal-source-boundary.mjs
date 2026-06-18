import fs from "node:fs";

const files = {
  dashboard: "src/components/dashboard-shell.tsx",
  envExample: ".env.example",
  repository: "src/lib/repositories/market-signal-repository.ts",
  sourceStatus: "src/lib/repositories/market-signal-source-status.ts",
  staticRepository: "src/lib/repositories/static-market-signal-repository.ts",
  strip: "src/components/data-freshness-strip.tsx",
  supabaseRepository: "src/lib/repositories/supabase-market-signal-repository.ts"
};

const text = Object.fromEntries(Object.entries(files).map(([key, file]) => [key, fs.readFileSync(file, "utf8")]));

const required = [
  [files.repository, text.repository, "getMarketSignalRuntime"],
  [files.repository, text.repository, "createLoadedSupabaseMarketSignalRepository"],
  [files.repository, text.repository, "createServerSupabaseClient"],
  [files.repository, text.repository, "Supabase readonly data could not be loaded"],
  [files.staticRepository, text.staticRepository, "toMarketSignalRepositoryData"],
  [files.staticRepository, text.staticRepository, "createStaticMarketSignalRepository"],
  [files.sourceStatus, text.sourceStatus, "stage_6_public_data_source_supabase_approved"],
  [files.sourceStatus, text.sourceStatus, "stage_8_score_source_real_approved"],
  [files.sourceStatus, text.sourceStatus, "supabase_read_failed"],
  [files.supabaseRepository, text.supabaseRepository, ".from(\"stocks\")"],
  [files.supabaseRepository, text.supabaseRepository, ".from(\"daily_prices\")"],
  [files.supabaseRepository, text.supabaseRepository, ".from(\"daily_scores\")"],
  [files.supabaseRepository, text.supabaseRepository, "Supabase readonly daily_prices"],
  [files.dashboard, text.dashboard, "repositoryData?: MarketSignalRepositoryData"],
  [files.dashboard, text.dashboard, "createStaticMarketSignalRepository(repositoryData)"],
  [files.dashboard, text.dashboard, "mockMarketSignalRepository"],
  [files.dashboard, text.dashboard, "引用來源"],
  [files.dashboard, text.dashboard, "更新至"],
  [files.strip, text.strip, "引用來源"],
  [files.strip, text.strip, "更新至"],
  [files.strip, text.strip, "formatPublicSourceLabel"],
  [files.envExample, text.envExample, "NEXT_PUBLIC_DATA_SOURCE=mock"],
  [files.envExample, text.envExample, "NEXT_PUBLIC_SCORE_SOURCE=mock"],
  [files.envExample, text.envExample, "MARKET_SIGNAL_SUPABASE_READS=disabled"],
  [files.envExample, text.envExample, "MARKET_SIGNAL_SUPABASE_PROMOTION_GATE=disabled"],
  [files.envExample, text.envExample, "MARKET_SIGNAL_SCORE_SOURCE_GATE=disabled"]
];

const forbidden = [
  [files.repository, text.repository, ".insert("],
  [files.repository, text.repository, ".upsert("],
  [files.repository, text.repository, ".delete("],
  [files.repository, text.repository, ".rpc("],
  [files.supabaseRepository, text.supabaseRepository, ".insert("],
  [files.supabaseRepository, text.supabaseRepository, ".upsert("],
  [files.supabaseRepository, text.supabaseRepository, ".delete("],
  [files.supabaseRepository, text.supabaseRepository, ".rpc("],
  [files.supabaseRepository, text.supabaseRepository, ".storage"],
  [files.dashboard, text.dashboard, "Supabase 唯讀"],
  [files.dashboard, text.dashboard, "分數來源："],
  [files.strip, text.strip, "Supabase 唯讀"],
  [files.strip, text.strip, "分數狀態"]
];

const missing = required
  .filter(([, content, phrase]) => !content.includes(phrase))
  .map(([file, , phrase]) => ({ file, phrase }));
const forbiddenHits = forbidden
  .filter(([, content, phrase]) => content.includes(phrase))
  .map(([file, , phrase]) => ({ file, phrase }));
const status = missing.length === 0 && forbiddenHits.length === 0 ? "ok" : "blocked";

console.log(
  JSON.stringify(
    {
      checked_files: Object.values(files),
      forbidden: forbiddenHits,
      missing,
      status
    },
    null,
    2
  )
);

if (status !== "ok") {
  process.exitCode = 1;
}
