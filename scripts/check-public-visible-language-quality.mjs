import fs from "node:fs";
import { localhostContentHealthChecks, localhostStatusHealthPaths } from "./localhost-health-config.mjs";

const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const checkerPath = "scripts/check-public-visible-language-quality.mjs";
const publicBetaReadinessDataPath = "src/lib/public-beta-launch-readiness.ts";
const publicBetaReadinessPanelPath = "src/components/public-beta-launch-readiness-panel.tsx";
const baseUrl = process.env.LOCALHOST_BASE_URL ?? "http://localhost:3000";

const coreRuntimeBoundaryRequired = ["mock", "publicDataSource=mock", "scoreSource=mock"];
const publicOperationsForbidden = [
  "Current hard blockers",
  "Remaining hard blockers",
  "External reply dry-run intake",
  "BETA_HOSTING_PROJECT_NAME",
  "BETA_TEMPORARY_URL",
  "PUBLIC_BETA_EXTERNAL_REPLY_PATH",
  "cmd.exe /c npm run report:public-beta-external-input-request",
  "cmd.exe /c npm run run:public-beta-post-reply-route-once",
  "A1 fail-fast policy",
  "Single reply checklist",
  "readonly-attempt",
  "post-run",
  "preflight",
  "packet",
  "operator"
];

const pages = [
  {
    path: "/",
    forbidden: publicOperationsForbidden,
    required: [
      ...coreRuntimeBoundaryRequired,
      "Public Beta Index Dashboard",
      "30 秒看懂市場氛圍",
      "3 分鐘決定關注",
      "全市場總覽",
      "核心指標面板",
      "警示清單"
    ]
  },
  {
    path: "/stocks/TWII",
    forbidden: publicOperationsForbidden,
    required: [...coreRuntimeBoundaryRequired, "TWII Mock Disclosure"]
  },
  {
    path: "/stocks/2330",
    forbidden: publicOperationsForbidden,
    required: [...coreRuntimeBoundaryRequired, "Indicator Roadmap"]
  },
  {
    path: "/stocks/0050",
    forbidden: publicOperationsForbidden,
    required: [...coreRuntimeBoundaryRequired, "Indicator Roadmap"]
  },
  {
    path: "/stocks/006208",
    forbidden: publicOperationsForbidden,
    required: [...coreRuntimeBoundaryRequired, "Indicator Roadmap"]
  },
  {
    path: "/stocks/2382",
    forbidden: publicOperationsForbidden,
    required: [...coreRuntimeBoundaryRequired, "Indicator Roadmap"]
  },
  {
    path: "/stocks/2308",
    forbidden: publicOperationsForbidden,
    required: [...coreRuntimeBoundaryRequired, "Indicator Roadmap"]
  },
  {
    path: "/briefing",
    forbidden: publicOperationsForbidden,
    required: [
      ...coreRuntimeBoundaryRequired,
      "Market Briefing",
      "市場訊號晨報",
      "30 秒看懂今日市場氣氛",
      "3 分鐘判讀流程",
      "市場氛圍",
      "主要市場警示",
      "成因",
      "更新時間",
      "影響級別",
      "下一步",
      "資料邊界",
      "不提供買賣建議",
      "不是即時真實資料",
      "真實資料尚未上線",
      "partial coverage",
      "missing/delayed data",
      "重要揭露",
      "Market Action Summary",
      "Model Boundary",
      "Briefing Playbook",
      "下一步閱讀"
    ]
  },
  {
    path: "/weekly",
    forbidden: publicOperationsForbidden,
    required: [...coreRuntimeBoundaryRequired, "Weekly boundary", "data freshness metadata"]
  },
  {
    path: "/methodology",
    required: [...coreRuntimeBoundaryRequired, "Methodology", "mock scores"]
  },
  {
    path: "/disclaimer",
    required: [...coreRuntimeBoundaryRequired, "Investment and data limits", "not investment advice", "data freshness metadata"]
  },
  {
    path: "/terms",
    required: [...coreRuntimeBoundaryRequired, "Terms of use", "mock-only", "data freshness metadata"]
  },
  {
    path: "/privacy",
    required: [...coreRuntimeBoundaryRequired, "Privacy and data boundary", "raw market payloads"]
  }
];

const visiblePagePaths = pages.map((page) => page.path);
const expectedVisiblePaths = unique([
  ...localhostStatusHealthPaths.filter((path) => path !== "/robots.txt"),
  ...localhostContentHealthChecks.map((check) => check.path),
  "/methodology",
  "/disclaimer",
  "/terms",
  "/privacy"
]);

const forbiddenText = [
  "Internal Server Error",
  "ERR_CONNECTION_REFUSED",
  "Visible now: real",
  "Visible now: supabase",
  "scoreSource=real approved",
  "publicDataSource=supabase approved",
  "claimApproval=approved",
  "Public Beta pre-launch executable state",
  ...publicOperationsForbidden
];

