const baseUrl = process.env.LOCALHOST_HEALTH_BASE_URL ?? "http://localhost:3000";
const timeoutMs = Number.parseInt(process.env.LOCALHOST_HEALTH_TIMEOUT_MS ?? "10000", 10);
const paths = ["/", "/stocks/2330", "/briefing", "/robots.txt"];

const results = [];

for (const path of paths) {
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
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(new URL(path, baseUrl), {
      cache: "no-store",
      signal: controller.signal
    });

    return {
      ok: response.ok,
      path,
      statusCode: response.status
    };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : String(error),
      ok: false,
      path,
      statusCode: 0
    };
  } finally {
    clearTimeout(timeout);
  }
}
