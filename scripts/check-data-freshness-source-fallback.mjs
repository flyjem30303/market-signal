import fs from "node:fs";

const sourcePath = "src/lib/data-freshness-source.ts";
const source = fs.readFileSync(sourcePath, "utf8");

const requiredPhrases = [
  "type FreshnessSource = \"mock\" | \"supabase\"",
  "process.env.DATA_FRESHNESS_SOURCE ?? \"mock\"",
  "DATA_FRESHNESS_SUPABASE_READS",
  "isSupabaseRuntimeReadEnabled",
  "process.env.DATA_FRESHNESS_SUPABASE_READS === \"enabled\"",
  "if (!isSupabaseRuntimeReadEnabled())",
  "return buildMockDataFreshnessSnapshot();",
  "createServerSupabaseClient()",
  "try {",
  "return await getSupabaseDataFreshnessSnapshot(client);",
  "} catch {"
];

const forbiddenPhrases = [
  "DATA_FRESHNESS_SUPABASE_READS !== \"disabled\"",
  "DATA_FRESHNESS_SUPABASE_READS ?? \"enabled\"",
  "scoreSource: \"real\"",
  "scoreSource=real",
  "throw error;",
  "throw new Error(`Failed to load"
];

const missing = requiredPhrases
  .filter((phrase) => !source.includes(phrase))
  .map((phrase) => ({ file: sourcePath, phrase }));

const forbidden = forbiddenPhrases
  .filter((phrase) => source.includes(phrase))
  .map((phrase) => ({ file: sourcePath, phrase }));

const readGuardIndex = source.indexOf("if (!isSupabaseRuntimeReadEnabled())");
const clientIndex = source.indexOf("createServerSupabaseClient()");
const orderProblems =
  readGuardIndex === -1 || clientIndex === -1 || readGuardIndex > clientIndex
    ? [
        {
          file: sourcePath,
          phrase: "createServerSupabaseClient() must remain after DATA_FRESHNESS_SUPABASE_READS gate"
        }
      ]
    : [];

const problems = [...missing, ...forbidden, ...orderProblems];

console.log(
  JSON.stringify(
    {
      checked_files: [sourcePath],
      forbidden,
      missing,
      orderProblems,
      status: problems.length === 0 ? "ok" : "blocked"
    },
    null,
    2
  )
);

if (problems.length > 0) {
  process.exitCode = 1;
}
