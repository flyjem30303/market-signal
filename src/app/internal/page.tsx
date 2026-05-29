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

  const cp3Status = [
    {
      detail: "維持 mock score，不建立 real score 宣稱。",
      label: "Score source",
      tone: "hold",
      value: "mock"
    },
    {
      detail: "歷史深度不足，不能進入 production model。",
      label: "Source depth",
      tone: "blocked",
      value: "not_ready"
    },
    {
      detail: "只做本地決策品質與內部工具，不排會、不授權。",
      label: "Active route",
      tone: "active",
      value: "Option A"
    },
    {
      detail: "公開頁仍不可宣稱真實模型或真實資料訊號。",
      label: "Public claim",
      tone: "blocked",
      value: "blocked"
    }
  ];

  const nextActions = [
    "優先推進可見的內部工具與狀態呈現",
    "只在碰到 Supabase / SQL / 真資料 / 公開宣稱時啟動重治理",
    "保持 scoreSource=mock 與 public-ineligible，直到正式授權"
  ];

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

      <section className="panel internal-status-panel">
        <div>
          <p className="eyebrow">CP3 Operating State</p>
          <h2>目前採低治理、高產出密度推進</h2>
          <p>
            Option A remains active for local-only product and review tooling. Full role review is reserved for new risk
            boundaries such as Supabase, SQL, real market data, authorization packets, or public claims.
          </p>
        </div>
        <div className="internal-status-grid">
          {cp3Status.map((item) => (
            <article className={`internal-status-card ${item.tone}`} key={item.label}>
              <span>{item.label}</span>
              <strong>{item.value}</strong>
              <p>{item.detail}</p>
            </article>
          ))}
        </div>
        <div className="internal-next-actions">
          <p className="panel-label">Next CEO Actions</p>
          <ul>
            {nextActions.map((action) => (
              <li key={action}>{action}</li>
            ))}
          </ul>
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
