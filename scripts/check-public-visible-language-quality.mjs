import fs from "node:fs";
import { localhostContentHealthChecks, localhostStatusHealthPaths } from "./localhost-health-config.mjs";

const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const checkerPath = "scripts/check-public-visible-language-quality.mjs";
const publicBetaReadinessDataPath = "src/lib/public-beta-launch-readiness.ts";
const publicBetaReadinessPanelPath = "src/components/public-beta-launch-readiness-panel.tsx";
const baseUrl = process.env.LOCALHOST_BASE_URL ?? "http://localhost:3000";

const coreRuntimeBoundaryRequired = ["mock", "publicDataSource=mock", "scoreSource=mock"];

const pages = [
  {
    path: "/",
    forbidden: [
      "CEO",
      "PM ",
      "A1",
      "A2",
      "readonly-attempt",
      "post-run",
      "preflight",
      "packet",
      "operator",
      "Allowed:",
      "Next gate:",
      "execution signal",
      "Market breadth:"
    ],
    required: [
      ...coreRuntimeBoundaryRequired,
      "Public Beta Index Dashboard",
      "全市場總覽",
      "核心指標面板",
      "警示清單",
      "30 秒看懂市場氛圍",
      "下一步建議",
      "資料真實化路徑",
      "覆蓋範圍",
      "來源與權利",
      "Runtime promotion",
      "Coverage Rollout Plan",
      "Batch 1：TWII + 核心 ETF",
      "Coverage sufficiency",
      "Trust and legal disclosure",
      "Next Data Step",
      "先把大盤與核心 ETF 變成可驗證資料",
      "先補大盤基準",
      "保持資料邊界清楚"
    ]
  },
  {
    path: "/stocks/TWII",
    required: [...coreRuntimeBoundaryRequired, "TWII Mock Disclosure"]
  },
  {
    path: "/stocks/2330",
    required: [...coreRuntimeBoundaryRequired, "Indicator Roadmap"]
  },
  {
    path: "/stocks/0050",
    required: [...coreRuntimeBoundaryRequired, "Indicator Roadmap"]
  },
  {
    path: "/stocks/006208",
    required: [...coreRuntimeBoundaryRequired, "Indicator Roadmap"]
  },
  {
    path: "/stocks/2382",
    required: [...coreRuntimeBoundaryRequired, "Indicator Roadmap"]
  },
  {
    path: "/stocks/2308",
    required: [...coreRuntimeBoundaryRequired, "Indicator Roadmap"]
  },
  {
    path: "/briefing",
    forbidden: [
      "CEO",
      "PM ",
      "A1",
      "A2",
      "readonly-attempt",
      "post-run",
      "preflight",
      "packet",
      "operator",
      "Allowed:",
      "Next gate:",
      "execution signal",
      "Market breadth:"
    ],
    required: [
      "Market Briefing",
      "市場訊號晨報",
      "市場錨點",
      "風險焦點",
      "資料邊界",
      "mock-only",
      "publicDataSource=mock",
      "scoreSource=mock",
      "不是投資建議",
      "關注",
      "加強觀察",
      "降低風險",
      "資料真實化路徑",
      "覆蓋範圍",
      "來源與權利",
      "Runtime promotion",
      "Coverage Rollout Plan",
      "Batch 1：TWII + 核心 ETF",
      "Coverage sufficiency",
      "Trust and legal disclosure",
      "Batch 1 Readiness",
      "Field contract",
      "Readonly / write gates",
      "資料升級安全線",
      "Batch 1 只讀診斷結果",
      "只讀診斷目的",
      "已完成一次只讀診斷",
      "只有彙總證據",
      "目前只確認彙總覆蓋率",
      "寫入、回補與真實分數升級仍關閉",
      "寫入與升級鎖定"
    ]
  },
  {
    path: "/weekly",
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
      "acceptedCount: 111",
      "unresolvedCount: 0",
      "Safeguard ready; no unresolved worktree items",
      "not a current public Beta hard blocker",
      "publicDataSource: \"mock\"",
      "scoreSource: \"mock\""
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

const results = await Promise.all(pages.map(async (page) => {
  const response = await fetch(`${baseUrl}${page.path}`);
  const html = await response.text();
  const text = normalizeVisibleText(html);
  const markerHits = findMojibakeMarkers(text);
  const pageForbidden = [...forbiddenText, ...(page.forbidden ?? [])];
  const forbiddenHits = pageForbidden.filter((fragment) => text.includes(fragment));
  const missing = page.required.filter((phrase) => !text.includes(phrase));

  return {
    forbiddenHits,
    markerHits,
    missing,
    pass: response.status === 200 && markerHits.length === 0 && forbiddenHits.length === 0 && missing.length === 0,
    path: page.path,
    status: response.status
  };
}));

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

const registration = [
  {
    file: packagePath,
    pass: packageJson.includes('"check:public-visible-language-quality": "node scripts/check-public-visible-language-quality.mjs"')
  },
  {
    file: reviewGatePath,
    pass: reviewGate.includes("scripts/check-public-visible-language-quality.mjs")
  }
];
const routeAlignment = expectedVisiblePaths.map((path) => ({
  pass: visiblePagePaths.includes(path),
  path
}));
const selfContract = [
  {
    check: "requires publicDataSource mock",
    pass: checkerSource.includes('"publicDataSource=mock"')
  },
  {
    check: "requires scoreSource mock",
    pass: checkerSource.includes('"scoreSource=mock"')
  },
  {
    check: "blocks approved scoreSource real claims",
    pass: checkerSource.includes('"scoreSource=real approved"')
  },
  {
    check: "blocks approved publicDataSource supabase claims",
    pass: checkerSource.includes('"publicDataSource=supabase approved"')
  },
  {
    check: "requires readable legal pages",
    pass:
      checkerSource.includes('"Investment and data limits"') &&
      checkerSource.includes('"Terms of use"') &&
      checkerSource.includes('"Privacy and data boundary"')
  },
  {
    check: "checker source avoids mojibake literals",
    pass: !hasPrivateUseCodePoint(checkerSource) && !hasCommonMojibakeRun(checkerSource)
  },
  {
    check: "aligns with localhost health paths",
    pass: checkerSource.includes("localhostStatusHealthPaths") && checkerSource.includes("localhostContentHealthChecks")
  },
  {
    check: "guards public beta launch readiness copy",
    pass:
      checkerSource.includes(publicBetaReadinessDataPath) &&
      checkerSource.includes(publicBetaReadinessPanelPath) &&
      checkerSource.includes("Public Beta pre-launch executable state")
  }
];

const failed = results.filter((result) => !result.pass);
const registrationFailed = registration.filter((result) => !result.pass);
const routeAlignmentFailed = routeAlignment.filter((result) => !result.pass);
const selfContractFailed = selfContract.filter((result) => !result.pass);
const sourceReadabilityFailed = sourceReadability.filter((result) => !result.pass);

console.log(
  JSON.stringify(
    {
      registration,
      results,
      routeAlignment,
      selfContract,
      sourceReadability,
      status:
        failed.length === 0 &&
        registrationFailed.length === 0 &&
        routeAlignmentFailed.length === 0 &&
        selfContractFailed.length === 0 &&
        sourceReadabilityFailed.length === 0
          ? "ok"
          : "blocked"
    },
    null,
    2
  )
);

if (
  failed.length > 0 ||
  registrationFailed.length > 0 ||
  routeAlignmentFailed.length > 0 ||
  selfContractFailed.length > 0 ||
  sourceReadabilityFailed.length > 0
) {
  process.exitCode = 1;
}

function normalizeVisibleText(html) {
  return html
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

function findMojibakeMarkers(text) {
  const markers = [];
  if (text.includes("\uFFFD")) markers.push("replacement-char");
  if (/\?{2,}/u.test(text)) markers.push("question-mark-run");
  if (hasPrivateUseCodePoint(text)) markers.push("private-use-code-point");
  if (hasCommonMojibakeRun(text)) markers.push("common-mojibake-run");
  return markers;
}

function hasCommonMojibakeRun(text) {
  const commonMojibakeCodePoints = [
    0x5697, 0x929d, 0x876d, 0x619f, 0x7485, 0x9788, 0x64a3,
    0x95ae, 0x7625, 0x6468, 0x7508, 0x96ff, 0x8e50, 0x8e53
  ];
  let runLength = 0;
  for (const char of text) {
    const codePoint = char.codePointAt(0) ?? 0;
    if (commonMojibakeCodePoints.includes(codePoint)) {
      runLength += 1;
      if (runLength >= 2) return true;
    } else {
      runLength = 0;
    }
  }
  return false;
}

function hasPrivateUseCodePoint(text) {
  for (const char of text) {
    const codePoint = char.codePointAt(0) ?? 0;
    if (codePoint >= 0xe000 && codePoint <= 0xf8ff) return true;
  }
  return false;
}

function unique(values) {
  return [...new Set(values)];
}
