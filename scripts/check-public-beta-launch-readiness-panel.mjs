import fs from "node:fs";
import http from "node:http";

const problems = [];
const componentPath = "src/components/public-beta-launch-readiness-panel.tsx";
const dataPath = "src/lib/public-beta-launch-readiness.ts";
const dashboardPath = "src/components/dashboard-shell.tsx";
const briefingPath = "src/app/briefing/page.tsx";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const baseUrl = process.env.LOCALHOST_BASE_URL ?? "http://localhost:3000";

const component = read(componentPath);
const data = read(dataPath);
const dashboard = read(dashboardPath);
const briefing = read(briefingPath);
const pkg = JSON.parse(read(packagePath));
const reviewGate = read(reviewGatePath);

for (const [filePath, source, phrase] of [
  [componentPath, component, "PublicBetaLaunchReadinessPanel"],
  [componentPath, component, "Public Beta launch readiness"],
  [dataPath, data, "getPublicBetaLaunchReadinessSummary"],
  [dataPath, data, "Public Beta pre-launch executable state"],
  [packagePath, JSON.stringify(pkg), "check:public-beta-launch-readiness-panel"],
  [reviewGatePath, reviewGate, 'name: "public-beta-launch-readiness-panel"']
]) {
  if (!source.includes(phrase)) problems.push(`${filePath} missing phrase: ${phrase}`);
}

for (const [filePath, source, phrase] of [
  [dashboardPath, dashboard, "import { PublicBetaLaunchReadinessPanel }"],
  [dashboardPath, dashboard, "<PublicBetaLaunchReadinessPanel compact />"],
  [briefingPath, briefing, "import { PublicBetaLaunchReadinessPanel }"],
  [briefingPath, briefing, "<PublicBetaLaunchReadinessPanel />"]
]) {
  if (source.includes(phrase)) problems.push(`${filePath} should not expose internal launch readiness panel: ${phrase}`);
}

for (const route of ["/", "/briefing"]) {
  const html = await fetchText(`${baseUrl}${route}`);
  for (const phrase of [
    "Public Beta pre-launch executable state",
    "Current hard blockers",
    "Remaining hard blockers",
    "External reply dry-run intake",
    "BETA_HOSTING_PROJECT_NAME",
    "BETA_TEMPORARY_URL",
    "PUBLIC_BETA_EXTERNAL_REPLY_PATH",
    "cmd.exe /c npm run report:public-beta-external-input-request",
    "cmd.exe /c npm run run:public-beta-post-reply-route-once",
    "A1 fail-fast policy",
    "Single reply checklist"
  ]) {
    if (html.includes(phrase)) problems.push(`${route} should not render internal launch-readiness marker: ${phrase}`);
  }
}

if (pkg.scripts?.["check:public-beta-launch-readiness-panel"] !== "node scripts/check-public-beta-launch-readiness-panel.mjs") {
  problems.push(`${packagePath} missing check:public-beta-launch-readiness-panel`);
}

for (const [filePath, source] of [
  [componentPath, component],
  [dataPath, data]
]) {
  for (const pattern of forbiddenPatterns()) {
    if (pattern.test(source)) problems.push(`${filePath} forbidden pattern ${String(pattern)}`);
  }
}

if (problems.length > 0) {
  console.error(JSON.stringify({ status: "blocked", problems }, null, 2));
  process.exit(1);
}

console.log(JSON.stringify({
  status: "ok",
  guardedStatus: "public_beta_launch_readiness_panel_removed_from_public_routes",
  publicRoutes: ["/", "/briefing"],
  retainedInternalComponent: componentPath,
  publicDataSource: "mock",
  scoreSource: "mock"
}, null, 2));

function read(filePath) {
  return fs.readFileSync(filePath, "utf8");
}

function fetchText(url) {
  return new Promise((resolve, reject) => {
    const request = http.get(url, (response) => {
      let body = "";
      response.setEncoding("utf8");
      response.on("data", (chunk) => {
        body += chunk;
      });
      response.on("end", () => {
        if ((response.statusCode ?? 500) >= 400) {
          reject(new Error(`${url} returned ${response.statusCode}`));
          return;
        }
        resolve(body);
      });
    });
    request.on("error", reject);
    request.setTimeout(20000, () => {
      request.destroy(new Error(`${url} timed out`));
    });
  });
}

function forbiddenPatterns() {
  return [/from\s+["']@supabase\/supabase-js["']/, /createClient\s*\(/, /\.from\s*\(/, /\.insert\s*\(/, /\.upsert\s*\(/, /\.update\s*\(/, /\.delete\s*\(/, /scoreSource\s*[:=]\s*["']real["']/, /publicDataSource\s*[:=]\s*["']supabase["']/];
}
