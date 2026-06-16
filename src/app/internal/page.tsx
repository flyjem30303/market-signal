import type { Metadata } from "next";
import { assertInternalDiagnosticsAccess } from "@/lib/internal-diagnostics";

type InternalDiagnosticsHomeProps = {
  searchParams: {
    token?: string;
  };
};

type StatusCard = {
  detail: string;
  label: string;
  tone: "active" | "blocked" | "hold";
  value: string;
};

type ToolCard = {
  description: string;
  href: string;
  name: string;
  status: string;
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

  const statusCards: StatusCard[] = [
    {
      detail: "Public pages must keep mock score output until the real-data promotion gate passes.",
      label: "Score source",
      tone: "hold",
      value: "mock"
    },
    {
      detail: "Row payload candidate review is ready, but Supabase write execution remains separate.",
      label: "Data online",
      tone: "active",
      value: "write review"
    },
    {
      detail: "Internal tools are token-protected, noindex, and not part of the public Phase 1 surface.",
      label: "Access",
      tone: "active",
      value: "protected"
    },
    {
      detail: "No public real-data claim, scoreSource=real, SQL, or daily_prices mutation is allowed here.",
      label: "Boundary",
      tone: "blocked",
      value: "fail-closed"
    }
  ];

  const tools: ToolCard[] = [
    {
      description: "Compare protected raw-market diagnostics with mock score output and public release blockers.",
      href: withToken("/internal/raw-market-preview?symbol=2330", searchParams.token),
      name: "Raw Market Preview",
      status: "internal-only"
    },
    {
      description: "Run the CP3 Taiwan stock dry-run report without writes or public source promotion.",
      href: withToken("/internal/cp3-dry-run?symbol=2330", searchParams.token),
      name: "CP3 Dry Run",
      status: "internal-only"
    },
    {
      description: "Review ETF source readiness before any ingestion or public ETF interpretation.",
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
        <p>
          Protected diagnostics for Phase 1 review. Public visitors should not see this surface, and all real-data
          promotion remains fail-closed.
        </p>
      </section>

      <section className="panel internal-status-panel">
        <div>
          <p className="eyebrow">Operating State</p>
          <h2>Phase 1 protected review</h2>
          <p>
            Use these tools only to inspect readiness and blockers. They do not execute SQL, write Supabase, mutate
            daily_prices, or change public runtime sources.
          </p>
        </div>

        <div className="internal-status-grid">
          {statusCards.map((item) => (
            <article className={`internal-status-card ${item.tone}`} key={item.label}>
              <span>{item.label}</span>
              <strong>{item.value}</strong>
              <p>{item.detail}</p>
            </article>
          ))}
        </div>
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
