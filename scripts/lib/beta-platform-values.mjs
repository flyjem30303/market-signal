import fs from "node:fs";

const ALLOWED_KEYS = ["BETA_HOSTING_PROJECT_NAME", "BETA_TEMPORARY_URL"];

export function loadBetaPlatformValues(env = process.env) {
  const dotEnvValues = loadLocalBetaValues(env);
  const values = {
    BETA_HOSTING_PROJECT_NAME: (env.BETA_HOSTING_PROJECT_NAME ?? dotEnvValues.BETA_HOSTING_PROJECT_NAME ?? "").trim(),
    BETA_TEMPORARY_URL: (env.BETA_TEMPORARY_URL ?? dotEnvValues.BETA_TEMPORARY_URL ?? "").trim()
  };

  return {
    ...values,
    loadedFromEnvLocal:
      Boolean(dotEnvValues.BETA_HOSTING_PROJECT_NAME || dotEnvValues.BETA_TEMPORARY_URL) &&
      (!env.BETA_HOSTING_PROJECT_NAME || !env.BETA_TEMPORARY_URL)
  };
}

export function betaPlatformValuesEnv(env = process.env) {
  const values = loadBetaPlatformValues(env);
  return {
    ...env,
    BETA_HOSTING_PROJECT_NAME: values.BETA_HOSTING_PROJECT_NAME,
    BETA_TEMPORARY_URL: values.BETA_TEMPORARY_URL
  };
}

function loadLocalBetaValues(env) {
  if (env.BETA_PLATFORM_VALUES_SKIP_DOTENV === "1") return {};
  const filePath = ".env.local";
  if (!fs.existsSync(filePath)) return {};

  const values = {};
  const content = fs.readFileSync(filePath, "utf8");
  for (const line of content.split(/\r?\n/u)) {
    const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/u);
    if (!match) continue;

    const [, key, rawValue] = match;
    if (!ALLOWED_KEYS.includes(key)) continue;
    values[key] = normalizeEnvValue(rawValue);
  }

  return values;
}

function normalizeEnvValue(rawValue) {
  const trimmed = rawValue.trim();
  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1).trim();
  }

  const commentIndex = trimmed.search(/\s+#/u);
  return (commentIndex >= 0 ? trimmed.slice(0, commentIndex) : trimmed).trim();
}
