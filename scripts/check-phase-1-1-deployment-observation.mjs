import { execFileSync } from "node:child_process";

const WORKFLOW_RUNS_URL =
  "https://api.github.com/repos/flyjem30303/market-signal/actions/workflows/daily-after-close-update.yml/runs?per_page=10";
const PUBLIC_ROUTES = ["https://market-signal-two.vercel.app/", "https://market-signal-two.vercel.app/stocks/2330"];

const expectedMainSha = process.env.PHASE_1_1_EXPECTED_MAIN_SHA || git("rev-parse", "origin/main");

const [workflowRuns, routeChecks] = await Promise.all([fetchWorkflowRuns(), Promise.all(PUBLIC_ROUTES.map(checkRoute))]);
const operationalRuns = workflowRuns.filter((run) => run.event === "schedule" || run.event === "workflow_dispatch");
const latestMainRun = operationalRuns.find((run) => run.head_branch === "main") ?? null;
const latestExpectedRun =
  operationalRuns.find((run) => run.head_branch === "main" && run.head_sha === expectedMainSha) ?? null;
const routeFailures = routeChecks.filter((route) => route.statusCode !== 200);

const status = statusFor({ latestExpectedRun, routeFailures });
const result = {
  expectedMainSha,
  latestExpectedRun: latestExpectedRun ? summarizeRun(latestExpectedRun) : null,
  latestMainRun: latestMainRun ? summarizeRun(latestMainRun) : null,
  publicRoutes: routeChecks,
  ignoredEvents: [...new Set(workflowRuns.map((run) => run.event).filter((event) => event === "push"))].sort(),
  status,
  workflow: "daily-after-close-update.yml"
};

console.log(JSON.stringify(result, null, 2));

if (status === "action_required") {
  process.exitCode = 1;
}

function git(...args) {
  return execFileSync("git", args, { encoding: "utf8" }).trim();
}

async function fetchWorkflowRuns() {
  const response = await fetch(WORKFLOW_RUNS_URL, {
    headers: {
      accept: "application/vnd.github+json",
      "user-agent": "market-signal-phase1.1-deployment-observer/1.0"
    }
  });
  const json = await response.json();
  if (!response.ok) throw new Error(`GitHub workflow runs query failed: ${json?.message ?? response.statusText}`);
  return Array.isArray(json.workflow_runs) ? json.workflow_runs : [];
}

async function checkRoute(url) {
  try {
    const response = await fetch(url, { method: "HEAD" });
    return {
      ok: response.ok,
      statusCode: response.status,
      url
    };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : String(error),
      ok: false,
      statusCode: null,
      url
    };
  }
}

function summarizeRun(run) {
  return {
    conclusion: run.conclusion,
    createdAt: run.created_at,
    event: run.event,
    headSha: run.head_sha,
    htmlUrl: run.html_url,
    runNumber: run.run_number,
    status: run.status,
    updatedAt: run.updated_at
  };
}

function statusFor({ latestExpectedRun, routeFailures }) {
  if (routeFailures.length > 0) return "action_required";
  if (!latestExpectedRun) return "waiting_for_current_main_workflow_run";
  if (latestExpectedRun.status !== "completed") return "waiting_for_current_main_workflow_run";
  return latestExpectedRun.conclusion === "success" ? "ok" : "action_required";
}
