import dns from "node:dns/promises";
import net from "node:net";
import tls from "node:tls";

const requiredConfirmation = "CP3_SUPABASE_NETWORK_LAYER_DIAGNOSTIC";
const confirmation = process.env.SUPABASE_NETWORK_LAYER_DIAGNOSTIC_CONFIRMATION;
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const confirmationStatus = confirmation === requiredConfirmation ? "present" : "missing_or_invalid";
const urlShape = classifyUrlShape(supabaseUrl);

if (confirmation !== requiredConfirmation) {
  finish({
    diagnostic: notRunDiagnostic("remote_diagnostic_not_confirmed"),
    reason: "remote_diagnostic_not_approved",
    status: "blocked"
  });
} else if (!supabaseUrl) {
  finish({
    diagnostic: notRunDiagnostic("environment_loading"),
    reason: "missing_required_environment",
    status: "blocked"
  });
} else if (urlShape.status !== "ok") {
  finish({
    diagnostic: notRunDiagnostic("project_url"),
    reason: "invalid_supabase_url_shape",
    status: "blocked"
  });
} else {
  const url = new URL(supabaseUrl);
  const diagnostic = await runNetworkDiagnostic(url);
  finish({
    diagnostic,
    reason: diagnostic.suggestedRootCause,
    status: diagnostic.overall === "reachable" ? "ok" : "blocked"
  });
}

function classifyUrlShape(value) {
  if (!value) {
    return {
      hostCategory: "missing",
      protocol: "missing",
      status: "blocked"
    };
  }

  try {
    const url = new URL(value);
    const isSupabaseHost = url.hostname.endsWith(".supabase.co");
    const isHttps = url.protocol === "https:";

    return {
      hostCategory: isSupabaseHost ? "supabase_host" : "non_supabase_host",
      protocol: isHttps ? "https" : "non_https",
      status: isSupabaseHost && isHttps ? "ok" : "blocked"
    };
  } catch {
    return {
      hostCategory: "parse_failed",
      protocol: "parse_failed",
      status: "blocked"
    };
  }
}

async function runNetworkDiagnostic(url) {
  const dnsState = await probeDns(url.hostname);
  const tcpState = dnsState.status === "ok" ? await probeTcp(url.hostname, 443) : "not_run";
  const tlsState = tcpState === "ok" ? await probeTls(url.hostname, 443) : "not_run";
  const restState = tlsState === "ok" ? await probeRestRoot(url) : { reachability: "not_run", status: "not_run" };
  const overall = restState.reachability === "reachable" ? "reachable" : "blocked";

  return {
    dns: dnsState.status,
    dnsAddressFamilySeen: dnsState.addressFamilySeen,
    overall,
    restRootReachability: restState.reachability,
    sanitizedHttpStatus: restState.status,
    suggestedRootCause: suggestRootCause(dnsState.status, tcpState, tlsState, restState),
    tcp443: tcpState,
    tlsHandshake: tlsState
  };
}

async function probeDns(hostname) {
  try {
    const records = await dns.lookup(hostname, {
      all: true
    });
    const families = new Set(records.map((record) => record.family));
    return {
      addressFamilySeen: families.has(4) && families.has(6) ? "ipv4_ipv6" : families.has(4) ? "ipv4" : families.has(6) ? "ipv6" : "none",
      status: records.length > 0 ? "ok" : "blocked"
    };
  } catch {
    return {
      addressFamilySeen: "none",
      status: "blocked"
    };
  }
}

function probeTcp(hostname, port) {
  return new Promise((resolve) => {
    const socket = net.createConnection({
      host: hostname,
      port,
      timeout: 8000
    });

    socket.once("connect", () => {
      socket.destroy();
      resolve("ok");
    });
    socket.once("timeout", () => {
      socket.destroy();
      resolve("timeout");
    });
    socket.once("error", () => {
      socket.destroy();
      resolve("blocked");
    });
  });
}

function probeTls(hostname, port) {
  return new Promise((resolve) => {
    const socket = tls.connect({
      host: hostname,
      port,
      rejectUnauthorized: true,
      servername: hostname,
      timeout: 8000
    });

    socket.once("secureConnect", () => {
      socket.destroy();
      resolve("ok");
    });
    socket.once("timeout", () => {
      socket.destroy();
      resolve("timeout");
    });
    socket.once("error", () => {
      socket.destroy();
      resolve("blocked");
    });
  });
}

async function probeRestRoot(url) {
  try {
    const response = await fetch(new URL("/rest/v1/", url), {
      headers: {
        Accept: "application/json"
      },
      method: "HEAD"
    });

    return {
      reachability: "reachable",
      status: classifyHttpStatus(response.status)
    };
  } catch {
    return {
      reachability: "blocked",
      status: "network_error"
    };
  }
}

function classifyHttpStatus(status) {
  if (status >= 200 && status < 300) return "2xx";
  if (status === 401 || status === 403) return "auth_required";
  if (status === 404) return "not_found";
  if (status >= 300 && status < 400) return "3xx";
  if (status >= 400 && status < 500) return "4xx";
  if (status >= 500) return "5xx";
  return "unknown";
}

function suggestRootCause(dnsState, tcpState, tlsState, restState) {
  if (dnsState !== "ok") return "dns_or_project_host";
  if (tcpState !== "ok") return "tcp443_or_firewall";
  if (tlsState !== "ok") return "tls_or_proxy";
  if (restState.reachability !== "reachable") return "fetch_layer_or_proxy";
  return "rest_root_reachable";
}

function notRunDiagnostic(suggestedRootCause) {
  return {
    dns: "not_run",
    dnsAddressFamilySeen: "not_run",
    overall: "not_run",
    restRootReachability: "not_run",
    sanitizedHttpStatus: "not_run",
    suggestedRootCause,
    tcp443: "not_run",
    tlsHandshake: "not_run"
  };
}

function finish({ diagnostic, reason, status }) {
  console.log(
    JSON.stringify(
      {
        confirmation: confirmationStatus,
        connectionAttempted: confirmationStatus === "present",
        diagnostic,
        env: {
          NEXT_PUBLIC_SUPABASE_URL: supabaseUrl ? "present" : "missing"
        },
        filesWritten: false,
        mode: "supabase_network_layer_diagnostic",
        mutations: false,
        publicClaimsChanged: false,
        reason,
        rowPayloadsPrinted: false,
        scoreSourceRealChanged: false,
        secretsPrinted: false,
        sqlExecuted: false,
        status,
        urlShape
      },
      null,
      2
    )
  );

  if (status !== "ok") process.exitCode = 1;
}
