import fs from "node:fs";
import Module from "node:module";
import path from "node:path";
import ts from "typescript";

const root = process.cwd();
const previousEnv = {
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY
};
const createClientCalls = [];
const client = { id: "stub-supabase-client" };
const { createServerSupabaseClient } = loadTsModule("src/lib/supabase/server.ts", new Map(), {
  "@supabase/supabase-js": {
    createClient(url, key, options) {
      createClientCalls.push({ key, options, url });
      return client;
    }
  }
});

const cases = [
  runMissingEnvCase({
    name: "missing url is rejected before client creation",
    serviceRoleKey: "service-role",
    url: ""
  }),
  runMissingEnvCase({
    name: "missing service role key is rejected before client creation",
    serviceRoleKey: "",
    url: "https://example.supabase.co"
  }),
  runSuccessCase({
    name: "server client uses service role key and disables session persistence",
    serviceRoleKey: "service-role",
    url: "https://example.supabase.co"
  })
];

restoreEnv(previousEnv);

const sourceProblems = scanServerSource();
const failed = cases.filter((result) => !result.pass);
const status = failed.length === 0 && sourceProblems.length === 0 ? "ok" : "blocked";

console.log(
  JSON.stringify(
    {
      cases,
      createClientCalls,
      sourceProblems,
      status
    },
    null,
    2
  )
);

if (status !== "ok") {
  process.exit(1);
}

function runMissingEnvCase({ name, serviceRoleKey, url }) {
  process.env.NEXT_PUBLIC_SUPABASE_URL = url;
  process.env.SUPABASE_SERVICE_ROLE_KEY = serviceRoleKey;
  const beforeCalls = createClientCalls.length;
  const problems = [];
  let observed = "allowed";

  try {
    createServerSupabaseClient();
  } catch (error) {
    observed = error instanceof Error ? error.message : String(error);
  }

  if (observed !== "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.") {
    problems.push(`expected missing env error, got ${observed}`);
  }

  if (createClientCalls.length !== beforeCalls) {
    problems.push("createClient should not be called when required env is missing");
  }

  return {
    name,
    observed,
    pass: problems.length === 0,
    problems
  };
}

function runSuccessCase({ name, serviceRoleKey, url }) {
  process.env.NEXT_PUBLIC_SUPABASE_URL = url;
  process.env.SUPABASE_SERVICE_ROLE_KEY = serviceRoleKey;
  const beforeCalls = createClientCalls.length;
  const result = createServerSupabaseClient();
  const call = createClientCalls[beforeCalls];
  const problems = [];

  if (result !== client) {
    problems.push("createServerSupabaseClient should return the Supabase client instance");
  }

  if (createClientCalls.length !== beforeCalls + 1) {
    problems.push(`expected one createClient call, got ${createClientCalls.length - beforeCalls}`);
  }

  if (call?.url !== url) {
    problems.push(`expected URL ${url}, got ${call?.url}`);
  }

  if (call?.key !== serviceRoleKey) {
    problems.push("server client should use SUPABASE_SERVICE_ROLE_KEY");
  }

  if (call?.options?.auth?.persistSession !== false) {
    problems.push("server client must disable auth.persistSession");
  }

  return {
    name,
    observed: "allowed",
    pass: problems.length === 0,
    problems
  };
}

function scanServerSource() {
  const source = fs.readFileSync(path.join(root, "src/lib/supabase/server.ts"), "utf8");
  const problems = [];
  const requiredPhrases = [
    "process.env.NEXT_PUBLIC_SUPABASE_URL",
    "process.env.SUPABASE_SERVICE_ROLE_KEY",
    "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.",
    "createClient<Database>(url, serviceRoleKey",
    "persistSession: false"
  ];
  const forbiddenPatterns = [/NEXT_PUBLIC_SUPABASE_ANON_KEY/, /persistSession:\s*true/];

  for (const phrase of requiredPhrases) {
    if (!source.includes(phrase)) {
      problems.push(`missing server Supabase phrase: ${phrase}`);
    }
  }

  for (const pattern of forbiddenPatterns) {
    if (pattern.test(source)) {
      problems.push(`forbidden server Supabase pattern: ${String(pattern)}`);
    }
  }

  return problems;
}

function restoreEnv(previousEnv) {
  for (const [key, value] of Object.entries(previousEnv)) {
    if (value === undefined) {
      delete process.env[key];
    } else {
      process.env[key] = value;
    }
  }
}

function loadTsModule(relativePath, cache = new Map(), stubs = {}) {
  const absolutePath = path.join(root, relativePath);
  const normalizedPath = path.normalize(relativePath);

  if (cache.has(normalizedPath)) {
    return cache.get(normalizedPath).exports;
  }

  const module = { exports: {} };
  cache.set(normalizedPath, module);
  const sourceText = fs.readFileSync(absolutePath, "utf8");
  const transpiled = ts.transpileModule(sourceText, {
    compilerOptions: {
      esModuleInterop: true,
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022
    },
    fileName: absolutePath
  }).outputText;
  const localRequire = createLocalRequire(relativePath, cache, stubs);
  const execute = new Function("require", "exports", "module", "__filename", "__dirname", transpiled);
  execute(localRequire, module.exports, module, absolutePath, path.dirname(absolutePath));
  return module.exports;
}

function createLocalRequire(fromRelativePath, cache, stubs) {
  const nativeRequire = Module.createRequire(path.join(root, fromRelativePath));

  return function localRequire(specifier) {
    if (stubs[specifier]) {
      return stubs[specifier];
    }

    if (specifier.startsWith("@/")) {
      return loadTsModule(`src/${specifier.slice(2)}.ts`, cache, stubs);
    }

    if (specifier.startsWith(".")) {
      const baseDirectory = path.dirname(fromRelativePath);
      const resolved = path.normalize(path.join(baseDirectory, `${specifier}.ts`));
      return loadTsModule(resolved, cache, stubs);
    }

    return nativeRequire(specifier);
  };
}
