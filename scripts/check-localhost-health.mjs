import { localhostStatusHealthPaths } from "./localhost-health-config.mjs";

const baseUrl = process.env.LOCALHOST_HEALTH_BASE_URL ?? "http://localhost:3000";
const timeoutMs = Number.parseInt(process.env.LOCALHOST_HEALTH_TIMEOUT_MS ?? "10000", 10);
const retryCount = Number.parseInt(process.env.LOCALHOST_HEALTH_RETRY_COUNT ?? "4", 10);
const retryDelayMs = Number.parseInt(process.env.LOCALHOST_HEALTH_RETRY_DELAY_MS ?? "1500", 10);

const results = [];

for (const path of localhostStatusHealthPaths) {
  results.push(await checkPath(path));
}

const failed = results.filter((result) => result.statusCode !== 200);

console.log(
  JSON.stringify(
    {
      baseUrl,
      recoveryHint:
        "If pages return 500 after next build, run scripts/recover-next-dev-server.ps1 from the project root.",
      results,
      status: failed.length === 0 ? "ok" : "blocked"
    },
    null,
    2
  )
);

if (failed.length > 0) {
  process.exitCode = 1;
}

async function checkPath(path) {
  let lastResult;

  for (let attempt = 1; attempt <= retryCount; attempt += 1) {
    lastResult = await fetchPath(path, attempt);
    if (lastResult.statusCode === 200) return lastResult;
    await delay(retryDelayMs);
  }

  return lastResult;
}

async function fetchPath(path, attempt) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(new URL(path, baseUrl), {
      cache: "no-store",
      signal: controller.signal
    });

    return {
      ok: response.ok,
      attempt,
      path,
      statusCode: response.status
    };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : String(error),
      ok: false,
      attempt,
      path,
      statusCode: 0
    };
  } finally {
    clearTimeout(timeout);
  }
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