const sourceReadabilityTargets = [
  {
    path: publicBetaReadinessDataPath,
    required: [
      "Public Beta pre-launch executable state",
      "cmd.exe /c npm run report:public-beta-external-input-request",
      "cmd.exe /c npm run run:public-beta-post-reply-route-once",
      "BETA_HOSTING_PROJECT_NAME",
      "BETA_TEMPORARY_URL",
      "Data readiness frontier",
      "Runtime route health",
      "A1 data/source-rights frontier",
      "Public trust copy",
      "Mock / real boundary",
      "Beta platform values",
      'publicDataSource: "mock"',
      'scoreSource: "mock"'
    ]
  },
  {
    path: publicBetaReadinessPanelPath,
    required: [
      "Public Beta launch readiness",
      "Remaining hard blockers",
      "Beta platform value reply format",
      "A1 TWII no-secret evidence reply format"
    ]
  }
];

const results = await Promise.all(
  pages.map(async (page) => {
    const response = await fetch(`${baseUrl}${page.path}`);
    const html = await response.text();
    const text = normalizeVisibleText(html);
    const markerHits = findMojibakeMarkers(text);
    const pageForbidden = [...forbiddenText, ...(page.forbidden ?? [])];
    const forbiddenHits = unique(pageForbidden.filter((fragment) => text.includes(fragment)));
    const missing = page.required.filter((phrase) => !text.includes(phrase));

    return {
      forbiddenHits,
      markerHits,
      missing,
      pass: response.status === 200 && markerHits.length === 0 && forbiddenHits.length === 0 && missing.length === 0,
      path: page.path,
      status: response.status
    };
  })
);

const packageJson = fs.readFileSync(packagePath, "utf8");
const reviewGate = fs.readFileSync(reviewGatePath, "utf8");
const checkerSource = fs.readFileSync(checkerPath, "utf8");
const sourceReadability = sourceReadabilityTargets.map((target) => {
  const source = fs.readFileSync(target.path, "utf8");
  const markerHits = findMojibakeMarkers(source);
  const missing = target.required.filter((phrase) => !source.includes(phrase));

  return {
    markerHits,
    missing,
    pass: markerHits.length === 0 && missing.length === 0,
    path: target.path
  };
});

const routeAlignment = expectedVisiblePaths.map((path) => ({ pass: visiblePagePaths.includes(path), path }));
const registration = [
  {
    file: packagePath,
    pass: packageJson.includes("\"check:public-visible-language-quality\"")
  },
  {
    file: reviewGatePath,
    pass: reviewGate.includes("check-public-visible-language-quality.mjs")
  }
];

const selfContract = [
  {
    check: "requires publicDataSource mock",
    pass: checkerSource.includes("publicDataSource=mock")
  },
  {
    check: "requires scoreSource mock",
    pass: checkerSource.includes("scoreSource=mock")
  },
  {
    check: "blocks approved scoreSource real claims",
    pass: checkerSource.includes("scoreSource=real approved")
  },
  {
    check: "blocks approved publicDataSource supabase claims",
    pass: checkerSource.includes("publicDataSource=supabase approved")
  },
  {
    check: "requires readable public beta brief copy",
    pass:
      checkerSource.includes("30 秒看懂今日市場氣氛") &&
      checkerSource.includes("3 分鐘判讀流程") &&
      checkerSource.includes("重要揭露")
  },
  {
    check: "requires readable legal pages",
    pass: checkerSource.includes("Investment and data limits") && checkerSource.includes("Terms of use")
  },
  {
    check: "checker source avoids mojibake literals",
    pass: findMojibakeMarkers(checkerSource).length === 0
  },
  {
    check: "aligns with localhost health paths",
    pass: routeAlignment.every((item) => item.pass)
  },
  {
    check: "guards public beta launch readiness copy",
    pass: sourceReadability.every((item) => item.pass)
  }
];

const output = {
  registration,
  results,
  routeAlignment,
  selfContract,
  sourceReadability,
  status:
    registration.every((item) => item.pass) &&
    results.every((item) => item.pass) &&
    routeAlignment.every((item) => item.pass) &&
    selfContract.every((item) => item.pass) &&
    sourceReadability.every((item) => item.pass)
      ? "ok"
      : "blocked"
};

console.log(JSON.stringify(output, null, 2));

if (output.status !== "ok") process.exitCode = 1;

function normalizeVisibleText(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function findMojibakeMarkers(text) {
  const markers = [];
  if (/[\uE000-\uF8FF\uFFFD]/u.test(text)) markers.push("private-use-or-replacement-code-point");
  if (/\?{3,}/u.test(text)) markers.push("question-mark-run");
  return markers;
}

function unique(items) {
  return [...new Set(items)];
}
