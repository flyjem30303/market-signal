export type PublicRuntimeBoundarySurface = "home" | "stock" | "trust";

export type PublicRuntimeBoundaryCopy = {
  blockedState: string;
  currentState: string;
  headline: string;
  nextStep: string;
  stopLine: string;
  summary: string;
};

export function getPublicRuntimeBoundaryCopy(surface: PublicRuntimeBoundarySurface): PublicRuntimeBoundaryCopy {
  const shared: PublicRuntimeBoundaryCopy = {
    blockedState:
      "Not live: Supabase-backed public data, SQL-backed scoring, market-data ingestion, and scoreSource=real.",
    currentState: "Visible now: mock runtime, local readiness, and explicitly blocked gates.",
    headline: "Mock-only runtime boundary",
    nextStep:
      "Next: keep runtime hardening first; run bounded readonly only as a separately named CEO action.",
    stopLine: "Stop line: keep publicDataSource=mock and scoreSource=mock.",
    summary:
      "Public pages show mock runtime interpretation only. Supabase readonly evidence can be prepared, but it does not promote publicDataSource or scoreSource."
  };

  if (surface === "stock") {
    return {
      ...shared,
      headline: "Stock page mock-only runtime boundary",
      summary:
        "This stock page can show mock score interpretation, local readiness, and blocked runtime gates only."
    };
  }

  if (surface === "trust") {
    return {
      ...shared,
      headline: "Trust page mock-only runtime boundary",
      summary:
        "Trust, methodology, disclaimer, and weekly pages must describe the mock boundary before any real-data claim."
    };
  }

  return shared;
}
