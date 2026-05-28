import type { Metadata } from "next";
import { assertInternalDiagnosticsAccess } from "@/lib/internal-diagnostics";

type InternalDiagnosticsHomeProps = {
  searchParams: {
    token?: string;
  };
};

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  robots: {
    follow: false,
    index: false
  },
  title: "Internal Diagnostics"
};

export default function InternalDiagnosticsHome({ searchParams }: InternalDiagnosticsHomeProps) {
  assertInternalDiagnosticsAccess(searchParams.token);

  const tools = [
    {
      description: "Inspect real raw market data beside mock score output and public release blockers.",
      href: withToken("/internal/raw-market-preview?symbol=2330", searchParams.token),
      name: "Raw Market Preview",
      status: "internal-only"
    },
    {
      description: "Inspect the CP3 Taiwan stock dry-run report while keeping scoreSource mock and public eligibility false.",
      href: withToken("/internal/cp3-dry-run?symbol=2330", searchParams.token),
      name: "CP3 Dry Run",
      status: "internal-only"
    },
    {
      description: "Review ETF source scores, field gaps, and role-owned blockers before ingestion.",
      href: withToken("/internal/etf-source-readiness", searchParams.token),
      name: "ETF Source Readiness",
      status: "blocked"
    }
  ];

  return (
    <main className="page-shell">
      <section className="panel">
        <p className="eyebrow">Internal Diagnostics</p>
        <h1>Review Console</h1>
        <p>Protected internal review tools. Public data source switching, ETF ingestion, and real score claims remain blocked.</p>
      </section>

      <section className="content-grid">
        {tools.map((tool) => (
          <article className="panel" key={tool.name}>
            <p className="panel-label">{tool.status}</p>
            <h2>{tool.name}</h2>
            <p>{tool.description}</p>
            <a className="text-link" href={tool.href}>
              Open
            </a>
          </article>
        ))}
      </section>
    </main>
  );
}

function withToken(path: string, token?: string) {
  if (!token) return path;
  const separator = path.includes("?") ? "&" : "?";
  return `${path}${separator}token=${encodeURIComponent(token)}`;
}
