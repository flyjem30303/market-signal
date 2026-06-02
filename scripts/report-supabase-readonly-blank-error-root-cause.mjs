const requiredConfirmation = "CP3_SUPABASE_BLANK_ERROR_ROOT_CAUSE";
const confirmation = process.env.SUPABASE_BLANK_ERROR_ROOT_CAUSE_CONFIRMATION;
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const env = {
  NEXT_PUBLIC_SUPABASE_URL: supabaseUrl ? "present" : "missing",
  SUPABASE_SERVICE_ROLE_KEY: serviceRoleKey ? "present" : "missing"
};
const urlShape = classifyUrlShape(supabaseUrl);
const confirmationStatus = confirmation === requiredConfirmation ? "present" : "missing_or_invalid";

if (confirmation !== requiredConfirmation) {
  finish({
    diagnostic: {
      restRootReachability: "not_run",
      sanitizedHttpStatus: "not_run",
      suggestedRootCause: urlShape.status === "ok" ? "remote_diagnostic_not_confirmed" : "url_shape_invalid"
    },
    reason: "remote_diagnostic_not_approved",
    status: "blocked"
  });
} else if (env.NEXT_PUBLIC_SUPABASE_URL === "missing" || env.SUPABASE_SERVICE_ROLE_KEY === "missing") {
  finish({
    diagnostic: {
      restRootReachability: "not_run",
      sanitizedHttpStatus: "not_run",
      suggestedRootCause: "environment_loading"
    },
    reason: "missing_required_environment",
    status: "blocked"
  });
} else if (urlShape.status !== "ok") {
  finish({
    diagnostic: {
      restRootReachability: "not_run",
      sanitizedHttpStatus: "not_run",
      suggestedRootCause: "project_url"
    },
    reason: "invalid_supabase_url_shape",
    status: "blocked"
  });
} else {
  const diagnostic = await probeRestRoot(supabaseUrl);
  finish({
    diagnostic,
    reason: diagnostic.restRootReachability === "reachable" ? "rest_root_reachable" : "rest_root_blocked",
    status: diagnostic.restRootReachability === "reachable" ? "ok" : "blocked"
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

async function probeRestRoot(value) {
  const restRoot = new URL("/rest/v1/", value);

  try {
    const response = await fetch(restRoot, {
      headers: {
        Accept: "application/json"
      },
      method: "HEAD"
    });

    return {
      restRootReachability: "reachable",
      sanitizedHttpStatus: classifyHttpStatus(response.status),
      suggestedRootCause:
        response.status >= 200 && response.status < 500 ? "sdk_query_or_policy_layer" : "project_url_or_network"
    };
  } catch {
    return {
      restRootReachability: "blocked",
      sanitizedHttpStatus: "network_error",
      suggestedRootCause: "project_url_or_network"
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

function finish({ diagnostic, reason, status }) {
  console.log(
    JSON.stringify(
      {
        confirmation: confirmationStatus,
        connectionAttempted: confirmationStatus === "present",
        diagnostic,
        env,
        filesWritten: false,
        mode: "supabase_readonly_blank_error_root_cause",
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
