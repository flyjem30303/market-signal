import process from "node:process";

const siteUrl = normalizeOrigin(process.env.PHASE_2B_PUBLIC_SEO_SITE_URL ?? "https://market-signal.opensignallab.com");
const coreRoutes = ["/", "/briefing", "/weekly", "/methodology", "/disclaimer", "/privacy", "/terms"];
const problems = [];
const observations = [];

await checkCoreRoutes();
await checkRobots();
await checkSitemap();
await checkSubpathClosed();

const result = {
  status: problems.length ? "blocked" : "ok",
  mode: "phase_2b_public_seo_observation_probe",
  siteUrl,
  coreRoutesChecked: coreRoutes.length,
  expectedDiscoveredUrlsFromGscT1: 15,
  observations,
  problems,
  boundary: {
    externalPlatformMutation: false,
    gscOperation: false,
    sql: false,
    supabaseWrite: false,
    marketDataFetch: false,
    stockRoutesIndexingFullyOpen: false
  }
};

console.log(JSON.stringify(result, null, 2));
if (problems.length) process.exit(1);

async function checkCoreRoutes() {
  for (const route of coreRoutes) {
    const url = absolute(route);
    const response = await fetch(url, { redirect: "manual" });
    const html = await response.text();
    const expectedCanonical = canonicalUrl(route);
    const canonical = extractTag(html, /<link[^>]+rel=["']canonical["'][^>]*>/iu);
    const ogUrl = extractTag(html, /<meta[^>]+property=["']og:url["'][^>]*>/iu);
    const title = html.match(/<title[^>]*>(.*?)<\/title>/isu)?.[1] ?? null;

    observations.push({ route, status: response.status, canonical, ogUrl, title });

    if (response.status !== 200) problems.push(`${route} expected 200, got ${response.status}`);
    if (!canonical?.includes(`href="${expectedCanonical}"`) && !canonical?.includes(`href='${expectedCanonical}'`)) {
      problems.push(`${route} canonical mismatch; expected ${expectedCanonical}; got ${canonical}`);
    }
    if (!ogUrl?.includes(`content="${expectedCanonical}"`) && !ogUrl?.includes(`content='${expectedCanonical}'`)) {
      problems.push(`${route} og:url mismatch; expected ${expectedCanonical}; got ${ogUrl}`);
    }
    if (html.includes("market-signal-two.vercel.app")) problems.push(`${route} contains old Vercel URL`);
    if (html.includes("opensignallab.com/market-signal")) problems.push(`${route} contains old product subpath URL`);
  }
}

async function checkRobots() {
  const response = await fetch(absolute("/robots.txt"), { redirect: "manual" });
  const text = await response.text();
  observations.push({ route: "/robots.txt", status: response.status });

  if (response.status !== 200) problems.push(`/robots.txt expected 200, got ${response.status}`);
  for (const snippet of [
    `Host: ${siteUrl}/`,
    `Sitemap: ${siteUrl}/sitemap.xml`,
    "Disallow: /internal",
    "Disallow: /api/internal"
  ]) {
    if (!text.includes(snippet)) problems.push(`/robots.txt missing: ${snippet}`);
  }
}

async function checkSitemap() {
  const response = await fetch(absolute("/sitemap.xml"), { redirect: "manual" });
  const text = await response.text();
  const locs = [...text.matchAll(/<loc>(.*?)<\/loc>/giu)].map((match) => match[1]);
  observations.push({ route: "/sitemap.xml", status: response.status, locCount: locs.length });

  if (response.status !== 200) problems.push(`/sitemap.xml expected 200, got ${response.status}`);
  if (locs.length !== 15) problems.push(`/sitemap.xml expected 15 loc entries from GSC T1, got ${locs.length}`);
  for (const route of coreRoutes) {
    const expected = canonicalUrl(route);
    if (!locs.includes(expected) && !(route === "/" && locs.includes(`${expected}/`))) problems.push(`/sitemap.xml missing core URL: ${expected}`);
  }
  if (text.includes("market-signal-two.vercel.app")) problems.push("/sitemap.xml contains old Vercel URL");
  if (text.includes("opensignallab.com/market-signal")) problems.push("/sitemap.xml contains old product subpath URL");
}

async function checkSubpathClosed() {
  const response = await fetch(absolute("/market-signal"), { redirect: "manual" });
  observations.push({ route: "/market-signal", status: response.status });
  if (response.status !== 404) problems.push(`/market-signal expected 404 for subdomain strategy, got ${response.status}`);
}

function extractTag(html, pattern) {
  return html.match(pattern)?.[0] ?? null;
}

function absolute(route) {
  return `${siteUrl}${route.startsWith("/") ? route : `/${route}`}`;
}

function canonicalUrl(route) {
  if (route === "/") return siteUrl;
  return absolute(route).replace(/\/+$/u, "");
}

function normalizeOrigin(value) {
  return value.replace(/\/+$/u, "");
}

