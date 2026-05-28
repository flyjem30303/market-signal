import fs from "node:fs";

const requiredEnvKeys = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  "SUPABASE_SERVICE_ROLE_KEY",
  "NEXT_PUBLIC_DATA_SOURCE",
  "DATA_FRESHNESS_SOURCE",
  "NEXT_PUBLIC_SITE_URL",
];

const requiredFiles = ["supabase/bootstrap.sql", ".env.local"];

function parseEnvFile(path) {
  if (!fs.existsSync(path)) return null;

  return Object.fromEntries(
    fs
      .readFileSync(path, "utf8")
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith("#"))
      .map((line) => {
        const index = line.indexOf("=");
        return index === -1 ? [line, ""] : [line.slice(0, index), line.slice(index + 1)];
      }),
  );
}

const env = parseEnvFile(".env.local");
const fileStatus = Object.fromEntries(requiredFiles.map((file) => [file, fs.existsSync(file)]));
const missingEnv = env ? requiredEnvKeys.filter((key) => !env[key]) : requiredEnvKeys;
const warnings = [];

if (env?.NEXT_PUBLIC_DATA_SOURCE && env.NEXT_PUBLIC_DATA_SOURCE !== "mock") {
  warnings.push("NEXT_PUBLIC_DATA_SOURCE should remain mock until a checkpoint approves switching.");
}

if (env?.DATA_FRESHNESS_SOURCE && env.DATA_FRESHNESS_SOURCE !== "mock") {
  warnings.push("DATA_FRESHNESS_SOURCE should remain mock until db:freshness passes.");
}

const status = {
  files: fileStatus,
  missing_env: missingEnv,
  ready_for_db_validate: Boolean(fileStatus["supabase/bootstrap.sql"] && fileStatus[".env.local"] && missingEnv.length === 0),
  recommended_next_commands:
    fileStatus[".env.local"] && missingEnv.length === 0
      ? ["npm run db:validate", "npm run db:freshness", "npm run db:raw-market"]
      : ["create .env.local from docs/SUPABASE_EXECUTION_RUNBOOK.md"],
  status: fileStatus["supabase/bootstrap.sql"] && fileStatus[".env.local"] && missingEnv.length === 0 ? "ok" : "blocked",
  warnings,
};

console.log(JSON.stringify(status, null, 2));

if (status.status !== "ok") {
  process.exitCode = 1;
}
