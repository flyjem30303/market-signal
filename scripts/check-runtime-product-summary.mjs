import fs from "node:fs";

const helperPath = "src/lib/runtime-product-summary.ts";
const networkBlockerPath = "src/lib/supabase-network-blocker.ts";
const homePath = "src/components/home-runtime-status-panel.tsx";
const stockPath = "src/components/stock-runtime-at-a-glance.tsx";
const cssPath = "src/app/globals.css";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";

const files = new Map(
  [helperPath, networkBlockerPath, homePath, stockPath, cssPath, packagePath, reviewGatePath].map((file) => [
    file,
    fs.readFileSync(file, "utf8")
  ])
);

const required = [
  [helperPath, "RuntimeProductSummary"],
  [helperPath, "getRuntimeProductSummary"],
  [helperPath, "getSupabaseNetworkBlockerSummary"],
  [helperPath, "networkBlocker"],
  [helperPath, "Use now"],
  [helperPath, "Not live yet"],
  [helperPath, "Next gate"],
  [helperPath, "Use mock signals for reading only"],
  [helperPath, "Real-data claims are not live"],
  [helperPath, "Resolve network reachability first"],
  [helperPath, "mock-only signal reading, risk sorting, and product-flow validation"],
  [helperPath, "It does not provide investment advice or real market-data evidence"],
  [helperPath, "Real market data, Supabase-backed public data, SQL scoring"],
  [helperPath, "publicDataSource=supabase"],
  [helperPath, "scoreSource=real remain blocked"],
  [helperPath, "previous readonly evidence"],
  [helperPath, "TCP 443 reachability"],
  [helperPath, "objectsReachable"],
  [networkBlockerPath, "SupabaseNetworkBlockerSummary"],
  [networkBlockerPath, "getSupabaseNetworkBlockerSummary"],
  [networkBlockerPath, "DNS ok, TCP 443 blocked before TLS and REST"],
  [networkBlockerPath, "local network reachability"],
  [networkBlockerPath, "firewall, proxy, VPN, endpoint-security"],
  [networkBlockerPath, "publicDataSource: \"mock\""],
  [networkBlockerPath, "scoreSource: \"mock\""],
  [networkBlockerPath, "status: \"tcp443_blocked\""],
  [networkBlockerPath, "Do not retry generic Supabase readonly attempts"],
  [homePath, "getRuntimeProductSummary"],
  [homePath, "runtime-product-summary"],
  [homePath, "productSummary.useNow"],
  [homePath, "productSummary.notLiveYet"],
  [homePath, "productSummary.nextGate"],
  [homePath, "productSummary.networkBlocker"],
  [homePath, "runtime-network-blocker-card"],
  [stockPath, "getRuntimeProductSummary"],
  [stockPath, "runtime-product-summary"],
  [stockPath, "productSummary.useNow"],
  [stockPath, "productSummary.notLiveYet"],
  [stockPath, "productSummary.nextGate"],
  [stockPath, "productSummary.networkBlocker"],
  [stockPath, "runtime-network-blocker-card"],
  [cssPath, ".runtime-product-summary"],
  [cssPath, "repeat(4, minmax(0, 1fr))"],
  [cssPath, ".runtime-network-blocker-card"],
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
  [networkBlockerPath, "@supabase/supabase-js"],
  [networkBlockerPath, "createClient"],
  [networkBlockerPath, "fetch("],
  [networkBlockerPath, ".from("],
  [networkBlockerPath, ".insert("],
  [networkBlockerPath, ".update("],
  [networkBlockerPath, ".delete("],
  [networkBlockerPath, "process.env"],
  [networkBlockerPath, "node:fs"],
  [networkBlockerPath, "scoreSource: \"real\""],
  [networkBlockerPath, "publicDataSource: \"supabase\""],
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
