import fs from "node:fs";

const validatorPath = "scripts/validate-supabase-twse-stock-day-staging-readonly.mjs";
const validator = fs.existsSync(validatorPath) ? fs.readFileSync(validatorPath, "utf8") : "";
const normalized = validator.toLowerCase();

const requiredPhrases = [
  "twse_stock_day_staging_readonly_confirmation",
  "twse_stock_day_staging_readonly",
  "missing_explicit_target_confirmation",
  "missing_supabase_environment",
  "createclient",
  "persistsession: false",
  ".from(table).select",
  "head: true",
  "read-only validation",
  "no insert",
  "no upsert",
  "no update",
  "no delete",
  "public data source remains mock",
  "scoresource=real remains disabled"
];

const forbiddenPhrases = [
  ".insert(",
  ".upsert(",
  ".update(",
  ".delete(",
  ".rpc(",
  "insert into",
  "delete from",
  "update public.",
  "truncate",
  "drop table",
  "daily_prices"
];

const missing = requiredPhrases.filter((phrase) => !normalized.includes(phrase));
const forbidden = forbiddenPhrases.filter((phrase) => normalized.includes(phrase));

console.log(
  JSON.stringify(
    {
      forbidden,
      missing,
      status: missing.length === 0 && forbidden.length === 0 ? "ok" : "blocked",
      validator: validatorPath
    },
    null,
    2
  )
);

if (missing.length > 0 || forbidden.length > 0) {
  process.exitCode = 1;
}
