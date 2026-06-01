import fs from "node:fs";
import { spawn } from "node:child_process";
import { localhostContentForbidden, localhostContentHealthChecks } from "./localhost-health-config.mjs";

const node = process.execPath;
const baseUrl = process.env.LOCALHOST_HEALTH_BASE_URL ?? "http://localhost:3000";
const shouldManageServer = process.env.LOCALHOST_HEALTH_MANAGE_SERVER !== "false";
const timeoutMs = Number.parseInt(process.env.LOCALHOST_HEALTH_TIMEOUT_MS ?? "10000", 10);
const retryCount = Number.parseInt(process.env.LOCALHOST_HEALTH_RETRY_COUNT ?? "4", 10);
const retryDelayMs = Number.parseInt(process.env.LOCALHOST_HEALTH_RETRY_DELAY_MS ?? "1500", 10);

const results = [];

const managedServer = shouldManageServer && !(await canFetchRoot()) ? await startTemporaryServer() : null;

try {
  for (const check of localhostContentHealthChecks) {
    results.push(await checkContent(check));
  }

  const failed = results.filter((result) => result.missing.length > 0 || result.blocked.length > 0 || result.statusCode !== 200);

  console.log(
    JSON.stringify(
      {
        baseUrl,
        managedServer: managedServer
          ? {
              command: managedServer.commandLabel,
              started: true
            }
          : {
              started: false
            },
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
} finally {
  if (managedServer) {
    managedServer.child.kill();
  }
}

async function checkContent(check) {
  let lastResult;

  for (let attempt = 1; attempt <= retryCount; attempt += 1) {
    lastResult = await fetchContent(check, attempt);
    if (lastResult.ok) return lastResult;
    await delay(retryDelayMs);
  }

  return lastResult;
}

async function fetchContent(check, attempt) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(new URL(check.path, baseUrl), {
      cache: "no-store",
      signal: controller.signal
    });
    const text = await response.text();
    const missing = check.required.filter((phrase) => !text.includes(phrase));
    const blocked = localhostContentForbidden.filter((phrase) => text.includes(phrase));

    return {
      blocked,
      missing,
      ok: response.ok && missing.length === 0 && blocked.length === 0,
      attempt,
      path: check.path,
      statusCode: response.status
    };
  } catch (error) {
    return {
      blocked: [],
      error: error instanceof Error ? error.message : String(error),
      missing: check.required,
      ok: false,
      attempt,
      path: check.path,
      statusCode: 0
    };
  } finally {
    clearTimeout(timeout);
  }
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function startTemporaryServer() {
  const hasProductionBuild = fs.existsSync(".next/BUILD_ID");
  const args = hasProductionBuild
    ? ["node_modules/next/dist/bin/next", "start", "--hostname", "localhost", "--port", "3000"]
    : ["node_modules/next/dist/bin/next", "dev", "--hostname", "localhost", "--port", "3000"];
  const child = spawn(node, args, {
    cwd: process.cwd(),
    env: normalizeEnv(process.env),
    stdio: "ignore",
    windowsHide: true
  });

  const ready = await waitForRoot();
  if (!ready) {
    child.kill();
    throw new Error("temporary localhost server did not become ready");
  }

  return {
    child,
    commandLabel: hasProductionBuild ? "next start" : "next dev"
  };
}

async function waitForRoot() {
  for (let attempt = 1; attempt <= 30; attempt += 1) {
    if (await canFetchRoot()) return true;
    await delay(1000);
  }

  return false;
}

async function canFetchRoot() {
  try {
    const response = await fetch(new URL("/", baseUrl), { cache: "no-store" });
    return response.status === 200;
  } catch {
    return false;
  }
}

function normalizeEnv(env) {
  const next = { ...env };
  if (next.Path && next.PATH) {
    delete next.PATH;
  }
  return next;
}
