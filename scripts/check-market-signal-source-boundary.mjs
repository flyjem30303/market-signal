import fs from "node:fs";

const repositoryPath = "src/lib/repositories/market-signal-repository.ts";
const sourceStatusPath = "src/lib/repositories/market-signal-source-status.ts";
const stripPath = "src/components/data-freshness-strip.tsx";
const dashboardPath = "src/components/dashboard-shell.tsx";
const homePath = "src/app/page.tsx";
const stockPagePath = "src/app/stocks/[symbol]/page.tsx";
const briefingPath = "src/app/briefing/page.tsx";
const weeklyPath = "src/app/weekly/page.tsx";
const methodologyPath = "src/app/methodology/page.tsx";
const envExamplePath = ".env.example";
const repository = fs.readFileSync(repositoryPath, "utf8");
const sourceStatus = fs.readFileSync(sourceStatusPath, "utf8");
const strip = fs.readFileSync(stripPath, "utf8");
const dashboard = fs.readFileSync(dashboardPath, "utf8");
const home = fs.readFileSync(homePath, "utf8");
const stockPage = fs.readFileSync(stockPagePath, "utf8");
const briefing = fs.readFileSync(briefingPath, "utf8");
const weekly = fs.readFileSync(weeklyPath, "utf8");
const methodology = fs.readFileSync(methodologyPath, "utf8");
const envExample = fs.readFileSync(envExamplePath, "utf8");

const requiredRepositoryPhrases = [
  "export { getMarketSignalSourceStatus, type MarketSignalSourceStatus };",
  "getMarketSignalSourceStatus({ env });",
  "return mockMarketSignalRepository;"
];

const requiredSourceStatusPhrases = [
  "export type MarketSignalDataSource = \"mock\" | \"supabase\";",
  "export type MarketSignalSupabaseReads = \"disabled\" | \"enabled\";",
  "MARKET_SIGNAL_SUPABASE_READS?: string;",
  "env.NEXT_PUBLIC_DATA_SOURCE ?? \"mock\"",
  "env.MARKET_SIGNAL_SUPABASE_READS === \"enabled\" ? \"enabled\" : \"disabled\"",
  "publicScoreSource: \"mock\"",
  "resolvedSource: \"mock\"",
  "Supabase market-signal reads are not enabled",
  "public score repository still resolves to mock"
];

const requiredEnvPhrases = [
  "NEXT_PUBLIC_DATA_SOURCE=mock",
  "MARKET_SIGNAL_SUPABASE_READS=disabled",
  "bounded market-signal runtime-read checkpoint"
];

const requiredUiPhrases = [
  {
    content: strip,
    file: stripPath,
    phrases: [
      "marketSignalSourceStatus?: MarketSignalSourceStatus",
      "市場訊號來源：目前 {marketSignalSourceStatus.resolvedSource}",
      "要求來源 {marketSignalSourceStatus.requestedSource}",
      "後端唯讀狀態",
      "{marketSignalSourceStatus.supabaseRuntimeReads}",
      "{marketSignalSourceStatus.reason}"
    ]
  },
  {
    content: dashboard,
    file: dashboardPath,
    phrases: [
      "marketSignalSourceStatus?: MarketSignalSourceStatus",
      "marketSignalSourceStatus={marketSignalSourceStatus}"
    ]
  },
  {
    content: home,
    file: homePath,
    phrases: ["getMarketSignalSourceStatus", "marketSignalSourceStatus={marketSignalSourceStatus}"]
  },
  {
    content: stockPage,
    file: stockPagePath,
    phrases: ["getMarketSignalSourceStatus", "marketSignalSourceStatus={marketSignalSourceStatus}"]
  },
  {
    content: briefing,
    file: briefingPath,
    phrases: ["getMarketSignalSourceStatus", "marketSignalSourceStatus={marketSignalSourceStatus}"]
  },
  {
    content: weekly,
    file: weeklyPath,
    phrases: ["getMarketSignalSourceStatus", "marketSignalSourceStatus={marketSignalSourceStatus}"]
  },
  {
    content: methodology,
    file: methodologyPath,
    phrases: ["getMarketSignalSourceStatus", "marketSignalSourceStatus={marketSignalSourceStatus}"]
  }
];

const forbiddenRepositoryPhrases = [
  "createSupabaseMarketSignalRepository(",
  "createServerSupabaseClient()",
  "scoreSource: \"real\"",
  "scoreSource" + "=real",
  "resolvedSource: \"supabase\"",
  "publicScoreSource: \"real\"",
  "throw new Error(\"NEXT_PUBLIC_DATA_SOURCE=supabase"
];

const missingRepository = requiredRepositoryPhrases
  .filter((phrase) => !repository.includes(phrase))
  .map((phrase) => ({ file: repositoryPath, phrase }));

const missingSourceStatus = requiredSourceStatusPhrases
  .filter((phrase) => !sourceStatus.includes(phrase))
  .map((phrase) => ({ file: sourceStatusPath, phrase }));

const missingEnv = requiredEnvPhrases
  .filter((phrase) => !envExample.includes(phrase))
  .map((phrase) => ({ file: envExamplePath, phrase }));

const missingUi = requiredUiPhrases.flatMap((requirement) =>
  requirement.phrases
    .filter((phrase) => !requirement.content.includes(phrase))
    .map((phrase) => ({ file: requirement.file, phrase }))
);

const forbidden = forbiddenRepositoryPhrases
  .flatMap((phrase) =>
    [
      { content: repository, file: repositoryPath },
      { content: sourceStatus, file: sourceStatusPath }
    ]
      .filter((target) => target.content.includes(phrase))
      .map((target) => ({ file: target.file, phrase }))
  );

const problems = [...missingRepository, ...missingSourceStatus, ...missingEnv, ...missingUi, ...forbidden];

console.log(
  JSON.stringify(
    {
      checked_files: [
        repositoryPath,
        sourceStatusPath,
        stripPath,
        dashboardPath,
        homePath,
        stockPagePath,
        briefingPath,
        weeklyPath,
        methodologyPath,
        envExamplePath
      ],
      forbidden,
      missingEnv,
      missingRepository,
      missingSourceStatus,
      missingUi,
      status: problems.length === 0 ? "ok" : "blocked"
    },
    null,
    2
  )
);

if (problems.length > 0) {
  process.exitCode = 1;
}
