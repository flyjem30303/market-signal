import fs from "node:fs";

const sourcePath = "src/lib/data-freshness-source.ts";
const projectStatusPath = "PROJECT_STATUS.md";
const runbookPath = "docs/SUPABASE_EXECUTION_RUNBOOK.md";
const mvpTasksPath = "docs/MVP_TASKS.md";
const source = fs.readFileSync(sourcePath, "utf8");
const projectStatus = fs.readFileSync(projectStatusPath, "utf8");
const runbook = fs.readFileSync(runbookPath, "utf8");
const mvpTasks = fs.readFileSync(mvpTasksPath, "utf8");

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

const requiredDocPhrases = [
  {
    content: projectStatus,
    file: projectStatusPath,
    phrases: [
      "DATA_FRESHNESS_SOURCE=supabase",
      "DATA_FRESHNESS_SUPABASE_READS=enabled",
      "fallback 到 mock freshness",
      "NEXT_PUBLIC_DATA_SOURCE"
    ]
  },
  {
    content: runbook,
    file: runbookPath,
    phrases: [
      "DATA_FRESHNESS_SUPABASE_READS=disabled",
      "DATA_FRESHNESS_SUPABASE_READS=enabled",
      "back to mock",
      "freshness read failures must degrade to mock freshness"
    ]
  },
  {
    content: mvpTasks,
    file: mvpTasksPath,
    phrases: ["DATA_FRESHNESS_SUPABASE_READS", "mock fallback gate"]
  }
];

const missing = requiredPhrases
  .filter((phrase) => !source.includes(phrase))
  .map((phrase) => ({ file: sourcePath, phrase }));

const missingDocs = requiredDocPhrases.flatMap((requirement) =>
  requirement.phrases
    .filter((phrase) => !requirement.content.includes(phrase))
    .map((phrase) => ({ file: requirement.file, phrase }))
);

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

const problems = [...missing, ...missingDocs, ...forbidden, ...orderProblems];

console.log(
  JSON.stringify(
    {
      checked_files: [sourcePath, projectStatusPath, runbookPath, mvpTasksPath],
      forbidden,
      missing,
      missingDocs,
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
