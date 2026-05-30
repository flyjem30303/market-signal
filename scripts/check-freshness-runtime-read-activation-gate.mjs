import fs from "node:fs";

const requirements = [
  {
    file: "src/lib/data-freshness-source.ts",
    phrases: [
      "process.env.DATA_FRESHNESS_SOURCE ?? \"mock\"",
      "process.env.DATA_FRESHNESS_SUPABASE_READS === \"enabled\" ? \"enabled\" : \"disabled\"",
      "createFreshnessRepository({",
      "return repository.getSnapshot();"
    ]
  },
  {
    file: "src/lib/repositories/freshness-repository.ts",
    phrases: [
      "source !== \"supabase\" || supabaseRuntimeReads !== \"enabled\"",
      "return buildMockDataFreshnessSnapshot();",
      "} catch {"
    ]
  },
  {
    file: ".env.example",
    phrases: [
      "DATA_FRESHNESS_SOURCE=mock",
      "DATA_FRESHNESS_SUPABASE_READS=disabled",
      "bounded runtime-read checkpoint"
    ]
  },
  {
    file: "docs/SUPABASE_EXECUTION_RUNBOOK.md",
    phrases: [
      "Runtime Freshness Read Activation Gate",
      "one bounded runtime-read checkpoint",
      "DATA_FRESHNESS_SOURCE=supabase",
      "DATA_FRESHNESS_SUPABASE_READS=enabled",
      "NEXT_PUBLIC_DATA_SOURCE=mock",
      "fallback to mock freshness"
    ]
  },
  {
    file: "docs/MVP_TASKS.md",
    phrases: [
      "freshness runtime-read activation gate",
      "DATA_FRESHNESS_SUPABASE_READS=enabled",
      "fallback to mock"
    ]
  }
];

const forbidden = [
  {
    file: "src/lib/repositories/freshness-repository.ts",
    phrases: ["scoreSource: \"real\"", "scoreSource=real", "throw error;"]
  },
  {
    file: "docs/SUPABASE_EXECUTION_RUNBOOK.md",
    phrases: [
      "set NEXT_PUBLIC_DATA_SOURCE=supabase with DATA_FRESHNESS_SUPABASE_READS=enabled",
      "enable DATA_FRESHNESS_SUPABASE_READS without CEO checkpoint"
    ]
  }
];

const missing = requirements.flatMap((requirement) => {
  const content = fs.readFileSync(requirement.file, "utf8");
  return requirement.phrases
    .filter((phrase) => !content.includes(phrase))
    .map((phrase) => ({ file: requirement.file, phrase }));
});

const forbiddenFound = forbidden.flatMap((requirement) => {
  const content = fs.readFileSync(requirement.file, "utf8");
  return requirement.phrases
    .filter((phrase) => content.includes(phrase))
    .map((phrase) => ({ file: requirement.file, phrase }));
});

const problems = [...missing, ...forbiddenFound];

console.log(
  JSON.stringify(
    {
      checked_files: requirements.map((requirement) => requirement.file),
      forbidden: forbiddenFound,
      missing,
      status: problems.length === 0 ? "ok" : "blocked"
    },
    null,
    2
  )
);

if (problems.length > 0) {
  process.exitCode = 1;
}
