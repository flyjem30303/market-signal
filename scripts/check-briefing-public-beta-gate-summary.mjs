import fs from "node:fs";
import { localhostContentForbidden } from "./localhost-health-config.mjs";

const baseUrl = process.env.LOCALHOST_BASE_URL ?? "http://localhost:3000";
const pagePath = "src/app/briefing/page.tsx";
const componentPath = "src/components/briefing-public-beta-gate-summary.tsx";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";

const requiredVisiblePhrases = [
  "公開 Beta 使用狀態",
  "公開頁可用",
  "資料品質需持續複核",
  "會員功能規劃中"
];

const forbiddenVisiblePhrases = [
  ...localhostContentForbidden,
  "publicDataSource",
  "scoreSource",
  "Object reachability",
  "investment advice",
  "claimApproval",
  "mock_runtime_hardening",
  "Remote guard details: CEO-named one-attempt only",
  "Supabase readonly evidence gate",
  "Runner decision /",
  "Execution gate /",
  "Narrow Approval"
];

const removedBriefingPanels = [
  "ProjectProgressPanel",
  "RuntimeReadinessPanel",
  "BriefingRowCoverageStatus",
  "SourceDepthBlockerPanel",
  "BlockerReadinessPanel",
  "NarrowApprovalOutcomePanel"
];

const requiredComponentPhrases = [
  "BriefingPublicBetaGateSummary",
  "公開 Beta 使用狀態",
  "30 秒可讀",
  "3 分鐘判斷",
  "示範資料",
  "會員下一階段",
  "不提供個股買賣建議"
];

const missing = [];
const blocked = [];

for (const file of [pagePath, componentPath, packagePath, reviewGatePath]) {
  if (!fs.existsSync(file)) missing.push(`${file}: file exists`);
}

const response = await fetch(`${baseUrl}/briefing`);
const html = await response.text();
const visibleText = normalizeVisibleText(html);

if (response.status !== 200) {
  blocked.push(`/briefing: expected HTTP 200 but received ${response.status}`);
}

for (const phrase of requiredVisiblePhrases) {
  if (!visibleText.includes(phrase)) missing.push(`/briefing visible text: ${phrase}`);
}

for (const phrase of forbiddenVisiblePhrases) {
  if (visibleText.includes(phrase)) blocked.push(`/briefing visible text exposes internal/forbidden phrase: ${phrase}`);
}

const pageSource = fs.existsSync(pagePath) ? fs.readFileSync(pagePath, "utf8") : "";
const componentSource = fs.existsSync(componentPath) ? fs.readFileSync(componentPath, "utf8") : "";
const packageSource = fs.existsSync(packagePath) ? fs.readFileSync(packagePath, "utf8") : "";
const reviewGateSource = fs.existsSync(reviewGatePath) ? fs.readFileSync(reviewGatePath, "utf8") : "";

for (const panel of removedBriefingPanels) {
  if (pageSource.includes(panel)) blocked.push(`${pagePath}: old internal briefing panel still imported/rendered: ${panel}`);
}

for (const phrase of requiredComponentPhrases) {
  if (!componentSource.includes(phrase)) missing.push(`${componentPath}: ${phrase}`);
}

if (!pageSource.includes("PublicBetaPublicStatusSurface")) {
  missing.push(`${pagePath}: PublicBetaPublicStatusSurface`);
}

if (!packageSource.includes('"check:briefing-public-beta-gate-summary": "node scripts/check-briefing-public-beta-gate-summary.mjs"')) {
  missing.push(`${packagePath}: check:briefing-public-beta-gate-summary`);
}

if (!reviewGateSource.includes("scripts/check-briefing-public-beta-gate-summary.mjs")) {
  missing.push(`${reviewGatePath}: scripts/check-briefing-public-beta-gate-summary.mjs`);
}

if (!reviewGateSource.includes('"briefing-public-beta-gate-summary"')) {
  missing.push(`${reviewGatePath}: briefing-public-beta-gate-summary`);
}

console.log(JSON.stringify({ blocked, missing, status: missing.length === 0 && blocked.length === 0 ? "ok" : "blocked" }, null, 2));

if (missing.length > 0 || blocked.length > 0) process.exitCode = 1;

function normalizeVisibleText(htmlText) {
  return htmlText
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#x27;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, " ")
    .trim();
}
