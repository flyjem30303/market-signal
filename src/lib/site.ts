const rawSiteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const explicitBasePath = normalizeBasePath(process.env.NEXT_PUBLIC_SITE_BASE_PATH);
const parsedSiteUrl = new URL(rawSiteUrl);
const inferredBasePath = explicitBasePath || normalizeBasePath(parsedSiteUrl.pathname);

export const siteConfig = {
  name: "\u6307\u6578\u71c8\u865f",
  basePath: inferredBasePath,
  origin: parsedSiteUrl.origin,
  url: withTrailingSlash(`${parsedSiteUrl.origin}${inferredBasePath}`)
};

export function absoluteUrl(path: string) {
  if (/^https?:\/\//iu.test(path)) return path;

  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const pathWithoutBase = stripBasePath(normalizedPath, siteConfig.basePath);
  return new URL(`${siteConfig.basePath}${pathWithoutBase}`, siteConfig.origin).toString();
}

function normalizeBasePath(path = "") {
  if (!path || path === "/") return "";
  const withLeadingSlash = path.startsWith("/") ? path : `/${path}`;
  return withLeadingSlash.replace(/\/+$/u, "");
}

function stripBasePath(path: string, basePath: string) {
  if (!basePath) return path;
  if (path === basePath) return "/";
  if (path.startsWith(`${basePath}/`)) return path.slice(basePath.length);
  return path;
}

function withTrailingSlash(url: string) {
  return url.endsWith("/") ? url : `${url}/`;
}
