import fs from "node:fs";

const helperPath = "src/lib/post-readonly-runtime-state.ts";
const productStatusPath = "src/components/post-readonly-product-status.tsx";
const homePath = "src/components/home-runtime-status-panel.tsx";
const stockPath = "src/components/stock-runtime-at-a-glance.tsx";
const briefingPagePath = "src/app/briefing/page.tsx";
const briefingPanelPath = "src/components/runtime-readiness-panel.tsx";
const cssPath = "src/app/globals.css";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";

const files = new Map(
  [
    helperPath,
    productStatusPath,
    homePath,
    stockPath,
    briefingPagePath,
    briefingPanelPath,
    cssPath,
    packagePath,
    reviewGatePath
  ].map((file) => [file, fs.readFileSync(file, "utf8")])
);

const required = [
  [helperPath, "PostReadonlyRuntimeState"],
  [helperPath, "getPostReadonlyRuntimeState"],
  [helperPath, "readonly_verified_mock_only"],
  [helperPath, "objectsReachable: evidence.objects.length"],
  [helperPath, "rowCoverage: {"],
  [helperPath, "coverageStatus: rowCoverage.latestAttempt.coverageStatus"],
  [helperPath, "expectedRows: rowCoverage.latestAttempt.expectedTotalRows"],
  [helperPath, "missingRows: rowCoverage.latestAttempt.missingRows"],
  [helperPath, "observedRows: rowCoverage.latestAttempt.observedTotalRows"],
  [helperPath, "Row coverage readonly evidence is incomplete"],
  [helperPath, "publicDataSource: \"mock\""],
  [helperPath, "scoreSource: \"mock\""],
  [helperPath, "Supabase reachability is accepted as backend evidence only"],
  [helperPath, "Do not convert readonly reachability into writes"],
  [productStatusPath, "PostReadonlyProductStatus"],
  [productStatusPath, "getPostReadonlyRuntimeState"],
  [productStatusPath, "Backend read evidence is accepted; public signals remain mock"],
  [productStatusPath, "The product can be reviewed, but not treated as live data"],
  [productStatusPath, "This stock page is readable as a mock signal"],
  [productStatusPath, "Readonly evidence"],
  [productStatusPath, "Row coverage"],
  [productStatusPath, "Public boundary"],
  [productStatusPath, "Next gate"],
  [productStatusPath, "publicDataSource={state.publicDataSource}; scoreSource={state.scoreSource}"],
  [productStatusPath, "does not enable scoreSource=real"],
  [homePath, "PostReadonlyProductStatus"],
  [homePath, "<PostReadonlyProductStatus context=\"home\" symbol={selectedSymbol} />"],
  [stockPath, "PostReadonlyProductStatus"],
  [stockPath, "<PostReadonlyProductStatus context=\"stock\" symbol={snapshot.asset.symbol} />"],
  [briefingPagePath, "PostReadonlyProductStatus"],
  [briefingPagePath, "<PostReadonlyProductStatus context=\"briefing\" symbol={market.asset.symbol} />"],
  [briefingPanelPath, "getPostReadonlyRuntimeState"],
  [briefingPanelPath, "Post-readonly runtime"],
  [briefingPanelPath, "postReadonlyRuntime.userFacingSummary"],
  [briefingPanelPath, "postReadonlyRuntime.rowCoverage.reason"],
  [cssPath, ".post-readonly-product-status"],
  [cssPath, ".post-readonly-product-status-main"],
  [cssPath, ".post-readonly-product-status article.blocked"],
  [cssPath, ".post-readonly-runtime-card"],
  [packagePath, "\"check:post-readonly-runtime-state\": \"node scripts/check-post-readonly-runtime-state.mjs\""],
  [reviewGatePath, "scripts/check-post-readonly-runtime-state.mjs"]
];

const forbidden = [
  [helperPath, "@supabase/supabase-js"],
  [helperPath, "createClient"],
  [helperPath, "fetch("],
  [helperPath, ".from("],
  [helperPath, ".insert("],
  [helperPath, ".update("],
  [helperPath, ".delete("],
  [helperPath, "process.env"],
  [helperPath, "node:fs"],
  [helperPath, "publicDataSource: \"supabase\""],
  [helperPath, "scoreSource: \"real\""],
  [helperPath, "scoreSource=real approved"],
  [productStatusPath, "@supabase/supabase-js"],
  [productStatusPath, "createClient"],
  [productStatusPath, "fetch("],
  [productStatusPath, ".from("],
  [productStatusPath, ".insert("],
  [productStatusPath, ".update("],
  [productStatusPath, ".delete("],
  [productStatusPath, "process.env"],
  [productStatusPath, "node:fs"],
  [productStatusPath, "publicDataSource: \"supabase\""],
  [productStatusPath, "scoreSource: \"real\""],
  [productStatusPath, "scoreSource=real approved"],
  [homePath, "scoreSource=real approved"],
  [stockPath, "scoreSource=real approved"],
  [briefingPagePath, "scoreSource=real approved"],
  [briefingPanelPath, "scoreSource=real approved"]
];

const missing = required.filter(([file, phrase]) => !read(file).includes(phrase)).map(([file, phrase]) => `${file}: ${phrase}`);
const blocked = forbidden.filter(([file, phrase]) => read(file).includes(phrase)).map(([file, phrase]) => `${file}: ${phrase}`);

console.log(
  JSON.stringify(
    {
      blocked,
      missing,
      status: missing.length === 0 && blocked.length === 0 ? "ok" : "blocked"
    },
    null,
    2
  )
);

if (missing.length > 0 || blocked.length > 0) {
  process.exitCode = 1;
}

function read(file) {
  return files.get(file) ?? "";
}
