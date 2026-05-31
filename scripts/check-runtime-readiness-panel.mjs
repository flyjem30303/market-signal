import fs from "node:fs";

const summaryPath = "src/lib/runtime-readiness-score.ts";
const preflightPath = "src/lib/supabase-readonly-local-preflight.ts";
const componentPath = "src/components/runtime-readiness-panel.tsx";
const briefingPath = "src/app/briefing/page.tsx";
const cssPath = "src/app/globals.css";

const files = new Map(
  [summaryPath, preflightPath, componentPath, briefingPath, cssPath].map((file) => [file, fs.readFileSync(file, "utf8")])
);

const required = [
  [summaryPath, "Runtime 前置可加速，主系統仍維持 mock-only"],
  [summaryPath, "Supabase 唯讀 preflight"],
  [summaryPath, "本地 preflight 可安全執行"],
  [summaryPath, "npm run report:supabase-readonly-preflight"],
  [summaryPath, "npm run db:readonly-validate"],
  [summaryPath, "主資料源不切換、不寫資料"],
  [summaryPath, "正式分數來源"],
  [preflightPath, "getSupabaseReadonlyLocalPreflight"],
  [preflightPath, "connectionAttempted: false"],
  [preflightPath, "secretsPrinted: false"],
  [preflightPath, "rowPayloadsPrinted: false"],
  [preflightPath, "sqlExecuted: false"],
  [preflightPath, "mutations: false"],
  [preflightPath, "ready_for_guarded_readonly_decision"],
  [componentPath, "RuntimeReadinessPanel"],
  [componentPath, "Runtime Readiness"],
  [componentPath, "Runtime readiness"],
  [componentPath, "runtime-readiness-command"],
  [componentPath, "runtime-preflight-status"],
  [componentPath, "Local preflight status"],
  [componentPath, "ready for guarded decision"],
  [componentPath, "目前不在自動 review gate 內執行"],
  [briefingPath, "import { RuntimeReadinessPanel }"],
  [briefingPath, "<RuntimeReadinessPanel />"],
  [cssPath, ".runtime-readiness-panel"],
  [cssPath, ".runtime-readiness-command"],
  [cssPath, ".runtime-preflight-status"],
  [cssPath, ".runtime-readiness-lanes"],
  [cssPath, ".runtime-readiness-score"]
];

const forbidden = [
  [summaryPath, "scoreSource=real"],
  [summaryPath, "NEXT_PUBLIC_DATA_SOURCE=supabase"],
  [summaryPath, "DATA_FRESHNESS_SUPABASE_READS=enabled"],
  [preflightPath, "@supabase/supabase-js"],
  [preflightPath, "createClient"],
  [preflightPath, "fetch("],
  [preflightPath, ".from("],
  [preflightPath, ".insert("],
  [preflightPath, ".update("],
  [preflightPath, ".delete("],
  [componentPath, "fetch("],
  [componentPath, "createClient"],
  [componentPath, "process.env"]
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
