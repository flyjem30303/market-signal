const planPath = "data/source-gates/etf-mis-validation-plan.json";
const userAgent =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/125 Safari/537.36";
const allEtfRequiredRowFields = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k"];
const allEtfRequiredGroupFields = ["msgArray", "refURL", "userDelay"];
const categoryRequiredFields = ["msgArray", "size", "rtcode", "rtmessage"];

const fs = await import("node:fs");
const plan = JSON.parse(fs.readFileSync(planPath, "utf8"));
const checkedAt = new Date().toISOString();
const endpoints = await Promise.all((plan.candidate_endpoints ?? []).map(checkEndpoint));
const legalBlockers = (plan.checks ?? [])
  .filter((check) => check.owner_role === "D" && check.status !== "approved")
  .map((check) => check.id);
const adapterBlockers = (plan.checks ?? [])
  .filter((check) => check.required_for === "adapter-design" && check.status !== "approved")
  .map((check) => check.id);
const hasEndpointFailures = endpoints.some((endpoint) => endpoint.status !== "ok");
const hasFieldFailures = endpoints.some((endpoint) => endpoint.missing_fields.length > 0);

const report = {
  adapter_decision: hasEndpointFailures || hasFieldFailures || adapterBlockers.length > 0 ? "not_ready" : "ready_for_review",
  adapter_plan_blockers: adapterBlockers,
  checked_at: checkedAt,
  endpoints,
  legal_blockers: legalBlockers,
  non_ingesting: true,
  source_surface: plan.source_surface,
  status: hasEndpointFailures || hasFieldFailures ? "blocked" : "report"
};

console.log(JSON.stringify(report, null, 2));

if (hasEndpointFailures || hasFieldFailures) {
  process.exitCode = 1;
}

async function checkEndpoint(endpoint) {
  const sampledUrl = withCacheBust(endpoint.url);
  const result = {
    id: endpoint.id,
    missing_fields: [],
    purpose: endpoint.purpose,
    sample_dates: [],
    sampled_url: stripCacheBust(sampledUrl),
    status: "blocked",
    status_code: null
  };

  try {
    const response = await fetch(sampledUrl, {
      headers: {
        "cache-control": "no-cache",
        pragma: "no-cache",
        "user-agent": userAgent
      }
    });
    result.status_code = response.status;

    if (!response.ok) {
      result.error = `HTTP ${response.status}`;
      return result;
    }

    const text = await response.text();
    const parsed = JSON.parse(text.trim());

    if (endpoint.id === "mis-all-etf") {
      return inspectAllEtf(result, parsed);
    }

    if (endpoint.id === "mis-etf-category-otc") {
      return inspectCategory(result, parsed);
    }

    result.status = "ok";
    return result;
  } catch (error) {
    result.error = error instanceof Error ? error.message : String(error);
    return result;
  }
}

function inspectAllEtf(result, parsed) {
  const groups = Array.isArray(parsed.a1) ? parsed.a1 : [];
  const firstGroup = groups.find((group) => Array.isArray(group.msgArray) && group.msgArray.length > 0);
  const firstRow = firstGroup?.msgArray?.[0] ?? null;
  const groupMissing = allEtfRequiredGroupFields.filter((field) => firstGroup?.[field] === undefined);
  const rowMissing = allEtfRequiredRowFields.filter((field) => firstRow?.[field] === undefined);
  const dates = new Set();
  const times = new Set();

  for (const group of groups) {
    if (!Array.isArray(group.msgArray)) continue;
    for (const row of group.msgArray) {
      if (row.i) dates.add(row.i);
      if (row.j) times.add(row.j);
    }
  }

  result.group_count = groups.length;
  result.row_count = groups.reduce((sum, group) => sum + (Array.isArray(group.msgArray) ? group.msgArray.length : 0), 0);
  result.missing_fields = [...groupMissing.map((field) => `group.${field}`), ...rowMissing.map((field) => `row.${field}`)];
  result.ref_url_sample = firstGroup?.refURL ?? null;
  result.rt_codes = [...new Set(groups.map((group) => group.rtCode ?? group.rtcode).filter(Boolean))].sort();
  result.sample_dates = [...dates].sort();
  result.sample_times = [...times].sort().slice(0, 5);
  result.user_delay_sample = firstGroup?.userDelay ?? null;
  result.status = result.missing_fields.length === 0 && result.row_count > 0 ? "ok" : "blocked";

  return result;
}

function inspectCategory(result, parsed) {
  const missing = categoryRequiredFields.filter((field) => parsed[field] === undefined);
  const rows = Array.isArray(parsed.msgArray) ? parsed.msgArray : [];
  const firstRow = rows[0] ?? null;

  result.cached_alive = parsed.cachedAlive ?? null;
  result.category_size = parsed.size ?? null;
  result.ex_key = parsed.exKey ?? null;
  result.first_symbol = firstRow?.ch ?? null;
  result.missing_fields = missing;
  result.rt_code = parsed.rtcode ?? null;
  result.rt_message = parsed.rtmessage ?? null;
  result.sample_dates = [...new Set(rows.map((row) => row.key?.split("_").at(-1)).filter(Boolean))].sort();
  result.status = missing.length === 0 && rows.length > 0 ? "ok" : "blocked";

  return result;
}

function withCacheBust(url) {
  const separator = url.includes("?") ? "&" : "?";
  return `${url}${separator}_=${Date.now()}`;
}

function stripCacheBust(url) {
  return url.replace(/([?&])_=\d+/, "");
}
