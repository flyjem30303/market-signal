import type { ReactNode } from "react";

type EnglishCorePageProps = {
  children: ReactNode;
  eyebrow: string;
  primaryHref?: string;
  primaryLabel?: string;
  secondaryHref?: string;
  secondaryLabel?: string;
  summary: string;
  title: string;
};

export function EnglishCorePage({
  children,
  eyebrow,
  primaryHref = "/en/methodology",
  primaryLabel = "How it works",
  secondaryHref = "/en/disclaimer",
  secondaryLabel = "Risk disclosure",
  summary,
  title
}: EnglishCorePageProps) {
  return (
    <main className="page-shell">
      <section className="hero">
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <p>{summary}</p>
        <p className="runtime-boundary-line">
          Market Signal provides market observation and risk-reading support only. It is not investment advice.
        </p>
        <div className="hero-actions">
          <a className="button-primary" href={primaryHref}>
            {primaryLabel}
          </a>
          <a className="button-secondary" href={secondaryHref}>
            {secondaryLabel}
          </a>
        </div>
      </section>

      {children}

      <section className="panel legal-links">
        <h2>Phase 1 scope</h2>
        <p>
          Current production data focuses on Taiwan market observation. Global market pages are not public production data.
        </p>
      </section>
    </main>
  );
}
