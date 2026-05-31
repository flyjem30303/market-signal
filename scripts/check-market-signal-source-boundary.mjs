import fs from "node:fs";

const repositoryPath = "src/lib/repositories/market-signal-repository.ts";
const envExamplePath = ".env.example";
const repository = fs.readFileSync(repositoryPath, "utf8");
const envExample = fs.readFileSync(envExamplePath, "utf8");

const requiredRepositoryPhrases = [
  "export type MarketSignalDataSource = \"mock\" | \"supabase\";",
  "export type MarketSignalSupabaseReads = \"disabled\" | \"enabled\";",
  "MARKET_SIGNAL_SUPABASE_READS?: string;",
  "env.NEXT_PUBLIC_DATA_SOURCE ?? \"mock\"",
  "env.MARKET_SIGNAL_SUPABASE_READS === \"enabled\" ? \"enabled\" : \"disabled\"",
  "publicScoreSource: \"mock\"",
  "resolvedSource: \"mock\"",
  "Supabase market-signal reads are not enabled",
  "public score repository still resolves to mock",
  "return mockMarketSignalRepository;"
];

const requiredEnvPhrases = [
  "NEXT_PUBLIC_DATA_SOURCE=mock",
  "MARKET_SIGNAL_SUPABASE_READS=disabled",
  "bounded market-signal runtime-read checkpoint"
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

const missingEnv = requiredEnvPhrases
  .filter((phrase) => !envExample.includes(phrase))
  .map((phrase) => ({ file: envExamplePath, phrase }));

const forbidden = forbiddenRepositoryPhrases
  .filter((phrase) => repository.includes(phrase))
  .map((phrase) => ({ file: repositoryPath, phrase }));

const problems = [...missingRepository, ...missingEnv, ...forbidden];

console.log(
  JSON.stringify(
    {
      checked_files: [repositoryPath, envExamplePath],
      forbidden,
      missingEnv,
      missingRepository,
      status: problems.length === 0 ? "ok" : "blocked"
    },
    null,
    2
  )
);

if (problems.length > 0) {
  process.exitCode = 1;
}
