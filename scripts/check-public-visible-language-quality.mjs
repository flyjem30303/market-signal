import fs from "node:fs";
import { localhostContentHealthChecks, localhostStatusHealthPaths } from "./localhost-health-config.mjs";

const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const checkerPath = "scripts/check-public-visible-language-quality.mjs";
const baseUrl = process.env.LOCALHOST_BASE_URL ?? "http://localhost:3000";

const coreRuntimeBoundaryRequired = ["mock", "publicDataSource=mock", "scoreSource=mock"];
const publicOperationsForbidden = [
  "Current hard blockers",
  "Remaining hard blockers",
  "External reply dry-run intake",
  "BETA_HOSTING_PROJECT_NAME",
  "BETA_TEMPORARY_URL",
  "PUBLIC_BETA_EXTERNAL_REPLY_PATH",
  "cmd.exe /c npm run",
  "A1 fail-fast policy",
  "Single reply checklist",
  "readonly-attempt",
  "post-run",
  "preflight",
  "packet",
  "operator",
  "Indicator Roadmap",
  "Runtime/data foundation",
  "Product wording",
  "Future notes",
  "Market temperature",
  "Stock health"
];

const decisionLoopRequired = [
  "Public Beta Decision Loop",
  "30 秒市場氛圍，3 分鐘行動判斷",
  "先看市場氛圍",
  "再看成因與時間",
  "最後看資料邊界",
  "不是即時真實資料",
  "不提供買賣建議"
];

const routeAndDataRequired = [
  "Public Beta Reading Path",
  "首頁：看市場溫度",
  "Briefing：看原因與行動",
  "Source & Coverage",
  "資料來源與覆蓋範圍"
];

const homeAndBriefingDataRequired = [
  "Data Readiness",
  "資料真實化仍在準備中，公開頁維持 mock"
];

const stockPublicRequired = [
  ...decisionLoopRequired,
  ...routeAndDataRequired,
  "TWII 資料決策",
  "指標路線圖"
];

const pages = [
  {
    path: "/",
    forbidden: publicOperationsForbidden,
    required: [
      ...coreRuntimeBoundaryRequired,
      "Public Beta Index Dashboard",
      "30 秒市場氛圍，3 分鐘行動判斷",
      "市場氛圍",
      "風險焦點",
      "行動判斷",
      ...routeAndDataRequired,
      ...homeAndBriefingDataRequired
    ]
  },
  {
    path: "/briefing",
    forbidden: publicOperationsForbidden,
    required: [
      ...coreRuntimeBoundaryRequired,
      "Market Briefing",
      "Briefing 把全市場總覽延伸成觀察清單",
      "Market Action Summary",
      "Model Boundary",
      "Briefing Playbook",
      ...decisionLoopRequired,
      ...routeAndDataRequired,
      ...homeAndBriefingDataRequired
    ]
  },
  {
    path: "/stocks/TWII",
    forbidden: publicOperationsForbidden,
    required: [...coreRuntimeBoundaryRequired, ...stockPublicRequired, "TWII Mock Disclosure"]
  },
  {
    path: "/stocks/2330",
    forbidden: publicOperationsForbidden,
    required: [...coreRuntimeBoundaryRequired, ...stockPublicRequired]
  },
  {
    path: "/stocks/0050",
    forbidden: publicOperationsForbidden,
    required: [...coreRuntimeBoundaryRequired, ...stockPublicRequired]
  },
  {
    path: "/stocks/006208",
    forbidden: publicOperationsForbidden,
    required: [...coreRuntimeBoundaryRequired, ...stockPublicRequired]
  },
  {
    path: "/stocks/2382",
    forbidden: publicOperationsForbidden,
    required: [...coreRuntimeBoundaryRequired, ...stockPublicRequired]
  },
  {
    path: "/stocks/2308",
    forbidden: publicOperationsForbidden,
    required: [...coreRuntimeBoundaryRequired, ...stockPublicRequired]
  },
  {
    path: "/weekly",
    forbidden: publicOperationsForbidden,
    required: [...coreRuntimeBoundaryRequired, "Weekly boundary", "data freshness metadata"]
  },
  {
    path: "/methodology",
    forbidden: publicOperationsForbidden,
    required: [...coreRuntimeBoundaryRequired, "Methodology", "mock scores"]
  },
  {
    path: "/disclaimer",
    forbidden: publicOperationsForbidden,
    required: [...coreRuntimeBoundaryRequired, "Investment and data limits", "not investment advice", "data freshness metadata"]
  },
  {
    path: "/terms",
    forbidden: publicOperationsForbidden,
    required: [...coreRuntimeBoundaryRequired, "Terms of use", "mock-only", "data freshness metadata"]
  },
  {
    path: "/privacy",
    forbidden: publicOperationsForbidden,
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
    path: "src/lib/public-beta-route-consistency.ts",
    required: ["從首頁總覽到 briefing，再到標的頁", "首頁：看市場溫度", "不提供買賣建議"]
  },
  {
    path: "src/lib/public-beta-data-readiness-status.ts",
    required: ["資料真實化仍在準備中，公開頁維持 mock", "TWSE OpenAPI 候選來源", "不寫 Supabase"]
  },
  {
    path: "src/lib/public-beta-source-coverage-runtime-labels.ts",
    required: ["資料來源與覆蓋範圍", "不宣稱全市場覆蓋", "最後做觀察判斷"]
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
    check: "requires readable public beta decision loop",
    pass:
      checkerSource.includes("30 秒市場氛圍，3 分鐘行動判斷") &&
      checkerSource.includes("先看市場氛圍") &&
      checkerSource.includes("最後看資料邊界")
  },
  {
    check: "requires readable source coverage and data readiness copy",
    pass: checkerSource.includes("資料來源與覆蓋範圍") && checkerSource.includes("資料真實化仍在準備中")
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
    check: "guards public product-facing source copy",
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
    .replace(/&amp;/g, "&")
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
