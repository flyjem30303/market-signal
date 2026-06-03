import fs from "node:fs";

const helperPath = "src/lib/runtime-product-summary.ts";
const homePath = "src/components/home-runtime-status-panel.tsx";
const stockPath = "src/components/stock-runtime-at-a-glance.tsx";
const cssPath = "src/app/globals.css";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";

const files = new Map(
  [helperPath, homePath, stockPath, cssPath, packagePath, reviewGatePath].map((file) => [
    file,
    fs.readFileSync(file, "utf8")
  ])
);

const required = [
  [helperPath, "RuntimeProductSummary"],
  [helperPath, "getRuntimeProductSummary"],
  [helperPath, "readonlyDecision"],
  [helperPath, "Object reachability is verified"],
  [helperPath, "postReadonly.objectsReachable"],
  [helperPath, "Use now"],
  [helperPath, "Not live yet"],
  [helperPath, "Next gate"],
  [helperPath, "Use mock signals for reading only"],
  [helperPath, "Real-data claims are not live"],
  [helperPath, "Decide post-readonly runtime interpretation"],
  [helperPath, "mock-only signal reading, risk sorting, and product-flow validation"],
  [helperPath, "It does not provide investment advice or real market-data evidence"],
  [helperPath, "Real market data, Supabase-backed public data, SQL scoring"],
  [helperPath, "publicDataSource=supabase"],
  [helperPath, "scoreSource=real remain blocked"],
  [helperPath, "accepted object reachability"],
  [helperPath, "schema shape"],
  [helperPath, "data freshness"],
  [helperPath, "row coverage"],
  [helperPath, "data quality"],
  [helperPath, "source-depth"],
  [helperPath, "UI runtime interpretation"],
  [helperPath, "objectsReachable"],
  [homePath, "getRuntimeProductSummary"],
  [homePath, "runtime-product-summary"],
  [homePath, "productSummary.useNow"],
  [homePath, "productSummary.notLiveYet"],
  [homePath, "productSummary.nextGate"],
  [homePath, "productSummary.readonlyDecision"],
  [stockPath, "getRuntimeProductSummary"],
  [stockPath, "runtime-product-summary"],
  [stockPath, "productSummary.useNow"],
  [stockPath, "productSummary.notLiveYet"],
  [stockPath, "productSummary.nextGate"],
  [stockPath, "productSummary.readonlyDecision"],
  [cssPath, ".runtime-product-summary"],
  [cssPath, "repeat(4, minmax(0, 1fr))"],
  [packagePath, "\"check:runtime-product-summary\": \"node scripts/check-runtime-product-summary.mjs\""],
  [reviewGatePath, "scripts/check-runtime-product-summary.mjs"]
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
  [helperPath, "scoreSource: \"real\""],
  [helperPath, "publicDataSource: \"supabase\""],
  [homePath, "productSummary.networkBlocker"],
  [stockPath, "productSummary.networkBlocker"],
  [homePath, "scoreSource: \"real\""],
  [stockPath, "scoreSource: \"real\""]
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
